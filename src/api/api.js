const express = require('express')
const bodyParser = require('body-parser')
const names = require('./names')
const boom = require('boom')

function createApp(dbPath) {
  const namesDb = names.connectDb(dbPath)

  const app = express()
  app.use(bodyParser.json())

  app.post('/api/search', function(req, res, next) {
    const needle = req.body.needle

    if (isValidNeedle(needle, next)) {
      namesDb.searchNames(req.body.needle, function(namesFound) {
        res.json(namesDb.groupNamesAndSort(namesFound))
      })
    }
  })

  app.post('/api/add', function(req, res, next) {
    const needle = req.body.needle

    if (isValidNeedle(needle, next)) {
      namesDb.createNewName(needle, function(insertedName) {
        res.json(insertedName)
      })
    }
  })

  app.delete('/api/remove', function(req, res) {
    namesDb.deleteByName(req.body.needle, function() {
      res.send('ok')
    })
  })

  app.get('/cats/:catId', function(req, res) {
    namesDb.searchById(req.params.catId, function({ name, details }) {
      res.json({
        name,
        details,
      })
    })
  })

  app.use(function(err, req, res, next) {
    return res.status(err.output.statusCode).send(err.output.payload)
  })

  return app
}

function isValidNeedle(needle, next) {
  if (needle == null || needle.length == 0) {
    next(boom.badRequest('needle is empty'))
    return false
  }

  return true
}

module.exports = createApp
