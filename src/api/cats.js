import { urls } from '../config';
import { getApiInstance } from '../utils/api';

const api = getApiInstance(urls.catsApi);

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
    return api.post('/cats/add', {
      cats,
    });
  }

  /**
   * Поиск кота по части имени и полу
   * http://meowle.testops.ru:3001/api-docs-ui/#/default/post_cats_search
   * @param {!string} name Часть имени
   * @param {?string=} gender Пол
   * @returns {Promise<Groups>} Промис с группировкой имен котов
   */
  static search(name, gender) {
    return api.post('/cats/search', {
      name,
      gender,
    });
  }

  /**
   * Получение объекта кота по его ID
   * http://meowle.testops.ru:3001/api-docs-ui/#/default/get_cats_get_by_id
   * @param {!number} id ID кота
   * @returns {Promise<Cat>} Промис с объектом кота
   */
  static getById(id) {
    return api.get('/cats/get-by-id', {
      params: { id },
    });
  }

  /**
   * Получение подсказок по началу имени
   * http://meowle.testops.ru:3001/api-docs-ui/#/default/get_cats_search_pattern
   * @param {!string} name Часть имени кота
   * @param {?number=} limit Ограничение количества выходного списка
   */
  static getSuggestions(name, limit) {
    return api.get('/cats/search-pattern', {
      params: { name, limit },
    });
  }

  /**
   * Получение списка правил валидации имен
   * @returns {Promise<Validation[]>} Промис со списком с регулярными выражениями
   */
  static getValidations() {
    return api.get('/cats/validation');
  }

  /**
   * Сохранение описания имени кота
   * http://meowle.testops.ru:3001/api-docs-ui/#/default/post_cats_save_description
   * @param {!number} catId ID кота
   * @param {!string} description Описание имени
   * @returns {Promise<Cat>} Промис с объектом кота
   */
  static saveDescription(catId, description) {
    return api.post('/cats/save-description', {
      catId,
      catDescription: description,
    });
  }

  /**
   * Получение списка всех имен котов
   * http://meowle.testops.ru:3001/api-docs-ui/#/default/get_cats_all
   * @param {!string} order Сортировка (asc | desc)
   * @param {string=} gender Фильтр по полу
   * @returns {Promise<Groups>} Промис с группировкой имен котов
   */
  static getAll(order, gender) {
    return api.get('/cats/all', {
      order,
      gender,
    });
  }
}
