const popupFail = document.getElementById('popup-fail')
const message = popupFail && popupFail.value || 'Что-то пошло не так'

alertify.set('notifier', 'position', 'top-right')
alertify.set('notifier', 'delay', 3)
alertify.error(message)
