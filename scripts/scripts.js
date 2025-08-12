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

document.querySelectorAll('.cell').forEach(cell => {
    cell.addEventListener('click', () => {
        audioPlayer.play(cell);
    });
});

window.audioPlayer = audioPlayer;