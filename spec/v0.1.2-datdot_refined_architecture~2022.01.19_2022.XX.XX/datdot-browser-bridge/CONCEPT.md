# CONCEPT


# IFRAME SANDBOX:
**RESEARCH IFRAME SANDBOX instead of SUBDOMAINS:**
1. `allow-same-origin` - without it, iframe is treated as "SPECIAL (unique) ORIGIN" to always fail "same origin" policy
2. but IFRAME document.referrer service worker does not intercept requests of those iframes
  * also: iframe can still access same storage! as window.top
3. maybe IFRAME from BLOB URLs work similar

**ATTRIBUTES:**
  * sandbox="allow-same-origin allow-scripts allow-presentation allow-popups allow-pointer-lock allow-orientation-lock allow-modals allow-forms"
  * style="width: 100%; height: 100%; left: 0px; top: 0px; position: absolute;"

**limits??**
Use of "iframe + SW" as I described earlier was also proposed.
I was also pointed out that "embedding limitation" I was concerned with could be addressed in few different ways:

Embedding images or other self contained files isn't a huge deal you could obtain ArrayBuffer for it
and then make blob url to embed.


**IFRAME PROXY NODE**
using proxy iframe say <iframe src="https://ipfs.io/node" />
that could proxy all the requests received on window.onmessage
to its service worker
and proxy responses back to event.source.

It would no be able to:
1. Enable embedding of images or other resources into other origins
2. And I suspect iframe may fail to load if browser is offline,
   but maybe browser cache or legacy app cache could be used to overcome it.





# ARCHITECTURE CONCEPT
1. e.g. `datdot.org` registers SW
2. embed hidden iframe (e.g. `kernel.com`), which registers IPFS node as service worker
3. `datdot.org` obtains messagePort to iframe SW (`kernel.com`) and transfers to own SW
4. now datdot SW and kernel SW can talk to serve IPFS content through datdot SW forwarded via message channel

# ARCHITECTURE OPTIMIZATION
1. iframe with daemon loads + says "hello" via BroadcastChannel
2. if any cocument (client?) has already spawned a Worker (=supervisor)
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

@THOUGHTS: Safari (=no SharedWorker available, but ServiceWorker is)
```js
// 1. spawn SW + activate
// 2. SW broadcasts PING to all clients
// 3. clients respond with PONG
// 4. keep repeating
// => keeps SW alive & going while clients ping/pong
async function extendLifetime () {
  await sleep(1000 * 60 * 4) // Firefox will wait for 5mins on extendable event than abort.
  const clients = await self.clients.matchAll({ includeUncontrolled: true })
  for (const client of clients) client.postMessage("ping")
  await when("message", self)
}
const when = (type, target) => new Promise(resolve => target.addEventListener(type, resolve, {once:true}))
self.addEventListener("activate", event => event.waitUntil(extendLifetime()))
self.addEventListener("message", event =>  event.waitUntil(extendLifetime()))
```

# ARCHITECTURE DATA ACCESS PERMISSIONS
simple ability to whitelist multiple Origins to share the same worker would make various deployments a lot easier.




# CORS
-----------------
ServiceWorkers are able to make requests according to the same security restrictions as a page.
So, they can make a x-origin request (xhr, importScripts or fetch) the same as the page,
but the response will restricted in the same way it would be in the regular page – CORS headers and CSPs apply.

x-origin request (xhr, importScripts or fetch)
=>
response will restricted (CORS Headers + CSPs apply)



```js
/******************************************************************************
  VAULT - KERNEL FRAME ??? (because it anyway does not store private keys!)
******************************************************************************/
// in-browser iframe storage node
// standalone rest api storage node
// => flag specific storage node as owned by the user
// ==> authentication/credentials
// ==> those nodes actively sync pins/virtual filesystem structures between them

// e.g. standalone node running on my workstation
// => open a browser on my workstation, laptop, or phone, they all create an in-browser node
// ==> four nodes that are all "me" and storing my data
//
// CONFIG:
// => want to configure the in-browser node on my workstation to do minimal storage
// => control to indicate my workstation node should pin/keep a copy of everything the others pin (=primary backup)
// => the laptop should as well, when it's online (secondary backup)
// => phone node would only pin important things (space concerns), but being able to browse "known" hashes/files on the workstation/laptop nodes would be ideal


// From that perspective, it would be fine if all in-browser nodes stayed in-browser nodes
// ==> (no need to "change over" to a standalone node if it came back online),
// ===> but pinned/known file syncing could be very useful


/* VAULT CONCEPT:

1. every browser creates in-browser-storage-node
  * keeps data in its cache
  * syncs selected data sets from other nodes
2. standalone nodes are nodes which in-browser-nodes can connect to
  * keep data in its cache
  * syncs selected data sets from other nodes


*/
```

```js
// @INSPIRATION: https://lunet.link/lunet/host.js

/******************************************************************************
  STANDARD QUESTIONS:

    PLAYGROUND:

******************************************************************************/
1. when will browsers support importmap? (suggestion: standardize on `package.json`)
2. should kernel load `package.json#imports` as importmap?
3.


https://system.localhost/
// auto uses https://wallet.localhost/


https://localhost   // does not get any shielding of localstorage

https://localhost/system/



// <script type="importmap" src="package.json"></script>

URL0: `index.html`
* (is loaded by user and cannot come from import map)
* can take a bunch of custom params compatible with the system it loads
* can take a hash of the users wallet which defaults to `wallet.localhost`

URL1: e.g. `index.js`
* (can import import map resolved name or direct name)
* can define the default params for the system it loads
* can take a hash to define a default wallet in case wallet.localhost is not available and the url does not specify a wallet
  * but also needs to specify HYPERADDRESS for SYSTEM => but that is KERNEL MODULE SPECIFIC !!!
  * => only the system function should probably load data from hyperdrives, etc...

URL2: e.g. `https://kernel.com/kernel.js`
URL2: e.g. `https://datavault.com/vault.js`
* (can import from import map resolved name or direct name)
* is the kernel URL which ignore all params for now - because of SW import has to hard coded anyway!
   => so app/system developers cannot make a kernel with settings incompatible with the normal `kernel.localhost` kernel
   ==> or maybe it allows to define params for additional KERNEL MODULES (e.g. to support HYPERCORE, IPFS, etc...)





/*
* all direct urls will be known anyway, whether used through import map or not
* importmap is optional and should exist as `package.json` for kernel to pick it up
* and add it dynamically to HTML file
* PROBLEM: nodejs cannot execute system, because it cant import a url,
* => unless maybe overwritten in package.json#imports
*/


@TODO: ...



@THOUGHT - EXTENSIONS!
1. have generic kernel
2. have vault and logging in place
3. allow to define a custom syscall interface - next to the generic ones


function system (api) {

  const { use } = api
  // instead of EXTENDING the KERNEL API
  // => WRAP the KERNEL API in your system to offer something more specific to your app or whatever

  // => offer it maybe as a higher level KERNEL ?!?

  // ... @TODO:  ... BUT, how would others use that in the same way?


}


/* EXTENSION IDEA:
As a data point, require('src/http/routes') gives you an array of route handlers that look something like this for example:
{
  method: '*',
  path: '/api/v0/dns',
  handler: async (request, h) { ... }
}
There should be no dependencies on Hapi in this tree but it does use joi for validation and boom for creating http friendly error messages.
So, in that sense if we just extracted src/http to a seperate module as-is, you could share it without further work if you built an adapter to map whatever request system you're using to them.
*/






/******************************************************************************
  KERNEL/STORAGE: [https://kernel.org]   (as standalone)
******************************************************************************/


/******************************************************************************
  KERNEL/STORAGE: [https://kernel.org]   (as iframe)
******************************************************************************/
[HOST IFRAME]:  (inspiration: https://lunet.link/lunet/host.js) + see end of main.js file
1. registers its own service worker
2. listens on embedder messages
3. adds listener to message.ports[0] passed by embedding client during init
4. messages are serialized request instances forwarded to host iframes own service worker which talks to HYPER GATEWAY
5. sends response from own service worker back to embedding client message port
6. CLIENT will forward it to its own clients service worker

---------
CLIENT only cares about IPFS PATH embedded in a meta tag, but maybe it can be improved
e.g. https://datdot.org/#hyperlink
==> or if hyper is set as dnslink record, the service worker can use a hyper gateway to look up for a domain and serve back
==> but that makes the whole thing dependent on DNS!
If (1) returned error (no DNSLink or API down) then fallback to version from <meta> (if present)


IMPROVEMENTS otherwise:
On one hand host should not need to register SW because in practice SharedWorker would do a better job here.
I still have it though so that it can load https://lunet.link/lunet/host.js while offline,
however it would make sense to figure out a way to do it without SW.


SAFARI:
1. no BroadcastChannel
2. no SharedWorker

/******************************************************************************
  CLIENT/SYSTEM/APP: [https://datdot.org]   OR   [https://cabal.chat]
******************************************************************************/
[CLIENT/SYSTEM/APP SIDE]:
1. index.html is loaded, which sets up an embedded HOST IFRAME + SW.
2. Once all is set main_js will fetch location.href this time it will go through SW and there for response will
   ==? be for /ipfs/QmYjtd61SyXU4aVSKWBrtDiXjHtpJVFCbvR7RgJ57BPZro/.
3. Document tree is updated with a response.
   ==> It is important to update document rather then reload because SW will message client (that will be this document)
   ==> which then obtains response through embedded iframe.
   ===> If you were to reload there would be no client for SW to get data through.
   ===> In fact if you navigate to any page
   ====> SW will respond with <script type="module" async src="https://lunet.link/lunet/client.js"></script>
   ====> that will do the same thing: fetch own location and update document with response.



/******************************************************************************
  CLIENT/SYSTEM/APP: [https://datdot.org]   OR   [https://cabal.chat]
******************************************************************************/

URL0: // index.html?params#hyper_data_address
<script>import('./system.js')</script>

// ----------------------------------------------------------------------------

URL1: // system.js
import 'https://webkernel.com/kernel.js'
boot(import.meta.url, function system (api) { /* api.use(url) vs. api.fetch('web+xxx://url') */ })
// the latter via protocolHandlers web standard

// ----------------------------------------------------------------------------

URL2: // kernel.js
1. check for localhost and if datdot shim is available, prompt user to switch by:
  * YES: reload to `system.localhost?params#hash`
    * forwarding: `system function`
    * location.href (including params/hash)
    * kernel url
    * system url
    *
  * NO: proceed in normal way
2. NORMAL WAY: (first load)
  1. register kernel service worker
    * => changing index.html wont update anything after first load!

@TODO: !!!!

    * => change MUST be included in `system.js` which IS and loads service worker to trigger the update! (instead of index.html or its META tags)
    * => at least HYPER ADDRESS includes all future updates unless hyper address changes
  2. add kernel iframe
  3. store CONFIG data under KERNEL WORKER URL
  4. reload
3. NORMAL WAY: (later loads)
  0. index.html request to kernel worker
  1. load CONFIG
  2. serve default page
4. default page served by service worker
  <!doctype html>
  <html>
    <head><meta charset="utf-8"></head>
    <iframe class="kernel" src="URL2/index.html"></iframe>                       // load kernel storage to get config, because system SW cant foreign fetch it from KERNEL PAGE
    <iframe class="wallet" src=""></iframe>                                      // ...
    <iframe class="system" src="system.localhost#"></iframe>                     // maybe sandboxed SRCDOC as "SPECIAL (unique) ORIGIN without "service worker", but can parent.postMessage ???
                                                                                 // but KERNEL should resolve hyperaddress of local system
  </html>


@TODO: !!!!

2. And serve document like: <iframe src=`://${appCID}.celestial.link/` data-src=`/ipfs/${dataCID}`></iframe>
3a. IFRAME ${appCID}.celestial.link will do register proxy SERVIE_WORKER
3b. SERVIE_WORKER, on request send messages to corresponding document (meaning ${appCID}.celestial.link).
4. ${appCID}.celestial.link listens to those messages and routes them to window.top
5. window.top in this instance https://lunet.link/peerdium.gozala.io/${dataCID} that captures event.origin and data-src routing request to the SharedWorker.
6. SharedWorker takes care of handling requests & imposing restrictions:
  ==> Allow reads as long as they fall under ${appCID} or ${dataCID}.
  ==> Allow writes as long as they fall under ${dataCID} in which case it will produce response containing ${dataCID2} which https://lunet.link/* uses to update data-src attribute.



/******************************************************************************
  [https://system.localhost?params#https://cabal.chat]   OR   a system page you trust to load another app
******************************************************************************/
1. visit page
2. Resolve appCID (=hyper address) that corresponds to peerdium.gozala.io via KERNEL SHIM
3. service worker serves page from legacy web

@TODO: what and how to load systeM and which wallet?

e.g. https://lunet.link/peerdium.gozala.io/${dataWalletCID}

/******************************************************************************
  [https://system.localhost?params#hyper_address]   OR   a system page you trust to load another app
******************************************************************************/
1. visit page
2. service worker serves page from hyperdrive via hypernetwork

@TODO: what and how to load systeM and which wallet?

e.g. https://lunet.link/peerdium.gozala.io/${dataWalletCID}


/******************************************************************************
  [https://system.localhost]
******************************************************************************/
// index.html
<script>import('system.js')</script>

// system.js
import 'https://kernel.localhost'
boot(import.meta.url, function system (api) { })

// kernel.js
1. figure out we are on localhost
2. load default system or load system from params
3. proceed in normal way

/******************************************************************************
  [https://wallet.localhost]
******************************************************************************/
// index.html
<script>import('system.js')</script>

// system.js
import 'https://kernel.localhost'
boot(import.meta.url, function system (api) { })

// kernel.js
1. figure out we are on wallet.localhost
2. load default system
3. proceed in normal way
4. allow user to add URL for system to add and launch
  * fetches info from e.g. https://datdot.org, https://cabal.chat or their corresponding hyper addresses!

/*****************************************************************************/

CONSEQUENCES:
1. Application hosted on p2p network is disconnected from all the servers and there for can't really aggregate data.
2. Application get's to read data that is being provided to it without:
Knowing it's public address
Knowing whether encryption / decryption occurs during read / write operation (Yes that will be a case)
3. Lunet is fully aware what app is loaded and what document / data it's operating on & there for can provide save / share functionality.
4. App can initiate share which would be handled by lunet instead.



// NO FOREIGN FETCH
// 1. resource request from a.com's ServiceWorker
// 2. to a resource on b.com
// 3. will on purpose NOT hit the ServiceWorker that b.com has registered
// THERE IS NO FOREIGN FEETCH, which would have enabled it. It got explicitly removed!

```