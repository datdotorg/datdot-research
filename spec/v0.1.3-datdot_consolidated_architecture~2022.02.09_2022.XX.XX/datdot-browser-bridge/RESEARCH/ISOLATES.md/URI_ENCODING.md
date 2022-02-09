

/dns/foo.com/bar/baz.txt
/http/10.20.30.40/bar/baz.txt
/ipfs/abcabcabcbabcacab/bar/baz.txt
/ipns/foo.com/bar/baz.txt
/bittorrent/abbaabababbaabab/bar/baz.txt
/local/foo/bar/baz.txt








Subdomain gateway
When origin-based security (opens new window)is needed, CIDv1 in case-insensitive encoding such as Base32 or Base36 should be used in the subdomain:

https://<cidv1b32>.ipfs.<gateway-host>.tld/path/to/resource
Example:

https://bafybeiemxf5abjwjbikoz4mc3a3dla6ual3jsgpdr4cjr3oz3evfyavhwq.ipfs.dweb.link/wiki/
https://bafybeiemxf5abjwjbikoz4mc3a3dla6ual3jsgpdr4cjr3oz3evfyavhwq.ipfs.cf-ipfs.com/wiki/Vincent_van_Gogh.html
https://bafybeiemxf5abjwjbikoz4mc3a3dla6ual3jsgpdr4cjr3oz3evfyavhwq.ipfs.localhost:8080/wik







  Known issues

Some browsers and other user agents force lowercase for the authority part of URLs, breaking case-sensitive CIDs before the HTTP gateway has a chance to read them
DNS label length is limited to 63 characters (RFC 1034 (opens new window))
Due to these limitations, the use of short, case-insensitive CIDv1 in a subdomain context is advised.
Base32 is the safe default; the less-popular Base36 can be used for longer ED25519 libp2p keys.

See the next section to learn how to convert an existing CIDv0 to a DNS-safe representation.

# https://tools.ietf.org/html/rfc1034#page-7










For example, a website can load static assets from content-addressed paths:

<link rel="stylesheet" href="https://example.com/ipfs/QmNrgEMcUygbKzZeZgYFosdd27VE9KnWbyUD73bKZJ3bGi?filename=style.css">
<link rel="stylesheet" href="/ipfs/QmNrgEMcUygbKzZeZgYFosdd27VE9KnWbyUD73bKZJ3bGi?filename=style.css">
User agents that support IPFS, such as a browser with ipfs-companion (opens new window),
may recognize the /ipfs/<CID> content path and load the related asset over IPFS instead of HTTP. User agents without IPFS support still get the correct data from the original HTTP server.













Option 1: Path-based URI


dweb:/protocol/path/to/resource


Main problem: no Origin isolation without writing custom code in browsers.







Option 2: Origin-based URL

dweb://{id}.{ipfs|ipns|dat|ssb|etc}

Main win: Origin isolation for free.





We proactively define dweb as an URI namespace shared between all DWeb protocols to:

avoid situation when a single protocol (or a rogue third-party) grabs dweb for own purposes.
improve access to Dweb resources experience by making it possible to access dweb content via simple http-based viewers






How should protocol routing be implemented in short term?
Option A: create "The DWeb Protocols" web extension under arewedistributedyet org that is a simple browser extension redirecting DWeb protocols to the best viewer currently available.
Everyone can PR against it and add a new handler for a specific path, or propose a change for existing ones.
Option B: ?



Another take on this: what if we reduce the surface of protocol handlers in places like web browsers by using a single protocol handler with custom top level domains (TLD suffixes)?

dweb://{id}.{ipfs|ipns|dat|ssb|etc}
dweb://bafybeiemxf5abjwjbikoz4mc3a3dla6ual3jsgpdr4cjr3oz3evfyavhwq.ipfs/
dweb://778f8d955175c92e4ced5e4f5563f69bfec0c86cc6f670352c457943666fe639.dat/
dweb://{hash-in-base32}.ssb/

Pros:

single protocol handler enables frictionless cross-dweb-protocol requests (Protocol Handler: Cross-protocol Content mozilla/libdweb#52)
each dweb protocol gets own TLD, providing Origin-based isolation


Cons:

demultiplexing becomes an open problem without native support in the client
for now, we could make "dweb:// browser extension" that acts as lazy-install prompt for each protocol on the first time IPFS/DAT/SSB address is used
SSB addressing is case-sensitive, which makes it impossible to use it in Origin label in URLs (potential fix: adopt CID or at least Base32)


How to handle TLDs existing in DNS?
(A) Don't, make DWEB TLDs explicit and required
(B) Check for DNSLink. In the beginning we would check DNS, but ENS or other distributed solution could take a priority in the future. If present, websites could get pretty nice URLs like dweb://example.com

The underlying requirement:

Firefox, for example, implements https://url.spec.whatwg.org/ not the URL RFC. That's what we need to use if we want our urls to be Web-browser compatible


How do you feel about adopting the web+ thing that browsers do, but using dweb+? Like dweb+ipfs:// or dweb+dat://



@THOUGHT:
https://github.com/arewedistributedyet/arewedistributedyet/issues/28#issuecomment-626035970
* ipfs/ipns: [ipfs/in-web-browsers#29](https://github.com/ipfs/in-web-browsers/issues/29)
* dat: [datprotocol/DEPs#66](https://github.com/datprotocol/DEPs/issues/66)
* ssb: [ssbc/ssb-spec-drafts#4](https://github.com/ssbc/ssb-spec-drafts/issues/4)
and
* https://github.com/playproject-io/datdot-research/issues/17
* https://github.com/playproject-io/datdot-research/issues/20




## The ".dweb" Special-Use Domain Name
**special-use top-level domain (TLD) for DWeb uses**

There is an interesting precedent of Tor project registering Special-Use Domain Name .onion:
  * RFC 7686: The ".onion" Special-Use Domain Name: https://tools.ietf.org/html/rfc7686

`.dweb` could become the www. for the DWeb, eg:
  * IPFS bafybeiemxf5abjwjbikoz4mc3a3dla6ual3jsgpdr4cjr3oz3evfyavhwq.ipfs.dweb (cidv1b32)
  * DAT 778f8d955175c92e4ced5e4f5563f69bfec0c86cc6f670352c457943666fe639.dat.dweb

PROS
Easy to support in existing software via HTTP Proxies
Does not require DNS support, HTTP Proxy can generate responses for arbitrary domains on the fly
(approach being discussed for go-ipfs)
Browser vendors can apply different security rules to *.dweb
(eg. mark it as Secure Context – .onion example, or enable experimental p2p APIs)
  * https://developer.mozilla.org/en-US/docs/Web/Security/Secure_Contexts
  * Treat .onion as a secure context: https://bugzilla.mozilla.org/show_bug.cgi?id=1382359
  * IANA: Special-Use Domain Names Registry: https://www.iana.org/assignments/special-use-domain-names/special-use-domain-names.xhtml
  * RFC 6761: Special-Use Domain Names: https://datatracker.ietf.org/doc/html/rfc6761


CHECK: @TODO:
FWIW in Beaker (which uses Chromium via Electron) the dat: URLs parse correctly. I believe it's because dat: is registered in a Chromium system as a "Standard URL" and so it is given the parsing rules of HTTP URLs, but I haven't checked to see if it's a behavior that Electron patches in (rather than Chromium doing it). I just mention this because this might not be terribly difficult to solve in Chromium if your scheme design is similar to HTTPS.


===========================================================================


namecheap seems to not allow to register domains with more than 50 chars in it




===========================================================================
Since these addresses aren’t URLs, using them in a web browser requires reformatting them slightly:
Through an HTTP gateway, as http://<gateway host>/<IPFS address>
Through the gateway subdomain (more secure, harder to set up): http://<cid>.ipfs.<gateway host>/<path>, so the protocol and CID are subdomains.
Through custom URL protocols like ipfs://<CID>/<path>, ipns://<peer ID>/<path>, and dweb://<IPFS address>






===========================================================================


DNS:

Length Limits
Subdomain needs to comply with length limits from RFC 1034:

Each node has a label, which is zero to 63 octets in length. #

To simplify implementations, the total number of octets that represent a
domain name (i.e., the sum of all label octets and label lengths) is
limited to 255. #

https://tools.ietf.org/html/rfc1034#page-7



Problem: DNS label limit of 63
RFC 1034: "each node has a label, which is zero to 63 octets in length"

The default CIDv1 Base32 with multihash of sha256 and RSA libp2p-key fits:

Default CID: http://bafybeigdyrzt5sfp7udm7hu76uh7y26nf3efuylqabf3oclgtqy55fbzdi.ipfs.dweb.link
RSA: https://bafzbeih7uocwo6vmbjusf4wzw6h5cruhw3gf4jxhevmxssnz5vkgryk2za.ipns.dweb.link
but if we use ED25519 libp2p-key then we are 2 characters over the limit:

ED25519 libp2p-key: https://bafzaajaiaejca4syrpdu6gdx4wsdnokxkprgzxf4wrstuc34gxw5k5jrag2so5gk.ipns.dweb.link
CID created with --hash sha2-512 will be even longer: https://bafkrgqe3ohjcjplc6n4f3fwunlj6upltggn7xqujbsvnvyw764srszz4u4rshq6ztos4chl4plgg4ffyyxnayrtdi5oc4xb2332g645433aeg.ipfs.dweb.link
Label longer than 63 characters means the hostname can't resolve:

$ ping bafzaajaiaejca4syrpdu6gdx4wsdnokxkprgzxf4wrstuc34gxw5k5jrag2so5gk.ipns.dweb.link
ping: bafzaajaiaejca4syrpdu6gdx4wsdnokxkprgzxf4wrstuc34gxw5k5jrag2so5gk.ipns.dweb.lin


Note: I used ED25519 as an example, but not limited to that single type of CID.
Even if we find a way to fit ED25519 in a single label, the problem remains for CIDs with a multihash
reated with longer hash functions.


Solved: IPNS-specific fix for ED25519 keys
In parallel to the generic fix, we could represent ED25519 keys in a way that fits under 63 characters,
solving the UX issue for IPNS websites loaded from public gateways.



Examples
Given a subdomain gateway at example.com:

ED25519 fits perfectly when converted to Base36, so it gets loaded just fine:

http://example.com/ipns/12D3KooWP3ggTJV8LGckDHc4bVyXGhEWuBskoFyE6Rn2BJBqJtpa
  → HTTP301 – http://k51qzi5uqu5dl2yn0d6xu8q5aqa61jh8zeyixz9tsju80n15ssiyew48912c63.ipns.example.com


(D) leverage HTTP proxy mode (on localhost)
When Gateway port is used as HTTP proxy, local client does not perform DNS lookup, but original URL is sent in HTTP request to the proxy for processing.

Because HTTP proxy IS go-ipfs node in that scenario, it does not do DNS lookup, but extract original (long) CID and resolves it, without involvement of DNS.

As long user agents are not overzealous in validating URLs, this would allow for long (>63) CIDs on subdomains.

This is important, because it enables localhost gateway (used by Brave) to resolve long CIDs correctly without any additional hacks.

UX details tbd. This could be the solution for localhost gateway, but for public ones we still need something else.






===========================================================================

BASE32 STRIKE FORCE
https://gist.github.com/lidel/ceef96f60f30308e3c07be95182c4c88


===========================================================================


check: https://github.com/neocities/hshca


Base 32 Encodings
Might I suggest the use of Crockford's Encoding for base32 encoded content addresses. It is my opinion that this encoding is the best choice. My reasons:

The encoding includes all numerical digits (0-9); seems reasonable for a number encoding
Begins with numerical digits like hex (0 is a value of zero, 9 is a value of nine, etc).
Prefers numbers over letters (1 over I or L; 0 over O)
EDIT





## LATEST

https://github.com/jonnycrunch/ipfs-uri-scheme/issues/1


2017: four stages
  HTTP-to-IPFS gateway https://ipfs.io/ipfs/<cid> (path gateway)
  Short term: URL ipfs://<cid>
  Mid term: URI dweb:/ipfs/<cid>
  Long term: NURI /ipfs/<cid>

2020: reality check stage1
  HTTP-to-IPFS subdomain gateway https://<cid>.dweb.link/

stage2:
  Our desktop app and browser extension add support for resolving ipfs://<cid> URLs
  People seem to expect URL instead of URI, at least in browser context

stage3: Adoption:
  experimental support in desktop app and browser extension, but that is about it
  AFAIK no adoption outside of our experiments



Option 2: Origin-based URL
A single protocol handler with custom top level domains (TLD suffixes):

dweb://{id}.{ipfs|ipns|dat|ssb|etc}
dweb://bafybeiemxf5abjwjbikoz4mc3a3dla6ual3jsgpdr4cjr3oz3evfyavhwq.ipfs/
dweb://778f8d955175c92e4ced5e4f5563f69bfec0c86cc6f670352c457943666fe639.dat/
dweb://{hash-in-base32}.ssb/
Main win: Origin isolation for free.
  SEE: https://github.com/arewedistributedyet/arewedistributedyet/issues/28#issuecomment-517952772

  Something that come up in recent conversations: making dweb:// a regular URL (with distinct Origins). Putting it here to see what others think about this approach.

Another take on this: what if we reduce the surface of protocol handlers in places like web browsers by using a single protocol handler with custom top level domains (TLD suffixes)?

dweb://{id}.{ipfs|ipns|dat|ssb|etc}
dweb://bafybeiemxf5abjwjbikoz4mc3a3dla6ual3jsgpdr4cjr3oz3evfyavhwq.ipfs/
dweb://778f8d955175c92e4ced5e4f5563f69bfec0c86cc6f670352c457943666fe639.dat/
dweb://{hash-in-base32}.ssb/


  avoid situation when a single protocol (or a rogue third-party) grabs dweb for own purposes.
improve access to Dweb resources experience by making it possible to access dweb content via simple http-based viewers





namely:

URLs:

ipfs://{cidv1b32} → http://127.0.0.1:8080/ipfs/{cidv1b32}
ipns://{hash} → http://127.0.0.1:8080/ipns/{hash}

URI:

dweb:/ip[f|n]s/{hash} → http://127.0.0.1:8080/ip[f|n]s/{hash}

























--------------------------------------------
# Address IPFS on the web



  TIP

Use relative or absolute URLs that include content-addressed paths. This will take advantage of content addressing today while ensuring backward compatibility with the legacy web.

For example, a website can load static assets from content-addressed paths:

<link rel="stylesheet" href="https://example.com/ipfs/QmNrgEMcUygbKzZeZgYFosdd27VE9KnWbyUD73bKZJ3bGi?filename=style.css">
<link rel="stylesheet" href="/ipfs/QmNrgEMcUygbKzZeZgYFosdd27VE9KnWbyUD73bKZJ3bGi?filename=style.css">
User agents that support IPFS, such as a browser with ipfs-companion (opens new window), may recognize the /ipfs/<CID> content path and load the related asset over IPFS instead of HTTP. User agents without IPFS support still get the correct data from the original HTTP server.

#

  Subdomain gateway
When origin-based security (opens new window)is needed, CIDv1 in case-insensitive encoding such as Base32 or Base36 should be used in the subdomain:

https://<cidv1b32>.ipfs.<gateway-host>.tld/path/to/resource
Example:

https://bafybeiemxf5abjwjbikoz4mc3a3dla6ual3jsgpdr4cjr3oz3evfyavhwq.ipfs.dweb.link/wiki/
https://bafybeiemxf5abjwjbikoz4mc3a3dla6ual3jsgpdr4cjr3oz3evfyavhwq.ipfs.cf-ipfs.com/wiki/Vincent_van_Gogh.html
https://bafybeiemxf5abjwjbikoz4mc3a3dla6ual3jsgpdr4cjr3oz3evfyavhwq.ipfs.localhost:8080/wiki/



  Known issues

Some browsers and other user agents force lowercase for the authority part of URLs, breaking case-sensitive CIDs before the HTTP gateway has a chance to read them
DNS label length is limited to 63 characters (RFC 1034 (opens new window))
Due to these limitations, the use of short, case-insensitive CIDv1 in a subdomain context is advised.
Base32 is the safe default; the less-popular Base36 can be used for longer ED25519 libp2p keys.

See the next section to learn how to convert an existing CIDv0 to a DNS-safe representation.


  TL;DR: Using a subdomain gateway as a drop-in replacement for a path one removes the need for manual CID conversion.

Request for a content path sent to the gateway domain will return an HTTP 301 redirect to a correct subdomain version, taking care of any necessary encoding conversion if needed:

https://<gateway-host>.tld/ipfs/<cid> -> https://<cidv1>.ipfs.<gateway-host>.tld/



  To illustrate, opening the CIDv0 resource at https://dweb.link/ipfs/QmT5NvUtoM5nWFfrQdVrFtvGfKFmG7AHE8P34isapyhCxX/wiki/Mars.html(opens new window)
returns a redirect to a CIDv1 representation at https://bafybeicgmdpvw4duutrmdxl4a7gc52sxyuk7nz5gby77afwdteh3jc5bqa.ipfs.dweb.link/wiki/Mars.html











--------------------------------------------

I understand there's a switch to CIDv1 soon.
* https://github.com/multiformats/cid#cidv1
* https://github.com/multiformats/js-cid/blob/master/src/cid-util.js

I think go-ipfs should use lowercased base32 (rfc4648 - no padding - highest letter) as the default multibase.
* https://datatracker.ietf.org/doc/html/rfc4648

The reason this encoding is preferable: it's the one encoding that will work with subdomains (RFC1035 + RFC1123).
The restrictions are: case-insensitive, a-b0-9 and less than 63 bytes.
* http://tools.ietf.org/html/rfc1035
* https://datatracker.ietf.org/doc/html/rfc1123


For a slight increase in length, you reap enormous benefits:

The ability to do proper security origins for the HTTP gateway with subdomains (cidv1abcde.dweb.link).
This is very important if we want to handle reports with Google's safe browsing system (which is designed for origins).
With the current design, all content is on the same browser origin,
and a single phishing/malware report on any of the IPFS gateways (hosted by us or someone else)
will make web browsers block every single thing on the origin with a giant red warning message
until it's cleared up with Google (which from experience can take several days!)

Root paths are in the right place, which dramatically improves compatibility with existing web sites
that tend to do a lot of this: `<img src="/rootimg.jpg">`

Allows us to register dweb.link (and ipfs.io, etc.) to the Public Suffix List,
* https://publicsuffix.org/
which will prevent the sandboxed content from reading/manipulating cookies on the parent domain
(and on other cidv1 subdomains).

Opens up the ability for go-ipfs to do HTTP Host Header parsing
and automatic Let's Encrypt support (if we wanted to),
so anyone can set up a public IPFS gateway without additional software.

Once Let's Encrypt gets their wildcard cert domains shipped (Dec 2017), this could be a fully automated process.
Otherwise something like nginx would be needed (I could write an example nginx.conf that people could use for it).

It should use lowercase base32 characters by default,
so that it's consistent with subdomain usage (all the browsers will force lowercase).
IIRC the RFC doesn't care if it's lowercased, I think people just default to upper case for legacy reasons.


Obviously an abstraction layer could be written that converts between base32 and something else for use with web gateways and then have a different default, but I think it would less confusing for end users to use one default: the one that will let origins in browsers work.

This approach shouldn't be a problem for webextension plugins, but @lidel feel free to chime in.

Further reading: https://github.com/neocities/hshca



@lgierth initially pondering "base16 or base32" and @samholmes suggesting base32 with Crockford's Encoding.

* On the encoding note, I think base32 would work too: https://github.com/neocities/hshca


--------------------------------------------


Agreed -- copy-pasting from ipfs/specs#152:

e.g. ipfs://$hash
Well understood, adhering to WHATWG URL standard
Straightforward to implement
$hash is host/origin
Issues:
Hash needs to be base32 encoded, because URL hosts are case-insensitive.
Solution 1/2: Needs a redirect to the base32 hash when pasting any non-base32 hashes.
Solution 2/2: Probably needs a special base32 CID that retains information about the original non-base32 CID, so that we can avoid confusing UX around changing hashes.
Doesn't retain the path, but instead needs conversion step to/from URI.
Solution: The URI path can be derived from URL scheme and host and path.





# Base32 Crockford
Base 32 Encodings
Might I suggest the use of Crockford's Encoding for base32 encoded content addresses. It is my opinion that this encoding is the best choice. My reasons:
* https://www.crockford.com/base32.html
* https://www.npmjs.com/package/base32-crockford
* https://www.npmjs.com/package/c32check
* https://www.npmjs.com/package/crockford-base32
* https://www.npmjs.com/package/base32-encode

The encoding includes all numerical digits (0-9); seems reasonable for a number encoding
Begins with numerical digits like hex (0 is a value of zero, 9 is a value of nine, etc).
Prefers numbers over letters (1 over I or L; 0 over O)

* https://datatracker.ietf.org/doc/html/rfc4648#section-6
* https://en.wikipedia.org/wiki/Base32#z-base-32


An added reason to push for Crockford's Base32 is that it meets the same criteria as Base58Check, the base58 encoding Bitcoin uses for bitcoin addressses:

https://en.bitcoin.it/wiki/Base58Check_encoding
// Why base-58 instead of standard base-64 encoding?
// - Don't want 0OIl characters that look the same in some fonts and
// could be used to create visually identical looking account numbers.
// - A string with non-alphanumeric characters is not as easily accepted as an account number.
// - E-mail usually won't line-break if there's no punctuation to break at.
// - Doubleclicking selects the whole number as one word if it's all alphanumeric.

It seems to be like Crockford's Base32 naturally fits the same goals as Base58Check with the added feature of being case-insensitive.
```js
var a = []; for (var i = 0; i < 32; i++) a.push((i).toString(32))
console.log(a);
// (32) ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v"]
```


----------------------

@jefft0 "URLs should treat upper case letters as equivalent to lower case in scheme names"
https://www.ietf.org/rfc/rfc1738.txt



No, it would interpret it as an absolute path on the current host. Try this link for example. That was a link to /ipns/ipfs.io, but your browser will try to connect you with https://github.com/ipns/ipfs.io.


Yeah, the spec for href specifically expects it to be a URI, so if you want to use this new format you'll likely need a new attribute added to the HTML spec.
https://www.w3.org/TR/html4/struct/links.html#adef-href

It'll work just fine with href="ipfs://<hash>" and href="dweb:/ipfs/<hash>" -- I don't feel like this discussion is going anywhere at the moment, these are things that have been agreed on years ago.




--------------------
It’s just http server redirects a non / ended paths, which is totally fine. The problem is that for protocol that proxies to the http server will follow that redirect and there for end-up serving from localhost. After thinking more about it, I think that should not be too hard to handle by looking at the http headers before serving response and if it’s redirect do a resolution in protocol handler. Although again it would be nicer to have a more direct way to talk to ipfs node to do path resolutions.

IPFS node automatically redirects if path is for the directory but without / at the end. As a side effect following redirect happens:

fs://ipfs/${cid}/dir -> localhost:8080/ipfs/${cid_v1_base16}/dir/

While it would make more sense to either redirect as

fs://ipfs/${cid}/dir -> ipfs://${cid_v1_base16}/dir/

or redirect and 404 here

fs://ipfs/${cid}/dir -> ipfs://${cid_v1_base16}/dir

Obviously former would be more preferable, but somewhat unclear how to do that given that protocol handler has no knowledge of what’s actually under the requested URL

Example: https://ipfs.io/ipns/ipfs.io redirects to https://ipfs.io/ipns/ipfs.io/ -- this also breaks the "fake fs: path" in the address bar with the firefox addon.

We need this behaviour so that relative links in e.g. HTML documents always work.

One way around this issue is to set a special header in gateway requests from browser addons, and adjust the redirects in the gateway accordingly:

GET /ipns/ipfs.io HTTP/1.1
X-Redirect-Proto: dweb:

HTTP/1.1 301 Moved Permanently
Location: dweb:/ipns/ipfs.io/

----------------------


## Short term: URL
e.g. ipfs://$hash_base32


## Mid term: URI
e.g. dweb:/ipfs/$hash

## Long term: NURI
e.g. /ipfs/$hash



--------------------


# URI ENCODING


Add-on would detect requests with unsafe CID (case-sensitive, eg. base58) and convert them to safe ones (case-insensitive, eg. base32/16) before sending them to IPFS gateway.





URLs should treat upper case letters as equivalent to lower case in scheme names" https://www.ietf.org/rfc/rfc1738.txt

Yes, that's what the RFC says about the scheme part of scheme://host. The point is that browsers also treat the host part as case insensitive
so that http://github.com and http://GitHub.COM are the same. If the multihash is in the "host" part of the URI, there could be problems.


https://www.w3.org/TR/html4/struct/links.html#adef-href


It'll work just fine with href="ipfs://<hash>" and href="dweb:/ipfs/<hash>" -- I don't feel like this discussion is going anywhere at the moment, these are things that have been agreed on years ago.



**important**
As per the WHATWG URL spec, the hash in ipfs://<hash> is a domain, which needs to be a valid label according to RFC 1035.
* https://url.spec.whatwg.org/
* http://tools.ietf.org/html/rfc1035
That's why @kyledrake made hshca
* https://github.com/neocities/hshca


> base 32 is more standard. Also computing base 32 (and base 64) is far cheaper than base 36 or base 58 because non-power of two bases require expensive integer division. The tiny amount of space saved is not worth it.

> My argument for Crockford's encoding for base32 stands over older encoding standards like RFC 4648. I think that Crockford's encoding is the closest equivalent to the goals for Base58Check while having the added property of being case-insensitive. It's also nice to have digit equivalents shared between decimals and hexadecimals: 0-9 symbols are the same in all three bases, and a-f is the same in base16 and base32 (when base32 is encode using Crockford's encoding). This means a single symbol can represent the same value in all three bases (10, 16, and 32).

* Hosts in URLs are case-insensitive so base64 and base58 are out (as mentioned somewhere above)

* The success of the ipfs-in-web-browsers effort is becoming increasingly dependent on being able to use the CID as the authority in ipfs:// style addresses. The browsers normalise the authority section to lower-case before we can intercept them in a web-extension; non-base32 encoded CIDs get mangled before we get to them.


ethereum:<address>[?value=<value>][?gas=<suggestedGas>][?data=<bytecode>]
ethereum:0x89205A3A3b2A69De6Dbf7f01ED13B2108B2c43e7?gas=100000&data=0xa9059cbb00000000000000000000000000000000000000000000000000000000deadbeef0000000000000000000000000000000000000000000000000000000000000005
ethereum:<address>[?value=<value>][?gas=<suggestedGas>][?function=nameOfFunction(param)]
ethereum:0x89205A3A3b2A69De6Dbf7f01ED13B2108B2c43e7?gas=100000&function=transfer(address 0xdeadbeef, uint 5)

  ===============================================================

**address ipfs on the web**

`https://ipfs.io/ipfs/<CID>`
e.g
`https://ipfs.io/ipfs/Qme7ss3ARVgxv6rXqVPiikMJ8u2NLgmgszg13pYrDKEoiu`


Browsers that support IPFS can redirect these requests to your local IPFS node,
while those that don't can fetch the resource from the ipfs.io gateway.

You can swap out ipfs.io for your own http-to-ipfs gateway

hard coded links to public gateways can break if the gateway stops running


Through an HTTP gateway, as `http://<gateway host>/<IPFS address>`
Through the gateway subdomain (more secure, harder to set up): `http://<cid>.ipfs.<gateway host>/<path>`,
so the protocol and CID are subdomains.
Through custom URL protocols like `ipfs://<CID>/<path>`, `ipns://<peer ID>/<path>`, and `dweb://<IPFS address>`


`<link rel="stylesheet" href="/ipfs/QmNrgEMcUygbKzZeZgYFosdd27VE9KnWbyUD73bKZJ3bGi?filename=style.css">`
User agents that support IPFS, such as a browser with ipfs-companion (opens new window), may recognize the
`/ipfs/<CID>` content path and load the related asset over IPFS instead of HTTP.
User agents without IPFS support still get the correct data from the original HTTP server.




GATEWAYS:
Gateways are provided strictly for convenience: in other words, they help tools that speak HTTP but do not speak distributed protocols (such as IPFS) to communicat


# Path gateway
In the most basic scheme, a URL path used for content addressing is effectively a resource name without a canonical location. The HTTP server provides the location part, which makes it possible for browsers to interpret an IPFS content path as relative to the current server and just work without a need for any conversion:

`https://<gateway-host>.tld/ipfs/<cid>/path/to/resource`
`https://<gateway-host>.tld/ipns/<ipnsid_or_dnslink>/path/to/resource`

--

DANGER

In this scheme, all pages share a single origin (opens new window),
which means this type of gateway should be used only when site isolation does not matter
(static content without cookies, local storage, or Web APIs that require user permission).

When in doubt, use subdomain gateway.




## TIP

Use relative or absolute URLs that include content-addressed paths. This will take advantage of content addressing today while ensuring backward compatibility with the legacy web.

For example, a website can load static assets from content-addressed paths:

`<link rel="stylesheet" href="https://example.com/ipfs/QmNrgEMcUygbKzZeZgYFosdd27VE9KnWbyUD73bKZJ3bGi?filename=style.css">`
`<link rel="stylesheet" href="/ipfs/QmNrgEMcUygbKzZeZgYFosdd27VE9KnWbyUD73bKZJ3bGi?filename=style.css">`
User agents that support IPFS, such as a browser with ipfs-companion (opens new window),
may recognize the `/ipfs/<CID>` content path and load the related asset over IPFS instead of HTTP.
User agents without IPFS support still get the correct data from the original HTTP server.






BASE32 encoding
https://tools.ietf.org/html/rfc4648#section-6

$ ipfs cid base32 QmbWqxBEKC3P8tqsKc98xmWNzrzDtRLMiMPL8wBuTGsMnR
bafybeigdyrzt5sfp7udm7hu76uh7y26nf3efuylqabf3oclgtqy55fbzdi


PeerIDs can be represented as CID with libp2p-key multicodec (opens new window).
Base36 is suggested as a safer default for longer keys:

$ ipfs key list -l --ipns-base base36
k51qzi5uqu5dh9ihj4p2v5sl3hxvv27ryx2w0xrsv6jmmqi91t9xp8p9kaipc2 self

$ ipfs cid format -v 1 -b base36 --codec libp2p-key QmNnooDu7bfjPFoTZYxMNLWUQJyrVwtbZg5gBMjTezGAJN
k2k4r8jl0yz8qjgqbmc2cdu5hkqek5rj6flgnlkyywynci20j0iuyfuj



----------------------
@THOUGHT
https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/Data_URIs

Base64 is a group of binary-to-text encoding schemes that represent binary data in an ASCII string
format by translating it into a radix-64 representation.
By consisting only of ASCII characters, base64 strings are generally url-safe,
and that's why they can be used to encode data in Data URLs.

e.g.
```js
// PROBLEM: Problem: DNS label limit of 63

// CASE SENSITIVE
const hypercore = require('hypercore')
const stronglink = require('hypercore-stronglink')
const feed_pubkey_b64 = ``
const feedkey_b64 = `O7e6asHzkY1dyMkN65XDC4HTFqqIfZmPK5gP95a5KAU=`    // length: 44
const stronglink_b64 = `2F3z5FRvS4/nIMdfM0Y6GBlDSb5tgTAX/v95CjJC7Ag=` // length: 44

// BASE32 and BASE16 (=HEX) are case insensitive

console.log()

async function generate (feed, index) {
  const pkey = feed.key
  return new Promise(ok => stronglink.generate(feed, 2, (err, hash) => ok({ pkey, hash })))
}
```


----------------------

`ipfs://localhost/{cidv1b32}` breaks security model

----------------------

Some variants involve the url using a hash to pass data (#), which is really bad if you want to pass lots of data



cross domain set href#hash is allowed
each window polls its hash in regular intervals


## fix: view in gateway url now validates if url is acessible

```js
const DEFAULT_URI = 'https://ipfs.io'
const LOCAL_HOSTNAMES = ['127.0.0.1', '[::1]', '0.0.0.0', '[::]']
async function handler (conf) {
      conf = JSON.stringify(rawConf, null, '\t')
      const config = JSON.parse(conf)
      const url = getURLFromAddress('Gateway', config) || DEFAULT_URI
      // Normalize local hostnames to localhost
      // to leverage subdomain gateway, if present
      // https://github.com/ipfs-shipyard/ipfs-webui/issues/1490
      const gw = new URL(url)

      if (LOCAL_HOSTNAMES.includes(gw.hostname)) {
        gw.hostname = 'localhost'
        const localUrl = gw.toString().replace(/\/+$/, '') // no trailing slashes
        if (await checkIfSubdomainGatewayUrlIsAccessible(localUrl)) {
          store.doSetAvailableGateway(localUrl)
          return conf
        }
      }
      if (!await checkIfGatewayUrlIsAccessible(url)) {
        store.doSetAvailableGateway(DEFAULT_URI)
      }

}

const checkIfGatewayUrlIsAccessible = memoize(async (url) => {
  try {
    const { status } = await fetch(
    `${url}/ipfs/bafkqaaa`
    )
    return status === 200
  } catch (e) {
    console.error(`Unable to use the gateway at ${url}. The public gateway will be used as a fallback`, e)
    return false
  }
})


// Separate test is necessary to see if subdomain mode is possible,
// because some browser+OS combinations won't resolve them:
// https://github.com/ipfs/go-ipfs/issues/7527
const checkIfSubdomainGatewayUrlIsAccessible = memoize(async (url) => {
  try {
    url = new URL(url)
    url.hostname = `bafkqaaa.ipfs.${url.hostname}`
    const { status } = await fetch(url.toString())
    return status === 200
  } catch (e) {
    console.error(`Unable to use the subdomain gateway at ${url}. Regular gateway will be used as a fallback`, e)
    return false
  }
})
```




# DWEB common URI namespace shared by all p2p protocols
 a path is a viable canonical address
 and that all kinds of things with different semantics can live in a shared universal namespace

 e.g. `dweb:/protocol/path/to/resource`

`dweb:/ssb/<id> → ssb:// (is there a http-gateway?)`
`dweb:/dat/<hash>/file → dat:// (is there a http-gateway?)`
`dweb:/ipfs/<cid>/file → ipfs://<cid>/file (or https://<gateway>/ipfs/<cid>/file)`
`dweb:/ipns/<cid>/file → ipns://<cid>/file (or https://<gateway>/ipns/<cid>/file)`

**Main problem: no Origin isolation without writing custom code in browsers.**

A single protocol handler with custom top level domains (TLD suffixes):

`dweb://{id}.{ipfs|ipns|dat|ssb|etc}`

e.g.
dweb://bafybeiemxf5abjwjbikoz4mc3a3dla6ual3jsgpdr4cjr3oz3evfyavhwq.ipfs/
dweb://778f8d955175c92e4ced5e4f5563f69bfec0c86cc6f670352c457943666fe639.dat/
dweb://{hash-in-base32}.ssb/

**Main win: Origin isolation for free**
PROS:
1. single protocol handler enables frictionless cross-dweb-protocol requests
  * https://github.com/mozilla/libdweb/issues/52
2. each dweb protocol gets own TLD, providing Origin-based isolation

CONS:
1. demultiplexing becomes an open problem without native support in the client
  * for now, we could make "dweb:// browser extension" that acts as lazy-install prompt for each protocol
    * on the first time IPFS/DAT/SSB address is used
2. SSB addressing is case-sensitive, which makes it impossible to use it in Origin label in URLs
  * (potential fix: adopt CID or at least Base32)

Open questions:
* How to handle TLDs existing in DNS?
  * (A) Don't, make DWEB TLDs explicit and required
  * (B) Check for DNSLink. In the beginning we would check DNS,
    * but ENS or other distributed solution could take a priority in the future.
    * If present, websites could get pretty nice URLs like dweb://example.com

@THOUGHT:
```js
const url = `https://23u9t024jg924jg0234jg.dat`
// => intercept with service worker
// ==> if domain ending is `.dat`, treat as hyper url


HYPER PEER address: `220323ti290w4w904uw09utw4.dat#pubkey` // hash of feed
HYPER CORE address: `220323ti290w4w904uw09utw4.dat` // pubkey of peer


```



```js
// https://github.com/ipfs/specs/blob/0e0f8c90d0284ebab282483e65726e50f8287cc9/DWEB_ADDRESSING.md#the-noble-goal-unify-the-filesystem-database-web-rift

The dweb:/<protocol>/<authority>/<resource> style scheme OTOH was created for with a different goal in mind: That of unifying the addressing modes of local and remote files. Whether you agree it's worth it or not, there is absolutely no practical benefit of having

dweb://bafybeiemxf5abjwjbikoz4mc3a3dla6ual3jsgpdr4cjr3oz3evfyavhwq.ipfs/
dweb://778f8d955175c92e4ced5e4f5563f69bfec0c86cc6f670352c457943666fe639.dat/
dweb://{hash-in-base32}.ssb/

// => A minor reason is not having to force people to swallow N shemes (ipfs:// ipns:// ipld:// and counting), and instead use one that muxes.

```

```
// DWEB APPROACH

The dweb: Approach
Strengths of this Approach
1. Prevents Proliferation of Schemes and Namespaces
2. NOT doing this now effectively shuts down future possibilities by making new namespaces
  * "not worth doing the work of introducing a URL scheme".
3. Strength: Getting away from the ://
4. I kinda like this aesthetic. No matter what prefix is picked, it looks better than anything with ://
  * /webfs/ipfs/QmT272yei1Zn1eAUq5P9nZyeaKP4oJmVv7CbYvUPyk3aLj/hobby.jpg
  * /dweb/ipfs/QmT272yei1Zn1eAUq5P9nZyeaKP4oJmVv7CbYvUPyk3aLj/hobby.jpg
  * /x/ipfs/QmT272yei1Zn1eAUq5P9nZyeaKP4oJmVv7CbYvUPyk3aLj/hobby.jpg

Let's say we have: dweb://ipfs/Qmbar.. and dweb://foo/buz.
If IPFS browser add-on provides handler for dweb://, FOO is unable to handle its own URIs.
We should plan for this now, and have contingency written down..


@THOUGHTS:
1. have SERVICE WORKER intercept any and all requests
2. check the custom TLD
3. trigger the trusted handler for that TLD

QUESTION:
what or where to define those handlers?


@THOUGHT:
trust is in SHIM provider, BUT:
...what if somebody wants to open documents that only suported by another SHIM?
...how to "install" another trusted kernel extension to support, e.g. "IPFS" ???


@THOUGHT: ping mauve or rather check mauves fetch




Criticism: Doesn't fit with the way Browsers identify origins
Some current browsers have trouble with the construction:
origin = a://b/c
because they expect:
origin = a://b
even though that's not in the URI spec.

==> The dweb: schema dodges this by treating IPFS and IPNS as namespaces within a single dweb address scheme

==> If we don't push for the dweb: approach it will prevent innovation by making it hard to mint new namespaces on the (content-addressed) web.


@TODO:
A draft spec for the dweb: schema is under way at https://github.com/ipfs/in-web-browsers/issues/28

