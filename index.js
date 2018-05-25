const todoRouter = require('express').Router();
const debug = require('debug')('mattermoster:todo-plugin');
var i18n = require("i18n");

const mmTodoClass = require('./models/mm-todo');

/**
 * i18n Localization configuration
 */

i18n.configure({
  locales:[
    'en',
    'es',
  ],
  directory: __dirname + '/locales'
});

/**
 * TODO ROUTE
 */

todoRouter.post('/', (req, res) => {
  i18n.setLocale(res.locale);
  const mmTodo = new mmTodoClass(i18n);
  mmTodo.do(req.body).then(
    (result) => success(res, result),
    (err) => error(res, err)
  );
});

function success(response, result) {
  debug(result);
  response.json(result);
}

function error(response, error) {
  debug(error);
  response.status(500).json({ msg: 'Something broke!'});
}

module.exports = todoRouter;