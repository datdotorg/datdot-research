# OVERVIEW

# Substrate
A framework and toolkit for building and deploying upgradable, modular and efficient blockchains. There are three usage paradigms in increasing levels of functionality and opinionation: Core, SRML and Node.

# Substrate Core
* The lowest level of the three Substrate usage paradigms
* this is a minimalist/purist blockchain building framework that contains essential functionality at the lowest level
  * `including consensus`
  * `block production`
  * `chain synchronisation`
  * `I/O for JSON-RPC`
  * `runtime`
  * `network synchronisation`
  * `database backend`
  * `telemetry`
  * `sandboxing`
  * and `versioning`

# Substrate Execution Environment
The runtime environment under which WebAssembly code runs in order to execute blocks.


## FRAME
The **Framework for Runtime Aggregation of Modularized Entities (FRAME)** is a set of modules (called `pallets`) and support libraries that simplify runtime development. * `Pallets` are individual modules within FRAME that host domain-specific logic.

FRAME provides some helper modules to interact with Substrate Primitives, which provide the interface to the core client.

## OVERVIEW
The following diagram shows the architectural overview of FRAME and its support libraries:

1. RUNTIME
  * APIs
  * Execution Environment
2. EXECUTIVE MODULE (orchestration)
  * PALLETS (runtime modules)
3. SYSTEM MODULEs
  * Core Types
  * Utils
  * Events
4. Support Library

### Pallets
When building with FRAME, the Substrate runtime is composed of several smaller components called pallets.
* A pallet contains a set of `types`, `storage items`, and `functions` that define a set of features and functionality for a runtime.

### System Library
* `frame_system` https://substrate.dev/rustdocs/pre-v2.0-3e65111/frame_system/index.html
The System library provides low-level types, storage, and functions for your blockchain. All other pallets depend on the System library as the basis of your Substrate runtime.

The System library defines all the core types for the Substrate runtime, such as:

* Origin
* Block Number
* Account Id
* Hash
* Header
* Version
* etc...
It also has a number of system-critical storage items, such as:

* Account Nonce
* Block Hash
* Block Number
* Events
* etc...
Finally, it defines a number of low level functions which can access your blockchain storage, verify the origin of an extrinsic, and more.

### Executive Pallet
* https://substrate.dev/rustdocs/pre-v2.0-3e65111/frame_executive/index.html
The Executive pallet acts as the orchestration layer for the runtime. It dispatches incoming extrinsic calls to the respective pallets in the runtime.

### Support Library
* https://substrate.dev/rustdocs/pre-v2.0-3e65111/frame_support/index.html
The FRAME support library is a collection of Rust macros, types, traits, and functions that simplify the development of Substrate pallets.

The support macros expand at compile time to generate code that is used by the runtime and reduce boilerplate code for the most common components of a pallet.

### Runtime
The runtime library brings together all these components and pallets. It defines which pallets are included with your runtime and configures them to work together to compose your final runtime. When calls are made to your runtime, it uses the Executive pallet to dispatch those calls to the individual pallets.

### Prebuilt Pallets
Some pallets will be sufficiently general-purpose to be reused in many blockchains. Anyone is free to write and share useful pallets. There is a collection of popular pallets provided with Substrate. Let's explore them.
* [make custom pallets](https://substrate.dev/docs/en/development/module/)
* [example](https://substrate.dev/docs/en/tutorials/adding-a-module-to-your-runtime)

**see pallets**
https://substrate.dev/docs/en/conceptual/runtime/frame#prebuilt-pallets
























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