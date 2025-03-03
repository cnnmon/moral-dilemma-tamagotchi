import { MoralDimensions } from "./morals";

// represents a moral choice presented to the player
export interface DilemmaTemplate {
  id: string;
  text: string;
  attribute: MoralDimensions[];
  responses: Array<{
    text: string;
  }>;
}

// all dilemmas organized by attribute
export const dilemmaTemplates: Record<string, DilemmaTemplate> = {
  // compassion dilemmas
  train: {
    id: "train",
    text: "{pet} is on a packed train. an exhausted looking office worker asks for their seat. should {pet} give it up or pretend not to hear?",
    attribute: [MoralDimensions.compassion],
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
    attribute: [MoralDimensions.compassion],
    responses: [
      {
        text: "pick up the can of Big Cheese",
      },
      {
        text: "leave it alone",
      },
    ],
  },
  lostchild: {
    id: "lostchild",
    text: "{pet} sees a child crying at the mall. the child seems lost. {pet} could help, but what if the kid just likes crying?",
    attribute: [MoralDimensions.compassion],
    responses: [
      {
        text: "help find the parents",
      },
      {
        text: "mind their own business",
      },
    ],
  },
  sickfriend: {
    id: "sickfriend",
    text: "{pet}'s roommate is sick and asks {pet} to bring them soup, but {pet} has front-row concert tickets for tonight. should {pet} deliver the soup or let fate take its course?",
    attribute: [MoralDimensions.compassion],
    responses: [
      {
        text: "skip the concert",
      },
      {
        text: "let fate take its course",
      },
    ],
  },
  homelesscat: {
    id: "homelesscat",
    text: "{pet} finds a stray cat in the rain. it looks up at {pet}, hungry and cold. should {pet} take it home (incurring life-long responsibilities) or pretend it didn't just make eye contact?",
    attribute: [MoralDimensions.compassion],
    responses: [
      {
        text: "take it home",
      },
      {
        text: "pretend it didn't make eye contact",
      },
    ],
  },
  sickcoworker: {
    id: "sickcoworker",
    text: "{pet}'s flu-ridden coworker refuses to leave work. should {pet} offer to cover their tasks or keep distance to avoid getting sick themselves?",
    attribute: [MoralDimensions.compassion],
    responses: [
      {
        text: "offer to cover their tasks",
      },
      {
        text: "keep distance to avoid getting sick",
      },
    ],
  },
  
  hospitalvisit: {
    id: "hospitalvisit",
    text: "{pet} promised to visit a distant acquaintance in the hospital, but a sudden snowstorm makes the journey potentially dangerous. should {pet} risk frostbite or hope they live another week?",
    attribute: [MoralDimensions.compassion],
    responses: [
      {
        text: "risk frostbite",
      },
      {
        text: "hope they live another week",
      },
    ],
  },
  
  // retribution dilemmas
  jobinterviews: {
    id: "jobinterviews",
    text: "{pet} discovers their friend has been cheating on all of their job interviews. do they report them or leave it alone?",
    attribute: [MoralDimensions.retribution],
    responses: [
      {
        text: "tell on the friend",
      },
      {
        text: "leave it alone",
      },
    ],
  },
  promisefriend: {
    id: "promisefriend",
    text: "{pet}'s close friend has been accused of a crime they promise they did not commit, but the evidence is damning. should {pet} lie in court to protect them?",
    attribute: [MoralDimensions.retribution, MoralDimensions.devotion],
    responses: [
      {
        text: "lie to protect them",
      },
      {
        text: "tell the truth",
      },
    ],
  },
  stolenidea: {
    id: "stolenidea",
    text: "{pet}'s coworker stole their idea and got a raise. should {pet} confront them or start plotting an elaborate revenge plan?",
    attribute: [MoralDimensions.retribution],
    responses: [
      {
        text: "confront the coworker",
      },
      {
        text: "plot a revenge plan",
      },
    ],
  },
  cheatinggame: {
    id: "cheatinggame",
    text: "{pet} catches a friend cheating during game night. should {pet} call them out publicly or whisper \"i know what you did\"?",
    attribute: [MoralDimensions.retribution],
    responses: [
      {
        text: "call them out publicly",
      },
      {
        text: "whisper the threat",
      },
    ],
  },
  badreview: {
    id: "badreview",
    text: "{pet}'s waiter was rude and the food was cold. should {pet} leave a scathing online review or just never return?",
    attribute: [MoralDimensions.retribution],
    responses: [
      {
        text: "leave a scathing review",
      },
      {
        text: "never return",
      },
    ],
  },
  friendlies: {
    id: "friendlies",
    text: "{pet}'s friend keeps making up wild stories about other friends. should {pet} call them out or enjoy the fiction?",
    attribute: [MoralDimensions.retribution, MoralDimensions.devotion],
    responses: [
      {
        text: "call them out",
      },
      {
        text: "enjoy the fiction",
      },
    ],
  },
  
  whistleblower: {
    id: "whistleblower",
    text: "{pet} discovers their company is secretly dumping chemicals in a local river. reporting it would cost hundreds of jobs, including {pet}'s. should {pet} blow the whistle or stay silent?",
    attribute: [MoralDimensions.retribution, MoralDimensions.purity],
    responses: [
      {
        text: "blow the whistle",
      },
      {
        text: "stay silent",
      },
    ],
  },
  
  // devotion dilemmas
  talentshow: {
    id: "talentshow",
    text: "{pet} and {pet}'s close friend unknowingly prepared the same song for the talent show. does {pet} go all out or throw the match?",
    attribute: [MoralDimensions.devotion],
    responses: [
      {
        text: "go all out",
      },
      {
        text: "throw the match",
      },
    ],
  },
  secretshare: {
    id: "secretshare",
    text: "{pet} swore to keep a friend's secret, but {pet} realizes another friend desperately needs that info. should {pet} break the promise?",
    attribute: [MoralDimensions.devotion],
    responses: [
      {
        text: "break the promise",
      },
      {
        text: "keep the secret",
      },
    ],
  },
  familyvalues: {
    id: "familyvalues",
    text: "{pet}'s friend's family has strong traditional values that {pet} doesn't agree with. at a dinner at their place, {pet} witnesses a debate about to happen. should {pet} say their truth or agree with the side that's likely to win?",
    attribute: [MoralDimensions.devotion, MoralDimensions.ego],
    responses: [
      {
        text: "say their truth",
      },
      {
        text: "agree with the side that's likely to win",
      },
    ],
  },
  dreamjob: {
    id: "dreamjob",
    text: "{pet}'s friend got offered their dream job, but it would mean moving away. should {pet} recommend they take it or convince them to stay?",
    attribute: [MoralDimensions.devotion],
    responses: [
      {
        text: "take the job",
      },
      {
        text: "stay for the relationship",
      },
    ],
  },
  birthdayparty: {
    id: "birthdayparty",
    text: "{pet}'s closest friend is having a party the same day as {pet}'s birthday. should {pet} attend their friend's party or ditch it for a solo birthday?",
    attribute: [MoralDimensions.devotion, MoralDimensions.ego],
    responses: [
      {
        text: "attend their friend's party",
      },
      {
        text: "ditch it",
      },
    ],
  },
  friendbreakup: {
    id: "friendbreakup",
    text: "{pet}'s two good friends just broke up and both claim betrayal. should {pet} pick a side or try to stay neutral?",
    attribute: [MoralDimensions.devotion],
    responses: [
      {
        text: "pick a side",
      },
      {
        text: "try to stay neutral",
      },
    ],
  },
  shipoftheseus: {
    id: "shipoftheseus",
    text: "{pet}'s childhood stuffed animal has been repaired so many times that every part has been replaced. their sibling says it's not the same toy anymore. should {pet} agree it's essentially a new toy or maintain it carries the same sentimental value?",
    attribute: [MoralDimensions.devotion, MoralDimensions.purity],
    responses: [
      {
        text: "it's essentially a new toy",
      },
      {
        text: "it carries the same sentimental value",
      },
    ],
  },
  
  heirloomring: {
    id: "heirloomring",
    text: "{pet}'s grandmother left them a family heirloom ring with instructions to 'keep it in the family.' {pet}'s cousin who was very close to grandma really wants the ring but wasn't mentioned in the will. should {pet} give the ring to their cousin or keep it as instructed?",
    attribute: [MoralDimensions.devotion],
    responses: [
      {
        text: "give the ring to their cousin",
      },
      {
        text: "keep it as instructed",
      },
    ],
  },
  
  // dominance dilemmas
  groupproject: {
    id: "groupproject",
    text: "{pet} is in a group project but everyone sucks at communicating. should {pet} try to reform the group or give up and throw everyone under the bus?",
    attribute: [MoralDimensions.dominance],
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
    attribute: [MoralDimensions.dominance, MoralDimensions.purity],
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
    attribute: [MoralDimensions.dominance, MoralDimensions.purity],
    responses: [
      {
        text: "refuse",
      },
      {
        text: "accept",
      },
    ],
  },
  gamenight: {
    id: "gamenight",
    text: "{pet} is winning by a large margin at game night against a friend who always gets upset when losing. this friend has been having a rough week already. should {pet} play to win decisively or subtly let the friend catch up for a closer game?",
    attribute: [MoralDimensions.dominance, MoralDimensions.compassion],
    responses: [
      {
        text: "play to win decisively",
      },
      {
        text: "subtly let the friend catch up",
      },
    ],
  },
  bunkbeds: {
    id: "bunkbeds",
    text: "{pet} is in charge of assigning rooms at a friend retreat with limited space. should {pet} give the long distance couple attending a smaller bed in a shared bunk room or give them the private room?",
    attribute: [MoralDimensions.dominance, MoralDimensions.compassion],
    responses: [
      {
        text: "put them in the bunk room for efficiency",
      },
      {
        text: "give them the private room",
      },
    ],
  },
  
  anonymousdonation: {
    id: "anonymousdonation",
    text: "{pet} just donated half their savings to help build a new community center. the organization wants to name a room after {pet}. should {pet} accept the public recognition or insist on remaining anonymous?",
    attribute: [MoralDimensions.dominance, MoralDimensions.ego],
    responses: [
      {
        text: "accept the public recognition",
      },
      {
        text: "remain anonymous",
      },
    ],
  },
  
  restaurantmistake: {
    id: "restaurantmistake",
    text: "the waiter brings {pet} a much fancier dish than what they ordered, clearly meant for another table. should {pet} speak up about the error or enjoy the unexpected upgrade?",
    attribute: [MoralDimensions.dominance, MoralDimensions.purity],
    responses: [
      {
        text: "speak up about the error",
      },
      {
        text: "enjoy the unexpected upgrade",
      },
    ],
  },
  
  // purity dilemmas
  fishcoin: {
    id: "fishcoin",
    text: "should {pet} exploit a public space after realizing it has millions of buried $fishcoin? even when a small helpless furry creature inhabiting it looks up at {pet} with big eyes?",
    attribute: [MoralDimensions.purity, MoralDimensions.compassion],
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
    attribute: [MoralDimensions.purity, MoralDimensions.compassion],
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
    attribute: [MoralDimensions.purity, MoralDimensions.compassion],
    responses: [
      {
        text: "pop the balloon for fun",
      },
      {
        text: "leave it alone",
      },
    ],
  },
  fastfashion: {
    id: "fastfashion",
    text: "{pet} needs new clothes for an important event. should {pet} buy from a trendy fast-fashion brand with cute designs at low prices but terrible labor practices, or spend more at an ethical company?",
    attribute: [MoralDimensions.purity, MoralDimensions.ego],
    responses: [
      {
        text: "buy the cute fast-fashion clothes",
      },
      {
        text: "spend more for ethical clothing",
      },
    ],
  },
  
  simulationtheory: {
    id: "simulationtheory",
    text: "after reading too many philosophy books, {pet} becomes convinced they're living in a computer simulation. should {pet} try to 'break out' by doing increasingly bizarre things, or continue living normally?",
    attribute: [MoralDimensions.purity],
    responses: [
      {
        text: "try to 'break out' with bizarre behavior",
      },
      {
        text: "continue living normally",
      },
    ],
  },
  
  artificialfood: {
    id: "artificialfood",
    text: "a new lab-grown meat product is identical to the real thing, but was created entirely in a laboratory without harming animals. should {pet} embrace this technological food innovation or stick to traditional food?",
    attribute: [MoralDimensions.purity],
    responses: [
      {
        text: "embrace the lab-grown meat",
      },
      {
        text: "stick to traditional food",
      },
    ],
  },
  
  // ego dilemmas
  summercamp: {
    id: "summercamp",
    text: "{pet} and another stranger at summer camp are starving. there's only enough food for one. should {pet} eat it themself or give it to the stranger?",
    attribute: [MoralDimensions.ego, MoralDimensions.compassion],
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
    attribute: [MoralDimensions.ego, MoralDimensions.purity],
    responses: [
      {
        text: "take the job",
      },
      {
        text: "leave it alone",
      },
    ],
  },
  
  // gag dilemmas
  icecube: {
    id: "icecube",
    text: "an ice cube falls from {pet}'s freezer as they grab ice cream. should {pet} kick it under the refrigerator or pick it up?",
    attribute: [MoralDimensions.purity],
    responses: [
      {
        text: "kick it under the refrigerator",
      },
      {
        text: "pick it up",
      },
    ],
  },
  flushtoilet: {
    id: "flushtoilet",
    text: "{pet} used the bathroom. should they flush the toilet?",
    attribute: [MoralDimensions.purity],
    responses: [
      {
        text: "flush it",
      },
      {
        text: "don't flush it",
      },
    ],
  },
  
  alienabduction: {
    id: "alienabduction",
    text: "{pet} is abducted by aliens who offer to reveal the secrets of the universe, but {pet} will never be able to return to Earth. should {pet} accept this cosmic knowledge or demand to be returned home?",
    attribute: [MoralDimensions.purity, MoralDimensions.ego],
    responses: [
      {
        text: "accept the cosmic knowledge",
      },
      {
        text: "demand to be returned home",
      },
    ],
  },
  
  pizzacrust: {
    id: "pizzacrust",
    text: "{pet} is eating pizza. should they eat the crust or leave it on the plate?",
    attribute: [MoralDimensions.purity],
    responses: [
      {
        text: "eat the crust",
      },
      {
        text: "leave it on the plate",
      },
    ],
  },
  
  // ego dilemmas
  timetravel: {
    id: "timetravel",
    text: "{pet} discovers a one-use time machine and can prevent a historical tragedy that killed thousands. however, the butterfly effect means {pet} might never be born. should {pet} use the machine or preserve their own existence?",
    attribute: [MoralDimensions.ego, MoralDimensions.compassion],
    responses: [
      {
        text: "use the machine to save lives",
      },
      {
        text: "preserve their own existence",
      },
    ],
  },
  
  lastcookie: {
    id: "lastcookie",
    text: "{pet} notices there's one cookie left in the jar that everyone at the office has been eyeing all day. {pet} skipped lunch and is really hungry. should {pet} take the last cookie or leave it for someone else?",
    attribute: [MoralDimensions.ego, MoralDimensions.compassion],
    responses: [
      {
        text: "take the last cookie",
      },
      {
        text: "leave it for someone else",
      },
    ],
  },
};
