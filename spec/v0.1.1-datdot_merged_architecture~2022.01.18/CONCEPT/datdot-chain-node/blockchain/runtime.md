# Substrate FRAME Pallets
* ![pallets](https://substrate.dev/docs/assets/runtime.png)

For example, if you want to add smart contract functionality to your blockchain, you simply need to include the Contracts pallet.
Adding this pallet will expose the smart contract interface so that users can deploy smart contracts that execute in Wasm.

Because Substrate can execute a runtime in both native and Wasm, anything that you write in FRAME can be upgraded without a hard fork.

# DISPATCH
* execute function with pre-defined set of args
* RUNTIME - dispatch system
  * take pure data with type `call`
    * interpret it as a call of a public function in runtime module with some args
    * `origin` is always additional param
    * allowing the function to securely determine the provenance of its execution


# RUNTIME ARCHITECTURE
You can explore how the modules included in your Runtime are turned into primitive Substrate types, which ultimately get exposed via our JSON RPC

# RUNTIME (=STF - State Transition Function)
The logic of a blockchain that determines how the state changes when any given block is executed. In Substrate, this is essentially equivalent to the Runtime.
The block execution logic of a blockchain, i.e. the state transition function. In Substrate, this is stored on-chain in an implementation-neutral, machine-executable format as a WebAssembly binary. Other systems tend to express it only in human-readable format (e.g. Ethereum) or not at all (e.g. Bitcoin).

# STF (State Transition Function)
# = RUNTIME
The runtime contains the business logic that will define your blockchain's behavior, a.k.a. its state transition function. The runtime will define the storage items and functions that users can dispatch.

Substrate provides a set of modules, called pallets, that can be composed and configured. Substrate also provides the support libraries necessary to let these pallets interact with the client. Each pallet contains domain-specific logic and storage items. At the runtime level, you can add your own pallets by using the standard pallet interfaces and access the public methods and traits of other pallets.

The entire set of pallets and support libraries is called FRAME. FRAME interacts with the client by implementing the traits in primitives.

**A blockchain runtime is a state machine**

## State Machines and Conflicts
It has some internal state, and state transition function that allows it to transition from its current state to a future state.
In most runtimes there are states that have valid transitions to multiple future states, but a single transition must be selected.

Blockchains must agree on:

* Some initial state, called "genesis",
* A series of state transitions, each called a "block", and
* A final (current) state.

In order to agree on the resulting state after a transition, all operations within a blockchain's state transition function must be deterministic.
