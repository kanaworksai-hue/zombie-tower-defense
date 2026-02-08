/**
 * Game loop component using useFrame
 * Handles all game logic updates: tower targeting, zombie movement, projectiles, waves
 */
import { useRef, useCallback } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGameStore } from '../../stores/gameStore';
import { TOWER_TYPES, ZOMBIE_TYPES, CELL_SIZE, GRID_OFFSET } from '../../constants/game';
import { getDistance, lerpPosition } from '../../utils/math';

/**
 * Main game loop component
 */
export function GameLoop() {
  const lastUpdateRef = useRef(0);

  // Get state and actions from store
  const isPlaying = useGameStore((state) => state.isPlaying);
  const isPaused = useGameStore((state) => state.isPaused);
  const towers = useGameStore((state) => state.towers);
  const zombies = useGameStore((state) => state.zombies);
  const projectiles = useGameStore((state) => state.projectiles);
  const path = useGameStore((state) => state.path);
  const wave = useGameStore((state) => state.wave);

  // Actions
  const damageZombie = useGameStore((state) => state.damageZombie);
  const slowZombie = useGameStore((state) => state.slowZombie);
  const zombieReachedEnd = useGameStore((state) => state.zombieReachedEnd);
  const createProjectile = useGameStore((state) => state.createProjectile);
  const removeProjectile = useGameStore((state) => state.removeProjectile);
  const updateWave = useGameStore((state) => state.updateWave);
  const cleanupDeadZombies = useGameStore((state) => state.cleanupDeadZombies);

  /**
   * Update zombie positions along the path
   */
  const updateZombies = useCallback(
    (deltaTime) => {
      const now = Date.now();

      zombies.forEach((zombie) => {
        if (zombie.isDead || zombie.reachedEnd) return;

        const zombieType = ZOMBIE_TYPES[zombie.typeId.toUpperCase()];
        if (!zombieType) return;

        // Check slow effect
        let currentSpeed = zombieType.speed;
        if (now < zombie.slowEndTime) {
          currentSpeed *= zombie.slowFactor;
        }

        // Get current and next waypoint
        const currentWaypoint = path[zombie.pathIndex];
        const nextWaypoint = path[zombie.pathIndex + 1];

        if (!nextWaypoint) {
          // Reached end of path
          zombieReachedEnd(zombie.id);
          return;
        }

        // Move towards next waypoint
        const dx = nextWaypoint.x - currentWaypoint.x;
        const dz = nextWaypoint.z - currentWaypoint.z;
        const distance = Math.sqrt(dx * dx + dz * dz);

        // Update progress
        const moveAmount = (currentSpeed * deltaTime) / distance;
        zombie.pathProgress += moveAmount;

        if (zombie.pathProgress >= 1) {
          // Reached next waypoint
          zombie.pathIndex++;
          zombie.pathProgress = 0;

          if (zombie.pathIndex >= path.length - 1) {
            zombieReachedEnd(zombie.id);
          }
        } else {
          // Interpolate position
          const newX = currentWaypoint.x + dx * zombie.pathProgress;
          const newZ = currentWaypoint.z + dz * zombie.pathProgress;

          zombie.position.x = newX;
          zombie.position.z = newZ;
        }
      });
    },
    [zombies, path, zombieReachedEnd]
  );

  /**
   * Update tower targeting and firing
   */
  const updateTowers = useCallback(
    (deltaTime) => {
      const now = Date.now();

      towers.forEach((tower) => {
        const towerType = TOWER_TYPES[tower.typeId.toUpperCase()];
        if (!towerType) return;

        // Calculate effective stats based on level
        const levelMultiplier = 1 + (tower.level - 1) * 0.2;
        const effectiveRange = towerType.range * CELL_SIZE;
        const effectiveDamage = towerType.damage * levelMultiplier;
        const fireInterval = 1000 / towerType.fireRate;

        // Find target
        let target = null;
        let minDistance = Infinity;

        // Simple targeting: closest zombie
        zombies.forEach((zombie) => {
          if (zombie.isDead || zombie.reachedEnd) return;

          const distance = getDistance(tower.position, zombie.position);

          if (distance <= effectiveRange && distance < minDistance) {
            minDistance = distance;
            target = zombie;
          }
        });

        tower.targetId = target ? target.id : null;

        // Fire if we have a target and cooldown is ready
        if (target && now - tower.lastFired >= fireInterval) {
          createProjectile(tower.id, target.id, effectiveDamage);
          tower.lastFired = now;
        }
      });
    },
    [towers, zombies, createProjectile]
  );

  /**
   * Update projectile movement and collisions
   */
  const updateProjectiles = useCallback(
    (deltaTime) => {
      const projectilesToRemove = [];

      projectiles.forEach((projectile) => {
        const target = zombies.find((z) => z.id === projectile.targetId);

        if (!target || target.isDead || target.reachedEnd) {
          projectilesToRemove.push(projectile.id);
          return;
        }

        // Update target position
        projectile.targetPosition = { ...target.position };

        // Move towards target
        const dx = projectile.targetPosition.x - projectile.position.x;
        const dy = projectile.targetPosition.y - projectile.position.y;
        const dz = projectile.targetPosition.z - projectile.position.z;
        const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);

        const moveAmount = projectile.speed * deltaTime;

        if (moveAmount >= distance) {
          // Hit target
          damageZombie(target.id, projectile.damage);

          // Handle splash damage
          if (projectile.isSplash && projectile.splashRadius > 0) {
            zombies.forEach((zombie) => {
              if (zombie.id !== target.id && !zombie.isDead && !zombie.reachedEnd) {
                const dist = getDistance(target.position, zombie.position);
                if (dist <= projectile.splashRadius) {
                  const splashDamage = projectile.damage * (1 - dist / projectile.splashRadius);
                  damageZombie(zombie.id, splashDamage);
                }
              }
            });
          }

          // Handle freeze effect
          const tower = towers.find((t) => t.id === projectile.towerId);
          if (tower) {
            const towerType = TOWER_TYPES[tower.typeId.toUpperCase()];
            if (towerType.id === 'freeze' && towerType.slowFactor) {
              slowZombie(target.id, towerType.slowFactor, towerType.slowDuration);
            }
          }

          projectilesToRemove.push(projectile.id);
        } else {
          // Move projectile
          const t = moveAmount / distance;
          projectile.position.x += dx * t;
          projectile.position.y += dy * t;
          projectile.position.z += dz * t;
        }
      });

      // Remove hit/missed projectiles
      projectilesToRemove.forEach((id) => removeProjectile(id));
    },
    [projectiles, zombies, towers, damageZombie, slowZombie, removeProjectile]
  );

  /**
   * Main game loop
   */
  useFrame((state, deltaTime) => {
    if (!isPlaying || isPaused) return;

    // Cap delta time to prevent large jumps
    const cappedDelta = Math.min(deltaTime, 0.1);

    // Update wave spawns
    updateWave(cappedDelta);

    // Update game entities
    updateZombies(cappedDelta);
    updateTowers(cappedDelta);
    updateProjectiles(cappedDelta);

    // Cleanup dead zombies periodically
    if (state.clock.elapsedTime - lastUpdateRef.current > 1) {
      cleanupDeadZombies();
      lastUpdateRef.current = state.clock.elapsedTime;
    }
  });

  return null;
}
