export const OBJECTS = {
  bandaid: "/actions/heal.png",
  ball: "/actions/play.png",
  burger: "/actions/burger.png",
} as const;

export type ObjectKey = keyof typeof OBJECTS;
