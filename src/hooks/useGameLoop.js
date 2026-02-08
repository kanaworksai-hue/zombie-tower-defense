/**
 * Custom hook for game loop timing
 * Provides consistent frame updates
 */
import { useRef, useCallback } from 'react';
import { useFrame } from '@react-three/fiber';

/**
 * Hook for managing game loop with fixed time steps
 * @param {Function} callback - Function to call each frame
 * @param {boolean} isActive - Whether the loop is active
 * @param {number} fixedTimeStep - Fixed time step in seconds (default: 1/60)
 */
export function useGameLoop(callback, isActive = true, fixedTimeStep = 1 / 60) {
  const accumulatorRef = useRef(0);
  const lastTimeRef = useRef(0);

  useFrame((state, delta) => {
    if (!isActive) {
      lastTimeRef.current = state.clock.elapsedTime;
      return;
    }

    // Cap delta to prevent spiral of death
    const cappedDelta = Math.min(delta, 0.1);

    accumulatorRef.current += cappedDelta;

    // Process fixed time steps
    while (accumulatorRef.current >= fixedTimeStep) {
      callback(fixedTimeStep, state);
      accumulatorRef.current -= fixedTimeStep;
    }
  });
}

/**
 * Hook for frame-rate independent interpolation
 * @returns {Object} Interpolation helpers
 */
export function useInterpolation() {
  const previousRef = useRef(null);
  const currentRef = useRef(null);

  const update = useCallback((newValue) => {
    previousRef.current = currentRef.current;
    currentRef.current = newValue;
  }, []);

  const interpolate = useCallback((alpha) => {
    if (previousRef.current === null || currentRef.current === null) {
      return currentRef.current;
    }
    return previousRef.current + (currentRef.current - previousRef.current) * alpha;
  }, []);

  return { update, interpolate, current: currentRef.current };
}

/**
 * Hook for throttling function calls
 * @param {Function} callback - Function to throttle
 * @param {number} interval - Minimum interval between calls in ms
 * @returns {Function} Throttled function
 */
export function useThrottle(callback, interval) {
  const lastCallRef = useRef(0);

  return useCallback(
    (...args) => {
      const now = Date.now();
      if (now - lastCallRef.current >= interval) {
        lastCallRef.current = now;
        callback(...args);
      }
    },
    [callback, interval]
  );
}

/**
 * Hook for debouncing function calls
 * @param {Function} callback - Function to debounce
 * @param {number} delay - Delay in ms
 * @returns {Function} Debounced function
 */
export function useDebounce(callback, delay) {
  const timeoutRef = useRef(null);

  return useCallback(
    (...args) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = setTimeout(() => {
        callback(...args);
      }, delay);
    },
    [callback, delay]
  );
}
