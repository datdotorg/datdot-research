# service
**[main](../README.md)**

**use**
* [Hypercore Protocol](https://www.hypercore-protocol.org/)


* Use polkadot.js.org api and hypercore js libraries to encode and decode hypercores [let's call this adapter.js or something]
* Use dat sdk or dat-store's service.js to communicate with  adapter.js



## summary
- listening for events on the node
- submitting data to the node (proofs and archives)

### challenge
- responding with the merkle proof from the dat archives

## Additional Information
Context: [How `dat` works?](https://datprotocol.github.io/how-dat-works/)
**tl;dr:** a version controlled posix compliant filesystem on top of an immutable append only log structure, which can be seeded and subscribed to like torrents and the original author can always update the archive while the immutable history is always content addressable
