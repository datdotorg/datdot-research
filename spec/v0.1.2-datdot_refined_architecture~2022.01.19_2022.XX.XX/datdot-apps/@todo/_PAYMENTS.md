```js
/*

APP DEVS:
1. should have a valuenetwork.json file
2. should allow users to stay in charge of their keypairs -> thus standardize to wallet

3. => use KERNEL METHOD to require/import/imports modules according to valuenetwork and fail if not specified
4. => use keypairs through vault mechanism
5. => request VAULT access from SYSTEM
6. => SYSTEM ask KERNEL for WALLET ACCESS in standard way


1. system and app can use `vault,use` to install applications
2. applications/modules use regular require/import to get more source code
3. require/import will be intercepted by kernel anyways and resolved to importmap/packagejson source
  * its up to app or module to use available "sub-vault" of parent app loaded through `vault.use(...)` to make more keypairs
  * its all under the control of the same developer who can lock down versions to hashes of specific modules
4. PAYMENTS:
  * each dependency has an address (e.g. github, npm) and can have a hyperdrive address too
  * it can contain a standardized extension (package.json?) config for each version to specify the current list of maintainers and payment info
    * a payment is an onchain transaction
    * any module can be chosen as a donation subscription target
    * payments trickles down based on package.json info
      * info is sourced via oracle resolving the package.json of other modules or using the onchain versions if already available
      * in the first phase, saving funds on chain for specific packages on github/npm and allow oracle calls to claim them
        * either through maintainers ssh key from github
        * or through publishind a hyperdrive address and then letting people submit a proof of ownership including their identity feed + github ssh signature



---------------------------------------
...how to make people install through datdot package manager?
...how to handle trickle down?
---------------------------------------
INSTALL:
1. KERNEL offers imports method
2. basically DATDOT SYSTEM uses KERNEL, but also understands DATDOT-SERVICE-NODE
  => gets KEYPAIR for it from WALLET
  ==> works like a WebHID Driver and connect to a datdot-node which runs somewhere
  ==> but can be bundled with KERNEL SHIMS (as extension that is not used)
  ==> but a datdot-system can try to connect and connects to a default localhost address if no alternative is provided

3. otherwise, if KERNEL SHIM, then WEB KERNEL needs to understand the "extra functionality"
  => WEB KERNEL will know HYPER to understand imports from hyper:// ...

* QUESTION:
  => but how to make datdot transaction on specific hyper imports and read valuenetwork.json or who would?

kernelvault.use('foobar', 'hyper://....') // gives it keypair
kernelvault.use('datdot', 'hyper://....') // gives it keypair

* PROBLEM:
datdot.use('beepboop', 'datdot://....') // internally uses hyper keypair
  => it might be able to fetch the other `valuenetworks.json` to figure out all dependencies
  => but then to load the content, it needs to go to the swarm to download the source
  ==> THATS OK, just use `vault.use('module', '<downloaded hyper address>')`
  ===> internally those modules will use `import` and the likes based on source and be constraint by the package.json of the root valuenetworks.json

{
  "name": "Dazaar card example",
  "description": "Highly valuable market data",
  "homepage": "https://example.com",
  "contact": "janedoe@example.com",
  "provider": "Jane Doe",
  "sellerKey": "dead...beef",
  "payment": [{
    "method": "ln",
    "currency": "LightningSats",
    "unit": "seconds",
    "interval": "600",
    "amount": "1000"
  }]
}
https://github.com/bitfinexcom/dazaar-payment-lightning
https://github.com/bitfinexcom/create-free-dazaar-core
https://github.com/bitfinexcom/dazaar-payment-eth
https://github.com/hyperdivision/dazaar-payment-tracker
https://github.com/bitfinexcom/dazaar

PROJECTS or PLANS
1. need to define a "max cap" of back flow (might include funding ...its like paying for a project so does not get taxed)
2. also needs to add a subscription duration ( by default valid until revoked )
TRICKLE DOWN:
1. chain transaction fees are real
2. fee gets burnt or user can select project donate subscriptions
3. to opt out, people has to make projects owned by them, but this will still be visible on chain

SEEDERS/HOSTERS:
* anyway keep a log and add all incoming connections and requests to it, because we have controllers coming
* => and this can cause penalties in reputation/status score based on which payments are distributed!

AUTHORS/PUBLISHERS:
* should define not only max. cap, but also percentage for them and for dependencies!
* link to their user/org profile(s)
---------------------------------------
*/
```