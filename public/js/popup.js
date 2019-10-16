const popup = document.getElementById('popup')
const message = popup && popup.value || 'Запомнили!'

alertify.set("notifier", "position", "top-right");
alertify.set("notifier", "delay", 3);
alertify.warning(message);
