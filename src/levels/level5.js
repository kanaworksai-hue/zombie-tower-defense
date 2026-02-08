/**
 * Level 5 - Laboratory
 * Final level with all enemy types including boss
 */

import { PropBuilders } from './levelTypes.js';

/**
 * Level 5 configuration
 * Secret underground laboratory where the infection originated
 * Ultimate challenge with all enemy types and multiple bosses
 */
export const level5Config = {
  id: 'level5',
  name: 'Laboratory',
  description: 'The source of the outbreak. Stop the experiments before the undead horde escapes to the surface.',
  gridSize: 24,

  // Complex laboratory path with multiple sections
  pathWaypoints: [
    { x: 0, z: 12 },
    { x: 4, z: 12 },
    { x: 6, z: 10 },
    { x: 6, z: 7 },
    { x: 4, z: 5 },
    { x: 4, z: 3 },
    { x: 7, z: 3 },
    { x: 9, z: 5 },
    { x: 9, z: 9 },
    { x: 11, z: 11 },
    { x: 14, z: 11 },
    { x: 16, z: 9 },
    { x: 16, z: 6 },
    { x: 14, z: 4 },
    { x: 17, z: 4 },
    { x: 19, z: 6 },
    { x: 19, z: 10 },
    { x: 17, z: 13 },
    { x: 14, z: 15 },
    { x: 12, z: 17 },
    { x: 12, z: 20 },
    { x: 15, z: 22 },
    { x: 19, z: 22 },
    { x: 21, z: 20 },
    { x: 21, z: 16 },
    { x: 23, z: 14 },
  ],

  // Laboratory environment props
  environmentProps: [
    // Main laboratory structures (sterile white/grey)
    PropBuilders.building(-20, -20, { color: '#ecf0f1', scale: 3 }),
    PropBuilders.building(-12, -20, { color: '#bdc3c7', scale: 3 }),
    PropBuilders.building(-4, -20, { color: '#ecf0f1', scale: 3 }),
    PropBuilders.building(4, -20, { color: '#bdc3c7', scale: 3 }),
    PropBuilders.building(12, -20, { color: '#ecf0f1', scale: 3 }),

    // Containment cells (glass-like blue)
    PropBuilders.building(-20, -12, { color: '#3498db', scale: 2 }),
    PropBuilders.building(-20, -4, { color: '#2980b9', scale: 2 }),
    PropBuilders.building(-20, 4, { color: '#3498db', scale: 2 }),
    PropBuilders.building(-20, 12, { color: '#2980b9', scale: 2 }),
    PropBuilders.building(-20, 20, { color: '#3498db', scale: 2 }),

    // Server rooms
    PropBuilders.building(20, -12, { color: '#2c3e50', scale: 2 }),
    PropBuilders.building(20, -4, { color: '#34495e', scale: 2 }),
    PropBuilders.building(20, 4, { color: '#2c3e50', scale: 2 }),

    // Research stations
    PropBuilders.building(-12, 0, { color: '#95a5a6', scale: 1.5 }),
    PropBuilders.building(0, 0, { color: '#7f8c8d', scale: 1.5 }),
    PropBuilders.building(12, 0, { color: '#95a5a6', scale: 1.5 }),

    // Chemical storage (yellow warning)
    PropBuilders.barrel(-16, -16, { color: '#f1c40f' }),
    PropBuilders.barrel(-14, -16, { color: '#f1c40f' }),
    PropBuilders.barrel(-16, -14, { color: '#f1c40f' }),
    PropBuilders.barrel(16, -16, { color: '#f1c40f' }),
    PropBuilders.barrel(18, -16, { color: '#f1c40f' }),

    // Toxic waste (green barrels)
    PropBuilders.barrel(-8, -16, { color: '#27ae60' }),
    PropBuilders.barrel(-6, -16, { color: '#27ae60' }),
    PropBuilders.barrel(8, -16, { color: '#27ae60' }),
    PropBuilders.barrel(10, -16, { color: '#27ae60' }),

    // Hazardous material crates
    PropBuilders.crate(-18, -8, { color: '#e74c3c', scale: 0.8 }),
    PropBuilders.crate(-16, -8, { color: '#e74c3c', scale: 0.8 }),
    PropBuilders.crate(18, -8, { color: '#e74c3c', scale: 0.8 }),
    PropBuilders.crate(16, -8, { color: '#e74c3c', scale: 0.8 }),

    // Laboratory equipment
    PropBuilders.crate(-4, -8, { color: '#ecf0f1', scale: 0.6 }),
    PropBuilders.crate(-2, -8, { color: '#bdc3c7', scale: 0.6 }),
    PropBuilders.crate(0, -8, { color: '#ecf0f1', scale: 0.6 }),
    PropBuilders.crate(2, -8, { color: '#bdc3c7', scale: 0.6 }),

    // Ventilation shafts
    PropBuilders.building(-8, 8, { color: '#7f8c8d', scale: 0.8 }),
    PropBuilders.building(8, 8, { color: '#7f8c8d', scale: 0.8 }),
    PropBuilders.building(-8, 16, { color: '#7f8c8d', scale: 0.8 }),
    PropBuilders.building(8, 16, { color: '#7f8c8d', scale: 0.8 }),

    // Security barriers
    PropBuilders.fence(-22, -22, { color: '#c0392b' }),
    PropBuilders.fence(-18, -22, { color: '#c0392b' }),
    PropBuilders.fence(-14, -22, { color: '#c0392b' }),
    PropBuilders.fence(-10, -22, { color: '#c0392b' }),
    PropBuilders.fence(-6, -22, { color: '#c0392b' }),
    PropBuilders.fence(-2, -22, { color: '#c0392b' }),
    PropBuilders.fence(2, -22, { color: '#c0392b' }),
    PropBuilders.fence(6, -22, { color: '#c0392b' }),
    PropBuilders.fence(10, -22, { color: '#c0392b' }),
    PropBuilders.fence(14, -22, { color: '#c0392b' }),
    PropBuilders.fence(18, -22, { color: '#c0392b' }),

    // Laser barriers (glowing red markers)
    PropBuilders.rock(-12, -4, { color: '#e74c3c', scale: 0.3 }),
    PropBuilders.rock(-10, -4, { color: '#e74c3c', scale: 0.3 }),
    PropBuilders.rock(10, -4, { color: '#e74c3c', scale: 0.3 }),
    PropBuilders.rock(12, -4, { color: '#e74c3c', scale: 0.3 }),

    // Experiment pods (cryo chambers)
    PropBuilders.building(-16, 8, { color: '#9b59b6', scale: 1.2 }),
    PropBuilders.building(-14, 12, { color: '#8e44ad', scale: 1.2 }),
    PropBuilders.building(16, 8, { color: '#9b59b6', scale: 1.2 }),
    PropBuilders.building(14, 12, { color: '#8e44ad', scale: 1.2 }),

    // Broken equipment (scattered debris)
    PropBuilders.rock(-6, 4, { color: '#5d6d7e', scale: 0.4 }),
    PropBuilders.rock(-4, 6, { color: '#5d6d7e', scale: 0.3 }),
    PropBuilders.rock(6, 4, { color: '#5d6d7e', scale: 0.5 }),
    PropBuilders.rock(4, 6, { color: '#5d6d7e', scale: 0.4 }),

    // Emergency exit signs (green glow)
    PropBuilders.crate(-22, -12, { color: '#2ecc71', scale: 0.2 }),
    PropBuilders.crate(-22, 0, { color: '#2ecc71', scale: 0.2 }),
    PropBuilders.crate(-22, 12, { color: '#2ecc71', scale: 0.2 }),

    // Central reactor core
    PropBuilders.building(0, -4, { color: '#e74c3c', scale: 2 }),
  ],

  // Laboratory lighting (sterile with emergency red tones)
  lighting: {
    ambientIntensity: 0.4,
    ambientColor: '#e8e8e8',
    directionalIntensity: 0.7,
    directionalColor: '#ffe4e1',
    directionalPosition: [8, 20, 8],
    fogColor: '#2c3e50',
    fogNear: 20,
    fogFar: 60,
  },

  // Ground and path colors
  groundColor: '#34495e',
  pathColor: '#5d6d7e',

  // Starting resources
  startingMoney: 1000,
  startingLives: 20,

  // Wave configuration - ultimate challenge
  totalWaves: 12,
  customWaves: [
    {
      waveNumber: 1,
      spawns: [
        { typeId: 'walker', count: 15, delay: 800 },
        { typeId: 'crawler', count: 8, delay: 500 },
      ],
      duration: 15000,
      totalZombies: 23,
    },
    {
      waveNumber: 2,
      spawns: [
        { typeId: 'runner', count: 15, delay: 400 },
        { typeId: 'walker', count: 12, delay: 700 },
        { typeId: 'crawler', count: 10, delay: 450 },
      ],
      duration: 15000,
      totalZombies: 37,
    },
    {
      waveNumber: 3,
      spawns: [
        { typeId: 'tank', count: 5, delay: 1200 },
        { typeId: 'walker', count: 18, delay: 600 },
        { typeId: 'runner', count: 10, delay: 500 },
      ],
      duration: 18000,
      totalZombies: 33,
    },
    {
      waveNumber: 4,
      spawns: [
        { typeId: 'runner', count: 25, delay: 300 },
        { typeId: 'tank', count: 4, delay: 1000 },
        { typeId: 'crawler', count: 15, delay: 350 },
      ],
      duration: 20000,
      totalZombies: 44,
    },
    {
      waveNumber: 5,
      spawns: [
        { typeId: 'tank', count: 8, delay: 900 },
        { typeId: 'runner', count: 20, delay: 350 },
        { typeId: 'walker', count: 20, delay: 550 },
        { typeId: 'crawler', count: 15, delay: 300 },
      ],
      duration: 22000,
      totalZombies: 63,
    },
    {
      waveNumber: 6,
      spawns: [
        { typeId: 'boss', count: 1, delay: 0 },
        { typeId: 'tank', count: 6, delay: 800 },
        { typeId: 'runner', count: 15, delay: 400 },
        { typeId: 'walker', count: 25, delay: 500 },
      ],
      duration: 22000,
      totalZombies: 47,
    },
    {
      waveNumber: 7,
      spawns: [
        { typeId: 'tank', count: 12, delay: 700 },
        { typeId: 'runner', count: 30, delay: 280 },
        { typeId: 'walker', count: 25, delay: 450 },
        { typeId: 'crawler', count: 20, delay: 250 },
      ],
      duration: 24000,
      totalZombies: 87,
    },
    {
      waveNumber: 8,
      spawns: [
        { typeId: 'runner', count: 40, delay: 220 },
        { typeId: 'tank', count: 10, delay: 600 },
        { typeId: 'crawler', count: 25, delay: 200 },
        { typeId: 'walker', count: 20, delay: 400 },
      ],
      duration: 25000,
      totalZombies: 95,
    },
    {
      waveNumber: 9,
      spawns: [
        { typeId: 'tank', count: 15, delay: 550 },
        { typeId: 'runner', count: 35, delay: 250 },
        { typeId: 'walker', count: 30, delay: 380 },
        { typeId: 'crawler', count: 25, delay: 180 },
      ],
      duration: 26000,
      totalZombies: 105,
    },
    {
      waveNumber: 10,
      spawns: [
        { typeId: 'boss', count: 2, delay: 3000 },
        { typeId: 'tank', count: 12, delay: 700 },
        { typeId: 'runner', count: 25, delay: 300 },
        { typeId: 'walker', count: 35, delay: 400 },
        { typeId: 'crawler', count: 20, delay: 220 },
      ],
      duration: 28000,
      totalZombies: 94,
    },
    {
      waveNumber: 11,
      spawns: [
        { typeId: 'tank', count: 20, delay: 500 },
        { typeId: 'runner', count: 45, delay: 200 },
        { typeId: 'walker', count: 40, delay: 350 },
        { typeId: 'crawler', count: 30, delay: 150 },
      ],
      duration: 28000,
      totalZombies: 135,
    },
    {
      waveNumber: 12,
      spawns: [
        { typeId: 'boss', count: 3, delay: 4000 },
        { typeId: 'tank', count: 15, delay: 600 },
        { typeId: 'runner', count: 40, delay: 250 },
        { typeId: 'walker', count: 50, delay: 320 },
        { typeId: 'crawler', count: 35, delay: 180 },
      ],
      duration: 30000,
      totalZombies: 143,
    },
  ],

  // Available towers (all types)
  availableTowers: ['basic', 'rapid', 'sniper', 'splash', 'freeze'],

  // Enemy types that appear
  enemyTypes: ['walker', 'crawler', 'runner', 'tank', 'boss'],

  // Difficulty rating
  difficulty: 5,
};

export default level5Config;
