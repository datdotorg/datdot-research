# STORAGE
1. Runtime Storage API
2. Overlay Change Set
3. Merkle Trie
4. Key Value Database


## Runtime Storage API
* `sp-io` write to storage with given key/value
* easy APIs generated through `decl_storage!`
* `StorageValue`, `StorageMap`, `StorageDouble`, ...

## Overlay Change Set
* Stages changes to the underlying DB
* Overlay changes are committed once per block
* two kinds:
  * prospective changes: what may happen
  * committed changes: what will happen

## Merkle Trie (paritytech/trie)
* a.k.a `HashDB`
* Data Structure on top of `kvdb`
* Arbitrary key/value length
* Nodes are branches or Leaves
* `Base-16 Particia Merkle Trie`

## Key Value Database
* a.k.a `kvdb`
* implemented with `RocksDB`
* `Hash` -> `Vec<u8>`
* Substrate: Blake2 256
  * literal `kvdb`:
    * Key (Hash256) => Value (Vec<u8>)
    *              Prefix // === Type of node
    * 0x314923509 => [00] // empty
    * 0x92cdf449t => [01] // leaf
    * 0x312372315 => [02] // branch without value
    * 0x581239301 => [03] // branch with value
* two kinds:
  * trie key path
  * `kvdb` key hash

1. literal `kvdb`
2. types of nodes
3. Virtual Trie Table
