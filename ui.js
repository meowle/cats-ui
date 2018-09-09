const express = require('express');
const bodyParser = require('body-parser');
const fetch = require('node-fetch');

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

  fetch('http://localhost:3001/api/search', {
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
    })
    .then(function (json) {
      res.render('results', {
        names: json.names,
        needle
      });
    });

  // get search result
  // render pge
});

app.listen(3000);