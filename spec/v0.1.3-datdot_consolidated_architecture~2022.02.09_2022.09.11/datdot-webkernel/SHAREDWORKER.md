

# SHARED WORKER
@THOUGHTS: Safari (=no SharedWorker available, but ServiceWorker is)
// => also now they have "ServiceWorker" available ...
// => https://itnext.io/safari-now-fully-supports-sharedworkers-534733b56b4c
```js
// otherwise: KEEP ALIVE HACK!
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




