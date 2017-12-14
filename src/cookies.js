var Cookies = {
  defaultCookieTimeout: 15768000000, // 6 months

  setCookie (name, value, msToExpire, path, domain, secure) {
    var date = new Date()
    date.setTime(date.getTime() + (msToExpire || this.defaultCookieTimeout))

    document.cookie = `${name}=${window.encodeURIComponent(value)};` +
      `expires=${date.toGMTString()};` +
      `path=${(path || '/')}${(domain ? 'domain=' + domain : '')}${(secure ? 'secure' : '')};`
  },

  getCookie (name) {
    var cookiePattern = new RegExp('(^|)[ ]*' + name + '=([^]*)')
    var cookieMatch = cookiePattern.exec(document.cookie)

    return cookieMatch ? window.decodeURIComponent(cookieMatch[2]) : null
  },

  eraseCookie (name) {
    this.setCookie(name, '', -1)
  }
}

export default Cookies
