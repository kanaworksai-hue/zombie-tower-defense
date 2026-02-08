# Zombie Tower Defense

A stylized low-poly 3D tower defense game built with Three.js and React Three Fiber. Defend your base from waves of zombies by strategically placing towers along the path.

![Game Screenshot](screenshot.png)

## Live Demo

**[Play the game here!](https://kanaworksai-hue.github.io/zombie-tower-defense/)**

## Features

### Tower Types

| Tower | Damage | Range | Fire Rate | Special |
|-------|--------|-------|-----------|---------|
| **Basic** | Medium | Medium | Medium | Balanced all-rounder |
| **Sniper** | High | Very High | Slow | Long range precision |
| **Rapid** | Low | Short | Very Fast | Quick firing |
| **Splash** | Medium | Medium | Slow | Area damage to multiple zombies |
| **Freeze** | Low | Medium | Medium | Slows zombie movement |

### Zombie Types

| Zombie | Health | Speed | Reward | Threat |
|--------|--------|-------|--------|--------|
| **Walker** | Low | Medium | 10 | Basic enemy |
| **Runner** | Low | Fast | 15 | Quick rushes |
| **Tank** | Very High | Slow | 30 | High durability |
| **Crawler** | Very Low | Slow | 8 | Weak but cheap |
| **Boss** | Extreme | Very Slow | 100 | Major threat |

### 5 Challenging Levels

1. **Suburban Streets** - Tutorial level with basic zombies
2. **Construction Site** - Multiple path branches
3. **Cemetery** - Winding paths with tank zombies
4. **Military Base** - Complex layout with all enemy types
5. **Laboratory** - Final level with multiple bosses

### Visual Polish

- **Particle Effects** - Explosions, sparks, smoke, and hit effects
- **Screen Shake** - Dynamic camera shake on big impacts
- **Damage Numbers** - Floating damage text for feedback
- **Muzzle Flashes** - Tower firing effects
- **Death Animations** - Zombie death effects
- **Smooth Camera** - Animated camera transitions

### Audio System

- **Background Music** - Dynamic music for menu and gameplay
- **Tower Sounds** - Unique shoot sounds per tower type
- **Zombie Sounds** - Hit and death sound effects
- **UI Sounds** - Click and hover feedback
- **Alert Sounds** - Wave start and game over notifications

### Performance Features

- **Object Pooling** - Reuses projectiles and particles for smooth performance
- **Frustum Culling** - Only renders visible objects
- **LOD System** - Level of detail management
- **Optimized Rendering** - Efficient Three.js setup

## How to Play

1. Click **START GAME** to begin
2. Select a tower from the bottom panel
3. Click on the grid to place the tower (green = valid, red = invalid)
4. Stop zombies from reaching your base
5. Earn money by defeating zombies
6. Upgrade towers by clicking on them (up to level 5)
7. Survive as many waves as possible!

### Controls

| Action | Control |
|--------|---------|
| Place Tower | Left Click on grid |
| Select Tower | Left Click on placed tower |
| Upgrade Tower | Click upgrade button in tower panel |
| Sell Tower | Click sell button in tower panel |
| Rotate Camera | Right Click + Drag |
| Zoom Camera | Mouse Wheel |
| Pan Camera | Middle Click + Drag |
| Pause Game | ESC key or Pause button |
| Deselect | Right Click or press ESC

## Technologies Used

- [React 18](https://react.dev/) - UI framework with hooks
- [Three.js](https://threejs.org/) - 3D graphics library
- [React Three Fiber](https://docs.pmnd.rs/react-three-fiber) - React renderer for Three.js
- [React Three Drei](https://github.com/pmndrs/drei) - Useful helpers for R3F
- [Zustand](https://github.com/pmndrs/zustand) - State management with Immer
- [Vite](https://vitejs.dev/) - Build tool and dev server
- [Web Audio API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API) - Procedural audio generation

## Development

### Prerequisites

- Node.js 18+ and npm

### Setup

```bash
# Clone the repository
git clone https://github.com/kanaworksai-hue/zombie-tower-defense.git
cd zombie-tower-defense

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

### Project Structure

```
src/
  audio/              # Audio system and SoundManager
  components/
    effects/          # Visual effects (particles, screen shake, damage numbers)
    game/             # 3D game scene components
    towers/           # Tower components and logic
    zombies/          # Zombie components and logic
    ui/               # UI components
  constants/          # Game constants
  hooks/              # Custom React hooks
  levels/             # Level configurations
  stores/             # Zustand state stores
  types/              # TypeScript type definitions
  utils/              # Utility functions (object pooling, frustum culling)
```

## License

MIT License - feel free to use this project for learning or as a base for your own games!

## Credits

Created with Claude Code by Anthropic.
