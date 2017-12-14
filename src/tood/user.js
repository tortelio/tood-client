import m from 'mithril'
import { ItemSticky, ItemCreatorSticky, Sticky } from './item'

import WebSocketHandler from '../webSocketHandler'

class User {
  constructor (vnode) {
    this.userId = vnode.attrs.userId
    this.username = vnode.attrs.username
    this.ws = new WebSocketHandler("ws://" + window.location.host + "/websocket/" + vnode.attrs.token)

    this.ws.sendForResponse({type: "get-items"})
      .then((res) => this.items = res.items)
      .then((_) => m.redraw())

    this.logout = () => {
      this.ws.close()
      m.route.set("/")
    }

    // TODO
    this.refresh = (e) => { console.log(this); m.redraw() }
  }

  oninit (vnode) {
    this.items = []
  }

  view (vnode) {
    var creatorAttrs = (function (that) {
      return {
        username: that.username,
        userId: that.userId,
        createItem: (item) => {
          that.ws.send({
            type: "create-item",
            item: item
          })
          that.items = that.items.concat(item)
        }
      }
    })(this)

    var itemAttrs = (function (that) {
      return function (item) {
        return {
          todo: item,
          update: (item) => {
            that.ws.send({
              type: 'update-item',
              item: item
            })
          },
          close: () => {
            that.ws.send({
              type: "delete-item",
              item: item
            })
            that.items = that.items.filter((i) => i !== item)
          }
        }
      }
    })(this)

    return [
      m('div.full.table', [
        m('navbar.navbar', [
          m('button', {onclick: this.logout}, 'Log Out'),
          m('button', {onclick: this.refresh}, 'Refresh'),
          m('span.username', 'Username: ' + this.username),
          m('a', {href: '/todos/' + this.userId, download: this.username + '.ics'}, 'Download .ics')
        ]),
        m('div.user-container', [
          m('div.items-group', [
            m('h2', 'Tickets'),

            m('div', {class: 'row'}, [
              m('h3', 'New ticket'),
              m(ItemCreatorSticky, creatorAttrs)
            ]),

            m('div', {class: 'row'}, [
              m('h3', 'Active tickets'),
              m('div.items', this.items.filter((i) => i.status !== "completed").sort((i) => -i.due).map((item) => m(ItemSticky, itemAttrs(item))))
            ]),

            m('div', {class: 'row'}, [
              m('h3', 'Completed tickets'),
              m('div.items', this.items.filter((i) => i.status == "completed").sort((i) => i.due).map((item) => m(Sticky, { item: item })))
            ]),
          ])
        ])
      ])
    ]
  }
}

export default User
