# datdot-service-worker

## `@todo`
* [ ] **spike program several potential solutions**
  * [ ] set up servers on localhost and try to auto-switch and use them from pages running on glitch
  * [ ] set up an iframe with `allow-same-origin` for cross origin and see if this can manipulate parent
  * [ ] try to make nodejs bios.mjs into something similar to a service worker kernel,
    * which can intercept all imports
    => but can it also intercept everything else?
    => maybe that needs sandbox shim to intercept e.g. fetch() ...
  * [ ] maybe try to serve a custom HTML file with a custom SCRIPT that serves a custom SW
    => but old SW serves new SW script which looks local, but is constructed and takes over, lets see
    => but probably old SW can never intercept a new SW request
    ==> update SW to use different kernel only works by opening a different trusted page


-------------------------


// https://gist.github.com/manekinekko/7e58a17bc62a9be47172
// import regex
// NO FOREIGN FETCH
// 1. resource request from a.com's ServiceWorker
// 2. to a resource on b.com
// 3. will on purpose NOT hit the ServiceWorker that b.com has registered
// THERE IS NO FOREIGN FEETCH, which would have enabled it. It got explicitly removed!


-------------------------
# ARCHITECTURE PLUMBING OPTIMIZATION
1. iframe with daemon loads + says "hello" via BroadcastChannel
2. if any document (client?) has already spawned a Worker (=supervisor)
  * this client will respond back with MessagePort connected to own worker (+index it was assigned via incrementing)
  * if no client responds n time, document assums a supervision and starts index
  * supervisor `onbeforeunload` event broadcasts "good bye" message with index of next supervisor to nominate
  * next on line spawns worker and acts as supervisor
3. every document messages supervisor `onbefureunload` so supervisor can nominate new supervisor `onexit`
  * => worker lifetime is inconsistent ==> however, worst possible scenario, it would probably still better than SERVICE WORKER already is!
4. also worth considering if DAEMON manages to connect to "browser extension" or "local REST API daemon", there ill be no need to even spawn workers

@THOUGHTS:
1. any domain with its service worker can serve by connecting to cross-domain via iframe of one of its tab/iframe instances
2. different domains need their own iframe
3. if a service worker of a domain currently has no iframe access, it can instruct any of its instance tab/iframes to make the iframe
4. an instance closing broadcasts that a replacement is needed in another remaining instance



-------------------------
DATDOT IN BROWSERS
-------------------------
At present, in order to interact with IPFS in a web browser, you must either bundle js-ipfs-core (a full IPFS node in JavaScript) with your client-side application, or use the js-ipfs-http-client HTTP RPC API client library to connect to an external daemon running on a local or remote machine.

To learn more, make sure to check the browser-* examples at ipfs-examples/js-ipfs-examples
Highlight: an advanced, end-to-end example of using js-ipfs node in SharedWorker from ServiceWorker can be found at js-ipfs-examples/browser-service-worker




# ARCHITECTURE
Oh ok I misunderstood which you wanted (isolation vs unification). I have a project that exposes the ethereum blockchain app api to a webapp and unifies the cache inside an iframe. Seems like something similar would be useful here.

[small ipfs-iframe lib] <-> [ipfs node in iframe] <-> [network]
We're also exploring making the node a singleton by using ServiceWorker.

[small ipfs-iframe lib] <-> [ipfs iframe proxy] <-> [ipfs node in serviceworker] <-> [network]
I'm sure theres a few gotchas with this approach, especially that webrtc may not be available in the SW.



-----------------------------------
-----------------------------------
-----------------------------------
-----------------------------------
-----------------------------------


# SERVICE WORKER
So the idea is we could avoid having multiple instances of js-ipfs being spawned by ipfs-service-workers
running on multiple pages by exposing API of a single service-worker-gateway's instance (eg. js.ipfs.io)
over iframe's postMessage+ipfs-postmsg-proxy making all those SW instances talk to that one js-ipfs instance
instead of spawning their own.



## GOAL: be able to Recover from dead Subdomain Gateways
https://github.com/ipfs/ipfs-companion/issues/800


------------------------------


Creative Use of Service Worker
We could have js-ipfs running inside of a Service Worker acting as a 'proxy' for HTTP requests to the public gateway.

See demo and PoC at IPFS runs as a Service Worker.

Good:
service worker can inject responses for a host it was installed from
if we provide Service Worker for the public gateway, and browser extension redirects everything to public gateway, then we are able to handle all IPFS requests
transparent for the end user
Bad
a user needs to visit regular HTTP site to install Service Worker
Really bad: service worker must be refreshed/downloaded every 24h
 ==> https://github.com/w3c/ServiceWorker/issues/514

we need to have separate service worker for every gateway/root CID
no connection closing + global Service Worker = memory leaks
does not address ability to control addressbar in location bar


-------------------------
HTTP HEADERS
-------------------------

https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS#the_http_response_headers

```js
// Etag maps directly to an identifier for a specific version of a resource
// TODO: change to .cid.toBaseEncodedString() after switch to new js-ipfs-http-response
response.header('Etag', `"${data.multihash}"`)
// => or hypercore-stronglinks!

// Set headers specific to the immutable namespace
if (ref.startsWith('/ipfs/')) {
  response.header('Cache-Control', 'public, max-age=29030400, immutable')
}
```

-------------------------
SERVICE WORKER
-------------------------
https://github.com/ipfs-shipyard/ipfs-service-worker-demos/pull/7


Note that keeping SW alive is going to be an arms race with browsers.
Also was proposing for Safari (As replacement for SharedWorker due to lack of it)
is different as you'll have a clients (documents served from it)
which is considered as legitimate case.


Response from the Ghostery team suggests the manifest v3 performance claim does not hold.
https://whotracks.me/blog/adblockers_performance_study.html
tl;dr degradation is milliseconds at worst

ServiceWorker
Pros:

can check urls and cids against isIPFS package
should be able to make a non blocking webRequest to check DNSLink
Cons:

Currently using a sketchy keepAlive method in the service worker, performance is questionable along with whether or not this will pass review


----
Use of "iframe + SW" as I described earlier was also proposed. I was also pointed out that "embedding limitation" I was concerned with could be addressed in few different ways:

Embedding images or other self contained files isn't a huge deal you could obtain ArrayBuffer for it and then make blob url to embed.
For things like CSS / JS that imports other stuff, little more tricky but doable sever steps:
App e.g. peerpad.net can register own service worker.
App can embed hidden iframe for ipfs.io which registers IPFS node as service worker.
App obtains MessagePort though iframe from ipfs.io service worker and transfers it to own service worker.
Now two service workers have message channel for direct exchange which allows peerpad.net to serve any content from IPFS through it's SW by forwarding data from message channel.


# OPPORTUNITIES in SW @gozala
I just want to point out there is also some interesting and not very obvious opportunity with this:

This might eliminate need for including any of the ipfs-js stuff into your app, as long as ipfs-node API is exposed via service worker. Which additionally has some benefits / concerns - On one hand IPFS could push out upgrades and it's automatically deployed everywhere, but on the other it would require a way for apps build with it to stay on older version for sometime.

IPFS companion extension also will be free to just target that API iframe rather than everything. And users of IPFS node won't need to know or care.

You could layer permissions management on top of all this. And make user in control of what data is being stored on the node and what apps have access to what.

This also provides an opportunity to let user configure to interact with say other gateway of choice.

 I think allowing data to be shared is useful no ? But restrictions on what is and isn't shared is important indeed & I think that should be part of the node's responsibility to manage. When embedded requests an API MessagePort iframe can decide what to expose per embedders origin.


 I had some initial success with iframe+sw, Service Worker seems to work in iframe as long parent page belongs to Secure Context (https or localhost), and parent page is able to access it over ipfs-postmsg-proxy (x2!):


Stage 2A: Opaque Access Point with Service Worker
[Ongoing research]

ETA: 2019+
 Thin static HTML+JS is loaded to establish Access Point Service Worker (APSW), which acts as a proxy to IPFS API provider and exposes limited API/Gateway endpoints
 Progressive peer-to-peer Web Applications (PPWA) talk to IPFS over APSW
 APSW automatically picks the best IPFS provider (js-ipfs, remote/local HTTP API, ipfs-companion)



-------------------------
PROGRESS INDICATOR ???
-------------------------
The currently implementation of the progress option is incorrect - it tracks progress of files being buffered into memory. Progress needs to be sent from the IPFS node over postMessage to the callback on the client.




-------------------------
UPDATES
-------------------------
The same problem appears with general application updates. Let's say you deployed application with hash ABC (which in MFS would be scoped appropriately), and now you have an update. Unless you have a mechanism for telling the user about the new hash (IPNS/application pubsub updates [?]/other), the user will be stuck at that version and that might be fine.

Instead, by using IPNS you'd have MFS scoped properly to the publishing key instead, where both application updates and MFS scoping would work correctly.

Asking for permissions is interesting though, because that also gives the application developer a way of requesting access to another applications data, for interop between apps. But there is also the risk of collision between apps (since the application developer and not the user is requesting access to a path [or maybe not? Maybe the user can change it to their liking ala Android with sdcards?])

Also, regarding requesting access, the user would have to keep track of which application has access to which path, as otherwise you could accidentally give access to the wrong directory, that might not be a great idea.

I'm leaning towards having things as transparent as possible (let IPFS applications be locked to /ipfs/asd and IPNS applications be locked to /ipns/asd) but I also see value in offering easy ways of doing data sharing between applications. I'm thorn.


----

On Pushing Security Decisions Onto Users
Maybe this will help:

Let's take a look at Origin-based security context that isolates local storage, cookies etc in the regular web. Note that there is no GUI for opting out of Origin-based isolation per website. We have low-level CORS dance just so that one page can access API of the other. But no GUI for escaping Origin sandbox. That is for a good reason.

Here comes my main fear: as soon as we introduce UI for apps to ask user for access outside of its default security perimeter, we will end up with Windows Vista UAC-like hell of nagging dialogs. Of course every app will want access to the root of your ipfs.files. Should it? IPFS introduces interesting space for innovation, as we can have zero-cost copies of the same data across multiple sandboxes.

I feel we should aim in the other direction: remove friction (dialogs) for every sandboxed API method. Look closely at various methods and decide which ones are safe to be executed without any ACL prompt.
Otherwise users will just learn to press "alllow" without reading, which defeats the purpose of ACLs





```js
// SERVICE_WORKER.js
// -----------------



// @flow strict

const NAME = "service"
const VERSION = "0.0.11"
const ID = `${NAME}@${VERSION}`
const serviceURL = new URL("/", self.location)

const install = (event /*:InstallEvent*/) => {
  console.log(`Proxy installed at ${self.registration.scope}`)
  // Cache all the assets that we may need so they can be served offline.
  event.waitUntil(setup())
}

// Companion service is used p2p sites / applications. Site uses embedded
// `iframe` with `companion/bridge.html` to connect this SW with an
// "access point" SW allowing site / app to load all of the data from the p2p
// network.
const activate = (event /*:ExtendableEvent*/) => {
  console.log(`Proxy activated at ${self.registration.scope}`)
  // At the moment we claim all the clients. In the future we should
  // consider how do we deal with SW updates when former one already has
  // clients.
  event.waitUntil(initialize())
}

const request = (event /*:FetchEvent*/) => {
  console.log(
    `Proxy ${self.registration.scope} got a fetch request ${event.request.url}`,
    event
  )
  const response = respond(event)
  event.respondWith(response)
}

const respond = async (event /*:FetchEvent*/) => {
  const cache = await caches.open(ID)
  const response = await cache.match(event.request, {
    ignoreSearch: true,
    ignoreMethod: true
  })

  if (response) {
    return response
  } else {
    const url = new URL(event.request.url)
    switch (url.hostname) {
      case self.location.hostname:
        return page(event)
      default:
        return fetch(event.request)
    }
  }
}

const page = async (event /*:FetchEvent*/) => {
  return new Response(
    `<html>
    <head>
      <meta charset="utf-8" />
      <title>Lunet</title>
      <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
      <meta name="description" content="Lunet" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <script type="module" src="/main.js"></script>
    </head>
  </html>
`,
    {
      status: 200,
      headers: {
        "Content-Type": "text/html"
      }
    }
  )
}

const setup = async () => {
  const skip = self.skipWaiting()

  console.log(`Proxy is setting up ${self.registration.scope}`)
  const cache = await caches.open(ID)
  const urls = [
    new URL("/main.js", serviceURL).href,
    new URL("/embed.js", serviceURL).href,
    new URL("/ipfs.js", serviceURL).href,
    new URL("/lunet/unpkg.com/ipfs/dist/index.js", serviceURL).href,
    new URL("/lunet/unpkg.com/ipfs/dist/index.js.map", serviceURL).href,
    new URL("/lunet/unpkg.com/ipfs-http-response/dist/index.js", serviceURL)
      .href,
    new URL("/lunet/unpkg.com/ipfs-http-response/dist/index.js.map", serviceURL)
      .href,
    new URL("/lunet/unpkg.com/tar-stream/dist/index.js", serviceURL).href
  ]
  console.log(`Service is caching`, urls)
  await cache.addAll(urls)
  console.log(`Service cached`)

  await skip
  console.log("Installation is complete!")
}

const initialize = async () => {
  console.log(`Proxy is initializing ${self.registration.scope}`)
  const clients = await self.clients.matchAll({ includeUncontrolled: true })
  console.log(`Proxy is claiming all clients ${clients.map($ => $.url)}`)

  await self.clients.claim()

  const keys = await caches.keys()
  for (const id of keys) {
    if (id !== ID && id.startsWith(NAME)) {
      console.log(`Proxy is clearing obsolete cache: ${id}`)
      await caches.delete(id)
    }
  }

  console.log("Proxy activation is complete")
}

self.addEventListener("install", install)
self.addEventListener("activate", activate)
self.addEventListener("fetch", request)




```
