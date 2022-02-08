# OVERVIEW

# Substrate
A framework and toolkit for building and deploying upgradable, modular and efficient blockchains. There are three usage paradigms in increasing levels of functionality and opinionation: Core, SRML and Node.

# Substrate Core
* The lowest level of the three Substrate usage paradigms
* this is a minimalist/purist blockchain building framework that contains essential functionality at the lowest level
  * `including consensus`
  * `block production`
  * `chain synchronisation`
  * `I/O for JSON-RPC`
  * `runtime`
  * `network synchronisation`
  * `database backend`
  * `telemetry`
  * `sandboxing`
  * and `versioning`

# Substrate Execution Environment
The runtime environment under which WebAssembly code runs in order to execute blocks.


## FRAME
The **Framework for Runtime Aggregation of Modularized Entities (FRAME)** is a set of modules (called `pallets`) and support libraries that simplify runtime development. * `Pallets` are individual modules within FRAME that host domain-specific logic.

FRAME provides some helper modules to interact with Substrate Primitives, which provide the interface to the core client.

## OVERVIEW
The following diagram shows the architectural overview of FRAME and its support libraries:

1. RUNTIME
  * APIs
  * Execution Environment
2. EXECUTIVE MODULE (orchestration)
  * PALLETS (runtime modules)
3. SYSTEM MODULEs
  * Core Types
  * Utils
  * Events
4. Support Library

### Pallets
When building with FRAME, the Substrate runtime is composed of several smaller components called pallets.
* A pallet contains a set of `types`, `storage items`, and `functions` that define a set of features and functionality for a runtime.

### System Library
* `frame_system` https://substrate.dev/rustdocs/pre-v2.0-3e65111/frame_system/index.html
The System library provides low-level types, storage, and functions for your blockchain. All other pallets depend on the System library as the basis of your Substrate runtime.

The System library defines all the core types for the Substrate runtime, such as:

* Origin
* Block Number
* Account Id
* Hash
* Header
* Version
* etc...
It also has a number of system-critical storage items, such as:

* Account Nonce
* Block Hash
* Block Number
* Events
* etc...
Finally, it defines a number of low level functions which can access your blockchain storage, verify the origin of an extrinsic, and more.

### Executive Pallet
* https://substrate.dev/rustdocs/pre-v2.0-3e65111/frame_executive/index.html
The Executive pallet acts as the orchestration layer for the runtime. It dispatches incoming extrinsic calls to the respective pallets in the runtime.

### Support Library
* https://substrate.dev/rustdocs/pre-v2.0-3e65111/frame_support/index.html
The FRAME support library is a collection of Rust macros, types, traits, and functions that simplify the development of Substrate pallets.

The support macros expand at compile time to generate code that is used by the runtime and reduce boilerplate code for the most common components of a pallet.

### Runtime
The runtime library brings together all these components and pallets. It defines which pallets are included with your runtime and configures them to work together to compose your final runtime. When calls are made to your runtime, it uses the Executive pallet to dispatch those calls to the individual pallets.

### Prebuilt Pallets
Some pallets will be sufficiently general-purpose to be reused in many blockchains. Anyone is free to write and share useful pallets. There is a collection of popular pallets provided with Substrate. Let's explore them.
* [make custom pallets](https://substrate.dev/docs/en/development/module/)
* [example](https://substrate.dev/docs/en/tutorials/adding-a-module-to-your-runtime)

**see pallets**
https://substrate.dev/docs/en/conceptual/runtime/frame#prebuilt-pallets

