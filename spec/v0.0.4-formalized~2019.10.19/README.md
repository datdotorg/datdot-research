# datdot `v0.0.4-formalized~2019-10-19`
(prepared between `2019-10-17 and 2019-10-19`)

**=> [previous spec](../v0.0.3-refined~2019.10.15/)**
**=> [next spec](../v0.0.5-summary~2019.10.29/)**

## ADD IDEA OF `supporters`
- data consumers (public)
  - reads the data
  - may incentivise the hosting of archives they care about.
* **challenge:**
  - it burns [incentivisors] ~~creators~~ tokens when their data is pinned (payment)

## Performance optimization idea:
* Instead of SIGNER encrypting chunks with their private key,
 they encrypt each chunk with a new random secret key,
 and then encrypt that secret key with their private key and prepend it to the chunk it decrypts
 (consider: they also prepend their public key)  - a new merkle tree is calculated for these
 prefixed-chunks, which is used for challenge-responses.
* **COUNTERPOINT:** the pinners can decrypt the secret key a single time,
 and from then on outsource the data from the Dat network.
 In order to respond to challenges, they will need to have calculated the merkle tree at least once,
 but after that they can just keep the key and tree and dump the majority of the chunk data.

## datdot "architecture" as SEQUENCE DIAGRAM (first draft)
To see the `sequence diagram` use `mermaid` as supported by https://hackmd.io by copy and pasting the below code snippet:

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

**proof of storage** feasibility:
* use public/private key asymmetric encryption
  * > According to some cryptographers I talked to, the `network IO` **is orders of magnitudes slower than** the `asymmetric decryption process of chunks` a.k.a blocks of a hypercore, so technically it should work.

---

**formalization:**
1. A p2p-hashbase alternative exists with peers `P1` to `Pn`
2. Seeders `S1`, ...`Sm` publish their willingness to pin hypercores
3. `Px` wants their hypercore to be pinned
4. The network selects `q` random Seeders `S1'` to `Sq'` and random peers `P1'` to `Pq'` which are not selected seeders for the given hypercore, where `q` is a number of seeders and their reputation is of good enough quality to ensure a quality of service for that hypercore
5. The data flows from `Px` over `P1'` which encrypts all hypercore blocks with their private key to `S1'`
    * also it flows from `Px` over `P2'` which encrypts all hypercore blocks with their private key to `S2'`
    * also it ....
    * also it flows from `Px` over `Pq'` which encrypts all hypercore blocks with their private key to `Sq'`
6. The seeding starts
7. If `Sy'` goes offline a new Seeder is selected and receives data from one of the remaining Seeders which have the data over a randomly selected Peer `P` to ensure that new Seeder again has a uniquely encrypted copy of the hypercore
8. The Challenges:
    * In regular intervals, the network would challenge Seeders to provide one or more random chunks and the unique publicly known merkleroot of their unique copy would be used to check if the challenge response of the seeder is valid.
    * In regular intervals, a random peer would be selected to join the dat swarm for a pinned hypercore to retrieve unencrypted chunks to test if the seeder also serve the data and not just respond to "crypto challenges" and those peers reporting back to the network is also used to update scores of seeders regarding throughput and latency to figure out their "quality of service"
9. If `P1` for `S1` goes down in the middle of replication ... what to do?
    *  start over OR continue with a different peer and their private key for remaining chunks and make a note or a list of public keys and chunks a seeder stores
    * technically it doesnt even matter which chunks use which private keys, just that its publicly available information i guess
