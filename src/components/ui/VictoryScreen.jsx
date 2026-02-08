/**
 * Victory Screen component
 * Displayed when player successfully completes a level
 */
import React from 'react';
import './GameOverScreen.css';

const VictoryScreen = ({
  score,
  wavesCompleted,
  towersPlaced,
  moneyEarned,
  stars = 3,
  onNextLevel,
  onRetry,
  onMainMenu,
}) => {
  return (
    <div className="game-overlay">
      <div className="game-modal game-modal--victory">
        {/* Victory icon */}
        <div className="game-modal__icon">🏆</div>

        {/* Title */}
        <h2 className="game-modal__title">Victory!</h2>

        {/* Message */}
        <p className="game-modal__message">
          The zombie horde has been defeated!
        </p>

        {/* Star rating */}
        <div className="game-modal__stars">
          {[1, 2, 3].map((star) => (
            <span
              key={star}
              className={`game-modal__star ${star <= stars ? 'game-modal__star--filled' : ''}`}
              style={{ animationDelay: `${star * 0.15}s` }}
            >
              ★
            </span>
          ))}
        </div>

        {/* Stats */}
        <div className="game-modal__stats">
          <div className="game-modal__stat">
            <span className="game-modal__stat-label">Score</span>
            <span className="game-modal__stat-value game-modal__stat-value--highlight">
              {score.toLocaleString()}
            </span>
          </div>
          <div className="game-modal__stat">
            <span className="game-modal__stat-label">Waves</span>
            <span className="game-modal__stat-value">{wavesCompleted}</span>
          </div>
          <div className="game-modal__stat">
            <span className="game-modal__stat-label">Towers</span>
            <span className="game-modal__stat-value">{towersPlaced}</span>
          </div>
        </div>

        {/* Buttons */}
        <div className="game-modal__buttons">
          {onNextLevel && (
            <button
              className="game-modal__button game-modal__button--primary"
              onClick={onNextLevel}
            >
              Next Level →
            </button>
          )}

          <div className="game-modal__button-row">
            <button
              className="game-modal__button game-modal__button--secondary"
              onClick={onRetry}
            >
              Play Again
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
    </div>
  );
};

export default VictoryScreen;
