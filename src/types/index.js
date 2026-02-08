/**
 * Type definitions for the zombie tower defense game
 * Using JSDoc for type annotations
 */

/**
 * @typedef {Object} Position
 * @property {number} x
 * @property {number} y
 * @property {number} z
 */

/**
 * @typedef {Object} TowerType
 * @property {string} id - Unique identifier for the tower type
 * @property {string} name - Display name
 * @property {number} damage - Damage per shot
 * @property {number} range - Attack range in grid units
 * @property {number} fireRate - Shots per second
 * @property {number} cost - Money cost to build
 * @property {string} color - Color for the tower mesh
 */

/**
 * @typedef {Object} Tower
 * @property {string} id - Unique identifier
 * @property {string} typeId - Reference to TowerType
 * @property {Position} position - Grid position
 * @property {number} level - Current upgrade level (1-5)
 * @property {number} lastFired - Timestamp of last shot
 * @property {string|null} targetId - Current target zombie ID
 */

/**
 * @typedef {Object} ZombieType
 * @property {string} id - Unique identifier for zombie type
 * @property {string} name - Display name
 * @property {number} health - Base health
 * @property {number} speed - Movement speed
 * @property {number} reward - Money reward on kill
 * @property {string} color - Color for the zombie mesh
 * @property {number} damage - Damage to base on reaching end
 */

/**
 * @typedef {Object} Zombie
 * @property {string} id - Unique identifier
 * @property {string} typeId - Reference to ZombieType
 * @property {Position} position - Current world position
 * @property {number} health - Current health
 * @property {number} maxHealth - Maximum health
 * @property {number} pathIndex - Current waypoint index
 * @property {number} pathProgress - Progress between waypoints (0-1)
 * @property {boolean} isDead - Whether zombie is dead
 * @property {boolean} reachedEnd - Whether zombie reached the base
 */

/**
 * @typedef {Object} Projectile
 * @property {string} id - Unique identifier
 * @property {string} towerId - Source tower ID
 * @property {string} targetId - Target zombie ID
 * @property {Position} position - Current position
 * @property {Position} targetPosition - Target position
 * @property {number} damage - Damage to deal
 * @property {number} speed - Projectile speed
 */

/**
 * @typedef {Object} Wave
 * @property {number} waveNumber - Current wave number
 * @property {Array<{typeId: string, count: number, delay: number}>} spawns - Spawn configuration
 * @property {number} spawnTimer - Time until next spawn
 * @property {number} zombiesRemaining - Zombies left to spawn
 * @property {boolean} isActive - Whether wave is currently active
 * @property {boolean} isComplete - Whether wave is finished
 */

/**
 * @typedef {Object} GameState
 * @property {number} money - Current money
 * @property {number} lives - Remaining lives
 * @property {number} score - Current score
 * @property {number} level - Current level (1-5)
 * @property {Wave} wave - Current wave state
 * @property {boolean} isPlaying - Whether game is active
 * @property {boolean} isPaused - Whether game is paused
 * @property {string|null} selectedTowerType - Currently selected tower for placement
 * @property {string|null} gameOverReason - Reason for game over if applicable
 */

/**
 * @typedef {Object} GridCell
 * @property {number} x - Grid x coordinate
 * @property {number} z - Grid z coordinate
 * @property {boolean} isPath - Whether this cell is part of the path
 * @property {boolean} isOccupied - Whether this cell has a tower
 * @property {string|null} towerId - Tower ID if occupied
 */

export {}
