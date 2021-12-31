# `playproject-io/datdot-service`
* [API](https://github.com/playproject-io/datdot-service/blob/master/index.js)

# `playproject-io/datdot-daemon`

### 3. SERVICE - `playproject-io/datdot-service`
* (=daemon) (=https/wss server)
* https://github.com/playproject-io/datdot-service/blob/master/index.js
* the rust code defines the input and output types
* DEPENDENCIES:
  * `var chain_api = require('datdot-chain')`
  * `var library_api = require('datdot-library')`
  * webapp `ui.html`
* support permissions
* [ ] `@TODO:` figure out if the localhost website can be embedded in regular HTTPS pages
* **datdot-http-server**
  * localhost:port SSL ? 
  * make it work across operating systems + even mobile OSes (using e.g. `cordova`)
  * mixed origin restrictions on browsers
  * serves `ui.html` via `localhost`
  * acts as an API endpoint exclusively for `ui.html`
  * uses local domain `https://dat.dot`
    * a skippable step that installs to `/etc/hosts` or similar
    * see: https://www.npmjs.com/package/hotel
    * and also make sure that a localhost running server will not respond to anything
else than the one single website it is serving - to minimize "attack surface" maybe?
  * try "let's encrypt" certificates with the local domain
    * check how or what `budo` is doing
  * serve page with "MAXIMUM RESTRICTIONS" so it can only talk to it's "localhost" server
* **hyperswarm-web** (swarming layer for peer connections)
  * bundle a hyperswarm-web with datdot
    * => so everyone who has datdot installed and running to participate in the p2p-hashbase
    * => has one running on localhost which they can use
    * => And websites who don't detect a local hyperswarm-web running,
    * => will suggest/prompt users to download datdot in order to be able
    * => to start using the particular dweb app they are visiting
    * ...
    * we talked about datdot users sharing their public endpoints with each other earlier,
    * which would make sense if we're trying to make something actually useful
* structure of components which @ninabreznik might require in or
  * around `datdot-service`, which might also include modules about
  * "hypercores & hyperswarm health" data, quality of service,
  * how much it is distributed, etc...
* **API** COMMUNICATION (=IPC)
  * **FUNCTIONS**
    * ...
  * **EVENTS**
    * ...