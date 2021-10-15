# DATDOT NODE SPEC

**=> [previous spec](../v0.0.8-datdotArchitecture@2021-09-20.md)**

## @TODO: merge this information into next iteration of the spec
* [ ] include details from previous spec iterations:
  * [ ] v0.0.8
    * [x] include information from `README.md`
    * [ ] include information from `./BRAINSTORMING`
  * [x] v0.0.7
  * [x] v0.0.6
  * [x] v0.0.5
  * [x] v0.0.4
  * [x] v0.0.3
  * [x] v0.0.2
  * [x] v0.0.1
  * [x] v0.0.0


## Pitch: filecoin for dat/hypercore
bridge (between Dat Protocol and Substrate)
* but also includes a new runtime module
* The result will be able to run as a parachain or parathread
* would enable access to large file storage to substrate

### 1. Problem:
**Dynamic datasets** with immutable history - it's hard to have guarantees about their availability.
If we want to keep data available and up to date -> we have to keep our computer running or we have to rent a server.

### 2. Challenges:
What if you want other people to help you seed your data?
- what incentives do they have?
- how to find them and to trust them?
- how to verify they are seed our data?

### 3. Solution:
A decentralized bridge between Dat Protocol and Substrate with a built-in incentive model which manages relationships between:
- dat creators
- dat pinners (who keep data available/host the data)


## ARCHITECTURE
1. [chain (substrate node)](./chain/README.md)
2. [service (javascript hyper based)](./service/README.md)
3. [vault](./vault/README.md)
4. [wallet](./wallet/README.md)
5. [ui](./ui/README.md)

