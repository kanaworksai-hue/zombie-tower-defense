/**
 * ZombieManager component
 * Manages all zombies in the game, handles spawning, updates, and cleanup
 */

import React, { useRef, useCallback, useEffect, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGameStore } from '../../stores/gameStore';
import Zombie from './Zombie.jsx';
import { generateWave } from './WaveSystem.js';
import { calculateZombieStats, getZombieConfig } from './ZombieTypes.js';
import { gridToWorld } from '../../utils/math.js';

/**
 * Generate a unique ID for zombies
 */
function generateZombieId() {
  return `zombie_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Convert path from grid coordinates to world coordinates
 * @param {Array} path - Array of grid coordinates
 * @returns {Array} Array of world coordinates
 */
function convertPathToWorldCoordinates(path) {
  if (!path || path.length === 0) return [];
  return path.map((point) => gridToWorld(point.x, point.z));
}

/**
 * ZombieManager component
 */
export function ZombieManager({
  onZombieReachEnd,
  onZombieKilled,
  onWaveComplete,
}) {
  // Get game state from store
  const isPlaying = useGameStore((state) => state.isPlaying);
  const isPaused = useGameStore((state) => state.isPaused);
  const path = useGameStore((state) => state.path);

  // Convert grid path to world coordinates
  const waypoints = convertPathToWorldCoordinates(path);

  const [zombies, setZombies] = useState([]);
  const [spawnQueue, setSpawnQueue] = useState([]);
  const [currentWaveNumber, setCurrentWaveNumber] = useState(0);
  const spawnTimer = useRef(0);
  const waveStartTime = useRef(0);
  const isSpawning = useRef(false);
  const zombiesRef = useRef(zombies);

  // Get store actions for syncing zombies
  const updateZombiePositionInStore = useGameStore((state) => state.updateZombiePosition);
  const damageZombieInStore = useGameStore((state) => state.damageZombie);

  // Keep zombiesRef in sync with zombies state
  useEffect(() => {
    zombiesRef.current = zombies;
  }, [zombies]);

  // Sync local zombies to store for tower targeting
  useEffect(() => {
    // Clear store zombies and re-add current ones
    const storeZombies = useGameStore.getState().zombies;

    // Remove store zombies that are not in local state
    storeZombies.forEach((z) => {
      const localZombie = zombies.find((lz) => lz.id === z.id);
      if (!localZombie) {
        // Zombie was removed locally, mark as dead in store
        damageZombieInStore(z.id, 99999);
      }
    });

    // Add local zombies to store if not present
    zombies.forEach((zombie) => {
      const storeZombie = storeZombies.find((sz) => sz.id === zombie.id);
      if (!storeZombie) {
        // Need to add to store - use spawnZombie but we need to override the ID
        // Instead, directly push to store state
        useGameStore.setState((state) => {
          state.zombies.push({
            id: zombie.id,
            typeId: zombie.typeId,
            position: { ...zombie.position },
            health: zombie.health,
            maxHealth: zombie.maxHealth,
            pathIndex: zombie.pathIndex,
            pathProgress: zombie.pathProgress,
            isDead: zombie.isDead,
            reachedEnd: zombie.reachedEnd,
            slowFactor: 1,
            slowEndTime: 0,
          });
        });
      } else {
        // Update existing store zombie position
        updateZombiePositionInStore(zombie.id, {
          pathIndex: zombie.pathIndex,
          pathProgress: zombie.pathProgress,
          position: zombie.position,
        });
      }
    });
  }, [zombies, damageZombieInStore, updateZombiePositionInStore]);

  /**
   * Start a new wave
   */
  const startWave = useCallback((waveNum) => {
    const waveConfig = generateWave(waveNum);
    const spawnList = [];

    // Flatten spawn configuration into timed spawn list
    waveConfig.spawns.forEach((spawn) => {
      for (let i = 0; i < spawn.count; i++) {
        spawnList.push({
          typeId: spawn.typeId,
          delay: spawn.delay * i,
          spawned: false,
        });
      }
    });

    setSpawnQueue(spawnList);
    setCurrentWaveNumber(waveNum);
    spawnTimer.current = 0;
    waveStartTime.current = Date.now();
    isSpawning.current = true;
  }, []);

  /**
   * Spawn a single zombie
   */
  const spawnZombie = useCallback((typeId) => {
    const config = getZombieConfig(typeId);
    const stats = calculateZombieStats(config, currentWaveNumber);

    // Use world coordinates from waypoints
    const startPosition = waypoints.length > 0 ? waypoints[0] : { x: 0, y: 0, z: 0 };

    const newZombie = {
      id: generateZombieId(),
      typeId,
      position: { x: startPosition.x, y: 0, z: startPosition.z },
      health: stats.health,
      maxHealth: stats.health,
      speed: stats.speed,
      reward: stats.reward,
      damage: stats.damage,
      pathIndex: 0,
      pathProgress: 0,
      isDead: false,
      reachedEnd: false,
      pendingDamage: 0,
      statusEffects: [],
    };

    setZombies((prev) => [...prev, newZombie]);
    return newZombie.id;
  }, [waypoints, currentWaveNumber]);

  /**
   * Handle zombie death
   */
  const handleZombieDeath = useCallback((zombieId) => {
    setZombies((prev) => {
      const zombie = prev.find((z) => z.id === zombieId);
      if (zombie && !zombie.isDead) {
        onZombieKilled?.(zombie);
        return prev.filter((z) => z.id !== zombieId);
      }
      return prev;
    });
  }, [onZombieKilled]);

  /**
   * Handle zombie reaching the end
   */
  const handleZombieReachEnd = useCallback((zombieId) => {
    setZombies((prev) => {
      const zombie = prev.find((z) => z.id === zombieId);
      if (zombie && !zombie.reachedEnd) {
        onZombieReachEnd?.(zombie);
        return prev.filter((z) => z.id !== zombieId);
      }
      return prev;
    });
  }, [onZombieReachEnd]);

  /**
   * Apply damage to a zombie
   */
  const damageZombie = useCallback((zombieId, damage) => {
    setZombies((prev) =>
      prev.map((z) =>
        z.id === zombieId
          ? { ...z, pendingDamage: (z.pendingDamage || 0) + damage }
          : z
      )
    );
  }, []);

  /**
   * Apply status effect to a zombie
   */
  const applyStatusEffect = useCallback((zombieId, effectType) => {
    setZombies((prev) =>
      prev.map((z) => {
        if (z.id === zombieId && z.addStatusEffect) {
          z.addStatusEffect(effectType);
        }
        return z;
      })
    );
  }, []);

  /**
   * Get zombie by ID
   */
  const getZombie = useCallback((zombieId) => {
    return zombiesRef.current.find((z) => z.id === zombieId);
  }, []);

  /**
   * Get all zombies in range of a point
   */
  const getZombiesInRange = useCallback((position, range) => {
    return zombiesRef.current.filter((z) => {
      if (z.isDead || z.reachedEnd) return false;
      const dx = z.position.x - position.x;
      const dz = z.position.z - position.z;
      const distance = Math.sqrt(dx * dx + dz * dz);
      return distance <= range;
    });
  }, []);

  /**
   * Get closest zombie to a point
   */
  const getClosestZombie = useCallback((position) => {
    let closest = null;
    let closestDistance = Infinity;

    zombiesRef.current.forEach((z) => {
      if (z.isDead || z.reachedEnd) return;
      const dx = z.position.x - position.x;
      const dz = z.position.z - position.z;
      const distance = Math.sqrt(dx * dx + dz * dz);

      if (distance < closestDistance) {
        closestDistance = distance;
        closest = z;
      }
    });

    return closest;
  }, []);

  /**
   * Get all active zombies
   */
  const getAllZombies = useCallback(() => {
    return zombiesRef.current.filter((z) => !z.isDead && !z.reachedEnd);
  }, []);

  // Expose methods to parent via ref-like pattern
  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.zombieManager = {
        damageZombie,
        applyStatusEffect,
        getZombie,
        getZombiesInRange,
        getClosestZombie,
        getAllZombies,
        startWave,
      };
    }
  }, [damageZombie, applyStatusEffect, getZombie, getZombiesInRange, getClosestZombie, getAllZombies, startWave]);

  // Main game loop
  useFrame((state, delta) => {
    if (!isPlaying || isPaused) return;

    // Handle spawning
    if (isSpawning.current && spawnQueue.length > 0) {
      spawnTimer.current += delta * 1000;

      // Check for zombies that should spawn
      const toSpawn = [];
      const remaining = [];

      spawnQueue.forEach((spawn) => {
        if (!spawn.spawned && spawnTimer.current >= spawn.delay) {
          toSpawn.push(spawn);
        } else {
          remaining.push(spawn);
        }
      });

      // Spawn zombies
      toSpawn.forEach((spawn) => {
        spawnZombie(spawn.typeId);
        spawn.spawned = true;
      });

      if (toSpawn.length > 0) {
        setSpawnQueue((prev) =>
          prev.map((s) =>
            toSpawn.includes(s) ? { ...s, spawned: true } : s
          )
        );
      }

      // Check if wave spawning is complete
      const allSpawned = remaining.every((s) => s.spawned);
      if (allSpawned && remaining.length === 0) {
        isSpawning.current = false;
      }
    }

    // Update zombie positions
    setZombies((prev) => {
      return prev.map((zombie) => {
        if (zombie.isDead || zombie.reachedEnd) return zombie;

        // Calculate speed with status effects
        let currentSpeed = zombie.speed;
        if (zombie.statusEffects?.some((e) => e.type === 'SLOW')) {
          currentSpeed *= 0.5;
        }
        if (zombie.statusEffects?.some((e) => e.type === 'STUN')) {
          currentSpeed = 0;
        }

        // Move along path
        if (currentSpeed > 0 && waypoints && waypoints.length > 1) {
          const currentWaypoint = waypoints[zombie.pathIndex];
          const nextWaypoint = waypoints[zombie.pathIndex + 1];

          if (nextWaypoint) {
            const dx = nextWaypoint.x - currentWaypoint.x;
            const dz = nextWaypoint.z - currentWaypoint.z;
            const distance = Math.sqrt(dx * dx + dz * dz);

            const moveDistance = currentSpeed * delta;
            const progressDelta = moveDistance / distance;

            let newProgress = zombie.pathProgress + progressDelta;
            let newIndex = zombie.pathIndex;

            // Move to next waypoint if progress exceeds 1
            while (newProgress >= 1) {
              newProgress -= 1;
              newIndex++;

              if (newIndex >= waypoints.length - 1) {
                // Reached the end
                handleZombieReachEnd(zombie.id);
                return { ...zombie, reachedEnd: true };
              }
            }

            // Update position
            const newCurrent = waypoints[newIndex];
            const newNext = waypoints[newIndex + 1];
            const newX = newCurrent.x + (newNext.x - newCurrent.x) * newProgress;
            const newZ = newCurrent.z + (newNext.z - newCurrent.z) * newProgress;

            return {
              ...zombie,
              pathIndex: newIndex,
              pathProgress: newProgress,
              position: { x: newX, y: 0, z: newZ },
            };
          } else {
            // No more waypoints
            handleZombieReachEnd(zombie.id);
            return { ...zombie, reachedEnd: true };
          }
        }

        return zombie;
      });
    });

    // Check for wave completion
    if (isSpawning.current && spawnQueue.length === 0 && zombies.length === 0) {
      isSpawning.current = false;
      onWaveComplete?.(currentWaveNumber);
    }
  });

  // Auto-start first wave
  useEffect(() => {
    if (isPlaying && currentWaveNumber === 0 && !isSpawning.current) {
      startWave(1);
    }
  }, [isPlaying, currentWaveNumber, isSpawning, startWave]);

  return (
    <>
      {zombies.map((zombie) => (
        <Zombie
          key={zombie.id}
          zombie={zombie}
          waypoints={waypoints}
          onDeath={handleZombieDeath}
          onReachEnd={handleZombieReachEnd}
        />
      ))}
    </>
  );
}

export default ZombieManager;
