import m from 'mithril'

class Store {
  constructor () {
    this.user = {id: '', name: '', items: new Map()}
  }
}

export default Store
