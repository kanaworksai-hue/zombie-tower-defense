/**
 * Grid selector component
 * Handles mouse interaction for tower placement
 */
import { useState, useCallback } from 'react';
import { useThree } from '@react-three/fiber';
import { useGameStore } from '../../stores/gameStore';
import { GRID_SIZE, CELL_SIZE, COLORS, TOWER_TYPES } from '../../constants/game';
import { worldToGrid, gridToWorld } from '../../utils/math';

/**
 * Grid cell selector for tower placement
 */
export function GridSelector() {
  const { camera, scene } = useThree();
  const [hoveredCell, setHoveredCell] = useState(null);

  const selectedTowerType = useGameStore((state) => state.selectedTowerType);
  const grid = useGameStore((state) => state.grid);
  const placeTower = useGameStore((state) => state.placeTower);
  const deselectTowerType = useGameStore((state) => state.deselectTowerType);

  // Check if a grid cell is valid for placement
  const isValidPlacement = useCallback(
    (gridX, gridZ) => {
      if (!selectedTowerType) return false;

      const cell = grid.find((c) => c.x === gridX && c.z === gridZ);
      if (!cell) return false;

      return !cell.isPath && !cell.isOccupied;
    },
    [grid, selectedTowerType]
  );

  // Handle pointer move
  const handlePointerMove = useCallback(
    (event) => {
      if (!selectedTowerType) {
        setHoveredCell(null);
        return;
      }

      event.stopPropagation();

      // Get intersection point with ground plane
      const { point } = event;
      const gridPos = worldToGrid(point.x, point.z);

      // Clamp to grid bounds
      const clampedX = Math.max(0, Math.min(GRID_SIZE - 1, gridPos.x));
      const clampedZ = Math.max(0, Math.min(GRID_SIZE - 1, gridPos.z));

      setHoveredCell({ x: clampedX, z: clampedZ });
    },
    [selectedTowerType]
  );

  // Handle click for tower placement
  const handleClick = useCallback(
    (event) => {
      if (!selectedTowerType || !hoveredCell) return;

      event.stopPropagation();

      if (isValidPlacement(hoveredCell.x, hoveredCell.z)) {
        const success = placeTower(hoveredCell.x, hoveredCell.z);
        if (success) {
          // Optional: Keep selected for multiple placements
          // deselectTowerType();
        }
      }
    },
    [selectedTowerType, hoveredCell, isValidPlacement, placeTower]
  );

  // Handle right click to cancel
  const handleContextMenu = useCallback(
    (event) => {
      if (selectedTowerType) {
        event.preventDefault();
        deselectTowerType();
        setHoveredCell(null);
      }
    },
    [selectedTowerType, deselectTowerType]
  );

  // Get preview color based on validity
  const getPreviewColor = useCallback(() => {
    if (!hoveredCell || !selectedTowerType) return COLORS.selection;
    return isValidPlacement(hoveredCell.x, hoveredCell.z)
      ? COLORS.validPlacement
      : COLORS.invalidPlacement;
  }, [hoveredCell, selectedTowerType, isValidPlacement]);

  // Get tower preview color
  const getTowerColor = useCallback(() => {
    if (!selectedTowerType) return '#ffffff';
    const towerType = TOWER_TYPES[selectedTowerType.toUpperCase()];
    return towerType?.color || '#ffffff';
  }, [selectedTowerType]);

  if (!selectedTowerType) {
    return (
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, -0.05, 0]}
        onContextMenu={handleContextMenu}
      >
        <planeGeometry args={[GRID_SIZE * CELL_SIZE, GRID_SIZE * CELL_SIZE]} />
        <meshBasicMaterial visible={false} />
      </mesh>
    );
  }

  const worldPos = hoveredCell
    ? gridToWorld(hoveredCell.x, hoveredCell.z)
    : { x: 0, y: 0, z: 0 };

  return (
    <group>
      {/* Invisible ground plane for raycasting */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, -0.05, 0]}
        onPointerMove={handlePointerMove}
        onClick={handleClick}
        onContextMenu={handleContextMenu}
      >
        <planeGeometry args={[GRID_SIZE * CELL_SIZE, GRID_SIZE * CELL_SIZE]} />
        <meshBasicMaterial visible={false} />
      </mesh>

      {/* Placement preview */}
      {hoveredCell && (
        <group position={[worldPos.x, 0, worldPos.z]}>
          {/* Selection highlight */}
          <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[CELL_SIZE * 0.9, CELL_SIZE * 0.9]} />
            <meshBasicMaterial
              color={getPreviewColor()}
              transparent
              opacity={0.5}
            />
          </mesh>

          {/* Tower preview */}
          {isValidPlacement(hoveredCell.x, hoveredCell.z) && (
            <group>
              {/* Tower base */}
              <mesh position={[0, 0.5, 0]} castShadow>
                <cylinderGeometry args={[0.4, 0.5, 0.3, 8]} />
                <meshStandardMaterial color="#555555" />
              </mesh>

              {/* Tower body */}
              <mesh position={[0, 1, 0]} castShadow>
                <cylinderGeometry args={[0.3, 0.35, 0.8, 8]} />
                <meshStandardMaterial
                  color={getTowerColor()}
                  transparent
                  opacity={0.7}
                />
              </mesh>

              {/* Range indicator */}
              {(() => {
                const towerType = TOWER_TYPES[selectedTowerType.toUpperCase()];
                const range = towerType?.range * CELL_SIZE || 4;
                return (
                  <mesh position={[0, 0.05, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                    <ringGeometry args={[range - 0.1, range, 64]} />
                    <meshBasicMaterial
                      color={getTowerColor()}
                      transparent
                      opacity={0.3}
                    />
                  </mesh>
                );
              })()}
            </group>
          )}
        </group>
      )}
    </group>
  );
}
