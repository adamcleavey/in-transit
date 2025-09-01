import { loadCities } from './data/cities.js';
import { buildCells } from './ui/cells.js';
import AudioPlayer from './audio/AudioPlayer.js';

async function init() {
  const cities = await loadCities();
  buildCells(cities);

  const audioPlayer = new AudioPlayer();
  const container = document.querySelector('#container');

  // Event delegation avoids adding N listeners
  container.addEventListener('click', (e) => {
    const cell = e.target.closest('.cell');
    if (!cell || !container.contains(cell)) return;
    audioPlayer.play(cell);
  });

  window.addEventListener('keydown', (e) => {
    // Respect text inputs/editor focus
    const el = document.activeElement;
    const tag = el?.tagName?.toLowerCase();
    const isTyping = el?.isContentEditable || tag === 'input' || tag === 'textarea' || tag === 'select';
    if (isTyping) return;

    // Handle spacebar
    if (e.code === 'Space' || e.key === ' ' || e.key === 'Spacebar') {
      // Only prevent scroll if we actually have something to toggle
      if (audioPlayer.currentlyPlaying) e.preventDefault();
      audioPlayer.toggle();
    }
  });

  // Optional: expose for debugging
  window.audioPlayer = audioPlayer;
}

init();
