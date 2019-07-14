const ui = require('./ui')
const { serverPort } = require('./configs')

const app = ui.createApp()
app.listen(serverPort)
