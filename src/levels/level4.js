/**
 * Level 4 - Military Base
 * Complex layout with obstacles and mixed enemy types
 */

import { PropBuilders } from './levelTypes.js';

/**
 * Level 4 configuration
 * Military base with barracks, watchtowers, and defensive positions
 * Mix of all enemy types with strategic choke points
 */
export const level4Config = {
  id: 'level4',
  name: 'Military Base',
  description: 'The military base has been overrun. Use the defensive positions and watchtowers to hold back the horde.',
  gridSize: 22,

  // Complex path with multiple turns and choke points
  pathWaypoints: [
    { x: 0, z: 11 },
    { x: 4, z: 11 },
    { x: 6, z: 9 },
    { x: 6, z: 6 },
    { x: 4, z: 4 },
    { x: 4, z: 2 },
    { x: 8, z: 2 },
    { x: 10, z: 4 },
    { x: 10, z: 8 },
    { x: 12, z: 10 },
    { x: 15, z: 10 },
    { x: 17, z: 8 },
    { x: 17, z: 5 },
    { x: 15, z: 3 },
    { x: 18, z: 3 },
    { x: 20, z: 5 },
    { x: 20, z: 11 },
    { x: 18, z: 13 },
    { x: 15, z: 13 },
    { x: 13, z: 15 },
    { x: 13, z: 18 },
    { x: 16, z: 20 },
    { x: 20, z: 20 },
    { x: 21, z: 18 },
  ],

  // Military base environment props
  environmentProps: [
    // Barracks buildings (green military color)
    PropBuilders.building(-18, -18, { color: '#4b5320', scale: 2.5 }),
    PropBuilders.building(-10, -18, { color: '#4b5320', scale: 2.5 }),
    PropBuilders.building(-2, -18, { color: '#4b5320', scale: 2.5 }),
    PropBuilders.building(6, -18, { color: '#4b5320', scale: 2.5 }),
    PropBuilders.building(14, -18, { color: '#4b5320', scale: 2.5 }),

    // Watchtowers (tall thin structures)
    PropBuilders.building(-18, -10, { color: '#5c4033', scale: 1.5 }),
    PropBuilders.building(-18, 0, { color: '#5c4033', scale: 1.5 }),
    PropBuilders.building(-18, 10, { color: '#5c4033', scale: 1.5 }),
    PropBuilders.building(18, -10, { color: '#5c4033', scale: 1.5 }),
    PropBuilders.building(18, 0, { color: '#5c4033', scale: 1.5 }),
    PropBuilders.building(18, 10, { color: '#5c4033', scale: 1.5 }),

    // Command center
    PropBuilders.building(0, 0, { color: '#3d3d3d', scale: 3 }),

    // Sandbag barriers (brown crates)
    PropBuilders.crate(-14, -14, { color: '#8b7355', scale: 0.8 }),
    PropBuilders.crate(-12, -14, { color: '#8b7355', scale: 0.8 }),
    PropBuilders.crate(-14, -12, { color: '#8b7355', scale: 0.8 }),
    PropBuilders.crate(10, -14, { color: '#8b7355', scale: 0.8 }),
    PropBuilders.crate(12, -14, { color: '#8b7355', scale: 0.8 }),
    PropBuilders.crate(10, -12, { color: '#8b7355', scale: 0.8 }),

    PropBuilders.crate(-14, 14, { color: '#8b7355', scale: 0.8 }),
    PropBuilders.crate(-12, 14, { color: '#8b7355', scale: 0.8 }),
    PropBuilders.crate(14, 14, { color: '#8b7355', scale: 0.8 }),

    // Military vehicles (represented as blocks)
    PropBuilders.building(-6, -14, { color: '#2d3b1e', scale: 1.2 }),
    PropBuilders.building(2, -14, { color: '#2d3b1e', scale: 1.2 }),
    PropBuilders.building(-6, 14, { color: '#2d3b1e', scale: 1.2 }),

    // Fuel barrels (red)
    PropBuilders.barrel(-16, -16, { color: '#c0392b' }),
    PropBuilders.barrel(-14, -16, { color: '#c0392b' }),
    PropBuilders.barrel(16, -16, { color: '#c0392b' }),
    PropBuilders.barrel(14, -16, { color: '#c0392b' }),
    PropBuilders.barrel(-16, 16, { color: '#c0392b' }),
    PropBuilders.barrel(16, 16, { color: '#c0392b' }),

    // Ammo crates (olive drab)
    PropBuilders.crate(-8, -8, { color: '#4b5320', scale: 0.7 }),
    PropBuilders.crate(-6, -8, { color: '#4b5320', scale: 0.7 }),
    PropBuilders.crate(-8, -6, { color: '#4b5320', scale: 0.7 }),
    PropBuilders.crate(8, -8, { color: '#4b5320', scale: 0.7 }),
    PropBuilders.crate(6, -8, { color: '#4b5320', scale: 0.7 }),
    PropBuilders.crate(8, -6, { color: '#4b5320', scale: 0.7 }),

    // Concrete barriers (grey)
    PropBuilders.rock(-4, -4, { color: '#7f8c8d', scale: 0.6 }),
    PropBuilders.rock(-2, -4, { color: '#7f8c8d', scale: 0.6 }),
    PropBuilders.rock(0, -4, { color: '#7f8c8d', scale: 0.6 }),
    PropBuilders.rock(4, 4, { color: '#7f8c8d', scale: 0.6 }),
    PropBuilders.rock(6, 4, { color: '#7f8c8d', scale: 0.6 }),

    // Communication antenna (tall thin structure)
    PropBuilders.building(0, -6, { color: '#c0c0c0', scale: 0.5 }),

    // Helicopter pad (marked area)
    PropBuilders.building(0, 6, { color: '#2c3e50', scale: 1.5 }),

    // Perimeter fence
    PropBuilders.fence(-20, -20, { color: '#2c2c2c' }),
    PropBuilders.fence(-16, -20, { color: '#2c2c2c' }),
    PropBuilders.fence(-12, -20, { color: '#2c2c2c' }),
    PropBuilders.fence(-8, -20, { color: '#2c2c2c' }),
    PropBuilders.fence(-4, -20, { color: '#2c2c2c' }),
    PropBuilders.fence(0, -20, { color: '#2c2c2c' }),
    PropBuilders.fence(4, -20, { color: '#2c2c2c' }),
    PropBuilders.fence(8, -20, { color: '#2c2c2c' }),
    PropBuilders.fence(12, -20, { color: '#2c2c2c' }),
    PropBuilders.fence(16, -20, { color: '#2c2c2c' }),

    PropBuilders.fence(-20, -16, { color: '#2c2c2c', rotation: Math.PI / 2 }),
    PropBuilders.fence(-20, -12, { color: '#2c2c2c', rotation: Math.PI / 2 }),
    PropBuilders.fence(-20, -8, { color: '#2c2c2c', rotation: Math.PI / 2 }),
    PropBuilders.fence(-20, -4, { color: '#2c2c2c', rotation: Math.PI / 2 }),
    PropBuilders.fence(-20, 0, { color: '#2c2c2c', rotation: Math.PI / 2 }),
    PropBuilders.fence(-20, 4, { color: '#2c2c2c', rotation: Math.PI / 2 }),
    PropBuilders.fence(-20, 8, { color: '#2c2c2c', rotation: Math.PI / 2 }),
    PropBuilders.fence(-20, 12, { color: '#2c2c2c', rotation: Math.PI / 2 }),
    PropBuilders.fence(-20, 16, { color: '#2c2c2c', rotation: Math.PI / 2 }),

    PropBuilders.fence(20, -16, { color: '#2c2c2c', rotation: Math.PI / 2 }),
    PropBuilders.fence(20, -12, { color: '#2c2c2c', rotation: Math.PI / 2 }),
    PropBuilders.fence(20, -8, { color: '#2c2c2c', rotation: Math.PI / 2 }),
    PropBuilders.fence(20, -4, { color: '#2c2c2c', rotation: Math.PI / 2 }),
    PropBuilders.fence(20, 0, { color: '#2c2c2c', rotation: Math.PI / 2 }),
    PropBuilders.fence(20, 4, { color: '#2c2c2c', rotation: Math.PI / 2 }),
    PropBuilders.fence(20, 8, { color: '#2c2c2c', rotation: Math.PI / 2 }),
    PropBuilders.fence(20, 12, { color: '#2c2c2c', rotation: Math.PI / 2 }),
    PropBuilders.fence(20, 16, { color: '#2c2c2c', rotation: Math.PI / 2 }),

    // Guard posts at corners
    PropBuilders.building(-18, -18, { color: '#3d3d3d', scale: 1 }),
    PropBuilders.building(18, -18, { color: '#3d3d3d', scale: 1 }),
    PropBuilders.building(-18, 18, { color: '#3d3d3d', scale: 1 }),
  ],

  // Military base lighting (clear but tense)
  lighting: {
    ambientIntensity: 0.5,
    ambientColor: '#d0d0d0',
    directionalIntensity: 0.9,
    directionalColor: '#fff8dc',
    directionalPosition: [12, 25, 8],
    fogColor: '#8b9dc3',
    fogNear: 30,
    fogFar: 65,
  },

  // Ground and path colors
  groundColor: '#5d4e37',
  pathColor: '#7a7a7a',

  // Starting resources
  startingMoney: 750,
  startingLives: 20,

  // Wave configuration
  totalWaves: 10,
  customWaves: [
    {
      waveNumber: 1,
      spawns: [
        { typeId: 'walker', count: 12, delay: 900 },
        { typeId: 'crawler', count: 6, delay: 600 },
      ],
      duration: 13000,
      totalZombies: 18,
    },
    {
      waveNumber: 2,
      spawns: [
        { typeId: 'runner', count: 10, delay: 500 },
        { typeId: 'walker', count: 10, delay: 800 },
      ],
      duration: 12000,
      totalZombies: 20,
    },
    {
      waveNumber: 3,
      spawns: [
        { typeId: 'tank', count: 4, delay: 1500 },
        { typeId: 'walker', count: 15, delay: 700 },
        { typeId: 'crawler', count: 8, delay: 500 },
      ],
      duration: 17000,
      totalZombies: 27,
    },
    {
      waveNumber: 4,
      spawns: [
        { typeId: 'runner', count: 18, delay: 350 },
        { typeId: 'tank', count: 3, delay: 1200 },
        { typeId: 'walker', count: 12, delay: 600 },
      ],
      duration: 18000,
      totalZombies: 33,
    },
    {
      waveNumber: 5,
      spawns: [
        { typeId: 'tank', count: 6, delay: 1000 },
        { typeId: 'runner', count: 15, delay: 400 },
        { typeId: 'walker', count: 18, delay: 550 },
        { typeId: 'crawler', count: 10, delay: 350 },
      ],
      duration: 20000,
      totalZombies: 49,
    },
    {
      waveNumber: 6,
      spawns: [
        { typeId: 'tank', count: 8, delay: 900 },
        { typeId: 'runner', count: 20, delay: 300 },
        { typeId: 'walker', count: 20, delay: 500 },
      ],
      duration: 20000,
      totalZombies: 48,
    },
    {
      waveNumber: 7,
      spawns: [
        { typeId: 'tank', count: 10, delay: 800 },
        { typeId: 'runner', count: 25, delay: 280 },
        { typeId: 'crawler', count: 20, delay: 250 },
        { typeId: 'walker', count: 15, delay: 450 },
      ],
      duration: 22000,
      totalZombies: 70,
    },
    {
      waveNumber: 8,
      spawns: [
        { typeId: 'tank', count: 12, delay: 700 },
        { typeId: 'runner', count: 30, delay: 250 },
        { typeId: 'walker', count: 25, delay: 400 },
        { typeId: 'crawler', count: 15, delay: 200 },
      ],
      duration: 24000,
      totalZombies: 82,
    },
    {
      waveNumber: 9,
      spawns: [
        { typeId: 'tank', count: 15, delay: 600 },
        { typeId: 'runner', count: 35, delay: 220 },
        { typeId: 'walker', count: 30, delay: 350 },
        { typeId: 'crawler', count: 20, delay: 180 },
      ],
      duration: 25000,
      totalZombies: 100,
    },
    {
      waveNumber: 10,
      spawns: [
        { typeId: 'boss', count: 1, delay: 0 },
        { typeId: 'tank', count: 10, delay: 800 },
        { typeId: 'runner', count: 25, delay: 300 },
        { typeId: 'walker', count: 30, delay: 400 },
        { typeId: 'crawler', count: 20, delay: 250 },
      ],
      duration: 25000,
      totalZombies: 86,
    },
  ],

  // Available towers (all types)
  availableTowers: ['basic', 'rapid', 'sniper', 'splash', 'freeze'],

  // Enemy types that appear
  enemyTypes: ['walker', 'crawler', 'runner', 'tank', 'boss'],

  // Difficulty rating
  difficulty: 4,
};

export default level4Config;
