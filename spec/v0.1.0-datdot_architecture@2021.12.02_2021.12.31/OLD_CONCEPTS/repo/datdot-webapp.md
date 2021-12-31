# `playproject-io/datdot-webapp`

### 4. WEBAPP - `ui.html`
* for responsive PWA user interface (polkadot.js + service.js)
* work with @fionataeyang to make a nice responsive UI :-)
* set/retrieve permissions
* support permissions
* support "dat health" module for a dat/hypercore dashboard
* talks to localhost http server (via HTTPS or SECURE WEBSOCKETS)
* support `.postMessage` to communicate when embeded via (e.g. 0x0 pixel) `iframe`
* listens to `window.onmessage` events and forwards them to localhost server
  * by default forwards ALL requests
  * later implements some kind of PERMISSION model
* DETECTION: `width/height is 0x0` then it just doesnt load any UI and only forwards stuff
* DETECTION: `window.parent !== window` act as IFRAME
* maybe support `"shared array buffers"` for better performance
* try to model all BEAKER BROWSER features and API
  * e.g. internal storage of hypercores
  * e.g. management of all public/private keys
  * e.g. set permissions
* **API** COMMUNICATION (=IPC)
  * **FUNCTIONS**
    * ...
  * **EVENTS**
    * ...
