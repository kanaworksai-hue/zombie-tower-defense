/**
 * Main App component
 * Root component that renders the game scene and UI
 */
import React from 'react';
import { GameScene } from './components/game/GameScene';
import { GameUI } from './components/ui/GameUI';
import { useGameStore } from './stores/gameStore';

/**
 * Main App component
 */
function App() {
  const isPlaying = useGameStore((state) => state.isPlaying);
  const gameOverReason = useGameStore((state) => state.gameOverReason);
  const startGame = useGameStore((state) => state.startGame);
  const resetGame = useGameStore((state) => state.resetGame);

  return (
    <div style={{ position: 'relative', width: '100vw', height: '100vh' }}>
      {/* 3D Game Scene */}
      <GameScene />

      {/* UI Overlay */}
      <GameUI />

      {/* Start Screen */}
      {!isPlaying && !gameOverReason && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            zIndex: 100,
          }}
        >
          <h1
            style={{
              fontSize: '4rem',
              color: '#e74c3c',
              textShadow: '0 0 20px rgba(231, 76, 60, 0.5)',
              marginBottom: '1rem',
              fontFamily: 'Impact, sans-serif',
              letterSpacing: '2px',
            }}
          >
            ZOMBIE DEFENSE
          </h1>
          <p
            style={{
              fontSize: '1.2rem',
              color: '#aaa',
              marginBottom: '2rem',
              maxWidth: '500px',
              textAlign: 'center',
            }}
          >
            Defend your base from waves of zombies! Place towers strategically to stop the undead horde.
          </p>
          <button
            onClick={startGame}
            style={{
              padding: '1rem 3rem',
              fontSize: '1.5rem',
              backgroundColor: '#2ecc71',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: 'bold',
              transition: 'transform 0.2s, box-shadow 0.2s',
              boxShadow: '0 4px 15px rgba(46, 204, 113, 0.4)',
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'scale(1.05)';
              e.target.style.boxShadow = '0 6px 20px rgba(46, 204, 113, 0.6)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'scale(1)';
              e.target.style.boxShadow = '0 4px 15px rgba(46, 204, 113, 0.4)';
            }}
          >
            START GAME
          </button>
        </div>
      )}

      {/* Game Over Screen */}
      {gameOverReason && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            zIndex: 100,
          }}
        >
          <h1
            style={{
              fontSize: '4rem',
              color: '#e74c3c',
              textShadow: '0 0 20px rgba(231, 76, 60, 0.5)',
              marginBottom: '1rem',
              fontFamily: 'Impact, sans-serif',
            }}
          >
            GAME OVER
          </h1>
          <p
            style={{
              fontSize: '1.5rem',
              color: '#fff',
              marginBottom: '2rem',
            }}
          >
            {gameOverReason}
          </p>
          <button
            onClick={resetGame}
            style={{
              padding: '1rem 3rem',
              fontSize: '1.5rem',
              backgroundColor: '#3498db',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: 'bold',
              transition: 'transform 0.2s, box-shadow 0.2s',
              boxShadow: '0 4px 15px rgba(52, 152, 219, 0.4)',
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'scale(1.05)';
              e.target.style.boxShadow = '0 6px 20px rgba(52, 152, 219, 0.6)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'scale(1)';
              e.target.style.boxShadow = '0 4px 15px rgba(52, 152, 219, 0.4)';
            }}
          >
            TRY AGAIN
          </button>
        </div>
      )}
    </div>
  );
}

export default App;
