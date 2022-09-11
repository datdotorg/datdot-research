---
slideOptions:
  # spotlight:
    # enabled: true
  # allottedMinutes: 5
  transition: "slide" # options: none/fade/slide/convex/concave/zoom
  transitionSpeed: "fast" # options: [default/fast/slow
  # theme: "black" # black (default) - league - blood - night - moon - solarized - white - sky - beige - simple - serif
  # HELP: https://hackmd.io/slide-example#
---


# DATDOT HOSTING SERVICE PITCH

@TODO: check https://hackmd.io/s/how-to-create-slide-deck

@TODO: https://github.com/playproject-io/datdot-substrate/issues/12#issuecomment-569041754

---

# [datdot roadmap](https://hackmd.io/@serapath/Hy8W0srar#/)
1. [context](#/1)
2. [roles](#/2)
3. [mechanics](#/3)
4. [architecture](#/4)

---

# [context](#/0)
1. [idea](#/1/1)
2. [problem](#/1/2)
3. [solution](#/1/3)
4. [issues](#/1/4)
    * [`self service attack`](#/1/5)
    * [`sybil attack`](#/1/6)
    * [`outsourcing attack`](#/1/7)
5. [fixes](#/1/8)
    * [`self service attack`](#/1/9)
    * [`sybil & outsourcing attack`](#/1/10)


---

# MARKETING PITCH

The precarious Web
walled gardens, facebook you-are-now-leaving-the-facebook-sector warnings, free basics

many kinds of fragmentation on many layers [slate], we'll discuss specific kinds

content that falls off the internet (domain owner change, link structure change, acquisition, censorship)

content that has copies in many locations, which are all hidden in favor of the original address

lack of content integrity

lack of a concept of changing content. it changes regardless.

ownership

location-addressing gives control over data to those entities who already have enough resources for server + bandwidth + domain + certificates
control its liveness through hosting it (whether it's allowed to continue to exist and be available)
and through not being able to address replicated copies in the network
control its truth, by controlling the request path
location-addressing ties linked content to only to one entity, but also to exactly one transport mechanism
this is part of the addressing rift
huge liability of not being able to upgrade and mix transports
history of the url shows you have only very small window (~2yrs) for fundamental changes




---


## Pitch: filecoin for dat/hypercore
bridge (between Dat Protocol and Substrate)
* but also includes a new runtime module
* The result will be able to run as a parachain or parathread
* would enable access to large file storage to substrate

### 0. intro
**Filecoin**
is an incentivisation layer for IPFS
It can replace things like CDNs and file hosting services
Has a stronger focus on reliability and industrial use cases
Filecoin is a single network and coin

**Datot**
is an incentivisation layer for hypercore
It can replace things like CDNs and file hosting services
It can replace *general* web hosting services too
It can be used for livestreams
Has a stronger focus on community and social use cases
DatDot is a library to create any number of networks with their own coins which can communicate with each other

### 1. Problem:
**Dynamic datasets** with immutable history - it's hard to have guarantees about their availability.
If we want to keep data available and up to date -> we have to keep our computer running or we have to rent a server.

---

### [idea](#/1)
**make a free p2p alternative to [hashbase.io](https://hashbase.io)**
* everyone who downloads and runs **`datdot`** offers some free disk space which is used to permanently seed hypercores datdot users submit to the `datdot` network

---

### 2. Challenges:
What if you want other people to help you seed your data?
- what incentives do they have?
- how to find them and to trust them?
- how to verify they are seed our data?

### 3. Solution:
A decentralized bridge between Hypercore Protocol and Substrate with a built-in incentive model which manages relationships between:
- datdot (hypercore) publishers
- datdot providers (hosters, ...) (who keep data available/host the data)

---

### [problem](#/1)
all it takes is a single "malicious" user, who submits enormous amounts of and/or very large hypercores to the `datdot` network to be pinned, rendering the service useless for all other honest peers.

----

### [solution](#/1)
measure the ratio of disk space provided to dat dot over time.
If free disk space provided by all peers is not enough to seed all hypercores submitted by peers, hypercores submitted or selected by peers with a higher ratios get prioritized.

----

## [issues](#/1)
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

## [fixes](#/1)
malicious users can still cheat the `datdot` network
1. by applying a [`self service attack`](#/1/10)
1. by applying a [`sybil attack`](#/1/11)
2. or by applying an [`outsourcing attack`](#/1/11)

----

### fix [`self service attack`](#/1)
Assign hypercores submitted to `datdot` for seeding to random seeder peers, so peers who want to seed cannot cherry pick the chunks they want to seed.
In order to prevent malicious user to accumulate node pairs they control where the randomly picked seeder happened to be under their control too, re-enabeling the self-service attack, we frequently enough re-shuffle which nodes seed which data.

----

### fix [`sybil & outsourcing attack`](#/1)
every copy of every chunk of every hypercore seeded by the `datdot` network should be encrypted with a private key unavailable to the seeder, so they can't use the `sybil` or `outsourcing` attack, thus replacing each chunk with **a recoverable signature containing the entire chunk** and merkelizing it. The random encryption is renewed frequently enough to prevent attackers from accumulating nodes where they by chance where chosen to provide the encryption key.


Storing asymmetric encrypted data is ~50% larger
* https://crypto.stackexchange.com/questions/5782/why-is-asymmetric-cryptography-bad-for-huge-data

=> brotli or otherwise compress data uniquely

https://stackoverflow.com/questions/37614410/comparison-between-lz4-vs-lz4-hc-vs-blosc-vs-snappy-vs-fastlz


---

# [roles](#/0)
* **[ROLE: peer](#/2/1)**
* [ROLE: seeder](#/2/2)
* [ROLE: signer](#/2/3)
* [ROLE: author & supporter](#/2/4)
* [ROLE: attestors](#/2/5)
* *[ROLE: reader](#/2/6)*

----

### **[ROLE: peer](#/2)**
* anyone who downloads and runs a `datdot` client
* can take on as many other available roles in parallel as they want
* minimum and default ratio is 0 and can never drop below that

----

### [ROLE: seeder](#/2)
* opt-in to offer disk space to store submitted/selected hypercores
* receive random hypercore address chunks to seed
* get assigned an increased RATIO
    * every time a `proof of chunk(s)` challenge succeeded

----

randomly select X*r pinners (r = redundancy factor)

* what is the best way for the pinner to receive signed chunks

=> many pinners (seeder) will receive chunks for the same hypercore,
but signed with different keys

* how did ratio work in torrents?


2. the seeder needs to submit



PROOF of SERVICE
= PROOF of STORAGE
  + PROOF OF RETRIEVABILITY

PROOFER = SEEDER
=> runs encoding on piece of data

encoding is slow,
so its possible to detect if they generate data


proof of storage achievable via:
=> inefficient unsealing
=> inefficient data extraction

=> fast unsealing (with e.g. zig zag)
==> fast data extraction



----

### [ROLE: signer](#/2)
* `signer` peers get randomly selected by the network
* receive random hypercore chunks to encrypt with their private keys
* send encrypted chunks to randomly selected seeders
* get assigned an increased RATIO
    * every time they encrypt hypercore chunks

----


1. so, when a signer is selected at random, we tell them which compression parameters
to use for compressing chunks and those params are always unique per seeded copy.

verifiable time-delay function
=> one where verification happens with fast decoding


invertable verifiable delay functions


for each chunk select random signer

overhead of connecting and finding a signers
should not be unreasonable large
compared to signing chunks.

maybe its more efficient to have signers always
sign a bunch of chunks and not just a single one


----

### [ROLE: author & supporter](#/2)
* peers who (submit and/or select) hypercores to be seeded by random seeders
* get assigned a decreasing storage ratio while submitted/selected hypercores are seeded by seeders
    * every time a `proof of chunk(s)` challenge succeeded
    * the more peers select a submitted hypercore, the less their storage ratio is decreased while the hypercore is begin seeded

----

### [ROLE: attestors](#/2)
* `attestor` peers get randomly selected by the network reoccuringly
* network randomly assigns them to [challenge](#/3/1) random seeders
* get assigned an increased RATIO
    * every time a `proof of chunk(s)` challenge succeeded

----

### *[ROLE: reader](#/2)*
* download hypercore chunks

---

# [mechanics](#/0)
* [proof of seeding](#/3/1)
* [ratio](#/3/2)
* [mechanism](#/3/3)

----

### [proof of seeding](#/3)
[Network IO is orders of magnitudes slower than asymmetric decryption of hypercore chunks](https://gitter.im/datproject/discussions?at=5da8793c57c2517c6a253554)
1. [`attestors`](#/2/5) request random chunks from assigned seeder
2. signs and publishes results of merkle proof to network
3. joins swarm for unencrypted version of seeded hypercore
4. requests random set of chunks from seeder
5. publish latency/throughput results to network

----

### [ratio](#/3)
* is a non-negative property of every peer
* can be transfered to selected peers
* is decreased if a peer uses datdot to seed hypercores
* is increased if a peer serves disk space to datdot by seeding hypercores

---

### [mechanism (="voting model)](#/3)

<!-- economics/pricing -->
1. how much do i want to earn in terms of "ratio"?
    * for my disk space?
    * for encrypting hypercore chunks?
    * for validating chunks?
    * for receiving data?
3. how much do i offer to pay in terms of "ratio"?
    * for having my hypercores pinned?

### traffic
* traffic is free

ratio derives from measurable aspects, e.g.
  - we might incentivize ratio gain in underrepresented regional areas

**traffic ratio**
1. nobody needs to pay for traffic, but every node stores few chunks of all and network rebalances so the load on each node is aprox. equal or changes on re-shuffles
2. increase ratio based on average throughput, so seeders in times of many downloads gain more ratio which also incentivizes more seeders and disincentivizes leeching attacks


---

#### sub slides [mechanism]


EVENTS:
1. new hypercore addresses in datdot network
2. changes in seeding of specific hypercore adress (more less duplication)
3. updates in chunks of specific hypercore adress

API:
1. query for any or all hypercores addresses and seeding and other related data about them

FUTURE FEATURES:
1. regional markets & latency optimization
2. deduplication of chunks
3. (erasure coding?)

---

## [block production](#?)
So if i try to summarize:

1. a malicious attacker can run lots of modified datdot nodes to censor the network and in case of "critical mass" render not the friend mechanism but the public network mechanism unuseable - but in that case they can also "print" themselves ratio ...it's the worst case scenario, but it costs a lot of resources too
2. rewarding block producers with ratio will not prevent (1.)
3. block production is free of costs
4. epoch length and rule to join "validator set" is necessary and probably choosing a good rule can make the network marginally more reliable, but i even wonder if that is important - skipping blocks from time to time is probably not even really noticeable, but ok :-) ...lets try to make things nice
5. other than the attack (1.), an attacker can't benefit from opting out of block production or producing invalid blocks - and often a "fallback" might even prevent the skipped block - and even if a block is skipped, then it just takes 6 more seconds to include extrinsics in the next block. ...so a minor delay
finality helps us to keep the chain short, because we can discard data, right?

default epoch: 600 slots
default mechanism for finality: GRANDPA (goal: balance between chain storage vs. finality syncing costs)
default block production mechanism: BABE (select random block producers + 1+ fallbacks from validator set)
validator set: optimize for reliability


AND

so we might wanna add that too and balance between:
1. chain length (needed data storage)
2. cost of syncing with all attestors to reach finality

...is there already a good default or an optimum that adapts to the amount of attestors?
and whats the default mechanism to add somebody to the validator set? ...like for people who kind of don't care, because in my current opinion, block producers dont have costs and cant abuse the mechanism to gain in any way directly from that act and even indirect gains are extremely difficult or maybe impossible to achieve. ...so why not:
1. chose something as liberal as possible
2. to optimize for "reliability"
3. and not reward block producers for producing blocks
4. and not require any staking or punishment either

...and lets see if that works :-)

yes - and the dynamic set would probably have the goal to have the system as "stable/reliable" as possible in absence of any other goals i guess... but if there is no research yet, then we can just go with an easy mechanism, like adding any peer as soon as they come online and removing them once they go offline ...and if we figure out adding/removing creates overhead, maybe we can slightly optimize our simple best guess


---

### [pricing](#...)

PRICING:

- bandwidth
- tcp transport layer throttles speed to match bottleneck
- overflow dropped packages indicate and trigger the slowing down
- algos: "slow start", "fast retransmit"
-
encryption: CPU+RAM

https://www.sciencedirect.com/science/article/pii/S2352864818302001
* decrytion: 80-160ms per KB
* encryption: 140-230ms per KB
* => 2.50 GHz Intel Core i5 Processor and 8 GB RAM
* 8KB: 700-725ms
*

## AVERAGE (AWS/AZURE/GOOGLE)

#### 1. [FUNCTION INVOCATION][1]
* AWS   : $0.000000200 / invocation
* AZURE : $0.000000200 / invocation
* GOOGLE: $0.000000400 / invocation
* **AVERAGE:** $0.000000266 / invocation

#### 2. EXECUTION TIME: RAM (GB-s) (=memory) + CPU (GHz-s) (=compute)
* [AWS   : $0.00001667 execute/s][2]
* [AZURE : $0.00001600 execute/s][3]
* [GOOGLE:][4]
    * GB-seconds price: $0.0000025 MEMORY
    * GHz-second price: $0.0000100 CPU
* **AVERAGE:** $0.00001500 execute/s

#### 3. [BANDWIDTH:][5]
* AWS   : $0.09/GB (inbound egress) + free (outbound ingress)
* AZURE : $0.09/GB (inbound egress) + free (outbound ingress)
* GOOGLE: $0.12/GB (inbound egress) + free (outbound ingress)
* **AVERAGE:** $0.10/GB (inbound egress) + free (outbound ingress)

#### 4. [STORAGE][6]
* [AWS   : $0.0230 per 1 GB/months][7]
* [AZURE : $0.0184 per 1 GB/months][8]
* [GOOGLE: $0.0260 per 1 GB/months][9]
* **AVERAGE:** $0.0224 per 1 GB/months

[1]: https://dashbird.io/blog/ultimate-serverless-benchmark-2019/
[2]: https://aws.amazon.com/lambda/pricing/
[3]: https://azure.microsoft.com/en-us/pricing/details/functions/
[4]: https://lumigo.io/aws-lambda-cost-guide/
[5]: https://www.nefiber.com/blog/cloud-egress-charges/
[6]: https://cloud.google.com/compute/disks-image-pricing
[7]: https://aws.amazon.com/s3/pricing/
[8]: https://azure.microsoft.com/en-us/pricing/details/storage/blobs/
[9]: https://cloud.google.com/storage/pricing


**`TOTAL COSTS`** = `INVOCATION` + `EXECUTION TIME` + `BANDWIDTH` + `STORAGE`

---

### [game theory](#...)


**MOVES:**
- region markets or region optimization or friend ratios

when you submit a hypercore you also set the price you're willing to pay
for the service regarding your ratio, unless we find a way to calculate that price automatically

**DIMENSIONS:**
1. Disk Space
2. Latency (multifacetted, regional)
3. Upload (throughput/traffic)
4. Download (throughput/traffic)
5. Chunk Encryption
6. Validation
7. decryption

**MODEL:**
1. all peers have 0 or more ratio
2. all hypercores get seeded forever if possible
3. if seeders can not provide enough disk space to seed hypercores
    * existing hypercores submitted/selected by peers with lower ratio get prioritized when dropping duplicates or making them entirely unavailable
    * prioritizing = the random selection of a peer gets weighted so the likelihood of selecting a particular peer is higher
4. peers with a worse ratio getting worse guarantees for having their hypercores seeded by the network

### EXAMPLE `PEER`
1. **A**
```javascript
const peer = {
  name: 'A',
  ratio: {
    datdot1: {
    /*disk storage*/mb: [20, 10],
    /*traffic troughput*/net: { /*upload*/ul: [5, 3], /*download*/dl: [6, 2] },
    /*(de/en)cryption*/ crypt: [50, 30],
    /*validation*/ crypt: { en: [], de: [] },
    }
  }
}
```
// how

1. how much disk space is required by all hypercores?
2. how much upload is required by all readers?
3. how much download is required by all seeders?
4. how much compute is required for encryption/decryption vs. friends?
5. how much upload/download is required by attestors?
6. what about regional constraints?

---

# [architecture](#/0)
* [description](#/4/1)
* [sequence diagram](#/4/12)

----

### [description](#/4)
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
*

----

### [sequence diagram](#/4)

see: https://hackmd.io/yX5MjAyORUCWs-2xBJhVsQ
also see: https://hackmd.io/3wUae9JDRMmS1zQesToMcg

