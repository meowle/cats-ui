const httpProxy = require('http-proxy')

class Proxy {
  constructor(apiUrl) {
    this._configs = []
    this._httpProxy = httpProxy.createProxyServer({ target: apiUrl })
  }

  init() {
    this._httpProxy.on('proxyRes', (proxyRes, req, res) => {
      const currentProxyPath = this._findProxyConfig(req)

      if (currentProxyPath && currentProxyPath.cb) {
        currentProxyPath.cb(proxyRes, req, res)
      }
    })

    return (req, res, next) => {
      const config = this._findProxyConfig(req);

      if (config) {
        this._httpProxy.web(req, res, {
          selfHandleResponse: config.changeResponse,
        })
        return
      }

      res.writeContinue()
      next()
    }
  }

  get(url, changeResponse, cb) {
    this._createConfig('get', url, changeResponse, cb)
  }

  post(url, changeResponse, cb) {
    this._createConfig('post', url, changeResponse, cb)
  }

  put(url, changeResponse, cb) {
    this._createConfig('put', url, changeResponse, cb)
  }

  delete(url, changeResponse, cb) {
    this._createConfig('delete', url, changeResponse, cb)
  }

  _createConfig(method, url, changeResponse, cb) {
    this._configs.push({
      url: this._urlToRegex(url),
      method,
      cb,
      changeResponse,
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