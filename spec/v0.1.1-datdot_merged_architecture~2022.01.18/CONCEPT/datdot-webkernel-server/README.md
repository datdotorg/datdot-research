# datdot-webserver
serve localhost datdot page

@TODO:
* [ ] `@TODO:` figure out if the localhost website can be embedded in regular HTTPS pages




# `playproject-io/datdot-???`
* or `datdot-chain`
* or `datdot-node`
* or `datdot-runtime`

#### MODULE: `chain_api`
* **chain api** JS Modules to talk to "SUBSTRATE STUFF"
  * https://polkadot.js.org/api/
  * https://polkadot.js.org/api/start
  * https://polkadot.js.org/api/start/create.html
  * https://polkadot.js.org/api/start/types.extend.html#extension
  * https://polkadot.js.org/api/start/types.extend.html
* GOAL: make API in RUST and JS the same!
  * instead of "camelCase vs. snake_case" maybe ONE WORD?
* API:
  ```js
  const chain_api = require('datdot/chain-api')
  // module.exports = {
  //   getHosters, getStorage, registerData, registerSeeder, makeAccount, listenHeads, ...
  // }
  ```
  * api.tx.balances.transfer(...)
  * api.tx.dat_verify.register_backup(...)
  ```js
  feed.ready(() => { // manage a TX that got finalized
    archive.push(feed.key.toString('hex'))
    // archive[0] = ed25519::Public
    feed.signature((err, res) => archive.push(res.signature.toString('hex')))
    // archive[1] = ed25519::Signature
    feed.rootHashes(0, (err, res) => archive.push({ hashType: 2, children: [res[0].hash] }))
    // archive[2] = { hash_type: /*2*/ u8, children: Vec<ParentHashInRoot> }
  })
  const keyring = new Keyring({ type: 'sr25519' })
  const ALICE = keyring.addFromUri('//Alice')
  console.log(archive)
  const registerData = api.tx.datVerify.registerData(archive)
    .signAndSend(ALICE, ({ events = [], status }) => {
      console.log(`Current status is ${status.type}`)
      if (status.isFinalized) {
        console.log(`Transaction included at blockHash ${status.asFinalized}`);
        events.forEach(({ phase, event: { data, method, section } }) => {
          console.log(`\t' ${phase}: ${section}.${method}:: ${data}`);
        })
        unsub()
      }
    })
  ```