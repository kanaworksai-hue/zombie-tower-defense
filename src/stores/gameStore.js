/**
 * Game state management using Zustand
 * Central store for all game state
 */
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { INITIAL_GAME_STATE, GRID_SIZE, TOWER_TYPES, ZOMBIE_TYPES } from '../constants/game';

// Generate unique IDs
let idCounter = 0;
export const generateId = (prefix = 'id') => `${prefix}_${++idCounter}_${Date.now()}`;

// Create initial grid
const createInitialGrid = () => {
  const grid = [];
  for (let x = 0; x < GRID_SIZE; x++) {
    for (let z = 0; z < GRID_SIZE; z++) {
      grid.push({
        x,
        z,
        isPath: false,
        isOccupied: false,
        towerId: null,
      });
    }
  }
  return grid;
};

// Default path (S-shape)
const DEFAULT_PATH = [
  { x: 0, z: 10 },
  { x: 5, z: 10 },
  { x: 5, z: 5 },
  { x: 15, z: 5 },
  { x: 15, z: 15 },
  { x: 19, z: 15 },
];

export const useGameStore = create(
  immer((set, get) => ({
    // Core game state
    money: INITIAL_GAME_STATE.money,
    lives: INITIAL_GAME_STATE.lives,
    score: INITIAL_GAME_STATE.score,
    level: INITIAL_GAME_STATE.level,
    isPlaying: INITIAL_GAME_STATE.isPlaying,
    isPaused: INITIAL_GAME_STATE.isPaused,
    selectedTowerType: INITIAL_GAME_STATE.selectedTowerType,
    gameOverReason: INITIAL_GAME_STATE.gameOverReason,

    // Entities
    towers: [],
    zombies: [],
    projectiles: [],
    grid: createInitialGrid(),
    path: DEFAULT_PATH,

    // Wave state
    wave: {
      waveNumber: 0,
      spawns: [],
      spawnTimer: 0,
      zombiesRemaining: 0,
      isActive: false,
      isComplete: true,
    },

    // Actions

    // Start the game
    startGame: () => {
      set((state) => {
        state.isPlaying = true;
        state.isPaused = false;
        state.money = INITIAL_GAME_STATE.money;
        state.lives = INITIAL_GAME_STATE.lives;
        state.score = INITIAL_GAME_STATE.score;
        state.level = 1;
        state.towers = [];
        state.zombies = [];
        state.projectiles = [];
        state.grid = createInitialGrid();
        state.gameOverReason = null;
        state.wave = {
          waveNumber: 0,
          spawns: [],
          spawnTimer: WAVE_DELAY,
          zombiesRemaining: 0,
          isActive: false,
          isComplete: true,
        };
      });
      get().startNextWave();
    },

    // Pause/resume
    togglePause: () => {
      set((state) => {
        state.isPaused = !state.isPaused;
      });
    },

    // Select tower type for placement
    selectTowerType: (towerTypeId) => {
      set((state) => {
        state.selectedTowerType = towerTypeId;
      });
    },

    // Deselect tower type
    deselectTowerType: () => {
      set((state) => {
        state.selectedTowerType = null;
      });
    },

    // Selected tower (for upgrades/selling)
    selectedTowerId: null,

    // Select a placed tower
    selectTower: (towerId) => {
      set((state) => {
        state.selectedTowerId = towerId;
      });
    },

    // Deselect placed tower
    deselectTower: () => {
      set((state) => {
        state.selectedTowerId = null;
      });
    },

    // Place a tower
    placeTower: (gridX, gridZ) => {
      const state = get();
      const towerType = TOWER_TYPES[state.selectedTowerType?.toUpperCase()];

      if (!towerType) return false;
      if (state.money < towerType.cost) return false;

      const cell = state.grid.find((c) => c.x === gridX && c.z === gridZ);
      if (!cell || cell.isPath || cell.isOccupied) return false;

      const towerId = generateId('tower');

      set((draft) => {
        // Deduct money
        draft.money -= towerType.cost;

        // Add tower
        draft.towers.push({
          id: towerId,
          typeId: towerType.id,
          position: { x: gridX, y: 0, z: gridZ },
          level: 1,
          lastFired: 0,
          targetId: null,
          rotation: 0,
        });

        // Mark grid cell
        const gridCell = draft.grid.find((c) => c.x === gridX && c.z === gridZ);
        if (gridCell) {
          gridCell.isOccupied = true;
          gridCell.towerId = towerId;
        }

        // Deselect after placement
        draft.selectedTowerType = null;
      });

      return true;
    },

    // Sell a tower
    sellTower: (towerId) => {
      set((state) => {
        const tower = state.towers.find((t) => t.id === towerId);
        if (!tower) return;

        const towerType = TOWER_TYPES[tower.typeId.toUpperCase()];
        const sellValue = Math.floor(towerType.cost * SELL_RETURN_PERCENTAGE * tower.level);

        // Refund money
        state.money += sellValue;

        // Remove tower
        state.towers = state.towers.filter((t) => t.id !== towerId);

        // Free grid cell
        const cell = state.grid.find(
          (c) => c.x === tower.position.x && c.z === tower.position.z
        );
        if (cell) {
          cell.isOccupied = false;
          cell.towerId = null;
        }
      });
    },

    // Upgrade a tower
    upgradeTower: (towerId) => {
      set((state) => {
        const tower = state.towers.find((t) => t.id === towerId);
        if (!tower || tower.level >= 5) return;

        const towerType = TOWER_TYPES[tower.typeId.toUpperCase()];
        const upgradeCost = Math.floor(towerType.cost * UPGRADE_COST_MULTIPLIER * tower.level);

        if (state.money < upgradeCost) return;

        state.money -= upgradeCost;
        tower.level += 1;
      });
    },

    // Spawn a zombie
    spawnZombie: (typeId) => {
      const zombieId = generateId('zombie');
      const zombieType = ZOMBIE_TYPES[typeId.toUpperCase()];
      const state = get();
      const startPos = state.path[0];

      set((draft) => {
        draft.zombies.push({
          id: zombieId,
          typeId: typeId,
          position: { x: startPos.x, y: 0, z: startPos.z },
          health: zombieType.health,
          maxHealth: zombieType.health,
          pathIndex: 0,
          pathProgress: 0,
          isDead: false,
          reachedEnd: false,
          slowFactor: 1,
          slowEndTime: 0,
        });
      });

      return zombieId;
    },

    // Damage a zombie
    damageZombie: (zombieId, damage) => {
      set((state) => {
        const zombie = state.zombies.find((z) => z.id === zombieId);
        if (!zombie || zombie.isDead) return;

        zombie.health -= damage;

        if (zombie.health <= 0) {
          zombie.isDead = true;
          const zombieType = ZOMBIE_TYPES[zombie.typeId.toUpperCase()];
          state.money += zombieType.reward;
          state.score += zombieType.reward * 10;
        }
      });
    },

    // Apply slow effect to zombie
    slowZombie: (zombieId, factor, duration) => {
      set((state) => {
        const zombie = state.zombies.find((z) => z.id === zombieId);
        if (!zombie || zombie.isDead) return;

        zombie.slowFactor = factor;
        zombie.slowEndTime = Date.now() + duration;
      });
    },

    // Remove dead zombies
    cleanupDeadZombies: () => {
      set((state) => {
        state.zombies = state.zombies.filter((z) => !z.isDead && !z.reachedEnd);
      });
    },

    // Zombie reaches end
    zombieReachedEnd: (zombieId) => {
      set((state) => {
        const zombie = state.zombies.find((z) => z.id === zombieId);
        if (!zombie || zombie.isDead) return;

        zombie.reachedEnd = true;
        const zombieType = ZOMBIE_TYPES[zombie.typeId.toUpperCase()];
        state.lives -= zombieType.damage;

        if (state.lives <= 0) {
          state.lives = 0;
          state.isPlaying = false;
          state.gameOverReason = 'Your base was overrun!';
        }
      });
    },

    // Create projectile
    createProjectile: (towerId, targetId, damage, speed = 20) => {
      const projectileId = generateId('projectile');
      const state = get();
      const tower = state.towers.find((t) => t.id === towerId);
      const target = state.zombies.find((z) => z.id === targetId);

      if (!tower || !target) return null;

      const towerType = TOWER_TYPES[tower.typeId.toUpperCase()];
      const startPos = {
        x: tower.position.x,
        y: 1.5,
        z: tower.position.z,
      };

      set((draft) => {
        draft.projectiles.push({
          id: projectileId,
          towerId,
          targetId,
          position: startPos,
          targetPosition: { ...target.position },
          damage,
          speed,
          isSplash: towerType.id === 'splash',
          splashRadius: towerType.splashRadius || 0,
        });
      });

      return projectileId;
    },

    // Remove projectile
    removeProjectile: (projectileId) => {
      set((state) => {
        state.projectiles = state.projectiles.filter((p) => p.id !== projectileId);
      });
    },

    // Start next wave
    startNextWave: () => {
      set((state) => {
        const nextWaveNumber = state.wave.waveNumber + 1;

        // Generate wave configuration based on wave number
        const spawns = generateWaveSpawns(nextWaveNumber);
        const totalZombies = spawns.reduce((sum, s) => sum + s.count, 0);

        state.wave = {
          waveNumber: nextWaveNumber,
          spawns,
          spawnTimer: 2000, // Initial delay before first spawn
          zombiesRemaining: totalZombies,
          isActive: true,
          isComplete: false,
        };
      });
    },

    // Update wave state (call each frame)
    updateWave: (deltaTime) => {
      set((state) => {
        if (!state.wave.isActive || state.wave.isComplete) return;

        state.wave.spawnTimer -= deltaTime * 1000;

        // Spawn zombies when timer expires
        if (state.wave.spawnTimer <= 0 && state.wave.spawns.length > 0) {
          const currentSpawn = state.wave.spawns[0];

          if (currentSpawn.count > 0) {
            // Spawn one zombie
            const zombieId = generateId('zombie');
            const zombieType = ZOMBIE_TYPES[currentSpawn.typeId.toUpperCase()];
            const startPos = state.path[0];

            state.zombies.push({
              id: zombieId,
              typeId: currentSpawn.typeId,
              position: { x: startPos.x, y: 0, z: startPos.z },
              health: zombieType.health * (1 + state.wave.waveNumber * 0.1), // Health scaling
              maxHealth: zombieType.health * (1 + state.wave.waveNumber * 0.1),
              pathIndex: 0,
              pathProgress: 0,
              isDead: false,
              reachedEnd: false,
              slowFactor: 1,
              slowEndTime: 0,
            });

            currentSpawn.count--;
            state.wave.zombiesRemaining--;
            state.wave.spawnTimer = currentSpawn.delay;
          }

          // Remove completed spawn group
          if (currentSpawn.count <= 0) {
            state.wave.spawns.shift();
          }
        }

        // Check if wave is complete
        if (state.wave.spawns.length === 0 && state.zombies.length === 0) {
          state.wave.isComplete = true;
          state.wave.isActive = false;

          // Bonus for completing wave
          state.money += 50 + state.wave.waveNumber * 10;

          // Auto-start next wave after delay
          setTimeout(() => {
            if (get().isPlaying && !get().isPaused) {
              get().startNextWave();
            }
          }, WAVE_DELAY);
        }
      });
    },

    // Set game over
    setGameOver: (reason) => {
      set((state) => {
        state.isPlaying = false;
        state.gameOverReason = reason;
      });
    },

    // Reset game
    resetGame: () => {
      get().startGame();
    },

    // Update towers (targeting and firing)
    updateTowers: (deltaTime, currentTime) => {
      const state = get();
      if (!state.isPlaying || state.isPaused) return;

      state.towers.forEach((tower) => {
        const towerType = TOWER_TYPES[tower.typeId.toUpperCase()];
        if (!towerType) return;

        // Calculate effective stats based on level
        const damage = Math.floor(towerType.damage * (1 + (tower.level - 1) * 0.3));
        const range = towerType.range * (1 + (tower.level - 1) * 0.1);
        const fireRate = towerType.fireRate * (1 + (tower.level - 1) * 0.05);

        // Check if can fire
        const timeSinceLastFire = currentTime - tower.lastFired;
        const fireInterval = 1 / fireRate;

        if (timeSinceLastFire < fireInterval) return;

        // Find target
        const target = findTarget(tower, range, state.zombies);

        if (target) {
          // Update tower target and rotation
          tower.targetId = target.id;
          const angle = Math.atan2(
            target.position.z - tower.position.z,
            target.position.x - tower.position.x
          );
          tower.rotation = angle;

          // Fire
          if (towerType.id === 'freeze') {
            // Freeze tower applies slow effect
            get().slowZombie(target.id, towerType.slowFactor, towerType.slowDuration);
            get().damageZombie(target.id, damage);
          } else if (towerType.id === 'splash') {
            // Splash damage - create projectile that will damage multiple
            get().createProjectile(tower.id, target.id, damage, 15);
          } else {
            // Normal projectile
            get().createProjectile(tower.id, target.id, damage, towerType.id === 'sniper' ? 30 : 20);
          }

          tower.lastFired = currentTime;
        } else {
          tower.targetId = null;
        }
      });
    },

    // Update projectiles
    updateProjectiles: (deltaTime) => {
      const state = get();

      state.projectiles.forEach((proj) => {
        const target = state.zombies.find((z) => z.id === proj.targetId);

        if (!target || target.isDead || target.reachedEnd) {
          get().removeProjectile(proj.id);
          return;
        }

        // Move projectile towards target
        const dx = target.position.x - proj.position.x;
        const dz = target.position.z - proj.position.z;
        const dist = Math.sqrt(dx * dx + dz * dz);

        if (dist < 0.5) {
          // Hit target
          if (proj.isSplash) {
            // Splash damage - damage all zombies in radius
            state.zombies.forEach((zombie) => {
              if (!zombie.isDead && !zombie.reachedEnd) {
                const zDx = zombie.position.x - target.position.x;
                const zDz = zombie.position.z - target.position.z;
                const zDist = Math.sqrt(zDx * zDx + zDz * zDz);
                if (zDist <= proj.splashRadius) {
                  const damageMultiplier = 1 - zDist / proj.splashRadius;
                  get().damageZombie(zombie.id, proj.damage * damageMultiplier);
                }
              }
            });
          } else {
            // Single target damage
            get().damageZombie(target.id, proj.damage);
          }

          get().removeProjectile(proj.id);
          return;
        }

        // Move projectile
        const moveDistance = proj.speed * deltaTime;
        proj.position.x += (dx / dist) * moveDistance;
        proj.position.z += (dz / dist) * moveDistance;
      });
    },
  }))
);

// Helper function to generate wave spawns
function generateWaveSpawns(waveNumber) {
  const spawns = [];
  const difficulty = waveNumber;

  // Early waves: mostly walkers
  if (difficulty <= 3) {
    spawns.push({
      typeId: 'walker',
      count: 5 + difficulty * 3,
      delay: 1500,
    });
  }
  // Mid waves: mix of walkers and runners
  else if (difficulty <= 6) {
    spawns.push({
      typeId: 'walker',
      count: 8 + difficulty * 2,
      delay: 1200,
    });
    spawns.push({
      typeId: 'runner',
      count: 3 + difficulty,
      delay: 800,
    });
  }
  // Harder waves: tanks and crawlers added
  else if (difficulty <= 9) {
    spawns.push({
      typeId: 'walker',
      count: 10 + difficulty,
      delay: 1000,
    });
    spawns.push({
      typeId: 'runner',
      count: 5 + difficulty,
      delay: 700,
    });
    spawns.push({
      typeId: 'tank',
      count: 2 + Math.floor(difficulty / 2),
      delay: 2500,
    });
  }
  // Boss wave every 10
  else if (difficulty % 10 === 0) {
    spawns.push({
      typeId: 'boss',
      count: 1,
      delay: 5000,
    });
    spawns.push({
      typeId: 'walker',
      count: 15,
      delay: 800,
    });
  }
  // Late waves: everything
  else {
    spawns.push({
      typeId: 'walker',
      count: 12 + difficulty,
      delay: 800,
    });
    spawns.push({
      typeId: 'runner',
      count: 6 + difficulty,
      delay: 600,
    });
    spawns.push({
      typeId: 'tank',
      count: 3 + Math.floor(difficulty / 3),
      delay: 2000,
    });
    spawns.push({
      typeId: 'crawler',
      count: 5 + difficulty,
      delay: 1000,
    });
  }

  return spawns;
}

// Constants (defined here to avoid circular imports)
const WAVE_DELAY = 5000; // ms between waves
const SELL_RETURN_PERCENTAGE = 0.5;
