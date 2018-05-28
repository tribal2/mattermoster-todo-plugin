const mysql = require('mysql');

function Connection() {
  this.pool = mysql.createPool({
    connectionLimit: 10,
    host: process.env.MM_TODO_DBHOST || 'localhost',
    port: process.env.MM_TODO_DBPORT || 3306,
    user: process.env.MM_TODO_DBUSER || 'mattermoster',
    password: process.env.MM_TODO_DBPASS || 'mattermoster',
    database: process.env.MM_TODO_DBNAME || 'mattermoster'
  });

  this.acquire = function(callback) {
    this.pool.getConnection(function(err, connection) {
      callback(err, connection);
    });
  };
}

module.exports = new Connection();