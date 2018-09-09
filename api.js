const express = require('express');
const bodyParser = require('body-parser');

const Datastore = require('nedb'),
    db = new Datastore({
        filename: 'names.db',
        autoload: true
    });


const app = express();

app.use(bodyParser.json());

app.post('/api/search', function (req, res) {
    db.find({
        _id: new RegExp(req.body.needle.toLowerCase())
    }, function (err, docs) {
        const names = docs.map(function (doc) {
            return doc.name;
        });
        res.json({
            names
        });
    });
})

app.listen(3001);