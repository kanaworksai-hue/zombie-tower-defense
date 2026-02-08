/**
 * Zombie type definitions and configurations
 * Extends the base ZOMBIE_TYPES from constants with visual and behavioral properties
 */

import { ZOMBIE_TYPES as BASE_ZOMBIE_TYPES } from '../../constants/game.js';

/**
 * Extended zombie type definitions with visual properties
 */
export const ZOMBIE_TYPE_CONFIGS = {
  WALKER: {
    ...BASE_ZOMBIE_TYPES.WALKER,
    scale: 1,
    height: 1.8,
    headSize: 0.4,
    bodyWidth: 0.6,
    walkCycleSpeed: 3,
    armSwingRange: 0.3,
    particleColor: '#2d5016',
  },
  RUNNER: {
    ...BASE_ZOMBIE_TYPES.RUNNER,
    scale: 0.9,
    height: 1.6,
    headSize: 0.35,
    bodyWidth: 0.5,
    walkCycleSpeed: 8,
    armSwingRange: 0.5,
    particleColor: '#8b4513',
  },
  TANK: {
    ...BASE_ZOMBIE_TYPES.TANK,
    scale: 1.5,
    height: 2.4,
    headSize: 0.55,
    bodyWidth: 0.9,
    walkCycleSpeed: 2,
    armSwingRange: 0.2,
    particleColor: '#4a4a4a',
  },
  CRAWLER: {
    ...BASE_ZOMBIE_TYPES.CRAWLER,
    scale: 0.7,
    height: 1.0,
    headSize: 0.3,
    bodyWidth: 0.5,
    walkCycleSpeed: 2,
    armSwingRange: 0.4,
    particleColor: '#1a5f1a',
    isCrawler: true,
  },
  BOSS: {
    ...BASE_ZOMBIE_TYPES.BOSS,
    scale: 2.2,
    height: 3.5,
    headSize: 0.8,
    bodyWidth: 1.4,
    walkCycleSpeed: 2.5,
    armSwingRange: 0.25,
    particleColor: '#8b0000',
    hasGlow: true,
  },
};

/**
 * Get zombie config by type ID
 * @param {string} typeId - The zombie type ID
 * @returns {Object} The zombie configuration
 */
export function getZombieConfig(typeId) {
  const config = Object.values(ZOMBIE_TYPE_CONFIGS).find(
    (config) => config.id === typeId
  );
  return config || ZOMBIE_TYPE_CONFIGS.WALKER;
}

/**
 * Calculate zombie stats based on wave number (difficulty scaling)
 * @param {Object} baseConfig - Base zombie configuration
 * @param {number} waveNumber - Current wave number
 * @returns {Object} Scaled zombie stats
 */
export function calculateZombieStats(baseConfig, waveNumber) {
  // Health scales with wave number (exponential growth)
  const healthMultiplier = 1 + Math.pow(waveNumber, 1.5) * 0.15;

  // Speed increases slightly each wave (capped at 1.5x)
  const speedMultiplier = Math.min(1 + waveNumber * 0.05, 1.5);

  // Reward increases with difficulty
  const rewardMultiplier = 1 + waveNumber * 0.1;

  return {
    health: Math.floor(baseConfig.health * healthMultiplier),
    speed: baseConfig.speed * speedMultiplier,
    reward: Math.floor(baseConfig.reward * rewardMultiplier),
    damage: baseConfig.damage,
  };
}

export default ZOMBIE_TYPE_CONFIGS;
