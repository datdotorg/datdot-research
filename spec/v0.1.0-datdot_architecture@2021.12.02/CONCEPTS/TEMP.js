
// INSTALL WEB KERNEL SERVICE WORKER
const SYSTEM = { // (auto) )serve index.html in (full screen) webview:
  // e.g. https://localhost:80       // from local web view
  // e.g. https://192.168.1.100:80   // from remove web view
  // * => index.html (=config) + index.js (=select webkernel + run system) (uses web_kernel.js)
  // https://localhost:80?p1=a1&p2=a2#url?x1=y1&x2=y2#...
  // index.js + package.json   (start: npm run start ||  node .) // @TODO: ???
  // index.js + index.html     (start: open in browser)
  //-----------------------------------------------------------------------------
   'index.html': {}, /* package.json OR importmap: (importmap might be alternative to package.json)
      <script src="./index.js?foo=bar#x=y"></script>
      <script type="importmap">
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
    'index.js': (() => {
      const dat = 'https://silly-friendly-gravity.glitch.me/webkernel.js' // or 'https://datdot.localhost/webkernel.js'
      self.open ? import(dat).then(system) : (async () => importScripts(dat))()
      // once `import(dat)` returns `api = { imports }` to run system with e.g.  `function system (api) { import('datdot.js') }`
      // 1. import(dat) // installs service worker with importScripts and then reloads
      // 2. .then(system) // only runs after reload when service worker is active and serves an API (or NOT, because onmessage/postMessage)
      async function system ({ imports/*, update: { system, kernel }, publish */}) {
        // onmessage = event => {
        //   const { data: message } = event
        // }
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
        function system (api) { import('./boot.js') }
        // even IMPORT version could be initially fixed to package.json
        // => later based on user confirmed signed updates
      // 3. IFRAME with virtual `wallet.html` which contains wallet input field and confirm button  OR contains the restored wallet address from the last session
      // <!doctype html><html><head><meta charset="utf-8"></head><body><script src="wallet.js"></script></body></html>
      // => input field can always choose "default" kernel wallet or an address to a remote wallet or one that gets downloaded and served locally be the kernel
      // ==> always fixed, cached and served for a specific hashed version!
      // ===> allow either wallet or system to hard reset everything and/or log out of everything and/or replace wallet and/or system
      // ----------------------------------------------------------------------------
      // ----------------------------------------------------------------------------
      // `index.html` + `index.js` define kernel+system
      // @TODO: but what about first wallet?
      // 1. initial `input field to log in could be generated by web kernel, but its not nice for themeing and features
      // 2. it could be defined by user somehow (e.g. entering address into system? or creating a wallet.html)
      // 3. it could be defined by system APP DEV (e.g. generating the initial wallet input template)
      // ----------------------------------------------------------------------------
      // @TODO: .. check options 1 to 3




      // SUPPLY NETWORK TRUST MODEL ANCHORS:
      // 1. kernel dev makes kernel + shims
      //    =>
      // 2. system devs make systems
      //    =>
      // 3. app devs make cross system apps
      //    =>
      // 4. wallet dev makes wallet
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
      //
      // 5. sys admin sets up system
      //    => can enter e.g. WALLET.html, which could open in invisible iframe and just forward to remote address instead
      //    ==> "NEEDS TO TRUST SYS/KERNEL DEV" to actually open the "WALLET.html" and not something else
      //    ==> less flexible for user to change things
      //    ==> if it works, a change requires:
      //        => user "NEEDS TO TRUST SYS/KERNEL DEV" to change wallet
      //        => user "NEEDS TO TRUST WALLET DEV" to change wallet (bad if original wallet was not chosen by user or needs to be changed because trust was lost)
      // 6. user uses system
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




      LESEZEICHEN: 123

      // which wallet? => wallet is fresh or old and therefor connects to all vaults, based on feeds and then informs system about vault addresses to connect to

      // which vault?

    })()
    // ...
  }
