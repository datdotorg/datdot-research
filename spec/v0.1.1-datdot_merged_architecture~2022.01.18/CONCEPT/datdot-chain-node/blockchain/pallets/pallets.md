# FRAME
https://substrate.dev/docs/en/conceptual/runtime/frame#im-online

# PALLET MARKETPLACE
https://substratemarketplace.com/


# PALLET (=SRML - Substrate Runtime Module Library)
An extensible, generic, configurable and modular system for constructing runtimes and sharing reusable components of them. Broadly speaking, this corresponds to the second usage paradigm of Substrate, higher-level than using Substrate Core, but lower-level than simply running Substrate Node with a custom configuration.

# Storage Items
* `PALLETS` have `storage items` which are a means of providing `type-safe persistent data` for the `runtime`
* achieved with a `compiler macro`, the `parity-codec crate` and the `State API`.
* All storage items must have a `type` for which the `parity-codec::Codec trait` is implemented
  * and, if they have a corresponding `JSON Genesis Configuration entry`, then also the `serde traits`


### `pallet`s (= runtime modules)
offer features and each `pallet` has:
* `types`
* `storage items`
* `functions`

https://substrate.dev/rustdocs/master/sp_api/index.html

https://github.com/playproject-io/datdot-substrate/blob/ac0e44e02c34c454c7bda58eee855de2054e34a4/bin/node/runtime/src/lib.rs#L569

=> 11 functions to implement
you could theoretically just make a rust module that is just that macro and those impls and have all of your logic there because you can create and use other apis between the client and the runtime - things like querying storage, or other rpc queries, and controlling consensus or networking from within the runtime

# PALLETS
```rs
/// imports:
/// substrate client (sc_)
/// substrate primitives (sp_)
/// ...
use sp_std:: ...
use sp_runtime:: ...
/// frame (frame_)
use frame_support:: ...
use frame_system:: ...

pub trait Trait: frame_system::Trait {
  /// The overaching event type
  type Event: From<Event<Self>> + Into<<Self as frame_system::Trait>::Event>;
  /// A sudo-able call
  type Proposal: Parameter + Dispatchable<Origin=Self::Origin>;
}

// Rust Macros in Substrate to define a custom Domain specific language
decl_module! { } // extrinsics = callable functions into your runtime pallet
decl_event! { } // all events which possibly get emitted
decl_storage! { // all storage items for your pallet
  trait Store for Module<T: trait> as Sudo {
    /// The `AccountId` of the sudo key
    Key get (fn key) config(): T::AccountId;
  }
}
decl_error! { } // all possible errors

// @NOTE: all macros are defined by the `support` pallet
```


# PALLETS - https://github.com/paritytech/substrate/tree/master/frame
1. Assets
2. Aura
3. Balances - balances & accounts (e.g. "crypto currencies") => account based currency
  * implements Currency
  * LockableCurrency
  * ReservableCurrency
  * TransactionPayment
  * Supports Vesting, ED. (vesting schedules from genesis)
  * ED (existential deposit)
    * mitigate problem of "dust accounts"
    *
4. Consensus - how onchain authorities interact with consensus algorithm
5. Contract
 * webassembly smart contracts
 * resource tracking (gas counting)
 * sandboxed execution
 * dispatch calls in runtime
 * call other contracts
 * enlightened state-rent
   * e.g. as long as you store funds in the contract, state-rent is paid for
 * UA-storage
   *
6. Democracy - stakeholder voting
  * privileged referendum dispatcher
    * can call any function (e.g. multisig style?) as `sudo`
  * LockableCurrency based
  * Priority-queue proposals
    * public can place proposals (=dispatches)
      * which require `sudo` (e.g. `set_code()`)
  * Lock-voting
    * prioritized by amounts which are backing a proposal
      * put down minimum amount
    * time goes on proposals are put to a vote
      * `2 weeks` minimum funds lock time
      * the longer, the more weight the vote has
  * Delayed-enactment
    * after successful vote there is an enactement time
      * e.g. `2 weeks` which those who did not approve can use
      * to leave the chain and go elsewhere (=`rage quite`)
  * Proxy/Delegation-voting
    * proxy voting (let another account decide) - not transitive
      * e.g. cold wallet delegates voting power
    * transitive proxy voting
  * AQB modal approvals
    * how votes should be counted
    * how approval should look like
7. Finality Tracker
8. Grandpa
9. Indices    - short-form account identifier
  * maintains one index per active account
  * allow account index to be used to ID account in transactions
10. Council
  * secondary governance body
  * currency based
  * PR rotating approval vote
  * provides council origins (can be used in other modules)
    * e.g. like a `minister origin`
  * similar to democracy
11. Session   - certificate registry for authority/validator executive keys
  * will support arbitrary key tuple
    * configure in central `lib.rs` file
  * changes only on session-boundaries
    * keys only change at the boundary point and then change
      * them all at the same time (e.g. a blocknumber?)
  * to sign statements/blocks/
  * also so people don't get their cold wallets selected
     * to become validator

12. Staking   - deposits
  * very complex module
  * don't need to worry about it in PoA chain
  * Authority selector based on currency at stake
    * works with LocableCurrency
    * highly configurable
    * NPoS (nominated proof of stake)
      * splits nominators (lend funds to validators)
        * from validators (who sign and produce blocks)
      * has rewards and slashing on locked balances
        * ensures locked balances
13. Sudo      - key privilege certificate (dictatorship)
  * ...
14. Timestamp - Wall-clock time
  * simple wall-clock oracle
15. Treasury  - overseen funds provisioning
  * pyblic proposal
  * council origin approval & rejection

# COUNCIL PALLET
* stake-weighted referenda (voting with one-vote-per-token, rather than one-vote-per-head)
  * allows polkadot to evolve over time
  * each has specific proposal which may include `set_code`
  * start as `public referenda` or `unanimous council` or `majority council`
    * => adaptive quorum biasing
      * few participants have to hold their vote longer than many
  * public referenda pass with `positive turnout bias`
* approval-voted council
  * DOT holders `propose` + `sponsor` the `public motions`
  * most `sponsored` tabled periodically
  * `weighted voting` happens using `AQB` for enough time
    * to successfully decide and then staked DOTs go back to owners
    * referenda pass with `positive turnout bias`
  * also `DOT holders` `approval vote` for `council members`
    * `council` can propose `sensible referenda` and `members`
      * can `veto` proposals once (= `cancel` them)
      * represent `passive stakeholders`
      * unanimous council referenda pass with `negative turnout bias`
        * (= low turnout -> high majority of public to prevent)
        * (= high turnout -> low majority of public to prevent)
      * majority council referenda pass with `neutral turnout bias`
  * `genesis` has 6-12 `council members`
    * `DOT members` vote for rotating `council members`
    * `users` vote with `unbounded DOTs`
    * every `2 weeks` a seat is up for election
    * users choose from `candidate list` via `approval vote`
    * `runners-up` remain on `candidates list` for `next election`
* endowed treasury

## `AQB` adaptive quorum biasing
* means of specifying a quorum needed for
  * a proposal to pass
  * based on voter turnout
* positive bias
  * => requires

# FUTURE FEATURES
* off-chain workers (CPU, network, secure-storage, IPFS)
  * use resources of the nodes in the network
  * e.g. arbitrary sets of off-chain workers
    * use secure-storage + shamirs secret
    * come together to combine key to sign something
* indexable events
  * e.g. balance transfers into particular accounts
  * e.g. governance actions
* Fee abstractions (block weight, rewards)
  * split fees between block authors, treasury, burning it, ...
  * fees collected for different reasons
* cumulus/polkadot piggyback consensus
  * allow substrate chain to use polkadot consensus
* on-chain parallelism
  * ...

# RUNTIME PALLETS
* assets
* aura
* balances
* consensus
* contract
* council
* democracy
* executive
* fees
* grandpa
* indices
* metadata
* session
* staking
* sudo
* system
* timestamp
* treasury
* upgrade-key

# OTHER PALLETS
* registrar - register your chain onto the current chain & track
* parachains - execution & validation logic + msg passing + stores latest
                * para-head block
                * runtime code
* slots - execute parachain auction + manage parachain slots
* crowdfunding - community crowdfunds your parachain auctions
                * tracks community contributions

# Auction Pallet (e.g. for parachains)
* candle auction
  * bidding until at random time the auction ends
  * auction happens once
  * is about 2 year slot
  * split into 4 parts a 6 months
  * DOTs are returned at end of lease
  * everyone bids and at end retroactively VRF determines winning time
  * one msg process, rather than commit-reveal-2-msg-process
