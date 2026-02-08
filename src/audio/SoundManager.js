/**
 * Sound Manager for the Zombie Tower Defense game
 * Handles all audio playback including music and sound effects
 */

// Audio context for Web Audio API
let audioContext = null;

// Initialize audio context on first user interaction
function initAudioContext() {
  if (!audioContext) {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
  }
  if (audioContext.state === 'suspended') {
    audioContext.resume();
  }
  return audioContext;
}

// Volume settings
const DEFAULT_VOLUMES = {
  master: 1.0,
  music: 0.5,
  sfx: 0.7,
  ui: 0.8,
};

// Current volume levels
let volumes = { ...DEFAULT_VOLUMES };

// Currently playing music
let currentMusic = null;
let currentMusicType = null;

// Audio buffers cache
const audioBuffers = new Map();

// Active sound sources for cleanup
const activeSources = new Set();

/**
 * Generate a simple tone using Web Audio API
 * Used as fallback when audio files are not available
 */
function generateTone(frequency, duration, type = 'sine', volume = 0.5) {
  const ctx = initAudioContext();
  const oscillator = ctx.createOscillator();
  const gainNode = ctx.createGain();

  oscillator.type = type;
  oscillator.frequency.setValueAtTime(frequency, ctx.currentTime);

  gainNode.gain.setValueAtTime(volume, ctx.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);

  oscillator.connect(gainNode);
  gainNode.connect(ctx.destination);

  oscillator.start(ctx.currentTime);
  oscillator.stop(ctx.currentTime + duration);

  return { oscillator, gainNode };
}

/**
 * Generate explosion sound effect
 */
function generateExplosionSound(volume = 1.0) {
  const ctx = initAudioContext();
  const bufferSize = ctx.sampleRate * 0.5; // 0.5 seconds
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);

  // Fill with noise
  for (let i = 0; i < bufferSize; i++) {
    data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (ctx.sampleRate * 0.1));
  }

  const noise = ctx.createBufferSource();
  noise.buffer = buffer;

  const gainNode = ctx.createGain();
  gainNode.gain.setValueAtTime(volume * volumes.sfx * volumes.master, ctx.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);

  // Lowpass filter for deeper explosion sound
  const filter = ctx.createBiquadFilter();
  filter.type = 'lowpass';
  filter.frequency.setValueAtTime(200, ctx.currentTime);
  filter.frequency.exponentialRampToValueAtTime(50, ctx.currentTime + 0.5);

  noise.connect(filter);
  filter.connect(gainNode);
  gainNode.connect(ctx.destination);

  noise.start(ctx.currentTime);

  return noise;
}

/**
 * Generate shoot sound based on tower type
 */
function generateShootSound(towerType, volume = 1.0) {
  const ctx = initAudioContext();

  switch (towerType) {
    case 'basic':
      // Simple pop sound
      return generateTone(800, 0.1, 'square', volume * 0.3);

    case 'sniper':
      // High pitched, longer
      return generateTone(1200, 0.2, 'sawtooth', volume * 0.4);

    case 'rapid':
      // Short, high pitched burst
      return generateTone(1500, 0.05, 'square', volume * 0.2);

    case 'splash':
      // Deep thud
      return generateTone(300, 0.3, 'sawtooth', volume * 0.5);

    case 'freeze':
      // Magical chime
      const ctx = initAudioContext();
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();

      osc1.type = 'sine';
      osc2.type = 'sine';
      osc1.frequency.setValueAtTime(880, ctx.currentTime);
      osc2.frequency.setValueAtTime(1100, ctx.currentTime);

      gain.gain.setValueAtTime(volume * 0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(ctx.destination);

      osc1.start(ctx.currentTime);
      osc2.start(ctx.currentTime);
      osc1.stop(ctx.currentTime + 0.3);
      osc2.stop(ctx.currentTime + 0.3);

      return { oscillator: osc1, gainNode: gain };

    default:
      return generateTone(800, 0.1, 'sine', volume * 0.3);
  }
}

/**
 * Generate zombie hit sound
 */
function generateZombieHitSound(volume = 1.0) {
  const ctx = initAudioContext();
  const bufferSize = ctx.sampleRate * 0.2;
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);

  for (let i = 0; i < bufferSize; i++) {
    data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (ctx.sampleRate * 0.05));
  }

  const noise = ctx.createBufferSource();
  noise.buffer = buffer;

  const gainNode = ctx.createGain();
  gainNode.gain.setValueAtTime(volume * volumes.sfx * volumes.master * 0.5, ctx.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2);

  const filter = ctx.createBiquadFilter();
  filter.type = 'lowpass';
  filter.frequency.setValueAtTime(800, ctx.currentTime);

  noise.connect(filter);
  filter.connect(gainNode);
  gainNode.connect(ctx.destination);

  noise.start(ctx.currentTime);

  return noise;
}

/**
 * Generate zombie death sound
 */
function generateZombieDeathSound(volume = 1.0) {
  const ctx = initAudioContext();
  const bufferSize = ctx.sampleRate * 0.4;
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);

  for (let i = 0; i < bufferSize; i++) {
    data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (ctx.sampleRate * 0.15));
  }

  const noise = ctx.createBufferSource();
  noise.buffer = buffer;

  const gainNode = ctx.createGain();
  gainNode.gain.setValueAtTime(volume * volumes.sfx * volumes.master * 0.6, ctx.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4);

  const filter = ctx.createBiquadFilter();
  filter.type = 'lowpass';
  filter.frequency.setValueAtTime(400, ctx.currentTime);
  filter.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.4);

  noise.connect(filter);
  filter.connect(gainNode);
  gainNode.connect(ctx.destination);

  noise.start(ctx.currentTime);

  return noise;
}

/**
 * Generate wave start alert sound
 */
function generateWaveAlertSound(volume = 1.0) {
  const ctx = initAudioContext();

  // Create alarm-like sound
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = 'square';
  osc.frequency.setValueAtTime(440, ctx.currentTime);
  osc.frequency.setValueAtTime(554, ctx.currentTime + 0.15);
  osc.frequency.setValueAtTime(440, ctx.currentTime + 0.3);
  osc.frequency.setValueAtTime(554, ctx.currentTime + 0.45);

  gain.gain.setValueAtTime(volume * volumes.sfx * volumes.master * 0.4, ctx.currentTime);
  gain.gain.setValueAtTime(0, ctx.currentTime + 0.6);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start(ctx.currentTime);
  osc.stop(ctx.currentTime + 0.6);

  return osc;
}

/**
 * Generate victory sound
 */
function generateVictorySound(volume = 1.0) {
  const ctx = initAudioContext();

  const notes = [523.25, 659.25, 783.99, 1046.50]; // C major chord arpeggio
  const startTime = ctx.currentTime;

  notes.forEach((freq, i) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, startTime + i * 0.1);

    gain.gain.setValueAtTime(0, startTime + i * 0.1);
    gain.gain.linearRampToValueAtTime(volume * volumes.sfx * volumes.master * 0.4, startTime + i * 0.1 + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.01, startTime + i * 0.1 + 0.5);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(startTime + i * 0.1);
    osc.stop(startTime + i * 0.1 + 0.5);
  });
}

/**
 * Generate defeat sound
 */
function generateDefeatSound(volume = 1.0) {
  const ctx = initAudioContext();

  const notes = [392.00, 349.23, 311.13, 293.66]; // Descending notes
  const startTime = ctx.currentTime;

  notes.forEach((freq, i) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(freq, startTime + i * 0.2);

    gain.gain.setValueAtTime(0, startTime + i * 0.2);
    gain.gain.linearRampToValueAtTime(volume * volumes.sfx * volumes.master * 0.4, startTime + i * 0.2 + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.01, startTime + i * 0.2 + 0.4);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(startTime + i * 0.2);
    osc.stop(startTime + i * 0.2 + 0.4);
  });
}

/**
 * Generate UI click sound
 */
function generateUIClickSound(volume = 1.0) {
  return generateTone(1200, 0.05, 'sine', volume * 0.3);
}

/**
 * Generate UI hover sound
 */
function generateUIHoverSound(volume = 1.0) {
  return generateTone(800, 0.03, 'sine', volume * 0.15);
}

/**
 * Background music generators using Web Audio API
 */
const MusicGenerators = {
  menu: () => {
    const ctx = initAudioContext();
    const startTime = ctx.currentTime;

    // Simple ambient drone
    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gain = ctx.createGain();

    osc1.type = 'sine';
    osc2.type = 'triangle';
    osc1.frequency.setValueAtTime(110, startTime); // A2
    osc2.frequency.setValueAtTime(112, startTime); // Slight detune for chorus effect

    gain.gain.setValueAtTime(0, startTime);
    gain.gain.linearRampToValueAtTime(volumes.music * volumes.master * 0.15, startTime + 2);

    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(ctx.destination);

    osc1.start(startTime);
    osc2.start(startTime);

    return {
      stop: (fadeOut = 1) => {
        const stopTime = ctx.currentTime;
        gain.gain.cancelScheduledValues(stopTime);
        gain.gain.setValueAtTime(gain.gain.value, stopTime);
        gain.gain.linearRampToValueAtTime(0, stopTime + fadeOut);
        osc1.stop(stopTime + fadeOut);
        osc2.stop(stopTime + fadeOut);
      },
    };
  },

  gameplay: () => {
    const ctx = initAudioContext();
    const startTime = ctx.currentTime;

    // Tense ambient background
    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gain = ctx.createGain();

    osc1.type = 'sawtooth';
    osc2.type = 'square';
    osc1.frequency.setValueAtTime(55, startTime); // A1
    osc2.frequency.setValueAtTime(58, startTime); // Low interval

    // Lowpass filter for muffled, tense sound
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(200, startTime);
    filter.frequency.linearRampToValueAtTime(300, startTime + 4);

    gain.gain.setValueAtTime(0, startTime);
    gain.gain.linearRampToValueAtTime(volumes.music * volumes.master * 0.1, startTime + 3);

    osc1.connect(filter);
    osc2.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    osc1.start(startTime);
    osc2.start(startTime);

    return {
      stop: (fadeOut = 1) => {
        const stopTime = ctx.currentTime;
        gain.gain.cancelScheduledValues(stopTime);
        gain.gain.setValueAtTime(gain.gain.value, stopTime);
        gain.gain.linearRampToValueAtTime(0, stopTime + fadeOut);
        osc1.stop(stopTime + fadeOut);
        osc2.stop(stopTime + fadeOut);
      },
    };
  },
};

/**
 * Sound Manager object
 */
export const SoundManager = {
  /**
   * Initialize the audio system
   * Must be called after user interaction
   */
  init() {
    initAudioContext();
    console.log('SoundManager initialized');
  },

  /**
   * Set volume for a specific channel
   */
  setVolume(channel, value) {
    if (volumes.hasOwnProperty(channel)) {
      volumes[channel] = Math.max(0, Math.min(1, value));
    }
  },

  /**
   * Get current volume for a channel
   */
  getVolume(channel) {
    return volumes[channel] ?? 1;
  },

  /**
   * Play background music
   */
  playMusic(type) {
    if (currentMusicType === type) return;

    // Stop current music
    if (currentMusic) {
      currentMusic.stop(1);
    }

    // Start new music
    if (MusicGenerators[type]) {
      currentMusic = MusicGenerators[type]();
      currentMusicType = type;
    }
  },

  /**
   * Stop background music
   */
  stopMusic(fadeOut = 1) {
    if (currentMusic) {
      currentMusic.stop(fadeOut);
      currentMusic = null;
      currentMusicType = null;
    }
  },

  /**
   * Play tower shoot sound
   */
  playTowerShoot(towerType) {
    if (volumes.sfx <= 0 || volumes.master <= 0) return;
    generateShootSound(towerType, volumes.sfx);
  },

  /**
   * Play zombie hit sound
   */
  playZombieHit() {
    if (volumes.sfx <= 0 || volumes.master <= 0) return;
    generateZombieHitSound(volumes.sfx);
  },

  /**
   * Play zombie death sound
   */
  playZombieDeath() {
    if (volumes.sfx <= 0 || volumes.master <= 0) return;
    generateZombieDeathSound(volumes.sfx);
  },

  /**
   * Play explosion sound
   */
  playExplosion() {
    if (volumes.sfx <= 0 || volumes.master <= 0) return;
    generateExplosionSound(volumes.sfx);
  },

  /**
   * Play wave start alert
   */
  playWaveAlert() {
    if (volumes.sfx <= 0 || volumes.master <= 0) return;
    generateWaveAlertSound(volumes.sfx);
  },

  /**
   * Play victory sound
   */
  playVictory() {
    if (volumes.sfx <= 0 || volumes.master <= 0) return;
    generateVictorySound(volumes.sfx);
  },

  /**
   * Play defeat sound
   */
  playDefeat() {
    if (volumes.sfx <= 0 || volumes.master <= 0) return;
    generateDefeatSound(volumes.sfx);
  },

  /**
   * Play UI click sound
   */
  playUIClick() {
    if (volumes.ui <= 0 || volumes.master <= 0) return;
    generateUIClickSound(volumes.ui);
  },

  /**
   * Play UI hover sound
   */
  playUIHover() {
    if (volumes.ui <= 0 || volumes.master <= 0) return;
    generateUIHoverSound(volumes.ui);
  },

  /**
   * Mute all audio
   */
  mute() {
    volumes._previousMaster = volumes.master;
    volumes.master = 0;
    if (currentMusic) {
      currentMusic.stop(0.1);
    }
  },

  /**
   * Unmute audio
   */
  unmute() {
    if (volumes._previousMaster !== undefined) {
      volumes.master = volumes._previousMaster;
      delete volumes._previousMaster;
    }
    // Restart music if it was playing
    if (currentMusicType) {
      this.playMusic(currentMusicType);
    }
  },

  /**
   * Check if audio is muted
   */
  isMuted() {
    return volumes.master === 0;
  },

  /**
   * Reset all volumes to defaults
   */
  resetVolumes() {
    volumes = { ...DEFAULT_VOLUMES };
  },
};

export default SoundManager;
