const express = require('express')
const bodyParser = require('body-parser')
const fetch = require('node-fetch')
const names = require('../api/names')

function createApp() {
  const app = express()

  app.set('view engine', 'pug')
  app.use(express.static('public'))
  app.use(bodyParser.json())
  app.use(
    bodyParser.urlencoded({
      extended: true,
    })
  )
  app.get('/', function(req, res) {
    res.render('index')
  })

  app.post('/search', function(req, res) {
    const needle = req.body.needle
    renderSearchName(needle, res)
  })

  app.post('/add', function(req, res) {
    const needle = req.body.needle

    fetch('http://localhost:3001/api/add', {
      method: 'post',
      body: JSON.stringify({
        needle,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    }).then(function() {
      renderSearchName(needle, res)
    })
  })

  app.get('/cats/:catId', function(req, res) {
    const catId = req.params.catId
    searchNameDetails(catId).then(function(json) {
      const { template, context } = createRenderContextNameDetails(json, catId)
      res.render(template, context)
    })
  })

  return app
}

function searchNameDetails(catId) {
  return fetch(`http://localhost:3001/cats/${catId}`).then(function(res) {
    return res.json()
  })
}


function renderSearchName(needle, res) {
  searchName(needle)
  .then(function(json) {
    return createRenderContesxtSearchResult(json, needle)
  })
  .then(function(renderResult) {
    res.render(renderResult.template, renderResult.context)
  })  
}

function searchName(needle) {
  return fetch('http://localhost:3001/api/search', {
    method: 'post',
    body: JSON.stringify({
      needle,
    }),
    headers: {
      'Content-Type': 'application/json',
    },
  }).then(function(res) {
    return res.json()
  })
}

function createRenderContextNameDetails(json, catId) {
  return {
    template: 'name-details',
    context: {
      name: json.name,
      details: json.details,
      catId,
    },
  }
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

module.exports = {
  createApp,
  createRenderContesxtSearchResult,
}
