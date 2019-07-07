const names = require('../src/api/names')
const tmp = require('tmp')
const path = require('path')
const fs = require('fs')

let namesDb

beforeEach(done => {
  const tmpdir = tmp.dirSync()
  const dbPath = path.join(tmpdir.name, 'names.db')

  const output = fs.createWriteStream(dbPath)
  output.on('finish', () => {
    namesDb = names.connectDb(dbPath)
    done()
  })

  fs.createReadStream('__tests__/test.db').pipe(output)
})

describe('Поиск имен', () => {
  test('Производим поиск, даже если запрос состоит из одного символа', done => {
    namesDb.searchNames('k', function(namesFound) {
      expect(namesFound.length).toBeGreaterThan(0)
      done()
    })
  })

  test('Производим поиск, даже если запрос очень длинный, так как ограничения на длину поискового запроса отсутствуют', done => {
    namesDb.searchNames('kkkkkkkkkkkk', function(namesFound) {
      expect(namesFound.length).toBe(0)
      done()
    })
  })

  test('Производим поиск, если в запросе присутствуют числа', done => {
    namesDb.searchNames('1g', function(namesFound) {
      expect(namesFound.length).toBeGreaterThan(0)
      done()
    })
  })

  test('Производим поиск, если в запросе присутствуют спецсимволы', done => {
    namesDb.searchNames('- Xl', function(namesFound) {
      expect(namesFound.length).toBe(1)
      done()
    })
  })

  test('Производим поиск, если запрос содержит латинницу и кириллицу', done => {
    namesDb.searchNames('етvi', function(namesFound) {
      expect(namesFound.length).toBeGreaterThan(0)
      done()
    })
  })

  test('Производим поиск, если запрос содержит только латинские символы', done => {
    namesDb.searchNames('vi', function(namesFound) {
      expect(namesFound.length).toBeGreaterThan(0)
      done()
    })
  })

  test('Ищем, даже если запрос составной и содержит 2 слова разделенные пробелом', done => {
    namesDb.searchNames('Eliane Eliana', function(namesFound) {
      expect(namesFound.length).toBeGreaterThan(0)
      done()
    })
  })

  test('Ищем, даже если запрос составной и содержит 2 слова разделенные спецсимволом', done => {
    namesDb.searchNames('Eliana2+Eliana', function(namesFound) {
      expect(namesFound.length).toBeGreaterThan(0)
      done()
    })
  })

  test('Ищем, даже если в запрос составной и содержит 5 слов', done => {
    namesDb.searchNames(
      'Eliana Eroicajhjb oghkh roighlwgh lwijghwhglwhgwh;g',
      function(namesFound) {
        expect(namesFound.length).toBeGreaterThan(0)
        done()
      }
    )
  })
})

describe('Создание нового имени', () => {
  test('После записи в БД имя начинается с заглавной буквы', done => {
    namesDb.createNewName('reset', function() {
      namesDb.searchNames('reset', function(names) {
        expect(names[0].name).toBe('Reset')
        done()
      })
    })
  })

  test('Обрезаем спецсимволы вокруг имени', done => {
    namesDb.createNewName('&*bnbn///', function() {
      namesDb.searchNames('bnbn', function(names) {
        expect(names[0].name).toBe('Bnbn')
        done()
      })
    })
  })

  test('Удаляем проблемы вокруг имени', done => {
    namesDb.createNewName('     rest', function() {
      namesDb.searchNames('rest', function(names) {
        expect(names[0].name).toBe('Rest')
        done()
      })
    })
  })

  test('Удаляем цифры, если они находятся в начале имени', done => {
    namesDb.createNewName('     12rest12', function() {
      namesDb.searchNames('rest12', function(names) {
        expect(names[0].name).toBe('Rest12')
        done()
      })
    })
  })
})

describe('Группировка по первой букве имени', () => {
  test('Группируем весь результат поиска, используя для заголовка группы 1-ю букву имени', () => {
    const resultGroups = namesDb.groupNamesAndSort([
      {
        name: 'Abd',
      },
      {
        name: 'Abb',
      },
      {
        name: 'Gtb',
      },
      {
        name: 'Ytn',
      },
      {
        name: 'anh',
      },
    ])
    expect(resultGroups.groups).toEqual([
      {
        title: 'A',
        names: ['Abb', 'Abd', 'Anh'],
        count: 3,
      },
      {
        title: 'G',
        names: ['Gtb'],
        count: 1,
      },
      {
        title: 'Y',
        names: ['Ytn'],
        count: 1,
      },
    ])
  })

  test('Возвращаем пустой массив групп, если в результате поиска ничего не было найдено', () => {
    const resultGroups = namesDb.groupNamesAndSort([])
    expect(resultGroups.groups).toEqual([])
  })
})

describe('Группировка и сортировка имен', () => {
  test('Сортируем и группируем имена в алфавитном порядке', () => {
    const sortResult = names.sortGroupAlphabetically({
      B: ['Bcd', 'Bac'],
      Z: ['Zzz'],
      A: ['Aaa', 'Azz'],
    })
    expect(sortResult).toEqual([
      {
        title: 'A',
        names: ['Aaa', 'Azz'],
      },
      {
        title: 'B',
        names: ['Bac', 'Bcd'],
      },
      {
        title: 'Z',
        names: ['Zzz'],
      },
    ])
  })

  test('Вначале сортируем цифры по возрастанию, затем только буквы', () => {
    const sortResult = names.sortGroupAlphabetically({
      9: ['9Bcd', '9Bac'],
      Z: ['Zzz'],
      1: ['1Aaa', '1Azz'],
    })
    expect(sortResult).toEqual([
      {
        title: '1',
        names: ['1Aaa', '1Azz'],
      },
      {
        title: '9',
        names: ['9Bac', '9Bcd'],
      },
      {
        title: 'Z',
        names: ['Zzz'],
      },
    ])
  })

  test('Вначале сортируем латинницу, затем только кириллицу', () => {
    const sortResult = names.sortGroupAlphabetically({
      Ф: ['Ф9Bcd', 'Ф9Bac'],
      Z: ['Zzz'],
      1: ['1Aaa', '1Azz'],
    })
    expect(sortResult).toEqual([
      {
        title: '1',
        names: ['1Aaa', '1Azz'],
      },
      {
        title: 'Z',
        names: ['Zzz'],
      },
      {
        title: 'Ф',
        names: ['Ф9Bac', 'Ф9Bcd'],
      },
    ])
  })
})

describe('Подсчет имен', () => {
  test('Возвращаем общее количество имен в результате поиска', () => {
    const resultGroups = namesDb.groupNamesAndSort([
      {
        name: 'Abd',
      },
      {
        name: 'Abb',
      },
      {
        name: 'Gtb',
      },
      {
        name: 'Ytn',
      },
      {
        name: 'anh',
      },
    ])
    expect(resultGroups.count).toEqual(5)
  })

  test("Возвращаем количество имен равное '0', если в результате поиска ничего не найдено", () => {
    const resultGroups = namesDb.groupNamesAndSort([])
    expect(resultGroups.count).toEqual(0)
  })
})

describe('Удаление имени', () => {
  test('Удаляем имя из БД по однозначному соответствию', done => {
    const name = 'claudio'

    namesDb.searchNames(name, function(namesFound) {
      // given some name
      expect(namesFound.length).toBe(1)

      // when user deletes it
      namesDb.deleteByName(name, function() {
        // then it should be removed from DB
        namesDb.searchNames(name, function(namesFound) {
          expect(namesFound.length).toBe(0)
          done()
        })
      })
    })
  })
})
