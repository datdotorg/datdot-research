# datdot `v0.0.3-refined@2019-10-15`
(prepared between `2019-10-10 and 2019-10-15`)

**=> [previous spec](../v0.0.2-grantProposal@2019.09.18/)**
**=> [next spec](../v0.0.4-formalized@2019.10.19/)**

## ADD IDEA OF `supporters`
(first mentioned on 9th of October 2019)
  * > pinning could of course also be crowd funded
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
