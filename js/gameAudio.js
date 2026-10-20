// ========================================================
// GTA 5 REALISTIC GAME AUDIO ENGINE
// Engine Vroom, Police Siren, Waterfall Ambiance, Security Radio,
// Horn, Footsteps, and Discovery Chimes
// ========================================================

class GameAudioEngine {
  constructor() {
    this.ctx = null;
    this.isMuted = false;
    this.masterGain = null;

    // Vehicle engine
    this.engineOsc = null;
    this.engineGain = null;
    this.isEngineRunning = false;

    // Police Siren
    this.sirenOsc = null;
    this.sirenGain = null;
    this.isSirenActive = false;
    this.sirenInterval = null;

    // Waterfall ambient loop
    this.waterfallSource = null;
    this.waterfallGain = null;
  }

  init() {
    if (!this.ctx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return;
      this.ctx = new AudioContext();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : 0.28, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  toggleMute() {
    this.init();
    this.isMuted = !this.isMuted;
    if (this.masterGain) {
      this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : 0.28, this.ctx.currentTime);
    }
    if (this.isMuted) {
      this.stopEngine();
      this.stopPoliceSiren();
    }
    return !this.isMuted;
  }

  // Realistic Car Engine (Dynamic pitch with speed)
  startEngine() {
    if (this.isMuted || this.isEngineRunning) return;
    this.init();
    try {
      this.engineOsc = this.ctx.createOscillator();
      this.engineGain = this.ctx.createGain();
      this.engineOsc.type = 'sawtooth';
      this.engineOsc.frequency.setValueAtTime(55, this.ctx.currentTime);

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(380, this.ctx.currentTime);

      this.engineGain.gain.setValueAtTime(0.08, this.ctx.currentTime);

      this.engineOsc.connect(filter);
      filter.connect(this.engineGain);
      this.engineGain.connect(this.masterGain);

      this.engineOsc.start();
      this.isEngineRunning = true;
    } catch (e) { }
  }

  updateEnginePitch(speedRatio) {
    if (!this.engineOsc || !this.isEngineRunning || this.isMuted) return;
    try {
      const freq = 55 + speedRatio * 180;
      this.engineOsc.frequency.setTargetAtTime(freq, this.ctx.currentTime, 0.04);
    } catch (e) { }
  }

  stopEngine() {
    if (this.engineOsc) {
      try {
        this.engineOsc.stop();
        this.engineOsc.disconnect();
        this.engineOsc = null;
        this.engineGain = null;
      } catch (e) { }
    }
    this.isEngineRunning = false;
  }

  // Police Emergency Siren (Wee-Woo-Wee-Woo)
  playPoliceSiren(continuous = false) {
    if (this.isMuted || this.isSirenActive) return;
    this.init();
    try {
      this.isSirenActive = true;
      this.sirenOsc = this.ctx.createOscillator();
      this.sirenGain = this.ctx.createGain();
      this.sirenOsc.type = 'sawtooth';

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(900, this.ctx.currentTime);

      this.sirenGain.gain.setValueAtTime(0.12, this.ctx.currentTime);

      this.sirenOsc.connect(filter);
      filter.connect(this.sirenGain);
      this.sirenGain.connect(this.masterGain);

      this.sirenOsc.start();

      let toggle = false;
      this.sirenInterval = setInterval(() => {
        if (!this.sirenOsc || this.isMuted) return;
        const targetFreq = toggle ? 650 : 920;
        this.sirenOsc.frequency.setTargetAtTime(targetFreq, this.ctx.currentTime, 0.12);
        toggle = !toggle;
      }, 450);

      // Only auto-stop if not continuous
      if (!continuous) {
        setTimeout(() => this.stopPoliceSiren(), 6000);
      }
    } catch (e) { }
  }

  stopPoliceSiren() {
    clearInterval(this.sirenInterval);
    if (this.sirenOsc) {
      try {
        this.sirenOsc.stop();
        this.sirenOsc.disconnect();
        this.sirenOsc = null;
        this.sirenGain = null;
      } catch (e) { }
    }
    this.isSirenActive = false;
  }

  // Security Radio Chatter Sound
  playSecurityRadio() {
    if (this.isMuted) return;
    this.init();
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'square';
      osc.frequency.setValueAtTime(750, this.ctx.currentTime);
      osc.frequency.setValueAtTime(950, this.ctx.currentTime + 0.08);

      gain.gain.setValueAtTime(0.15, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.2);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.2);
    } catch (e) { }
  }

  // Car Horn (Beep Beep)
  playHorn() {
    if (this.isMuted) return;
    this.init();
    try {
      const osc1 = this.ctx.createOscillator();
      const osc2 = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc1.type = 'triangle';
      osc2.type = 'triangle';
      osc1.frequency.setValueAtTime(430, this.ctx.currentTime);
      osc2.frequency.setValueAtTime(515, this.ctx.currentTime);

      gain.gain.setValueAtTime(0.18, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.35);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(this.masterGain);

      osc1.start();
      osc2.start();
      osc1.stop(this.ctx.currentTime + 0.35);
      osc2.stop(this.ctx.currentTime + 0.35);
    } catch (e) { }
  }

  // Footstep Sound
  playFootstep() {
    if (this.isMuted) return;
    this.init();
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(80 + Math.random() * 30, this.ctx.currentTime);

      gain.gain.setValueAtTime(0.03, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.04);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.04);
    } catch (e) { }
  }

  // Door / Vehicle Enter Click
  playEnter() {
    if (this.isMuted) return;
    this.init();
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'square';
      osc.frequency.setValueAtTime(180, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(520, this.ctx.currentTime + 0.12);

      gain.gain.setValueAtTime(0.1, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.14);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.14);
    } catch (e) { }
  }

  // Realistic GTA 5 Tire Screech / Drift Sound
  playTireScreech() {
    if (this.isMuted) return;
    this.init();
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(1200 + Math.random() * 400, this.ctx.currentTime);
      osc.frequency.linearRampToValueAtTime(800 + Math.random() * 200, this.ctx.currentTime + 0.18);

      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(1400, this.ctx.currentTime);
      filter.Q.setValueAtTime(3.0, this.ctx.currentTime);

      gain.gain.setValueAtTime(0.08, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.2);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.masterGain);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.2);
    } catch (e) { }
  }

  // Radio Station Tuning Sound (GTA 5 Radio Switch)
  playRadioTuning() {
    if (this.isMuted) return;
    this.init();
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(440, this.ctx.currentTime + 0.08);

      gain.gain.setValueAtTime(0.12, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.1);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.1);
    } catch (e) { }
  }

  // Rocket Blast Off
  playRocketBlast() {
    if (this.isMuted) return;
    this.init();
    try {
      const bufferSize = this.ctx.sampleRate * 2.5;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }

      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(200, this.ctx.currentTime);
      filter.frequency.linearRampToValueAtTime(1400, this.ctx.currentTime + 1.2);
      filter.frequency.exponentialRampToValueAtTime(300, this.ctx.currentTime + 2.5);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.05, this.ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.3, this.ctx.currentTime + 0.8);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 2.5);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.masterGain);

      noise.start();
    } catch (e) { }
  }

  // Location / Quest Discovery Chime
  playDiscoveryChime() {
    if (this.isMuted) return;
    this.init();
    try {
      const notes = [523.25, 659.25, 783.99, 1046.50];
      notes.forEach((freq, idx) => {
        setTimeout(() => {
          if (this.isMuted || !this.ctx) return;
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

          gain.gain.setValueAtTime(0.12, this.ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.4);

          osc.connect(gain);
          gain.connect(this.masterGain);

          osc.start();
          osc.stop(this.ctx.currentTime + 0.4);
        }, idx * 90);
      });
    } catch (e) { }
  }

  playUIHover() {
    if (this.isMuted) return;
    this.init();
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(640, this.ctx.currentTime);

      gain.gain.setValueAtTime(0.03, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.05);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.05);
    } catch (e) { }
  }

  // Car Crash & Metal Impact Sound (GTA 5 Crunch)
  playCarCrash() {
    if (this.isMuted) return;
    this.init();
    try {
      // 1. Noise burst for metal crumple
      const bufferSize = this.ctx.sampleRate * 0.45;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (this.ctx.sampleRate * 0.1));
      }
      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(800, this.ctx.currentTime);
      filter.frequency.exponentialRampToValueAtTime(120, this.ctx.currentTime + 0.45);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.35, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.45);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.masterGain);
      noise.start();

      // 2. Heavy low-frequency punch thud
      const osc = this.ctx.createOscillator();
      const oscGain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(110, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(35, this.ctx.currentTime + 0.3);

      oscGain.gain.setValueAtTime(0.4, this.ctx.currentTime);
      oscGain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.3);

      osc.connect(oscGain);
      oscGain.connect(this.masterGain);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.3);
    } catch (e) { }
  }

  // Pedestrian Collision Impact Thud & Scream
  playPedestrianImpact() {
    if (this.isMuted) return;
    this.init();
    try {
      // Impact thud
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(140, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(45, this.ctx.currentTime + 0.2);

      gain.gain.setValueAtTime(0.3, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.2);

      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.2);

      // Startled shout pitch glide
      const shout = this.ctx.createOscillator();
      const shoutGain = this.ctx.createGain();
      shout.type = 'sawtooth';
      shout.frequency.setValueAtTime(480, this.ctx.currentTime);
      shout.frequency.linearRampToValueAtTime(260, this.ctx.currentTime + 0.35);

      shoutGain.gain.setValueAtTime(0.12, this.ctx.currentTime);
      shoutGain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.35);

      shout.connect(shoutGain);
      shoutGain.connect(this.masterGain);
      shout.start();
      shout.stop(this.ctx.currentTime + 0.35);
    } catch (e) { }
  }

  // Pneumatic Impact Wrench / Mechanic Workshop Repair SFX
  playRepairSound() {
    if (this.isMuted) return;
    this.init();
    try {
      // 1. Rapid ratcheting / pneumatic tool pulses
      for (let i = 0; i < 7; i++) {
        const time = this.ctx.currentTime + i * 0.045;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(360 + Math.random() * 80, time);
        osc.frequency.exponentialRampToValueAtTime(120, time + 0.035);

        gain.gain.setValueAtTime(0.22, time);
        gain.gain.exponentialRampToValueAtTime(0.001, time + 0.035);

        osc.connect(gain);
        gain.connect(this.masterGain);
        osc.start(time);
        osc.stop(time + 0.035);
      }

      // 2. High-pressure air compressor release hiss
      const bufferSize = Math.floor(this.ctx.sampleRate * 0.25);
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (this.ctx.sampleRate * 0.08));
      }
      const hiss = this.ctx.createBufferSource();
      hiss.buffer = buffer;
      const hissFilter = this.ctx.createBiquadFilter();
      hissFilter.type = 'highpass';
      hissFilter.frequency.setValueAtTime(2200, this.ctx.currentTime);
      const hissGain = this.ctx.createGain();
      hissGain.gain.setValueAtTime(0.18, this.ctx.currentTime);
      hissGain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.25);

      hiss.connect(hissFilter);
      hissFilter.connect(hissGain);
      hissGain.connect(this.masterGain);
      hiss.start();
    } catch (e) { }
  }

  // Tow Truck Warning Beep / Strobe Audio
  playTowTruckBeep() {
    if (this.isMuted) return;
    this.init();
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'square';
      osc.frequency.setValueAtTime(920, this.ctx.currentTime);
      gain.gain.setValueAtTime(0.08, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.12);
      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.12);
    } catch (e) { }
  }

  // Fire Engine Dual Wail & Strobe Siren
  playFireSiren() {
    if (this.isMuted) return;
    this.init();
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(480, now);
      osc.frequency.linearRampToValueAtTime(740, now + 0.6);
      osc.frequency.linearRampToValueAtTime(480, now + 1.2);
      gain.gain.setValueAtTime(0.14, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 1.25);
      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start(now);
      osc.stop(now + 1.25);
    } catch (e) { }
  }

  // Heavy Emergency Air Horn
  playFireHorn() {
    if (this.isMuted) return;
    this.init();
    try {
      const now = this.ctx.currentTime;
      const osc1 = this.ctx.createOscillator();
      const osc2 = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc1.type = 'sawtooth'; osc2.type = 'sawtooth';
      osc1.frequency.setValueAtTime(220, now);
      osc2.frequency.setValueAtTime(277, now); // Major third dissonance
      gain.gain.setValueAtTime(0.22, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.7);
      osc1.connect(gain); osc2.connect(gain);
      gain.connect(this.masterGain);
      osc1.start(now); osc2.start(now);
      osc1.stop(now + 0.7); osc2.stop(now + 0.7);
    } catch (e) { }
  }

  // High-Performance Engine Throttle & Rev
  playSupercarRev() {
    if (this.isMuted) return;
    this.init();
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(110, now);
      osc.frequency.exponentialRampToValueAtTime(420, now + 0.4);
      osc.frequency.exponentialRampToValueAtTime(180, now + 1.1);
      gain.gain.setValueAtTime(0.25, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 1.2);
      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start(now);
      osc.stop(now + 1.2);
    } catch (e) { }
  }
}

window.gameAudio = new GameAudioEngine();
