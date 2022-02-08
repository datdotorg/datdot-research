# DATAVAULT








-------------------------
PETNAMES
-------------------------
Peers: assigning nicknames / pet names
=> A peer nickname can be added next to peer ID.


Peers: UI for swarm connect
"Add Connection" button
=> hyperswarm connect
https://github.com/ipfs/ipfs-webui/pull/969

open questions:
how to indicate success/failure?
somehow store and "pin" peerid of manually added connection(s) to the top of Peer list?
display error message instead of peerid line if failed?

support "pet names" ? could be first step towards ipfs-friends-like feature

https://github.com/libp2p/js-libp2p/blob/8076b42fd8c4d2dac6128202843eab98d94b91d6/doc/API.md


Peers: assigning nicknames / pet names

$ ipfs swarm connect --petname PeeryMcPeer /p2p/QmPeerId
connect QmPeerId success

$ ipfs swarm peers --petname

/ipv4/somethingelse  OtherNick
/ipv4/no-petname
/ipv4/something      PeeryMcPeer


By the end of the PeerStore improvements, we should support adding metadata to a peer.

Regarding API for libp2p and IPFS, we did not start discussing this yet, since my main focus has been the
AddressBook,
ProtoBook
KeyBook.

As soon as we have the former books, I will be working on the
MetadataBook // associate data with peer (e.g. petnames, network roles, associated apps, ...)
which should be used for this use case

/peers/metadata/<b32 peer id no padding>/<key>

https://github.com/libp2p/js-libp2p/blob/master/doc/API.md#peerstorepeers
https://github.com/libp2p/js-libp2p/blob/master/doc/API.md#peerstoremetadatabookset

ipfs.libp2p.peerStore*
peerStore.metadataBook.set(peerId: PeerId, key: string, value: *)
peerStore.metadataBook.get(peerId: PeerId) => Get all metadata for the Peer
peerStore.metadataBook.getValue(peerId: PeerId, key: string) => Get a specific part of the metadata
peerStore.metadataBook.delete(peerId: PeerId) => Delete all peer metadata from the book
peerStore.metadataBook.deleteValue(peerId: PeerId, key: string) => Delete part of the metadata of a peer from the book.



-------------------------
DATDOT FRIENDS
-------------------------
It all starts with friends
$ friends
> Welcome friend...
> ls
Alan             QmHashHashHashHashHashHash
Alex             QmHashHashHashHashHashHash
SupriousLongName QmHashHashHashHashHashHash

# Add a peerId as a friend you want to co-host
> add QmHashHashHashHashHashHash Jamie
👍😙👍

# Stop following a friend
> dump Jamie
💦🗑

Alan is here ✨🎷🐩

# Tell your friends about something you want to share
> share bafyba6hdhnxndKDFJLDKJF best-cat-gif
https://share.ipfs.io/#/bafyba6hdhnxndKDFJLDKJF

Alan got best-cat-gif
Alex got best-cat-gif
Alan went away 👋
Alex shared best-cat-gif bafyba6hdhnxndKDFJLDKJF

