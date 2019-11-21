const fetch = require('node-fetch')
const { apiUri } = require('./configs')

/*
Сохранение описания кота
*/
function saveCatDescription(catId, catDescription) {
  return fetch(`${apiUri}/cats/save-description`, {
    method: 'post',
    body: JSON.stringify({
      catId,
      catDescription,
    }),
    headers: {
      'Content-Type': 'application/json',
    },
  }).then(res => res.json())
}

/*
Получение правил валидации
*/
function getRules() {
  return fetch(`${apiUri}/cats/validation`).then(res => res.json())
}

/**
 * Получение характеристик кота
 */
function searchNameDetails(catId) {
  return fetch(`${apiUri}/cats/get-by-id?id=${catId}`).then(res => res.json())
}

/*
Ищем подходящих котов через api (отправка запроса и получение данных)
*/
function searchCatsWithApi(searchParams) {
  const { needle, gender } = searchParams

  return fetch(`${apiUri}/cats/search`, {
    method: 'post',
    body: JSON.stringify({
      name: needle,
      gender,
    }),
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then(res => res.json())
    .then(json => createRenderContesxtSearchResult(json, searchParams))
}

/*
Ищем подходящих котов через api по части имени (отправка запроса и получение данных)
*/
function searchCatsByPatternWithApi(searchName, limit) {
  return fetch(
    `${apiUri}/cats/search-pattern?name=${encodeURI(searchName)}&limit=${limit}`
  ).then(res => res.json())
}

/*
Возвращаем всех котов
 */
function getAllCats(filter) {
  let query = Object.keys(filter)
    .filter(key => filter[key])
    .map(key => `${key}=${filter[key]}`)
    .join('&')

  return fetch(`${apiUri}/cats/all?${query}`, {
    method: 'get',
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then(res => res.json())
    .then(json => createRenderAllContext(json))
}

/*
Добавление котов
*/
function addCats(cats) {
  return fetch(`${apiUri}/cats/add`, {
    method: 'post',
    body: JSON.stringify({
      cats,
    }),
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then(jsonResponse)
    .catch(err => {
      throw Error(err && err.message || 'Не смогли сохранить котов, что-то пошло не так')
    })
}

/*
Вьюшка для отрисовки всех котов
 */
function createRenderAllContext(json) {
  if (json.groups == null || json.groups.length == 0) {
    return {
      template: 'no-result',
      context: {
        hideSearchFilter: true,
      },
    }
  } else {
    return {
      template: 'results',
      context: {
        groups: json.groups,
        count: json.count,
      },
    }
  }
}

/*
Выбор вьюшки для отрисовки (с результатами или без)
*/
function createRenderContesxtSearchResult(json, searchParams) {
  const { needle, gender } = searchParams
  const searchContext = {
    needle,
    gender,
  }

  if (json.groups == null || json.groups.length == 0) {
    return {
      template: 'no-result',
      context: {
        ...searchContext,
        gender,
        hideSearchFilter: !gender,
        hideSearchSort: true,
      },
    }
  } else {
    return {
      template: 'results',
      context: {
        ...searchContext,
        groups: json.groups,
        count: json.count,
        hideSearchSort: true,
      },
    }
  }
}

/*
Рендеринг главной страницы в случае неуспеха
*/
function showFailPage(res, errorMessage) {
  failNotification(errorMessage, res)
  res.redirect('/')
}

/*
Получение фотографий
*/
function getPhotos(catId) {
  return fetch(`${apiUri}/cats/${catId}/photos`).then(res => res.json())
}

function setLike(catId) {
  return fetch(`${apiUri}/cats/${catId}/like`, {
    method: 'POST',
  }).then(() => {})
}

function deleteLike(catId) {
  return fetch(`${apiUri}/cats/${catId}/like`, {
    method: 'DELETE',
  }).then(() => {})
}

function setDislike(catId) {
  return fetch(`${apiUri}/cats/${catId}/dislike`, {
    method: 'POST',
  }).then(() => {})
}

function deleteDislike(catId) {
  return fetch(`${apiUri}/cats/${catId}/dislike`, {
    method: 'DELETE',
  }).then(() => {})
}

function createRenderDetails(req, cat) {
  const { name, description, gender, id, likes, dislikes } = cat
  const { liked } = req.cookies

  return {
    name,
    description,
    gender,
    id,
    likes,
    liked: liked === 'true',
    dislikes,
    disliked: disliked === 'true',
  }
}

function getVersions() {
  return fetch(`${apiUri}/version`)
    .then(res => res.json())
    .then(apiVersion => {
      return {
        ui: {
          build: process.env.BUILD_NUMBER,
        },
        api: apiVersion
      }
    })
}

function getTopNames() {
  return request(`${apiUri}/cats/likes-rating`)
    .then(res => res.json())
}

function getAntiTopNames() {
  return request(`${apiUri}/cats/dislikes-rating`)
    .then(res => res.json())
}

function request(...args) {
  return fetch(...args)
    .then(res => {
      if (res.ok) {
        return res
      }

      throw res
    })
}

function jsonResponse(response) {
  return response.json()
    .then(json => {
      if (json.isBoom && json.output && json.output.statusCode >= 300) {
        const message = json.output.statusCode >= 500 && json.output.statusCode < 600 ? '' : json.output.payload.message

        throw new Error(message || '')
      }

      return json
    })
}

function successNotification(text, res) {
  res.cookie("showSuccessPopup", "true", { httpOnly: true, expires: new Date(Date.now() + 2000) });

  if (text)
    res.cookie("popupMessage", text, { httpOnly: true, expires: new Date(Date.now() + 2000) });
}

function failNotification(text, res) {
  res.cookie("showFailPopup", "true", { httpOnly: true, expires: new Date(Date.now() + 2000) });

  if (text)
    res.cookie("popupFailMessage", text, { httpOnly: true, expires: new Date(Date.now() + 2000) });
}

module.exports = {
  getRules,
  searchCatsWithApi,
  showFailPage,
  saveCatDescription,
  searchNameDetails,
  addCats,
  getAllCats,
  searchCatsByPatternWithApi,
  getPhotos,
  getVersions,
  createRenderDetails,
  setLike,
  deleteLike,
  setDislike,
  deleteDislike,
  getTopNames,
  getAntiTopNames,
  successNotification,
  failNotification,
}
