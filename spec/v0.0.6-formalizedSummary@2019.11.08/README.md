# datdot `v0.0.6-formalizedSummary@2019-11-12`

**=> [previous spec](../v0.0.5-summary@2019.10.29/)**
**=> [next spec](../v0.0.7-grantMergeAccept@2019.12.04/)**

---
slideOptions:
  # spotlight:
    # enabled: true
  allottedMinutes: 5
  transition: "slide" # options: none/fade/slide/convex/concave/zoom
  transitionSpeed: "fast" # options: [default/fast/slow
  # theme: "black" # black (default) - league - blood - night - moon - solarized - white - sky - beige - simple - serif
  # HELP: https://hackmd.io/slide-example#
---

# datdot
1. [context](#/1)
    * [@TODOs](#/1/1)
2. [roles](#/2)
    * [@TODOs](#/2/1)
3. [mechanics](#/3)
    * [@TODOs](#/3/1)
4. [architecture](#/4)
    * [@TODOs](#/4/1)

---


# [context](#/0)
1. [idea](#/1/2)
2. [problem](#/1/3)
3. [solution](#/1/4)
4. [issues](#/1/5)
    * [`self service attack`](#/1/6)
    * [`sybil attack`](#/1/7)
    * [`outsourcing attack`](#/1/8)
5. [fixes](#/1/9)
    * [`self service attack`](#/1/10)
    * [`sybil & outsourcing attack`](#/1/11)

----

### [TODOS: context](#/1)

**`@TODO:`** improve description
* [**`idea`**](#/1/1): improve idea description
* [**`problem`**](#/1/1): think more about potential problems
* [**`issues`**](#/1/1): think more about potential issues

----

### [idea](#/1)
**make a free p2p alternative to [hashbase.io](https://hashbase.io)**
* everyone who downloads and runs **`datdot`** offers some free disk space which is used to permanently seed hypercores datdot users submit to the `datdot` network

----

### [problem](#/1)
all it takes is a single "malicious" user, who submits enormous amounts of and/or very large hypercores to the `datdot` network to be pinned, rendering the service useless for all other honest peers.

----

### [solution](#/1)
Measure the ratio of disk space provided to dat dot over time.
If free disk space provided by all peers is not enough to seed all hypercores submitted bypeers, hypercores submitted or selected by peers with a higher ratios get prioritized.

----

### [issues](#/1)
malicious users can still cheat the `datdot` network
1. by applying a [`self service attack`](#/1/6)
2. by applying a [`sybil attack`](#/1/7)
3. or by applying an [`outsourcing attack`](#/1/8)

----

### issue [`self service attack`](#/1)
a malicious datdot user could illegitimately increase his ratio, by submitting a lot of hypercores to the datdot network and offering to seed them - essentially not providing any service to others, but increasing his ratio in order to free ride and receive service by others later on.

----

### issue [`sybil attack`](#/1)
a malicious datdot user runs many datdot clients to offer disk space for seeding hypercores with the goal to seed their own hypercores or seed the same hypercores many times, but store them only once but respond to chunk requests with data from only a single hypercore copy, thus receiving an illegitimate positive ratio

----

### issue [`outsourcing attack`](#/1)
a malicious datdot user runs only a single datdot client to offer disk space for seeding hypercores with the goal to join the corresponding hypercore swarm and receive chunks quickly just in time to respond to chunk requests from hypercore swarm peers and not storing any hypercore chunks themselves, thus receiving an illegitimate positive ratio

----

### [fixes](#/1)
malicious users can still cheat the `datdot` network
1. by applying a [`self service attack`](#/1/10)
1. by applying a [`sybil attack`](#/1/11)
2. or by applying an [`outsourcing attack`](#/1/11)

----

### issue [`self service attack`](#/1)
Assign hypercores submitted to `datdot` for seeding to random seeder peers, so peers who want to seed cannot cherry pick the chunks they want to seed.

----

### issue [`sybil & outsourcing attack`](#/1)
every copy of very chunk of every hypercore seeded by the `datdot` network should be encrypted with a private key unavailable to the seeding peers, so they can not use the `sybil` or `outsourcing` attack anymore.

---

# [roles](#/0)
* [ROLE: peer](#/2/2)
* [ROLE: seeder](#/2/3)
* [ROLE: encrypter](#/2/4)
* [ROLE: author & supporter](#/2/5)
* [ROLE: readers](#/2/6)
* [ROLE: validators](#/2/7)

----

### [TODOS: roles](#/2)

**`@TODO:`** think about names and whether to deal with traffic
* [**`names`**](#/2/2): improve names & description of all `roles`
* [**`traffic`**](#/2/2): maybe think about accounting for `traffic ratio` too?

----

### [ROLE: peer](#/2)
* anyone who downloads and runs a `datdot` client
* can take on as many other available roles in parallel as they want
* minimum and default ratio is 0 and can never drop below that

----

### [ROLE: seeder](#/2)
* opt-in to offer disk space to store submitted/selected hypercores
* receive random hypercore addresses to seed
* get assigned an improving storage ratio
    * every time a `proof of chunk(s)` challenge succeeded

----

### [ROLE: encrypter](#/2)
* `encrypter` peers get randomly selected by the network
* receive random hypercore chunks to encrypt with their private keys
* send encrypted chunks to randomly selected seeders
* get assigned an improving storage ratio
    * every time they encrypt hypercore chunks

----

### [ROLE: author & supporter](#/2)
* peers who (submit and/or select) hypercores to be seeded by random seeders
* get assigned a decreasing storage ratio while submitted/selected hypercores are seeded by seeders
    * the more peers select a submitted hypercore, the less their storage ratio is decreased while the hypercore is begin seeded

----

### [ROLE: readers](#/2)
* download hypercore chunks

----

### [ROLE: validators](#/2)
* `validator` peers get randomly selected by the network
* network randomly assigns them to [challenge](#/3/4) random seeders
* get assigned an improving storage ratio for executing challenges

---

# [mechanics](#/0)
* [reputation unit](#/3/2)
* [model](#/3/3)
* [proof of seeding](#/3/4)
* [voting](#/3/4)

----

### [TODOs: reputation units](#/3)
**`@TODO:`** decide the name of reputation units
* [**`names`**](#/3/3): select name
* [**`icon`**](#/3/3): select icon

----

### [reputation unit](#/3)
possible names for ratio
* [**`datdots`**](#) => burn datdots to have hypercores pinned
* [**`ratio`**](#) => burn good ratio to have hypercores seeded
* [**`pins`**](#) => burn pins to have hypercores pinned
* [**`seeds`**](#) => use up seeds to have hypercores seeded

negative reputation does not exist

----

### [model](#/3)

1. all peers have 0 or more reputation
2. all submitted/selected hypercores get seeded forver if possible
3. if seeders can not provide enough disk space to seed hypercores
    * existing hypercores submitted/selected by peers with lower ratio get prioritized when dropping duplicates or making them entirely unavailable
    * prioritizing means the random selection of a peer gets weighted so the likelihood of selecting a particular peer is higher

----

### [proof of seeding](#/3)
1. [`validators`](#/2/7) request random chunks from assigned seeder
2. signs and publishes results of merkle proof to network
3. joins swarm for unencrypted version of seeded hypercore
4. requests random set of chunks from seeder
5. publish latency/throughput results to network

----

### [voting](#/3)
<!-- economics/pricing -->
peers with a worse ratio getting worse guarantees about having their hypercores seeded by the datdot network

1. how much do i want to earn in terms of "ratio"?
    * for my disk space?
    * for encrypting hypercore chunks?
    * for validating chunks?
    * for receiving data?
3. how much do i offer to pay in terms of "ratio"?
    * for having my hypercores pinned?
<!--     * when you submit a hypercore you also set the price you're willing to pay for the service regarding your ratio, unless we find a way to calculate that price automatically-->

---

# [architecture](#/0)
* [sequence diagram](#/4/2)
* [description](#/4/3)

----

### [TODOS: architecture](#/4)

**`@TODO:`** ...
* [**`...`**](#/4/4): ...

----

### [sequence diagram](#/4)

```sequence
Title: === USAGE: pin dat & prevent sybil/outsource attack ===

participant hypercore consumer as CONSUMER
participant hypercore author as AUTHOR
participant hypercore supporter as SUPPORTERS
participant [dat swarm] as SWARM
participant [datdot network] as CHAIN
participant hypercore signer as SIGNER
participant hypercore pinner as PINNER
participant pinning validator as VERIFIER

Note over SUPPORTERS, AUTHOR   : usually AUTHOR might also be SUPPORTER
AUTHOR --> SWARM          : publish a hypercore [HC]
PINNER --> CHAIN          : announce willingness to pin HCs
SUPPORTERS --> CHAIN      : publish a HC address
SUPPORTERS --> CHAIN      : donate datdots to HC address
CHAIN --> SIGNER          : randomly select X SIGNERs to sign X HC copies
CHAIN --> PINNER          : randomly select X PINNERs to store signed HCs
SIGNER --> SWARM          : join dat to get & sign all hypercore chunks
PINNER --> SWARM          : join dat to get all signed chunks from SIGNER
SIGNER --> PINNER         : send all signed chunks to related PINNER
PINNER --> CHAIN          : announce retrieval success of signed chunks
CHAIN  --> SUPPORTERS     : update dashboard with successful pinning
CHAIN --> SIGNER          : mint X for successful challenge to SIGNER
Note over CHAIN           : while pinning is active, repeat regularly:
CHAIN --> PINNER          : request random signed chunk to verify
CHAIN --> VERIFIER        : randomly select verifier for PINNER
Note over VERIFIER        : Check PINNER is sending chunks to swarm and measure
VERIFIER --> SWARM        : join dat to receive random chunks from PINNER
VERIFIER --> CHAIN        : report challenge result and performance metrics
Note over CHAIN           : on success
CHAIN --> PINNER          : mint 0 or R*Y for successful challenge to PINNER
CHAIN --> VERIFIER        : mint 0 or R*Z for successful challenge to VERIFIER
CHAIN --> CHAIN           : burn 0-R*(Y+Z) of HC address for successful challenge
CHAIN --> PINNER          : update reputation R of pinner
Note over CONSUMER        : how to download data
CONSUMER --> SWARM        : join swarm to download HC from address
PINNER -> CONSUMER        : send decrypted/de-signed chunks to CONSUMER
```

----

### [description](#/4)
According to some cryptographers I talked to, the network IO is orders of magnitudes slower than the asymmetric decryption process of chunks a.k.a blocks of a hypercore, so technically it should work.

**So to summarize it again in 0-9 steps:**

----

#### [0. step](#/4)
A p2p-hashbase alternative exists with peers **`P1`** to **`Pn`**

----

#### [1. step](#/4)
Seeders **`S1`**, ...**`Sm`** publish their willingness to pin hypercores

----

#### [2. step](#/4)
**`Px`** wants their hypercore to be pinned

----

#### [3. step](#/4)
The network selects **`q`** random Seeders **`S1'`** to **`Sq'`** and random peers **`P1'`** to **`Pq'`** which are not selected seeders for the given hypercore, where **`q`** is a number of seeders and their reputation is of good enough quality to ensure a quality of service for that hypercore

----

#### [4. step](#/4)
The data flows from **`Px`** over **`P1'`** which encrypts all hypercore blocks with their private key to **`S1'`**
* also it flows from **`Px`** over **`P2'`** which encrypts all hypercore blocks with their private key to **`S2'`**
* also it ....
* also it flows from **`Px`** over **`Pq'`** which encrypts all hypercore blocks with their private key to **`Sq'`**

----

#### [5. step](#/4)
The seeding starts

----

#### [6. step](#/4)
If **`Sy'`** goes offline a new Seeder is selected and receives data from one of the remaining Seeders which have the data over a randomly selected Peer **`P`** to ensure that new Seeder again has a uniquely encrypted copy of the hypercore

----

#### [7. step](#/4)
**Challenges 1**
* In regular intervals, the network would challenge Seeders to provide one or more random chunks and the unique publicly known merkleroot of their unique copy would be used to check if the challenge response of the seeder is valid.

----

#### [8. step](#/4)
**Challenges 2**
* In regular intervals, a random peer would be selected to join the dat swarm for a pinned hypercore to retrieve unencrypted chunks to test if the seeder also serve the data and not just respond to "crypto challenges" and those peers reporting back to the network is also used to update scores of seeders regarding throughput and latency to figure out their "quality of service"

----

#### [9. step](#/4)
If **`P1`** for **`S1`** goes down in the middle of replication ... what to do?
*  start over OR continue with a different peer and their private key for remaining chunks and make a note or a list of public keys and chunks a seeder stores
* technically it doesnt even matter which chunks use which private keys, just that its publicly available information i guess
