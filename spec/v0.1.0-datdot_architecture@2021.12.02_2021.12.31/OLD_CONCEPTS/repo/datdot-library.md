# `playproject-io/library`

#### MODULE: `seeding_api`
* **seeding api** JS modules to talk to "DAT STUFF"
  * currently uses the main dat modules (hypercore, hyperswarm, ...)
* support "dat health" module
* handling the set of which archives are being seeded
* API:
  ```js
  const seeding_api = require('datdot/seeding-api')
  // module.exports = { makeHypercore, measureHealth, getOtherStuff, ... }
  ```
