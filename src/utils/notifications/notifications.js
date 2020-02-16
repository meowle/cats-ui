import '../../../node_modules/alertifyjs/build/css/alertify.min.css';
import alertifyjs from 'alertifyjs';
import './notifications.css';

alertifyjs.set('notifier', 'position', 'top-right');
alertifyjs.set('notifier', 'delay', 3);

export const notify = {
  error(text, delay) {
    alertifyjs.error(text, delay);
  },
  success(text, delay) {
    alertifyjs.success(text, delay);
  },
  warning(text, delay) {
    alertifyjs.warning(text, delay);
  },
  info(text, delay) {
    alertifyjs.notify(text, 'info', delay);
  },
};
