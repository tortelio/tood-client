class Event {
  constructor (name) {
    this.callbacks = new Set()
  }

  dispatch (_state) {
    // TODO context
    this.callbacks.forEach((callback) => callback.apply(callback, arguments))
    return true
  }

  registerCallback (callback) {
    this.callbacks.add(callback)
    return this.callbacks
  }

  unregisterCallback (callback) {
    this.callbacks.delete(callback)
    return this.callbacks
  }

  hasCallback (callback) {
    return this.callbacks.has(callback)
  }

  get lastCallback () {
    return this.callbacks.size === 1
  }
}

export default Event
