const express = require('express');
const bodyParser = require('body-parser');

const app = express();

app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/search', function (req, res) {
  const needle = req.body.needle;
  res.send(`got ${needle}`);
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});
