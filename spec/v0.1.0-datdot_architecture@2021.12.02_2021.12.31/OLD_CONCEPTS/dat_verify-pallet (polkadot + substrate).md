# `dat_verify` pallet - api-v1.0.0.md

# GOAL
be `fair`, `transparent` and `minimal`

# FUNCTIONS

## `rust function signature`
```js
// polkadotjs snippet
```

## `register_seeder()`
```js
const regSeed = api.tx.datVerify.registerSeeder()
regSeed.signAndSend(ALICE,({events=[],status})=> {
  console.log(`regUser`,status.type) // => 'ready', 'invalid', 'finished'
  events.forEach(event => console.log(event)) // => { type: 'NewPin', accountID: '???', public: '???' }
})
```

## `register_data()`
```js
api.tx.datVerify.registerData([archiveKey, rootHashPayload, signature])
// archiveKey is the hypercore key
// rootHashPayload is probably the merkle root
// signature - what is signature and why do we need it?
// => (oh, that's the signature of the root hash, right? all fine then :-)
```
* the function .register_data(origin, merkle_root: (Public, RootHashPayload, Signature)) has a polkadotjs example of api.tx.datVerify.registerData([archiveKey, rootHashPayload, signature]), but i'm not sure what we need and if we use it correctly.
* Can we simplify this?
  * here we trigger https://github.com/playproject-io/datdot-service/blob/master/index.js#L167
  * here we build it https://github.com/playproject-io/datdot-service/blob/master/index.js#L46-L61


# [substrate basics (lesson)](https://hackmd.io/sZEiCOelTnS-6Ud0zmgsBg)
* `storage` (=read) is usually free of cost,
* while the `functions` (=write) usually cost

# RUST CONVENTIONS
* what are the naming conventions in rust?
  * => `functions` and `variables` are `serpent_case`
  * => `types`, `structs`, and `objects` are `PascalCase`
  * => `events` are `types`
  * => also `CONSTS`

--------------------------------------------------------------------------

# EVENTS
`rust signature`
```js
// polkadotjs snippet
```

--------------------------------------------------------------------------

# STORAGE
`rust signature`
```js
// polkadotjs snippet
```

--------------------------------------------------------------------------

# ERRORS
`rust signature`
```js
// polkadotjs snippet
```

--------------------------------------------------------------------------

# POLKADOT
```js
const regSeed = api.tx.datVerify.registerSeeder()
regSeed.signAndSend(ALICE,({events=[],status})=> {
  console.log(`regUser`,status.type) // => 'ready', 'invalid', 'finished'
  events.forEach(event => console.log(event)) // => { type: 'NewPin', accountID: '???', public: '???' }
})
```
## POLKADOT EVENTS
> * how do events look like in polkadotjs?
> * what else is going on with `status` and when would i use it?
> * would i wrap `try { regSeed.signAndSend(/*...*/) } catch (e) { console.error(e) /* ... ??? > * How do errors look like?

https://polkadot.js.org/api/examples/promise/08_system_events/
they provide a "section" (= "datVerify") method ("EventName") and data

https://polkadot.js.org/api/examples/promise/09_transfer_events/
is an example of how you'd use events emitted from your specific extrinsic

## POLKADOT ERRORS

## POLKADOT FUNCTIONS