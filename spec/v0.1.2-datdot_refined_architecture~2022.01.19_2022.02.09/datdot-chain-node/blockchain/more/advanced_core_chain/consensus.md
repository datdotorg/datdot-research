# Conflict Exclusion
In centralized systems, the central authority chooses among mutually exclusive alternatives by recording state transitions in the order it sees them, and choosing the first of the competing alternatives when a conflict arises. In decentralized systems, the nodes will see transactions in different orders, and thus they must use a more elaborate method to exclude transactions.
As a further complication, blockchain networks strive to be fault tolerant, which means that they should continue to provide consistent data even if some participants are not following the rules.

Blockchains batch transactions into blocks and have some method to select which participant has the right to submit a block. For example, in a proof-of-work chain, the node that finds a valid proof of work first has the right to submit a block to the chain.

Substrate provides several block construction algorithms and also allows you to create your own:

* Aura (round robin)
* BABE (slot-based)
* Proof of Work

-------------------------------------------------

# PROCESS
1. Validator Selection
2. Block Production (=block authoring scheme)
3. Fork Choice Rule

# Coordination with the Runtime
The simplest static consensus algorithms work entirely outside of the runtime as we've described so far. However many consensus games are made much more powerful by adding features that require coordination with the runtime. Examples include `adjustable difficulty in proof of work`, `authority rotation in proof of authority`, and `stake-based weighting in proof-of-stake` networks.

To accommodate these consensus features, Substrate has the concept of a `DigestItem`, a message passed from the outer part of the node, where consensus lives, to the runtime, or vice versa.
* https://substrate.dev/rustdocs/pre-v2.0-3e65111/sp_runtime/enum.DigestItem.html

**Not all consensus protocols define a single, canonical chain. Some protocols validate directed acyclic graphs (DAG) when two blocks with the same parent do not have conflicting state changes.**
* https://en.wikipedia.org/wiki/Directed_acyclic_graph

-------------------------------------------------
# CONSENSUS ENGINES
The process by which `VALIDATORS` agree upon the `next valid block` to be added to the relay `chain`

Blockchain nodes use consensus engines to agree on the blockchain's state.
consensus interacts with the runtime in the Substrate framework and a few consensus engines are available with the framework.

* **Consensus Engine**
  * A means for `forming consensus over` what constitutes the (one true) `canonical chain`
  * In the context of Substrate, it refers to a set of trait implementations that dictate which of a number of input blocks form the chain.
* **Consensus Algorithms**
  * An algorithm that is able to ensure that a set of actors who don't necessarily trust each other can come to consensus over some computation. Often mentioned alongside `"safety"` (the ability to ensure that any progression will eventually be agreed as having happened by all honest nodes) and `"liveness"` (the ability to keep making progress)

Often, the number of messages that needs to be sent between participants to reach `finality` in `consensus` scales badly with the number of participants in the consensus protocol
This makes it expensive to perform this kind of agreement on every block.

# Hybrid Consensus Protocol
Split blockchain consensus into `Block Production` and a `Finality Gadget`.
This allows chain growth speed to be as fast as in probabilistic "safety" consensus such as `Ouroboros` or `Aurand` but with same level of security guarantees as in Instant-Finality Consensus Protocols. See the first implementation in Rust, and the GRANDPA article.

## 1. (Hybrid) CONSENSUS ENGINE
Hybrid model makes it possible to grow the chain just as fast as in probabilistic safety consensus

* FINALITY GADGET: `GRANDPA`
* CHAIN GROWTH SYSTEM: `Aurand` (used for block production)
* => hyprid consensus **Aurand+GRANDPA**

## 2. (long-term) ABSOLUTE (INSTANT) FINALITY GADGETS - BLOCK FINALIZATION - FINALITY GADGET
instant-finality consensus
to finalize many blocks at once to reduce number of passed around messages
* e.g. `GRANDPA`

#### Proof-of-Finality
A piece of data that can be used to prove that a particular block is finalised.
Potentially very large unless signature aggregation is used.

#### Provable Finality
Some consensus mechanisms aim for provable finality, whereby all blocks are guaranteed to be the canonical block for that chain upon block inclusion. Provable finality is desirable in cases such as when light clients do not have the full chain state, or when communicating with other chains, where interchain data is not ubiquitously distributed. See: GRANDPA

# Instant-Finality
A non-probabilistic consensus protocol that gives a guarantee of finality immediately upon block production, for example Tendermint and Rhododendron. These tend to be PBFT based and thus very expensive in terms of communication requirements.

## 3. (Short-Term) PROBABILISTIC CONSENSUS GADGETS - BLOCK CREATION - BLOCK PRODUCTION - CHAIN GROWTH SYSTEM
* e.g. `AURA`
* e.g. `Aurand`
* e.g. `Aurand/Ouroboros`
* e.g. `Ouroboros`

# Probabilistic Consensus
In a probabilistic consensus based chain (e.g. Bitcoin), network participants rely on some probability p that a proposed block B will remain in the canonical chain indefinitely, with p approaching 1 as further blocks are produced on top of the block B.

-------------------------------------------------
# FINALITY
Users in any system want to know when their transactions are finalized, and blockchain is no different. In some traditional systems, finality happens when a receipt is handed over, or papers are signed.

Using the `block authoring schemes` and `fork choice rules` described so far, transactions are never entirely finalized.

There is always a chance that a longer (or heavier) chain will come along and revert your transaction.

However, the more blocks are built on top of a particular block, the less likely it is to ever be reverted. In this way, block authoring along with a proper fork choice rule provides `probabilistic finality`.


When `deterministic finality` is desired, a `finality gadget` can be added to the blockchain's logic. Members of a fixed authority set cast finality votes, and when enough votes have been cast for a certain block, the block is deemed final. In most systems, this threshold is 2/3. Blocks that have been finalized by such a gadget cannot be reverted without external coordination such as a hard fork.

> Some consensus systems couple `block production` and `finality`, as in, finalization is part of the block production process and a new block N+1 cannot be authored until block N is finalize. Substrate, however, isolates the two processes and allows you to use any block production engine on its own with probabilistic finality or couple it with a finality gadget to have determinsitic finality.


In systems that use a finality gadget, the `fork choice rule` must be modified to consider the results of the `finality game`. For example, instead of taking the longest chain period, a node would take the longest chain that contains the most recently finalized block.

-------------------------------------------------
## PALLETS
Consensus in Substrate


The Substrate framework ships with several `consensus engines` that provide `block authoring`, or `finality`.
This article provides a brief overview of the offerings included with Substrate itself.
Developers are always welcome to provide their own custom consensus algorithms.

### CHAIN GROWTH SYSTEM PALLETS
**AURA**
* Aura provides a slot-based block authoring mechanism.
* In Aura a known set of authorities take turns producing blocks.
* https://substrate.dev/rustdocs/pre-v2.0-3e65111/sc_consensus_aura/index.html

**Aurand**
A variant of Aura where authorities are shuffled randomly on each round, increasing security.

**Aurand/Ouroboros**
Extension of Aurand where block production involves validators competing over limited slots that move very quickly, where most slots are not populated, but with rare slot collisions.

**BABE** - Blind Assignment of Blockchain Extension (BABE)
* Block authoring protocol similar to Aura where authorities are chosen with a verifiable random function (VRF) instead of a rotating list. Authorities are assigned a time slot in which they can select a chain and submit a new block for it. See

BABE also provides slot-based block authoring with a known set of validators. In these ways it is similar to Aura. Unlike Aura, slot assignment is based on the evaluation of a Verifiable Random Function (VRF). Each validator is assigned a weight for an epoch. This epoch is broken up into slots and the validator evaluates its VRF at each slot. For each slot that the validator's VRF output is below its weight, it is allowed to author a block.

Because multiple validators may be able to produce a block during the same slot, forks are more common in BABE than they are in Aura, and are common even in good network conditions.

Substrate's implementation of BABE also has a fallback mechanism for when no authorities are chosen in a given slot. These "secondary" slot assignments allow BABE to achieve a constant block time.
* https://substrate.dev/rustdocs/pre-v2.0-3e65111/sc_consensus_babe/index.html

**PoW** - Proof of Work
Proof-of-work block authoring is not slot-based and does not require a known authority set. In proof of work, anyone can produce a block at any time, so long as they can solve a computationally challenging problem (typically a hash preimage search). The difficulty of this problem can be tuned to provide a statistical target block time.
* https://substrate.dev/rustdocs/pre-v2.0-3e65111/sc_consensus_pow/index.html


### FINALITY GADGET PALLETS
A part of consensus dealing with making a progression be irreversible. If a block is finalised, then any real-world repercussions can be effected. The consensus algorithm must guarantee that finalised blocks never need reverting.

**GRANDPA**
One example of a work in progress provable finality gadget is being used in Polkadot: GRANDPA.

GRANDPA provides block finalization. It has a known weighted authority set like BABE. However, GRANDPA does not author blocks; it just listens to gossip about blocks that have been produced by some authoring engine like the three discussed above. GRANDPA validators vote on chains, not blocks, i.e. they vote on a block that they consider "best" and their votes are applied transitively to all previous blocks. Once more than 2/3 of the GRANDPA authorities have voted for a particular block, it is considered final.
* https://substrate.dev/rustdocs/pre-v2.0-3e65111/sc_finality_grandpa/index.html

**HoneyBadgerBFT**
Instant-finality consensus algorithm with asynchronous "safety" and asynchronous "liveness" if tweaked. Originally slated as one of a number of directions that Polkadot might explore, but unlikely to be used now.

-------------------------------------------------
# BFT CONSENSUS

## LEADERLESS RELIABLE BROADCAST PRIMITIVE
* PBFT, RAFT
  * Leader Erasure Codes
  * Sends "one stripe" to each node
  * other send their slices to others
  * original data can be re-constructed
  * merkle tree authenticator
* each node is the leader for it's own
  * RBP (reliable broadcast protocol)
  * Round1 distributes data
    * but doesn't guarantee all have it
  * Round2 BBA (binary byzantine agreement)
    * 

## @MY THOUGHTS - STRATEGY
1. HBBFT
2. be leader for your own RBP
  * reliable broadcast protocol
  * with only interested parties
3. money is local
4. once you meet new nodes, sync them too

5. sync should encrypt TXs
6. every node commits encrypted TXs
7. when all agreed on encrypted TXs
8. run shared decryption process

9. idea: ahve a fast path protocol
  * when it stops working
  * fall back to honey badger

**THRESHOLD SIGNATURES**

**RANDOM BEACON** (BLS Signature Scheme)
* In DFINITY, each group is comprised of 400 members.
* When a group is defined, the members attempt to set up a `BLS threshold signature system` using a `distributed key generation protocol`.
* If they are successful within some fixed number of blocks, they then register the `public key ("identity")` created for their group on the global blockchain using a special transaction, such that it will become part of the set of active groups in a following "epoch".
* The network begins at "genesis" with some number of predefined groups, one of which is nominated to create a signature on some default value.
* Such signatures are random values - if they were not then the group's signatures on messages would be predictable and the threshold signature system insecure - and each random value produced thus is used to select a random successor group. This next group then signs the previous random value to produce a new random value and select another group, relaying between groups ad infinitum and producing a sequence of random values.
* see https://medium.com/asecuritysite-when-bob-met-alice/cybersecurity-magic-t-n-threshold-signatures-with-bls-b65f21ab6b15
* and https://blog.dash.org/secret-sharing-and-threshold-signatures-with-bls-954d1587b5f
* https://blog.keep.network/whats-in-a-beacon-12c34b0bc078
* https://arxiv.org/pdf/1807.09225.pdf
* https://blog.cloudflare.com/inside-the-entropy/


## BEAT Protocol
* https://www.youtube.com/watch?v=u0nypF5AIF4

## Proof-of-Finality
A piece of data that can be used to prove that a particular block is finalised. Potentially very large unless signature aggregation is used.

## Provable Finality
Some consensus mechanisms aim for provable finality, whereby all blocks are guaranteed to be the canonical block for that chain upon block inclusion. Provable finality is desirable in cases such as when light clients do not have the full chain state, or when communicating with other chains, where interchain data is not ubiquitously distributed. See: GRANDPA
* https://github.com/w3f/consensus/blob/master/pdf/grandpa.pdf


# Rhododendron
An Instant-Finality BFT consensus algorithm, one of a number of adaptions of PBFT for the blockchain. Others include Stellar's consensus algorithm and Tendermint. See the Rhododendron crate.
https://github.com/paritytech/rhododendron


# Practical Byzantine Fault Tolerance (pBFT)
An original method to address the Byzantine Generals Problem. This allows for a system tolerant to Byzantine behaviour from up to one third of its participants with an O(2N**2) communications overhead per node.



---------------------------------------------------

**Eventual finality:**
Casper Labs (CBC Finality Gadget)
AVA (Avalanche Consensus)

---------------------------------------------------


so GRANDPA could be switched for HBBFT theoretically?

JAM
no. grandpa+babe

Alexander Praetorius
oh, so you can't have BABE and then every couple of blocks ...hopefully many blocks... you run HBBFT to finalize part of the chain

JAM
babe produces blocks, grandpa finalizes them, so structurally it's different then HBBFT where you produce finalized blocks

Alexander Praetorius
but if BABE probabilistically finalizes them, you could run HBBFT later on and that's what really counts...
could you theoretically also run just GRANDPA without BABE? ...even though you would not because performance... but could you?

JAM
grandpa doesn't have any logic to produce blocks
HBBFT doesn't have any logic to assign finality to existing blocks - HBBFT and other BFT protocols *produce blocks with finality* iiuc they can't be used as finality gadgets

Alexander Praetorius
ok i see, makes sense
have you heard of BEAT3?

why was BABE & GRANDPA chosen?
How do they work or what inspired them?
Is the video you posted or another video explaining that? I'd be interested in that link too :-)

JAM
the video I posted is just about storage

Alexander Praetorius
is there one about BABE and GRANDPA?


---

I think there's a hardline on liveness that we didn't want to sacrifice that meant these traditional/established consensus mechanisms didn't work for us
because we don't want it to be possible for malicious actors to hold the network hostage
the network can continue with probabilistic finality, the attackers get punished, and we can figure out how to restart finality again

Alexander Praetorius
interesting.
do other chains use the same technique?
does every chain use a different one?
are there a handful that are used more or less by all the others?

JAM
not to my knowledge, but any chain with a finality gadget probably has the same properties
every Tendermint/Cosmos chain uses BFT consensus
and they have had their chains halt in the past due to the fact

