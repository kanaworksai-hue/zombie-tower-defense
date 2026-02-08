/**
 * Level Selection Screen component
 * Allows players to choose from available levels
 */
import React from 'react';
import './LevelSelect.css';

// Level data configuration
const LEVELS = [
  {
    id: 1,
    name: 'The Outskirts',
    description: 'Defend the outer perimeter. A gentle introduction to zombie defense.',
    difficulty: 1,
    waves: 5,
    reward: 100,
  },
  {
    id: 2,
    name: 'City Streets',
    description: 'Urban warfare with tight corridors and fast zombies.',
    difficulty: 2,
    waves: 7,
    reward: 150,
  },
  {
    id: 3,
    name: 'Abandoned Mall',
    description: 'Wide open spaces require strategic tower placement.',
    difficulty: 3,
    waves: 10,
    reward: 200,
  },
  {
    id: 4,
    name: 'Military Base',
    description: 'Heavy tank zombies assault your position.',
    difficulty: 4,
    waves: 12,
    reward: 300,
  },
  {
    id: 5,
    name: 'The Final Stand',
    description: 'Survive the ultimate zombie apocalypse.',
    difficulty: 5,
    waves: 15,
    reward: 500,
  },
];

const LevelCard = ({ level, isLocked, isCompleted, bestScore, onSelect }) => {
  const handleClick = () => {
    if (!isLocked) {
      onSelect(level.id);
    }
  };

  return (
    <div
      className={`level-card ${isLocked ? 'level-card--locked' : ''} ${isCompleted ? 'level-card--completed' : ''}`}
      onClick={handleClick}
    >
      {/* Thumbnail */}
      <div className="level-card__thumbnail">
        <div className="level-card__preview">
          <span className="level-card__map-icon">🗺️</span>
        </div>

        {/* Level number */}
        <div className="level-card__number">{level.id}</div>

        {/* Difficulty indicator */}
        <div className="level-card__difficulty">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className={`level-card__difficulty-dot ${i < level.difficulty ? 'level-card__difficulty-dot--active' : ''}`}
            />
          ))}
        </div>

        {/* Lock overlay */}
        {isLocked && (
          <div className="level-card__lock">🔒</div>
        )}

        {/* Completion badge */}
        {isCompleted && (
          <div className="level-card__completed-badge">✓</div>
        )}
      </div>

      {/* Info */}
      <div className="level-card__info">
        <h3 className="level-card__name">{level.name}</h3>
        <p className="level-card__description">{level.description}</p>

        <div className="level-card__stats">
          <div className="level-card__stat">
            <span className="level-card__stat-label">Waves</span>
            <span className="level-card__stat-value">{level.waves}</span>
          </div>
          <div className="level-card__stat">
            <span className="level-card__stat-label">Reward</span>
            <span className="level-card__stat-value">${level.reward}</span>
          </div>
          <div className="level-card__stat">
            <span className="level-card__stat-label">Best Score</span>
            <span className={`level-card__stat-value ${!bestScore ? 'level-card__stat-value--none' : ''}`}>
              {bestScore || '-'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

const LevelSelect = ({ onBack, onSelectLevel, unlockedLevels = [1], completedLevels = {}, levelScores = {} }) => {
  return (
    <div className="level-select">
      {/* Header */}
      <header className="level-select__header">
        <h2 className="level-select__title">Select Level</h2>
        <button className="level-select__back-btn" onClick={onBack}>
          ← Back
        </button>
      </header>

      {/* Level grid */}
      <div className="level-select__grid">
        {LEVELS.map((level) => (
          <LevelCard
            key={level.id}
            level={level}
            isLocked={!unlockedLevels.includes(level.id)}
            isCompleted={completedLevels[level.id]}
            bestScore={levelScores[level.id]}
            onSelect={onSelectLevel}
          />
        ))}
      </div>
    </div>
  );
};

export default LevelSelect;
