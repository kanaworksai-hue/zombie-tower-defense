/**
 * Projectile component
 * Renders projectiles fired by towers
 */

import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sphere, Box } from '@react-three/drei';

/**
 * Projectile component props
 * @typedef {Object} ProjectileProps
 * @property {Object} projectile - Projectile data object
 */

/**
 * Projectile component
 * @param {ProjectileProps} props
 */
export function Projectile({ projectile }) {
  const projectileRef = useRef();

  // Get projectile appearance based on tower type
  const projectileConfig = useMemo(() => {
    switch (projectile.towerType) {
      case 'basic':
        return {
          geometry: 'sphere',
          args: [0.1, 8, 8],
          color: '#ffff00',
          emissive: '#ffff00',
          emissiveIntensity: 0.5
        };

      case 'sniper':
        return {
          geometry: 'cylinder',
          args: [0.03, 0.03, 0.4, 6],
          color: '#ffffff',
          emissive: '#ffffff',
          emissiveIntensity: 0.3
        };

      case 'rapid':
        return {
          geometry: 'sphere',
          args: [0.06, 6, 6],
          color: '#ff4444',
          emissive: '#ff4444',
          emissiveIntensity: 0.6
        };

      case 'splash':
        return {
          geometry: 'sphere',
          args: [0.15, 8, 8],
          color: '#ff4400',
          emissive: '#ff4400',
          emissiveIntensity: 0.6
        };

      case 'freeze':
        return {
          geometry: 'sphere',
          args: [0.12, 8, 8],
          color: '#00ffff',
          emissive: '#00ffff',
          emissiveIntensity: 0.7
        };

      default:
        return {
          geometry: 'sphere',
          args: [0.1, 8, 8],
          color: '#ffffff',
          emissive: '#ffffff',
          emissiveIntensity: 0.5
        };
    }
  }, [projectile.towerType]);

  // Rotate projectile for visual effect
  useFrame(() => {
    if (projectileRef.current) {
      projectileRef.current.rotation.x += 0.1;
      projectileRef.current.rotation.z += 0.1;
    }
  });

  return (
    <group ref={projectileRef} position={[projectile.position.x, projectile.position.y, projectile.position.z]}>
      {projectileConfig.geometry === 'sphere' ? (
        <Sphere args={projectileConfig.args}>
          <meshStandardMaterial
            color={projectileConfig.color}
            emissive={projectileConfig.emissive}
            emissiveIntensity={projectileConfig.emissiveIntensity}
          />
        </Sphere>
      ) : (
        <Box args={projectileConfig.args} rotation={[0, 0, Math.PI / 2]}>
          <meshStandardMaterial
            color={projectileConfig.color}
            emissive={projectileConfig.emissive}
            emissiveIntensity={projectileConfig.emissiveIntensity}
          />
        </Box>
      )}

      {/* Trail effect for some projectiles */}
      {(projectile.towerType === 'sniper' || projectile.towerType === 'splash') && (
        <Sphere args={[projectileConfig.args[0] * 0.6, 6, 6]} position={[-0.1, 0, 0]}>
          <meshStandardMaterial color={projectileConfig.color} transparent opacity={0.5} />
        </Sphere>
      )}
    </group>
  );
}

/**
 * Laser beam component for freeze towers (continuous beam)
 * @param {Object} props
 * @param {import('../../types/index.js').Position} props.start - Start position
 * @param {import('../../types/index.js').Position} props.end - End position
 * @param {string} props.color - Beam color
 */
export function LaserBeam({ start, end, color }) {
  const beamRef = useRef();

  // Calculate beam orientation
  const beamData = useMemo(() => {
    const dx = end.x - start.x;
    const dy = end.y - start.y;
    const dz = end.z - start.z;
    const length = Math.sqrt(dx * dx + dy * dy + dz * dz);

    const midX = (start.x + end.x) / 2;
    const midY = (start.y + end.y) / 2;
    const midZ = (start.z + end.z) / 2;

    // Calculate rotation to point from start to end
    const rotationY = Math.atan2(dx, dz);
    const rotationX = -Math.asin(dy / length);

    return {
      position: [midX, midY, midZ],
      scale: [0.08, length, 0.08],
      rotation: [rotationX, rotationY, 0]
    };
  }, [start, end]);

  // Pulse effect
  useFrame((state) => {
    if (beamRef.current) {
      const pulse = 1 + Math.sin(state.clock.elapsedTime * 20) * 0.2;
      beamRef.current.material.emissiveIntensity = 0.8 * pulse;
    }
  });

  return (
    <Box ref={beamRef} position={beamData.position} scale={beamData.scale} rotation={beamData.rotation}>
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={0.8}
        transparent
        opacity={0.9}
      />
    </Box>
  );
}
