# IFRAME DATA REGISTRY

SANDBOX ATTRIBUTES:
https://developer.mozilla.org/en-US/docs/Web/HTML/Element/iframe#attr-sandbox




SECURE CONTEXT TEST:

Interesting development:
As of 2019-10 localhost (hostname) is a secure context in both Firefox and Chrome.

Caveat: Firefox does not include subdomains (foo.bar.localhost is not a secure context), but I posted our use case in related bug to match behavior from Chrome:
https://bugzilla.mozilla.org/show_bug.cgi?id=1433933#c6

There is also a discussion to skip DNS lookup for *.localhost (https://bugzilla.mozilla.org/show_bug.cgi?id=1220810) and hardcode it to loopback, which would make it work on all platforms, regardless of local DNS setup.

This makes *.localhost nearly ready for use (waiting for Firefox to match Chrome).
I updated the first post in this issue to reflect current status.

Demo
Loaded http://en.wikipedia-on-ipfs.org.ipfs.localhost:8080/ipns/en.wikipedia-on-ipfs.org/wiki/ today and Chrome marks it as secure context:





As of 2019-10 localhost (hostname) is a secure context in both Firefox 69 and Chrome 78.
Firefox does not support *.localhost yet, but everything suggests it will at some point – more details in ipfs/in-web-browsers#109 (comment)




2020-04-28

IPFS Companion redirects DNSLink websites and public gateways to a local subdomain gateway that provides proper Origin isolation
go-ipfs 0.5.0 shipped, updated docs in Update notes about hosting own subdomain gateway ipfs-docs#190
**Secure Context issue in Firefox will be solved when https://bugzilla.mozilla.org/show_bug.cgi?id=1220810 is closed**




2020-07-09
Since go-ipfs 0.5, when user runs local IPFS node, they can load websites and content via subdomains like this:

http://bafybeiemxf5abjwjbikoz4mc3a3dla6ual3jsgpdr4cjr3oz3evfyavhwq.ipfs.localhost:8080/wiki/
http://bafybeid6grcjmnvsdaeklremt2lcqk7jevbjtwrerzgq46nzxfgn5isrne.ipfs.localhost:8080/images/ipfs-logo.svg

There are two known problems with *.localhost at the moment:

If browser vendor does not hardcode localhost to point at loopback, then it is resolved by OS DNS resolver, and on some platforms that can produce error. Fix here is to implement section 6.3.3 from https://tools.ietf.org/html/rfc6761#section-6.3 (Chromium-based browsers already do this)

Content at *.localhost should be marked as Secure Context. Right now some vendors such as Firefox handle localhost and *.localhost differently, partially due to legacy code, partially due to my previous point.

Implementing "let localhost be localhost" (6.3.3 from rfc6761) would ensure localhost can resolve on every platform and can be marked as secure context – very likely solving both issues.

Vendors are mostly ok with this change:

Firefox/Gecko already is tracking this as part of https://bugzilla.mozilla.org/show_bug.cgi?id=1220810.
Safari/Webkit:
https://bugs.webkit.org/show_bug.cgi?id=171934
https://bugs.webkit.org/show_bug.cgi?id=160504
Unfortunately the movement on Safari and Firefox fronts to resolve it turned out to be slower than we expected. Looking into ways we can accelerate that.



2020-09-21
Good news: Chromium officially locked *.localhost to loopback as per https://tools.ietf.org/html/draft-ietf-dnsop-let-localhost-be-localhost-02 partying_face

Details from https://bugs.chromium.org/p/chromium/issues/detail?id=589141#c15:

We addressed this in https://bugs.chromium.org/p/chromium/issues/detail?id=691930 but didn't close this bug. There, we locked *.localhost to loopback as per https://tools.ietf.org/html/draft-ietf-dnsop-let-localhost-be-localhost-02 (see https://source.chromium.org/chromium/chromium/src/+/master:net/dns/host_resolver_manager.cc;drc=25292af6cee762330490f47e79e09a071dc4b5a9;l=3091). This means that we also consider *.localhost secure (see https://source.chromium.org/chromium/chromium/src/+/master:services/network/public/cpp/is_potentially_trustworthy.cc;drc=c70af83bc44f6829277cdc3621e7015d6e0d7530;l=228).

This increases likelihood of other vendors to follow.

https://bugzilla.mozilla.org/show_bug.cgi?id=1220810#c89







2020-10-27



Some updates and reading for anyone interested in following *.localhost space :-)

The best support can be found in Chromium (no need for HTTP proxy, local DNS resolver is ignored)
Firefox will soon catch up thanks to our partnership with Igalia, we are also reaching out to Webkit to follow.

Chromium
Intent to Implement and Ship: Treat http://localhost as a secure context.
Firefox
Intent to prototype & ship: Treat localhost addresses as "Potentially Trustworthy"
"Hardcode localhost to loopback" patch landed last week, sounds like it is here to stay partying_face
https://bugzilla.mozilla.org/show_bug.cgi?id=1220810 → https://phabricator.services.mozilla.com/D92716
some remaining fixes need to land before its 100% hardcoded. Work tracked in:
https://bugzilla.mozilla.org/show_bug.cgi?id=1673364 → https://phabricator.services.mozilla.com/D94726
Tests to ensure localhost and *.localhost can actually not be overridden by non-local IP:
https://bugzilla.mozilla.org/show_bug.cgi?id=1673315 → https://phabricator.services.mozilla.com/D94712
Create a WPT test to verify handling of locahost and *.locahost
https://bugzilla.mozilla.org/show_bug.cgi?id=1672323
Webkit (Apple)
Localhost subdomains don't work
https://bugs.webkit.org/show_bug.cgi?id=160504
Content from loopback addresses (e.g. 127.0.0.1) should not be considered mixed content
https://bugs.webkit.org/show_bug.cgi?id=171934




2020-10-22
Some updates and reading for anyone interested in following *.localhost space :-)

The best support can be found in Chromium (no need for HTTP proxy, local DNS resolver is ignored)
Firefox will soon catch up thanks to our partnership with Igalia, we are also reaching out to Webkit to follow.

Chromium
Intent to Implement and Ship: Treat http://localhost as a secure context.
Firefox
Intent to prototype & ship: Treat localhost addresses as "Potentially Trustworthy"
"Hardcode localhost to loopback" patch landed last week, sounds like it is here to stay partying_face
https://bugzilla.mozilla.org/show_bug.cgi?id=1220810 → https://phabricator.services.mozilla.com/D92716
some remaining fixes need to land before its 100% hardcoded. Work tracked in:
https://bugzilla.mozilla.org/show_bug.cgi?id=1673364 → https://phabricator.services.mozilla.com/D94726
Tests to ensure localhost and *.localhost can actually not be overridden by non-local IP:
https://bugzilla.mozilla.org/show_bug.cgi?id=1673315 → https://phabricator.services.mozilla.com/D94712
Create a WPT test to verify handling of locahost and *.locahost
https://bugzilla.mozilla.org/show_bug.cgi?id=1672323
Webkit (Apple)
Localhost subdomains don't work
https://bugs.webkit.org/show_bug.cgi?id=160504
Content from loopback addresses (e.g. 127.0.0.1) should not be considered mixed content
https://bugs.webkit.org/show_bug.cgi?id=171934






**2021-01-27**
So js-ipfs running on a web page loaded via https:// is able to connect to ws://localhost:port provided by IPFS node running on the same machine as browser
– PoC in ipfs/go-ipfs#5251 (comment)

**TLDR:** in browsers, WebSockets execute only within the boundary of secure contexts,
so the only plaintext ws:// you can dial from HTTPS page is on localhost

https://developer.mozilla.org/en-US/docs/Web/Security/Secure_Contexts

see:
https://blog.ipfs.io/2021-01-15-ipfs-and-igalia-collaborate-on-dweb-in-browsers/




Most of "rules" in the browser context are related to the concept of secure contexts. Spec is one thing, implementations are hairy, but for the sake of this conversation we can simplify and say "secure context" is a document loaded over TLS tunnel (https://), but also local machine at http://127.0.0.1 and thanks to our collab with Igalia http://localhost and http://*.localhost too (at least in Firefox and Chromium).
Recently introduced implementation of ipfs:// and ipns:// in Brave v1.19 is also marked as a secure context.

AFAIK in the case of WebSockets, rules are straightforward: JS code executed from secure context will only be able to connect to other secure context.

This means a page loaded from secure context should not be able to establish unencrypted WebSocket connection, unless it is to localhost.


**Localhost demo**
To illustrate, below is a simple poc: a server that runs on localhost, and a static html page with JS that connect to it:

> Click to expand PoC source code

Server
```js
const WebSocket = require('ws')
const wss = new WebSocket.Server({ port: 28080 })
wss.on('connection', function connection(ws) {
  ws.on('message', function incoming(message) {
    console.log('received: %s', message)
  })
  ws.send('Hello client!')
})
```

Client
```js
// <script>
const socket = new WebSocket('ws://localhost:28080');
socket.addEventListener('open', function (event) {
  socket.send(`Hello Server! I'm ${window.location.href} loaded via ${navigator.userAgent}`)
})
socket.addEventListener('message', function (event) {
  console.log('Message from server ', event.data)
})
socket.addEventListener('close', function (event) {
  console.log('The connection has been closed')
})
// </script>
```

You can load the HTML from local gateway or a public page loaded over HTTPS,
it works fine in both cases (below Firefox and Brave with Shields turned off):

$ node ws-server.js
received: Hello Server!
I'm http://bafkreihqk4ie7zfeedkexb5yfjo7y4ngcjlcydy3behxwd7hkkptcvlliy.ipfs.localhost:8080/
loaded via Mozilla/5.0 (X11; Linux x86_64; rv:84.0) Gecko/20100101 Firefox/84.0

received: Hello Server!
I'm https://ipfs.io/ipfs/bafkreihqk4ie7zfeedkexb5yfjo7y4ngcjlcydy3behxwd7hkkptcvlliy
loaded via Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.89 Safari/537.36

received: Hello Server!
I'm https://ipfs.io/ipfs/bafkreihqk4ie7zfeedkexb5yfjo7y4ngcjlcydy3behxwd7hkkptcvlliy
loaded via Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.89 Safari/537.36


**Leveraging ws://localhost provided by local IPFS node**
So js-ipfs running on a web page loaded via https:// is able to connect to ws://localhost:port provided by IPFS node running on the same machine as browser

Could localhost WS be added to bootstrap list? How would it work without knowing PeerID upfront? (this is not a /dnsaddr that we can resolve)












//////////////////////
// in-browser DATDOT NODE
/////////////////////
Same machine
js-ipfs is unable to discover ipfs-desktop running on the same machine.
It could leverage its existence for:

delegated routing
content preload
circuit switching (relay)
shared cache, data deduplication
persistence (ensuring CIDs are cached outside non-persistent browser storage)

Prior Art
multiple tabs leader election
https://github.com/jimpick/multiple-tab-logux/
Exploration: P2P Network access through the service worker
PoC: https://github.com/Gozala/lunet/
https://gozala.io/work/lunet

https://developer.mozilla.org/en-US/docs/Web/API/Storage_API#box_modes


https://github.com/libp2p/specs/tree/master/relay



-----------------------
IFRAME DATA REGISTRY
-----------------------
js-ipfs is unable to discover ipfs-desktop running on the same machine.
It could leverage its existence for:

delegated routing
content preload
circuit switching (relay)
shared cache, data deduplication
persistence (ensuring CIDs are cached outside non-persistent browser storage)

https://github.com/jimpick/multiple-tab-logux/
https://github.com/Gozala/lunet/
https://gozala.io/work/lunet

PEERSTORE (persisted) consists of:
1. AddressBook
2. ProtoBook // protocol book?
3. KeyBook
(no more PeerID->PeerInfo)
4. (MetadataBook) => associate data to specific peer (e.g. nicknames, network roles, associated apps, ...)


https://github.com/libp2p/js-libp2p/blob/8076b42fd8c4d2dac6128202843eab98d94b91d6/doc/API.md




WHAT ABOUT:
"i want remote access to my api" request
https://github.com/ipfs/in-web-browsers/issues/137




API
-----------
e.g. if you application is running at https://example.com/mycoolapp then you can only access files and directories in or under /https/example.com/mycoolapp

To distinguish this scope from general access permissions scope we'll call it mfs-scope.

files.cp - both source and destination path must be below mfs-scope
files.mkdir - path must be below mfs-scope
files.stat - path must be mfs-scope or below
files.rm - path must be below mfs-scope
files.read - path must be below mfs-scope
files.write - path must be below mfs-scope
files.mv - both source and destination path must be below mfs-scope
files.flush - path must be below mfs-scope
files.ls - path must be mfs-scope or below
For the beta release I'll temporarily disable access to the above functions until I can implement the scope rules.


Is it worth namespacing access to companion? e.g. /companion/https/example.com/mycoolapp

I think it is a good idea, having https and https in root dir looks like a bad UX.
Perhaps /dapps/https/example.com/mycoolapp would be a better name? or /app-data/.. ?

???  So the app would read and write to /*, but that would be internally mapped onto /app-data/https/example.com/*?




----------------

```js
const iframe = document.createElement('iframe')
iframe.setAttribute('src', url)
iframe.onload = handler
document.body.append(iframe)
function handler (event) {
  window.addEventListener('message', event => {
    const { source } = event
    if (source === iframe.contentWindow) {
      clearTimeout(id)
      success()
    }
  })
  const id = setTimeout(() => {
    failure()
  }, 0)
}
function sucess () {
  console.log('success')
}
function failure () {
  console.log('failure')
}
// ALTERNATIVE:
// => MutationObserver for iframe src attribute to e.g. detect a #hash change which does not reload iframe
// => or a localhost address change which reloads the iframe in case localhost was found

// ALTERNATIVE:
// https://www.google.com/search?q=link+tag+onerror&oq=link+tag+onerror&aqs=chrome..69i57j69i65l3j69i61j69i60l3.1591j0j7&sourceid=chrome&ie=UTF-8
// https://www.w3schools.com/tags/att_onerror.asp


```