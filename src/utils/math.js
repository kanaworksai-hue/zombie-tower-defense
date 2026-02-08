/**
 * Math utilities for 3D calculations and grid operations
 */
import { GRID_SIZE, CELL_SIZE } from '../constants/game';

/**
 * Convert grid coordinates to world coordinates
 * @param {number} gridX - Grid X coordinate (0 to GRID_SIZE-1)
 * @param {number} gridZ - Grid Z coordinate (0 to GRID_SIZE-1)
 * @returns {{x: number, y: number, z: number}} World position
 */
export function gridToWorld(gridX, gridZ) {
  const offset = (GRID_SIZE * CELL_SIZE) / 2 - CELL_SIZE / 2;
  return {
    x: gridX * CELL_SIZE - offset,
    y: 0,
    z: gridZ * CELL_SIZE - offset,
  };
}

/**
 * Convert world coordinates to grid coordinates
 * @param {number} worldX - World X coordinate
 * @param {number} worldZ - World Z coordinate
 * @returns {{x: number, z: number}} Grid position
 */
export function worldToGrid(worldX, worldZ) {
  const offset = (GRID_SIZE * CELL_SIZE) / 2 - CELL_SIZE / 2;
  return {
    x: Math.round((worldX + offset) / CELL_SIZE),
    z: Math.round((worldZ + offset) / CELL_SIZE),
  };
}

/**
 * Calculate distance between two positions
 * @param {import('../types').Position} pos1 - First position
 * @param {import('../types').Position} pos2 - Second position
 * @returns {number} Distance in world units
 */
export function getDistance(pos1, pos2) {
  const dx = pos1.x - pos2.x;
  const dy = (pos1.y || 0) - (pos2.y || 0);
  const dz = pos1.z - pos2.z;
  return Math.sqrt(dx * dx + dy * dy + dz * dz);
}

/**
 * Calculate squared distance (faster, no sqrt)
 * @param {import('../types').Position} pos1 - First position
 * @param {import('../types').Position} pos2 - Second position
 * @returns {number} Squared distance
 */
export function getDistanceSquared(pos1, pos2) {
  const dx = pos1.x - pos2.x;
  const dy = (pos1.y || 0) - (pos2.y || 0);
  const dz = pos1.z - pos2.z;
  return dx * dx + dy * dy + dz * dz;
}

/**
 * Linear interpolation between two values
 * @param {number} a - Start value
 * @param {number} b - End value
 * @param {number} t - Interpolation factor (0-1)
 * @returns {number} Interpolated value
 */
export function lerp(a, b, t) {
  return a + (b - a) * t;
}

/**
 * Linear interpolation between two positions
 * @param {import('../types').Position} start - Start position
 * @param {import('../types').Position} end - End position
 * @param {number} t - Interpolation factor (0-1)
 * @returns {import('../types').Position} Interpolated position
 */
export function lerpPosition(start, end, t) {
  return {
    x: lerp(start.x, end.x, t),
    y: lerp(start.y || 0, end.y || 0, t),
    z: lerp(start.z, end.z, t),
  };
}

/**
 * Clamp a value between min and max
 * @param {number} value - Value to clamp
 * @param {number} min - Minimum value
 * @param {number} max - Maximum value
 * @returns {number} Clamped value
 */
export function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

/**
 * Check if a point is within a circular range
 * @param {import('../types').Position} point - Point to check
 * @param {import('../types').Position} center - Center of range
 * @param {number} radius - Radius of range
 * @returns {boolean} True if point is within range
 */
export function isInRange(point, center, radius) {
  return getDistanceSquared(point, center) <= radius * radius;
}

/**
 * Find the closest point from a list to a target point
 * @param {import('../types').Position} target - Target position
 * @param {Array<import('../types').Position>} points - List of positions
 * @returns {import('../types').Position|null} Closest position or null
 */
export function findClosestPoint(target, points) {
  if (!points || points.length === 0) return null;

  let closest = points[0];
  let minDistance = getDistanceSquared(target, points[0]);

  for (let i = 1; i < points.length; i++) {
    const dist = getDistanceSquared(target, points[i]);
    if (dist < minDistance) {
      minDistance = dist;
      closest = points[i];
    }
  }

  return closest;
}

/**
 * Calculate angle between two positions in radians
 * @param {import('../types').Position} from - Starting position
 * @param {import('../types').Position} to - Target position
 * @returns {number} Angle in radians
 */
export function getAngle(from, to) {
  const dx = to.x - from.x;
  const dz = to.z - from.z;
  return Math.atan2(dz, dx);
}

/**
 * Snap a world position to the grid
 * @param {number} worldX - World X coordinate
 * @param {number} worldZ - World Z coordinate
 * @returns {{x: number, z: number}} Snapped grid position
 */
export function snapToGrid(worldX, worldZ) {
  const grid = worldToGrid(worldX, worldZ);
  return {
    x: clamp(grid.x, 0, GRID_SIZE - 1),
    z: clamp(grid.z, 0, GRID_SIZE - 1),
  };
}

/**
 * Check if grid coordinates are valid
 * @param {number} gridX - Grid X coordinate
 * @param {number} gridZ - Grid Z coordinate
 * @returns {boolean} True if coordinates are within grid bounds
 */
export function isValidGridPosition(gridX, gridZ) {
  return gridX >= 0 && gridX < GRID_SIZE && gridZ >= 0 && gridZ < GRID_SIZE;
}

/**
 * Generate a random position within grid bounds
 * @returns {{x: number, z: number}} Random grid position
 */
export function getRandomGridPosition() {
  return {
    x: Math.floor(Math.random() * GRID_SIZE),
    z: Math.floor(Math.random() * GRID_SIZE),
  };
}

/**
 * Convert degrees to radians
 * @param {number} degrees - Angle in degrees
 * @returns {number} Angle in radians
 */
export function toRadians(degrees) {
  return degrees * (Math.PI / 180);
}

/**
 * Convert radians to degrees
 * @param {number} radians - Angle in radians
 * @returns {number} Angle in degrees
 */
export function toDegrees(radians) {
  return radians * (180 / Math.PI);
}

/**
 * Normalize an angle to be between -PI and PI
 * @param {number} angle - Angle in radians
 * @returns {number} Normalized angle
 */
export function normalizeAngle(angle) {
  while (angle > Math.PI) angle -= 2 * Math.PI;
  while (angle < -Math.PI) angle += 2 * Math.PI;
  return angle;
}

/**
 * Smoothly interpolate towards a target angle
 * @param {number} current - Current angle in radians
 * @param {number} target - Target angle in radians
 * @param {number} speed - Interpolation speed (0-1)
 * @returns {number} New angle
 */
export function lerpAngle(current, target, speed) {
  const diff = normalizeAngle(target - current);
  return normalizeAngle(current + diff * speed);
}
