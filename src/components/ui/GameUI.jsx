/**
 * Game UI component
 * Displays game stats, tower selection, and controls
 * This is a placeholder for the UI developer to expand
 */
import React from 'react';
import { useGameStore } from '../../stores/gameStore';
import { TOWER_TYPES } from '../../constants/game';
import { formatCurrency } from '../../utils/formatters';

/**
 * Tower selection button
 */
function TowerButton({ towerType, isSelected, onClick, canAfford }) {
  const { id, name, cost, color, description } = towerType;

  return (
    <button
      onClick={onClick}
      disabled={!canAfford}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '0.75rem',
        backgroundColor: isSelected ? '#2c3e50' : 'rgba(0, 0, 0, 0.6)',
        border: isSelected ? `2px solid ${color}` : '2px solid transparent',
        borderRadius: '8px',
        cursor: canAfford ? 'pointer' : 'not-allowed',
        opacity: canAfford ? 1 : 0.5,
        transition: 'all 0.2s',
        minWidth: '80px',
      }}
      title={description}
    >
      {/* Tower icon placeholder */}
      <div
        style={{
          width: '40px',
          height: '40px',
          backgroundColor: color,
          borderRadius: '4px',
          marginBottom: '0.5rem',
        }}
      />
      <span
        style={{
          fontSize: '0.75rem',
          color: '#fff',
          fontWeight: 'bold',
          textAlign: 'center',
        }}
      >
        {name}
      </span>
      <span
        style={{
          fontSize: '0.7rem',
          color: canAfford ? '#2ecc71' : '#e74c3c',
        }}
      >
        {formatCurrency(cost)}
      </span>
    </button>
  );
}

/**
 * Main game UI component
 */
export function GameUI() {
  const money = useGameStore((state) => state.money);
  const lives = useGameStore((state) => state.lives);
  const score = useGameStore((state) => state.score);
  const wave = useGameStore((state) => state.wave);
  const isPlaying = useGameStore((state) => state.isPlaying);
  const isPaused = useGameStore((state) => state.isPaused);
  const selectedTowerType = useGameStore((state) => state.selectedTowerType);

  const selectTowerType = useGameStore((state) => state.selectTowerType);
  const deselectTowerType = useGameStore((state) => state.deselectTowerType);
  const togglePause = useGameStore((state) => state.togglePause);

  if (!isPlaying) return null;

  const handleTowerClick = (towerId) => {
    if (selectedTowerType === towerId) {
      deselectTowerType();
    } else {
      selectTowerType(towerId);
    }
  };

  return (
    <>
      {/* Top bar - Stats */}
      <div
        style={{
          position: 'absolute',
          top: '1rem',
          left: '1rem',
          right: '1rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '1rem',
          backgroundColor: 'rgba(0, 0, 0, 0.6)',
          borderRadius: '8px',
          backdropFilter: 'blur(10px)',
          zIndex: 10,
        }}
      >
        <div style={{ display: 'flex', gap: '2rem' }}>
          <div>
            <span style={{ color: '#aaa', fontSize: '0.8rem' }}>MONEY</span>
            <div style={{ color: '#2ecc71', fontSize: '1.5rem', fontWeight: 'bold' }}>
              {formatCurrency(money)}
            </div>
          </div>
          <div>
            <span style={{ color: '#aaa', fontSize: '0.8rem' }}>LIVES</span>
            <div style={{ color: '#e74c3c', fontSize: '1.5rem', fontWeight: 'bold' }}>
              {lives}
            </div>
          </div>
          <div>
            <span style={{ color: '#aaa', fontSize: '0.8rem' }}>WAVE</span>
            <div style={{ color: '#f39c12', fontSize: '1.5rem', fontWeight: 'bold' }}>
              {wave.waveNumber}
            </div>
          </div>
          <div>
            <span style={{ color: '#aaa', fontSize: '0.8rem' }}>SCORE</span>
            <div style={{ color: '#3498db', fontSize: '1.5rem', fontWeight: 'bold' }}>
              {score.toLocaleString()}
            </div>
          </div>
        </div>

        {/* Pause button */}
        <button
          onClick={togglePause}
          style={{
            padding: '0.5rem 1.5rem',
            backgroundColor: isPaused ? '#e74c3c' : '#3498db',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontWeight: 'bold',
          }}
        >
          {isPaused ? 'RESUME' : 'PAUSE'}
        </button>
      </div>

      {/* Bottom bar - Tower selection */}
      <div
        style={{
          position: 'absolute',
          bottom: '1rem',
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          gap: '0.5rem',
          padding: '1rem',
          backgroundColor: 'rgba(0, 0, 0, 0.6)',
          borderRadius: '12px',
          backdropFilter: 'blur(10px)',
          zIndex: 10,
        }}
      >
        {Object.values(TOWER_TYPES).map((towerType) => (
          <TowerButton
            key={towerType.id}
            towerType={towerType}
            isSelected={selectedTowerType === towerType.id}
            onClick={() => handleTowerClick(towerType.id)}
            canAfford={money >= towerType.cost}
          />
        ))}
      </div>

      {/* Instructions */}
      <div
        style={{
          position: 'absolute',
          bottom: '1rem',
          right: '1rem',
          padding: '1rem',
          backgroundColor: 'rgba(0, 0, 0, 0.6)',
          borderRadius: '8px',
          color: '#aaa',
          fontSize: '0.8rem',
          maxWidth: '250px',
          zIndex: 10,
        }}
      >
        <p style={{ margin: '0 0 0.5rem 0' }}>
          <strong style={{ color: '#fff' }}>Controls:</strong>
        </p>
        <p style={{ margin: '0.25rem 0' }}>Click tower → Click grid to place</p>
        <p style={{ margin: '0.25rem 0' }}>Right click to cancel</p>
        <p style={{ margin: '0.25rem 0' }}>Drag to rotate camera</p>
        <p style={{ margin: '0.25rem 0' }}>Scroll to zoom</p>
      </div>

      {/* Pause overlay */}
      {isPaused && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            zIndex: 50,
          }}
        >
          <h1
            style={{
              fontSize: '4rem',
              color: '#fff',
              textShadow: '0 0 20px rgba(255, 255, 255, 0.5)',
            }}
          >
            PAUSED
          </h1>
        </div>
      )}
    </>
  );
}

export default GameUI;
