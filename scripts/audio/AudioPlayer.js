// Modern JavaScript audio player without jQuery
export default class AudioPlayer {
  constructor() {
    this.playing = false;
    this.currentlyPlaying = null;
    this.progressIndicator = null;
    this._onTimeUpdate = null;
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

    // Detach old listener if any
    if (this.currentlyPlaying && this._onTimeUpdate) {
      this.currentlyPlaying.removeEventListener('timeupdate', this._onTimeUpdate);
      this._onTimeUpdate = null;
    }

    this.currentlyPlaying = audio;
    this.progressIndicator = progress;
    this.currentlyPlaying.currentTime = 0;
    this.currentlyPlaying.play();
    this.playing = true;

    this._onTimeUpdate = () => {
      const duration = this.currentlyPlaying.duration || 0;
      const percent = duration ? (this.currentlyPlaying.currentTime / duration) * 100 : 0;
      this.progressIndicator.style.width = `${percent}%`;
    };
    this.currentlyPlaying.addEventListener('timeupdate', this._onTimeUpdate);
  }

  pause(showPaused = false) {
    if (this.currentlyPlaying) {
      this.currentlyPlaying.pause();
      this.playing = false;
      if (showPaused) {
        this.progressIndicator?.classList.add('paused');
      } else {
        this.progressIndicator?.classList.remove('paused');
        if (this.progressIndicator) this.progressIndicator.style.width = '0%';
        if (this._onTimeUpdate) {
          this.currentlyPlaying.removeEventListener('timeupdate', this._onTimeUpdate);
          this._onTimeUpdate = null;
        }
        this.currentlyPlaying = null;
        this.progressIndicator = null;
      }
    }
  }

  toggle() {
    const a = this.currentlyPlaying;
    if (!a) return;

    // If track ended, restart from the beginning
    if (a.ended || a.currentTime >= (a.duration || 0)) {
      a.currentTime = 0;
    }

    if (this.playing) {
      this.pause(true); // keep progress and show paused state
    } else {
      a.play();
      this.playing = true;
      this.progressIndicator?.classList.remove('paused');
    }
  }

}
