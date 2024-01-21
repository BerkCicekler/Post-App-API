const mysql = require("mysql2");

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    database: 'restfulapi',
    password: '',
    waitForConnections: true,

})

module.exports = pool.promise();