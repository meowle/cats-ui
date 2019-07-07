const nock = require('nock')
const request = require('supertest')
const ui = require('../src/ui/ui')

describe('Валидация поискового запроса', () => {
  test('Не ищем, если поисковый запрос пустой', () => {})

  test('Не ищем, если поисковый запрос содержит в себе только спецсимволы', () => {})
})

test('После добавления имени, возвращаем страницу результата поиска с одной группой и одним именем', () => {
  const newName = ui.makeSingleResult('mex')
  expect(newName.groups[0].count).toBe(1)
  expect(newName.count).toBe(1)
  expect(newName.groups[0].names[0]).toBe('Mex')
  expect(newName.groups[0].title).toBe('M')
})
test("Возвращаем страницу 'no-result', если api вернуло пустой массив (поиск оказался неуспешным)", done => {
  nock('http://localhost:3001')
    .post('/api/search', {
      needle: 'sasha',
    })
    .reply(200, {
      groups: [],
      count: 0,
    })

  request(ui.createApp())
    .post('/search')
    .send({
      needle: 'sasha',
    })
    .expect(200, /Ничего не нашли/, done)
})

test('При рендеринге страниц с результатами и без, needle содержит в себе поисковый запрос', () => {
  const needle = 'ab'
  const searchResult = {
    groups: ['Saab', 'Abrams'],
  }

  const renderResult = ui.renderSearchResult(searchResult, needle)

  expect(renderResult.context.needle).toBe(needle)
})
