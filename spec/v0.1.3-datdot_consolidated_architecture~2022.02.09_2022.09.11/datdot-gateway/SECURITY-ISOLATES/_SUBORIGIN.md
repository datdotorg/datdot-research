## ~~SUBORIGIN~~
Suborigins are WIP standard that – if implemented by browser vendors – could provide a way to
isolate CID-specific paths into their own Origins.



------

Suborigins, in fact, do not provide any new authority to resources. Suborigins simply provide an additional way to construct Origins. That is, Suborigins do not supercede Origins or provide any additional authority above Origins. From the user agent’s perspective, two resources in different Suborigins are simply in different Origins, and the relationship between the two resources should be the same as any other two differing origins as described in HTML Standard §origin and [RFC6454].
https://w3c.github.io/webappsec-suborigins/#suborigins-vs-origins


Suborigins let the content source specify an additional level of isolation in addition to the current origin. A suborigin is the origin plus an suborigin header.

This would be useful for an ipfs gateway to re-host hashes for peers, but isolate each one per hash, rather than allowing each to share the sandbox of the gateway itself.

Workaround: Hostname safe HTTP content addressing - https://github.com/neocities/hshca
* Share content hash as base32 encoded subdomain.

-----
Suborigins are WIP standard that – if implemented by browser vendors – could provide a way to isolate CID-specific paths into their own Origins.
* https://github.com/ipfs/in-web-browsers/issues/66

SUBORIGINS are DEPRECATED:
I believe it is time to close this to indicate that due to the lack of adoption (mozilla/standards-positions#31 (comment)) it is no longer a viable option for solving Origin isolation problem.
* BECAUSE: https://github.com/mozilla/standards-positions/issues/31#issuecomment-555418542

