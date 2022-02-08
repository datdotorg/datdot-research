# DATDOT NODE SPEC

**=> [previous spec](../v0.1.0-datdot_architecture~2021.12.02_2021.12.31/)**
**=> [next spec](../v0.1.2-datdot_refined_architecture~2022.01.19_2022.??.??/)**

## `@todo`
* [x] include details from previous spec (v0.1.0) in this version


## ARCHITECTURE
1. [chain (substrate node)](./datdot-chain-node/README.md)
  * => `datdot-node`
  * => `datdot-chain`
  * => `datdot-runtime`
    * [API](https://github.com/playproject-io/datdot-substrate/blob/master/bin/node/runtime/src/dat_verify.rs)
  * `/datdot-pallet-verify`
  * `datdot-pallet-balance`
2. [service (javascript hyper based)](./datdot-service/README.md)
  * [API](https://github.com/playproject-io/datdot-service/blob/master/index.js)
3. [vault](./datdot-vault/README.md)
4. [wallet](./datdot-wallet/README.md)
5. [ui-webapp](./datdot-ui-webapp/README.md)
---
6. [ui-org](./datdot-ui-org/README.md)
7. [webkernel-server](./datdot-webkernel-server/README.md)
8. [shim](./datdot-shim/README.md)
  * electron
9. [gateway](./datdot-gateway/README.md)
  * daemon


```js
const chain = require('datdot-chain')
const service = require('datdot-service')

// @TODO: refine this

chain(service(chain))
```

@TODO:
* [ ] set architecture based on `CONCEPTS` folder evaluation

## ARCHITECTURE
see [here](https://gist.github.com/substack/e037d1d2015b7a3e0001fc4bdd463b9c)
```js
const architecture = `
  [7. substrate chain daemon]
              ↑
              │
              ↓
  ┌────> [5. chain api] <───> [other chain implementations*]
  │
  │      [4. seeding_service api] <───> [kappa/hyper-core]
  │           ↑
  │           │
  │           │
  ├───────────┼─> [3. cloud/localhost https/wss server] <─────┐
  │           │                                               ↓
  │           │                                 [6. web user interface]
  │           │                                           ↑   ↑
  │           │     [2. datdot electron app] <────────────┘   │
  │           │                                               │
  │           │     [web browser] <───────────────────────────┘
  │           │
  └───────────┴───> [1. datdot command-line interface]
`
```
browser online => most insecure (= things can change while you visit the page)
browser localhost => more secure (= things won't change while you visit if you don't confirm)
datdot app: electron webapp => still secure (= but custom browser we maintain - so careful)
datdot app: electron process => full power while running (=we have to be most careful, it has access to the users system)
datdot app: daemons => full power all the time (these are already defined in scope and mostly implemented)



![architecture-diagram](./architecture-diagram.png)

