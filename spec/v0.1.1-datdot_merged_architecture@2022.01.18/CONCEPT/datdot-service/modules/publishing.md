
## `@todo` - PALLET (dat_verify)
1. is `NewPin` instead of `NewSeeder`
  * especially after we implement seeder rotation (changing what they are seeding)
2. find better module name


# publish hypercores


## glossary

## process & status
* self selected
1. register dat address on substrate blockchain

#### UPDATING HYPERCORES
1. a `PUBLISHER` submits `(hypercore_address, new_merkle_root_signed_by_same_publickey, publickey)`
  * saves `hypercore address` and `related publickey` on chain



## code

```js
const chain = require('datdot-chain')
const service = require('datdot-service')
const vault = require('datdot-vault')

const chainAPI = chain()
const account = vault()
const adress = 'dat://1231352gwt4w43tw3rq3f...ef'

chainAPI.publish(account, address, event => {
  // ...
})

// ...

```


# backer

## glossary

## process
* self selected

## code
```js
const chain = require('datdot-chain')
const service = require('datdot-service')
const vault = require('datdot-vault')

const chainAPI = chain()
const account = vault()
const adress = 'dat://1231352gwt4w43tw3rq3f...ef'

chainAPI.offerBacking(account, address, event => {
  // ...
})

// ...

```