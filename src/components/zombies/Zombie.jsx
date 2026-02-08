/**
 * Base Zombie component
 * Renders a low-poly zombie with path following, animations, and status effects
 */

import React, { useRef, useMemo, useEffect, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { getZombieConfig } from './ZombieTypes.js';

/**
 * Status effect types with their visual indicators
 */
const STATUS_EFFECTS = {
  SLOW: { color: '#00ffff', duration: 2000 },
  POISON: { color: '#00ff00', duration: 5000, tickDamage: 2 },
  STUN: { color: '#ffff00', duration: 1000 },
  BURN: { color: '#ff6600', duration: 3000, tickDamage: 5 },
};

/**
 * Calculate position along path based on progress
 * @param {Array} waypoints - Array of waypoint positions
 * @param {number} pathIndex - Current waypoint index
 * @param {number} pathProgress - Progress between waypoints (0-1)
 * @returns {THREE.Vector3} Current position
 */
function calculatePathPosition(waypoints, pathIndex, pathProgress) {
  if (!waypoints || waypoints.length === 0) {
    return new THREE.Vector3(0, 0, 0);
  }

  const currentWaypoint = waypoints[pathIndex];
  if (!currentWaypoint) {
    return new THREE.Vector3(waypoints[0].x, 0, waypoints[0].z);
  }

  const nextWaypoint = waypoints[pathIndex + 1];
  if (!nextWaypoint) {
    return new THREE.Vector3(currentWaypoint.x, 0, currentWaypoint.z);
  }

  const x = THREE.MathUtils.lerp(currentWaypoint.x, nextWaypoint.x, pathProgress);
  const z = THREE.MathUtils.lerp(currentWaypoint.z, nextWaypoint.z, pathProgress);

  return new THREE.Vector3(x, 0, z);
}

/**
 * Calculate rotation to face movement direction
 * @param {Array} waypoints - Array of waypoint positions
 * @param {number} pathIndex - Current waypoint index
 * @param {number} pathProgress - Progress between waypoints (0-1)
 * @returns {number} Rotation in radians
 */
function calculateRotation(waypoints, pathIndex, pathProgress) {
  if (!waypoints || waypoints.length < 2) {
    return 0;
  }

  const currentWaypoint = waypoints[pathIndex];
  const nextWaypoint = waypoints[pathIndex + 1];

  if (!currentWaypoint || !nextWaypoint) {
    return 0;
  }

  const dx = nextWaypoint.x - currentWaypoint.x;
  const dz = nextWaypoint.z - currentWaypoint.z;

  return Math.atan2(dx, dz);
}

/**
 * HealthBar component - renders above the zombie
 */
function HealthBar({ health, maxHealth }) {
  const percentage = Math.max(0, (health / maxHealth) * 100);

  return (
    <div
      style={{
        position: 'absolute',
        transform: 'translate(-50%, -100%)',
        marginTop: '-20px',
        width: '50px',
        height: '6px',
        backgroundColor: '#333',
        border: '1px solid #000',
        borderRadius: '3px',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          width: `${percentage}%`,
          height: '100%',
          backgroundColor: percentage > 50 ? '#2ecc71' : percentage > 25 ? '#f39c12' : '#e74c3c',
          transition: 'width 0.1s ease-out',
        }}
      />
    </div>
  );
}

/**
 * StatusEffectIndicator - visual indicators for status effects
 */
function StatusEffectIndicator({ effects }) {
  if (effects.length === 0) return null;

  return (
    <div
      style={{
        position: 'absolute',
        transform: 'translate(-50%, -100%)',
        marginTop: '-30px',
        display: 'flex',
        gap: '2px',
      }}
    >
      {effects.map((effect, index) => (
        <div
          key={index}
          style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            backgroundColor: STATUS_EFFECTS[effect.type]?.color || '#fff',
            boxShadow: `0 0 4px ${STATUS_EFFECTS[effect.type]?.color || '#fff'}`,
          }}
        />
      ))}
    </div>
  );
}

/**
 * Main Zombie component
 */
export function Zombie({
  zombie,
  waypoints,
  onReachEnd,
  onDeath,
  onDamage,
  deltaTime,
}) {
  const groupRef = useRef();
  const bodyRef = useRef();
  const headRef = useRef();
  const leftArmRef = useRef();
  const rightArmRef = useRef();
  const leftLegRef = useRef();
  const rightLegRef = useRef();
  const glowRef = useRef();

  const config = useMemo(() => getZombieConfig(zombie.typeId), [zombie.typeId]);

  const [statusEffects, setStatusEffects] = useState([]);
  const [isDying, setIsDying] = useState(false);
  const [deathProgress, setDeathProgress] = useState(0);
  const walkTime = useRef(0);

  // Apply damage from external sources
  useEffect(() => {
    if (zombie.pendingDamage > 0) {
      const newHealth = zombie.health - zombie.pendingDamage;
      zombie.health = Math.max(0, newHealth);
      zombie.pendingDamage = 0;

      if (newHealth <= 0 && !isDying) {
        setIsDying(true);
      }
    }
  }, [zombie.pendingDamage, zombie.health, isDying]);

  // Add status effect
  const addStatusEffect = (type) => {
    const effectConfig = STATUS_EFFECTS[type];
    if (!effectConfig) return;

    setStatusEffects((prev) => {
      const existing = prev.find((e) => e.type === type);
      if (existing) {
        // Refresh duration
        return prev.map((e) =>
          e.type === type ? { ...e, endTime: Date.now() + effectConfig.duration } : e
        );
      }
      return [
        ...prev,
        {
          type,
          endTime: Date.now() + effectConfig.duration,
        },
      ];
    });
  };

  // Expose addStatusEffect to parent
  useEffect(() => {
    zombie.addStatusEffect = addStatusEffect;
  }, [zombie]);

  // Main update loop
  useFrame((state, delta) => {
    if (!groupRef.current) return;

    // Handle death animation
    if (isDying) {
      setDeathProgress((prev) => {
        const newProgress = prev + delta * 2;
        if (newProgress >= 1) {
          onDeath?.(zombie.id);
          return 1;
        }

        // Fade out and shrink
        groupRef.current.scale.setScalar(config.scale * (1 - newProgress * 0.5));
        groupRef.current.rotation.x = newProgress * Math.PI / 2;

        return newProgress;
      });
      return;
    }

    // Clean up expired status effects
    const now = Date.now();
    setStatusEffects((prev) => prev.filter((e) => e.endTime > now));

    // Calculate speed modifiers from status effects
    let speedMultiplier = 1;
    if (statusEffects.some((e) => e.type === 'SLOW')) {
      speedMultiplier *= 0.5;
    }
    if (statusEffects.some((e) => e.type === 'STUN')) {
      speedMultiplier = 0;
    }

    // Update walk animation
    if (speedMultiplier > 0) {
      walkTime.current += delta * config.walkCycleSpeed * speedMultiplier;
    }

    // Animate limbs
    const armSwing = Math.sin(walkTime.current) * config.armSwingRange;
    const legSwing = Math.sin(walkTime.current) * 0.3;

    if (leftArmRef.current) {
      leftArmRef.current.rotation.x = armSwing;
    }
    if (rightArmRef.current) {
      rightArmRef.current.rotation.x = -armSwing;
    }
    if (leftLegRef.current) {
      leftLegRef.current.rotation.x = -legSwing;
    }
    if (rightLegRef.current) {
      rightLegRef.current.rotation.x = legSwing;
    }

    // Bobbing motion for head and body
    const bobOffset = Math.abs(Math.sin(walkTime.current * 2)) * 0.05;
    if (headRef.current) {
      headRef.current.position.y = config.height * 0.7 + bobOffset;
    }

    // Update position along path
    const position = calculatePathPosition(
      waypoints,
      zombie.pathIndex,
      zombie.pathProgress
    );

    const rotation = calculateRotation(waypoints, zombie.pathIndex, zombie.pathProgress);

    groupRef.current.position.copy(position);
    groupRef.current.rotation.y = rotation;

    // Apply status effect visual overlays
    const isPoisoned = statusEffects.some((e) => e.type === 'POISON');
    const isBurning = statusEffects.some((e) => e.type === 'BURN');
    const isSlowed = statusEffects.some((e) => e.type === 'SLOW');

    if (bodyRef.current) {
      const baseColor = new THREE.Color(config.color);
      if (isPoisoned) {
        baseColor.lerp(new THREE.Color('#00ff00'), 0.3);
      } else if (isBurning) {
        baseColor.lerp(new THREE.Color('#ff6600'), 0.3);
      } else if (isSlowed) {
        baseColor.lerp(new THREE.Color('#00ffff'), 0.2);
      }
      bodyRef.current.material.color = baseColor;
    }

    // Pulse glow for boss
    if (config.hasGlow && glowRef.current) {
      const pulse = (Math.sin(state.clock.elapsedTime * 3) + 1) * 0.5;
      glowRef.current.material.opacity = 0.3 + pulse * 0.2;
    }
  });

  // Don't render if dead
  if (deathProgress >= 1) {
    return null;
  }

  const bodyColor = config.color;
  const skinColor = '#8fbc8f';
  const clothesColor = bodyColor;

  return (
    <group ref={groupRef} scale={config.scale}>
      {/* Health bar and status effects */}
      <Html center>
        <HealthBar health={zombie.health} maxHealth={zombie.maxHealth} />
      </Html>
      <Html center>
        <StatusEffectIndicator effects={statusEffects} />
      </Html>

      {/* Body */}
      <mesh
        ref={bodyRef}
        position={[0, config.height * 0.35, 0]}
        castShadow
        receiveShadow
      >
        <boxGeometry args={[config.bodyWidth, config.height * 0.5, config.bodyWidth * 0.6]} />
        <meshStandardMaterial color={clothesColor} roughness={0.8} />
      </mesh>

      {/* Head */}
      <mesh
        ref={headRef}
        position={[0, config.height * 0.7, 0]}
        castShadow
      >
        <boxGeometry args={[config.headSize, config.headSize, config.headSize]} />
        <meshStandardMaterial color={skinColor} roughness={0.7} />
      </mesh>

      {/* Eyes */}
      <mesh position={[-config.headSize * 0.2, config.height * 0.72, config.headSize * 0.4]}>
        <boxGeometry args={[0.08, 0.08, 0.05]} />
        <meshStandardMaterial color="#000000" emissive="#ff0000" emissiveIntensity={0.5} />
      </mesh>
      <mesh position={[config.headSize * 0.2, config.height * 0.72, config.headSize * 0.4]}>
        <boxGeometry args={[0.08, 0.08, 0.05]} />
        <meshStandardMaterial color="#000000" emissive="#ff0000" emissiveIntensity={0.5} />
      </mesh>

      {/* Left Arm */}
      <mesh
        ref={leftArmRef}
        position={[-config.bodyWidth * 0.7, config.height * 0.45, 0]}
        castShadow
      >
        <boxGeometry args={[config.bodyWidth * 0.25, config.height * 0.4, config.bodyWidth * 0.25]} />
        <meshStandardMaterial color={skinColor} roughness={0.7} />
      </mesh>

      {/* Right Arm */}
      <mesh
        ref={rightArmRef}
        position={[config.bodyWidth * 0.7, config.height * 0.45, 0]}
        castShadow
      >
        <boxGeometry args={[config.bodyWidth * 0.25, config.height * 0.4, config.bodyWidth * 0.25]} />
        <meshStandardMaterial color={skinColor} roughness={0.7} />
      </mesh>

      {/* Left Leg */}
      <mesh
        ref={leftLegRef}
        position={[-config.bodyWidth * 0.25, config.height * 0.1, 0]}
        castShadow
      >
        <boxGeometry args={[config.bodyWidth * 0.3, config.height * 0.3, config.bodyWidth * 0.35]} />
        <meshStandardMaterial color={clothesColor} roughness={0.8} />
      </mesh>

      {/* Right Leg */}
      <mesh
        ref={rightLegRef}
        position={[config.bodyWidth * 0.25, config.height * 0.1, 0]}
        castShadow
      >
        <boxGeometry args={[config.bodyWidth * 0.3, config.height * 0.3, config.bodyWidth * 0.35]} />
        <meshStandardMaterial color={clothesColor} roughness={0.8} />
      </mesh>

      {/* Boss glow effect */}
      {config.hasGlow && (
        <mesh ref={glowRef} position={[0, config.height * 0.4, 0]}>
          <sphereGeometry args={[config.scale * 1.5, 16, 16]} />
          <meshBasicMaterial
            color="#ff0000"
            transparent
            opacity={0.3}
            side={THREE.BackSide}
          />
        </mesh>
      )}

      {/* Crawler modification - drag legs */}
      {config.isCrawler && (
        <>
          <mesh position={[-config.bodyWidth * 0.3, config.height * 0.05, -config.bodyWidth * 0.3]}>
            <boxGeometry args={[config.bodyWidth * 0.2, 0.1, config.bodyWidth * 0.4]} />
            <meshStandardMaterial color={skinColor} />
          </mesh>
          <mesh position={[config.bodyWidth * 0.3, config.height * 0.05, -config.bodyWidth * 0.3]}>
            <boxGeometry args={[config.bodyWidth * 0.2, 0.1, config.bodyWidth * 0.4]} />
            <meshStandardMaterial color={skinColor} />
          </mesh>
        </>
      )}
    </group>
  );
}

export default Zombie;
