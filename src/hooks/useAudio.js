/**
 * React hook for audio management
 * Provides easy access to SoundManager in React components
 */
import { useCallback, useEffect, useRef } from 'react';
import { SoundManager } from '../audio/SoundManager';

/**
 * Hook for using audio in components
 * @returns {Object} Audio control methods
 */
export function useAudio() {
  const initialized = useRef(false);

  // Initialize audio on first user interaction
  const initAudio = useCallback(() => {
    if (!initialized.current) {
      SoundManager.init();
      initialized.current = true;
    }
  }, []);

  // Play tower shoot sound
  const playTowerShoot = useCallback((towerType) => {
    SoundManager.playTowerShoot(towerType);
  }, []);

  // Play zombie hit sound
  const playZombieHit = useCallback(() => {
    SoundManager.playZombieHit();
  }, []);

  // Play zombie death sound
  const playZombieDeath = useCallback(() => {
    SoundManager.playZombieDeath();
  }, []);

  // Play explosion sound
  const playExplosion = useCallback(() => {
    SoundManager.playExplosion();
  }, []);

  // Play wave alert
  const playWaveAlert = useCallback(() => {
    SoundManager.playWaveAlert();
  }, []);

  // Play victory sound
  const playVictory = useCallback(() => {
    SoundManager.playVictory();
  }, []);

  // Play defeat sound
  const playDefeat = useCallback(() => {
    SoundManager.playDefeat();
  }, []);

  // Play UI click
  const playUIClick = useCallback(() => {
    SoundManager.playUIClick();
  }, []);

  // Play UI hover
  const playUIHover = useCallback(() => {
    SoundManager.playUIHover();
  }, []);

  // Play music
  const playMusic = useCallback((type) => {
    SoundManager.playMusic(type);
  }, []);

  // Stop music
  const stopMusic = useCallback((fadeOut) => {
    SoundManager.stopMusic(fadeOut);
  }, []);

  // Set volume
  const setVolume = useCallback((channel, value) => {
    SoundManager.setVolume(channel, value);
  }, []);

  // Get volume
  const getVolume = useCallback((channel) => {
    return SoundManager.getVolume(channel);
  }, []);

  // Mute/unmute
  const mute = useCallback(() => {
    SoundManager.mute();
  }, []);

  const unmute = useCallback(() => {
    SoundManager.unmute();
  }, []);

  const isMuted = useCallback(() => {
    return SoundManager.isMuted();
  }, []);

  return {
    initAudio,
    playTowerShoot,
    playZombieHit,
    playZombieDeath,
    playExplosion,
    playWaveAlert,
    playVictory,
    playDefeat,
    playUIClick,
    playUIHover,
    playMusic,
    stopMusic,
    setVolume,
    getVolume,
    mute,
    unmute,
    isMuted,
  };
}

/**
 * Hook for background music that follows game state
 */
export function useGameMusic(isPlaying, isPaused, gameOverReason) {
  const { playMusic, stopMusic } = useAudio();

  useEffect(() => {
    if (gameOverReason) {
      stopMusic(0.5);
    } else if (isPlaying && !isPaused) {
      playMusic('gameplay');
    } else if (!isPlaying) {
      playMusic('menu');
    }

    return () => {
      // Cleanup handled by SoundManager
    };
  }, [isPlaying, isPaused, gameOverReason, playMusic, stopMusic]);
}
