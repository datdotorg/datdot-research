# REPO UPDATE
many installers install the shim code.
once installed, all essentialls should potentially update
  * after user confirmed

# REPO STRUCTURE
# REPO CONTENTS - A Repo uniquely identifies an IPFS Node

A repository uniquely identifies a node. Running two different IPFS programs with identical repositories -- and thus identical identities -- WILL cause problems.

Datastores MAY be shared -- with proper synchronization -- though note that sharing datastore access MAY erode privacy.

Repo implementation changes MUST include migrations
DO NOT BREAK USERS' DATA. This is critical. Thus, any changes to a repo's implementation MUST be accompanied by a SAFE migration tool.


Repo Versioning
A repo version is a single incrementing integer. All versions are considered non-compatible. Repos of different versions MUST be run through the appropriate migration tools before use.




The Repo stores a collection of IPLD objects that represent:

config - node configuration and settings
datastore - content stored locally, and indexing data
keystore - cryptographic keys, including node's identity
hooks - scripts to run at predefined times (not yet implemented)


Note that the IPLD objects a repo stores are divided into:

state (system, control plane) used for the node's internal state
content (userland, data plane) which represent the user's cached and pinned data.

Additionally, the repo state must determine the following. These need not be IPLD objects, though it is of course encouraged:

version - the repo version, required for safe migrations
locks - process semaphores for correct concurrent access
datastore_spec - array of mounting points and their properties


----------------

i'd like to see go-ipfs have something like this:

```
> ls ipfs/bin/repo-migrations
1-to-2
2-to-3
3-to-4
4-to-5
5-to-6
6-to-7

> ipfs/bin/repo-migrations/1-to-2
repository version: 3
already up to date.

> ipfs/bin/repo-migrations/3-to-4
repository version: 3
applying path: 3-to-4
repository version: 4

> ipfs/bin/repo-migrations/3-to-4 --revert
repository version: 4
applying patch: 4-to-3
repository version: 3

> ipfs/bin/repo-migrations/run 1-to-7
repository version: 3
applying patch: 3-to-4
applying patch: 4-to-5
applying patch: 5-to-6
applying patch: 6-to-7
repository version: 7
```
e.g. https://github.com/ipfs/fs-repo-migrations



human inspection
Repo implementations must include tools to transform the data to a human
readable/inspectable structure. This makes it possible for users and application
implementors to debug problems. These tools may be easiest to implement with
a human readable repository format, and conversion tools to convert to/from it.





IPFS REPO:
1. keys
2. config
3. datastore
4. logs
5. locks
6. other



**version:**
Repo implementations may change over time,
thus they MUST include a version recognizable across versions.
Meaning that a tool MUST be able to read the version of a given repo type.

For example, the fs-repo simply includes a version file with the version number.
This way, the repo contents can evolve over time but the version remains readable the same way across versions.


**datastore:**
IPFS nodes store some IPLD objects locally. These are either (a) state objects required for local operation -- such as the config and keys -- or (b) content objects used to represent data locally available. Content objects are either pinned (stored until they are unpinned) or cached (stored until the next repo garbage collection).

The name "datastore" comes from go-datastore, a library for swappable key-value stores. Like its name-sake, some repo implementations feature swappable datastores, for example:

an fs-repo with a leveldb datastore
an fs-repo with a boltdb datastore
an fs-repo with a union fs and leveldb datastore
an fs-repo with an s3 datastore
an s3-repo with a cached fs and s3 datastore
This makes it easy to change properties or performance characteristics of a repo without an entirely new implementation.



**keystore**
A Repo typically holds the keys a node has access to, for signing and for encryption.

Details on operation and storage of the keystore can be found in REPO_FS.md and KEYSTORE.md.

.ipfs/
├── api             <--- running daemon api addr
├── blocks/         <--- objects stored directly on disk
│   └── aa          <--- prefix namespacing like git
│       └── aa      <--- N tiers
├── config          <--- config file (json or toml)
├── hooks/          <--- hook scripts
├── keystore/       <--- cryptographic keys
│   ├── key_b32name <--- private key with base32-encoded name
├── datastore/      <--- datastore
├── logs/           <--- 1 or more files (log rotate)
│   └── events.log  <--- can be tailed
├── repo.lock       <--- mutex for repo
└── version         <--- version file



## api
api
./api is a file that exists to denote an API endpoint to listen to.

It MAY exist even if the endpoint is no longer live (i.e. it is a stale or left-over ./api file).
In the presence of an ./api file, ipfs tools (eg go-ipfs ipfs daemon) MUST attempt to delegate to the endpoint, and MAY remove the file if reasonably certain the file is stale. (e.g. endpoint is local, but no process is live)

The ./api file is used in conjunction with the repo.lock. Clients may opt to use the api service, or wait until the process holding repo.lock exits. The file's content is the api endpoint as a multiaddr

> cat .ipfs/api
/ip4/127.0.0.1/tcp/5001
Notes:

The API server must remove the api file before releasing the repo.lock.
It is not enough to use the config file, as the API addr of a daemon may have been overridden via ENV or flag.
api file for remote control
One use case of the api file is to have a repo directory like:

> tree $IPFS_PATH
/Users/jbenet/.ipfs
└── api

0 directories, 1 files

> cat $IPFS_PATH/api
/ip4/1.2.3.4/tcp/5001
In go-ipfs, this has the same effect as:

ipfs --api /ip4/1.2.3.4/tcp/5001 <cmd>
Meaning that it makes ipfs tools use an ipfs node at the given endpoint, instead of the local directory as a repo.

In this use case, the rest of the $IPFS_PATH may be completely empty, and no other information is necessary. It cannot be said it is a repo per-se. (TODO: come up with a good name for this).

blocks/




## blocks
  The block/ component contains the raw data representing all IPFS objects stored locally, whether pinned or cached. This component is controlled by the datastore. For example, it may be stored within a leveldb instance in datastore/, or it may be stored entirely with independent files, like git.

In the default case, the user uses fs-datastore for all /blocks so the objects are stored in individual files. In other cases, /blocks may even be stored remotely

blocks/ with an fs-datastore

Both the /blocks and /datastore directories are controlled by the datastore component of the repo.



## config
The config file is a JSON or TOML file that contains the tree of configuration variables. It MUST only be changed while holding the repo.lock, or potentially lose edits.





## hooks
  The hooks directory contains executable scripts to be called on specific events to alter ipfs node behavior.

Currently available hooks:

none




## keystore


The keystore directory holds additional private keys that the node has access to (the public keys can be derived from them).

The keystore repository should have 0700 permissions (readable, writable by the owner only).

The key files are named as key_base32encodedNameNoPadding where key_ is a fixed prefix followed by a base32 encoded identifier, without padding and downcased. The identifier usually corresponds to a human-friendly name given by the user.

The key files should have '0400' permissions (read-only, by the owner only).

The self key identifier is reserved for the peer's main key, and therefore key named key_onswyzq is allowed in this folder.

The key files themselves contain a serialized representation of the keys as defined in the libp2p specification.






## datastore

The datastore directory contains the data for a leveldb instance used to store operation data for the IPFS node. If the user uses a boltdb datastore instead, the directory will be named boltdb. Thus the data files of each database will not clash.

TODO: consider whether all should just be named leveldb/

Both the /blocks and /datastore directories are controlled by the datastore component of the repo.




## logs

IPFS implementations put event log files inside the logs/ directory. The latest log file is logs/events. Others, rotated out may exist, with a timestamp of their creation. For example:



## repo.lock

repo.lock prevents concurrent access to the repo. Its content SHOULD BE the PID of the process currently holding the lock. This allows clients to detect a failed lock and cleanup.

> cat .ipfs/repo.lock
42
> ps | grep "ipfs daemon"
42 ttys000   79:05.83 ipfs daemon


PID FILE
   a present lock should give new processes enough information to recover. Doing this correctly in a portable, safe way, with good UX is very tricky. We must be careful with TOCTTOU bugs, and multiple concurrent processes capable of running at any moment. The goal is for all processes to operate safely, to avoid bothering the user, and for the repo to always remain in a correct, consistent state.




## version


The version file contains the repo implementation name and version. This format has changed over time:

# in version 0
> cat $repo-at-version-0/version
cat: /Users/jbenet/.ipfs/version: No such file or directory

# in versions 1 and 2
> cat $repo-at-version-1/version
1
> cat $repo-at-version-2/version
2

# in versions >3
> cat $repo-at-version-3/version
fs-repo/3
Any fs-repo implementation of any versions >0 MUST be able to read the version file. It MUST NOT change format between versions. The sole exception is version 0, which had no file.




versions 1 and 2 of the go-ipfs implementation use just the integer number. It SHOULD have used fs-repo/<version-number>. We could either change the spec and always just use the int, or change go-ipfs in version >3. we will have to be backwards compatible.








  ## location


  Location
The fs-repo can be located anywhere on the filesystem. By default clients should search for a repo in:

~/.ipfs
Users can tell IPFS programs to look elsewhere with the env var:

IPFS_PATH=/path/to/repo





  Reading without the repo.lock
Programs MUST hold the repo.lock while reading and writing most files in the repo. The only two exceptions are:

repo.lock - so clients may check for it
api - so clients may use the API





## KEYSTORE

  Goals:
To have a secure, simple and user-friendly way of storing and managing keys for use by ipfs. As well as the ability to share these keys, encrypt, decrypt, sign and verify data.











  ipfs key

    ipfs key - Interact with ipfs keypairs

SUBCOMMANDS:

    ipfs key gen                  - Generates a new named ipfs keypair
    ipfs key list                 - Lists out all local keypairs
    ipfs key info <key>           - Get information about a given key
    ipfs key rm     <key>             - Delete a given key from your keystore
    ipfs key rename <key> <name>  - Renames a given key
    ipfs key show <key>               - Print out a given key

    ipfs key send <key> <peer>    - Shares a specified private key with the given peer

    Use 'ipfs key <subcmd> --help' for more information about each command.

DESCRIPTION:

    'ipfs key' is a command used to manage ipfs keypairs.

ipfs crypt
    ipfs crypt - Perform cryptographic operations using ipfs keypairs

SUBCOMMANDS:

    ipfs crypt sign <data>          - Generates a signature for the given data with a specified key
    ipfs crypt verify <data> <sig>  - Verify that the given data and signature match
    ipfs crypt encrypt <data>       - Encrypt the given data
    ipfs crypt decrypt <data>       - Decrypt the given data

DESCRIPTION:

    `ipfs crypt` is a command used to perform various cryptographic operations
    using ipfs keypairs, including: signing, verifying, encrypting and decrypting.
Some subcommands:
ipfs key Gen
    ipfs key gen <name> - Generate a new ipfs keypair

OPTIONS:
    -t, -type       string         - Specify the type and size of key to generate (i.e. rsa)
    -s. -size       int            - Size of the key to generate
    -p, -passphrase string         - Passphrase for encrypting the private key on disk

DESCRIPTION:

    'ipfs key gen' is a command used to generate new keypairs.
Key Send

    ipfs key send <key> <peer> - Send a keypair to a given peer

OPTIONS:

    -y, -yes        bool        - Yes to the prompt

DESCRIPTION:

    'ipfs key send' is a command used to share keypairs with other trusted users.

    It will first look up the peer specified and print out their information and
    prompt the user "are you sure? [y/n]" before sending the keypair. The target
    peer must be online and dialable in order for the key to be sent.

    Note: while it is still managed through the keystore, ipfs will prevent you from
            sharing your nodes private key with anyone else.

Comments:
Ensure that the user knows the implications of sending a key.

Crypt Encrypt

    ipfs crypt encrypt <data> - Encrypt the given data with a specified key

ARGUMENTS:

    data                        - The filename of the data to be encrypted ("-" for stdin)

OPTIONS:

    -k, -key        string        - The name of the key to use for encryption (default: localkey)
    -o, -output     string        - The name of the output file (default: stdout)
    -c, -cipher     string        - The cipher to use for the operation
    -m, -mode       string        - The block cipher mode to use for the operation

DESCRIPTION:

    'ipfs crypt encrypt' is a command used to encypt data so that only holders of a certain
    key can read it.

Comments:
This should probably just operate on raw data and not on DAGs.







  Keystore package
The fsrepo carries a keystore that can be used to load/store keys. The keystore is implemented following this interface:

```js
// Keystore provides a key management interface
type Keystore interface {
	// Has returns whether or not a key exist in the Keystore
	Has(string) (bool, error)
	// Put stores a key in the Keystore, if a key with the same name already exists, returns ErrKeyExists
	Put(string, ci.PrivKey) error
	// Get retrieves a key from the Keystore if it exists, and returns ErrNoSuchKey
	// otherwise.
	Get(string) (ci.PrivKey, error)
	// Delete removes a key from the Keystore
	Delete(string) error
	// List returns a list of key identifier
	List() ([]string, error)
}
```

**important**
Note: Never store passwords as strings, strings cannot be zeroed out after they are used. using a byte array allows you to write zeroes over the memory so that the users password does not linger in memory.







## config state


  The node's config (configuration) is a tree of variables, used to configure various aspects of operation. For example:

the set of bootstrap peers IPFS uses to connect to the network
the Swarm, API, and Gateway network listen addresses
the Datastore configuration regarding the construction and operation of the on-disk storage system.
There is a set of properties, which are mandatory for the repo usage. Those are Addresses, Discovery, Bootstrap, Identity, Datastore and Keychain.

It is recommended that config files avoid identifying information, so that they may be re-shared across multiple nodes.

CHANGES: today, implementations like js-ipfs and go-ipfs store the peer-id and private key directly in the config. These will be removed and moved out.






## LOCKS
IPFS implementations may use multiple processes, or may disallow multiple processes from using the same repo simultaneously. Others may disallow using the same repo but may allow sharing datastores simultaneously. This synchronization is accomplished via locks.

All repos contain the following standard locks:

repo.lock - prevents concurrent access to the repo. Must be held to read or write.




  ## datastore_spec
This file is created according to the Datastore configuration specified in the config file. It contains an array with all the mounting points that the repo is using, as well as its properties. This way, the datastore_spec file must have the same mounting points as defined in the Datastore configuration.

It is important pointing out that the Datastore in config must have a Spec property, which defines the structure of the ipfs datastore. It is a composable structure, where each datastore is represented by a json object.






  ## hooks (TODO)
Like git, IPFS nodes will allow hooks, a set of user configurable scripts to run at predefined moments in IPFS operations. This makes it easy to customize the behavior of IPFS nodes without changing the implementations themselves.










