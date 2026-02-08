/**
 * Tower Manager component
 * Manages all towers, projectiles, and laser beams in the scene
 * Handles tower placement interactions with the grid
 */

import React, { useCallback, useRef } from 'react';
import { useThree } from '@react-three/fiber';
import { useGameStore } from '../../stores/gameStore';
import { TOWER_TYPES } from '../../constants/game';
import { Tower } from './Tower';
import { GhostTower } from './GhostTower';
import { Projectile, LaserBeam } from './Projectile';

/**
 * TowerManager component props
 * @typedef {Object} TowerManagerProps
 * @property {number} cellSize - Size of grid cells
 */

/**
 * TowerManager component
 * @param {TowerManagerProps} props
 */
export function TowerManager({ cellSize = 2 }) {
  const { camera, scene } = useThree();
  const planeRef = useRef();

  // Game store state
  const towers = useGameStore((state) => state.towers);
  const projectiles = useGameStore((state) => state.projectiles);
  const zombies = useGameStore((state) => state.zombies);
  const grid = useGameStore((state) => state.grid);
  const selectedTowerType = useGameStore((state) => state.selectedTowerType);
  const placeTower = useGameStore((state) => state.placeTower);

  // Local state for ghost position
  const [ghostPosition, setGhostPosition] = React.useState(null);
  const [canPlace, setCanPlace] = React.useState(false);

  /**
   * Check if a grid position is valid for tower placement
   * @param {number} gridX - Grid X coordinate
   * @param {number} gridZ - Grid Z coordinate
   * @returns {boolean}
   */
  const isValidPlacement = useCallback((gridX, gridZ) => {
    const cell = grid.find(
      (c) => c.x === gridX && c.z === gridZ
    );
    return cell && !cell.isPath && !cell.isOccupied;
  }, [grid]);

  /**
   * Handle pointer move for ghost tower placement
   */
  const handlePointerMove = useCallback((event) => {
    if (!selectedTowerType) return;

    event.stopPropagation();

    // Get intersection point with ground plane
    const intersection = event.intersections.find(
      (i) => i.object === planeRef.current
    );

    if (intersection) {
      const { point } = intersection;

      // Snap to grid
      const gridX = Math.round(point.x / cellSize);
      const gridZ = Math.round(point.z / cellSize);

      const snappedPosition = {
        x: gridX * cellSize,
        y: 0,
        z: gridZ * cellSize
      };

      const valid = isValidPlacement(gridX, gridZ);
      setGhostPosition(snappedPosition);
      setCanPlace(valid);
    }
  }, [selectedTowerType, cellSize, isValidPlacement]);

  /**
   * Handle click to place tower
   */
  const handleClick = useCallback((event) => {
    if (!selectedTowerType || !canPlace || !ghostPosition) return;

    event.stopPropagation();

    const gridX = Math.round(ghostPosition.x / cellSize);
    const gridZ = Math.round(ghostPosition.z / cellSize);

    const success = placeTower(gridX, gridZ);
    if (success) {
      setGhostPosition(null);
      setCanPlace(false);
    }
  }, [selectedTowerType, canPlace, ghostPosition, cellSize, placeTower]);

  const isPlacing = selectedTowerType !== null;

  return (
    <group>
      {/* Invisible plane for raycasting during placement */}
      {isPlacing && (
        <mesh
          ref={planeRef}
          rotation={[-Math.PI / 2, 0, 0]}
          position={[0, 0.01, 0]}
          onPointerMove={handlePointerMove}
          onClick={handleClick}
          visible={false}
        >
          <planeGeometry args={[100, 100]} />
          <meshBasicMaterial transparent opacity={0} />
        </mesh>
      )}

      {/* Render all placed towers */}
      {towers.map((tower) => (
        <Tower
          key={tower.id}
          tower={tower}
        />
      ))}

      {/* Ghost tower for placement preview */}
      <GhostTower ghostPosition={ghostPosition} canPlace={canPlace} />

      {/* Render projectiles */}
      {projectiles.map((proj) => (
        <Projectile
          key={proj.id}
          projectile={proj}
        />
      ))}

      {/* Render laser beams for freeze towers */}
      {towers.filter(t => t.typeId === 'freeze' && t.targetId).map((tower) => {
        const target = zombies.find((z) => z.id === tower.targetId);
        if (!target) return null;

        const towerType = TOWER_TYPES.FREEZE;

        return (
          <LaserBeam
            key={`beam_${tower.id}`}
            start={{
              x: tower.position.x,
              y: 1.5,
              z: tower.position.z
            }}
            end={{
              x: target.position.x,
              y: 0.5,
              z: target.position.z
            }}
            color={towerType.color}
          />
        );
      })}
    </group>
  );
}
