# SECURE CONTEXT
https://developer.mozilla.org/en-US/docs/Web/Security/Secure_Contexts
https://w3c.github.io/webappsec-secure-contexts/

https://en.wikipedia.org/wiki/Same-origin_policy


**FIREFOX**
* Firefox 84 marks http://*.localhost/ URLs as secure context
  * which means websites loaded from local subdomain gateway will have access to the same Web APIs as HTTPS version.




**CHROME**
  * work in progress to improve consistency and spec compliance regarding SECURE CONTEXT
  * work in progress to remove non-standard localhost names
  * https://chromestatus.com/feature/5698580851458048



---------------------

1. `localhost` should probably be used for user wallet
2. `127.0.0.1` is ugly so it can be used for KERNEL (and provided a separate origin)
3. `file urls` and `blob urls` or `data urls` should be used for apps in iframes

address like `127.0.0.1:8080/ipfs/xxxx` instead of `localhost:8080/ipfs/xxxx`


---------------------

## CERTS
Injection of self-signed certs is something we should never touch.
It is brittle, and often gets false-positive from antivirust/security software,
and it is hard to get removed from those badlists once your binary gets listed on them




# Summary
Distributed protocols require additional controls for how Origin-based security context is defined. Every content root identified by means of cryptographically-safe hash should have its own Origin and be marked as a Secure Context.

Current web application security model relies on the concept of same-origin policy. RFC 6454 defines the "Origin" of a URI as the triple {protocol, host, port}. Two resources are of the same Origin if all values from the triple are the same.

Web pages of different Origins are isolated from each other. Guarantees provided by this security perimeter enable web app developers to safely store site-specific data (local storage, cookies) and secrets (session cookies, access tokens) on user's machine.

Problem: In the distributed world a location (host and port) is no longer relevant. Resources are content-addressed and location authority is superseded by cryptographically-safe Content Identifiers (CIDs).

The only reliable way to work around this is to create artificial subdomains for hostname-safe HTTP content addressing using cryptographic hashes (eg. HSHCA). A subdomain provides a separate Origin which creates an isolated security context. Unfortunately, this approach obfuscates canonical representations of content-addressing and is not feasible for local p2p services listening on 127.0.0.1.

Historically, same-origin policies were extended to define roughly compatible security boundaries for other web technologies, such as Silverlight, Adobe Flash, or Adobe Acrobat. We aim to do the same for distributed web.

* https://en.wikipedia.org/wiki/Same-origin_policy
* hsca https://github.com/neocities/hshca


**Content-addressed resources as Secure Contexts**
https://blog.mozilla.org/security/2018/01/15/secure-contexts-everywhere/
https://developer.mozilla.org/en-US/docs/Web/Security/Secure_Contexts

Some of browser vendors pledged to require secure contexts for all new features.

A secure context is a Window or Worker for which there is reasonable confidence that the content has been delivered securely (via HTTPS/TLS) [..] The primary goal of secure contexts is to prevent man-in-the-middle attackers from accessing powerful APIs that could further compromise the victim of an attack. – MDN web docs

Content addressable resources provide higher security than HTTPS/TLS (which relies on centralized DNS and PKI infrastructures). Resources loaded over distributed protocols such as IPFS are adressed using a verifiable cryptographic hash of the requested data. It allows for trustless serving of web sites.


Status
W3C
Suborigin spec: W3C Editor's draft, Working Group Repo
https://w3c.github.io/webappsec-suborigins/
https://github.com/w3c/webappsec-suborigins
Secure Context spec: W3C Secure Contexts
https://w3c.github.io/webappsec-secure-contexts/
Brave: ?
Beaker: ?
Chromium: Suborigin: Bug #555117, Bug #580320
https://bugs.chromium.org/p/chromium/issues/detail?id=555117
https://bugs.chromium.org/p/chromium/issues/detail?id=580320
Edge: ?
Firefox: Suborigin: Bug #1231225, Bug #1391251
https://bugzilla.mozilla.org/show_bug.cgi?id=1231225
https://bugzilla.mozilla.org/show_bug.cgi?id=1391251
Safari: ?







## SECURE CONTEXTS
A secure context is a Window or Worker for which there is reasonable confidence that the content has been delivered securely (via HTTPS/TLS), and for which the potential for communication with contexts that are not secure is limited. Many Web APIs and features are only accessible in a secure context. The primary goal of secure contexts is to prevent man-in-the-middle attackers from accessing powerful APIs that could further compromise the victim of an attack.

https://developer.mozilla.org/en-US/docs/Web/Security/Secure_Contexts

The most obvious of the requirements discussed here is that application code with access to sensitive or private data be delivered confidentially over authenticated channels that guarantee data integrity. Delivering code securely cannot ensure that an application will always meet a user’s security and privacy requirements, but it is a necessary precondition.

https://w3c.github.io/webappsec-secure-contexts/


Related to origin but a separate issue, it would be appropriate to flag content-addressed files as a Secure Context, as their content can be validated from their address, an essential property of content-addressing. The browser would have to trust that the provider (e.g ipfs daemon) has ensured that the content received was valid before passing it on.
* Without he blessing of a SecureContext, content loaded via new protocols doesn't get access to new apis like WebCrypto
  * https://github.com/arewedistributedyet/arewedistributedyet/issues/8
  * https://github.com/w3c/webcrypto/issues/73#issuecomment-769602406
* and going forwards, Firefox is demanding SecureContexts for all new apis
  * https://blog.mozilla.org/security/2018/01/15/secure-contexts-everywhere/

https://github.com/arewedistributedyet/arewedistributedyet/blob/master/content/control-origin-security-context.md


HARDCODED LIST OF SECURE CONTEXTS:
https://github.com/mozilla/gecko-dev/blob/3511d14f465640a6990e9629ef97dfcadc32e484/dom/security/nsContentSecurityManager.cpp#L848-L942

 // The following implements:
  // https://w3c.github.io/webappsec-secure-contexts/#is-origin-trustworthy

// Blobs are expected to inherit their principal so we don't expect to have
// a codebase principal with scheme 'blob' here.  We can't assert that though
// since someone could mess with a non-blob URI to give it that scheme.
NS_WARNING_ASSERTION(!scheme.EqualsLiteral("blob"), "IsOriginPotentiallyTrustworthy ignoring blob scheme");

// According to the specification, the user agent may choose to extend the
// trust to other, vendor-specific URL schemes. We use this for "resource:",
// which is technically a substituting protocol handler that is not limited to
// local resource mapping, but in practice is never mapped remotely as this
// would violate assumptions a lot of code makes.

  if (scheme.EqualsLiteral("https") ||
      scheme.EqualsLiteral("file") ||
      scheme.EqualsLiteral("resource") ||
      scheme.EqualsLiteral("app") ||
      scheme.EqualsLiteral("moz-extension") ||
      scheme.EqualsLiteral("wss")) {
    *aIsTrustWorthy = true;
    return NS_OK;
  }

  if (host.EqualsLiteral("127.0.0.1") ||
      host.EqualsLiteral("localhost") ||
      host.EqualsLiteral("::1")) {
    *aIsTrustWorthy = true;
    return NS_OK;
  }



https://bugzilla.mozilla.org/show_bug.cgi?id=1328695
Turns out there is a bug 1328695 that says "isOriginPotentiallyTrustworthy should consider URI Flags" and as far as I can tell from the attached changes it adds URI_SAFE_TO_LOAD_IN_SECURE_CONTEXT flag that is then used in isOriginPotentiallyTrustworthy implementation instead of hard-coded protocol schema list. Which is exactly what we'd need to enable isSecureContext in the custom protocol implementations.

https://github.com/mozilla/gecko-dev/blob/master/netwerk/base/nsIChannel.idl#L86-L97


BUG: https://github.com/mozilla/libdweb/issues/2#issuecomment-391165836
// => https://github.com/mozilla/libdweb/commit/5751026af0f7d70add0ae9fb33442e2419861734


