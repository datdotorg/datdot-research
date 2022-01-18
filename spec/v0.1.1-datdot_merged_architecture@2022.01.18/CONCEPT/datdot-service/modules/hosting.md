# hoster

## glossary

## process & status
* selected by `randomness` via `event`
* seeders being challenged in frequently enough (irregular?) from when they start seeding
* they are considered online for as long as they solve challenges
* when they shut down their app or in other cases maybeprocess.on('exit'...
  * could inform the chain so challenges would `pause`
  * after a failed challenge:
    * seeders would need to tell that they are online again so the challenging starts again
    * for the friends scenario i dont know what would be necessary or good

## code
```js
const chain = require('datdot-chain')
const service = require('datdot-service')
const vault = require('datdot-vault')

const chainAPI = chain()
const account = vault()

chainAPI.offerHosting(account, event => {
  // ...
})

// ...

```

---------------------------------------------

# SEEDING
1. randomly select X ENCODERs to encode and compress X archive copies
  * When we select encoders and seeders from which pool do we select?
  * Do we select from all DatDot peers?
  * Or do we select from only those who registered as seeders?
2. randomly select X SEEDERs to store encoded archives
  * Do we know how many copies/seeders we will select for each archive?
3. What about for encoding, attestation...?

JANUARY 9th:
------------
ALEX: => @ninabreznik
1. The chain decides that based on our optimizations, but for now i'd say let's use 1
2. which means you need to listen to the chain event and figure out if the chosen random encoder is you
3. (the pool is all seeders), and if that's the case take the hypercore address that comes with the
4. event and encode it and send it to the seeders address.
5. The process of encoding and starting to seed is independent of the attestation,
6. which only starts happening, once the seeder reports to the chain,
7. that they successfully retreived the entire encoded dataset.
8. This is defined in detail in our hackmd, which included the sequence diagram and now links to it.
9. But there are open questions - basically:
10. how do we send the encoded dataset from the encoder to the seeder?
11. how many copies do we select to optimize matters?
12. what do we do if an error happens in any of the steps?
13. Please open those issues otherwise on the datdot-research repo :-)

----------------
---------------------------------------
random-access-* read/write intercept:

// HOSTER
const feed
const feedE

encoder.pipe(feedE) // PROBLEM: random order

// we can't use the random-access-* module of the
// writable hypercore directly since we can only write to
// it one chunk at a time

PROBLEM:
1. hypercore C needs to store encoded data
2. we can only write to C one chunk at a time starting from 0
3. If B gets data in random order and writes to C will cause random order

SOLUTION - have multiple passes
1. initial replication of B where stores data in memory as it comes in
2. writing it to C sequentially when chunks are available
3. have both B and C have the full data

OPTIMIZATION 1 - trade off better speed for worse storage
1. clear B and make a new B which is proxies reads/writes to C

OPTIMIZATION 2:
1. clear B's data as it's getting in
  * get a read stream for a hypercore,
  * after each chunk is processed
  * clear the random-access-storage for the data

ENCODING:
if encoding is RSA encryption based
=> we need separate ENCODER to hide private key from HOSTER
if encoding is compression
=> no separate ENCODER necessary, but making it possible might still give us flexibility ...maybe

UPDATES:
The problem I see with using separate encoders is how updates will work
The encoder has to act as a sort of hoster where they listen for new changes
to the main hypercore, then ensure the hoster stores the latest blocks
Which might not be a problem?

INITIAL IDEA:
I mean our idea initially was that we work really on a chunk
basis, so every chunk might potentially be encrypted
or compressed with a different encoding because
if we select random nodes to encode
and the hypercore is several gigabytes or even larger
there is no guarantee that any encoder will stay online for long enough

MAUVE
so then a mapping between stored chunks
and how they relate to the original hypercore chunks should probably be stored

NEXT:
so we might even need to select multiple encoders
that work on different parts of the hypercore

MAUVE:
What about this crazy idea: Storing the encoded data in a hypertrie
With hypertrie we don't need to create an append only log
We can store stuff however we want - also in random order
it has probably not much overhead
It'd add some overhead for chunk ranges

- so the key in the hypertrie would be kinda the chunk number
- i actually think a hypertrie might be quite good,
- because it might help with cleaning up unnecessary
- data and deduplicate and so on
- it especially plays well with chunk ranges
- Eventually people will want data purged from the network, too

---
I think the encoder should store the proof for
the merkle tree of the data they've encoded
as part of the encoding process

1. for now we assume, that a random encoder would have no incentive to cheat
  * because they would neither have any relation with
  * the peer who requests hosting
  * nor with the peer who stores hosting
2. we plan to record how often an encoder did the work and that
  * gives him a better ratio than a peer
  * who did not do any work for the network
3. the encoder submits the encoded merkleroot and so does the hoster
  * ...so we know if the hoster received the correct data
4. the hoster could also decode the data and see if the decoded
  * data gives him the correct merkle root for the unencoded data

---

haha, yes, but the problem is that this would make the RSA encryption
encoding impossible and that's our fallback in case the compression scheme
doesn't work out

I think people could use encoders to just straight up break the network
=>Just set up a tonne of them that behave badly

the hoster can check the encoded merkle root and the decoded merkle root and compare it with the data onchain
Cause decoding is cheaper than ecoding

I think the hypertrie will solve the ordering issue and maybe have some more wins

=> NOT VERY RE-USABLE

MAUVE
I think storing encoded chunks of a hypercore, along with proofs, in a hypertrie and loading the data out for a hypercore after is pretty niche. :P

whether it uses hypertrie would be an implementation
detail anyway, but for now it sounds like it could
get the job done quite well regarding the cost/value
ratio :D haha

----

K, so do we have a communication channel between
the Encoder and the Hoster that's encrypted?

I just don't think it'd make sense for the encoder
and hoster to speak using the hypercore protocol.
🤔 We could use Noise though.
That way we can verify identities, too.

https://hackmd.io/6Wyij7_uTbGxfOSSlJOgZQ

It's more that you want the encoder to know for sure
that it's handed the data off to the hoster and that
the hoster is getting data from the encoder
Though I guess the hoster doesn't care too much.

MAUVE
I think hyperswarm paired with noise encryption
would be great

it's like TLS but with different primitives
Each person has public/private keys,
then you do some sort of handshake and have
a streaming cipher encoding the rest of the data
you pass through

