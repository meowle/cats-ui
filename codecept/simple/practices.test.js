const randomString = require('./utils')

Feature('Практика по основам автоматизации')

Scenario('Тест 1', (I) => {
  const name = randomString()
  I.amOnPage('/cats/add')
  I.fillField('Введите имя', name)
  I.seeInField('Введите имя', name)
  I.click({css: 'input[value="male"]'})
  I.click('Добавить')
  I.waitInUrl('/')
  I.waitForText('Запомнили!')
})