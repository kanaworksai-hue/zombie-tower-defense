/**
 * Level 1 - Suburban Streets
 * Tutorial level with simple curved path and basic zombies
 */

import { PropBuilders } from './levelTypes.js';

/**
 * Level 1 configuration
 * Simple curved path through a suburban neighborhood
 * Introduces basic gameplay mechanics
 */
export const level1Config = {
  id: 'level1',
  name: 'Suburban Streets',
  description: 'The infection started in the suburbs. Defend the neighborhood from the initial wave of walkers.',
  gridSize: 16,

  // Simple curved S-path
  pathWaypoints: [
    { x: 0, z: 8 },
    { x: 3, z: 8 },
    { x: 5, z: 6 },
    { x: 5, z: 4 },
    { x: 7, z: 2 },
    { x: 10, z: 2 },
    { x: 12, z: 4 },
    { x: 12, z: 8 },
    { x: 10, z: 10 },
    { x: 7, z: 10 },
    { x: 5, z: 12 },
    { x: 5, z: 14 },
    { x: 8, z: 15 },
    { x: 12, z: 15 },
    { x: 15, z: 15 },
  ],

  // Suburban environment props
  environmentProps: [
    // Houses along the top
    PropBuilders.building(-12, -12, { color: '#e74c3c', scale: 1.5 }),
    PropBuilders.building(-4, -12, { color: '#3498db', scale: 1.5 }),
    PropBuilders.building(4, -12, { color: '#f39c12', scale: 1.5 }),
    PropBuilders.building(12, -12, { color: '#9b59b6', scale: 1.5 }),

    // Houses along the bottom
    PropBuilders.building(-12, 12, { color: '#1abc9c', scale: 1.5 }),
    PropBuilders.building(12, 4, { color: '#e67e22', scale: 1.5 }),

    // Trees scattered around
    PropBuilders.tree(-14, -6, { color: '#2d5016' }),
    PropBuilders.tree(-10, -2, { color: '#2d5016' }),
    PropBuilders.tree(-14, 2, { color: '#2d5016' }),
    PropBuilders.tree(-10, 6, { color: '#2d5016' }),
    PropBuilders.tree(14, -6, { color: '#2d5016' }),
    PropBuilders.tree(10, -2, { color: '#2d5016' }),
    PropBuilders.tree(14, 2, { color: '#2d5016' }),
    PropBuilders.tree(2, 6, { color: '#2d5016' }),
    PropBuilders.tree(-6, 10, { color: '#2d5016' }),
    PropBuilders.tree(-2, 14, { color: '#2d5016' }),

    // Street lamps (represented as small cylinders)
    PropBuilders.rock(-8, -8, { color: '#f1c40f', scale: 0.3 }),
    PropBuilders.rock(0, -8, { color: '#f1c40f', scale: 0.3 }),
    PropBuilders.rock(8, -8, { color: '#f1c40f', scale: 0.3 }),
    PropBuilders.rock(-8, 8, { color: '#f1c40f', scale: 0.3 }),
    PropBuilders.rock(0, 8, { color: '#f1c40f', scale: 0.3 }),

    // Fences
    PropBuilders.fence(-14, -8, { rotation: 0 }),
    PropBuilders.fence(-14, -4, { rotation: 0 }),
    PropBuilders.fence(-14, 0, { rotation: 0 }),
    PropBuilders.fence(-14, 4, { rotation: 0 }),
    PropBuilders.fence(14, -8, { rotation: 0 }),
    PropBuilders.fence(14, -4, { rotation: 0 }),
    PropBuilders.fence(14, 0, { rotation: 0 }),

    // Mailboxes
    PropBuilders.crate(-10, -10, { color: '#34495e', scale: 0.4 }),
    PropBuilders.crate(-2, -10, { color: '#34495e', scale: 0.4 }),
    PropBuilders.crate(6, -10, { color: '#34495e', scale: 0.4 }),
  ],

  // Daytime suburban lighting
  lighting: {
    ambientIntensity: 0.6,
    ambientColor: '#ffffff',
    directionalIntensity: 1.0,
    directionalColor: '#fff5e6',
    directionalPosition: [10, 20, 10],
    fogColor: '#87ceeb',
    fogNear: 30,
    fogFar: 60,
  },

  // Ground and path colors
  groundColor: '#4a7c59',
  pathColor: '#7f8c8d',

  // Starting resources
  startingMoney: 400,
  startingLives: 20,

  // Wave configuration
  totalWaves: 5,
  customWaves: [
    {
      waveNumber: 1,
      spawns: [{ typeId: 'walker', count: 5, delay: 1500 }],
      duration: 8000,
      totalZombies: 5,
    },
    {
      waveNumber: 2,
      spawns: [{ typeId: 'walker', count: 8, delay: 1200 }],
      duration: 10000,
      totalZombies: 8,
    },
    {
      waveNumber: 3,
      spawns: [
        { typeId: 'walker', count: 10, delay: 1000 },
        { typeId: 'crawler', count: 3, delay: 800 },
      ],
      duration: 12000,
      totalZombies: 13,
    },
    {
      waveNumber: 4,
      spawns: [
        { typeId: 'walker', count: 12, delay: 900 },
        { typeId: 'crawler', count: 5, delay: 700 },
      ],
      duration: 14000,
      totalZombies: 17,
    },
    {
      waveNumber: 5,
      spawns: [
        { typeId: 'walker', count: 15, delay: 800 },
        { typeId: 'crawler', count: 8, delay: 600 },
        { typeId: 'runner', count: 3, delay: 1000 },
      ],
      duration: 16000,
      totalZombies: 26,
    },
  ],

  // Available towers (basic set for tutorial)
  availableTowers: ['basic', 'rapid'],

  // Enemy types that appear
  enemyTypes: ['walker', 'crawler', 'runner'],

  // Difficulty rating
  difficulty: 1,
};

export default level1Config;
