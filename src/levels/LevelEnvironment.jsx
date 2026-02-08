/**
 * Level Environment Component
 * Renders the 3D environment for a level including ground, props, and lighting
 */

import { useMemo } from 'react';
import { getLevel } from './index.js';
import { CELL_SIZE } from '../constants/game.js';

/**
 * Tree prop component
 */
function Tree({ x, z, scale = 1, color = '#2d5016', rotation = 0 }) {
  return (
    <group position={[x, 0, z]} rotation={[0, rotation, 0]}>
      {/* Trunk */}
      <mesh position={[0, 0.75, 0]} castShadow>
        <cylinderGeometry args={[0.15, 0.2, 1.5, 6]} />
        <meshStandardMaterial color="#5d4037" />
      </mesh>
      {/* Foliage - low poly style with multiple cones */}
      <mesh position={[0, 2, 0]} castShadow>
        <coneGeometry args={[0.8 * scale, 1.5 * scale, 6]} />
        <meshStandardMaterial color={color} />
      </mesh>
      <mesh position={[0, 2.8, 0]} castShadow>
        <coneGeometry args={[0.6 * scale, 1.2 * scale, 6]} />
        <meshStandardMaterial color={color} />
      </mesh>
      <mesh position={[0, 3.4, 0]} castShadow>
        <coneGeometry args={[0.4 * scale, 0.8 * scale, 6]} />
        <meshStandardMaterial color={color} />
      </mesh>
    </group>
  );
}

/**
 * Rock prop component
 */
function Rock({ x, z, scale = 1, color = '#7f8c8d', rotation = 0 }) {
  return (
    <group position={[x, 0, z]} rotation={[0, rotation, 0]}>
      <mesh position={[0, 0.3 * scale, 0]} castShadow>
        <dodecahedronGeometry args={[0.4 * scale, 0]} />
        <meshStandardMaterial color={color} />
      </mesh>
    </group>
  );
}

/**
 * Building prop component
 */
function Building({ x, z, scale = 1, color = '#95a5a6', rotation = 0 }) {
  return (
    <group position={[x, 0, z]} rotation={[0, rotation, 0]}>
      <mesh position={[0, scale, 0]} castShadow>
        <boxGeometry args={[scale, scale * 2, scale]} />
        <meshStandardMaterial color={color} />
      </mesh>
      {/* Roof */}
      <mesh position={[0, scale * 2 + scale * 0.3, 0]} castShadow>
        <coneGeometry args={[scale * 0.8, scale * 0.6, 4]} />
        <meshStandardMaterial color={color} />
      </mesh>
    </group>
  );
}

/**
 * Fence prop component
 */
function Fence({ x, z, scale = 1, color = '#8b4513', rotation = 0 }) {
  return (
    <group position={[x, 0, z]} rotation={[0, rotation, 0]}>
      {/* Posts */}
      <mesh position={[-0.4, 0.4, 0]} castShadow>
        <boxGeometry args={[0.1, 0.8, 0.1]} />
        <meshStandardMaterial color={color} />
      </mesh>
      <mesh position={[0.4, 0.4, 0]} castShadow>
        <boxGeometry args={[0.1, 0.8, 0.1]} />
        <meshStandardMaterial color={color} />
      </mesh>
      {/* Rails */}
      <mesh position={[0, 0.6, 0]} castShadow>
        <boxGeometry args={[0.9, 0.08, 0.05]} />
        <meshStandardMaterial color={color} />
      </mesh>
      <mesh position={[0, 0.3, 0]} castShadow>
        <boxGeometry args={[0.9, 0.08, 0.05]} />
        <meshStandardMaterial color={color} />
      </mesh>
    </group>
  );
}

/**
 * Barrel prop component
 */
function Barrel({ x, z, scale = 1, color = '#c0392b', rotation = 0 }) {
  return (
    <group position={[x, 0, z]} rotation={[0, rotation, 0]}>
      <mesh position={[0, 0.4 * scale, 0]} castShadow>
        <cylinderGeometry args={[0.25 * scale, 0.25 * scale, 0.8 * scale, 8]} />
        <meshStandardMaterial color={color} />
      </mesh>
      {/* Rim */}
      <mesh position={[0, 0.75 * scale, 0]} castShadow>
        <torusGeometry args={[0.25 * scale, 0.03, 4, 8]} />
        <meshStandardMaterial color="#2c3e50" />
      </mesh>
    </group>
  );
}

/**
 * Crate prop component
 */
function Crate({ x, z, scale = 1, color = '#d35400', rotation = 0 }) {
  return (
    <group position={[x, 0, z]} rotation={[0, rotation, 0]}>
      <mesh position={[0, 0.25 * scale, 0]} castShadow>
        <boxGeometry args={[0.5 * scale, 0.5 * scale, 0.5 * scale]} />
        <meshStandardMaterial color={color} />
      </mesh>
      {/* Cross brace detail */}
      <mesh position={[0, 0.25 * scale, 0.26 * scale]}>
        <boxGeometry args={[0.4 * scale, 0.4 * scale, 0.02]} />
        <meshStandardMaterial color="#2c3e50" />
      </mesh>
    </group>
  );
}

/**
 * Prop renderer that switches based on prop type
 */
function PropRenderer({ prop }) {
  const { type, x, z, scale, color, rotation } = prop;

  switch (type) {
    case 'tree':
      return <Tree x={x} z={z} scale={scale} color={color} rotation={rotation} />;
    case 'rock':
      return <Rock x={x} z={z} scale={scale} color={color} rotation={rotation} />;
    case 'building':
      return <Building x={x} z={z} scale={scale} color={color} rotation={rotation} />;
    case 'fence':
      return <Fence x={x} z={z} scale={scale} color={color} rotation={rotation} />;
    case 'barrel':
      return <Barrel x={x} z={z} scale={scale} color={color} rotation={rotation} />;
    case 'crate':
      return <Crate x={x} z={z} scale={scale} color={color} rotation={rotation} />;
    default:
      console.warn(`Unknown prop type: ${type}`);
      return null;
  }
}

/**
 * Ground plane component for a specific level
 */
function LevelGround({ groundColor, pathColor, gridSize, pathWaypoints }) {
  const gridSizeWorld = gridSize * CELL_SIZE;

  // Calculate path segments for visual rendering
  const pathSegments = useMemo(() => {
    const segments = [];
    for (let i = 0; i < pathWaypoints.length - 1; i++) {
      const start = pathWaypoints[i];
      const end = pathWaypoints[i + 1];

      const startWorld = {
        x: start.x * CELL_SIZE - (gridSize * CELL_SIZE) / 2 + CELL_SIZE / 2,
        z: start.z * CELL_SIZE - (gridSize * CELL_SIZE) / 2 + CELL_SIZE / 2,
      };
      const endWorld = {
        x: end.x * CELL_SIZE - (gridSize * CELL_SIZE) / 2 + CELL_SIZE / 2,
        z: end.z * CELL_SIZE - (gridSize * CELL_SIZE) / 2 + CELL_SIZE / 2,
      };

      const dx = endWorld.x - startWorld.x;
      const dz = endWorld.z - startWorld.z;
      const length = Math.sqrt(dx * dx + dz * dz);
      const angle = Math.atan2(dz, dx);

      segments.push({
        x: (startWorld.x + endWorld.x) / 2,
        z: (startWorld.z + endWorld.z) / 2,
        length,
        angle,
      });
    }
    return segments;
  }, [pathWaypoints, gridSize]);

  return (
    <group>
      {/* Base ground */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, -0.1, 0]}
        receiveShadow
      >
        <planeGeometry args={[gridSizeWorld + 4, gridSizeWorld + 4]} />
        <meshStandardMaterial color={groundColor} />
      </mesh>

      {/* Path visualization */}
      {pathSegments.map((segment, index) => (
        <mesh
          key={index}
          position={[segment.x, 0.01, segment.z]}
          rotation={[-Math.PI / 2, 0, segment.angle]}
          receiveShadow
        >
          <planeGeometry args={[segment.length + 0.2, CELL_SIZE + 0.2]} />
          <meshStandardMaterial color={pathColor} />
        </mesh>
      ))}

      {/* Grid lines */}
      <gridHelper
        args={[gridSizeWorld, gridSize, '#4a4a6e', '#4a4a6e']}
        position={[0, 0, 0]}
      />
    </group>
  );
}

/**
 * Lighting setup for a level
 */
function LevelLighting({ lighting }) {
  const {
    ambientIntensity,
    ambientColor,
    directionalIntensity,
    directionalColor,
    directionalPosition,
    fogColor,
    fogNear,
    fogFar,
  } = lighting;

  return (
    <>
      {/* Ambient light */}
      <ambientLight intensity={ambientIntensity} color={ambientColor} />

      {/* Directional light (sun/moon) */}
      <directionalLight
        position={directionalPosition}
        intensity={directionalIntensity}
        color={directionalColor}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-far={100}
        shadow-camera-left={-30}
        shadow-camera-right={30}
        shadow-camera-top={30}
        shadow-camera-bottom={-30}
      />

      {/* Fog */}
      {fogColor && (
        <fog
          attach="fog"
          args={[fogColor, fogNear || 20, fogFar || 60]}
        />
      )}
    </>
  );
}

/**
 * Main Level Environment component
 * @param {Object} props
 * @param {number} props.levelNumber - Level number to render
 */
export function LevelEnvironment({ levelNumber }) {
  const level = useMemo(() => getLevel(levelNumber), [levelNumber]);

  if (!level) {
    console.error(`Level ${levelNumber} not found`);
    return null;
  }

  return (
    <group>
      {/* Lighting */}
      <LevelLighting lighting={level.lighting} />

      {/* Ground and path */}
      <LevelGround
        groundColor={level.groundColor}
        pathColor={level.pathColor}
        gridSize={level.gridSize}
        pathWaypoints={level.pathWaypoints}
      />

      {/* Environment props */}
      {level.environmentProps.map((prop, index) => (
        <PropRenderer key={index} prop={prop} />
      ))}
    </group>
  );
}

/**
 * Level start and end markers
 */
export function LevelMarkers({ levelNumber }) {
  const level = useMemo(() => getLevel(levelNumber), [levelNumber]);

  if (!level || level.pathWaypoints.length < 2) return null;

  const start = level.pathWaypoints[0];
  const end = level.pathWaypoints[level.pathWaypoints.length - 1];

  const offset = (level.gridSize * CELL_SIZE) / 2 - CELL_SIZE / 2;

  const startWorld = {
    x: start.x * CELL_SIZE - offset,
    z: start.z * CELL_SIZE - offset,
  };

  const endWorld = {
    x: end.x * CELL_SIZE - offset,
    z: end.z * CELL_SIZE - offset,
  };

  return (
    <group>
      {/* Start marker (green) */}
      <mesh position={[startWorld.x, 0.5, startWorld.z]}>
        <cylinderGeometry args={[0.3, 0.3, 1, 8]} />
        <meshStandardMaterial color="#2ecc71" emissive="#2ecc71" emissiveIntensity={0.3} />
      </mesh>

      {/* End marker (red base) */}
      <mesh position={[endWorld.x, 0.5, endWorld.z]}>
        <cylinderGeometry args={[0.4, 0.4, 1, 8]} />
        <meshStandardMaterial color="#e74c3c" emissive="#e74c3c" emissiveIntensity={0.3} />
      </mesh>
    </group>
  );
}

export default LevelEnvironment;
