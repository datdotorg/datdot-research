# VAULT

```js
/*

https://github.com/solid/process


---------------------------------------
---------------------------------------
VAULT
---------------------------------------
---------------------------------------
-----------------------------
* TRUST REQUIREMENTS
-----------------------------
  * ...
-----------------------------
* DEPENDENCIES
-----------------------------
  * ...
-----------------------------
* FEEDS
-----------------------------
  1. VAULT LOG => associated wallets and their status
  2. STATUS LOG => to ACK to other VAULTS
      * all VAULTS have STATUS FEEDS
      * e.g. share what they already synced (so other VAULTS know ACK of all other VAULTS)
      * communicate status encrypted
-----------------------------
* LIFECYCLE
-----------------------------
  1. SETUP/INIT:
    1. download and start/run VAULT software somewhere
    2. STORAGE:
      * ROOT VAULT generates unique root pod keypair
      * keeps NO KEYPAIRS other than generated unique podkeys (keypair)
      * makes a "POD LOG FEED" to keep a log of wallet pairings and log ins/outs (=connects/disconnects)
      * STATUS:
        0. how much storage is (used/free) and maybe other available resources
        1. UNPAIRED - when fresh
          * PAIRED
        2. PAIRED - as given during installation
          * UNPAIRED
          * REPAIRED -> PAIRED (but a new IDENTITY controls the pod)


   VAULT is a POD with private keys!


    * SERVICE: is an offered service (= can be any hyper node which offers that service) similar to a corestore
      * // @TODO:  how does service work? how does connecting to wallets work?
      * an unpaired vault will write ownership of first wallet keypair connection into its log
        * e.g. initial pairing could be by the local wallet keypair & UI
      * wait for VAULT-WALLET-PAIRING & CONNECTION:
          1. so connecting exchanges pubkeys (wallet<->vault) to subscribe
          2. @TODO: cannot service apps/system before??






Whats a VAULT?
  * all vaults subscribe to wallet feeds
  * has an invite address (address + invite password)
  * running vault pins FEED_SYSTEM
  * is always remote from perspective of SYSTEM or WALLET or WEB KERNEL and communicates via MESSAGES
  * QUESTIONS:
    * does VAULT only work while actively connected to a WALLET?
    * An INVITE CODE can be safely given to a stranger to make them use ones VAULT
      * => it gives them a unique sandboxed sub vault








  2. START:
    * e.g.: node -e 'require("datdot-vault")({ host: "127.0.0.1" port:8080, invite: "foobar123" })'
  3. OPERATIONS:
    1. DATAPOD
      * DATAPOD = HYPERNET + HYPERVAULT
      * CONNECTIVITY:
        * allow authorized wallets to connect
        * is connected/disconnected to/from HYPERNET node
          * open/close policy for connected hypernet node to allow usage by external devices
      * WALLET-COMM:
        * delegates signing to ACTIVE wallet
        * take commands from authorized "wallet command feeds" to decide upload/download/seeding/selfdestruct/...
        * store and maybe seed feeds based on "SEED FEED" of wallet/identity
        * ADD/REMOVE:subscription
            * downloads wallet feeds of all authorized wallets
            * updates its own functioning status feed for wallets to display
            * should maybe be grouped by `secret/protected_with_friends/public` regarding visibility on IDENTITY FEED
                * => public allows any peer to connect, but also hostile peers to attack e.g. DDOS
            * connects to other HYPERPODs of same IDENTITY (based on settings)
            * learns about other IDENTITY vaults/pods via WALLETS FEED / VAULTS FEED LIST
            * stop and derive new shared secret when VAULTS learned about a change in VAULTS Set through WALLET FEED
              * all authorized vaults/pods do this mutually with each other (multi handshake dance)
              * VAULTS can listen to each other to derive shared secret
            * stop syncing if they are ever removed from WALLET FEED (removal is irreversiable through feeds)
              * (currently undefined what happens to the removed vault)
          * `restart command?`
          * `update command?`
          * VAULT will not accept an entry if it already has a newer entry (malicious wallet can NOT update sudo feeds)
          * VAULT will send back a warning if it tries to sign something old + not accept the commit from WALLET
            => do not issue requests to vaults, but append to their own feeds
            => all wallets sync vault request feeds
            => active wallet signs
    2. HYPERNET NODE
      * connect to hyperswarms and hyperpeers
      * gives access to feeds via hypernet
  4. STOP:
    * e.g.: <ctrl+c>
  5. TRANSITIONING:
    * FAILURE CONDITIONS:
      * vault device gets destroyed (or becomes permanently unavailable)
      * vault gets corrupted
      * vault gets hacked
      * user decides to replace vault
    * REPLACEMENT PROCESS:
      * ...
  6. TEARDOWN/DESTROY:
    * => delete software + vault data folder on disk
-----------------------------
* FUNCTION:
-----------------------------
  * all vaults subscribe to wallet feeds
  * has an invite address (address + invite password)
  * SEEDING: running vault pins FEED_SYSTEM
    * all VAULTS seed WALLET FEED
  * is always remote from perspective of SYSTEM or WALLET or WEB KERNEL and communicates via MESSAGES
  * is supposed to store user data (e.g. from browser)
    * => needs running hyperdht-gateway deamon
    * => 1+ vaults connected to hyper can download and then just store or also seed the data and receive commands
-----------------------------
* QUESTIONS:
-----------------------------
  * does VAULT only work while actively connected to a WALLET?
  * can an INVITE CODE can be safely given to a stranger to make them use ones VAULT
    * => to give them a unique sandboxed sub vault










@@@@@@@@@@@@@@@@@@@@@@@@
// hyperpod.js
const hypernetwork = require('hypernetwork')
const hyperpod = require('hyperpod')

module.exports = hypernode // = data vault

function hypernode () {
  cosnt net = hypernetwork() // hyper network
  const pod = hyperpod()     // data vault
}

=> is it possible to run a "node" which has many PODs potentially owned by different IDENTITIES
==> ...at the end each `swarm` uses a different keypair and probably creates a different swarm server node?
===>  new Swarm(keypair) // creates DHT server  ..similar to DHT.createServer(keypair)
===> makes sense that every POD gets a particular unique PORT at least
===> to potentially enable local connection
===> to potentially connect via websocket or deamon...
===> for a user with his wallet to discover their pod.remoteKey, because their pod is using their unique swarm with keypair
..so if you wanna run many pods,
..maybe have a single root process
.. but create many pods + nets
@@@@@@@@@@@@@@@@@@@@@@@@

*/
```