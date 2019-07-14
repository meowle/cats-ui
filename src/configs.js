const path = require('path')
const dotenv = require('dotenv')

const configPath = path.join(
  __dirname,
  '..',
  'configs',
  `${process.env.NODE_ENV}.env`
)
const configLoadResult = dotenv.config({
  path: configPath,
})

if (configLoadResult.error) {
  console.error(`не могу прочитать конфигурацию: ${configLoadResult.error}`)
  process.exit(1)
}

const serverPort = process.env.NODE_PORT
const apiUri = process.env.API_URI

module.exports = {
  serverPort,
  apiUri,
}
