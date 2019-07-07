;(function() {
  function resetAddNewNameHandlers() {
    const plusButtons = document.getElementsByClassName('add-new-name')

    for (let i = 0; i < plusButtons.length; i++) {
      const plusButton = plusButtons[i]

      plusButton.removeEventListener('click', handleAddNewName)
      plusButton.addEventListener('click', handleAddNewName)
    }
  }

  function handleAddNewName(event) {
    event.preventDefault()

    const thisField = this.closest('.field')
    const newField = thisField.cloneNode(true)

    thisField.parentNode.insertBefore(newField, thisField.nextSibling)

    resetAddNewNameHandlers()
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
