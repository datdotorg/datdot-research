# CONCEPT






# `playproject-io/datdot-research`


## intro

Filecoin is an incentivisation layer for IPFS
It can replace things like CDNs and file hosting services
Has a stronger focus on reliability and industrial use cases
Filecoin is a single network and coin

Datot is an incentivisation layer for DAT
It can replace things like CDNs and file hosting services
It can replace *general* web hosting services too
It can be used for livestreams
Has a stronger focus on community and social use cases
DatDot is a library to create any number of networks with their own coins which can communicate with each other


## design principles
1. do as little as possible on chain
2. do as much as possible off chain
3. the long term goal is to remove the chain
  * if ever possible


## SUMMARY
1. `publisher` selects `dat address` they want to see `hosted`
2. `seeders` (friends or folks interested in the data) volunteer to provide disk space to store and seed the data for free
3. `hosters` want public recognition and provide disk space to store and seed the data to have it publicly accounted on chain
4. `backers` who accumulated ratio on chain and want to see `dat addresses` being `hosted` get prioritized
  * in case not enough `seeders` and `hosters` are available to `seed` all selected `dat addresses`

**the `keeping track` part works as follows:**

1. each time a hypercore is submitted for pinning, the network of all peers makes a collective coin flip to chose a random "peer" of those who registered their willingnesst to offer hosting with their disk space for the role of "hoster"
2. another random peer is selected for the role of "encoder"
3. the encoder receives the hypercore that will be pinned and encodes it and submits the merkleroot to the chain and passes the encoded hypercore on to the hoster
4. the hoster stores it and makes it available to the regular dat network and also submits the merkleroot to the chain
5 the chain checks random hoster and random encoder submitted the same merkle root and starts the challenge phase it thats true.
4. in the challenge phase, the chain will continuously emit challenge events for a proof-of-supply or proof-of-service
5. it consists of the proof-of-data-possession, where the challenge event from the chain ask for a random chunk the hoster is storing and the hoster has to submit the encoded chunk with a merkle proof to the chain so the chain compares it to the merkle root it has
6. it consists of the proof-of-retrievability, where the challenge event selects X random peers as ATTESTERS to join the dat swarm of that same hosters hypercore and ask for a bunch of chunks and report back to the chain if they received those
7. if both, the proof-of-data-possession and the proof-of-retrievability succeed, the proof-of-service is successful and the ratio is noted on chain

## ROLES - assignment of ROLES needs to have a PEERS SET to select from
NODES come and go, so having role assignment per SESSION (=time window) or a ROLLING algorithm is important

### SUBSTRATE NODE
1. CHAIN      - (=rules) (=for `Proof of Data Possession` **PoDP**) to verify storage

### DATDOT NODE
0. ACCOUNT    - (= `Actor` or `Identity`)
1. HOSTER     - (=stores hypercores) is `PINNER`
2. PUBLISHER
3. BACKER     - (=is BACKING THE DATA) is `SUPPORTER`
4. SEEDER     - (=friends) is `PINNER` and `SUPPORTER`
5. ENCODER
6. ATTESTER   - (=for `Proof of Retrievability` **PoR**) to verify hosting
7. VALIDATOR  - (=chosen from to produce blocks) Authorities are the actors, keys or identities who, as a collective, manage consensus on the network. AuthorityId can be used to identify them
8. PRODUCER   - (= `Block Author` or `Block Producer`)


### DAT PEER
1. AUTHOR (=owner/creater of hypercores)
2. READER
3. SWARMER

## ARCHITECTURE
see [here](https://gist.github.com/substack/e037d1d2015b7a3e0001fc4bdd463b9c)
```js
const architecture = `

[7. substrate chain daemon]
            🠙
            ↑
            │
            ↓
            🠛
┌────> [5. chain api] <───> [other chain implementations*]
│
│      [4. seeding api] <───> [kappa-core]
│           ↑
│           🠙
│           │
│           │
├───────────┼───> [3. localhost https/wss server] <─────┐
│           │                                           ↓
│           │                                           🠛
│           │                                 [6. web user interface]
│           │                                           🠙   🠙
│           │                                           ↑   ↑
│           │     [2. datdot electron app] <────────────┘   │
│           │                                               │
│           │     [web browser] <───────────────────────────┘
│           │
└───────────┴───> [1. datdot command-line interface]`

// (*) possible future implementation


// chain_api.makeAccount('ALICE', ACCOUNT => {
//   chain_api.register_seeder(ACCOUNT)
//   chain_api.listen('seeder', DATA => {
//     const core = seeding_api.seed(DATA)
//     chain_api.listen('challenge', info, event => {
//       core.getChunkAndMerkleData(info, DATA => {
//         chain_api.submit(DATA)
//       })
//     })
//   })
// })
```

## REPOS
0. `/datdot`
1. `/datdot-substrate`
  * => `datdot-node`
  * => `datdot-chain`
  * => `datdot-runtime`
  * [API](https://github.com/playproject-io/datdot-substrate/blob/master/bin/node/runtime/src/dat_verify.rs)
2. `/datdot-pallet-verify`
3. `datdot-pallet-balance`
4. `/datdot-service`
  * [API](https://github.com/playproject-io/datdot-service/blob/master/index.js)
5. `/datdot-vault`
6. `datdot-electron`
7. `datdot-daemon`
8. `/datdot-research`









-------------------------------------------


# context
**[main](./README.md)**

## [idea](#/1)
**make a free p2p alternative to [hashbase.io](https://hashbase.io)**
* everyone who downloads and runs **`datdot`** offers some free disk space which is used to permanently seed hypercores datdot users submit to the `datdot` network

----

## [problem](#/1)
all it takes is a single "malicious" user, who submits enormous amounts of and/or very large hypercores to the `datdot` network to be pinned, rendering the service useless for all other honest peers.

----

## [solution](#/1)
Measure the ratio of disk space provided to dat dot over time.
If free disk space provided by all peers is not enough to seed all hypercores submitted bypeers, hypercores submitted or selected by peers with a higher ratios get prioritized.

----

## [issues](#/1)
malicious users can still cheat the `datdot` network
1. by applying a [`self service attack`](#/1/6)
2. by applying a [`sybil attack`](#/1/7)
3. or by applying an [`outsourcing attack`](#/1/8)

----

## issue [`self service attack`](#/1)
a malicious datdot user could illegitimately increase his ratio, by submitting a lot of hypercores to the datdot network and offering to seed them - essentially not providing any service to others, but increasing his ratio in order to free ride and receive service by others later on.

----

## issue [`sybil attack`](#/1)
a malicious datdot user runs many datdot clients to offer disk space for seeding hypercores with the goal to seed their own hypercores or seed the same hypercores many times, but store them only once but respond to chunk requests with data from only a single hypercore copy, thus receiving an illegitimate positive ratio

----

## issue [`outsourcing attack`](#/1)
a malicious datdot user runs only a single datdot client to offer disk space for seeding hypercores with the goal to join the corresponding hypercore swarm and receive chunks quickly just in time to respond to chunk requests from hypercore swarm peers and not storing any hypercore chunks themselves, thus receiving an illegitimate positive ratio

----

## [fixes](#/1)
malicious users can still cheat the `datdot` network
1. by applying a [`self service attack`](#/1/10)
1. by applying a [`sybil attack`](#/1/11)
2. or by applying an [`outsourcing attack`](#/1/11)

----

## fix [`self service attack`](#/1)
Assign hypercores submitted to `datdot` for seeding to random seeder peers, so peers who want to seed cannot cherry pick the chunks they want to seed.
In order to prevent malicious user to accumulate node pairs they control where the randomly picked seeder happened to be under their control too, re-enabeling the self-service attack, we frequently enough re-shuffle which nodes seeds which data.

----

## fix [`sybil & outsourcing attack`](#/1)
every copy of every chunk of every hypercore seeded by the `datdot` network should be encrypted with a private key unavailable to the seeder, so they can't use the `sybil` or `outsourcing` attack, thus replacing each chunk with **a recoverable signature containing the entire chunk** and merkelizing it. The random encryption is renewed frequently enough to prevent attackers from accumulating nodes where they by chance where chosen to provide the encryption key.
