# Proof Of Work
In proof-of-work systems like Bitcoin, any node may produce a block at any time, so long as it has solved a computationally-intensive problem. Solving the problem takes CPU time, and thus miners can only produce blocks in proportion with their computing resources. Substrate provides a proof-of-work block production engine.

# Slots
Slot-based consensus algorithms must have a known set of validators who are permitted to produce blocks. Time is divided up into discrete slots, and during each slot only some of the validators may produce a block. The specifics of which validators can author blocks during each slot vary from engine to engine. Substrate provides Aura and Babe, both of which are slot-based block authoring engines.
