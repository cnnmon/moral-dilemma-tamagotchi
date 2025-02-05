import { MoralDimensions, MoralDimensionsType } from "./morals";

// represents a moral choice presented to the player
export interface Dilemma {
  id: string;
  text: string;
  relatedStats: Array<keyof MoralDimensionsType>;
  stakes: 0 | 1 | 2 | 3; // difficulty/impact level
}

const compassionDilemmas: Record<string, Dilemma> = {
  train: {
    id: "train",
    text: "{name} is on a packed train. an exhausted looking office worker asks for their seat. should {name} give it up or pretend not to hear?",
    relatedStats: [MoralDimensions.compassion],
    stakes: 1,
  },
  bigcheese: {
    id: "bigcheese",
    text: "{name} sees a crumpled can of Big Cheese rolling down the road on the way to trip several babies who just learned how to walk. {name} is bleeding out. should {name} pick up the can of Big Cheese?",
    relatedStats: [MoralDimensions.compassion],
    stakes: 1,
  },
};

const retributionDilemmas: Record<string, Dilemma> = {
  jobinterviews: {
    id: "jobinterviews",
    text: "{name} found out that a close friend has been cheating on all of their automated job interviews, but the job interviews are stupid anyway. should they say anything about it?",
    relatedStats: [MoralDimensions.retribution],
    stakes: 1,
  },
  promisefriend: {
    id: "promisefriend",
    text: "{name}'s close friend has been accused of a crime that they promise they did not commit. should they lie to protect them or turn them in?",
    relatedStats: [MoralDimensions.retribution],
    stakes: 1,
  },
};

const devotionDilemmas: Record<string, Dilemma> = {
  talentshow: {
    id: "talentshow",
    text: "{name} and {name}'s close friend just happen to have prepared the same song for the talent show. should {name} make their performance really good or should {name} take it chill to not make {name}'s friend look bad?",
    relatedStats: [MoralDimensions.devotion],
    stakes: 1,
  },
  family: {
    id: "family",
    text: "{name}'s close friend has been accused of a crime that they promise they did not commit. should they lie to protect them or turn them in?",
    relatedStats: [MoralDimensions.devotion],
    stakes: 1,
  },
};

const dominanceDilemmas: Record<string, Dilemma> = {
  groupproject: {
    id: "groupproject",
    text: "{name} is in a group project but everyone sucks at communicating. should {name} try to reform the group or give up and throw everyone under the bus?",
    relatedStats: [MoralDimensions.dominance],
    stakes: 1,
  },
  fakeid: {
    id: "fakeid",
    text: "{name} finds a fake id and the profile looks just like them. do they use it to get into bars?",
    relatedStats: [MoralDimensions.dominance],
    stakes: 1,
  },
  controversialgovernment: {
    id: "controversialgovernment",
    text: "{name} is offered a position in a controversial ruler's government doing something kind of fun. do they refuse or accept?",
    relatedStats: [MoralDimensions.dominance],
    stakes: 1,
  },
};

const purityDilemmas: Record<string, Dilemma> = {
  fishcoin: {
    id: "fishcoin",
    text: "should {name} exploit a public space after realizing it has millions of buried $fishcoin? even when a small helpless furry creature inhabiting it looks up at {name} with big eyes?",
    relatedStats: [MoralDimensions.purity],
    stakes: 1,
  },
  coffeejelly: {
    id: "coffeejelly",
    text: "{name} really likes coffee jelly. like it is sickeningly good. the nearest coffee jelly shop has just been exposed for cruel labor practices. should {name} still get coffee jelly?",
    relatedStats: [MoralDimensions.purity],
    stakes: 1,
  },
  redballoon: {
    id: "redballoon",
    text: "{name} notices a child gleefully holding a red balloon. they smile at {name}. should {name} pop the balloon for fun?",
    relatedStats: [MoralDimensions.purity],
    stakes: 1,
  },
};

const egoDilemmas: Record<string, Dilemma> = {
  summercamp: {
    id: "summercamp",
    text: "{name} and another stranger at summer camp are starving. there's only enough food for one. should {name} eat it themself or give it to the stranger?",
    relatedStats: [MoralDimensions.ego],
    stakes: 1,
  },
  antirecycling: {
    id: "antirecycling",
    text: "{name} is offered a high-paying job at a company that is mainly fine, but doesn't recycle. like super anti recycling. should {name} take the job?",
    relatedStats: [MoralDimensions.ego],
    stakes: 1,
  },
}

export const dilemmas: Record<string, Dilemma> = {
  ...compassionDilemmas,
  ...retributionDilemmas,
  ...devotionDilemmas,
  ...dominanceDilemmas,
  ...purityDilemmas,
  ...egoDilemmas,
};
