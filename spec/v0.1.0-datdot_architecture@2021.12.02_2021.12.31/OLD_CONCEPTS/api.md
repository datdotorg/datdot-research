
# COMMUNICATION

# function exposed to submit extrinsics
we expose in code
and therefore the `client` exposes
so we can use `polkadot-js` to `call` them
to `submit extrinsics`

## by default
* `initialize_block()`
* `execute_block()`
* `version()`

## our pallet
* `register_data(...)`

### json-rpc
client vs. runtime

`client` is an API for the `runtime`
* `runtime` defines WHAT is meant to happen
* `client` DOES the happening
  * its how the outside world communicates
    * with the `runtime`
  * client runs "the thing" that is
    * listening for connections from JS

* writing a `RUNTIME` and expose `APIS`
  * you can pass that through to the
    * `RPC interfaces`
  * many of the "default" THINGS
    * assume everyone is using
      * `the system module`
      * `transaction fees`
      * `...`
      * but you don't have to

# JSON-RPC
* outside world can use `polkadot-js`
  * to communicate
  * through `client`
  * with `runtime`
  * then `client` has to have `API` (RPC)
    * which makes it available to
      * `outside world`
      * event if just forwarding to `runtime`
* `JSON-RPC` has defaults
* `JSON-RPC` adds what `runtime` publishes
  * by default
  * and from other `pallets`
  * nothing else unless manually added


```js
const communication = `
  [outside world]
        |
        |
  ([polkadot.js])
        |
        |
  [client "JSON RPC" API endpoints]
        | takes default runtime methods
        | includes: "submitExtrinsic(...)"
        | -> supports pallet methods
        | -> supports pallet storage, etc
        | 
  [runtime]
        | offers
        | - initialize_block()
        | - execute_block()
        | - version()
        |
        | 11 required functions implemented
        | offers custom public
        | - extrinsics functions
        |   - e.g. register_data(...)
        |   - e.g. register_seeder(...)
        | - storage
  [pellets]
`
```

# JSON-RPC
* A standard to call functions on a remote system using a JSON protocol.
* For Substrate, this is implemented through the `Parity JSONRPC crate`
* **JSON-RPC Core Crate**
  * Allows creation of JSON-RPC server handler, with supported methods registered.
  * Exposes the Substrate Core via different types of Transport Protocols (i.e. WS, HTTP, TCP, IPC)
* **JSON-RPC Macros Crate**
  * Allows simplifying in code the creation process of the JSON-RPC server through creating
    * a Rust Trait annotated with RPC method names, so you can just implement the methods names
* **JSON-RPC Proxy Crate**
  * Expose a `simple server` such as TCP from binaries
    * with another binary in front to serve as a proxy to expose all other `Transport Protocols`,
    * and process `incoming RPC` calls before reaching an upstream server,
    * enables to implement `Caching Middleware` (saves having to go all the way to the node)
    * `Permissioning Middleware`
    * `load balancing` between node instances
    * or moving `account management` to the proxy which processes the `signed transaction`
    * This provides an alternative to embedding the whole JSON-RPC in each project and all the configuration options for each server.
* **JSON-RPC PubSub Crate**
  * Custom (though conventional) extension that is useful for Dapp developers.
  * It allows "subscriptions" so that the server sends `notifications` to the client automatically
  * (instead of having to call and poll a remote procedure manually all the time)
  * but only with Transport Protocols that support persistent connection between client and server
    * (i.e. WS, TCP, IPC)

# Libp2p Rust
* Peer-to-peer networking library.
* Based on Protocol Labs' Libp2p implementations in Go and JavaScript
  * and their (somewhat incomplete) specifications.
* Allows use of many transport protocols including WebSockets (usable in a web browser)



-------------------------------------------------------------------------------

# API SERVICE + CHAIN
the general idea i'm playing with is adding a special object `const api = { offer { attestation, encoding, hosting, validation, backing?, ... }, supply: { attestation, encoding, hosting, validation, backing }, on, off }` where `supply` could also be `submit`...
* where `const { supply, offer, on, off } = api`
* where `const handler = event => console.log(event); on('eventType', handler)` subscribes
* where `const off('eventType', handler)` unsubscribes
* where `offer[servicename](opts, handleService)` where service could be `attestation, encoding, hosting, validation` and maybe `backing`?
* where `function handleService (event) { /* ... do stuff ... */ supply[event.type](event, proof_or_result) }`

But while trying to put the big picture together these might all still change, so i think in the end, we need to do a massive **search & replace** through the entire code base to rename and restructure and refactor a lot of things to not only have them work, but name them consistently and so that the story can be easily told and is the least confusing to people

We also need to add ability to pause and re-start certain offer/registration. Some users will maybe want to offer their computation/space only on certain days/parts of the day










-------------------------------------------------------------------------------

# `datHosters(??)`
* a map of pubkey to array of account id's
* `param` is `pubkey`

# `userStorage(??)`
* a map from account id's to array of dat public keys
* `param` is `accountId (address)` (not pubkey)

# `registerData(datKey(0))`
* needs a second call with `datKey(1)` to work
* currently multiple people cannot register the same `dat` if one already registered it successfully

-------------------------------------------------------------------------------

# CHECK REGISTERED SEEDER
```js
const res = usersCount().toU64()

const index = [] // u64
users(index)

res.toU8a()
// => Uint8Array of the encoded value
//    exactly as passed to the node
//    values are SCALE encoded

const UserCount = [ // Uint8Array
  0, 0, 0, 0,
  0, 0, 0, 0
]

userstorage(accountID)
```

-------------------------------------------------------------------------------

# MERKLE PROOFS
```js
const parent // some value we have
// but we dont use it

// how to get values from response?
feed.rootHashes(i, (err, data) => {
  // hash         // should be hash.data
  // hash_number  // should be index
  // total_length // size
  console.log(data)
  // { 
  //   children: [{
  //     hash: root.hash,
  //     hash_number: root.parent,
  //     total_length: root.size
  //   }]
  // }
})
// 1. hash of parent
//   * when used to calculate root hash
//   * does not contain hash type
// 2. hash type is part of hash payload
// 3. hardcoded hashtype is `2`
// 4. markle root hashtype is always `2`
// 5. @TODO: get rid of field entirely
//   * just have it internal to substrate
```

-------------------------------------------------------------------------------

## JS API - REGISTER_DATA, REGISTER_SEEDER
BASIC FLOW CALLS

```js
// send transactions (=call functions)
const origin = '' // origin is signer/sender

// @TODO: are required `opts` easy to get from hypercores?
// @TODO: What should happen if I try to register Data before any seeders were registered?
//        => registered data sits and waits until a seeder registers


// register `data` with chain
var opts = [] // declare capacitys
chainAPI.register_data(origin, opts) // => get status `Invalid`
// => `assign()` = if seeder is available, assign data to seeder by emitting `NewPin`

// register `seeder` with chain
var opts = []
chainAPI.register_seeder(origin, opts) // => get status `Invalid`
// => `assign()` = if data is available, assign data to seeder by emitting `NewPin`
// => get a set of `hypercores` under that capacity assigned
// => ROTATE OVER TIME

var opts = []
chainAPI.register_data(origin, opts, event => {
  // => get status `Invalid`
  console.log('success')
})

// supporters to specify that they want to chip in ratio to support a hypercore
const opts = {} // adding a percentage of 0-100% to see "how much support" they wanna give
chainAPI.offerBacking(origin, opts, event => { })


userstorage(accountID)
```
