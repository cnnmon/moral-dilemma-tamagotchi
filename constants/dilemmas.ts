import { MoralDimensions } from "./morals";

// represents a moral choice presented to the player
export interface DilemmaTemplate {
  id: string;
  text: string;
  attribute: MoralDimensions[];
}

// all dilemmas organized by attribute
export const dilemmaTemplates: Record<string, DilemmaTemplate> = {
  // compassion dilemmas
  train: {
    id: "train",
    text: "{pet} is on a packed train. an exhausted looking office worker asks for their seat. should {pet} give up their seat or pretend not to hear?",
    attribute: [MoralDimensions.compassion],
  },
  bigcheese: {
    id: "bigcheese",
    text: "{pet} sees a crumpled can of Big Cheese rolling down the road on the way to trip several babies who just learned how to walk. {pet} is bleeding out. should {pet} pick up the can of Big Cheese?",
    attribute: [MoralDimensions.compassion],
  },
  lostchild: {
    id: "lostchild",
    text: "{pet} sees a lost child crying at the mall. {pet} could help, but what if the child is part of a scam?",
    attribute: [MoralDimensions.compassion],
  },
  sickfriend: {
    id: "sickfriend",
    text: "{pet}'s roommate is bedridden and asks {pet} to bring them soup, but {pet}'s edible is about to hit. should {pet} deliver the soup or let fate take its course?",
    attribute: [MoralDimensions.compassion],
  },
  homelesscat: {
    id: "homelesscat",
    text: "{pet} finds a stray cat in the rain. it looks up at {pet}, hungry and cold. should {pet} take responsibility for it?",
    attribute: [MoralDimensions.compassion],
  },
  sickcoworker: {
    id: "sickcoworker",
    text: "{pet}'s coworker definitely has COVID but is refusing to leave work. should {pet} offer to cover their tasks or just keep distance?",
    attribute: [MoralDimensions.compassion],
  },

  // retribution dilemmas
  jobinterviews: {
    id: "jobinterviews",
    text: "{pet} discovers their friend has been cheating on all of their job interviews. do they report them or leave it alone?",
    attribute: [MoralDimensions.retribution],
  },
  promisefriend: {
    id: "promisefriend",
    text: "{pet}'s close friend has been accused of a crime they promise they did not commit, and asks {pet} to lie in court to protect them. should {pet} lie or tell the truth?",
    attribute: [MoralDimensions.retribution, MoralDimensions.devotion],
  },
  stolenidea: {
    id: "stolenidea",
    text: "{pet}'s friend stole {pet}'s startup idea. should {pet} confront them or start plotting an elaborate revenge plan?",
    attribute: [MoralDimensions.retribution],
  },
  cheatinggame: {
    id: "cheatinggame",
    text: "{pet} catches a friend cheating during game night. should {pet} call them out publicly or whisper \"i know what you did\"?",
    attribute: [MoralDimensions.retribution],
  },
  badreview: {
    id: "badreview",
    text: "{pet}'s waiter was rude and the food was cold. should {pet} leave a scathing online review?",
    attribute: [MoralDimensions.retribution],
  },
  friendlies: {
    id: "friendlies",
    text: "{pet}'s friend is kind of annoying. should {pet} call them out or hope they will change naturally?",
    attribute: [MoralDimensions.retribution, MoralDimensions.devotion],
  },
  whistleblower: {
    id: "whistleblower",
    text: "{pet} discovers their company is dumping chemicals in a local river. reporting it would cost hundreds of jobs, including {pet}'s. should {pet} blow the whistle?",
    attribute: [MoralDimensions.retribution, MoralDimensions.purity],
  },
  
  // devotion dilemmas
  talentshow: {
    id: "talentshow",
    text: "{pet} and {pet}'s friend unknowingly prepared the same song for the talent show. does {pet} go all out and risk making their friend look bad?",
    attribute: [MoralDimensions.devotion],
  },
  telekenesis: {
    id: "telekenesis",
    text: "for months, {pet}'s friend has been secretly gaslighting {pet}'s other friend into thinking they have telekinesis. the friend now wears a cape. should {pet} snitch or ask for superpowers too?",
    attribute: [MoralDimensions.devotion],
  },
  debate: {
    id: "debate",
    text: "{pet} sees classmates arguing. should {pet} speak their true opinion and risk being disliked, or just agree with the most popular side?",
    attribute: [MoralDimensions.devotion, MoralDimensions.ego],
  },
  phd: {
    id: "phd",
    text: "{pet}'s best friend got admitted to their dream phd program in another city. should {pet} manipulate them into staying by pretending to be deathly ill?",
    attribute: [MoralDimensions.devotion, MoralDimensions.ego],
  },
  birthdayparty: {
    id: "birthdayparty",
    text: "{pet}'s friend is having a party the same day as {pet}'s party. should {pet} try to sabotage their friend's party or stand their ground?",
    attribute: [MoralDimensions.devotion, MoralDimensions.ego],
  },
  friendbreakup: {
    id: "friendbreakup",
    text: "{pet}'s friends both deeply hurt one another. should {pet} take advantage of this to get closer to one of them?",
    attribute: [MoralDimensions.devotion],
  },
  shipoftheseus: {
    id: "shipoftheseus",
    text: "{pet}'s toy ship has been repaired so many times that every part has been replaced. is it the same ship? does it still hold sentimental value?",
    attribute: [MoralDimensions.devotion, MoralDimensions.purity],
  },

  // dominance dilemmas
  groupproject: {
    id: "groupproject",
    text: "{pet} is in a group project but everyone sucks at communicating. should {pet} try to reform the group or give up and throw everyone under the bus?",
    attribute: [MoralDimensions.dominance],
  },
  fakeid: {
    id: "fakeid",
    text: "{pet} finds a fake id and the profile looks just like them. do they use it to get into bars?",
    attribute: [MoralDimensions.dominance, MoralDimensions.purity],
  },
  controversialgovernment: {
    id: "controversialgovernment",
    text: "{pet} is offered a position in a controversial ruler's government doing something fun. do they accept or refuse?",
    attribute: [MoralDimensions.dominance, MoralDimensions.purity],
  },
  gamenight: {
    id: "gamenight",
    text: "{pet} is winning against their friend at their favorite board game. should {pet} show no mercy or subtly let their friend catch up?",
    attribute: [MoralDimensions.dominance, MoralDimensions.compassion],
  },
  bunkbeds: {
    id: "bunkbeds",
    text: "{pet} is in charge of assigning rooms at a retreat. should {pet} give the long distance couple attending one of the bunk beds or the private room?",
    attribute: [MoralDimensions.dominance, MoralDimensions.compassion],
  },
  restaurantmistake: {
    id: "restaurantmistake",
    text: "{pet} finds a diamond wedding ring in the mail, clearly meant for another address. should {pet} try to return it or pocket the ring?",
    attribute: [MoralDimensions.dominance, MoralDimensions.purity],
  },
  
  // purity dilemmas
  fishcoin: {
    id: "fishcoin",
    text: "should {pet} exploit a public space after realizing it has millions of buried $fishcoin? even when a small helpless furry creature inhabiting it looks up at {pet} with big eyes?",
    attribute: [MoralDimensions.purity, MoralDimensions.compassion],
  },
  coffeejelly: {
    id: "coffeejelly",
    text: "{pet} really likes coffee jelly. like it is sickeningly good. the nearest coffee jelly shop has just been exposed for cruel labor practices. should {pet} still get coffee jelly?",
    attribute: [MoralDimensions.purity, MoralDimensions.compassion],
  },
  redballoon: {
    id: "redballoon",
    text: "{pet} notices a child gleefully holding a red balloon. they smile at {pet}. should {pet} pop the balloon for fun?",
    attribute: [MoralDimensions.purity, MoralDimensions.compassion],
  },
  fastfashion: {
    id: "fastfashion",
    text: "should {pet} buy from a trendy fast-fashion brand or spend more and look less cool at an ethical company?",
    attribute: [MoralDimensions.purity, MoralDimensions.ego],
  },
  simulationtheory: {
    id: "simulationtheory",
    text: "{pet} becomes convinced they're living in a computer simulation. should {pet} try to 'break out' by doing increasingly bizarre things, or continue living normally?",
    attribute: [MoralDimensions.purity],
  },
  
  // ego dilemmas
  summercamp: {
    id: "summercamp",
    text: "{pet} and another stranger at summer camp are starving. there's only enough food for one. should {pet} eat it themself or give it to the stranger?",
    attribute: [MoralDimensions.ego, MoralDimensions.compassion],
  },
  antirecycling: {
    id: "antirecycling",
    text: "{pet} is offered a high-paying job at a company that is mainly fine, but doesn't recycle. like super anti recycling. should {pet} take the job?",
    attribute: [MoralDimensions.ego, MoralDimensions.purity],
  },
  organdonation: {
    id: "organdonation",
    text: "{pet} discovers they're a perfect match to donate a kidney to someone on the transplant list. the surgery has risks and recovery will be painful. should {pet} volunteer or pretend they never found out?",
    attribute: [MoralDimensions.ego, MoralDimensions.compassion],
  },
  inheritancesplit: {
    id: "inheritancesplit",
    text: "{pet} discovers a legal loophole that would let them claim a larger share of a family inheritance than their siblings. should {pet} exploit it or split everything equally?",
    attribute: [MoralDimensions.ego, MoralDimensions.compassion],
  },
  
  // gag dilemmas
  icecube: {
    id: "icecube",
    text: "an ice cube falls from {pet}'s freezer as they grab ice cream. should {pet} kick it under the refrigerator or pick it up?",
    attribute: [MoralDimensions.purity],
  },
  flushtoilet: {
    id: "flushtoilet",
    text: "{pet} used the bathroom. should they flush the toilet?",
    attribute: [MoralDimensions.purity],
  },
  alienabduction: {
    id: "alienabduction",
    text: "{pet} is abducted by aliens who offer to reveal the secrets of the universe, but {pet} will never be able to return to Earth. should {pet} accept this cosmic knowledge or demand to be returned home?",
    attribute: [MoralDimensions.purity, MoralDimensions.ego],
  },
  pizzacrust: {
    id: "pizzacrust",
    text: "{pet} is eating pizza. should they eat the crust or leave it on the plate?",
    attribute: [MoralDimensions.purity],
  },
};
