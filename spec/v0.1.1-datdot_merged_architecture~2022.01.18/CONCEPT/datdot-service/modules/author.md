# author

## glossary
* `hypercore` (=`archive`)

## process & status
1. make hypercore
2. add some data to it
3. join or make hyperswarm
4. share dat address for hypercore

## code
```js
const hypercore = require('hypercore')
const hyperswarm = require('hyperswarm')

const feed = hypercore()
const swarm = hyperswarm()

swarm.join(feed.key)

// ...

```