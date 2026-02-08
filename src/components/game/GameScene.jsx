/**
 * Main game scene component
 * Sets up the Three.js canvas, camera, lighting, and renders all game entities
 */
import { useRef, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Grid, PerspectiveCamera } from '@react-three/drei';
import { useGameStore } from '../../stores/gameStore';
import { CAMERA_SETTINGS, GRID_SIZE, CELL_SIZE, COLORS } from '../../constants/game';
import { GameLoop } from './GameLoop';
import { Ground } from './Ground';
import { Path } from './Path';
import { TowerManager } from '../towers/TowerManager';
import { ZombieManager } from '../zombies/ZombieManager';
import { ProjectileManager } from './ProjectileManager';
import { GridSelector } from './GridSelector';

/**
 * Camera controller with top-down perspective
 */
function CameraController() {
  const { camera } = useThree();
  const controlsRef = useRef();

  useEffect(() => {
    // Set initial camera position
    camera.position.set(
      CAMERA_SETTINGS.position[0],
      CAMERA_SETTINGS.position[1],
      CAMERA_SETTINGS.position[2]
    );
    camera.lookAt(0, 0, 0);
  }, [camera]);

  return (
    <OrbitControls
      ref={controlsRef}
      enablePan={true}
      enableZoom={true}
      enableRotate={true}
      minDistance={10}
      maxDistance={60}
      minPolarAngle={0}
      maxPolarAngle={Math.PI / 2.2}
      target={[0, 0, 0]}
    />
  );
}

/**
 * Scene lighting setup
 */
function Lighting() {
  return (
    <>
      {/* Ambient light for base visibility */}
      <ambientLight intensity={0.4} />

      {/* Main directional light (sun) */}
      <directionalLight
        position={[20, 30, 10]}
        intensity={1}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-far={100}
        shadow-camera-left={-30}
        shadow-camera-right={30}
        shadow-camera-top={30}
        shadow-camera-bottom={-30}
      />

      {/* Fill light from opposite side */}
      <directionalLight
        position={[-10, 20, -10]}
        intensity={0.3}
        color="#aaccff"
      />

      {/* Rim light for depth */}
      <pointLight
        position={[0, 10, -20]}
        intensity={0.5}
        color="#ffaa88"
        distance={50}
      />
    </>
  );
}

/**
 * Main scene content component
 */
function SceneContent() {
  const isPlaying = useGameStore((state) => state.isPlaying);
  const isPaused = useGameStore((state) => state.isPaused);

  return (
    <>
      <CameraController />
      <Lighting />

      {/* Ground plane */}
      <Ground />

      {/* Path visualization */}
      <Path />

      {/* Grid selector for tower placement */}
      <GridSelector />

      {/* Game entities */}
      <TowerManager />
      <ZombieManager />
      <ProjectileManager />

      {/* Game loop - handles updates */}
      <GameLoop />
    </>
  );
}

/**
 * Main game scene component
 */
export function GameScene() {
  return (
    <Canvas
      shadows
      gl={{
        antialias: true,
        alpha: false,
        powerPreference: 'high-performance',
      }}
      style={{
        width: '100vw',
        height: '100vh',
        background: '#1a1a2e',
      }}
    >
      <PerspectiveCamera
        makeDefault
        fov={CAMERA_SETTINGS.fov}
        near={CAMERA_SETTINGS.near}
        far={CAMERA_SETTINGS.far}
      />
      <SceneContent />
    </Canvas>
  );
}
