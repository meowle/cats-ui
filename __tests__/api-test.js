const names = require('../src/api/names');
const namesDb = names.connectDb('__tests__/test.db');

describe("names search", () => {

  test("should search by 1-char query", (done) => {
    namesDb.searchNames('k', function (namesFound) {
      expect(namesFound.length).toBeGreaterThan(0);
      done();
    });
  });

  test("should search if the query is long", (done) => {
    namesDb.searchNames('kkkkkkkkkkkk', function (namesFound) {
      expect(namesFound.length).toBe(0);
      done();
    });
  });

  test("should search if the query contains numbers", (done) => {
    namesDb.searchNames('1g', function (namesFound) {
      expect(namesFound.length).toBeGreaterThan(0);
      done();
    });
  });

  test("should search if the query has special symbols", (done) => {
    namesDb.searchNames('- Xl', function (namesFound) {
      expect(namesFound.length).toBe(1);
      done();
    });
  });

  test("should search if the query contains Latin and Cyrillic symbols", (done) => {
    namesDb.searchNames('етvi', function (namesFound) {
      expect(namesFound.length).toBeGreaterThan(0);
      done();
    });
  });

  test("should search if the query has only Latin symbols", (done) => {
    namesDb.searchNames('vi', function (namesFound) {
      expect(namesFound.length).toBeGreaterThan(0);
      done();
    });
  });

  test("should search if the query has 2 words separated by space", (done) => {
    namesDb.searchNames('Eliane Eliana', function (namesFound) {
      expect(namesFound.length).toBeGreaterThan(0);
      done();
    });
  });

  test("should search if the query has 2 words separated by special symbol", (done) => {
    namesDb.searchNames('Eliana2+Eliana', function (namesFound) {
      expect(namesFound.length).toBeGreaterThan(0);
      done();
    });
  });

  test("should search if the query has 5 words", (done) => {
    namesDb.searchNames('Eliana Eroicajhjb oghkh roighlwgh lwijghwhglwhgwh;g', function (namesFound) {
      expect(namesFound.length).toBeGreaterThan(0);
      done();
    });
  });
});

describe("new name creation", () => {

  test("should capitalize first letter", (done) => {
    namesDb.createNewName('assert', function () {
      namesDb.searchNames('assert', function (names) {
        expect(names[0].name).toBe('Assert');
        done();
      });
    });
  });

  test("should trim special chars surrounding name", (done) => {
    namesDb.createNewName('&*assert///', function () {
      namesDb.searchNames('assert', function (names) {
        expect(names[0].name).toBe('Assert');
        done();
      });
    });
  });

  test("should remove the spaces surrounding name", () => {
  });

  test("should remove numbers only at beginning of names", () => {
  });

});

describe("names grouping by first letter", () => {

  test("group names should be first letter of all names in group", () => {
  });

  test("should return an empty array of groups if nothing was found", () => {
  });  

  test("should return non-empty groups in an array", () => {
  });  
  
  test("groups must contain all elements from the search result", () => {
  });  

});

describe("groups and names sorting", () => {

  test("should sort the groups alphabetically", () => {
  });

  test("should firstly sort by numbers then by letters", () => {
  });  

  test("should firstly sort by Latin letters then by Cyrillic", () => {
  });  
  
  test("groups sort names alphabetically in the group", () => {
  });  

});

describe("names counting", () => {

  test("should return the count of names in groups", () => {
  });

  test("should return the overall count of names in search result", () => {
  });

  test("should not return the count of names if the group is empty", () => {
  });

});
