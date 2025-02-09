// simple hash function for seeding random selection
export function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash;
  }
  return hash;
}

// get random item using a seed
export function getRandomItem<T>(items: T[], seed: number): T {
  const index = Math.abs(seed) % items.length;
  return items[index];
}
