import { MoralDimension } from "./morals";

export type Dilemma = {
  id: string;
  text: string;
};

const compassionDilemmas: Dilemma[] = [
  {
    id: "train",
    text: "{name} is on a packed train. an exhausted looking office worker asks for their seat. should {name} give it up or pretend not to hear?",
  },
  {
    id: "bigcheese",
    text: "{name} sees a crumpled can of Big Cheese rolling down the road on the way to trip several babies who just learned how to walk. {name} is bleeding out. should {name} pick up the can of Big Cheese?",
  },
];

const retributionDilemmas: Dilemma[] = [
  {
    id: "jobinterviews",
    text: "{name} found out that a close friend has been cheating on all of their automated job interviews, but the job interviews are stupid anyway. should they say anything about it?",
  },
  {
    id: "promisefriend",
    text: "{name}'s close friend has been accused of a crime that they promise they did not commit. should they lie to protect them or turn them in?",
  },
];

const devotionDilemmas: Dilemma[] = [
  {
    id: "talentshow",
    text: "{name} and {name}'s close friend just happen to have prepared the same song for the talent show. should {name} make their performance really good or should {name} take it chill to not make {name}'s friend look bad?",
  },
  {
    id: "family",
    text: "{name}'s close friend has been accused of a crime that they promise they did not commit. should they lie to protect them or turn them in?",
  },
];

const dominanceDilemmas: Dilemma[] = [
  {
    id: "groupproject",
    text: "{name} is in a group project but everyone sucks at communicating. should {name} try to reform the group or give up and throw everyone under the bus?",
  },
  {
    id: "fakeid",
    text: "{name} finds a fake id and the profile looks just like them. do they use it to get into bars?",
  },
  {
    id: "controversialgovernment",
    text: "{name} is offered a position in a controversial ruler's government doing something kind of fun. do they refuse or accept?",
  }
];

const purityDilemmas: Dilemma[] = [
  {
    id: "fishcoin",
    text: "should {name} exploit a public space after realizing it has millions of buried $fishcoin? even when a small helpless furry creature inhabiting it looks up at {name} with big eyes?",
  },
  {
    id: "coffeejelly",
    text: "{name} really likes coffee jelly. like it is sickeningly good. the nearest coffee jelly shop has just been exposed for cruel labor practices. should {name} still get coffee jelly?",
  },
  {
    id: "redballoon",
    text: "{name} notices a child gleefully holding a red balloon. they smile at {name}. should {name} pop the balloon for fun?",
  },
];

const egoDilemmas: Dilemma[] = [
  {
    id: "summercamp",
    text: "{name} and another stranger at summer camp are starving. there's only enough food for one. should {name} eat it themself or give it to the stranger?",
  },
  {
    id: "antirecycling",
    text: "{name} is offered a high-paying job at a company that is mainly fine, but doesn't recycle. like super anti recycling. should {name} take the job?",
  },
];

export const dilemmas: Dilemma[] = [
  ...compassionDilemmas,
  ...retributionDilemmas,
  ...devotionDilemmas,
  ...dominanceDilemmas,
  ...purityDilemmas,
  ...egoDilemmas,
];

const dilemmasLibrary: Record<MoralDimension, Dilemma[]> = {
  compassion: compassionDilemmas,
  retribution: retributionDilemmas,
  devotion: devotionDilemmas,
  dominance: dominanceDilemmas,
  purity: purityDilemmas,
  ego: egoDilemmas,
};

export default dilemmasLibrary;
