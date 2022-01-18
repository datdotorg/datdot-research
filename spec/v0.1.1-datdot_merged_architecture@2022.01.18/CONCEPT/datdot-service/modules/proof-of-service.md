# PROOF OF SERVICE (= Proof of Supply)
1. ATTESTATION
2. PROOF-OF-STORAGE

--------------------

## PROOF OF SERVICE
PoSer (=Proof-of-Service)
PDP (=Proof-of-Data-Possession)
PoR (=Proof-of-Retrievability)
PoSer = Repeated: PDP + PoR

### PROOF OF SERVICE

1. do some sort of obfuscation for the copies of data to generate
2. a different merkletree for the "obfuscated" copy
  *so that each copy cannot reuse the one

... but i wonder if we might not need that because
1. we assign dats randomly anyway.
2. is that good enough?

---

1. how is IPFS using zk-snarks?


--------------------

# ENCRYPTION ENCODING
JOSHUA:
yeah the issue is that we didn't want symmetric crypto because that would mean whoever knows the key could falsify the tree
- ideally we'd be using a sign method that allows us to specify what is being signed (not a hash of what is passed as a message, but the entire message.)
1) if only the hash of the chunk is signed,
  * it doesn't need to be local, and you can grab the real data from the Swarm.
2) if the chunk is encrypted with symmetric cryptography,
  * you don't need to store it locally and can grab it from the network and reencrypt it yourself.

SUBSTACK:
i think it's the same threat model signing an ephemeral key
as it is encrypting the whole message with the private key, just much slower
the sodium routines for this sign an ephemeral key
for a symmetric cipher anyway as i remember

SERAPATH:
* `ALICE` encrypts a message msg with BOBs publickey `pk` to generate cipher `c` and sends it to `BOB`
* BOB decrypts the message msg by applying his secretkey sk to cipher c is a lie
  * All schemes seem to use diffie-hellman to generate a shared secret
  * and use it for encryption/decryption.
  * This is really unfortunate, because the whole point is to avoid the receiver
  * BOB to generate the cipher c from msg and that won't work with
  * symmetric encryption/decryption

* oh and also for the signing schemes, it seems to me,
  * that no single signature verification procedure actually recovers any meaningful input
  * like hash or message or anything chosen, but instead it recovers a value R
  * that was created by the sender and sent along with the message by applying
  * the verification method to the message or something...
  * not sure yet and don't know if there is a way, but it looks dark :/

* The only families that i'm trying to research and that i am aware of is anyway:
  * elliptic curve
  * RSA
  * ElGamal

## ENCODING with ASYMMETRIC ENCRYPTION/DECRYPTION

### LIBSODIUM
**PROBLEM:**
`sodium.cryptoe_box_seal_open` needs `secretKey` and `publicKey`
  * which is bad: "RECEIVER" should only need one key to unseal.
  * also the method requires you to provide both keys...
  * different sodium/libsodium implementations always require both keys when decrypting
  * where do you see that nonce is generated using the key?
    * does it just need to be a `random number`?
    * => https://sodium-friends.github.io/docs/docs/sealedboxencryption#crypto_box_seal_open

```
"The function creates a new key pair for each message,
and attaches the public key to the ciphertext.
The secret key is overwritten and is not accessible after this function returns."
so it's not the key you provide, it's a new ephemeral key @serapath
```

**POTENTIAL SOLUTION:**
1. can you include the `nonce` in plaintext with the "message"?
  * BUT: libsodium method does not expose the `nonce` it uses

=> so maybe fork libsodium and change this?

**POTENTIAL SOLUTION:**
1. make the encryption a second type of challenge
2. encryptors submit a hash of their private key
3. and then after they have both
  * an alternative encryption (someone else or themselves) of the same chunk
  * and a valid challenge for that chunk
4. they make their private key public and burn it

=> basically challenges become a public challenge-response between encryptors and seeders
=> but the simple solution would be to find an alternative to libsodium

THOUGHT:
overly complex and also more expensive
* even if it's only for the small task of creating new public/private keypairs all the time i guess

**HACKY TEMPORARY SOLUTION**
i wonder - maybe libsodium is internally using some more low level parts that can be used
i just wonder - is there a cryptography support group to bounce this with?
...i am sure i can hack around and make something work,
but i kinda wonder how "secure" that is :D
anyway - maybe we should only make it work and once it's out there,
maybe smart cryptography people will open issues and complain
about all the crap and tell me how to improve it :)

JOSHUA:
right, we might be able to work with signatures for now,
although technically they don't provide the guarantees we need,
they do have the right api :s

SUBSTACK:
@serapath the sodium routines for asymmetric crypto don't use DH. you would only use DH to create a shared secret for ephemeral sessions

SERAPATH
@substack maybe it's not DH, but as far as I understand, some shared secret stuff is going on.
Our idea is or was based on true one-way-decryption, so a receiver can decrypt a code into a message, but can't create the code from the message, so if they want to keep the code, they have to store it.
```js
const sodium = require('sodium-javascript')

const publickey = Buffer.alloc(sodium.crypto_box_PUBLICKEYBYTES)
const secretkey = Buffer.alloc(sodium.crypto_box_SECRETKEYBYTES)
sodium.crypto_box_keypair(publickey, secretkey)

const message = new Buffer('hello datdot :-)')
const code = Buffer.alloc(message.length + sodium.crypto_box_SEALBYTES)
sodium.crypto_box_seal(code, message, publickey)

try {
  var decryptedmessage = new Buffer('')
  // @NOTE: Why is the `publickey` parameter necessary?
  var bool = sodium.crypto_box_seal_open(decryptedmessage, code, publickey, secretkey)
} catch (e) {
  var size = Number(`${e}`.substring(43))
  var decryptedmessage = new Buffer(size)
  var bool = sodium.crypto_box_seal_open(decryptedmessage, code, publickey, secretkey)
}
const msg1 = message.toString()
const msg2 = decryptedmessage.toString()
console.log(msg1 === msg2, msg1, msg2)
```
I have a hard time following what is going on here
https://github.com/sodium-friends/sodium-javascript/blob/master/index.js#L1771-L1789 ,
but why is the publickey parameter necessary?
It messes up everything, because now the receiver needs to have both keys to decrypt,
but it also means he can create the code from the message


--------------------

# BROTLI COMPRESSION ENCODING


ALEX: => BROTLI ALTERNATIVE
he encryption - whether compression or asymmetric encryption will happen off-chain,
which is for now implemented in javascript,
so do you think we could try with this one? https://github.com/foliojs/brotli.js

JOSHUA:
=> you need the roothashpayload to verify the root hash,
and you need the root hash and public key to verify the signature?

ALEX:
yes, but do we need the whole list of [hash, hash_number, total_length]
or just the latest?

ALEX: => BROTLI ALTERNATIVE
regarding brotli - i'd like to try to implement a timing test to setup a challenge to run the chain locally and measure the differences in times if my computer needs to run the encryption or has the encrypted chunks already available to submit it to the chain :-)
do you think that would be a good next step?
how could we setup such a test? :-)

uhh if you want to do it in js I don't know, maybe iterating through the chunks of a large hypercore and timing how long it takes?
and yes, you need the whole list - Nina can confirm those are just the roots
I was thinking of doing the brotli compression in an offchain worker
but I realize that it may be difficult to do that and then let you expose those chunks to the swarm
(unless someone can expose a http endpoint I can drop the compressed chunks into 👀)



--------------------
# CRYPTO

`SUBSTACK`
@serapath sodium-javascript uses https://www.npmjs.com/package/xsalsa20
to implement cipher_stream
that's for symmetric crypto
usually, algorithms will use asymmetric crypto to encrypt the key for a symmetric cipher, because symmetric ciphers are much faster
also, sodium-{javascript,native} provides cryptobox routines which are asymmetric

`SUBSTACK`
oh yeah lol don't use the "libsodium" library on npm. maybe that is the problem?
https://www.npmjs.com/package/sodium-universal



--------------------

## 1. ATTESTATION

# challenges on chain??
ALEX:
1. ...but doing research it seems that universities around the world are lying
2. the mickey mouse version of public/private encryption/decryption doesnt exist
3. they all use Diffie-Hellman to make a shared secret and then use that for encryption/decryption
4. the shared secret is deterministic based on the key pairs of the involved parties
5. it's has nothing to do with messages
6. so, a recipient decrypts the message with their private key
7. by creating the shared secret using the
8. public key of the sender and using that to decrypt
9. but they can also use it to encrypt it again

JAM:
1. only for the reencryption stuff which tbh I haven't started implementing yet
2. we can focus on friends/attestations
3. and fallback on normal merkle proofs for onchain
4. attestations still need to be tallied onchain
5. => random attestations that is


## 2. PROOF-OF-STORAGE

### ON CHAIN


#### ENCRYPTION SCHEME
JOSHUA: => PROOF OF STORAGE
well, everyone takes a couple of explanations to understand the purpose of the encryption
- because we are not actually encrypting for the sake of encryption.

NOVEMBER 8th:
-------------
ALEX:
yes
but calling it signing
which in my opinion is what it is
...is also misleading, because signing is usually not done like this, right?

JOSHUA:
right - maybe "a signature containing the entire chunk"
a recoverable signature*
is more clear


Alexander Praetorius
what is "recoverable"?
from the signature go back to the chunk?

JOSHUA:
signatures either contain the message they sign, or they don't



##### ENCRYPTION SCHEME - LIBSODIUM
-----------------------
FROM JANUARY 6th:

SERAPATH:
> @substack
>
> > sodium-javascript uses https://www.npmjs.com/package/xsalsa20 to implement cipher_stream
> > that's for symmetric crypto
> > usually, algorithms will use asymmetric crypto to encrypt the key for a symmetric cipher, because symmetric ciphers are much faster
> > oh yeah lol don't use the "libsodium" library on npm. maybe that is the problem?
> > https://www.npmjs.com/package/sodium-universal
>
> thx. right - i don't want the symmetric crypto. also i was trying with `sodium-universal` and `sodium-javascript`, but they are based on elliptic curves and it seems the "asymmetric crypto" to generate the shared secret (diffie-hellman) derives from the involved public/private keys and can't be used on custom data, so it seems it's impossible to use libsodium to solve our use case, but if you think different and have some idea, please share. I'm currently looking for other asymmetric crypto schemes and hope to find something that can actually pull this off.
>


##### ENCRYPTION SCHEME - ElGamal

##### ENCRYPTION SCHEME - RSA

##### COMPRESSION SCHEME - BROTLI
1. SEEDER START
  JOSHUA: => BROTLI ALTERNATIVE
  1) don't we just have to send the instructions for the encoding?
  and afair that can be public so just onchain or in an event

2. COMPRESSION
  ```js
  // 1. I run it in the root of datdot-service
  const brotli = require('brotli')
  const fs = require('fs')
  // 2. it fetches src/types.json as a file to encode/decode
  const file = fs.readFileSync('src/types.json')
  const length = file.length
  // encode some data with options (default options shown)
  const encoded = function getEncoded () {
    return brotli.compress(file, {
      mode: 0, // 0 = generic, 1 = text, 2 = font (WOFF2)
      quality: 1, // 0 - 11
      lgwin: 50 // window size
    })
  }
  const decode = function getDecoded () {
    return brotli.decompress(fs.readFileSync('encoded.js'), length)
  }
  fs.writeFile('encoded.js', encoded(), (err) => {
      // 3. compression (=encoding) - all of it - happens in a second
      // 4. @TODO: So how do we now make the encoding super long and decoding super fast ?
      //   JOSHUA:
      //   => 1. max out quality?
      //   => 2. we can probably wiggle around the window size as the "random" parameter
      //   => 3. we don't particularly care about the actual compression ratio
      //   => 4. I think 8 is the highest ratio that is "standard" between implementations
      //      => if we think "standard" matters
      if (err) throw err;
      console.log('File encoded and saved!')
      fs.writeFile('decoded.js', decode(), (err) => {
        if (err) throw err;
        console.log('File DECODED and saved!')
      })
  })
  ```

### OFF CHAIN
but on the other hand, i was also thinking maybe we can similar
to the attestation have the merkle-proof stuff happening off chain
if that's not what we have currently planned.

# what about challenges off chain too??
**Which means:**
1. select a RANDOM VERIFIER
2. receive random BLOCK(S) from SEEDER
3. MERKLE-VERIFY off-chain
4. submit RESULT
5. => allow challenge period ... OR: do multiple tests per challenge by multiple RANDOM VERIFIERS


=======================================================================

NINA: => PROOF OF STORAGE
https://www.youtube.com/watch?v=L826rIziNMQ

=======================================================================
ALICE:
1. Alice has a message M which she hashes to H
2. Alice now use her secret key SK to "encrypt" H into the signature S
3. Alice sends S and M to Bob

BOB:
4. Bob hashes M to H
5. Bob uses Alice public key PK to "decrypt" S into H'
6 Bob makes sure that H === H'

JAM
not the case - signing!=encryption/decryption much of the time

Alexander Praetorius
There are many different hashing algorithms out there
1. SHA1
2. MD5
3. SHA3
4. BLAKE2b
5. BLAKE3

...

and i guess maybe they require the "HASH" to be of a certain length and nothing else?

how does signing work?

JAM
1. varies widely based on the scheme unfortunately.
2. but generally you have "compressed" and "uncompressed" signatures
3. (or in sodium language, detached)
4. the uncompressed signature is (signature+hash) where you can verify a message by hashing it,
5. comparing against the hash, and validating the hash against the signature
6. that's not always a decryption
7. but the "compressed" signature is just the signature component from (signature+hash)
8. either way you need the message and the pubkey of who signed it to verify, right? but I think for
9. some schemes there's no hash intermediary


Alexander Praetorius
10. how do you "validate the hash against the signature" ?
  * => depends on the scheme


Alexander Praetorius
1. i understand that you need the message
2. because that's where you get the hash from
3. or compare the hash to the hash contained in the uncompressed signature, right?
4. JAM: right


1. some schemes the uncompressed signature contains the entire message in plaintext
2. because they don't use hash based signing
3. it doesn't really make sense not to hash your data and then sign the hash in that case
4. => how do you "validate the hash (or message) against the signature" ?

JAM
1. everything online says you encrypt with your public key
2. and decrypt with the private key to verify,
3. but I know(?) that isn't the case in elliptic curve cryptography,
4. which is what we're working with:
  * https://cryptobook.nakov.com/digital-signatures/ecdsa-sign-verify-messages#ecdsa-sign


JAM:
1. tl;dr that link above basically says you use the message,
2. some random number,
3. and your private key to generate a point which is your signature
4. the verifier can use one coordinate of the point and the message hash
5. to regenerate the random number and use your public key to calculate
6. the second part of the point, if it matches the point you provided,
7. the signature is valid. because elliptic curves
8. whereas in RSA it's not encryption and decryption either, signatures are based on modulus
9. https://crypto.stackexchange.com/questions/9896/how-does-rsa-signature-verification-work
10. => RSA signatures are exactly what we need
11. => but also RSA is a lot slower and heavier and i wonder if network IO would still be the bottleneck

=======================================================================

JAM:
they don't use an encryption, they just use a slow encoding

we can probably find some encoding that is slow to Encode and fast to decode, and repeat it multiple times over the same data
we probably don't gaf about proof of space, but proof of retrievability we can just rip off completely :p

NINA:
https://www.youtube.com/watch?v=8_9ONpyRZEI
so basically we just encode with some process that takes like half an hour
and when the seeder needs to send a proof, even if they grab data from the swarm, they will need to encode it, which will take too long, so they will respond with a huuuge delay
am i understanding it correctly?

JAM:
backwards.
no you're understanding it correctly
but we also want the decoding process to be fast enough that seeders can actually participate in the Dat network
otherwise the optimal strategy is to maintain two copies of the same file which isn't great

ALEX:
hm, but it does not sound like it solve the outsourcing attack
i can store a copy once instead of 10 times
i also don't understand what they actually send me
if the send me a piece of data that is encoded slow, but then decrypted fast to send me the chunk i request
oh wait - so they send me the encoded chunk
and i as the attester decode it

NINA:
or they send a hash of encoded thing and you as an attester also do the encoding first and hash it and then you can just compare the hashes??

JAM:
you'd be doing proofs on a mirror hypercore where chunks are encoded (instead of encrypted)
same thing as before

ALEX:
i dont get it
is every encoded hypercore differently encoded?

JAM:
the final part of the puzzle.
yes
we use compression

ALEX:
lossless?

JAM:
ofc. and each hypercore will have different compression ratios
or different amounts of passes
thoughts?

ALEX:
we still want to shuffle who stores from time to time
so the slow encryption has to happen quite often
which encoding is it exactly?
whats the name of the encoding, how does it work?

JAM:
brotli compression or we can rip off ipfs zigzag

ALEX:
i still don't get it
so a seeder receives hypercore chunks
and then compresses them
if there are currently 10 seeders for a given hypercore
they will all somehow have a different brotli encoding?
of the same data?
what prevents the outsourcing attack?
or - if i manage to get a specific hypercore assigned more than once - what prevents me from storing just one copy?

JAM:
no I'm saying we still have the same idea as before, where we have special encryptors/encoders/compressors

ALEX:
i thought this replaced the asymmetric encryption idea
replaces

JAM:
the time it takes to compress/encode makes the outsourcing attack implausible
especially if you have unique parameters for the compression determined by the compressor
it doesn't have to be secret, it just has to take more time to replicate than it would to grab over the network
and you get the added benefit of not having to use as much disk space as a seeder

ALEX:
maybe i don't have a good understanding of compression.

what prevents me as a seeder, once i seed data, to uncompress and recompress it in any way?

JAM:
you'd have a different hash for the recompressed file

ALEX:
why exactly?

JAM:
unless you used exactly the same parameters to compress the file, the compression would be different

ALEX:
is this cryptographically secure? ...like how many possible parameters are there and ...i can't figure out the parameters from the compressed version?
i'm not so familiar with the compression algorithms

JAM:
also we don't necessarily care if you download and recompress the file, we only care that it would take longer to do so than to just use the original compressed file you got

NINA:
https://youtu.be/8_9ONpyRZEI?t=1022

JAM:
we only care that decompression is faster than compression, and we only ask for proofs from compressed files.

If there's some minor difference between compressed files that resolves outsourcing

NINA:
here the guy explains it with math, i am just watching, not sure if it answers all our questions

ALEX:
yes, if there are

ALEX:
who compresses?
and how does the seeder get the data?
and how does the chain get the merkle roots for the compressed hypercore?

JAM:
1) the compressor, and then they submit the merkle root they calculate, and the params they used are public but unique
2) they compress the same way and verify that they get the same root
3) see 1
but hey honestly can we defer everything but our current api to "month 2"?

ALEX:
yes i think so.
.....but lets anyway figure out the concept :-)
what if somebody has a fast computer?
and somebody has a slow computer?

JAM:
then they have an advantage/disadvantage iff they want to cheat
iff

ALEX:
if i want to cheat, i buy myself a very expensive machine which is fast ...because datdot is meant to be run by average people on their average machines ...so i can easily be an order of magnitude times faster
hypercores i request are meant to be big
and yes it takes resources to compress chunks just in time
and retrieve them
, but its just for the challenged chunks
so i can skip encrypting and storing lots and lots of data
the more i watch ninas video, the more i see mountains of complexity
:D

JAM:
you know what would be ideal?
we make challenges generic
and allow communities to define their own threat models

NINA:
how to set the time was the question for this researcher and juan benett responds :)

https://youtu.be/8_9ONpyRZEI?t=1862

ALEX:
i mean - there might be many flaws with this
but - essentially, especially given the answer nina just linked, which is what i assumed
an attack needs a much faster computer than the average peer in the network and he will manage
...so going down this road in general is maybe the only option we are left with if there is no way to use asymmetric encryption

JAM:

allow communities to define their own threat models and members, and then like, let them talk to each other and deal with their own security.

ALEX:
...but it also means, that people with specialized hardware will be again the ones winning

JAM:
and our security model will be the simplest thing we can think of by the time we have to implement something

ALEX:

who has the best hardware can free ride
thats ridiculous :D

NINA:
maybe it's worth to take ridiculously long encoding time to make sure no one even
with the craziest computer can cheat

ALEX:
we are talking about small chunks

NINA:
is long encoding === lots of energy consumption?

because washing machine for example uses more energy if you want it to wash in 1h and it's super eco friendly if you let it run for 3.5h

ALEX:
and we also need to shuffle seeders regularly
so we need to regularly repeat the "ridiculously long encoding time"

NINA:
i mean, we need to give people whole files and then chalenge just the chunks
this is how this guy said they would do
you can quickly encrypt, so they chalenge you many times for random chunks and you always need to respond fast and one challenge is actually set of chukified challenges

ALEX:
ok, here is the thing.
anyone could rent a cluster of amazon computers to speed up the process.
its the same work, but instead of a small computer compressing for a long time, its a super computer compressing for a short time.

the advantage is thought, that you only ever have to do that work for the chunks you are challenged for, while a normal peer needs to do that work for the entire dataset

NINA:
fck it, while we are encoding, no one is losing

ALEX:
yes, maybe challenging for enough chunks at a time from the same peer, maybe helps...
@jam10o whats the javascript library that can do this stuff?

NINA:
we can ping this researcher . he's on twitter. and he doesn't work with filecoin

ALEX:
so we need a compression library that can take compression params which can be varied enough,
so that there is extremely many combinations for compression
and ALL of those combinations lead to a very long compression time
and an extremely fast decompression time
@ninabreznik wanna ping him?

JAM:
what stuff? my dumb compression idea? or the specific algos this dude is describing?

ALEX:
your dumb compression idea
i'm all for keeping shit simple

JAM:
because either way it's quite likely it's implemented in Rust or c and I think we could stick it in offchain workers.

ALEX:
he is a researcher, so he also has an incentive to make custom stuff

JAM:
I found this, which is perfect because it's already no-std https://github.com/dropbox/rust-brotli

NINA: => IPFS PROOF OF STORAGE RESEARCHER
https://twitter.com/benafisch
just sharing the link if we even need to get in touch


ALEX
can brotli take tons of time to compress and very quickly decompress and have enough room for params to generate different outputs deterministically based on the compression params?


JAM
right, brotli is optimized for client side decryption, which is why I looked for the rust implementation
also look at the last item in "what's new in 3.0"
no-std implies determinism

ALEX: => PROOF OF STORAGE BREAKTHROUGH?!?!?
so i see it like this:
IF there is a compression algorithm that works like described above
(basically your idea @jam10o ), which means:
1. params for compressing 1 file to ideally infinite different outputs,
  * but deterministically so if the same params are use
2. takes very long to encrypt
3. is very fast to decrypt

...then maybe this is an option


NINA
this is filecoin's research paper on proof of replication from 2017
https://filecoin.io/proof-of-replication.pdf

ALEX
i don't understand the "what's new in 3.0"
I read something about "magic number", but not sure how it works
so the brotli header has a few magic bytes based on the input params?
but what if i store the header and then use different brotli params, take the output and add the same header?

NINA
and this is full analysis on zigZag poRep
https://web.stanford.edu/~bfisch/tight_pos.pdf
lol
https://github.com/filecoin-project/research/issues/150
https://github.com/filecoin-project/research/labels/zigzag-analysis
https://github.com/filecoin-project/research/issues/141
sorry i am spamming :)
https://www.google.com/search?q=proof+of+replication+encryption&sxsrf=ACYBGNS1LdKR-BOjYzDup98oayAw4aY1Mg:1578444186805&source=lnms&sa=X&ved=0ahUKEwiam7Xo4vLmAhXRyDgGHVASDC4Q_AUIDSgA&biw=1920&bih=952&dpr=1

ALEX
i skimmed through the stuff and i don't get the impression that they ever thought about the asymmetric encryption approach at all ...but also we are not sure if that would actually work - but there is still some hope
other than that - i get the impression that they are complicating a lot and i think the reason is that they hire a lot of researchers and have a lot of money and everyone justifies in their way why things have to be in a certain way, but yeah - lets see
otherwise - i think the compression method might have potential, but before being able to think it through, there needs to be some better understanding of the capabilities of the encryption library we are going to use

NINA:
@jam10o any suggestions how to understand that better?
@ninabreznik the google link talks about "symmetric keys"

-------------------------------------------------------------------


JAM:
I mean brotli is pretty ideal
slow compression fast decompression
https://www.opencpu.org/posts/brotli-benchmarks/

ALEX
1. how slow is slow?
2. how fast is fast?
3. how many different equally slow compressed versions of the same input data can you make, each based on different input params?

JAM:
I think there are 8 levels of compression at least, and the magic number (I need to verify if this effects anything but the header, but IIUC you can't go into the archive and manipulate certain parts without breaking the whole thing, but my understanding is not complete) would make it "countless".
the times in the link I shared were in ms I believe
so like 35s to compress 18kb*1000
18mb
and ~200 ms to decompress that file 1000x

ALEX:
i mean
brotli was not made with that use case in mind

JAM:
no, the only things that were made for this usecase is PoRep algos

ALEX:
8 levels
means only certain levels are slow the others are fast?

JAM:
right

ALEX:
and does it mean only 8 different outputs for the same input? ...or is that different output based on the magic number?

...but if there is a magic number output, then why wouldn't i just store the magic numbers and discard the rest and on challenge, for any of the duplicated copies, i always use my one copy but combine it with different magic number headers
but i dont store the data part multiple times

JAM:
different output based on the magic number. I'm reading the rfc and I'll get back to you about that lol

what I'm hoping is that magic number changes the rest of the output in some way

ALEX
cool.
oh also - you said you would check or think about the "dynamic validator set"
side note:
1. storage = free read only ?
2. functions = costs because it's a "write" ?
...is that how it works?

JAM:
@serapath yeah, my current plan is that I would add all seeders, attestors, and users to a fake "balance" module that just discards all rewards and only punishes slashes with "suspension". that balance module would be what the staking module uses for stake
but all I have is an empty file and an idea atm. I've already cleaned up the main runtime though
storage is free read only when accessing off-chain. onchain all storage operations are expensive
but yeah, functions are not like Ethereum where you have stateless/static functions - those should be in storage.

ALEX:
makes sense
---------------------------------------------

