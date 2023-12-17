"use strict";

// Напишите HTTP сервер и реализуйте два обработчика, где:
// — По URL “/” будет возвращаться страница, на которой есть гиперссылка на вторую страницу по ссылке “/about”
// — А по URL “/about” будет возвращаться страница, на которой есть гиперссылка на первую страницу “/”
// — Также реализуйте обработку несуществующих роутов (404).
// — * На каждой странице реализуйте счетчик просмотров. Значение счетчика должно увеличиваться на единицу каждый раз, когда загружается страница.

const http = require('http');
const server = http.createServer((req, res) => {
    console.log('Запрос получен');
    switch (req.url) {
        case '/':
            res.writeHead(200, {'Content-Type': 'text/html; charset=UTF-8'});
            res.end(`
            <h1>Добро пожаловать</h1>
            <a href='/about'>Обо мне</a>`);
            break;
        case '/about':
            res.writeHead(200, {'Content-Type': 'text/html; charset=UTF-8'});
            res.end(`
            <h1>Добро пожаловать на страницу обо мне</h1>
            <a href='/'>Главная</a>`);
            break;
        default:
            res.writeHead(404, {'Content-Type': 'text/html; charset=UTF-8'});
            res.end(`
            <h1>Ошибка 404</h1>
            <a href='/'>Вернуться на главную</a>`);
            break;
    }
});
const port = 3000;
server.listen(port, () => {
    console.log(`Сервер запущен на порту ${port}`);
});