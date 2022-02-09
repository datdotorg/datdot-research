* [**GRANDPA**](https://github.com/w3f/consensus/blob/master/pdf/grandpa.pdf)
* (GHOST-based Recursive Ancestor Deriving Prefix Agreement)
* a finality gadget
* the idea of incorporating the blockchain’s structure into the consensus algorithm.
* a block valid implies that a block’s parent is valid, and so on

Here is a simplified explanation of the algorithm:

* rather than voting on a single block
* we allow participants to vote on the highest block they think is valid
* and the algorithm transitively applies the vote to all ancestors of that block

* The algorithm then determines the best block which has a >⅔ supermajority amount of votes
* and produces a proof-of-finality by taking the supermajority votes
* and bundling them up together into a single message
* Signature aggregation can be used to make this smaller

* GRANDPA is also adaptive
* it can finalize a new block regardless of how many blocks have passed since the last block was finalized
* If network latencies are low, GRANDPA can finalize blocks almost instantly, and when recovering from a long network partition, GRANDPA can finalize millions of blocks at once without any message overhead
* The operation of finding a common prefix of the blockchain which all participants can agree upon is transformed into a voting procedure which quickly finds the common prefix

* Voting in GRANDPA happens off-chain, and finality is not registered on-chain.

* However, GRANDPA participants are staked on-chain, and conflicting proofs of finality will lead to “equivocating” or double-voting participants to be discovered and punished.

* The procedure for discovering which participants equivocated will be described in a future post, and consists of a challenge-response protocol off-chain, which succeeds as long as at most ⅔ of participants are malicious.

* GRANDPA is only secure as long as historic participants are on the hook for their punishment, and thus falls into the “weak subjectivity” model of security, where participants have to go through a fairly long withdrawal period (perhaps a few months) in order to unlock their stake and reap their rewards. As long as users of the system update periodically to the latest set of consensus participants, they will remain secure.

* This is just a teaser of GRANDPA. The next articles will, among other things, dive into its inner workings, how GRANDPA provides accountable safety, liveness, deals with dynamic validator sets, benchmarking performance, and more.
