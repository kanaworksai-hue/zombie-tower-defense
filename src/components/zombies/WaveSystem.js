/**
 * Wave system for zombie spawning
 * Handles wave generation, difficulty scaling, and spawn timing
 */

import { ZOMBIE_TYPES } from '../../constants/game.js';

/**
 * Wave configuration structure
 * @typedef {Object} WaveSpawn
 * @property {string} typeId - Zombie type ID
 * @property {number} count - Number of zombies to spawn
 * @property {number} delay - Delay between spawns in ms
 */

/**
 * Generate a wave configuration based on wave number
 * @param {number} waveNumber - The wave number
 * @returns {Object} Wave configuration
 */
export function generateWave(waveNumber) {
  const spawns = [];

  // Base difficulty parameters
  const baseZombieCount = 5;
  const difficultyMultiplier = 1 + (waveNumber - 1) * 0.3;
  const totalZombies = Math.floor(baseZombieCount * difficultyMultiplier);

  // Determine available zombie types based on wave number
  const availableTypes = ['walker'];

  if (waveNumber >= 2) {
    availableTypes.push('crawler');
  }
  if (waveNumber >= 3) {
    availableTypes.push('runner');
  }
  if (waveNumber >= 5) {
    availableTypes.push('tank');
  }
  if (waveNumber >= 10 && waveNumber % 5 === 0) {
    availableTypes.push('boss');
  }

  // Special waves
  const isBossWave = waveNumber % 10 === 0;
  const isTankWave = waveNumber % 7 === 0 && !isBossWave;
  const isRunnerWave = waveNumber % 4 === 0 && !isBossWave && !isTankWave;

  if (isBossWave) {
    // Boss wave: one boss with supporting zombies
    spawns.push({
      typeId: 'boss',
      count: 1 + Math.floor((waveNumber - 10) / 20),
      delay: 0,
    });

    // Add some tank support
    spawns.push({
      typeId: 'tank',
      count: Math.floor(totalZombies * 0.2),
      delay: 500,
    });

    // Fill with walkers
    const remaining = totalZombies - spawns[0].count - spawns[1].count;
    spawns.push({
      typeId: 'walker',
      count: Math.max(remaining, 5),
      delay: 300,
    });
  } else if (isTankWave) {
    // Tank wave: many tanks
    spawns.push({
      typeId: 'tank',
      count: Math.floor(totalZombies * 0.4),
      delay: 800,
    });

    // Fill with walkers
    const remaining = totalZombies - spawns[0].count;
    spawns.push({
      typeId: 'walker',
      count: remaining,
      delay: 400,
    });
  } else if (isRunnerWave) {
    // Runner wave: fast spawning runners
    spawns.push({
      typeId: 'runner',
      count: Math.floor(totalZombies * 0.6),
      delay: 200,
    });

    // Some walkers mixed in
    const remaining = totalZombies - spawns[0].count;
    spawns.push({
      typeId: 'walker',
      count: remaining,
      delay: 400,
    });
  } else {
    // Normal wave: mix of types
    let remaining = totalZombies;

    // Add crawlers (weak but numerous)
    if (availableTypes.includes('crawler')) {
      const crawlerCount = Math.floor(remaining * 0.2);
      if (crawlerCount > 0) {
        spawns.push({
          typeId: 'crawler',
          count: crawlerCount,
          delay: 250,
        });
        remaining -= crawlerCount;
      }
    }

    // Add runners
    if (availableTypes.includes('runner')) {
      const runnerCount = Math.floor(remaining * 0.25);
      if (runnerCount > 0) {
        spawns.push({
          typeId: 'runner',
          count: runnerCount,
          delay: 350,
        });
        remaining -= runnerCount;
      }
    }

    // Add tanks
    if (availableTypes.includes('tank')) {
      const tankCount = Math.floor(remaining * 0.15);
      if (tankCount > 0) {
        spawns.push({
          typeId: 'tank',
          count: tankCount,
          delay: 1000,
        });
        remaining -= tankCount;
      }
    }

    // Fill rest with walkers
    if (remaining > 0) {
      spawns.push({
        typeId: 'walker',
        count: remaining,
        delay: 500,
      });
    }
  }

  // Calculate wave duration
  const maxDuration = spawns.reduce((max, spawn) => {
    return Math.max(max, spawn.count * spawn.delay);
  }, 0);

  return {
    waveNumber,
    spawns,
    duration: maxDuration + 5000, // Add buffer time
    totalZombies: spawns.reduce((sum, s) => sum + s.count, 0),
  };
}

/**
 * Check if next wave should start
 * @param {Object} currentWave - Current wave state
 * @param {number} lastWaveEndTime - Timestamp when last wave ended
 * @param {number} delayBetweenWaves - Delay in ms
 * @returns {boolean}
 */
export function shouldSpawnNextWave(currentWave, lastWaveEndTime, delayBetweenWaves = 5000) {
  if (!currentWave) return true;
  if (currentWave.isActive) return false;
  if (!currentWave.isComplete) return false;

  const timeSinceLastWave = Date.now() - lastWaveEndTime;
  return timeSinceLastWave >= delayBetweenWaves;
}

/**
 * Calculate wave reward (bonus for completing wave)
 * @param {number} waveNumber - The wave number
 * @returns {number} Bonus money
 */
export function calculateWaveReward(waveNumber) {
  return 50 + waveNumber * 10;
}

/**
 * Get wave difficulty rating (for UI display)
 * @param {number} waveNumber - The wave number
 * @returns {string} Difficulty description
 */
export function getWaveDifficulty(waveNumber) {
  if (waveNumber % 10 === 0) return 'BOSS';
  if (waveNumber % 7 === 0) return 'HARD';
  if (waveNumber % 4 === 0) return 'MEDIUM';
  return 'NORMAL';
}

/**
 * Predefined waves for early levels (waves 1-20)
 * After wave 20, waves are procedurally generated
 */
export const PREDEFINED_WAVES = {
  1: {
    waveNumber: 1,
    spawns: [
      { typeId: 'walker', count: 5, delay: 1000 },
    ],
    duration: 5000,
    totalZombies: 5,
  },
  2: {
    waveNumber: 2,
    spawns: [
      { typeId: 'walker', count: 8, delay: 800 },
      { typeId: 'crawler', count: 3, delay: 500 },
    ],
    duration: 8000,
    totalZombies: 11,
  },
  3: {
    waveNumber: 3,
    spawns: [
      { typeId: 'walker', count: 10, delay: 700 },
      { typeId: 'runner', count: 3, delay: 400 },
    ],
    duration: 9000,
    totalZombies: 13,
  },
  4: {
    waveNumber: 4,
    spawns: [
      { typeId: 'runner', count: 8, delay: 300 },
      { typeId: 'walker', count: 5, delay: 600 },
    ],
    duration: 6000,
    totalZombies: 13,
  },
  5: {
    waveNumber: 5,
    spawns: [
      { typeId: 'tank', count: 2, delay: 2000 },
      { typeId: 'walker', count: 10, delay: 500 },
      { typeId: 'crawler', count: 5, delay: 300 },
    ],
    duration: 10000,
    totalZombies: 17,
  },
  10: {
    waveNumber: 10,
    spawns: [
      { typeId: 'boss', count: 1, delay: 0 },
      { typeId: 'tank', count: 3, delay: 1000 },
      { typeId: 'walker', count: 15, delay: 400 },
    ],
    duration: 15000,
    totalZombies: 19,
  },
};

/**
 * Get wave configuration (uses predefined or generates)
 * @param {number} waveNumber - The wave number
 * @returns {Object} Wave configuration
 */
export function getWave(waveNumber) {
  if (PREDEFINED_WAVES[waveNumber]) {
    return PREDEFINED_WAVES[waveNumber];
  }
  return generateWave(waveNumber);
}

export default {
  generateWave,
  shouldSpawnNextWave,
  calculateWaveReward,
  getWaveDifficulty,
  getWave,
  PREDEFINED_WAVES,
};
