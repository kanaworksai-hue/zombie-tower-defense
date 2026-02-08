/**
 * Frustum culling utilities for performance optimization
 * Prevents rendering objects outside the camera view
 */
import * as THREE from 'three';

/**
 * Frustum culling manager
 * Tracks which objects are visible in the camera frustum
 */
export class FrustumCullingManager {
  constructor() {
    this.frustum = new THREE.Frustum();
    this.projScreenMatrix = new THREE.Matrix4();
    this.visibleObjects = new Set();
    this.culledCount = 0;
  }

  /**
   * Update frustum from camera
   * @param {THREE.Camera} camera - The camera to use for culling
   */
  update(camera) {
    this.projScreenMatrix.multiplyMatrices(
      camera.projectionMatrix,
      camera.matrixWorldInverse
    );
    this.frustum.setFromProjectionMatrix(this.projScreenMatrix);
    this.visibleObjects.clear();
    this.culledCount = 0;
  }

  /**
   * Check if a position is within the frustum
   * @param {Object} position - Position with x, y, z
   * @param {number} radius - Bounding radius for the object
   * @returns {boolean} True if visible
   */
  isVisible(position, radius = 1) {
    const sphere = new THREE.Sphere(
      new THREE.Vector3(position.x, position.y, position.z),
      radius
    );
    return this.frustum.intersectsSphere(sphere);
  }

  /**
   * Check if a box is within the frustum
   * @param {Object} min - Minimum bounds {x, y, z}
   * @param {Object} max - Maximum bounds {x, y, z}
   * @returns {boolean} True if visible
   */
  isBoxVisible(min, max) {
    const box = new THREE.Box3(
      new THREE.Vector3(min.x, min.y, min.z),
      new THREE.Vector3(max.x, max.y, max.z)
    );
    return this.frustum.intersectsBox(box);
  }

  /**
   * Mark an object as visible
   */
  markVisible(id) {
    this.visibleObjects.add(id);
  }

  /**
   * Check if an object was marked visible
   */
  wasVisible(id) {
    return this.visibleObjects.has(id);
  }

  /**
   * Increment culled counter
   */
  recordCull() {
    this.culledCount++;
  }

  /**
   * Get culling statistics
   */
  getStats() {
    return {
      visible: this.visibleObjects.size,
      culled: this.culledCount,
    };
  }
}

// Global frustum culling manager instance
export const frustumManager = new FrustumCullingManager();

/**
 * Hook for frustum culling in React components
 * @returns {Object} Frustum culling methods
 */
export function useFrustumCulling() {
  /**
   * Check if position is visible
   */
  const checkVisibility = (position, radius = 1) => {
    return frustumManager.isVisible(position, radius);
  };

  /**
   * Update frustum from camera
   */
  const updateFrustum = (camera) => {
    frustumManager.update(camera);
  };

  /**
   * Get culling stats
   */
  const getStats = () => {
    return frustumManager.getStats();
  };

  return {
    checkVisibility,
    updateFrustum,
    getStats,
    frustumManager,
  };
}

/**
 * Component wrapper that only renders when visible
 * Usage: Wrap expensive components with this
 */
export function Cullable({
  id,
  position,
  radius = 1,
  children,
  fallback = null,
}) {
  const isVisible = frustumManager.isVisible(position, radius);

  if (isVisible) {
    frustumManager.markVisible(id);
    return children;
  } else {
    frustumManager.recordCull();
    return fallback;
  }
}

/**
 * Distance-based LOD (Level of Detail) manager
 * Switches to lower detail models at distance
 */
export class LODManager {
  constructor() {
    this.levels = [
      { distance: 0, detail: 'high' },
      { distance: 20, detail: 'medium' },
      { distance: 40, detail: 'low' },
      { distance: 60, detail: 'hidden' },
    ];
  }

  /**
   * Get LOD level based on distance from camera
   * @param {Object} position - Object position
   * @param {Object} cameraPosition - Camera position
   * @returns {string} Detail level
   */
  getLODLevel(position, cameraPosition) {
    const dx = position.x - cameraPosition.x;
    const dy = position.y - cameraPosition.y;
    const dz = position.z - cameraPosition.z;
    const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);

    for (let i = this.levels.length - 1; i >= 0; i--) {
      if (distance >= this.levels[i].distance) {
        return this.levels[i].detail;
      }
    }

    return 'high';
  }

  /**
   * Check if object should be rendered
   */
  shouldRender(position, cameraPosition) {
    return this.getLODLevel(position, cameraPosition) !== 'hidden';
  }
}

// Global LOD manager instance
export const lodManager = new LODManager();
