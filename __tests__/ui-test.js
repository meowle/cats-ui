const nock = require("nock");
const request = require("supertest");
const ui = require("../src/ui");

describe("Валидация ввода поискового запроса", () => {
  test("Не должен искать, если запрос пустой", () => {});
  test("Не должен искать, если запрос содержит всего 1 символ ", () => {});

  test("Ищет, если запрос содержит более 2-х символов ", () => {});

});

describe("Добавление имени", () => {
  test("После добавления должен вернуть одно имя в одной группе, написанное с большой буквы", () => {
    const newName = ui.addname("mex");
    expect(newName.groups[0].count).toBe(1);
    expect(newName.count).toBe(1);
    expect(newName.groups[0].names[0]).toBe("Mex");
    expect(newName.groups[0].title).toBe("M");
  });
});

describe("Поиск и добавление имен", () => {
  test("Должен вернуть шаблон 'no-result' если список групп пустой", done => {
    nock("http://localhost:3001")
      .post("/api/search", {
        needle: "sasha"
      })
      .reply(200, {
        groups: [],
        count: 0
      });

    request(ui.createApp())
      .post("/search")
      .send({
        needle: "sasha"
      })
      .expect(200, /Ничего не нашли/, done);
  });

  it("should render context with needle", () => {
    const needle = "ab";
    const searchResult = {
      groups: ["Saab", "Abrams"]
    };

    const renderResult = ui.createRenderContesxtSearchResult(searchResult, needle);

    expect(renderResult.context.needle).toBe(needle);
  });
});
