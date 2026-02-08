/**
 * Pause Menu component
 * Allows player to resume, restart, or quit the game
 */
import React from 'react';
import './GameOverScreen.css';

const PauseMenu = ({
  onResume,
  onRestart,
  onSettings,
  onMainMenu,
}) => {
  return (
    <div className="game-overlay">
      <div className="game-modal game-modal--pause">
        {/* Pause icon */}
        <div className="game-modal__icon">⏸️</div>

        {/* Title */}
        <h2 className="game-modal__title">Paused</h2>

        {/* Message */}
        <p className="game-modal__message">
          Game is paused. Take a breather!
        </p>

        {/* Buttons */}
        <div className="game-modal__buttons">
          <button
            className="game-modal__button game-modal__button--primary"
            onClick={onResume}
          >
            Resume Game ▶
          </button>

          <div className="game-modal__button-row">
            <button
              className="game-modal__button game-modal__button--secondary"
              onClick={onRestart}
            >
              Restart
            </button>

            <button
              className="game-modal__button game-modal__button--secondary"
              onClick={onSettings}
            >
              Settings
            </button>
          </div>

          <button
            className="game-modal__button game-modal__button--tertiary"
            onClick={onMainMenu}
          >
            Quit to Main Menu
          </button>
        </div>
      </div>
    </div>
  );
};

export default PauseMenu;
