/**
 * Screen shake effect for impacts and explosions
 * Applies camera shake during intense moments
 */
import { useRef, useEffect, useCallback } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

// Screen shake state
let shakeIntensity = 0;
let shakeDecay = 0;
let shakeDuration = 0;
let shakeStartTime = 0;

/**
 * Trigger a screen shake
 * @param {number} intensity - Shake intensity (0-1)
 * @param {number} duration - Duration in milliseconds
 * @param {number} decay - How quickly shake fades (0-1)
 */
export function triggerScreenShake(intensity = 0.5, duration = 500, decay = 0.95) {
  shakeIntensity = Math.max(shakeIntensity, intensity);
  shakeDecay = decay;
  shakeDuration = duration;
  shakeStartTime = Date.now();
}

/**
 * Screen shake controller component
 * Add this to your scene to enable screen shake
 */
export function ScreenShakeController() {
  const { camera } = useThree();
  const originalPosition = useRef(new THREE.Vector3());
  const isShaking = useRef(false);

  useEffect(() => {
    // Store original camera position
    originalPosition.current.copy(camera.position);
  }, [camera]);

  useFrame(() => {
    if (shakeIntensity <= 0.01) {
      if (isShaking.current) {
        // Reset to original position when shake ends
        camera.position.copy(originalPosition.current);
        isShaking.current = false;
      }
      return;
    }

    const elapsed = Date.now() - shakeStartTime;
    if (elapsed > shakeDuration) {
      shakeIntensity = 0;
      return;
    }

    isShaking.current = true;

    // Calculate shake offset
    const time = elapsed * 0.05;
    const currentIntensity = shakeIntensity * (1 - elapsed / shakeDuration);

    const offsetX = Math.sin(time * 10) * currentIntensity * 0.5;
    const offsetY = Math.cos(time * 15) * currentIntensity * 0.5;
    const offsetZ = Math.sin(time * 8) * currentIntensity * 0.3;

    // Apply shake to camera
    camera.position.set(
      originalPosition.current.x + offsetX,
      originalPosition.current.y + offsetY,
      originalPosition.current.z + offsetZ
    );

    // Decay intensity
    shakeIntensity *= shakeDecay;
  });

  return null;
}

/**
 * Hook to trigger screen shake from components
 */
export function useScreenShake() {
  const shake = useCallback((intensity = 0.5, duration = 500, decay = 0.95) => {
    triggerScreenShake(intensity, duration, decay);
  }, []);

  return { shake };
}

/**
 * Component that triggers shake on big explosions
 */
export function ExplosionShake({ intensity = 0.5 }) {
  const { shake } = useScreenShake();

  useEffect(() => {
    shake(intensity, 600, 0.92);
  }, [shake, intensity]);

  return null;
}
