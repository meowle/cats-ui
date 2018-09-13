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
        const groups = {};
        for (let i = 0; i < names.length; i++) {
            const name = names[i];
            const title = name.charAt(0);
            if (groups[title] == null) {
                groups[title] = [name];
            } else {
                groups[title].push(name);
            }
        }
        const keys = Array.from(Object.keys(groups)).sort();
        const sorterGroups = [];
        let count = 0;
        for (let i = 0; i < keys.length; i++) {
            const key = keys[i];
            const group = {
                title: key,
                names: groups[key].sort(),
                count: groups[key].length
            };
            sorterGroups.push(group);
            count = count + group.count;
        }
        res.json({
            groups: sorterGroups,
            count
        });
    });
})

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

app.post('/api/add', function (req, res) {
    db.insert({
        _id: req.body.needle.toLowerCase(),
        name: capitalizeFirstLetter(req.body.needle)
    }, function (err, newDoc) {
        res.json(newDoc);
    });
});

app.listen(3001);