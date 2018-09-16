const createApp = require('./api');

const app = createApp('names.db');
app.listen(3001);
