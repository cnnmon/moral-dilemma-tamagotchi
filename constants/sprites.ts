import { EvolutionId, Stage1EvolutionId, Stage2EvolutionId } from "./evolutions";

export enum Animation {
  IDLE = "idle",
  HAPPY = "happy",
}

export const RIP_SPRITE = "/birb/rip.png";

const SPRITES: {
  0: Record<Animation, Record<"baby", string>>;
  1: Record<Animation, Record<Stage1EvolutionId, string>>;
  2: Record<Animation, Record<Stage2EvolutionId, string>>;
} = {
  0: {
    [Animation.IDLE]: {
      baby: "/birb/smol_idle.gif",
    },
    [Animation.HAPPY]: {
      baby: "/birb/smol_happy.gif",
    },
  },
  1: {
    [Animation.IDLE]: {
      empath: "/birb/empath_idle.gif",
      devout: "/birb/devout_idle.gif",
      watcher: "/birb/watcher_idle.gif",
      soldier: "/birb/soldier_idle.gif",
      "teacher's pet": "/birb/tp_idle.gif",
      hedonist: "/birb/hedonist_idle.gif",
      npc: "/birb/mid_happy.gif",
    },
    [Animation.HAPPY]: {
      empath: "/birb/empath_happy.gif",
      devout: "/birb/devout_happy.gif",
      watcher: "/birb/watcher_happy.gif",
      soldier: "/birb/soldier_happy.gif",
      "teacher's pet": "/birb/tp_happy.gif",
      hedonist: "/birb/hedonist_happy.gif",
      npc: "/birb/mid_happy.gif",
    },
  },
  2: {
    [Animation.IDLE]: {
      cultleader: "/birb/cult_idle.gif",
      saint: "/birb/saint_idle.gif",
      gavel: "/birb/gavel_idle.gif",
      vigilante: "/birb/vigilante_idle.gif",
      godfather: "/birb/godfather_idle.gif",
      guardian: "/birb/guardian_idle.gif",
      aristocrat: "/birb/aristocrat_idle.gif",
      sigma: "/birb/sigma_idle.gif",
      npc: "/birb/old_idle.gif",
    },
    [Animation.HAPPY]: {
      cultleader: "/birb/cult_happy.gif",
      saint: "/birb/saint_happy.gif",
      gavel: "/birb/gavel_happy.gif",
      vigilante: "/birb/vigilante_happy.gif",
      godfather: "/birb/godfather_happy.gif",
      guardian: "/birb/guardian_happy.gif",
      aristocrat: "/birb/aristocrat_happy.gif",
      sigma: "/birb/sigma_happy.gif",
      npc: "/birb/old_happy.gif",
    },
  },
};

export function getSprite(age: number, animation: Animation, evolution: EvolutionId) {
  if (age === 0) {
    return SPRITES[0][animation].baby;
  } else if (age === 1) {
    return SPRITES[1][animation][evolution as Stage1EvolutionId];
  } else {
    // remove underscore and anything after
    // this info is about what stage 1 evolution led to this one
    // as there are multiple paths to some evolutions
    const stage2Evolution = evolution.includes('_') ? evolution.split('_')[0] as Stage2EvolutionId : evolution as Stage2EvolutionId;

    // gracefully handle invalid evolution ids
    if (!(stage2Evolution in SPRITES[2][animation])) {
      return SPRITES[2][animation].npc;
    }
    return SPRITES[2][animation][stage2Evolution];
  }
}
