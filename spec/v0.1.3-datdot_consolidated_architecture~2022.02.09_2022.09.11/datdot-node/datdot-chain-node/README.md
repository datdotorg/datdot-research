# datdot-chain-node
substrate based blockchain node

## design principles
1. do as little as possible on chain
2. do as much as possible off chain
3. the long term goal is to remove the chain
  * if ever possible


# `playproject-io/datdot-pallet-*`


## `-dat_verify`
...

## `-custom-balance`
...

## `-...`
...


# NODE ROLES
* `NODE` (= `Actor` or `Identity`)
* `PRODUCER` (= `Block Author` or `Block Producer`)






# CHAIN

### SUBSTRATE
consists of many `pallets`
see: e.g. https://polkadot.js.org/api/substrate/storage.html

# RULES
1. `consensus logic`
2. `transfers logic` (important to track `ratio`)
3. `system logic`
4. `dat_verify` logic
  * related to hypercore p2p hosting
  * https://github.com/playproject-io/datdot-substrate/blob/master/bin/node/runtime/src/dat_verify.rs

# MORE RULES

**RANDOMNESS/ENTROPY** from chain
* `hash` a `nonce` concatenated to `randomness`
  * requesting randomness is not stateful
  * `nonce` here is a `request counter`
  * every block has a new `random seed` for `randomness`
1. get `onchain randomness` via `collective coin flip` mechanism
  * done between `participants of block production` and `onchain nonce`
2. derive selected PEER from it

### BLOCK TYPES
**CAN WE DEFINE different types of BLOCKS?**
* you can definitely give different extrinsics different priorities, that's easier
* otherwise: I think so, but that's probably out of scope right now? maybe month 2 or 3?
  1. "challenge-response"-blocks
  2. "other"-blocks
  3. ...

**`@IDEA:` BLOCK TYPE RESTRICTIONS:**
* REASON:
  * the problem of "staking/slashing/etc..." sounds super intimidating to me
  * if any block can contain any transaction, but manageable if types/rules
  * define what kind of blocks are even allowed


===============================================================================

# chain
onchain = node + runtime = node + frame + pallets
* `node + frame + pallets` compile to WASM


## `node` client (polkadot/substrate compatible)
* *runs* the chain
* *is* the core
* keeps internal storage + networking + ...
* details don't matter to `runtime`

## `runtime`
* details don't matter to `node`
* consists of `frame` which can include multiple `pallets`

* Every Substrate user can define its own runtime apis with
  * `decl_runtime_apis`
  * and implement them in the runtime with `impl_runtime_apis`
  * [minimum mandatory FRAME api implementation:](https://substrate.dev/rustdocs/master/sp_api/trait.Core.html)
    * basic functionality every runtime needs to export
    * `initialize_block()`
    * `execute_block()`
    * `version()`

### `frame` (= system module)
* low-level access to core data types, storage, and *cross-cutting utility* functions for your blockchain
* manages the storage items for extrinsics data, indexes, event records, and digest items, among other things that support the execution of the current block
* acts as base layer for other `pallets` to interact with substrate framework components
* handles low-level tasks like depositing logs, basic set up and take down of temporary storage entries, and access to previous block hashes

The System module defines the core data types used in a Substrate runtime. It also provides several utility functions (see Module) for other runtime modules.

In addition, it manages the storage items for extrinsics data, indexes, event records, and digest items, among other things that support the execution of the current block.

It also handles low-level tasks like depositing logs, basic set up and take down of temporary storage entries, and access to previous block hashes.


# ROTATION LOGIC
1. declare capacity
2. get a set of `hypercores` under that capacity assigned
3. rotates over time
  * changing hosters for hypercores
  * `NewPin` event will be necessary
    * e.g. if `Hoster` has a `remote setup`
      * one machine to interact
      * one machine to watch and do the pinning

  * currently we don't `PIN` dats (e.g. assign to hoster)
    * unless `host` explicitly ask for one to host
    * which means `register_seeder()` and there is nothing to host
    * => don't emit a `NewPin` event


4. => need to watch `NewPin` with your `address`
5. currently `NewPin` is emitted only as part of `register_seeder`
  * only if there is `data` preregistered and available to PIN

---------------------------------------


# OFFCHAIN WORKERS
offchain workers aren't part of consensus
they are basically the same thing that datdot-service is, but distributed as part of the runtime

like adding a real `offchain worker` between `datdot-service` and the `runtime` where the offchain worker would be an empty shell that just delegates to `datdot-service` and forwards answers to the `runtime` ?
...would we gain anything?
