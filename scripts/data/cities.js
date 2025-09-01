import yaml from 'https://cdn.jsdelivr.net/npm/js-yaml/+esm';

export async function loadCities(url = 'assets/cities.yaml') {
  const text = await fetch(url).then(r => r.text());
  return yaml.load(text);
}
