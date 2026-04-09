import { useState, useEffect, useCallback, useRef } from "react";

/**
 * Auto-hide/show cycle for floating widgets.
 *
 * - Widget appears after `initialDelay`.
 * - If no user interaction within `hideAfter`, it auto-hides.
 * - While hidden, it re-appears every `showInterval` for `showDuration`, then hides again.
 * - Any user interaction (hover or click) pauses auto-hide for `interactionPause`.
 */
interface Options {
  /** ms before first appearance (default 2000) */
  initialDelay?: number;
  /** ms of inactivity before auto-hiding (default 8000) */
  hideAfter?: number;
  /** ms between auto-show pulses while hidden (default 30000) */
  showInterval?: number;
  /** ms to stay visible during a pulse (default 5000) */
  showDuration?: number;
  /** ms to pause auto-hide after user interaction (default 15000) */
  interactionPause?: number;
}

export function useAutoHideWidget(opts: Options = {}) {
  const {
    initialDelay = 2000,
    hideAfter = 8000,
    showInterval = 30000,
    showDuration = 5000,
    interactionPause = 15000,
  } = opts;

  const [visible, setVisible] = useState(false);
  const [userEngaged, setUserEngaged] = useState(false);
  const hideTimer = useRef<ReturnType<typeof setTimeout>>();
  const pulseTimer = useRef<ReturnType<typeof setTimeout>>();
  const pauseTimer = useRef<ReturnType<typeof setTimeout>>();

  const clearAllTimers = useCallback(() => {
    if (hideTimer.current) clearTimeout(hideTimer.current);
    if (pulseTimer.current) clearTimeout(pulseTimer.current);
    if (pauseTimer.current) clearTimeout(pauseTimer.current);
  }, []);

  // Schedule auto-hide
  const scheduleHide = useCallback(
    (delay: number) => {
      if (hideTimer.current) clearTimeout(hideTimer.current);
      hideTimer.current = setTimeout(() => {
        if (!userEngaged) {
          setVisible(false);
        }
      }, delay);
    },
    [userEngaged]
  );

  // Schedule periodic pulse
  useEffect(() => {
    if (visible || userEngaged) {
      if (pulseTimer.current) clearTimeout(pulseTimer.current);
      return;
    }

    // When hidden and not engaged, schedule a pulse
    pulseTimer.current = setTimeout(() => {
      setVisible(true);
      // Auto-hide after showDuration
      hideTimer.current = setTimeout(() => {
        setVisible(false);
      }, showDuration);
    }, showInterval);

    return () => {
      if (pulseTimer.current) clearTimeout(pulseTimer.current);
    };
  }, [visible, userEngaged, showInterval, showDuration]);

  // Initial appearance
  useEffect(() => {
    const t = setTimeout(() => {
      setVisible(true);
      scheduleHide(hideAfter);
    }, initialDelay);
    return () => {
      clearTimeout(t);
      clearAllTimers();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // User interaction handlers
  const onInteraction = useCallback(() => {
    setUserEngaged(true);
    setVisible(true);
    if (hideTimer.current) clearTimeout(hideTimer.current);
    if (pauseTimer.current) clearTimeout(pauseTimer.current);

    pauseTimer.current = setTimeout(() => {
      setUserEngaged(false);
      scheduleHide(hideAfter);
    }, interactionPause);
  }, [hideAfter, interactionPause, scheduleHide]);

  // Force show (e.g., when user clicks open)
  const forceShow = useCallback(() => {
    setUserEngaged(true);
    setVisible(true);
    if (hideTimer.current) clearTimeout(hideTimer.current);
    if (pulseTimer.current) clearTimeout(pulseTimer.current);
  }, []);

  // Force hide + restart cycle
  const forceHide = useCallback(() => {
    setUserEngaged(false);
    setVisible(false);
  }, []);

  return { visible, onInteraction, forceShow, forceHide };
}
