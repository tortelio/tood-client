import WebSocketHandler from './webSocketHandler'

class Communication {
  encode (type, value) {
    return {type: type, value: value}
  }

  decode (obj) {
    return obj.value
  }

  req (type, data) {
    return this.wsh.sendForResponse(this.encode(type, data))
      .then((res) => this.decode(res))
  }

  constructor (url) {
    this.wsh = new WebSocketHandler(url)
  }

  login (user) {
    return this.req('log_in', user)
  }

  logout (user) {
    return this.req('log_out', user)
  }

  signup (user) {
    return this.req('sign_up', user)
  }

  getUserData (user) {
    return this.req('get_user_data', user)
  }

  addItem (item) {
    return this.req('add_item', item)
  }

  updateItem (item) {
    return this.req('update_item', item)
  }

  deleteItem (item) {
    return this.req('delete_item', item)
  }

  forkItem (item) {
    return this.req('fork_item', item)
  }
}

export default Communication
