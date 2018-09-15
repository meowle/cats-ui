const express = require('express');
const bodyParser = require('body-parser');
const names = require('./names');
const app = express();
const namesDb = names('names.db');

app.use(bodyParser.json());

app.post('/api/search', function (req, res) {
    namesDb.searchNames(req.body.needle, function (namesFound) {
        res.json(namesDb.groupNamesAndSort(namesFound));
    });
});

app.post('/api/add', function (req, res) {
    namesDb.createNewName(req.body.needle, function (insertedName) {
        res.json(insertedName);
    });
});

app.listen(3001);