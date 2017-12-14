import m from 'mithril'
import { uuid } from '../utils'

class Sticky {
  constructor (vnode) {
    this.item = vnode.attrs.item
  }

  view (vnode) {
    return m('div.item.sticky', {}, [
      // Text of item
      m('div.row', [
        m('input', {
          type: 'text',
          value: this.item.summary,
          disabled: true
        })
      ])
    ])
  }
}

class Item {
  constructor (todo) {
    var _this = {
      summary: '',
    }
    Object.assign(this, _this)

    this.defaults = (username) => {
      this.id = username
      this.created_at = new Date().getTime();
      this.due = this.created_at + 10000000 // TODO
      this.sequence = 1
      this.status = "in_process"
      this.x = { "TOOD-ID": uuid() }
    }

    this.setSummary = (summary) => this.summary = summary
  }
}

class ItemSticky {
  constructor (vnode) {
    this.todo = vnode.attrs.todo
    this.update = () => vnode.attrs.update(this.todo)
    this.ready = () => {
      this.todo.status = 'completed'
      vnode.attrs.update(this.todo)
    }

    this.close = vnode.attrs.close

    this.setSummary = (function (that) {
      return (summary) => {
        that.todo.summary = summary
      }
    })(this)
  }

  view (vnode) {
    return m('div.item.sticky', {}, [
      // Closing small 'x' character
      m('div.row.right.x', m('span', { onclick:  this.close }, 'x')),

      // Text of item
      m('div.row', [
        m('input', {
          type: 'text',
          value: this.todo.summary,
          onchange: m.withAttr('value', this.setSummary)
        })
      ]),

      m('div.row', [
        // Submit button
        m('button', { type: 'submit', onclick: this.update }, 'Update'),
        // Ready button
        m('button', { type: 'submit', onclick: this.ready  }, 'Ready!')
      ]),
    ])
  }
}

class ItemCreatorSticky {
  constructor (vnode) {
    this.item = new Item()
    this.createItem = () => {
      this.item.defaults(vnode.attrs.username)
      vnode.attrs.createItem(this.item)
      this.item = new Item()
    }
  }

  view (vnode) {
    return m('div.item.sticky', {}, [
      m('div.row', [
        // Text of item
        m('input', {
          type: 'text',
          value: this.item.summary,
          onchange: m.withAttr('value', this.item.setSummary)
        }),

        // Submit button
        m('button', {type: 'submit', onclick: this.createItem}, 'Create')
      ])
    ])
  }
}

export { ItemSticky, ItemCreatorSticky, Sticky }
