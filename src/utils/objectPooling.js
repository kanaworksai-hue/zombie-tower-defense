/**
 * Object pooling system for performance optimization
 * Reuses objects instead of creating/destroying them frequently
 */

/**
 * Generic object pool for reusing game objects
 */
export class ObjectPool {
  constructor(factory, resetFn, initialSize = 10) {
    this.factory = factory;
    this.resetFn = resetFn;
    this.available = [];
    this.inUse = new Set();

    // Pre-populate pool
    for (let i = 0; i < initialSize; i++) {
      this.available.push(this.factory());
    }
  }

  /**
   * Get an object from the pool
   */
  acquire() {
    let obj;
    if (this.available.length > 0) {
      obj = this.available.pop();
    } else {
      obj = this.factory();
    }
    this.inUse.add(obj);
    this.resetFn(obj);
    return obj;
  }

  /**
   * Return an object to the pool
   */
  release(obj) {
    if (this.inUse.has(obj)) {
      this.inUse.delete(obj);
      this.available.push(obj);
    }
  }

  /**
   * Get pool statistics
   */
  getStats() {
    return {
      available: this.available.length,
      inUse: this.inUse.size,
      total: this.available.length + this.inUse.size,
    };
  }

  /**
   * Clear all objects from the pool
   */
  clear() {
    this.available = [];
    this.inUse.clear();
  }
}

/**
 * Projectile pool for reusing projectile objects
 */
export const projectilePool = new ObjectPool(
  () => ({
    id: null,
    towerId: null,
    targetId: null,
    position: { x: 0, y: 0, z: 0 },
    targetPosition: { x: 0, y: 0, z: 0 },
    damage: 0,
    speed: 0,
    isSplash: false,
    splashRadius: 0,
    active: false,
  }),
  (obj) => {
    obj.id = null;
    obj.towerId = null;
    obj.targetId = null;
    obj.position = { x: 0, y: 0, z: 0 };
    obj.targetPosition = { x: 0, y: 0, z: 0 };
    obj.damage = 0;
    obj.speed = 0;
    obj.isSplash = false;
    obj.splashRadius = 0;
    obj.active = true;
  },
  50
);

/**
 * Particle pool for visual effects
 */
export const particlePool = new ObjectPool(
  () => ({
    id: null,
    position: { x: 0, y: 0, z: 0 },
    velocity: { x: 0, y: 0, z: 0 },
    color: '#ffffff',
    size: 0.1,
    life: 0,
    maxLife: 0,
    active: false,
  }),
  (obj) => {
    obj.id = null;
    obj.position = { x: 0, y: 0, z: 0 };
    obj.velocity = { x: 0, y: 0, z: 0 };
    obj.color = '#ffffff';
    obj.size = 0.1;
    obj.life = 0;
    obj.maxLife = 0;
    obj.active = true;
  },
  100
);

/**
 * Damage number pool for floating text
 */
export const damageNumberPool = new ObjectPool(
  () => ({
    id: null,
    value: 0,
    position: { x: 0, y: 0, z: 0 },
    color: '#ffffff',
    critical: false,
    life: 0,
    active: false,
  }),
  (obj) => {
    obj.id = null;
    obj.value = 0;
    obj.position = { x: 0, y: 0, z: 0 };
    obj.color = '#ffffff';
    obj.critical = false;
    obj.life = 800;
    obj.active = true;
  },
  30
);

/**
 * Hook for using object pool in React components
 */
export function useObjectPool(pool) {
  const acquire = () => pool.acquire();
  const release = (obj) => pool.release(obj);
  const getStats = () => pool.getStats();

  return { acquire, release, getStats };
}

/**
 * Manager for all object pools
 */
export const PoolManager = {
  projectile: projectilePool,
  particle: particlePool,
  damageNumber: damageNumberPool,

  /**
   * Get stats for all pools
   */
  getAllStats() {
    return {
      projectile: this.projectile.getStats(),
      particle: this.particle.getStats(),
      damageNumber: this.damageNumber.getStats(),
    };
  },

  /**
   * Clear all pools
   */
  clearAll() {
    this.projectile.clear();
    this.particle.clear();
    this.damageNumber.clear();
  },
};
