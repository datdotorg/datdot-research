# `playproject-io/datdot-substrate`
* [API](https://github.com/playproject-io/datdot-substrate/blob/master/bin/node/runtime/src/dat_verify.rs)

### 6. SUBSTRATE - `playproject-io/datdot-substrate`
* @TODO: Or do you need more info about the process in term of -
  1. which function registers new dat that needs to be seeded,
  2. which function and params register users as seeder,
  3. how is a seeder selected etc.?
* **substrate-daemon**
* **GOAL:** a `pallet` known under the name `dat_verify`
* [x] no dispatch center anymore for `API` of substrate
* [ ] this repo will consist of a `minimal test node` and `FRAME pallet`
  * => pull in all code we don't maintain as dependency
    * => replacing all cargo dependencies that point to a path to point to git instead
    * => get rid of all unmodified crates from the repo
    * => updating means changing git pointers to new commit hashes
      * use as version in all cargo.toml files + call `cargo update`
    * => force push to clean up github history to fix repo "stats"
* **GOAL:** `types` and `types.json` should MATCH all the "hypercore types"
  * **SUBSTRATE TYPES**
  * JSON object includes all TYPES
  * https://github.com/playproject-io/datdot/blob/master/bin/node/runtime/types.json
* [ ] After the runtime module has a stable api, the scaffolding will be reduced
* **API** COMMUNICATION (=IPC)
  * **FUNCTIONS** - **TYPES OF INTERACTIONS (which produce EXTRINSICS):**
    * **`submit_proof()`**
      * enumeratable map in storage with all active challenges
      * instead of a single storageValue with a single challenge, long overdue
      * Also considering a vec containing all active challenges per seeder
        * so we can efficiently wipe all challenges for a seeder when they go offline unexpectedly
        * @TODO: is this the right way to do it?
    * **`register_data()`**
      * submit all `roothashes` in the "children tupel" (not just one)
        * @TODO: why?
      * temporary `force_register_data()` // for test & debugging
      * some `sudo` to force "dummy" dats/merkle roots into chain
      * => for test scenarios and simulation
        * => use to "verify challenge events
        * => used to register seeders
        * => used to "random challenge durations"
        * => need to make "challenge responses" work
    * **`unregister_data()`**
    * **`register_seeder()`**
    * **`unregister_seeder()`**
    * `...`
    * **`usersStorage(ALICE.publicKey)`**
      * => returns an `array of dat pubkeys`
    * **`DatHosters`**
      * to check all the  user storages to see who has this dat in their array
      * to directly check to whom was this particular archive assigned to
  * **EVENTS**
    * ...


## FUNCTIONS

**`submit_proof()`**
--------------------

**VALIDATE MERKLE ROOTS**
* I just realized the only thing I validate from children is that length is valid, but I don't yet recalculate the merkle root from the root hashes

**QUESTION:**
* your tuple/array is made of objects, while I pass just array of hashes. What is a hashType? I just hardcoded 2

```js
feed.rootHashes(0, (err, res) => {
  if (err) console.log(err)
  archiveArr.push({
    hashType: 2,
    children:  res.map(el => el.hash)
  })
})
```
=> for root hash, 2.
=> for nodes in the tree, 1.
=> for chunk hashes, 0.
I'm also technically passing an array of hashes,
but based on the hash format on how dat works website

see [hashes & signatures](https://datprotocol.github.io/how-dat-works/#hashes-and-signatures)
* => children have number and length


getting all these chuncks with hashes using
```js
feed.rootHash(index, cb)
// I need to get data for each index, so I first do
var len = feed.length  // to get number of chunks
for (var i = 0; i < len; i++) feed.rootHash()
```
## **IMPORTANT**
* JOSHUA: I think you only need to requests roots for the last index?
* NINA: really? so feed.length - 1?
* JOSHUA: no I'm wrong here sorry :p
  * but yes I'm assuming here that you are getting the parent node
  * that is the "ancestor" of the chunk you are requesting
  * Ok, we'll have to figure out which index to take
  * ...
  * I think I wasn't wrong earlier when I said:
    * you only need the roots for the highest index

EXAMPLE: for SUBMIT PROOFS:
```js
// roots indexes for 14 should be 7,28, and hashtype for 7 should be 1
// and 28 should be 0
// root indexes for 15 should be 15
// with hashtype 1
feed.rootHashes(14, cb)
feed.rootHashes(15, cb)
// https://github.com/mafintosh/hypercore#feedroothashesindex-callback
// =>
// I mean, if hashtype isn't a thing anymore that should just make everything easier
// but if it hasn't changed, it's just the first byte (the first element of data)
//
// ==>  all you need is to get roots of the last index
// ==> exactly the same logic for submitting proofs
```

```js
hashType: 2,
// u8
children: JSON.stringify(res) // res (is Buffer)
//  Vec<ParentHashInRoot>
```
why do we call them children, shouldn't it be better to call them parents?
=> they are children of the merkle root
=> parents of the chunk hash

SO:
=>  with every index we get parents of this chunk
=> all together they are children of the root
=> we need all the parents of all the chunks???

QUESTION:
* is hashtype included in data
  * => (data should be the content of the actual hash)
  * => because hashtype is different between chunk hashes and parent hashes
