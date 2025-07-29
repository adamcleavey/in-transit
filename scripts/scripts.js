// Modern JavaScript audio player without jQuery

class AudioPlayer {
    constructor() {
        this.playing = false;
        this.currentlyPlaying = null;
        this.progressIndicator = null;
    }

    play(element) {
        const name = element.id;
        this.pause();

        if (this.currentlyPlaying && this.currentlyPlaying.id === `${name}-audio`) {
            element.classList.remove('active');
            this.playing = false;
            this.currentlyPlaying = null;
            return;
        }

        this.currentlyPlaying = element.querySelector('audio');
        this.currentlyPlaying.play();

        const progress = element.querySelector('.progress');
        progress.style.display = 'block';

        this.currentlyPlaying.addEventListener('timeupdate', () => {
            const percent = (this.currentlyPlaying.currentTime / this.currentlyPlaying.duration) * 100;
            progress.style.width = `${percent}%`;
        });
        this.progressIndicator = progress;
        this.playing = true;
    }

    pause() {
        if (this.playing && this.currentlyPlaying) {
            document.querySelectorAll('.cell.active').forEach(el => el.classList.remove('active'));
            this.currentlyPlaying.pause();
            this.playing = false;
        }
    }
}

const audioPlayer = new AudioPlayer();

document.querySelectorAll('.cell').forEach(cell => {
    cell.addEventListener('click', () => {
        document.querySelectorAll('.progress').forEach(p => p.style.display = 'none');
        audioPlayer.play(cell);
    });
});

window.audioPlayer = audioPlayer;