// Напишите HTTP сервер на express и реализуйте два
// обработчика “/” и “/about”, где:
// - На каждой странице реализован счетчик
// просмотров
// - Значение счетчика необходимо сохранять в файл
// каждый раз, когда обновляется страница
// - Также значение счетчика должно загружаться из
// файла, когда запускается обработчик страницы
// - Таким образом счетчик не должен обнуляться
// каждый раз, когда перезапускается сервер

const express = require('express');
const app = express();

const path = require('path');
const fs = require('fs');

const pathToFile = path.join(__dirname, 'counter.json');
//считываем данные счетчиков из файла counter.json
const data = JSON.parse(fs.readFileSync(pathToFile, 'utf-8')); 

// Корневая страница
app.get('/', (req, res) => {
    res.send(`<h1>Корневая страница</h1> 
    <p>Просмотров: ${++data.main}</p> 
    <a href="/about">About</a>`); //берем значение счетчика (data.main) из файла counter
    //записываем в файл counter.json обновленные данные счетчика
    fs.writeFileSync(pathToFile, JSON.stringify(data, null, 2));
});

// Страница "About"
app.get('/about', (req, res) => {
    res.send(`<h1>Страница about</h1>
    <p>Просмотров: ${++data.about}</p>
    <a href="/">Главная</a>`); 
    fs.writeFileSync(pathToFile, JSON.stringify(data, null, 2));
})

const port = 3000;

app.listen(port, () => {
    console.log(`Сервер запущен на порту ${port}`);
})
