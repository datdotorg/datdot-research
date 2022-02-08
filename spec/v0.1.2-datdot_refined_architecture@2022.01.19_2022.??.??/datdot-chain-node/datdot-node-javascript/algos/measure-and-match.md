# Flow (measure + match)

```js
// FLOW
// 1. sponsor publishes plan
//   1. with region
//   2. if no region: chain selects random attestors
//     1. attestors ping sponsor and exchange maps
//     2. sponsor updates plan region on chain
// 3. plan goes into priority queue
// 4. when time comes, to select random attestors oracle
//    1. attestors join swarm to:
//       * measure each other and exchange map
//         * to unify their map
//       * calculate hosting_setups sets from ranges
//       * for each hosting_setups:
//          * 3x random numbers consensus

//          * to select idle providers for plan.regions

//          * permutate until providers are found
//          * notify chain about new hosting_setupss + report
//            * report is signed by all attestors
//            * (=selected providers for each range set)
//            *
// 5. chain emits event to start hosting new hosting_setupss


// IDEA
// 1. publish one event to notify about many performance_behnchmarks
// 2. each pool of attestors have one notary
// 3. notary collects signed responses
// 4. all notaries together sign own response
// 5. all notaries submit all performance_behnchmark responses as 1 TX
```