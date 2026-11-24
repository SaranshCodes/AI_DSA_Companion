import { useState, useEffect } from 'react';

export function useSessionTimer(startedAt: number | null, outcomeAt: number | null) {
  const [, setTick] = useState(0);

  const isFrozen = Boolean(outcomeAt);
  const isRunning = Boolean(startedAt && !outcomeAt);

  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      setTick((t) => t + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning]);

  if (!startedAt) {
    return { elapsedSeconds: 0, elapsedMinutes: 0 };
  }

  const endTime = isFrozen && outcomeAt ? outcomeAt : Date.now();
  const elapsedSeconds = Math.max(0, Math.floor((endTime - startedAt) / 1000));
  const elapsedMinutes = Math.max(1, Math.ceil(elapsedSeconds / 60));

  return { elapsedSeconds, elapsedMinutes };
}
