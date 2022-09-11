# CSP (Content Security Policy)
https://github.com/ipfs/ipfs-companion/issues/1008





# Security Considerations (for addressing)
 CSP: quasi-browser vs. subdomains

 Security model of HTTP sites relies on the same-origin policy. This introduces two major inconveniences for gateways that expose entire IPFS universe under /ipfs/ and /ipns/ paths of a single hostname:

 https://developer.mozilla.org/en-US/docs/Web/Security/Same-origin_policy


 Origin Workaround #1: Subdomains
Gateway operator MAY work around single Origin limitation by creating artificial subdomains based on URL-safe version of root content identifier (eg. <CID>.dweb.link). Each subdomain provides separate Origin and creates an isolated security context at a cost of obfuscating path-based addressing.

Benefits of this approach:

The ability to do proper security origins without introducing any changes to preeexisting HTTP stack.
Root path of content-addressed namespace becomes the root of URL path, which makes asset adressing compatible with existing web browsers: <img src="/rootimg.jpg">
Opens up the ability for HTTP Host header and TLS SNI parsing, which is a prerequisite for fully automated deployment of TLS via Let's Encrypt.

https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Host
https://en.wikipedia.org/wiki/Server_Name_Indication


http://tools.ietf.org/html/rfc1035
According to RFC 1035 subdomains (aka "labels", hostnames) are case-insensitive, which severly constraints the number of content addressing identifier types that can be used without need for an additional conversion step.




Opportunistic Protocol Upgrade
Tools and browser extensions SHOULD detect valid IPFS paths and resolve them directly over IPFS protocol and use HTTP gateway ONLY as a fallback when no native implementation is available to ensure a smooth, backward-compatible transition.






The ipfs:// protocol scheme does not retain original path, but instead requires a conversion step to/from URI:

ipfs://{immutable-root}/path/to/resourceA → /ipfs/{immutable-root}/path/to/resourceA
ipns://{mutable-root}/path/to/resourceB → /ipns/{mutable-root}/path/to/resourceB

The first element after double slash is an opaque identifier representing the content root. It is interpreted as an authority component used for Origin calculation, which provides necessary isolation between security contexts of diferent content trees.

The URL standard requires opaque identifier to be case-insensitive.

[reword] identifiers should use lowercased base32 (rfc4648 - no padding - highest letter) as the default multibase






