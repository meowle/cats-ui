const ui = require('./controller')
const { serverPort } = require('./configs')

const app = ui.createApp()
app.listen(serverPort)
