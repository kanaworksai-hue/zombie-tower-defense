/**
 * Tower type definitions and configurations
 * All tower stats and properties are defined here
 */

/**
 * Targeting strategies for towers
 * @readonly
 */
export const TargetingStrategy = {
  NEAREST: 'nearest',
  FURTHEST: 'furthest',
  STRONGEST: 'strongest',
  WEAKEST: 'weakest',
  FIRST: 'first',
  LAST: 'last'
};

/**
 * Tower type definitions with base stats
 * @type {Array<import('../types/index.js').TowerType>}
 */
export const TOWER_TYPES = [
  {
    id: 'basic',
    name: 'Basic Tower',
    description: 'Balanced tower with moderate damage and fire rate',
    damage: 20,
    range: 4,
    fireRate: 1.5,
    cost: 100,
    color: '#4a90d9',
    targetingStrategy: TargetingStrategy.NEAREST,
    projectileSpeed: 15,
    upgradeMultiplier: 1.3
  },
  {
    id: 'sniper',
    name: 'Sniper Tower',
    description: 'Long range, high damage, slow fire rate',
    damage: 80,
    range: 8,
    fireRate: 0.4,
    cost: 250,
    color: '#2d5a27',
    targetingStrategy: TargetingStrategy.FURTHEST,
    projectileSpeed: 25,
    upgradeMultiplier: 1.4
  },
  {
    id: 'splash',
    name: 'Splash Tower',
    description: 'Area damage that hits multiple enemies',
    damage: 15,
    range: 3.5,
    fireRate: 1,
    cost: 200,
    color: '#d94a4a',
    targetingStrategy: TargetingStrategy.NEAREST,
    projectileSpeed: 10,
    splashRadius: 2,
    upgradeMultiplier: 1.25
  },
  {
    id: 'slow',
    name: 'Slow Tower',
    description: 'Low damage but slows enemy movement',
    damage: 5,
    range: 4,
    fireRate: 2,
    cost: 150,
    color: '#4ad9d9',
    targetingStrategy: TargetingStrategy.FIRST,
    projectileSpeed: 12,
    slowFactor: 0.5,
    slowDuration: 2,
    upgradeMultiplier: 1.2
  },
  {
    id: 'laser',
    name: 'Laser Tower',
    description: 'Continuous damage beam with no travel time',
    damage: 8,
    range: 5,
    fireRate: 10, // Damage per second for laser
    cost: 300,
    color: '#d94ad9',
    targetingStrategy: TargetingStrategy.STRONGEST,
    isLaser: true,
    upgradeMultiplier: 1.35
  }
];

/**
 * Maximum upgrade level for towers
 * @type {number}
 */
export const MAX_TOWER_LEVEL = 5;

/**
 * Cost multiplier for each upgrade level
 * @type {number}
 */
export const UPGRADE_COST_MULTIPLIER = 0.7;

/**
 * Sell value multiplier (percentage of total cost returned)
 * @type {number}
 */
export const SELL_VALUE_MULTIPLIER = 0.5;

/**
 * Get tower type by ID
 * @param {string} typeId - Tower type ID
 * @returns {import('../types/index.js').TowerType|undefined}
 */
export function getTowerTypeById(typeId) {
  return TOWER_TYPES.find(type => type.id === typeId);
}

/**
 * Calculate upgrade cost for a tower
 * @param {import('../types/index.js').TowerType} towerType - Base tower type
 * @param {number} currentLevel - Current upgrade level
 * @returns {number}
 */
export function calculateUpgradeCost(towerType, currentLevel) {
  return Math.floor(towerType.cost * UPGRADE_COST_MULTIPLIER * currentLevel);
}

/**
 * Calculate sell value for a tower
 * @param {import('../types/index.js').TowerType} towerType - Tower type
 * @param {number} currentLevel - Current upgrade level
 * @returns {number}
 */
export function calculateSellValue(towerType, currentLevel) {
  const totalCost = towerType.cost;
  for (let i = 1; i < currentLevel; i++) {
    totalCost += calculateUpgradeCost(towerType, i);
  }
  return Math.floor(totalCost * SELL_VALUE_MULTIPLIER);
}

/**
 * Get upgraded tower stats
 * @param {import('../types/index.js').TowerType} towerType - Base tower type
 * @param {number} level - Current level
 * @returns {Object} - Upgraded stats
 */
export function getUpgradedStats(towerType, level) {
  const multiplier = Math.pow(towerType.upgradeMultiplier, level - 1);
  return {
    damage: Math.floor(towerType.damage * multiplier),
    range: towerType.range * (1 + (level - 1) * 0.1),
    fireRate: towerType.fireRate * (1 + (level - 1) * 0.05)
  };
}
