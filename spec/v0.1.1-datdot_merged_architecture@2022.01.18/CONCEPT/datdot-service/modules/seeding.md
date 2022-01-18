# seeder

## glossary

## process & status
* self selected

-------------

## FRIENDS
NINA: => FRIENDS
Plus we need to also see about the part of the whole datDot that doesn't depend
on randomly selected seeders, but rather friends.
I mean, we can and probably should go step by step,
but this should also be taken into the account.
I am personally looking forward to specially this part <3

# FRIENDS
> We also intend to allow users to designate "non-voting" attestors so they can fine-tune what information the chain collects for them - these attestors will be directly rewarded by the user requesting their attestation and not by minting new tokens.
what's that? :-) it definitely sounds interesting, but i think i'm not getting it

JAM:
you mentioned it a while back
we were talking about a second type of attestor, and you were talking about
how if people wanted they could reward friends for attestations etc.
without them being rewarded by the network
which made perfect sense to me
because at the end of the day the attestations are about service quality
nd you probably want service quality to be good for specific people/places

-------------

## code
```js
const chain = require('datdot-chain')
const service = require('datdot-service')
const vault = require('datdot-vault')

const chainAPI = chain()
const account = vault()

chainAPI.offerAttestation(account, event => {
  // ...
})

// ...

```
