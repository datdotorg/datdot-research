# Fork Choice Rules
`Forks` occur when two `blocks` reference the same parent.

Forks must be resolved such that only one, canonical chain exists.

A fork choice rule is an algorithm that takes a blockchain and selects the "best" chain,
and thus the one that should be extended.
Substrate exposes this concept through the SelectChain Trait.
* https://substrate.dev/rustdocs/pre-v2.0-3e65111/sp_consensus/trait.SelectChain.html

Substrate allows you to write
* a custom fork choice rule
* or use one that comes out of the box

For example:

# Longest Chain Rule
The longest chain rule simply says that the best chain is the longest chain.
Substrate provides this chain selection rule with the LongestChain struct.
`GRANDPA` uses the longest chain rule for voting.
* https://substrate.dev/rustdocs/pre-v2.0-3e65111/sc_client/struct.LongestChain.html

# GHOST Rule
The Greedy Heaviest Observed SubTree rule says that, starting at the genesis block, each fork is resolved by choosing the branch that has the most blocks built on it recursively.