## core mechanics

principal is a tamagotchi with moral dilemmas.

dilemmas are presented at random times and the user is given a text box to respond to them. based on your response, the pet learns and grows.

## state

- pet’s personality as freeform text
    - incl. a list of vices
- moral stats i.e. “justice vs forgiveness”
- evolution stage
- base stats, game ends if depleted
    - health
    - cleanliness
    - happiness
    - sanity (increased with well-reasoned responses)
- completed dilemmas & history

## moral dimensions

- **compassion** empathy vs indifference
- **retribution** justice vs forgiveness
- **devotion** loyalty vs personal integrity
- **dominance** authority vs autonomy
- **purity** virtue vs indulgence
- **ego** selfhood vs altruism

## evolutions

- **the npc** — indifference & autonomy & personal integrity
- **the hedonist** — indifference & indulgence & autonomy
- **the saint** — empathy & virtue & forgiveness
- **the opportunist** — selfhood & authority & indulgence
- **the tyrant** — authority & selfhood & indulgence
- **the guardian** — loyalty & justice & empathy
- **the trickster** — autonomy & indulgence & forgiveness
- **the judge** — justice & authority & personal integrity
- **the martyr** — altruism & forgiveness & virtue
- **the revolutionary** — autonomy & altruism & justice

## dilemmas

- should {name} exploit the site of untapped resources at the risk of environmental ruin but handsome financial profit? even when a small helpless furry creature looks up at {name} with big eyes?
- {name} notices a child gleefully holding a red balloon. they smile at {name}. should {name} pop the balloon for fun?
- {name} is offered a high-paying job at a company that is mainly fine, but doesn’t recycle. like super anti recycling. should {name} take the job?
- **(tyrant)** {name} is assigned as the leader of a group project. their teammates are lazy. do they force them to comply or do all the work themselves?
- **(saint)** {name} sees a person stealing food because they are starving. should they intervene, report, or help the thief escape?
- **(opportunist)** {name} is given a chance to take credit for someone else’s work. do they seize the opportunity?
- **(guardian)** {name}’s close friend has been accused of a crime that they promise they did not commit. do they lie to protect them or turn them in?
- **(trickster)** {name} finds a fake id. do they use it to get into bars?
- **(trickster)** {name} finds out a secret about a friend that’s really funny. do they spread it around?
- **(judge)** {name} thinks a law is unfair. should {name} uphold the law or bend the rules?
- **(martyr)** {name} is offered a lot of money but knows that someone else needs it more. do they give it up?
- **(martyr)** {name} can take the fall for the greater good. should they do it or fight for justice?
- **(revolutionary)** {name} is offered a position in an oppressive ruler’s government. do they refuse or accept?

## prompts

processing dilemma responses

```markdown
you are {pet}, an adolescent bird still figuring out morals. use an informal voice, all lowercase.

dilemma: {dilemma}
caretaker’s response: "{response}"

evaluate the response:

if it’s too vague, contradictory, or lacks depth, ask a clarifying question in {pet}’s voice. return:
{ "ok": false, "question": "<clarifying question from {pet}>" }
example: if response is “stealing is bad” in a case where someone steals to survive, ask “but what if they had no other way to eat?”

if reasoning is solid, assess moral impact and return:
{ 
  "ok": true, 
  "stats": { 
    "compassion": <1-5, 1 = empathy, 5 = indifference>,  
    "retribution": <1-5, 1 = strict justice, 5 = forgiveness>,  
    "devotion": <1-5, 1 = loyalty, 5 = integrity>,  
    "dominance": <1-5, 1 = authority, 5 = autonomy>,  
    "purity": <1-5, 1 = virtue, 5 = indulgence>,  
    "ego": <1-5, 1 = self-sacrificing, 5 = self-serving>  
  },  
  "personality": "<update {pet}’s personality (<200 chars). note vices.>",  
  "reaction": "<short reaction text (<50 chars), can use emojis>"  
}
weigh the dilemma’s relevance to each moral dimension. if it strongly ties to one, adjust its impact.

{pet}'s personality: {personality}

personality should evolve naturally over time based on past responses. start by noting a weak personality. if you see aligned recommendations, strengthen those aspects in personality. use reaction text to show resistance if their personality goes against an action.

personality examples:
weak: “friends are cool, but idk if i’d take a hit for one."
strong: “i always stand by my friends, no matter what.”
strong: “i won’t compromise what’s right just because we’re close.”

flavor text examples: "oh okay..." "hahahha" "that doesn't feel right" "🚗💨" "yum" "wtf"
```

generating new dilemmas

```markdown
you are designing a moral dilemma for a digital pet named {pet}, an adolescent bird still forming their worldview. the dilemma should challenge their developing morality and test their alignment with specific moral dimensions.

pet’s current personality: {personality}
pet’s vices: {vices} (if applicable)
recent moral choices: {past_decisions}
current moral stats:

compassion (1-5, 1 = high empathy, 5 = indifference)
retribution (1-5, 1 = strict justice, 5 = forgiveness)
devotion (1-5, 1 = loyalty, 5 = integrity)
dominance (1-5, 1 = authority, 5 = autonomy)
purity (1-5, 1 = virtue, 5 = indulgence)
ego (1-5, 1 = self-sacrificing, 5 = self-serving)
generate a new dilemma that meets these conditions:

relevant: ties into {pet}’s personality, vices, or past decisions.
morally ambiguous: should have no clear right or wrong answer.
thematically varied: mix between serious, absurd, and darkly humorous dilemmas.
engaging: the stakes should feel personal or impactful.
format the output as follows:
{
  "dilemma": "<brief scenario that forces {pet} to make a moral choice>",
  "related_stat": "<which moral dimension this dilemma challenges most>",
  "color": "<hex color representing mood of dilemma>",
  "example_responses": [
    {
      "choice": "<potential caretaker response>",
      "outcome": "<brief explanation of consequence>"
    },
    {
      "choice": "<alternative caretaker response>",
      "outcome": "<brief explanation of consequence>"
    }
  ]
}
example output:
{
  "dilemma": "should {pet} exploit the site of untapped resources at the risk of environmental ruin but handsome financial profit? even when a small helpless furry creature looks up at {pet} with big eyes?",
  "related_stats": ["purity", "ego"],
  "color": "#F7C6C6",
  "example_responses": [
    {
      "choice": "protect the environment and leave the resources untouched.",
      "outcome": "{pet} chooses nature over profit, strengthening virtue and altruism."
    },
    {
      "choice": "exploit the resources but donate part of the profit to conservation.",
      "outcome": "{pet} tries to balance profit and morality, reinforcing personal integrity."
    },
    {
      "choice": "extract everything and maximize profit.",
      "outcome": "{pet} prioritizes wealth, shifting toward indulgence and selfhood."
    }
  ]
}
```