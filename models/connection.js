const mysql = require('mysql');

function Connection() {
  this.pool = mysql.createPool({
    connectionLimit: 10,
    host: process.env.DB_MATTERMOSTER_TODO_HOST || 'localhost',
    port: process.env.DB_MATTERMOSTER_TODO_PORT || 3306,
    user: process.env.DB_MATTERMOSTER_TODO_USER || 'mattermoster',
    password: process.env.DB_MATTERMOSTER_TODO_PASS || 'mattermoster',
    database: process.env.DB_MATTERMOSTER_TODO_DB || 'mattermoster'
  });

  this.acquire = function(callback) {
    this.pool.getConnection(function(err, connection) {
      callback(err, connection);
    });
  };
}

module.exports = new Connection();