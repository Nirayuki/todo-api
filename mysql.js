const mysql = require('mysql2');
require('dotenv').config()

var pool = mysql.createPool({
    "user": process.env.USER,
    "password": process.env.PASSWORD,
    "database": process.env.DATABASE,
    "host": process.env.HOST,
    "port": process.env.PORTDATABASE
})

exports.pool = pool;