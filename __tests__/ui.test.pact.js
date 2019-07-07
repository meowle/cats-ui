const ui = require('../src/ui/ui');
const fetch = require("node-fetch");
const { Pact } = require("@pact-foundation/pact");
const path = require("path");

describe("Контракт между UI и API", () => {
  const provider = new Pact({
    consumer: "ui",
    provider: "api",
    port:31234,
    log: path.resolve(process.cwd(), "logs", "pact.log"),
    dir: path.resolve(process.cwd(), "pacts"),
    logLevel: "WARN",
    spec: 2
});

describe("Поиск имени и отображение результата", () => {
  beforeAll(done => {
    provider.setup().then(() =>
      provider
        .addInteraction({
          uponReceiving: "a request search name",
          withRequest: {
            method: "POST",
            path: "/api/search",
            headers: {
              Accept: "application/json"
            },
            body: {
              Accept: "доброкот"
            }
          },
          willRespondWith: {
            status: 200,
            headers: {
              "Content-Type": "application/json;charset=UTF-8"
            },
            body: {
              groups: [
                {
                  title:
                    "Д",
                    names: [
                    {
                      name: "Доброкот"
                    }
                  ],
                  count: 1
                }
              ]
            }
          }
        })
        .then(() => done())
    );
  });
});

test("При однозначном поиске возращается только одно имя", done => {
  fetch("http://localhost:31234/api/search", {
    method: "POST",  
    headers: {
      Accept: "application/json"
    },
    body: JSON.stringify({
      needle: 'доброкот'
    })

 })
    .then(response => response.json())
    .then(json =>
      expect(json).toStrictEqual({
        talks: [
          {
            title:
              "Д",
            speakers: [
              {
                name: "Доброкот"
              }
            ],
            count: 1
          }
        ]
      })
    )
    .then(() => done());
});

afterAll(() => provider.finalize());
});