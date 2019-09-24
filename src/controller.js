const express = require('express')
const bodyParser = require('body-parser')
const favicon = require('serve-favicon')
const path = require('path')
const { apiUri } = require('./configs')
const proxy = require('./proxy')(apiUri)
const cookieParser = require('cookie-parser')
const {
  getRules,
  searchCatsWithApi,
  showFailPage,
  saveCatDescription,
  searchNameDetails,
  addCats,
  getAllCats,
  searchCatsByPatternWithApi,
  getPhotos,
  like,
  createRenderDetails,
} = require('./services')

function createApp() {
  const app = express()

  app.set('view engine', 'pug')

  app.use(express.static('public'))
  app.use(favicon(path.join(__dirname, '..', 'public', 'img', 'favicon.ico')))
  app.use(bodyParser.json())
  app.use(
    bodyParser.urlencoded({
      extended: true,
    }),
  )
  app.use(proxy.init())
  app.use(cookieParser())

  app.get('/', function(req, res) {
    getRules().then(rules =>
      res.render('index', {
        validationRules: rules,
      }),
    )
  })

  /*
  Метод поиска котов по имени и полу
  */
  app.get('/search', function(req, res) {
    const searchParams = {
      needle: req.query.needle,
      genders: [],
    }

    if (req.query.male != null) {
      searchParams.genders.push('male')
    }

    if (req.query.female != null) {
      searchParams.genders.push('female')
    }

    if (req.query.unisex != null) {
      searchParams.genders.push('unisex')
    }

    Promise.all([searchCatsWithApi(searchParams, res), getRules()])
      .then(([renderResult, validationRules]) => {
        const { template, context } = renderResult
        res.render(template, { ...context, validationRules })
      })
      .catch(() => showFailPage(res))
  })

  /*
  Метод вывода всех котов
  */
  app.get('/all-names', function(req, res) {
    Promise.all([getAllCats(req, res), getRules()])
      .then(([renderResult, validationRules]) => {
        const { template, context } = renderResult
        res.render(template, { ...context, validationRules })
      })
      .catch(() => showFailPage(res))
  })

  /*
  Метод поиска котов по имени и полу
  */
  app.get('/search-suggests', function(req, res) {
    if (!req.query.name) {
      return res.json([])
    }

    const limit = req.query.limit || 20

    searchCatsByPatternWithApi(req.query.name, limit)
      .then(result => {
        res.json(result)
      })
      .catch(err => console.log(err))
  })

  /*
  Метод добавления котов
  */
  app.post('/cats/add', function(req, res) {
    const cats = {}

    for (const [catParam, value] of Object.entries(req.body)) {
      const catNameMatch = catParam.match(/^cat-name-(\d+)$/)
      if (catNameMatch) {
        const catIndex = catNameMatch[1]
        if (cats[catIndex] == null) {
          cats[catIndex] = {}
        }

        cats[catIndex].name = value.trim()
        continue
      }

      const caGenderMatch = catParam.match(/^cat-gender-(\d+)$/)
      if (caGenderMatch) {
        const catIndex = caGenderMatch[1]
        if (cats[catIndex] == null) {
          cats[catIndex] = {}
        }

        cats[catIndex].gender = value.trim()
        continue
      }
    }

    const catsToAdd = Object.values(cats)

    Promise.all([addCats(catsToAdd, res), getRules()])
      .then(([catSuccessfullyAdded, validationRules]) => {
        if (catSuccessfullyAdded) {
          res.render('index', { showSuccessPopup: true, validationRules })
        } else {
          showFailPage(res)
        }
      })
      .catch(() => showFailPage(res))
  })

  /*
  Метод получения кота по ID
  */
  app.get('/cats/:catId', function(req, res) {
    const { catId } = req.params
    Promise.all([searchNameDetails(catId), getRules(), getPhotos(catId)])
      .then(([cat, validationRules, photos]) => {
        const {
          cat: { name, description, id },
        } = cat
        const images = photos.images

        res.render('name-details', {
          name,
          description,
          id,
          validationRules,
          photos: images,
          liked: req.cookies['liked'] === 'true',
        })
      })
      .catch(() => showFailPage(res))
  })

  /* Метод установки лайка */
  app.post('/cats/:catId/like', function(req, res) {
    const { catId } = req.params

    // Если у клиента есть кука лайка с значением 'true' - он не может лайкнуть еще раз - отправляем ошибку
    if (req.cookies.liked === 'true') {
      console.log(`${catId} already liked`)
      showFailPage(res)

      return
    }

    // Получаем инфу об имени и устанавливам ему лайк
    like(catId)
      .then(() => {
        res.cookie('liked', 'true', {
          expires: new Date(2030, 1, 1),
          path: `/cats/${catId}`,
        })
        res.redirect('back')
      })
      .catch(err => {
        console.log('Error: like', err)
        return showFailPage(res)
      })
  })

  /* Метод удаения лайка */
  app.delete('/cats/:catId/like', function(req, res) {
    const { catId } = req.params

    // Если у клиента нет куки лайка с значением 'true' - он не может отменить лайк - отправляем ошибку
    if (req.cookies.liked !== 'true') {
      showFailPage(res)

      return
    }

    // Получаем инфу об имени и устанавливам ему лайк
    Promise.all([
      searchNameDetails(catId),
      like(catId),
    ])
      .then(([searchResponse]) => {
        res.cookie('liked', 'false', {
          maxAge: 0,
          path: `/cats/${catId}`,
        })
        res.render('name-details', {
          ...createRenderDetails(req, searchResponse.cat),
          liked: false,
        })
      })
      .catch(() => showFailPage(res))
  })

  /*
  Метод вызова редактирования кота
  */
  app.get('/cats/:catId/edit', function(req, res) {
    const { catId } = req.params
    searchNameDetails(catId)
      .then(json => json.cat)
      .then(cat => {
        const { name, description, id } = cat
        res.render('name-details-edit', {
          name,
          description,
          id,
        })
      })
      .catch(() => showFailPage(res))
  })

  /*
  Метод сохранения модицификации кота
  */
  app.post('/cats/:catId/edit', function(req, res) {
    const { catId } = req.params
    const { description } = req.body

    saveCatDescription(catId, description)
      .then(json => json.cat)
      .then(cat => {
        const { name, description, id } = cat
        res.render('name-details', {
          name,
          description,
          id,
        })
      })
      .catch(() => showFailPage(res))
  })

  proxy.post('/cats/:catId/upload', true, function(proxyRes, req, res) {
    proxyRes.on('data', () => {
    })

    proxyRes.on('end', function() {
      res.redirect('back')
    })
  })

  proxy.get('/photos', false)

  return app
}

module.exports = {
  createApp,
}
