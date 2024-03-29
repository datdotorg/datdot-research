# datdot `v0.0.2-grantProposal~2019-09-18`
(prepared between `2019-09-13 and 2019-09-18`)
**accepted:** `8th of October 2019`

* **=> [previous spec](../v0.0.1-grantPreparation~2019.09.10/)**
* **=> [next spec](../v0.0.2-grantProposal~2019.09.18/)**

## APPLICATION
* [playproject-io/Web3-collaboration application fork](https://github.com/playproject-io/datdot-application-2019-11-25/blob/8af3b6f87c6f3da4141b7964f902be2d908c6f38/grants/targeted/datdot.md)
* https://github.com/w3f/Web3-collaboration/pull/178
    * https://github.com/w3f/Web3-collaboration/commit/daafd78414e49b8fc6a57282ec7fed129fd038d8


### Email address
ninabreznik at gmail dot com

### Name of lead applicant
Alexander Praetorius
**other applicants**
- Nina Breznik
- Joshua Mir

### What is the name of your project?
DatDot

### What is the your project type?
> e.g. wallet, runtime modules, parachain, deployment tooling

bridge (between Dat Protocol and Substrate)
* but also includes a new runtime module
* The result will be able to run as a parachain or parathread
* would enable access to large file storage to substrate

**we are building filecoin for dat**

**Dynamic datasets** with immutable history - it's hard to have guarantees about their availability.
If we want to keep data available and up to date -> we have to keep our computer running or we have to rent a server.


**Challenges:** What if you want other people to help you seed your data?
- what incentives do they have?
- how to find them and to trust them?
- how to verify they are seeding your data?

**Solution:**
A bridge between Dat Protocol and Substrate with a built-in incentive model which manages relationships between:
- dat creators
- dat pinners (who keep data available/host the data)

We are interested in creating this project, because we have experience developing solutions based on dat
and other projects we worked on in the past need to be improved by making data more available.
A solution like `datdot` seems a good candidate to solve that problem

## Development Roadmap
#### Milestone 1 (Month 1)
**Implement basic JS & Substrate logic**

1. We will be using SRML for `balances`, `sudo` and write our own module `dat-verify` (=substrate logic (node))
    * it will verify `hypercores` in substrate runtime
    * we will use [datrs](https://datrs.yoshuawuyts.com/) (or something inspired by it) to make that work
    * details:
        * randomly selects dat archives and emits events
        * verifies data coming in from the service
        * make the node run on docker
        * implement structs for Proof and Node
        * implement and harden randomness
        * implement timing logic
        * add on-initialize logic
        * add register_backup to add and count users
        * implement logic to submit dat addresses for pinning
        * implement unregistering and initial challenge-response
2. We will implement `adapter.js` (=js service that reacts to the node)
    * it will use `polkadot.js.org` api and hypercore js libraries to encode and decode hypercores
    * we will use `dat sdk` and/or `dat-store's service.js` to communicate with `adapter.js`
    * details:
        * listening for events on the node
        * submitting data to the node (proofs and archives) or responding with the merkle proof from the dat archives

**Deliverables:**
1. We will deliver a working SRML module
2. We will create a docker container that runs a substrate node using the module
3. We will deliver a basic javascript module as a helper to interact with the node
4. We will record a screencast that explains how a user can spin up one of those Substrate nodes.
5. Once the node is up, it will be possible to send test transactions that will show how the new functionality works and will create a screencast which shows step by step how it works


#### Month 2 (Month 2)
**Implement basic economics & UI logic**

1. We will use the `balances` module to:
    * create a simple credit based system
    * by pinning you mint credits, by having your archive pinned, you burn credits
    * mint amount should be > than the burn amount to solve bootstrapping.(the burn amount should be defined by a market)
    * when you submit the dat you also set the price you're willing to pay for the service
    * priority service: users who pin more have priority to get their data pinned first
    * details:
        * Write a basic module that calls balances to mint and burn balances based on the outcomes of dat-verify
        * implement minting tokens if you are seeding (earning) and successfully solve challenges
        * implement burning creators' tokens when their data is pinned (payment)
2. implement a rough and basic UI for expert users to try out the system as a whole
3. run a little closed alpha (community) test and monitor and analyse usage to improve the economic model
4. We will write detailed documentation and create a screencast to show how to use it

**Deliverables:**
1. We will deliver a refined working SRML module
2. We will deliver a refined javascript module that helps interacting with the node
3. We will deliver a basic web UI which works with a locally running substrate node
4. We will create a docker container that runs all of this
5. We will record a screencast that explains how a user can spin up the docker and use it


#### Month 3 (Month 3)
**Implement refine economics, UI and write documentation**

1. We will run a public beta and monitor and analyse usage to improve the economic model
2. We will implement a convenient UI/UX
    * it will use and wrap the work from previous milestones to make it easy for each of the user roles:
        1. pinners (seeders)
            - register to become pinners
            - get random dats to pin
            - they get paid for their work
        2. dat creators (requestors)
            - they submit dats to be pinned to keep their data available while their devices are offline
        3. node operators (should be seeders)
            - run substrate node
            - have to have enough disk space
            - reliable connection
            - get paid only when they seed (proof = succesful challenge )
            - paid in tokens (minted when each payment needs happen)
        4. data consumers (public)
            - reads the data
    * we will use `electron` to build a desktop task bar application
    * details:
        * registering availability and requesting pinning
3. We will write detailed documentation and create video workshops for users to understand how to use it

**Deliverables:**
1. We will deliver a working electron task bar application to run the substrate node and UI
2. We will write a small report with the results from the analysis of our public beta
3. We will refine and describe the economic model we are using
4. We will record a screencast to show how to install and use the electron app to pin your data or let it be pinned
5. We will write detailed documentation which explains all features and how to use them

#### Future Milestones
We plan to further improve the electron app and the substrate node and economics around it to make `datdot` work reliable in production.
This might require further grant applications and eventually we might be able to be self sustainable, but that depends on the economic model
we will end up using. One big motivation for us is to use this as a reliable building block for future and past projects, where people need to manage their personal data


## Additional Information
Context: [How `dat` works?](https://datprotocol.github.io/how-dat-works/)
**tl;dr:** a version controlled posix compliant filesystem on top of an immutable append only log structure, which can be seeded and subscribed to like torrents and the original author can always update the archive while the immutable history is always content addressable

* We implemented a rough proof of concept during EthBerlin 2019
* Currently there hasn't been any contributions in any form by anyone or any team or organization, other than us
* This is our first application for a grant
* To our best knowledge, the only remotely similar project would probably be filecoin for ipfs, but ipfs is quite different from dat
