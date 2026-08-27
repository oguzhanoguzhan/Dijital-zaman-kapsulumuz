/**
 * ====================================================================
 * 🎵 ROMANTİK MÜZİK & SES MOTORU (js/audio.js) 🎵
 * ====================================================================
 * Web Audio API ile dahili romantik lo-fi piyano arpejleri & ses efektleri
 */

class RomanticAudioManager {
    constructor() {
        this.audioCtx = null;
        this.isPlaying = false;
        this.customAudio = null;
        this.synthTimer = null;
        this.currentChordIndex = 0;

        // Romantik C Majör / A Minör pentatonik akor dizilimi (Hz)
        // Cmaj7 -> Am7 -> Fmaj7 -> Gsus4
        this.chords = [
            [261.63, 329.63, 392.00, 493.88], // C E G B (Cmaj7)
            [220.00, 261.63, 329.63, 392.00], // A C E G (Am7)
            [174.61, 261.63, 329.63, 349.23], // F C E F (Fmaj7)
            [196.00, 246.94, 293.66, 392.00]  // G B D G (G)
        ];
    }

    ensureAudioContext() {
        if (!this.audioCtx) {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            this.audioCtx = new AudioContext();
        }
        if (this.audioCtx.state === 'suspended') {
            this.audioCtx.resume();
        }
    }

    toggleMusic() {
        if (this.isPlaying) {
            this.pauseMusic();
        } else {
            this.playMusic();
        }
        return this.isPlaying;
    }

    playMusic() {
        this.ensureAudioContext();

        // Eğer kullanıcı config'de özel MP3 URL'si verdiyse onu çal
        if (typeof coupleConfig !== 'undefined' && coupleConfig.customMusicUrl && coupleConfig.customMusicUrl.trim() !== '') {
            if (!this.customAudio) {
                this.customAudio = new Audio(coupleConfig.customMusicUrl);
                this.customAudio.loop = true;
            }
            this.customAudio.play().catch(e => console.log("Ses oynatma hatası:", e));
        } else {
            // Web Audio API Generative Romantik Piyano Synthesizer
            this.startGenerativeMelody();
        }

        this.isPlaying = true;
        this.updateMusicUI(true);
    }

    pauseMusic() {
        if (this.customAudio) {
            this.customAudio.pause();
        }
        if (this.synthTimer) {
            clearInterval(this.synthTimer);
            this.synthTimer = null;
        }
        this.isPlaying = false;
        this.updateMusicUI(false);
    }

    startGenerativeMelody() {
        if (this.synthTimer) clearInterval(this.synthTimer);

        const playStep = () => {
            if (!this.isPlaying || !this.audioCtx) return;
            const chord = this.chords[this.currentChordIndex];
            
            // Akor içerisindeki notaları zarif ve yumuşak bir piyano tonuyla arpejle
            chord.forEach((freq, index) => {
                setTimeout(() => {
                    if (this.isPlaying) this.playSoftNote(freq, 2.4, 0.08);
                }, index * 420);
            });

            // Üst oktavdan tatlı bir melodi dokunuşu
            if (Math.random() > 0.3) {
                const highNote = chord[Math.floor(Math.random() * chord.length)] * 2;
                setTimeout(() => {
                    if (this.isPlaying) this.playSoftNote(highNote, 1.8, 0.05);
                }, 1680 + Math.random() * 500);
            }

            this.currentChordIndex = (this.currentChordIndex + 1) % this.chords.length;
        };

        playStep();
        this.synthTimer = setInterval(playStep, 3600);
    }

    playSoftNote(frequency, duration = 2.0, maxGain = 0.08) {
        try {
            const ctx = this.audioCtx;
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            const filter = ctx.createBiquadFilter();

            // Sıcak ve lo-fi bir ton için lowpass filtre
            filter.type = 'lowpass';
            filter.frequency.setValueAtTime(900, ctx.currentTime);

            osc.type = 'sine';
            osc.frequency.setValueAtTime(frequency, ctx.currentTime);

            // Yumuşak Attack ve Decay (Piyano tınısı)
            const now = ctx.currentTime;
            gain.gain.setValueAtTime(0.0001, now);
            gain.gain.exponentialRampToValueAtTime(maxGain, now + 0.08);
            gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

            osc.connect(filter);
            filter.connect(gain);
            gain.connect(ctx.destination);

            osc.start(now);
            osc.stop(now + duration);
        } catch (e) {
            // Sessizce geç
        }
    }

    /**
     * 🗝️ Kilit açıldığında çalan büyülü ses efekti
     */
    playUnlockSound() {
        try {
            this.ensureAudioContext();
            const ctx = this.audioCtx;
            const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6 (Majör Arpej)

            notes.forEach((freq, idx) => {
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                const now = ctx.currentTime + (idx * 0.09);

                osc.type = 'triangle';
                osc.frequency.setValueAtTime(freq, now);

                gain.gain.setValueAtTime(0.001, now);
                gain.gain.exponentialRampToValueAtTime(0.15, now + 0.03);
                gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.7);

                osc.connect(gain);
                gain.connect(ctx.destination);

                osc.start(now);
                osc.stop(now + 0.75);
            });
        } catch (e) {
            console.log("Ses efekti hatası:", e);
        }
    }

    /**
     * ❌ Hatalı şifre/cevap girildiğinde sevimli yumuşak uyarı sesi
     */
    playErrorSound() {
        try {
            this.ensureAudioContext();
            const ctx = this.audioCtx;
            const now = ctx.currentTime;

            const osc = ctx.createOscillator();
            const gain = ctx.createGain();

            osc.type = 'sine';
            osc.frequency.setValueAtTime(320, now);
            osc.frequency.linearRampToValueAtTime(240, now + 0.25);

            gain.gain.setValueAtTime(0.001, now);
            gain.gain.exponentialRampToValueAtTime(0.09, now + 0.02);
            gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.3);

            osc.connect(gain);
            gain.connect(ctx.destination);

            osc.start(now);
            osc.stop(now + 0.3);
        } catch (e) {
            console.log("Ses efekti hatası:", e);
        }
    }

    updateMusicUI(playing) {
        const musicBtn = document.getElementById('toggle-music-btn');
        const eqContainer = document.getElementById('music-eq');
        const statusText = document.getElementById('music-status-text');

        if (eqContainer) {
            if (playing) {
                eqContainer.classList.remove('music-paused');
            } else {
                eqContainer.classList.add('music-paused');
            }
        }

        if (statusText) {
            statusText.innerText = playing ? "Müzik: Çalıyor 🎶" : "Müziği Başlat 🎵";
        }
    }
}

window.romanticAudio = new RomanticAudioManager();
