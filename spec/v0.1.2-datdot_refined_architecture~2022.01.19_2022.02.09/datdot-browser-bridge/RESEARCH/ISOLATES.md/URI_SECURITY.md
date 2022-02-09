# ORIGIN ISOLATION
https://en.wikipedia.org/wiki/Same-origin_policy

**URLs**
1. because some user agents force lower case for authority part of URLs
2. DNS label length is limited to 63 characters (RFC 1034)
=>
* host names have to be case-insensitive in subdomain context
  * e.g. encode hash or key data with `Base32` or `Base36`
  * Base32 can eliminate look-alike characters and are faster to calculate
  * Base36 can be used for longer ED25519 keys if necessary



**PATH**
Request for a content path sent to the gateway domain will return an HTTP 301 redirect
to a correct subdomain version, taking care of any necessary encoding conversion if needed:

`https://<gateway-host>.tld/ipfs/<cid>` -> `https://<cidv1>.ipfs.<gateway-host>.tld/`
To illustrate, opening the CIDv0 resource at https://dweb.link/ipfs/QmT5NvUtoM5nWFfrQdVrFtvGfKFmG7AHE8P34isapyhCxX/wiki/Mars.html(opens new window)
returns a redirect to a CIDv1 representation at https://bafybeicgmdpvw4duutrmdxl4a7gc52sxyuk7nz5gby77afwdteh3jc5bqa.ipfs.dweb.link/wiki/Mars.html (opens new window).

The gateway takes care of protocol address compliant requests



# GATEWAY DOMAIN
Path
`https://{gateway URL}/ipfs/{content ID}/{optional path to resource}`


**SUBDOMAIN**
Subdomain resolution style maintains compliance with the single-origin policy
The canonical form of access, https://{CID}.ipfs.{gatewayURL}/{optional path to resource},
causes the browser to interpret each returned file as being from a different origin.

**special-use top level domain**
e.g. `.onion` https://en.wikipedia.org/wiki/.onion

```js
const CIDb32crockford           = "123125qwrqwrqw" // = CONTENT ID
const gateway_host              = "localhost:8080"
  // CONSIDER:
  // ==> links shared which use a specific gateway_host are broken for others, unless maybe localhost!
  // ==> but still broken for people who use not localhost or are not in that adoption phase yet
const regular_host              = "example.com"
const optional_path_to_resource = "/foo/bar/baz.json"

use DNS resolver : `https://${regular_host}${optional_path_to_resource}` // [STANDARD]
                    // + supports cross-origin security
                    // + supports cross-origin resource sharing
                    // – requires DNS update to propagate change to root content
                    // • DNSLink, not user/app, specifies the gateway to use,
                    //   opening up potential gateway trust and congestion issues
get content      : `https://${gateway_host}/${CIDb32crockford}.dat${optional_path_to_resource}`
                   // vs.
get content      : `https://${gateway_host}/dat/${CIDb32crockford}${optional_path_to_resource}` // [STANDARD]
resolve + content: `https://${gateway_host}/${regular_host}.dat${optional_path_to_resource}`

resolve + content: `https://${gateway_host}/dat/${regular_host}${optional_path_to_resource}` // [STANDARD]
                    // ALL "pathname" REQUESTS sent to gateway domain
                    // => will return "HTTP 301 redirect" to correct SUBDOMAIN VERSION (+necessary encoding)
                    // e.g.
                    `https://<gateway-host>.tld/ipfs/<cid>`/*  =>  */`https://<cidv1>.ipfs.<gateway-host>.tld/`
get content      : `https://${CIDb32crockford}.dat.${gateway_host}${optional_path_to_resource}` //  [STANDARD]
                    // example:
                    `https://bafybeiemxf5abjwjbikoz4mc3a3dla6ual3jsgpdr4cjr3oz3evfyavhwq.dat.dweb.link/wiki/`
                    `https://bafybeiemxf5abjwjbikoz4mc3a3dla6ual3jsgpdr4cjr3oz3evfyavhwq.dat.cf-ipfs.com/wiki/Vincent_van_Gogh.html`
                    `https://bafybeiemxf5abjwjbikoz4mc3a3dla6ual3jsgpdr4cjr3oz3evfyavhwq.ipfs.localhost:8080/wiki/`
                    // + supports cross-origin security
                    // + supports cross-origin resource sharing
                    // + suitable for both domain IPNS names ({domain.tld}) and hash IPNS names
```

**QUESTIONS:**
1. is link sharable?
2. does link provide origin-isolation?
3. ...



Since these addresses aren’t URLs, using them in a web browser requires reformatting them slightly:
Through the HTTP gateway, as http://<gateway host>/<IFPS address>
Through the gateway subdomain (more secure, harder to set up): http://<cid>.ipfs.<gateway host>/<path>,
  so the protocol and CID are subdomains.
Through custom URL protocols like ipfs://<CID>/<path>, ipns://<peer ID>/<path>, and dweb://<IFPS address>
