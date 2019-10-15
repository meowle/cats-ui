const express = require('express')
const bodyParser = require('body-parser')
const favicon = require('serve-favicon')
const path = require('path')
const { apiUri } = require('./configs')
const proxy = require('./proxy')(apiUri)
const {
  getRules,
  searchCatsWithApi,
  showFailPage,
  saveCatDescription,
  searchNameDetails,
  addCats,
  getAllCats,
  searchCatsByPatternWithApi,
  getPhotos,
  getVersions,
} = require('./services')
const pino = require('express-pino-logger')()

function createApp() {
  const app = express()

  app.use(pino)

  app.set('view engine', 'pug')

  app.use(express.static('public'))
  app.use(favicon(path.join(__dirname, '..', 'public', 'img', 'favicon.ico')))
  app.use(bodyParser.json())
  app.use(
    bodyParser.urlencoded({
      extended: true,
    })
  )

  app.use(proxy.init())

  app.get('/', function(req, res) {
    getRules()
      .then(rules =>
        res.render('index', {
          validationRules: rules,
        })
      )
      .catch(err => {
        req.log.error(err.message)
        showFailPage(res)
      })
  })

  /*
  Метод поиска котов по имени и полу
  */
  app.get('/search', function(req, res) {
    const searchParams = {
      needle: req.query.needle,
      gender: req.query.gender,
    }

    Promise.all([searchCatsWithApi(searchParams, res), getRules()])
      .then(([renderResult, validationRules]) => {
        const { template, context } = renderResult
        res.render(template, { ...context, validationRules })
      })
      .catch(() => showFailPage(res))
  })

  /*
  Метод вывода всех котов
  */
  app.get('/all-names', function(req, res) {
    const filter = { order: req.query.order, gender: req.query.gender }

    Promise.all([getAllCats(filter), getRules()])
      .then(([renderResult, validationRules]) => {
        const { template, context } = renderResult
        res.render(template, {
          ...context,
          validationRules,
          order: filter.order || 'none',
          gender: filter.gender,
        })
      })
      .catch(() => showFailPage(res))
  })

  /*
  Метод поиска котов по имени и полу
  */
  app.get('/search-suggests', function(req, res) {
    if (!req.query.name) {
      return res.json([])
    }

    const limit = req.query.limit || 20

    searchCatsByPatternWithApi(req.query.name, limit)
      .then(result => {
        res.json(result)
      })
      .catch(err => req.log.error(err.message))
  })

  /*
  Метод добавления котов
  */
  app.post('/cats/add', function(req, res) {
    const cats = {}

    for (const [catParam, value] of Object.entries(req.body)) {
      const catNameMatch = catParam.match(/^cat-name-(\d+)$/)
      if (catNameMatch) {
        const catIndex = catNameMatch[1]
        if (cats[catIndex] == null) {
          cats[catIndex] = {}
        }

        cats[catIndex].name = value.trim()
        continue
      }

      const catGenderMatch = catParam.match(/^cat-gender-(\d+)$/)
      if (catGenderMatch) {
        const catIndex = catGenderMatch[1]
        if (cats[catIndex] == null) {
          cats[catIndex] = {}
        }

        cats[catIndex].gender = value.trim()
        continue
      }
    }

    const catsToAdd = Object.values(cats)

    Promise.all([addCats(catsToAdd, res), getRules()])
      .then(([validationError, validationRules]) => {
        res.render('index', { showSuccessPopup: true, validationRules })
      })
      .catch(err => showFailPage(res, {popupFailMessage: err.message} ))
  })

  /*
  Метод получения кота по ID
  */
  app.get('/cats/:catId', function(req, res) {
    const { catId } = req.params
    Promise.all([searchNameDetails(catId), getRules(), getPhotos(catId)])
      .then(([cat, validationRules, photos]) => {
        const {
          cat: { name, description, id },
        } = cat
        const images = photos.images

        res.render('name-details', {
          name,
          description,
          // gender,
          id,
          validationRules,
          photos: images,
        })
      })
      .catch(() => showFailPage(res))
  })

  /*
  Метод вызова редактирования кота
  */
  app.get('/cats/:catId/edit', function(req, res) {
    const { catId } = req.params
    searchNameDetails(catId)
      .then(json => json.cat)
      .then(cat => {
        const { name, description, id } = cat
        res.render('name-details-edit', {
          name,
          description,
          id,
        })
      })
      .catch(() => showFailPage(res))
  })

  /*
  Метод сохранения модицификации кота
  */
  app.post('/cats/:catId/edit', function(req, res) {
    const { catId } = req.params
    const { description } = req.body

    saveCatDescription(catId, description)
      .then(json => json.cat)
      .then(cat => {
        const { name, description, id } = cat
        res.render('name-details', {
          name,
          description,
          id,
        })
      })
      .catch(() => showFailPage(res))
  })

  /*
  Метод получения версий сервисов
  */
  app.get('/versions', function(req, res) {
    getVersions()
      .then(result => {
        res.json(result)
      })
  })

  proxy.post('/cats/:catId/upload', true, function(proxyRes, req, res) {
    proxyRes.on('data', () => {})

    proxyRes.on('end', function() {
      res.redirect('back')
    })
  })

  proxy.get('/photos', false)

  return app
}

module.exports = {
  createApp,
}
