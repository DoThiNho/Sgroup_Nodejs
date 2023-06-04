const mysql = require('mysql')
require('dotenv').config()


const connnection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB
})

module.exports = connnection