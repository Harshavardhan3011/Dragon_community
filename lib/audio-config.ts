// Configuration and Web Audio Synthesizer for cinematic effects

class AudioSynthesizer {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private tracks: { [key: string]: HTMLAudioElement } = {};
  private activeLoops: { [key: string]: boolean } = {};

  init() {
    if (this.ctx) return;
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioContextClass) {
        this.ctx = new AudioContextClass();
        this.masterGain = this.ctx.createGain();
        this.masterGain.gain.value = 0.3; // Default master volume
        this.masterGain.connect(this.ctx.destination);
      }
    } catch (e) {
      console.warn("Web Audio API not supported:", e);
    }
  }

  setVolume(vol: number) {
    this.init();
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(vol, this.ctx.currentTime);
    }
    // Update HTMLAudio elements volume
    Object.values(this.tracks).forEach((audio) => {
      audio.volume = vol;
    });
  }

  // Pre-load audio elements if files exist
  loadTrack(name: string, url: string, loop = false) {
    if (typeof window === "undefined") return;
    const audio = new Audio();
    audio.src = url;
    audio.loop = loop;
    audio.preload = "auto";
    audio.volume = this.masterGain ? this.masterGain.gain.value : 0.3;
    
    // Fallback error handler
    audio.onerror = () => {
      // Audio file doesn't exist, we will use synth fallbacks
      console.log(`Audio file ${url} not found. Fallback synthesizer will be used.`);
    };

    this.tracks[name] = audio;
  }

  playTrack(name: string) {
    const track = this.tracks[name];
    if (track) {
      track.currentTime = 0;
      track.play().catch(() => {
        // Fallback to synth if play is blocked or fails
        this.playSynth(name);
      });
    } else {
      this.playSynth(name);
    }
  }

  stopTrack(name: string) {
    const track = this.tracks[name];
    if (track) {
      track.pause();
      track.currentTime = 0;
    }
  }

  // Synth fallbacks
  private playSynth(name: string) {
    this.init();
    if (!this.ctx || !this.masterGain) return;
    if (this.ctx.state === "suspended") {
      this.ctx.resume();
    }

    const now = this.ctx.currentTime;

    if (name === "click") {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = "triangle";
      osc.frequency.setValueAtTime(400, now);
      osc.frequency.exponentialRampToValueAtTime(100, now + 0.1);
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start(now);
      osc.stop(now + 0.1);
    } else if (name === "hover") {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(180, now);
      osc.frequency.exponentialRampToValueAtTime(320, now + 0.08);
      gain.gain.setValueAtTime(0.1, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.08);
      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start(now);
      osc.stop(now + 0.08);
    } else if (name === "fire-whoosh") {
      // Noise synthesis for fire
      const bufferSize = this.ctx.sampleRate * 0.6; // 0.6s
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }
      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.setValueAtTime(300, now);
      filter.frequency.exponentialRampToValueAtTime(1200, now + 0.3);
      filter.frequency.exponentialRampToValueAtTime(100, now + 0.6);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.5, now);
      gain.gain.linearRampToValueAtTime(0.8, now + 0.2);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.6);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.masterGain);
      noise.start(now);
      noise.stop(now + 0.6);
    } else if (name === "dragon-roar") {
      // Deep low-frequency growl + high distortion + noise
      const osc1 = this.ctx.createOscillator();
      const osc2 = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc1.type = "sawtooth";
      osc1.frequency.setValueAtTime(90, now);
      osc1.frequency.linearRampToValueAtTime(45, now + 1.2);

      osc2.type = "square";
      osc2.frequency.setValueAtTime(95, now);
      osc2.frequency.linearRampToValueAtTime(40, now + 1.2);

      // Tremolo LFO
      const lfo = this.ctx.createOscillator();
      const lfoGain = this.ctx.createGain();
      lfo.frequency.value = 15; // 15 Hz growl flutter
      lfoGain.gain.value = 25; // pitch modulation amplitude

      // Distortion (Wave Shaper)
      const shaper = this.ctx.createWaveShaper();
      const makeDistortionCurve = (amount = 50) => {
        const k = typeof amount === "number" ? amount : 50;
        const n_samples = 44100;
        const curve = new Float32Array(n_samples);
        const deg = Math.PI / 180;
        for (let i = 0; i < n_samples; ++i) {
          const x = (i * 2) / n_samples - 1;
          curve[i] = ((3 + k) * x * 20 * deg) / (Math.PI + k * Math.abs(x));
        }
        return curve;
      };
      shaper.curve = makeDistortionCurve(80);
      shaper.oversample = "4x";

      // Bandpass filter to restrict to roar frequencies
      const filter = this.ctx.createBiquadFilter();
      filter.type = "bandpass";
      filter.frequency.setValueAtTime(200, now);
      filter.frequency.exponentialRampToValueAtTime(80, now + 1.2);

      gain.gain.setValueAtTime(0.01, now);
      gain.gain.linearRampToValueAtTime(0.8, now + 0.1);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 1.5);

      lfo.connect(lfoGain);
      lfoGain.connect(osc1.frequency);
      lfoGain.connect(osc2.frequency);

      osc1.connect(shaper);
      osc2.connect(shaper);
      shaper.connect(filter);
      filter.connect(gain);
      gain.connect(this.masterGain);

      lfo.start(now);
      osc1.start(now);
      osc2.start(now);
      
      lfo.stop(now + 1.5);
      osc1.stop(now + 1.5);
      osc2.stop(now + 1.5);
    } else if (name === "ambient-loop") {
      if (this.activeLoops[name]) return;
      this.activeLoops[name] = true;
      // Start ambient generator - dynamic low humming synth pads
      this.runAmbientGenerator();
    }
  }

  private runAmbientGenerator() {
    if (!this.ctx || !this.masterGain || !this.activeLoops["ambient-loop"]) return;

    const schedulePad = () => {
      if (!this.ctx || !this.masterGain || !this.activeLoops["ambient-loop"]) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      // Low frequency hums
      osc.type = "triangle";
      const notes = [55, 65.41, 73.42, 82.41]; // A1, C2, D2, E2
      const randomNote = notes[Math.floor(Math.random() * notes.length)];
      osc.frequency.setValueAtTime(randomNote, now);
      
      filter.type = "lowpass";
      filter.frequency.setValueAtTime(150, now);
      filter.frequency.linearRampToValueAtTime(280, now + 3);
      filter.frequency.linearRampToValueAtTime(150, now + 6);

      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.12, now + 2); // soft pad
      gain.gain.linearRampToValueAtTime(0.12, now + 4);
      gain.gain.linearRampToValueAtTime(0, now + 6); // fades out

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.masterGain);

      osc.start(now);
      osc.stop(now + 6);

      // Schedule next pad in 5 seconds
      setTimeout(schedulePad, 5000);
    };

    schedulePad();
  }

  stopAllLoops() {
    this.activeLoops = {};
    Object.keys(this.tracks).forEach((name) => {
      this.stopTrack(name);
    });
  }

  resumeContext() {
    if (this.ctx && this.ctx.state === "suspended") {
      this.ctx.resume();
    }
  }
}

export const AudioSynth = new AudioSynthesizer();
