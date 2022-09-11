# PERMISSIONS (depends on Perimeter)


--------------------

PERMISSIONS:
Is this what we'd like for access control?:

Access control is fine grained, it requires permission to be granted to each IPFS function prior to usage, with option to allow access to all
Granted permissions are scoped to the origin (site) on which they are granted and persist until the browser process exits. When granting permission, the user is given the option for the grant to be "remembered" for a given origin so that it persists across browser restarts
Settings allow the user to revoke "remembered" privileges given to origins

 code in place to be able to control access at ("API function"+"Origin") level, but I feel we don't want to overwhelm end user with too many bells and whistles.

What if we create a simplified access control to "allow all functions for current Origin" for now and take it for a spin with some PoC app?
It could provide us with some data points on how annoying access controls are :)

(we can experiment with access controls, as long this is an opt-in)

PS. when we say "Origin" we think window.location.origin (URL.origin), right?

https://developer.mozilla.org/en-US/docs/Web/API/URL/origin

--------------------

I think that certain things should just be available by default

* block/dag/files/object API should just allow you to fetch and put stuff from IPFS, similar to how Android allows apps to access the network without any special permissions, and how you can do XHR in a browser without user consent

* DHT/swarm might need to be placed behind a permission since it has more low level access

* Pinning should be put behind a permission to prevent malicious sites from making you replicate data that you don't want to replicate. Maybe there should be limits on how much data a user is willing to pin for a site.

* pubsub should be put behind a permission to prevent spamming

* Once it's implemented fine grained permissions for encryption keys will be needed (per-key permissions)

* Once it's implemented, publishing to IPNS should be behind a permission, though resolving IPNS entries should be safe to do.

From what I understand, getting a secure origin is still a WIP on devices that can't handle custom protocols or redirect to a proxy, so I'm not sure how useful permissions would be until that is addressed.
Maybe it would make sense to do it based on which multihash/path is being used in the meantime, and later which ipns/multihash is being used in the future.




-------------------------
PERMISIONS
-------------------------
addresses: [/ip4/127.0.0.1/tcp/4001/ipfs/wj94owj4tow4j9g, ...]
agentVersion: 'go-ipfs/0.4.13
id: wj94owj4tow4j9g
protocolVersion: ipfs/0.1.0
publicKey: CAASpgIwggEiMA0G....

addresses: []
agentVersion: 'js-ipfs/0.27.6
id: wj94owj4tow4j9g
protocolVersion: 9000
publicKey: CAASpgIwggEiMA0G....

PERMISSION GRANTS FOR:
https://github.com/tableflip/ipfs-companion/blob/e17bf70583229ef171a6c9af61bec60701263934/add-on/src/lib/ipfs-proxy/index.js#L21-L43

=>  it would be useful to group permissions together.

// implement via something like:
https://github.com/ipfs/ipfs-companion/issues/330#issuecomment-355426275

e.g.
files.cp - both source and destination path must be below mfs-scope
files.mkdir - path must be below mfs-scope
files.stat - path must be mfs-scope or below
files.rm - path must be below mfs-scope
files.read - path must be below mfs-scope
files.write - path must be below mfs-scope
files.mv - both source and destination path must be below mfs-scope
files.flush - path must be below mfs-scope
files.ls - path must be mfs-scope or below

I think it is a good idea, having https and https in root dir looks like a bad UX.
Perhaps /dapps/https/example.com/mycoolapp would be a better name? or /app-data/.. ?
/*, but that would be internally mapped onto /app-data/https/example.com/*?



