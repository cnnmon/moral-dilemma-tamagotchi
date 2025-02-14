// get random item using a seed
export function getRandomItem<T>(items: T[]): T {
  const index = Math.floor(Math.random() * items.length);
  return items[index];
}
