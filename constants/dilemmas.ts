import { MoralDimensions, MoralDimensionsType } from "./morals";

// represents a moral choice presented to the player
export interface DilemmaTemplate {
  id: string;
  text: string;
  relatedStats: Array<keyof MoralDimensionsType>;
  responses: Array<{
    text: string;
  }>;
}

const compassionDilemmas: Record<string, DilemmaTemplate> = {
  train: {
    id: "train",
    text: "{pet} is on a packed train. an exhausted looking office worker asks for their seat. should {pet} give it up or pretend not to hear?",
    relatedStats: [MoralDimensions.compassion],
    responses: [
      {
        text: "give it up",
      },
      {
        text: "pretend not to hear",
      },
    ],
  },
  bigcheese: {
    id: "bigcheese",
    text: "{pet} sees a crumpled can of Big Cheese rolling down the road on the way to trip several babies who just learned how to walk. {pet} is bleeding out. should {pet} pick up the can of Big Cheese?",
    relatedStats: [MoralDimensions.compassion],
    responses: [
      {
        text: "pick up the can of Big Cheese",
      },
      {
        text: "leave it alone",
      },
    ],
  },
};
const retributionDilemmas: Record<string, DilemmaTemplate> = {
  jobinterviews: {
    id: "jobinterviews",
    text: "{pet} found out that a close friend has been cheating on all of their automated job interviews. should they say anything about it?",
    relatedStats: [MoralDimensions.retribution],
    responses: [
      {
        text: "say something about it",
      },
      {
        text: "leave it alone",
      },
    ],
  },
  promisefriend: {
    id: "promisefriend",
    text: "{pet}'s close friend has been accused of a crime that they promise they did not commit. should they lie to protect them or turn them in?",
    relatedStats: [MoralDimensions.retribution],
    responses: [
      {
        text: "lie to protect them",
      },
      {
        text: "turn them in",
      },
    ],
  },
};

const devotionDilemmas: Record<string, DilemmaTemplate> = {
  talentshow: {
    id: "talentshow",
    text: "{pet} and {pet}'s close friend just happen to have prepared the same song for the talent show. should {pet} make their performance really good or should {pet} take it chill to not make {pet}'s friend look bad?",
    relatedStats: [MoralDimensions.devotion],
    responses: [
      {
        text: "make their performance really good",
      },
      {
        text: "take it chill to not make {pet}'s friend look bad",
      },
    ],
  },
  family: {
    id: "family",
    text: "{pet}'s close friend has been accused of a crime that they promise they did not commit. should they lie to protect them or turn them in?",
    relatedStats: [MoralDimensions.devotion],
    responses: [
      {
        text: "lie to protect them",
      },
      {
        text: "turn them in",
      },
    ],
  },
};

const dominanceDilemmas: Record<string, DilemmaTemplate> = {
  groupproject: {
    id: "groupproject",
    text: "{pet} is in a group project but everyone sucks at communicating. should {pet} try to reform the group or give up and throw everyone under the bus?",
    relatedStats: [MoralDimensions.dominance],
    responses: [
      {
        text: "try to reform the group",
      },
      {
        text: "give up and throw everyone under the bus",
      },
    ],
  },
  fakeid: {
    id: "fakeid",
    text: "{pet} finds a fake id and the profile looks just like them. do they use it to get into bars?",
    relatedStats: [MoralDimensions.dominance],
    responses: [
      {
        text: "use it to get into bars",
      },
      {
        text: "don't use it",
      },
    ],
  },
  controversialgovernment: {
    id: "controversialgovernment",
    text: "{pet} is offered a position in a controversial ruler's government doing something kind of fun. do they refuse or accept?",
    relatedStats: [MoralDimensions.dominance],
    responses: [
      {
        text: "refuse",
      },
      {
        text: "accept",
      },
    ],
  },
};

const purityDilemmas: Record<string, DilemmaTemplate> = {
  fishcoin: {
    id: "fishcoin",
    text: "should {pet} exploit a public space after realizing it has millions of buried $fishcoin? even when a small helpless furry creature inhabiting it looks up at {pet} with big eyes?",
    relatedStats: [MoralDimensions.purity],
    responses: [
      {
        text: "exploit it",
      },
      {
        text: "leave it alone",
      },
    ],
  },
  coffeejelly: {
    id: "coffeejelly",
    text: "{pet} really likes coffee jelly. like it is sickeningly good. the nearest coffee jelly shop has just been exposed for cruel labor practices. should {pet} still get coffee jelly?",
    relatedStats: [MoralDimensions.purity],
    responses: [
      {
        text: "still get coffee jelly",
      },
      {
        text: "leave it alone",
      },
    ],
  },
  redballoon: {
    id: "redballoon",
    text: "{pet} notices a child gleefully holding a red balloon. they smile at {pet}. should {pet} pop the balloon for fun?",
    relatedStats: [MoralDimensions.purity],
    responses: [
      {
        text: "pop the balloon for fun",
      },
      {
        text: "leave it alone",
      },
    ],
  },
};

const egoDilemmas: Record<string, DilemmaTemplate> = {
  summercamp: {
    id: "summercamp",
    text: "{pet} and another stranger at summer camp are starving. there's only enough food for one. should {pet} eat it themself or give it to the stranger?",
    relatedStats: [MoralDimensions.ego],
    responses: [
      {
        text: "eat it themself",
      },
      {
        text: "give it to the stranger",
      },
    ],
  },
  antirecycling: {
    id: "antirecycling",
    text: "{pet} is offered a high-paying job at a company that is mainly fine, but doesn't recycle. like super anti recycling. should {pet} take the job?",
    relatedStats: [MoralDimensions.ego],
    responses: [
      {
        text: "take the job",
      },
      {
        text: "leave it alone",
      },
    ],
  },
}

export const dilemmaTemplates: Record<string, DilemmaTemplate> = {
  ...compassionDilemmas,
  ...retributionDilemmas,
  ...devotionDilemmas,
  ...dominanceDilemmas,
  ...purityDilemmas,
  ...egoDilemmas,
};
