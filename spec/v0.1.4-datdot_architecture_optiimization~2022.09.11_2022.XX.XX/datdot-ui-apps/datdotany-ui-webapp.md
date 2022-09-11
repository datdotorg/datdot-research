# BACK
**[main](/README.md)**

# datdot-apps

## index.html
```html
<script>import('system.js')</script>
```

## system.js
```js
import 'webkernel.js'
boot(import.meta.url, function system (api) {
  // => request VAULT access from SYSTEM (and/or through SYSTEM)
  // => SYSTEM ask KERNEL for WALLET ACCESS in standard way

  // GET KEYPAIRS:
  // * should allow users to stay in charge of their keypairs
  // * -> thus standardize to wallet
  // * => use keypairs through vault mechanism

  console.log('ready')
  const { vault, use } = api
  // 1. system and app can use `vault,use` to install apps
  //    * => use KERNEL METHOD to require/import/imports modules
  //      according to valuenetwork and fail if not specified
  //
  // 2. apps/modules use require/import to get more source code
  // 3. require/import will be intercepted by kernel anyways
  //    and resolved to importmap/packagejson source
  //    * its up to app or module to use available "sub-vault"
  //      of parent app loaded through `vault.use(...)` to make
  //      more keypairs
  //    * its all under the control of the same developer who
  //      can lock down versions to hashes of specific modules
})
```


# `role` app dev
## `package.json
* maybe standardize a `manifest.json` inspired by web app manifest and similar standards
* contains config for each version to specify the current list of maintainers and payment info
* hyper address
  * each dependency has an address (e.g. github, npm) and can have a hyperdrive address too.
  * the hyperdrive address should be part of package.json
  * this can be verified on download from hypernet
  * this also changes the hash
```json
{
  "name": "my-app",
  "hyper": "...",
  "maintainers": [],
  "valuenetwork": {}
}
```
# payments
* a payment is an onchain transaction
* any module can be chosen as a `donation subscription` target
* payments trickles down based on package.json info
  * info is sourced via oracle resolving the package.json of other modules or using the onchain versions if already available
  * in the first phase, saving funds on chain for specific packages on github/npm and allow oracle calls to claim them
    * either through maintainers ssh key from github
    * or through publishind a hyperdrive address and then letting people submit a proof of ownership including their identity feed + github ssh signature

* [ ] ...how to make people install through datdot package manager?
* [ ] ...how to handle trickle down

-----------------------------------------------------------
