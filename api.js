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
    searchNames(req.body.needle, function (namesFound) {
        res.json(groupNamesAndSort(namesFound));
    });
});

app.post('/api/add', function (req, res) {
    createNewName(req.body.needle, function (insertedName) {
        res.json(insertedName);
    });
});

function searchNames(needle, callback) {
    const searchPattern = {
        _id: new RegExp(needle.toLowerCase())
    };

    db.find(searchPattern, function (err, namesFound) {
        callback(namesFound);
    });
}

function groupNamesAndSort(namesFound) {
    const names = namesFound.map(nameFound => nameFound.name);
    const groups = groupByFirstLetter(names);
    const keysSortedAlphabetically = Array.from(Object.keys(groups)).sort();
    const sorterGroup = sortGroupAlphabetically(groups, keysSortedAlphabetically);
    const count = countNames(sorterGroup);

    return {
        groups: sorterGroup,
        count
    };
}

function groupByFirstLetter(names) {
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

    return groups;
}

function sortGroupAlphabetically(groups, keysSortedAlphabetically) {
    const sorterGroup = [];
    for (let i = 0; i < keysSortedAlphabetically.length; i++) {
        const key = keysSortedAlphabetically[i];
        const group = {
            title: key,
            names: groups[key].sort(),
        };
        sorterGroup.push(group);
    }
    return sorterGroup;
}

function countNames(groups) {
    let count = 0;
    for (let i = 0; i < groups.length; i++) {
        const group = groups[i];
        group['count'] = group.names.length;
        count = count + group.count;
    }
    return count;
}


function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function createNewName(needle, callback) {
    const newName = {
        _id: needle.toLowerCase(),
        name: capitalizeFirstLetter(needle)
    };

    db.insert(newName, function (err, insertedName) {
        callback(insertedName);
    });
}

app.listen(3001);