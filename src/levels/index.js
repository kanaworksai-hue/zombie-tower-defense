/**
 * Level management and exports
 * Central hub for all game levels
 */

import level1Config from './level1.js';
import level2Config from './level2.js';
import level3Config from './level3.js';
import level4Config from './level4.js';
import level5Config from './level5.js';

import {
  gridToWorld,
  createPathFromWaypoints,
  generateBuildableAreas,
  PropBuilders,
} from './levelTypes.js';

// Export all level configurations
export const LEVELS = {
  1: level1Config,
  2: level2Config,
  3: level3Config,
  4: level4Config,
  5: level5Config,
};

// Array of all levels for iteration
export const ALL_LEVELS = [
  level1Config,
  level2Config,
  level3Config,
  level4Config,
  level5Config,
];

/**
 * Get level configuration by level number
 * @param {number} levelNumber - Level number (1-5)
 * @returns {Object} Level configuration
 */
export function getLevel(levelNumber) {
  const level = LEVELS[levelNumber];
  if (!level) {
    console.warn(`Level ${levelNumber} not found, returning level 1`);
    return level1Config;
  }
  return level;
}

/**
 * Get the world coordinate path for a level
 * @param {number} levelNumber - Level number
 * @param {number} cellSize - Size of each grid cell
 * @returns {Array<{x: number, z: number}>} Path in world coordinates
 */
export function getLevelPath(levelNumber, cellSize = 2) {
  const level = getLevel(levelNumber);
  return createPathFromWaypoints(
    level.pathWaypoints,
    level.gridSize,
    cellSize
  );
}

/**
 * Get buildable areas for a level
 * @param {number} levelNumber - Level number
 * @returns {Array<{x: number, z: number}>} Buildable grid positions
 */
export function getLevelBuildableAreas(levelNumber) {
  const level = getLevel(levelNumber);
  return generateBuildableAreas(level.gridSize, level.pathWaypoints);
}

/**
 * Check if a grid position is valid for building
 * @param {number} levelNumber - Level number
 * @param {number} gridX - Grid x coordinate
 * @param {number} gridZ - Grid z coordinate
 * @returns {boolean} Whether position is buildable
 */
export function isValidBuildPosition(levelNumber, gridX, gridZ) {
  const level = getLevel(levelNumber);

  // Check bounds
  if (
    gridX < 0 ||
    gridX >= level.gridSize ||
    gridZ < 0 ||
    gridZ >= level.gridSize
  ) {
    return false;
  }

  // Check if on path
  const isPath = level.pathWaypoints.some(
    (wp) => wp.x === gridX && wp.z === gridZ
  );

  return !isPath;
}

/**
 * Get wave configuration for a level and wave number
 * @param {number} levelNumber - Level number
 * @param {number} waveNumber - Wave number
 * @returns {Object|null} Wave configuration or null
 */
export function getLevelWave(levelNumber, waveNumber) {
  const level = getLevel(levelNumber);

  if (level.customWaves && level.customWaves[waveNumber - 1]) {
    return level.customWaves[waveNumber - 1];
  }

  return null;
}

/**
 * Get total number of waves for a level
 * @param {number} levelNumber - Level number
 * @returns {number} Total waves
 */
export function getTotalWaves(levelNumber) {
  const level = getLevel(levelNumber);
  return level.totalWaves;
}

/**
 * Get level completion reward
 * @param {number} levelNumber - Completed level number
 * @returns {number} Bonus money for completing level
 */
export function getLevelCompletionReward(levelNumber) {
  return 100 * levelNumber;
}

/**
 * Check if player has unlocked a level
 * @param {number} levelNumber - Level to check
 * @param {number} highestCompleted - Highest level player has completed
 * @returns {boolean} Whether level is unlocked
 */
export function isLevelUnlocked(levelNumber, highestCompleted) {
  return levelNumber <= highestCompleted + 1;
}

/**
 * Get level preview data (for level select screen)
 * @param {number} levelNumber - Level number
 * @returns {Object} Preview data
 */
export function getLevelPreview(levelNumber) {
  const level = getLevel(levelNumber);
  return {
    id: level.id,
    name: level.name,
    description: level.description,
    difficulty: level.difficulty,
    totalWaves: level.totalWaves,
    startingMoney: level.startingMoney,
    startingLives: level.startingLives,
    enemyTypes: level.enemyTypes,
    availableTowers: level.availableTowers,
    groundColor: level.groundColor,
  };
}

/**
 * Get all level previews
 * @returns {Array<Object>} Array of level preview data
 */
export function getAllLevelPreviews() {
  return ALL_LEVELS.map((_, index) => getLevelPreview(index + 1));
}

/**
 * Get the next level number
 * @param {number} currentLevel - Current level number
 * @returns {number|null} Next level number or null if no more levels
 */
export function getNextLevel(currentLevel) {
  const next = currentLevel + 1;
  return LEVELS[next] ? next : null;
}

/**
 * Validate level configuration
 * @param {Object} level - Level configuration to validate
 * @returns {boolean} Whether configuration is valid
 */
export function validateLevel(level) {
  const required = [
    'id',
    'name',
    'description',
    'gridSize',
    'pathWaypoints',
    'environmentProps',
    'lighting',
    'groundColor',
    'pathColor',
    'startingMoney',
    'startingLives',
    'totalWaves',
    'availableTowers',
    'enemyTypes',
    'difficulty',
  ];

  for (const field of required) {
    if (!(field in level)) {
      console.error(`Level ${level.id || 'unknown'} missing field: ${field}`);
      return false;
    }
  }

  // Validate path has at least 2 waypoints
  if (level.pathWaypoints.length < 2) {
    console.error(`Level ${level.id} path must have at least 2 waypoints`);
    return false;
  }

  // Validate difficulty is 1-5
  if (level.difficulty < 1 || level.difficulty > 5) {
    console.error(`Level ${level.id} difficulty must be 1-5`);
    return false;
  }

  return true;
}

/**
 * Validate all levels
 * @returns {boolean} Whether all levels are valid
 */
export function validateAllLevels() {
  return ALL_LEVELS.every(validateLevel);
}

// Export level types and utilities
export {
  gridToWorld,
  createPathFromWaypoints,
  generateBuildableAreas,
  PropBuilders,
};

// Export individual level configs
export {
  level1Config,
  level2Config,
  level3Config,
  level4Config,
  level5Config,
};

// Default export
export default {
  LEVELS,
  ALL_LEVELS,
  getLevel,
  getLevelPath,
  getLevelBuildableAreas,
  isValidBuildPosition,
  getLevelWave,
  getTotalWaves,
  getLevelCompletionReward,
  isLevelUnlocked,
  getLevelPreview,
  getAllLevelPreviews,
  getNextLevel,
  validateLevel,
  validateAllLevels,
};
