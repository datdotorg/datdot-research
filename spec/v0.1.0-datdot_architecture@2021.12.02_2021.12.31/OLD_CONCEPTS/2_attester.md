# attester

## glossary

## process & status
* selected by `randomness` via `event`
* seeders being challenged in frequently enough (irregular?) from when they start seeding
* they are considered online for as long as they solve challenges

## code
```js
const chain = require('datdot-chain')
const service = require('datdot-service')
const vault = require('datdot-vault')

const chainAPI = chain()
const account = vault()

chainAPI.offerAttestation(account, event => {
  // ...
})

// ...

```