# context
**[main](./README.md)**

## [idea](#/1)
**make a free p2p alternative to [hashbase.io](https://hashbase.io)**
* everyone who downloads and runs **`datdot`** offers some free disk space which is used to permanently seed hypercores datdot users submit to the `datdot` network

----

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
