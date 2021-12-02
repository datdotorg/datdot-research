# TRANSITION

```JS
/*

HARDWARE WALLET
* VIRTUAL WALLETS (with IDENTITY KEYPAIR) or (with SUBWALLET KEYPAIR bound to an IDENTITY)
  * has access to keypairs
  *

GET NEW HARDWARE WALLET
  *



  // ---------------------------------
  // GOALS:
  // -> minimize damage owners can do by tricking others
  //    -> others will learn they only trust long term identities who dont undo commits too frequently
  //    -> others will learn to measure and compare history of undoing before trusting
  //    -> owners will learn that they can trick, but this might break trust into their long term identity and short term identities wont get much trust
  //    --> a long term identity can be generated, but it might need signatures of others (potentially collaborators or sock puppets)
  //    --> so collecting signatures of others might be problematic unless they are sybil
  //    ----> others will learn to trust only long term identities with signatures from trusted peers (maybe including pointers to blokchain entries)
  // => allow original OWNER to at least DESTROY their original identity instead of allowing the infinite hijacking
  // => allow external PEERS to not believe a transition was genuine, especially if it comes claiming LATE
  // ==> but external PEERS can compare how many others believed it early
  // ==> but original OWNER can decide how many damage they accept to no cause too much stuff to be undone





  // 2. TRANSITION KEYPAIRS to (hostile) RECOVER: (stealer/finder can never sign transition messages. losing IDENTITY KEYS === DEATH)
  //    1. make new keypairs + copy over data
  //    2. restore lost/stolen keys and transfer tokens/assets to new account
  //    3. if new is BOUND (=not anonymous): mutual sign with old/new keypairs transition proof msgs (feeds, chains) onto IDENTITY feeds
  //      * ADOPTION: declare vice versa signed adoption msgs to claim/associate keypairs (e.g. feeds, chain accounts, wallets, identities)
  //        * in `chunk0` of new feeds
  //      * if it is not BOUND, it cannot be transitioned and essentially becomes a new IDENTITY (potentially managed by same WALLET)
  //    4. sign & broadcast destroy/info msgs where possible + burn old keypairs afterwards (not append to new, but (decide if backup of old secret feed)
  //      * broadcast as e.g. feed messages
  //      * store on identity feed signed by old and new keypairs of affected (old+new) feed pairs of transition
  //      * it overrides everything else => broken feeds will not be processed anymore.
  //      * others downloading and believing old and fake messages until DESTROY cant be prevented, but better recover late than never
  //        * => requires to consider reputation of others via trusted peers or chains to protect from sombody faking steal/lost to undo commits
  //           * a CONSUMER makes an AUTOBASE for a remote user, so all use of CONSUMER of remote user feeds are proxied through an AUTOBASE for easier update
  //           * a CONSUMER adds/removes feeds of remote user from their local AUTOBASE
  //           * a CONSUMER updates feeds from local autobase based on users FEEDFEED signed by identity key
  //           *   * => a conflict is presented as UNDO DIFF to CONSUMER to ask for acceptance (maybe with an option to talk to remote user)

  // 3. SWITCH ACTIVE WALLETS (friendly):

---------------------------------------

  // SECURITY PROBLEM INFO:   (WALLET/VAULT)
    1. LOCKOUT is bad, because attacker will use it to lock out OWNER
    2. OLD or NEW Wallet can not be favoured, because attacker could get the favoured one
    3. TAKE OVER request from attacker wallet would need a counter take over request
    => use SUDO technique of a connected HONEST WALLET to LOCKOUT/DESTROY malicious WALLET

---------------------------------------

        1. CHANGE: can user turn current wallet into any other wallet?
          * => would make sense, because that makes it literally impossible for the old wallet to sign anything!
          // ===> a single wallet can quickly switch between multiple wallets given "user sudo password" to vote out an existing WALLET" !!!!
          // => allows to use stolen/lost wallets keypair to sign a "self destruct" for the lost/stolen wallet onto "WALLET LOG"

---------------------------------------


   * setup feed system (="WALLETS PUBLIC FEED") (wallets recovery phrase keypair)
     * to GUARANTEE PROGRESS of a specific "WALLETS PUBLIC FEED", the identity feed can sometimes include a signed root hash of it
       * which means any successor "WALLETS PUBLIC FEED" is only valid from then on
       => so when identity feed claims NEW WALLETS PUBLIC FEED, it needs to include from which VERSION on
   * set AUTH FIELD to identity feed publickey
       * to verify, clone IDENTITY FEED and check if this is the current active "WALLETS PUBLIC FEED" (the identity feed is signed)
       * to access AUTH FIELD it needs "WALLETS PUBLIC FEED"
   * set IDENTITY to indentity public key
   * backup feeds list:
     * add identity feed pubkey
   * setup recovery phrase encrypted "WALLET SECRET FEED" to store all secrets

   * setup "DEVICE WALLET FEED" (generate to store in "WALLET SECRET FEED" (needs recovery keypair)
     * publickey into "ACTIVE WALLET FIELD" (public or encrypted with vault shared secret?)
     * watch active wallet field for successor becoming active and ACK on WALLET FEED and stop posting any updates then and self destroy


OR take successor keypair from current active wallet


//    * setup "SUCCESSOR WALLET FEED KEYPAIR" into "WALLET SECRET FEED" (needs recovery keypair)


//    * delete recovery keypair

//    * connect to vault(s) and exchange keypairs and download singleton vault feed to wait for feed system backup confirmation
//      * listen to vault(s) message of not being completely up-to-date with feed system and wait for another feed system backup confirmation at the end of sync
//      * listen to successor feed keypair regularly to stop activity once successor becomes active
//      * ...
// 2. successor wallet setup:
//    *
@NOTE: as soon as a new wallet gets setup and has decrypted the secret feed,
==> 0. if its the first wallet ever, it just starts operating and makes a keypair for a successor wallet, saves the key and never uses that feed
==> 1. if its a successor wallet, it uses its reserved keypair to write itself to that WALLETS FEED ENTRY
    ==> an new successor wallet, when setting up, usually has access to hypernet to download that new feed in the first place
==> 2. other WALLETS will always receive update of successor feed and deny interaction if they see a newer ACTIVE SUCCESSOR WALLET
==> 3. other WALLETS will ACK their inactivity and self deletion as a last entry to their UNIQUE WALLET INSTANCE FEED and delete themselves
==> 4. an ACTIVE WALLET waits for all other other WALLETS confirmed their hand over before becoming active
===> confirm their delete


---------------------------------------

  4. TRANSITIONING
      * transition UI field
        * to load new wallet inside current wallet iframe to transition/hand over everything and destroy itself

      * FAILURE CONDITIONS:
        * ...
      * REPLACEMENT PROCESS:
        * ...
        *
        *

  // 6. SUDOLESS FRIENDLY DELEGATION/YIELD/SWITCH: (only from active wallet, so attacker can also only delegate, not claim without sudo!)
          LOCAL ACCOUNT SWITCH: (on same wallet)
            => makes no difference to VAULTs
            => makes only difference in the USER UI
            ==> all feeds should be up2date and it should use the latest length to not accidentally sync or re-sign old entries
          FRIENDLY TAKEOVER PRTOOCOL
          * RISK
            => 2+ active WALLETS with overlapping secret keys can sign conflicting messages
            ==> make sure not 2 wallets can be active at once!
          1. new wallet must be known to vaults for friendly take-over      (requested takeover)
            *
          2. new new wallet must be made known to vaults via IDENTITY FEED  (forced takeover)
          * wallets are friendly and well behaved!
          0. wallet1: is active! (// @TODO: how does first wallet get active? how do more wallets get made?)
          1. wallet2: connect to any VAULT (can only send sudo commands at that moment)
          2. wallet2: subscribe to other wallet feeds
          3. wallet1: append delegate to wallet2, quoting where active status was received from to wallet1feed
            * indicate last processed request!
            => will self disciplined not accept any incoming requests anymore
          3. wallet2: receive delegate from wallet1feed and can now act until it delegates again
            => will start processing requests
  // 7. SUDO HOSTILE DELEGATION/YIELD/SWITCH: (owner uses sudo to e.g. recover from stolen/lost wallet)
        HOSTILE TAKEOVER PROTOCOL
          * RISK:
            => allow take over even without confirmation from old (stolen/lost) wallet to save/recover what is possible!
          1.
            * destroy vault is user sudo command       => prevent attacker from killing all vaults
            * delegate to wallet is user sudo command  => prevent attacker from delegating
                * no need for sudo delegate, because sudo is always possible, it just requires destroy
          0. walletX: user made it or has access to it and it has sudo capacity
          1. walletX: append sudo destroy command to get rid of malicious wallet
          2. wait until all vaults ACKed it or destroy VAULTS too and wait until remaining VAULTS acked it
          3. now sudo assign new active vault + last processed request!

          NEW WALLET cannot do a normal tak over, otherwise attacker and you can take over back and forth fight
          => lets just have a single active WALLET (on mobile, hardware or desktop)
          CURRENT WALLET *is* around and actively used by and next to user
            => it can switch accounts locally
          1. never friendly delegate to a new wallet not around!
          2. if new wallet is around, you can do a save friendly delegation dance
            WALLET YIELD => delegate to another connected wallet for normal interaction
          3. after success, old wallet becomes passive sudo only wallet until destroyed
          EXCEPTION:
          1. if ATTACKER gets "CURRENT WALLET" => use other wallet to forced take back control
          2. if ATTACKER gets any other wallet => use forced lock out of that wallet as soon as you realize
          3. forced actions require "user sudo password"
          4. overriding force can only issues with IDENTITY PHRASE
              FORCE: use USER SUDO PASSWORD
                2. make backup wallets with sudo password only, which are good enough to restore them into regular wallets too
                3. accept sudo commands from any wallet
                * ...
              OVERRIDING FORCE: use IDENTYTY RECOVERY PHRASE
                * ...
          WALLET YIELD:
            //
            //   1. wallet A issues delegate to wallet B to VAULT 1
            //   2. VAULT 1 acks and syncs to all other VAULTS
            //   3. all other VAULTS ack and all VAULTS once they know ack start accepting new wallet commands
            //   4. wallet B can start issuing commands
            //   PROBLEM:
            //    * if VAULT X goes down, so not all ACKs can be received, i cant even switch back to old wallet
            //    => needs to issue DESTROY VAULT X
            //    => or needs to wait for VAULT X
            //    => or needs to issue undone ... as long as a single




  // //////////////////////////////////
  // //////////////////////////////////
  // 3. REPAIR & RECOVERY:
  // -> DANGER: an old lost WALLET still has KEYS and can sign requests => how to get rid of it?
  // -> REPAIR:
  //   -> use copy of old wallet keys from e.g. IDENTITY SECRET FEED (which exclusively contains ACTIVE VAULT + WALLET keypairs)
  //   -> using wallet keys to sign bitcoin transactions can NOT be revoked!
  //   -> if bitcoin wallet key is stolen but OWNER still has backup owner can use mechanism to transfer tokens to new wallet on time
  //   -> use other old keypairs to DESTROY with standardized conflict/transitioning messages all old feeds: pointing clients to IDENTITY signed successor
  // -> RECOVERY:
  //   -> if WALLET gets lost, IDENTITY KEY is needed to activate a new WALLET
  //   -> others will learn as soon as they are online again by syncing IDENTITY FEEDS and other FEEDS
  //   -> SHIELDED/ISOLATED uses cannot learn anything new anyway regardless of any mechanism
  // ---------------------------------

  // ---------------------------------




























        ATTACK: STOLEN/LOST + CONFLICTS
        ==> a stolen wallet might still sign requests from an old VAULT ... => thats why overriding force recovery needs to get rid of old wallet and vault to limit damage!
          --> so STOLEN/LOST Wallet should always be announced as BROKEN and all its keys must be replaced (ideally on time so no conflicts were caused)


  // LOST/STOLEN WALLET:
  //   => wallet always encryptes everything and decrypts with password for limited time
  //   => idle wallet or other wallet mechanisms ca either cause key deletion and require IDENTITY KEYPAIR to restore
  //   => or at least drop keys from memory and store things only password encrypted
  //   => another iframe containing password can auto-confirm regularly to keep things unlocked, but thats an internal wallet detail
  // ISOLATION IMPERSONATION ATTACK:
  //   if ATTACKER captures old wallet and extracts some user keypairs for e.g. feeds
  //   => just with HYPERSWARMS and HYPERCORES, they can download those user feeds and start appending and swarming them
  //   ==> regardless of wallets
  //   ==> regardless of vaults
  //     * ==> stolen wallet CANNOT update FEEDFEED
  //   => ATTACKER ISOLATES RANDO:
  //   => RANDO download signed data from OLD WALLET FEED and VAULT FEEDS
  //   => RANDO downloads only outdated available data to sync another users IDENTITY+SUB data
  //   => ATTACKER impersonates a user to RANDO
  // SOLUTION:
  //   => given that a stolen wallet always means potential damage
  //   => a stolen WALLET/LOST and affected keypairs for (e.g. feeds) need to deprecated to limit damage as much as possible !!!!!
  //   => IDENTITY FEED keeps track of all user feeds and keypairs anyway
  //   ===> IDENTITY FEED can transition USER FEEDS
  //   ===> by signing transition message of FEEDS to new FEEDS
  // IMPLICATION:
  //   => an OWNER can do damage to a peer by revoking and claiming an attack
  //   => OWNER will need to accept PEER wont trust anymore or trust will be reduced or PEERS will generally onnly trust other trusted or long term peers
  //   => long term peers can be assured by blockchain proofs
  //   => transaction in low trust can be helped by using blockchains
  // WORSE ALTERNATIVE:
  //   if no "recovery mechanism"
  //   => yes peers can be tricked forever by somebody impersonating the original peer forever
  //   => WITHOUT "Transitioning" messages read only peers can think forever they receive information
  //   ==> e.g. subscribe and believe SPIEGEL, even though who or what is SPIEGEL has changed
  //   => thats worse than the original peer tricking them and them learning, because it damages them for maybe a long time AND the original peer
  // ---------------------------------
  // if PersonX (=IMPERSONATEE) learns about updates from IMPERSONATED which conflict with IMPERSONATER late:
  //   => ATTACK: Person_X can be tricked for some time by IMPERSONATER
  //   => FRAUD: Person_X can be tricked by OWNER if they pretend an impersonation attack
  //   RESOLUTION_ATTACK:
  //
  //   RESOLUTION_FRAUD:
  //     => unclaiming is not a proof, but needs people to believe the unclaiming is not a fraud ... they can avoid X if they dont believe it
  // ---------------------------------
  // ISOLATION ATTACK DETECTION:
  //   I can send/forward encrypted messages to random nodes where i believe they are far away from me in the world
  //   and wait for an encrypted answer to see i am connected -> so i can detect whether i am online or offline or shielded/isolated
  //   => my apps should visually indicate my potential shielded/isolated status
  //   ...and all data i receive should be shown with a WARNING






  // LIFE SIGNALS?:
  //
  // WALLET can append "life signals" and announce
  //
  // 1. add feeds into security categories with security intervals
  // 2. allow feeds to be accepted as valid after security interval has passed (expressed in "life signals")
  //
  // 1. feeds
  // 2. restorable identity feed to map feeds onto new feeds
  //
  // 3. map anonymous feed onto NEW FEED referencing idenitty feed in root
  // 4. life signal => sign latest progress of feeds into life signal
  //
  // where does "life signal" device live?
  // how can
  //           * ==> FEEDFEED needs regular ping so others know they are "up-to-date"
  //           * ==> but regular ping means IDENTITY KEY is needed
  //           * ==> or WALLET needs to store it, FUCK!
  // online/offline signal





  // ---------------------------------
  // ISOLATION ATTACK against RANDO:
  //   => ATTACKER impersonates OWNER to RANDO
  // ---------------------------------
  // ISOLATION ATTACK against OWNER:
  //   => ATTACKER blocks OWNER and impersonates OWNER to EVERYONE
  //   => if i am isolated and cant get new feed entries, i am fucked!
  //   => but if attacker shields me from outside and appends more stuff, i can be tricked
  //   => if isolation ever breaks, i will receive old entries with transition message and repair what can be repaired
  //   ==> but it allows a person to also cast such a message later claiming a feed got stolen to make things invalid
  // ATTACK MINIMIZATION:
  //   => datdot random hosters in all regions make sure something is distributed
  //   => friends can have extra connections and publish through a e.g. "plume tree"





  SCENARIO - ATTACKER and LOCKOUT
  // 1. attacker gets my wallet at night and starts using it
  // => likely if they try an attack
  // 2. i discover it a bit later and take new wallet and request take over
  // ==> and then what? ... because attacker can take over again,
  //     * so it requires IDENTITY FEED deletion of malicious wallet
  // => OLD WALLET IS PROBLEM
  //
  // 1. attacker gets new wallet from my back pack and requests take over
  // => likely if the try an attack
  // 2. i discover it a bit later and take old wallet and request take over
  // ==> and then what? ... because attacker can take over again,
  //     * so it requires IDENTITY FEED deletion of malicious wallet
  // => NEW WALLET IS PROBLEM
  //
  // optimizing for either OLD or NEW Wallet is bad, but any wallet should be able to issue a LOCK !!!
  // => what is a LOCK?
  // 1. a LOCK means i LOCK out ... all wallets, because otherwise ATTACK can lock out all wallets
  //    * which they did not capture
  // 2. if LOCK means all Wallets are locked out, the attack can still connect to an independent new VAULT
  //    * or copy over keys and use it with normal keys
  //   => WALLET shouldnt allow key extraction (that buys time)
  //   => ...how to connect a "new vault?"
  //
  // 1. connecting to VAULT works only for one wallet at a time, and attack can battle, so LOCK OUT ALL
  //23. => attacker would first LOCK OUT all wallets and then extract keys to copy onto new wallet and use feeds
  => FUCK LOCK OUT !!!





  EMERGENCY:
  // go to any computer or cellphone anywhere and open trusted WALLET WEBSITE
  // => which connects to VAULT SERVERS (e.g. datdot?)
  // => enter IDENTITY PHRASE, to restore and download VAULT SEEDED FEEDS to get SECRET
  // => list all wallets/vaults => issue destroy
  // => destroy wallet
  //
  // => alternative is a second wallet where sudo password unlocks a destroy,
  // ===> but it does not require IDENTITY PHRASE


  ATTACK INFO:
  // if attacker got wallet, they can copy over keys
  // or create an independent VAULT and connect to it
  // => and start signing and appending messages (like a forced takeover)
  // ==> using existing VAULTS does not matter, because it only logs attacker info, so why would attacker do that?






*/
```
