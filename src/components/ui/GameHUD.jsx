/**
 * In-Game HUD component
 * Displays all game status information during gameplay
 */
import React, { useState, useEffect } from 'react';
import './GameHUD.css';

const GameHUD = ({
  lives,
  maxLives = 20,
  money,
  wave,
  totalWaves,
  enemiesRemaining,
  enemiesTotal,
  gameSpeed,
  onSpeedChange,
  onPause,
  waveAnnouncement,
}) => {
  const [notifications, setNotifications] = useState([]);

  // Calculate wave progress
  const waveProgress = enemiesTotal > 0
    ? ((enemiesTotal - enemiesRemaining) / enemiesTotal) * 100
    : 0;

  // Render hearts for lives
  const renderHearts = () => {
    const hearts = [];
    const fullHearts = Math.floor(lives / 2);
    const hasHalfHeart = lives % 2 === 1;

    for (let i = 0; i < maxLives / 2; i++) {
      if (i < fullHearts) {
        hearts.push(<span key={i} className="game-hud__heart">❤️</span>);
      } else if (i === fullHearts && hasHalfHeart) {
        hearts.push(<span key={i} className="game-hud__heart">💔</span>);
      } else {
        hearts.push(<span key={i} className="game-hud__heart game-hud__heart--lost">🖤</span>);
      }
    }
    return hearts;
  };

  return (
    <div className="game-hud">
      {/* Top bar with stats */}
      <div className="game-hud__top-bar">
        {/* Left group - Lives and Money */}
        <div className="game-hud__left-group">
          <div className="game-hud__stat game-hud__stat--health">
            <span className="game-hud__stat-icon">❤️</span>
            <div className="game-hud__stat-content">
              <span className="game-hud__stat-label">Lives</span>
              <span className="game-hud__stat-value">{lives}</span>
            </div>
          </div>

          <div className="game-hud__stat game-hud__stat--money">
            <span className="game-hud__stat-icon">💰</span>
            <div className="game-hud__stat-content">
              <span className="game-hud__stat-label">Money</span>
              <span className="game-hud__stat-value">${money}</span>
            </div>
          </div>
        </div>

        {/* Center group - Wave progress */}
        <div className="game-hud__center-group">
          <div className="game-hud__wave-progress">
            <div className="game-hud__wave-info">
              <span>Wave <span className="game-hud__wave-number">{wave}</span> / {totalWaves}</span>
              <span>{enemiesRemaining} enemies</span>
            </div>
            <div className="game-hud__progress-bar">
              <div
                className="game-hud__progress-fill"
                style={{ width: `${waveProgress}%` }}
              />
            </div>
          </div>
        </div>

        {/* Right group - Speed controls and pause */}
        <div className="game-hud__right-group">
          <div className="game-hud__speed-controls">
            <button
              className={`game-hud__speed-btn ${gameSpeed === 1 ? 'game-hud__speed-btn--active' : ''}`}
              onClick={() => onSpeedChange(1)}
            >
              1x
            </button>
            <button
              className={`game-hud__speed-btn ${gameSpeed === 2 ? 'game-hud__speed-btn--active' : ''}`}
              onClick={() => onSpeedChange(2)}
            >
              2x
            </button>
          </div>

          <button className="game-hud__pause-btn" onClick={onPause}>
            ⏸️
          </button>
        </div>
      </div>

      {/* Wave announcement */}
      {waveAnnouncement && (
        <div className="game-hud__wave-announcement">
          <div className="game-hud__wave-text">{waveAnnouncement}</div>
        </div>
      )}

      {/* Notifications area */}
      <div className="game-hud__notifications">
        {notifications.map((notification) => (
          <div key={notification.id} className="game-hud__notification">
            {notification.message}
          </div>
        ))}
      </div>
    </div>
  );
};

export default GameHUD;
