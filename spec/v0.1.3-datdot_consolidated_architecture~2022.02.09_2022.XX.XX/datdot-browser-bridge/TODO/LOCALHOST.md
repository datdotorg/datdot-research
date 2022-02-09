# LOCALHOST

https://developer.mozilla.org/en-US/docs/Web/Security/Mixed_content

This one is kind of Rube Goldberg machine, so I'll start with a bit of background information.

Mixed Content warning happens when a page loaded over HTTPS contains a resource (eg. image) that is loaded from insecure HTTP. Browser vendors recognized that loading content over unencrypted HTTP from the box browser is running on is a special case that provides similar security guarantees to HTTPS over the internet, so they whitelisted 127.0.0.1 and it no longer trigger the warning.

IPFS Companion defaults to using localhost instead of 127.0.0.1 To be more specific, if user enters gateway URL that includes 127.0.0.1 it will be replaced with hostname localhost.

The goal was to improve UX in Location Bar (localhost looks much better than raw IP), but it came with unexpected side effect regarding Mixed Content whitelisting implemented in Firefox and Chrome. It seems that browsers whitelisted 127.0.0.1 but not localhost, which still produces Mixed Content warning.

In our use case, the Mixed Content Warning is triggered when there is an IPFS resource on HTTPS page and ipfs-companion's redirect loads it from Local Gateway that has localhost in its URL.





**SUB ISSUE: webui, url localhost:5001/webui wrong #291**
when accessing webui via, "localhost:5001/webui", i land at the url but with port 8080.
so: http://127.0.0.1:8080/ipfs/hash/#/
instead of http://127.0.0.1:5001/ipfs/hash/#/
using go-ipfs 0.4.11 as systemservice with the ipfs companion extension 2.0.12

==>

This is because extension thinks 127.0.0.1 and localhost are different things.

What if we normalize 127.0.0.1 on saving preferences and always replace it with localhost ?
It improves the Location Bar a bit; looks less scary for non-technical users.


**TESTS**
https://pls.watch/#i=http://127.0.0.1:8080/ipfs/qmesm

Firefox: green padlock
Chrome: green padlock + "SECURE"


https://pls.watch/#i=http://localhost:8080/ipfs/qmesm

Firefox: grey padlock with warning
Chrome: no padlock, warning under (i) icon

For now, we need to decide what is more important:

keeping human-readable localhost in Location Bar at a cost of signaling that use of local IPFS gateway is somehow "not secure"
or

keeping "the green padlock" at a cost of going back to 127.0.0.1 in location bar.
Personally, I think "keeping the green padlock" is more important and we should go back and default to 127.0.0.1. Rationale: we can work with browser vendors to whitelist localhost and switch back to it at a later time, when it does not cause Mixed Content Warning.

I am usually biased towards security over UX, so would love to hear what others think before doing any changes.

References:

https://bugzilla.mozilla.org/show_bug.cgi?id=903966 (Firefox whitelists 127.0.0.1 since v55)
https://chromium.googlesource.com/chromium/src.git/+/130ee686fa00b617bfc001ceb3bb49782da2cb4e (Chrome whitelis 127.0.0.1 since v53)



CHANGED:  2019-10-02
For the record, this changed at some point and
https://pls.watch/#i=http://localhost:8080/ipfs/QmbWqxBEKC3P8tqsKc98xmWNzrzDtRLMiMPL8wBuTGsMnR now works in both Chrome 78 and Firefox 69 without mixed-content warnings:

=> We should flip normalization, as localhost looks much better than raw IP.



------------


.localhost is indeed the correct special-use TLD.
https://tools.ietf.org/html/rfc6761
https://www.iana.org/assignments/special-use-domain-names/special-use-domain-names.xhtml

As noted by @da2x, .localhost is a good-enough choice for local gateway that can work Today.
(in the future we could look into registering Special-Use *.dweb, similar to *.onion)



 (The purpose of HTTP Proxy here is to provide a vanity hostname for local gateway in a way that works across all platforms).

 As for picking a specific domain, .localhost seems to be the best candidate right now, but we are not forced to use it.

Especially if we are unable to convince browser vendors to make .localhost a Securi Context


'm good with either, as long we move in the right direction.

https://<cid>.ipfs.foobar.tld → http://<cid>.ipfs.localhost
https://<cid>.ipfs.foobar.tld → http://<cid>.ipfs.dweb.link
https://<cid>.ipfs.foobar.tld → http://<cid>.ipfs.dweb



  So would the companion redirect other domains to, e.g., .ipfs.localhost? SGTM.


  If user is required to configure proxy for his browser then he won't be able to use any other proxy (naked proxy or via a browser extension). E.g., user won't be able to use proxies/extensions aimed for bypassing censorship.

What would you say about another approach -- installing or configuring caching dns server on a client like, e.g., Dnsmasq? Is this approach worth it?



  HTTP proxy does not need to be global: browser extension is able to set proxy only for *.ipfs.localhost (chrome.proxy and browse.proxy APIs). The main benefit here is that browser extension is the only thing you need. Installing local DNS server also does the trick if you don't mind running on :80 or having :8080 in URL, but then value added on top of #6498 is pretty small. Custom DNS is yet another thing to run and setup, pretty invasive and just not practical for regular users.


  it will just have bit uglier URLs that include custom port. In systems where *.localhost does not resolve out of the box, custom DNS can be set up, just like you suggested.




  ======================================

  Requirements
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
If anyone has unconventional ideas, feel free to comment.



Candidates
*.localhost
Current status
lock – window.isSecureContext === true
anger – window.isSecureContext === false

Status	Firefox	Chrome
127.0.0.1	lock	lock
localhost	lock	lock
foo.bar.localhost	anger	lock




  References
https://w3c.github.io/webappsec-secure-contexts/#localhost:
Section 6.3 of [RFC6761] lays out the resolution of localhost. and names falling within .localhost. as special, and suggests that local resolvers SHOULD/MAY treat them specially. For better or worse, resolvers often ignore these suggestions, and will send localhost to the network for resolution in a number of circumstances.

Let 'localhost' be localhost
    * https://tools.ietf.org/html/draft-ietf-dnsop-let-localhost-be-localhost
[DNSOP] DNSOP Call for Adoption - draft-west-let-localhost-be-localhost
    * https://mailarchive.ietf.org/arch/msg/dnsop/eGn3kxRhoj1r4c-zHbE1_ozKq_k
bugzilla:
Stop treating 'localhost' as securely delivered for the purposes of Secure Contexts
  * https://bugzilla.mozilla.org/show_bug.cgi?id=1346835
Consider hardcoding localhost names to the loopback address
  * https://bugzilla.mozilla.org/show_bug.cgi?id=1220810#c23
Stop treating "http://localhost/" (by name) as mixed content
  * https://bugzilla.mozilla.org/show_bug.cgi?id=1488740
chromium
Intent to Implement and Ship: Treat http://localhost as a secure context
  * https://groups.google.com/a/chromium.org/forum/#!topic/blink-dev/RC9dSw-O3fE/discussion
Issue 589141: *.localhost should be considered secure
  * https://bugs.chromium.org/p/chromium/issues/detail?id=589141
go-ipfs
localhost subdomains do not work on Firefox and Safari
  * https://github.com/ipfs/go-ipfs/issues/7527





  Candidate: http://{fqdn}.ipns.localhost
Test URL: http://docs.ipfs.io.ipns.localhost:8080/ipns/docs.ipfs.io
Result:

Linux -1 (Works on a box with unbound, does not resolve on stock Debian)
Windows: ?
Mac: ?
  '





  **PAC**


  There are some occult tricks for browsers on mac and windows; you can do some automagic with this https://en.wikipedia.org/wiki/Proxy_auto-config

I found it via https://github.com/KishanBagaria/frwrd


  > [..] you can do some automagic with this https://en.wikipedia.org/wiki/Proxy_auto-config

Changing proxy setting globally is not a good idea, however Firefox provides browser.proxy API with a very interesting property:

> use the proxy.onRequest event listener to intercept web requests, and return an object that describes whether and how to proxy them.

This would enable us to use PAC-like processing only for IPFS requests.
(Right now we just redirect them)





  I think switching from 127.0.0.1 to ::1 where possible is the best we can do right now, given cross-platform constraints.

Having local gateway at ::1 looks less intimidating:








==============================================================

  **2019-10-01**


  Interesting development:
As of 2019-10 localhost (hostname) is a secure context in both Firefox and Chrome.

Caveat: Firefox does not include subdomains (foo.bar.localhost is not a secure context), but I posted our use case in related bug to match behavior from Chrome:
https://bugzilla.mozilla.org/show_bug.cgi?id=1433933#c6

There is also a discussion to skip DNS lookup for *.localhost (https://bugzilla.mozilla.org/show_bug.cgi?id=1220810) and hardcode it to loopback, which would make it work on all platforms, regardless of local DNS setup.

This makes *.localhost nearly ready for use (waiting for Firefox to match Chrome).
I updated the first post in this issue to reflect current status.

Demo
Loaded http://en.wikipedia-on-ipfs.org.ipfs.localhost:8080/ipns/en.wikipedia-on-ipfs.org/wiki/ today and Chrome marks it as secure context:






  **2020-07-09**


  Quick update (in the context of ipfs/go-ipfs#7527):

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




  **2020-09-21**

  Good news: Chromium officially locked *.localhost to loopback as per https://tools.ietf.org/html/draft-ietf-dnsop-let-localhost-be-localhost-02 partying_face

Details from https://bugs.chromium.org/p/chromium/issues/detail?id=589141#c15:

We addressed this in https://bugs.chromium.org/p/chromium/issues/detail?id=691930 but didn't close this bug. There, we locked *.localhost to loopback as per https://tools.ietf.org/html/draft-ietf-dnsop-let-localhost-be-localhost-02 (see https://source.chromium.org/chromium/chromium/src/+/master:net/dns/host_resolver_manager.cc;drc=25292af6cee762330490f47e79e09a071dc4b5a9;l=3091). This means that we also consider *.localhost secure (see https://source.chromium.org/chromium/chromium/src/+/master:services/network/public/cpp/is_potentially_trustworthy.cc;drc=c70af83bc44f6829277cdc3621e7015d6e0d7530;l=228).

This increases likelihood of other vendors to follow.

  https://bugzilla.mozilla.org/show_bug.cgi?id=1220810#c89





  **2020-10-27**


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


