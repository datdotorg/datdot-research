# validator (=chain)
participants of block production

## glossary
* `verifier` (=`???`)
* `finalization` => included in a finalized block

## process & status
* `VALIDATOR` selected by `randomness` via `event`
1. Selects `SEEDER`
  * => need to wait for a new block to see which seeder was selected
  * happens during:
    1. at beginning of a block?
    2. during `register_seeder()`?
    3. during `register_data()`?

## code
```js

// select random seeder(s)

// public chain API

```

#### pallet `iamonline`
=> PEER STATUS (im-online module)
* figures out whether user is **online** or **offline**
  * => "JOIN" written to CHAIN for certain time duration?
  * peers then need to re-publish to demonstrate they are online
* enabled for blockchain validators
  * if all `seeders` are `validators` too
    * => they can use it to report their status
  * or hack around to get all seeders send
    * => `i-am-online` messages


#### pallet `...`

-------------------------------------------------
# Validator
* A semi-trusted (or untrusted but well-incentivised) actor that helps maintain the network.
* In Substrate, validators broadly correspond to the authorities running the consensus system.
* In Polkadot, validators also manage other duties such as guaranteeing data availability and validating parachain candidate blocks.
* See https://wiki.parity.io/Validator-Set.html


# BLOCK PRODUCTION
Some `nodes` in a `blockchain network` are able to `produce new blocks`, a process known as `authoring`.
* Exactly which nodes may author blocks depends on which `consensus engine` you're using.
* In a centralized network, a single node might author all the blocks, whereas in a completely permissionless network, an algorithm must select the block author at each height.

-------------------------------------------------

# MyThoughts
* validators should `offerValidation`
* coldwallets should not be validators
* offline folks shouls also not be validators
  * which goes for ALL ROLES


-------------------------------------------------


#### CLIENT (=NODE?)
* treats `runtime` as black box
  * other than call into clients api directly
* **deals with:**
  * networking
  * consensus
* calls into functions with `origin`, where:
  * `origin` is often `root`
  * but can be any other `origin`

#### RUNTIME
* treats `client` as black box
* can do anything it wants it expressable in:
 * `no-std rust`
* sets the `"blocktime"`
* **provides information to `client`**
  * for consensus:
    * "who are current set of block producers?"
**deals with:**
  * logic
  * storage
  * "offchain" logic
  * "offchain" storage
* storage is incredibly expensive
* execution time is bound onchain
* can talk to the chain by sending `extrinsics` 
* each runtime function can be imagined as:
  * separate process that calls another
  * via sending extrinsics as a form of IPC
    * IPC = inter process communication
    * but currently synchronously in order
  * extrinsics called within the runtime are blocking
    * parallelizing is work in progress

#### OFFCHAIN WORKER context
* all logic which can't be guaranteed to execute within a bound time
* have access to private keys/local storage as well
* can talk to the chain by sending `extrinsics` 

#### PALLETS (other modules)
* randomness
  * collective coin flip between validators
  * requires at least one honest participant
  * logic onchain to reduce short-term influence
  * ability to chainge logic "in-flight"
* cryptographic primitives
  * hashes:
    * `Blake2b`
    * `xxhash/twox`
    * `keccak`
    * `sha1`
    * `sha2`
    * `sha3`
  * signing schemes
    * `ed25519`
    * `sr25519`
    * `ecdsa/sec256k1`

* **architecture**
  * `serialization/deserialization` of data into runtime extrinsics (=transactions)
  * `events` out of runtime and from storage
  * runtime `exports metadata` to specify for frontend libs how to connect to it
    * extrinsics formats
    * how to find storage

* default tool suite
  * accounts/origins
    * any entity who can submit extrinsics has their own `origin`
      * pubkey
      * or `random number/id`
      * or `complex permissioning logic`

1. `parse dat chunks`
2. turn each `hypercore` into an `origin`
  * that can submit `extrinsics` to `substrate`
  * for people to communicate with chain using dat instead of having access to a node
3. `root origin` and `runtime functions`
  * can `ensure_origin` for gating features
  * e.g. for debugging functions
  * e.g. for runtime upgrades


### BLOCK PRODUCTION
* all chain interactions (e.g. challenge-response) get included in blocks as extrinsics
* `Block Producers` gather `extrinsics` from `PEERS`
  * and `validate` them
* @IDEA: `VALIDATOR` (block producer) === `ATTESTER`
  * Selection as VALIDATOR means ATTESTING too
    * run challenge-response with random `SEEDER`
    * submit result extrinsics and produce block
      * kind of "last minute" extrinsics
    * => PROBLEM: per BLOCK many ATTESTERS
  * VALIDATOR produces blocks with extrinsics and
    * +ratio for `HOSTERS`
    * -ratio for `BACKERS`
    * nothing else to limit power of BLOCK PRODUCERS
  * have CHAIN reject BLOCK if anything outside scope
    * is added by VALIDATOR
    * => **let next random VALIDATORS cross check previous BLOCKS**
  * theoretically - order of extrinsic submission in blocks - does not matter
    * => because what they include seems to not ever be able to conflict with what other VALIDATORS submit
**THREAT MODEL**
* Malicious `VALIDATORS` can choose to ignore extrinsics
  * => censorship during the produced block
**QUESTION**
* do VALIDATORS on top of SEEDERS dilute guarantees to include their challenge-response in BLOCKS ?
* => probably a BALANCE 

**BLOCK PRODUCTION MECHANISMS:**
* **BABE** vs. **AURA**
  * BABE tries to make it unpredictable who will produce the next block
* **AURA:**
  * AURA is really strict about keeping system clocks in sync (not feasible in public network)
  * i always had the naive assumption that you have a mechanism to
  * select a particular peer who write the next block (single writer),
  * then signs it and everyone receives that block.... then continue...
  * but that sounds as if the vast majority of peers (given that the network grows large)
  * would probably never or only rarely produce blocks
  * **QUESTION:**
    * What's different in AURA compared to BABE?
  * **ANSWER:**
    * is explicitly `round-robin`


* **BABE:**
  * [is probabilistic in block producer selection](https://github.com/playproject-io/datdot-substrate/blob/cc79266a44161f7671d0486bcd39b4e8f23fe1ea/bin/node/runtime/src/constants.rs#L55)
    * => we can configure that number for whatever number of validators we need
  * all peers have a locally determined set of SLOTS they are meant to produce blocks for
  * globally - you resolve which BLOCK from which PEER wins which SLOT
    * with your FORK-CHOICE rule
    * other BLOCKS get recorded as UNCLES
      * **QUESTION:**
      * and why you would need to record uncles - is it to increase 
      * the likelihood that at least one block producing peer is online?
      *...but it also feels you produce uncle waste
      * **ANSWER:**
        * it's more so that you can tolerate things like:
          * clock drift and shitty network hijinks
        * Block production is random per slot per peer,
        * and peers only locally know which slots they are supposed to produce blocks in,
        * (until they reveal their randomness later)
        * (also avoids the ability to coordinate attacks,
        * but that's probably less important for us)
      * **QUESTION:**
        * how many peers make blocks per slot?
      * **ANSWER:**
        * configurable, but should be around `1`
      * **QUESTION:**
        * oh so actually it's only one peer per slot
        * and if that peer happens to be offline you skip the block?
      * **ANSWER:**
        * @TODO: ...

# PROOF OF AUTHORITY
* every block reaches `finality` immediately
* set of authority peers are all peers
* select random dictator for every non-empty block to:
  1. add all extrinsics about
    * signed register/unregister data
    * signed register/unregister seeder
    * signed attestations
    * signed merkleproofs
  2. maybe verify previous blocks extrinsics
    * remove or mark invalid extrinsics
  3. all types of extrinsics might be mixed into
    * the same block on chain

-------------------------------------------------

### EXTRINSICS (=valid transaction types)
  1. `submit_proof` => seeder sends data and we can compute the correctness of the extrinsic
  2. `submit_attestation` => submitter or "validating miner" could temper with data, but if its data about random seeders hypercore chunks, in theory or as a goal, there is no way to exploit this and thus no motivation to provide tempered incorrect data
  3. `register_data` => signed by that supporter, so we can compute if the extrinsic that should go into the block is ok
  4. `unregister_data` => signed by that supporter, so we can compute if the extrinsic that should go into the block is ok
  5. `register_seeder` => signed by that seeder, so we can compute if the extrinsic that should go into the block is ok
  6. `unregister_seeder` => signed by that seeder, so we can compute if the extrinsic that should go into the block is ok

* **PROPERTIES**
  * all of the extrinsics you mention above can enter the chain as unsigned extrinsics because they already have signed components we can validate, theoretically
  * ALSO: i can see how there is a way to design including them into the chain so
    that a block producer can't do anything malicious or would have any
    power to add or change extrinsics in the new block that would result
    in a "bad block" - thus no need for block rewards and no need for
    staking or slashing or any other logic like that.
  * => if it wasn't for substrate as a framework, i don't even see the need
    for a validator set - just pick a random peer to add and sign the next block

-------------------------------------------------

# Nominated Proof-of-Stake (NPoS)
A means of determining a `set of validators` (and thus `=authorities`) from a number of `accounts` willing to commit their stake to the proper (non-Byzantine) functioning of one or more authoring/validator nodes. This was originally proposed in the Polkadot paper and phrases a set of staked nominations as a constraint optimisation problem to eventually give a maximally staked set of validators each with a number of supporting nominators lending their stake. Slashing and rewards are done in a pro-rata manner.

-------------------------------------------------

### VALIDATOR SET
* producing blocks is as cheap as not producint blocks
* `validators` produce blocks
  * validators probably won't get any reward for that activity specifically
  * we could select random peers, but they need to register INTENT
    * => "I want to be a validator and produce blocks for the network"
* we choose as close to "everyone" as possible to be validators without sacrificing reliability
  * => any peer which is online could auto-announce it "onchain" via `im-online` pellet
  * => expires if they stop producing blocks for a given period of time
  * => expires if they stop responding im-online
* every CHANGE in the set of BLOCK PRODUCERS is an ERA
* alternative mechanisms:
  * hardcoded
  * simple membership
  * votes, phragmen, taking

-------------------------------------------------
# 1. VALIDATOR
Dynamic Validator Set Logic for bockchain block production

**DYNAMIC VALIDATOR SET**
* PALLET: `autostaking/dynamic validator set`
* all extrinsics/transactions which can be submitted are anyway easy to verify
* block producers can't include biased transactions, other than censorship (which we don't care for now)

# 0. CHAIN STORAGE
Do all `arguments` passed to `substrate api functions` increase `chain size`?
* yes, they necessarily get included in BLOCKS to sync
* state size needs explicit storage declaration
* can be theoretically be discarded/pruned on finality
* stored in data structures, it stays regardless

**STORAGE MODEL**
* `merkle-roots`
* `public-keys` =derive=> `public-address`
1. how many storage values (set amount) =>
  * => how much does the tree they build will take?
  * => ... what do we keep in block?
  * => ... blocks contain transactions
  * => ROLLUP: ... get rid of past transactions after finalization
    * => archive node might keep all the state
      * e.g. `chunks` from challenges
      * => what gets PRUNED?
    * => by default substrate gets rid from finalization
  * => ... keeps STATE

### EXTRINSIC SIGNING
**SIGNING**
1. all register/unregister seeder extrinsics need to be signed by that registered/unregistered seeder
2. all register/unregister data calls need to be signed by the registerers or unregisterers
3. submit_proof needs to be signed by that seeder who submits it
4. submit_attestation needs to be signed by the random "ATTESTER" of attestation challenges
5. if we add the ability (which we should probably) to transfer existing ratio between peers - that transaction should also be signed by at least the sender, maybe by both transacting parties

**`Signing`** prevents **`Block Producers`** from being malicious other than **`Censorship`** in the produced block

**`Random Validator`** don't have a regular incentive to censor + no datdot related extrinsics are time critical and can wait for multiple blocks to be included
* => no need for mining or staking to prevent with abuse
* => anyone can be validator
* **BUT** `challenge-responses extrinsics` are time critical extrinsics (can they come in a 1-2 blocks late?)
  * => they're "due" at some future block
  * likelyness of same validator for N consecutive blocks?
  * => that are produced by malicious block pages
  * => block producers could punish a seeder who has actually acted entirely honestly
  * `challenge-response`
  * `submit_proof`

* Is there a way to automatically check blocks according to certain rules
  * => and if they don't pass, the block is rejected?
    * ==> this is what happens normally during sync :/ you check if a block is valid or not
    * => how does that block check work?
      * ==> you execute the block, if it executes successfully it is valid,
      *     if it does not it is invalid.
      *     since we control the logic and all functions in the chain,
      *     we can add all kinds of logic to the block itself (on_initialize, on_finalize)
      *     to create extra validation
        * => can we add logic that checks based on the block producer?
        * ==> it's possible, but what kind of logic?
          * => XXXX
* Is it possible to add information (e.g. random seeder or hypercore addresses)
  * => to what tells or selects block producers?

### BLOCK TIME
* could each block only contain a single submit_proof?
  * => no that would be a problem because we have parallel challenges
  * ==> makes sense

### COSTS OF BLOCK PRODUCTION
**in theory**
1. updtime (=staying online)
2. bandwidth
3. not computation (because no PoW)

### BLOCK SIZE
* every block will potentially have multiple `2kb` chunks in them


### VALIDATOR MOTIVES & EXTRINSICS
0. Producing blocks is the same cheap as not producing blocks, so there is no work that justifies rewards.
1. Many `submit_proof` in parallel means many per block.
No small reward can prevent malicious off chain incentives
(e.g. target specific seeders VS. backer doesn't wanna pay)
2. Validators deciding about their own extrinsics is very rare and it would only censor for one block duration, which does not justify paying them
3. If a block producer drops offline or skips work, extrinsics stay around for the next random block producer to pick up

**BLOCK PRODUCTION:** (by VALIDATORS)
* VALIDATOR is tasked with adding the next set of `transactions` to the block chain
* which is then copied to all other PEERS
  * kind of as if the peer who writes the next `chunk` to a `hypercore` is `randomly selected`
    * for each chunk
    * but of course - that PEER is supposed to honestly add the correct data to the chain
    * if a PEER doesn't do that, the next "RANDOM PEER" can add their chunk to the ancestor and ignore the previous malicious chunk
  * FORK-CHOICE-RULE: to figure out how to add their block to one of the available HEADS to create the "longest chain"
  * => you can only:
    * either IGNORE a bad block
    * or punish people for equivocation
      * => that's why STAKING is a thing
    * other kinds of misbehavior are NON-TRIVIAL to prove cryptographically

-------------------------------------------------

ALEX
so, then we don't really have to worry about block producers.
1. they probably wont ever or only rarely decide about extrinsics they are personally related to, so thats why they are indifferent
2. its also little work to produce a block (so they would unlikely bail out because they dont get rewarded)

In the end, datdot peers come for being seeders or seed their data and are interested in the network to work, so why would they not produce blocks when randomly selected ... even if a few maniacs bail out - it doesn't hurt the network
like - submit_proof or any other extrinsics might get delayed one or a few blocks, but that's not a problem i assume
does that make sense?

JAM
right, but if the validatorSet is entirely permissionless, and as long as there is some cost to it, unless it's mandatory only malicious or altruistic users will choose to participate

ALEX:
@jam10o it is "mandatory", but of course,
somebody could run a modified client and opt out of it
- but i assume the vast majority of users would not opt out
and if a few do, it doesn't matter. On the other hand, we could
reward every randomly selected block producer with an amount
of ratio that is extremely small, but not zero.

All we need is that people do it, but it's not a lot of work and
there is no risk involved of somebody being a bad actor,
because other than censorship (not doing the work) there seems
to be nothing that they could do - and because it's random,
there is not even a motivation to do censorship.

does that make sense?
furthermore:
1. every datdot user wants the network to work, because not using datdot is less work than running datdot and bailing out if block production
2. human time is valuable and the effort to download and run a modified datdot node to avoid block production costs - you tell me the hourly rate in countries like bangladesh :-) ...the amount of block production you have to avoid in order to regain the loss by spending effort is huge - you might not recover that in a lifetime? :blush:
3. most people you randomly interview in this world are maybe selfish to some degree, but usually not to that degree (which according to (2.) is basically irrational
4. ...but because early adopters might consist (not from the dat side, but from the crypto side) of an unusual high amount of people with a reasoning defect (e.g. they fall into above mentioned category (2.)) ...we still might consider paying an extremely small amount of ratio, just to take their irrational reason away?

...otherwise - following which reasoning would you think that people would want to avoid producing blocks if it is not rewarded? ...or what kind of malicious block production do you see with what frequency?

...maybe my reasoning is flawed (i'm just a human with little experience in this stuff :D)

JAM:
I'm probably only being paranoid;
my PoV is any and all cryptoeconomic vulnerability that is present
and can be exploited, will be exploited, even if there isn't a rational
reason to do so, but it might be the case that this is because
I work at an unpopular company :yum:

ALEX:
----
Basically two questions - given the network grows to a reasonable size of users and beyond
1. on average - how often would an individual peer be selected for block production?
2. how compute/bandwith/data/... intensive is it on average to produce a block? (i have the data from all major cloud providers to dervie a price) ... so we can compare it to the labor it costs them to set themselves up to be able to be malicous in the first place ...especially because they can't gain ratio, they can only avoid paying with resources by skipping block production
haha - no i totally get it
i just think - a vulnerability has to be evaluated in the context of economic costs and opportunities to save or gain...
there is no way to gain, but only an opportunity to avoid costs - but only if you first invest to be able to do so
the possible savings seem to be extremely small, but even if it takes you only a fraction of an hour to set yourself up - that might be more expensive than a life time of savings you could achive

JAM:
1) frequency should be roughly blocktime*number of block producers

ALEX:
i'd like to calculate it and then write our reasoning down for everyone to read it and give us feedback

JAM:
2) bandwidth and CPU cost shouldn't be different between block production and normal sync


ALEX:
whats a reasonable block time? is it miliseconds? a few seconds? many seconds? a minute? i have no clue


JAM
6 seconds?

ALEX:
ok
and its always one block per 6 seconds in the entire network?

JAM:
that's the target, not a guarantee, but yes

ALEX:
wait - are you saying the cpu/data/bandwidth/etc... is no different between producing a block and not producing one at all?

JAM:
right, because even if you aren't producing blocks yourself you're executing blocks coming in from the network

ALEX:
but then you can't save anything by skipping block production
but you can also not gain
so why would somebody invest effort of opting out?

JAM:
you can't produce blocks as a light client?
and storage/memory is different
to be safe
in practice it isn't actually

ALEX:
but you would not decide to run a light client or full node to avoid producing blocks and only if we have to few people running a datdot client on desktop (and for now we ONLY have full clients anyway) - then we would need an incentive to motivate people to run more datdot nodes

JAM:
the thing you need as a block producer is reliability, not increased resources

ALEX:
so if producing blocks is cost wise not different from not producing blocks, then no re-imbursement is necessary.
it's irrational to run datdot to use the network and then opt out of block production, because you can't save anything, but you hurt the network and therefor the service you want to use even though doing the block production doesn't cost you anything
so you can't even free ride
you can only hurt the service which makes it a bit worse... for yourself :D
wtf?!?

JAM:
no, for everyone else. you need to stay online at least through a session

ALEX:
including yourself

JAM:
if you disappear as a block producer, you make blocktime more erratic.
but yes
including yourself

ALEX:
yes
so nobody would do that, it costs them
they have to spend time to run the datdot client
and then they opt out in order to make it worse for themselves and everyone else
the network wont feel it if its just a few
but the "attacker" feels it, because their effort was significant compared to the one skipped block for everyone else
only a group of people who want to attack the network and spend a lot of effort to make the service bad ...might be interested in that, but if BABE allows to increase the amount of selected block producers for any given block (you said that), then it can be countered - if such an attack ever occurs
and that might still be cheaper and more fair then rewarding block producers for the service that essentially costs them nothing anyway
also the bigger the network the more attackers necessary to get randomly selected often enough to make the slowdown noticeable. ..and such an attack cannot be prevented by paying ratio to block producers
the reward can't be high enough to kill that kind of malicious motivation i think

ALEX:
That's the worst case - if a group of wealthy attackers invest a lot of resources to maintain enough modified datdot nodes to opt out of block production to cause the quality of service to collapse for the time of the attack.
If that happens, increasing the amount of block producers for every block (which produces uncles?) in BABE seems to be a defense mechanism to some degree and/or hoping for network participants to run more honest datdot nodes to defend the network for the sake of keeping the service working, but it's a worst case scenario that needs to be dealt with once it occurs.

What do you think?
If that kind of worst-case scenario attack ever happens, we have many more problems
maybe we should just write, that this is our kind of "51% attack" that breaks the system in a relatively predictable manner?

JAM:
right, exactly, it's a 51% attack, except here "51% of what?" can literally be different keys on a single computer and if anyone can enter the block producer set then anyone can take over the network.

when it's at small numbers it's just unreliability, but once we're talking about 51% you get into a scenario where you need manual forking to recover.
and if there's no cost for being a validator, there's no cost to take down the network.

If there's a cost but no reward, why do it?

ALEX:
there is a cost to take down the network. you have to run nodes
so yes - why do it?
i can only see governments who or "competitors" who want to make the service unusable, but they have to spend significant amounts of resources anyway and nobodies hypercores will go away, so a fork or using datdot with friends only will continue to work
so the "51% attack" will not be able to kill the "friend usage"
it just kills the public service network
or whatever it should be called
for the duration of the attack

JAM:
> JAM
> I'm probably only being paranoid; my PoV is any and all cryptoeconomic vulnerability that is present and can be exploited, will
I think if it can be done, it will be done.
at the very least we don't want people's communities to be trivially ddosable by anyone on the internet
my naive solution was, people who have the existing incentives for network reliability (seeders, pinners) should define the bounds of who produces blocks on the network.

ALEX:
yeah probably
can we make it everyone for datdot?
without forcing others to do the same?

JAM:
so if you are not a seeder or a pinner, you have no reason to be interacting with the network and shouldn't be able to volunteer to produce blocks
yes ofc

ALEX:
why would you run a datdot node if you are not a pinner or seeder?

JAM:
you're just a random internet jerk or filecoin supremacist idk
or maybe you want to take down a specific community

ALEX:
if i am - and want to do it for the lulz, then i can click a button to become a seeder or supporter (=pinner?) and do my attack then
the problem i see with making the group of block producers more exclusive - to the degree where they know each other - is another kind of attack
a whitelist/blacklist attack, where they coordinate to keep people out selectively ...maybe that's something we want?
how would you decide if peers should belong to the validator set?


JAM:
that's what we can brainstorm, but the fact that the validator set can't be unbounded doesn't change.

what about "if you are consistently online for x period of time, then you can start producing blocks"
if what you need from block producers is reliability, they can join the set by being reliable

ALEX:
one question - if producing a block doesn't cost anything, then could we use BABE to make everyone in the network produce blocks every 6 seconds and we select one of those blocks at random and try the next if the selected one happens to be either invalid or the block producer disconnected?
then starting a datdot node and running it for the first few miliseconds would immediately add that peer to the validator set
would that be problematic?

JAM:
then you start running into serious bandwidth issues if you have large networks, but it should be a plausible scenario for smaller networks

ALEX:
why bandwidth? blocks are produced locally
doesnt it select a random block?
and only tries another if the selected one doesnt work?
and that selected one is then propagated through the network as usual

JAM:
"make everyone in the network produce blocks every 6 seconds"
all of them would be valid

ALEX:
so are you saying producing blocks is not free as in it costs the same regarding cpu/data/bandwith/etc... as not producing a block?


JAM:
right

ALEX:
you select only one block at random

JAM:
but you need to have the blocks to select between them

ALEX:
its just backup in case the one who was responsible this time disconnects

JAM:
that already happens

ALEX:
oh alright - so opting out of block production can not censor or slow down the network

JAM => BABE
https://polkadot.network/polkadot-consensus-part-3-babe/amp/?__twitter_impression=true

you still need time to decide whether you want to go with the backup block though
(or rather, the decision happens later)
ie, if the expected primary shows up over the network later


ALEX:
is there an algorithm to optimize the rule of when a node can join the validator set to make it most reliable, but as open as possible to make it has hard as possible for all validators to collude?

JAM:
that's a research area, not something people have an algorithm for :p

ALEX:
how long does it take to produce a block?

JAM:
depends on what is happening in the block
if I do something stupid and put an unbound loop in a block, forever. :p
if there are no extrinsics, nanoseconds
well not in our chain, but maybe a chain with minimal logic
we do quite a bit of stuff even if there's no extrinsics

ALEX:
does substrate keep track of online/offline status of nodes?
can it happen that somebody gets assigned to produce a block even though they go offline?

JAM:
no, that's the job of the im-online module.
and yes

ALEX:
so could we add somebody to the validator set as soon as the im-online module says they are online and remove them from the set as soon as they go offline?

JAM:
yes

ALEX:
is there a potential downside to that?
when somebody is selected for a slot in the future? how far in advance is that decided?

JAM:
we need to determine the epoch length
but we decide that

ALEX:
epoch is a grandpa thing?

JAM:
no a babe thing

JAM:
we're just using substrate defaults

ALEX:
i just read the link you sent me and it said BABE only has probabilistic finality
and is epoch 6 seconds?

JAM:
no, that's a slot :p
grandpa is the finality gadget

ALEX:
ok, the article doesnt say how long an epoch should be nor what are the tradeoffs?
what about epoch = 1 slot

JAM:
I would say that the bigger an epoch is, the more efficient light sync can be
in terms of slots
but I don't have the answer here

ALEX:
so that's also research topic?

JAM:
It's my understanding that the current defaults are the outcome of research
but yes

ALEX:
i assume its connected to the quality of randomness and whats necessary to make it secure enough.

otherwise - what's the default epoch?
and is the only thing that changes in an epoch the new randomness?

JAM:
right. default 600 slots/blocks per epoch

ALEX: => SUMMARIZE

So if i try to summarize:

1. a malicious attacker can run lots of modified datdot nodes to censor the network and in case of "critical mass" render not the friend mechanism but the public network mechanism unuseable - but in that case they can also "print" themselves ratio ...it's the worst case scenario, but it costs a lot of resources too
2. rewarding block producers with ratio will not prevent (1.)
3. block production is free of costs
4. epoch length and rule to join "validator set" is necessary and probably choosing a good rule can make the network marginally more reliable, but i even wonder if that is important - skipping blocks from time to time is probably not even really noticeable, but ok :-) ...lets try to make things nice
5. other than the attack (1.), an attacker can't benefit from opting out of block production or producing invalid blocks - and often a "fallback" might even prevent the skipped block - and even if a block is skipped, then it just takes 6 more seconds to include extrinsics in the next block. ...so a minor delay
finality helps us to keep the chain short, because we can discard data, right?


JAM:
right

ALEX:

so we might wanna add that too and balance between:
1. chain length (needed data storage)
2. cost of syncing with all validators to reach finality

...is there already a good default or an optimum that adapts to the amount of validators?
and whats the default mechanism to add somebody to the validator set? ...like for people who kind of don't care, because in my current opinion, block producers dont have costs and cant abuse the mechanism to gain in any way directly from that act and even indirect gains are extremely difficult or maybe impossible to achieve. ...so why not:
1. chose something as liberal as possible
2. to optimize for "reliability"
3. and not reward block producers for producing blocks
4. and not require any staking or punishment either

...and lets see if that works :-)


JAM:
I'll come up with a few ways to accomplish those goals and get back to you and we can talk about what we'll use in our default node
the default way is either via staking, or a hardcoded list
but I'm assuming we want a dynamic set that doesn't require staking because we aren't doing rewards

ALEX:
yes - and the dynamic set would probably have the goal to have the system as "stable/reliable" as possible in absence of any other goals i guess... but if there is no research yet, then we can just go with an easy mechanism, like adding any peer as soon as they come online and removing them once they go offline ...and if we figure out adding/removing creates overhead, maybe we can slightly optimize our simple best guess

JAM:
agree

ALEX:
lovely

