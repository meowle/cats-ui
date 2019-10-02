const validationError = document.getElementById('validation-error').value

const errorMessage =
  validationError == null || validationError.length == 0
    ? 'Что-то пошло не так'
    : validationError

alertify.set('notifier', 'position', 'top-right')
alertify.set('notifier', 'delay', 3)
alertify.error(errorMessage)
