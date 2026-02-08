/**
 * ZombieManager component
 * Manages all zombies in the game, handles spawning, updates, and cleanup
 */

import React, { useRef, useCallback, useEffect, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import Zombie from './Zombie.jsx';
import { generateWave, shouldSpawnNextWave } from './WaveSystem.js';
import { calculateZombieStats } from './ZombieTypes.js';

/**
 * Generate a unique ID for zombies
 */
function generateZombieId() {
  return `zombie_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * ZombieManager component
 */
export function ZombieManager({
  waypoints,
  currentWave,
  setCurrentWave,
  waveNumber,
  setWaveNumber,
  isPlaying,
  isPaused,
  onZombieReachEnd,
  onZombieKilled,
  onWaveComplete,
}) {
  const [zombies, setZombies] = useState([]);
  const [spawnQueue, setSpawnQueue] = useState([]);
  const spawnTimer = useRef(0);
  const waveStartTime = useRef(0);
  const isSpawning = useRef(false);

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
    setCurrentWave({
      waveNumber: waveNum,
      isActive: true,
      isComplete: false,
      zombiesRemaining: spawnList.length,
    });
    spawnTimer.current = 0;
    waveStartTime.current = Date.now();
    isSpawning.current = true;
  }, [setCurrentWave]);

  /**
   * Spawn a single zombie
   */
  const spawnZombie = useCallback((typeId) => {
    const { calculateZombieStats: calcStats, getZombieConfig } = require('./ZombieTypes.js');
    const config = getZombieConfig(typeId);
    const stats = calcStats(config, waveNumber);

    const newZombie = {
      id: generateZombieId(),
      typeId,
      position: { x: waypoints[0].x, y: 0, z: waypoints[0].z },
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
  }, [waypoints, waveNumber]);

  /**
   * Handle zombie death
   */
  const handleZombieDeath = useCallback((zombieId) => {
    const zombie = zombies.find((z) => z.id === zombieId);
    if (zombie && !zombie.isDead) {
      zombie.isDead = true;
      onZombieKilled?.(zombie);

      setZombies((prev) =>
        prev.filter((z) => z.id !== zombieId)
      );
    }
  }, [zombies, onZombieKilled]);

  /**
   * Handle zombie reaching the end
   */
  const handleZombieReachEnd = useCallback((zombieId) => {
    const zombie = zombies.find((z) => z.id === zombieId);
    if (zombie && !zombie.reachedEnd) {
      zombie.reachedEnd = true;
      onZombieReachEnd?.(zombie);

      setZombies((prev) =>
        prev.filter((z) => z.id !== zombieId)
      );
    }
  }, [zombies, onZombieReachEnd]);

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
    return zombies.find((z) => z.id === zombieId);
  }, [zombies]);

  /**
   * Get all zombies in range of a point
   */
  const getZombiesInRange = useCallback((position, range) => {
    return zombies.filter((z) => {
      if (z.isDead || z.reachedEnd) return false;
      const dx = z.position.x - position.x;
      const dz = z.position.z - position.z;
      const distance = Math.sqrt(dx * dx + dz * dz);
      return distance <= range;
    });
  }, [zombies]);

  /**
   * Get closest zombie to a point
   */
  const getClosestZombie = useCallback((position) => {
    let closest = null;
    let closestDistance = Infinity;

    zombies.forEach((z) => {
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
  }, [zombies]);

  // Expose methods to parent via ref-like pattern
  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.zombieManager = {
        damageZombie,
        applyStatusEffect,
        getZombie,
        getZombiesInRange,
        getClosestZombie,
        startWave,
      };
    }
  }, [damageZombie, applyStatusEffect, getZombie, getZombiesInRange, getClosestZombie, startWave]);

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
    if (currentWave?.isActive && !isSpawning.current && zombies.length === 0) {
      setCurrentWave((prev) => ({ ...prev, isComplete: true, isActive: false }));
      onWaveComplete?.(waveNumber);
    }
  });

  // Auto-start first wave
  useEffect(() => {
    if (isPlaying && waveNumber === 0 && !currentWave?.isActive) {
      setWaveNumber(1);
      startWave(1);
    }
  }, [isPlaying, waveNumber, currentWave, startWave, setWaveNumber]);

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
