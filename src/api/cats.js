import axios from 'axios'
import { urls } from '../config'

export class CatsApi {
  /**
   * Поиск кота по части имени и полу
   * http://meowle.testops.ru:3001/api-docs-ui/#/default/post_cats_search
   * @param {!string} name Часть имени
   * @param {?string=} gender Пол
   * @returns {Promise<Groups>} Промис с группировкой имен котов
   * @returns
   */
  static search(name, gender) {
    return axios.post(`${urls.catsApi}/cats/search`, {
      name,
       gender,
    })
  }

  /**
   * Получение объекта кота по его ID
   * http://meowle.testops.ru:3001/api-docs-ui/#/default/get_cats_get_by_id
   * @param {!number} id ID кота
   * @returns {Promise<Cat>} Промис с объектом кота
   */
  static getById(id) {
    return axios.get(`${urls.catsApi}/cats/get-by-id`, {
      params: { id },
    })
  }

  /**
   * Создание нового имени
   * http://meowle.testops.ru:3001/api-docs-ui/#/default/post_cats_add
   * @param {!Object[]} cats Список с информацией котов
   * @param {!string} cats[].name Имя
   * @param {!string} cats[].gender Пол
   * @param {?string=} cats[].description Описание
   * @returns {Promise<Cat>} Промис с объектом кота
   */
  static add(cats) {
    return axios.post(`${urls.catsApi}/cats/add`, {
      cats,
    })
  }

  /**
   * Получение подсказок по началу имени
   * http://meowle.testops.ru:3001/api-docs-ui/#/default/get_cats_search_pattern
   * @param {!string} name Часть имени кота
   * @param {?number=} limit Ограничение количества выходного списка
   */
  static getSuggestions(name, limit) {
    return axios.get(`${urls.catsApi}/cats/search-pattern`, {
      params: { name, limit },
    })
  }

  /**
   * Получение списка правил валидации имен
   * @returns {Promise<Validation[]>} Промис со списком с регулярными выражениями
   */
  static getValidations() {
    return axios.get(`${urls.catsApi}/cats/validation`)
  }
}
