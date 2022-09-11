# BACK
**[main](/README.md)**

# `playproject-io/datdot-webapp`
formerly: https://github.com/ninabreznik/pinning-service-webpage

now: https://github.com/playproject-io/datdot-ui
and: https://github.com/datdotorg
and: https://github.com/datdotorg/datdot-ui
and: https://github.com/datdotorg/datdot-assets
and: https://github.com/playproject-io/datdot-research/issues/4 (is specifically about the datdot-webapp)

contains UI to interact with datdot gateway (service+chain)

## `datdot.html` SYSTEM APP
responsive web app PWA UI (polkadot.js + datdot-service.js)
```html
<!--
=> open webUI in regular browser + origin isolation


data information
node inforamtion
settings
power

---------------------
TOP WINDOW MODE:
---------------------
PLAN+WORK:
* support "dat health" module for a dat/hypercore dashboard
* registering availability and requesting pinning
  * (and interact with the rest of the public API)

WALLET-APPS:
* set/retrieve permissions
* support permissions

WALLET-APPS-DATA
* try to model all BEAKER BROWSER features and API
  * e.g. internal storage of hypercores
  * e.g. management of all public/private keys
  * e.g. set permissions
* **API** COMMUNICATION (=IPC)
  * **FUNCTIONS**
    * ...
  * **EVENTS**
    * ...

---------------------
IFRAME MODE:
---------------------
* talks to localhost http server (via HTTPS or SECURE WEBSOCKETS)
* support `.postMessage` to communicate when embeded via (e.g. 0x0 pixel) `iframe`
* listens to `window.onmessage` events and forwards them to localhost server
  * by default forwards ALL requests
  * later implements some kind of PERMISSION model
* DETECTION: `width/height is 0x0` then it just doesnt load any UI and only forwards stuff
* DETECTION: `window.parent !== window` act as IFRAME
* maybe support `"shared array buffers"` for better performance

-->
```

## `datdot.js`
```js
import 'webkernel.js'
boot(import.meta.url, function system (api) {
  const { require } = api

  const chain = require('datdot-chain')
  const service = require('datdot-service')
  // @TODO: refine this
  chain(service(chain))

})
```