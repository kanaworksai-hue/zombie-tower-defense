/**
 * Ghost Tower component
 * Shows a preview of the tower being placed with validity indicator
 */

import React, { useMemo } from 'react';
import { Cylinder, Box, Sphere } from '@react-three/drei';
import { useGameStore } from '../../stores/gameStore';
import { TOWER_TYPES } from '../../constants/game';

/**
 * GhostTower component
 * Renders a semi-transparent preview of the tower at the cursor position
 */
export function GhostTower({ ghostPosition, canPlace }) {
  const selectedTowerType = useGameStore((state) => state.selectedTowerType);

  const towerType = useMemo(() => {
    if (!selectedTowerType) return null;
    return TOWER_TYPES[selectedTowerType.toUpperCase()];
  }, [selectedTowerType]);

  if (!towerType || !ghostPosition) {
    return null;
  }

  const color = canPlace ? towerType.color : '#ff0000';
  const opacity = 0.5;

  // Render simplified tower model based on type
  const renderGhostModel = () => {
    switch (towerType.id) {
      case 'basic':
        return (
          <group>
            <Cylinder
              args={[0.4, 0.5, 0.3, 8]}
              position={[0, 0.15, 0]}
              material-color={color}
              material-transparent
              material-opacity={opacity}
            />
            <Cylinder
              args={[0.35, 0.4, 0.4, 8]}
              position={[0, 0.5, 0]}
              material-color={color}
              material-transparent
              material-opacity={opacity}
            />
            <Box
              args={[0.6, 0.25, 0.25]}
              position={[0.2, 0.7, 0]}
              material-color={color}
              material-transparent
              material-opacity={opacity}
            />
          </group>
        );

      case 'sniper':
        return (
          <group>
            <Cylinder
              args={[0.45, 0.55, 0.3, 6]}
              position={[0, 0.15, 0]}
              material-color={color}
              material-transparent
              material-opacity={opacity}
            />
            <Cylinder
              args={[0.3, 0.35, 0.5, 6]}
              position={[0, 0.55, 0]}
              material-color={color}
              material-transparent
              material-opacity={opacity}
            />
            <Box
              args={[1.2, 0.2, 0.2]}
              position={[0.4, 0.8, 0]}
              material-color={color}
              material-transparent
              material-opacity={opacity}
            />
          </group>
        );

      case 'rapid':
        return (
          <group>
            <Cylinder
              args={[0.4, 0.5, 0.3, 8]}
              position={[0, 0.15, 0]}
              material-color={color}
              material-transparent
              material-opacity={opacity}
            />
            <Box
              args={[0.5, 0.4, 0.5]}
              position={[0, 0.5, 0]}
              material-color={color}
              material-transparent
              material-opacity={opacity}
            />
            <Cylinder
              args={[0.1, 0.1, 0.5, 6]}
              position={[0.3, 0.6, 0]}
              rotation={[0, 0, Math.PI / 2]}
              material-color="#333333"
              material-transparent
              material-opacity={opacity}
            />
          </group>
        );

      case 'splash':
        return (
          <group>
            <Cylinder
              args={[0.5, 0.6, 0.25, 8]}
              position={[0, 0.125, 0]}
              material-color={color}
              material-transparent
              material-opacity={opacity}
            />
            <Sphere
              args={[0.4, 16, 8, 0, Math.PI * 2, 0, Math.PI / 2]}
              position={[0, 0.25, 0]}
              material-color={color}
              material-transparent
              material-opacity={opacity}
            />
          </group>
        );

      case 'freeze':
        return (
          <group>
            <Cylinder
              args={[0.4, 0.5, 0.3, 8]}
              position={[0, 0.15, 0]}
              material-color={color}
              material-transparent
              material-opacity={opacity}
            />
            <Cylinder
              args={[0.15, 0.25, 0.6, 6]}
              position={[0, 0.5, 0]}
              material-color={color}
              material-transparent
              material-opacity={opacity}
            />
          </group>
        );

      default:
        return null;
    }
  };

  return (
    <group position={[ghostPosition.x, 0, ghostPosition.z]}>
      {/* Ghost tower model */}
      {renderGhostModel()}

      {/* Range indicator */}
      <Cylinder
        args={[towerType.range, towerType.range, 0.02, 32]}
        position={[0, 0.01, 0]}
        material-color={canPlace ? '#00ff00' : '#ff0000'}
        material-transparent
        material-opacity={0.15}
      />

      {/* Valid/Invalid placement indicator */}
      <Cylinder
        args={[0.55, 0.55, 0.05, 8]}
        position={[0, 0.025, 0]}
        material-color={canPlace ? '#00ff00' : '#ff0000'}
        material-transparent
        material-opacity={0.3}
      />
    </group>
  );
}
