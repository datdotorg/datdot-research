# datdot-gateway
daemon which offers RPC/IPC API to interact with chain and service

@TODO:
* [ ] describe gateway spec

latest experiments:
  * https://glitch.com/edit/#!/turquoise-spangle-daphne?path=server.js%3A1%3A0




# TODOS

* [ ] set up servers on localhost and try to auto-switch and use them from pages running on glitch
* [ ] set up an iframe with `allow-same-origin` for cross origin and see if this can manipulate parent
* [ ] try to make nodejs bios.mjs into something similar to a service worker kernel, which can intercept all imports
   => but can it also intercept everything else?
   => maybe that needs sandbox shim to intercept e.g. fetch() ...
* [ ] maybe try to serve a custom HTML file with a custom SCRIPT that serves a custom SW
   => but old SW serves new SW script which looks local, but is constructed and takes over, lets see
   => but probably old SW can never intercept a new SW request
   ==> update SW to use different kernel only works by opening a different trusted page
* [ ] consolidate RESEARCH and add per research file todos
* [ ] write multiple pages with tests!
* [ ] name the local repo with the localhost servers to test against!
* [ ] ask ppl with windows and macOS to try it out
## `@todo`: REASEARCH/ISOLATES/ORIGIN.md
* [ ] try out `opaque` origins from `data:` and `non-network` URLs

-----------------



# CONCEPT

1. Goals
2. Glossary
3. ...




## GOALS
* USERS OWN THEIR DATA
* DATA AUTONOMY





## GLOSSARY

Node
In IPFS, a node or peer is the IPFS program that you run on your local computer to store files and then connect to the IPFS network. More about IPFS Node.

Peer ID
A Peer ID is how each unique IPFS node is identified on the network. The Peer ID is created when the IPFS node is initialized and is essentially a cryptographic hash of the node's public key. More about Peer ID

Path/Address
A Path/Address is the method within IPFS of referencing content on the web. Addresses for content are path-like; they are components separated by slashes. More about Path/Address

DWeb
The Decentralized Web (DWeb) looks like today's World Wide Web, but it is built with new underlying technologies that support decentralization.
It is much harder for any single entity (like a government or terrorist group) to take down any single webpage, website, or service, either by accident or on purpose.


Daemon
A Daemon is a computer program that typically runs in the background. The IPFS daemon is how you take your node online to the IPFS network. More about IPFS Daemon

Bootstrap node
A Bootstrap Node is a trusted peer on the IPFS network through which an IPFS node learns about other peers on the network. More about Bootstrapping


