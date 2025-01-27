import Post from './Post.js';
import LocationModal from './LocationModal.js';
import AudioRecorder from './AudioRecorder.js';
import VideoRecorder from './VideoRecorder.js';
import send from '../../assets/img/send.svg';

export default class Timeline {
  constructor(container) {
    this.container = container;
    this.posts = [];
    this.savedCoords = null;
    this.init();
  }

  init() {
    this.bindToDOM();
    this.registerEvents();
  }

  registerEvents() {
    this.input.addEventListener('keypress', async e => {
      if (e.key === 'Enter' && e.target.value.trim()) {
        await this.createPost(e.target.value);
        e.target.value = '';
      }
    });

    this.sendButton.addEventListener('click', async () => {
      if (this.input.value.trim()) {
        await this.createPost(this.input.value);
        this.input.value = '';
      }
    });
  }

  bindToDOM() {
    this.container.innerHTML = `
      <div class="timeline">
        <div class="timeline-posts"></div>
        <div class="timeline-input">
          <div class="input-container">
            <input type="text" placeholder="Введите текст...">
            <button class="send-button">
              <img src="${send}" alt="Send" class="send-icon">
            </button>
          </div>
          <div class="media-controls"></div>
        </div>
      </div>
    `;

    // Инициализация элементов
    this.postsContainer = this.container.querySelector('.timeline-posts');
    this.input = this.container.querySelector('input');
    this.sendButton = this.container.querySelector('.send-button');
    this.mediaControls = this.container.querySelector('.media-controls');

    const audioContainer = this.container.querySelector('.audio-controls');
    const videoContainer = this.container.querySelector('.video-controls');

    // Инициализация рекордеров
    this.audioRecorder = new AudioRecorder(audioContainer);
    this.videoRecorder = new VideoRecorder(videoContainer);

    this.isRecording = false;

    this.audioRecorder.onComplete = blob => {
      const url = URL.createObjectURL(blob);
      this.createPost(url, 'audio');
    };

    this.videoRecorder.onComplete = blob => {
      const url = URL.createObjectURL(blob);
      this.createPost(url, 'video');
    };

    this.mediaControls.appendChild(this.audioRecorder.controls);
    this.mediaControls.appendChild(this.videoRecorder.controls);

    // Обработчики для аудио
    this.audioRecorder.onStart = () => {
      if (!this.isRecording) {
        this.isRecording = true;
        this.videoRecorder.disable();
      }
    };

    this.audioRecorder.onStop = () => {
      this.isRecording = false;
      this.videoRecorder.enable();
    };

    // Обработчики для видео
    this.videoRecorder.onStart = () => {
      if (!this.isRecording) {
        this.isRecording = true;
        this.audioRecorder.disable();
      }
    };

    this.videoRecorder.onStop = () => {
      this.isRecording = false;
      this.audioRecorder.enable();
    };

    // Обработчики для кнопки отправки
    this.sendButton.addEventListener('click', () => {
      if (this.input.value.trim()) {
        this.createPost(this.input.value, 'text');
        this.input.value = '';
      }
    });
  }

  async createPost(content, type = 'text', volumes = null) {
    try {
      let position = this.savedCoords;
      if (!position) {
        try {
          position = await this.getCurrentPosition();
          this.savedCoords = position;
        } catch (error) {
          if (!document.querySelector('.modal')) {
            this.showLocationModal();
          }
          return;
        }
      }

      const post = {
        type,
        content,
        coords: position,
        timestamp: new Date(),
      };

      this.addPost(post);
    } catch (error) {
      console.error(error);
    }
  }

  showLocationModal() {
    const modal = new LocationModal(coords => {
      this.savedCoords = coords;
      localStorage.setItem('savedCoords', JSON.stringify(coords));
      this.createPost(this.input.value, coords);
    });
    modal.show();
  }

  getCurrentPosition() {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        this.showLocationModal();
        reject(new Error('Геолокация недоступна'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        position => {
          resolve({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        error => {
          reject(new Error('Не удалось получить координаты'));
        },
      );
    });
  }

  addPost(postData) {
    const post = new Post(postData);
    this.posts.unshift(post);
    this.renderPosts();
  }

  renderPosts() {
    this.postsContainer.innerHTML = '';
    this.posts.forEach(post => {
      this.postsContainer.appendChild(post.render());
    });
  }

  destroy() {
    if (this.audioRecorder) {
      this.audioRecorder.cleanup();
    }
    if (this.videoRecorder) {
      this.videoRecorder.cleanup();
    }
  }
}
