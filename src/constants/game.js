/**
 * Game constants for the zombie tower defense
 */

// Grid settings
export const GRID_SIZE = 20;
export const CELL_SIZE = 2;
export const GRID_OFFSET = (GRID_SIZE * CELL_SIZE) / 2 - CELL_SIZE / 2;

// Game timing
export const TICK_RATE = 60; // Updates per second
export const WAVE_DELAY = 5000; // ms between waves

// Tower types
export const TOWER_TYPES = {
  BASIC: {
    id: 'basic',
    name: 'Basic Tower',
    damage: 10,
    range: 4,
    fireRate: 1,
    cost: 50,
    color: '#4a90d9',
    description: 'Balanced tower with moderate damage and range',
  },
  SNIPER: {
    id: 'sniper',
    name: 'Sniper Tower',
    damage: 50,
    range: 10,
    fireRate: 0.3,
    cost: 150,
    color: '#2ecc71',
    description: 'Long range, high damage, slow fire rate',
  },
  RAPID: {
    id: 'rapid',
    name: 'Rapid Tower',
    damage: 3,
    range: 3,
    fireRate: 5,
    cost: 100,
    color: '#e74c3c',
    description: 'Fast firing, low damage per shot',
  },
  SPLASH: {
    id: 'splash',
    name: 'Splash Tower',
    damage: 15,
    range: 3.5,
    fireRate: 0.8,
    cost: 200,
    color: '#f39c12',
    splashRadius: 2,
    description: 'Area damage to multiple zombies',
  },
  FREEZE: {
    id: 'freeze',
    name: 'Freeze Tower',
    damage: 2,
    range: 4,
    fireRate: 1.5,
    cost: 175,
    color: '#9b59b6',
    slowFactor: 0.5,
    slowDuration: 2000,
    description: 'Slows zombies while dealing damage',
  },
};

// Zombie types
export const ZOMBIE_TYPES = {
  WALKER: {
    id: 'walker',
    name: 'Walker',
    health: 30,
    speed: 1,
    reward: 10,
    color: '#2d5016',
    damage: 1,
  },
  RUNNER: {
    id: 'runner',
    name: 'Runner',
    health: 20,
    speed: 2.5,
    reward: 15,
    color: '#8b4513',
    damage: 1,
  },
  TANK: {
    id: 'tank',
    name: 'Tank',
    health: 150,
    speed: 0.5,
    reward: 30,
    color: '#4a4a4a',
    damage: 2,
  },
  CRAWLER: {
    id: 'crawler',
    name: 'Crawler',
    health: 15,
    speed: 0.8,
    reward: 8,
    color: '#1a5f1a',
    damage: 1,
  },
  BOSS: {
    id: 'boss',
    name: 'Boss',
    health: 500,
    speed: 0.4,
    reward: 100,
    color: '#8b0000',
    damage: 5,
  },
};

// Initial game state
export const INITIAL_GAME_STATE = {
  money: 500,
  lives: 20,
  score: 0,
  level: 1,
  isPlaying: false,
  isPaused: false,
  selectedTowerType: null,
  gameOverReason: null,
};

// Upgrade costs (multiplier based on level)
export const UPGRADE_COST_MULTIPLIER = 0.7;

// Sell return percentage
export const SELL_RETURN_PERCENTAGE = 0.5;

// Camera settings
export const CAMERA_SETTINGS = {
  position: [0, 25, 25],
  fov: 45,
  near: 0.1,
  far: 1000,
};

// Colors
export const COLORS = {
  grid: '#2a2a3e',
  gridPath: '#3d3d5c',
  gridHighlight: '#4a4a6e',
  selection: '#f1c40f',
  validPlacement: '#2ecc71',
  invalidPlacement: '#e74c3c',
};
