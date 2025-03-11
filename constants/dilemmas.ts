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
    text: "{pet} sees a massive jug of Big Cheese rolling down the road on the way to trip several babies who just learned how to walk. {pet} is bleeding out. should {pet} pick up the jug of Big Cheese?",
    attribute: [MoralDimensions.compassion],
  },
  lostchild: {
    id: "lostchild",
    text: "{pet} sees a lost child crying at the mall. should {pet} help or keep their spot 1 hour into the Black Friday sale line?",
    attribute: [MoralDimensions.compassion],
  },
  sickfriend: {
    id: "sickfriend",
    text: "{pet}'s roommate is bedridden and asks {pet} to bring them soup, but {pet}'s edible is about to hit. should {pet} deliver the soup or let fate take its course?",
    attribute: [MoralDimensions.compassion],
  },
  homelesscat: {
    id: "homelesscat",
    text: "{pet} finds a stray cat in the rain. it looks up at {pet}, hungry and cold. should {pet} take responsibility or ignore it?",
    attribute: [MoralDimensions.compassion],
  },
  sickcoworker: {
    id: "sickcoworker",
    text: "{pet}'s coworker definitely has COVID but is refusing to leave work. should {pet} offer to cover their tasks or just keep distance?",
    attribute: [MoralDimensions.compassion],
  },
  scammer: {
    id: "scammer",
    text: "{pet}'s friend is desperately asking for money but other friends say it's going towards a pyramid scheme. should {pet} give money anyway or tell them to stop?",
    attribute: [MoralDimensions.compassion, MoralDimensions.ego],
  },
  overstaying: {
    id: "overstaying",
    text: "{pet} is at a friend's house and notices their friend getting tired. should {pet} leave or wait to be asked to leave?",
    attribute: [MoralDimensions.compassion],
  },
  fire: {
    id: "fire",
    text: "a fire breaks out. should {pet} choose to save their cherished stuffed animal or their neighbor?",
    attribute: [MoralDimensions.compassion, MoralDimensions.ego],
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
    text: "{pet}'s waiter was rude and the food was cold. should {pet} leave a scathing online review or leave a tip anyway?",
    attribute: [MoralDimensions.retribution],
  },
  friendlies: {
    id: "friendlies",
    text: "{pet}'s friend is being shittalked in a private group chat. {pet} has somewhat joined in in the past. should {pet} expose the chat, along with their messages, or keep quiet?",
    attribute: [MoralDimensions.retribution, MoralDimensions.devotion],
  },
  whistleblower: {
    id: "whistleblower",
    text: "{pet} discovers their company is dumping chemicals in a local river. reporting it would cost hundreds of jobs, including {pet}'s. should {pet} blow the whistle or hide it?",
    attribute: [MoralDimensions.retribution, MoralDimensions.purity],
  },
  bully: {
    id: "bully",
    text: "{pet}'s childhood rival sincerely apologizes. should {pet} accept the apology or remind them of past humiliations?",
    attribute: [MoralDimensions.retribution, MoralDimensions.devotion],
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
    text: "{pet} gets into a heated online debate where they realize their side is wrong. should {pet} admit defeat or double down?",
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
    text: "{pet}'s toy ship has been repaired so many times that every part has been replaced. is it the same ship?",
    attribute: [MoralDimensions.devotion, MoralDimensions.purity],
  },
  cheating: {
    id: "cheating",
    text: "{pet} discovers that their best friend is cheating on their partner. should {pet} tell the truth or stay silent?",
    attribute: [MoralDimensions.devotion, MoralDimensions.compassion],
  },
  socialmedia: {
    id: "socialmedia",
    text: "{pet}'s friend shares an offensive post online. should {pet} privately suggest they delete it or publicly shame them to gain followers?",
    attribute: [MoralDimensions.ego, MoralDimensions.purity],
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
    text: "{pet} is crushing their friend in a game they deeply care about. should {pet} show no mercy or ease up?",
    attribute: [MoralDimensions.dominance, MoralDimensions.compassion],
  },
  bunkbeds: {
    id: "bunkbeds",
    text: "{pet} is in charge of assigning rooms at a retreat. should {pet} assign the long distance couple attending one of the bunk beds or their own private room?",
    attribute: [MoralDimensions.dominance, MoralDimensions.compassion],
  },
  restaurantmistake: {
    id: "restaurantmistake",
    text: "{pet} finds a diamond wedding ring in the mail, clearly meant for another address. should {pet} try to return it or pocket the ring?",
    attribute: [MoralDimensions.dominance, MoralDimensions.purity],
  },
  hallmonitor: {
    id: "hallmonitor",
    text: "{pet} is the hall monitor at school when their friend gets in trouble. should {pet} lead with leniency or strict discipline?",
    attribute: [MoralDimensions.dominance, MoralDimensions.devotion],
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
    text: "should {pet} buy from a trendy fast-fashion brand?",
    attribute: [MoralDimensions.purity, MoralDimensions.ego],
  },
  simulationtheory: {
    id: "simulationtheory",
    text: "{pet} becomes convinced they're living in a computer simulation. should {pet} try to 'break out' by doing increasingly bizarre things, or continue living normally?",
    attribute: [MoralDimensions.purity, MoralDimensions.compassion],
  },
  flushtoilet: {
    id: "flushtoilet",
    text: "{pet} used the bathroom at a friend's house and clogged the toilet. there's no plunger. should they flush it or leave it?",
    attribute: [MoralDimensions.purity],
  },
  meat: {
    id: "meat",
    text: "{pet} is shocked to find out about factory farming cruelty, but they love meat. should they go vegetarian or excuse the cruelty?",
    attribute: [MoralDimensions.purity, MoralDimensions.compassion],
  },
  trash: {
    id: "trash",
    text: "{pet} drops a small piece of trash on the ground. should they pick it up or walk away?",
    attribute: [MoralDimensions.purity, MoralDimensions.compassion],
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
  promotion: {
    id: "promotion",
    text: "{pet} can get a promotion by sabotaging their coworker. should {pet} do it or let fairness prevail?",
    attribute: [MoralDimensions.ego, MoralDimensions.purity],
  },
  sickday: {
    id: "sickday",
    text: "{pet}'s friend desperately needs help moving, but {pet} is feeling incredibly lazy. should {pet} feign illness or help out?",
    attribute: [MoralDimensions.ego, MoralDimensions.compassion],
  },
  pbjs: {
    id: "pbjs",
    text: "{pet}'s friend made a custom cake for {pet}'s birthday. {pet} has recently become prediabetic. should {pet} eat the cake or awkwardly refuse?",
    attribute: [MoralDimensions.ego, MoralDimensions.purity],
  },
  egg: {
    id: "egg",
    text: "{pet} overs an over-easy egg at a diner. it comes out over-medium. should {pet} eat it or send it back?",
    attribute: [MoralDimensions.ego, MoralDimensions.purity],
  },

  // higher stakes
  cher: {
    id: "cher",
    text: "{pet} shares an apartment with a roommate they met online. one day, {pet} comes home earlier than expected and sees their roommate dressed up in your clothes, dancing to your favorite song in your room.",
    attribute: [MoralDimensions.devotion, MoralDimensions.compassion],
  },
  keycarving: {
    id: "keycarving",
    text: "{pet} needs to make spare keys for a friend. {pet} heads to the local locksmith and presents the key. he politely nods and rummages through a drawer containing many keys. he hands {pet} a copy of the key, no carving necessary. should {pet} tell their friend or accept it because he seems nice?",
    attribute: [MoralDimensions.compassion, MoralDimensions.devotion],
  },
  digitalpet: {
    id: "digitalpet",
    text: "{pet} finds themself at the bottom of a cliff, when another digital pet falls from the top and shatters both of their knees. they are writhing in pain and screaming for help. should {pet} help them?",
    attribute: [MoralDimensions.compassion, MoralDimensions.ego],
  },
  goodintentionsroad: {
    id: "goodintentionsroad",
    text: "{pet} comes along a path paved with good intentions. should {pet} take it?",
    attribute: [MoralDimensions.purity],
  },
  cockroach: {
    id: "cockroach",
    text: "{pet} sees a cockroach. should {pet} kill it?",
    attribute: [MoralDimensions.purity, MoralDimensions.compassion],
  },
  butterfly: {
    id: "butterfly",
    text: "{pet} sees a butterfly. should {pet} kill it?",
    attribute: [MoralDimensions.purity, MoralDimensions.compassion],
  },

  // bad person dilemmas
  saltfries: {
    id: "saltfries",
    text: "{pet} pretends to have a salt allergy so a fast food place has to make a fresh batch of fries. should {pet} salt them in front of the workers or wait until they're out of sight?",
    attribute: [MoralDimensions.ego, MoralDimensions.purity],
  },
  traintracks: {
    id: "traintracks",
    text: "There's like some people on a train track or something, and then on the other side is like-wait no wait let me try again. Your mom and like 5 random dudes are on a track and on the other side-oh fuck I'm really high-on the other side there's like a bus of children… with malaria. Do you do it?",
    attribute: [MoralDimensions.compassion],
  },
};
