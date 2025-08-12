import yaml from 'https://cdn.jsdelivr.net/npm/js-yaml/+esm';

// Modern JavaScript audio player without jQuery

class AudioPlayer {
    constructor() {
        this.playing = false;
        this.currentlyPlaying = null;
        this.progressIndicator = null;
    }

    play(element) {
        const audio = element.querySelector('audio');
        const progress = element.querySelector('.progress');

        // Toggle pause/play if clicking the same element
        if (this.currentlyPlaying === audio) {
            if (this.playing) {
                this.pause(true);
            } else {
                this.currentlyPlaying.play();
                this.playing = true;
                this.progressIndicator.classList.remove('paused');
            }
            return;
        }

        // New element clicked, reset all progress bars and stop current audio
        this.pause();
        document.querySelectorAll('.progress').forEach(p => {
            p.classList.remove('paused');
            p.style.width = '0%';
        });

        this.currentlyPlaying = audio;
        this.progressIndicator = progress;
        this.currentlyPlaying.currentTime = 0;
        this.currentlyPlaying.play();
        this.playing = true;

        this.currentlyPlaying.addEventListener('timeupdate', () => {
            const percent = (this.currentlyPlaying.currentTime / this.currentlyPlaying.duration) * 100;
            this.progressIndicator.style.width = `${percent}%`;
        });
    }

    pause(showPaused = false) {
        if (this.currentlyPlaying) {
            this.currentlyPlaying.pause();
            this.playing = false;
            if (showPaused) {
                this.progressIndicator.classList.add('paused');
            } else {
                this.progressIndicator && this.progressIndicator.classList.remove('paused');
                this.progressIndicator && (this.progressIndicator.style.width = '0%');
                this.currentlyPlaying = null;
                this.progressIndicator = null;
            }
        }
    }
}

const audioPlayer = new AudioPlayer();

async function buildCells() {
    const text = await fetch('assets/cities.yaml').then(r => r.text());
    const cities = yaml.load(text);
    const container = document.querySelector('#container');

    for (const city of cities) {
        const cell = document.createElement('div');
        cell.className = 'cell';
        cell.id = city.id;
        cell.style.backgroundColor = city.bg;

        cell.innerHTML = `
      <img src="${city.titleImg}" alt="${city.alt}">
      <audio preload="auto" src="${city.audio}" id="${city.id}-audio"></audio>
      <div class="progress"></div>
    `;

        container.appendChild(cell);
    }
}

async function init() {
    await buildCells();
    document.querySelectorAll('.cell').forEach(cell => {
        cell.addEventListener('click', () => audioPlayer.play(cell));
    });
    window.audioPlayer = audioPlayer;
}

init();
