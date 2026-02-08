/**
 * Settings Panel component
 * Volume controls, graphics settings, and game options
 */
import React, { useState, useEffect } from 'react';
import './SettingsPanel.css';

const SettingsPanel = ({
  isOpen,
  onClose,
  onSave,
  initialSettings = {},
}) => {
  // Default settings
  const defaultSettings = {
    masterVolume: 80,
    musicVolume: 60,
    sfxVolume: 80,
    graphicsQuality: 'high',
    fullscreen: false,
    showFPS: false,
    autoStartWaves: true,
    ...initialSettings,
  };

  const [settings, setSettings] = useState(defaultSettings);
  const [hasChanges, setHasChanges] = useState(false);

  // Handle setting changes
  const updateSetting = (key, value) => {
    setSettings((prev) => ({
      ...prev,
      [key]: value,
    }));
    setHasChanges(true);
  };

  // Handle slider changes
  const handleSliderChange = (key, e) => {
    updateSetting(key, parseInt(e.target.value, 10));
  };

  // Handle toggle changes
  const handleToggleChange = (key) => {
    updateSetting(key, !settings[key]);
  };

  // Handle select changes
  const handleSelectChange = (key, e) => {
    updateSetting(key, e.target.value);
  };

  // Save settings
  const handleSave = () => {
    onSave?.(settings);
    setHasChanges(false);
    onClose();
  };

  // Reset to defaults
  const handleReset = () => {
    setSettings(defaultSettings);
    setHasChanges(true);
  };

  // Close without saving
  const handleCancel = () => {
    setSettings(defaultSettings);
    setHasChanges(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="settings-overlay">
      <div className="settings-panel">
        {/* Header */}
        <header className="settings-panel__header">
          <h2 className="settings-panel__title">⚙️ Settings</h2>
          <button className="settings-panel__close-btn" onClick={handleCancel}>
            ×
          </button>
        </header>

        {/* Content */}
        <div className="settings-panel__content">
          {/* Audio Section */}
          <section className="settings-section">
            <h3 className="settings-section__title">Audio</h3>

            {/* Master Volume */}
            <div className="setting-row">
              <label className="setting-row__label">
                <span className="setting-row__icon">🔊</span>
                Master Volume
              </label>
              <div className="setting-slider">
                <input
                  type="range"
                  className="setting-slider__input"
                  min="0"
                  max="100"
                  value={settings.masterVolume}
                  onChange={(e) => handleSliderChange('masterVolume', e)}
                />
                <span className="setting-slider__value">{settings.masterVolume}%</span>
              </div>
            </div>

            {/* Music Volume */}
            <div className="setting-row">
              <label className="setting-row__label">
                <span className="setting-row__icon">🎵</span>
                Music Volume
              </label>
              <div className="setting-slider">
                <input
                  type="range"
                  className="setting-slider__input"
                  min="0"
                  max="100"
                  value={settings.musicVolume}
                  onChange={(e) => handleSliderChange('musicVolume', e)}
                />
                <span className="setting-slider__value">{settings.musicVolume}%</span>
              </div>
            </div>

            {/* SFX Volume */}
            <div className="setting-row">
              <label className="setting-row__label">
                <span className="setting-row__icon">🔔</span>
                Sound Effects
              </label>
              <div className="setting-slider">
                <input
                  type="range"
                  className="setting-slider__input"
                  min="0"
                  max="100"
                  value={settings.sfxVolume}
                  onChange={(e) => handleSliderChange('sfxVolume', e)}
                />
                <span className="setting-slider__value">{settings.sfxVolume}%</span>
              </div>
            </div>
          </section>

          {/* Graphics Section */}
          <section className="settings-section">
            <h3 className="settings-section__title">Graphics</h3>

            {/* Graphics Quality */}
            <div className="setting-row">
              <label className="setting-row__label">
                <span className="setting-row__icon">🎨</span>
                Quality
              </label>
              <select
                className="setting-select"
                value={settings.graphicsQuality}
                onChange={(e) => handleSelectChange('graphicsQuality', e)}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="ultra">Ultra</option>
              </select>
            </div>

            {/* Fullscreen Toggle */}
            <div className="setting-row">
              <label className="setting-row__label">
                <span className="setting-row__icon">🖥️</span>
                Fullscreen
              </label>
              <label className="setting-toggle">
                <input
                  type="checkbox"
                  className="setting-toggle__input"
                  checked={settings.fullscreen}
                  onChange={() => handleToggleChange('fullscreen')}
                />
                <span className="setting-toggle__slider"></span>
              </label>
            </div>

            {/* Show FPS Toggle */}
            <div className="setting-row">
              <label className="setting-row__label">
                <span className="setting-row__icon">📊</span>
                Show FPS Counter
              </label>
              <label className="setting-toggle">
                <input
                  type="checkbox"
                  className="setting-toggle__input"
                  checked={settings.showFPS}
                  onChange={() => handleToggleChange('showFPS')}
                />
                <span className="setting-toggle__slider"></span>
              </label>
            </div>
          </section>

          {/* Gameplay Section */}
          <section className="settings-section">
            <h3 className="settings-section__title">Gameplay</h3>

            {/* Auto-start waves */}
            <div className="setting-row">
              <label className="setting-row__label">
                <span className="setting-row__icon">⚡</span>
                Auto-start Waves
              </label>
              <label className="setting-toggle">
                <input
                  type="checkbox"
                  className="setting-toggle__input"
                  checked={settings.autoStartWaves}
                  onChange={() => handleToggleChange('autoStartWaves')}
                />
                <span className="setting-toggle__slider"></span>
              </label>
            </div>
          </section>
        </div>

        {/* Footer */}
        <footer className="settings-panel__footer">
          <button
            className="settings-panel__button settings-panel__button--secondary"
            onClick={handleReset}
          >
            Reset
          </button>
          <button
            className="settings-panel__button settings-panel__button--primary"
            onClick={handleSave}
            disabled={!hasChanges}
          >
            Save Changes
          </button>
        </footer>
      </div>
    </div>
  );
};

export default SettingsPanel;
