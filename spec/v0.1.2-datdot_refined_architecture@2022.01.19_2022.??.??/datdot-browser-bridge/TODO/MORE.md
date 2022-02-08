# feat: improved origin isolation check

simplifies online, cors and origin checks as much as one could have given the organically grown code in app.js

```js
// This tries to load iframe and talk to it over postMessage
// (tests CORS isolation)
/* TODO: decide if this is useful
function checkViaIframe (gateway) {
  const gwUrl = new URL(gateway)
  // now - ensures we don't read from browser cache
  // filename - ensures correct content-type is returned / sniffed
  // x-ipfs-companion-no-redirect - hint for our browser extension, makes sure we test remote server
  const now = Date.now()
  const iframePathUrl = new URL(`${gwUrl.protocol}//${gwUrl.hostname}/ipfs/${IFRAME_HASH}?now=${now}&filename=origin-check.html#x-ipfs-companion-no-redirect`)
  const iframeSubdomainUrl = new URL(`${gwUrl.protocol}//${IFRAME_HASH}.ipfs.${gwUrl.hostname}/?now=${now}&filename=origin-check.html#x-ipfs-companion-no-redirect`)
  const iframeCheckTimeout = 15000
  return new Promise((resolve, reject) => {
    const timeout = () => {
      if (!timer) return false
      clearTimeout(timer)
      timer = null
      return true
    }
    let timer = setTimeout(() => { if (timeout()) reject() }, iframeCheckTimeout)
    const iframe = document.createElement("iframe")
    iframe.src = iframePathUrl.toString()
    iframe.name = `iframe-${gwUrl.hostname}`
    iframe.style.display = 'none'
    document.body.appendChild(iframe)
    iframe.onerror = () => {
      timeout()
      reject()
    }
    iframe.onload = () => {
      window.addEventListener("message", (event) => {
        if (event.origin === iframeSubdomainUrl.origin) {
          console.log('checkViaIframe.event', event)
          timeout()
          resolve()
        }
      }, false)
      iframe.contentWindow.postMessage("hello there! is your origin correct?", iframeSubdomainUrl.origin)
    }
  })
}
*/
const check = function() {
// test by loading subresource via img.src (path will work on both old and subdomain gws)
const gwUrl = new URL(this.parent.gateway)
const imgPathUrl = new URL(`${gwUrl.protocol}//${gwUrl.hostname}/ipfs/${IMG_HASH}?now=${Date.now()}&filename=1x1.png#x-ipfs-companion-no-redirect`)
checkViaImgSrc(imgPathUrl).then((res) => {
    this.tag.textContent = '✅';
    this.parent.checked()
  }).catch(() => {
		// we check this because the gateway could be already checked by CORS before onerror executes
		// and, even though it is failing here, we know it is UP
		if (!this.up) {
			this.up = false;
			this.tag.textContent = '❌';
			this.parent.failed();
		}
  })
};
const checked = function() {
	this.up = true;
	this.tag.innerHTML = '✅';
  this.parent.tag.classList.add('online')
};
// for more se: https://github.com/ipfs/public-gateway-checker/blob/5219784be96b1d253419de059044dced0b0a38cb/app.js
```
If you don't know why Origin isolation matters, a good primer is at https://developer.mozilla.org/en-US/docs/Web/Security/Same-origin_policy



* FYSA we will disable local storage, cookies and some Web APIs on the path gateway in the near future
  * Websites loaded via path gateway are able to access cookies and storage of the entire domain.
  * path gateways will continue to lack origin isolation between content roots
  *

# Headers to investigate

**Clear-Site-Data header**
The Clear-Site-Data header clears browsing data (cookies, storage, cache) associated with the requesting website. It allows web developers to have more control over the data stored locally by a browser for their origins.
– https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Clear-Site-Data

We could leverage Clear-Site-Data header and send a hint to user agent to clear any preexisting cookies and storage. This is a "nuclear option", but could incentivize users to switch to subdomain gateways when access Web APIs relying on Origin is required.

To purge cookies and storage without reloading any contexts, below header would be returned with every response from /ipfs/{cid} and /ipns/{foo} paths:

Clear-Site-Data: "cookies", "storage"




**Content-Security-Policy**
Disabling JS and various security features.

Ref. https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy



Highlights:
sandbox directive may be the most elegant way, it would apply the same logic as <iframe> sandbox for entire page.
https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy/sandbox


@TODO: check via service worker response too!




Feature-Policy
Another way of disabling various APIs and behaviors

Ref. https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Feature-Policy

  Relaxing the same-origin restriction requires mutual opt-in from two websites. Still, it would not hurt if we explicitly disabled this via [Feature-Policy/document-domain](Ref. https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Feature-Policy/document-domain) (dweb.link is on https://publicsuffix.org/, but other gateways may not be)

  https://html.spec.whatwg.org/multipage/origin.html#relaxing-the-same-origin-restriction




Blocking cookies is a nuclear option that may break some deployments behind reverse proxies that pass all headers. We would need NoWebSecurity flag (false by default) in case someone really wants to disable things like Clear-Site-Data in contexts that provide no origin isolation.


  Something to be aware of: executionContexts and wildcard directives are not recognized by Chromium (bug-898503)
  https://crbug.com/898503



  Interesting fact: w3c spec suggests a discrepancy between clearing cookies and storage:
https://www.w3.org/TR/2017/WD-clear-site-data-20171130/#grammardef-storage
https://www.w3.org/TR/2017/WD-clear-site-data-20171130/#grammardef-cookies

According to the spec storage is supposed to be purged for origin, while cookies cleanup is listed as origin + all origins based on subdomains of the current one.

I tested behavior in Chromium 76 and Firefox 74 to see if it negatively impacts subdomain gateways in go-ipfs (ipfs/go-ipfs#6096). This does not seem to be the case: subdomain cookies are not purged if Clear-Site-Data is present in localhost/ipfs/$cid 301 response.





