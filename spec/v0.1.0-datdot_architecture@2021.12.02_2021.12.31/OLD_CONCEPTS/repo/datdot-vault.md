# `playproject-io/datdot-vault`

### 5. VAULT - `playproject-io/datdot-vault`
SIGNUP FLOW - make ACCOUNT
1. users create a public/private key pair
2. ...maybe even using some master key...
3. and having a good backup mechanism?
4. ...using shamirs secret to split the key and give parts to friends?
5. ..and then once the chain stores their user ID
  * it could allow them to also store their public key
  * and/or even update their public key
  * and they could use all of that to do those off-chain handshakes
6. **FIRST MILESTONE:**
  1. generating a public/private keypair
  2. storing it on disk
7. **USE CASES:**
  * the chain announces an event all nodes listen to 
  * (which user ID's have been selected as hoster and encoder) all the time,
  * but once a hoster wants to connect to the encoder,
  * ...where they don't know each other,
  * how would they know the correct public keys?
  * so wouldn't it make sense to allow users to store/update their public keys
  * on chain?
  * anyone can always create a new user ID and upload a public key
  * initially and then change it as often as they want but they need to sign
  * such changes with their private keys i assume
  * is that what you have in mind too?

----------------

# Keystore (crate from substrate)
A subsystem in Substrate for managing keys for the purpose of producing new blocks.
