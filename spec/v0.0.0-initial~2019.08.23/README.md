# datdot `v0.0.0-initial~2019-08-23`

* **=> [next spec](../v0.0.1-grantPreparation~2019.09.10/)**

## P2P hosting jam :-)
**use**
* [Substrate IDE](https://polkadot.js.org/apps/)
* [Substrate: The platform for blockchain innovators](https://github.com/paritytech/substrate)
* [Dat Protocol](https://www.datprotocol.com/)

---

### SRML (=modules) (=pallets)
* `balances ~~or `generic-asset`~~
* ~~`staking`~~
* `dat-verify`
* `sudo`
* ~~`service-core`~~

---

## How to use `balances`
Simple credit based system - by pinning you mint credits, by having your archive pinned, you burn credits. Mint amount should be > than the burn amount to solve bootstrapping. (the burn amount should be defined by a market)

---

## proof-of-storage idea

### in `block n` (for each assigned `archive m`)
1. where `randomNumber = hash(System::random_seed() + some nonce/account data + m)`
2. We need to get `feed.signature(randomNumber)` and `feed.rootHashes(randomNumber)` from `hypercore.js`

### in `block n+x`
1. init Storage
2. call `Storage::put_node` with output of `feed.rootHashes` as the inputs and then use that `Storage` to build a feed with `FeedBuilder`)
3. verify with `Feed::verify()` in `hypercore.rs`

---

## Action Items
* Use polkadot.js.org api and hypercore js libraries to encode and decode hypercores [let's call this adapter.js or something]
* Use dat sdk or dat-store's service.js to communicate with  adapter.js
* Use datrs (or something inspired by it) to verify hypercores in substrate runtime
* Write a basic module that calls balances to mint and burn balances based on the outcomes of dat-verify
