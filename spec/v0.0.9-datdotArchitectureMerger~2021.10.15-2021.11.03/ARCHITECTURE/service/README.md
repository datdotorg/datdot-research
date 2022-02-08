# service
**[main](../../README.md)**

**use**
* [Hypercore Protocol](https://www.hypercore-protocol.org/)


* Use polkadot.js.org api and hypercore js libraries to encode and decode hypercores [let's call this adapter.js or something]
* Use dat sdk or dat-store's service.js to communicate with  adapter.js



## summary
- listening for events on the node
- submitting data to the node (proofs and archives)

### challenge
- responding with the merkle proof from the dat archives

## Additional Information
Context: [How `dat` works?](https://datprotocol.github.io/how-dat-works/)
**tl;dr:** a version controlled posix compliant filesystem on top of an immutable append only log structure, which can be seeded and subscribed to like torrents and the original author can always update the archive while the immutable history is always content addressable


```js
const service = make('service', $ => {
  const on = $('on') // chain api
  const handlers = $('handlers') // chain api
  const helpers = $('helpers')
  const api = $('api')
  // connect
  $(on(handlers(helpers(api($)))))
})
```

### service API - EXECUTE LOOP: (CHAIN API => ... => EVENTS => HANDLERS => (HELPERS) => CHAIN API)


```js
// const MAIN_TYPES = { // MAIN
//   batch,
//   make,//_account,
//   give,//_to_account,
//   register,//_feed,
//   offer,//_service,
//   provide,//_service,
//   request,//_service,
// }

// SERVICE
const service = {
  start_hosting,
  repair_hosting,
  end_hosting,
  provide_proof_of_storage,
  provide_performance_benchmark,
  pause_plan,
  resume_plan,
  end_plan,
}

chain.account_create()
chain.account_update()
chain.roles_register()
chain.plan_subscribe()
// _hosting_start()
chain.on('start-hosting', service['start_hosting'])
chain.hosting_setup_report()
chain.plan_update()
// _hosting_repair()
chain.on('repair-hosting', service['repair_hosting'])
// _hosting_end()
chain.on('end-hosting', service['end_hosting'])
chain.proof_of_storage_request()
chain.on('provide-proof-of-storage', service['provide_proof_of_storage'])
chain.proof_of_storage_response()
chain.performance_benchmark_request()
chain.on('provide_performance_benchmark', service['provide_performance_benchmark'])
chain.performance_benchmark_response()
chain.plan_pause()
chain.on('pause-plan', service['pause_plan'])
chain.plan_resume()
chain.on('resume-plan', service['resume_plan'])
chain.plan_unsubscribe()
chain.on('end-plan', service['end_plan'])
chain.roles_unregister()
chain.account_delete()
```


# SERVICE

## HANDLERS
```js
// HANDLERS
function start_hosting (event) {
  const id_start = setTimeout(() => _hosting_default_report(), 5000)
  setTimeout(() => {
    chain.hosting_setup_report()
    cancelTimeout(id_start)
  }, _run(event))
  // e.g. start a new hosting_setup
  // e.g. a hoster/encoder/attestor failed (now or later) and we need to issue a new event to replace them
  // e.g. a hoster/encoder/attestor unregistered (=stopped offering a service), so => order replacement
  // e.g. maybe sponsor updates their plan
  // e.g. maybe an `attestor` in the swarm notices new feed chuncks in a feed and notifies the chain about it so hosting is updated
}
function repair_hosting (event) {
  const id_start = setTimeout(() => _hosting_default_report(), 5000)
  setTimeout(() => {
    chain.hosting_setup_report()
    cancelTimeout(id_start)
  }, _run(event))
  // e.g. start a new hosting_setup
  // e.g. a hoster/encoder/attestor failed (now or later) and we need to issue a new event to replace them
  // e.g. a hoster/encoder/attestor unregistered (=stopped offering a service), so => order replacement
  // e.g. maybe sponsor updates their plan
  // e.g. maybe an `attestor` in the swarm notices new feed chuncks in a feed and notifies the chain about it so hosting is updated
}
function end_hosting (event) {
  _run(event)
  // e.g. start a new hosting_setup
  // e.g. a hoster/encoder/attestor failed (now or later) and we need to issue a new event to replace them
  // e.g. a hoster/encoder/attestor unregistered (=stopped offering a service), so => order replacement
  // e.g. maybe sponsor updates their plan
  // e.g. maybe an `attestor` in the swarm notices new feed chuncks in a feed and notifies the chain about it so hosting is updated
}
function provide_proof_of_storage (event) {
  const id_pos = setTimeout(() => proof_of_storage_default(), 5000)
  setTimeout(() => {
    chain.proof_of_storage_response(proof)
    cancelTimeout(id_pos)
  }, _run(event))
}
function provide_performance_benchmark (event) {
  const id_pop = setTimeout(() => performance_benchmark_default(), 5000)
  setTimeout(() => {
    chain.performance_benchmark_response(rating)
    cancelTimeout(id_pop)
  }, _run(event))
  //
}
function pause_plan (event) {
  _run(event)
  // plan was paused by sponsor
  // temporary exit swarms for feed to not serve or do perf benchmarks
}
function resume_plan (event) {
  _run(event)
  // plan was resumed by sponsor
  // re-enter swarms for feed to not serve or do perf benchmarks
}
function end_plan (event) {
  _run(event)
  // e.g. plan is completed
  // e.g. plan was canceled by sponsor
  // exit all swarms and delete feed data permanently
}
```

## HELPERS
```js
function _run (event) {

}
```
