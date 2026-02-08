/**
 * Level type definitions and data structures
 * Defines the structure for game levels including paths, waves, and environment
 */

/**
 * @typedef {Object} LevelWaypoint
 * @property {number} x - Grid x coordinate
 * @property {number} z - Grid z coordinate
 */

/**
 * @typedef {Object} EnvironmentProp
 * @property {string} type - Prop type ('tree', 'rock', 'building', 'fence', 'barrel', 'crate')
 * @property {number} x - World x position
 * @property {number} z - World z position
 * @property {number} [rotation] - Rotation in radians
 * @property {number} [scale] - Scale multiplier
 * @property {string} [color] - Custom color
 */

/**
 * @typedef {Object} WaveConfig
 * @property {number} waveNumber - Wave identifier
 * @property {Array<{typeId: string, count: number, delay: number}>} spawns - Spawn groups
 * @property {number} duration - Wave duration in ms
 * @property {number} totalZombies - Total zombies in wave
 */

/**
 * @typedef {Object} LevelLighting
 * @property {number} ambientIntensity - Ambient light intensity (0-1)
 * @property {string} ambientColor - Ambient light color
 * @property {number} directionalIntensity - Directional light intensity
 * @property {string} directionalColor - Directional light color
 * @property {[number, number, number]} directionalPosition - Light position
 * @property {string} [fogColor] - Fog color
 * @property {number} [fogNear] - Fog near distance
 * @property {number} [fogFar] - Fog far distance
 */

/**
 * @typedef {Object} LevelConfig
 * @property {string} id - Unique level identifier
 * @property {string} name - Display name
 * @property {string} description - Level description
 * @property {number} gridSize - Grid dimensions (square)
 * @property {Array<LevelWaypoint>} pathWaypoints - Enemy path waypoints
 * @property {Array<EnvironmentProp>} environmentProps - Decorative props
 * @property {LevelLighting} lighting - Lighting configuration
 * @property {string} groundColor - Ground plane color
 * @property {string} pathColor - Path color
 * @property {number} startingMoney - Initial player money
 * @property {number} startingLives - Initial player lives
 * @property {number} totalWaves - Number of waves in level
 * @property {Array<WaveConfig>} [customWaves] - Custom wave definitions (optional)
 * @property {Array<string>} availableTowers - Tower types available
 * @property {Array<string>} enemyTypes - Enemy types that appear
 * @property {number} difficulty - Difficulty rating (1-5)
 */

/**
 * Convert grid coordinates to world position
 * @param {number} gridX - Grid x coordinate
 * @param {number} gridZ - Grid z coordinate
 * @param {number} gridSize - Total grid size
 * @param {number} cellSize - Size of each cell
 * @returns {{x: number, z: number}} World position
 */
export function gridToWorld(gridX, gridZ, gridSize, cellSize) {
  const offset = (gridSize * cellSize) / 2 - cellSize / 2;
  return {
    x: gridX * cellSize - offset,
    z: gridZ * cellSize - offset,
  };
}

/**
 * Create a path from waypoints with proper world coordinates
 * @param {Array<LevelWaypoint>} waypoints - Grid waypoints
 * @param {number} gridSize - Grid dimensions
 * @param {number} cellSize - Cell size
 * @returns {Array<{x: number, z: number}>} World coordinate path
 */
export function createPathFromWaypoints(waypoints, gridSize, cellSize) {
  return waypoints.map((wp) => gridToWorld(wp.x, wp.z, gridSize, cellSize));
}

/**
 * Generate buildable areas (all non-path cells)
 * @param {number} gridSize - Grid dimensions
 * @param {Array<LevelWaypoint>} pathWaypoints - Path waypoints
 * @returns {Array<{x: number, z: number}>} Buildable grid positions
 */
export function generateBuildableAreas(gridSize, pathWaypoints) {
  const buildable = [];
  const pathSet = new Set(pathWaypoints.map((wp) => `${wp.x},${wp.z}`));

  for (let x = 0; x < gridSize; x++) {
    for (let z = 0; z < gridSize; z++) {
      if (!pathSet.has(`${x},${z}`)) {
        buildable.push({ x, z });
      }
    }
  }

  return buildable;
}

/**
 * Helper to create environment props
 */
export const PropBuilders = {
  tree: (x, z, options = {}) => ({
    type: 'tree',
    x,
    z,
    rotation: options.rotation ?? Math.random() * Math.PI * 2,
    scale: options.scale ?? 0.8 + Math.random() * 0.4,
    color: options.color ?? '#2d5016',
  }),

  rock: (x, z, options = {}) => ({
    type: 'rock',
    x,
    z,
    rotation: options.rotation ?? Math.random() * Math.PI * 2,
    scale: options.scale ?? 0.5 + Math.random() * 0.5,
    color: options.color ?? '#7f8c8d',
  }),

  building: (x, z, options = {}) => ({
    type: 'building',
    x,
    z,
    rotation: options.rotation ?? 0,
    scale: options.scale ?? 1,
    color: options.color ?? '#95a5a6',
  }),

  fence: (x, z, options = {}) => ({
    type: 'fence',
    x,
    z,
    rotation: options.rotation ?? 0,
    scale: options.scale ?? 1,
    color: options.color ?? '#8b4513',
  }),

  barrel: (x, z, options = {}) => ({
    type: 'barrel',
    x,
    z,
    rotation: options.rotation ?? 0,
    scale: options.scale ?? 1,
    color: options.color ?? '#c0392b',
  }),

  crate: (x, z, options = {}) => ({
    type: 'crate',
    x,
    z,
    rotation: options.rotation ?? Math.random() * 0.5,
    scale: options.scale ?? 0.8 + Math.random() * 0.4,
    color: options.color ?? '#d35400',
  }),
};

export default {
  gridToWorld,
  createPathFromWaypoints,
  generateBuildableAreas,
  PropBuilders,
};
