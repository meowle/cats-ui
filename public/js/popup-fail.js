const validationError = document.getElementById('validation-error').value

alertify.set('notifier', 'position', 'top-right')
alertify.set('notifier', 'delay', 3)
alertify.error(validationError)
