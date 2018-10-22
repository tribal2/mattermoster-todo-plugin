# Mattermoster ToDo Plugin (mattermoster-todo-plugin)
ToDo plugin for Mattermoster based on Node.js + Express + MySQL.

**[Mattermoster](https://github.com/swordf1zh/mattermoster)** is a Node.js + Express base API for Mattermost slash command integrations.

[Mattermost](https://about.mattermost.com/) is an Open source, private cloud Slack-alternative.

## Features
  - Use the same MySQL database server you use for Mattermost
  - i18n ready
  - Open source!

## Installation

```sh
$ npm install --save mattermoster-todo-plugin
```

### Adding plugin to Mattermoster

```js
const MattermosterClass = require('mattermoster');
const mattermoster = new MattermosterClass;

// ...

/**
 * Mattermoster todo plugin
 */
const todoPlugin = require('mattermoster-todo-plugin');
const endpoint = '/todo'; // you can change this
mattermoster.addPlugin(endpoint, todoPlugin);

// ...

mattermoster.init();
```

### MySQL database

```sql
--
-- Schema creation
-- Replace 'DBNAME' below with your desired database name
--
CREATE SCHEMA DBNAME DEFAULT CHARACTER SET utf8 ;
USE DBNAME;

--
-- User creation
-- Replace DBUSER, DBPASS and DBNAME with your own
--
CREATE USER 'DBUSER'@'localhost' IDENTIFIED BY 'DBPASS';
GRANT ALL PRIVILEGES ON 'DBNAME'.* TO 'DBUSER'@'localhost';
FLUSH PRIVILEGES;

--
-- 'todo' table creation
--
CREATE TABLE `todo` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `channel_id` varchar(30) DEFAULT NULL,
  `description` VARCHAR(120) NULL,
  `completed` TINYINT NOT NULL DEFAULT 0,
  `created` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `created_by` varchar(30) DEFAULT NULL,
  `updated_by` varchar(30) DEFAULT NULL,
  PRIMARY KEY (`id`));
```

The MySQL connection class will use this parameters:

Parameter | Environment variable | Default value
----------|----------------------|--------------
host      | MM_TODO_DBHOST       | localhost
port      | MM_TODO_DBPORT       | 3306
user      | MM_TODO_DBUSER       | mattermoster
password  | MM_TODO_DBPASS       | mattermoster
database  | MM_TODO_DBNAME       | mattermoster

If you use a parameter with a non default value, you must set the corresponding environment variable.

### Mattermoster API Server

Run your Mattermoster API Server:

```sh
$ node index.js
```

You can supply a different port number for your server (defaults to 3000):

```sh
$ node index.js 12345
```

> For more information on running Mattermoster API Server read the documentation at [Mattermoster's Github repository](https://github.com/swordf1zh/mattermoster).

## Setting a Custom Slash Command in Mattermost

To create a Custom Slash Command, follow this instructions from [Mattermost's documentation](https://docs.mattermost.com/developer/slash-commands.html#custom-slash-command):

In Mattermost client (web or desktop application)...

1 - First, go to **Main Menu** > **Integrations** > **Slash Commands**. If you don’t have the Integrations option in your Main Menu, slash commands may not be enabled on your Mattermost server or may be disabled for non-admins. Enable them from **System Console** > **Integrations** > **Custom Integrations** or ask your System Administrator to do so.

2 - Click **Add Slash Command** and add name and description for the command.

3 - Set the **Command Trigger Word**. The trigger word must be unique and cannot begin with a slash or contain any spaces. It also cannot be one of the built-in commands.

> Note:
>
> Mattermoster ToDo Plugin **Command Trigger Word** is dependent on language set on Mattermoster API project.
>
> To find out **Command Trigger Word**, navigate to Mattermoster_API_root > node_modules > mattermoster-todo-plugin > locales. Open the XX.json file of the language you set (defaults to 'en.json').
>
> In XX.json look for "slash_command".
>
> This is the **Command Trigger Word** you must use in Mattermost.

4 - Set the **Request URL** and **Request Method**. The request URL is the endpoint that Mattermost hits to reach your application, and the request method is either POST or GET and specifies the type of request sent to the request URL.

> Note:
>
> This is the host:port of your Mattermoster API server.
>
> **Request Method** must be set to POST.

5 - (Optional) Set the response username and icon the command will post messages as in Mattermost. If not set, the command will use your username and profile picture.

6 - (Optional) Include the slash command in the command autocomplete list, displayed when typing / in an empty input box. Use it to make your command easier to discover by your teammates. You can also provide a hint listing the arguments of your command and a short description displayed in the autocomplete list.

7 - Hit Save.

You are done. Now try your new **Custom Slash Command** in any channel or direct message in Mattermost.

## Development

Want to contribute? Great, we are waiting for your PRs.
```sh
$ git clone https://github.com/swordf1zh/mattermoster-todo-plugin.git
$ cd mattermoster-todo-plugin
$ npm install
$ npm run dev
```
### Todos

 - Write tests
 - Expand troubleshooting section

## Troubleshooting

If you are running Mattermoster in the same machine that is running Mattermost, you must modify Mattermost's config.json file to [allow unstrusted internal connections](https://docs.mattermost.com/administration/config-settings.html#allow-untrusted-internal-connections-to).

## License

MIT

**Free Software, Hell Yeah!**
