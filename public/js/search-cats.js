;(function() {
  /* Фича 5: Инициализация фильтра поиска по полу */
  initGendersFilter()

  /* Фича 7: Инициализация подсказок */
  initSuggestions()

  function initGendersFilter() {
    const gendersList = ['female', 'male', 'unisex']

    for (let i = 0; i < gendersList.length; i++) {
      const gendersInput = document.getElementsByName(gendersList[i])[0]

      if (!gendersInput) return

      gendersInput.addEventListener('change', submitForm)
    }
  }

  function initSuggestions() {
    // задержка поиска подсказок в мс
    const DELAY_SEARCH_SUGGESTIONS = 500
    // ограничение количества полученных подсказок
    const LIMIT_SUGGESTIONS = 20
    const searchInput = document.getElementById('cat-name')
    const suggestionsElement = document.getElementById('suggestions')
    const suggestionsContentElement = suggestionsElement && suggestionsElement.querySelector('.dropdown-content')
    let oldSearchValue = ''
    let lastTimer = null

    if (!searchInput || !suggestionsElement) return

    // при фокусе в поле поиска - отобразит подсказки если они есть
    searchInput.addEventListener('focus', () => {
      if (suggestionsContentElement.childElementCount) {
        dropdownActive(true)
      }
    })

    // при потере фокуса в поле поиска - скроет подсказки если только не был выбрана подсказка
    searchInput.addEventListener('blur', function(event) {
      if (event.relatedTarget && event.relatedTarget.classList.contains('dropdown-item')) return

      dropdownActive(false)
    })

    /* при изменении текста в поле поиска запустит таймер по окончанию которого запросит подсказки с апи и выведет в дропдаун.
    *  Если таймер еще не начался, а значение поиска уже изменилось - отменяется таймер и создается новый.
    *  При пустом поле - скрываются подсказки. */
    searchInput.addEventListener('keyup', () => {
      const newSearchValue = searchInput.value

      if (!newSearchValue) {
        oldSearchValue = newSearchValue
        dropdownActive(false)
        return
      }

      if (newSearchValue === oldSearchValue) return

      oldSearchValue = newSearchValue

      clearTimeout(lastTimer)
      lastTimer = setTimeout(() => {
        dropdownActive(true)
        apiSearchSuggestions(suggestionsContentElement, newSearchValue, LIMIT_SUGGESTIONS)
          .then(items => renderSuggestionsItems(suggestionsContentElement, items))
      }, DELAY_SEARCH_SUGGESTIONS)
    })
  }

  /* Отправляет всю форму поиска */
  function submitForm() {
    document.getElementsByClassName('cats-search')[0].submit()
  }

  /* Запрашивает подсказки от апи и выводит их в дропдаун */
  function apiSearchSuggestions(dropdownContentElement, searchValue, LIMIT_SUGGESTIONS) {
    return fetch(`/search-suggests?name=${searchValue}&limit=${LIMIT_SUGGESTIONS}`)
      .then(res => res.json())
      .catch(() => {
        return null
      })
  }

  /* Рендерит список имен в дропдаун подсказок */
  function renderSuggestionsItems(dropdownContentElement, items) {
    dropdownContentElement.innerHTML = ''

    if (!items || !items.length) {
      const itemElement = document.createElement('div')

      itemElement.innerText = 'Ничего не найдено'
      itemElement.classList = 'dropdown-item'
      dropdownContentElement.append(itemElement)
      return
    }

    items.forEach(item => {
      const itemElement = document.createElement('a')

      itemElement.classList = 'dropdown-item'
      itemElement.innerText = item.name
      itemElement.tabIndex = '0'
      itemElement.addEventListener('click', suggestClickHandler)
      dropdownContentElement.append(itemElement)
    })
  }

  /* Клик по подсказке скроет дропдаун и впишет текст подсказки в поле поиска */
  function suggestClickHandler() {
    const searchInput = document.getElementById('cat-name')

    dropdownActive(false)
    searchInput.value = this.innerText
  }

  /* Активация/деактивация списка подсказок */
  function dropdownActive(active) {
    const suggestionsElement = document.getElementById('suggestions')

    if (active) {
      suggestionsElement.classList.add('is-active')
    } else {
      suggestionsElement.classList.remove('is-active')
    }
  }
})()
