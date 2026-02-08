/**
 * Zombie system exports
 * Main entry point for all zombie-related components and utilities
 */

export { Zombie } from './Zombie.jsx';
export { ZombieManager } from './ZombieManager.jsx';
export {
  ZOMBIE_TYPE_CONFIGS,
  getZombieConfig,
  calculateZombieStats,
} from './ZombieTypes.js';
export {
  generateWave,
  shouldSpawnNextWave,
  calculateWaveReward,
  getWaveDifficulty,
  getWave,
  PREDEFINED_WAVES,
} from './WaveSystem.js';
export {
  DeathEffect,
  DamageNumber,
  StatusEffectVisual,
  BloodSplatter,
} from './DeathEffects.jsx';
