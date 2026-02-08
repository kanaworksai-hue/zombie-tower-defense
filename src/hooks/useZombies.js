/**
 * Hook for interacting with the zombie system
 * Provides methods for towers to damage and affect zombies
 */

import { useCallback, useRef, useEffect, useState } from 'react';

/**
 * Hook to interact with zombie manager
 * @returns {Object} Zombie interaction methods and state
 */
export function useZombies() {
  const [zombies, setZombies] = useState([]);
  const [activeZombieCount, setActiveZombieCount] = useState(0);

  /**
   * Damage a specific zombie
   */
  const damageZombie = useCallback((zombieId, damage) => {
    if (window.zombieManager?.damageZombie) {
      window.zombieManager.damageZombie(zombieId, damage);
    }
  }, []);

  /**
   * Apply status effect to a zombie
   */
  const applyStatusEffect = useCallback((zombieId, effectType) => {
    if (window.zombieManager?.applyStatusEffect) {
      window.zombieManager.applyStatusEffect(zombieId, effectType);
    }
  }, []);

  /**
   * Get a specific zombie by ID
   */
  const getZombie = useCallback((zombieId) => {
    if (window.zombieManager?.getZombie) {
      return window.zombieManager.getZombie(zombieId);
    }
    return null;
  }, []);

  /**
   * Get all zombies within range of a position
   */
  const getZombiesInRange = useCallback((position, range) => {
    if (window.zombieManager?.getZombiesInRange) {
      return window.zombieManager.getZombiesInRange(position, range);
    }
    return [];
  }, []);

  /**
   * Get the closest zombie to a position
   */
  const getClosestZombie = useCallback((position) => {
    if (window.zombieManager?.getClosestZombie) {
      return window.zombieManager.getClosestZombie(position);
    }
    return null;
  }, []);

  /**
   * Get the zombie closest to the end (highest path progress)
   */
  const getFurthestZombie = useCallback(() => {
    if (window.zombieManager?.getZombiesInRange) {
      const allZombies = window.zombieManager.getZombiesInRange({ x: 0, y: 0, z: 0 }, 9999);
      return allZombies.reduce((furthest, zombie) => {
        if (!furthest) return zombie;
        if (zombie.pathIndex > furthest.pathIndex) return zombie;
        if (zombie.pathIndex === furthest.pathIndex && zombie.pathProgress > furthest.pathProgress) {
          return zombie;
        }
        return furthest;
      }, null);
    }
    return null;
  }, []);

  /**
   * Get zombies sorted by distance to end (for targeting priority)
   */
  const getZombiesByDistanceToEnd = useCallback(() => {
    if (window.zombieManager?.getZombiesInRange) {
      const allZombies = window.zombieManager.getZombiesInRange({ x: 0, y: 0, z: 0 }, 9999);
      return allZombies.sort((a, b) => {
        if (a.pathIndex !== b.pathIndex) {
          return b.pathIndex - a.pathIndex;
        }
        return b.pathProgress - a.pathProgress;
      });
    }
    return [];
  }, []);

  /**
   * Check if any zombie is in range
   */
  const hasZombiesInRange = useCallback((position, range) => {
    const zombiesInRange = getZombiesInRange(position, range);
    return zombiesInRange.length > 0;
  }, [getZombiesInRange]);

  /**
   * Get total zombie count
   */
  const getZombieCount = useCallback(() => {
    if (window.zombieManager?.getZombiesInRange) {
      return window.zombieManager.getZombiesInRange({ x: 0, y: 0, z: 0 }, 9999).length;
    }
    return 0;
  }, []);

  // Update active zombie count periodically
  useEffect(() => {
    const interval = setInterval(() => {
      const count = getZombieCount();
      setActiveZombieCount(count);
    }, 100);

    return () => clearInterval(interval);
  }, [getZombieCount]);

  return {
    // Methods
    damageZombie,
    applyStatusEffect,
    getZombie,
    getZombiesInRange,
    getClosestZombie,
    getFurthestZombie,
    getZombiesByDistanceToEnd,
    hasZombiesInRange,
    getZombieCount,

    // State
    activeZombieCount,
  };
}

export default useZombies;
