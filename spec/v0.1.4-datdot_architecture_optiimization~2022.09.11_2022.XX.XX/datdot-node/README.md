
## CONCEPT

## ROLES - assignment of ROLES needs to have a PEERS SET to select from
NODES come and go, so having role assignment per SESSION (=time window) or a ROLLING algorithm is important

### SUBSTRATE NODE
1. CHAIN      - (=rules) (=for `Proof of Data Possession` **PoDP**) to verify storage

### DATDOT NODE
0. PEER       - (= `Account`, `Actor` or `Identity`)
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

## SUMMARY
1. `publisher` selects `dat address` they want to see `hosted`
2. `seeders` (friends or folks interested in the data) volunteer to provide disk space to store and seed the data for free
3. `hosters` want public recognition and provide disk space to store and seed the data to have that service publicly accounted on chain
4. `backers` who accumulated ratio on chain and want to see `dat addresses` being `hosted` burn it to get the data prioritized for hosting
  * in case not enough `seeders` and `hosters` are available to `seed` all selected `dat addresses`

**the `keeping track` part works as follows:**

1. each time a hypercore is submitted for pinning, the network of all peers makes a collective coin flip to chose a random "peer" of those who registered their willingness to offer hosting with their disk space for the role of "hoster"
2. another random peer is selected for the role of "encoder"
3. the encoder receives the hypercore that will be pinned and encodes it and submits the merkleroot to the chain and passes the encoded hypercore on to the hoster
4. the hoster stores it and makes it available to the regular dat network and also submits the merkleroot to the chain
5 the chain checks random hoster and random encoder submitted the same merkle root and starts the challenge phase it thats true.
4. in the challenge phase, the chain will continuously emit challenge events for a proof-of-supply or proof-of-service
5. it consists of the **proof-of-data-possession**, where the challenge event from the chain ask for a random chunk the hoster is storing and the hoster has to submit the encoded chunk with a merkle proof to the chain so the chain compares it to the merkle root it has
6. it consists of the **proof-of-retrievability**, where the challenge event selects X random peers as ATTESTERS to join the dat swarm of that same hosters hypercore and ask for a bunch of chunks and report back to the chain if they received those
7. if both, the proof-of-data-possession and the proof-of-retrievability succeed, the **proof-of-service** is successful and the ratio is noted on chain



















# `playproject-io/datdot-???`
* or `datdot-chain`
* or `datdot-node`
* or `datdot-runtime`

#### MODULE: `chain_api`
* **chain api** JS Modules to talk to "SUBSTRATE STUFF"
  * https://polkadot.js.org/api/
  * https://polkadot.js.org/api/start
  * https://polkadot.js.org/api/start/create.html
  * https://polkadot.js.org/api/start/types.extend.html#extension
  * https://polkadot.js.org/api/start/types.extend.html
* GOAL: make API in RUST and JS the same!
  * instead of "camelCase vs. snake_case" maybe ONE WORD?
* API:
  ```js
  const chain_api = require('datdot/chain-api')
  // module.exports = {
  //   getHosters, getStorage, registerData, registerSeeder, makeAccount, listenHeads, ...
  // }
  ```
  * api.tx.balances.transfer(...)
  * api.tx.dat_verify.register_backup(...)
  ```js
  feed.ready(() => { // manage a TX that got finalized
    archive.push(feed.key.toString('hex'))
    // archive[0] = ed25519::Public
    feed.signature((err, res) => archive.push(res.signature.toString('hex')))
    // archive[1] = ed25519::Signature
    feed.rootHashes(0, (err, res) => archive.push({ hashType: 2, children: [res[0].hash] }))
    // archive[2] = { hash_type: /*2*/ u8, children: Vec<ParentHashInRoot> }
  })
  const keyring = new Keyring({ type: 'sr25519' })
  const ALICE = keyring.addFromUri('//Alice')
  console.log(archive)
  const registerData = api.tx.datVerify.registerData(archive)
    .signAndSend(ALICE, ({ events = [], status }) => {
      console.log(`Current status is ${status.type}`)
      if (status.isFinalized) {
        console.log(`Transaction included at blockHash ${status.asFinalized}`);
        events.forEach(({ phase, event: { data, method, section } }) => {
          console.log(`\t' ${phase}: ${section}.${method}:: ${data}`);
        })
        unsub()
      }
    })
  ```



## CHANGELOG

##############
DECEMBER 12th 2019

rename: `adapter.js` to `service.js`


##################
DECEMBER 26th

GITHUB ISSUE DISCUSSION of JOSHUA

SUMMARY
tl;dr the goal of datdot is to create a decentralized pinning service for [dat](https://datprotocol.com/),
akin to [hashbase](https://hashbase.io/) (which is hosted centrally by a single person), but with backend logic and reliability checking handled by substrate.

This repo will (eventually) just hold a pallet or set of pallets that will let runtime devs integrate dat and dat pinning in their runtime (think "run your own filecoin") and a runtime and node implementation using the pallets.


QUESTION:
Where can we learn more about:
1. Timeline:
    * when is an early version of this meant to be ready?
2. Incentives:
    * What is paid for? only storage? only bandwidth? both?
    * Who pays for what? down
    * What scheme is used for ensuring honest service?
    * How is quality of service regulated, such as up/down speed, latency, etc.
3. How is this model compared to existing decentralised storage network services? such as
    * Storj
    * Airweave
    * Sia
    * Filecoin

ANSWER:

will ping here when we have this stuff written down in a more coherent format, but currently the details are spread across a series of hackmds and recorded videocalls which aren't publicly available atm.

I'm going to dump an outline here though:

1) We plan to have an early prototype early-to-mid January.
2) You get paid for successful challenge-responses, where challenges are of random duration (to prevent seeders going online exclusively to respond to challenges), of a random chunk of a dat archive (to prevent only storing data of chunks that you know will be challenged).

Challenges are made for the content of a "parallel" archive (merkle tree where the chunks of the archive are signed versions of the chunks of the actual dat archive), and augmented by attestations of service quality made by randomly selected offchain peers (to ensure that seeders are actually participating in the Dat network, not just the challenge-response game) - these attestations contain optional latency and location data (up to the attester) and we plan to display this information in our UI so that users have a better idea of QoS they are receiving.

We also intend to allow users to designate "non-voting" attestors so they can fine-tune what information the chain collects for them - these attestors will be directly rewarded by the user requesting their attestation and not by minting new tokens.

Incentives are provided by minting tokens on successful challenge-response, and optionally users burning tokens per challenge in order to prioritize their archives being assigned to seeders. It is more akin to a ratio (think bittorrent seed/leech ratios) than a mined/staked cryptocurrency.

3) The largest difference with most existing solutions in the space is that we don't intend to build a monolithic chain, but rather provide this as a tool for individual communities and substrate chains to build their own "storage communities". We also inherit the properties of the Dat protocol (high performance *dynamic* datasets, in contrast to static content on ipfs if you don't use ipns, which is unreliable due to it relying on changes to propagate over a DHT). Same goes for Sia, Arweave, and Storj.

[While hypercores are append-only logs, dat archives (built on top of hypercores) are intentionally *not* immutable, they are public-key addressed, not content-addressed. Which is a key difference with all of the solutions you've mentioned.]


Datdot is essentially a community building and management tool for existing users of the Dat network first and foremost, and we hope by making the network more useful by making it easier to persist data, more people become involved in the community and build things on Dat.

----------------------
ANSWER BACK TO: https://github.com/playproject-io/datdot-substrate/issues/12


##################
JANUARY 9th:

The chain decides that based on our optimizations,
but for now i'd say let's use 1,
which means you need to listen to the chain event
and figure out if the chosen random encoder is you
(the pool is all seeders), and if that's the case
take the hypercore address that comes with the event
and encode it and send it to the seeders address.
The process of encoding and starting to seed is
independent of the attestation, which only starts happening,
once the seeder reports to the chain,
that they successfully retreived the entire encoded dataset.
This is defined in detail in our hackmd, which included
the sequence diagram and now links to it.


---------------------
https://dat.foundation/
https://docs.dat.foundation/
https://www.datprotocol.com/