# node loop



```js


const chain = make('CHAIN', $ => {
  const extrinsics = $('extrinsics') // TASKS
  const actions = $('actions')
  const helpers = $('helpers')
  const emits = $('events')
  // connect
  $(extrinsics(actions(helpers(emits($)))))
})

const node = make('NODE', (_, $) => {
  // $ = self (=connected to all peers)
  // _ = pool: cannot send, only make signals to send/receive

  const ROOT = _() // root signal to send/receive all
  ROOT(msg => console.log(msg))
  // POOLS
  const API = _('API')
  const SYNC = _('SYNC')
  // ???
  const CHAIN = $('CHAIN')
  const EVENTS = API('EVENTS')
  const TASKS = API('TASKS') // === extrinsics / transactions

  SYNC`block`(validate(CHAIN))
  SYNC`tasks`(verify`done`(collect)`fail`())
  // @NOTE:
  // => LESEZEICHEN: MATCHING.md#230
  // => LESEZEICHEN: MATCHING.md#480
  // => LESEZEICHEN: MATCHING.md#570
  // ----------------------------------
  $.on`api`(peer => {
    $(peer
      `api`(verify(collect))
      `extrinsic`(collect)
      `block`(execute))
    collect`fail`(peer)
  })
  // ----------------------------------
    const forward = $('forward')
  forward($)
  const api = peer => {
    return peer(verify`done`(collect($.peers)`fail`(peer)))
  }
  $`
    api`(api)`
    extrinsic`(api)
  $`api`(verify(collect))
   `extrinsic`(collect)
   `block`(execute))
  collect`fail`($)
})
```