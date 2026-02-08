/**
 * Base Tower component
 * Renders a tower with its visual elements and handles selection
 */

import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Cylinder, Box, Sphere } from '@react-three/drei';
import { useGameStore } from '../../stores/gameStore';
import { TOWER_TYPES } from '../../constants/game';

/**
 * Tower component props
 * @typedef {Object} TowerProps
 * @property {Object} tower - Tower data object
 */

/**
 * Tower component
 * @param {TowerProps} props
 */
export function Tower({ tower }) {
  const towerRef = useRef();
  const turretRef = useRef();

  const towerType = useMemo(() => TOWER_TYPES[tower.typeId.toUpperCase()], [tower.typeId]);

  const selectedTowerId = useGameStore((state) => state.selectedTowerId);
  const selectTower = useGameStore((state) => state.selectTower);

  const isSelected = selectedTowerId === tower.id;

  // Animate turret rotation
  useFrame(() => {
    if (turretRef.current && tower.targetId) {
      // Calculate angle to target
      const target = useGameStore.getState().zombies.find(z => z.id === tower.targetId);
      if (target) {
        const angle = Math.atan2(
          target.position.z - tower.position.z,
          target.position.x - tower.position.x
        );

        // Smooth rotation towards target angle
        const currentRotation = turretRef.current.rotation.y;
        let targetRotation = angle;

        // Normalize angles
        while (targetRotation - currentRotation > Math.PI) targetRotation -= Math.PI * 2;
        while (targetRotation - currentRotation < -Math.PI) targetRotation += Math.PI * 2;

        turretRef.current.rotation.y += (targetRotation - currentRotation) * 0.1;
      }
    }
  });

  // Handle click to select tower
  const handleClick = (e) => {
    e.stopPropagation();
    selectTower(tower.id);
  };

  // Get color based on level (slightly brighter for higher levels)
  const getLevelColor = (baseColor, level) => {
    const factor = 1 + (level - 1) * 0.1;
    const hex = baseColor.replace('#', '');
    const r = Math.min(255, parseInt(hex.substr(0, 2), 16) * factor);
    const g = Math.min(255, parseInt(hex.substr(2, 2), 16) * factor);
    const b = Math.min(255, parseInt(hex.substr(4, 2), 16) * factor);
    return `#${Math.round(r).toString(16).padStart(2, '0')}${Math.round(g).toString(16).padStart(2, '0')}${Math.round(b).toString(16).padStart(2, '0')}`;
  };

  const towerColor = getLevelColor(towerType.color, tower.level);

  // Render different tower models based on type
  const renderTowerModel = () => {
    switch (tower.typeId) {
      case 'basic':
        return (
          <group>
            {/* Base */}
            <Cylinder args={[0.4, 0.5, 0.3, 8]} position={[0, 0.15, 0]}>
              <meshStandardMaterial color="#555555" />
            </Cylinder>
            {/* Turret base */}
            <Cylinder args={[0.35, 0.4, 0.4, 8]} position={[0, 0.5, 0]}>
              <meshStandardMaterial color={towerColor} />
            </Cylinder>
            {/* Turret (rotates) */}
            <group ref={turretRef} position={[0, 0.7, 0]}>
              <Box args={[0.6, 0.25, 0.25]} position={[0.2, 0, 0]}>
                <meshStandardMaterial color={towerColor} />
              </Box>
              <Cylinder
                args={[0.1, 0.1, 0.4, 8]}
                position={[0.5, 0, 0]}
                rotation={[0, 0, Math.PI / 2]}
              >
                <meshStandardMaterial color="#333333" />
              </Cylinder>
            </group>
          </group>
        );

      case 'sniper':
        return (
          <group>
            {/* Base */}
            <Cylinder args={[0.45, 0.55, 0.3, 6]} position={[0, 0.15, 0]}>
              <meshStandardMaterial color="#444444" />
            </Cylinder>
            {/* Turret base */}
            <Cylinder args={[0.3, 0.35, 0.5, 6]} position={[0, 0.55, 0]}>
              <meshStandardMaterial color={towerColor} />
            </Cylinder>
            {/* Turret (rotates) */}
            <group ref={turretRef} position={[0, 0.8, 0]}>
              <Box args={[1.2, 0.2, 0.2]} position={[0.4, 0, 0]}>
                <meshStandardMaterial color={towerColor} />
              </Box>
              <Cylinder
                args={[0.08, 0.12, 0.8, 8]}
                position={[0.8, 0, 0]}
                rotation={[0, 0, Math.PI / 2]}
              >
                <meshStandardMaterial color="#222222" />
              </Cylinder>
              {/* Scope */}
              <Cylinder
                args={[0.06, 0.06, 0.3, 8]}
                position={[0.3, 0.15, 0]}
                rotation={[0, 0, Math.PI / 2]}
              >
                <meshStandardMaterial color="#111111" />
              </Cylinder>
            </group>
          </group>
        );

      case 'rapid':
        return (
          <group>
            {/* Base */}
            <Cylinder args={[0.4, 0.5, 0.3, 8]} position={[0, 0.15, 0]}>
              <meshStandardMaterial color="#555555" />
            </Cylinder>
            {/* Turret base */}
            <Box args={[0.5, 0.4, 0.5]} position={[0, 0.5, 0]}>
              <meshStandardMaterial color={towerColor} />
            </Box>
            {/* Turret (rotates) */}
            <group ref={turretRef} position={[0, 0.7, 0]}>
              {/* Quad barrels */}
              {[[-0.1, -0.1], [0.1, -0.1], [-0.1, 0.1], [0.1, 0.1]].map(([x, z], i) => (
                <Cylinder
                  key={i}
                  args={[0.05, 0.05, 0.4, 6]}
                  position={[0.3 + x * 0.5, 0, z * 0.5]}
                  rotation={[0, 0, Math.PI / 2]}
                >
                  <meshStandardMaterial color="#333333" />
                </Cylinder>
              ))}
            </group>
          </group>
        );

      case 'splash':
        return (
          <group>
            {/* Base */}
            <Cylinder args={[0.5, 0.6, 0.25, 8]} position={[0, 0.125, 0]}>
              <meshStandardMaterial color="#555555" />
            </Cylinder>
            {/* Dome */}
            <Sphere
              args={[0.4, 16, 8, 0, Math.PI * 2, 0, Math.PI / 2]}
              position={[0, 0.25, 0]}
            >
              <meshStandardMaterial color={towerColor} />
            </Sphere>
            {/* Turret (rotates) */}
            <group ref={turretRef} position={[0, 0.5, 0]}>
              <Box args={[0.3, 0.3, 0.3]}>
                <meshStandardMaterial color={towerColor} />
              </Box>
              <Cylinder
                args={[0.15, 0.2, 0.3, 8]}
                position={[0.25, 0, 0]}
                rotation={[0, 0, Math.PI / 2]}
              >
                <meshStandardMaterial color="#aa4444" />
              </Cylinder>
            </group>
          </group>
        );

      case 'freeze':
        return (
          <group>
            {/* Base */}
            <Cylinder args={[0.4, 0.5, 0.3, 8]} position={[0, 0.15, 0]}>
              <meshStandardMaterial color="#555555" />
            </Cylinder>
            {/* Crystal structure */}
            <group ref={turretRef} position={[0, 0.5, 0]}>
              {/* Central crystal */}
              <Cylinder args={[0.15, 0.25, 0.6, 6]}>
                <meshStandardMaterial color={towerColor} transparent opacity={0.8} />
              </Cylinder>
              {/* Orbiting crystals */}
              {[0, 1, 2].map((i) => (
                <Sphere key={i} args={[0.1, 8, 8]} position={[Math.cos((Date.now() / 1000 + i * 2.09)) * 0.35, Math.sin((Date.now() / 1000 + i * 2.09)) * 0.2, Math.sin((Date.now() / 1000 + i * 2.09)) * 0.35]}>
                  <meshStandardMaterial color="#ffffff" emissive={towerColor} emissiveIntensity={0.5} />
                </Sphere>
              ))}
            </group>
          </group>
        );

      default:
        return null;
    }
  };

  // Render upgrade level indicators
  const renderLevelIndicators = () => {
    const indicators = [];
    for (let i = 0; i < tower.level; i++) {
      indicators.push(
        <Sphere
          key={i}
          args={[0.06, 6, 6]}
          position={[
            Math.cos((i / tower.level) * Math.PI * 2) * 0.35,
            0.05,
            Math.sin((i / tower.level) * Math.PI * 2) * 0.35
          ]}
        >
          <meshStandardMaterial color="#ffd700" emissive="#ffd700" emissiveIntensity={0.3} />
        </Sphere>
      );
    }
    return indicators;
  };

  return (
    <group
      ref={towerRef}
      position={[tower.position.x, 0, tower.position.z]}
      onClick={handleClick}
    >
      {/* Tower model */}
      {renderTowerModel()}

      {/* Level indicators */}
      {renderLevelIndicators()}

      {/* Selection highlight */}
      {isSelected && (
        <group>
          <Cylinder args={[towerType.range, towerType.range, 0.02, 32]} position={[0, 0.01, 0]} rotation={[0, 0, 0]}>
            <meshStandardMaterial color="#ffff00" transparent opacity={0.2} />
          </Cylinder>
          <Cylinder args={[towerType.range, towerType.range, 0.02, 32]} position={[0, 0.02, 0]} rotation={[0, 0, 0]}>
            <meshStandardMaterial color="#ffff00" transparent opacity={0.1} wireframe />
          </Cylinder>
        </group>
      )}
    </group>
  );
}
