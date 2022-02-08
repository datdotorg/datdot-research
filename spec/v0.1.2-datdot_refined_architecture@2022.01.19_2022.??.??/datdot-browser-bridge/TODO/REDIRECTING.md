Current status:

IPFS Companion extension DOES NOT redirect from cidv1b32.ipfs.foo.tld to http://127.0.0.1:8080/ipfs/cidv1b32 because that would decrease security guarantees




( A ) anger Redirect to http://127.0.0.1:8080/ip(f|n)s/.. even IF it would decrease Origin-based guarantees


 B ) angel (@lidel's plan) DO NOT redirect to http://127.0.0.1:8080/ip(f|n)s/.. by default, but give opt-in option to open at local gateway




 ( C ) anger "A mess": redirect to a custom hostname for localhost HTTP gateway

dependency on DNS: *.ipfs.foo.tld → 127.0.0.1 (Hostnames for localhost HTTP gateway in-web-browsers#109)
as this is not a raw IP, HTTP gateways does not fall under mixed-content whitelist nor is a Secure Context
localhost certs are problematic, but without HTTPS going with HTTP means..
..mixed-content errors (Mixed Content error when i view https website #645)



Regarding ( C ): The issues you mention are all addressable: Use a placeholder domain for the origin with a wildcard certificate. The extension redirects to <CID>.ipfs-gateway.local.page. That site is a wildcard domain with a certificate that hosts a simple page that tells people to use a public gateway or install the companion extension. With the extension installed, requests to that origin are hijacked and the extension returns content appearing to be from that origin. Also fixes the "how do I share a link to localhost" issue. Firefox only.
  https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/webRequest/filterResponseData

   don’t use webRequest.filterResponseData. Instead, use a WebSocket and a Service Worker that pulls data from 127.0.0.1 and serves it from the <CID>.ipfs-gateway.local.page origin. It would be origin-white-washing everything on the fly. it Should work the same as js.ipfs.io does today except the worker talks to loopback only.






( H ) thinking Service Worker pulls data from 127.0.0.1 and serves it from the <CID>.ipfs.local.dweb.link Origin.
  It would be origin-white-washing everything on the fly.
  Should work the same as js.ipfs.io does today except the worker talks to loopback only.

  Would have to be HTTP-pull, as WebSocket connections through a loopback HTTP address
  in Firefox are blocked due to bug-1376309
  https://bugzilla.mozilla.org/show_bug.cgi?id=1376309


  Unknown performance characteristics

  Breaks websites that themselves require Service Worker

  Companion should be able to remove the need for adding CORS to local node






  ( G ) Like (B) but we could allow redirects for some content types like images or videos. Rationale: subresources are easy to detect via ResourceType – we can detect image and video that way. (Other ways to tell the content-type: look at extension [naive] or fetch a few bytes and do mime-sniff on them [expensive])



  ( E ) We’ve got all of 127.0.0.0/8 to work with (16 million + addresses) that are all considered to be a secure context. It’s probably possible to think of a clever way to match CIDs to loopback addresses. We couldn’t guarantee a unique origin as there would potentially be collisions. But it’s a huge improvement over ( A ) that requires a more dedicated attacker with exact knowledge of the hash/origin he want to attack.

  I am afraid it won't work. Only 127.0.0.1 and ::1 are viable options, as only those raw IPs are whitelisted by both Firefox and Chrome. Fun fact: localhost is not whitelisted: #328.
  PROBEMS not whitelisted: https://github.com/ipfs/ipfs-companion/issues/328



  ( F ) Relay on containerized first-party isolation. Firefox only (but I do think Brave is working on it for Chromium).

  ( G ) Allow redirects without prompting for confirmation for some content types like image/* and text/plain but require user-confirmation for text/html, application/javascript, etc.
  Indeed, we can detect image, video and others by looking at ResourceType of each request. Added to the list, but as this type of mixed mode may break websites, should start as an experimental flag.
  https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/webRequest/ResourceType

  ISSUE: https://bugzilla.mozilla.org/show_bug.cgi?id=1376309





  ( I ) Redirect by default but enforce stricter security policies. Most of the websites that are out there today are static blogs and the like with no need for a strict origin policy. The local gateway can enforce better security in modern browsers by purging data on every load by adding the Clear-Site-Data: "*" response header to everything coming from the local gateway. (Removes service workers, cookies, or anything else persistent between requests.) Could also disable JavaScript and frames unless a strict origin can be guaranteed using a Content-Security Policy when loading from the gateway. Easier to implement than ( G ) and more predictable behaviour for developers. This would allow for today’s DNSLink usecases to still [mostly] function until a better long-term solution can be devised.


  ( J ) RFC 7838 may offer an alternative solution for DNS-to-IPFS that is currently handled by DNSLink.

  A HTTP servers could announce IPFS support by including either of the following headers:

  Alt-Srv: ipfs="CID"
  Alt-Srv: ipns="dweb.example.com"
  The browser could then switch to loading content from the local gateway as the original origin. This depends on browser support to allow extensions to handle Alternate Service announcement keywords like ipfs and ipns, however.
  https://tools.ietf.org/html/rfc7838


---------------------------

> anything.localhost is not treated as a secure origin.

Initial version at https://w3c.github.io/webappsec-secure-contexts/#is-origin-trustworthy read:
https://w3c.github.io/webappsec-secure-contexts/#is-origin-trustworthy

> If origin’s host component is "localhost" or falls within ".localhost", and the user agent conforms to the name resolution rules in let-localhost-be-localhost, return "Potentially Trustworthy".
> https://tools.ietf.org/html/draft-west-let-localhost-be-localhost

Which meant it would be treated the same as 127.0.0.1.

Just as you noted, browser vendors follow more conservative approach from https://www.w3.org/TR/secure-contexts/#is-origin-trustworthy:

> If origin’s host component matches one of the CIDR notations 127.0.0.0/8 or ::1/128 [RFC4632], return "Potentially Trustworthy".

https://www.w3.org/TR/secure-contexts/#localhost:

> Section 6.3 of [RFC6761] lays out the resolution of localhost. and names falling within .localhost. as special, and suggests that local resolvers SHOULD/MAY treat them specially. For better or worse, resolvers often ignore these suggestions, and will send localhost to the network for resolution in a number of circumstances.
> Given that uncertainty, this document errs on the conservative side by special-casing 127.0.0.1, but not localhost.

Safari does not even allow 127.0.0.1: https://bugs.webkit.org/show_bug.cgi?id=171934





==>


  Some takeaways:

We could work with browser vendors on changing that. I believe in let-localhost-be-localhost and making it Secure Context, at least for *.ip(f|n)s.localhost which come with content-addressing guarantees
https://tools.ietf.org/html/draft-west-let-localhost-be-localhost

In parallel, we could look into registering Special-Use *.dweb, similar to *.onion which created a good precedent for being marked as a secure context in Firefox: https://bugzilla.mozilla.org/show_bug.cgi?id=1382359
  https://tools.ietf.org/html/rfc7686
  https://bugzilla.mozilla.org/show_bug.cgi?id=1382359


  Something I'd like to avoid is playing with self-signed cartificates and injecting CA Root to users truststore.

Even without secure context, HTTP Proxy would be valuable for a lot of use cases, and there will be a way to disable redirect per website (Per-site Redirect Opt-out #687)







  *.localhost behaves according to the RFC for it’s special use domain. (Meaning it doesn’t do squat by default.) However, this isn’t a problem as the extension or a browser proxy configuration can be setup to handle *.,localhost which I assumed was the idea to begin with.


  upport for localhost HTTP Proxy and <fqdn>.ipns.localhost lands



  2019-10-01:
  As of 2019-10 localhost (hostname) is a secure context in both Firefox 69 and Chrome 78.
Firefox does not support *.localhost yet, but everything suggests it will at some point – more details in ipfs/in-web-browsers#109 (comment)

  Interesting development:
As of 2019-10 localhost (hostname) is a secure context in both Firefox and Chrome.

Caveat: Firefox does not include subdomains (foo.bar.localhost is not a secure context), but I posted our use case in related bug to match behavior from Chrome:
https://bugzilla.mozilla.org/show_bug.cgi?id=1433933#c6

There is also a discussion to skip DNS lookup for *.localhost (https://bugzilla.mozilla.org/show_bug.cgi?id=1220810) and hardcode it to loopback, which would make it work on all platforms, regardless of local DNS setup.

This makes *.localhost nearly ready for use (waiting for Firefox to match Chrome).
I updated the first post in this issue to reflect current status.

Demo
Loaded http://en.wikipedia-on-ipfs.org.ipfs.localhost:8080/ipns/en.wikipedia-on-ipfs.org/wiki/ today and Chrome marks it as secure context:




  2020.07.09

  There are two known problems with *.localhost at the moment:

1. If browser vendor does not hardcode localhost to point at loopback, then it is resolved by OS DNS resolver, and on some platforms that can produce error. Fix here is to implement section 6.3.3 from https://tools.ietf.org/html/rfc6761#section-6.3 (Chromium-based browsers already do this)

2. Content at *.localhost should be marked as Secure Context. Right now some vendors such as Firefox handle localhost and *.localhost differently, partially due to legacy code, partially due to my previous point.

Implementing "let localhost be localhost" (6.3.3 from rfc6761) would ensure localhost can resolve on every platform and can be marked as secure context – very likely solving both issues.

Vendors are mostly ok with this change:

Firefox/Gecko already is tracking this as part of https://bugzilla.mozilla.org/show_bug.cgi?id=1220810.
Safari/Webkit:
https://bugs.webkit.org/show_bug.cgi?id=171934
https://bugs.webkit.org/show_bug.cgi?id=160504
Unfortunately the movement on Safari and Firefox fronts to resolve it turned out to be slower than we expected. Looking into ways we can accelerate that.



  2020.09.21

  Good news: Chromium officially locked *.localhost to loopback as per https://tools.ietf.org/html/draft-ietf-dnsop-let-localhost-be-localhost-02 partying_face

Details from https://bugs.chromium.org/p/chromium/issues/detail?id=589141#c15:

We addressed this in https://bugs.chromium.org/p/chromium/issues/detail?id=691930 but didn't close this bug. There, we locked *.localhost to loopback as per https://tools.ietf.org/html/draft-ietf-dnsop-let-localhost-be-localhost-02 (see https://source.chromium.org/chromium/chromium/src/+/master:net/dns/host_resolver_manager.cc;drc=25292af6cee762330490f47e79e09a071dc4b5a9;l=3091). This means that we also consider *.localhost secure (see https://source.chromium.org/chromium/chromium/src/+/master:services/network/public/cpp/is_potentially_trustworthy.cc;drc=c70af83bc44f6829277cdc3621e7015d6e0d7530;l=228).

This increases likelihood of other vendors to follow.


  https://bugzilla.mozilla.org/show_bug.cgi?id=1220810#c89





  2020.10.22


  Some updates and reading for anyone interested in following *.localhost space :-)

The best support can be found in Chromium (no need for HTTP proxy, local DNS resolver is ignored)
Firefox will soon catch up thanks to our partnership with Igalia, we are also reaching out to Webkit to follow.

Chromium
Intent to Implement and Ship: Treat http://localhost as a secure context.
Firefox
Intent to prototype & ship: Treat localhost addresses as "Potentially Trustworthy"
"Hardcode localhost to loopback" patch landed last week, sounds like it is here to stay partying_face
https://bugzilla.mozilla.org/show_bug.cgi?id=1220810 → https://phabricator.services.mozilla.com/D92716
some remaining fixes need to land before its 100% hardcoded. Work tracked in:
https://bugzilla.mozilla.org/show_bug.cgi?id=1673364 → https://phabricator.services.mozilla.com/D94726
Tests to ensure localhost and *.localhost can actually not be overridden by non-local IP:
https://bugzilla.mozilla.org/show_bug.cgi?id=1673315 → https://phabricator.services.mozilla.com/D94712
Create a WPT test to verify handling of locahost and *.locahost
https://bugzilla.mozilla.org/show_bug.cgi?id=1672323
Webkit (Apple)
Localhost subdomains don't work
https://bugs.webkit.org/show_bug.cgi?id=160504
Content from loopback addresses (e.g. 127.0.0.1) should not be considered mixed content
https://bugs.webkit.org/show_bug.cgi?id=171934






  REQUIREMENTS

  I wonder if there is a way of generating vanity hostnames pointing at localhost that:

 does not require lookups to an external DNS server
 keeps HTML content in secure context
 works out-of-the box on windows, mac and linux
alternatively we can add heuristics to pick method based on user's platform
 lets us introduce subdomain-driven Origin isolation for locally running gateway
 (nice to have, but we can work around this for embedds) does not trigger mixed-content warnings when IPFS resource from localhost is embedded on HTTPS website
it is what happens when /ipfs/{cid} is redirected from public gateway running on https to a custom one running on http
this may be the blocker: AFAIK only 127.0.0.1 and ::1 are whitelisted by browser vendors (eg. firefox #903966) but localhost is not (that is why Companion uses raw IP)
as of 2019-10 localhost is a secure context in both Firefox and Chrome. Firefox does not support subdomains (foo.bar.localhost is not a secure context)


  https://developer.mozilla.org/en-US/docs/Web/Security/Secure_Contexts

  CANDIDATES:

  *.localhost

  ```js
   window.isSecureContext === true
   window.isSecureContext === false
  ```

  Status	          Firefox   Chrome
  127.0.0.1	        lock	    lock
  localhost	        lock	    lock
  foo.bar.localhost	anger	    lock


  References
https://w3c.github.io/webappsec-secure-contexts/#localhost:
Section 6.3 of [RFC6761] lays out the resolution of localhost. and names falling within .localhost. as special, and suggests that local resolvers SHOULD/MAY treat them specially. For better or worse, resolvers often ignore these suggestions, and will send localhost to the network for resolution in a number of circumstances.

Let 'localhost' be localhost
[DNSOP] DNSOP Call for Adoption - draft-west-let-localhost-be-localhost
  https://tools.ietf.org/html/draft-ietf-dnsop-let-localhost-be-localhost
  https://mailarchive.ietf.org/arch/msg/dnsop/eGn3kxRhoj1r4c-zHbE1_ozKq_k

bugzilla:
Stop treating 'localhost' as securely delivered for the purposes of Secure Contexts
  https://bugzilla.mozilla.org/show_bug.cgi?id=1346835
Consider hardcoding localhost names to the loopback address
  https://bugzilla.mozilla.org/show_bug.cgi?id=1220810#c23
Stop treating "http://localhost/" (by name) as mixed content
  https://bugzilla.mozilla.org/show_bug.cgi?id=1488740
chromium
Intent to Implement and Ship: Treat http://localhost as a secure context
  https://groups.google.com/a/chromium.org/forum/#!topic/blink-dev/RC9dSw-O3fE/discussion
Issue 589141: *.localhost should be considered secure
  https://bugs.chromium.org/p/chromium/issues/detail?id=589141
go-ipfs
localhost subdomains do not work on Firefox and Safari
  https://github.com/ipfs/go-ipfs/issues/7527







  this https://en.wikipedia.org/wiki/Proxy_auto-config

I found it via https://github.com/KishanBagaria/frwrd





























# feat: *.localhost subdomain gateway support with http proxy

  http://127.0.0.1:8080/ipns/en.wikipedia-on-ipfs.org/wiki/
to:

http://en.wikipedia-on-ipfs.org.ipns.localhost:8080/ipns/wiki/


  Why?
localhost subdomain gateway provides unique Origin per content root
this is extremely important



  They key challenge was to ensure *.localhost DNS names resolve to 127.0.0.1 on all platforms, specifically Linux distribution which ship with very basic DNS resolver that returns "not found" when trying to resolve localhost subdomains.

Browsers are moving in the direction of hardcoding localhost names to loopback interface, but we are not there yet. We need to solve this problem with tools at hand.

We do that by setting up HTTP Gateway port of local go-ipfs to act as HTTP Proxy. This removes DNS lookup step from the browser, and go-ipfs ships with implicit support for subdomain gateway when request comes with "Host: .ipfs.localhost:8080" or
similar.

We register HTTP proxy using Firefox and Chromium-specific APIs, but the end result is the same. When enables, default gateway uses 'localhost' hostname (subdomain gateway) instead of '127.0.0.1' (path gateway) and every path-pased request gets redirected to subdomain by go-ipfs itself, which decreases complexity on browser extension side.



  proxy situation is temporary and will change over time
Chromium does not need proxy, they hardcode localhost and *.localhost to loopback IPs
Firefox needs proxy until https://bugzilla.mozilla.org/show_bug.cgi?id=1220810 lands





  Firefox 74 does not mark *.localhost subdomains as Secure Context yet
(https://bugzilla.mozilla.org/show_bug.cgi?id=1220810#c23) so we can't redirect
there when we have IPFS resource embedded on HTTPS page (eg. image loaded from
a public gateway) because that would cause mixed-content warning and
subresource would fail to load. Given the fact that localhost/ipfs/* provided
by go-ipfs 0.5+ returns a redirect to *.ipfs.localhost subdomain we need to
check requests for subresources, and manually replace localhost hostname with
127.0.0.1 (IP is hardcoded as Secure Context in Firefox). The need for this
workaround can be revisited when Firefox closes mentioned bug.

Chromium 80 seems to force HTTPS in the final URL (after all redirects) so
https://*.localhost fails. This needs additional research (could be a bug in
Chromium). For now we reuse the same workaround as Firefox.

To unify use of 127.0.0.1 and localhost in address bar (eg. when user opens an
image in a new tab etc) when Subdomain Proxy is enabled we normalize address
bar requests made to the local gateway and replace raw IP with 'localhost'
hostname to take advantage of subdomain redirect provided by go-ipfs >= 0.5

In other news:

Added a bunch of tests, all green now.
In the meantime I noticed Chrome does not require proxy mode because they already hardcode localhost to raw IP. I am considering removing proxy permission from Chromium package as it may trigger yet another manual review at Chrome Web Store.
Will keep the code commented out in case we need to enable it in the future for some reason.










  # feat: gateway subdomains + http proxy mode




  What does this do?

Any HTTP CONNECT (proxy) requests will be looped backed to the gateway. This means a browser can, e.g., proxy http://ipfs.io/ipfs/... to the local gateway without redirecting (or touching the URL bar).
IPFS can handle CIDs in subdomains. That is, http://CID.ipfs.localhost:8080.


  Localhost
IIUC there is a golden path for localhost:

Support <cid>.<ns>.localhost out of the box
(localhost as a permanent, implicit entry on Gateway.SubdomainHosts)
requests to localhost hostname (without subdomain) need to be redirected to 127.0.0.1 (same path, but on raw IP). This will ensure the Origin(s) of Path and Subdomain gateways on a local machine are separate (and users can have both!)




