const express = require('express')
const bodyParser = require('body-parser')
const fetch = require('node-fetch')
const favicon = require('serve-favicon')
const path = require('path')
const { apiUri } = require('./configs')

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
        validationRules: rules
      })
    )
  })

  app.post('/search', function(req, res) {
    const needle = req.body.needle
    Promise.all([renderSearchName(needle, res), getRules()])
      .then(([renderResult, validationRules]) => {
        const { template, context } = renderResult
        res.render(template, {...context, validationRules})
      })
      .catch(() => showFailPage(res))
  })

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
          res.render('index', { showSuccessPopup: true , validationRules})
        } else {
          showFailPage(res)
        }
      })
      .catch(() => showFailPage(res))
  })

  app.get('/cats/:catId', function(req, res) {
    const { catId } = req.params
    searchNameDetails(catId)
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

function saveCatDescription(catId, catDescription) {
  return fetch(`${apiUri}/cats/save-description`, {
    method: 'post',
    body: JSON.stringify({
      catId,
      catDescription,
    }),
    headers: {
      'Content-Type': 'application/json',
    },
  }).then(res => res.json())
}

function getRules() {
  return fetch(`${apiUri}/cats/validation`).then(res => res.json())
}

function searchNameDetails(catId) {
  return fetch(`${apiUri}/cats/get-by-id?id=${catId}`).then(res => res.json())
}

function renderSearchName(catName, res) {
  return fetch(`${apiUri}/cats/search`, {
    method: 'post',
    body: JSON.stringify({
      name: catName,
    }),
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then(res => res.json())
    .then(json => createRenderContesxtSearchResult(json, catName))
}

function addCats(cats) {
  return fetch(`${apiUri}/cats/add`, {
    method: 'post',
    body: JSON.stringify({
      cats,
    }),
    headers: {
      'Content-Type': 'application/json',
    },
  }).then(res => res.ok)
}

function createRenderContesxtSearchResult(json, needle) {
  if (json.groups == null || json.groups.length == 0) {
    return {
      template: 'no-result',
      context: {
        needle,
      },
    }
  } else {
    return {
      template: 'results',
      context: {
        groups: json.groups,
        count: json.count,
        needle,
      },
    }
  }
}

function showFailPage(res) {
  res.render('index', { showFailPopup: true })
}

module.exports = {
  createApp,
  createRenderContesxtSearchResult,
}
