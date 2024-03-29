const WebSocket = require('ws')

const sublog = require('_sublog')
const codec = require('_sublog/codec')
const report = require('_sublog/report')

const docs = {
  'all:live': `receive all log message and subscribe to future messages`
}

var instance = void 0

module.exports = logkeeper

async function logkeeper (name, PORT) {
  PORT = Number(PORT)
  if (instance) throw new Error('logkeeper already initialized')
  if (typeof name !== 'string') throw new Error('invalid logger name')
  if (!Number.isInteger(PORT)) throw new Error('invalid logger port')
  return new Promise(connect)
  function connect (resolve, reject) {
    const connections = []
    const history = [] // TODO: should be a persistent hypercore

    const instance = sublog(name, mylogger)
    const LOG = instance.sub('logkeeper')

    const wss = new WebSocket.Server({ port: PORT }, after)
    function after () {
      LOG({ type: 'info', data: `running on http://localhost:${wss.address().port}` })
    }
    resolve(instance)
    wss.on('connection', function connection (ws) {
      const index = connections.push(ws) - 1
      ws.on('message', function incoming (message) {
        LOG('New message')
        message = JSON.parse(message)
        const { head, type, data } = message
        const [from, into, id] = head
        const doc = docs[type]
        if (type === 'all:live') {
          LOG({ type: 'info', data: { text: 'send logs to client:', from } })
          for (var i = 0, len = history.length; i < len; i++) ws.send(history[i])
        } else LOG({ type: 'info', data: { text: 'client sent unknown message', message, doc } })
      })
      ws.on('close', function close () {
        connections[index] = undefined
        LOG({ type: 'info', data: `client ${index} disconnected from logkeeper ${name}/${PORT} logkeeper` })
      })
      ws.on('error', function error (err) {
        connections[index] = undefined
        LOG({ type: 'error', data: { text: `client ${index} disconnected from logkeeper ${name}/${PORT} logkeeper`, error: err } })
      })
    })
    function mylogger (message) {
      try {
        report(codec.decode(message))
        history.push(message)
        for (var i = 0, len = connections.length; i < len; i++) {
          const client = connections[i]
          if (client) client.send(message)
        }
      } catch (error) {
        console.error({ type: 'fail', message, error })
      }
    }
  }
}
