# encoder

## glossary

## process & status
* selected by `randomness` via `event`

## code
```js
const chain = require('datdot-chain')
const service = require('datdot-service')
const vault = require('datdot-vault')

const chainAPI = chain()
const account = vault()

chainAPI.offerEncoding(account, event => {
  // ...
})

// ...

```


## `@todo` - QUESTION - ENCODING - PROOF_OF_SERVICE - COMPRESSION
* // 4. @TODO: So how do we now make the encoding super long and decoding super fast ?