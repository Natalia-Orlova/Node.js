"use strict";

// Напишите HTTP сервер и реализуйте два обработчика, где:
// — По URL “/” будет возвращаться страница, на которой есть гиперссылка на вторую страницу по ссылке “/about”
// — А по URL “/about” будет возвращаться страница, на которой есть гиперссылка на первую страницу “/”
// — Также реализуйте обработку несуществующих роутов (404).
// — * На каждой странице реализуйте счетчик просмотров. Значение счетчика должно увеличиваться на единицу каждый раз, когда загружается страница.

const http = require('http');
let countVisitsMain = 0;
let countVisitsAbout = 0;
const server = http.createServer((req, res) => {
    console.log('Запрос получен');
    switch (req.url) {
        case '/':
            res.writeHead(200, {'Content-Type': 'text/html; charset=UTF-8'});
            res.end(`
            <h1>Корневая страница</h1>
            <a href='/about'>Старица About</a>
            <p>Просмотров: ${++countVisitsMain}</p>`);
            break;
        case '/about':
            res.writeHead(200, {'Content-Type': 'text/html; charset=UTF-8'});
            res.end(`
            <h1>Старница About</h1>
            <a href='/'>Корневой каталог</a>
            <p>Просмотров: ${++countVisitsAbout}</p>`);
            break;
        default:
            res.writeHead(404, {'Content-Type': 'text/html; charset=UTF-8'});
            res.end(`
            <h1>Ошибка 404</h1>
            <a href='/'>Вернуться в корневой каталог</a>`);
            break;
    }
});
const port = 3000;
server.listen(port, () => {
    console.log(`Сервер запущен на порту ${port}`);
});