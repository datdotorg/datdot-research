# CORS

a https website cannot embed an http website iframe
a secure context website cannot embed an insecure http website iframe

https://developer.mozilla.org/en-US/docs/Web/Security/Same-origin_policy#cross-origin_network_access




# CORS
-----------------
ServiceWorkers are able to make requests according to the same security restrictions as a page.
So, they can make a x-origin request (xhr, importScripts or fetch) the same as the page,
but the response will restricted in the same way it would be in the regular page – CORS headers and CSPs apply.

x-origin request (xhr, importScripts or fetch)
=>
response will restricted (CORS Headers + CSPs apply)
