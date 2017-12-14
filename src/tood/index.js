import m from 'mithril'

class User {
  constructor () {
    this.name = ''
    this.password = ''

    this.setName = (name) => { this.name = name }
    this.setPassword = (password) => { this.password = password }
  }
}

class UserForm {
  constructor (vnode) {
    this.title = ''
    this.user = new User()
    this.successful = false
    this.successfulMsg = ''
    this.error = false
    this.errorMsg = ''
    this.submitBtn = 'OK'

    if ('callback' in vnode.attrs) {
      this.callback = () => {
        vnode.attrs.callback()
      }
    }
  }

  view (vnode) {
    return m('div.login-body.float-left.sticky', {}, [
      m('div.form', [
        m('h2', this.title),

        // Username input
        m('div.row', [
          m('label', 'Username'),
          m('input', {
            type: 'text',
            value: this.user.name,
            onchange: m.withAttr('value', this.user.setName)
            //class: ctrl.bad_user() ? 'error' : ''
          })
        ]),

        // Password input
        m('div.row', [
          m('label', 'Password'),
          m('input', {
            type: 'password',
            value: this.user.password,
            onchange: m.withAttr('value', this.user.setPassword)
            //class: ctrl.bad_password() ? 'error' : ''
          })
        ]),

        // Successful and error message
        m('div.row.msg-box', {class: this.successful ? 'successful' : this.error ? 'error' : ''}, [
          m('div.successful-msg', this.successfulMsg),
          m('div.error-msg', this.errorMsg)
        ]),

        // Sign up button
        m('div.row', [
          m('button.submit', {onclick: this.callback}, this.submitBtn)
        ])
      ])
    ])
  }
}

class LogInForm extends UserForm {
  constructor (vnode) {
    super(vnode)
    this.title = 'Log in'
    this.submitBtn = 'Log in'
    this.successfulMsg = () => 'Successfully logged in'
    this.errorMsg = ''
    this.errorHandler = (reason) => {
      let msg = ''
      switch (reason) {
        case 'not_registered':
          msg = 'Unregistered user'
          break;
        case 'bad_password':
          msg = 'Bad password'
          break;
      }
      return msg
    }
    this.toUserPage = (result) => m.route.set('/users/' + result['user-id'], {token: result.token, username: result.username})
    this.callback = (e) => {
      m.request(PostConfig({
        url : '/log-in',
        data : {
          username : this.user.name,
          password : this.user.password
        }
      })).then(genResultHandler(this, this.errorHandler, this.toUserPage))
    }
  }
}

var PostConfig = function (config) {
  var defaultConfig = {
    method: 'POST',
    headers : {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    }
  }

  return Object.assign(defaultConfig, config)
}

var genResultHandler = function (_this, error, successful = ((result) => result)) {
  return (result) => {
    if (result.state == 'approved') {
      _this.successful = true
      _this.error = false
      successful(result)
    } else if (result.state == 'refused') {
      _this.successful = false
      _this.error = true
      _this.errorMsg = error(result.reason)
    }
  }
}

class SignUpForm extends UserForm {
  constructor (vnode) {
    super(vnode)
    this.title = 'Get a new account'
    this.submitBtn = 'Sign up'
    this.successfulMsg = 'Successfully registered'
    this.errorHandler = (reason) =>{
      let msg = ''
      switch (reason) {
        case 'already_registered' :
          msg = 'Already registered username'
          break;
      }
      return msg
    }
    this.callback = () => {
      m.request(PostConfig({
        url : '/sign-up',
        data : {
          username : this.user.name,
          password : this.user.password
        }
      })).then(genResultHandler(this, this.errorHandler))
    }
  }
}

class Index {
  view () {
    return m('div.login.full.table', [
      m('div.table-cell.vertical-mid', [
        m('div.login-container.centered.centered-container', [
          m('div.login-header', 'Tood'),

          m(LogInForm),
          m(SignUpForm)
        ])
      ])
    ])
  }
}

export default Index
