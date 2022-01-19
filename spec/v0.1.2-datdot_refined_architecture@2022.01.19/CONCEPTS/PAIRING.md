# PAIRINGS

```js
/*
// @TODO: define pairing protocols

// ==> HANDSHAKES vs LATER COMMUNICATION
// ==> APPS can generate keypair and encrypt with wallets pubkey and send to wallet




  // 0. PAIRING (with VAULTs) // @TODO: define PAIRING
        * allow multiple wallets to connect to VAULTS in parallel (but only accept regular commands from active wallet)
        * WALLETS can connect locally or remote to HYPER DATA VAULT
          * pair to VAULT 1 initially -> VAULT 1 subscribes to WALLET FEED -> then to each other
          * pair to VAULT 2 initially -> VAULT 2 subscribes to WALLET FEED -> then to each other
          * pair to VAULT 3 initially -> VAULT 3 subscribes to WALLET FEED -> then to each other












---------------------------------------
APP-WALLET-PODS-PROTOCOL
// 1. app sends hypernet gateway to wallet (could be a pod?)
// 2. wallet connects to download feeds
// 3. wallet uses feed infos to remote connect to pods

WALLET-PODS-PROTOCOL // with existing PODs
// 1. user needs to enter hypernet gateway (could be a pod?)
// 2. wallet connects to hypernet to download feeds
// 3. wallet uses feed infos to remote connect to pods

WALLET-PODLESS-PROTOCOL
// 1. user needs to enter hyperpod invitesecret address to connect to hypernet gateway?
  ==> but not all PODS need to provide a hypernet gateway
  ==> also: how to make shit known to a hyperpod?
---------------------------------------





// WALLETS are PODs with password protected UIs with access to IDENTITY/ACCOUNT keypairs to unlock write capabilities
// => which by default sync only the core account feeds, not the data feeds and wallets don't seed other than to owned PODs connecting to download infos


// @ISSUE2 // @TODO:
how to receive existing WALLETS FEED BEE and other feeds to do stuff?
=> how to get access?
=> how to connect to vault (if vault is supposed to add based on WALLETS FEED entry?)

/*
ISSUE:
  1. all existing or not-yet-existing PODS (e.g. based on REMOTE KEY, because IP:PORTs might change) (=users IDENTITY bootstrap nodes) are not known to a new WALLET DEVICE
  2. if the new WALLET DEVICE had access to HYPERNET, they could be downloaded to connect to PODs ... BUT: (see ISSUE2)
     * but even if their remotekeys are known, that still does not give PORT:IP
  3. => they might not exist though for a given IDENTITY without PODS (so hypernet/hyperpeer connection doesnt solve it just like that)
     * => so to add a POD, one or more need to be acquired first (potentially via DATDOT?)
       * => BUT: a new POD does not yet know the "wallets device key"
  4. => they do not exist for a new IDENTITY
     * => see (3.)

ISSUE2:
=> a web wallet needs to connect to a POD to sync relevant feeds
  ==> a POD might have a hook to see requested feeds and download them from the hyper network to serve them to the wallet
  ==> a POD accepts WALLETS because it knows all the legitimate wallets
  ==> a "new" wallet has a new device key
     ==> if wallets connect with device key they can be identified (IMPORTANT: otherwise PODs dont know when an active wallet switches)
     ==> BUT: a POD cannot know the new wallets DEVICE KEYPAIR yet

SO: // @TODO: how to solve that?

=>




---------------------------------------
---------------------------------------
WALLET-VAULT-PAIRING // @TODO: ...
---------------------------------------
---------------------------------------
PRECONDITION:
---------------------------------------
1. have VAULT ready => so it has address + invite code
2. have WALLET ready => so it has generated or recovery phrase restored keypair
3. enter INVITE CODE ADDRESS to connect to VAULT and initiate PAIRING
---------------------------------------
COMM PROTOCOLS
---------------------------------------
* used SYSTEM/APPS are close to WALLET
* VAULT might not be close
----------------------
VAULT COMM:
----------------------
1. VAULT sits there and waits for PAIRING
  * with SYSTEM:
    * live through hyper?
    * vault becomes temporarily unavailable (e.g. chinese firewall?)
      * post updates to other available hyper peer or usb
      * let them publish or bring via usb to vault
  * with WALLET:
    * live through hyper?
    * wallet becomes temporarily unavailable (e.g. chinese firewall?)
      * e.g. export wallet feed system to USB stick, bring it to vault by seeding it somewhere through hyper
      * e.g. export vault data to USB stick, bring it to wallet by seeding it somewhere through hyper
    * through other means? ...just to have a socket and then replicate cores? which ones?
----------------------
WALLET:
----------------------
4. second same WALLET can initiate TRANSITION too, but WALLET needs to confirm or after IDLE PHASE autoconfirms
* allows to disconnect VAULT + connect to more VAULTs (+ show status)
  * => disconnect notifies VAULT to not accept anything from APPS and SYSTEM anymore
* can (re)connect to many (new) VAULTS in parallel
* dummy wallet upgrade to real wallet is possible
* show list of all authorized and currently connected remote systems and vaults
  * allow to disconnect them
  * allow some to auto connect without popup
  * allow wallet to auto connect to vaults and system/apps again when available
----------------------
SYSTEM:
----------------------
5. APP/SYSTEM make signing request to WALLET
* cannot be used without a VAULT/WALLET pair connected
* SYSTEM and WALLET can load in parallel
* can operate read only, but writable only once WALLET is ready (e.g. using DUMMY WALLET)
----------------------
PROTOCOL
----------------------
0. VAULT  : => generated invite codes can be LIMITED in access scope and duration and or times of being valid
  * allow foreign wallets to connect to VAULT to have restricted access, but that means different peoples wallet can act on hypercores at once
  => PROBLEM!!!
  => instead use autobase and merge smartly
  // i have identity
  // i have wallets which can connect to VAULT
  // => more than one WALLET? .. they have to be set up with identity ... OR NOT! they can be set up with pre-prepared wallet keys
  // ==> each WALLET can be part of a VAULT AUTOBASE
  // ==> but walletX signed only affects AUTOBASE_X in configured and identity signed way

  // => maybe have one IDENTITY SECRET FEED
  // => have multiple WALLET SECRET FEEDS (and copy selected secrets to it)

  // => all VAULTS .....
----------------------







// what about connecting to vault with my identity wallet or wallet

1. WALLET : initiates (re)pairing with VAULT
  * a wallet needs to log into VAULT with address invite code
    * What if i connect to a vault with legit invite/password
      => nobody else has it, its secure, i'm in front of the app
        => if VAULT auto accepts, only app dev code can use it to sign something unwanted
        ==> so configure monitoring and trust levels for apps
2. ...
3. VAULT  : receives pairing request
  * local VAULT auto accepts connection from the same local system if password is correct
---
1. WALLET : initiates VAULT adding/transition
2. ...
3. VAULT  : receives pairing request
3. VAULT  : receives wallet signed "delegation request" (with coorect password)
4. VAULT  : => no confirmation popup required, because giving and using invite code is already that
5. WALLET : receives ok and pubkey from VAULT
  * => remote vault device is listed with its locally generated pubkey giving it access to its wallet
  * => remote wallet device is listed with its locally generated pubkey giving it access to its vault


---
1. WALLET : initiates VAULT disconnection
2. ...
---
1. APP        : app asks for VAULT address
1. USER/SYSTEM: provides vault address (+session? password?)
   => type invite code as param to vaul address in app
   => connection is encrypted with one time pad invite code to exchange public keys
1. APP/SYSTEM : sends request to WALLET?
1. APP/SYSTEM : sends request to VAULT?
1. APP/SYSTEM : ask WALLET directly and send it to VAULT then
2. VAULT: will prompt wallet to sign
3. WALLET: block data can be requested by WALLET directly to merkle verify and show and compare to hash from vault, so it does not need to go to vault
4. ...



---------------------------------------------------------------------------------------------------------------------

---------------------------------------
WALLET-VAULT PAIRING PROTOCOL ??
---------------------------------------
// CONNECTION:
// -> either via traditional means, which requires certificate authorities, especially from web views
// -> or via hypernet, which already uses udp/utp and is fast as fuck + hole punching!
// -> so VAULT should be bundled with HYPERNET, so it can always use that or the "hyper gateway" (from mafintosh)
// -> also HYPERNET needs dht-bridge deamon to allow access from the browser

// REMOTE CONNECTION??
// 1. while system is running, remote devices can connect to vault via vaults public address
//   * => vault directly or wallet connects with signature to vault to receive a nonce invite code
//   *
//   *
//   *
//   *
//   *
//   * app is connected to vault when it used a correct invite code to connect

---------------------------------------
TRANSITION:
---------------------------------------
// * getting a new wallet same keypair connection while an existing connection is active
//   * will prompt the current wallet to ask for allowance to switch
//   * idle wallet will get logged out automatically after some time
// * getting a different wallet request is auto-blocked
// * active wallet can send a TRANSITION REQUEST to connected VAULT
//   * pairing can only be initiated by currently active wallet keypair
// * active wallet can connect to vault and order self destroy of vault
  //     * transition/restore:
  //       * new vault can download read-only unencrypted derivation (keywords/pubkeys) log
  //       * wallet can derive all pubkeys to download all read-only feeds to new vault
  //       *
  //       *
  //       *
  //       * SUB PROBLEM:
  //         * vault transition needs new vault with new keypair and adddress
  //         * same wallet can connect to new vault
  //         * BUT: new vault will need new keys, but my app related data uses old key addresses
  //         *
  //         * on device each app makes cores
  //         * vault makes
  //         * to append to cores, vault needs keys
  //         * but when new cores are being made, the can be appended to the vault log
  //         * but signed by wallet, so vault cant add cores without wallet
  //         *
  //         * or device apps use their own feeds and vault subscribes and makes autobase
  //         * with output feed as public address per app device independent
  //         * .... but adding/removing inputs from autobase solves apps, but not vault prob
  //         *
  //         * e.g. use DATDOT to back up ALL VAULT FEEDS (some might be encrypted)
  //         * e.g. clone ALL VAULT FEEDS from DATDOT into new VAULT
  //         *
  //         * but how to make them "writable" again?
  //         * if one gets logged out of vault or vault gets destroyed, ok, just restore keys elsewhere
  //         * => but what if keys get duplicated to second vault? that corrupts shit! (but maybe can be recovered to some degree)
  //         *
  //         * opts = { sign: async (signable) => new Promise(resolve => {
  //         *   resolve(crypto.sign(signable, secretKey))
  //         * }}
  //         *
  //         * maybe it can use sync xhr  OR sync file read

  //         * but what about a wallet
  //         *
  //         *
  //         * there could be a WALLET FEED (stealth transfer feed for others to seed, e.g. datdot is ok)
  //         *
  //       *




---------------------------------------
VAULT-WALLET-PAIRING (security dance)
---------------------------------------
VAULT:
1. VAULT:INVITE: vault starts by giving out its address + invite password
  * or setting up a VAULT can define invite password
WALLET: (// @NOTE: wallet can not operate without vault?)
2. WALLET:ACCEPT: user enters vaults secret invite address to connect over any protocol that allows duplex stream
  * for wallet to gain access to the hyper network
  * for wallet to share other pubkeys and secrets
  * wallet might also scan for surrounding vaults
3. WALLET:clone wallet keypair related WALLET FEED BEE
4. WALLET:clone WALLET SECRETS FEED (wallet secretkey + secretkey hash encrypted)
5. WALLET:update vault list with vaults invite address + vault list shared secret + vaults pubkey in SECRET FEED

6. EXCHANGE: send vault list shared secret to vault and also wallet pubkey
  * exchange pubkeys and calculate shared secret (diffie hellman)

7. FEED PAIR - VAULT INIT: vault syncs wallet feed read only
  * contains all feedkeys vault is supposed to clone and store
8. FEED PAIR - AUDIT: clone connected vault audit feeds
  * can containg sign requests
9. MORE: read all special feeds from wallet feed and clone wallet special feeds:
  * active vault command feeds
  * wallet signature feed
  * feeds feed
10. seed all downloaded wallet feeds

// @TODO: above: wallet-vault-pairing




---------------------------------------
VAULT-SYSTEM/APP PAIRING PROTOCOL  ???
---------------------------------------
* provides vault address + password and maybe sub passwords to system and apps to access vault









ACTIVE WALLET 1
FEEDS from WALLET 1

INDENTITY ANNOUNCE WALLET 2
WALLET 2 makes FEEDS for every WALLET 1 feed and copies over content + chunk 0 tell IDENTITY + WALLET 1 feed+version (only legit if )
IDENTITY 1 deprecates WALLET 1


WALLET_1_FEEDS have tons of interactions, and then i'm not using those feeds anymore and even delete them
=> but somebody keeps them arround
=> and now copies content and claims to be successor, but nobody can check if thats true

IDENTITY PUBLIC FEED BEE : announces all public wallets
  * key: `wallet/{pubkey}`, value: optional metada
  * secrets feed: <public feedkey>                       ()
IDENTITY SECRET FEED BEE : has all wallet keypairs/seeds (encrypted with HASH of IDENTITY SECRET KEY)
WALLET PUBLIC FEED BEE   :
  * key: `wallet/{pubkey}`, value: optional metada
WALLET SECRET FEED BEE   : has all derived keypairs/seeds (encrypted with HASH of WALLET SECRET KEY)





IDENTITY always stays the same or dies
WALLET 1 signs IDENTITY => X claims to be IDENTITY in chunk0 and can never unclaim!
IDENTYTY signs WALLET 1 => IDENTITY claims to be X, IDENTITY unclaims to be X




*/
```