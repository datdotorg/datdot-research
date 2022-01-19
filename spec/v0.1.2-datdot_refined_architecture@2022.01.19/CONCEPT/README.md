# CONCEPT

## ROLES - assignment of ROLES needs to have a PEERS SET to select from
NODES come and go, so having role assignment per SESSION (=time window) or a ROLLING algorithm is important

### SUBSTRATE NODE
1. CHAIN      - (=rules) (=for `Proof of Data Possession` **PoDP**) to verify storage

### DATDOT NODE
0. PEER    - (= `Account`, `Actor` or `Identity`)
1. HOSTER     - (=stores hypercores) is `PINNER`
2. PUBLISHER
3. BACKER     - (=is BACKING THE DATA) is `SUPPORTER`
4. SEEDER     - (=friends) is `PINNER` and `SUPPORTER`
5. ENCODER
6. ATTESTER   - (=for `Proof of Retrievability` **PoR**) to verify hosting
7. VALIDATOR  - (=chosen from to produce blocks) Authorities are the actors, keys or identities who, as a collective, manage consensus on the network. AuthorityId can be used to identify them
8. PRODUCER   - (= `Block Author` or `Block Producer`)

### DAT PEER
1. AUTHOR (=owner/creater of hypercores)
2. READER
3. SWARMER

## SUMMARY
1. `publisher` selects `dat address` they want to see `hosted`
2. `seeders` (friends or folks interested in the data) volunteer to provide disk space to store and seed the data for free
3. `hosters` want public recognition and provide disk space to store and seed the data to have it publicly accounted on chain
4. `backers` who accumulated ratio on chain and want to see `dat addresses` being `hosted` get prioritized
  * in case not enough `seeders` and `hosters` are available to `seed` all selected `dat addresses`

**the `keeping track` part works as follows:**

1. each time a hypercore is submitted for pinning, the network of all peers makes a collective coin flip to chose a random "peer" of those who registered their willingness to offer hosting with their disk space for the role of "hoster"
2. another random peer is selected for the role of "encoder"
3. the encoder receives the hypercore that will be pinned and encodes it and submits the merkleroot to the chain and passes the encoded hypercore on to the hoster
4. the hoster stores it and makes it available to the regular dat network and also submits the merkleroot to the chain
5 the chain checks random hoster and random encoder submitted the same merkle root and starts the challenge phase it thats true.
4. in the challenge phase, the chain will continuously emit challenge events for a proof-of-supply or proof-of-service
5. it consists of the **proof-of-data-possession**, where the challenge event from the chain ask for a random chunk the hoster is storing and the hoster has to submit the encoded chunk with a merkle proof to the chain so the chain compares it to the merkle root it has
6. it consists of the **proof-of-retrievability**, where the challenge event selects X random peers as ATTESTERS to join the dat swarm of that same hosters hypercore and ask for a bunch of chunks and report back to the chain if they received those
7. if both, the proof-of-data-possession and the proof-of-retrievability succeed, the **proof-of-service** is successful and the ratio is noted on chain
