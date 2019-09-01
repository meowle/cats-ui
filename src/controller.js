const express = require('express')
const bodyParser = require('body-parser')
const favicon = require('serve-favicon')
const path = require('path')
const {
  getRules,
  searchCatsWithApi,
  showFailPage,
  saveCatDescription,
  searchNameDetails,
  addCats,
} = require('./services')

function createApp() {
  const app = express()

  app.set('view engine', 'pug')

  app.use(express.static('public'))
  app.use(favicon(path.join(__dirname, '..', 'public', 'img', 'favicon.ico')))
  app.use(bodyParser.json())
  app.use(
    bodyParser.urlencoded({
      extended: true,
    })
  )

  app.get('/', function(req, res) {
    getRules().then(rules =>
      res.render('index', {
        validationRules: rules,
      })
    )
  })

  /*
  Метод поиска котов по имени и полу
  */
  app.get('/search', function(req, res) {
    const searchParams = {
      needle: req.query.needle,
      genders: [],
    }

    if (req.query.male != null) {
      searchParams.genders.push('male')
    }
    
    if (req.query.female != null) {
      searchParams.genders.push('female')
    }

    if (req.query.unisex != null) {
      searchParams.genders.push('unisex')
    }

    Promise.all([
      searchCatsWithApi(searchParams, res),
      getRules(),
    ])
      .then(([renderResult, validationRules]) => {
        const { template, context } = renderResult
        res.render(template, { ...context, validationRules })
      })
      .catch(() => showFailPage(res))
  })

  /*
  Метод добавления котов
  */
  app.post('/cats/add', function(req, res) {
    const { catName } = req.body

    let catsToAdd

    if (!Array.isArray(catName)) {
      catsToAdd = [{ name: catName }]
    } else {
      catsToAdd = []
      for (let i = 0; i < catName.length; i++) {
        catsToAdd.push({
          name: catName[i],
        })
      }
    }

    Promise.all([addCats(catsToAdd, res), getRules()])
      .then(([catSuccessfullyAdded, validationRules]) => {
        if (catSuccessfullyAdded) {
          res.render('index', { showSuccessPopup: true, validationRules })
        } else {
          showFailPage(res)
        }
      })
      .catch(() => showFailPage(res))
  })

  /*
  Метод получения кота по ID
  */
  app.get('/cats/:catId', function(req, res) {
    const { catId } = req.params
    searchNameDetails(catId)
      .then(json => json.cat)
      .then(cat => {
        const { name, description, id } = cat
        res.render('name-details', {
          name,
          description,
          // gender,
          id,
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

  return app
}

module.exports = {
  createApp,
}
