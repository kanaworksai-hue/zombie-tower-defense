/**
 * Floating damage numbers for visual feedback
 * Shows damage dealt to zombies
 */
import { useRef, useMemo, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';

/**
 * Individual damage number
 */
function DamageNumber({ value, position, color, critical, onComplete }) {
  const textRef = useRef();
  const startTime = useMemo(() => Date.now(), []);
  const startPos = useMemo(() => new THREE.Vector3(position.x, position.y + 1, position.z), [position]);
  const life = 800; // ms

  useFrame(() => {
    if (!textRef.current) return;

    const elapsed = Date.now() - startTime;
    const progress = elapsed / life;

    if (progress >= 1) {
      onComplete?.();
      return;
    }

    // Float upward
    textRef.current.position.y = startPos.y + progress * 1.5;

    // Slight horizontal drift
    textRef.current.position.x = startPos.x + Math.sin(progress * Math.PI * 2) * 0.2;

    // Fade out
    const opacity = 1 - Math.pow(progress, 2);
    if (textRef.current.material) {
      textRef.current.material.opacity = opacity;
    }

    // Scale animation
    const scale = critical ? 1.2 : 1;
    const scalePulse = 1 + Math.sin(progress * Math.PI) * 0.3;
    textRef.current.scale.setScalar(scale * scalePulse);
  });

  return (
    <Text
      ref={textRef}
      position={startPos}
      fontSize={critical ? 0.5 : 0.35}
      color={color}
      anchorX="center"
      anchorY="middle"
      font="https://fonts.gstatic.com/s/roboto/v20/KFOmCnqEu92Fr1Mu4mxM.woff"
    >
      {critical ? `${value}!` : value}
      <meshBasicMaterial color={color} transparent />
    </Text>
  );
}

/**
 * Manager for damage numbers
 */
let damageNumberId = 0;
const pendingDamageNumbers = [];

/**
 * Add a damage number to the queue
 * @param {number} value - Damage value to display
 * @param {Object} position - Position {x, y, z}
 * @param {Object} options - Display options
 */
export function showDamageNumber(value, position, options = {}) {
  const {
    color = '#ffffff',
    critical = false,
    isHeal = false,
  } = options;

  const id = ++damageNumberId;
  pendingDamageNumbers.push({
    id,
    value,
    position,
    color: isHeal ? '#2ecc71' : critical ? '#ff0000' : color,
    critical,
  });

  // Keep only last 20 damage numbers
  if (pendingDamageNumbers.length > 20) {
    pendingDamageNumbers.shift();
  }
}

/**
 * Component that renders all active damage numbers
 */
export function DamageNumbersManager() {
  const [damageNumbers, setDamageNumbers] = useState([]);

  // Check for new damage numbers
  useFrame(() => {
    if (pendingDamageNumbers.length > 0) {
      const newNumbers = [...pendingDamageNumbers];
      pendingDamageNumbers.length = 0;
      setDamageNumbers((prev) => [...prev, ...newNumbers]);
    }
  });

  const handleComplete = (id) => {
    setDamageNumbers((prev) => prev.filter((dn) => dn.id !== id));
  };

  return (
    <group>
      {damageNumbers.map((dn) => (
        <DamageNumber
          key={dn.id}
          value={dn.value}
          position={dn.position}
          color={dn.color}
          critical={dn.critical}
          onComplete={() => handleComplete(dn.id)}
        />
      ))}
    </group>
  );
}

/**
 * Hook to show damage numbers from components
 */
export function useDamageNumbers() {
  const show = (value, position, options) => {
    showDamageNumber(value, position, options);
  };

  return { showDamageNumber: show };
}
