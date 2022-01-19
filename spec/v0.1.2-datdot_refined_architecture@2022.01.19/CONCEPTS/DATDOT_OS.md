# ARCHITECTURE

```js
/*-----------------------------------------------------------------------------
FUNNEL ARCHITECTURE PIPELINE
-----------------------------------------------------------------------------*/
LESEZEICHEN:
// @TODO: compare glitch comments and comments here to finally decide how things are gonna be
// => derive modular architecture for all environments and decide how vault plays into this!
// @TODO: continue in `user-vault.js` file when CONCEPT is ready




//---------------------------------------------------------------------------------------------------------------------------------------------------
HYPERWIZARD_STORY_SCENARIO_TREE : // (ENVIRONMENTS + SITUATIONS + GOAL => USAGE PROCESS) => From BEGINNER to EXPERT via ECOSYSTEM ONBOARDING
/*---------------------------------------------------------------------------------------------------------------------------------------------------
TOC:
0__PREPARE_BY_CODING : // build all software to enable the entire story below!
1__PREPARE_BY_DEPLOY : // deploy software so others can use it
  * 1. at first there is only `datdot.org` and maybe `hyperkernel.org` and maybe `datdotwallet.org` (hard codes initial app/system list to "datdot.org")
  * 4. other people host similar pages to datdot.org
A__DO_DELIVERY       : // there is only datdot.org, etc, and copies of it
B__DO_FIRSTCONTACT   : // user visits without wallet to try out things with recommended default dummy wallet first
  * 2. first person comes to `datdot.org` and starts their journey
  * 5. all people are in web2 world so need to visit a traditional website to get started
C__DO_CLOUDWALLET    : // user tries to use cloud wallet instead to use the system for real
D__DO_APP_SYSTEMS    : // user starts using some apps and different systems
E__DO_SHIMMING       : // user installs shim and starts using locally with wallet.localhost and transitions data and apps/systems to it
  * 3. then a few people have their own localhost hyper based systems
F__DO_DATAPODS       : // user gets some additional datapods for backup purposes
G__DO_FRIENDS        : // user lets friends try and use some apps/systems too and motivates them to set up data pods/vaults to pin each others data
  * 6. => they can alternatively maybe find a person who offers them access to a `datdot.org` clone/fork on their local server to start from here
    ==> initial trust is important, because new users dont know much and hyper verification only works if they dont get initially malicious software
    ==> once they have the true software (maybe make it as immutable as possible and distribute and make the hash list to verify widely available)
    ==> so at least they can use a diverse set of tools to verify what they got
H__DO_HARDWAREWALLET : // user buys hardware wallet because they went all in and transitions to it
I__DO_HYPEROS        : // user buys new hyper system and transitions to it





*///-------------------------------------------------------------------------------------------------------------------------------------------------
0__PREPARE_BY_CODING : // build all software to enable the entire story below!
/*---------------------------------------------------------------------------------------------------------------------------------------------------
1. develop all the stuff and make it available for the remaining steps
// make and prepare hyper (shims):
const maker = require('make-web-os')
const instructions = maker({
  targets: [{ // targets can be: bare metal architectures for OS, or operating systems for SHIMS
    type: 'shim-react-native',
    target: 'android'
  },{
    type: 'shim-electron',
    target: 'windows'
  },{
    type: 'shim-cli',
    target: 'windows' // or win64, or linux32
  },{
    type: 'ipxe', // ipxe-bootable (OS installer)
    target: 'arm'
  },{
    type: 'ipxe-usb', // ipxe-bootable (OS installer)
    target: 'x86'
  },{
    type: 'app',
    target: 'android'
  }],
  provisioning: { // served by hyperOS or hypershims (including minimal hyperdownloader to download this stuff)
    "name": 'easypeasyOS', // e.g. easypeasyOS.localhost
    "kernel": "<pubkey>[:version]/webkernel.js", // for importScript('./webkernel.js') + contains `os-shims` too, served by WEBSERVER (traditional or hyper)
    "system": "<pubkey>[:version]/index.html", // contains `index.js` and `index.html` too, to load kernel and boot system
    // "wallet": "<pubkey>[:version]/index.html" // contains `index.
  }
})
console.log(instructions) // might print out:

  `FOLLOW INSTRUCTIONS:
    /easypeasyOS/hyperdrive (read-only) downloaded
    /easypeasyOS/provisioning.json
    /easypeasyOS/bootable-OS-shim.exe  // => allows to load over network or from USB in case of ipxe
    /easypeasyOS/targets/shim-react-native--android.xxx
    /easypeasyOS/targets/shim-cli--windows.cmd
    /easypeasyOS/targets/ipxe-server-x86.exe // detected based on current system (=windows)!
    /easypeasyOS/targets/ipxe-server-arm.exe // detected based on current system (=windows)!
    /easypeasyOS/targets/ipxe-usb-x86
    /easypeasyOS/targets/ipxe-usb-arm`





*///-------------------------------------------------------------------------------------------------------------------------------------------------
1__PREPARE_BY_DEPLOY : // deploy software so others can use it
/*---------------------------------------------------------------------------------------------------------------------------------------------------
1. HYPER DEPLOYS

    * from `<github page web server>/provisioning.json // (from a hardcoded hyperdrive) in `os.json`
    * // @TODO: ... the `store at` from next step belongs here
2. WEB DEPLOYS
    * // @TODO: ... the `store at` from next step belongs here
3. OTHER DEPLOYS
    * // @TODO: ... the `store at` from next step belongs here
*///-------------------------------------------------------------------------------------------------------------------------------------------------
A__DO_DELIVERY       : // there is only datdot.org, etc, and copies/forks of it
// first main & only (entrypoints) `datdot.org` + maybe `hyperkernel.org` + `datdotwallet.org` (hardcodes initial app/system list to "datdot.org")
// TRUST MODEL: https CAs + shim DEVELOPER + domain owner + system DEVELOPER + wallet.js developers
// EXAMPLE: (e.g. `desktop datdot.org browser page`, `mobile browser page` )
/*---------------------------------------------------------------------------------------------------------------------------------------------------
1. USER   : open website url in desktop browser or phone browser for the first time
2. SYSTEM : custom immutable system (boot script part 1/2) read-only source code served by WEB SERVER and loaded by WEBVIEW with defaults
    * stored at `<system hyperdrive>[:version]` but snapshotted to web server file system (potentially via `provisioning.json`)
      * from `<system hyperdrive>[:version]/provisioning.json` onto `<domain1 snapshot>/provisioning.json`
        * used by web server to learn about hyperdrives of kernel, wallet and others // @NOTE: review this and refine it
      * from `<system hyperdrive>[:version]/index.html` onto `<domain1 snapshot>/index.html`
      * from `<system hyperdrive>[:version]/index.js?with=some#hardcoded_systemparams` onto `<domain1 snapshot>/index.html?with=some#hardcoded_system_params`
    * downloaded and executed by WEBVIEW
      * from `<domain1 snapshot>/index.html`                                  (contains `index.js` script tag)
      * from `<domain1 snapshot>/index.js?with=some#hardcoded_system_params`  (contains `importScripts('<domain2 snapshot>/webkernel.js')` expression)
      * // @TODO: what can params do?
                LOCAL LOAD `index.html#index.js?wallet_param=wallet.js`
                // vs.
                REMOTE CONNECT `...?wallet_param=192.168.1.15?invite-password`
                //.. or maybe DEFAULT localhost?
3. KERNEL : custom immutable hyperwebkernel read-only source code loaded by `index.js` based SERVICE WORKER via `importScript('./webkernel.js')` defines hyperweb
    * stored at: `<hyperwebkernel hyperdrive>[:version]/` but snapshotted to web server file system (potentially via `provisioning.json`)
      * from `<hyperwebkernel hyperdrive>[:version]/index.js` onto `<domain2 snapshot>/webkernel.js`
      * HYPERSHIMS stored at: // @NOTE: refine the shims
        * `<hyperwebkernel hyperdrive>[:version]/targets/shim1` onto `<domain2 snapshot>/shim1` as link in kernel generated pages during RELOAD step
        * `<hyperwebkernel hyperdrive>[:version]/targets/shim2` onto `<domain2 snapshot>/shim2` as link in kernel generated pages during RELOAD step
        * `<hyperwebkernel hyperdrive>[:version]/targets/shim3` onto `<domain2 snapshot>/shim3` as link in kernel generated pages during RELOAD step
    * download and execute kernel script by WEBVIEW
      * from `<domain2 snapshot>/webkernel.js?with=some#hardcoded_or_dynamic_system_params`
      * // @TODO: what can params do?
      1. execute webkernel source code (=all the steps of webkernel source code not listed in points below)
      2. download `importmap and/or packagejson#boot` // @NOTE: VALUENETWORK MAPPING
      3. // @TODO: specify what else happens here
4. SETUP  : kernel detects no HYPER ENVIRONMENT (e.g. hyperOS or hyperSHIMs) available and therefore makes no hyper APIs available
    * // @TODO: define exactly what happens here!
    ==> while no HYPER ENV, what to do?
    ==> while no WALLET, what to do?
    ==> when dummy wallet?
    + boot script tag and
    ===> local first would work without hyper, by just making local hyper cores
    * ...





*///-------------------------------------------------------------------------------------------------------------------------------------------------
B__DO_FIRSTCONTACT   : // user visits without wallet to try out things with recommended default dummy wallet first
// => e.g. DUMMY USER, NEW APP, NO DATAVAULT, NO WALLET, ALL ON SAME DEVICE
/*---------------------------------------------------------------------------------------------------------------------------------------------------
5. RELOAD : boot and load actual system now that webkernel is initialized
    * (alternative: user revists system page) and KERNEL WEB WORKER serves actual SYSTEM PAGE
    * maybe allow URL param or hotkey while loading to serve some sort of BIOS and show HYPER ENV and other status information + reload button
    * INDEX.HTML : load kernel generated page containing iframes `admin.html` and `system.html` in WEBVIEW
    * ADMIN.HTML : load kernel generated admin page in WEBVIEW
          1. UI actions  (when wallet is active):
            * log out button
            * mode switch button (iniframe vs openwindow)
            * switch position to top/bottom/left/right
          2. UI actions (when wallet is inactive):
            * standardized link to "what is this?" (to learn about hyper systems/wallets/apps & datdot)
            * log in: user input autocomplete dropdown field to enter a sub iframe "wallet invite address" for pairing
                * listening.on('user-input'):
                    // @TODO: figure out details what below means
                    */
                    // ----------------------------------------------
                    // WALLET MODE:
                    1. if ("wallet.js") load_and_render(`default-wallet.html+specified-wallet.js`) // LOCAL WALLET
                    // 1. local wallet script load      (local visible)   => prompt user for okay/deny in browser, append to wallet logs and inform system/apps
                    2. if ("wallet-invite-address") load_and_render(`default-wallet.html+wallet_address_loading.js`)
                    // 2. remote wallet invite address  (local invisible) => generate proxy wallet keypair + use socket with hypercore protocol to connect with invite code and forward via encrypted proxy wallet log
                    //                                                    => listen to hyper wallets response log + inform system/apps
                    3. if ("hyper-wallet-invite-address") load_and_render(`default-wallet.html+hyper_wallet_address_loading.js`)
                    // 3. wallet hyper invite address   (local invisible) => generate proxy wallet keypair + use hypernet to connect to hyper wallet with invite code and forward via encrypted proxy wallet log
                    //                                                    => listen to hyper wallets response log + inform system/apps
                    4. else load_and_render('default-wallet.html + default-localhost-wallet-address-loading.js')

                    // => always allow logout/disconnect and change to new wallet
                    //     => wallet can be disconnected to prompt user for either `wallet.js` or different wallet script (including hyper address)   vs. wallet invite address  vs.  wallet hyper invite address
                    //     => leads to LOGIN PROMPT DROPDOWN SCREEN:
                    //     * e.g. click [+] to add a remote vault address or create a local vault
                    // => allow 2 tabs or browser systems (=SESSIONS) to connect to same wallet
                    //    ==> 2.+3. different connection to device (device knows and can manage)
                    //    ==> 1.+4. browser wallet open in two tabs on device (wallet service worker knows and can manage)
                    //    ===> so: wallet service worker needs to manage WALLET KEYPAIR
                    //    ==> every time a WALLET gets entered, and interacts/signs it can only get active after its added as ACTIVE WALLET which old wallets will see and confirm their DISABLEMENT
                    //    ===> if old wallet does not disable, old wallet MUST BE REVOKED before new wallet can start working!
                    // => system/app gets standard message that currently no user wallet is connected, ...until it is, when it gets a message: wallet connected
                    // ----------------------------------------------
                    /*

                    * when wallet sub iframe is loaded:
                      * local first would work without hyper, by just making local hyper cores
                      * loads custom "wallet.html" in sub-iframe (if it exists)
                      * (walllet hyperdrive contains index.html and index.js)
                      * otherwise serve default `wallet.html`
                      * listens to wallet sub iframe
                        * on('reject-request'): logs out of sub wallet iframe and shows "wallet address" + default "shim download links" (hardcoded into kernel)
                      ==> display notification for when updates are available
                      ==> display possible updates and version locking in wallet
                      ==> display notification for wallet update every time wallet starts
                      ==> let wallet have update confirm UI and display available versions, and pin wallet to specific version until updated by user via update button
                      ==> or it can load prompt user for updates and let them decide (but even if not) ==> user can always upgrade from WALLET!


            * download link for hyper shims   vs.   hyper shim active indicator
               * // @TODO: or should hyper shims be downloadable in wallet instead of app/system?
                // e.g. hyper-os-installer-cli
                // e.g. hyper-os-installer-electron
                * user downloads and installs HYPER SHIMS to reboot OS page in webview
                * // @QUIZ: shim installation executes hyper-curl + provisioning.json to download and install contents
                2. @QUIZ: reboot or start of shims opens `wallet.localhost` to generate "invite codes" ???
                  * can be use with webpage (e.g. datdot.org) to enter into default wallet iframe)
            * auto-log into wallet address (wallet server) cached in localStorage to connect to local or remote WALLET
          3. activity:
            * continuously queries `wallet.localhost` while no wallet is active to see if it becomes available to offer it as a connection offer
              * and if chosen, reload page to serve "kernel window" with correct SYSTEM/ADMIN-WALLET iframes
    * SYSTEM.HTML: load system page in WEBVIEW, which serves original system `index.html` + `index.js`
        * custom immutable system (system script part 2/2)
        * stored at:
          * from `<system hyperdrive>/index.html` onto `<github page web server>/index.html` in `provisioning.json`
          * from `<system hyperdrive>/index.js` onto `<github page web server>/index.js` in `provisioning.json`
        * downloaded and executed in webview
          * but even though originally things got loaded from snapshots
          * now the kernel is in charge and the download request is made through the kernel
          * therefore => kernel can serve a newer version from <system hyperdrive>
          * but       =? kernel serves a snapshot from github page server, when hyper is not available
6. USER   : first time user explores the page to select from multiple actions


// @TODO: what can user do without logging in with dummy wallet?

// @TODO: what can user do with dummy wallet?



UX:
1. see admin.html and see system index.html and choose:
  A. log in with dummy (no hyper)
  B. log in with another wallet
    1. log in with system dev recommended wallet address
    2. log in with users wallet address (potentially auto-detectable)
      * wallet address domain could actually download a hyper wallet script via webkernel to laod the wallet with all features
  C. download shims
  D. what is this?
  E. if page is a wallet admin auto logs in with itself
    * a WALLET SYSTEM APP is an app where `index.js?wallet=location.href`
      1. leads to admin.html auto-logging in with `location.href` and displaying error if system/app is actually not behaving like a correct wallet
      2. but otherwise admin.html hides itself and auto-forwards all actions to wallet and wallet triggered stuff get confirmed based on its own settings
2. system:
  * without wallet, there are no keypairs, e.g. to make hypercores or join swarms
  * always auto-login is confusing and bad first time user experience - returning user is anyway already signed in


WEB SERVER or entire OS might be hyper SHIMMED, so behind the scenes serves not from static snapshot but from hyperdrives
=> whatever is newest, how can user select new/old versions?
==> user gets only snapshotted version
==> user, even if not logged in with wallet, might want to see or load an older version of the app



package.json#deprecated = true
package.json#deprecated['1.0.2'] = true

package.json#main = 'main.js'
package.json#dependencies = { foo: 1.0.0, bar: 2.0.0 }

package.json#scripts#start


// @TODO: provisioning.json?
----------------------
1. from <kernel hyperdrive>: webkernel.js, dummaywallet.js, shim1, shim2
2. from <system hyperdrive>: index.js, index.html (to PROVISION a generic kernel based system)
  * index.js needs `webserver2/webkernel.js` hard coded to load the kernel and then to provision the system
    * console.log('ssw', self.serviceWorker.scriptURL)
  * but could instead

DETAILS:
1. load index.html
2. load index.js
3. import(dat)
4.   => get index.js



// provisioning.json => included in
{ // served by hyperOS or hypershims (including minimal hyperdownloader to download this stuff)
    "name": 'easypeasyOS', // e.g. easypeasyOS.localhost
    "kernel": "<pubkey>[:version]/webkernel.js", // for importScript('./webkernel.js') + contains `os-shims` too, served by WEBSERVER (traditional or hyper)
    "system": "<pubkey>[:version]/index.html", // contains `index.js` and `index.html` too, to load kernel and boot system
    // "wallet": "<pubkey>[:version]/index.html" // contains developer recommended wallet?
  }
})
----------------------
SYSTEM/APP:
1. SYSTEM: webserver1: index.html+index.js   (from system hyperdrive)
    * dummy wallet (dummy-wallet.js) in generated iframe (cache cleared/wiped when user leaves page, or maybe persisted by kernel?)
    * system dev recommended wallet
    * user chosen wallet
    * auto-detected or always offered wallet.localhost wallet => if chosen and connection fails, recommend installing HYPER SHIMS
2. KERNEL: webserver2: webkernel.js          (from kernel hyperdrive + includes dummywallet.js + includes hypershims)

WALLET:
1. WALLET: webserver1: index.html+index.js   (from wallet system hyperdrive)
    * auto-log in with self
2. KERNEL: webserver2: webkernel.js          (from kernel hyperdrive + includes dummywallet.js + includes hypershims)


----------------------


===> new users who never saw anything old might just always see the newest snapshotted version
===> once logged in with a wallet, for the given URL, the user sees the list of apps/systems and can browse or checkout versions in wallet

hyperdrive has files
if hyperdrive file content is already in wallet
=> pass it to other frames

==> so exchange messages
==> exchange files back and forth
==>


*///-------------------------------------------------------------------------------------------------------------------------------------------------
C__DO_CLOUDWALLET    : // user tries to use cloud wallet instead to use the system for real
/*---------------------------------------------------------------------------------------------------------------------------------------------------
1. open website url (with potential URL params to override/change defaults) in desktop browser or phone browser
    * system need wallet to be fully functional
    * system needs hypernet to be fully functional






  desktop browser system         => needs hypergateway via service worker (shim)
  hyperOS system                 => needs hypergateway via service worker (built-in)
  phone browser tab system       => needs hypergateway via service worker (remote)



HYPERDRIVE KEY + VERSION
=> hard coded in WEB KERNEL LOADER or overriden using the WEBVIEW URL BAR ????
==> otherwise
      * ( URL prams can define default HYPERNET + WALLET/VAULT)  (e.g. "datdot.org")


        //    -> webkernel SETUP (last step): connect to os-deamon for functionality


// 1. i have a running system


    // @TODO:
    ==> when WALLET INVITE LINK worked, a hyper connection becomes available!
    ...in the web and syncing existing hypercores via hyper gateway to hyper pods becomes available








// after generic OS (pkg.json+installer+index.html) installation finishes

        3b. kernel detects hyper system:
          * connects to local hyper gateway and serves/verifies content:
          1. default ADMIN IFRAME:
            1. download content and check for updates to re-install/update service worker => prompt user to update and/or recommend them to switch
              * from `<wallet hyperdrive>/provisioning.json

              * from `<wallet hyperdrive>/index.js // (from a hardcoded hyperdrive) in `os.json`
              * from `<github page web server>/index.js // (from a hardcoded hyperdrive) in `os.json`

              * from `<wallet hyperdrive>/index.html // (from a hardcoded hyperdrive) in `os.json`
              * from `<github page web server>/index.html // (from a hardcoded hyperdrive) in `os.json`

            2. download all shims from kernel hyperdrive
              * from `<kernel hyperdrive>/targets/... // (from a hardcoded hyperdrive) in `os.json`


            3. download system from system hyperdrive

              * from `<system hyperdrive>/index.html // (from a hardcoded hyperdrive) in `os.json`
              * from `<system hyperdrive>/index.js  // (from a hardcoded hyperdrive) in `os.json`
              * from `<github page web server>/index.html // (from a hardcoded hyperdrive) in `os.json`

            4.  makes a custom OS hyperdrive with those provisioning hyperdrives mounted

              * ...
          2. SYSTEM IFRAME: (system hyperdrive contains index.html and index.js)
            * kernel loads "rest" of relatively defined system imports from HYPER gateway (system hyperdrive)            * serves:
              * from `<system hyperdrive>/index.html` // (from a hardcoded hyperdrive) in `os.json`
              * from `<system hyperdrive>/index.js`  // (from a hardcoded hyperdrive) in `os.json`











*///-------------------------------------------------------------------------------------------------------------------------------------------------
D__DO_APP_SYSTEMS    : // user starts using some apps and different systems
/*---------------------------------------------------------------------------------------------------------------------------------------------------
  // browser tab standlone app      => needs hypergateway, maybe via LOGIN with system url, then communicate via postMessage)
  // browser in-system iframe app   => needs hypergateway (via system)
  // hyperOS app                    => needs hypergateway (built-in, but via system)
  // external phone tab app         => needs hypergateway, maybe via LOGIN with system url, then communicate via postMessage


// 1. app starts inside datdot.org website
//   => datdotorg desktop tells vault to start app


// 4. i am using a remote device to start an app
// 4. i am using a local device to start an app



*///-------------------------------------------------------------------------------------------------------------------------------------------------
E__DO_SHIMMING       : // user installs shim and starts using locally with wallet.localhost and transitions data and apps/systems to it
/*---------------------------------------------------------------------------------------------------------------------------------------------------
* `phone/desktop browser page + shim`
* `mobile app`
* `desktop app`

        //    -> webkernel SETUP (last step): connect to os-deamon for functionality
// after generic OS (pkg.json+installer+index.html) installation finishes
see A__DO_DELIVERY , but in SETUP phase with SHIMS:
    4b. HYPER SHIMS:
      * defined default HYPERNET + WALLET/VAULT // HYPEROS: system just loads the default stuff
      * built-in VAULT?
      * HYPEROS: // TRUST: hyperOS/shim + index.html+index.js +           + wallet.js DEVELOPERS
      * SHIMMED: // TRUST: hyperOS/shim + index.html+index.js + kernel.js + wallet.js DEVELOPERS





* load OS hardcoded system url    vs.    enter system url in browser with potential url params to change/override defaults
  * e.g. HYPERNET + WALLET/VAULT (e.g. "datdot.localhost")
  + local shim running VAULT

A: PHONE BROWSER APP (with DESKTOP WALLET)
E: SHIMMED DESKTOP BROWSER (+ EXTERNAL TAB CLIENT APP)
// => tape-todo-app.com                                             in windows+chrome       => use remote vault? wallet?
//    => any app needs to log into => VAULT and VAULT is connected to WALLET
//    => an app can use webkernel, but doesnt have to. it can connect to VAULT via website
// C. SAME DEVICE EXTERNAL CLIENT
///////////////////////////////////////////////////////////////////////////////
// LEGACY SYSTEM: (windows + chrome browser)
// 1. github pages or local webserver (maybe 2 different ports)
// 2. opens in chrome browser index.html
//    -> load fullscreen in webview
//    -> load service worker
//    -> load index.html boot tag and importmap and/or packagejson#boot
//    -> load boot script
//    -> connect to os-deamon for functionality

// 3. app starts in different browser tab
//   => maybe this needs to open vault in other browser tab
//   -> see below for phone apps
F: SHIMMED DESKTOP BROWSER (+ EXTERNAL PHONE DEVICE CLIENT APP)
// => tape-todo-app.com     on phone load example.com/index.html and connect to GATEWAY
///////////////////////////////////////////////////////////////////////////////

// 4. app starts on phone browser
//   =>  maybe this needs to open vault in other browser tab
//   => vault needs to be unlocked via ... password or wallet
//      (so not anyone can spam the vault with requests)
//   => then wallet website can receive request from app and
//      user needs to confirm
//   => unlocking is only saved in memory in tab, so needs
//      to be repeated when tab is closed or reloads
//   => BUT once an app request was forwardded to vault
//      daemon, a direct connection through the app is ok


// what if datdotOS runs and phone app wants to connect?
// ==> see above

// what if datdotorg runs and phone app wants to connect?
// ==> see above


// 2. i made a local vault



*///-------------------------------------------------------------------------------------------------------------------------------------------------
F__DO_DATAPODS       : // user gets some additional datapods for backup purposes
/*---------------------------------------------------------------------------------------------------------------------------------------------------

  same system vault              => exposed to wallet via remote hyperswarm + or exposed via direct hyper peer connection
  cloud vault                    => exposed to wallet via remote hyperswarm + or exposed via direct hyper peer connection
  datdot rented vault            => exposed to wallet via remote hyperswarm + or exposed via direct hyper peer connection
  raspberry pi local vault       => exposed to wallet via remote hyperswarm + or exposed via direct hyper peer connection
  peer vault                     => exposed to wallet via remote hyperswarm + or exposed via direct hyper peer connection
  ---------------------------------------------------------------
  => give user `invite hyperaddress` or `invite IP+PORT address`



G: (EXTERNAL) TERMINAL?.
// => nodejs run a vault

// 2. i made a remote vault




///////////////////////////////////////////////////////////////////////////////
// SCENARIOS :
// e.g.
// 1. desktop + harware wallet
// 2. expert user + lost wallet
// 3. restore system

///////////////////////////////////////////////////////////////////////////////
// DATDOT is a web browser system ---  WHAT OF IS KNOWN (knowable) to APPS?
//
///////////////////////////////////////////////////////////////////////////////
*///-------------------------------------------------------------------------------------------------------------------------------------------------
G__DO_FRIENDS        : // user lets friends try and use some apps/systems too and motivates them to set up data pods/vaults to pin each others data
/*---------------------------------------------------------------------------------------------------------------------------------------------------

D: SHIMMED DESKTOP BROWSER (but with PHONE WALLET)
// => datdot.org + datdotapp open localhost:8080/index.html         in windows+chrome       => datdot-app         : (see above)
//    => either terminal basic or e.g. datdotorg-desktop


*///-------------------------------------------------------------------------------------------------------------------------------------------------
H__DO_HARDWAREWALLET : // user buys hardware wallet because they went all in and transitions to it
/*---------------------------------------------------------------------------------------------------------------------------------------------------
  * `hyperOS wallet - hyper?`
DESKTOP BROWSER (but with HARDWARE WALLET)

// 3. i connected it to my hardware wallet


// 5. i want to use my systems vault and confirm through my wallet

*///-------------------------------------------------------------------------------------------------------------------------------------------------
I__DO_HYPEROS        : // user buys new hyper system and transitions to it
/*---------------------------------------------------------------------------------------------------------------------------------------------------
  * `full hyperOS`


// INSTALLATION:
    1a. start ipxe-server
    1a. copy e.g. ipxe-usb-xxx image onto usb stick and boot or navigate hardware system to ipxe-server-address to install and then boot OS
        1. installs and runs all the stuff (hyper-curl + provisioning.json to download and install contents)
        2. opens webview on default page to load (index.html + index.js) from system hyperdrive
        3. loads webkernel from webserver from kernel hyperdrive
        4. kernel detects hyper system and connects to localhost hypergateway
        5. reloads page and serves kernel window html with SYSTEM IFRAME and WALLET IFRAME
    1b. install shim on system and start it to boot OS
        1. installs and runs all the stuff (hyper-curl + provisioning.json to download and install contents)
        2. person opens webview on default page to load (index.html + index.js) from system hyperdrive
        3. loads webkernel from webserver from kernel hyperdrive
        4. kernel detects hyper system and connects to localhost hypergateway
        5. reloads page and serves kernel window html with SYSTEM IFRAME and WALLET IFRAME
    1c. store install shim on e.g. github
    1c. person opens github page in browser, which loads:
        1. loads (index.html + index.js)
        2. loads webkernel from webserver



// ------------------------------------------------------------------------------------------
// SCENARIO 2:
// => EXPERT USER, NEW APP, NO VAULT, EXISTING DIFFERENT DEVICE WALLET
// ------------------------------------------------------------------------------------------
// 1. expert user: opens and prepares their WALLET upfront
// 2. expert user: opens HYPERAPP in browser first time on their new device
// 3. HYPERAPP: present pairing input form
// 4. expert user: downloads and installs VAULT of choice and starts it
// 5. => see step 5. below

// A => use password to connect to B
// B => use password to encrypt response

// 1. VAULT_ADDRESS + GENERATED ONE_TIME_PASSWORD
// 2. APP INPUT uses password to encrypt generated number and its own generated session pubkey and sends to address
// 3. VAULT uses one time password to decrypt number and display it to user and
// 4. VAULT sends back password encrypted same number and a dedicated session pubkey to app
// 5. APP knows session pubkey of VAULT
// 6. VAULT knows session pubkey of APP
// 7. man in the middle does not know




H: NATIVE OS SYSTEM (without hyper) // datdotOS (app?)
// => single window browser   => usb-stick or ipxify : contains "index.html"
///////////////////////////////////////////////////////////////////////////////

// * INSTALLATION:
// usb stick boot or ipxeify server
// => connect to ipxeify server to download and install custom OS
// ---------------------------------------
// 1. MAKE CUSTOM OS:
// ==> includes:
//     * bootloader to load:
//     * shims (browser/electron)
//     * includes importmap or packagejson to fetch and install initial modules/apps
//     * index.html // or if missing autogenerated terminal repl
//     * runs `index.js` in `index.html` (as service worker)
// => things can be saved into CACHE to be read from their by service worker on next reload
// => add and respect special URL flag password for service worker to reset cache
//
// index.html = for SUPER USER



// ------------------------------------------------------------------------------------------
// SCENARIO 3:
// => EXPERT USER, NEW APP, EXISTING DATAVAULT & WALLET, ALL ON SAME DEVICE
// ------------------------------------------------------------------------------------------
// 1. expert user: has configured WALLET
// 2. expert user: has configured VAULT on new device
// 3. expert user: opens HYPERAPP in browser first time on their new device
// 4. HYPERAPP: present pairing input form

// 5. expert user: copies or types VAULT address into pairing form and presses enter
//    => generated vault link has a specific one time PIN that proofs an app used a VAULT link
//    => if thats used, the allow/deny can be skipped
//    => if not used, the allow/deny needs to confirm
//    => vault can be configured to auto-deny requests wiothout a PIN
// 6. HYPERAPP: tries to connect to VAULT address
//    => if PIN link is used and a malicious vault intercepts and connects
//    ==> user might start using app and type sensitive information
//    ==> so vault should identify itself too ... hmmm or we always need to confirm on VAULT
// 7. VAULT: receives pairing request and shows allow/deny dialog
// 8. expert user: clicks allow
// 9. VAULT: sends public key and user info to HYPERAPP
// 10. HYPERAPP: becomes usable
// 11. ,,,



I: NATIVE OS SYSTEM (with hyper) // datdotOS (app?)
// => single window browser   => usb-stick or ipxify : contains "index.html"
///////////////////////////////////////////////////////////////////////////////
// ---------------------------------------
// * INSTALLATION:
// usb stick boot or ipxeify server
// => connect to ipxeify server to download and install custom OS
// ---------------------------------------
// 2. MAKE CUSTOM HYPER OS:
//     * bootloader to load:
//     * shims (browser/electron + if hardware is not hyper hardware)
//     * includes importmap or packagejson to fetch and install initial modules/apps
//     * index.html // or if missing autogenerated terminal repl
//     * runs `index.js` in `index.html` (as service worker)
// => actually if `index.js` is missing
// if you want to make a system that cant log in but runs only passive vaults
// => maybe define or make an index.js that hard codes the names and displays that without login option
// => like e.g. autogenerated initial vault address + invite code




J: NATIVE OS SYSTEM (with hyper + datdot) // datdotOS (app?)
// => single window browser   => usb-stick or ipxify : contains "index.html"
///////////////////////////////////////////////////////////////////////////////
// ---------------------------------------
// * INSTALLATION:
// usb stick boot or ipxeify server
// => connect to ipxeify server to download and install custom OS
// ---------------------------------------
// 3. MAKE CUSTOM DATDOT HYPER OS:
//     * bootloader to load:
//     * shims (browser/electron + if hardware is not hyper hardware + datdot node & service)
//     * includes importmap or packagejson to fetch and install initial modules/apps
//     * index.html // WALLET + RENDERER IFRAME (super strict cors/etc... rules)
//     * runs `index.js` in `index.html` (as service worker)
//        * can run a script and use importmap modules
//        *
// => actually if `index.js` is missing



// 2. app starts on datdotOS desktop
//   => datdotOS tells vault to start app
*///-------------------------------------------------------------------------------------------------------------------------------------------------









































/*//----------------------------------


---------------------------------------
1. HYPER GATEWAY
---------------------------------------
* is a shim
* to give hypernet in traditional non-hyper browser
* to give hypernet to traditional wallet
  * => also means wallet is always "online"
  * => connecting to far away hypergateway makes it look like from there, but wallet connected from else where
  * ... but still its not a connection limited to just wallet, unless its running on localhost, which it woulb be on a SHIM SYSTEM
  * ... browser wallet would use this too
  * ... => better wallet appends and syncs it to a POD
  * ... the local system has access to hypernet, so if nothing else, the web iframe connecting to the wallet will always be able to sync feeds and seed them with a random noise keypair
  * ... to basically act like a POD
  *

So WALLET would rather connect to a hyperpeer to sync feeds and requested feeds would be downloaded by hyperpeer to forward to wallet
* => connect to any url using invite code (which will be a hyper peer)

==> to WALLET never talks remote to PODS, but rather to a hyperpeer, which can be a POD and that one talks remote to other PODs



---------------------------------------
FUTURE:
---------------------------------------
1. there is only hypernet => kernel/app/system loads and has access to hypernet
2. there are PODs => which can take commands and store data and can only be connected to via hypernet or something local (e.g. bluetooth?)
3. a user has a WALLET and wants to use it with an APP/SYSTEM
  => wallet in system
  => external wallet device
    => local app/system with UI can act as a POD and send WALLET commands and get them SIGNED back

    => to act as POD, it needs to become a temporary POD, added to wallets POD FEED, and connects to all other PODs of wallet to sync data
    => every "log in" (because of new POD) requires changed "shared secret" .. that takes a long initial time and does not work offline first

    ==> PODs are anyway always online supposedly to receive WALLET COMMANDS and potentially seed data, so they can connect to other PODs
        ==> but maybe an indoor-garage POD should not connect to anyone and just get data when local wallet connects
        ==> but how does the indoor-garage POD get updates when wallet is used outside? ...wallet does not have all the FEED DATA
        ==> maybe local system can turn into a temporary POD and then sync to the garage POD









/*
----------------------------
(possible) SHIMS:   + how to develop them
----------------------------
hypernet/hypervault/hyperpod
* WEBVIEW + WEBSERVER
* WEBKERNEL
  * // @QUIZ:
    ==> e.g. if KERNEL needs to be TRUSTED to correctly have shims and hyperOS and load wallet, instead of hijacking enterred IDENTITY RECOVERY PHRASE
    ==> THEN: SYSTEM IFRAME could be a REAL WALLET, where all user interaction gets forwarded to WALLET IFRAME, which prompts WALLET SYSTEM IFRAME and then provides back answer!
* HYPERGATEWAY + HYPERNODE (which seeds hyperdrives with relevant system/wallet/app source code)
  * // @QUIZ: only initial standardized `index.html` + `hyperkernel` are not hyperdrive served and get downloaded statically and cached forever until system is re-installed
  * ...
* DATA PODs
  1. + HYPER NET
  2. + HYPER VAULT






*/




























































































// @TODO:
// 1.  ~/Desktop/TESTSPACE/SW-TEST => for service worker testing
// 2. run a little server on glitch to serve files with the correct content type





const dat = self.dat = 'https://silly-friendly-gravity.glitch.me/webkernel.js#index.js'
// `import` call has to generate the `module & data registry iframe`
// => because kernel service worker cannot store it
// => but wallet could! ...but wallet might live on external device
self.open ? import(`${dat}#${document.currentScript.src}`).then(system) : (async () => { importScripts(dat) })()





const dat = self.dat = 'https://silly-friendly-gravity.glitch.me/webkernel.js#index.js'
// `import` call has to generate the `module & data registry iframe`
// => because kernel service worker cannot store it
// => but wallet could! ...but wallet might live on external device
self.open ? import(dat).then(system) : (async () => { importScripts(dat) })()


const {hash} = new URL(document.currentScript.src)
self.open ? import(hash).then(system) : (async () => { importScripts(hash) })()



const dat = self.dat = 'https://silly-friendly-gravity.glitch.me/webkernel.js#index.js'
self.open ? import(dat).then(system) : (async () => { importScripts(dat) })()

;(async () => {
  const { dat } = await (await fetch('./package.json')).json()
  self.open ? import(dat).then(system) : (async () => { importScripts(dat) })()
})()


/*

  <!doctype html>
  <html>
    <head><meta charset="utf-8"></head>
    <body><script src="index.js?kernel=https://silly-friendly-gravity.glitch.me/webkernel.js"></script></body>
  </html>

*/

someURL = self.scriptURL

const kernel = document.currentScript
self.open ? import(kernel).then(system) : (async () => { importScripts(kernel) })()







///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
// FUNNELING ARCHITECTURE (SETUP PROCESS)
///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
// @TODO: where/when are chances to select/connect to VAULT and/or WALLET?
// * do i need one or multiple vaults?
// * do i need a default wallet?


// CORE IDEA 1:
// run wallet in iframeA, run system in iframeB, have system setup a SUB-IFRAME for rendering to not give them renderer powers
// * wallet iframe (based on configuration) can also open real wallet in new window and forward to prevent OVERLAY ATTACK
// * generic kernel code (doesnt change/can be audited)   VS.   system iframe code

// CORE IDEA 2:
// install DATDOT-OS-SHIMS
// => install "HYPER-OS-SHIMS" + DATDOT-SYSTEM-SCRIPT
//   => which does setup webkernel system to auto-onstall "datdot-app" and start it which prompts user wallet to generate DATDOT KEYPAIR
//   => and prompts user to allow to download additional DATDOT-EXTENSION-SHIM
//     => (to have the datdot node always run as background service on system)
//   ==> it is all started/stopped via tray icon for HYPER-OS-SHIMS



// ------------------------------------------------------------------------------------------
// SETUP, STARTUP & USGAGE PROTOCOL(S):
// ------------------------------------------------------------------------------------------

@USER_ACTION__turn_on_system_after_install:
// turn on system so datdot daemons/shim start to run and page is opened
// boot and start local-host daemon
// if run/booted from nodejs
// => starts up `hypernetwork`, and `datdot-vault` and 127.0.0.1 `webserver` to serve `datdotOS`

// vs.

@USER_ACTION__turn_on_system_to_install:
// 1. prepare USB stick or ipxify server or built-in-bootable-storage
// 2. turn on system
// 3. enter BIOS to select boot device (e.g. ipxify OR usb-stick OR built-in-bootable-storage)
// => INSTALLATION PROCESS START

// ------------------------------------------------------------------------------------------
1_HARDWARE: // no special hyper physical hardware any time soon, but if: just add `index.hml+index.js` to it (+ maybe `wallet.html` ?)
// ------------------------------------------------------------------------------------------
// * BIOS firmware initialisation enumerates and inits hardware
// * executes boot code from BIOS configured boot device
// ------------------------------------------------------------------------------------------

@USER_ACTION___config_input:
// => ....

// ------------------------------------------------------------------------------------------
2a_MICRO_KERNEL___KERNEL_SHIMS: // HYPER OS vs. LEGACY OS
// ------------------------------------------------------------------------------------------
// INSTALL DAT KERNEL MODE SHIMS: basic IPC (messaging) + virtual memory (address space) + scheduling (tasks/thread management)
// * boot loader: execution (can pick defaults or ask user interactively) => then loads + starts kernel image + params (= kernel service worker)
// @INFO: VAULT chance: install hyper bios and define initial invite code / setup+select
// 1. WEB SERVER: to stop distinguishing between TERMINAL and DESKTOP ...its all one, including webgpu canvas...
//   * webserver to generate fixed HTML including index.js file
// 2. HYPER IO DAEMONS
//   @INFO: VAULT chance setup + select
//   1. HYPER_DATA_VAULT (vault? vaults?) there is some memory, but all data gets persisted to hypercores (access is offered through web kernel???)
//     2. hdd/File Server: Hyper(Drive) Vault Server (access is offered through web kernel)
//   3. net/HYPER_NET + GATEWAY: swarms and topics and sockets (via wifi/cable)
//        * needs to run in nodejs (not in web, because web does not support hyper, but is then offered THROUGH WEBKERNEL)
// 3. ? os-deamon / vault deamon ? (connected to by service worker?) ?
// 4. others, like DATDOT-SERVICE-NODE (e.g. to get datdot-app-store and hosting access)
// 5. WEB VIEW: (full screen sudo webview)
//   0. which has some defaults built in (webcam/microphone/etc... shit) + extra via USB, but always PROMPTS USER to give/grant access
//    * sets up hardware + memory paging + interrupts + device/driver init + ... but only default web spec ones
//    * usb/Device Driver, Unix Server // made available to system based on IMPORTS + needs to be confirmed by WALLET + needs to be downloaded via HYPERNET
//    * drivers-detector-and-loader
//    => some things come as defaults in the web, but can be loaded the same way! e.g. WebUSB, WebHID
//    => (microphone, webcam, etc..., infrared, bluetooth, nfc, ..., custom)
//    => built-ins: keyboard, mouse, display
//   1. basic messaging // postMessage, ...
//   2. basic memory/ram management in js/wasm + disk/hdd space?  / (virtual memory, paging page replacement, page cache) (e.g. which frame/worker stores where, etc...)
//      * and indexedDB, localStorage, ...
//   3. basic scheduling (event loop(s)) )for CPUs/GPUs, promise micro tasks, grouped per worker/frame/window + stack
// ------------------------------------------------------------------------------------------

@USER_ACTION___open_home_web_view_init:
// => ....

// ------------------------------------------------------------------------------------------
2b_MICRO_KERNEL___WEB_KERNEL:
// ------------------------------------------------------------------------------------------
// - KERNEL RENDERER with SERVICE WORKER
// first time visit: (e.g. datdot.org website)  vs. (e.g. datdot.localhost website) => what goes into shims?
// WEB_KERNEL (webkernel.js): (can run multiple micro kernels made up of service worker + iframes + web workers, thus micro kernel)
//  => by connecting from multiple different webviews/browsers/devices (not just "tabs" which re-use the service worker)
// * boot loader execution (can pick defaults or ask user interactively) => then loads + starts kernel image + params (= kernel service worker)
//   @INFO: VAULT chance select
//   1. better message = { head, refs, type, data, meta } system
//   2. service worker
//   3. ...
// * service worker kernel uses CONFIG and restarts system.js/html
//   * starts:
//      * idle process
//      * scheduler process => assign RESOURCES (e.g. net, cpu, device access) + TASKS (e.g. threads, processes, data flows)
//        * like load balancing
//        * multiple users can share resources to achieve target quality of service
//        * is fundamental to computing itself (intrinsic part of execution model of a computer system) (to multitask even with single CPU)
//      * init process (in user space) = various startup scripts + daemons (e.g. for drivers?)
//
// OFFERED MICRO KERNEL INTERFACE (syscall messages)
//
// IO SUBSYSTEM:
// - terminals (user land: SYSTEM IFRAMES + sudo land: WALLET IFRAMES)
// - sockets + network protocols + drivers ("HYPERNET CONNECTION SWITCHBOARD" for all sockets back/forth to SYSTEMS/WALLETS/APPS)
// - virtual file system + file systens + generic block layer + drivers + io scheduler ("HYPERCORE/HYPERDRIVE SWITCHBOARD" back/forth to SYSTEMS/WALLETS/APPS)
//
// TASK SCHEDULER: Task/Thread/Process Management // how many apps and components do run?
// - signal handling
// - process/thread/task creation/termination (multi task processes and task groups of a user)
//     const CPU_QUEUE = [] // per CPU sorts "sched_entity" structures in time ordered fashion
//     // e.g. red black tree + leftmost node received least computation time => nodes are indexed by received CPU time
//     // 1. The leftmost node of the scheduling tree is chosen (as it will have the lowest spent execution time), and sent for execution.
//     // 2. If the process simply completes execution, it is removed from the system and scheduling tree.
//     // 3. If process reaches maximum execution time or is otherwise stopped (voluntarily or interrupt) its reinserted into scheduling tree based on newly spent exec time.
//     // 4. The new leftmost node will then be selected from the tree, repeating the iteration.
//     task_structs = {
//       sched_entity: '<group task belongs to>',
//       vruntime: '<how much cpu time was received by this task>',
//       max_exec_time: 'calculated for exec time on ideal CPU', // time the process has been waiting to run, divided by the total number of processes
//       // wait time / total number of tasks
//     }
//
// ------------------------------------------------------------------------------------------

// => INSTALLATION PROCESS END
@USER_ACTION___turn_on_system
// => SYSTEM STARTUP PROCESS START
//   @INFO: VAULT chance select
//   * ?? display adress with invite code as default generated html
// 7. launch/opens in webview index.html (show local index.html, but log in first)
//    -> load fullscreen in webview
//    -> load service worker
//    -> load index.html boot tag and importmap and/or packagejson#boot
//    -> load boot script
//    -> connect to os-deamon for functionality


// ------------------------------------------------------------------------------------------
3_SYSTEM__STARTUP:
// ------------------------------------------------------------------------------------------
// @TODO: system startup is only after installation and web kernel init finishes.
// it can be first time or repeated time where the only difference is: wallet/vault was chosen or not yet
//
//

///////////////////////////
// ----------------------------------------------------------------------------
// ----------------------------------------------------------------------------
// INDEX.JS
if (globalThis.global) { // nodejs
  // ...
} else if (globalThis.window.open) { // browser renderer
  // ...
} else { // serviceworker
  // ...
}
// const dat = globalThis.window ? 'webkernel'
// ----------------------------------------------------------------------------
// ----------------------------------------------------------------------------
// os.html
// datdot-os.js
const kernel = require('hyperkernel')

const pkgjson = {
  "dependencies": {
    "datdot-node": "1.0.0",
    "hyper-network": "1.0.0",
    "datdot-service": "1.0.0",
    "datdot-vault": "1.0.0"
  }
}
///////////////////////////

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




// ----------------------------------------------------------------------------
LESEZEICHEN: 123
// @TODO: above is single user use case, but below is also multi user use case
// => how do the DAEMONS react?
// => how to power up and power down, not just website system, but the daemons in general?


// @TODO:
// technically multiple instances are possible. somebody could connect (from local or remote webviews):
// => e.g. github page, where webserver is github
// => e.g. laptop webserver from phone
// => even multiple parties could establish connections
//   @INFO: VAULT chance select
// -----------------
// SYSTEM
// - SYSTEM IFRAME (used to load `index.js`) into it (e.g. potentially makes a script blocked sub iframe to render actual UI in 100% 100% percent)
//   * can setup hardware + memory paging + interrupts + device/driver init + ... but only extra ones with webUSB/webHID defined drivers
// A display manager, or login manager, is typically a graphical user interface
// that is displayed at the end of the boot process in place of the default shell


// - FEATURES:
//   1. remote login with one wallet
//   2. local login with one wallet
//   3. local login with second wallet
//
//   4. local login with same wallet but different session???
//     => should be a feature of the SYSTEM
//     e.g. give first session a name and sync it across all tabs
//     e.g. go on one tab and fork the name
//     => make new tabs from that fork
//     => make new tabs from original
//     ==> tab title contains info what fork we are on
//     => allow to close fork and all tabs of that fork (multiple tabs are crap, but good when logging in from different device with same wallet)
//     ==> to have multiple screens
//     e.g. one system can save one main/default session name
//     e.g. one system can save mutiple apps and layouts under different session names in a list
//

// @TODO:
// 1. TURN ON SYSTEM by TYPING in datdot.org after service worker has been activate
// vs.
// 2. reload page

whats restore?
whats provisioning?



@USER_ACTION___provisioning:

// ------------------------------------------------------------------------------------------
3a_SYSTEM___INIT_PROCESS: // MAIN RENDERER PROCESS => shuts down system when it is closed, nothing runs in the background, other than kernel daemons
// ------------------------------------------------------------------------------------------
// -> and no additional background daemons can be installed, right?
// * INIT PROCESS:
//    * executs scripts (which use shell/syscalls) LEVELS set of non-operating service daemons to form user environment
//    * config files executed by (systemd/upstart) TARGETS set of non-operating service daemons to form user environment
//       * e.g. webserver, datdot-node, ...
//
// * DESKTOP ENVIORNMENT daemon (=display manager) => = WEB VIEW + WALLET + SYSTEM/SESSIONS
//   * graphic environment (web api BOM) with `document`
//   * login manager (for session credentials)
//   * session: UI elements, panels, desktops, applets, ...
//
// FINAL: On shutdown, init is called to close down all user space functionality in a controlled manner.
// => Once all the other processes have terminated, init makes a system call to the kernel instructing it to shut the system down.
//
// 3b_SYSTEM___RESTART (see also LOGIN_SCREEN___RESTART below)


// ------------------------------------------------------------------------------------------


// => SYSTEM STARTUP PROCESS END

// => SYSTEM LOGIN PROCESS START

// ------------------------------------------------------------------------------------------
4a_LOGIN_SCREEN___INIT:
// ------------------------------------------------------------------------------------------
// 0. when generic OS (pkg.json+installer+index.html) installation finishes
//   => leads to LOGIN PROMPT DROPDOWN SCREEN:
//   * click [+] to add a remote vault address or create a local vault
//     * wizard guides local vault setup process which requires user to set a password too
//   * click [+] to add new additional local vault or remote vault address
//   * click [-] on existing external vault address to remove from list
//   * click [-] on existing local vault and type password to confirm deletion and remove it
//   * click [+] can be replaced by typing ADD or pressing +
//   * click [-] can be replaced by typing DEL or pressing -
//   * seeing the current list of all vaults can be replaced with typing LIST or pressing TAB
//   * autocomplete type or choosing with cursor keys or clicking account
//      * prompts for password to log in and be connected to chosen VAULT
//   * just pressing ENTER chooses last used address or otherwise last created local vault
//   * shut down is only possible from login screen, so user needs to log out/disconnect first


// ------------------------------------------------------------------------------------------
4a_LOGIN_SCREEN___RESTART:
// ------------------------------------------------------------------------------------------

// ------------------------------------------------------------------------------------------

// => SYSTEM LOGIN PROCESS END

// => APP STARTUP PROCESS START

// ------------------------------------------------------------------------------------------
5a_APPS___INIT: // APP PAIRING
// ------------------------------------------------------------------------------------------
// * APP PAIRING:
//   * local can connect to it (uses a keypair)
//   * multipe local browser tabs can connect to it (have same keypair sub vault) per browser
//     * if VAULT receives another connect request, it freezes first and serves second
//     * if first gets focus again sends re-connect which freezes another
//   * multiple remote devices can connect to it (each uses different keypair sub vault)
//   * each connection can make/re-use different sub-vaults per app (e.g. in datdot.org)
//     * every time a keypair access is requested and granted through a connection
//     * => former keypair access by other connections is halted
//
// APP: request user to input VAULT ADDRESS (for the first time) and remembers it for the future
// => but maybe malicous APP can try to scan and auto connect, because e.g. atek-vault.com is a common vault address
// => thats why user needs to allow/deny incoming connection
//
// SITUATIONS:
//   if i login to system app i connect to e.g. local auto-accepted VAULT
//   * AND i see local VAULT in small bar
//
//   if i login to app i connect to e.g. remote (auto-accepted?) VAULT
//   * AND i do NOT see VAULT in any small bar
//
//   if i log out of system it disconnected from e.g. local VAULT
//   * AND vault might still be active so others can connect form remote
//
// install VAULT on (remote) device
// open VAULT UI in browser to setup/configure VAULT details initially
// copy given vault address to login from a hyper app which then connects to the vault
// => confirm/allow connection in VAULT

// VAULT: allows user to disconnect from APP
// APP: allows user to disconnect from VAULT
//

// ------------------------------------------------------------------------------------------
5b_APPS_USE: // APP PAIRED
// ------------------------------------------------------------------------------------------
// APP PAIRED
  // every app still always shows "connected to vault" icon with identicon
  // * AND can log out to connect to different VAULT if wanted/needed
// LOGGED IN CONNECTED TO VAULT:
// 2. after connecting with correct password:
//   * show "public hyper VAULT address" (e.g. menu bar or terminal label)
//   * press "disconnect VAULT" button or type "exit" => back to (1.)
//   * show allow/deny buttons on request notifications (while connected)
//     * or prompt shows: amount of open requests
//     * type: number + yes/no to accept/reject
//     * or click accept/reject
// -----------------
// APPS:
// 0. open app shows connect input field (might auto connect)
// 1. every app can ask access for hypercores (e.g. autobases)
// 2. every app can make hypercores
// 3. every app can make requests to vault
// 4. one such request could be to get added/removed or add/remove others to/from an autobase
// 5.
const vaultdata = localStorage['vault']
if (vaultdata) {
  const { keypair, address } = JSON.parse(vaultdata)
  run(keypair, address)
} else {
  const parser = document.createElement('div')
  parser.innerHTML = `<div class="pairingform">
    <input>
    <button>connect</button>
  </div>`
  const el = parser.children[0]

  const x = [...parser]
  button.onclick = event => {
    const [address, onetimepass] = input.value.split('#') // invite code
    const keypair = localStorage['keypair'] || makeKeyPair()
    const data = JSON.stringify({ appkey: keypair.pubkey, number })
    const cipher = encrypt(onetimepass, data)
    const iframe = document.createElement('iframe')
    iframe.src = address
    document.body.append(iframe)
    window.onmessage = event => {
      // vault sends back number
      const message = JSON.parse(event.details)
      const data = decrypt(message.data)
      if (data.number !== number) throw new Error('wrong number')
      const vaultkey = data.publickey
    }
    iframe.onready = event => iframe.contentWindow.postMessage(cipher)
    // onetimepass is unknown to anyone but app and vault
    // vault can check if decrypt and number is possible
  }
}



// ------------------------------------------------------------------------------------------
5c_APPS___RESTORE:
// ------------------------------------------------------------------------------------------


// ------------------------------------------------------------------------------------------

// => APP STARTUP PROCESS END



// ------------------------------------------------------------------------------------------
6_TRANSITION_TO_NEW_DEVICE:
// ------------------------------------------------------------------------------------------
// INSTALL NEW SYSTEM from OLD trusted SYSTEM (=> SYSTEM TRANSITION)
// 1. start ipxify server to download/install hyper-os-shim from a hyperdrive containing it with selected custom wallet/system html pages
// 2. boot new system and continue
// ....
// 1. start webserver to serve static page from a hyperdrive containing the shim and everything
// 2. open browser on new system to download trusted shim and install the system

*/
```



































### DATDOT OS CODE BRAINSTORMING: WEBKERNEL + SYSTEM (STARTUP)
LESEZEICHEN: 123
@TODO: brainstorm about VAULT in context of everything above!

```js
// ----------------------------------------------------------------------------
// ----------------------------------------------------------------------------
////////////////
// boot.js
const hypersystem = require('hyper-system.js')
const system_protocol = require('./custom-system.js')
const system = hypersystem(system_protocol) // define custom hyper system
const compA = require('./moduleA.js')
const urlA = system.link('compA')
const val = compaA(urlA)
// ----------------------------------------------------------------------------
// ----------------------------------------------------------------------------
// custom-system.js
function system_protocol_handler (_node, send) { // root node protocol
  const _system_node = _node
  console.log(_system_node)
  onmessage = event => { // MESSAGE FROM KERNEL
    const { data: message } = event
  }
  postMessage('MESSAGE TO KERNEL')
  // @TODO: try out with `isolate-js` and `isolate-element` sandboxing
  return function onmessage (message) {
    // ...
    send('asdafas')
  }
}
// ----------------------------------------------------------------------------
// ----------------------------------------------------------------------------
const kernel_protocol = require('kernel-protocol.js')
// kernel.js
function hypersystem (protocol) {
  if (!root_node) {
    const root_protocol = protocol // = SYSTEM PROTOCOL
    const wire_kernel = make(['kernel'], kernel_protocol)
    const wire_root = make(['root'], root_protocol) // = SYSTEM
    return root_node = wire_kernel(wire_root) // commutative connect
  }
  // ...
}
// ----------------------------------------------------------------------------
// kernel-protocol.js
function kernel_protocol (_node, send) { // hard coded kernel_protocol
  // @NOTE: might need shims to work everywhere!
  const _kernel_node = _node
  console.log(_kernel_node)
  return function onmessage (message) {
    const { head, refs, type, data, meta } = message
    switch (type) {
      case 'syscall-1': return send(syscall_1(data))
      case 'syscall-2': return send(syscall_2(data))
      case 'syscall-3': return send(syscall_3(data))
      default: return send('unknown')
    }
  }
  function syscall_1 (data) {}
  function syscall_2 (data) {}
  function syscall_3 (data) {}
}
// ----------------------------------------------------------------------------
// moduleA.js
const registerA = hypersystem(function handlerA_STM (_node, send) {
  const { name } = _node
  var status = 'init'
  send({ type: 'quux' })
  return function receive (message = {}) {
    console.log('moduleA', name, {message})
    const { head: [from, to, id] = [], refs, type, data, meta } = message
    const protocol = { 'foo': { type: 'bar'  }, 'baz': { type: 'quux' } }
    return send(protocol[type] || { type: 'unknown', data: { type, protocol } })
  }
})
function compA (rootwireA) {
  const nodeA = registerA('A', rootwireA)
  const wireAB = nodeA.link('link_AB')
  var bcd = compB(wireAB)
  return 'a' + bcd
}
```