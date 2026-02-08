/**
 * Main Menu component for Zombie Tower Defense
 * Entry point of the game with navigation to all screens
 */
import React from 'react';
import './MainMenu.css';

const MainMenu = ({ onPlay, onLevelSelect, onSettings, onCredits }) => {
  return (
    <div className="main-menu">
      {/* Animated fog background */}
      <div className="main-menu__fog" />

      {/* Logo and title */}
      <div className="main-menu__logo">
        <h1 className="main-menu__title">Zombie Defense</h1>
        <p className="main-menu__subtitle">The Last Stand</p>
      </div>

      {/* Menu buttons */}
      <div className="main-menu__buttons">
        <button
          className="main-menu__button main-menu__button--primary"
          onClick={onPlay}
        >
          Play Game
        </button>

        <button
          className="main-menu__button main-menu__button--secondary"
          onClick={onLevelSelect}
        >
          Level Select
        </button>

        <button
          className="main-menu__button main-menu__button--secondary"
          onClick={onSettings}
        >
          Settings
        </button>

        <button
          className="main-menu__button main-menu__button--tertiary"
          onClick={onCredits}
        >
          Credits
        </button>
      </div>

      {/* Decorative zombie hands */}
      <div className="main-menu__decorations">
        <div className="main-menu__zombie-hand" />
        <div className="main-menu__zombie-hand" />
        <div className="main-menu__zombie-hand" />
        <div className="main-menu__zombie-hand" />
      </div>

      {/* Version info */}
      <span className="main-menu__version">v1.0.0</span>
    </div>
  );
};

export default MainMenu;
