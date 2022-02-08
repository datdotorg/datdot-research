Terminology you need to know:
* `header`
* `block`
* `client`
* `hash`
* `transaction`
* `signature`

# STACK (SUBSTRATE FRAMEWORK) - webassembly
* **NODE**
  * `Full Client`
    * A node able to synchronise a block chain in a maximally secure manner through execution (and thus verification) of all logic. Compare to Light Client.
  * `Light Client`
    * ...
* **CORE**
  * RPC, sync, libp2p, database, contract language
  * Modular Core of Chain:
    1. Calls       - ACTIONS: tell runtime what to do
      * dispatchable closures (functions) e.g. { type: 'function call', name: 'foo', params: '...' }
    2. Storage     - STATE: calls can read from the storage
    3. Origins     - call always get dispatched from an origin =>  encodes privilege (like users on linux)
      * e.g. CALL: transfer balance, ORIGIN: this account
      * root origin
        * arbitrary changes pieces of the storage
        * change the code of the runtime
        * ...
    4. Events      - reports what runtime has done
      * can be queried by runtime interface
    5. Logs        -
      * placed in block header to be easy querieable by light clients
    6. Inherents   - oraclize data
      * take environment from block creater and put it on chain
    7. JSON config - chain specification by the user should provide for genesis block (e.g. block time, block period)
* **RUNTIME** (=generic dynamic self-defining STF (State Transition Function))
  * e.g. (governance, dao, staking, slashing, csprng, parachains, permissions, smart contracts)
  * `pallets` (modular components) power the `STF`
    * default pallets come with `standards` and `conventions`
    * consensus (e.g. GRANDPA) - progressive algorithm with fast block production and adaptive definite finality
    * networking (e.g. libp2p)
    * configuration


# CORE DATATYPES
A `pallet` for each of them exists

* `Hash` - encodes cryptographic digest of some data (e.g. 256-bit quantity)
* `BlockNumber` - encodes total number of ancestors any valid block has (e.g. 32-but quantity)
* `DigestItem` encode one of a number of "hard-wired" alternatives relevant to consensus and change-tracking as well as any number of "soft-coded" variants, relevant to specific modules within the runtime.
* `Digest` - series of `DigestItem`s - all information relevant for a light-client to have on hand within the block
* `Header` - representative of all information relevant to a block - includes `parent hash`, `storage root` and `extrinsics trie root`, `digest` & `block number`
* `Extrinsic` - represent single piece of data external to and recognized by the blockchain. It involves 1+ signatures, encoded instruction
* `Block` - combination of `Header` + `Extrinsic`s + used specified hash function algorithm

# SUBSTRATE USAGE
1. bundled with a node
  * configure JSON file + launch chain
  * allows to configure default pallets
    * balances
    * staking
    * block-period
    * fees
    * governance

2. with pallets
  * standard pallets
  * new custom pallents
  * e.g. alterintg `block authoring logic`
  * allows to change `data types`
  *

3. non-substrate runtime
  * can alter abstract block authoring logic
  * can also alter header and block serialization formats

-------------------------------------------------------------------------------

# GLOSSARY


# Crypto Primitives
* `PALLETS` use `SR25519` and `ED25519`
  * and not `ECDSA`/`SECP256k1`
* **BLOCKCHAIN**
  * `blocks` must be `hashed` under some algorithm
  * and reference `parent's block hash`
* **STATE**
  * `storage` is encoded as a `trie`
  * allowing cryptographic references to any given state of it
  * which uses a `hashing algorithm`
* **CONSENSUS**
  * `VALIDATORS` must often use digital `signature` schemes
* **TRANSACTION AUTHENTICATION**
  * in `runtimes` where `transactions` and `accounts` are used
  * `accounts` must be associated with a `digital identity`


# EVENTS (data type)
A means of `recording`, for the benefit of the off-chain world
that some particular state transition has happened.
* `PALLETS` can define `EVENT` types
* aggregation of `EVENT` types of all used `PALLETS` happens into a single `ENUM` type
* are "a transient set of `storage items` inspected immediately after block execution
  * and reset during block initialisation

# EXECUTOR
The executor is responsible for:
1. `dispatching`
2. and `executing calls`
into the Substrate runtime.

A means of `executing` a `function call` in a given `runtime` with a `set of externalities`
There are two executor implementations present in Substrate, `Wasm` and `Native`
* **Wasm Executor**
  * An Executor that uses the Wasm binary and a Wasm interpreter to execute the needed call. This tends to be slow but is guaranteed correct.
* **Native Executor**
  * An Executor that uses the current inbuilt and natively compiled runtime to execute the needed call. If the code is compatible with the on-chain Wasm code, then it will be a lot faster and correct. Incorrect versioning will result in a consensus error.

# WebAssembly (Wasm)
An `execution architecture` based upon a `virtual machine` that allows for the efficient, platform neutral expression of deterministic machine-executable logic. Wasm is used across the Web platform and well-tooled and easily compiled from Rust.



# Metadata
Information capture allowing external code to introspect runtime data structures. Includes comprehensive descriptions of the `dispatch functions`, `events` and `storage items` for each module in the `runtime`


# Origin
The provenance of a dispatched function call into the runtime. Can be customised (e.g. the Council "Motion" origin), but there are two special "built-in"s:
* `Root`: system level origin, assumed to be omnipotent;
* `Signed`: transaction origin, includes the account identifier of the signer;


============================================


## AURA
* (=Authority Round)
* fixed set of Authorities (= Set of Identities)
* split time into segments called `slots`
* Take turns `producing blocks` (=round robin)
* works great for private or enterprise networks, not public networks


## BABE && GRANDPA
* (=Blind Asignment Block Extension)
* fixed set of Authorities (= Set of Identities)
  * have cryptographic keypair
* Verifiable Random Functions (=VRF) which is a Pseudo Random Function
* Executing `VRF` on your own behalf needs secret key
  * to know what the next pseudo-random values will be
  * everyone can verify you executed it
* split time into segments called `slots`
  * one BLOCK will ultimately be chosen for each SLOT
* EXECUTION:
  * each authority executes VFR and publishes their pseudo random value
  * if below THRESHOLD, they don't author a block
  * if above THRESHOLD, they do author a block
* It's probabilistic
  * some slots don't have BLOCK PRODUCER
  * some slots have multiple and need `FORK CHOICE RULE`

## PROOF OF WORK
* like in Bitcoin
* like in Ethereum 1.0
* basically: searching for a `hash-pre-image`

## GRANDPA (=Eventual Finality)
* Finality Gadget
* Inspired by BFT
* 2 rounds of voting protocol
* set of authorities (=grandpa voters)
* as BLOCKS come in, they cast
  * PRE VOTE (=first vote)
    * seen this BLOCK, it looks like the best BLOCK for this round
  * PRE COMMIT (=second vote)
    * after you have seen enough authorities PRE VOTES
    * after 2/3's of GRANDPA VOTERS have PRE COMMITTED for a GIVEN BLOCK
      * => it's called FINALIZED (=we won't re-org about it)



## CBC Finality Gadget
* correct by construction
* https://eprint.iacr.org/2019/415.pdf
* https://eprint.iacr.org/2019/415
* https://medium.com/layerx/cbc-casper-and-formal-verification-1954cbd1d971
* https://github.com/ethereum/research/tree/master/papers/cbc-consensus

## FFG (friendly finality gadget)
* https://arxiv.org/abs/1710.09437
* https://hackernoon.com/what-to-expect-when-eths-expecting-80cb4951afcd
* https://medium.com/@VitalikButerin/minimal-slashing-conditions-20f0b500fc6c

## AVA (Avalanche Consensus)
* https://arxiv.org/abs/1906.08936

---------------------------------------------------------------------
---------------------------------------------------------------------



---------------------------------------------------------------------



# POLKADOT

## Collator

## VRF from BLOCK PRODUCERS

## VDF (Verifiable Delay Function)

## FISHERMEN

# VALIDATOR

---------------------------------------------------------------------




1. PARACHAIN convinces RELAYCHAIN something is available
2. ERASURE ENCODE BLOCKS and DISTRIBUTE UNIQUE PARTS to all NODES VALIDATORS? HOSTERS?
3. If a THIRD of VALIDATORS have their UNIQUE PARTS, any BLOCK can be RECONSTRUCTED
4. The ERASURE CODE is 3x the SIZE

---------------------------------------------------------------------

# BLOCK PRODUCTION - `BLOCK INTERVALS`

## BABE - CHAIN GROWTH SYSTEM
* ...

---------------------------------------------------------------------

# FINALITY GADGET - `FINALITY CYCLE` (Byzantine Agreement Problem)

## GRANDPA
* all chain validators participate
* Fishermen period
* needs partial synchronisity
* also:
  * if BLOCK 3 contains encrypted info
  * and BLOCK 4 is FINALIZED
  * and BLOCK 5 is revealing that BLOCK 3 is invalid
  * then => that's a problem

 * we GHOST on our PRE VOTE or PRE COMMITS
 * THRESHOLD is 2/3 of VOTES for the BLOCK

* you wait until you see enough PRE VOTES and PRE COMMITS to know FINALIZTION is possible






## DOOMSLUG
https://drive.google.com/file/d/1cKHLMnulYXc9Mv_AHAHbwNeMtrIUXSuk/view


------------------------------------------------------------------------

BLOCKCHAIN - Problem of distributed consensus between full nodes
1. LIVENEWSS (continue growing and adding new transactions)
2.

1. BLOCK AUTHORING - nodes create new blocks with hash refs to parent blocks
2. BLOCK FINALIZATION - forks appear, nodes must chose canonical one and never change once finalized


# BLOCK AUTHORING
https://en.wikipedia.org/wiki/Consensus_(computer_science)
https://en.wikipedia.org/wiki/Verifiable_random_function
https://en.wikipedia.org/wiki/Preimage_attack

## Aura
Aura primarily provides block authoring. In aura a known set of authorities are allowed to produce blocks.
The authorities must be chosen before block production begins and all authorities must know
the entire authority set. Time is divided up into "slots" of a fixed length.
During each slot one block is produced, and the authorities take turns producing blocks in order forever.
In Aura, forks only happen when it takes longer than the slot duration for a block to traverse the network.
Thus forks are uncommon in good network conditions.

## BABE
Babe also primarily provides block authoring.
Like, Aura, it is a slot-based consensus algorithm with a known set of validators.
In addition, each validator is assigned a weight which must be assigned before block production begins.
Unlike Aura, the authorities don't take turns in order.
Instead, during each round, each authority generates a pseudorandom number using a VRF (Verifiable Random Function).
If the random number is lower than their weight, they are allowed to produce a block.

Because multiple validators may be able to produce a block during the same slot,
forks are more common in Babe than they are in Aura, and are common even in good network conditions.

Substrate's implementation of Babe also has a fallback mechanism for when no authorities
are chosen in a given slot.

## Proof of Work
Proof of Work also provides block authoring. Unlike Babe and Aura, it is not slot-based,
and does not have a known authority set. In proof of Work, anyone can produce a block at any time,
so long as they can solve a computationally challenging problem (typically a hash preimage search).
The difficulty of this problem can be tuned to provide a statistical target block time.


# BLOCK FINALIZATION

## Probabilistic methods
Each of the block authoring mechanisms we've discussed previously needs to know
where on the chain is should build the next block. Methods such as the "longest chain rule"
"heaviest observed subtree" often work in practice and provide probabilistic finality.
That is, with each new block that is added to a chain, the probability that
it will be reverted decreases, approaching zero. When true certainty that a block
is final is desired, a more sophisticated game can be used.

## GRANDPA
https://github.com/w3f/consensus/blob/master/pdf/grandpa.pdf
https://github.com/paritytech/finality-grandpa
Grandpa provides block finalization. It has a known weighted authority set like Babe.
However, Grandpa does not author blocks; it just listens to gossip about blocks
that have been produced by some authoring engine like the three discussed above.
Each authority participates in two rounds of voting on blocks. The details of
the voting are beyond the scope of this post. Once 2/3 of the grandpa authorities
have voted for a particular block, it is considered finalized.

# HYBRID CONSENSUS
1. BLOCK AUTHORING ENGINE (e.g. BABE)
  * => must be made aware of FINALIZED BLOCKS (to build on top of the CANONICAL CHAIN)
2. FINALITY GADGET (e.g. GRANDPA)

Note on weights:

Babe, Grandpa, and many other algorithms that do not come bundled with
Substrate rely on weights.

Consensus algorithms themselves typically do not dictate
how the weights are assigned, but rather assume that they are assigned somehow leaving
the assignment to an external mechanism.

In public networks, it is common to assign
weights based on how many tokens are staked.

In the default Substrate node,
all weights are set to 1 because the phragmen algorithm keeps all validators close to equally staked.


=> phragmen algorithm keeps all validators close to equally staked

---------------------

BEFORE TENDERMINT, building BLOCKCHAINS required building ALL THREE LAYERS

1. CONSENSUS PROTOCOL
2. Application Blockchain Interface

handles
1. NETWORKING (propagate transactions validators agree on)
2. CONSENSUS (application defines validator set)

TENDERMINT === INSTANT FINALITY
=> no forks ever if <2/3 are malicious


IBC, short for Inter-Blockchain Communication Protocol

take a closer look at how IBC works, and how it enables the creation of Cosmos,
a network of blockchains

IBC allows heterogenous chains to exchange tokens.
This means that blockchains with different applications
and validator sets are interoperable.



# How IBC works
1. Account X1 on Chain A sends 10 tokens $B on chain B
2. 10 $A are locked on Chain A
3. 10 $A Proof-of-lock is RELAYED from Chain A to Chain B
4. Chain B tracks VALIDATORS of Chain A
5. if Proof-of-lock is signed by more than 2/3rd of Chain A VALIDATORS
6. => it is VALID and $B 10 tokens are MINTED on Chain B
7. TOKENS minted on Chain B are not real $A, because $A only exists on Chain A
8. They represent on B token $A - along with Proof-of-lock on Chain A
9. Similar mechanisms UNLOCKS tokens to return to origin Chain
10. it can also support dynamic exchange rates


====================================================================

# SUBSTRATE NODE
1. CORE (=CLIENT)
  1. TX Pool
  2. Execution Environment -> Wasmi, Wasmtime
  3. Database
  4. Offchain Workers -> HTTP, Timestamp, Oracles
  5. Consensus -> BABE, GRANDPA, PoW, PoA/Aura
  6. Networking -> libp2p
  7. RPC
2. RUNTIME
  * ~34+ pallets

Compile `RUNTIME` to `WASI` and execute using e.g. `Wasmi` or `Wasmtime`,
for the right platform

# PARITY WORK
* Dashboard
* Browser Extension
* PolkadotJS
* Signer
* ink!
* client cli
* archive node
* RPC Shim / RPC libs
* playground
* analytics tool
* testing tools
* marketplace
* validator deployment
* governance App
* Nominator App

* Block Explorers
* Frontend Libraries
* Solidity to WASM compiler
* High Availability Deployments
* Remote Signing
* TEE Support
* Payment Channels



====================================================================

# SUBSTRATE
* **`/bin`** containes compiled nodes
* **`/client`** contains generic code for
  * `rpc` to support many transports (e.g. `http`, `ws`, `tcp`, ...)
    * `rpc-api`
    * `rpc-servers`
  * `db` to serve as a backend for `blockchain` and `state trie`
    * `state-db` - transaction queue?
  * `telemetry`
  * `tracing`
  * `transaction-protocol`
  * `executor` - ??? executes some of the blocks ???
  * `keystore` - ???
  * `api`
  * `others`
    * `authority-discovery`
    * `basic-authorship`
    * `block-builder`
    * `chain-spec` - ???
    * `finality-grandpa`
    * `peerset`
    * `service`
    * `src` - ???
    * `offchain`
  * `network` - ???
    * `network-gossip` - ???
  * `cli` - to interact with chain from terminal

Dependency injection of primitives with defined interface
  * defined by core
  * or defined by used pallets
* **`/primitives`** - primitives as the language of your blockchain
  * `allocator`
  * `api`
  * `application-crypto` - e.g. blake256
  * `arithmetic`
  * `authority-discovery`
  * `authorship`
  * `block-builder`
  * `blockchain`
  * `consensus`
  * `core`
  * `debug-derive`
  * `externalities`
  * `finality-grandpa`
  * `finality-tracker`
  * `inherents` -
  * `io`
  * `keyring`
  * `offchain`
  * `panic-handler`
  * `phragmen`
  * `rpc`
  * `runtime`
  * `runtime-interface`
  * `sandbox`
  * `serializer`
  * `session`
  * `sr-api`
  * `staking`
  * `state-machine`
  * `std`
  * `storage`
  * `test-primitives`
  * `timestamp`
  * `transaction-pool`
  * `trie`
  * `version`
  * `wasm-interface`

* **`/docs`**
* **`/frame`** - framework for building blockchain logic
  * `assets`
  * `aura`
  * `authority-discovery`
  * `authorship`
  * `babe`
  * `balances`
  * `collective`
  * `contracts`
  * `democracy`
  * `elections`
  * `elections-phragmen`
  * `evm`
  * `example`
  * **`executive`** - core pallet of FRAME
  * `finality-tracker`
  * `generic-asset`
  * `grandpa`
  * `identity`
  * `im-online`
  * `indices`
  * `membership`
  * `metadata`
  * `ricks`
  * `offences`
  * `randomness-collective-flip`
  * `recovery`
  * `scored-pool`
  * `session`
  * `staking`
  * `sudo`
  * **`support`** - core pallet of FRAME
  * **`system`** - core pallet of FRAME
    * => `orign` concept (e.g. Root || Signed(AccountId) || None)
    * origin `None` === `inherent Extrinsic` (unlike `transaction Extrinsic`)
      * e.g. used in `timestamp` pallet
  * `timestamp`
  * `transaction-payment`
  * `treasury`
  * `utility`
* **`/test-utils`**
* **`/utils`** - bridges eg. `primitives <--> frame <--> client`
  * `browser`
  * `browser-script-utils`
  * `fork-tree`
  * `frame`
  * `grafana-data-source`
  * `wasm-builder`
  * `wasm-builder-runner`

You can build a `wasm-runtime` that satisfies the `runtime-apis` required by the `client` (which hosts a wasm-interpreter) and not use `frame` at all
* `runtime-api` you can find in `primitives`

**minimal chain**
```rs
`construct_runtime!{
  pub enum Runtime where
    Block = Block,
    NodeBlock = opaque::Block,
    UncheckedExtrinsic = UncheckedExtrinsic
  {
    System: ...
    Timestamp: ...
    Aura: ...
    Grandpa: ...
    Indices: ...
    Balances: ...
    TransactionPayment: ...
    Sudo: ...
    // use for module template in template.rs
    TemplateModule: ...
    RandomnessCollectiveFlip: ...
  }
}
```
# RUNTIME UPGRADE
can change all stuff in `frame` calling `set_code()`
* `runtime wasm` is stored on the `blockchain`
  * is part of consensus
  * is part of block production process
* prevents `hard forks`, because all clients upgrade based on normal
  * blockchain consensus logic
  * which - for runtime upgrade - can be governed by governance

**Forkless Runtime Upgrades**
1. Native Client Environment
  * ENTRY APIs
  * Native runtime is same version as on-chain runtime?
    * YES: use native runtime from client
    * NO: use wasm runtime from chain
  * update merklised storage database

**Need for upgrades**
1. fix important security vulnerabilities
2. change rules in the protocol
3. add new functionality


# RECOVERY PALLET - forgot password pallet
* X amount of friends need to confirm
* Y amount of time need to be waited
* then extrinsics is executed with your original origin



------------------------------------------------------

# BLOCKCHAIN (=> SUBSTARTE provides LAYERS)
1. CLIENT/CORE
  1. `Networking Layer`           => `Nodes` connects via `p2p network`
    * => libp2p
  2. `Database Layer`             => `Nodes` have a `database backend`
  3. `Consensus Engine`           => `Nodes` have a `consensus algorithm`
  4. `Transaction Queue`          => `Nodes` have a `transaction handling`
  5. `Executor` (of executable format)
    * native => fastests
    * wasm => sandboxed, fast, compact, well supported
2. Pluggable Code (Native or Wasm)
  1. `Library of Runtime Modules` => `Nodes` have a `RUNTIME` (=`STF`)
    * => block execution logic
    * => made of `pallets`



