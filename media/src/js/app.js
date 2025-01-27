import Timeline from './components/Timeline.js';
import Post from './components/Post.js';
import LocationModal from './components/LocationModal.js';

export default class App {
  constructor() {
    this.container = document.querySelector('#timeline');
    this.init();
  }

  init() {
    this.timeline = new Timeline(this.container);
    const savedCoords = localStorage.getItem('savedCoords');
    if (savedCoords) {
      this.timeline.savedCoords = JSON.parse(savedCoords);
    }
    this.loadInitialPosts();
  }

  async handleNewPost(content) {
    try {
      const coords = await this.getLocation();
      this.createPost(content, coords);
    } catch (error) {
      this.showLocationModal(content);
    }
  }

  getLocation() {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Геолокация не поддерживается'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        position => {
          resolve({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        error => reject(error),
      );
    });
  }

  showLocationModal(content) {
    const modal = new LocationModal(coords => {
      this.createPost(content, coords);
    });
    modal.show();
  }

  createPost(content, coords) {
    const post = new Post({
      type: 'text',
      content,
      coords,
      timestamp: new Date(),
    });
    this.timeline.addPost(post);
  }

  loadInitialPosts() {
    const initialPosts = [
      {
        type: 'text',
        content: 'Пример текстового поста',
        coords: { lat: 51.50851, lng: -0.12572 },
        timestamp: new Date(),
      },
      // {
      //   type: 'audio',
      //   content: '../assets/audio/audio-sample.mp3',
      //   coords: { lat: 55.7558, lng: 37.6173 },
      //   timestamp: new Date(Date.now() - 1000 * 60),
      // },
      // {
      //   type: 'video',
      //   content: '../assets/video/video-sample.mp4',
      //   coords: { lat: 48.8566, lng: 2.3522 },
      //   timestamp: new Date(Date.now() - 1000 * 60 * 2),
      // },
    ];

    initialPosts.forEach(postData => {
      const post = new Post(postData);
      this.timeline.addPost(post);
    });
  }
}

// Инициализация приложения
document.addEventListener('DOMContentLoaded', () => {
  new App();
});
