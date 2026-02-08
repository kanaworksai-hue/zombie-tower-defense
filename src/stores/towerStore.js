/**
 * Tower store using Zustand for state management
 * Handles tower placement, upgrades, targeting, and removal
 */

import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import {
  TOWER_TYPES,
  MAX_TOWER_LEVEL,
  getTowerTypeById,
  calculateUpgradeCost,
  calculateSellValue,
  getUpgradedStats
} from '../constants/towerTypes';

/**
 * Generate unique tower ID
 * @returns {string}
 */
function generateTowerId() {
  return `tower_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Calculate distance between two positions
 * @param {import('../types/index.js').Position} a
 * @param {import('../types/index.js').Position} b
 * @returns {number}
 */
function distance(a, b) {
  return Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.z - b.z, 2));
}

/**
 * Tower store with immer middleware for immutable updates
 */
export const useTowerStore = create(
  immer((set, get) => ({
    // State
    towers: [],
    selectedTowerType: null,
    selectedTowerId: null,
    isPlacingTower: false,
    ghostPosition: null,
    canPlaceAtGhost: false,
    projectiles: [],
    laserBeams: [],

    // Actions

    /**
     * Select a tower type for placement
     * @param {string|null} typeId - Tower type ID or null to deselect
     */
    selectTowerType: (typeId) => {
      set((state) => {
        state.selectedTowerType = typeId;
        state.isPlacingTower = typeId !== null;
        state.ghostPosition = null;
        state.canPlaceAtGhost = false;
      });
    },

    /**
     * Update ghost tower position during placement
     * @param {import('../types/index.js').Position|null} position
     * @param {boolean} canPlace - Whether placement is valid at this position
     */
    updateGhostPosition: (position, canPlace) => {
      set((state) => {
        state.ghostPosition = position;
        state.canPlaceAtGhost = canPlace;
      });
    },

    /**
     * Place a tower at the specified position
     * @param {import('../types/index.js').Position} position
     * @param {Function} onSpendMoney - Callback to deduct money
     * @returns {string|null} - Tower ID if successful, null otherwise
     */
    placeTower: (position, onSpendMoney) => {
      const state = get();
      const towerType = getTowerTypeById(state.selectedTowerType);

      if (!towerType || !state.canPlaceAtGhost) {
        return null;
      }

      // Check if we can afford it (handled by onSpendMoney)
      const success = onSpendMoney(towerType.cost);
      if (!success) {
        return null;
      }

      const towerId = generateTowerId();

      set((draft) => {
        draft.towers.push({
          id: towerId,
          typeId: towerType.id,
          position: { ...position },
          level: 1,
          lastFired: 0,
          targetId: null,
          rotation: 0
        });

        // Reset placement mode
        draft.selectedTowerType = null;
        draft.isPlacingTower = false;
        draft.ghostPosition = null;
        draft.canPlaceAtGhost = false;
      });

      return towerId;
    },

    /**
     * Select an existing tower (for upgrades/selling)
     * @param {string|null} towerId
     */
    selectTower: (towerId) => {
      set((state) => {
        state.selectedTowerId = towerId;
      });
    },

    /**
     * Upgrade a tower to the next level
     * @param {string} towerId
     * @param {Function} onSpendMoney - Callback to deduct money
     * @returns {boolean} - Success status
     */
    upgradeTower: (towerId, onSpendMoney) => {
      const state = get();
      const tower = state.towers.find((t) => t.id === towerId);

      if (!tower || tower.level >= MAX_TOWER_LEVEL) {
        return false;
      }

      const towerType = getTowerTypeById(tower.typeId);
      const upgradeCost = calculateUpgradeCost(towerType, tower.level);

      const success = onSpendMoney(upgradeCost);
      if (!success) {
        return false;
      }

      set((draft) => {
        const t = draft.towers.find((t) => t.id === towerId);
        if (t) {
          t.level += 1;
        }
      });

      return true;
    },

    /**
     * Sell a tower and return money
     * @param {string} towerId
     * @param {Function} onReceiveMoney - Callback to add money
     */
    sellTower: (towerId, onReceiveMoney) => {
      const state = get();
      const tower = state.towers.find((t) => t.id === towerId);

      if (!tower) return;

      const towerType = getTowerTypeById(tower.typeId);
      const sellValue = calculateSellValue(towerType, tower.level);

      onReceiveMoney(sellValue);

      set((draft) => {
        draft.towers = draft.towers.filter((t) => t.id !== towerId);
        if (draft.selectedTowerId === towerId) {
          draft.selectedTowerId = null;
        }
      });
    },

    /**
     * Update tower targeting and firing
     * @param {number} currentTime - Current game time in seconds
     * @param {Array<import('../types/index.js').Zombie>} zombies - Active zombies
     * @param {Function} onDamageZombie - Callback to damage a zombie
     * @param {Function} onSlowZombie - Callback to slow a zombie
     */
    updateTowers: (currentTime, zombies, onDamageZombie, onSlowZombie) => {
      const state = get();
      const newProjectiles = [];
      const activeLaserBeams = [];

      state.towers.forEach((tower) => {
        const towerType = getTowerTypeById(tower.typeId);
        const stats = getUpgradedStats(towerType, tower.level);

        // Find target
        const target = get().findTarget(tower, towerType, zombies);

        if (target) {
          // Update tower rotation to face target
          const angle = Math.atan2(
            target.position.z - tower.position.z,
            target.position.x - tower.position.x
          );

          set((draft) => {
            const t = draft.towers.find((to) => to.id === tower.id);
            if (t) {
              t.rotation = angle;
              t.targetId = target.id;
            }
          });

          // Check if can fire
          const timeSinceLastFire = currentTime - tower.lastFired;
          const fireInterval = 1 / stats.fireRate;

          if (timeSinceLastFire >= fireInterval) {
            if (towerType.isLaser) {
              // Laser tower - immediate damage, no projectile
              onDamageZombie(target.id, stats.damage);
              activeLaserBeams.push({
                towerId: tower.id,
                targetId: target.id,
                startPos: tower.position,
                endPos: target.position,
                color: towerType.color
              });
            } else {
              // Create projectile
              newProjectiles.push({
                id: `proj_${Date.now()}_${Math.random()}`,
                towerId: tower.id,
                targetId: target.id,
                position: { ...tower.position, y: 1 },
                targetPosition: { ...target.position },
                damage: stats.damage,
                speed: towerType.projectileSpeed,
                type: towerType.id,
                splashRadius: towerType.splashRadius || 0,
                slowFactor: towerType.slowFactor,
                slowDuration: towerType.slowDuration
              });
            }

            set((draft) => {
              const t = draft.towers.find((to) => to.id === tower.id);
              if (t) {
                t.lastFired = currentTime;
              }
            });
          }
        }
      });

      // Add new projectiles
      if (newProjectiles.length > 0) {
        set((draft) => {
          draft.projectiles.push(...newProjectiles);
        });
      }

      // Update laser beams
      set((draft) => {
        draft.laserBeams = activeLaserBeams;
      });

      // Update existing projectiles
      get().updateProjectiles(0.016, zombies, onDamageZombie, onSlowZombie);
    },

    /**
     * Find target for a tower based on its targeting strategy
     * @param {import('../types/index.js').Tower} tower
     * @param {import('../types/index.js').TowerType} towerType
     * @param {Array<import('../types/index.js').Zombie>} zombies
     * @returns {import('../types/index.js').Zombie|null}
     */
    findTarget: (tower, towerType, zombies) => {
      const stats = getUpgradedStats(towerType, tower.level);
      const inRangeZombies = zombies.filter(
        (zombie) =>
          !zombie.isDead &&
          !zombie.reachedEnd &&
          distance(tower.position, zombie.position) <= stats.range
      );

      if (inRangeZombies.length === 0) {
        return null;
      }

      switch (towerType.targetingStrategy) {
        case 'nearest':
          return inRangeZombies.reduce((closest, zombie) =>
            distance(tower.position, zombie.position) <
            distance(tower.position, closest.position)
              ? zombie
              : closest
          );

        case 'furthest':
          return inRangeZombies.reduce((furthest, zombie) =>
            distance(tower.position, zombie.position) >
            distance(tower.position, furthest.position)
              ? zombie
              : furthest
          );

        case 'strongest':
          return inRangeZombies.reduce((strongest, zombie) =>
            zombie.health > strongest.health ? zombie : strongest
          );

        case 'weakest':
          return inRangeZombies.reduce((weakest, zombie) =>
            zombie.health < weakest.health ? zombie : weakest
          );

        case 'first':
          return inRangeZombies.reduce((first, zombie) =>
            zombie.pathIndex > first.pathIndex ||
            (zombie.pathIndex === first.pathIndex &&
              zombie.pathProgress > first.pathProgress)
              ? zombie
              : first
          );

        case 'last':
          return inRangeZombies.reduce((last, zombie) =>
            zombie.pathIndex < last.pathIndex ||
            (zombie.pathIndex === last.pathIndex &&
              zombie.pathProgress < last.pathProgress)
              ? zombie
              : last
          );

        default:
          return inRangeZombies[0];
      }
    },

    /**
     * Update projectile positions and handle hits
     * @param {number} deltaTime - Time since last frame
     * @param {Array<import('../types/index.js').Zombie>} zombies
     * @param {Function} onDamageZombie
     * @param {Function} onSlowZombie
     */
    updateProjectiles: (deltaTime, zombies, onDamageZombie, onSlowZombie) => {
      set((draft) => {
        draft.projectiles = draft.projectiles.filter((proj) => {
          const target = zombies.find((z) => z.id === proj.targetId);

          if (!target || target.isDead || target.reachedEnd) {
            return false; // Remove projectile if target is gone
          }

          // Move projectile towards target
          const dx = target.position.x - proj.position.x;
          const dz = target.position.z - proj.position.z;
          const dist = Math.sqrt(dx * dx + dz * dz);

          if (dist < 0.5) {
            // Hit target
            if (proj.splashRadius > 0) {
              // Splash damage - damage all zombies in radius
              zombies.forEach((zombie) => {
                if (!zombie.isDead && !zombie.reachedEnd) {
                  const zombieDist = distance(target.position, zombie.position);
                  if (zombieDist <= proj.splashRadius) {
                    const damageMultiplier = 1 - zombieDist / proj.splashRadius;
                    onDamageZombie(zombie.id, proj.damage * damageMultiplier);
                  }
                }
              });
            } else {
              // Single target damage
              onDamageZombie(target.id, proj.damage);
            }

            // Apply slow effect if applicable
            if (proj.slowFactor && onSlowZombie) {
              onSlowZombie(target.id, proj.slowFactor, proj.slowDuration);
            }

            return false; // Remove projectile
          }

          // Move projectile
          const moveDistance = proj.speed * deltaTime;
          proj.position.x += (dx / dist) * moveDistance;
          proj.position.z += (dz / dist) * moveDistance;
          proj.position.y = 1; // Keep at consistent height

          return true; // Keep projectile
        });
      });
    },

    /**
     * Clear all towers (for level reset)
     */
    clearTowers: () => {
      set((state) => {
        state.towers = [];
        state.projectiles = [];
        state.laserBeams = [];
        state.selectedTowerId = null;
        state.selectedTowerType = null;
        state.isPlacingTower = false;
      });
    },

    /**
     * Get tower by ID
     * @param {string} towerId
     * @returns {import('../types/index.js').Tower|undefined}
     */
    getTower: (towerId) => {
      return get().towers.find((t) => t.id === towerId);
    }
  }))
);
