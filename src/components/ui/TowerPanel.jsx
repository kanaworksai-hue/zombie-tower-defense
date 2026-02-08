/**
 * Tower Selection Panel component
 * Allows players to select and purchase towers
 */
import React from 'react';
import { TOWER_TYPES } from '../../constants/game';
import './TowerPanel.css';

// Tower icons mapping
const TOWER_ICONS = {
  basic: '🔫',
  sniper: '🎯',
  rapid: '⚡',
  splash: '💥',
  freeze: '❄️',
};

// Hotkeys for quick selection
const HOTKEYS = {
  basic: '1',
  sniper: '2',
  rapid: '3',
  splash: '4',
  freeze: '5',
};

const TowerButton = ({
  towerType,
  isSelected,
  canAfford,
  onSelect,
}) => {
  const { id, name, cost, damage, range, fireRate, description } = towerType;
  const icon = TOWER_ICONS[id] || '🏗️';
  const hotkey = HOTKEYS[id];

  const handleClick = () => {
    if (canAfford) {
      onSelect(id);
    }
  };

  return (
    <div
      className={`tower-button ${isSelected ? 'tower-button--selected' : ''} ${!canAfford ? 'tower-button--disabled' : ''}`}
      onClick={handleClick}
    >
      {/* Hotkey badge */}
      <span className="tower-button__hotkey">{hotkey}</span>

      {/* Tower icon */}
      <div className={`tower-button__icon tower-button__icon--${id}`}>
        {icon}
      </div>

      {/* Tower name */}
      <span className="tower-button__name">{name}</span>

      {/* Cost */}
      <span className={`tower-button__cost ${!canAfford ? 'tower-button__cost--unaffordable' : ''}`}>
        💰 ${cost}
      </span>

      {/* Tooltip */}
      <div className="tower-tooltip">
        <div className="tower-tooltip__header">
          <div className={`tower-tooltip__icon tower-button__icon--${id}`}>
            {icon}
          </div>
          <div className="tower-tooltip__title">
            <h4 className="tower-tooltip__name">{name}</h4>
            <span className="tower-tooltip__cost">💰 ${cost}</span>
          </div>
        </div>

        <p className="tower-tooltip__description">{description}</p>

        <div className="tower-tooltip__stats">
          <div className="tower-tooltip__stat">
            <span className="tower-tooltip__stat-label">Damage</span>
            <span className="tower-tooltip__stat-value">{damage}</span>
          </div>
          <div className="tower-tooltip__stat">
            <span className="tower-tooltip__stat-label">Range</span>
            <span className="tower-tooltip__stat-value">{range}</span>
          </div>
          <div className="tower-tooltip__stat">
            <span className="tower-tooltip__stat-label">Fire Rate</span>
            <span className="tower-tooltip__stat-value">{fireRate}/s</span>
          </div>
          <div className="tower-tooltip__stat">
            <span className="tower-tooltip__stat-label">DPS</span>
            <span className="tower-tooltip__stat-value">
              {Math.round(damage * fireRate)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

const TowerPanel = ({
  money,
  selectedTowerType,
  onSelectTower,
  onDeselectTower,
}) => {
  // Convert TOWER_TYPES object to array
  const towers = Object.values(TOWER_TYPES);

  return (
    <div className="tower-panel">
      <div className="tower-panel__container">
        {/* Tower selection grid */}
        <div className="tower-panel__grid">
          {towers.map((tower) => (
            <TowerButton
              key={tower.id}
              towerType={tower}
              isSelected={selectedTowerType === tower.id}
              canAfford={money >= tower.cost}
              onSelect={onSelectTower}
            />
          ))}
        </div>

        {/* Selected tower info */}
        {selectedTowerType && (
          <div className="tower-panel__info">
            <span className="tower-panel__info-text">
              <strong>{TOWER_TYPES[selectedTowerType.toUpperCase()]?.name}</strong> selected - Click on the grid to place
            </span>
            <button
              className="tower-panel__cancel-btn"
              onClick={onDeselectTower}
            >
              Cancel (Esc)
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TowerPanel;
