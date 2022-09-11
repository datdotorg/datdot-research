# datdot-gateway
daemon which offers RPC/IPC API to interact with chain and service


latest experiments:
  * https://glitch.com/edit/#!/rare-endurable-care?path=server.js%3A1%3A0



----------------------



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

