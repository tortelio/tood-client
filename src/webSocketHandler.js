import Event from './event'

var _sendQueue = []

class WebSocketHandler {
  constructor (hostname) {
    this.hostname = hostname
    this.ready = false
    this.events = new Map()
    this.ws = new WebSocket(hostname)
    this.ws.addEventListener('open', (event) => this.onOpen(event))
  }

  close () { this.ws.close() }

  onOpen () {
    this.ws.addEventListener('message', (event) => this.onMessage(event))
    this.ready = true
    this.sendQueue()
  }

  sendQueue () {
    _sendQueue.forEach((data) => this.ws.send(data))
  }

  send (data) {
    let serializedData = JSON.stringify(data)
    if (this.ready) {
      this.ws.send(serializedData)
    } else {
      _sendQueue.push(serializedData)
    }
  }

  // necessary because of es6 & old school scoping
  sendForResponse (data) {
    let promise = function (resolve, reject) {
      let _handler = function (event) {
        this.removeEventListener(data.type, handler)
        resolve(event)
      }
      let handler = (event) => _handler.apply(this, [event])
      this.addEventListener(data.type, handler)
      this.send(data)
    }

    return new Promise((resolve, reject) => promise.apply(this, [resolve, reject]))
  }

  registerEvent (eventType) {
    this.events.set(eventType, new Event(eventType))
  }

  addEventListener (eventType, callback) {
    if (!this.events.has(eventType)) { this.registerEvent(eventType) }
    this.events.get(eventType).registerCallback(callback)
  }

  removeEventListener (eventType, callback) {
    if (this.events.has(eventType)) {
      let exists = this.events.get(eventType).hasCallback(callback)
      if (!exists) {
        console.error('Try to remove an unregistered callback function')
      } else {
        if (this.events.get(eventType).lastCallback) {
          this.events.delete(eventType)
        } else {
          this.events.get(eventType).unregisterCallback(callback)
        }
      }
    }
  }

  onMessage (event) {
    let data = JSON.parse(event.data)
    this.dispatchEvent(data.type, data)
  }

  dispatchEvent (eventType, state) {
    if (eventType === 'unhandled') {
      console.error('Try to send an unhandled action')
    } else if (this.events.has(eventType)) {
      this.events.get(eventType).dispatch(state)
    } else { console.warn(`${eventType} is not registered.`) }
  }
}

export default WebSocketHandler
