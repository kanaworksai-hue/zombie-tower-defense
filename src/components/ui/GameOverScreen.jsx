/**
 * Game Over Screen component
 * Displayed when player loses all lives
 */
import React from 'react';
import './GameOverScreen.css';

const GameOverScreen = ({
  reason = 'Your base was overrun!',
  score,
  wavesCompleted,
  zombiesKilled,
  onRetry,
  onMainMenu,
}) => {
  return (
    <div className="game-overlay">
      <div className="game-modal game-modal--defeat">
        {/* Defeat icon */}
        <div className="game-modal__icon">💀</div>

        {/* Title */}
        <h2 className="game-modal__title">Game Over</h2>

        {/* Message */}
        <p className="game-modal__message">{reason}</p>

        {/* Stats */}
        <div className="game-modal__stats">
          <div className="game-modal__stat">
            <span className="game-modal__stat-label">Final Score</span>
            <span className="game-modal__stat-value game-modal__stat-value--highlight">
              {score?.toLocaleString() || 0}
            </span>
          </div>
          <div className="game-modal__stat">
            <span className="game-modal__stat-label">Waves Survived</span>
            <span className="game-modal__stat-value">{wavesCompleted || 0}</span>
          </div>
          <div className="game-modal__stat">
            <span className="game-modal__stat-label">Zombies Killed</span>
            <span className="game-modal__stat-value">{zombiesKilled || 0}</span>
          </div>
        </div>

        {/* Buttons */}
        <div className="game-modal__buttons">
          <button
            className="game-modal__button game-modal__button--primary"
            onClick={onRetry}
          >
            Try Again ↻
          </button>

          <button
            className="game-modal__button game-modal__button--secondary"
            onClick={onMainMenu}
          >
            Main Menu
          </button>
        </div>
      </div>
    </div>
  );
};

export default GameOverScreen;
