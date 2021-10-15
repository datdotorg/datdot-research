# chain
**[main](../README.md)**

**use**
* [Substrate IDE](https://polkadot.js.org/apps/)
* [Substrate: The platform for blockchain innovators](https://github.com/paritytech/substrate)


## PALLETS
* `custom-balances`
* `datdot-economics`
* `hyper-verify`
* `sudo`


-------------------------------------------------------------------------------
### Pallet: `hyper-verify`
- randomly selects archives and emits events
- verifies data coming in from the service
- how does the node run? (docker?)

----

#### ROLES

----

### [ROLE: peer](#/2)
* anyone who downloads and runs a `datdot` client
* can take on as many other available roles in parallel as they want
* minimum and default ratio is 0 and can never drop below that

----

### [ROLE: hoster](#/2) (=seeder/pinner)
  - register to become a hoster
  - get random hypercores to host
  - they get paid for their work
* opt-in to offer disk space to store submitted/selected hypercores
* receive random hypercore addresses to seed
* get assigned an improving storage ratio
    * every time a `proof of chunk(s)` challenge succeeded

----

### [ROLE: encoder](#/2) (formerly: encrypter)
* `encoder` peers get randomly selected by the network
* receive random hypercore chunks to encode (compress) and sign it with their private keys
* send encoded chunks to randomly selected hosters
* get assigned an improving storage ratio
    * every time they encode hypercore chunks

----

### [ROLE: attester](#/2)

----

### [ROLE: author](#/2) (=creator)

----

### [ROLE: publisher](#/2) (=supporter/requester/incentivisors)
  - they submit hypercores to be pinned
  - it burns publisher tokens when their data is hosted (payment)
* peers who (submit and/or select) hypercores to be seeded by random seeders
* get assigned a decreasing storage ratio while submitted/selected hypercores are seeded by seeders
    * the more peers select a submitted hypercore, the less their storage ratio is decreased while the hypercore is begin seeded

----

### [ROLE: readers](#/2) (=consumer/leecher)
* download hypercore chunks
  - reads the data
  - may incentivise the hosting of archives they care about as a publisher
  - @TODO:
    - [ ] think about names and whether to deal with traffic
    - [ ] maybe think about accounting for `traffic ratio` too?

----

### [ROLE: validators](#/2) (=node-operators)
    - run substrate node
    - have to have enough disk space
    - reliable connection
    - get +ratio only when they seed (+ratio every time proof of storage = succesful challenge succeeds )
    - paid in freshly minted ratio
* `validator` peers get randomly selected by the network
* network randomly assigns them to [challenge](#/3/4) random seeders
* get assigned an improving storage ratio for executing challenges

----








#### proof-of-storage idea
to verify hypercores in substrate runtime
**proof of storage** feasibility:
* use public/private key asymmetric encryption
  * > According to some cryptographers I talked to, the `network IO` **is orders of magnitudes slower than** the `asymmetric decryption process of chunks` a.k.a blocks of a hypercore, so technically it should work.


###### in `block n` (for each assigned `archive m`)
1. where `randomNumber = hash(System::random_seed() + some nonce/account data + m)`
2. We need to get `feed.signature(randomNumber)` and `feed.rootHashes(randomNumber)` from `hypercore.js`

###### in `block n+x`
1. init Storage
2. call `Storage::put_node` with output of `feed.rootHashes` as the inputs and then use that `Storage` to build a feed with `FeedBuilder`)
3. verify with `Feed::verify()` in `hypercore.rs`


-------------------------------------------------------------------------------
### Pallet: `custom-balances`
Simple credit based system - by pinning you mint credits, by having your archive pinned, you burn credits.
* **maybe:** Mint amount should be > than the burn amount to solve bootstrapping.
* **maybe:** the burn amount should be defined by a market


-------------------------------------------------------------------------------
### Pallet: `datdot-economics`
Write a basic module that calls balances to mint and burn balances based on the outcomes of hyper-verify
