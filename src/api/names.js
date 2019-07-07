const Datastore = require("nedb");
const escapeRegexString = require("escape-regex-string");

function connectDb(dbPath) {
  const db = new Datastore({
    filename: dbPath,
    autoload: true,
  });

  return {

    searchNames(needle, callback) {
      const trimmedNeedle = trimSymbols(needle);
      const searchPattern = {
        name: new RegExp(escapeRegexString(trimmedNeedle), "i")
      };

      db.find(searchPattern, function(err, namesFound) {
        callback(namesFound);
      });
    },

    createNewName(needle, callback) {
      const trimmedName = trimSymbols(needle);

      const newName = {
       // _id: trimmedName.toLowerCase(),
        name: capitalizeFirstLetter(trimmedName)
      };

      db.insert(newName, function(err, insertedName) {
        callback(insertedName);
      });
    },

    groupNamesAndSort(cats) {
      const groups = groupByFirstLetter(cats);
      const sorterGroup = sortGroupAlphabetically(groups);
      const count = countNames(sorterGroup);

      return {
        groups: sorterGroup,
        count
      };
    },

    searchById(catId, callback) {
      db.findOne({_id: catId}, function(err, catFound) {
        callback(catFound);        
      })
    },

    deleteByName(needle, callback) {
      const searchPattern = {
        name: new RegExp(escapeRegexString(needle), "i")
      };
      db.remove(searchPattern, function() {
        callback();
      });
    }
  };
}

function trimSymbols(name) {
  let startIndex = 0;
  for (let i = 0; i < name.length; i++) {
    const symbol = name[i];
    if (/[a-zA-Zа-яА-Я]/.test(symbol)) {
      startIndex = i;
      break;
    }
  }

  let endIndex = 0;
  for (let i = name.length - 1; i >= 0; i--) {
    const symbol = name[i];
    if (/[a-zA-Z1-9а-яА-Я]/.test(symbol)) {
      endIndex = i;
      break;
    }
  }

  return name.substring(startIndex, endIndex + 1);
}

function groupByFirstLetter(cats) {
  const groups = {};

  for (let i = 0; i < cats.length; i++) {
    const cat = cats[i];
    const name = capitalizeFirstLetter(cat.name);
    const title = name.charAt(0);

    if (groups[title] == null) {
      groups[title] = [cat];
    } else {
      groups[title].push(cat);
    }
  }

  return groups;
}

function sortGroupAlphabetically(groups) {
  const keysSortedAlphabetically = Array.from(Object.keys(groups)).sort();
  const sorterGroup = [];

  for (let i = 0; i < keysSortedAlphabetically.length; i++) {
    const key = keysSortedAlphabetically[i];
    const group = {
      title: key,
      cats: groups[key], //.sort()
    };
    sorterGroup.push(group);
  }

  return sorterGroup;
}

function countNames(groups) {
  let count = 0;
  for (let i = 0; i < groups.length; i++) {
    const group = groups[i];
    group["count"] = group.cats.length;
    count = count + group.count;
  }
  return count;
}

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

module.exports = {
  connectDb,
  trimSymbols,
  capitalizeFirstLetter,
  sortGroupAlphabetically
};
