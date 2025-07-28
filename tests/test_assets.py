import unittest
from pathlib import Path
from html.parser import HTMLParser

class SrcCollector(HTMLParser):
    def __init__(self):
        super().__init__()
        self.sources = []

    def handle_starttag(self, tag, attrs):
        if tag in {"img", "audio"}:
            attrs_dict = dict(attrs)
            src = attrs_dict.get("src")
            if src:
                self.sources.append(src)

class TestAssetsExist(unittest.TestCase):
    def test_assets_referenced_in_index_exist(self):
        project_root = Path(__file__).resolve().parents[1]
        index_path = project_root / "index.html"
        html = index_path.read_text(encoding="utf-8")
        parser = SrcCollector()
        parser.feed(html)
        missing = [src for src in parser.sources if not (project_root / src).exists()]
        self.assertEqual(missing, [], f"Missing asset files: {missing}")

if __name__ == "__main__":
    unittest.main()

