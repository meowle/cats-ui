import axios from 'axios';
import { urls } from '../config';

export class CatsApi {
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
    return axios
      .post(`${urls.catsApi}/cats/add`, {
        cats,
      })
      .then(returnResponseData);
  }

  /**
   * Поиск кота по части имени и полу
   * http://meowle.testops.ru:3001/api-docs-ui/#/default/post_cats_search
   * @param {!string} name Часть имени
   * @param {?string=} gender Пол
   * @returns {Promise<Groups>} Промис с группировкой имен котов
   */
  static search(name, gender) {
    return axios
      .post(`${urls.catsApi}/cats/search`, {
        name,
        gender,
      })
      .then(returnResponseData);
  }

  /**
   * Получение объекта кота по его ID
   * http://meowle.testops.ru:3001/api-docs-ui/#/default/get_cats_get_by_id
   * @param {!number} id ID кота
   * @returns {Promise<Cat>} Промис с объектом кота
   */
  static getById(id) {
    return axios
      .get(`${urls.catsApi}/cats/get-by-id`, {
        params: { id },
      })
      .then(returnResponseData);
  }

  /**
   * Получение подсказок по началу имени
   * http://meowle.testops.ru:3001/api-docs-ui/#/default/get_cats_search_pattern
   * @param {!string} name Часть имени кота
   * @param {?number=} limit Ограничение количества выходного списка
   */
  static getSuggestions(name, limit) {
    return axios
      .get(`${urls.catsApi}/cats/search-pattern`, {
        params: { name, limit },
      })
      .then(returnResponseData);
  }

  /**
   * Получение списка правил валидации имен
   * @returns {Promise<Validation[]>} Промис со списком с регулярными выражениями
   */
  static getValidations() {
    return axios
      .get(`${urls.catsApi}/cats/validation`)
      .then(returnResponseData);
  }

  /**
   * Сохранение описания имени кота
   * http://meowle.testops.ru:3001/api-docs-ui/#/default/post_cats_save_description
   * @param {!number} catId ID кота
   * @param {!string} description Описание имени
   * @returns {Promise<Cat>} Промис с объектом кота
   */
  static saveDescription(catId, description) {
    return axios
      .post(`${urls.catsApi}/cats/save-description`, {
        catId,
        catDescription: description,
      })
      .then(returnResponseData);
  }

  /**
   * Получение списка всех имен котов
   * http://meowle.testops.ru:3001/api-docs-ui/#/default/get_cats_all
   * @param {!string} order Сортировка (asc | desc)
   * @param {string=} gender Фильтр по полу
   * @returns {Promise<Groups>} Промис с группировкой имен котов
   */
  static getAll(order, gender) {
    return axios
      .get(`${urls.catsApi}/cats/all`, {
        order,
        gender,
      })
      .then(returnResponseData);
  }
}

function returnResponseData({ data }) {
  return data;
}
