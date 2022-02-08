# Act as HTTP PROXY for `http://<cidv1b32>.ipfs.localhost`

Problem
CID-in-subdomain creates Origin-based isolation if website is loaded from public gateway:

http://bafkreigh2akiscaildcqabsyg3dfr6chu3fgpregiymsck7e7aqa4s52zy.ipfs.dweb.link
..however we continue to have a single Origin for all websites loaded from local gateway:

http://127.0.0.1:8080/ipfs/bafkreigh2akiscaildcqabsyg3dfr6chu3fgpregiymsck7e7aqa4s52zy/
This means use of local gateway decreases some of security guarantees web developers are used to, and removes some incentives to run local go-ipfs (and redirect to it via ipfs-companion).



Solution
What if go-ipfs could act as HTTP PROXY for requests made to http://*.ipfs.*/ and http://*.ipns.*/ ?

Having that, IPFS Companion could automatically set Gateway port as PROXY for requests to http://*.ipfs.localhost, which would create very nice URLs for local gateway, solving the Origin problem for local go-ipfs ok_hand




Initial look at technical feasibility
My hope is that we could keep changes to minimum and reuse Gateway port to also act as HTTP PROXY for requests to *.ipfs.localhost.

In other words, in addition to regular HTTP GET:

$  curl -v 'http://127.0.0.1:8080/ipfs/bafkreigh2akiscaildcqabsyg3dfr6chu3fgpregiymsck7e7aqa4s52zy/'
> GET /ipfs/bafybeie5gq4jxvzmsym6hjlwxej4rwdoxt7wadqvmmwbqi7r27fclha2va HTTP/1.1
> Host: 127.0.0.1:8080
< HTTP/1.1 200 OK




Gateway port should also respond to PROXY requests:

$ curl -v --proxy 'http://127.0.0.1:8080' 'http://bafkreigh2akiscaildcqabsyg3dfr6chu3fgpregiymsck7e7aqa4s52zy.ipfs.localhost'
> GET http://bafkreigh2akiscaildcqabsyg3dfr6chu3fgpregiymsck7e7aqa4s52zy.ipfs.localhost/ HTTP/1.1
> Host: bafkreigh2akiscaildcqabsyg3dfr6chu3fgpregiymsck7e7aqa4s52zy.ipfs.localhost




AFAIK all HTTP PROXY needs to do is to support HTTP CONNECT Method (but I think some non-https proxies work even without it):

CONNECT bafkreigh2akiscaildcqabsyg3dfr6chu3fgpregiymsck7e7aqa4s52zy.ipfs.localhost:80 HTTP/1.1
Host: bafkreigh2akiscaildcqabsyg3dfr6chu3fgpregiymsck7e7aqa4s52zy.ipfs.localhost:80


https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods/CONNECT




















======================================







https://docs.ipfs.io/how-to/address-ipfs-on-web/#http-gateways

PSA: loudspeaker *.localhost subdomain gateway preview
I just shipped a preview of *.localhost subdomain gateway support (over http proxy to ensure it works on all platforms): v2.10.0.893

It redirects both DNSLink and public subdomain gateways to the local one by default

If you find anything that looks or behaves odd, let us know.
It is pretty significant change security and UX-wise, and I am sure there will be kinks to iron out.



**ISSUE**
We also can't just blindly swap 127.0.0.1 with localhost because localhost subdomains are not guaranteed to be enabled and work everywhere (ipfs/go-ipfs#7527)

Additional heuristic should be added in the place where gatewayUrl is read from node's config:

If gateway is 127.0.0.1:port
send GET request for `<knowncid>.ipfs.localhost:port` (eg. empty unixfs dir)
If response in HTTP 200, then subdomains work in current browser
replace 127.0.0.1:port with localhost:port in "View on IPFS Gateway"
We could have something similar if gateway is 0.0.0.0, then we replace it with window.location.hostname or replace both host and port with window.location.host
How does that sound?




## SUBDOMAINS `*.localhost`


CID as a Subdomain
* see: https://github.com/ipfs/in-web-browsers/issues/89
* https://github.com/lidel/specs/tree/dweb-addressing/dweb-addressing

* https://github.com/ipfs-shipyard/ipscend/issues/113
* https://github.com/ipfs/go-ipfs/issues/6498

* https://github.com/ipfs/go-ipfs/issues/5982

.localhost is indeed the correct special-use TLD.
https://tools.ietf.org/html/rfc6761
https://www.iana.org/assignments/special-use-domain-names/special-use-domain-names.xhtml

As noted by @da2x, .localhost is a good-enough choice for local gateway that can work Today.
(in the future we could look into registering Special-Use *.dweb, similar to *.onion)

However, in the proxy case, this would be a pretty big security issue: I'd be able to run arbitrary javascript on a subdomain of anyone's website. This can be used to mess with cookies (subdomains can set cookies that apply to the root domain).

Really, we need to:

Use a specific domain.
Add that domain to the "public suffix" list: https://publicsuffix.org/
Alternatively, we could always redirect to Qm.ipfs.localhost (although that doesn't completely fix the super-cookie issue).


sec: http proxy gateway won't be able to support HTTPS for arbitrary domains

Hm. Yeah, I forgot HTTP proxies can't do anything about this. What if we redirect? That is, what if the companion redirects https to http (when proxying is enabled)? Unfortunately, that has some UX issues (looks insecure).

ux: how can user know if they use local vs public gateway, if the hostname remains the same?

This is actually why I want this. The current redirect is annoying from a UX standpoint as localhost links won't "just work". If we're worried about telling the user that we're serving the resource from the local IPFS node, we can put something in the urlbar.

comment: https://github.com/ipfs/go-ipfs/issues/5982#issuecomment-468317888
So would the companion redirect other domains to, e.g., .ipfs.localhost? SGTM.
This specific domain should be configurable via ipfs config, to accommodate more than localhost use case.
That's basically what I was planning on doing. My objection was to:
What if go-ipfs could act as HTTP PROXY for requests made to http://*.ipfs.*/ and http://*.ipns.*/ ?
(i.e., having go-ipfs act as a blind proxy for these addresses).
=>
It's my fault, I made a mental shortcut while explaining the intent.
Just like you said, we will not do a blind proxy, browser extension will redirect to a specific domain. Proxy will only work for domain(s) specified in config. Everything else requested in proxy mode will get HTTP 400 Bad Request. Regular requests will work without any change.

ISSUE:
https://github.com/ipfs/go-ipfs/issues/5982#issuecomment-510774321



## support for subdomain gateways
running at *.localhost subdomains

TL;DR we will change the URL present in the address bar when user loads content from the local node (ipfs-desktop or standalone go-ipfs):

http://127.0.0.1:8080/ipns/en.wikipedia-on-ipfs.org/wiki/
to:
http://en.wikipedia-on-ipfs.org.ipns.localhost:8080/ipns/wiki/


**Why?**
localhost subdomain gateway provides unique Origin per content root

**How?**
Disclaimer: below is a draft of what may end up a blogpost after go-ipfs 0.5 ships. WIP.

They key challenge was to ensure *.localhost DNS names resolve to 127.0.0.1 on all platforms, specifically Linux distribution which ship with very basic DNS resolver that returns "not found" when trying to resolve localhost subdomains.

Browsers are moving in the direction of hardcoding localhost names to loopback interface, but we are not there yet. We need to solve this problem with tools at hand.

We do that by setting up HTTP Gateway port of local go-ipfs to act as HTTP Proxy. This removes DNS lookup step from the browser, and go-ipfs ships with implicit support for subdomain gateway when request comes with "Host: .ipfs.localhost:8080" or
similar.

We register HTTP proxy using Firefox and Chromium-specific APIs, but the end result is the same. When enables, default gateway uses 'localhost' hostname (subdomain gateway) instead of '127.0.0.1' (path gateway) and every path-pased request gets redirected to subdomain by go-ipfs itself, which decreases complexity on browser extension side.

**caveats**

match pattern used for registering proxy handler in Firefox uses localhost name without port. This is by design, match patterns do not seem to support ports and are executed on all of them. We need to check port inside of handler, and return direct proxy route if it does not match
proxy situation is temporary and will change over time
Chromium does not need proxy, they hardcode localhost and *.localhost to loopback IPs
Firefox needs proxy until https://bugzilla.mozilla.org/show_bug.cgi?id=1220810 lands


Surfacing some notes on additional fixes that had to be applies to keep subresource redirects
working on HTTPS websites:

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

In the meantime I noticed Chrome does not require proxy mode because they already hardcode localhost to raw IP. I am considering removing proxy permission from Chromium package as it may trigger yet another manual review at Chrome Web Store.
Will keep the code commented out in case we need to enable it in the future for some reason.


---------

Safari incorrect blocks localhost as mixed content when accessed from an HTTPS page (but allows it from HTTP!),
breaking use cases from Spotify to Ethereum:

https://bugs.webkit.org/show_bug.cgi?id=171934


## STATE July 2020 - (28.10.2021) https://github.com/ipfs/in-web-browsers/issues/109#issuecomment-954059579

**GENERAL STATUS:**

Since go-ipfs 0.5, when user runs local IPFS node, they can load websites and content via subdomains like this:

http://bafybeiemxf5abjwjbikoz4mc3a3dla6ual3jsgpdr4cjr3oz3evfyavhwq.ipfs.localhost:8080/wiki/
http://bafybeid6grcjmnvsdaeklremt2lcqk7jevbjtwrerzgq46nzxfgn5isrne.ipfs.localhost:8080/images/ipfs-logo.svg

There are two known problems with *.localhost at the moment:

If browser vendor does not hardcode localhost to point at loopback, then it is resolved by OS DNS resolver, and on some platforms that can produce error. Fix here is to implement section 6.3.3 from https://tools.ietf.org/html/rfc6761#section-6.3 (Chromium-based browsers already do this)

Content at *.localhost should be marked as Secure Context. Right now some vendors such as Firefox handle localhost and *.localhost differently, partially due to legacy code, partially due to my previous point.

Implementing "let localhost be localhost" (6.3.3 from rfc6761) would ensure localhost can resolve on every platform and can be marked as secure context – very likely solving both issues.

Vendors are mostly ok with this change:

Firefox/Gecko already is tracking this as part of https://bugzilla.mozilla.org/show_bug.cgi?id=1220810.
Safari/Webkit:
https://bugs.webkit.org/show_bug.cgi?id=171934
https://bugs.webkit.org/show_bug.cgi?id=160504
Unfortunately the movement on Safari and Firefox fronts to resolve it turned out to be slower than we expected. Looking into ways we can accelerate that.


===>

Good news: Chromium officially locked *.localhost to loopback as per https://tools.ietf.org/html/draft-ietf-dnsop-let-localhost-be-localhost-02 partying_face

Details from https://bugs.chromium.org/p/chromium/issues/detail?id=589141#c15:

We addressed this in https://bugs.chromium.org/p/chromium/issues/detail?id=691930 but didn't close this bug. There, we locked *.localhost to loopback as per https://tools.ietf.org/html/draft-ietf-dnsop-let-localhost-be-localhost-02 (see https://source.chromium.org/chromium/chromium/src/+/master:net/dns/host_resolver_manager.cc;drc=25292af6cee762330490f47e79e09a071dc4b5a9;l=3091). This means that we also consider *.localhost secure (see https://source.chromium.org/chromium/chromium/src/+/master:services/network/public/cpp/is_potentially_trustworthy.cc;drc=c70af83bc44f6829277cdc3621e7015d6e0d7530;l=228).

This increases likelihood of other vendors to follow.



BUT: https://bugzilla.mozilla.org/show_bug.cgi?id=1220810#c89



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

I get this error: I can access it from chrome but not my Golang program:

"http://zzz.ipfs.localhost:8080/1": dial tcp: lookup zzz.ipfs.localhost: no such host

localhost subdomains do not work on Firefox and Safari #7527
https://github.com/ipfs/go-ipfs/issues/7527



# localhost subdomains do not work on Firefox and Safari #7527