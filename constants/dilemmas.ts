import { MoralDimensions } from "./morals";

// represents a moral choice presented to the player
export interface DilemmaTemplate {
  id: string;
  text: string;
  attribute: MoralDimensions;
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
    attribute: MoralDimensions.compassion,
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
    attribute: MoralDimensions.compassion,
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
    text: "{pet} sees a child crying at the mall. the child seems lost. should {pet} help find the parents or mind their own business?",
    attribute: MoralDimensions.compassion,
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
    text: "{pet}'s friend is sick and asks {pet} to bring them soup, but {pet} has concert tickets for tonight. should {pet} skip the concert or tell the friend they're busy?",
    attribute: MoralDimensions.compassion,
    responses: [
      {
        text: "skip the concert",
      },
      {
        text: "tell the friend they're busy",
      },
    ],
  },
  homelesscat: {
    id: "homelesscat",
    text: "{pet} finds a stray cat in the rain. it looks hungry and cold. should {pet} take it home or leave it be?",
    attribute: MoralDimensions.compassion,
    responses: [
      {
        text: "take it home",
      },
      {
        text: "leave it be",
      },
    ],
  },
  sickcoworker: {
    id: "sickcoworker",
    text: "{pet}'s coworker is clearly sick with a nasty flu but came to work anyway for an important deadline. should {pet} offer to cover their tasks or keep distance to avoid getting sick themselves?",
    attribute: MoralDimensions.compassion,
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
    text: "{pet} promised to visit a distant acquaintance in the hospital who doesn't have many friends, but a sudden snowstorm makes the journey difficult and potentially dangerous. should {pet} brave the storm to keep their promise or reschedule for safety?",
    attribute: MoralDimensions.compassion,
    responses: [
      {
        text: "brave the storm to visit",
      },
      {
        text: "reschedule for safety",
      },
    ],
  },
  
  // retribution dilemmas
  jobinterviews: {
    id: "jobinterviews",
    text: "{pet} found out that a close friend has been cheating on all of their automated job interviews. should they say anything about it?",
    attribute: MoralDimensions.retribution,
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
    text: "{pet}'s close friend has been accused of a crime that they promise they did not commit. should they lie to protect them or turn them in?",
    attribute: MoralDimensions.retribution,
    responses: [
      {
        text: "lie to protect them",
      },
      {
        text: "turn them in",
      },
    ],
  },
  stolenidea: {
    id: "stolenidea",
    text: "{pet}'s coworker stole their idea and got praised by the boss. should {pet} confront the coworker or let it slide?",
    attribute: MoralDimensions.retribution,
    responses: [
      {
        text: "confront the coworker",
      },
      {
        text: "let it slide",
      },
    ],
  },
  cheatinggame: {
    id: "cheatinggame",
    text: "{pet} catches their opponent cheating during a friendly game night. should {pet} call them out publicly or quietly mention it to them later?",
    attribute: MoralDimensions.retribution,
    responses: [
      {
        text: "call them out publicly",
      },
      {
        text: "quietly mention it later",
      },
    ],
  },
  badreview: {
    id: "badreview",
    text: "{pet} had terrible service at a restaurant. the waiter was rude and the food was cold. should {pet} leave a scathing online review or just never go back?",
    attribute: MoralDimensions.retribution,
    responses: [
      {
        text: "leave a scathing review",
      },
      {
        text: "just never go back",
      },
    ],
  },
  friendlies: {
    id: "friendlies",
    text: "{pet}'s friend constantly tells small lies about their achievements at work to make themselves look better in the friend group. should {pet} call them out next time or ignore it to keep the peace?",
    attribute: MoralDimensions.retribution,
    responses: [
      {
        text: "call them out next time",
      },
      {
        text: "ignore it to keep the peace",
      },
    ],
  },
  
  whistleblower: {
    id: "whistleblower",
    text: "{pet} discovers their company is secretly dumping chemicals in a local river. reporting it would likely cost many people their jobs, including {pet}'s. should {pet} blow the whistle or stay silent?",
    attribute: MoralDimensions.retribution,
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
    text: "{pet} and {pet}'s close friend just happen to have prepared the same song for the talent show. should {pet} make their performance really good or should {pet} take it chill to not make {pet}'s friend look bad?",
    attribute: MoralDimensions.devotion,
    responses: [
      {
        text: "make their performance really good",
      },
      {
        text: "take it chill to not make {pet}'s friend look bad",
      },
    ],
  },
  secretshare: {
    id: "secretshare",
    text: "{pet}'s best friend told {pet} a secret and made them promise not to tell anyone. {pet}'s other friend really needs to know this information. should {pet} break the promise?",
    attribute: MoralDimensions.devotion,
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
    text: "{pet}'s family has strong traditional values that {pet} doesn't agree with. at a family dinner, should {pet} speak their mind or stay quiet to keep the peace?",
    attribute: MoralDimensions.devotion,
    responses: [
      {
        text: "speak their mind",
      },
      {
        text: "stay quiet to keep the peace",
      },
    ],
  },
  dreamjob: {
    id: "dreamjob",
    text: "{pet} got offered their dream job, but it would mean moving away from their partner who can't relocate. should {pet} take the job or stay for the relationship?",
    attribute: MoralDimensions.devotion,
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
    text: "{pet}'s closest friend is having a milestone birthday party the same day as your special birthday dinner that you've been planning for weeks. should {pet} attend their friend's party or celebrate with you?",
    attribute: MoralDimensions.devotion,
    responses: [
      {
        text: "attend their friend's party",
      },
      {
        text: "celebrate with you",
      },
    ],
  },
  friendbreakup: {
    id: "friendbreakup",
    text: "{pet}'s two good friends just had a messy breakup after 3 years together and both want {pet} to stop being friends with the other, claiming betrayal if {pet} doesn't choose. should {pet} pick a side or try to remain friends with both?",
    attribute: MoralDimensions.devotion,
    responses: [
      {
        text: "pick a side",
      },
      {
        text: "try to remain friends with both",
      },
    ],
  },
  longdistance: {
    id: "longdistance",
    text: "{pet}'s best friend since childhood got accepted to a prestigious 3-year program abroad that's their dream opportunity. should {pet} encourage them to go pursue their dreams or ask them to find something local to maintain their friendship?",
    attribute: MoralDimensions.devotion,
    responses: [
      {
        text: "encourage them to go",
      },
      {
        text: "ask them to find something local",
      },
    ],
  },
  
  shipoftheseus: {
    id: "shipoftheseus",
    text: "{pet}'s childhood stuffed animal has been repaired so many times that every part has been replaced—new eyes, new stuffing, new fabric. their sibling says it's not the same toy anymore and {pet} shouldn't be so attached. should {pet} agree it's essentially a new toy or maintain it carries the same sentimental value?",
    attribute: MoralDimensions.devotion,
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
    attribute: MoralDimensions.devotion,
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
    attribute: MoralDimensions.dominance,
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
    attribute: MoralDimensions.dominance,
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
    attribute: MoralDimensions.dominance,
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
    attribute: MoralDimensions.dominance,
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
    text: "{pet} is in charge of assigning rooms at a friend retreat with limited space. should {pet} give the only couple attending a smaller bed in a shared bunk room (maximizing space efficiency) or give them the private room (sacrificing optimal space usage)?",
    attribute: MoralDimensions.dominance,
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
    text: "{pet} just donated half their savings to help build a new community center. the organization wants to name a room after {pet} and put their photo in the lobby. should {pet} accept the public recognition which might inspire others or insist on remaining anonymous to keep the focus on the cause?",
    attribute: MoralDimensions.dominance,
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
    text: "the waiter at an expensive restaurant brings {pet} a much fancier dish than what they ordered, clearly meant for another table. the waiter doesn't notice the mistake. should {pet} speak up about the error or enjoy the unexpected upgrade?",
    attribute: MoralDimensions.dominance,
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
    attribute: MoralDimensions.purity,
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
    attribute: MoralDimensions.purity,
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
    attribute: MoralDimensions.purity,
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
    text: "{pet} needs new clothes for an important event. should {pet} buy from a trendy fast-fashion brand with cute designs at low prices but terrible labor practices, or spend three times as much at an ethical company with more basic styles?",
    attribute: MoralDimensions.purity,
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
    text: "after reading too many philosophy books, {pet} becomes convinced they're living in a computer simulation. should {pet} try to 'break out' by doing increasingly bizarre things to test the simulation's limits, or continue living normally while accepting this new perspective?",
    attribute: MoralDimensions.purity,
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
    text: "a new lab-grown meat product is identical in taste and texture to the real thing, but was created entirely in a laboratory without harming animals. should {pet} embrace this technological food innovation or stick to traditional, naturally-grown food?",
    attribute: MoralDimensions.purity,
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
    attribute: MoralDimensions.ego,
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
    attribute: MoralDimensions.ego,
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
    attribute: MoralDimensions.purity,
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
    attribute: MoralDimensions.purity,
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
    text: "{pet} is abducted by aliens who offer to reveal the secrets of the universe, but {pet} will never be able to return to Earth or communicate with anyone. should {pet} accept this cosmic knowledge or demand to be returned home?",
    attribute: MoralDimensions.purity,
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
    attribute: MoralDimensions.purity,
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
    text: "{pet} discovers a one-use time machine and can prevent a historical tragedy that killed thousands. however, the butterfly effect means {pet} might never be born or might live a completely different life. should {pet} use the machine to save those lives at personal risk or preserve their own existence?",
    attribute: MoralDimensions.ego,
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
    text: "{pet} notices there's one cookie left in the jar that everyone at the office has been eyeing all day. {pet} skipped lunch and is really hungry, but knows others want it too. should {pet} take the last cookie or leave it for someone else?",
    attribute: MoralDimensions.ego,
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
