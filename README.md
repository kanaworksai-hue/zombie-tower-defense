# Zombie Tower Defense

A stylized low-poly 3D zombie tower defense game built with Three.js and React Three Fiber.

![Game Screenshot](screenshot.png)

## Play Now

**[Play the game here!](https://kanaworksai-hue.github.io/zombie-tower-defense/)**

## Features

- **5 Unique Tower Types:**
  - Basic Tower - Balanced damage and range
  - Sniper Tower - Long range, high damage, slow fire rate
  - Splash Tower - Area damage to multiple enemies
  - Slow Tower - Reduces enemy movement speed
  - Laser Tower - Continuous damage beam

- **5 Zombie Types:**
  - Walker - Standard slow zombie
  - Runner - Fast but fragile
  - Tank - High health, slow movement
  - Crawler - Weak but numerous
  - Boss - Massive health and damage

- **5 Challenging Levels:**
  1. Suburban Streets - Tutorial level with basic zombies
  2. Construction Site - Multiple path branches
  3. Cemetery - Winding paths with tank zombies
  4. Military Base - Complex layout with all enemy types
  5. Laboratory - Final level with multiple bosses

- **Game Features:**
  - Top-down 3D perspective with camera controls
  - Tower placement with grid snapping
  - Tower upgrades (up to level 5)
  - Wave-based enemy spawning with increasing difficulty
  - Health bars and status effects
  - Particle effects and animations
  - Pause and resume functionality

## How to Play

1. Click **START GAME** to begin
2. Select a tower from the bottom panel
3. Click on the grid to place the tower
4. Stop zombies from reaching your base
5. Survive all waves to win!

### Controls

- **Left Click** - Place tower / Select UI
- **Right Click** - Cancel tower placement
- **Mouse Drag** - Rotate camera
- **Scroll** - Zoom in/out

## Technologies Used

- [React](https://react.dev/) - UI framework
- [Three.js](https://threejs.org/) - 3D graphics library
- [React Three Fiber](https://docs.pmnd.rs/react-three-fiber) - React renderer for Three.js
- [React Three Drei](https://github.com/pmndrs/drei) - Useful helpers for R3F
- [Zustand](https://github.com/pmndrs/zustand) - State management
- [Vite](https://vitejs.dev/) - Build tool

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
  components/
    game/         # 3D game scene components
    towers/       # Tower components and logic
    zombies/      # Zombie components and logic
    ui/           # UI components
  constants/      # Game constants
  hooks/          # Custom React hooks
  levels/         # Level configurations
  stores/         # Zustand state stores
  types/          # TypeScript type definitions
  utils/          # Utility functions
```

## License

MIT License - feel free to use this project for learning or as a base for your own games!

## Credits

Created with Claude Code by Anthropic.
