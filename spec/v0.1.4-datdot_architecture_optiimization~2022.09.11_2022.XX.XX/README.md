# DATDOT NODE SPEC

* **=> [previous spec](../v0.1.2-datdot_refined_architecture~2022.01.19_2022.02.09/)**
<!-- * **=> [next spec](#)** -->

## `@todo`
* [x] include details from previous spec (v0.1.1) in this version
  * [x] set architecture based on `CONCEPTS` folder evaluation and content of this file
* [x] merge/mark architecture process
* [x] cleanup the README and move all content in here to the modules it belongs to
  * [x] consolidate RESEARCH
  * [ ] update readme architecture summary
  * [ ] create local table of content by updating the one below to lini each architecture section in readme
  * [ ] add links to more details about each architecture section
  * [ ] add per research file todos
* [ ] write multiple pages with tests!
* [ ] name the local repo with the localhost servers to test against!
* [ ] ask ppl with windows and macOS to try it out
* [ ] test SAFARI:
  * [ ] no BroadcastChannel?
  * [ ] no SharedWorker?

## ARCHITECTURE - TABLE OF CONTENT
// @TODO: update this table of content
1. [shim](./datdot-shim/README.md)
  * electron
2. [gateway](./datdot-gateway/README.md)
  * daemon
3. [webkernel-server](./datdot-webkernel-server/README.md)
4. [vault](./datdot-vault/README.md)
5. [wallet](./datdot-wallet/README.md)
6. [datdot-ui-apps](./datdot-ui-apps)
  1. [ui-webapp](./datdot-ui-apps/datdot-ui-webapp/DATDOTAPP.md)
  2. [ui-org](./datdot-ui-apps/datdot-ui-org/DATDOTORGAPP.md)
  3. [app](./datdot-apps/datdot-ui-apps/datdpt-apps/APP.md)
7. [service (javascript hyper based)](./datdot-service/README.md)
  * [API](https://github.com/playproject-io/datdot-service/blob/master/index.js)
8. [chain (substrate node)](./datdot-chain-node/README.md)
  * => `datdot-node`
  * => `datdot-chain`
  * => `datdot-runtime`
    * [API](https://github.com/playproject-io/datdot-substrate/blob/master/bin/node/runtime/src/dat_verify.rs)
  * `/datdot-pallet-verify`
  * `datdot-pallet-balance`

// => make table of contents


-------------------------------------------------------------------------------

## ARCHITECTURE
// @TODO: update this architecture diagram with numbers for each table of content section
see [here](https://gist.github.com/substack/e037d1d2015b7a3e0001fc4bdd463b9c)
```js
const architecture = `
  [7. substrate chain daemon]
              ↑
              │
              ↓
  ┌────> [5. chain api] <───> [other chain implementations*]
  │
  │      [4. seeding_service api] <───> [kappa/hyper-core]
  │           ↑
  │           │
  │           │
  ├───────────┼─> [3. cloud/localhost https/wss server] <─────┐
  │           │                                               ↓
  │           │                                 [6. web user interface]
  │           │                                           ↑   ↑
  │           │     [2. datdot electron app] <────────────┘   │
  │           │                                               │
  │           │     [web browser] <───────────────────────────┘
  │           │
  └───────────┴───> [1. datdot command-line interface]



[substrate chain daemon]
          |
          v
 .--- [chain api] <--- [kappa-core/other chain implementations*]
 |        ^
 |        |
 |        v
 |   [seeding api]
 |        |
 |        |
 |        |
 |--------+---> [localhost https server] -------------.
 |        |                                           v
 |        |                                  [web user interface]
 |        |                                           ^
 |--------+---> [datdot electron app] ----------------'
 |        |
 '--------+---> [datdot command-line interface]


(*) possible future implementation
```




# architecture
// @TODO: design mermaid sequence diagram for different architecture parts
FLOW: https://raw.githubusercontent.com/Gozala/lunet/master/request-flow.svg
https://github.com/Gozala/lunet




------------------------------------------------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------------------------------------------------


LESEZEICHEN: // @TODO: ... 3

-------------------------------------------------------------------------------
# 0. `role` USER - install shom env (web server + web browser)
## GOALS
* USERS OWN THEIR DATA
* DATA AUTONOMY

### legacy web system user  VS. (shimmed) p2p web system user
=> receive link to any p2p web app running anywhere and open in legacy browser
=> then download and install p2p shim to restart into system  OR  use a trusted remote proxy to transition later
VS.
=> iPXE boot new laptop from old (shimmed) p2p web system iPXE server and restart into p2p system
VS.
=> open p2p web app in legacy browser on new legacy system running on (shimmed) p2p web system server
=> then download and install p2p shim to restart into system

```js
/******************************************************************************
ARCHITECTURE ENVIRONMENTS + SETUP/STARTUP PROCESS PROTOCOLS:

// @NOTE:
// 1. This process starts with INSTALLATION
// 2. At some point later the scenario is "external device client" (no wallet + no vault)
// 3. this will offer dowload, which will then offer INSTALLATION (as seen below)
// ----------------------------
1. INSTALLATION
// ----------------------------
1. execute setup/startup protocol phases
// --------------------------------------------------------
// A: NATIVE (datdot) OS: (on bare metal HARDWARE)
// --------------------------------------------------------
1. [user] runs "iPXE Server" with "boot image" and prepares "provision config"
2. [user] optionally creates (boot helper via USB stick) gPXE or PXE ROM to server
3. [user] triggers install by pointing bare metal system to iPXE server (maybe via USB stick)
4. [bios] download image and boots and installs it
5. [bios] download provisioning config to customize system
6. [bios] pull in user data
7. [bios] reboot and start system into `system` in webview from web(system/kernel)server
8. => SETUP & CONFIGURATION
// --------------------------------------------------------
// B: SHIMMED DESKTOP (datdot) OS:
// --------------------------------------------------------
1. visit "system" page on legacy OS in legacy browser
2. download and install "datdot electron app"
3. auto(refresh) "system page" in browser from local webserver
4. => SETUP & CONFIGURATION
// --------------------------------------------------------
// C: APP TAB / TERMINAL (same device external (=cross-site) client)
// --------------------------------------------------------
1.
4. => SETUP & CONFIGURATION
// --------------------------------------------------------
// D: MOBILE BROWSER / TERMUX (different device external client)
// --------------------------------------------------------
1.
4. => SETUP & CONFIGURATION
*******************************************************************************
=> RESULTS:
// OS (shim):
//   1. websystem server (local vs. remote)
//   2. webkernel serviceworker server (local vs. remote)
//   3. webviewer
//   4. hyper gateway node => connect to bootstrap nodes to get more nodes
******************************************************************************/
```

-----------
4. deploy same page system elsewhere and it will work just the same
  * is deployed an works already across ALL DATDOT NODES which have a "domain name"
    * https://stackoverflow.com/questions/54319486/workbox-not-working-on-localhost-but-it-works-on-127-0-0-1
    * https://unix.stackexchange.com/questions/16890/how-to-make-a-machine-accessible-from-the-lan-using-its-hostname
    * https://superuser.com/questions/410053/how-can-i-set-up-a-local-domain-so-that-everyone-on-my-local-network-can-view
    * https://en.wikipedia.org/wiki/.local#:~:text=local%20is%20a%20special%2Duse,localhost.
0. DESKTOP APP might launch `datdot.localhost` with `wallet.localhost` and provide non-standard port/host via #hash link)
  * can pass a non-localhost wallet via #hash too if user configured it earlier
1. otherwise: any `datdot.org` or `hyper-app-123.com`  with in-page-browser (similar to normal web)
  * installs "service worker"
  * connects to default wallet or user wallet of choice (e.g. including potentially https://192.168.5.23 if on mobile)


```js
const architecture = {
  browser: {
    chrome_browser: [ // tabs
      { webserver: 'wallet.github.io', //  (wallets, accounts & settings)
        // eve.wallet.github.io
        // bob.wallet.github.io
        'index.html': { // account view
          page: ['index.js', 'webkernel.js'], sewo: ['index.js', 'webkernel.js'],
          iframe: { server: 'kernel.github.io', // hidden iframe
            'webkernel.js': { comm: ['bridge-daemon'] }
          },
        },
      },{ webserver: 'cabal.github.io',
        'index.html': {
          page: ['index.js', 'webkernel.js'], sewo: ['index.js', 'webkernel.js'],
          iframe: { server: 'kernel.github.io', // hidden iframe
            'webkernel.js': { comm: ['bridge-daemon'] }
          },
        },
      },{ webserver: 'datdotorg.github.io',
        'index.html': {
          page: ['index.js', 'webkernel.js'], sewo: ['index.js', 'webkernel.js'],
          iframe: { server: 'kernel.github.io', // hidden iframe
            'webkernel.js': { comm: ['bridge-daemon'] }
          },
        },
      },
    ],
    firefox_browser: [ // tabs
      { webserver: 'wallet.datdot.localhost',
        // eve.wallet.datdot.localhost
        // bob.wallet.datdot.localhost
        'index.html': { // account view
          page: ['index.js', 'webkernel.js'], sewo: ['index.js', 'webkernel.js'],
          iframe: { server: 'kernel.github.io', // hidden iframe
            'webkernel.js': { comm: ['bridge-daemon'] }
          },
        },
      { webserver: 'datdotorg.localhost',
        'index.html': {
          page: ['index.js', 'webkernel.js'], sewo: ['index.js', 'webkernel.js'],
          iframe: { server: 'kernel.github.io', // hidden iframe
            'webkernel.js': { comm: ['bridge-daemon'] }
          },
        },
      },{ webserver: 'cabal.github.io',
        'index.html': {
          page: ['index.js', 'webkernel.js'], sewo: ['index.js', 'webkernel.js'],
          iframe: { server: 'kernel.github.io', // hidden iframe
            'webkernel.js': { comm: ['bridge-daemon'] }
          },
        },
      },{ webserver: 'cabal.localhost',
        'index.html': {
          page: ['index.js', 'webkernel.js'], sewo: ['index.js', 'webkernel.js'],
          iframe: { server: 'kernel.github.io', // hidden iframe
            'webkernel.js': { comm: ['bridge-daemon'] }
          },
        },
      },
    ],
  },
  datdotapp: { // electron app
    background_daemons: {
      secure_vault: {  comm: ['electron-process'] }, // nodejs or hardware wallet (keys + passwords)
      chain_node:   { comm: ['electron-process'] },  // rust (substrate chain daemon) + chain api protocol
        // => for other chains to implement
      dat_node:     { comm: ['electron-process'] },  // nodejs
        // => kappa/hyper core daemon
      bridge_server:   { comm: ['werbkernel.js'] }, // => serves static html/js/css
        // => cloud/localhost https/wss server
        // -> serves web interface
        // -> accepts cli commands
    }
    electron: { // boots everything
      electron_process: { // electron
        'electron.js': {
          // menu tray icon (electron-tray-icon)
          // menubar buttons:
          // - open   -> datdot.localhost (configured default system)
          // - wallet -> wallet.datdot.localhost
          // - quite  -> exit app
        },
        comm: [ // connects to (and boots them if they aren't running yet')
          'secure_vault', // store keys + passwords
          'chain_node',   // append chain transactions
          'dat_node',     // append hypercore data
        ]
      },
      electron_sandbox: { // webview
        'electron-modal-dialogs' // confirmation popup
        // allow/reject + dat actions + chain transactions
      },
    }
  }
}
```

```js
/******************************************************************************
SECURITY:
* browser online                => most insecure (= things can change while you visit the page)
* browser localhost             => more secure (= things won't change while you visit if you don't confirm)
* datdot app: electron webapp   => still secure (= but custom browser we maintain - so careful)
* datdot app: electron process  => full power while running (=we have to be most careful => has access to the users system)
* datdot app: daemons           => full power all the time (these are already defined in scope and mostly implemented)
*******************************************************************************
SETUP SCENARIOS:
SYSTEM PARTS + SITUATIONS/SCENARIO TABLE: (for every of the above environments)
1. (just) none vs. local vs. remote vault
2. (just) none vs. local vs. remote wallet
3. with/without hardware wallet extension
4.
******************************************************************************/
```

------------------------------------------------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------------------------------------------------



-------------------------------------------------------------------------------
# 1. `role` USER (roles are SUPPLY NETWORK TRUST MODEL ANCHORS:)
* `simulation`   : `user.js`
```js
//@TODO: differentiate between KERNEL DEV, SYSAPP DEV, APP DEV
/******************************************************************************
2. SETUP & CONFIGURATION:     => boot system on top of OS (shim)
*******************************************************************************

      //    => enters address of remote wallet => needs CA to download/connect securely ==> not possible from phone or maybe local file?
      //       => still "NEEDS TO TRUST SYS/KERNEL DEV" whats downloaded is not generated on spot instead of real wallet source
      //       => local wallet file will make a fresh wallet locally
      //       => to open local file in iframe on phone "NEEDS TO TRUST SYS/KERNEL DEV" does it before entering credentials
      //       ==> or credentials have to be entered on separate tab
      //         ==> ok on desktop, phone, but maybe not OS
      //         ==> would be ok, because if not opened for real, it cant use the real users key to sign
      //         ==> but still, where to download the source from in the first place?!? (see problem above)
      //    => enters source address into input => "NEEDS TO TRUST SYS/KERNEL DEV" whats downloaded is whats promised before entering private key into it

      // WALLET can even protect from kernel
      // => WALLET can come from a domain, but should come from localhost or an IP address or any address, but then not rely on CA or anything but hyper encryption
      // ==> so using postMessage


      // so WALLET should always be served by KERNEL (SHIMS) under special locally locked down wallet page
      // => or


      // which wallet? => wallet is fresh or old and therefor connects to all vaults, based on feeds and then informs system about vault addresses to connect to

      // which vault?


// --------------------------------------------------------
// 1. SYSTEM SETUP & CONFIGURATION
// --------------------------------------------------------
/******************************************************************************
  0. USER NAVIGATION - user.js

    `node ./user.js` first time page visit

    * allow user to select version of app
    * should allow users to stay in charge of their keypairs
      * -> thus standardize to wallet
      * => use keypairs through vault mechanism
******************************************************************************/
// [optional] wallet_url
const host = `system.localhost` // OR a system page you trust to load another app
const params = 'params=args'    // @TODO: what are params ???
const app = `https://datdot.org/index.js` // @TODO: how to add app vs. wallet url to url0
const app = `https://cabal.chat/index.js` // OR hyper_address
const html = 'index.html'
const url0 = `https://${host}/${html}?${params}#${app}`
console.log(url0) // @NOTE: URL0: https://system.localhost/index.html?params=args#https://cabal.chat
const webview = browser.open(url0)
// `url0`: e.g. **`https://datdot.org/index.html`**
//   * (is loaded by user and cannot come from import map)
//   * can take a bunch of custom params compatible with the system it loads
//   * can take a hash of the users wallet which defaults to `wallet.localhost`
// @TODO: replace #app-url with #wallet-url
/******************************************************************************
* BOOT SYSTEM (index.html)
  * user (can provide) custom config input (provision?)
* SYSTEM INIT_STARTUP (index.js)
  * system startup code
  * webkernel service worker installation
* SYSTEM_init_process+restart
******************************************************************************/
```

LESEZEICHEN: // @TODO: ... 1

```js

// INSTALL WEB KERNEL SERVICE WORKER
const SYSTEM = { // (auto) serve index.html in (full screen) webview:
  // e.g. https://localhost:80       // from local web view
  // e.g. https://192.168.1.100:80   // from remote web view
  // * => index.html (=config) + index.js (=select webkernel + run system) (uses web_kernel.js)
  // https://localhost:80?p1=a1&p2=a2#url?x1=y1&x2=y2#...
  // package.json => index.js   (start: npm run start ||  node .) // @TODO: ???
  // index.html   => index.js   (start: open in browser)
  //-----------------------------------------------------------------------------
   'index.html': {}, /* package.json OR importmap: (importmap might be alternative to package.json)
      <script src="./index.js?foo=bar#x=y"></script>
      <script type="importmap" src="package.json">
        {
          "//spec:package.json": "https://nodejs.org/api/packages.html#packages_subpath_exports",
          "//default file name for this json file": "package.json",
          "//default value for 'exports' key": "./index.js",
          "imports": {
            "foo": "./webmodule/foo.js",
            "bar": "./webmodule/bar.js",
            "baz": "./webmodule/baz.js"
            "moment": "/node_modules/moment/src/moment.js",
            "lodash": "1/node_modules/lodash-es/lodash.js",
            "a": "asdf"
          }
        }
      </script>
  *///---------------------------------------------------------------------------
    'index.js': (async () => {
      // NEW
      import('http://rare-endurable-care.glitch.me/webkernel.js') // or 'https://datdot.localhost/webkernel.js'
      boot(import.meta.url, system)
      // OLD:
      // const dat = 'http://rare-endurable-care.glitch.me/webkernel.js' // or 'https://datdot.localhost/webkernel.js'
      // self.open ? import(dat).then(system) : (async () => importScripts(dat))()
      // once `import(dat)` returns `api = { imports }` to run system with e.g.  `function system (api) { import('datdot.js') }`
      // 1. import(dat) // installs service worker with importScripts and then reloads
      // 2. .then(system) // only runs after reload when service worker is active and serves an API (or NOT, because onmessage/postMessage)
      // -----------------
      // SYSTEM EXAMPLE:
      // -----------------
      async function system (api) {
        const { imports/*, update: { system, kernel }, publish */} = api
        // onmessage = event => {
        //   const { data: message } = event
        // }
        import('./boot.js')
        // even IMPORT version could be initially fixed to package.json
        // => later based on user confirmed signed updates

        await import('./asdf.js')
        const text = await fetch('./asdf.js').then(x => x.text())
        // await import('./bsdf.js')
        // const text2 = await fetch('./bsdf.js').then(x => x.text())
        console.log({text})
        if (!imports) return console.log('INDEX.JS')
        console.log('--------------------------------')
        console.log(imports === window.imports, window.imports, system)
        // const { env, args, imports } = system
        const {foo} = await imports('foo')
        const {bar} = await imports('bar')
        const {baz} = await imports('baz')
        document.body.style = "background-color: #111111;"
        document.body.innerHTML = `
          <h1><pre>${foo}</pre></h1>
          <h1><pre>${bar}</pre></h1>
          <h1><pre>${baz}</pre></h1>
        `
      }
      // @NOTE: UPDATE
      // so the `function system (api) { }` actually gets NEVER replaced
      // ...only with the web kernel, and web kernel will serve itself via `index.js`, ALWAYS!
      // => because thats how to install the web kernel
      // => because thats how to conveniently write a system function as a user in the first place
      // => because thats how we can get the convenience kernel syscall api for the system via `import(dat).then(system)`
      // BUT:
      // => user can write a minimal system function which "loads a system" ...where the system call is hard coded but not fixed to a version
      // ==> or it is fixed to a version, but kernel will ignore it if a system update notification or request was issued and signed by the user!
      // => OR load a system in a way that downloads and saves the version and CACHES it as the current version
      // and always RE-USES it until updates are available
      // ==> which will notify the user and if they accept the web kernel updates the CACHE and reloads after that so next time system

      // @NOTE: ROLLBACK
      // => but what if an update breaks shit, can the user roll back?
      // ==> no matter what, system always loads in SYSTEM IFRAME, so WALLET can always trigger a roll back
      // ==> thus after web kernel service worker installation and reboot:
      // 1. virtual `index.html` is generic to include "system" and "wallet" iframes via:
      // 2. IFRAME with virtual `system.html` which loads orignal `index.js` to now load system here, which can never update but delegate update of most of the system parts
      // => serves original index.html content, which loads `index.js` with existing web kernel service worker

      // @NOTE: IFRAME WALLET
      // 3. IFRAME with virtual `wallet.html` which contains wallet input field and confirm button  OR contains the restored wallet address from the last session
      // <iframe srcdoc="${`<!doctype html><html><head><meta charset="utf-8"></head><body><script src="wallet.js"></script></body></html>`}"></iframe>
      // => input field can always choose "default" kernel wallet or an address to a remote wallet or one that gets downloaded and served locally be the kernel
      // ==> always fixed, cached and served for a specific hashed version!
      // ===> allow either wallet or system to hard reset everything and/or log out of everything and/or replace wallet and/or system
      // ----------------------------------------------------------------------------
      // ----------------------------------------------------------------------------
    })()
    // ...
  }
```

```js
@TODO:
* [ ] describe app/system spec
/*
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
3. to opt out, people have to make projects owned by them, but this will still be visible on chain

SEEDERS/HOSTERS:
* anyway keep a log and add all incoming connections and requests to it, because we have controllers coming
* => and this can cause penalties in reputation/status score based on which payments are distributed!

AUTHORS/PUBLISHERS:
* should define not only max. cap, but also percentage for them and for dependencies!
* link to their user/org profile(s)
---------------------------------------
*/
```












------------------------------------------------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------------------------------------------------

-------------------------------------------------------------------------------
# 2. `role` SYSAPP DEV (or SYS ADMIN)
* `bios`         : index.html
* `install`      : index.js
* `config`       : manifest.json + shrinkwrap.json + package.json

```js
      //    => can enter e.g. WALLET.html, which could open in invisible iframe and just forward to remote address instead
      //    ==> "NEEDS TO TRUST SYS/KERNEL DEV" to actually open the "WALLET.html" and not something else
      //    ==> less flexible for user to change things
      //    ==> if it works, a change requires:
      //        => user "NEEDS TO TRUST SYS/KERNEL DEV" to change wallet
      //        => user "NEEDS TO TRUST WALLET DEV" to change wallet (bad if original wallet was not chosen by user or needs to be changed because trust was lost)
```

```html
<!-----------------------------------------------------------------------------
  1. BIOS - index.html + provisioning va params & package.json
  => sets up embedded HOST IFRAME + SW
------------------------------------------------------------------------------>
<script>
  const system = 'index.js' // system.js
  const url1 = new URL(system, location.href).href
  console.log(url1) // @NOTE: URL1: https://system.localhost/index.js?params=args#https://defaultwallet.com
  import(url1)
</script>
```
```js
/******************************************************************************
  2. CONFIG - manifest.json + shrinkwrap.json + package.json + check lavamoat
******************************************************************************/
{
  "name"         : "my-app",
  "version"      : "2.1.13",
  "maintainers"  : [],
  "valuenetwork" : {},
  "mainfest"     : {},
  "imports"      : {}
}
```
```js
/******************************************************************************
  2. INSTALL CLIENT/APP/SYSTEM - index.js

  `url1`: e.g. **`https://datdot.org/system.js`**
  * (can import import map resolved name or direct name)
  * can define the DEFAULT params for the system it loads
  * can take a hash to define a DEFAULT wallet in case wallet.localhost is not available and the url does not specify a wallet
    * but also needs to specify HYPERADDRESS for SYSTEM => but that is KERNEL MODULE SPECIFIC !!!
    * => only the system function should probably load data from hyperdrives, etc...
    *
******************************************************************************/
// browser requires it to be hardcoded (because of importScript)
// @TODO: check if type module service workers behave differently
import 'https://kernel.localhost/kernel.js'
boot(import.meta.url, function system_ready (api) {
  // @TODO: define exact api
  // @TODO: how to load app? how to define syscall OS
  /* api.use(url) vs. api.fetch('web+xxx://url') */
  // the latter via protocolHandlers web standard
  const { share } = api
  // Application get's to read data that is being provided to it without:
  // 1. Knowing it's public address
  // 2. Knowing whether encryption / decryption occurs during read / write operation
  // 3. App can initiate share which would be handled by kernel
  // ------
  // => request VAULT access from SYSTEM (and/or through SYSTEM) by asking KERNEL for WALLET ACCESS in standard way
  const { vault, use } = api
  // install apps: require/import(s) package.json#valuenetwork#imports + apps/modules require/import deps
  // ----------------------
  // instead of EXTENDING the KERNEL API
  // => WRAP the KERNEL API in your system to offer something more specific to your app or whatever
  // => offer it maybe as a higher level KERNEL ?!?
  // ... @TODO:  ... BUT, how would others use that in the same way?

  /* EXTENSION IDEA:
  As a data point, require('src/http/routes') gives you an array of route handlers that look something like this for example:
  {
    method: '*',
    path: '/api/v0/dns',
    handler: async (request, h) { ... }
  }
  There should be no dependencies on Hapi in this tree but it does use joi for validation and boom for creating http friendly error messages.
  So, in that sense if we just extracted src/http to a seperate module as-is, you could share it without further work if you built an adapter to map whatever request system you're using to them.
  */
})
```




-------------------------------------------------------------------------------
# 3. `role` OS DEV => kernel dev makes kernel + shims
* `servieworker` : webkernel.js
```js
/******************************************************************************
  3. INSTALL KERNEL + REBOOT

  is fully aware what app is loaded and what document / data it's operating on
  => there for can provide save / share functionality.
******************************************************************************/
if (globalThis.open) environment_renderer()
else environment_serviceworker()
async function environment_renderer () {
  window.boot = (script_url, system) => {
    const href = location.href

  }
  // -------------
  // `url2`: e.g. **`https://kernel.com/kernel.js`** - `https://datavault.com/vault.js` ???
  // * (can import from import map resolved name or direct name)
  // * is the kernel URL which ignores all params for now - because of SW import has to be hard coded anyway!
  //   * => so app/system developers cannot make a kernel with settings incompatible with the normal `kernel.localhost` kernel
  //   * ==> or maybe it allows to define params for additional KERNEL MODULES (e.g. to support HYPERCORE, IPFS, etc...)
  // -------------
  // 1. register "service worker kernel"
  // @THOUGHT - EXTENSIONS!
  // 1. have generic kernel
  // 2. have vault and logging in place
  // 3. allow to define a custom syscall interface - next to the generic ones
  window.boot = function boot (page_url, system) {
    delete window.boot
    // https://system.localhost/
    // // auto uses https://wallet.localhost/
    //
    // https://localhost   // does not get any shielding of localstorage
    // https://localhost/system/
    window.require = function require (name) {
      // 1. dynamically generated importmap, fetched and loaded by service worker and injected into indexhtml
      // 2. throw/display warning if original static code does not match whats in hyperdrive
      // require/import will be intercepted by kernel anyways
      //    and resolved to importmap/packagejson source
      //    * its up to app or module to use available "sub-vault"
      //      of parent app loaded through `vault.use(...)` to make
      //      more keypairs
      //    * its all under the control of the same developer who
      //      can lock down versions to hashes of specific modules
      //
      // https://github.com/WICG/import-maps/issues/7
      //
      // 1. when will browsers support importmap? (suggestion: standardize on `package.json`)
      // 2. should kernel load `package.json#imports` as importmap?
      //
      // <script type="importmap" src="package.json"></script>
      /*
      * all direct urls will be known anyway, whether used through import map or not
      * importmap is optional and should exist as `package.json` for kernel to pick it up
      * and add it dynamically to HTML file
      * PROBLEM: nodejs cannot execute system, because it cant import a url,
      * => unless maybe overwritten in package.json#imports
      * ==> a nodejs loader fixes this
      */
    }
    connect_to_shared_iframe_worker()
    function connect_to_shared_iframe_worker () {
      // 2. embed hidden iframe (e.g. `kernel.com`), which registers IPFS node as service worker
      // 3. page_url obtains messagePort to iframe SW (`kernel.com`) and transfers to own SW
      // 4. now datdot SW and kernel SW can talk to serve hyper content via datdot SW forwarded via message channel
    }
  }
}
async function environment_serviceworker () {
  const { href, origin, search, hash } = new URL(location.href)
  if (origin.endsWidth('.localhost')) { // 1. figure out we are on localhost (=expect datdot shim)
    if (origin.startsWith('wallet')) { // 1. figure out we are on wallet.localhost
      // 2. load default system
      // @TODO: add to wallet: allow user to add URL for system to add and launch
      //   * fetches info from e.g. https://datdot.org, https://cabal.chat or their corresponding hyper addresses!
      return
    } else {
      // 2. Resolve appHID (=Hyper IDentifier) that corresponds to hash via KERNEL SHIM
      const app_url = hash.slice(1)
      if (app_url) {
        if (!app_url.startsWith('hyper://')) { // load hyperdrive via hypernetwork
          const pkg_url = new URL('package.json', app_url).href
          const { address: hid } = await (await fetch(pkg_url)).json().hyper
          const drive = new Hyperdrive(hid)
          const { address } = JSON.parse(await drive.get('package.json')).hyper
          if (app_url !== address) throw new Error('inconsistent hyper address')
        }
        // ...or prompt to load page from hyper instead
        // 3. SW serves page from legacy web

      } else {
        // 2. load default system or load system from params
      }
    }




  // APPs HYPERLINK:
  // CLIENT APP only cares about IPFS PATH embedded in a meta tag, but maybe it can be improved
  // e.g. https://datdot.org/#hyperlink
  // ==> or if hyper is set as dnslink record, the service worker can use a hyper gateway to look up for a domain and serve back
  // ==> but that makes the whole thing dependent on DNS!
  // If (1) returned error (no DNSLink or API down) then fallback to version from <meta> (if present)

  // @TODO: what and how to load systeM and which wallet?
  // e.g. https://lunet.link/peerdium.gozala.io/${dataWalletCID}




  } else { // if we are not on localhost
    const { available } = await (await fetch('https://datdot.localhost')).json()
    if (available) { // check if localhost exists (=datdot shim/env is available!)
      const yes = prompt('user to switch')
      if (yes) {
        // * reload to `system.localhost?params#hash`
        // * forwarding: `system function`
        // * location.href (including params/hash)
        // * kernel url
        // * system url
      } else { // no
        // proceed in normal way
        proceed_in_normal_way()
      }
    } else {
      // proceed in normal way
      proceed_in_normal_way()
    }
  }
  function proceed_in_normal_way () { // 3. proceed in normal way
    const url2 = '' // kernel.js
    console.log(url2) // @NOTE: URL2: https://kernel.localhost/kernel.js
    if (is_first_load()) {
      //   1. register kernel service worker
      //     * => changing index.html wont update anything after first load!

      // @TODO: !!!!

      //     * => change MUST be included in `system.js` which IS and loads service worker to trigger the update! (instead of index.html or its META tags)
      //     * => at least HYPER ADDRESS includes all future updates unless hyper address changes
      //   2. add kernel iframe
      //   3. store CONFIG data under KERNEL WORKER URL
      //   4. reload
      locaton.reload() // continue with next step
    } else {
      // 0. index.html request to kernel worker
      // 1. load CONFIG
      // 2. serve default page
    }
    // FINALLY:
    // 4. default page served by service worker (see below: next section)
  }
}
```
-------------------------------------------------------------------------------
# 4. `role` sys dev + wallet dev + app dev  ==> system devs make systems + app devs make cross system apps
```js
// service worker
// request: `index.html`
self.addEventListener('fetch', event => {
  if (navigation_requiest()) {
    if (is_wallet()) {
      if (event.url === 'index.html') event.respondWith(respond_wallet()) // main_js fetches location.href
    } else {
      if (event.url === 'index.html') event.respondWith(respond_app()) // main_js fetches location.href
    }
  } else {
    // just respond with whatever resource the page wants
  }
})
function respond_app () {
  const hyperurl = '1230fk2-3f293j9023jr91j3r-13jt9j3-03'
  // grab hyper url code and serve system iframe with hyperurl
  // e.g. in IPFS that would be snapshot app html document for e.g. /ipfs/QmYjtd61SyXU4aVSKWBrtDiXjHtpJVFCbvR7RgJ57BPZro/
  // => serve iframe
  return `
    ....
    <iframe src="${hyperurl}.localhost"></iframe>
    ....
  `
  // 3a. IFRAME ${hyperurl}.localhost    ...    will do register proxy SERVIE_WORKER
  // 3b. SERVIE_WORKER, on request send messages to corresponding document (meaning ${appCID}.celestial.link).
  // 4. ${appCID}.celestial.link listens to those messages and routes them to window.top
  // 5. window.top in this instance https://lunet.link/peerdium.gozala.io/${dataCID} that captures event.origin and data-src routing request to the SharedWorker.
  // 6. SharedWorker takes care of handling requests & imposing restrictions:
  //   ==> Allow reads as long as they fall under ${appCID} or ${dataCID}.
  //   ==> Allow writes as long as they fall under ${dataCID} in which case it will produce response containing ${dataCID2} which https://lunet.link/* uses to update data-src attribute.
  return `... app page ...`
}
function respond_wallet () {
  return `... wallet page ...`
}
// -----------
// if app "navigates" and service worker receives "navigation request"
// => it will serve a default document  with a "app_url" embedded
// ==> but it needs old page to message with iframe to grab data, which could be problematic if navigation already ended the current page
//  ===> In fact if you navigate to any page
//  ====> SW will respond with <script type="module" async src="https://lunet.link/lunet/client.js"></script>
//  ====> that will do the same thing: fetch own location and update document with response.
```







------------------------------------------------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------------------------------------------------



-------------------------------------------------------------------------------
# 4b. `role` vault dev
```js
/******************************************************************************
// --------------------------------------------------------
// 2a. VAULT SETUP & CONFIGURATION
// --------------------------------------------------------
2. init or connect to DEFAULT VAULT/WALLET FEED SYSTEM
   1. VAULT setup/start
   2. WALLET setup/start
*/
```



------------------------------------------------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------------------------------------------------

-------------------------------------------------------------------------------
# 4c. `role` wallet dev
```js
      //    => user definitely needs to trust the wallet dev
      //    ==> problem: does the user need to trust somebody additionally to get to use a local or remote wallet?
      //    ==> any local wallet source needs to be loaded (e.g. from localhost or from local file on phone)
      //    +
      //    ==> any remote wallet needs to be securely connected to
      //    ====> via https IFRAME where user "NEEDS TO TRUST SYS/KERNEL DEV" to properly do that + trust browser CAs to not intercept and serve modified content
      //    ====> on the phone, nothing works, other than websockets or https, so wallet confirmations should happen on different system
      //      ==> so no need for any wallet on phone and if phone connects to wrong wallet, it cant sign
      //      ==> signature requests can be modified by app, but user can always check them in their wallet and confirm/reject
      //      ==> also user can sandbox app or review app and auto-reject/accept only after some trial phase
      //      ==> user can also "roll back", because history is preserved.
      //   USE CASES datdotOS   OR   shimmed desktop datdot.org/datdot.localhost   OR   hardware wallet
      //    => user definitely needs to "TRUST WALLET DEV"
      //    * FIRST: web kernel service worker generates all code the way we want (e.g. from js/html source file if needed)
      //      => where to get that source from? ... e.g. from a local file or a remote https server ... or the hyper network
      //      OPTIONS:
      //      * kernel (down)loads SOURCE (js/html) to be served as wallet
      //        * alternative (wallet as separate page)
      ///         * => needs updates too, needs to download WALLET SECRET FEED to decrypt locally, so it should use
      //      PROS/CONS:
      //        => to get it via https means coupling it with legacy stack
      //        => to get it via trusted or self made hardware wallet is SAFE
      //        => to get it via HYPER means there is a need to "TRUST HYPER KERNEL"
      //
      //    * local wallet source  : https://datdot.localhost/wallet.js
      //    * local wallet address : https://datdot.localhost/wallet.html
      //    * remote wallet address: -> forwarded to by locally generated iframe?
      //

/*
// --------------------------------------------------------
// 2b. WALLET SETUP & CONFIGURATION
// --------------------------------------------------------
2. init or connect to DEFAULT VAULT/WALLET FEED SYSTEM
   1. VAULT setup/start
   2. WALLET setup/start
// @TODO:
* wallet (check VAULT.md, while solving WALLET.md#CREATE (A/B/C/D) to figure out how to connect to VAULTS)
*/
```
# 2b1. user learns and chooses wallet_url
1. [user] chooses custom canonical trusted wallet_url
=> // @NOTE: CHOSEN BY USER means it can't be KERNEL, but it MUST BE (transitionable) WALLET
wallet of choice (all wallets come with different UIs and can be "installed") to allow full and improved experience
=> wallet.localhost can also install/run different wallet of user choice
=> configured where? in `task tray` icon or in `terminal config`
=> probably minimal kernel wallet + allow delegated trusted user land wallet
  ==> wallet of choice (all wallets come with different UIs and can be "installed") to allow full and improved experience
# 2b2a. init wallet
[user]: INIT WALLET
```js
// open new wallet address full screen or log in with new wallet address to open in new tab full screen

```
# 2b2b. connect wallet
[user]: CONNECT WALLET
```js
// log out of default wallet + log in with user wallet
// => cache and remember preferred user wallet address

```
# 2b3 wallet internals
2. [wallet] smart wallet as user agent is used to access DAT NODE (search google: "github dat node")
  e.g, wallet = "webwallet.foobar.com"
  * uses SERVICE WORKER to work offline first after first visit (=INSTALLATION)
    * even if domain got blocked or taken down (but just for 24 hours until service worker forces auto refresh????)
    * even if user is offline
  1. detects if DESKTOP APP isnt running (e.g. ping localhost) and offer INSTALLATION from cache (=better UX)
  2. connects to localhost (DATDOT SHIM) (=Desktop App)
    * or to a remote proxy SHIM depoyments from a list that ships with wallet + available previously cached addresses from via https or wss
      * local datdot node can discover more deployments from peers it connects to
      * a troubleshoot process can help user to discover and help selecet one of the available remote deployments
        * in case current one is or becomes in-accessible (list might show: wallet.gozala.io, wallet.datdot.org, wallet.foobar.com:8080)
      * detects when opening/connecting has failed (e.g. no callback occured on time) => again, provide troubleshooting UI
        * maybe even in new (default) browser tab
      * trouble shooting page should allow user to report problem in some ways
        * reporting could be automated by sending reports + trying out all different alternatives in hidden browser window
    * works in single user offline mode using service workers if NO SHIM DEPLOYMENTS are available
  3. maybe `wallet.foobar.com:8080` would also support `3r3fj244r23r23.wallet.foobar.com:808`
    * also all requests which go through wallet can overcome CORS but only after prompting user for permissions via HTTP request
      * on desktop app or in wallet => desktop app (as external hardware wallet) prompts user to allow/deny permissions

```html
<!-----------------------------------------------------------------------------
  4. WALLET BOOTLOADER - index.html [standalone] => KERNEL/STORAGE   kernel.org
------------------------------------------------------------------------------>
<!doctype html>
<html>
  <head><meta charset="utf-8"></head>
  <body>
    <iframe sandbox srcdoc="renderer"></iframe>
    <script src="wallet.js"></script>
  </body>
</html>
```
```js
// wallet
await navigator.serviceWorker.register(document.currentScript.src)
// => registers its own service worker
onmessage = async ({ origin, data: message = {}, source }) => {
  const { type } = message
  if (source !== window.parent) return // listens on embedder/client messages
  if (type === 'init') {
    const port = message.ports[0] // from embedding client
    port.onmessage = event => {}
    // @TODO: try out if iframe can be destroyed after passing message port
  }
  if (type === 'fetch') {
    // * messages are serialized request instances
    // * forwarded to host iframes own service worker which talks to HYPER GATEWAY
    const response = await fetch(message.data)
    port.postMessage(response)
    // sends response from own service worker back to embedding client message port
  }
}
postMessage({ type: 'ready' })
```

LESEZEICHEN: // @TODO: ... 2

------------------------------------------------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------------------------------------------------

```js
/*
// --------------------------------------------------------
// 4. APPP's VAULT/WALLET/KERNEL PAIRING SETUP & CONFIGURATION
// --------------------------------------------------------
// @TODO: ...

      // `index.html` + `index.js` define kernel+system
      // @TODO: but what about first wallet?
      // 1. initial `input field to log in could be generated by web kernel, but its not nice for themeing and features
      // 2. it could be defined by user somehow (e.g. entering address into system? or creating a wallet.html)
      // 3. it could be defined by system APP DEV (e.g. generating the initial wallet input template)
      // THINK:
      // => an app using the same "kernel" might already have the user's preferred wallet stored
      // => a new app using a different kernel will be noticable by user
      // => an app used by user already will also know users preferred wallet -> no problem through kernel basically (also "per app")
      // ==> user should defined guest account in default wallet as default for new apps, but will be able to switch account
```

------------------------------------------------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------------------------------------------------

-------------------------------------------------------------------------------
# 5a. `role` app dev
```js
/*
// --------------------------------------------------------
// 3. APP SETUP & CONFIGURATION
// --------------------------------------------------------
* *LOGIN_SCREEN_init
* *LOGIN_SCREEN_restartup
* *APP_init
  * app pairing
  * app paired
* *APP_restore/restart

* apps
  * ui-apps/system (org, datdot-ui, app)
  * e.g. "datdot app": node (service + api, chain (node/runtime/chain) + api)
*/
```

```html
<!-----------------------------------------------------------------------------
  4. APP BOOTLOADER - index.html [app+ iframe] => KERNEL/STORAGE     kernel.org
------------------------------------------------------------------------------>
<!doctype html>
<html>
  <head><meta charset="8tf-8"></head>
  <body>
    <iframe src="default-wallet.html"></iframe>
    <iframe sandbox srcdoc="renderer"></iframe>
    <script src="system.js"></script>
  </body>
</html>

old version:
<!doctype html>
<html>
  <head><meta charset="utf-8"></head>
  <iframe class="kernel" src="URL2/index.html"></iframe>                       // load kernel storage to get config, because system SW cant foreign fetch it from KERNEL PAGE
  <iframe class="wallet" src=""></iframe>                                      // ...
  <iframe class="system" src="system.localhost#"></iframe>                     // maybe sandboxed SRCDOC as "SPECIAL (unique) ORIGIN without "service worker", but can parent.postMessage ???
                                                                               // but KERNEL should resolve hyperaddress of local system
</html>
```
SECURITY: kernel has to be on a different domain than app
=> same domain means kernel view!
```js
// CLIENT will forward it to its own clients service worker
onmessage = ({ origin, source, data: message = {} }) => {
  // 2. from service worker to iframe
  if (source === serviceworker) {
    if (message.type === 'fetch') iframe.postMessage(message)
  }
  if (source === iframe) {
    if (message.type === 'response') serviceworker.postMessage(message)
  }
}
const response = fetch(request) // 1. to service worker
```



------------------------------------------------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------------------------------------------------

-------------------------------------------------------------------------------
# 5a. `role` app dev ==> app devs make cross system apps
### dependency
has address (e.g. github, npm) + maybe hyperdrive address too
```js
const sub = require('sub-dependency')
module.exports = example
function example () {}
```
standardized section to specify current list of maintainers + payment info
### package.json
```json
{
  "version": "1.0.5",
  "maintainers": [],
  "valuenetwork": {}
}
```


------------------------------------------------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------------------------------------------------

-------------------------------------------------------------------------------
# 5b. `role` dep dev
### dependency
has address (e.g. github, npm) + maybe hyperdrive address too
```js
const sub = require('sub-dependency')
module.exports = example
function example () {}
```
standardized section to specify current list of maintainers + payment info
### package.json
```json
{
  "version": "1.0.5",
  "maintainers": [],
  "valuenetwork": {}
}
```

------------------------------------------------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------------------------------------------------

-------------------------------------------------------------------------------
# 6. `role` sub dev
### sub dependency
has address (e.g. github, npm) + maybe hyperdrive address too
```js
module.exports = example
function example () {}
```
standardized section to specify current list of maintainers + payment info
### package.json
```json
{
  "version": "2.1.13",
  "maintainers": [],
  "valuenetwork": {}
}
```
-------------------------------------------------------------------------------









