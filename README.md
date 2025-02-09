## core mechanics

principal is a tamagotchi with moral dilemmas. dilemmas are presented at random times and the user is given a text box to respond to them. based on your response, the pet learns, grows, and evolves.

uses typescript, next.js, convex, tailwind.

## moral dimensions

- **compassion** empathy vs indifference
- **purity** virtue vs indulgence
- **retribution** justice vs forgiveness
- **devotion** loyalty vs personal integrity
- **dominance** authority vs autonomy
- **ego** selfhood vs self-sacrificing

## evolutions

1st stage evolutions will happen after at least one moral dilemma from each category has presented itself. 2nd stage evolutions will happen after (some arbitrary limit).

- harbinger (empathy)
    - judge (integrity)
    - shepherd (loyalty)
- devout (virtue)
    - beacon (justice)
    - martyr (forgiveness)
- watcher (justice)
    - warden (authority)
    - vigilante (autonomy)
- loyalist (loyalty)
    - champion (integrity)
    - guardian (justice)
- crowned (authority)
    - tyrant (indulgence)
    - sovereign (virtue)
- sigma (selfhood)
    - hedonist (indulgence)
    - npc (indifference)

## stage 1 evolution dilemmas

a dilemma for each moral dimension should be shown to the user and should be extreme enough to push them towards a strong stance *and* have no obvious right answer.

the following could also be multiple stats. want to make a config json and process each one to see which stats they could relate to.

| compassion | {pet} is on a packed train. an exhausted looking office worker asks for their seat. should {pet} give it up or pretend not to hear?

{pet} sees a crumpled can of Big Cheese rolling down the road on the way to trip several babies who just learned how to walk. {pet} is bleeding out. should {pet} pick up the can of Big Cheese? |
| --- | --- |
| retribution | {pet} found out that a close friend has been cheating on all of their automated job interviews. should they say anything about it?

{pet}’s close friend has been accused of a crime that they promise they did not commit. should they lie to protect them or turn them in? |
| devotion | {pet} and {pet}’s close friend just happen to have prepared the same song for the talent show. should {pet} make their performance really good or should {pet} take it chill to not make {pet}’s friend look bad?

{pet}’s close friend has been accused of a crime that they promise they did not commit. should they lie to protect them or turn them in? |
| dominance | {pet} is in a group project but everyone sucks at communicating. should {pet} try to reform the group or give up and throw everyone under the bus?

{pet} finds a fake id and the profile looks *just like them*. do they use it to get into bars?

{pet} is offered a position in a controversial ruler’s government. do they refuse or accept? |
| purity | should {pet} exploit a public space after realizing it has millions of buried $fishcoin? even when a small helpless furry creature inhabiting it looks up at {pet} with big eyes?

{pet} *really* likes coffee jelly. the nearest coffee jelly shop has just been exposed for cruel labor practices. should {pet} still get coffee jelly?

{pet} notices a child gleefully holding a red balloon. they smile at {pet}. should {pet} pop the balloon for fun? |
| ego | {pet} and another stranger at summer camp are starving. there’s only enough food for one. should {pet} eat it themself or give it to the stranger?

{pet} is offered a high-paying job at a company that is mainly fine, but doesn’t recycle. like super anti recycling. should {pet} take the job? |

## stage 2 evolution dilemmas

more high stakes & personalized! TODO

## prompts

processing:

- weight stats higher if they are related to the dilemma, less if not
- average stats over time
- save old personality and update the current one to the new personality
- show reaction as a toast