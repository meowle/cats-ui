Feature('Практика по основам автоматизации')

Scenario('Тест 1', (I) => {
  I.amOnPage('/cats/add')
  I.fillField('Введите имя', 'йцукеефывфыв')
  I.click({css: 'input[value="male"]'})
  I.click('Добавить')
  I.waitInUrl('/')
  I.waitForText('Запомнили!')
})