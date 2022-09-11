## ONBOARDING


# TRANSACTION FEES
but i couldn't do this when I was creating accounts etc.
bc here you get default accounts, so no hassle with that
oh, btw. did you already make the gas cost to 0?
Then I can finally try to execute tx with newly made account.
So far I've always been using test accounts only

I removed gas but that was only for the contracts module.
I haven't removed transaction fees, should I do that along with the fix I'm currently working on?


## INSPIRATION
```js
function signup(email) {
    // Your own internal logic for creating an account and getting a user_id
    let user_id = create_account(email);

    // Identify user with internal ID
    posthog.identify(user_id);
    // Set email or any other data
    posthog.people.set({email: email});
}
```

### MAKE ACCOUNT
```js
const { Keyring } = require("@polkadot/api")
const { randomAsU8a } = require('@polkadot/util-crypto')
/************************************************
  OFFCHAIN ACCOUNTS
************************************************/
const keyring = new Keyring({ type: 'sr25519' })

// default accounts
// => are a bit secial on 'dev chains"
// ==> they are pre-funded with balance
const ALICE = keyring.addFromUri('//Alice')
const CHARLIE = keyring.addFromUri('//Charlie')
const FERDIE = keyring.addFromUri('//Ferdie')
const EVE = keyring.addFromUri('//Eve')
const DAVE = keyring.addFromUri('//Dave')

// make account
const seed = randomAsU8a(32)
const NEW_ACCOUNT = keyring.addFromSeed(seed)

console.log('Alice', ALICE.address)
console.log('New account', NEW_ACCOUNT.address)

const SERAPATH = keyring.addFromUri('//serapath')
/************************************************
  SIGNUP (=make PROFILE)
    => via extrinsic/transaction
************************************************/
const message = ''
const signature = SERAPATH.sign(SERAPATH.secretKey, message)
// associated `AccountId` with MESSAGE (and "sender")
// => Blockchain takes FEES from "sender address"
// => `key` follows same crypto signature as blockchain
// ==> so it validates keypairs
try {
  chainAPI.signAndSend(signature, message)
} catch (e) {
  console.error('not enough funds on balance to pay fee')
  // e.g. transfer BALANCE from //ALICE to //SERAPATH
  // => then try again :-)
}
```

### SIGNUP (make PROFILE)
1. unknown user X makes keypair
2. X wants to publish service offer to earn ratio
3. X needs ratio to add extrinsic which publiches service offer
4. PROBLEM: X needs funds to publish service offer to earn funds?
5. PROBLEM: interacting with blockchain without paying fees `=> SYBIL ATTACK`


PROBLEM:
1. new users have no
2. new uers can offer hosting to earn ratio only once they have ratio




**QUESTION:** when i `.signAndSend(extrinsics)` with my private key, how does the chain know i exist and/or charge me eventually?

1. receive funds from somebody via transaction to my "public address" (to be aware of public key)



```js
const who = 'T::AccountId'
const amount = 'T::Balance'
// can be an unsigned transaction and will fund an account
give_me_funds(who, amount)

onchain_faucet() // free to call regarding `ratio`
// => competitors might DDos you
// ==> micro proof-of-work mining function
    // cost more in computation than
    // it would give them in terms of value
    // to pay for future fees
// => allowing people to earn drip tokens from your blockchain

// PROBLEM: people would start mining
// => if PoW is more expensive than
// => what they could request per call
// ==> PROBLEM: ppl just do useless work to get tokens to get something for free


// IDEA: if price on market goes higher than X, using the onchain_faucet() becomes feasible

// ---------------------

// ADDITIONALLY:
// add, that it records who gives funds so that the chain will re-imburse them
// as soon as that account which requested funds will earn their first funds
// by:
// You would additionally put a lock on your funds you give via the PoW
// so it cannot be transferred or used in ways other than how you want
// => being able to spend the received funds only for the defined set of transactions
// => REQUIREMENT: need a custom balances module to do some of this stuff

// ==> You could build a PoW blockchain if you want to start with truely zero balances for everyone.
// ===> building the micro-PoW module should be relatively trivial

LIKE:
1. request invite
2. invite lends funds
3. requester burns in PoW more than would get
  + have to give it back

A "deposit" of sorts is critical to keep these blockchains from undergoing attacks.
If your code does more logic after a valid extrinsic, it needs to have a deposit or payment taken to be economically sound.
```

or

```js
// 1. submit unsigned extrinsics for our PROOFS
// 2. if PROOF is valid, it will validate
// 3. otherwise the EXTRINSIC is ignored

// => generating loads of "valid" extrinsics is an attack

// ==> proofs are time sensitive
```

```js
// NORMAL

In the world of PoS, bootstrapping happens via ICO or a Lock Drop or Token Drop or something. Basically, initial balances are almost always defined in Genesis. And any new balance is accumulated through the staking system
```

GET PEOPLE STARTED:
1. semi-automating an "invite" system
2. funds given can only be spent in certain ways
3. work like micro loans
4. those who provide can earn on top
5. it bears a risk, because sometimes people might default
   * which means its a loss
6. provide micro funds to get others started might
   * request further information
   * e.g. telegram,github,etc... account to check ppl

BLOCKCHAINS:
1. establish rules
2. punish malicious actors
3. charge ppl for using it
4. reward block production contributions

SERAPATH
1. initial couple of transactions are free, so its cheap anyway
  * if they are connected to a proof of work, then i think thats fine to protect from abuse
  * if you have a friend, you can ask them, so you don't have to do that proof of work thing

when you said that we could make sure those initial granted funds to get started are only to be spent on certain transactions
(e.g. start offering a service to the chain to earn your own funds)
did you have "meta transactions" in mind?
==>
So you could prevent funds from being transferred,
but not to be used for just a specific function call.
That would be the custom wrapper/pallet or something you would need

// ---------------------------------
i think this would be a super cool mechanism to have for all kinds of on-chain governance scenarios,
so somebody makes a little "micro-roadmaps" (a set of transactions they would like to do,
but don't have the funds for) and publish it to the chain with a proof of work
that is more expensive than executing those "micro-roadmaps"
which means a set of extrinsics to be published
after the funds to pay for them have been received.

The idea is, once that "startup" phase is done,
people would be in the position to make "revenue"
and then they can pay back their "investors" :-)
// ---------------------------------

```js
// However, thanks to public/private key pairs
// => users can sign meta transactions
// => and incentivize miners to pay the gas for them.

const roadmap = [ // = script
  { fn: 'offerHosting', params: [] }
]
// Reward: Economics are important to incentivize a decentralized system.
// If you want ‘desktop miners’ to pay the gas to submit your transaction, you’ll need to pay up.
// These funds will not come from your account.
// They will come out of the identity proxy smart contract.
// Ether or tokens can be used to pay miners.

// Requirements: There can be extended requirements that are checked within the smart contract too.
// One example is a chronological check.
// Let’s say the transaction can only go through at the end of the month.
// The contract can verify this.

// -----
// Next, instead of sending my transaction directly to a smart contract,
// I’ll send it to a secondary network.
// The network can parse my request and make sure my signature is valid.
// They then choose what transactions are worth submitting
// and interface directly with the blockchain.
// Finally, when my proxy contract receives my transaction
// sent from a third party, it will parse the instructions,
// pay the third party, and execute my commands.
// These instructions could be sending tokens,
// calling functions, or anything a normal blockchain transaction can do.
//
// This contract will hold funds and tokens on your behalf
// and act as your on-chain identity.
// Then, as new devices come in and out of your life,
// you can tell your identity proxy to trust them.
// These devices never hold funds and their private key is never moved.
// At the same time, they are able to interact with the blockchain using meta transactions.

// -----------
// here are the current things you can "lock" our balances pallet with:
https://github.com/paritytech/substrate/blob/6e0a4877afbe2309e106b84333bb70200531b604/frame/support/src/traits.rs#L628

chainAPI.apply(roadmap, event => { // free function
  // "free get-started meta-transaction" would require a verifieable micro proof-of-work on the side of the yet-unkonwn submitter, which makes submitting that "roadmap" meta-transaction computationally more expensive than the funds necessary to execute it
})

chainAPI.offerInvestment(event => {
  chainAPI.grantInvestment(event)
  // blockchain records it to refund them
  // if that user then ever starts earning
})
```
PAYMENTS:
* someone needs to pay for extrinsics to prevent DDoS Vector
* pay with opportunity costs (provide chunks for free if you are above a certain ratio)
