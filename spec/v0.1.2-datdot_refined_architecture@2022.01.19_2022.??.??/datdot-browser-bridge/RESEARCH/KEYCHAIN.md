# KEYCHAIN

WALLET?
VAULT?
...




-------------------------
KEYCHAIN / KEYSTORE
-------------------------
Integrate the keychain into js-ipfs

 the keychain is constructed in pre-start so it always available
 add the ipfs key commands from this spec
 add the HTTP API routes and resources for key
Other tasks


add spec/tests to interface-ipfs-core
add "key" to js-ipfs-api

it would make sense to have the access restrictions prompt the user for giving a page access to keys. This will enable applications to share keys when possible while keeping them isolated from each other by default.

Web APIs like localStorage still need browser changes in order to isolate it between IPFS pages, however.

https://github.com/ipfs/js-ipfs/pull/1133

Crypto and Key Management
key
ipfs.key.export(name, password, [callback])
ipfs.key.gen(name, options, [callback])
ipfs.key.import(name, pem, password, [callback])
ipfs.key.list([callback])
ipfs.key.rename(oldName, newName, [callback])
ipfs.key.rm(name, [callback])
crypto (not yet implemented)

https://github.com/ipfs-inactive/interface-js-ipfs-core/blob/master/SPEC/KEY.md






https://github.com/ipfs/ipfs-docs/blob/main/docs/how-to/use-existing-private-key.md


