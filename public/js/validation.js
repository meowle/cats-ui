function bindSearchValidation(inputsSelector) {
  const validationRulesInput = document.getElementById('validation-rules')
  let validationRules = [];
  
  try {
    validationRules = JSON.parse(validationRulesInput.value)
  } catch (e) {
    console.error('No validation rules')
  }

  const nameInputs = document.querySelectorAll(inputsSelector) || []

  for (let i = 0; i < nameInputs.length; i++) {
    const nameInput = nameInputs[i]

    nameInput.addEventListener('keypress', validateSearchInput)
  }


  function validateSearchInput(event) {
    const currentValue = event.target.value
    const keyPressed = event.key
    const newValue = currentValue + keyPressed

    if (event.charCode === 13) {
      return;
    }

    for (let i = 0; i < validationRules.length; i++) {
      const { description, regex } = validationRules[i]
      const validationRegex = new RegExp(regex)

      const isValid = newValue.search(validationRegex) > -1
      if (!isValid) {
        event.preventDefault()

        alertify.set('notifier', 'position', 'top-right')
        alertify.set('notifier', 'delay', 3)
        alertify.warning(description)

        return
      }
    }
  }
}

bindSearchValidation('#cat-name')