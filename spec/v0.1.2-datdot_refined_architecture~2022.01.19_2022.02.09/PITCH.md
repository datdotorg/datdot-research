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

## [idea](#/1)
**make a free p2p alternative to [hashbase.io](https://hashbase.io)**
* everyone who downloads and runs **`datdot`** offers some free disk space which is used to permanently seed hypercores datdot users submit to the `datdot` network


### 2. Challenges:
What if you want other people to help you seed your data?
- what incentives do they have?
- how to find them and to trust them?
- how to verify they are seed our data?

### 3. Solution:
A decentralized bridge between Hypercore Protocol and Substrate with a built-in incentive model which manages relationships between:
- datdot (hypercore) publishers
- datdot providers (hosters, ...) (who keep data available/host the data)


## [problem](#/1)
all it takes is a single "malicious" user, who submits enormous amounts of and/or very large hypercores to the `datdot` network to be pinned, rendering the service useless for all other honest peers.

----

## [solution](#/1)
Measure the ratio of disk space provided to dat dot over time.
If free disk space provided by all peers is not enough to seed all hypercores submitted bypeers, hypercores submitted or selected by peers with a higher ratios get prioritized.

----

## [issues](#/1)
malicious users can still cheat the `datdot` network
1. by applying a [`self service attack`](#/1/6)
2. by applying a [`sybil attack`](#/1/7)
3. or by applying an [`outsourcing attack`](#/1/8)

----

## issue [`self service attack`](#/1)
a malicious datdot user could illegitimately increase his ratio, by submitting a lot of hypercores to the datdot network and offering to seed them - essentially not providing any service to others, but increasing his ratio in order to free ride and receive service by others later on.

----

## issue [`sybil attack`](#/1)
a malicious datdot user runs many datdot clients to offer disk space for seeding hypercores with the goal to seed their own hypercores or seed the same hypercores many times, but store them only once but respond to chunk requests with data from only a single hypercore copy, thus receiving an illegitimate positive ratio

----

## issue [`outsourcing attack`](#/1)
a malicious datdot user runs only a single datdot client to offer disk space for seeding hypercores with the goal to join the corresponding hypercore swarm and receive chunks quickly just in time to respond to chunk requests from hypercore swarm peers and not storing any hypercore chunks themselves, thus receiving an illegitimate positive ratio

----

## [fixes](#/1)
malicious users can still cheat the `datdot` network
1. by applying a [`self service attack`](#/1/10)
1. by applying a [`sybil attack`](#/1/11)
2. or by applying an [`outsourcing attack`](#/1/11)

----

## fix [`self service attack`](#/1)
Assign hypercores submitted to `datdot` for seeding to random seeder peers, so peers who want to seed cannot cherry pick the chunks they want to seed.
In order to prevent malicious user to accumulate node pairs they control where the randomly picked seeder happened to be under their control too, re-enabeling the self-service attack, we frequently enough re-shuffle which nodes seeds which data.

----

## fix [`sybil & outsourcing attack`](#/1)
every copy of every chunk of every hypercore seeded by the `datdot` network should be encrypted with a private key unavailable to the seeder, so they can't use the `sybil` or `outsourcing` attack, thus replacing each chunk with **a recoverable signature containing the entire chunk** and merkelizing it. The random encryption is renewed frequently enough to prevent attackers from accumulating nodes where they by chance where chosen to provide the encryption key.
