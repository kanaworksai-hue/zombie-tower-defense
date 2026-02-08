/**
 * Credits Screen component
 * Displays game credits and acknowledgments
 */
import React from 'react';
import './CreditsScreen.css';

const CreditsScreen = ({ onBack }) => {
  return (
    <div className="credits-overlay">
      {/* Header */}
      <header className="credits-header">
        <h2 className="credits-header__title">Credits</h2>
        <button className="credits-header__back-btn" onClick={onBack}>
          ← Back
        </button>
      </header>

      {/* Content */}
      <div className="credits-content">
        {/* Game Title */}
        <h1 className="credits-game-title">Zombie Defense</h1>
        <p className="credits-game-subtitle">The Last Stand</p>

        {/* Development Team */}
        <div className="credits-section">
          <h3 className="credits-section__title">Created By</h3>
          <div className="credits-section__names">
            <span className="credits-section__name">AI Development Team</span>
          </div>
        </div>

        {/* Design */}
        <div className="credits-section">
          <h3 className="credits-section__title">Game Design</h3>
          <div className="credits-section__names">
            <span className="credits-section__name">Tower Defense Architects</span>
          </div>
        </div>

        {/* Special Thanks */}
        <div className="credits-thanks">
          <h3 className="credits-thanks__title">Special Thanks</h3>
          <p className="credits-thanks__text">
            Thank you for playing Zombie Defense! This game was built with passion
            and dedication. We hope you enjoy defending against the zombie hordes!
          </p>
        </div>

        {/* Technology Stack */}
        <div className="credits-tech">
          <h3 className="credits-tech__title">Built With</h3>
          <div className="credits-tech__stack">
            <span className="credits-tech__item">React</span>
            <span className="credits-tech__item">Three.js</span>
            <span className="credits-tech__item">React Three Fiber</span>
            <span className="credits-tech__item">Zustand</span>
            <span className="credits-tech__item">Vite</span>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="credits-footer">
        <p className="credits-footer__text">
          Made with <span className="credits-footer__heart">❤️</span> for zombie defense enthusiasts everywhere
        </p>
        <p className="credits-footer__text">
          © 2025 Zombie Defense. All rights reserved.
        </p>
      </footer>
    </div>
  );
};

export default CreditsScreen;
