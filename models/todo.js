const debug = require('debug')('mattermoster:model-todo');

const connection = require('./connection');

class Todo {
  acquire() {
    return new Promise((resolve, reject) => {
      connection.acquire((err, conn) => {
        this.checkError(err, reject);
        debug('DB connection acquired from pool')
        resolve(conn);
      });
    });
  }

  async query(query, values) {
    const mysqlCon = await this.acquire();
    return new Promise((resolve, reject) => {
      debug({ query, values });
      mysqlCon.query(query, values, (queryErr, result) => {
        this.checkError(queryErr, reject);
        mysqlCon.release();
        debug('OK');
        resolve(result);
      });
    });
  }

  checkError(err, rejectorFn) {
    if (!err) return;
    debug(err);
    rejectorFn(err);
  }

  async get(todo_id) {
    let query = `SELECT * FROM todo WHERE id = ${todo_id}`;
    let queryRes = await this.query(query);
    debug(queryRes);
    return queryRes;
  }

  async getList(channel_id, incomplete_only) {
    let where = [];
    if (channel_id)  where.push(`channel_id = '${channel_id}'`);
    if (incomplete_only)  where.push('completed = 0');

    let query = 'SELECT * FROM todo';
    if (where.length > 0) query += ' WHERE ' + where.join(' AND ');
    query += ' ORDER BY id ASC'

    let queryRes = await this.query(query);
    debug(queryRes);
    return queryRes;
  }

  async create(todo) {
    let query = 'INSERT INTO todo SET ?';
    let queryRes = await this.query(query, todo);
    debug(queryRes);
    return queryRes;
  }

  async update(todo) {
    let query = 'UPDATE todo SET ? WHERE id = ?';
    let values = [todo, todo.id];
    let queryRes = await this.query(query, values);
    debug(queryRes);
    return queryRes;
  }

  async delete(todoId) {
    let query = 'DELETE FROM todo WHERE id = ?';
    let values = [todoId];
    let queryRes = await this.query(query, values);
    debug(queryRes);
    return queryRes;
  }
}

module.exports = new Todo();