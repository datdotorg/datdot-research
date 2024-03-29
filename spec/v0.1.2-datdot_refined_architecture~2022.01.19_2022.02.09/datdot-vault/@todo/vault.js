const { cryptoWaitReady } = require('@polkadot/util-crypto')
const sodium = require('sodium-universal')
const path = require('path')
const encode = require('encoding-down')
const memdown = require('memdown')
const levelup = require('levelup')
const sub = require('subleveldown')
const crypto = require('datdot-crypto')

const datdot_logkeeper = require('./logkeeper')

/*******************************
  MASTER SEED
*******************************/
const ready = cryptoWaitReady()
const masterseed = crypto.random_bytes(32)

module.exports = vault

async function vault ({name, log}) {
  await ready
  let nonce = 0n
  const chainKeypair = crypto.create_chain_keypair({
    namespace: 'datdot-account',
    seed: masterseed,
    name: 'identity'
  })
  const signingKeyPair = crypto.create_signing_keypair({
    namespace: 'datdot-user',
    seed: masterseed,
    name: 'signing'
  })
  const noiseKeyPair = crypto.create_noise_keypair({
    namespace: 'datdot-user',
    seed: masterseed,
    name: 'noise'
  })


  // ---------------------------------------------
  button.onclick = event => {
    web3Provider.updateUserPolicies(form)
    web3Provider.sendTransaction('....', inputElement.value)
  }
  // ----
const vaultAPI = { // Vault
  async use (name, pubkey) {
    const source = await getsource(name, pubkey) // hyper, npm, github
    const id = [name, pubkey, rootkey]
    // var kp = await _rootfeedbee.get(id)
    // if (!kp) {
      const keypair = crypto.deriveKeypair(...id)
      // await _rootfeedbee.put(id, keypair)
      // kp = keypair
    // }
    // isolate-js:
    const AsyncFunction = (async () => {}).constructor
    var afunc = AsyncFunction('keypair', '{ use }', `
      ${source}
    `)
    const api = {
      use: name => { }
    }
    afunc(keypair, api)
  }
}
// ----
  // ---------------------------------------------
  // keypairs: { publickey, secretkey } => { pubblickey, sign(), encrypt(), decrypt(), ... , [secretkey] }

  // => chain account
  // => feeds
  // => swarms + (hyperbeam)   // swarm.joinPeer()

  const vault = {
    loadChainKeypair(){}, // chain key pair
    loadSwarmKeypair(){}, // noise key pair
    loadFeedKeypair(){}  // feed key pair
    // loadKeypair

  }

  // ---------------
  // TODO: continue here ...
  store.type('swarmkey', make_swarm_key)
  async function make_swarm_key () { return { value, cleanup } }

  // ...

  // if another app tries to use a key you already have stored in your vault



  store.load(`swarmkey/${a1}`, 'swarmkey')
  store.load(`chainkey/${a2}`, 'chainkey')
  store.load(`feedkey/${a3}`, 'feedkey')


  memstore
  ramstore
  hddstore

  const keypair = await vault.loadChainKeypair()
  keypair.publickey //
  keypair.sign(data)
  keypair.encrypt(data)
  // keypair.secretkey

  const vault = datdot_vault(rootkeypair) // makes feed with root keypair + adds all keypairs made later
  // hyperbee

  // ...

  function datdot_vault (rootkeypair) {
    const opts = rootkeypair ? { keyPair: rootkeypair } : null
    const _rootfeedbee = new Hyperbee('~/.vault', opts) // TODO: what if ~/.vault exists but different keypair?
    const _rootkeypair = { secretkey: _rootfeedbee.secretKey, publickey: _rootfeedbee.publicKey }
    const vault = {
      async keypair (name, appkey) {
        const kp = await _rootfeedbee.get(name)
        if (kp) return  makeKeyPair(kp)
        const _keypair = crypto.deriveKeypair(name, _rootkeypair)
        await _rootfeedbee.put(name, _keypair)
        const keypair = makeKeyPair(_keypair)
        return keypair
      }
    }
    return vault
    function makeKeyPair (_keypair) {
      const keypair = {
        publickey: _keypair.publicKey,
        sign (data) { /* use secretkey to sign data and return it */ },
        encrypt (key, data) { /* use secretkey to sign and then encrypt data with key and return it */ },
        decrypt (cipher) { /* use secretkey to decrypt data and return it */ },
        sub (name) {
          const _subkeypair = crypto.deriveKeypair(name, _keypair)
          const subkeypair = makeKeyPair(_subkeypair)
          return subkeypair
        }
      }
      return keypair
    }
  }

  // SUB KEYPAIRS or SUB VAULTS
  const alice =  await vault.keypair('alice') // { type: 'ed25519' }
  const keypair1 = await alice.sub('swarm') // { type: 'ed25519' }
  const keypair2 = await alice.sub('chain') // { type: 'ed25519' }
  const keypair3 = await alice.sub('feed', { type: 'rsa' })


  const keypair1 = await vault.keypair('swarm', pubkey1) // { type: 'ed25519' }
  const keypair2 = await vault.keypair('chain', pubkey2) // { type: 'ed25519' }
  const keypair3 = await vault.keypair('feed', pubkey3, { type: 'rsa' })


  const keypair4 = await keypair3.sub('foobar')
  const keypair4 = await keypair3.sub('dd-eth-wallet', { publickey, signature })
  const keypair4 = await keypair3.sub('foobar', { publickey, signature })



  const keypair4 = await keypair3.sub('foobar')


  const keypair4 = await keypair3.sub('dd-eth-wallet', rnd, { publickey, signature })
  const keypair4 = await keypair3.sub('foobar', rnd, { publickey, signature })


  const tape_kp = await keypair4.sub('tape')
  const keypair6 = await tape_kp.sub('foobar')


  const tape_kp = await keypair4.sub('tape') // funny meme app
  const keypair6 = await tape_kp.sub('foobar')

  const cabal_kp = await keypair4.sub('cabal')
  const keypair6 = await cabal_kp.sub('foobar')


  // ---------------------------------------------
  const vault = datdot_vault('name', rootkeypair, request => {})
  await vault.use()
  await vault.getNonce()
  await vault.sign()
  await vault.encrypt()
  await vault.decrypt()
  vault.publickey
  await vault.log('foo bar baz')
  const keypair1 = await vault.sub('foobar')
  const keypair2 = await vault.sub('foobar', { type: 'ed25519' })
  const keypair2 = await vault.sub('foobar', { type: 'noise' })
  const keypair2 = await vault.sub('foobar', { type: 'noise' })
  console.log(vault.type) // 'ed25519'
  // ---
  vault.cache
  vault.db
  // ---
  vault.watchingFeeds
  vault.storages
  vault.storage
  vault.hosterDB
  vault.serviceDB
  // ---
  vault.chainKeypair
  vault.signingPublicKey
  vault.signingSecretKey
  vault.noisePublicKey
  vault.noisePrivateKey
  // ---------------------------------------------



  const account = {
    chainKeypair,
    signingPublicKey: signingKeyPair.signingPublicKey, // this is not in use (we just create it and store it on chain)
    signingSecretKey: signingKeyPair.signingSecretKey,
    noisePublicKey: noiseKeyPair.publicKey,
    noisePrivateKey: noiseKeyPair.secretKey,
    getNonce: () => nonce++,
    sign,
    storages: new Map(),
    watchingFeeds: new Set(), // @TODO hoster watches for feed updates
    cache: {},
  }

  const storage = account.persist ? path.resolve(account.storageLocation, './hosterDB') : memdown()
  account.storage = storage
  const db = levelup(encode(account.storage, { valueEncoding: 'binary' }))
  account.db = db
  account.hosterDB = sub(db, 'hoster')
  account.serviceDB = sub(db, 'service')

  return account

  function sign (toSign) {
    // Allocate buffer for the proof
    const signature = Buffer.alloc(sodium.crypto_sign_BYTES)
    // Sign the data with our signing secret key and write it to the proof buffer
    sodium.crypto_sign_detached(signature, toSign, account.signingSecretKey)
    return signature
  }
}