const express = require('express');
const bodyParser = require('body-parser');
const names = require('./names');
const app = express();
const namesDb = names.connectDb('names.db');

app.use(bodyParser.json());

app.post('/api/search', function (req, res) {
    namesDb.searchNames(req.body.needle, function (namesFound) {
        res.json(namesDb.groupNamesAndSort(namesFound));
    });
});

app.post('/api/add', function (req, res) {
    const trimmedName = req.body.needle.trim();
    const trimmedSymbolName = names.trimSymbols(trimmedName);

    namesDb.createNewName(trimmedSymbolName, function (insertedName) {
        res.json(insertedName);
    });
});

app.listen(3001);