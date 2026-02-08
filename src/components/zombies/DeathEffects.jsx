/**
 * Death effects component for zombies
 * Handles particle effects, fade out animations, and visual feedback
 */

import React, { useRef, useMemo, useEffect, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';

/**
 * Particle for death effect
 */
function DeathParticle({ position, color, velocity, onComplete }) {
  const meshRef = useRef();
  const [life, setLife] = useState(1);

  useFrame((state, delta) => {
    if (!meshRef.current) return;

    // Update position
    meshRef.current.position.add(
      new THREE.Vector3(velocity.x * delta, velocity.y * delta, velocity.z * delta)
    );

    // Apply gravity
    velocity.y -= 2 * delta;

    // Fade out
    setLife((prev) => {
      const newLife = prev - delta * 1.5;
      if (newLife <= 0) {
        onComplete?.();
        return 0;
      }
      return newLife;
    });

    // Update scale and opacity
    meshRef.current.scale.setScalar(life * 0.3);
    meshRef.current.material.opacity = life;
  });

  return (
    <mesh ref={meshRef} position={position}>
      <boxGeometry args={[0.1, 0.1, 0.1]} />
      <meshBasicMaterial color={color} transparent opacity={life} />
    </mesh>
  );
}

/**
 * Death effect with multiple particles
 */
export function DeathEffect({ position, color, particleCount = 12, onComplete }) {
  const [particles, setParticles] = useState([]);
  const [activeParticles, setActiveParticles] = useState(0);

  useEffect(() => {
    const newParticles = [];
    for (let i = 0; i < particleCount; i++) {
      const angle = (Math.PI * 2 * i) / particleCount;
      const speed = 2 + Math.random() * 3;
      const upwardSpeed = 1 + Math.random() * 2;

      newParticles.push({
        id: i,
        position: [
          position.x + (Math.random() - 0.5) * 0.5,
          position.y + 0.5,
          position.z + (Math.random() - 0.5) * 0.5,
        ],
        velocity: {
          x: Math.cos(angle) * speed,
          y: upwardSpeed,
          z: Math.sin(angle) * speed,
        },
        color: Math.random() > 0.5 ? color : '#8fbc8f',
      });
    }
    setParticles(newParticles);
    setActiveParticles(particleCount);
  }, [position, color, particleCount]);

  const handleParticleComplete = () => {
    setActiveParticles((prev) => {
      const newCount = prev - 1;
      if (newCount <= 0) {
        onComplete?.();
      }
      return newCount;
    });
  };

  if (activeParticles <= 0) {
    return null;
  }

  return (
    <>
      {particles.map((particle) => (
        <DeathParticle
          key={particle.id}
          position={particle.position}
          color={particle.color}
          velocity={particle.velocity}
          onComplete={handleParticleComplete}
        />
      ))}
    </>
  );
}

/**
 * Floating damage number
 */
export function DamageNumber({ damage, position, isCritical = false }) {
  const [life, setLife] = useState(1);
  const [offset, setOffset] = useState(0);

  useFrame((state, delta) => {
    setLife((prev) => {
      const newLife = prev - delta * 1.5;
      return newLife <= 0 ? 0 : newLife;
    });
    setOffset((prev) => prev + delta * 2);
  });

  if (life <= 0) {
    return null;
  }

  return (
    <Html
      position={[position.x, position.y + offset, position.z]}
      center
      style={{
        pointerEvents: 'none',
        userSelect: 'none',
      }}
    >
      <div
        style={{
          color: isCritical ? '#ff0000' : '#ffffff',
          fontSize: isCritical ? '24px' : '18px',
          fontWeight: 'bold',
          textShadow: '2px 2px 4px rgba(0,0,0,0.8)',
          opacity: life,
          transform: `translateY(-${offset * 20}px)`,
          transition: 'none',
        }}
      >
        {damage}
        {isCritical && '!'}
      </div>
    </Html>
  );
}

/**
 * Status effect visual (floating icon above zombie)
 */
export function StatusEffectVisual({ type, position }) {
  const effectColors = {
    SLOW: '#00ffff',
    POISON: '#00ff00',
    STUN: '#ffff00',
    BURN: '#ff6600',
  };

  const color = effectColors[type] || '#ffffff';

  return (
    <mesh position={[position.x, position.y + 2, position.z]}>
      <sphereGeometry args={[0.2, 8, 8]} />
      <meshBasicMaterial color={color} transparent opacity={0.7} />
    </mesh>
  );
}

/**
 * Blood splatter effect on the ground
 */
export function BloodSplatter({ position, size = 1 }) {
  const meshRef = useRef();
  const [life, setLife] = useState(1);

  useFrame((state, delta) => {
    setLife((prev) => {
      const newLife = prev - delta * 0.3;
      return newLife <= 0 ? 0 : newLife;
    });
  });

  if (life <= 0) {
    return null;
  }

  return (
    <mesh
      ref={meshRef}
      position={[position.x, 0.02, position.z]}
      rotation={[-Math.PI / 2, 0, Math.random() * Math.PI]}
    >
      <circleGeometry args={[size * (0.5 + Math.random() * 0.5), 8]} />
      <meshBasicMaterial
        color="#8b0000"
        transparent
        opacity={life * 0.6}
        depthWrite={false}
      />
    </mesh>
  );
}

export default {
  DeathEffect,
  DamageNumber,
  StatusEffectVisual,
  BloodSplatter,
};
