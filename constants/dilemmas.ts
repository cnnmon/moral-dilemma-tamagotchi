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
    text: "{pet} is on a packed train. an exhausted looking office worker asks for their seat. should {pet} give it up or pretend not to hear?",
    relatedStats: [MoralDimensions.compassion],
    stakes: 1,
  },
  bigcheese: {
    id: "bigcheese",
    text: "{pet} sees a crumpled can of Big Cheese rolling down the road on the way to trip several babies who just learned how to walk. {pet} is bleeding out. should {pet} pick up the can of Big Cheese?",
    relatedStats: [MoralDimensions.compassion],
    stakes: 1,
  },
};

const retributionDilemmas: Record<string, Dilemma> = {
  jobinterviews: {
    id: "jobinterviews",
    text: "{pet} found out that a close friend has been cheating on all of their automated job interviews, but the job interviews are stupid anyway. should they say anything about it?",
    relatedStats: [MoralDimensions.retribution],
    stakes: 1,
  },
  promisefriend: {
    id: "promisefriend",
    text: "{pet}'s close friend has been accused of a crime that they promise they did not commit. should they lie to protect them or turn them in?",
    relatedStats: [MoralDimensions.retribution],
    stakes: 1,
  },
};

const devotionDilemmas: Record<string, Dilemma> = {
  talentshow: {
    id: "talentshow",
    text: "{pet} and {pet}'s close friend just happen to have prepared the same song for the talent show. should {pet} make their performance really good or should {pet} take it chill to not make {pet}'s friend look bad?",
    relatedStats: [MoralDimensions.devotion],
    stakes: 1,
  },
  family: {
    id: "family",
    text: "{pet}'s close friend has been accused of a crime that they promise they did not commit. should they lie to protect them or turn them in?",
    relatedStats: [MoralDimensions.devotion],
    stakes: 1,
  },
};

const dominanceDilemmas: Record<string, Dilemma> = {
  groupproject: {
    id: "groupproject",
    text: "{pet} is in a group project but everyone sucks at communicating. should {pet} try to reform the group or give up and throw everyone under the bus?",
    relatedStats: [MoralDimensions.dominance],
    stakes: 1,
  },
  fakeid: {
    id: "fakeid",
    text: "{pet} finds a fake id and the profile looks just like them. do they use it to get into bars?",
    relatedStats: [MoralDimensions.dominance],
    stakes: 1,
  },
  controversialgovernment: {
    id: "controversialgovernment",
    text: "{pet} is offered a position in a controversial ruler's government doing something kind of fun. do they refuse or accept?",
    relatedStats: [MoralDimensions.dominance],
    stakes: 1,
  },
};

const purityDilemmas: Record<string, Dilemma> = {
  fishcoin: {
    id: "fishcoin",
    text: "should {pet} exploit a public space after realizing it has millions of buried $fishcoin? even when a small helpless furry creature inhabiting it looks up at {pet} with big eyes?",
    relatedStats: [MoralDimensions.purity],
    stakes: 1,
  },
  coffeejelly: {
    id: "coffeejelly",
    text: "{pet} really likes coffee jelly. like it is sickeningly good. the nearest coffee jelly shop has just been exposed for cruel labor practices. should {pet} still get coffee jelly?",
    relatedStats: [MoralDimensions.purity],
    stakes: 1,
  },
  redballoon: {
    id: "redballoon",
    text: "{pet} notices a child gleefully holding a red balloon. they smile at {pet}. should {pet} pop the balloon for fun?",
    relatedStats: [MoralDimensions.purity],
    stakes: 1,
  },
};

const egoDilemmas: Record<string, Dilemma> = {
  summercamp: {
    id: "summercamp",
    text: "{pet} and another stranger at summer camp are starving. there's only enough food for one. should {pet} eat it themself or give it to the stranger?",
    relatedStats: [MoralDimensions.ego],
    stakes: 1,
  },
  antirecycling: {
    id: "antirecycling",
    text: "{pet} is offered a high-paying job at a company that is mainly fine, but doesn't recycle. like super anti recycling. should {pet} take the job?",
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
