const express = require('express');
const bodyParser = require('body-parser');
const fetch = require('node-fetch');
const names = require('../api/names');

function createApp() {
  const app = express();

  app.set('view engine', 'pug');
  app.use(express.static('public'));
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({
    extended: true
  }));
  app.get('/', function (req, res) {
    res.render('index');
  });

  app.post('/search', function (req, res) {
    const needle = req.body.needle;

    searchName(needle)
      .then(function (json) {
        return renderSearchResult(json, needle);
      })
      .then(function (renderResult) {
        res.render(renderResult.template, renderResult.context);
      });
  });

  app.post('/add', function (req, res) {
    const needle = req.body.needle;

    fetch('http://localhost:3001/api/add', {
        method: 'post',
        body: JSON.stringify({
          needle
        }),
        headers: {
          'Content-Type': 'application/json'
        },
      })
      .then(function () {
        res.render('results', makeSingleResult(needle));
      });
  });

  function searchName(needle) {
    return fetch('http://localhost:3001/api/search', {
        method: 'post',
        body: JSON.stringify({
          needle
        }),
        headers: {
          'Content-Type': 'application/json'
        },
      })
      .then(function (res) {
        return res.json();
      });
  }

  return app;
}

function renderSearchResult(json, needle) {
  if (json.groups.length == 0) {
    return {
      template: 'no-result',
      context: {
        needle
      }
    };
  } else {
    return {
      template: 'results',
      context: {
        groups: json.groups,
        count: json.count,
        needle
      }
    };
  }
}

function makeSingleResult(needle) {
  const needleCap = names.capitalizeFirstLetter(needle);

  return {
    groups: [{
      title: needleCap.charAt(0),
      names: [needleCap],
      count: 1
    }],
    count: 1,
    needle
  };
}

module.exports = {
  createApp,
  makeSingleResult
};
