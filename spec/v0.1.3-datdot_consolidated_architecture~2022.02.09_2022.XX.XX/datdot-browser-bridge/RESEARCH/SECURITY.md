// ------------------------------------
// SECURITY MODEL:
// * Trust OS + WEBVIEW + SYSTEM ORIGIN
// * ORIGIN ISOLATION SANDBOX
// ------------------------------------
Standard Browser Security Model based on Origin
https://developer.mozilla.org/en-US/docs/Web/Security/Same-origin_policy
https://en.wikipedia.org/wiki/Same-origin_policy

Motivation
Websites loaded via path gateway are able to access cookies and storage of the entire domain. While we are moving to subdomain gateways (#89), requests made to path gateways will continue to lack origin isolation between content roots. Some will be redirected to subdomain ones, but we should look into other means of improving the situation.

TL;DR
subdomain gateways will provide Origin isolation
path gateways do not
Various headers can be leveraged for limiting what can be used on the origin of path gateway.

Gateways without origin isolation are now marked with warning sign, indicating they are not safe for use cases that require origin isolation.

disable local storage, cookies and some Web APIs on the path gateway in the near future
see: https://github.com/ipfs/in-web-browsers/issues/157

=> effectively forcing use of subdomain gateways in situations where a dapp or website requires credentials, local storage persistence and/or access to web APIs.

https://developer.mozilla.org/en-US/Add-ons/WebExtensions/manifest.json/content_security_policy
https://developer.mozilla.org/en-US/Add-ons/WebExtensions/Content_Security_Policy

"The only permitted schemes for sources are: blob:, filesystem:, moz-extension:, and https:." and "Firefox does not support: "http://127.0.0.1" or "http://localhost" as script sources: they must be served over HTTPS."

simplifies online, cors and origin checks
* https://github.com/ipfs/public-gateway-checker/blob/5219784be96b1d253419de059044dced0b0a38cb/app.js
* https://github.com/ipfs/public-gateway-checker/blob/5219784be96b1d253419de059044dced0b0a38cb/index.html
* https://github.com/ipfs/public-gateway-checker/blob/5219784be96b1d253419de059044dced0b0a38cb/styles.css
* UI inspiration: https://github.com/ipfs/public-gateway-checker/pull/151#issuecomment-857204414

When we talk about loading the root HTML document into a web browser, and expecting it to use storage/apis provided by the browser, then only subdomain gateways are "secure".

However, if you want to load non-HTML type of content (images, videos, pdf documents) then a path gateway is fine, as it does not require origin isolation.

ALPHA -> BETA
Note: A lot of these security concerns are the things preventing us from putting out a 1.0 of datdot. We know these things need to be addressed in order for us to say "datdot is no longer alpha". Until then, datdot is alpha software.



https://github.com/ipfs-inactive/ipfs-postmsg-proxy#caveats
https://www.npmjs.com/package/realistic-structured-clone



===========================


SECURITY:

(currently, the best we can do to prevent malicious updates is have an application self-destruct: if an unexpected update is detected, private keys and other sensitive data is destroyed. This at least means that attackers will not be motivated by profit, but does not exclude attackers motivated by spite)

https://github.com/arewedistributedyet/arewedistributedyet/issues/22#issuecomment-411575056

When Service Worker updates, destroy all data .... OR ??? if its signed its ok?!?



CHECK and EXPERIMENT with:
see: https://github.com/arewedistributedyet/arewedistributedyet/issues/29

https://developer.mozilla.org/en-US/docs/Web/API/Credential_Management_API
https://developer.mozilla.org/en-US/docs/Web/API/CredentialsContainer/create

Something like: "sign this dat:// URL to say you're trusting it with something". Maybe it's how identities can be created.

