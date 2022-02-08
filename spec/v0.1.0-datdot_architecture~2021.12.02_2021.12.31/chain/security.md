# security
**[main](./README.md)**

## mitigate possible attacks


```sequence
Title: === USAGE: pin dat & prevent sybil/outsource attack ===

participant hypercore consumer as CONSUMER       // dat reader
participant hypercore author as AUTHOR
participant hypercore supporter as SUPPORTERS   // also publisher -> decide on price/priority on publish
participant [dat swarm] as SWARM
participant [datdot network] as CHAIN           // substrate node
participant hypercore signer as SIGNER
participant hypercore pinner as PINNER          // also hoster
participant pinning validator as VERIFIER       // verifiying mints tokens for hosters and burns tokens for supporters

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


### [description/formalization](#/4)
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
