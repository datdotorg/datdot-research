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

-------

The system module defines the following extensions:

[CheckWeight]: Checks the weight and length of the block and ensure that it does not exceed the limits.
[CheckNonce]: Checks the nonce of the transaction. Contains a single payload of type T::Index.
[CheckEra]: Checks the era of the transaction. Contains a single payload of type Era.
[CheckGenesis]: Checks the provided genesis hash of the transaction. Must be a part of the signed payload of the transaction.
[CheckVersion]: Checks that the runtime version is the same as the one encoded in the transaction.
Lookup the runtime aggregator file (e.g. node/runtime) to see the full list of signed extensions included in a chain.

------

* `set_code` - set new code
* `account_nonce` - extrinsics nonce for accounts
* `block_hash` - block numbers to block hashes
* `extrinsic_data` - extrinsic index to extrinsic data of current block
* `block_number` - current block set by execute_block
* `parent_hash` - Hash of previous block
* `extrinsics_root` - Extrinsics root of the current block, also part of the block header
* `digest` - Digest of the current block, also part of the block header.
* `events` - Events deposited for the current block.
* `event_count` - The number of events in the Events<T> list.
* 
pub fn event_topics<KArg1, KArg2>(
    k1: KArg1,
    k2: KArg2
) -> Vec<(T::BlockNumber, u32)>
where
    KArg1: EncodeLike<()>,
    KArg2: EncodeLike<T::Hash>,


* `deposit_event` - Deposits an event into this block's event record
* `deposit_event_indexed` - Deposits an event into this block's event record adding this event to the corresponding topic indexes.

This will update storage entries that correspond to the specified topics. It is expected that light-clients could subscribe to this topics

* `extrinsic_index` - Gets the index of extrinsic that is currently executing.

* `extrinsic_count` - Gets extrinsics count.

* `all_extrinsics_weight` - Gets a total weight of all executed extrinsics.

* `all_extrinsics_len`

* `register_extra_weight_unchecked` - Inform the system module of some additional weight that should be accounted for, in the current block.

NOTE: use with extra care; this function is made public only be used for certain modules that need it. A runtime that does not have dynamic calls should never need this and should stick to static weights. A typical use case for this is inner calls or smart contract calls. Furthermore, it only makes sense to use this when it is presumably cheap to provide the argument weight; In other words, if this function is to be used to account for some unknown, user provided call's weight, it would only make sense to use it if you are sure you can rapidly compute the weight of the inner call.

Even more dangerous is to note that this function does NOT take any action, if the new sum of block weight is more than the block weight limit. This is what the unchecked.

Another potential use-case could be for the on_initialise and on_finalize hooks.

If no previous weight exists, the function initializes the weight to zero.

* `initialize` -
    number: &T::BlockNumber,
    parent_hash: &T::Hash,
    txs_root: &T::Hash,
    digest: &DigestOf<T>

* `finalize` - Remove temporary "environment" entries in storage

* `deposit_log` - Deposits a log and ensures it matches the block's log data

* `externalities` - Get the basic externalities for this module, useful for tests.

* `set_block_number` - Set the block number to something in particular. Can be used as an alternative to initialize for tests that don't need to bother with the other environment entries.

* `set_extrinsic_index` - Sets the index of extrinsic that is currently executing

* `set_parent_hash` - Set the parent hash number to something in particular. Can be used as an alternative to initialize for tests that don't need to bother with the other environment entries.

* `set_block_limits` - Set the current block weight. This should only be used in some integration tests.

* `runtime_version` - Return the chain's current runtime version.

* `inc_account_nonce` - Increment a particular account's nonce by 1.

* `note_extrinsic` - Note what the extrinsic data of the current extrinsic index is. If this is called, then ensure derive_extrinsics is also called before block-building is completed.

NOTE: This function is called only when the block is being constructed locally. execute_block doesn't note any extrinsics.
fn note_applied_extrinsic(
    r: &DispatchOutcome,
    _encoded_len: u32,
    info: DispatchInfo
)

* `note_finished_extrinsic` - To be called immediately after note_applied_extrinsic of the last extrinsic of the block has been called.

* `derive_extrinsics` - Remove all extrinsic data and save the extrinsics trie root.


---------------------------------------

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
