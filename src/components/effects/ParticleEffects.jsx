/**
 * Particle effects system for visual polish
 * Handles explosions, hit effects, and other particle animations
 */
import { useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * Individual particle
 */
function Particle({ position, velocity, color, size, life, onComplete }) {
  const meshRef = useRef();
  const startTime = useMemo(() => Date.now(), []);

  useFrame(() => {
    if (!meshRef.current) return;

    const elapsed = Date.now() - startTime;
    const progress = elapsed / life;

    if (progress >= 1) {
      onComplete?.();
      return;
    }

    // Update position
    meshRef.current.position.x += velocity.x * 0.016;
    meshRef.current.position.y += velocity.y * 0.016;
    meshRef.current.position.z += velocity.z * 0.016;

    // Apply gravity
    velocity.y -= 9.8 * 0.016 * 0.5;

    // Fade out
    const scale = size * (1 - progress);
    meshRef.current.scale.setScalar(scale);

    // Update opacity
    if (meshRef.current.material) {
      meshRef.current.material.opacity = 1 - progress;
    }
  });

  return (
    <mesh ref={meshRef} position={position}>
      <boxGeometry args={[1, 1, 1]} />
      <meshBasicMaterial color={color} transparent opacity={1} />
    </mesh>
  );
}

/**
 * Explosion effect with multiple particles
 */
export function ExplosionEffect({ position, color = '#ff6600', particleCount = 12, onComplete }) {
  const particles = useMemo(() => {
    return Array.from({ length: particleCount }, (_, i) => {
      const angle = (i / particleCount) * Math.PI * 2;
      const speed = 3 + Math.random() * 4;
      return {
        id: i,
        position: [position.x, position.y, position.z],
        velocity: {
          x: Math.cos(angle) * speed,
          y: 2 + Math.random() * 4,
          z: Math.sin(angle) * speed,
        },
        color: i % 2 === 0 ? color : '#ffcc00',
        size: 0.1 + Math.random() * 0.2,
        life: 600 + Math.random() * 400,
      };
    });
  }, [position, color, particleCount]);

  const [activeParticles, setActiveParticles] = useState(particles);

  const handleParticleComplete = (id) => {
    setActiveParticles((prev) => {
      const remaining = prev.filter((p) => p.id !== id);
      if (remaining.length === 0) {
        onComplete?.();
      }
      return remaining;
    });
  };

  return (
    <group>
      {activeParticles.map((particle) => (
        <Particle
          key={particle.id}
          position={particle.position}
          velocity={particle.velocity}
          color={particle.color}
          size={particle.size}
          life={particle.life}
          onComplete={() => handleParticleComplete(particle.id)}
        />
      ))}
    </group>
  );
}

/**
 * Hit effect - small burst at impact point
 */
export function HitEffect({ position, color = '#ffffff', onComplete }) {
  const particles = useMemo(() => {
    return Array.from({ length: 6 }, (_, i) => {
      const angle = (i / 6) * Math.PI * 2;
      const speed = 2 + Math.random() * 2;
      return {
        id: i,
        position: [position.x, position.y, position.z],
        velocity: {
          x: Math.cos(angle) * speed,
          y: Math.random() * 2,
          z: Math.sin(angle) * speed,
        },
        color: color,
        size: 0.08,
        life: 300,
      };
    });
  }, [position, color]);

  const [activeParticles, setActiveParticles] = useState(particles);

  const handleParticleComplete = (id) => {
    setActiveParticles((prev) => {
      const remaining = prev.filter((p) => p.id !== id);
      if (remaining.length === 0) {
        onComplete?.();
      }
      return remaining;
    });
  };

  return (
    <group>
      {activeParticles.map((particle) => (
        <Particle
          key={particle.id}
          position={particle.position}
          velocity={particle.velocity}
          color={particle.color}
          size={particle.size}
          life={particle.life}
          onComplete={() => handleParticleComplete(particle.id)}
        />
      ))}
    </group>
  );
}

/**
 * Muzzle flash effect for tower shooting
 */
export function MuzzleFlash({ position, rotation, color = '#ffff00', onComplete }) {
  const meshRef = useRef();
  const startTime = useMemo(() => Date.now(), []);
  const life = 100; // Very short flash

  useFrame(() => {
    if (!meshRef.current) return;

    const elapsed = Date.now() - startTime;
    const progress = elapsed / life;

    if (progress >= 1) {
      onComplete?.();
      return;
    }

    // Quick flash and fade
    const intensity = 1 - progress;
    meshRef.current.scale.setScalar(0.5 + intensity * 0.5);
    if (meshRef.current.material) {
      meshRef.current.material.opacity = intensity;
    }
  });

  return (
    <mesh
      ref={meshRef}
      position={[position.x, position.y, position.z]}
      rotation={[0, rotation, 0]}
    >
      <coneGeometry args={[0.15, 0.4, 8]} />
      <meshBasicMaterial color={color} transparent opacity={1} />
    </mesh>
  );
}

/**
 * Smoke effect for explosions and deaths
 */
export function SmokeEffect({ position, color = '#666666', onComplete }) {
  const particles = useMemo(() => {
    return Array.from({ length: 8 }, (_, i) => {
      const angle = Math.random() * Math.PI * 2;
      const speed = 1 + Math.random() * 2;
      return {
        id: i,
        position: [position.x, position.y + 0.5, position.z],
        velocity: {
          x: Math.cos(angle) * speed,
          y: 1 + Math.random() * 2,
          z: Math.sin(angle) * speed,
        },
        color: color,
        size: 0.3 + Math.random() * 0.3,
        life: 1000 + Math.random() * 500,
      };
    });
  }, [position, color]);

  const [activeParticles, setActiveParticles] = useState(particles);

  const handleParticleComplete = (id) => {
    setActiveParticles((prev) => {
      const remaining = prev.filter((p) => p.id !== id);
      if (remaining.length === 0) {
        onComplete?.();
      }
      return remaining;
    });
  };

  return (
    <group>
      {activeParticles.map((particle) => (
        <Particle
          key={particle.id}
          position={particle.position}
          velocity={particle.velocity}
          color={particle.color}
          size={particle.size}
          life={particle.life}
          onComplete={() => handleParticleComplete(particle.id)}
        />
      ))}
    </group>
  );
}

/**
 * Spark effect for impacts
 */
export function SparkEffect({ position, color = '#ffffaa', onComplete }) {
  const particles = useMemo(() => {
    return Array.from({ length: 10 }, (_, i) => {
      const angle = (i / 10) * Math.PI * 2 + Math.random() * 0.5;
      const speed = 4 + Math.random() * 6;
      return {
        id: i,
        position: [position.x, position.y, position.z],
        velocity: {
          x: Math.cos(angle) * speed,
          y: Math.random() * 3,
          z: Math.sin(angle) * speed,
        },
        color: color,
        size: 0.05,
        life: 200 + Math.random() * 200,
      };
    });
  }, [position, color]);

  const [activeParticles, setActiveParticles] = useState(particles);

  const handleParticleComplete = (id) => {
    setActiveParticles((prev) => {
      const remaining = prev.filter((p) => p.id !== id);
      if (remaining.length === 0) {
        onComplete?.();
      }
      return remaining;
    });
  };

  return (
    <group>
      {activeParticles.map((particle) => (
        <Particle
          key={particle.id}
          position={particle.position}
          velocity={particle.velocity}
          color={particle.color}
          size={particle.size}
          life={particle.life}
          onComplete={() => handleParticleComplete(particle.id)}
        />
      ))}
    </group>
  );
}

// Import useState for the components
import { useState } from 'react';
