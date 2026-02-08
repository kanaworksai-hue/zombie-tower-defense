/**
 * Ground plane component
 * Visual representation of the game board
 */
import { useRef } from 'react';
import { GRID_SIZE, CELL_SIZE, COLORS } from '../../constants/game';

/**
 * Ground plane with grid pattern
 */
export function Ground() {
  const gridHelperRef = useRef();

  const gridSize = GRID_SIZE * CELL_SIZE;
  const gridDivisions = GRID_SIZE;

  return (
    <group>
      {/* Base ground plane */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, -0.1, 0]}
        receiveShadow
      >
        <planeGeometry args={[gridSize + 4, gridSize + 4]} />
        <meshStandardMaterial color={COLORS.grid} />
      </mesh>

      {/* Grid lines */}
      <gridHelper
        ref={gridHelperRef}
        args={[gridSize, gridDivisions, COLORS.gridHighlight, COLORS.gridHighlight]}
        position={[0, 0, 0]}
      />
    </group>
  );
}
