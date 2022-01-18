# ECONOMICS

# GOALS:
* "The largest difference with most existing solutions in the space is that we don't intend to build a monolithic chain, but rather provide this as a tool for individual communities and substrate chains to build their own "storage communities"
* MAYBE REPLACE: `"distributed file storage"` WITH: `"would enable access to large file storage on substrate"`

# OPTIMISTIC ASSUMPTIONS
if users love the service and we make sharing free disk space opt-out,
there might be enough disk space available
also everyone starts earning "ratio"
maybe we should have a seperate brainstorming sessions about
* no, i mean, what you say makes sense :-)
  * i'm curious how all of this will turn out and if the opt-out behavior
  * of the app will help to make things work well
  * (hopefully ppl earn enough ratio automatically so it always works.

# DASHBOARD
the UX of the electron app and
how exactly users can influence settings and
how the dashboard will show them information so they can adjust
...or basically understand whats happening on the marketplace
and how ratio is behaving, etc...

# MODE: HOSTER (=commercial)
...

# MODE: SEEDER (=friends)
...

# MODE: COMMUNAL
1. like, as a network grows "free use" becomes more and more unreliable,
2. and "reliable use" becomes more and more expensive (or time/resource heavy)
3. and maybe interconnectivity, and discovery of those connections,
4. would help solve that - by letting seeders discover where their space would
5. give them the most value
6. seeders - where spacetime would give most value
7. pinnerd/users - lower barrier to entry, which instance would give the
8. most reliability where they care


# VOTING/PRICING
there is one "voting" slide with open questions about economics and pricing
about options/choices of users regarding "ratio" (or whatever we call the token)
* things can become collude-y/monopolyish if answered wrongly
  * because all new users will have the lowest possible ratio,
  * and if that isn't the case we have a sybil problem again
* connections between datdot instances could be a solution for this? 🤔 voluntary connections?


# FREE EXTRINSICS
if submitting extrinsics costs nothing
and we can anyway check for the validity of extrinsics,
then all that could happen is that somebody spams
the chain with those but we ignore them
...still they could register as seeder and then unregister as seeder,
thats valid and they could spam the network with those
kind of transactions - which they can't if transactions
cost.

































# economics
**[main](./README.md)**


### tokens
- minted if you are seeding (earning)
- it burns incentivisors ratio when their data is pinned (payment)
 => not only authors, but any peer who "stakes" their "ratio" on a specific seeded hypercore can burns their ratio, while the seeder get +ratio minted

### price/economic part
- when you submit the dat you also decide how much you're willing to pay
 (=burn) in terms of ratio...
- priority: who pays more? who has more tokens (coz they are good pinners)?


## `ratio` unit
1. We will use the `balances` (SRML) module to:
    * create a simple "credit based" system
    * by pinning random hypercores you mint ratio for yourself, by having your archive pinned, you burn ratio
    * when you submit a hypercore you also set the price you're willing to pay for the service
 regarding your ratio, unless we find a way to calculate that price automatically
    * priority service: users who pin more have priority to get their data pinned first, but even users with no ratio get pinned, but just less often

**addendum:**
* the pinned data is pinned forever, unless there are not enough pinners to provide disk space, then eventually the peers with higher ratios get prioritised
* ...

### [voting/economics](#/3)
<!-- economics/pricing -->
peers with a worse ratio getting worse guarantees about having their hypercores seeded by the datdot network

1. how much do i want to earn in terms of "ratio"?
    * for my disk space?
    * for encrypting hypercore chunks?
    * for validating chunks?
    * for receiving data?
3. how much do i offer to pay in terms of "ratio"?
    * for having my hypercores pinned?
<!--     * when you submit a hypercore you also set the price you're willing to pay for the service regarding your ratio, unless we find a way to calculate that price automatically-->























# [mechanics](#/0)
* [reputation unit](#/3/2)
* [model](#/3/3)
* [proof of seeding](#/3/4)
* [voting](#/3/4)

----

### [TODOs: reputation units](#/3)
**`@TODO:`** decide the name of reputation units
* [**`names`**](#/3/3): select name
* [**`icon`**](#/3/3): select icon

----

### [reputation unit](#/3)
possible names for ratio
* [**`datdots`**](#) => burn datdots to have hypercores pinned
* [**`ratio`**](#) => burn good ratio to have hypercores seeded
* [**`pins`**](#) => burn pins to have hypercores pinned
* [**`seeds`**](#) => use up seeds to have hypercores seeded

negative reputation does not exist

----

### [model](#/3)

1. all peers have 0 or more reputation
2. all submitted/selected hypercores get seeded forver if possible
3. if seeders can not provide enough disk space to seed hypercores
    * existing hypercores submitted/selected by peers with lower ratio get prioritized when dropping duplicates or making them entirely unavailable
    * prioritizing means the random selection of a peer gets weighted so the likelihood of selecting a particular peer is higher

----

### [proof of seeding](#/3)
1. [`validators`](#/2/7) request random chunks from assigned seeder
2. signs and publishes results of merkle proof to network
3. joins swarm for unencrypted version of seeded hypercore
4. requests random set of chunks from seeder
5. publish latency/throughput results to network

----

### [voting](#/3)
<!-- economics/pricing -->
peers with a worse ratio getting worse guarantees about having their hypercores seeded by the datdot network

1. how much do i want to earn in terms of "ratio"?
    * for my disk space?
    * for encrypting hypercore chunks?
    * for validating chunks?
    * for receiving data?
3. how much do i offer to pay in terms of "ratio"?
    * for having my hypercores pinned?
<!--     * when you submit a hypercore you also set the price you're willing to pay for the service regarding your ratio, unless we find a way to calculate that price automatically-->



```js
/* PRICE/payments

JOBS:

1. hosting_setup_attesting
- resources per block (2 ratios per block)
  - bandwidth
  - cpu
  - storage
  - RAM
- average duration in blocks: 7 => price: 14 ratios

2. hosting_setup_encoding
- resources per block (2.5 ratios per block)
  - bandwidth
  - cpu
  - storage
  - RAM
- average duration in blocks: 5 => price: 12.5 ratios

3. hosting_setup_hosting
- resources per block (17 ratios per block)
  - bandwidth
  - cpu
  - storage
  - RAM
- price: 17 ratios per block

4. storage_verification_attesting
- resources per block
  - bandwidth
  - cpu
  - storage
  - RAM

5. perf_benchmark_attesting
- resources per block
  - bandwidth
  - cpu
  - storage
  - RAM

*/
```