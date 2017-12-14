import Communication from './communication'
import Store from './store'

import Cookies from './cookies'

// 'Static' private member
var communication

class SessionHandler {
  constructor (url = '/ws') {
    communication = new Communication(url)
    this.store = new Store()
  }

  registerUser (userId) {
    let user = this.setUser({user:{id: userId}})
    Cookies.setCookie('PhUser', userId)
    return user
  }

  throwError(error) {  throw error; return error }

  signupErrors () { return ['already_registered'] }

  signup (user) {
    return communication.signup(user)
      .then((response) => this.signupErrors().indexOf(response) >= 0 ? this.throwError(response) : this.registerUser(response))
  }

  loginErrors () { return ['not_registered', 'bad_password'] }

  // NOTE this is neccessary cuz of scoping
  login (user) {
    return communication.login(user)
      .then((response) => this.loginErrors().indexOf(response) >= 0 ? this.throwError(response) : (this.registerUser(response).user))
  }

  logout (user) {
    return communication.logout(user)
      .then((response) => Cookies.eraseCookie('PhUser'))
  }

  setUser (data) {
    this.store.user().id = data.user.id

    if (data.user.name) { this.store.user().name = data.user.name }
    if (data.items) { data.items.map((item) => this.store.user().items.set(item.id, item)) }

    return data
  }

  setItem (item) {
    this.store.user().items.set(item.id, item)

    return item
  }

  removeItem (itemId) {
    this.store.user().items.delete(itemId)
  }

  getUserData () {
    let user = {user_id: Cookies.getCookie('PhUser')}

    return communication.getUserData(user)
      .then((data) => this.setUser(data))
  }

  addItem (item) {
    return communication.addItem(item)
      .then((item) => this.setItem(item))
  }

  updateItem (item) {
    return communication.updateItem(item)
      .then((_) => this.setItem(item))
  }

  deleteItem (item) {
    return communication.deleteItem(item)
      .then((_) => this.removeItem(item.id))
  }

  forkItem (item, userId) {
    return communication.forkItem(item)
      .then(function (itemId) {
        var _item = item
        _item.id = itemId
        return this.setItem(_item)
      })
  }
}

export default SessionHandler
