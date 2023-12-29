// Для того, чтобы пользователи хранились постоянно, а не только, когда запущен сервер, необходимо реализовать хранение массива в файле.

// Подсказки:
// — В обработчиках получения данных по пользователю нужно читать файл
// — В обработчиках создания, обновления и удаления нужно файл читать, чтобы убедиться, что пользователь существует, а затем сохранить в файл, когда внесены изменения
// — Не забывайте про JSON.parse() и JSON.stringify() - эти функции помогут вам переводить объект в строку и наоборот.

const express = require("express");
const app = express();

const Joi = require("joi");
const schema = Joi.object({
  name: Joi.string().min(3).required(),
  secondName: Joi.string().min(2).required(),
  age: Joi.number().min(0).required(),
  city: Joi.string().min(2),
});

const path = require("path");
const fs = require("fs");
const pathToFile = path.join(__dirname, "users.json");

app.use(express.json());

let uniqId;

//ПОЛУЧЕНИЕ ВСЕХ ПОЛЬЗОВАТЕЛЕЙ
app.get("/users", (req, res) => {
  fs.readFile(pathToFile, "utf-8", (err, data) => {
    if (err) {
      console.error(err);
    } else {
      const users = JSON.parse(data);
      res.send({ users });
    }
  });
});

//ДОБАВЛЕНИЕ НОВОГО ПОЛЬЗОВАТЕЛЯ
app.post("/users", (req, res) => {
  fs.readFile(pathToFile, "utf-8", (err, data) => {
    if (err) {
      console.error(err);
    } else {
      //считываем данные из файла
      const users = JSON.parse(data);
      //проверяем валидность новых данных и добавляем их
      const result = schema.validate(req.body);
      if (result.error) {
        return res.status(400).send({ error: result.error.details });
      }
 
      if (users.length === 0) { // проверяю, если массив пользователей пуст, то ID = 1
        uniqId = 1;
      } else {      //если в массиве есть пользователи, то следующий ID = ID последнего + 1
        uniqId = 1 + users[users.length - 1].id;
      }
      //доюавляем в массив нового пользователя
      users.push({ id: uniqId, ...req.body });
      console.log(req.body);
      res.send({ id: uniqId });
      //записываем новые данные в файл
      fs.writeFile(pathToFile, JSON.stringify(users, null, 2), (err) => {
        if (err) {
          console.error(err);
        }
        console.log("The file saved");
      });
    }
  });
});

//РЕДАКТИРОВАНИЕ ВЫБРАННОГО ПОЛЬЗОВАТЕЛЯ
app.put("/users/:id", (req, res) => {
  fs.readFile(pathToFile, "utf-8", (err, data) => {
    if (err) {
      console.error(err);
    } else {
      //считываем данные из файла
      const users = JSON.parse(data);
      //проверяем валидность данных и вносим изменения
      const result = schema.validate(req.body);
      if (result.error) {
        return res.status(400).send({ error: result.error.details });
      }
      //ищем пользователя с указанным в params айди
      const id = +req.params.id;
      const user = users.find((user) => user.id === id);
      if (user) {
        user.name = req.body.name;
        user.secondName = req.body.secondName;
        user.age = req.body.age;
        user.city = req.body.city;
        res.send({ user });
      } else {
        res.status(400);
        res.send({ user: null });
      }
      //записываем измененные данные в файл
      fs.writeFile(pathToFile, JSON.stringify(users, null, 2), (err) => {
        if (err) {
          console.error(err);
        }
        console.log("The file saved");
      });
    }
  });
});

//ПОЛУЧЕНИЕ ОТДЕЛЬНОГО ПОЛЬЗОВАТЕЛЯ ПО ID
app.get("/users/:id", (req, res) => {
  fs.readFile(pathToFile, "utf-8", (err, data) => {
    if (err) {
      console.error(err);
    } else {
      const users = JSON.parse(data);
      //ищем пользователя с указанным id
      const id = +req.params.id;
      const user = users.find((user) => user.id === id);
      if (user) {
        res.send({ user });
      } else {
        res.status(404);
        res.send({ user: null });
      }
    }
  });
});

//УДАЛЕНИЕ ПОЛЬЗОВАТЕЛЯ ПО ID
app.delete("/users/:id", (req, res) => {
  //считываем даные из файла 
  fs.readFile(pathToFile, "utf-8", (err, data) => {
    if (err) {
      console.error(err);
    } else {
      const users = JSON.parse(data);
      //поиск пользователя по id
      const id = +req.params.id;
      const user = users.find((user) => user.id === id);
      if (user) {
        const userIndex = users.indexOf(user);
        //вырезаем из массива пользователей выбранного по айди
        users.splice(userIndex, 1);
        res.send({ user }); // возвращаем удаленного пользователя
      } else {
        res.status(404);
        res.send({ user: null });
      }
      //записываем измененные данные в файл
      fs.writeFile(pathToFile, JSON.stringify(users, null, 2), (err) => {
        if (err) {
          console.error(err);
        }
        console.log("The file saved");
      });
    }
  });
});

app.listen(3000);
