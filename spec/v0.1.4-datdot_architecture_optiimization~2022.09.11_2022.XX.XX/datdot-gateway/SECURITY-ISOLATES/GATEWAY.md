# GATEWAYS

The first stage on the upgrade path are HTTP gateways.

Gateways are provided strictly for convenience to help tools that speak HTTP but do not speak distributed protocols
such as IPFS. This approach has been working well since 2015 but comes with a significant set of limitations related
to the centralized nature of HTTP and some of its semantics. Location-based addressing of a gateway depends on both
DNS and HTTPS/TLS, which relies on the trust in Certificate Authorities and PKI. In the long term these issues
SHOULD be mitigated by use of opportunistic protocol upgrade schemes.



## GATEWAY SEMANTICS

HTTP gateway SHOULD:

Take advantage of existing caching primitives, namely:
Set Etag HTTP header to the canonical CID of returned payload
Set Cache-Control: public,max-age=29030400,immutable if resource belongs to immutable namespace (eg. /ipfs/*)
set Suborigin header based on the hash of the root of current content tree
provide a meaningful directory index for root resources representing file system trees


HTTP gateway MAY:

Customize style of directory index.
Return a custom payload along with error responses (HTTP 400 etc).
Provide a writable (POST, PUT) access to exposed namespaces.





# GATEWAY
**ISSUE:**
For example, errors occur when a `browser` that does not support IPFS attempts access to **IPFS content**
in the canonical form of *ipfs://{CID}/{optional path to resource}*
Other tools that rely solely on HTTP encounter similar errors in accessing IPFS content in canonical form,
such as `Curl` and `Wget` or `git`

```js
// If I run:
`git clone http://QmYgyahQoikJEbZEkiubwxm16xjCAZs2RUd1qfuus2Zyeq.ipfs.localhost:8080/`
// Or:
`git clone http://localhost:8080/ipfs/QmYgyahQoikJEbZEkiubwxm16xjCAZs2RUd1qfuus2Zyeq`
// I get the following error message:
// fatal: unable to access 'http://QmYgyahQoikJEbZEkiubwxm16xjCAZs2RUd1qfuus2Zyeq.ipfs.localhost:8080/':
// Could not resolve host: QmYgyahQoikJEbZEkiubwxm16xjCAZs2RUd1qfuus2Zyeq.ipfs.localhost
//However, I have managed to get it working by running:
`git clone http://127.0.0.1:8080/ipfs/QmYgyahQoikJEbZEkiubwxm16xjCAZs2RUd1qfuus2Zyeq`
// works just fine!
```


# GATEWAY API
```js
32490252835823094._.localhost
wallet._.localhost
vault._.localhost
system._.localhost
_.localhost =json=> { prefix: 'serapath' }
localhost =json=> { "_", "ipfs", "..." }
```

## Protocol upgrade
centralized nature of HTTP and some of HTTP's semantics.
Location-based addressing of a gateway depends on both DNS and HTTPS/TLS,
which relies on trust in certificate authorities (CAs)
and public key infrastructure (PKI)
=>
Tools and browser extensions should detect IPFS content paths and resolve them directly over IPFS protocol.
They should use HTTP gateway only as a fallback when no native implementation is available in order
to ensure a smooth, backward-compatible transition.


SOLUTION: GATEWAY
* is external daemon running on machine (local or remote)
* a machine can host a gateway as a local service (e.g. localhost:8080)
* speaks HTTP(S) + WS(S)
* speaks HYPER
* allows browser to access hyper content
* allows hypernetwork to access browser data
* pins/caches content to speed up access
* facilitates "native support" in web browsers
* should be drop-in replacements
* provides HTTP-based service for hyper ignorant clients (e.g. curl, wget, browser) to access HYPER content
* provided strictly for convenience to help tools that speak HTTP but dont speak distributed protocol

DATDOT DESKTOP => automatically installs a local **gateway service** (or another form of node)

js-ipfs-core in browser

js-ipfs-http-client HTTP RPC API client library
check `browser-*` examples at `ipfs-examples/js-ipfs-examples`
* advanced, end-to-end example using js-ipfs node in SharedWorker from ServiceWorker can be found at js-ipfs-examples/browser-service-worker


**RESOLVE**
To take advantage of content addressing today while ensuring backwards compatibility with legacy web:
`<link rel="stylesheet" href="https://example.com/ipfs/QmNrgEMcUygbKzZeZgYFosdd27VE9KnWbyUD73bKZJ3bGi?filename=style.css">`
`<link rel="stylesheet" href="/ipfs/QmNrgEMcUygbKzZeZgYFosdd27VE9KnWbyUD73bKZJ3bGi?filename=style.css">`
User agents that support IPFS, such as a browser with ipfs-companion,
may recognize the `/ipfs/<CID>` content path and load the related asset over IPFS instead of HTTP.
User agents without IPFS support still get the correct data from the original HTTP server.



**GOAL:**
* provide a bridge for apps without native support to IPFS
* make the bridge so that usage is not distinguishable from native support
* native has just better PERFORMANCE and SECURITY
  * delay-sensitive processes should aim for native support
  * or as a local service daemon (=almost as fast)
  * or a gateway installed as local service

  ==> locally running NODE includes gateway at http://127.0.0.1:8080
  * usable by time-insenstive processes


-------------


**HEURISTIC for FINDING and SELECTING GATEWAY:**
gateway address is stored/retrieved in/from CONFIG
If gateway is `127.0.0.1:port` or `0.0.0.0:port` (to replace with window.location.hostname amd window.location.port)
to figure out if current browser supports it
send GET request for `<knowncid>.ipfs.localhost:port` (eg. empty unixfs dir)
* If response in HTTP 200, then subdomains work in current browser
  * => replace 127.0.0.1:port with localhost:port in "View on IPFS Gateway"
If gateway is public or network ip
* service worker should test and reply if there is a problem


----

# Factor out Daemon / Gateway endpoints handlers
* SW should use local system NODE and transparently fallback to in-browser NODE when local node isn't available.

**how to expose GATEWAY via "js-ipfs" in browser**
* JS running on websites can't open TCP ports, and due to this HTTP Gateway is not available in such node
* need an easy way to open IPFS resource in HTTP-like fashion

Solutions
The obvious route is to improve js-ipfs-http-response and move duplicated code and boilerplate there,
so it can be shared across mentioned and other projects. Most of this will happen anyway,
however I started thinking if there is anything else we could do to improve developer experience in Worker contexts.

However it was fairly easy to address issue pointed out there using https://github.com/ipfs/js-ipfs-http-response
but dealing with Daemon REST API continues to be quite painful due to larger API surface.

----

# shareable links
`http://127.0.0.1:8080/ipfs/QmWq7GRWzZDKqeHsuCkrMG4cWV4dintmRpewxESjH1rGJR`
`http://127.0.0.1:8080/ipfs/{cid}`
forcefully redirect to:
`http://${cid].ipfs.localhost:8080`

// e.g.

http://localhost:8080/ipfs/QmWq7GRWzZDKqeHsuCkrMG4cWV4dintmRpewxESjH1rGJR
=>
http://bafybeid6e7eu7ol662vq3s4p5t52urtzaxf2w7qxmtss6xqrhrotykzewy.ipfs.localhost:8080/


# origin isolation
`http://127.0.0.1:8080/ipfs/QmWq7GRWzZDKqeHsuCkrMG4cWV4dintmRpewxESjH1rGJR`
FIREFOX : okay
CHROME  : okay
SAFARI  : fail



```js
--------------------
ARCHITECTURE



Gateway
When you start an IPFS daemon, it creates two HTTP servers: the HTTP API that can be used to control the daemon (by pinning hashes, adding content, etc.) and the gateway, which is designed for web browsers to load content in IPFS as if they were loading it from a traditional web site.

When you request a URL like:

http://localhost:8080/ipfs/QMu.../index.html
the gateway does the equivalent of the CLI command:

ipfs cat /ipfs/Qmu.../index.html
…and returns the result to your browser. It also has a few extra conveniences like directory listings.


We should clarify that a daemon runs a gateway, while an IPFS node (see ipfs/docs#92) does not necessarily include a gateway.
We should disambiguate between local gateway (localhost:8080) vs public/shared gateway (example.org) vs the canonical public gateway (ipfs.io)
We should disambiguate between the types of HTTP gateways (see comment): DNSLink gateway, path gateway, subdomain gateway




I believe it is important to recognize three types of HTTP gateways:

1. DNSLink gateway (eg. en.wikipedia-on-ipfs.org)
(when domain DNS A record points at IP with go-ipfs and DNS TXT record points at IPFS content path)
2. Path gateway (ipfs.io/ipfs/bafy...)
3. Subdomain gateway (bafy...ipfs.dweb.link)
  * this is wip, we want to support this natively so more people can run it: Subdomain Gateway go-ipfs#6498


PUBLIC GATEWAY? Protocol Labs operates a public gateway at http://ipfs.io, which is useful for sharing links with people who aren’t running their own daemon.


SHIM:
We should clarify that the gateway is a migration tool — it exists because web browsers that natively speak IPFS don’t exist.
Eventually, we hope IPFS Companion will be able to add support to browsers, and eventually the browsers will build it in natively.


What links will users share?
Similarly, we should clarify that you should be careful about relying on the public gateway.
Should we explicitly explain you could run your own public gateway?


==> Should this discuss the service worker gateway? (I think we said probably not)
@THOUGHT: YES! discuss it!!






The gateway lets you to ask our servers to do an IPFS lookup for you. It provides an upgrade path towards full IPFS support; tools that speak http can fetch data via it's content-address via the gateway today.

When they are ready they can embed an IPFS node and fetch the same content directly from the network. Developers are encouraged to opportunistically upgrade http urls that point to the ipfs.io gateway to the equivalent ipfs request. The magic of content-addressing means you'll get exactly the same data whether you request it via http or via ipfs.

So, the gateway provides "IPFS as a service"

Any ipfs node can run a local http-to-ipfs gateway


Folks who run a local ipfs daemon can use their own gateway, at https://localhost:8080 by default
to allow their browser and other tools to fetch content-addressed data over http but using their ipfs node to find and fetch it.

UPGRADES:
The ipfs-companion web extension can be used to automatically upgrade ipfs gateway http urls to be redirected to your local gateway.




$ echo hello | ipfs add -q
QmZULkCELmmk5XNfCgTnCyFgAVxBRBXyDHGGMVoLFLiXEN

$ ipfs cat QmZULkCELmmk5XNfCgTnCyFgAVxBRBXyDHGGMVoLFLiXEN
hello

$ curl https://ipfs.io/ipfs/QmZULkCELmmk5XNfCgTnCyFgAVxBRBXyDHGGMVoLFLiXEN
hello

$ curl https://cloudflare-ipfs.com/ipfs/QmZULkCELmmk5XNfCgTnCyFgAVxBRBXyDHGGMVoLFLiXEN
hello




Most critically we want to normalise using and publishing https://ipfs.io/ipfs/<cid> style addresses, as it tools that understand ipfs to upgrade them to ipfs, while tools that don't can still fetch the content.

It is assumed that a proliferation of gateway providers and ipfs paths at many different domains would make it less clear to end users and developers what was going on (although ipfs-companion already does a great job of redirecting ipfs addresses from any valid domain).



----------------------------------------------------------------

How do I Use a Writeable Gateway?
:exclamation: The gateway will not pin the resulting hashes of any of these operations. That’s your responsibility.


-----------------------------------------------------------------

https://ipfs.io/ipfs/<CID>
# e.g
https://ipfs.io/ipfs/Qme7ss3ARVgxv6rXqVPiikMJ8u2NLgmgszg13pYrDKEoiu





Dweb addressing in brief
In IPFS, addresses (for content) are path-like; they are components separated by slashes.
The first component is the protocol, which tells you how to interpret everything after it.
Content referenced by a hash might have named links. (For example, a Git commit has a link named parent, which is really just a pointer to the hash of another Git commit.) Everything after the CID in an IPFS address is those named links.
Since these addresses aren’t URLs, using them in a web browser requires reformatting them slightly:
Through an HTTP gateway, as http://<gateway host>/<IPFS address>
Through the gateway subdomain (more secure, harder to set up): http://<cid>.ipfs.<gateway host>/<path>, so the protocol and CID are subdomains.
Through custom URL protocols like ipfs://<CID>/<path>, ipns://<peer ID>/<path>, and dweb://<IPFS address>
#



IPFS GATEWAYS

This document discusses:

The several types of gateways.
Gateway role in the use of IPFS.
Appropriate situations for the use of gateways.
Situations when you should avoid the use of gateways.
Implementation guidelines.


You should read this document if you want to:

Understand, at a conceptual level, how gateways fit into the overall use of IPFS.
Decide whether and what type of gateways to employ for your use case.
Understand, at a conceptual level, how to deploy gateways for your use case.
#



1. IPFS deployment seeks to include native support of IPFS in all popular browsers and tools. Gateways provide workarounds for applications that do not yet support IPFS natively

2. For example, errors occur when a browser that does not support IPFS attempts access to IPFS content in the canonical form of ipfs://{CID}/{optional path to resource}

3. Other tools that rely solely on HTTP encounter similar errors in accessing IPFS content in canonical form, such as Curl (opens new window)and Wget (opens new window).


ISSUE:
Tools like IPFS Companion (opens new window)resolve these content access errors. However, not every user has permission to alter — or be capable of altering — their computer configuration. IPFS gateways provide an HTTP-based service that allows IPFS-ignorant browsers and tools to access IPFS content.

#

#Gateway providers
Regardless of who deploys a gateway and where, any IPFS gateway resolves access to any requested IPFS content identifier. Therefore, for best performance, when you need the service of a gateway, you should use the one closest to you.

#

Your local gateway
Your machine may host a gateway as a local service; e.g., at localhost:8080. You have a local gateway service if you installed IPFS Desktop (opens new window)or another form of IPFS node.

#


Private gateways
Running IPFS Desktop (opens new window)or another form of IPFS node triggers connection attempts to other IPFS peers. Private network administrators may treat such connection attempts as potential security vulnerabilities. Private IPFS gateway servers located inside the private network and running a trusted code base provide an alternative architecture for read/write access to externally-hosted IPFS content.

A gateway behind a firewall represents just one potential location for a private gateway. More generally, one may consider any gateway as a private gateway when configured to limit access to requests from specific domains or parts of the public internet. This tutorial configuring an IPFS gateway on a Google Cloud platform (opens new window)includes a description of constraining acces



REVERSE PROXY + AUTH (accept/decline) to make a gateway authenticated


Providers can design their own centralized authentication service like Infura IPFS Auth (opens new window), or a decentralized authentication service like IPFS W3Auth (opens new window)).

#


CRUST NETWORK: https://wiki.crust.network/docs/en/buildIPFSWeb3AuthGW
INFURA: https://infura.io/docs/ipfs#section/Authentication/Overview



RESOLUTION STYLES:
1. Path
2. Subdomain
3. DNSLink

-----------
I believe it is important to recognize three types of HTTP gateways:

DNSLink gateway (eg. en.wikipedia-on-ipfs.org)
(when domain DNS A record points at IP with go-ipfs and DNS TXT record points at IPFS content path)
Path gateway (ipfs.io/ipfs/bafy...)
Subdomain gateway (bafy...ipfs.dweb.link)
this is wip, we want to support this natively so more people can run it: Subdomain Gateway go-ipfs#6498

see also local gateway (localhost:8080) vs public/shared gateway (example.org) vs the canonical public gateway (ipfs.io)

--------------------


```































##########################################

# Take your node online
Once you're ready to join your node to the public network, run the ipfs daemon in another terminal and wait for all three lines below to appear to know that your node is ready:


```
ipfs daemon

> Initializing daemon...
> API server listening on /ip4/127.0.0.1/tcp/5001
> Gateway server listening on /ip4/127.0.0.1/tcp/8080
```

Now, switch back to your original terminal.
If you’re connected to the network, you should be able to see the IPFS addresses of your peers when you run:

```

ipfs swarm peers

> /ip4/104.131.131.82/tcp/4001/p2p/QmaCpDMGvV2BGHeYERUEnRQAwe3N8SzbUtfsmvsqQLuvuJ
> /ip4/104.236.151.122/tcp/4001/p2p/QmSoLju6m7xTh3DuokvT3886QRYqxAzb1kShaanJgW36yx
> /ip4/134.121.64.93/tcp/1035/p2p/QmWHyrPWQnsz1wxHR219ooJDYTvxJPyZuDUPSDpdsAovN5
> /ip4/178.62.8.190/tcp/4002/p2p/QmdXzZ25cyzSF99csCQmmPZ1NTbWTe8qtKFaZKpZQPdTFB
```

These are a combination of <transport address>/p2p/<hash-of-public-key>.

Now, you should be able to get objects from the network. Try:

```
ipfs cat /ipfs/QmSgvgwxZGaBLqkGyWemEDqikCqU52XxsYLKtdy3vGZ8uq > ~/Desktop/spaceship-launch.jpg
```

You can also check it out at your own local gateway:

```
curl "http://127.0.0.1:8080/ipfs/$hash"

> I <3 IPFS -<your username>
```
















######################################################
######################################################
######################################################

  A good practice is to run your go-ipfs daemon on localhost (127.0.0.1), as it provides:

Increased security: native IPFS used as end-to-end transport.
Better UX in the browser: no mixed-content warnings.
Improved performance: local loopback is used, so no network overhead.



  IPFS Desktop installs and manages a local node for you, as well as offering an easy, convenient user interface for managing files and peers.
If you're comfortable with the command line and don't need the convenience of the IPFS Desktop UI, follow the directions in the command line quick-start guide.


  https://github.com/ipfs-shipyard/ipfs-desktop

  https://github.com/ipfs/ipfs-docs/blob/main/docs/how-to/command-line-quick-start.md




######################################################



  GATEWAY RECIPES



  Below is a list of the most common public gateway setups.

Public subdomain gateway at http://{cid}.ipfs.dweb.link (each content root gets its own Origin)

$ ipfs config --json Gateway.PublicGateways '{
    "dweb.link": {
      "UseSubdomains": true,
      "Paths": ["/ipfs", "/ipns"]
    }
  }'
Backward-compatible: this feature enables automatic redirects from content paths to subdomains:

http://dweb.link/ipfs/{cid} → http://{cid}.ipfs.dweb.link

X-Forwarded-Proto: if you run go-ipfs behind a reverse proxy that provides TLS, make it add a X-Forwarded-Proto: https HTTP header to ensure users are redirected to https://, not http://. It will also ensure DNSLink names are inlined to fit in a single DNS label, so they work fine with a wildcart TLS cert (details). The NGINX directive is proxy_set_header X-Forwarded-Proto "https";.:

http://dweb.link/ipfs/{cid} → https://{cid}.ipfs.dweb.link

http://dweb.link/ipns/your-dnslink.site.example.com → https://your--dnslink-site-example-com.ipfs.dweb.link

X-Forwarded-Host: we also support X-Forwarded-Host: example.com if you want to override subdomain gateway host from the original request:

http://dweb.link/ipfs/{cid} → http://{cid}.ipfs.example.com





############
IPFS NODE (includes gateway)

  experimental features: https://github.com/ipfs/go-ipfs/blob/master/docs/experimental-features.md

  Private Networks
  ipfs p2p
  p2p http proxy
  Plugins
  AutoRelay
  Strategic Providing
  Graphsync



  IPFS-JS NODE
  Specific limitations of the JS-IPFS implementation are:

Unless using WSS, a JS-IPFS node cannot connect to the main public DHT. They will only connect to other JS-IPFS nodes.
The performance of the DHT is not on-par with the Go-IPFS implementation.
The HTTP gateway is present, but it has no subdomain support

  Can connect to server nodes using secure WebSockets.
WSS requires manual setup of TLS at the server.


