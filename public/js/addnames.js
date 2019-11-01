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

    if (!catsAreValid()) {
      return
    }

    const currentCat = this.closest('.level')

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

  function catsAreValid() {
    const levels = document.getElementsByClassName('add-cat-data')
    let thereIsBadCat = true

    for (let level of levels) {
      const isCatValid = [isCatNameValid, isCatGenderValid]
        .map(validate => validate(level))
        .every(isValid => isValid)

      if (!isCatValid) {
        thereIsBadCat = false
      }
    }

    return thereIsBadCat
  }

  function setSubmitHandler() {
    const submitButton = document.getElementsByClassName('submit-cats')[0]

    submitButton.addEventListener('click', function(event) {
      event.preventDefault()
      
      if (!catsAreValid()) {
        return
      }

      document.forms['add-cat'].submit()
    })
  }

  resetAddNewNameHandlers()
  setSubmitHandler()
})()
