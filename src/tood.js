import m from 'mithril'

import Index from './tood/index'
import User from './tood/user'

class Tood {
  constructor (url, element = document.body) {
    this.element = element
    this.setupRouting()
  }

  setupRouting () {
    m.route.mode = 'hash'
    m.route(this.element, '/', {
      '/': Index,
      '/users/:userId': User
    })
  }
}

export default Tood
