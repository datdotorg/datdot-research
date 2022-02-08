-------------------------
INCOGNITO ???
-------------------------
https://github.com/ipfs/ipfs-companion/issues/750


-------------------------
DATDOT IN BROWSERS
-------------------------
At present, in order to interact with IPFS in a web browser, you must either bundle js-ipfs-core (a full IPFS node in JavaScript) with your client-side application, or use the js-ipfs-http-client HTTP RPC API client library to connect to an external daemon running on a local or remote machine.

To learn more, make sure to check the browser-* examples at ipfs-examples/js-ipfs-examples
Highlight: an advanced, end-to-end example of using js-ipfs node in SharedWorker from ServiceWorker can be found at js-ipfs-examples/browser-service-worker






----------------------------------


// https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS

You must configure your IPFS API at http://127.0.0.1:5001 to allow cross-origin (CORS)
requests from your dev server at http://localhost:3000
```bash
#!/bin/bash

ALLOW_ORIGINS='"http://localhost:3000", "https://webui.ipfs.io", "https://dev.webui.ipfs.io"'

# stop executing if anything fails
set -e

ipfs config --json API.HTTPHeaders.Access-Control-Allow-Origin "[$ALLOW_ORIGINS]"
ipfs config --json API.HTTPHeaders.Access-Control-Allow-Methods '["PUT", "POST"]'

echo "IPFS API CORS headers configured for $ALLOW_ORIGINS"
echo "Please restart your IPFS daemon"
```

```js
"API": {
  "HTTPHeaders": {
    "Access-Control-Allow-Credentials": [
      "true"
    ],
    "Access-Control-Allow-Methods": [
      "PUT",
      "GET",
      "POST"
    ],
    "Access-Control-Allow-Origin": [
       "http://$HOSTNAME:5001",
       "http://$FQDN:5001",
       "http://$RASPBERRYPI_IP:5001",
       "http://localhost",
       "http://127.0.0.1"
    ]
  }
}
// It is running on a headless server
/*
Initializing daemon...
Adjusting current ulimit to 2048...
Successfully raised file descriptor limit to 2048.
Swarm listening on /ip4/10.0.0.245/tcp/4001
Swarm listening on /ip4/127.0.0.1/tcp/4001
Swarm listening on /ip6/::1/tcp/4001
Swarm listening on /p2p-circuit/ipfs/QmNpprVJP3beQkmX2VGB5K9hVtsEuDHtZ9YTLK1HUentME
Swarm announcing /ip4/10.0.0.245/tcp/4001
Swarm announcing /ip4/127.0.0.1/tcp/4001
Swarm announcing /ip6/::1/tcp/4001
API server listening on /ip4/10.0.0.245/tcp/5001
Gateway (readonly) server listening on /ip4/10.0.0.245/tcp/8080
Daemon is ready
*/

// http://10.0.0.245:5001/webui

// you need to use localhost:5001, it is the only address that is whitelisted (127.0.0.1 also doesn't work)
```





# ARCHITECTURE


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






////////////////////////////
// Sharing IPFS node across browsing contexts (tabs) on same origin
// whats the API?
////////////////////////////

When site with origin e.g. foo.com uses JS-IPFS, new node is bootstrapped for every browser context (tab, iframe) this implies:

=> All the network connections need to be reestablished.
=> General memory / CPU overhead is multiplied by number of browsing contexts.
=> Create a possibility for race condition (two nodes read / write data concurrently).

OPTIMISATION:
=> https://developer.mozilla.org/en-US/docs/Web/API/SharedWorker
=> There is an opportunity to improve this by offloading most of JS-IPFS work into SharedWorker in browsers where API is available and fallback to a dedicated Worker elsewhere (basically Safari).


DETAILS:


We can explore ServiceWorker as a better fallback mechanism in the future. Unilke dedicated worker they can be shared, but they also come with enough challenges to justify keeping it out of scope initially.
However use of SharedWorker implies some trade-offs:


Worker script distribution:
Worker needs to be instantiated with a separate JS script. Which leaves us with the following options:

1. Create a separate "worker" dist as opt-in for shared node. That still has two more options:
  A: Spit out two scripts on for main context and other for worker context.
  B: Use something like a worker-loader to bundle worker script as a blob embedded in the the main script.
2. Self load main script into worker and context detect to choose between main and worker operational modes.


Lack of WebRTC in workers
This is a major problem as WebRTC is largely replacing WebSocket transport and requires more research.
Pragmatic approach could be to tunnel WebRTC traffic into a worker, however that would still imply reestablishing existing connections which would be a major drawback.

PROBLEM: (different configs)

Another thing I'm recognizing now is that two different browsing contexts (tabs) could start IPFS node with different configurations. Which needs to be handled in some way.


https://developer.mozilla.org/en-US/docs/Web/API/MessagePort

 have started hacking on the ipfs-message-port-client that in the spirit is very similar to ipfs-http-client except it wraps around MessagePort.


Create ipfs-message-port-client sub-package (with it's own .aegir.js) that is the spirit of ipfs-http-client except it wraps around MessagePort. Idea is that it will be loaded in the main thread and will RPC with IPFS node through the MessagePort.
Create ipfs-message-port-host sub-package (with it's own .aegir.js) that wraps around MessagePort and starts IPFS node and executes incoming commands.
I think you wanted to keep it all in the same package and just spit out different dists, but I hope it's reasonable to stat those as separate sub-packages first and then figure out how include it into js-ipfs afterwards. Especially since it would involve changes to aegir and I would much rather defer it until we know exactly what we want.


I like the idea of ipfs-message-port-* packages.
ipfs-message-port-host
ipfs-message-port-client

the "core library" in packages/ipfs and use parts of it to assemble runtime-optimized distribution in packages/ipfs-web etc




What are the essential configuration options for JS-IPFS in browsers ?
The only configuration option that we rely on is passing a rendezvous server as a swarm address. Previously this was the only way to connect to a rendezvous server, but a way to do this has been


Other than that we disable preload and bootstrap, in order to create the instance faster. This should however be less of a problem with the shared instance.


What subset of JS-IPFS API is used in browsers ?'
We use the following:

ipfs.add
ipfs.cat
ipfs.dag
ipfs.pubsub
ipfs.libp2p // because of PUBSUB ROOM



Why users are choosing to use JS-IPFS in main thread over worker thread ?

We are currently in a situation where our software package (3box) is run on multiple tabs across multiple domains. There are two main things that could be solved using worker threads:

1. Multiple across tabs causes connectivity issues.
If you have two instances of ipfs on the same doamin but in multiple tabs they will get the same PeerId. This causes issues when connecting to remote nodes (especially with pubsub) where only one of the nodes becomes fully connected. We haven't figured out exactly what causes this, instead our workaround involves creating a random PeerId every time a new instance is created.
2. Sharing data across origins.
We want to be able to share data across origins. Currently we rely on the data being available in the network, but this is less then ideal. Instead it would be nice if nodes on multiple origins could share block storage. We are currently working on a solution for this by putting the blockstore api into an iframe.


Your comment leads me to believe that ipfs.pubsub lacks some of the functionality from ipfs-pubsub-room and if so maybe it would be best to asses how this functionality can provided instead of trying to cover


1. Create ipfs-message-port-client library that can be connected to ipfs-message-port-server over MessagePort instance.
2. Create ipfs-message-port-server library that can take IPFS node instance provide it remotely to the ipfs-message-port-client.


Problems you've encountered with cross tabs connectivity (I'm assuming message-port-server + js-ipfs running insideSharedWorker).

This I think would still allow doing blockstore sharing you've described with minimal changes. You'd have to pass message port providing remote block-storage to the worker, but from what I recall you already do that so it would just be just one more postMessage.

allow 3box to even share server+ipfs-node across origins and just pass message ports more or less how I imagine you do that with block-storage (I'm assuming you use certain origin for actual store)




This pull request adds 3 (sub)packages:

ipfs-message-port-client - Provides an API to an IPFS node over the message channel.
ipfs-message-port-server - Provides an IPFS node over message channel.
ipfs-message-port-protocol - Shared code between client / server mostly related to wire protocol encoding / decoding.













# ARCHITECTURE


Oh ok I misunderstood which you wanted (isolation vs unification). I have a project that exposes the ethereum blockchain app api to a webapp and unifies the cache inside an iframe. Seems like something similar would be useful here.

[small ipfs-iframe lib] <-> [ipfs node in iframe] <-> [network]
We're also exploring making the node a singleton by using ServiceWorker.

[small ipfs-iframe lib] <-> [ipfs iframe proxy] <-> [ipfs node in serviceworker] <-> [network]
I'm sure theres a few gotchas with this approach, especially that webrtc may not be available in the SW.


# possible architectures?

https://github.com/ipfs/ipfs-companion/issues/667

* option H ???
* option G ???
*

( E ) We’ve got all of 127.0.0.0/8 to work with (16 million + addresses) that are all considered to be a secure context.
It’s probably possible to think of a clever way to match CIDs to loopback addresses.
We couldn’t guarantee a unique origin as there would potentially be collisions.
But it’s a huge improvement over ( A ) that requires a more dedicated attacker with exact knowledge
of the hash/origin he want to attack.

I am afraid it won't work. Only 127.0.0.1 and ::1 are viable options, as only those raw IPs are whitelisted
by both Firefox and Chrome. Fun fact: localhost is not whitelisted: #328.

==> MIXED CONTENT WARNING: https://github.com/ipfs/ipfs-companion/issues/328



( F ) Relay on containerized first-party isolation. Firefox only (but I do think Brave is working on it for Chromium).



( H ) WebSocket and Service Worker that pulls data from 127.0.0.1 and serves it from the `<CID>.ipfs-gateway.local.page` origin.

Somehow related research happens in comments of ipfs/in-web-browsers#137,
  but service worker route is not robust enough yet. There are pending issues related to
  keeping worker alive and cross-vendor incompatibilities like bug-1376309. When issues are solved
  it may be a solution (with some ugly limitations), but before it is ready, it looks like the best we can do
  is (B) and (F) on Firefox.

https://github.com/ipfs/in-web-browsers/issues/137
https://bugzilla.mozilla.org/show_bug.cgi?id=1376309



( I ) Redirect by default but enforce stricter security policies. Most of the websites that are out there
today are static blogs and the like with no need for a strict origin policy. The local gateway can enforce
better security in modern browsers by purging data on every load by adding the Clear-Site-Data: "*" response header
to everything coming from the local gateway. (Removes service workers, cookies, or anything else persistent
between requests.) Could also disable JavaScript and frames unless a strict origin can be guaranteed using a
Content-Security Policy when loading from the gateway. Easier to implement than ( G ) and more predictable
behaviour for developers. This would allow for today’s DNSLink usecases to still [mostly] function until a
better long-term solution can be devised.

https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Clear-Site-Data



`anything.localhost` is not treated as a secure origin.



----

anything.localhost is not treated as a secure origin.

Initial version at https://w3c.github.io/webappsec-secure-contexts/#is-origin-trustworthy read:

If origin’s host component is "localhost" or falls within ".localhost", and the user agent conforms to the name resolution rules in let-localhost-be-localhost, return "Potentially Trustworthy".

Which meant it would be treated the same as 127.0.0.1.

Just as you noted, browser vendors follow more conservative approach from https://www.w3.org/TR/secure-contexts/#is-origin-trustworthy:

If origin’s host component matches one of the CIDR notations 127.0.0.0/8 or ::1/128 [RFC4632], return "Potentially Trustworthy".

https://www.w3.org/TR/secure-contexts/#localhost:

Section 6.3 of [RFC6761] lays out the resolution of localhost. and names falling within .localhost. as special, and suggests that local resolvers SHOULD/MAY treat them specially. For better or worse, resolvers often ignore these suggestions, and will send localhost to the network for resolution in a number of circumstances.
Given that uncertainty, this document errs on the conservative side by special-casing 127.0.0.1, but not localhost.

Safari does not even allow 127.0.0.1: https://bugs.webkit.org/show_bug.cgi?id=171934


----

Some takeaways:

We could work with browser vendors on changing that. I believe in let-localhost-be-localhost and making it Secure Context, at least for *.ip(f|n)s.localhost which come with content-addressing guarantees

In parallel, we could look into registering Special-Use *.dweb, similar to *.onion which created a good precedent for being marked as a secure context in Firefox: https://bugzilla.mozilla.org/show_bug.cgi?id=1382359

Something I'd like to avoid is playing with self-signed cartificates and injecting CA Root to users truststore.

Even without secure context, HTTP Proxy would be valuable for a lot of use cases, and there will be a way to disable redirect per website (Per-site Redirect Opt-out #687)


-----

CROSS PLATFORM ISSUES:
I'm not sure what the coverage is in other OSes, but *.localhost subdomains don't work out of the box on all Linuxes. The dnsmasq local resolver and systemd-resolved do resolve them though, so that might be good enough.

e.g. https://github.com/ipfs/in-web-browsers/issues/109

---
*.localhost behaves according to the RFC for it’s special use domain. (Meaning it doesn’t do squat by default.) However, this isn’t a problem as the extension or a browser proxy configuration can be setup to handle *.,localhost which I assumed was the idea to begin with.



--------

I’ve used static.example.com and video.example.com to serve media assets on www.example.com over IPFS or fallback to HTTP for users without IPFS Companion. DNSLink with automated redirection to localhost in a secure context is the glue that holds that together.

How would you load this over IPFS?

`<video><source src="https://video.example.com/video6.webm" type="video/webm"></video>`

How about an opt-in signal by extending the existing DNS prefetch mechanism?

`<link rel="dns-prefetch" href="//video.example.com" data-ipns-enabled>`

IPFS Companion could resolve that domain as an DNSLink IPNS name and load it via the local gateway. Browsers will just resolve the normal DNS name for this origin and ignore the extra attribute. It significantly reduces unnecessary DNSLink lookup requests too.

URLs ipfs:// and ipns:// are planned to be working "natively" there as well, but I can't share any dates yet.

I though IPNS:// couldn’t work? The origin has to be lower-case, right? —and I’ve not even seen a proposal to transition to lowercased base32 encode IPNS names.

-----

**UPDATE**
As of 2019-10 localhost (hostname) is a secure context in both Firefox 69 and Chrome 78.
Firefox does not support *.localhost yet, but everything suggests it will at some point – more details in

==> see: https://github.com/ipfs/in-web-browsers/issues/109#issuecomment-537061478













-----------------------------------
-----------------------------------
-----------------------------------
-----------------------------------
# IPFS COMPANION


-----------------------------------
# IPFS DESKTOP
a complete IPFS node, plus handy OS menubar/taskbar shortcuts and an all-in-one file manager, peer map, and content explorer.

Use IPFS Desktop to get acquainted with IPFS without needing to touch the terminal — or, if you're already experienced, use the powerful menubar/taskbar shortcuts alongside the command line to make your IPFS workflow faster.






-----------------------------------
# IPFS ...

