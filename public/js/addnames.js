;(function() {
  function resetAddNewNameHandlers() {
    const plusButtons = document.getElementsByClassName('add-new-name')

    for (let i = 0; i < plusButtons.length; i++) {
      const plusButton = plusButtons[i]

      plusButton.removeEventListener('click', handleAddNewName)
      plusButton.addEventListener('click', handleAddNewName)
    }
  }

  let newCatsCount = 1

  function handleAddNewName(event) {
    event.preventDefault()

    const currentCat = this.closest('.level')

    const isCatValid = [isCatNameValid, isCatGenderValid]
      .map(validate => validate(currentCat))
      .every(isValid => isValid)

    if (!isCatValid) {
      return
    }

    const newField = currentCat.cloneNode(true)

    const catNameField = newField.querySelector('input[type=text]')
    catNameField.name = `cat-name-${newCatsCount}`
    catNameField.value = ''
    catNameField.classList.remove('is-danger')

    const catGenderRadios = newField.querySelectorAll('input[type=radio]')
    for (let i = 0; i < catGenderRadios.length; i++) {
      catGenderRadios[i].name = `cat-gender-${newCatsCount}`
      catGenderRadios[i].checked = false
    }

    currentCat.parentNode.insertBefore(newField, currentCat.nextSibling)

    newCatsCount++
    resetAddNewNameHandlers()
  }

  function isCatNameValid(currentCat) {
    const currentCatNameField = currentCat.querySelector('input[type=text]')
    const currentCatName = currentCatNameField.value
    if (currentCatName == null || currentCatName.trim() === '') {
      currentCatNameField.classList.add('is-danger')
      return false
    }

    currentCatNameField.classList.remove('is-danger')
    return true
  }

  function isCatGenderValid(currentCat) {
    const currentCatGender = currentCat.querySelector(
      'input[type=radio]:checked'
    )
    const validationIndicator = currentCat.getElementsByClassName(
      'specify-gender'
    )[0]
    if (currentCatGender == null) {
      validationIndicator.classList.add('has-text-danger')
      return false
    }

    validationIndicator.classList.remove('has-text-danger')
    return true
  }

  function handleAddNewNameWithValidation(event) {
    event.preventDefault()

    const catName = document.querySelector('input[type=text][name=catName]')
      .value
    const gender = document.querySelector('input[type=radio]:checked').value
    const thisField = this.closest('.level')
    //Попытка раскрасить текст в красный цвет, при условии, что радиобаттоны false
    if (gender.length == 0) {
      thisField.getElementsByTagName('choise-gender').classList.add('is-danger')
    }

    if (catName !== '') {
      const newField = thisField.cloneNode(true)
      newField.getElementsByTagName('input')[0].value = ''
      // попытка клонировать новый уровень без предзаполенных значений радиабаттонов
      //      newField.getElementsByTagName('gender').prop('checked', false)
      thisField.parentNode.insertBefore(newField, thisField.nextSibling)

      resetAddNewNameHandlers()
    } else {
      const fieldAddName = document.getElementsByTagName('input')[0]
      // попытка раскрасить инпут в красный цвет, при пустом значении
      //      fieldAddName.classList.add('is-danger')
      fieldAddName.className += 'is-danger'
      console.log('catName is empty')
    }

    console.log(gender)
  }

  function setShowModalHandler() {
    const addNamesButton = document.getElementsByClassName('show-add-names')[0]
    addNamesButton.addEventListener('click', function() {
      const addNamesModal = document.getElementsByClassName('modal')[0]
      addNamesModal.classList.add('is-active')
    })
  }

  function setCloseModalHandler() {
    const closeModalButton = document.getElementsByClassName('modal-close')[0]
    closeModalButton.addEventListener('click', function() {
      const addNamesModal = document.getElementsByClassName('modal')[0]
      addNamesModal.classList.remove('is-active')
    })
  }

  resetAddNewNameHandlers()
  setCloseModalHandler()
  setShowModalHandler()
})()
