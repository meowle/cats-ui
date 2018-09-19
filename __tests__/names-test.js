const names = require("../src/api/names");
const tmp = require("tmp");
const path = require("path");
const fs = require("fs");

let namesDb;

beforeEach(done => {
  const tmpdir = tmp.dirSync();
  const dbPath = path.join(tmpdir.name, "names.db");

  const output = fs.createWriteStream(dbPath);
  output.on("finish", () => {
    namesDb = names.connectDb(dbPath);
    done();
  });

  fs.createReadStream("__tests__/test.db").pipe(output);
});

describe("names search", () => {
  test("should search by 1-char query", done => {
    namesDb.searchNames("k", function(namesFound) {
      expect(namesFound.length).toBeGreaterThan(0);
      done();
    });
  });

  test("should search if the query is long", done => {
    namesDb.searchNames("kkkkkkkkkkkk", function(namesFound) {
      expect(namesFound.length).toBe(0);
      done();
    });
  });

  test("should search if the query contains numbers", done => {
    namesDb.searchNames("1g", function(namesFound) {
      expect(namesFound.length).toBeGreaterThan(0);
      done();
    });
  });

  test("should search if the query has special symbols", done => {
    namesDb.searchNames("- Xl", function(namesFound) {
      expect(namesFound.length).toBe(1);
      done();
    });
  });

  test("should search if the query contains Latin and Cyrillic symbols", done => {
    namesDb.searchNames("етvi", function(namesFound) {
      expect(namesFound.length).toBeGreaterThan(0);
      done();
    });
  });

  test("should search if the query has only Latin symbols", done => {
    namesDb.searchNames("vi", function(namesFound) {
      expect(namesFound.length).toBeGreaterThan(0);
      done();
    });
  });

  test("should search if the query has 2 words separated by space", done => {
    namesDb.searchNames("Eliane Eliana", function(namesFound) {
      expect(namesFound.length).toBeGreaterThan(0);
      done();
    });
  });

  test("should search if the query has 2 words separated by special symbol", done => {
    namesDb.searchNames("Eliana2+Eliana", function(namesFound) {
      expect(namesFound.length).toBeGreaterThan(0);
      done();
    });
  });

  test("should search if the query has 5 words", done => {
    namesDb.searchNames(
      "Eliana Eroicajhjb oghkh roighlwgh lwijghwhglwhgwh;g",
      function(namesFound) {
        expect(namesFound.length).toBeGreaterThan(0);
        done();
      }
    );
  });
});

describe("new name creation", () => {
  test("should capitalize first letter", done => {
    namesDb.createNewName("reset", function() {
      namesDb.searchNames("reset", function(names) {
        expect(names[0].name).toBe("Reset");
        done();
      });
    });
  });

  test("should trim special chars surrounding name", done => {
    namesDb.createNewName("&*bnbn///", function() {
      namesDb.searchNames("bnbn", function(names) {
        expect(names[0].name).toBe("Bnbn");
        done();
      });
    });
  });

  test("should remove the spaces surrounding name", done => {
    namesDb.createNewName("     rest", function() {
      namesDb.searchNames("rest", function(names) {
        expect(names[0].name).toBe("Rest");
        done();
      });
    });
  });

  test("should remove numbers only at beginning of names", done => {
    namesDb.createNewName("     12rest12", function() {
      namesDb.searchNames("rest12", function(names) {
        expect(names[0].name).toBe("Rest12");
        done();
      });
    });
  });
});

describe("names grouping by first letter", () => {
  test("should group all search result using for titles only 1 capitalized first letter of names", () => {
    const resultGroups = namesDb.groupNamesAndSort([
      {
        name: "Abd"
      },
      {
        name: "Abb"
      },
      {
        name: "Gtb"
      },
      {
        name: "Ytn"
      },
      {
        name: "anh"
      }
    ]);
    expect(resultGroups.groups).toEqual([
      {
        title: "A",
        names: ["Abb", "Abd", "Anh"],
        count: 3
      },
      {
        title: "G",
        names: ["Gtb"],
        count: 1
      },
      {
        title: "Y",
        names: ["Ytn"],
        count: 1
      }
    ]);
  });

  test("should return an empty array of groups if nothing was found", () => {
    const resultGroups = namesDb.groupNamesAndSort([]);
    expect(resultGroups.groups).toEqual([]);
  });
});

describe("groups and names sorting", () => {
  test("should sort the groups and names alphabetically", () => {
    const sortResult = names.sortGroupAlphabetically({
      B: ["Bcd", "Bac"],
      Z: ["Zzz"],
      A: ["Aaa", "Azz"]
    });
    expect(sortResult).toEqual([
      {
        title: "A",
        names: ["Aaa", "Azz"]
      },
      {
        title: "B",
        names: ["Bac", "Bcd"]
      },
      {
        title: "Z",
        names: ["Zzz"]
      }
    ]);
  });

  test("should firstly sort by numbers then by letters", () => {
    const sortResult = names.sortGroupAlphabetically({
      9: ["9Bcd", "9Bac"],
      Z: ["Zzz"],
      1: ["1Aaa", "1Azz"]
    });
    expect(sortResult).toEqual([
      {
        title: "1",
        names: ["1Aaa", "1Azz"]
      },
      {
        title: "9",
        names: ["9Bac", "9Bcd"]
      },
      {
        title: "Z",
        names: ["Zzz"]
      }
    ]);
  });

  test("should firstly sort by Latin letters then by Cyrillic", () => {
    const sortResult = names.sortGroupAlphabetically({
      Ф: ["Ф9Bcd", "Ф9Bac"],
      Z: ["Zzz"],
      1: ["1Aaa", "1Azz"]
    });
    expect(sortResult).toEqual([
      {
        title: "1",
        names: ["1Aaa", "1Azz"]
      },
      {
        title: "Z",
        names: ["Zzz"]
      },
      {
        title: "Ф",
        names: ["Ф9Bac", "Ф9Bcd"]
      }
    ]);
  });
});

describe("names counting", () => {
  test("should return the overall count of names in search result", () => {
    const resultGroups = namesDb.groupNamesAndSort([
      {
        name: "Abd"
      },
      {
        name: "Abb"
      },
      {
        name: "Gtb"
      },
      {
        name: "Ytn"
      },
      {
        name: "anh"
      }
    ]);
    expect(resultGroups.count).toEqual(5);
  });

  test("should return the 0 count of names if the group is empty", () => {
    const resultGroups = namesDb.groupNamesAndSort([]);
    expect(resultGroups.count).toEqual(0);
  });
});

describe("names delete", () => {
  test("should delete name", done => {
    const name = "claudio";

    namesDb.searchNames(name, function(namesFound) {
      // given some name
      expect(namesFound.length).toBe(1);

      // when user deletes it
      namesDb.deleteByName(name, function() {
        // then it should be removed from DB
        namesDb.searchNames(name, function(namesFound) {
          expect(namesFound.length).toBe(0);
          done();
        });
      });
    });
  });
});
