/**
 * Generates a unique ID using timestamp and random number
 * @returns A unique string ID
 */
export const generateUniqueId = (): string => {
  const timestamp = Date.now().toString(36);
  const randomPart = Math.random().toString(36).substring(2, 8);
  return `img_${timestamp}_${randomPart}`;
};

/**
 * Generates a unique numeric ID using timestamp and random number
 * @returns A unique number ID
 */
export const generateUniqueNumericId = (): number => {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 10000);
  return parseInt(`${timestamp}${random}`);
};

/**
 * Simple counter-based unique ID generator for session-scoped uniqueness
 */
let idCounter = 0;
export const generateSessionUniqueId = (): number => {
  return ++idCounter + Date.now();
};
