/**
 * Game Flow component
 * Manages the overall game state and screen transitions
 */
import React, { useState, useCallback } from 'react';
import { useGameStore } from '../../stores/gameStore';
import MainMenu from './MainMenu';
import LevelSelect from './LevelSelect';
import GameHUD from './GameHUD';
import TowerPanel from './TowerPanel';
import VictoryScreen from './VictoryScreen';
import GameOverScreen from './GameOverScreen';
import PauseMenu from './PauseMenu';
import SettingsPanel from './SettingsPanel';
import CreditsScreen from './CreditsScreen';

// Game screen states
const SCREEN = {
  MAIN_MENU: 'main_menu',
  LEVEL_SELECT: 'level_select',
  GAME: 'game',
  SETTINGS: 'settings',
  CREDITS: 'credits',
};

const GameFlow = () => {
  // Current screen state
  const [currentScreen, setCurrentScreen] = useState(SCREEN.MAIN_MENU);
  const [gameSpeed, setGameSpeed] = useState(1);

  // Get game state from store
  const {
    money,
    lives,
    score,
    isPlaying,
    isPaused,
    gameOverReason,
    wave,
    zombies,
    towers,
    selectedTowerType,
    startGame,
    togglePause,
    selectTowerType,
    deselectTowerType,
    resetGame,
  } = useGameStore();

  // Navigation handlers
  const goToMainMenu = useCallback(() => {
    setCurrentScreen(SCREEN.MAIN_MENU);
    setGameSpeed(1);
  }, []);

  const goToLevelSelect = useCallback(() => {
    setCurrentScreen(SCREEN.LEVEL_SELECT);
  }, []);

  const goToSettings = useCallback(() => {
    setCurrentScreen(SCREEN.SETTINGS);
  }, []);

  const goToCredits = useCallback(() => {
    setCurrentScreen(SCREEN.CREDITS);
  }, []);

  const startNewGame = useCallback(() => {
    startGame();
    setCurrentScreen(SCREEN.GAME);
    setGameSpeed(1);
  }, [startGame]);

  const selectLevel = useCallback((levelId) => {
    startGame();
    setCurrentScreen(SCREEN.GAME);
    setGameSpeed(1);
  }, [startGame]);

  const handleSpeedChange = useCallback((speed) => {
    setGameSpeed(speed);
  }, []);

  const handleSaveSettings = useCallback((settings) => {
    // Save settings to localStorage or state
    localStorage.setItem('zombieDefenseSettings', JSON.stringify(settings));
  }, []);

  // Calculate wave info
  const currentWaveNumber = wave?.waveNumber || 0;
  const enemiesRemaining = zombies?.filter(z => !z.isDead && !z.reachedEnd).length || 0;
  const totalWaves = 10; // Default total waves

  // Check game end states
  const isVictory = isPlaying === false && lives > 0 && currentWaveNumber >= totalWaves;
  const isGameOver = isPlaying === false && lives <= 0;

  // Render current screen
  const renderScreen = () => {
    switch (currentScreen) {
      case SCREEN.MAIN_MENU:
        return (
          <MainMenu
            onPlay={startNewGame}
            onLevelSelect={goToLevelSelect}
            onSettings={goToSettings}
            onCredits={goToCredits}
          />
        );

      case SCREEN.LEVEL_SELECT:
        return (
          <LevelSelect
            onBack={goToMainMenu}
            onSelectLevel={selectLevel}
            unlockedLevels={[1, 2, 3]}
            completedLevels={{ 1: true }}
            levelScores={{ 1: 15000 }}
          />
        );

      case SCREEN.SETTINGS:
        return (
          <SettingsPanel
            isOpen={true}
            onClose={goToMainMenu}
            onSave={handleSaveSettings}
            initialSettings={JSON.parse(localStorage.getItem('zombieDefenseSettings') || '{}')}
          />
        );

      case SCREEN.CREDITS:
        return (
          <CreditsScreen
            onBack={goToMainMenu}
          />
        );

      case SCREEN.GAME:
        return (
          <>
            {/* Game HUD */}
            <GameHUD
              lives={lives}
              maxLives={20}
              money={money}
              wave={currentWaveNumber}
              totalWaves={totalWaves}
              enemiesRemaining={enemiesRemaining}
              enemiesTotal={wave?.zombiesRemaining || 0}
              gameSpeed={gameSpeed}
              onSpeedChange={handleSpeedChange}
              onPause={togglePause}
            />

            {/* Tower Selection Panel */}
            <TowerPanel
              money={money}
              selectedTowerType={selectedTowerType}
              onSelectTower={selectTowerType}
              onDeselectTower={deselectTowerType}
            />

            {/* Pause Menu */}
            {isPaused && (
              <PauseMenu
                onResume={togglePause}
                onRestart={startNewGame}
                onSettings={goToSettings}
                onMainMenu={goToMainMenu}
              />
            )}

            {/* Victory Screen */}
            {isVictory && (
              <VictoryScreen
                score={score}
                wavesCompleted={currentWaveNumber}
                towersPlaced={towers.length}
                moneyEarned={money}
                stars={3}
                onNextLevel={goToLevelSelect}
                onRetry={startNewGame}
                onMainMenu={goToMainMenu}
              />
            )}

            {/* Game Over Screen */}
            {isGameOver && (
              <GameOverScreen
                reason={gameOverReason}
                score={score}
                wavesCompleted={currentWaveNumber}
                zombiesKilled={score / 10}
                onRetry={startNewGame}
                onMainMenu={goToMainMenu}
              />
            )}
          </>
        );

      default:
        return null;
    }
  };

  return (
    <div className="game-flow">
      {renderScreen()}
    </div>
  );
};

export default GameFlow;
