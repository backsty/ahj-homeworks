import microphone from '../../assets/img/microphone.svg';
import send from '../../assets/img/send.svg';
import close from '../../assets/img/close.svg';

export default class AudioRecorder {
  constructor(container) {
    this.container = container;
    this.timeline = container?.closest('.timeline-input') || null;
    this.mediaRecorder = null;
    this.audioChunks = [];
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
    this.controls.className = 'audio-controls';
    this.createControls();
    this.initElements();
    this.registerEvents();
  }

  createControls() {
    this.controls.innerHTML = `
            <button class="mic-button">
                <img src="${microphone}" alt="Record">
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

  initElements() {
    this.micButton = this.controls.querySelector('.mic-button');
    this.recordingControls = this.controls.querySelector('.recording-controls');
    this.okButton = this.controls.querySelector('.ok-button');
    this.cancelButton = this.controls.querySelector('.cancel-button');
    this.timerDisplay = this.controls.querySelector('.timer');
  }

  async startRecording() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      this.mediaRecorder = new MediaRecorder(stream);
      this.audioChunks = [];

      this.mediaRecorder.ondataavailable = e => {
        this.audioChunks.push(e.data);
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
      console.error('Ошибка доступа к микрофону:', error);
    }
  }

  recordVolumes() {
    if (!this.isRecording) return;

    this.analyser.getByteFrequencyData(this.dataArray);
    const volume = Math.max(...Array.from(this.dataArray)) / 255;
    this.volumes.push(volume);

    requestAnimationFrame(() => this.recordVolumes());
  }

  showError(message) {
    console.error(message);
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
          const audioBlob = new Blob(this.audioChunks, { type: 'audio/webm' });
          if (this.onComplete) {
            this.onComplete(audioBlob);
          }
          resolve(audioBlob);
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

  showRecordingControls() {
    this.micButton.classList.add('hidden');
    this.recordingControls.classList.remove('hidden');
  }

  hideRecordingControls() {
    this.micButton.classList.remove('hidden');
    this.recordingControls.classList.add('hidden');
  }

  registerEvents() {
    this.micButton.addEventListener('click', () => this.startRecording());
    this.okButton.addEventListener('click', async () => {
      const audioBlob = await this.stopRecording();
      // if (audioBlob) {
      //     this.onComplete(audioBlob);
      // }
    });
    this.cancelButton.addEventListener('click', () => {
      this.stopRecording();
      this.audioChunks = [];
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

  // onRecordingComplete(blob) {
  //     if (typeof this.onComplete === 'function') {
  //         this.onComplete(blob);
  //     }
  // }

  disable() {
    this.controls.classList.add('disabled');
    this.controls.querySelector('.mic-button').disabled = true;
  }

  enable() {
    this.controls.classList.remove('disabled');
    this.controls.querySelector('.mic-button').disabled = false;
  }
}
