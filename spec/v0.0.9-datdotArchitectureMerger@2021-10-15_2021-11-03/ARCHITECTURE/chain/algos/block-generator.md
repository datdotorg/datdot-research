# block generator
```js
// GLOBAL MAIN FUNCTION (="tracker")
on('block', block => {
  const { number, extrinsics } = block
  // TODO: stop or limit executing from calendar or queue IF too many items for current block
  const entries = takeBatch(calendar, queue) // execute CALENDAR and QUEUE
  const tasks = [...entries, ...extrinsics]
  tasks.forEach(execute_task)
})
function execute_task ({ type, id }) {
  const { type, id } = event
  // ACTIONS:
  if (type === 'calendar:execute_plan') queue.add(event)
  if (type === 'queue:execute_plan') _execute_plan(id, trigger)
  // TODO: make this more detailed
  function trigger (message) {
    const { name, data}
    emit(name, { cite: [type, id], data })
  }
}
```
