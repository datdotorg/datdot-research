





Consider a resources Origin:

Origins are the fundamental currency of the Web's security model. Two actors in the Web platform that share an origin are assumed to trust each other and to have the same authority. Actors with differing origins are considered potentially hostile versus each other, and are isolated from each other to varying degrees.

https://html.spec.whatwg.org/multipage/origin.html#origin




Of note, an origin is either

A scheme, host, and port of the parsed "network scheme" URL, one of [http, https, ftp] spec.
or an opaque origin, a unique implementation specific identifier for a non-network url e.g. a data: url

https://fetch.spec.whatwg.org/#network-scheme

If we can get hash style addresses to be treated as opaque origins with stable identifiers per CID, that could offer a less complicated path for implementors.






Then consider Secure Contexts

A secure context is a Window or Worker for which there is reasonable confidence that the content has been delivered securely (via HTTPS/TLS), and for which the potential for communication with contexts that are not secure is limited. Many Web APIs and features are only accessible in a secure context. The primary goal of secure contexts is to prevent man-in-the-middle attackers from accessing powerful APIs that could further compromise the victim of an attack.

https://developer.mozilla.org/en-US/docs/Web/Security/Secure_Contexts
The most obvious of the requirements discussed here is that application code with access to sensitive or private data be delivered confidentially over authenticated channels that guarantee data integrity. Delivering code securely cannot ensure that an application will always meet a user’s security and privacy requirements, but it is a necessary precondition.

https://w3c.github.io/webappsec-secure-contexts/



Without the blessing of a SecureContext, content loaded via new protocols doesn't get access to new apis like WebCrypto #8 and going forwards, Firefox is demanding SecureContexts for all new apis https://blog.mozilla.org/security/2018/01/15/secure-contexts-everywhere/



--------------------------------------------------------

**GOLDEN PATH**
Localhost
IIUC there is a golden path for localhost:

Support `<cid>.<ns>.localhost` out of the box
(localhost as a permanent, implicit entry on Gateway.SubdomainHosts)
requests to localhost hostname (without subdomain) need to be redirected to 127.0.0.1 (same path, but on raw IP).
This will ensure the Origin(s) of Path and Subdomain gateways on a local machine are separate
(and users can have both!)






**DATA URLS**
https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/Data_URIs



# ORIGIN in HYPER/DAT/DATDOT

**Control how content origin is determined**

Content addressing replaces the notion of a content "origin"
with a trustless, p2p integrity checking,
so you can reliably fetch content from any and all peers
that have it


 Domains as the content origin are a core assumption used
 in the browser security model


 We need to define how Origin should be calculated for originless content addressed uris.

 e.g.

A) Ability to register custom protocol handler (to make this example generic let's call it "foo://")

B) Opening "foo://origin/path/to/resource" loads HTTP(S) resource from "https://httpgateway/foo/origin/path/to/resource" but with two caveats:

1.
=> "origin" as the Origin (this is crucial, so that cookies, local storage
    etc is the same no matter which "httpgateway" is used).

=> Ideally, it would be great if we could specify which URL segments
    are used for Origin computation, for example:

    Opening "bar://originprefix/origin/path/to/resource" loads HTTP(S) resource
    from "https://httpgateway/bar/originprefix/origin/path/to/resource"
    with "originprefix/origin" as Origin.

2.
B.2) Keeping canonical "foo://origin/path/to/resource" in Location Bar
(hiding underlying HTTP transport for improved user experience)

In short, keeping canonical address in Location Bar together with programmable Origin calculation would enable us to extend Firefox with new protocols in a way that provides great UX and is compatible with Origin-based security model.


## ORIGIN
Origins are the fundamental currency of the Web's security model. Two actors in the Web platform that share an origin are assumed to trust each other and to have the same authority.

Actors with differing origins are considered potentially hostile versus each other, and are isolated from each other to varying degrees.

https://html.spec.whatwg.org/multipage/origin.html#origin


An origin is either

A `scheme`, `host`, and `port` of the parsed "network scheme" URL,
one of [http, https, ftp] spec.

An `opaque` origin, a unique implementation specific identifier
for a non-network url e.g. a data: url

If we can get hash based addresses to be treated as
opaque origins with stable identifiers per hash, that'd work.

That might be easier than getting them added
to the list of network scheme urls.









# ORIGIN HACK IDEAS
```js
// The script there simply posts back an "Hello" message
// Obviously cross-origin here
const cross_origin_script_url = "https://greggman.github.io/doodles/test/ping-worker.js";

const worker_url = getWorkerURL( cross_origin_script_url );
const worker = new Worker( worker_url );
worker.onmessage = (evt) => console.log( evt.data );
URL.revokeObjectURL( worker_url );

// Returns a blob:// URL which points
// to a javascript file which will call
// importScripts with the given URL
function getWorkerURL( url ) {
  const content = `importScripts( "${ url }" );`;
  return URL.createObjectURL( new Blob( [ content ], { type: "text/javascript" } ) );
}
var blobUrl = URL.createObjectURL(blob);
var worker = new Worker(blobUrl)
worker.onerror = function (event) {
		event.preventDefault();
}


function testSameOrigin (url) {
	var loc = window.location;
	var a = document.createElement('a');
	a.href = url;
	return a.hostname === loc.hostname && a.port === loc.port && a.protocol === loc.protocol;
}

// ----------------------
// or
// ----------------------
var blob = new Blob(["some JavaScript code;"], { "type": 'application/javascript' });


const workerUrl = 'https://domain2.com/script.js';
const workerBlob = new Blob([
    'importScripts(' + JSON.stringify(workerUrl) + ')',
], {type: 'application/javascript'});
const blobUrl = window.URL.createObjectURL(workerBlob);
const worker = new Worker(blobUrl);
// ----------------------
// or
// ----------------------
function worker_function() {
    // all code here
}
// This is in case of normal worker start
// "window" is not defined in web worker
// so if you load this file directly using `new Worker`
// the worker code will still execute properly
if(window!=self)
  worker_function();
You then link it as normal <script src="...". And once the function is defined, you use this abomination of a code:

new Worker(URL.createObjectURL(new Blob(["("+worker_function.toString()+")()"], {type: 'text/javascript'})));
// AND
// I also noticed that, but stringify the variable to pass (json)
var json = JSON.stringify(xJsonArgs);
// and than pass like
new Worker(URL.createObjectURL(new Blob([(${xFunction.toString()})(${json})], { type: 'text/javascript' })));
// works for me. Thanks for your response.

// ----------------------
// or
// ----------------------
const myWorker = new Worker("data:application/x-javascript;base64,b25tZXNzYW...");



const worker = new Worker(`data:text/javascript;base64,${btoa(workerJs)}`)

function stopWorker() {
    w.terminate();
    w = undefined;
}




// see:
// https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/Data_URIs
```
BUT:
data uris and or blob techniques require to lessen your CSPs
(by adding a worker-src data: or blob: directive, for example)

there is a little example of how you can take advantage of importScripts inside a worker
to load another worker script hosted on another domain, without lessening your CSPs.


## OR

```js
The downside is that communication speeds (and data transfer speeds) do take a performance hit.

In short:

1. script.js appends iframe with src="//cdn.mydomain.com/iframe.html"
2. iframe.html on cdn.mydomain.com/iframe.html, executes new Worker("worker.js") and acts as a proxy
   * for message events from window and worker.postMessage (and the other way around).
3. script.js communicates with the worker using iframe.contentWindow.postMessage and the message event from window. (with the proper checks for the correct origin and worker identification for multiple workers)
4. speed app by passing MessageChannel instance between them

```










# CONTENT ORIGIN POLICIES


**Background**
The proposed use of ipfs/ at the root of addresses in the fs: namespace
like fs://ipfs/{content hash} conflicts with the single-domain content origin policy
that is central to the browser security model. This brings into question
the whole idea of a generic fs: namespace rather than ipfs:


**Option: include public key in the paths**
Dat for instance is free of this problem as they just use
dat://{public_key}/path/with/in so origin is what they want it to be.

**origin domains must be case-insensitive**

fs://ipfs/${CIDv0 or CIDv1 in any base}/path -> ipfs://${CIDv1 in base16 or base32}/path
fs://ipns/${CIDv0 or CIDv1 in any base}/path -> ipns://${CIDv1 in base16 or base32}/path
fs://ipld/${CIDv0 or CIDv1 in any base}/path -> ipld://${CIDv1 in base16 or base32}/path
ipfs://${CIDv0 or CIDv1 in any base}/path -> ipfs://${CIDv1 in base16 or base32}/path
ipns://${CIDv0 or CIDv1 in any base}/path -> ipns://${CIDv1 in base16 or base32}/path
ipld://${CIDv0 or CIDv1 in any base}/path -> ipld://${CIDv1 in base16 or base32}/path

**working**
fs, ipfs and ipns protocol handlers are added added to firefox.
fs protocol handler essentially just redirects to either ipfs or ipns as follows

fs://ipfs/${cid}/path/with-in/ -> ipfs://${cid_v1_base16}/path/with-in
fs:ipfs/${cid}/path/with-in/ -> ipfs://${cid_v1_base16}/path/with-in
fs:///ipfs/${cid}/path/with-in/ -> ipfs://${cid_v1_base16}/path/with-in
fs:/ipfs/${cid}/path/with-in/ -> ipfs://${cid_v1_base16}/path/with-in
fs://ipns/${cid}/path/with-in/ -> ipns://${cid_v1_base16}/path/with-in
fs:ipns/${cid}/path/with-in/ -> ipns://${cid_v1_base16}/path/with-in
fs:///ipns/${cid}/path/with-in/ -> ipns://${cid_v1_base16}/path/with-in
fs:/ipns/${cid}/path/with-in/ -> ipns://${cid_v1_base16}/path/with-in

both ipfs and ipns protocol handlers redirect to corresponding base16 encoded CID path

ipfs://${cid_v0_base58}/path/with-in -> ipfs://${cid_v1_base16}/path/with-in
ipfs:/${cid_v0_base58}/path/with-in -> ipfs://${cid_v1_base16}/path/with-in
ipfs:///${cid_v0_base58}/path/with-in -> ipfs://${cid_v1_base16}/path/with-in
ipfs:${cid_v0_base58}/path/with-in -> ipfs://${cid_v1_base16}/path/with-in

ipfs://${cid_v1}/path/with-in -> ipfs://${cid_v1_base16}/path/with-in
ipfs:/${cid_v1}/path/with-in -> ipfs://${cid_v1_base16}/path/with-in
ipfs:///${cid_v1}/path/with-in -> ipfs://${cid_v1_base16}/path/with-in
ipfs:${cid_v1}/path/with-in -> ipfs://${cid_v1_base16}/path/with-in


ipfs://${cid_v1_base16}/path/with-in => localhost:8080/ipfs/${cid_v0_base58}/path/with-in
ipns://${cid_v1_base16}/path/with-in => localhost:8080/ipns/${cid_v0_base58}/path/with-in

In a consequence to all the redirects everything works under (what I assume to be) desired origin policy
where it’s either ipfs://${cid_v1_base16}/ or ipfs://${cid_v1_base16}/ respectively.



From what I understand, the mapping to a whatwg-compatible URL with an origin happens purely internally,
within the fs: protocol handler? If so, we can retain the whole path, and still construct the host from it.

fs:/ipfs/$cid/path/with-in  =>  fs://$cid16/ipfs/$cid/path/with-in
(fs:/ipfs/hash and fs:/ipns/hash would generate the same origin, but that is okay I think.)


----

If the redirect is purely internal, we should go with fs://$cid16/ipfs/$cid/path/with-in, where $cid16 is only used to have an appropriate origin, but is ignored when it comes to reading the path. It's verbose, but that's okay if it's not visible. It keeps the path consistent which would be a great win.

If the redirect is visible, we should go with ipfs://$cid16/path/with-in (same for ipns://). It's less verbose. ("We can work on unifying the fs-db-web rift later." -- jbenet).

Hash needs to be base32 encoded, because URL hosts are case-insensitive.
Solution 1/2: Needs a redirect to the base32 hash when pasting any non-base32 hashes.
Solution 2/2: Probably needs a special base32 CID that retains information about the original non-base32 CID, so that we can avoid confusing UX around changing hashes.



# A Possible Solution:
Instead of having the user call a gateway server to retrieve an ipfs file, the website server should serve it directly. This would work as follows:

    [...]

    <head>
      <meta name="ipfs-folder" content="/static/ipfs/" />
    </head>

    [...]

    <img src='/static/ipfs/QmdhTuX4V4uAUKotFTFpeHDEkSDvWVGfsvqT5EwtmtnPUW' />

# So:

If the website user doesn't have ipfs or the gateway add-on, they simply retrieve /static/ipfs/Qmdh[...]PUW from the website. This would be the image file located in the /static/ipfs/ folder on the website's server.

If they have ipfs and the gateway add-on, the add-on would first notice the meta tag and remember the given folder path. The add-on looks then for urls on the webpage which match the following pattern (assuming our website is example.com):

  http://example.com/[Ipfs Folder]/[Ipfs Hash]
So in this case:

  http://example.com/static/ipfs/[Ipfs Hash]
The add-on blocks the browser's request for that file, and instead retrieve it from ipfs with the given hash.

Result: No gateway got bothered during the transaction, and it would work for both regular web and ipfs users.



----------oR

I have different idea: use web+fs:/ipfs/Qm...AAA links but check if those links are handled using JS (easy request for an empty directory hash). If they are not handled register local handler that would translate those requests into HTTP requests.


-----------

The Single-origin Policy is a central pillar of the browser security model. Its based on the assumption of http, a centralized protocol, meaning that content's identity (and therefore security) is bound to the location its being retrieved from.

Related:

CSRF
CORS
JSON-P
web sockets
Cross Document messaging




################################
ORIGIN DEFINITION:

https://github.com/arewedistributedyet/arewedistributedyet/issues/6#issuecomment-378995230




