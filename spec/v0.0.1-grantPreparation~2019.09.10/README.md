# datdot `v0.0.1-grantPreparation~2019-09-10`

* **=> [previous spec](../v0.0.0-initial~2019.08.23/)**
* **=> [next spec](../v0.0.2-grantProposal~2019.09.18/)**

# GRANT - Filecoin for Dat protocol
- substrate node
    - randomly selects archives and emits events
    - verifies data coming in from the service
    - how does the node run? (docker?)
- javascript service
    - listening for events on the node
    - submitting data to the node (proofs and archives)
- UI
    - registering availability and requesting pinning

---

### Actors
- **pinners (seeders)**
    - register to become pinners
    - get random dats to pin
    - they get paid for their work
- **dat creators (requestors)**
    - they submit dats to be pinned
- **node operators (should be seeders)**
    - run substrate node
    - have to have enough disk space
    - reliable connection
    - get paid only when they seed (proof = succesful challenge )
    - paid in tokens (minted when each payment needs happen)
- **data consumers (public)**
    - reads the data

---

### challenge
- responding with the merkle proof from the dat archives

### tokens
- minted if you are seeding (earning)
- it burns creators' tokens whe their data is pinned (payment)

### price/economic part
- when you submit the dat you also decide how much you're willing to pay
- priority: who pays more? who has more tokens (coz they are good pinners)?

---

## milestones

#### Month 1
- no economics
- no UI
- substrate logic (node)
- js service that reacts to the node

#### Month 2
- add UI
- implement basic economic model
- community test

#### Month 3
- improving economic model
- documentation

---

## Pitch

### Problem:
**Dynamic datasets** with immutable history - it's hard to have guarantees about their availability.

If we want to keep data available and up to date -> we have to keep our computer running or we have to rent a server.

### Challenges:
What if you want other people to help you seed your data?
- what incentives do they have?
- how to find them and to trust them?
- how to verify they are seed our data?

### Solution:

**Subtrate node**
- Enables arbitrary logic on
- without having to rely on centralized party
