import { useCallback } from 'react';

export function useVibrationOnClick(duration: number = 30) {
  const handleClick = useCallback(() => {
    if ('vibrate' in navigator) {
      navigator.vibrate(duration);
    }
  }, [duration]);

  return handleClick;
}