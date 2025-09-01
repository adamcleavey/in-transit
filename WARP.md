# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.
``

# in-transit: Warp guide

Repository type: static web app (HTML/CSS/JS) with a small Python unittest suite for asset integrity.

## Common commands

- Serve the app locally (required so fetch() can load YAML):
  - python -m http.server 8000
  - Then open http://localhost:8000 in a browser.

- Run all tests (from repo root):
  - python -m unittest

- Run tests verbosely:
  - python -m unittest -v

- Run a single test module/class/method:
  - python -m unittest tests.test_assets
  - python -m unittest tests.test_assets.TestAssetsExist
  - python -m unittest tests.test_assets.TestAssetsExist.test_assets_referenced_in_index_exist

Notes:
- There is no build step and no configured linter in this repository.
- The frontend imports js-yaml via an ESM CDN; an Internet connection is required when loading the page.

## High-level architecture

- Entry point: index.html
  - Includes styles/styles.css and a module script scripts/scripts.js.
  - Statically defines an "intro" cell; all other city cells are generated dynamically by JS.

- Data-driven UI (assets/cities.yaml)
  - YAML entries define: id, titleImg (image path), alt (label), audio (audio path), bg (background color).
  - The JS module fetches this YAML at runtime and uses it to render one clickable cell per city.

- Client logic (scripts/scripts.js)
  - Imports js-yaml as an ESM module from https://cdn.jsdelivr.net.
  - buildCells(): fetches and parses assets/cities.yaml, creates .cell elements with image, audio tag, and a .progress overlay.
  - AudioPlayer class: manages single-audio playback, toggling play/pause on repeated clicks, and updates the width of the .progress bar according to playback time.
  - init(): awaits cell construction, installs click listeners on each cell, and exposes the player on window for debugging.

- Styling (styles/styles.css)
  - Defines responsive layout for .cell blocks and a progress overlay (.progress with .paused animation state).

- Tests (tests/test_assets.py)
  - Python unittest that parses index.html to collect img/audio src attributes and also scans assets/cities.yaml for referenced files.
  - Fails if any referenced asset file is missing; this acts as a sanity check when adding/changing assets or YAML entries.

## Typical development flow

1) Edit assets/cities.yaml (and add corresponding files under assets/titles and assets/sounds).
2) Serve locally with python -m http.server and validate interactions in the browser.
3) Run python -m unittest to ensure all referenced assets exist.

## Repository layout (big pieces only)

- index.html — static entry; links CSS/JS and contains the intro cell.
- styles/ — CSS for layout and progress overlay.
- scripts/ — JS module that loads YAML and builds the interactive grid + audio behavior.
- assets/ — images (titles/), audio (sounds/), and cities.yaml (data source).
- tests/ — Python unittest for asset integrity.

