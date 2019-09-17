const httpProxy = require('http-proxy')

class Proxy {
  constructor(apiUrl) {
    this._configs = []
    this._httpProxy = httpProxy.createProxyServer({ target: apiUrl })
  }

  init() {
    this._httpProxy.on('proxyRes', (proxyRes, req, res) => {
      const currentProxyPath = this._findProxyConfig(req)

      if (currentProxyPath) {
        currentProxyPath.cb(proxyRes, req, res)
      }
    })

    return (req, res, next) => {
      if (this._findProxyConfig(req)) {
        this._httpProxy.web(req, res, {
          selfHandleResponse: true,
        })
        return
      }

      res.writeContinue()
      next()
    }
  }

  get(url, cb) {
    this._createConfig('get', url, cb)
  }

  post(url, cb) {
    this._createConfig('post', url, cb)
  }

  put(url, cb) {
    this._createConfig('put', url, cb)
  }

  delete(url, cb) {
    this._createConfig('delete', url, cb)
  }

  _createConfig(method, url, cb) {
    this._configs.push({
      url: this._urlToRegex(url),
      method,
      cb,
    })
  }

  _urlToRegex(url) {
    return url.replace(/:(\w+)/gi, '[^/$]+')
  }

  _findProxyConfig(req) {
    return this._configs.find(({ method, url }) =>
      method === req.method.toLowerCase() && req.url.match(url))
  }
}

module.exports = apiUrl => new Proxy(apiUrl)