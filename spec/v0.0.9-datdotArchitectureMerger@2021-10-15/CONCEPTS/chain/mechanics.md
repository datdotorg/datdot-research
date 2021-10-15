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

