/**
 * Level 3 - Cemetery
 * Winding path with tank zombies
 */

import { PropBuilders } from './levelTypes.js';

/**
 * Level 3 configuration
 * Spooky cemetery with winding paths and crypts
 * Introduces tank zombies that require heavy firepower
 */
export const level3Config = {
  id: 'level3',
  name: 'Cemetery',
  description: 'The dead are rising from their graves. Heavy tank zombies lumber through the foggy cemetery.',
  gridSize: 20,

  // Winding path through cemetery
  pathWaypoints: [
    { x: 0, z: 10 },
    { x: 3, z: 10 },
    { x: 5, z: 8 },
    { x: 5, z: 5 },
    { x: 3, z: 3 },
    { x: 3, z: 1 },
    { x: 6, z: 1 },
    { x: 8, z: 3 },
    { x: 8, z: 6 },
    { x: 10, z: 8 },
    { x: 12, z: 8 },
    { x: 14, z: 6 },
    { x: 14, z: 3 },
    { x: 12, z: 1 },
    { x: 15, z: 1 },
    { x: 17, z: 3 },
    { x: 17, z: 7 },
    { x: 15, z: 10 },
    { x: 12, z: 12 },
    { x: 10, z: 14 },
    { x: 10, z: 17 },
    { x: 13, z: 19 },
    { x: 17, z: 19 },
    { x: 19, z: 17 },
  ],

  // Cemetery environment props
  environmentProps: [
    // Mausoleums and crypts
    PropBuilders.building(-16, -16, { color: '#4a4a4a', scale: 2 }),
    PropBuilders.building(0, -16, { color: '#3d3d3d', scale: 1.8 }),
    PropBuilders.building(16, -16, { color: '#4a4a4a', scale: 2 }),
    PropBuilders.building(-16, 16, { color: '#3d3d3d', scale: 1.8 }),
    PropBuilders.building(16, 12, { color: '#4a4a4a', scale: 2 }),

    // Gravestones (small grey rocks)
    PropBuilders.rock(-14, -12, { color: '#7f8c8d', scale: 0.4 }),
    PropBuilders.rock(-12, -14, { color: '#95a5a6', scale: 0.5 }),
    PropBuilders.rock(-10, -12, { color: '#7f8c8d', scale: 0.4 }),
    PropBuilders.rock(-14, -8, { color: '#95a5a6', scale: 0.5 }),
    PropBuilders.rock(-12, -6, { color: '#7f8c8d', scale: 0.4 }),
    PropBuilders.rock(-10, -8, { color: '#95a5a6', scale: 0.5 }),
    PropBuilders.rock(-6, -14, { color: '#7f8c8d', scale: 0.4 }),
    PropBuilders.rock(-4, -12, { color: '#95a5a6', scale: 0.5 }),
    PropBuilders.rock(-6, -10, { color: '#7f8c8d', scale: 0.4 }),

    PropBuilders.rock(14, -12, { color: '#7f8c8d', scale: 0.4 }),
    PropBuilders.rock(12, -14, { color: '#95a5a6', scale: 0.5 }),
    PropBuilders.rock(10, -12, { color: '#7f8c8d', scale: 0.4 }),
    PropBuilders.rock(14, -8, { color: '#95a5a6', scale: 0.5 }),
    PropBuilders.rock(12, -6, { color: '#7f8c8d', scale: 0.4 }),
    PropBuilders.rock(10, -8, { color: '#95a5a6', scale: 0.5 }),

    PropBuilders.rock(-14, 12, { color: '#7f8c8d', scale: 0.4 }),
    PropBuilders.rock(-12, 14, { color: '#95a5a6', scale: 0.5 }),
    PropBuilders.rock(-10, 12, { color: '#7f8c8d', scale: 0.4 }),
    PropBuilders.rock(-6, 14, { color: '#95a5a6', scale: 0.5 }),
    PropBuilders.rock(-4, 12, { color: '#7f8c8d', scale: 0.4 }),

    PropBuilders.rock(6, 14, { color: '#7f8c8d', scale: 0.4 }),
    PropBuilders.rock(4, 16, { color: '#95a5a6', scale: 0.5 }),

    // Dead trees (dark and twisted)
    PropBuilders.tree(-18, -8, { color: '#2c2c2c', scale: 1.2 }),
    PropBuilders.tree(-18, 0, { color: '#1a1a1a', scale: 1.5 }),
    PropBuilders.tree(-18, 8, { color: '#2c2c2c', scale: 1.3 }),
    PropBuilders.tree(18, -8, { color: '#1a1a1a', scale: 1.4 }),
    PropBuilders.tree(18, 0, { color: '#2c2c2c', scale: 1.2 }),
    PropBuilders.tree(18, 8, { color: '#1a1a1a', scale: 1.5 }),
    PropBuilders.tree(0, -18, { color: '#2c2c2c', scale: 1.3 }),

    // Iron fences
    PropBuilders.fence(-16, -18, { color: '#1a1a1a' }),
    PropBuilders.fence(-12, -18, { color: '#1a1a1a' }),
    PropBuilders.fence(-8, -18, { color: '#1a1a1a' }),
    PropBuilders.fence(8, -18, { color: '#1a1a1a' }),
    PropBuilders.fence(12, -18, { color: '#1a1a1a' }),
    PropBuilders.fence(16, -18, { color: '#1a1a1a' }),

    PropBuilders.fence(-18, -16, { color: '#1a1a1a', rotation: Math.PI / 2 }),
    PropBuilders.fence(-18, -12, { color: '#1a1a1a', rotation: Math.PI / 2 }),
    PropBuilders.fence(-18, -8, { color: '#1a1a1a', rotation: Math.PI / 2 }),
    PropBuilders.fence(-18, 8, { color: '#1a1a1a', rotation: Math.PI / 2 }),
    PropBuilders.fence(-18, 12, { color: '#1a1a1a', rotation: Math.PI / 2 }),
    PropBuilders.fence(-18, 16, { color: '#1a1a1a', rotation: Math.PI / 2 }),

    PropBuilders.fence(18, -16, { color: '#1a1a1a', rotation: Math.PI / 2 }),
    PropBuilders.fence(18, -12, { color: '#1a1a1a', rotation: Math.PI / 2 }),
    PropBuilders.fence(18, -8, { color: '#1a1a1a', rotation: Math.PI / 2 }),
    PropBuilders.fence(18, 8, { color: '#1a1a1a', rotation: Math.PI / 2 }),

    // Open graves (dark pits represented as black crates)
    PropBuilders.crate(-8, -4, { color: '#0a0a0a', scale: 0.6 }),
    PropBuilders.crate(-4, -8, { color: '#0a0a0a', scale: 0.6 }),
    PropBuilders.crate(4, -4, { color: '#0a0a0a', scale: 0.6 }),

    // Gargoyle statues (small grey blocks)
    PropBuilders.building(-2, -16, { color: '#5a5a5a', scale: 0.6 }),
    PropBuilders.building(2, -16, { color: '#5a5a5a', scale: 0.6 }),
  ],

  // Dark foggy cemetery lighting
  lighting: {
    ambientIntensity: 0.3,
    ambientColor: '#4a4a6e',
    directionalIntensity: 0.5,
    directionalColor: '#b8c5d6',
    directionalPosition: [5, 15, 5],
    fogColor: '#2a2a3e',
    fogNear: 15,
    fogFar: 50,
  },

  // Ground and path colors
  groundColor: '#2d3436',
  pathColor: '#4a4a4a',

  // Starting resources
  startingMoney: 600,
  startingLives: 20,

  // Wave configuration
  totalWaves: 8,
  customWaves: [
    {
      waveNumber: 1,
      spawns: [
        { typeId: 'walker', count: 10, delay: 1000 },
        { typeId: 'crawler', count: 5, delay: 700 },
      ],
      duration: 12000,
      totalZombies: 15,
    },
    {
      waveNumber: 2,
      spawns: [
        { typeId: 'walker', count: 12, delay: 900 },
        { typeId: 'tank', count: 2, delay: 2000 },
      ],
      duration: 14000,
      totalZombies: 14,
    },
    {
      waveNumber: 3,
      spawns: [
        { typeId: 'tank', count: 4, delay: 1800 },
        { typeId: 'walker', count: 10, delay: 800 },
        { typeId: 'crawler', count: 8, delay: 500 },
      ],
      duration: 18000,
      totalZombies: 22,
    },
    {
      waveNumber: 4,
      spawns: [
        { typeId: 'runner', count: 15, delay: 400 },
        { typeId: 'tank', count: 3, delay: 1500 },
        { typeId: 'walker', count: 12, delay: 700 },
      ],
      duration: 18000,
      totalZombies: 30,
    },
    {
      waveNumber: 5,
      spawns: [
        { typeId: 'tank', count: 6, delay: 1200 },
        { typeId: 'walker', count: 15, delay: 600 },
        { typeId: 'runner', count: 10, delay: 500 },
      ],
      duration: 20000,
      totalZombies: 31,
    },
    {
      waveNumber: 6,
      spawns: [
        { typeId: 'tank', count: 8, delay: 1000 },
        { typeId: 'runner', count: 12, delay: 350 },
        { typeId: 'crawler', count: 15, delay: 300 },
      ],
      duration: 20000,
      totalZombies: 35,
    },
    {
      waveNumber: 7,
      spawns: [
        { typeId: 'tank', count: 10, delay: 900 },
        { typeId: 'walker', count: 20, delay: 500 },
        { typeId: 'runner', count: 15, delay: 350 },
        { typeId: 'crawler', count: 10, delay: 250 },
      ],
      duration: 22000,
      totalZombies: 55,
    },
    {
      waveNumber: 8,
      spawns: [
        { typeId: 'tank', count: 12, delay: 800 },
        { typeId: 'walker', count: 25, delay: 450 },
        { typeId: 'runner', count: 20, delay: 300 },
        { typeId: 'crawler', count: 15, delay: 200 },
      ],
      duration: 24000,
      totalZombies: 72,
    },
  ],

  // Available towers (all basic types)
  availableTowers: ['basic', 'rapid', 'sniper', 'splash'],

  // Enemy types that appear
  enemyTypes: ['walker', 'crawler', 'runner', 'tank'],

  // Difficulty rating
  difficulty: 3,
};

export default level3Config;
