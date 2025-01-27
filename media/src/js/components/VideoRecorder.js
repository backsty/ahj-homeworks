import video from '../../assets/img/videocam.svg';
import send from '../../assets/img/send.svg';
import close from '../../assets/img/close.svg';

export default class VideoRecorder {
  constructor(container) {
    this.container = container;
    this.timeline = container?.closest('.timeline-input') || null;
    this.mediaRecorder = null;
    this.videoChunks = [];
    this.isRecording = false;
    this.timer = 0;
    this.timerInterval = null;
    this.onComplete = null;
    this.onStart = null;
    this.onStop = null;
    this.init();
  }

  init() {
    this.controls = document.createElement('div');
    this.controls.className = 'video-controls';
    this.createControls();
    this.initElements();
    this.registerEvents();
  }

  createControls() {
    this.controls.innerHTML = `
            <button class="video-button">
                <img src="${video}" alt="Record Video">
            </button>
            <div class="recording-controls hidden">
                <button class="ok-button">
                    <img src="${send}" alt="Send">
                </button>
                <span class="timer">00:00</span>
                <button class="cancel-button">
                    <img src="${close}" alt="Cancel">
                </button>
            </div>
        `;
  }

  async startRecording() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: true,
      });
      this.mediaRecorder = new MediaRecorder(stream);
      this.videoChunks = [];

      this.mediaRecorder.ondataavailable = e => {
        this.videoChunks.push(e.data);
      };

      this.mediaRecorder.start();
      this.isRecording = true;
      this.showRecordingControls();
      this.startTimer();
      if (this.timeline) {
        this.timeline.classList.add('recording');
      }

      if (this.onStart) this.onStart();
    } catch (error) {
      console.error('Ошибка доступа к камере:', error);
    }
  }

  stopRecording() {
    if (this.mediaRecorder && this.isRecording) {
      this.mediaRecorder.stop();
      this.isRecording = false;
      this.stopTimer();
      this.hideRecordingControls();
      if (this.timeline) {
        this.timeline.classList.remove('recording');
      }

      if (this.onStop) this.onStop();

      return new Promise(resolve => {
        this.mediaRecorder.onstop = () => {
          const videoBlob = new Blob(this.videoChunks, { type: 'video/webm' });
          resolve(videoBlob);
        };
      });
    }
  }

  startTimer() {
    this.timer = 0;
    this.timerInterval = setInterval(() => {
      this.timer++;
      this.updateTimerDisplay();
    }, 1000);
  }

  stopTimer() {
    clearInterval(this.timerInterval);
  }

  updateTimerDisplay() {
    const minutes = Math.floor(this.timer / 60);
    const seconds = this.timer % 60;
    this.timerDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }

  initElements() {
    this.videoButton = this.controls.querySelector('.video-button');
    this.recordingControls = this.controls.querySelector('.recording-controls');
    this.okButton = this.controls.querySelector('.ok-button');
    this.cancelButton = this.controls.querySelector('.cancel-button');
    this.timerDisplay = this.controls.querySelector('.timer');
  }

  showRecordingControls() {
    this.videoButton.classList.add('hidden');
    this.recordingControls.classList.remove('hidden');
  }

  hideRecordingControls() {
    this.videoButton.classList.remove('hidden');
    this.recordingControls.classList.add('hidden');
  }

  registerEvents() {
    this.videoButton.addEventListener('click', () => this.startRecording());
    this.okButton.addEventListener('click', async () => {
      const videoBlob = await this.stopRecording();
      if (videoBlob) {
        this.onComplete(videoBlob);
      }
    });
    this.cancelButton.addEventListener('click', () => {
      this.stopRecording();
      this.videoChunks = [];
    });
  }

  cleanup() {
    if (this.mediaRecorder && this.mediaRecorder.stream) {
      this.mediaRecorder.stream.getTracks().forEach(track => track.stop());
    }
    this.stopTimer();
    if (this.controls && this.controls.parentNode) {
      this.controls.parentNode.removeChild(this.controls);
    }
  }

  disable() {
    this.controls.classList.add('disabled');
    this.controls.querySelector('.video-button').disabled = true;
  }

  enable() {
    this.controls.classList.remove('disabled');
    this.controls.querySelector('.video-button').disabled = false;
  }
}
