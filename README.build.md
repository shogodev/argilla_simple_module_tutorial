# Работа с базами данных

Все настройки БД беруться из конфига движка. Все, что имеет отношение к БД лежит в папке *.sql*.

## createDump

Создать обычный дамп

## createSchema

Обновить схему для базы данных. Схема находится под версионным контролем. Схема отличается от обычного дампа тем, что из нее вырезаются создатели вьюх, а так же автоинкременты.

## applySchema 

Накатить схему базы данных.

##coverage

Собрать code-coverage report. Запускает тесты по обоим приложентиям. Данные будут доступны по адресу http://your.domain/build/coverage/frontend и http://your.domain/build/coverage/backend

# JavaScript

## jsPack

Склеить скрипты в один файл

## jsCompile

Создать compiled.js. Компилятор задается в переменной jsCompiler, по умолчанию используется closure

#Сборка

Сборка производится по двум сценариям - обычная, и для Conitnous Integration. Для CI сборка отличается тем, что не выводит никакой build-информации, и не падает вместе с падающими тестами.

Сборка для CI:
	phing -Dci
Текущая сборка:
	phing

Процесс сборки можно ограничить приложением. К примеру
	phing test -Dbackend
Выполит только тесты для бекенда.

Можно ограничить только по папке. К примеру
	phing phpcs -Dcheckdir protected/extensions/xmlmenu
Запустит phpcs только для папки protected/extensions/xmlmenu