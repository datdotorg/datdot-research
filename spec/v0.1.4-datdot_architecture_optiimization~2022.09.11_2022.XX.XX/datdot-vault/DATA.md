# DATA/STORAGE of VAULT
data stored in data-vault




--------------



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





# BOOTSTRAP NODES LIST (DEFAULT and CUSTOM)

https://github.com/ipfs/ipfs-docs/blob/main/docs/how-to/modify-bootstrap-list.md


ipfs bootstrap list
> /dnsaddr/bootstrap.libp2p.io/p2p/QmNnooDu7bfjPFoTZYxMNLWUQJyrVwtbZg5gBMjTezGAJN
> /dnsaddr/bootstrap.libp2p.io/p2p/QmQCU2EcMqAqQPR2i9bChDtGNJchTbq5TbXJJ16u19uLTa
> /dnsaddr/bootstrap.libp2p.io/p2p/QmbLHAnMoJPWSCR5Zhtx6BHJX9KiKNN6tpvbUcqanj75Nb
> /dnsaddr/bootstrap.libp2p.io/p2p/QmcZf59bWwK5XFi76CZX8cbJ4BhTzzA3gU1ZjYZcYW3dwt
> /ip4/104.131.131.82/tcp/4001/p2p/QmaCpDMGvV2BGHeYERUEnRQAwe3N8SzbUtfsmvsqQLuvuJ


Don't change this list unless you understand what it means to do so.
Bootstrapping is an important security point of failure in distributed systems:
  malicious bootstrap peers could only introduce you to other malicious peers.
  It is recommended to keep the default list provided by the IPFS dev team,
  or — in the case of setting up private networks — a list of nodes you control.
Don't add peers to this list that you don't trust.




Here, we add a new peer to the bootstrap list:

> ipfs bootstrap add /ip4/25.196.147.100/tcp/4001/p2p/QmaMqSwWShsPg2RbredZtoneFjXhim7AQkqbLxib45Lx4S

Here, we remove a node from the bootstrap list:

> ipfs bootstrap rm /ip4/104.131.131.82/tcp/4001/p2p/QmaCpDMGvV2BGHeYERUEnRQAwe3N8SzbUtfsmvsqQLuvuJ


Let's say we want to create a backup of our new bootstrap list. We can easily do this by redirecting stdout of ipfs bootstrap list to a file:

> ipfs bootstrap list >save

If we ever want to start from scratch, we can delete the entire bootstrap list at once:

> ipfs bootstrap rm --all

With an empty list, we can restore the default bootstrap list:

> ipfs bootstrap add --default

Remove the entire bootstrap list again, and restore our saved one by piping the contents of the saved file to ipfs bootstrap add:

> ipfs bootstrap rm --all
> cat save | ipfs bootstrap add




# STORAGE



## SESSION STORAGE
```js
SESSION STORAGE:
----------------



//////////////////////////////////////////
// SESSION STORAGE
//////////////////////////////////////////
const myStorage = window.sessionStorage;
// Save data to sessionStorage
sessionStorage.setItem('key', 'value');
// Get saved data from sessionStorage
let data = sessionStorage.getItem('key');
// Remove saved data from sessionStorage
sessionStorage.removeItem('key');
// Remove all saved data from sessionStorage
sessionStorage.clear();
sessionStorage.key(index) //– get the key on a given position.
sessionStorage.length //– the number of stored items.

// EXAMPLE:
// Get the text field that we're going to track
let field = document.getElementById("field");
// See if we have an autosave value
// (this will only happen if the page is accidentally refreshed)
if (sessionStorage.getItem("autosave")) {
  // Restore the contents of the text field
  field.value = sessionStorage.getItem("autosave");
}
// Listen for changes in the text field
field.addEventListener("change", function() {
  // And save the results into the session storage object
  sessionStorage.setItem("autosave", field.value);
});


session storage:
// The sessionStorage exists only within the current browser tab.
// But it is shared between same origin iframes in the same tab
// data survives page refresh, but not closing/opening the tab.

// STORAGE EVENT:
key – the key that was changed (null if .clear() is called).
oldValue – the old value (null if the key is newly added).
newValue – the new value (null if the key is removed).
url – the url of the document where the update happened.
storageArea – either localStorage or sessionStorage object where the update happened.
Please note that the event also contains: event.url – the url of the document where the data was updated.

Also, event.storageArea contains the storage object – the event is the same for both sessionStorage and localStorage, so event.storageArea references the one that was modified. We may even want to set something back in it, to “respond” to a change.

Use Object.keys to get all keys.
We access keys as object properties, in that case storage event isn’t triggered.

Storage event:

Triggers on setItem, removeItem, clear calls.
Contains all the data about the operation (key/oldValue/newValue), the document url and the storage object storageArea.
Triggers on all window objects that have access to the storage except the one that generated it (within a tab for sessionStorage, globally for localStorage).

// SESSION STORAGE is not sent to servers
// => server cant manipulate storage objects via HTTP headers
// => storage is bound to origin (domain+protocol+port)



Session Storage:
* scope is within a tab (per document)
* lasts as long as tab or browser is open => survives page reloads/restores
* new tab opens new session
* duplicating tab copies sessionstorage
* closing tab ends session storage
* storage object for current origin
* if you open two tabs in the same browser you have two independent session storage sets
  * one for each and they will dissappear and be gone once the tab is closed, meaning the browser page closes

* You can use it to save some temporary data such as:
  * items in shopping cart
  * temporary input or website breadcrumb
  * ...
  * to prevent the data from disappearing after the page disappears, such as form filling and user browser records.

* To improve performance, I had been storing the returned data in sessionStorage between page loads
  * can be used on every page after the first (in same tab)


 ```