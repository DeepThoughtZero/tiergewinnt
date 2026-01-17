/**
 * Vier Gewinnt - Sound Manager
 * Generates sound effects procedurally using Web Audio API
 */
class SoundManager {
    constructor() {
        this.ctx = null;
        this.isMuted = false;
        this.initialized = false;
    }

    init() {
        if (this.initialized) return;

        try {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            this.ctx = new AudioContext();
            this.initialized = true;
        } catch (e) {
            console.warn('Web Audio API not supported', e);
        }
    }

    playTone(startFreq, endFreq, duration, type = 'sine', vol = 0.1) {
        if (this.isMuted || !this.ctx) return;

        // Resume context if suspended (browser requirement)
        if (this.ctx.state === 'suspended') {
            this.ctx.resume();
        }

        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = type;
        osc.frequency.setValueAtTime(startFreq, this.ctx.currentTime);
        if (startFreq !== endFreq) {
            osc.frequency.exponentialRampToValueAtTime(endFreq, this.ctx.currentTime + duration);
        }

        gain.gain.setValueAtTime(vol, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + duration);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start();
        osc.stop(this.ctx.currentTime + duration);
    }

    playDrop() {
        // "Plop" sound
        this.playTone(600, 300, 0.1, 'sine', 0.2);
        setTimeout(() => this.playTone(300, 100, 0.1, 'triangle', 0.1), 50);
    }

    playChipImpact() {
        // Click when hitting board
        this.playTone(800, 50, 0.05, 'square', 0.05);
    }

    playWin() {
        // Ascending melody
        const now = this.ctx ? this.ctx.currentTime : 0;
        const notes = [440, 554, 659, 880]; // A major

        notes.forEach((freq, i) => {
            setTimeout(() => this.playTone(freq, freq, 0.2, 'sine', 0.2), i * 100);
        });

        setTimeout(() => this.playTone(880, 1760, 0.4, 'triangle', 0.2), 400);
    }

    playLose() {
        // Descending sad tones
        const notes = [440, 415, 392, 369]; // Descending chromatic

        notes.forEach((freq, i) => {
            setTimeout(() => this.playTone(freq, freq, 0.3, 'sawtooth', 0.1), i * 300);
        });

        setTimeout(() => this.playTone(369, 100, 0.8, 'triangle', 0.15), 1200);
    }

    playDraw() {
        // Neutral sounds
        this.playTone(400, 400, 0.2, 'sine', 0.2);
        setTimeout(() => this.playTone(400, 400, 0.2, 'sine', 0.2), 250);
    }

    playClick() {
        // UI click
        this.playTone(800, 1200, 0.05, 'sine', 0.05);
    }

    toggleMute() {
        this.isMuted = !this.isMuted;
        return this.isMuted;
    }
}
