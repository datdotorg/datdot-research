# BLOCKCHAIN

# Genesis (Block?) Configuration
* A `JSON-based configuration file` that can be used to determine a `genesis block` and which thus allows a single `blockchain runtime` to underpin multiple independent `chains`.
* Analogous to a "chain spec" file in Parity Ethereum, and, when used with Substrate Node, could be considered the third and highest-level usage paradigm of Substrate.
  * `PALLETS` provide a means of automatically generating the `chain configuration logic` from the modules and their persistent `storage items`.


## BLOCK
A single item of a block chain (or parachain) that amalgamates a series of
* extrinsic data (the "body") together with some
* cryptographic information (the "header")
* Blocks are arranged into a tree through parent pointers (implemented as cryptographic digests of the parent) and the tree is pruned into a list via a "fork-choice rule".
* **HEADER** - Pieces of primarily cryptographic information that summarise a block. This information is used by light-clients to get a minimally-secure but very efficient synchronisation of the chain.
  * `digest`
    * extensible field of the block header that encodes information needed by header-only ("light") clients for chain synchronisation

# Block Structure
A `block` in Substrate is a *primitive* and composed of
1. a `header`, which contains:
  * `block height`
  * `parent hash` (=reference to blocks parent block) to trace the chain to it's genesis
  * `extrinsics root`
  * `state root`
  * `digest`
2. and an array/batch of `extrinsics`
  * Extrinsics are bundled together into a block as a series to be executed as each is defined in the runtime

## Extrinsics Root
The extrinsics root is a `cryptographic digest of a series`
This serves two purposes:
1. it prevents any alterations to the series of extrinsics after the header has been built and distributed
2. it provides a means of allowing light clients to succinctly verify that any given extrinsic did indeed exist in a block given only knowledge of the header

* [Block Reference](https://substrate.dev/rustdocs/pre-v2.0-3e65111/sp_runtime/traits/trait.Block.html)


----------------


# SUBSTRATE EXECUTION of EXTRINSICS
1. `failed extrinsics`
  * => if an extrinsic fails, that still finalizes
  * => if it fails during execution it is still recorded in the block and gets finalized


----------------


# database backend
* means by which `data` relating to the `blockchain` is persisted between invocations of the node


-------------------


# STATE TRIE
* The `data` that can be drawn upon by, and that persists between, the executions of sequential blocks.
* State is stored in a "Trie", a cryptographic immutable data-structure that makes incremental digests very efficient.
* In Substrate, this trie is exposed to the `runtime` as a simple key/value map where both keys and values can be arbitrary byte arrays.

# Trie (Patricia Merkle Tree)
An immutable cryptographic data-structure typically used to express maps or sets of items where:
* a cryptographic digest of the dataset is needed; and/or
* it is cheap to recompute the digest with incremental changes to the dataset even when it is very large; and/or
* a concise proof that the dataset contains some item/pair (or lacks it) is needed.


-------------------

AUTHORING
block producer, block production, liveness

vs.

FINALITY

-------------------

BLOCKCHAIN contains EXTRINSICS which can be EXECUTED via RUNTIME to generate
the STATE TRIE

STATE TRIE is generated from BLOCKS which contain EXTRINSICS which are executed in the RUNTIME (=STATE TRANSITION FUNCTION)

BLOCKCHAIN and STATE TRIE are stored in the DATABASE BACKEND

BLOCKS are not part of the STATE TRIE

PRUNING only happens to STATE TRIE

PRUNING BLOCKS only prunes BLOCK BODIES
PRUNING never happend to BLOCKS or BLOCK HEADERS

FULL NODES are ARCHIVAL NODES which keep all BLOCKS
LIGHT CLIENTS are NODES which keep only BLOCK HEADERS

STATE TRIE
1. you keep a certain backlog of unfinalized state trie nodes
2. pruning in most cases means pruning historical state trie nodes

STATE exists at given BLOCKHEIGHT

RUNTIME has direct access to STATE TRIE

`decl_storage` interacts with `STATE TRIE`
* that macro is essentially a wrapper around creating pointers into the trie



-------------------


`STATE TRIE` is an `INDEX` generated from `BLOCKS`
* generated means: `execute extrinsics` in block to build the `STATE TRIE`
  * accourding to the `RUNTIME` (=`STF`)
* FULL NODES prune outdated STATE TRIE
* LIGHT CLIENTS prune BLOCK BODIES
* every BLOCK HEIGHT has a corresponding STATE TRIE


STATE TRIE
  * prune `dangling references` (=garbage collect)
  * = prune things no longer part of STATE

Part of BLOCKS:
* every `failed transaction`
* every `validated hypercore chunk` (~64kb per chunk)

DATABASE BACKEND
* stores BLOCKS
* stores STATE TRIE
  *





1. **why would i not "prune blocks"?**
  * because if you do, you are no longer useful to the network
  * and you have no proof of how you got to the state you are currently using


3. **didn't you say, even failed transactions and validated hypercore chunks go into blocks? (each chunk is ~64kb, which makes things big)**
  * yes - not in block headers though
  * so we're kind of relying on light clients
  * to make datdot scalable long term
4. **what does "transfer state at a given blockheight" mean?**
  * you have current state of the chain at a given blockheight
  * and a recipient knows the state root
  * from block headers
  * so you just need a method to get them the actual state
  * even if you pruned the block bodies from finalized blocks
5. **can we currently prune "block bodies" - or that's what is not implemented?**
  * YES
6. **Can certain parts of submitted extrinsics be excluded from blocks?**
  * YES, if they are `inherents`
  * but we'd need a method to get them to validators
7. **is the blockchain and the state trie data store in the "database backend" the documentation mentions?**
  * YES
8. **does the state trie have a special API?**
  * multiple apis, were using a high level api as part of our pallet
9. **are there multiple tries that do stuff in substrate or only the state trie?**
  * only one trie, but nodes can be subtries
  * we don't use this feature

## FINALIZED BLOCKS
* dropping BLOCKS even from ARCHIVAL NODES is OPTIMIZATION we don't need now
* => **if we drop finalized blocks, nobody can sync**

