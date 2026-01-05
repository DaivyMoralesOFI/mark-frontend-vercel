/**
 * Calcula el tiempo que debe durar cada mensaje basado en el tiempo total disponible
 */
export const calculateTimePerMessage = (
  apiDuration: number,
  additionalTime: number,
  messageCount: number
): number => {
  const totalTime = apiDuration + additionalTime;
  return totalTime / messageCount;
};

/**
 * Programa los cambios de mensajes distribuyendo el tiempo equitativamente
 */
export const scheduleMessages = (
  timePerMessage: number,
  messageCount: number,
  onMessageChange: (index: number) => void
): NodeJS.Timeout[] => {
  const timers: NodeJS.Timeout[] = [];

  for (let i = 1; i < messageCount; i++) {
    const timer = setTimeout(() => {
      onMessageChange(i);
    }, timePerMessage * i);
    timers.push(timer);
  }

  return timers;
};

/**
 * Limpia todos los timers programados
 */
export const cleanupTimers = (timers: NodeJS.Timeout[]): void => {
  timers.forEach((timer) => clearTimeout(timer));
};
