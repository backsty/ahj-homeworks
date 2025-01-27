import playArrow from '../../assets/img/play-arrow.svg';
import pause from '../../assets/img/pause.svg';

export default class Post {
  constructor(data) {
    this.type = data.type;
    this.content = data.content;
    this.coords = data.coords;
    this.timestamp = data.timestamp;
    this.volumes = data.volumes;
    this.duration = 0;
  }

  render() {
    const post = document.createElement('div');
    post.className = 'post';

    post.innerHTML = `
      <div class="post-content">
        ${this.renderContent()}
      </div>
      <div class="post-footer">
        <div class="post-coords">[${this.coords.lat}, ${this.coords.lng}]</div>
        <div class="post-time">${this.formatDate()}</div>
      </div>
    `;

    if (this.type === 'audio') {
      this.initAudioHandlers(post);
    } else if (this.type === 'video') {
      this.initVideoHandlers(post);
    }

    return post;
  }

  initAudioHandlers(post) {
    const audio = post.querySelector('audio');
    const playButton = post.querySelector('.play-button');
    const waveform = post.querySelector('.waveform');
    const duration = post.querySelector('.duration');

    if (!audio || !playButton || !waveform) return;

    playButton.addEventListener('click', () => this.togglePlay(audio, playButton));

    audio.addEventListener('timeupdate', () => {
      const bars = waveform.querySelectorAll('.waveform-bar');
      const activeBarCount = Math.floor((audio.currentTime / audio.duration) * bars.length);

      bars.forEach((bar, index) => {
        if (index < activeBarCount) {
          bar.classList.add('active');
        } else {
          bar.classList.remove('active');
        }
      });
    });

    audio.addEventListener('loadedmetadata', () => {
      this.setDuration(audio, duration);
    });
  }

  renderContent() {
    switch (this.type) {
      case 'text':
        return `<p>${this.content}</p>`;
      case 'audio':
        return `
            <div class="audio-post">
                <button class="play-button">
                    <img src="${playArrow}" alt="Play" class="play-icon">
                </button>
                <div class="audio-wrapper">
                    <div class="audio-progress">
                        <div class="progress-bar"></div>
                    </div>
                    <span class="duration">00:00</span>
                    <audio src="${this.content}" preload="metadata"></audio>
                </div>
            </div>
        `;
      case 'video':
        return `
          <div class="video-post">
            <div class="video-wrapper">
              ${
                this.content
                  ? `<video src="${this.content}" class="video-player" preload="metadata" controls></video>`
                  : `<div class="video-placeholder">
                  <span>Видео недоступно</span>
                </div>`
              }
            </div>
          </div>
        `;
      default:
        return '';
    }
  }

  initAudioHandlers(post) {
    const audio = post.querySelector('audio');
    const playButton = post.querySelector('.play-button');
    const progressBar = post.querySelector('.progress-bar');
    const duration = post.querySelector('.duration');

    if (!audio || !playButton || !progressBar) return;

    const initializeAudio = () => {
      duration.textContent = this.formatTime(audio.duration);
      progressBar.style.width = '0%';
      audio.removeEventListener('canplaythrough', initializeAudio);
    };

    audio.addEventListener('canplaythrough', initializeAudio);
    audio.addEventListener('loadedmetadata', initializeAudio);

    playButton.addEventListener('click', () => this.togglePlay(audio, playButton));

    audio.addEventListener('timeupdate', () => {
      const progress = (audio.currentTime / audio.duration) * 100;
      progressBar.style.width = `${progress}%`;
      duration.textContent = this.formatTime(audio.currentTime);
    });

    audio.load();
  }

  initVideoHandlers(post) {
    const video = post.querySelector('video');
    const wrapper = post.querySelector('.video-wrapper');

    if (!video) return;

    const setVideoDimensions = () => {
      const wrapperWidth = wrapper.offsetWidth;
      video.width = wrapperWidth;
      video.height = wrapperWidth * (9 / 16);
    };

    video.addEventListener('loadedmetadata', () => {
      setVideoDimensions();
    });

    window.addEventListener('resize', setVideoDimensions);

    video.load();
  }

  togglePlay(media, button) {
    const icon = button.querySelector('.play-icon');
    if (media.paused) {
      media.play();
      icon.src = pause;
    } else {
      media.pause();
      icon.src = playArrow;
    }
  }

  updateProgress(media, progressBar, durationElement) {
    const progress = (media.currentTime / media.duration) * 100;
    progressBar.style.width = `${progress}%`;
    durationElement.textContent = this.formatTime(media.currentTime);
  }

  setDuration(media, durationElement) {
    durationElement.textContent = this.formatTime(media.duration);
  }

  formatTime(time) {
    if (!time || isNaN(time) || !isFinite(time)) return '00:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }

  formatDate() {
    return new Date(this.timestamp).toLocaleString();
  }
}
