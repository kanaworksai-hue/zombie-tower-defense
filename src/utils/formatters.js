/**
 * Formatting utilities for displaying game data
 */

/**
 * Format a number with commas as thousands separators
 * @param {number} num - Number to format
 * @returns {string} Formatted number
 */
export function formatNumber(num) {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

/**
 * Format currency (money) for display
 * @param {number} amount - Amount to format
 * @returns {string} Formatted currency string
 */
export function formatCurrency(amount) {
  return `$${formatNumber(Math.floor(amount))}`;
}

/**
 * Format time in seconds to MM:SS format
 * @param {number} seconds - Time in seconds
 * @returns {string} Formatted time string
 */
export function formatTime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

/**
 * Format a percentage value
 * @param {number} value - Value between 0 and 1
 * @param {number} decimals - Number of decimal places
 * @returns {string} Formatted percentage
 */
export function formatPercent(value, decimals = 0) {
  return `${(value * 100).toFixed(decimals)}%`;
}

/**
 * Format damage value with appropriate suffixes
 * @param {number} damage - Damage value
 * @returns {string} Formatted damage string
 */
export function formatDamage(damage) {
  if (damage >= 1000000) {
    return `${(damage / 1000000).toFixed(1)}M`;
  }
  if (damage >= 1000) {
    return `${(damage / 1000).toFixed(1)}K`;
  }
  return Math.floor(damage).toString();
}

/**
 * Truncate text with ellipsis if too long
 * @param {string} text - Text to truncate
 * @param {number} maxLength - Maximum length
 * @returns {string} Truncated text
 */
export function truncateText(text, maxLength) {
  if (text.length <= maxLength) return text;
  return `${text.substring(0, maxLength - 3)}...`;
}

/**
 * Capitalize first letter of a string
 * @param {string} str - String to capitalize
 * @returns {string} Capitalized string
 */
export function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Format tower stats for display
 * @param {Object} stats - Tower stats object
 * @returns {Object} Formatted stats
 */
export function formatTowerStats(stats) {
  return {
    damage: formatDamage(stats.damage),
    range: `${stats.range.toFixed(1)} units`,
    fireRate: `${stats.fireRate.toFixed(1)}/s`,
    dps: formatDamage(stats.damage * stats.fireRate),
  };
}
