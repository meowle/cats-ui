const { Converter } = require('showdown')
const {
  readFileSync: readFile,
  writeFileSync: writeFile,
  existsSync: fileExists,
  mkdirSync: mkdir,
} = require('fs')
const { join } = require('path')
const cheerio = require('cheerio')

function generateDocs() {
  const docsIndex = loadFile('..', 'docs', 'index.md')

  const converter = new Converter()
  const docsBody = converter.makeHtml(expandIncludes(docsIndex))

  const docsTemplate = loadFile('docs-template.html')

  const packageJsonText = loadFile('..', 'package.json')
  const { name: appName, version: appVersion } = JSON.parse(packageJsonText)

  const finalHtml = applyTemplate(docsTemplate, {
    appName,
    appVersion,
    docsBody,
  })

  const outputDir = join(__dirname, '..', 'out')
  if (!fileExists(outputDir)) {
    mkdir(outputDir)
  }

  const finalHtmlPath = join(outputDir, 'index.html')
  writeFile(finalHtmlPath, finalHtml, 'utf8')
}

function loadFile(...pathParts) {
  return readFile(
    Array.isArray(pathParts[0])
      ? join(__dirname, ...pathParts[0])
      : join(__dirname, ...pathParts),
    'utf8'
  )
}

function applyTemplate(template, params) {
  return Object.entries(params).reduce(
    (template, [paramKey, paramValue]) =>
      template.split(`\$\{${paramKey}\}`).join(paramValue),
    template
  )
}

function expandIncludes(docsMd) {
  return docsMd.replace(/^\[include\s(.*?)\]:\s.+$/gim, (_, inclusionPath) =>
    inclusionPath.startsWith('@')
      ? loadMetaContent(...inclusionPath.substring(1).split(/\s/, 2))
      : `\`\`\`plain\n${loadFile(splitPath(inclusionPath))}\n\`\`\``
  )
}

function splitPath(path) {
  return path.split(/[\\\/]/)
}

function loadMetaContent(contentType, contentPath) {
  if (contentType.toLowerCase() === 'jest-junit') {
    const junitReport = loadFile(splitPath(contentPath))
    const $ = cheerio.load(junitReport)

    return $('testsuite')
      .map(
        (_, testSuite) => `#### ${$(testSuite).attr('name')}\n\n${$(
          'testcase',
          testSuite
        )
          .map((_, testCase) => '- ' + $(testCase).attr('name'))
          .get()
          .join('\n')}
      `
      )
      .get()
      .join('\n')
  }
}

generateDocs()
