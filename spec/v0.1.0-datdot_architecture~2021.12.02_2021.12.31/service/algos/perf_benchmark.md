# PERFORMANCE BENCHMARK CONCEPT
HOSTER_CONTEXT (PEERS):
* hoster peer stores set of chunks per hosting_setup
* hoster joins a swarm per hosting_setup
* hoster might run cpu heavy programs on their computer
```js
* hoster hosts data for their region and foreign regions
* hoster peer is connected to lots of leechers
// ----------------------------------------------------------------------------
PERFORMANCE_MEASURING (RAW vs WORKING vs OFF_CHAIN)
// ----------------------------------------------------------------------------
OFF_CHAIN (via UI/CLI only) (e.g. sponsor can use this)
1. SWARM_HEALTH: // measure overall health of certain hosted sets of a specific hosted feed
  * user calculates swarm health for their own interest
2. peer/role raw working performance (e.g. encoding, attesting, hosting, ...)
  * measure `performance requirements` for single job
  `ENCODER`
    how long does the job take
    resources needed
  `ATTESTOR`
    [ 'hosting_setup', 'storage_verification', 'performance_benchmark' ].forEach
    how long does the job take
    resources needed
  `HOSTER`
    - how long does the hosting_setup job take
    - resources needed for hosting_setup job
    - resources needed for storing job
    - resources needed for serving data
        - 0 peers in swarm
        - 1-10
        - 11-50
        - over 50
    - resources needed for storage verification
    - resources needed for performance benchmark
// ----------------------------------------------------------------------------
RAW (when users register for a role):
1. peer/role raw idle performance
  * attestor requests data from *the peer* and measures: `{ latency, bandwidth: {egress} }`
  // 1. benchmarked when they first register
  // 2. chain requests raw performance check if working performance changes
  // 3. self report updates (triggered by users themselves)
  //   * when they change hardware
  //   * when they change location
  //   * ...

// ----------------------------------------------------------------------------
WORKING_PERFORMANCE (by PEERS to PEERS):
https://discord.com/channels/709519409932140575/709522119335346196/788226046012817478
1. SWARM_BUSYNESS:
  * attestor announces to have the data and counts `incoming requests` for hosted feed ranges
  * harvest requests with ranges from the hosting_setups
    - `feed.peers` shows all peers you are connected to (configure to very large number to see all)
    - announce yourself
    - `want messages` of feed.peers are in the replicator
      * but beware they are for big ranges
      ie want` 0->100k`
    - to see blocks you are serving to others, you can use the `upload event` on the hypercore
    - wait for request, then disconnect
    - repeat until x requests

2. HOSTER_PERFORMANCE:
  * attestor requests data from *the hosters* and measures: `{ latency, bandwidth: {egress} }`
  2. listen to extension messages and disconnect from all who are not hosters
  3. request chunks (mimic the harvested requests)
    peers.forEach(peer => request(peer, index))
    - `hypercore/replicate.js` add `request(peer, index)` to request data from certain peer


// ----------------------------------------------------------------------------
REPORTING (by PEERS to CHAIN):
- hosters to self report the `{ bandwidth: {ingress, egress} }` for hosting they are using
  * (in terms of chunks and bytes)
  * on a regular basis?
  * or when asked?

// REPORTING:
  // resource usage
  // infrastructure/application availability

// capacity management
  // => determine projected workload
  // => measure how changes in hardware affect application performance
  // => incentivize resources to join/leave
  // e.g. if we give one more job, how does it affect given on their hardware

  // what is baseline performance (raw + idle)
  // how changes in hardware will affect performance
  // determine resources needed for certain workload

// compliance management
  // commit to SLA (service level aggreements)
  // document KPI data to document compliance to a promised service level
  // => helps answer questions like:
  // 1. what percentage of time are services available
  // 2. how are the services performing
  // 3. what are root causes of outages & degredation of performance
  // => conclusion:
  //   1. targeted alerts: (threshold to trigger actions)
  //   * e.g. min/max/average values for expected performance



  // process monitoring (=datdot process?)
  // JOB scripts/services monitoring (=processed jobs?)
  // event log monitoring (=evaluate and trigger alert tasks on chain)
  // FEED url/files/folders monitoring (=swarm/feed hostings monitoring)

// general host and server monitoring
  CPU ({
    active_jobs, // process_count, thread_count,
    %interrupt_time,
    %privilege_time,
    %processor_time,
    %user_time,
  })
  MEM ({
    (total_physical_memory),
    free memory,
    page faults per second,
    page reads per second,
    page writes per second,
    pages output per second,
    pool non paged bytes,
    pool pages bytes,
  })
  HDD ({
    disk free%,
    disk free space,
    disk reads per second,
    disk writes per second,
    disk read bytes per second,
    disk write bytes per second,
    disk transfers per second,
  })
  NET ({ // + process utilization?
    output queue length,
    packets outbound errors,
    packets received errors,
    kilobytes received per second,
    kilobytes sent per second,
  })

  `{ cpu(s), gpu(s), mem/ram, hdd, net: { egress, ingress, latency } }`

  * REPORT: per hosting_setup (set of chunks) the used: `{ bandwidth: {ingress, egress}}`
  * REPORT: the requested chunk indexes
  * REPORT: the times each index was requested
  * REPORT: the data size of each chunk

  * e.g.
    * 5x i=1(64kb)
    * 10x i=232(70kb)
    * 12x i=120(50kb)
    * ...






- attestor reports `{ hosting_health, swarm_busyness, hoster_performances }`
// ----------------------------------------------------------------------------
VERIFYING (by PEERS and/or CHAIN):
// for all measurements to make sure they are high quality
// e.g. for self reporting
//



// ----------------------------------------------------------------------------
EVALUATING_AND_SAVE (by CHAIN):
- comparing the self reports for a particular hosting of all 3 hosters
  * _feed_upload: `bandwidth: {ingress, egress}`
  * _incoming_requests: ???
- compare attestor reports `hoster_performances` reported
  * by region (e.g. EUROPE attestor, AFRIKA attestor, ASIA Attestor)
//   * compare how many times in X cases do we get a response from a certain hoster?
//     * example (50 request): 29x unknown peer, 10x hosterA, 9x hosterB, 2x hosterC (send hoster extension msg)

// Benchmark to Sponsors Requirements:
//   * can we get certain chunk when we request it (no matter which peer provides it)?
//   * can we get data under required latency?
//   * can we get a lot of data in the required time? (bandwidth test)
// ----------------------------------------------------------------------------
RANKING:
* example (one performance): hosterA > hosterB > hosterC (all 3 hosters per performance for given a 10-chunk-hosting_setup)
* example (performance history): hosterA(#1=25%,#2=25%,#3=50%)
* example (cross sets performance): hosterA(#1=15%,#2=75%,#3=10%)
* if hosters get paid for the service quality they offer
  * => a better paid hoster should rank higher than a worse paid hoster
// ----------------------------------------------------------------------------
LOAD_AND_USE (by CHAIN):
const bool = doesQualify(hosterID, jobID)
function doesQualify (hosterID, jobID) {
  // for loop: hoster.measured_by_attestors[i]

  // hosters have lower performance in "foreign regions" but want to get paid what? ...
  // => can hosters configure if they want to be selected for "foreign regions"?
  //   * (e.g. because not enough jobs at home?)
}
```


-------------------------------------------------------------------------------

# REPORTS


BUILDER (cranes, baggers, mixer)   are    DATDOT  (attestors, hosters, encoders)
=> a pool of (employees/sub-CON_TRACTORS)
                                           => a pool of (providers)



PROJECTS (airport, street, garage)   are  JOBS (storage_verification, performance_benchmark, hosting_setup, retry_hosting_setup)
=> a queue/schedule of project orders
                                          => a queue/schedule of jobs/CON_TRACTS


1. realtime/just-in-time, not providers marking availability in the future
2. convenience for end users to earn


providers have:
- reliability score (e.g. 98% reliable)
- quality score - bandwidth/latency/etc... average measured scores
  - does provider X have a required quality in region X

```javascript
user.rating = {
  region1: { quality, reliability },
  region2: { quality, reliability },
  region3: { quality, reliability },
}
// 1. we have for each region a list of attestors, those lists update all the time
//  => moving providers means moving regions
// 2. we assign each performance attestation the attestor.region and other properties of the attestor who executed the attestation
// 3. we get a list attestations for each reagion
// 4. for a providerX: we have a list of attestations from many attestors from different regions


// if we want to assign a job (e.g. hosting plan/hosting_setups), for each of 7 required providers:
// 1. we take a providerX
// 2. we take all the reports we have about providerX
// 3. we consider only reports where: the `job.regions.includes(report.region)` // region from attestor when report was submitted


// we decide, whether a provider fits a job description, based on all reports that are relevant
// => in order to check the provider, we instead check all attestations about the provider, which match the job

user.form = {
  from:,
  until,
  performance: { bandwidth, latency, speed },
  storage_availability
  ...
},

user.hoster = {
  measured_at_registration: {},
  measured_by_attestors: {},
  self_reports: {},
}
user.attestor = {
  measured_at_registration: {},
  measured_by_attestors: {},
  // self_reports: {},
}

user.hoster = {
  reports: {
    rating: {
      region1: {reliability, quality},
      region2: {reliability, quality},
      region3: {reliability, quality},
    },
    performance: {
      region1:  {bandwidth, latency, speed}, // <= updates with every new report
      region2:  {bandwidth, latency, speed},
      region3:  {bandwidth, latency, speed},

    }
  }
}

plan.regions = [ region1]


```


dynamic provider-pool
- drop in rate
- drop out rate (of providers)
- list providers in the pool





-------------------------------------------------------------------------------

# HOSTER EXTENSION
```js
function hosting_extension (feed, { onmessage, onerror }) {
  // https://www.npmjs.com/package/abstract-extension
  // https://github.com/hypercore-protocol/hypercore/blob/master/index.js
  // https://github.com/hypercore-protocol/hypercore/blob/master/lib/replicate.js#L758
  const name = 'hosting-extension'
  const handlers = {
    encoding: 'json' // | 'binary' | 'utf-8' | anyAbstractEncoding,
    onmessage,
    onerror
  }
  // Register a new replication extension. name should be the name of your extension and handlers should look like this:
  const ext = feed.registerExtension(name, handlers)
  return ext
}
```
-------------------------------------------------------------------------------
# HOSTER
```js
function offer_hosting (feed) {
  const ext = hosting_extension(feed)
  // feed.on('peer-add', peer) // Emitted when a peer is added.
  // feed.on('peer-remove', peer) // Emitted when a peer is removed.
  feed.on('peer-open', peer => { // Emitted when a peer channel has been fully opened.
    const message = initial_hoster_message()
    ext.send(message, peer)
    // Send an extension message to a specific peer.
  })
}
```

// check REGISTRATION FORM `registrationForm.js`
-------------------------------------------------------------------------------
# ATTESTOR
```js
const hosting_extension = require('hosting-extension')
const get_and_make_feed = require('get-and-make-feed')

on('provide_performance_benchmark', async function (event) {
  if (is_not_for_me(event)) return
  var done
  const { signal, abort } = new AbortController()
  const id_pop = setTimeout(abort, 5000)
  try {
    const data = await execute_benchmark(event, signal)
    submit_benchmark({ event, data })
  } catch (error) {
    submit_benchmark({ event, error })
  }
  function submit_benchmark (result) {
    if (done) return
    done = true
    clearTimeout(id_pop)
    chain.performance_benchmark_response(make_rating(event, result))
  }
})

function make_rating (event, { error, data }) {
  if (error) {
    if (error.message === 'timeout: default benchmark') {
      // submit default rating
      return {}
    } else {
      // submit other error rating
      return {}
    }
  } else {
    // submit normal rating
    return {}
  }
}

async function execute_benchmark (event, signal) {
  return new Promise((resolve, reject) => {
    signal.onabort(() => reject(new Error('timeout: default benchmark')))
    const feed = await make_and_get_feed(event) // announce
    // feed.on('peer-add', peer) // Emitted when a peer is added.
    feed.on('peer-add', peer => {
      // ...
      peer.destroy()
      // TODO: maybe observe request patterns for later re-use with hoster
    })
    // feed.on('peer-remove', peer) // Emitted when a peer is removed.
    feed.on('peer-open', peer => { // Emitted when a peer channel has been fully opened.
      peer.destroy()
      // TODO: maybe observe request patterns for later re-use with hoster
    })
    const ext = hosting_extension(feed, {
      onmessage (message, peer) {
        const hoster = peer
        // called when a message is received from a peer
        // will be decoded using the encoding you provide

        feed.on('update', onupdate)
        function onupdate (index, data) { } // Emitted when a data block is going to be uploaded.
        feed.on('append', onappend)
        function onappend () { } // Emitted when the feed has been appended to (i.e. has a new length / byteLength).
        feed.on('download', ondownload)
        function ondownload (index, data) {} // Emitted when a data block has been downloaded.
        feed.on('upload', onupload)
        function onupload (index, value, peer) { }


        // => report results to the chain after continuing successfully
      },
      onerror (err) {
        // called in case of an decoding error

        // => report encoding error to the chain
      }
    })
  })
}
//////////////////////////////////////////////////////////////////
// RESEARCH
//////////////////////////////////////////////////////////////////
function Feed (opts) {
  // stats for feed (=total of all valid blocks from all peers)
  feed._stats = (typeof opts.stats !== 'undefined' && !opts.stats) ? null : {
    downloadedBlocks: 0,
    downloadedBytes: 0,
    uploadedBlocks: 0,
    uploadedBytes: 0
  }
  feed.peers = []
  return feed
}
const feed = Feed()
const peer1 = Peer({ feed })
const peer2 = Peer({ feed })
console.log(peer1.stats)
console.log(peer1.feed._stats)
function Peer ({ feed }) {
  const peer = { ondata, onrequest, send }
  feed.peers.push(peer)
  peer.feed = feed
  peer.stats = { // stats for Peer
    uploadedBytes: 0,
    uploadedBlocks: 0,
    downloadedBytes: 0,
    downloadedBlocks: 0
  }
  return peer
}
function onrequest (request) {
  peer.stats.uploadedBlocks += 1
  peer.stats.uploadedBytes += value.length
  peer.feed._stats.uploadedBlocks += 1
  peer.feed._stats.uploadedBytes += value.length
  peer.feed.emit('upload', request.index, value, self)
}
function ondata (data) {
  peer.feed._putBuffer(data.index, data.value, data, this, done)
  // Feed.prototype.put = function (index, data, proof, cb) {
  //    // https://github.com/hypercore-protocol/hypercore/blob/101837d3aac2f64f368dc9612d799e55960695b0/index.js#L780
  //    // =>_putBuffer
  //    //   => _verifyAndWrite
  //    //     => _write
  //    //     => _verifyRootsAndWrite
  //    //       => _write
  //    //         => _writeAfterHook
  //    //           => _writeDone
    peer.feed._stats.downloadedBlocks += 1
    peer.feed._stats.downloadedBytes += data.length
    peer.feed.emit('download', index, data, from)
  // }
  function done (err) {
    peer.stats.downloadedBlocks += 1
    peer.stats.downloadedBytes += data.value.length
  }
}
//////////////////////////////////////////////////////////////////
// IMPLEMENTATION
//////////////////////////////////////////////////////////////////
async function getFeedStats (feed) {
  // const latency = { lag, guarantee }
  // const performance = { availability, bandwidth, latency }
  // const performances = [{ // OPTIONAL
  //   availability: '', // percentage_decimal
  //   bandwidth: { /*'speed', 'guarantee'*/ }, // bitspersecond, percentage_decimal
  //   latency: { /*'lag', 'guarantee'*/ }, // milliseconds, percentage_decimal
  // }],
  // const availability = BASIC_TYPES.percentage_decimal
  // const speed = BASIC_TYPES.bitspersecond
  // const guarantee = BASIC_TYPES.percentage_decimal
  const others = {
    latency: await (async (timeout, delay) => {
      const t1 = performance.now()
      await Promise.race([feed.get(index),new Promise(delay)])
      return performance.now() - t1
    })(5000, (_,ko) => setTimeout(ko,timeout)).catch(e=>{}),
    bandwidth: {
      ingress, // input per second
      egress,  // output per second
    },
    traffic: {
      var speed = speedometer()
      stream.on('data', function(data) {
        var bytesPerSecond = speed(data.length) // amount of bytes transferred
        console.log(bytesPerSecond+' bytes/second')
      })
    }
  }
  const stats = {
    totals: {
      uploadedBytes: 100,
      uploadedBlocks: 1,
      downloadedBytes: 0,
      downloadedBlocks: 0
    },
    peers: [{
      uploadedBytes: 100,
      uploadedBlocks: 1,
      downloadedBytes: 0,
      downloadedBlocks: 0
    }]
  }


  feed.update([minLength], [callback])
  // Wait for the feed to contain at least minLength elements. If you do not provide minLength it will be set to current length + 1.
  // Does not download any data from peers except for a proof of the new feed length.
  console.log('length is', feed.length)
  feed.update(function () {
    console.log('length has increased', feed.length)
  })
  feed.length
  // How many blocks of data are available on this feed?
  // Populated after ready has been emitted. Will be 0 before the event.
  feed.byteLength
  // How much data is available on this feed in bytes?
  // Populated after ready has been emitted. Will be 0 before the event.


  const feedStats = {
    uploadedBytes: feed._stats.uploadedBytes,
    uploadedChunks: feed._stats.uploadedBlocks,
    downloadedBytes: feed._stats.downloadedBytes,
    downloadedChunks: feed.downloaded(),

    Feed.prototype.downloaded = function (start, end) {
      const count = this.bitfield.total(start, end)
      return count
    }

    totalBlocks: feed.length,
    peerStats: (() => {
      if (!this._stats) return null
      var peerStats = []
      for (var i = 0; i < this.peers.length; i++) {
        var peer = this.peers[i]
        peerStats[i] = peer._stats // !== feed._stats
      }
      return peerStats
    }),
    networkingStats:{
      key: feed.key,
      discoveryKey: feed.discoveryKey,
      peerCount: feed.peers.length,
      peers: feed.peers.filter(p => p.remoteOpened).map(p => {
        return { ...p.stats, remoteAddress: p.remoteAddress }
      })
    },
  }
}

  async checkPerformance (key, index) { // key = feedkey, index = chunk index
    return new Promise(async (resolve, reject) => {
      const feed = this.Hypercore(key, { persist: false })
      try {
        const start = performance.now()
        await Promise.race([
          feed.get(index),
          delay(this.timeout).then(() => { throw new Error('Timed out') })
        ])
        const end = performance.now()
        const latency = end - start
        const stats = await getFeedStats(feed)
        resolve([stats, latency])
      } catch (e) {
        this.log(`Error: ${key}@${index} ${e.message}`)
        reject()
        return [null, null]
      } finally {
        await feed.close()
      }

      async function getFeedStats (feed) {
        if (!feed) return {}
        const stats = feed.stats
        const openedPeers = feed.peers.filter(p => p.remoteOpened)
        const networkingStats = {
          key: feed.key,
          discoveryKey: feed.discoveryKey,
          peerCount: feed.peers.length,
          peers: openedPeers.map(p => {
            return { ...p.stats, remoteAddress: p.remoteAddress }
          })
        }
        return {
          ...networkingStats,
          uploadedBytes: stats.totals.uploadedBytes,
          uploadedChunks: stats.totals.uploadedBlocks,
          downloadedBytes: stats.totals.downloadedBytes,
          downloadedChunks: feed.downloaded(),
          totalBlocks: feed.length
        }
      }
    })
  }
///////////////////////////////////////////////////////////////////////
```
-------------------------------------------------------------------------------
# CHAIN
```js
async function performance_benchmark_response (rating) {
  console.log(rating)
  // 1. availability/reliability is calculated
  // 2.
  // ...


  //
  // ... ... ...
  // ...
}
function _doesQualify (roleID) {
  var bool
  // ...

  // ...
  return bool
}
```
