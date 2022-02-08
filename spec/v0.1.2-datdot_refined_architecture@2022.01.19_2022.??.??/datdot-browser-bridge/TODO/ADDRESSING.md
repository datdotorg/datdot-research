https://{cid}.ipfs.{gateway-host}/path/to/resource
https://{libp2p-key-cid}.ipns.{gateway-host}/path/to/resource

Gateway Semantics
In the most basic scheme an URL path used for content addressing is effectively a resource name
without a canonical location. HTTP Gateway provides the location part,
which makes it possible for browsers to interpret content path as relative to the current server
and just work without a need for any conversion.




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

Appendix: experiments with addressing with shared dweb namespace
We explored the idea of a shared dweb namespace to remove the complexity of adressing IPFS and other content-addressed protocols. More details can be found at:

(A) the dweb:// protocol handler (arewedistributedyet/issues/28)
(B) the .dweb special-use top-level domain name (arewedistributedyet/issues/34)
Unfortunately, a single scheme is not compatible with the security model on the web. Consider this highly experimentsl, do not use this in production. If anyone wants to implement it in a safe way, it needs to return a redirect to ipfs:// or ipns://.

