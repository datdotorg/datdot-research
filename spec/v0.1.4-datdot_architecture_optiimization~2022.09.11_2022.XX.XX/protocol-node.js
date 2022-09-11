/*******************************************************************************/
const msg = {}
feed_to_self.append(msg)

feed_by_peer.on(msg => {
  console.log(msg)
})
/*******************************************************************************/
var wait = (c, cb, r, p = new Promise(d=>r=d)) => [m=>r&&((cb&&cb(m))||(--c||(r=r()))), p]

// IDEAL USAGE:
component1()

async function component1 () {
    const ID = 'component1'
    const recipients = {}
    console.log(ID)




    // ---------------------------------
    const feed_by_btn1_pkey = make(ID, btn1_feed_pkey => {
      make_feed_and_listen(btn1_feed_pkey, listen)
      recipients['button2'] = {}
    })
    // ---------------------------------
    // const feed_by_btn2_pkey = make(ID, btn2_feed_pkey => {
    //   make_feed_and_listen(btn2_feed_pkey, listen)
    //   recipients['button1'] = {}
    // })
    // ---------------------------------


    function peer1 (opts, protocol) {
      // 1. needs feed_peer0_pkey to send to peer1 as first message P0->P1
      // 2. needs to receive peer1_pkey to receive back as first mesage P1->P0

// publicKey here is keyPair.publicKey from above


// pipe it somewhere like any duplex stream
process.stdin.pipe(noiseSocket).pipe(process.stdout)



// [Peer ID](#)
// A Peer ID is how each unique IPFS node is identified on the network. The Peer ID is created when the IPFS node is initialized and is essentially a cryptographic hash of the node's public key. More about Peer ID

// [Path/Address](#)
// A Path/Address is the method within IPFS of referencing content on the web. Addresses for content are path-like; they are components separated by slashes. More about Path/Address

// ...
    }
    function peer1_btn (opts, protocol) {
      // ...
    }
    // ======


    async function system (api) {
      LESEZEICHEN:
      // // 1. TODO: figure out how to generally use shit (connect/useFeed/import) ??
      // // 2. how many primitives are needed also taking into account sandboxed eval
      // // 3. write code to connect to module instances vs peers!

      // fetch     // 1. connect to noisekey => exchange feeds to communicate
      // import    // 3. legacy: conncet to hyperdrive
      // feed      // 2. connect to feedkey => receive data
      // protocol

      // vault + secrets + messages + logging + naming

      // logger: name + logging

      // ---------------
      // IMPORT
      // ---------------
      // system predefined imports based on defined names!
      const hyperdrive = require('hyperdrive')
      const hyperdrive = import('hyperdrive')
      const hypercore = require('hypercore')

// sandboxed eval?

// account/log

      // ---------------
      // FEED
      // ---------------
      const feedkey = 'h460f20h4gw9pg49uwo38orqo3f8q8o3'
      const feed = hypercore(feedkey)

      const options = {
        createIfMissing: true, // create a new hypercore key pair if none was present in storage
        overwrite: false, // overwrite any old hypercore that might already exist
        valueEncoding: 'json' | 'utf-8' | 'binary', // defaults to binary
        sparse: false, // do not mark the entire feed to be downloaded
        eagerUpdate: true, // always fetch the latest update that is advertised. default false in sparse mode.
        secretKey: buffer, // optionally pass the corresponding secret key yourself
        storeSecretKey: true, // if false, will not save the secret key
        storageCacheSize: 65536, // the # of entries to keep in the storage system's LRU cache (false or 0 to disable)
        onwrite: (index, data, peer, cb) // optional hook called before data is written after being verified
                                        // (remember to call cb() at the end of your handler)
        stats: true // collect network-related statistics,
        // Optionally use custom cryptography for signatures
        crypto: {
          sign (data, secretKey, cb(err, signature)),
          verify (signature, data, key, cb(err, valid))
        }
        noiseKeyPair: { publicKey, secretKey } // set a static key pair to use for Noise authentication when replicating
      }
      var feed = hypercore(storage, [key], [options])
      var feed = hypercore('./my-first-dataset', {valueEncoding: 'utf-8'})
      const drive = hyperdrive(feed)
      await drive.ready

      // ---------------
      // CONNECT
      // ---------------
      const peerkey = '3f29j40wjg9w40jt49tj3409jt209jt2'
      const muxstream = await swarm.connect(peerkey)
      // ...
      const address = `hyper:${feedkey}+5`
      const response = fetch(address)


    }





    const address = noisekey1
    const use = (() => {
      const Hyperswarm = require('hyperswarm')
      const swarm1 = new Hyperswarm()
      return async address => new Promise(resolve => {
        const noiseSocket = swarm.joinPeer(address)
        const noiseSocket = node.connect(address)
        var _opts
        var _protocol
        noiseSocket.on('open', function ready () { // noiseSocket fully open with the other peer
          noiseSocket.write()
          resolve(function peer1 (opts, protocol) {
            _opts = opts
            _protocol = protocol
          })
        })
        noiseSocket.once('data', chunk => {
          const data = chunk.toString()
          const feed_pkey_peer1 = data
          noiseSocket.pipe()
        })
      })
    })()
    // ------
    const peer1 = await use(address)
    // ...
    peer1(opts, protocol) // = establish multiplex channel to peer1
    // opts = initial payload
    // ...
    peer1.send(feed_self_pkey)
    peer1.on(feed_them_pkey => { })
    // ======
    const address = modulepath
    const use = address => import(address)
    // ------
    const peer1_btn = await use(address)
    // ...
    peer1_btn(opts, protocol) // = establish multiplex channel to peer1
    // opts = initial payload
    // ...
    peer1_btn(feed_self_pkey)
    // ======







    const feed_by_btn2_pkey = make(ID, peer => {
      const { to, on } = peer
      on(listen)

      make_feed_and_listen(btn2_feed_pkey, listen)
      recipients['button1'] = {}
    })
    // ---------------------------------
    const [invite, peer] = make(ID)
    peers.push(peer)
    button(invite)
    recipients['button1'] = await peer

    await Promise.all(peers)
    // ---------------------------------
    const { on, to } = recipients['button1']
    on.feedkey
    on.pubkey
    on.get
    on.count
    to.listen

    to.feedkey
    to.pubkey
    to.get
    to.count
    to.make


    peer.to(msg)
    peer.on(msg => console.log(msg))



    button({}, feed_by_btn1_pkey)
    button({}, feed_by_btn2_pkey)

    return
    function listen (msg) { console.log(`[${ID}]`, msg) }
}
// ------------------------------------------------------
var count = 0
async function button (opts, parent_feed_key) {
  const ID = 'button-' + count++
  const recipients = {}
  console.log(ID)

  make_feed_and_listen(btn2_feed_pkey, msg => console.log(msg))
  recipients['system'] = {}

  return
}
/*******************************************************************************/
// IMPLEMENTATION:
function protocol (ID, handshake_protocol) {

  return shakehand

  async function shakehand (peerID, listen) {
    var [go, ready] = wait(2)
    var peer_listen
    await handshake_protocol(async function handshake (peerID, listen) {
      peer_listen = listen
      go()
      return { address: ID, notify: listen }
    })
    await ready
    return { address: peerID, notify: peer_listen }
  }


}
/*******************************************************************************/
var wait = (c, cb, r, p = new Promise(d=>r=d)) => [m=>r&&((cb&&cb(m))||(--c||(r=r()))), p]
/*******************************************************************************/





























OR





















/*******************************************************************************/
const msg = {}
feed_to_self.append(msg)

feed_by_peer.on(msg => {
  console.log(msg)
})
/*******************************************************************************/

// IDEAL USAGE:
component1()

async function component1 () {
    const ID = 'component1'
    const recipients = {}
    console.log(ID)



    const feed_by_btn1_pkey = make(ID, btn1_feed_pkey => {
      make_feed_and_listen(btn1_feed_pkey, msg => console.log(msg))
      recipients['button2'] = {}
    })
    const feed_by_btn2_pkey = make(ID, btn2_feed_pkey => {
      make_feed_and_listen(btn2_feed_pkey, msg => console.log(msg))
      recipients['button1'] = {}
    })

    const { on, to } = recipients['button1']
    on.feedkey
    on.pubkey
    on.get
    on.count
    to.listen

    to.feedkey
    to.pubkey
    to.get
    to.count
    to.make


    peer.to(msg)
    peer.on(msg => console.log(msg))



    button({}, feed_by_btn1_pkey)
    button({}, feed_by_btn2_pkey)

    return
}
// ------------------------------------------------------
var count = 0
async function button (opts, parent_feed_key) {
  const ID = 'button-' + count++
  const recipients = {}
  console.log(ID)

  make_feed_and_listen(btn2_feed_pkey, msg => console.log(msg))
  recipients['system'] = {}

  return
}
/*******************************************************************************/
// IMPLEMENTATION:
function protocol (ID, handshake_protocol) {

  return shakehand

  async function shakehand (peerID, listen) {
    var [go, ready] = wait(2)
    var peer_listen
    await handshake_protocol(async function handshake (peerID, listen) {
      peer_listen = listen
      go()
      return { address: ID, notify: listen }
    })
    await ready
    return { address: peerID, notify: peer_listen }
  }


}
/*******************************************************************************/

















OR















/********************************************************************************
  HELPER
********************************************************************************/
// ----------------------------------------
// ./wait.js
// ----------------------------------------
var wait = (c, cb, r, p = new Promise(d=>r=d)) => [m=>r&&((cb&&cb(m))||(--c||(r=r()))), p]
// ----------------------------------------
// ./make-element.js
// ----------------------------------------
const parser = document.createElement('template')
// module.exports = make_element
function make_element (html) {
  parser.innerHTML = html
  return parser.content
}
// ----------------------------------------
// ./make-protocol.js
// ----------------------------------------
// module.exports = make_protocol
function protocol_maker (myaddress, addressbook, inbox) {
  return function make_protocol (name, listen) {
    return function protocol (address, notify) {
      addressbook[name] = { address, notify, make: message_maker(myaddress) }
      return { notify: listen, address: myaddress, make: message_maker(address) }
    }
    function forward (message) {
      inbox[message.head.join('/')] = message
      listen(message)
    }
  }
  function message_maker (from) {
    var msg_id = 0
    return function make ({to, type, data = null, refs = {} }) {
      const stack = (new Error().stack.split('\n').slice(2).filter(x => x.trim()))
      const time = Date.now()
      return { head: [from, to, msg_id++], refs, type, data, meta: { time, stack }}
    }
  }
}
/********************************************************************************
  DEMO
********************************************************************************/
// const protocol_maker = require('./protocol-maker.js')
// const search_field = require('./search-field.js')

const ID = 'demo'
const inbox = {}
const recipients = {}

const protocol = protocol_maker(ID, recipients, inbox)
const search_protocol = protocol('search', listen)
const el_search = search_field({ hint: 'what are you looking for?' }, search_protocol)
document.body.append(el_search)
// ----------------------------------------
function listen (message) {
  const { head } = message
  inbox[head.join('/')] = msg // store msg
  const [from] = head
  if   (from === recipients['search'].address) return handle_search(message)
  else throw new Error(`${ID}: unknown message sender`)
}
// ----------------------------------------
function handle_search ({ type, data}) {
  if   (type === 'search') return console.log('search for:', data)
  else throw new Error(`${ID}: unknown message type`)
}
/********************************************************************************
  SEARCHFIELD COMPONENT (./search-field.js)
********************************************************************************/
// const protocol_maker = require('./protocol-maker.js')
// const button = require('/button.js')
// module.exports = search_field

var id = 0

function search_field (opts, handshake) {
  const ID = `${__filename}-${id++}` // globally unique identifier for component instance
  const inbox = {} // keeps a copy of every message ever received
  const recipients = {

  } // address book


/*******************************************************************************/
// PROTOCOL
function protocol_maker (ID, { contacts, inbox }) {
  return function make_protocol (name, listen) {
    const forward = message => listen(inbox(message.head.join('/'), message))

    return function protocol (address, notify) {
      contacts[name] = { address, notify, make: message_maker(ID) }
      return { notify: forward, address: ID, make: message_maker(address) }
    }
  }
  function message_maker (from) {
    var msg_id = 0
    return function make ({to, type, data = null, refs = {} }) {
      const stack = (new Error().stack.split('\n').slice(2).filter(x => x.trim()))
      const time = Date.now()
      return { head: [from, to, msg_id++], refs, type, data, meta: { time, stack }}
    }
  }
}

const make_protocol = protocol_maker(ID, { contacts: recipients, inbox })

const button_protocol = make_protocol('button', message => console.log('msg', message))

// -------

const parent = button_protocol(myID, message => console.log('msg', message))
const { notify, address, make }
/*******************************************************************************/
// RECORDER
function recorder ({ contacts, inbox, outbox }) {
  return function record (petname, listen) {
    return async function shakehand (handshake) {
      const _listen = message => void listen(inbox(message.head.join('/'), message))
      const _notify = message => void notify(outbox(message.head.join('/'), message))

      const contact = Object.assign({}, handshake(ID, _listen), { make: message_maker(ID) })
      const { notify } = contact
      contact.notify = _notify
      contacts[petname] = contact

      return { address: ID, notify: listen }
    }
  }
}
/*******************************************************************************/
// EXAMPLE
function search_field (opts, handshake) {
  const ID = 'search_field'
  const inbox = {}
  const outbox = {}
  const contacts = {}

  const record = recorder({
    ID,
    contacts,
    inbox: (id, msg) => inbox[id] = msg,
    outbox: (id, msg) => outbox[id] = msg
  })


  await record('system', listen)(handshake)

  const shakehand = record('button', listen)
  //

  const button_handshake = protocol(shakehand)

  return

  function button (opts, handhshake) {
    const ID = 'button'
    const inbox = {}
    const outbox = {}
    const contacts = {}

    const record = recorder({
      ID,
      contacts,
      inbox: (id, msg) => inbox[id] = msg,
      outbox: (id, msg) => outbox[id] = msg
    })

    const shakehand = record('system', listen)
    shakehand(ID, handshake)

    return '<button> click me </button>'
  }
}
/*******************************************************************************/

  // IDEAL USAGE:
  component1()

  async function component1 () {
    const ID = 'component1'
    const recipients = {}
    console.log(ID)

    var [go, ready] = wait(2, m => console.log(m))


    // const protocol = protocol_maker(ID, recipients, inbox)

    const button1_shakehand = protocol(ID, async handshake => {
      // const { address: btn_address, notify: btn_notify } =
      recipients['button1'] = await handshake(ID, listen)
      go('b1')
    })


    const button2_shakehand = protocol(ID, handshake => {
      // const { address: btn_address, notify: btn_notify } =
      recipients['button2'] = await handshake(ID, listen)
      go('b2')
    })

    button(button1_shakehand)
    button(button2_shakehand)
    await ready
    console.log('c-done', recipients)
    return
    function listen (msg) { console.log(`[${ID}]`, msg) }
  }

  // ------------------------------------------------------
  var count = 0
  async function button (handshake) {
    const ID = 'button-' + count++
    const recipients = {}
    console.log(ID)

    // const { address: sys_address, notify: sys_notify } =
    recipients['system'] = await handshake(ID, listen)

    console.log('b-done')
    return
    function listen (msg) { console.log(`[${ID}]`, msg) }
  }

/*******************************************************************************/
// IMPLEMENTATION:

function protocol (ID, handshake_protocol) {

  return shakehand

  async function shakehand (peerID, listen) {
    var [go, ready] = wait(2)
    var peer_listen
    await handshake_protocol(async function handshake (peerID, listen) {
      peer_listen = listen
      go()
      return { address: ID, notify: listen }
    })
    await ready
    return { address: peerID, notify: peer_listen }
  }


}
/*******************************************************************************/


  const protocol = protocol_maker(ID, recipients, inbox)



  const button_protocol = protocol('button', listen)


  const system_protocol = protocol(ID, listen)


  protocol('system', handshake)

  handshake('system', protocol)

  recipients['system'] = handshake(ID, listen)



/*******************************************************************************/

  const { notify, address } = system_protocol
  const protocol_button = make_protocol(ID, listen)
  const el_btn = button({ text: 'click me' }, protocol)

  const el_searchfield = make_element(`
    <div class="search-field">
      <input type="text" placeholder="${opts.hint || ''}">
      <var1></var1>
    </div>
  `)
  el_searchfield.querySelector('var1').replaceWith(el_btn)
  const [el_input] = el_searchfield.children

  return el_searchfield

  function listen (message) {
    const { head } = message
    inbox[head.join('/')] = msg // store msg
    const [from] = head
    if      (from === recipients['button'].address) return handle_button(message)
    else if (from === recipients['system'].address) return handle_system(message)
    else    throw new Error(`${ID}: unknown sender`)
  }
  // ----------------------------------------
  function handle_system (message) {
    const { type, data } = message
    if      (type === 'update-placeholder') return action_update_placeholder(data)
    else if (type === 'update-button-text') return action_update_button_text(message)
    else    throw new Error(`${ID}: unknown message type`)
  }
  function handle_button (message) {
    const { head, type } = message // receive msg
    if      (type === 'search') return action_search(head)
    else    throw new Error(`${ID}: unknown message type`)
  }
  // ----------------------------------------
  function action_search (cause) {
    const data = el_input.value
    el_input.value = ''
    const { notify, address, make } = recipients['system']
    const message = make({ to: address, type: 'search', data, refs: { cause } })
    notify(message)
  }
  function action_update_placeholder (data) {
    el_input.setAttribute('placeholder', data)
  }
  function action_update_button_text (message) {
    const { notify, address, make } = recipients['button']
    const message = make({ to: address, type, data, refs: { cause: message.head } })
    notify(message)
  }
}
/********************************************************************************
  BUTTON COMPONENT (./button.js)
********************************************************************************/
// const protocol_maker = require('./protocol-maker.js')
// module.exports = button

var id = 0

function button (opts, protocol) {
  const ID = `${__filename}-${id++}` // globally unique identifier for component instance
  const recipients = {}



    recipients['system'] = { notify, address, make: message_maker(myaddress) }
    let make = message_maker(myname) // @TODO: replace flow with myname/myname
    let message = make({type: 'ready', data: {input: type, value}})
    notify(message)



  const element = make_element(`<button>${opts.text || 'press'}</button>`)
  element.onclick = event => notify(make_message({ to: address, type: 'click' }))

  return element

  function listen (message) {

  }
  // ----------------------------------------
  // ----------------------------------------
}
