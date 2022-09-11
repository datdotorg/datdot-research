# SHIM/POLYFILL
multiple seperate modules working together as a shim/polyfill in different targets


# MODULES
1. datdot-gateway
2. datdot-service-worker
3. ...





-----------

# REQUEST PROXIES
js-ipfs running in browser context does not provide gateway functionality (browser can't open raw TCP sockets).
What if we expose it in JS as const response = await node.httpGateway(request) // expose HTTP gateway as programmatic interface
so we can reuse it in Web Workers and other browser contexts?


1. detect if browser context
  * NAY: expose Gateway on TCP socket
  * YES: expose Gateway via `node.httpGateway(...)`
    * params: "IPFS path" or "request object"
    * return: response object + headers + payload
    ==> makes it easy to use in SERVICE WORKER without "heavy duty code" in SW

WHY?
   ==> frontend devs no need to worry about dependency
   ==> have `window.js_ipfs.httpGateway(...)`instance in page => no need for custom HTTP-like resolver
