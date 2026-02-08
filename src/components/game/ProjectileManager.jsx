/**
 * Projectile manager component
 * Renders all active projectiles
 */
import { useGameStore } from '../../stores/gameStore';
import { TOWER_TYPES } from '../../constants/game';

/**
 * Single projectile component
 */
function Projectile({ projectile }) {
  const tower = useGameStore((state) =>
    state.towers.find((t) => t.id === projectile.towerId)
  );

  const towerType = tower
    ? TOWER_TYPES[tower.typeId.toUpperCase()]
    : null;

  const color = towerType?.color || '#ffffff';

  return (
    <mesh position={[projectile.position.x, projectile.position.y, projectile.position.z]}>
      <sphereGeometry args={[0.15, 8, 8]} />
      <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.5} />
    </mesh>
  );
}

/**
 * Projectile manager - renders all projectiles
 */
export function ProjectileManager() {
  const projectiles = useGameStore((state) => state.projectiles);

  return (
    <group>
      {projectiles.map((projectile) => (
        <Projectile key={projectile.id} projectile={projectile} />
      ))}
    </group>
  );
}
