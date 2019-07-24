# Front-приложение Meowle

[![Build Status](https://travis-ci.org/meowle/cats-ui.svg?branch=master)](https://travis-ci.org/meowle/cats-ui)

## Старт приложения локально

```bash
> yarn # установка зависимостей
> yarn start:local # запуск приложения с локальным конфигом
```

## Сборка docker-образа

```bash
> docker build . -t nasyalnik/cats-ui:<version> # установка зависимостей
```

## Запуск UI e2e тестов

```bash
> yarn selenium-standalone install # установка веб-драйвера для codeception
> yarn selenium-standalone start # запуск selenium server
> yarn codeceptjs run --steps --debug --verbose # запуск тестов
```
