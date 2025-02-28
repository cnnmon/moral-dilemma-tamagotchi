export enum Animation {
  IDLE = "idle",
  HAPPY = "happy",
}

export const RIP_SPRITE = "/birb/rip.png";

export const SPRITES = {
  0: {
    [Animation.IDLE]: "/birb/smol.gif",
    [Animation.HAPPY]: "/birb/smol_happy.gif",
  },
  1: {
    [Animation.IDLE]: "/birb/old_idle.gif",
    [Animation.HAPPY]: "/birb/old_happy.gif",
  },
  2: {
    [Animation.IDLE]: "/birb/old_idle.gif",
    [Animation.HAPPY]: "/birb/old_happy.gif",
  },
};
