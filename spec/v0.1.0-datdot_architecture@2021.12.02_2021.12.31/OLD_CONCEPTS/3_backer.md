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