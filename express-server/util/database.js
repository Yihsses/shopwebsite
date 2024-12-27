const port = 3000

var mysql = require('mysql');

var dp = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '0802',
    database:'node.js-test',
    port: 3306
});

