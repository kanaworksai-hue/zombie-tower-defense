/**
 * Path visualization component
 * Shows the route zombies will take
 */
import { useMemo } from 'react';
import { useGameStore } from '../../stores/gameStore';
import { CELL_SIZE, COLORS } from '../../constants/game';

/**
 * Path visualization
 */
export function Path() {
  const path = useGameStore((state) => state.path);

  // Calculate path line points
  const pathPoints = useMemo(() => {
    return path.map((point) => ({
      x: (point.x - 9.5) * CELL_SIZE,
      z: (point.z - 9.5) * CELL_SIZE,
    }));
  }, [path]);

  // Create path segments
  const pathSegments = useMemo(() => {
    const segments = [];
    for (let i = 0; i < pathPoints.length - 1; i++) {
      const start = pathPoints[i];
      const end = pathPoints[i + 1];
      const midX = (start.x + end.x) / 2;
      const midZ = (start.z + end.z) / 2;
      const length = Math.sqrt(
        Math.pow(end.x - start.x, 2) + Math.pow(end.z - start.z, 2)
      );
      const angle = Math.atan2(end.z - start.z, end.x - start.x);

      segments.push({
        key: `segment-${i}`,
        position: [midX, 0.05, midZ],
        rotation: [0, -angle, 0],
        length,
      });
    }
    return segments;
  }, [pathPoints]);

  return (
    <group>
      {/* Path segments */}
      {pathSegments.map((segment) => (
        <mesh
          key={segment.key}
          position={segment.position}
          rotation={segment.rotation}
          receiveShadow
        >
          <boxGeometry args={[segment.length, 0.1, CELL_SIZE * 0.8]} />
          <meshStandardMaterial color={COLORS.gridPath} />
        </mesh>
      ))}

      {/* Start marker */}
      {pathPoints.length > 0 && (
        <mesh position={[pathPoints[0].x, 0.1, pathPoints[0].z]}>
          <cylinderGeometry args={[0.5, 0.5, 0.2, 16]} />
          <meshStandardMaterial color="#2ecc71" emissive="#2ecc71" emissiveIntensity={0.3} />
        </mesh>
      )}

      {/* End marker */}
      {pathPoints.length > 0 && (
        <mesh
          position={[
            pathPoints[pathPoints.length - 1].x,
            0.1,
            pathPoints[pathPoints.length - 1].z,
          ]}
        >
          <cylinderGeometry args={[0.5, 0.5, 0.2, 16]} />
          <meshStandardMaterial color="#e74c3c" emissive="#e74c3c" emissiveIntensity={0.3} />
        </mesh>
      )}
    </group>
  );
}
