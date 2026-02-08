/**
 * Custom hook for handling user input
 * Keyboard and mouse input management
 */
import { useEffect, useRef, useCallback, useState } from 'react';

/**
 * Hook for tracking keyboard input
 * @returns {Object} Keyboard state and helpers
 */
export function useKeyboard() {
  const keysRef = useRef(new Set());
  const [activeKeys, setActiveKeys] = useState(new Set());

  useEffect(() => {
    const handleKeyDown = (e) => {
      keysRef.current.add(e.code);
      setActiveKeys(new Set(keysRef.current));
    };

    const handleKeyUp = (e) => {
      keysRef.current.delete(e.code);
      setActiveKeys(new Set(keysRef.current));
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  const isKeyPressed = useCallback((code) => {
    return keysRef.current.has(code);
  }, []);

  return {
    activeKeys,
    isKeyPressed,
    isSpacePressed: isKeyPressed('Space'),
    isEscapePressed: isKeyPressed('Escape'),
    isPPressed: isKeyPressed('KeyP'),
  };
}

/**
 * Hook for tracking mouse position in 3D space
 * @returns {Object} Mouse state
 */
export function useMouse3D() {
  const [position, setPosition] = useState({ x: 0, y: 0, z: 0 });
  const [isDown, setIsDown] = useState(false);

  const handlePointerMove = useCallback((event) => {
    if (event.point) {
      setPosition({
        x: event.point.x,
        y: event.point.y,
        z: event.point.z,
      });
    }
  }, []);

  const handlePointerDown = useCallback(() => {
    setIsDown(true);
  }, []);

  const handlePointerUp = useCallback(() => {
    setIsDown(false);
  }, []);

  return {
    position,
    isDown,
    handlers: {
      onPointerMove: handlePointerMove,
      onPointerDown: handlePointerDown,
      onPointerUp: handlePointerUp,
    },
  };
}

/**
 * Hook for handling right-click context menu
 * @param {Function} onContextMenu - Callback for right click
 */
export function useContextMenu(onContextMenu) {
  useEffect(() => {
    const handleContextMenu = (e) => {
      e.preventDefault();
      onContextMenu?.(e);
    };

    document.addEventListener('contextmenu', handleContextMenu);
    return () => document.removeEventListener('contextmenu', handleContextMenu);
  }, [onContextMenu]);
}
