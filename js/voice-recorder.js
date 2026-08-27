/**
 * ====================================================================
 * 🎙️ ROMANTİK SES KAYDEDİCİ & OYNATICI MOTORU (js/voice-recorder.js)
 * ====================================================================
 */

class VoiceRecorderManager {
    constructor() {
        this.mediaRecorder = null;
        this.audioChunks = [];
        this.recordedAudioBase64 = null;
        this.recordingTimer = null;
        this.recordingSeconds = 0;
        this.modalAudio = null;
        this.isPlayingModalAudio = false;

        this.initDOM();
    }

    initDOM() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.bindEvents());
        } else {
            this.bindEvents();
        }
    }

    bindEvents() {
        // Kaydı Başlat Butonu
        const startBtn = document.getElementById('start-voice-record-btn');
        if (startBtn) {
            startBtn.addEventListener('click', () => this.startRecording());
        }

        // Kaydı Durdur Butonu
        const stopBtn = document.getElementById('stop-voice-record-btn');
        if (stopBtn) {
            stopBtn.addEventListener('click', () => this.stopRecording());
        }

        // Kaydı Sil / Yeniden Başlat
        const deleteBtn = document.getElementById('delete-voice-record-btn');
        if (deleteBtn) {
            deleteBtn.addEventListener('click', () => this.resetRecorderUI());
        }

        // Önizleme Oynatıcı Butonu
        const previewPlayBtn = document.getElementById('preview-audio-play-btn');
        if (previewPlayBtn) {
            previewPlayBtn.addEventListener('click', () => this.togglePreviewAudio());
        }

        // Modal İçi Ses Çalar Oynat/Durdur Butonu
        const modalPlayBtn = document.getElementById('modal-voice-play-btn');
        if (modalPlayBtn) {
            modalPlayBtn.addEventListener('click', () => this.toggleModalAudio());
        }
    }

    /* 🎙️ Ses Kaydını Başlat */
    async startRecording() {
        try {
            if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
                alert("Tarayıcınız ses kaydını desteklemiyor veya izin verilmedi.");
                return;
            }

            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            
            let mimeType = 'audio/webm';
            if (window.MediaRecorder) {
                if (MediaRecorder.isTypeSupported('audio/webm;codecs=opus')) {
                    mimeType = 'audio/webm;codecs=opus';
                } else if (MediaRecorder.isTypeSupported('audio/mp4')) {
                    mimeType = 'audio/mp4';
                } else if (MediaRecorder.isTypeSupported('audio/ogg')) {
                    mimeType = 'audio/ogg';
                }
            }

            this.mediaRecorder = new MediaRecorder(stream, { mimeType });
            this.audioChunks = [];

            this.mediaRecorder.ondataavailable = (event) => {
                if (event.data && event.data.size > 0) {
                    this.audioChunks.push(event.data);
                }
            };

            this.mediaRecorder.onstop = async () => {
                const audioBlob = new Blob(this.audioChunks, { type: mimeType });
                this.recordedAudioBase64 = await this.blobToBase64(audioBlob);
                
                // Mikrofonu kapat
                stream.getTracks().forEach(track => track.stop());

                this.showRecordedPreview();
            };

            this.mediaRecorder.start();
            this.showRecordingState();

        } catch (err) {
            console.error("Mikrofon erişim hatası:", err);
            alert("Mikrofon izni alınamadı. Lütfen tarayıcı ayarlarından mikrofona izin verin sevgilim.");
        }
    }

    /* ⏹️ Ses Kaydını Durdur */
    stopRecording() {
        if (this.mediaRecorder && this.mediaRecorder.state !== 'inactive') {
            this.mediaRecorder.stop();
            clearInterval(this.recordingTimer);
        }
    }

    /* 🔄 Blob'u Base64 Data URI'ye Çevir */
    blobToBase64(blob) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(blob);
        });
    }

    /* ⏱️ Kayıt Sayacını Başlat */
    showRecordingState() {
        document.getElementById('voice-record-idle')?.classList.add('hidden');
        document.getElementById('voice-record-preview')?.classList.add('hidden');
        document.getElementById('voice-record-active')?.classList.remove('hidden');

        this.recordingSeconds = 0;
        const timerEl = document.getElementById('voice-record-timer');
        if (timerEl) timerEl.innerText = "00:00";

        this.recordingTimer = setInterval(() => {
            this.recordingSeconds++;
            const mins = String(Math.floor(this.recordingSeconds / 60)).padStart(2, '0');
            const secs = String(this.recordingSeconds % 60).padStart(2, '0');
            if (timerEl) timerEl.innerText = `${mins}:${secs}`;

            if (this.recordingSeconds >= 180) {
                this.stopRecording();
            }
        }, 1000);
    }

    /* 🎧 Kaydedilen Sesi Önizleme Modunda Göster */
    showRecordedPreview() {
        document.getElementById('voice-record-active')?.classList.add('hidden');
        document.getElementById('voice-record-idle')?.classList.add('hidden');
        document.getElementById('voice-record-preview')?.classList.remove('hidden');

        const previewAudioEl = document.getElementById('form-preview-audio');
        if (previewAudioEl && this.recordedAudioBase64) {
            previewAudioEl.src = this.recordedAudioBase64;
        }
        if (window.lucide) lucide.createIcons();
    }

    /* 🗑️ Kayıt Arayüzünü Sıfırla */
    resetRecorderUI() {
        clearInterval(this.recordingTimer);
        this.recordedAudioBase64 = null;
        this.audioChunks = [];

        document.getElementById('voice-record-active')?.classList.add('hidden');
        document.getElementById('voice-record-preview')?.classList.add('hidden');
        document.getElementById('voice-record-idle')?.classList.remove('hidden');

        const previewAudioEl = document.getElementById('form-preview-audio');
        if (previewAudioEl) previewAudioEl.src = "";
    }

    setExistingAudio(audioBase64) {
        if (audioBase64 && audioBase64.trim() !== '') {
            this.recordedAudioBase64 = audioBase64;
            this.showRecordedPreview();
        } else {
            this.resetRecorderUI();
        }
    }

    /* 🎵 Önizleme Sesini Çal/Durdur */
    togglePreviewAudio() {
        const previewAudioEl = document.getElementById('form-preview-audio');
        const playBtn = document.getElementById('preview-audio-play-btn');
        if (!previewAudioEl) return;

        if (previewAudioEl.paused) {
            previewAudioEl.play();
            if (playBtn) playBtn.innerHTML = `<i data-lucide="pause" class="w-4 h-4"></i>`;
        } else {
            previewAudioEl.pause();
            if (playBtn) playBtn.innerHTML = `<i data-lucide="play" class="w-4 h-4"></i>`;
        }
        if (window.lucide) lucide.createIcons();

        previewAudioEl.onended = () => {
            if (playBtn) playBtn.innerHTML = `<i data-lucide="play" class="w-4 h-4"></i>`;
            if (window.lucide) lucide.createIcons();
        };
    }

    /* ====================================================================
     * 📖 KAPSÜL İÇERİK MODALINDA SES OYNATICI (Modal Audio Player)
     * ==================================================================== */

    setupModalVoicePlayer(audioSrc, authorName) {
        this.stopModalAudio();
        const container = document.getElementById('modal-voice-container');
        const authorEl = document.getElementById('modal-voice-author');
        const wavesContainer = document.getElementById('modal-voice-waves');

        if (!audioSrc || audioSrc.trim() === '') {
            if (container) container.classList.add('hidden');
            return;
        }

        if (container) container.classList.remove('hidden');
        if (authorEl) authorEl.innerText = `${authorName || 'Sevgilin'}'in Sesli Mesajı 🎙️`;

        this.modalAudio = new Audio(audioSrc);
        this.isPlayingModalAudio = false;

        const timeCurrentEl = document.getElementById('modal-voice-current-time');
        const timeDurationEl = document.getElementById('modal-voice-duration');
        const progressBar = document.getElementById('modal-voice-progress');
        const playBtn = document.getElementById('modal-voice-play-btn');

        if (timeCurrentEl) timeCurrentEl.innerText = "00:00";
        if (timeDurationEl) timeDurationEl.innerText = "--:--";
        if (progressBar) progressBar.style.width = "0%";
        if (playBtn) playBtn.innerHTML = `<i data-lucide="play" class="w-5 h-5 ml-0.5"></i>`;
        if (wavesContainer) wavesContainer.classList.add('waves-paused');

        this.modalAudio.onloadedmetadata = () => {
            const dur = Math.floor(this.modalAudio.duration);
            if (!isNaN(dur) && isFinite(dur)) {
                const mins = String(Math.floor(dur / 60)).padStart(2, '0');
                const secs = String(dur % 60).padStart(2, '0');
                if (timeDurationEl) timeDurationEl.innerText = `${mins}:${secs}`;
            }
        };

        this.modalAudio.ontimeupdate = () => {
            if (!this.modalAudio || isNaN(this.modalAudio.duration)) return;
            const cur = Math.floor(this.modalAudio.currentTime);
            const mins = String(Math.floor(cur / 60)).padStart(2, '0');
            const secs = String(cur % 60).padStart(2, '0');
            if (timeCurrentEl) timeCurrentEl.innerText = `${mins}:${secs}`;

            const percent = (this.modalAudio.currentTime / this.modalAudio.duration) * 100;
            if (progressBar) progressBar.style.width = `${percent}%`;
        };

        this.modalAudio.onended = () => {
            this.isPlayingModalAudio = false;
            if (playBtn) playBtn.innerHTML = `<i data-lucide="play" class="w-5 h-5 ml-0.5"></i>`;
            if (wavesContainer) wavesContainer.classList.add('waves-paused');
            if (progressBar) progressBar.style.width = "0%";
            if (window.lucide) lucide.createIcons();
        };

        if (window.lucide) lucide.createIcons();
    }

    toggleModalAudio() {
        if (!this.modalAudio) return;
        const playBtn = document.getElementById('modal-voice-play-btn');
        const wavesContainer = document.getElementById('modal-voice-waves');

        if (this.modalAudio.paused) {
            this.modalAudio.play();
            this.isPlayingModalAudio = true;
            if (playBtn) playBtn.innerHTML = `<i data-lucide="pause" class="w-5 h-5"></i>`;
            if (wavesContainer) wavesContainer.classList.remove('waves-paused');
        } else {
            this.modalAudio.pause();
            this.isPlayingModalAudio = false;
            if (playBtn) playBtn.innerHTML = `<i data-lucide="play" class="w-5 h-5 ml-0.5"></i>`;
            if (wavesContainer) wavesContainer.classList.add('waves-paused');
        }

        if (window.lucide) lucide.createIcons();
    }

    stopModalAudio() {
        if (this.modalAudio) {
            this.modalAudio.pause();
            this.modalAudio = null;
        }
        this.isPlayingModalAudio = false;
    }
}

window.voiceRecorder = new VoiceRecorderManager();
