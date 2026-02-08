/**
 * Level 2 - Construction Site
 * Multiple path branches with fast zombies
 */

import { PropBuilders } from './levelTypes.js';

/**
 * Level 2 configuration
 * Construction site with multiple branching paths
 * Introduces runners and strategic tower placement
 */
export const level2Config = {
  id: 'level2',
  name: 'Construction Site',
  description: 'The construction site has become a maze of scaffolding and barriers. Fast zombies are coming through the gaps.',
  gridSize: 18,

  // Branching path that splits and rejoins
  pathWaypoints: [
    { x: 0, z: 9 },
    { x: 4, z: 9 },
    { x: 6, z: 7 },
    { x: 6, z: 5 },
    { x: 8, z: 3 },
    { x: 11, z: 3 },
    { x: 13, z: 5 },
    { x: 13, z: 9 },
    { x: 11, z: 11 },
    { x: 8, z: 11 },
    { x: 6, z: 13 },
    { x: 6, z: 15 },
    { x: 9, z: 17 },
    { x: 13, z: 17 },
    { x: 15, z: 15 },
    { x: 15, z: 11 },
    { x: 17, z: 9 },
  ],

  // Construction site environment
  environmentProps: [
    // Construction barriers (orange)
    PropBuilders.building(-14, -6, { color: '#ff6b35', scale: 1 }),
    PropBuilders.building(-14, 0, { color: '#ff6b35', scale: 1 }),
    PropBuilders.building(-14, 6, { color: '#ff6b35', scale: 1 }),
    PropBuilders.building(14, -10, { color: '#ff6b35', scale: 1 }),
    PropBuilders.building(14, 10, { color: '#ff6b35', scale: 1 }),

    // Scaffolding towers (grey metal)
    PropBuilders.building(-8, -12, { color: '#7f8c8d', scale: 2 }),
    PropBuilders.building(0, -12, { color: '#7f8c8d', scale: 2 }),
    PropBuilders.building(8, -12, { color: '#7f8c8d', scale: 2 }),
    PropBuilders.building(-8, 12, { color: '#7f8c8d', scale: 2 }),
    PropBuilders.building(0, 12, { color: '#7f8c8d', scale: 2 }),

    // Construction materials - crates
    PropBuilders.crate(-12, -8, { color: '#d35400' }),
    PropBuilders.crate(-10, -8, { color: '#e67e22' }),
    PropBuilders.crate(-12, -6, { color: '#d35400' }),
    PropBuilders.crate(12, -6, { color: '#d35400' }),
    PropBuilders.crate(14, -6, { color: '#e67e22' }),
    PropBuilders.crate(-12, 8, { color: '#d35400' }),
    PropBuilders.crate(-10, 8, { color: '#e67e22' }),
    PropBuilders.crate(12, 6, { color: '#d35400' }),

    // Barrels
    PropBuilders.barrel(-6, -10, { color: '#c0392b' }),
    PropBuilders.barrel(-4, -10, { color: '#c0392b' }),
    PropBuilders.barrel(6, -8, { color: '#c0392b' }),
    PropBuilders.barrel(8, -8, { color: '#c0392b' }),
    PropBuilders.barrel(-6, 10, { color: '#c0392b' }),
    PropBuilders.barrel(-4, 10, { color: '#c0392b' }),

    // Piles of dirt/rocks
    PropBuilders.rock(-10, 0, { color: '#5d4e37', scale: 1.2 }),
    PropBuilders.rock(10, 0, { color: '#5d4e37', scale: 1.2 }),
    PropBuilders.rock(-6, -4, { color: '#6b5b4f', scale: 0.8 }),
    PropBuilders.rock(6, 4, { color: '#6b5b4f', scale: 0.8 }),

    // Construction cones (small yellow markers)
    PropBuilders.crate(-2, -6, { color: '#f1c40f', scale: 0.3 }),
    PropBuilders.crate(2, -6, { color: '#f1c40f', scale: 0.3 }),
    PropBuilders.crate(-2, 6, { color: '#f1c40f', scale: 0.3 }),
    PropBuilders.crate(2, 6, { color: '#f1c40f', scale: 0.3 }),

    // Porta-potty
    PropBuilders.building(10, 10, { color: '#3498db', scale: 0.8 }),

    // Construction equipment (excavator base)
    PropBuilders.building(-10, 14, { color: '#f39c12', scale: 1.2 }),
  ],

  // Overcast construction lighting
  lighting: {
    ambientIntensity: 0.5,
    ambientColor: '#e0e0e0',
    directionalIntensity: 0.8,
    directionalColor: '#fff8dc',
    directionalPosition: [15, 25, 5],
    fogColor: '#b8b8b8',
    fogNear: 25,
    fogFar: 55,
  },

  // Ground and path colors
  groundColor: '#8b7355',
  pathColor: '#a0a0a0',

  // Starting resources
  startingMoney: 500,
  startingLives: 20,

  // Wave configuration
  totalWaves: 7,
  customWaves: [
    {
      waveNumber: 1,
      spawns: [
        { typeId: 'walker', count: 8, delay: 1200 },
        { typeId: 'crawler', count: 3, delay: 800 },
      ],
      duration: 12000,
      totalZombies: 11,
    },
    {
      waveNumber: 2,
      spawns: [
        { typeId: 'walker', count: 10, delay: 1000 },
        { typeId: 'runner', count: 5, delay: 600 },
      ],
      duration: 12000,
      totalZombies: 15,
    },
    {
      waveNumber: 3,
      spawns: [
        { typeId: 'runner', count: 10, delay: 500 },
        { typeId: 'walker', count: 8, delay: 900 },
      ],
      duration: 12000,
      totalZombies: 18,
    },
    {
      waveNumber: 4,
      spawns: [
        { typeId: 'walker', count: 15, delay: 800 },
        { typeId: 'runner', count: 8, delay: 400 },
        { typeId: 'crawler', count: 5, delay: 600 },
      ],
      duration: 15000,
      totalZombies: 28,
    },
    {
      waveNumber: 5,
      spawns: [
        { typeId: 'runner', count: 15, delay: 350 },
        { typeId: 'walker', count: 10, delay: 700 },
        { typeId: 'tank', count: 2, delay: 2000 },
      ],
      duration: 18000,
      totalZombies: 27,
    },
    {
      waveNumber: 6,
      spawns: [
        { typeId: 'runner', count: 20, delay: 300 },
        { typeId: 'walker', count: 12, delay: 600 },
        { typeId: 'crawler', count: 10, delay: 400 },
      ],
      duration: 18000,
      totalZombies: 42,
    },
    {
      waveNumber: 7,
      spawns: [
        { typeId: 'runner', count: 15, delay: 300 },
        { typeId: 'walker', count: 15, delay: 500 },
        { typeId: 'tank', count: 3, delay: 1500 },
        { typeId: 'crawler', count: 8, delay: 350 },
      ],
      duration: 20000,
      totalZombies: 41,
    },
  ],

  // Available towers (expanded set)
  availableTowers: ['basic', 'rapid', 'sniper'],

  // Enemy types that appear
  enemyTypes: ['walker', 'crawler', 'runner', 'tank'],

  // Difficulty rating
  difficulty: 2,
};

export default level2Config;
