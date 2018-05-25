# Mattermoster ToDo Plugin (mattermoster-todo-plugin)
ToDo plugin for 'mattermoster-base' based on Node.js + Express + MySQL.
**[mattermoster-base](https://github.com/swordf1zh/mattermoster-base)** is a Node.js + Express base API for Mattermost slash command integrations.

[Mattermost](https://about.mattermost.com/) is an Open source, private cloud Slack-alternative.

## Features
  - Use the same MySQL database server you use for Mattermost
  - i18n ready
  - Open source!

## Installation
**mattermoster-todo-plugin is a plugin for 'mattermoster-todo'**

We are going to show you how to setup a Mattermoster-base API and then install **mattermoster-todo-plugin**.

### Setting *mattermoster-base*
```sh
$ git clone https://github.com/swordf1zh/mattermoster-base.git
$ cd mattermoster-base
$ npm install
```

For development environments...
```sh
$ npm run dev
```

For production environments...
```sh
$ npm start
```

Check if the server is working properly visiting [http://localhost:3000](http://localhost:3000)

### Mattermoster ToDo Plugin

```sh
$ npm install --save mattermoster-todo-plugin
```

Modify /routes/plugins.js
```js
// Include at the end of the file, just before
// module.exports = pluginsRouter;
const todoRouter = require('mattermoster-todo-plugin');
pluginsRouter.use('/todo', todoRouter);
```

### MySQL database

..wip

## Development

Want to contribute? Great, we are waiting for your PRs.

### Todos

 - Write Tests
 - Add .sql file to setup db and required tables

## License

MIT


**Free Software, Hell Yeah!**