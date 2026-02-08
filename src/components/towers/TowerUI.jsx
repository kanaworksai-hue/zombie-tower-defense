/**
 * Tower UI component
 * Panel for selecting towers to place and managing selected towers
 */

import React from 'react';
import { useGameStore } from '../../stores/gameStore';
import { TOWER_TYPES, UPGRADE_COST_MULTIPLIER, SELL_RETURN_PERCENTAGE } from '../../constants/game';

/**
 * TowerUI component props
 * @typedef {Object} TowerUIProps
 * @property {number} currentMoney - Player's current money
 */

/**
 * TowerUI component
 * @param {TowerUIProps} props
 */
export function TowerUI({ currentMoney }) {
  const selectedTowerType = useGameStore((state) => state.selectedTowerType);
  const selectTowerType = useGameStore((state) => state.selectTowerType);
  const selectedTowerId = useGameStore((state) => state.selectedTowerId);
  const selectTower = useGameStore((state) => state.selectTower);
  const upgradeTower = useGameStore((state) => state.upgradeTower);
  const sellTower = useGameStore((state) => state.sellTower);
  const towers = useGameStore((state) => state.towers);

  const selectedTower = selectedTowerId
    ? towers.find((t) => t.id === selectedTowerId)
    : null;

  /**
   * Handle tower type selection for placement
   * @param {string} typeId
   */
  const handleSelectTowerType = (typeId) => {
    if (selectedTowerType === typeId) {
      selectTowerType(null);
    } else {
      selectTowerType(typeId);
      selectTower(null); // Deselect any placed tower
    }
  };

  /**
   * Handle upgrade button click
   */
  const handleUpgrade = () => {
    if (selectedTowerId) {
      upgradeTower(selectedTowerId);
    }
  };

  /**
   * Handle sell button click
   */
  const handleSell = () => {
    if (selectedTowerId) {
      sellTower(selectedTowerId);
    }
  };

  /**
   * Handle close selection
   */
  const handleCloseSelection = () => {
    selectTower(null);
  };

  // Get upgrade info for selected tower
  const upgradeInfo = selectedTower
    ? (() => {
        const towerType = TOWER_TYPES[selectedTower.typeId.toUpperCase()];
        const upgradeCost = Math.floor(
          towerType.cost * UPGRADE_COST_MULTIPLIER * selectedTower.level
        );
        const sellValue = Math.floor(
          towerType.cost * SELL_RETURN_PERCENTAGE * selectedTower.level
        );
        const maxLevel = 5;
        return {
          cost: upgradeCost,
          canUpgrade:
            selectedTower.level < maxLevel && currentMoney >= upgradeCost,
          isMaxLevel: selectedTower.level >= maxLevel,
          sellValue,
          stats: {
            damage: Math.floor(towerType.damage * (1 + (selectedTower.level - 1) * 0.3)),
            range: towerType.range * (1 + (selectedTower.level - 1) * 0.1),
            fireRate: towerType.fireRate * (1 + (selectedTower.level - 1) * 0.05)
          }
        };
      })()
    : null;

  // Convert TOWER_TYPES object to array for rendering
  const towerTypesArray = Object.values(TOWER_TYPES);

  return (
    <div
      style={{
        position: 'absolute',
        bottom: '20px',
        left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '10px',
        zIndex: 100
      }}
    >
      {/* Selected Tower Info Panel */}
      {selectedTower && upgradeInfo && (
        <div
          style={{
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            border: '2px solid #4a90d9',
            borderRadius: '8px',
            padding: '15px',
            color: 'white',
            minWidth: '250px'
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '10px'
            }}
          >
            <h3 style={{ margin: 0 }}>
              {TOWER_TYPES[selectedTower.typeId.toUpperCase()]?.name}
            </h3>
            <button
              onClick={handleCloseSelection}
              style={{
                background: 'none',
                border: 'none',
                color: 'white',
                fontSize: '18px',
                cursor: 'pointer'
              }}
            >
              x
            </button>
          </div>

          <div style={{ marginBottom: '10px' }}>
            <div>Level: {selectedTower.level}</div>
            <div>Damage: {upgradeInfo.stats.damage}</div>
            <div>Range: {upgradeInfo.stats.range.toFixed(1)}</div>
            <div>Fire Rate: {upgradeInfo.stats.fireRate.toFixed(1)}/s</div>
          </div>

          {!upgradeInfo.isMaxLevel && (
            <div
              style={{
                borderTop: '1px solid #555',
                paddingTop: '10px',
                marginBottom: '10px'
              }}
            >
              <div style={{ fontSize: '12px', color: '#aaa' }}>
                Next Level Stats:
              </div>
              <div style={{ fontSize: '12px' }}>
                Damage: {Math.floor(upgradeInfo.stats.damage * 1.3)} | Range:{' '}
                {(upgradeInfo.stats.range * 1.1).toFixed(1)}
              </div>
            </div>
          )}

          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              onClick={handleUpgrade}
              disabled={!upgradeInfo.canUpgrade}
              style={{
                flex: 1,
                padding: '8px',
                backgroundColor: upgradeInfo.canUpgrade ? '#4a90d9' : '#555',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: upgradeInfo.canUpgrade ? 'pointer' : 'not-allowed'
              }}
            >
              {upgradeInfo.isMaxLevel
                ? 'Max Level'
                : `Upgrade ($${upgradeInfo.cost})`}
            </button>
            <button
              onClick={handleSell}
              style={{
                flex: 1,
                padding: '8px',
                backgroundColor: '#d94a4a',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Sell (${upgradeInfo.sellValue})
            </button>
          </div>
        </div>
      )}

      {/* Tower Selection Panel */}
      <div
        style={{
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          border: '2px solid #333',
          borderRadius: '8px',
          padding: '10px',
          display: 'flex',
          gap: '10px'
        }}
      >
        {towerTypesArray.map((towerType) => {
          const isSelected = selectedTowerType === towerType.id;
          const canAfford = currentMoney >= towerType.cost;

          return (
            <button
              key={towerType.id}
              onClick={() => handleSelectTowerType(towerType.id)}
              disabled={!canAfford}
              style={{
                width: '80px',
                height: '100px',
                backgroundColor: isSelected
                  ? towerType.color
                  : canAfford
                    ? '#333'
                    : '#222',
                border: isSelected ? '3px solid white' : '2px solid #555',
                borderRadius: '6px',
                cursor: canAfford ? 'pointer' : 'not-allowed',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '5px',
                padding: '5px'
              }}
            >
              {/* Tower icon placeholder */}
              <div
                style={{
                  width: '30px',
                  height: '30px',
                  backgroundColor: towerType.color,
                  borderRadius: towerType.id === 'splash' ? '50%' : '4px',
                  border: '2px solid white'
                }}
              />
              <div
                style={{
                  fontSize: '10px',
                  color: canAfford ? 'white' : '#666',
                  textAlign: 'center',
                  lineHeight: '1.2'
                }}
              >
                {towerType.name.split(' ')[0]}
              </div>
              <div
                style={{
                  fontSize: '11px',
                  color: canAfford ? '#4a90d9' : '#666',
                  fontWeight: 'bold'
                }}
              >
                ${towerType.cost}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
