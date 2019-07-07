const supertest = require('supertest')
const createApp = require('../src/api/api')

const tmp = require('tmp')
const path = require('path')
const fs = require('fs')

let app

beforeEach(done => {
  const tmpdir = tmp.dirSync()
  const dbPath = path.join(tmpdir.name, 'names.db')

  const output = fs.createWriteStream(dbPath)
  output.on('finish', () => {
    app = createApp(dbPath)
    done()
  })

  fs.createReadStream('__tests__/test.db').pipe(output)
})

describe('Добавление нового имени через метод /add', () => {
  test('При вызове метода добавления, с передачей имени в needle, записываем имя в базу данных', done => {
    supertest(app)
      .post('/api/add')
      .send({
        needle: 'joan',
      })
      .expect(function(res) {
        expect(res.body).toEqual({
          _id: 'joan',
          name: 'Joan',
        })
      })
      .expect(200, done)
  })
  test('Возвращаем 400, если имя не передается в needle', done => {
    supertest(app)
      .post('/api/add')
      .expect(400, done)
  })
})

describe('Поиск имени через метод /search', () => {
  test('Возвращаем список имен из БД, среди которых содержится искомое буквосочетание', done => {
    supertest(app)
      .post('/api/search')
      .send({
        needle: 'me',
      })
      .expect(function(res) {
        expect(res.body).toEqual({
          groups: [
            {
              title: 'C',
              names: [
                'Clemencia',
                'Clemensia',
                'Clement',
                'Clementine',
                'Clementius',
              ],
              count: 5,
            },
            {
              title: 'M',
              names: ['Meliora', 'Merc', 'Mercury', 'Merida'],
              count: 4,
            },
          ],
          count: 9,
        })
      })
      .expect(200, done)
  })
  test('Возвращаем пустой список имен, если в БД отсутствуют совпадения с поисковым запросом', done => {
    supertest(app)
      .post('/api/search')
      .send({
        needle: 'mes',
      })
      .expect(function(res) {
        expect(res.body).toEqual({
          groups: [],
          count: 0,
        })
      })
      .expect(200, done)
  })
  test('Возвращаем 400, если имя не передается в needle', done => {
    supertest(app)
      .post('/api/search')
      .expect(400, done)
  })
})
