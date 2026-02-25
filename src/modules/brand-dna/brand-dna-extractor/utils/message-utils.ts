/**
 * Selecciona un mensaje aleatorio de un array
 */
export const getRandomMessage = <T>(messages: T[]): T => {
  return messages[Math.floor(Math.random() * messages.length)];
};
