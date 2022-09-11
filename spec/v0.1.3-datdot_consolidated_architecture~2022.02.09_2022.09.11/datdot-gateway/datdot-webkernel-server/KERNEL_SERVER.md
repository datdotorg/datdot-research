# datdot-webkernel-webserver
serve localhost datdot page

# @TODO:
* [ ] describe webkernel + web server spec
* [ ] `@TODO:` figure out if the localhost website can be embedded in regular HTTPS pages


## WEB APIs USAGE
What we use
  websockets
  webrtc data channels
  webcrypto
  webworkers (trying, not fully there yet)
  asm.js
  xhr
  fetch
What we want
  webrtc data channels in webworkers
  better suborigin spec
  some enhancements for webcrypto
  streaming support for fetch
  cancel support for fetch


PUBLIC SUFFIX LIST
https://publicsuffix.org/learn/



## KERNEL

```js
const http = require('http')
const server = http.createServer(handle)
function handle (request, response) {
  const { url } = request
  if (url !== '/webkernel.js') return
  const js = `...`
  response.end(js)
  // --------------------------------------------------------
  // --------------------------------------------------------
  // HYPERWEB KERNEL source code: see webkernel
  // --------------------------------------------------------
  // --------------------------------------------------------

  // ...

  // --------------------------------------------------------
  // FEATURE: EXTENSIONS: of webkernel: see webkernel
  // --------------------------------------------------------
  installer: // system (localhost) url: => click to open app (download via hyperurl or regular url)
  // ----------------------------
  // SERVICE/DAEMON/SERVER/PROCESS
  // ----------------------------
  // e.g. datdot app...
  // * generically (sudo) installable through "app store"
  // * is downloaded and run in a atek style background sandbox
  // * offers an API to interact/configure it via frontend script or frontend UI
  // * can be generically removed via frontend UI/script when talking to system kernel
  // ----------------------------
  // @TODO: this is to later install datdot app
  // => datdot app will install the "datdot node tree" and make it available as a kernel extension in `function system (api) { }` in the frontend - maybe...
}
```
