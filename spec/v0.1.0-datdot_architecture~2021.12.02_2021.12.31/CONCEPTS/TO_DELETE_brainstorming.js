// ------------------------------------------------------------------
// USAGE GENERAL
// ------------------------------------------------------------------
// const tasker = require('task-manager')
const task_scheduler = require('task-scheduler')
const item_store = require('item-store')

const store = item_store()
store.register(`swarm`, make_swarm)
store.type(`feed`, make_feed)
store.type(`intercept`, make_swarm)

/*
// @TODO:
=> check what is VAULT.md
=> while solving WALLET.md#CREATE (A/B/C/D)
   => to figure out how to connect to VAULTS




@@@@@@@@@@@@@@@@@@@@@@@@

// @TODO: merge/mark architecture process
// ----------------------------
ENVIRONMENTS:
// ----------------------------
1. NATIVE OPERATING SYSTEM
  * CUSTOM OS
  * CUSTOM HYPER OS
  * CUSTOM DATDOT HYPER OS
2. SHIMMED DESKTOP SYSTEM
3. SAME DEVICE EXTERNAL CLIENT (e.g APP TAB)
4. EXTERNAL DEVICE CLIENT
5. (EXTERNAL?) TERMINAL


// @TODO: merge/mark architecture process
// ----------------------------
SITUATION/SCENARIOS:
// ----------------------------
1. running system
2. just vault
3. with hardware wallet
4. remote device app
5. system vault + remote wallet
6. app inside datdot.org
7. app in different browser tab
8. app on datdotOS desktop
9. app on phone browser


// ----------------------------
ARCHITECTURE PROCESS
// ----------------------------
1. HARDWARE
  * user triggers install
  * user provides config input
2. KERNEL SHIMS
  * web view + web server
3. WEB KERNEL
4. SYSTEM INIT_STARTUP (index.html+index.js)
  * user provides config input (provision?)
5. SYSTEM_init_process+restart
6. LOGIN_SCREEN_init
7. LOGIN_SCREEN_restartup
8. APP_init
  * app pairing
  * app paired
9. APP_restore/restart

// ----------------------------
USER SECURITY
// ----------------------------
1. VAULT SETUP/START
2. WALLET SETUP/STARTUP
3. VAULT/WALLET/KERNEL Pairing


// ----------------------------
SETUP/STARTUP PROTOCOLS
DATA VAULT WALLET FEED SYSTEM
WEBKERNEL+SYSTEM (STARTUP) CODE

*/
const element = createElement()
element.on('click', event => {})
element.click()


const element = createElement()
element.on('click', event => {})
element.load()


store.type(`intercept`, make_intercepted_feed)
store.type(`general`, make_general_feed)
store.type(`fresh`, make_fresh_feed)


const tasker = task_scheduler(store)


tasker.register('general', async (data, task) => {
    const { store } = task

    const value = await store.get(/*...*/)
    // make ITEMs
    // or (re)use existing ITEMs
    // or maybe remove ITEMs
    // where ITEM means: e.g. swarm, feed, discovery, ...
    const value = await task.store.get(/*...*/)
    const value = await task.store.get(/*...*/)

    network.open()
    // ...
    const { id, db } = task
    task.sub('ram')
    console.log(task.id)
    task.db.put
    task({ type: 'fresh' })
    return new Promise(resolve => setTimeout(resolve, 1000))
})

tasker.register('intercept', handleIntercept)
tasker.register('fresh', handleFresh)
tasker.register('general', handleGeneral)
const t1 = tasker({ type: 'general', data: { feedkey, remotekey, swarmkey } })
console.log(t1.id)
const result1 = await t1
const result2 = await tasker({ type: 'general', data: { feedkey, remotekey, swarmkey } })
// tasker.cancel(id) // end, destroy
// tasker.status(id)

async function handleGeneral ({ taskID }) { }

async function handleFresh ({ taskID }) { }

async function handleIntercept ({ taskID }) { }

// ------------------------------------------------------------------
// USAGE SPECIFIC
// ------------------------------------------------------------------
const subcache_path = ['intercept']
const subcache = load_subcache(subcache_path)
// const swarmcache = get_swarm_cache(swarmID)
// ------------------------------------------------
// intercept task cache
async function make_feed () {
    const feed = new hypercore(RAM, feedkey, { valueEncoding: 'binary', sparse: true })
    await ready(feed)
    const item = {
    value: feed,
    destroy: async () => await feed.destroy()
    }
    return item
}

// ..........................................

const ramstore = store('ram', function defaultValue (path) {
    const first = path[0]
    switch (first) {
        case 'fresh': return { sockets: {}, topics: {}, task_count: 0 }
        case 'general': return { sockets: {}, topics: {}, task_count: 0 }
        case 'intercept': return { sockets: {}, topics: {}, task_count: 0 }
        default: throw new Error('illegal path')
    }
})
item.get(`topics/${stringtopic}`)
item.get(`topics/${stringtopic}`)
item.get(`intercept/${stringtopic}`, 'swarm', params)

const swarm = item.load(`intercept/${stringtopic}`, { type: 'swarm', data: params })
const swarm = item.load(`intercept/${stringtopic}`, { type: 'swarm', data: params })

const swarm = item.make(`fresh/${stringtopic}`, { type: 'swarm', data: params })
const swarm = item.make(`fresh/${stringtopic}`, { type: 'swarm', data: params })

const swarm = item.load(`swarm`, params)
const feed = item.load(`feed`, params)

// ..........................................
// async function make_swarm (path, save, load) {
//     const item = load(path)
//     if (item) return item
//     save(makeItem())
// }
async function make_swarm (resolve, reject) {
    const save = resolve
    const swarm = new hyperswarm(opts)
    swarm.on('connection', (socket, info) => {
        /*
        max amount of sockets peer can have open (i.e. const maxsockets = 64)
        - new socket
            - if (socket_count >= maxsockets) socket.end()
            - tasks: if:
            - encoding
                - if socket.topic matches active task => connect
            - attestor - perf challenge
                - if socket.remoteKey matches active task (peer) => connect
            - hosting
                - client phase:
                - if socket.topic matches active task => connect
                - server phase:
                - connect
                - ...
            - sponsor
                - if socket.topic matches active task => connect
        */
        // if (fresh) cache_type = cache['fresh'][swarmID]
        // else if (intercept) cache_type = cache['intercept']
        // else cache_type = cache['general']
        // const { swarm, sockets, topics } = cache_type
        const replicationStream = new HypercoreProtocol(socket.isInitiator)
        sockets[remotestringkey] = { socket, replicationStream }
        pump(socket, replicationStream, socket, (error) => { })
        replicationStream.on('discovery-key', (discoverykey) => {
            const peerlist = [...hosterkeys]
            if (peerlist.contains(socket.remotekey)) feed.replicate(replicationStream)
        })
        replicationStream.on('end', onexit)
        replicationStream.on('close', onexit)
        replicationStream.on('timeout', onexit)
        function onexit (err) {
            socket.end()
            replicationStream.end()
            replicationStream.off('end', onexit)
            replicationStream.off('close', onexit)
            replicationStream.off('timeout', onexit)
        }

        // ...
        const key = socket.remoteKey.toString('hex')
        const item = {
            id: key,
            value: { replicatonStream, socket },
            cleanup: async () => {
                await replicationStream.destroy()
                await socket.destroy()
                // end all sockets!
            }
        }
        subdb.put(key, item) // @TODO: ...
    })


    const subdb = save(swarm, async (err) => { // cleanup
        await swarm.destroy()
        // cleanup sub resources / sub items
    })
    // on error handler
    // =>
}

function cleanup () {
    if (item.counter) item.counter--
    else item.destroy()
}

























// ------------------------------------------------------------------
// HELPER MODULE 1 - task_scheduler // taskDB
// ------------------------------------------------------------------
const item_store = require('item-store')
const _item = item_store()

module.exports = task_scheduler // task database
function task_scheduler () {
  const tasks = {}
  const store = {}
  var counter = 1
  tasker.register = register
  Object.freeze(tasker)
  return tasker
  function register (type, handler) {
    if (tasks[type]) throw new Error('type exists already')
    tasks[type] = handler
  }
  async function tasker (message) {
    const { type, data } = message
    const id = counter++
    const db = {}
    store[id] = { id, message, db }
    // await tasks[type]({ id, data, db })

    const active = []
    const store = {
        load: (...args) => {
            const { value, cleanup } =_item.load(...args)
            active.push(cleanup)
            return value
        },
        make: () => {}
    }
    await tasks[type](data, { id, db, store })
    await Promise.all(active.map(cleanup => cleanup()))
    delete store[id]
  }
}

// ------------------------------------------------------------------
// HELPER MODULE 2 - item_store
// ------------------------------------------------------------------
// USAGE:
// const ramstore = store('ram', function defaultValue (path) {
//     const first = path[0]
//     switch (first) {
//         case 'fresh': return { sockets: {}, topics: {}, task_count: 0 }
//         case 'general': return { sockets: {}, topics: {}, task_count: 0 }
//         case 'intercept': return { sockets: {}, topics: {}, task_count: 0 }
//         default: throw new Error('illegal path')
//     }
// })
// ------------------------------------------------------------------
module.exports = item_store
function item_store (type, defaultValue, store = {}) {
    const TYPES = {}
    if (type !== 'ram') throw new Error('only "ram" stores are supported at the moment')
    const api = { load, make }
    return api
    function destroy (id) {
        const last = id.pop()
        const sub = _get_sub(id)
        // maybe trigger some sort of callback or keep in mind to
        // - leave all the topics
        // - leave the swarm
        // - unload and destroy all the feeds
        // - diosconnect and end and destroy all the sockets
        // ...
        if (sub) sub[last] = null
    }
    function type (name, maker) {
        TYPES[type] = maker
    }
    function load (...keys) { // make or get sub for keys
    function load (path, { type, data }) { // make or get sub for keys
        const item = VALUES[path]
        if (item) return item
        const {value, cleanup } = TYPES[type](data)
        VALUES[path] = { value, cleanup }
        return value

        // const last = keys.pop()
        // const sub = _get_sub(keys)
        // return sub[last] || _set_default(sub, keys, last)
    }
    function make (...keys) { // make unqiue sub under keys sub
        const sub = _get_sub(keys)
        const next = Object.keys(sub).length + 1
        return _set_default(sub, keys, next)
    }
    function _set_default (sub, prefix, key) {
        const path = prefix.concat(key)
        const val = defaultValue(path)
        if (val.id) throw new Error('default value has an ".id" already')
        val.id = path
        return sub[key] = val
    }
    function _get_sub (keys) {
        for (var i = 0, temp = store, len = keys.length; i < len; i++) {
            const val = temp[keys[i]]
            if (!val) temp = temp[keys[i]] = {}
            else temp = val
        }
        return val
    }
}


function increase_task_count (...keys) {
    const temp = get_swarm_cache(...keys)
    temp.topics[stringtopic].feeds[stringkey].task_count++
    temp.topics[stringtopic].task_count++
    temp.task_count++
}
function load_subcache (keys) {
    const key = keys.pop()
    for (var i = 0, temp = cache, len = keys.length; i < len; i++) temp = temp[keys[i]]
    if (!temp[key]) temp[key] = { sockets: {}, topics: {}, task_count: 0 }
    return temp[key]
}
const db = diskstore.load(name)
// const db = diskstore.load(name)
// const db = diskstore.make(name)

// 1. load an exstingn store or make it if it doesnt exist yet
// 2. make a new store for a name, thus give it an extra name to be unique
// 3. delete an existing store or do nothing if it doesnt exist yet
// 4. list all store names

const db = ramstore.load(name) // name === 'general'
console.log (name === db.id) // true
const db = ramstore.make(prefix) // prefix === 'fresh'
console.log (prefix === db.id) // false
// ------------------------------------------------
