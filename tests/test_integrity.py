import re
import unittest
from html.parser import HTMLParser
from pathlib import Path

class AssetCollector(HTMLParser):
    def __init__(self):
        super().__init__()
        self.assets = []

    def handle_starttag(self, tag, attrs):
        attrs_dict = dict(attrs)
        if tag == 'link':
            href = attrs_dict.get('href')
            if href:
                self.assets.append(href)
        elif tag == 'script':
            src = attrs_dict.get('src')
            if src:
                self.assets.append(src)

class TestIndexReferences(unittest.TestCase):
    def test_link_and_script_assets_exist(self):
        root = Path(__file__).resolve().parents[1]
        html = (root / 'index.html').read_text(encoding='utf-8')
        parser = AssetCollector()
        parser.feed(html)
        missing = []
        for asset in parser.assets:
            if asset.startswith('http://') or asset.startswith('https://'):
                continue
            path = root / asset.lstrip('/')
            if not path.exists():
                missing.append(asset)
        self.assertEqual(missing, [], f"Missing linked/script files: {missing}")

class TestServiceWorkerAssets(unittest.TestCase):
    def test_core_assets_exist(self):
        root = Path(__file__).resolve().parents[1]
        lines = (root / 'service-worker.js').read_text(encoding='utf-8').splitlines()
        assets = []
        collecting = False
        for line in lines:
            stripped = line.strip()
            if stripped.startswith('const CORE_ASSETS'):
                collecting = True
                continue
            if collecting:
                if stripped.startswith('];'):
                    break
                if stripped.startswith("'") or stripped.startswith('"'):
                    asset = stripped.strip(',').strip("'\"")
                    assets.append(asset)
        missing = []
        for asset in assets:
            if asset.startswith('http') or asset == '/':
                continue
            path = root / asset.lstrip('/')
            if not path.exists():
                missing.append(asset)
        self.assertEqual(missing, [], f"Missing service worker assets: {missing}")

class TestCitiesYaml(unittest.TestCase):
    def test_cities_yaml_structure(self):
        root = Path(__file__).resolve().parents[1]
        lines = (root / 'assets' / 'cities.yaml').read_text(encoding='utf-8').splitlines()
        entries = []
        current = None
        seen_ids = set()
        for line in lines + ['- id: sentinel']:
            stripped = line.strip()
            if stripped.startswith('- id:'):
                if current:
                    entries.append(current)
                city_id = stripped.split(':', 1)[1].strip()
                self.assertNotIn(city_id, seen_ids, f"Duplicate id {city_id}")
                seen_ids.add(city_id)
                current = {'id': city_id}
            elif ':' in stripped and current is not None:
                key, val = stripped.split(':', 1)
                current[key.strip()] = val.strip().strip("'\"")
        required = {'titleImg', 'alt', 'audio', 'bg'}
        for entry in entries:
            missing_keys = required - entry.keys()
            self.assertFalse(missing_keys, f"Missing keys {missing_keys} for {entry['id']}")
            self.assertRegex(entry['bg'], r'^#[0-9A-Fa-f]{6}$', f"Invalid bg color for {entry['id']}")

if __name__ == '__main__':
    unittest.main()
