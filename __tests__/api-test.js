const supertest = require("supertest");
const createApp = require("../src/api/api");

const tmp = require("tmp");
const path = require("path");
const fs = require("fs");

let app;

beforeEach(done => {
  const tmpdir = tmp.dirSync();
  const dbPath = path.join(tmpdir.name, "names.db");

  const output = fs.createWriteStream(dbPath);
  output.on("finish", () => {
    app = createApp(dbPath);
    done();
  });

  fs.createReadStream("__tests__/test.db").pipe(output);
});

describe("API добавления новых имен в БД", () => {
  test("Должен вернуть 400, если в запросе отсутствует обязательный параметр needle", done => {
    supertest(app)
      .post("/api/add")
      .expect(400, done);
  });

  test("Должен добавить имя в БД", done => {
    supertest(app)
      .post("/api/add")
      .send({
        needle: "joan"
      })
      .expect(function(res) {
        expect(res.body).toEqual({
          _id: "joan",
          name: "Joan"
        });
      })
      .expect(200, done);
  });
});

describe("API поиска имен", () => {
  test("Должен вернуть 400, если в запросе отсутствует обязательный параметр needle", done => {
    supertest(app)
      .post("/api/search")
      .expect(400, done);
  });

  test("Должен найти подходящие имена из БД при вызове метода /search", done => {
    supertest(app)
      .post("/api/search")
      .send({
        needle: "me"
      })
      .expect(function(res) {
        expect(res.body).toEqual({
          groups: [
            {
              title: "C",
              names: [
                {"_id":"clemencia","name":"Clemencia"},
                {"_id":"clemensia","name":"Clemensia"},
                {"_id":"clement","name":"Clement"},
                {"_id":"clementine","name":"Clementine"},
                {"_id":"clementius","name":"Clementius"}
                      ],
              count: 5
            },
            {
              title: "M",
              names: ["Meliora", "Merc", "Mercury", "Merida"],
              count: 4
            }
          ],
          count: 9
        });
      })
      .expect(200, done);
  });

  test("Должен ответить пустым массивом, если в БД отсутствуют совпадения", done => {
    supertest(app)
      .post("/api/search")
      .send({
        needle: "mes"
      })
      .expect(function(res) {
        expect(res.body).toEqual({
          groups: [],
          count: 0
        });
      })
      .expect(200, done);
  });
});
