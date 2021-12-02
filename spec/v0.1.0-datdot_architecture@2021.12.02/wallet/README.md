# wallet
**[main](../README.md)**

# SCENARIO
```js
// ----------------------------------------------------------------------------
// "HYPERSPACE"
;(function processW (url = `${WALLET}/wallet.js`) { // browser window or iframe
  // * makes hypercores
  // * derives keypairs from parent/master keypair
  onmessage = event => {
    const { source, origin, data } = event

  }
  const datafeed_B = hypercore() // PERSISTANCE: (temporary) SAVE/LOAD DATA
  const chatfeedBa = hypercore() // COMMUNICATE: SEND/READ MAIL (to: 1.peers, 2.local services, 3.topics, 4.public, 5.controlled public/private groups)
})()
// ----------------------------------------------------------------------------
```

---------------------------------------------------------------------------------
```js
const feed = new Pico(cb)
feed.append("Hello")

function cb (method, args, done) { // made up
  console.log(method) // 'crypto_secretbox_easy'
  if (method === 'crypto_secretbox_easy') {
    const len = sodium.crypto_secretbox_MACBYTES
    const [msg] = args
    const nonce = feed.length
    const cipher = Buffer.alloc(msg.length + len)
    sodium[method](cipher, msg, nonce, alice.sk)
    return done(cipher)
  }
  if (method === ...) {
    // ....
  }
}
```
// ----------------

// ---------------------------------------------------------------------------------
```js
walletStream.on('data', message => {
  const f = previousFeed || new Feed()
  f.append(message)
  walletStream.write(f.buffer, userPrivateKey) // Respond with signed data
})
```
// ---------------------------------------------------------------------------------

// ---------------------------------------------------------------------------------
const walletAPI = new Wallet()
const core = hypercore(wallet.publicKey, storage, crypto: {
    // assuming ignore param secretKey is undefined
    sign: (data, secretKey, cb) => walletApi.sign(data)
        .then(sig => cb(null, sig)
        .catch(cb)
  })

core.append('My message', err => console.log('Roundtrip complete, message appended'))
// ---------------------------------------------------------------------------------
const publicKey = wallet.createSignPair()
// ---------------------------------------------------------------------------------
const authorizedFeeds = []
for (let i = 0; i < 4; i++) {
  const feed = new Hypercore(RAM())
  await feed.ready()
  const feedspecificSignature = await wallet.sign(myHypercore.key)
  // Append proof that this feed belongs to user
  await feed.append(Buffer.concat([ wallet.publicKey, feedspecificSignature ])
  authorizedFeeds.push(feed)
}
// ---------------------------------------------------------------------------------

// ---------------------------------------------------------------------------------

// ---------------------------------------------------------------------------------

// ---------------------------------------------------------------------------------
```js
const Feed = require('picofeed')

/////////////////// Wallet @ Time 0 -- key generation
console.log('Start Wallet@T0')

// Wallet contains user key pair
const user = Feed.signPair()
// a list known consumers
const trustedApps = []
let walletTime = 0

// Define a request handler for the wallet
const walletRequest = req => {
  console.log(`Start Wallet@${++walletTime}`)

  const feed = Feed.from(req) // Wrap received buffer/string/block

  // Get contents of last entry
  const reqBody = feed.last.body.toString()
  const reqAuthor = feed.last.key
  const [type, param] = reqBody.split(':')

  const isTrusted = trustedApps.find(key => key.equals(reqAuthor))

  if (!isTrusted) {
    const permitted = true // await queryUserToAllow(reqAuthor, reqBody)
    if (!permitted) return null // ignore request/ blocked
    else trustedApps.push(reqAuthor)
  }
  // Process request
  switch (type) {
    case 'REQUEST_APPEND':
      if (parseInt(param) < 5) { // Grant "reasonable" requests
        feed.append('GRANTED', user.sk)
      }
      break
  }

  console.log(`End of Wallet@T${walletTime}`)
  feed.inspect()
  return feed.last // Return only last block.
}
// Wallet setup complete.
console.log('End of Wallet@T0')

/////////////////// App-A @ Time 0  -- feed init & app id init
console.log('Start App-A@T0')

const app = Feed.signPair()
const feed = new Feed() // 1 feed that we're going to bounce back and forth.

feed.append('REQUEST_APPEND:3', app.sk)

console.log('End of App-A@T0')
feed.inspect()
const resp = walletRequest(feed) // Send entire feed.

/////////////////// App-A @ Time 1  -- receive request
const updated = feed.merge(resp) // merge response
if (!updated) { // Abort
  console.log('denied by user')
  process.exit(1)
}

console.log('End of App-A@T1')
feed.inspect()


/////////////////// App-A @ Time 2  -- Add mutations
// i'm braindead, you could just as well ask user to sign several blocks
// at once.
feed.append('THING1', app.sk)
feed.append('THING2', app.sk)
feed.append('THING3', app.sk)


console.log('End of App-A@T1')
feed.inspect()
// Point being, the way i use these feeds is that
// Before persisting anything into the repo i verify it.
// Any blocks that are ancestors of the users's HEAD are
// to be deemed signed by the user.

/*
┌─────────┬────────┬────────────┬────────────┬────────────────────┬────────────┐
│ (index) │  key   │    sig     │   parent   │        hex         │    utf8    │
├─────────┼────────┼────────────┼────────────┼────────────────────┼────────────┤
│    0    │ 'e4f1' │ 'd139ea8b' │ '_GENESIS' │ '524551554553545f' │ 'REQUEST_' │
│    1    │ '9cd9' │ 'ede383ce' │ 'd139ea8b' │  '4752414e544544'  │ 'GRANTED'  │
│    2    │ 'e4f1' │ 'a5266f1d' │ 'ede383ce' │   '5448494e4731'   │  'THING1'  │
│    3    │ 'e4f1' │ '2f58405c' │ 'a5266f1d' │   '5448494e4732'   │  'THING2'  │
│    4    │ 'e4f1' │ '1cf78082' │ '2f58405c' │   '5448494e4733'   │  'THING3'  │
└─────────┴────────┴────────────┴────────────┴────────────────────┴────────────┘
*/
```