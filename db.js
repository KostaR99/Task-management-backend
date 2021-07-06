const mysql = require('mysql');
require('dotenv').config()


const db = mysql.createConnection({
    host:process.env.DB_HOST,
    user:process.env.DB_USER,
    password:process.env.DB_PASS,
    database:process.env.DB
})

db.connect((err)=>{
    if(err)
        console.log(err)
    console.log("connected")
});

module.exports = db