# datdot-org
main repo and desktop resembeling website

check: https://github.com/datdotorg/datdot
check: https://github.com/playproject-io/datdot
and: https://github.com/datdotorg/datdot-assets

# `playproject-io/datdot`

**`landingpage`**
* + `download apps`

### 0. DATDOT - `playproject-io/datdot`
* **GOAL:** main repo for everything
  * including `datdot-electron`
  * including `datdot-cli`
  * including description of `datdot-service` (=daemon) (=https/wss server)



















# UI
**[main](../README.md)**


## summary
- registering availability and requesting pinning (and interact with the rest of the public API)


# user interface

```js
const iframe = src => `<iframe src="${src}" width="0" height="0"></iframe>`
const hypercore = require('hypercore')
const derive = require('derive-key')
const crypto = require('hypercore-crypto')
/*
┌─────────┬────────┬────────────┬────────────┬───────────────────┬────────────┐
│ (index) │  key   │    sig     │   parent   │        hex        │    utf8    │
├─────────┼────────┼────────────┼────────────┼───────────────────┼────────────┤
│    0    │ 'e4f1' │ 'd139ea8b' │ '_GENESIS' │ '52455155453545f' │ 'REQUEST_' │
│    1    │ '9cd9' │ 'ede383ce' │ 'd139ea8b' │  '4752414e544544' │ 'GRANTED'  │
│    2    │ 'e4f1' │ 'a5266f1d' │ 'ede383ce' │   '5448494e4731'  │  'THING1'  │
│    3    │ 'e4f1' │ '2f58405c' │ 'a5266f1d' │   '5448494e4732'  │  'THING2'  │
│    4    │ 'e4f1' │ '1cf78082' │ '2f58405c' │   '5448494e4733'  │  'THING3'  │
└─────────┴────────┴────────────┴────────────┴───────────────────┴────────────┘
*/
/*
GOALS: small code, fast, minimal deduplicated storage, secure
  => where to store?
  => how to replay/show/verify feed items for debug/log/test purposes?
  => discord like audit log ??? (maybe inside wallet? or app?) (with public address?)
*/
// ORIGINS:
const APP_A = 'https://app-A.com/'
const APP_B = 'https://app-B.com/'
const WALLET = 'https://wallet.localhost/'
// ----------------------------------------------------------------------------
;(function processA (url = `${APP_A}/appA.js`) { // browser window or iframe
  document.body.innerHTML = `${iframe(APP_B)}${iframe(WALLET)}`
  const [portAB, wallet] = document.body.children
  const datafeed_A = hypercore() // PERSISTANCE: (temporary) SAVE/LOAD DATA
  const chatfeedAb = hypercore() // COMMUNICATE: SEND/READ MAIL (to: 1.peers, 2.local services, 3.topics, 4.public, 5.controlled public/private groups)
})()
// ----------------------------------------------------------------------------
;(function processB (url = `${APP_B}/appB.js`) { // browser window or iframe
  document.body.innerHTML = `${iframe(APP_A)}${iframe(WALLET)}`
  const [portBA, wallet] = document.body.children
  const datafeed_B = hypercore() // PERSISTANCE: (temporary) SAVE/LOAD DATA
  const chatfeedBa = hypercore() // COMMUNICATE: SEND/READ MAIL (to: 1.peers, 2.local services, 3.topics, 4.public, 5.controlled public/private groups)


  const masterseed = crypto.randomBytes(32) // high-entropy, eg. from a CSPRNG
  const seed = derive('a namespace', masterseed, 'my-named-key')
  const keypair = crypto.keyPair(seed)
  console.log(keypair) // prints a ed25519 keypair

var feed = hypercore('./my-first-dataset', {valueEncoding: 'utf-8'})
var feed = hypercore(storage, [key], [options])
// The [key] and secretKey are Node.js buffer instances
// not browser-based ArrayBuffer instances, so use feross buffer module
const storage = someRandomAccessStorage
const myPublicKey = someUint8Array
const Buffer = require('buffer').Buffer
const hypercorePublicKeyBuffer = Buffer.from(myPublicKey.buffer)
const hypercore = hypercore(storage, hypercorePublicKeyBuffer)
const opts = {
  // ...
  secretKey: buffer, // optionally pass the corresponding secret key yourself
  storeSecretKey: true, // if false, will not save the secret key
  // ...
  // optional hook called before data is written after being verified
  // (remember to call cb() at the end of your handler)
  onwrite: (index, data, peer, cb)
  stats: true // collect network-related statistics,
  crypto: { // Optionally use custom cryptography for signatures
    sign (data, secretKey, cb(err, signature)),
    verify (signature, data, key, cb(err, valid))
  }
  // set static key pair to use for Noise authentication when replicating
  noiseKeyPair: { publicKey, secretKey }
}
  /*
  HANDSHAKE PROBLEM:
  * communicate with (remote) origin needs ability to make chat feeds
    * e.g. **appA** <-> **wallet** (needs chat feed first)
    => chicken/egg problem

    SCENARIO:
      app initially talks to iframe wallet
        1. app needs hypercore for it
        2. wallet needs to sync apps hypercore
        3. wallet needs to respond with hypercore
        4. app needs to sync wallets hypercore

    * FEED: need (in)direct access to secret keys
    * should have "crypto wallet callback"
      * allows for keypair action delegation (to (remote) crypto wallet)
      * allows for inprocess keypair too (in-process key callback)

    => how to set up DUPLEX HYPERCORE STREAM ???

    A -- msg5 --> B
    A.feedB[5]
    B -- msg6 --> A
    B.feedA[6] // feedBApubkey

    * "staging" (app appends locally)
    * "commiting" (app requests wallet permission)
    * "pushing" (app merges response)

  */

  /* PHASES:
    1. OPEN: app url
    2. ESTABLISH TRUST
      * ASK app url for wallet url
      * or else ASK browser or environment for wallet url
      * or else ASK app for trusted wallet url (e.g. localstorage)
      * or load default wallet in iframe
    2. WALLET URL: re-use localstorage wallet url or default anon wallet to maybe get localstorage wallet url from
    3. CONNECT
  */
})()
```