# WALLET

```js
/*


---------------------------------------
THOUGHTS:
---------------------------------------
1. the local system might be the users only system, so it makes sense to have a local POD to store the data (if nothing else)
   * multiple different users on the same system might select/input more virtual wallets
     * each wallet wants to connect and store data and give commands to its one or more PODs
2. the user can have one or more external PODs which sync the data so it is not just local
3. a system should try to connect to all the PODs it can reach and sync data
4. PODs by default sync to each other to spread new user data fast, but might not all be connected
5. wallet has to store at least a few feeds and sync them, but given enough disk space could potentially store a copy of all feeds

=> a wallet has only wallet UI to show data locally
=> to get data off the wallet it just connects to a hyper peer to replicate data

A: in case of a local system being the wallet
B: in case of a hardware wallet being the wallet
//--------------------------------------------------------

      3. CONNECT: (optional: if WALLET/VAULT SYNC didnt sync a feed to get vault addresses to auto connect)
        1. ask user for VAULT invite address
          * initiate [WALLET-VAULT-PAIRING](/PAIRING.md)


















// CODE EXAMPLES for ISSUES BELOW:

// 1. + 2. //@TODO: get access to hypernet/hyperpeer to potentially sync feeds  (IP:PORTs wont be known or accessible yet)

// 3. + 4. //@TODO: acquite POD to get access to hypernet/hperpeer
      // => if a POD is acquired it is also an option for a HYPER CONNECTION (//@NOTE: solve (1. + 2. ))
      // ==> can this happen via DATDOT initially?
      // ==> how does the POD handshake work to get e.g. potentially existing WALLETS FEED to append new WALLET DEVICE pubkey?

// 5. what if a hyper connection finds out there are no PODs available at the moment?
  => still needs to acquire a new POD to get the system started! // can then drop hypernet in return for POD
  => ...but HYPER CONNECTION was given in hope rest can happen automatically...
    => e.g. in case a USER knows a hypernet connection, but forgot keypairs for PODs
       ====> keypair for POD doesnt help to connect, but helps to connect remote via hypernet

// 6. what if a hyper connection finds out there are PODs available at the moment?
  => HYPERNET allows to remote connect to a POD if it exists


!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
// SOLUTIONS
// 1. on WALLET => have or enter new POD INVITE PORT:IP ADDRESS to get access to hypernet and manage it
//    ==> wallet is a POD too (without hypernet)
//    ==> prompts user to get 1+ PODs to backup data
//      ==> which you would otherwise communicate remote with
//    --> what if POD means they just start listening to IDENTITY FEED when set up? ==> "transfer" means they start listen to a new IDENTITY?
//    --> but how can wallet listen to PODs?
//    ----> when setting up a POD, IDENTITY FEED pubkey or




//    ==> gives option to connect to 1+ hypernet gateways (tries to autoconnect to configured one) to also be able to act as a POD (like WIFI style) connect/disconnect button

// 2. if WALLET is used with APPS or SYSTEM, they specify the WALLET and any APP/SYSTEM needs access to HYPERNET already to download its code
//    ==> which gives the WALLET access to hypernet address to download needed feeds to then connect to PODs remote
//    ==> if no PODs exists, prompts user to get1+ PODs to backup data


// 1. when setting up a POD, generate or define an "invite secret" it can also spit out its "vault" pubkey +
// ==> hash of pubkey is address to connect via hyper

// alternative




// WALLET CONNECTION NAMING per session/system/app/tab/device:
//     e.g. give first session a name and sync it across all tabs
//     e.g. go on one tab and fork the name
//     => make new tabs from that fork
//     => make new tabs from original
//     ==> tab title contains info what fork we are on
//     => allow to close fork and all tabs of that fork (multiple tabs are crap, but good when logging in from different device with same wallet)
//     ==> to have multiple screens
//     e.g. one system can save one main/default session name
//     e.g. one system can save mutiple apps and layouts under different session names in a list
//     => from a wallet allow to manage sessions and/or trigger >>> RESTORE <<< to a hyper system connected to





























----------------------------
WALLET?:
----------------------------

    1. WALLET is wallet.localhost (to only answer to strictly local connections! from its POD which is a VAULT because it contains private keys)
      => web server can be available on localhost (=fine)
    2. WALLET is cloud-wallet.com (cert security) where user logs in or is logged in and the cloud wallet manages all users keys
    3. WALLET is "page wallet" (cert security) and kernel refuses to load it if it exists on same domain to prevent SYSTEM IFRAME from accessing its storage
      => it maybe stores all keypairs and data client side, but no hyper access then!
    4. WALLET is a WEB SERVER IP WALLET (no cert)
      => web server can be available on protected or even public network
      => DETERMINISTICALLY GENERATED SECRET DANCE WALLET:
        ==> THEN: admin.html generates a keypair and makes a invite secret encrypted wallet server request
            HYPER PEER    : https://github.com/hyperswarm/secret-stream  // seems to allow to pipe over different intermediate streams
            HYPER GATEWAY : https://github.com/hyperswarm/dht-relay
        ==> KERNEL WORKER intercepts it and sends pubkey encrypted to wallet server
        ==> wallet server checks if it can decrypt with invite_secret and save pubkey and encrypts and sends back its own pubkey
        ==> admin.html generates "wallet iframe" which establishes socket to e.g. DESKTOP WALLET SERVER (which forwards to local DESKTOP WALLET UI live connected via local ws)
        ==> socket is upgraded with secret handshake to HYPER PEER CONNECTION
        ===> the deterministically generated sub wallet uses invite_code and/or keypair to (re)connect to WALLET SERVER which accepts if local WALLET UI confirms!




    PROBLEM: mobile!
    => have desktop generate wallet invite address
    => have mobile enter wallet address (e.g. 192.168.15.24#invite_code)
    => have mobile admin.html open wallet address in sub iframe
    => have mobile admin.html send encrypted request to wallet iframe, which forwards it back to wallet server
    => have desktop server decrypt it and send back response with encrypted answer to admin.html
    => if admin.html can verify, things are fine
    ==> keypairs can be exchanged, because they are stronger than invite_secret
    => admin.html keypair
    => wallet server keypair (because keys are not in html page)



    => by default offers WALLET INVITE ADDRESS (maybe prefilled with custom wallet.html link) + SHIM DOWNLOAD LINK from provisioning.json (e.g. to set up WALLET SERVER)
    ==> if wallet invite link is entered, wallet can provide rest => {{SOLVED}}
    ==> if SHIM is downloaded and started it opens `wallet.localhost` to generate and copy/paste a WALLET INVITE ADDRESS
    ====> wallet queries localhost to add to the wallet invite address potential localhost wallet which is auto-detected!
    ==> if custom `wallet.html` exists, default wallet hides default UI and logs into `wallet.html sub iframe with generic "LOGOUT" option to return to default wallet
    => custom `wallet.html` can also provide a SHIM DOWNLOAD LINK and otherwise a WALLET INVITE ADDRESS can be hard coded or requested from a server

    => might connect to hard coded HYPER SERVER which contains/provides limited content or even a fully fledged HYPER GATEWAY (risk of infinite traffic)
    =>


///----------------------------------















































DEFAULT_WALLET_AND_SYSTEM:
// => to download source and serve wallet under `wallet.localhost` (wallet.html) and system under `localhost` (index.html)
// 1. has a "default_wallet.html" served under `"wallet.localhost"`
  // 2. e.g. allows to configure one or more apps or systems under "`<name>.localhost`" (but not wallet.localhost)
  // 3. e.g. has a "default_system.html" served under "localhost" and requests a user changeable "<system-name>.localhost" from wallet
  // 4. e.g. when hyperOS or shim is started it opens "localhost" system
  //    => or wallet.localhost and lets user select which system or app to start, which immediately uses the users wallet
  //    => first opening of wallet.localhost might also auto-start system, but second wallet opening does not
  // => wallet allows to replace current system

// => system or app allows to log out of current wallet and enter a new wallet (e.g. one installed as app under "test-wallet.localhost")














































--------------------------------------------------------------------------------------
--------------------------------------------------------------------------------------
  WALLETs IFRAME (multiwallet singleton?)
--------------------------------------------------------------------------------------
--------------------------------------------------------------------------------------
* TRUST REQUIREMENTS:
-------------------------------------------
    * absolutely trust HARDWARE (+hardware dev)
    * absolutely trust KERNEL (SHIMs) (+kernel dev)
    * absolutely trust WALLET SOURCE (+wallet dev)
-------------------------------------------
* DEPENDENCIES:
-------------------------------------------
    * UI
      * for user input/interaction (e.g. browser page, hardware wallet, system with UI)
      * display requests/warnings/etc.. to inform user
      * accept user input to trigger actions
    * STORAGE
      * for usable decrypted feed system
      * even super small hardware device can still store lots of data on an SSD card
    * HYPERGATEWAY
      * access to VAULT for send/receive (to download/update encrypted feed system)
      * download, decrypt & store FEED SYSTEM
    * CONNECTIONS
      * secure connections to system/apps
      * => communication channels/protocols might depend on environment, so end-to-end encrypted tunneling as default might be preferrable
      * ==> just use feeds to communicate and wait for ACKs
    * KERNEL
      * enables wallet app
-------------------------------------------
* DEPENDENTS:
-------------------------------------------
    * SYSTEM
      * (maybe a default kernel made vault/wallet connector slot which also verifies and type checks)
      * less code to audit, because `system` function can contain lots of code for different systems
      * allows to already provide a root keypair to SYSTEM when SYSTEM starts, because VAULT + WALLET are ready
    * APP
      * apps need to sign data too
-------------------------------------------
* QUESTIONS:
-------------------------------------------
    * Could any APP be a WALLET?
    * QUESTIONS:
      //----------------------------------
      // @QUIZ:
      // => is wallet-webUI a place to store keys?
      //    => problem with browser extensions --> really big problem (e.g. ethereum metamask can decide to attack datdot users silently!)
      //    => problem with browsers clearing local storage --> user can re-enter passphrase, but that can be a problematic/inconvenient UX
      // @DONE: nope - wallet-web-ui does NOT store keys
      //----------------------------------
      // @TODO:  (SYSTEM IFRAME = WALLET?)
      // ==> e.g. if KERNEL needs to be TRUSTED to correctly have shims and hyperOS and load wallet, instead of hijacking enterred IDENTITY RECOVERY PHRASE
      // ==> THEN: SYSTEM IFRAME could be a REAL WALLET, where all user interaction gets forwarded to WALLET IFRAME, which prompts WALLET SYSTEM IFRAME and then provides back answer!
      //
      // => a WALLET needs UI
      // => a WEB UI has no hyper access, so it needs HYPERNET (or ...)
      //    => what if hyperOS or shimmed serves wallet.html
      //    vs. // @TODO:
      //    => what if service worker serves wallet.html
      //    @NOTE: wallet.html needs to be defined and no matter how it is served, it needs to then connect to HYPERNET and/or HYPERPEER
      //    => if served by service worker kernel, it can be served directly from a read only hyperdrive of wallet developers
-------------------------------------------
* DATA VAULT WALLET FEED SYSTEM:
-------------------------------------------
    // ALL WALLETS will always sync feeds
    * {{IDENTITY BEE}} (public & not encrypted)
      * IDENTITY (RECOVERY PHRASE KEYPAIR)
        1. has many associated WALLET DEVICES (publicly/secretly)
        2. has many associated DATAPODS (publicly/secretly)
        3. has many ROLES/ACCOUNTS
            * each with access to secrets/keypairs copies bound to IDENTITY
            * or access to secrets/keypairs bound to ROLE/ACCOUNT keypair
    * {{WALLETS BEE}}
      * #STATE/ACTIVE_WALLET
        * currently ACTIVE WALLET (the only one which can issue regular commands)
        * a wallet the user uses LOCALLY
      * #WALLET_LIST
        * ???
      * #VAULTS_LIST - manage vaults
        * informs all VAULTS about each other
        * can sign updates to the set of (public/private/protected) VAULTS
        * new WALLET needs WALLETS FEED key to add vault and does not have it!
          * (encrypted with active vaults shared vault list secret)
          * a list all vaults download to get to know each other
          * but no third party should know
          * vaults accept connections from other vaults with listed pubkey
          * even if that leaks, just encrypt with new shared secret
          * a list of active vault addresses and their pubkeys
          * vaults kick or add other vaults if vaults list is updated
            * wallet can update vault key list and update shared list encryption key

    * {{WALLET FEED BEE}}: (public & not encrypted):
      * {{WALLET LOG}}
        * synced by all WALLETS to contain an audit log per WALLET
      * {{WALLET SECRETS FEED}} === {{SECRETS FEED BEE}}
        * keypair: derive(WALLET_SEED + WALLET_SEED_HASH)
        * WALLET_SEED_HASH encrypts {{SECRETS FEED BEE}} (its a hyper bee, so old/outdated stuff can be deleted)
        * DECRYPTED:
          * only ever decrypted on WALLET_DEVICE
          * => decrypted to use keypairs with existing feeds to start writing to them again
        * STORAGE:
          * long term keypair storage for chosen keypairs/secrets
          * (stores all secrets and derivation keywords, etc...)
          * (encrypted, but public)
            * => an encrypted feed that contains all keypairs and configs
          * synced to VAULT only to be made available for backup e.g. for datdot
            * => can be cloned to a new vault/wallet system
        * IMPORTANCE:
          * importance of keypair decides how high or low powered it is.
            * e.g. IDENTITY RECOVERY PHRASE is highest powered keypair
            * use low powered wallet (daily driver wallet)
            * yield to high powered wallet (old age savings or IDENTITY wallet)
        * CONTENT:
          * copy of each feeds derivation secrets, keys and passwords
            * stores it in bee under feedkey, etc...
            * marks old/outdated/destroyed as obsolete
          * each vaults invite shared secrets for active vault addresses
            * stores it in bee under active vaults pubkey hash
            * marks old/outdated/destroyed as obsolete
          * an active vaults shared vault list secret
    * {{SIGNATURES FEED}} - wallet signature/versions feed (=ack)
            * contains per feedkey hash the latest and history of signatures
              * of merkle root hash and the corresponding length
              * so the wallet never signs a root hash for a feed for same length again
            * extension message can be used by vault to request signature for a feeds length merkle root
              * must be signed by a valid active vault
            * extension message can be used by wallet to request chunk + proof
            * extension message can be used by vault to send chunk + proof
              * user can be prompted to "confirm" or "reject"
              * reject => sends back an extension message
              * otherwise sends back ACK after successful appending to signature
    * {{FEED PAIRS}}
        * to communicate between a wallet and a active vaults (instead of extension messages as suggested above)
          * allows tracing/debuggin
          * to be seeded by external seeder, it needs "vault-wallet-shared-secret" encryption
            * nobody other than the wallet and the vault knows if a feed belongs to a vault/wallet {{feed pair}}
            ===> active vault {{feed pairs}} are only known to wallet in secret feed
            ===> vault knows its own {{feed pair}}
            ===> pinning is done only by vault => would additional pinning help?
          * vault/wallet feedkey, names, addresses stored in SECRET FEED
          * (vault2wallet & wallet2vault) per vault
          * if vault doesnt seed feed, vault needs replacement anyway
          * {{WALLET_TO_VAULT}} (downloaded by wallet from vault, wallet owned)
            * encrypted with vault-wallet shared secret
          * {{VAULT_TO_WALLET}} (downloaded by wallet from vault, vault owned)
            * encrypted with vault-wallet shared secret
            * by appending to vault2wallet feed the request can be traced
          * request type protocols via {{WALLET_TO_VAULT}} and {{VAULT_TO_WALLET}} feed pairs
          * REQUEST TYPES: (get updates to local feed)
            0. "signature request"
              1. v2w: prompts user or auto accepts and appends to "wallet feed"
                * root signature + feed & index & size
              2. w2v: or a REJECT message for feed & index
              2. w2v: or the wallet appended "more info", vault sends more info about chunk
              3. v2w: response can be the originally requested root signature + index & size
              3. w2v: or a REJECT message for feed & index or ACCEPT
            1. set permissions for feed write access +
              * maybe keys to read encrypted data
              * maybe remotekeys to share this feed with
            2. to command vault to self destruct
            3. to command vault which feeds to store
              * or to destroy/delete feeds
            4. to command vault which feeds to seed/swarm and set remotekey firewall
              * public feeds vs. private feeds
              * + firewall list for feeds
              * or to unswarm feeds
            5. vault list decrypt key (shared secret)
              * wallet can update the secret and it should match the WALLE FEEDs VAULT LIST
            6. to maybe disconnect/unpair and (re)connect the vault
            7. transition wallet ownership command to get new invite code
-------------------------------------------
* LIFECYCLE:
-------------------------------------------
    -----------------------------------
    0. BOOT WALLET IFRAME BIOS: (= e.g. START/OPEN TAB)
    -----------------------------------
        * LOAD basic iframe code to display options:
          * all options as in page iframe vs forward to separate tab or external hardware mode
          * allows deletion of existing options (=particular virtual wallets)
          * indicates which virtual wallets are running and are connected (but maybe locked)
            * offer to shut down/disconnect from vaults (without logging in)
            * oofer to startup/connect to vaults (without logging in)
            * offer deleting an existing virtual wallet
          * allows hard reset WALLET IFRAME BIOS and delete all virtual wallets
          * DISPLAY: wallet address input field + allow hash to verify downloaded source (via script integrity tag if nothing else!)
            * use provided default-dummy-wallet url with standardized `#dummy` (or other standardized flag) to instruct wallet to generate a generic dummy user identity
              * or replace with "real wallet page script url/path" to load another custom preferred wallet instead
              * or provide address of existing wallet device to just forward to  where things get confirmed instead
          * POSTLOAD: (choose one option)
            1. USE: potentially hard coded guest/dummy standard wallet
              * (has transition/upgrade option button)
              * has delete reset dummy/guest wallet option button
              * load "dummy default wallet app" button
              * load hard coded "dummy default wallet app" and just use it
              * => runs through a quick generic (1. CREATE) step with default values
              *
              *
              * can an APP be used with a VAULT without WALLET if connection to VAULT IS SUCCESSFUL???
                * (and maybe later be upgrade to a wallet? identity?)
                    => YES!, by using autogenerated autoaccepting dummy wallet and transition+adopting it later
                        * e.g. potentially as seperate ACCOUNT/PROFILE under personal IDENTITY
                        * or disconnected ACCOUNT stored in same IDENTITY (basically only secret)
                        * ..and ACCOUNT/WALLET FEED is otherwise not adopted
                    => or YES!, by having a WALLET which is also a VAULT
                        * ... but yeah, that means VAULT and WALLET are present
            2. (REUSE): login with one existing custom virtual wallet via password
              * reload already connected wallet and data
              * indicate `ACTIVE` if any of the available wallets is marked as `ACTIVE`
              * group virtual wallets under `IDENTITY` they belong to (publicly/secretly)
              * load already connected wallet and data and just use it
              * allow option to login/unlock
            3. NEW: add new root identity virtual wallet device
              * offer to enter an un-used identity seed phrase
            4. ADD: existing identity or identity bound sub-account virtual wallet device
              * e.g. purpose: also to quickly enter another (high/low) powered "RECOVERY SEED" to restore or make a different sub account
                * offer to input a recovery seed (potentially identity recovery phrase, but maybe sub wallet recovery phrase)
    -------------------------------------------
    * USER ACTIONS: (functions, web UI, ...)
    -------------------------------------------
        * stores sudo admin encrypted identity recovery phrase
          * can decrypt downloaded "SECRET IDENTITY FEED" content
          * convenient but enables brute force attack on weak passwords after wallet capture
          * probably (old age saving account) or (identity account) should never be stored on a wallet device
          * low powered wallets might store account keys
          * PASSWORDS:
            * teach users about strong passwords
            * teach users about password paper logbook

        * config defines UI unlock pattern password
          * teach user "good passwords" first!
        * provides keypairs to SYSTEM and APPS
        * signs on behalf of requesters apps/system/vaults
        * prompts user to confirm/reject
        * allows user to define auto-confirms/rejects
        * UI can be fullscreen
        * UI can show connected/active devices/systems/apps
        * UI can show accessed/written data (and by whom)
          // => allows to disconnect or allow/deny connection or access to data for apps
          // => shows also all active invite codes
          // => can be done remote via wallet
          // => also shows all auto-accepts configured into vault which dont need wallet confirmation
        * can receive mode request (iniframe vs openwindow)
        * can override and set its own mode and send it to parent ADMIN.html iframe
        * can receive "wallet requests" and (auto) okay/deny them
          * OKAY: sends back so ADMIN.HTML which
          * DENY: sends back reject, to e.g. ADMIN.HTML
          *
        * might provide hyper address/pods)
        * option to generate "wallet sub iframe invite address""
        * wallet can work in basic ways without hyper
        * wallet needs hypernet to be fully functional


        * MODES: // @TODO:
            * A `standalone hardware wallet`
              * install hyperOS with default system hyperdrivekey (with index.html) + default wallet hyperdrivekey (with wallet.html)
                  => install SHIM or OS with "wallet customization"
            * B. `full desktop wallet`
              * install a hypershim with default system hyperdrivekey (with index.html) + default wallet hyperdrivekey (with wallet.html)
                  => install SHIM or OS with "wallet customization"
            * C. `full mobile walllet` -  ideally turn a phone into a wallet (currently not possible, but... in the future similar to B otherwise)
              * maybe via react-native, but just like B, with default system hyperdrivekey (with index.html) + default wallet hyperdrivekey (with wallet.html)
                  => install SHIM or OS with "wallet customization"
            * D `cloud wallet` -  register and use a "cloud wallet"  in the browser
              * just a website, rest runs on the server, with default system hyperdrivekey (with index.html) + default wallet hyperdrivekey (with wallet.html)
                  => have it installed on a cloud server + load a "wallet customization"
            * E. `no hyper hardware wallet`
            * G. `phone browser wallet page`
            * F. `desktop browser wallet page` -  turn a desktop into a wallet system (like installing metamask on it)
        hyperos default wallet         => web server for wallet UI iframe in kernel page + hard coded connection to VAULT + HYPERNET
        local system wallet            => shimmed web server for wallet UI iframe in kernel page + hard coded connection to VAULT + HYPERNET
            // => can actually just connect to a HYPEROS/SHIMMEDOS local wallet server, or hyper gateway to forward requests via hyper and receive/read wallet answers
            //
            // ==> even `local wallet script load` can listen for incoming HYPER REQUESTS via HYPERNET or "local hyper peer socket"
            //     ==> by wallet UI having a HYPER GATEWAY connection + WebSocket or SSE connection for HYPER PEERS from HYPERPEER SERVER
            //         ==> hypernet connection
            //         ==> hyperpeer server
        browser tab github page wallet => wallet UI iframe in kernel page + hard coded connection to VAULT + HYPERNET
        browser tab github page wallet => wallet UI iframe in kernel page + needs: VAULT + HYPERNET

        browser tab custom wallet      => forwarded UI in kernel iframe + needs: VAULT + HYPERNET
        cloud wallet without vault     => forwarded UI in kernel iframe + hypernet built in
        cloud wallet with vault        => see above + built-in hard coded vault connections + hypernet built in
        remote wallet
            // 1. nodejs: needs to listen to its HYPER ADDRESS for incoming connection requests with valid invite code
            // 2. nodejs: needs to listen as a server/deamon for incoming connection requests with valid invite code
            // 3. web: needs UI for user to generate invite codes for (1. and 2.) and also generate okay/deny overlays user dialogs
          hardware wallet without vault  => has loadaable standalone wallet UI OR offers web server to load it + needs: VAULT + HYPERNET
          hardware wallet with vault     => has loadable standalone wallet UI or offers web server to load it + vault & hypernet built in
        phone browser tab wallet       => needs: VAULT + HYPERNET (and is remote UI)
        app wallet                     => needs: VAULT + HYPERNET (...)
    -----------------------------------
    1. (NEW) or ADD SETUP: (optional for POSTLOAD Step 3. & 4.)
    -----------------------------------
        1. CREATE: (risk limiting)
          1. WALLET: auto-generates a unique one-time (virtual) WALLET DEVICE KEYPAIR
              * every WALLET has to be unique                                =>    a WALLET KEYPAIR can never be re-used
              * to prevent copy of ACTIVE WALLET to sign conflicting data    =>    every WALLET has unique URL/IP(:PORT), but also unique KEYPAIR
          2. IDENTITY: get ACCOUNT-KEYPAIR options:
            1. MAKE: if no recovery phrase was provided generate a new IDENTITY RECOVERY PHRASE and keypair
                A.: necessary option to get started in the first place!
                    1. needs to connect to UNPAIRED VAULT
                    2. or needs to get an address to a vault which was transitioned to pubkey of new wallet to connect to
                * generate or enter "seed ritual" into wallet device to get root keypair
                * optionally backup IDENTITY RECOVERY SEED PHRASE
                * make or load IDENTITY FEED BEE
                    * setup identity feed from (identity recovery phrase keypair) => allows to recover from a wallets feed key hack
                    * // @NOTE: one or more wallets can exist under e.g. shamirs secret scheme
                      * to negotiate a signing and receiving ACKS before publishing out to the world
                      * enables:
                        * allows to bind other keypairs to a users identity
                        * allows user to sign updates about keypairs legitimately connected to users identity (e.g. recover from a walled feed key hack)
                * also generate a WALLETS FEED BEE KEYPAIR and the wallet feed bee and binds it to IDENTITY
                * bind WALLET DEVICE KEYPAIR to IDENTITY
                * add WALLET DEVICE pubkey to WALLETS FEED
                      * current wallets public feed: add pubkey of that wallets public feed + previous feed and version is undefined + self version is index=0 + root hash
                      * update: current wallets public feed: update version root hash + index
                      * later: new wallets public feed: add pubkey of that wallets public feed + previous old wallet feed pubkey and last version update index and root hash + self version is index=0 + root hash

            2. RESTORE: otherwise lookup identity or sub-account pubkey based on provided recovery phrase
                  B.: necessary option in case that all wallets have been lost!
                      1. could bootstrap entirely through hypernet access by downloading data about vaults and other wallets and more
                  * needs user to enter "RECOVERY_PHRASE" into wallet device to get root keypair (can be done offline)
                  * or use "sub-wallet recovery phrase" to not restore identity wallet, but a different existing one
                * load IDENTITY FEED BEE
                * bind WALLET DEVICE KEYPAIR to IDENTITY
                * add WALLET DEVICE pubkey to WALLETS FEED
                *
          3. SYNC: sync/download feeds and customize more (based on new WALLET DEVICE keypair)
            * needs to sync WALLETS BEE and its keypair to add its own new WALLET DEVICE KEYPAIR
            * requires WALLETS FEED BEE KEYPAIR! to add to WALLETS FEED BEE (=make it known)
              * adding new wallets pubkey
              * give it a non-conflicting petname
              * potentially making it the active wallet
              * ACTIVE WALLET delegation happens within all (virtual) WALLETS DEVICES under the same IDENTITY (secretly/publicly)
                * => more than one active wallet might be ok, if the keysets are absolutely distinct!
                * => give a wallets public key a "petname"
              * WALLETS FEED status can be:
                * => deleted/destroyed (wallet self destructs as soon as it receives the information)
                * => connected active auto-accepting
                * => connected active non-auto-accepting
                * => connected inactive
                * => disconnected (cannot be undone without a direct connection?)
              * sets up some more customization
              C. SYNC from WALLET:
                * send to new wallet a reserved WALLET KEYPAIR
                  * + WALLET LOG so other important feeds can be downloaded to restore rest and know VAULTS
                  --> at least dont "RESTORE" important long term hodl wallet keys on every possible wallet
                      --> but only when needed!
                  * connect an existing wallet and selectively sync keypairs and data
                  * select HIGH powered WALLETS (e.g. for long term hodl)
                  * select HIGH powered WALLETS (e.g. restore identity wallet for feed transition after attack)
                  * generate or select more wallet keypairs on existing wallet and sync to new wallet
                  * ==> copy selected RIGHTS/KEYPAIRS onto new wallets SECRET WALLET FEED + make it active WALLET
              D. SYNC from VAULT:
                * VAULT: enter RESERVED WALLETS FEED + "user sudo password" to choose wallet keypair and sync rest
    -----------------------------------
    2. LOGIN/CONNECT vs. UNLOCK:
    -----------------------------------
        * wallet requires local password to unlock ssh style (take metamask inspiration)
        * dont prompt for password and autostart if password is disabled
          * indicate safety/security status of current wallet config in a standardized way
        PASSWORD SECURITY:
          // 1. Wallets should be password secured
          // 2. Wallets should have additional sudo password! (e.g. to overwrite normal wallet orders and self destruct)
          // 3. Wallets accepts "IDENTITY SEED" and show wizard whether to reset IDENTITY or add selectively to current
    -----------------------------------
    3. SYNC: (updates) after every start
    -----------------------------------
          * needs VAULT PAIRING or HYPER PAIRING first?
          * ...to download data
          * wallet can not operate without vault?
    -----------------------------------
    4. (UI/API) USE/ACTIONS:
    -----------------------------------
        1. CHANGE CONFIG/FEEDS/OPTIONS:
          * VAULTS: add/remove more vaults and do the pairing dance with them
            * (see: SETUP/CONFIG "Wallet-Vault-Pairing")


            C.: convenience, by making/selecting accounts/keypairs to go onto/into new connected wallet and send required feeds too
              1. send reserved keypair? (also not bad!)
              2. ...maybe existing connected wallet can act as "hypernet" proxy?
          * DEFINE power level for wallet
                  make LOW powered WALLETS (e.g. for daily use)
                  ==> see HIGH powered WALLETS, but with less rights/keypairs
              IDENTITY PHRASE: create one or more "reserve wallet keys" in potentially RESERVED WALLETS FEED and encrypt with "user sudo password"
              // WALLETS have access to IDENTITY SECREET FEED initially
              // ==> so IDENTITY RECOVERY PHRASE or RESERVED WALLETS FEED or specific KEYPAIR allows to define what power a new wallet has
              // ===> and give extra power (additional keypairs under "user sudo keypair")
          * BINDING:
            e.g. WALLET with bitcoin key is publicly bound to IDENTITY (vice versa to proof author knows both keys!) + WALLET might contain feed keys too
            => FEEDS should be bound to IDENTITY, so IDENTITY can broadcast messages to transition to successor feed (which on regular feeds might break feed)
        2. STOP/LOCK/LOGOUT vs. DISCONNECT (e.g. auto confirms are still happening):
          * should have logout field to replace with input field again
        3. DISPLAY:
          * prompt user to confirm requests, show list/menu to interact
          * it contains UI to okay/pass/sign/avow/allow/grant vs. deny/reject!
          * display latest feed length of important control feeds!
          * display online/offline status + latest confirmed state of all other wallets
          * DISPLAY WARNINGS:
            * display warning
              * ==> if inactive (not #STATE#ACTIVE_WALLET) WALLET receives request from VAULT, it should respond with address of current active WALLET
                // NO PARALLEL regular command WALLETS!
                // => because parallel wallets can have sync issues and cause same keypair to sign conflicts!
                // => but are not supposed to issue regular commands when not ACTIVE
            * display warning when non-active wallet sends regular commands
            * display warning for any other unusual pattern and prompt user to protect themselves or be ok with it
            * VAULT will send back a warning if it tries to sign something old + not accept the commit from WALLET
              * WALLET can get information about latest state by downloading the evidence provided!
            * display warning when a "user feed" got an update not through active wallet/account?
              => because an update was signed/added with legit feed keypair but not through any active VAULT
              * every feed update is accompanied by the appending VAULTS FEED within a certain time, otherwise VAULT issues warning to users ACTIVE WALLET
              * so on every set of feed updates, within a certain interval, wallet expects VAULT confirmation
            * more
              => if non active wallet issues regular commands, vaults will reject it and issue warning!
              => if vaults receive owner feed updates and no wallet declares its responsible, it will issue a warning too
              => active wallet has a local non-shared OPS log and if that is out of sync with what external self feed sync says, it gives a visual warning to user
        4. SIGNING INTERACTION
          * send signed commands to vaults/apps/system? (signing has PERMANENCE!)
            -> signed is signed -> transferred cryptos are gone! -> feeds are appended, signed and broadcasted
            => all signing happens in wallet(s)
        5. REGULAR ACTIONS (low powered action)
          * `CREATE NEW FEEDS` => what if wallet created "new feeds"?
            * an active WALLET has a WALLET keypair: (which is bound to IDENTITY KEYPAIR)
              1. to make new keypair
              2. BINDING to WALLET KEYPAIR
                => those cannot be BOUND to IDENTITY without having access to identity keypair
                => but they can be bound to WALLET KEYPAIR
                => and WALLET is already BOUND to IDENTITY
                => so user can check for deprecation
                => all created sub feeds will always need to be deprecated with rest of wallet

                => if wallet gets stolen or breaks entirely or not at all!
                => ...and even if, just replace all of it!
          * `SIGN APPEND TO FEEDS`
          * `CONFIGURE AUTO-ACCEPTANCE RULES`
          * `REQUEST_DETAILS`
              * WALLET can get information about latest state by downloading the evidence provided!

          * REGULAR COMMANDS:
            * only accept regular commands from active wallet, but sudo commands from any wallet
            * only accept regular commands from active wallet
            * e.g. for WARNINGS or for SIGNING REQUESTS, etc...
        6. FORCED ACTIONS (higher powered wallet + sudo action)
            * ,,,
        7. OVERRIDING FORCE ACTIONS (identity recovery phrase) (=highest power)
            * ,,,
        * SUDO COMMANDS:
          * ALL WALLETS can always issue sudo commands if they have access to password user sudo protected secret feeds with higher powered keypairs
            * ,,,
        8. SWITCH WALLET/ACCOUNTS => TRANSITION/DELEGATE
          * let user switch through accounts:
            * => <SWITCH ACCOUNTS>
    -----------------------------------
    5. TEARDOWN/DESTROY & LOCK OUT:
    -----------------------------------
          * WALLET self destructs when it receives SELF DESTRUCT from its IDENTITY FEED or WALLETS FEED
          * WALLET LOG (which can trigger a wallets "SELF DESTRUCT", also VAULTS listen to it)
        * click to delete/destroy/reset all wallet content
        * transition causes it automatically?
        * IDENTITY CONFLICT === IDENTITY DEATH
            => also can make a potentially conflicting claim they want to "move on" and also breaking the original identity
            => if identity ever leaks, make new identity and forward and double sign and collect trust claims from people
            => its still a FORK! (but maybe dmaage can be minimized - e.g. transfering bitcoins, etc...)
            => people still need to decide which claim they believe
-----------------------------------------------------------------------------------------------------------------
*/
```