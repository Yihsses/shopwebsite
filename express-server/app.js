var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var logger = require('morgan');
var sellerRouter = require('./routes/seller')
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var adminRouter = require('./routes/admin');
const jwt = require("jsonwebtoken");
const { expressjwt } = require('express-jwt');
var app = express();
const cors = require('cors');  

const secretKey = 'DEMO';



app.use(bodyParser.json({limit: '5000mb'}));
app.use(bodyParser.urlencoded({limit: '5000mb', extended: true}));

app.use(cors({  
    origin:['http://localhost:8080'],
    methods:['POST','GET','DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
}));
app.all('*', function (req, res, next) {
  let originHeader=req.headers.origin;
  res.header("Access-Control-Allow-Origin", originHeader);
  // res.header("Access-Control-Allow-Origin", "*");
  res.header('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With , yourHeaderFeild');
  res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
  res.header("X-Powered-By", ' 3.2.1')
  res.header("Content-Type", "application/json;charset=utf-8");
  res.header("Access-Control-Allow-Credentials",true);
  next();
});
app.use(express.urlencoded({ extended: true }))
const port = 3002

var mysql = require('mysql');
var dp = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '1234',
    database:'node.js-test',
    port: 3306
});


// dp.query('SELECT 12 + 34 AS result', function(err, rows, fields) {
//     if (err) throw err;
//     console.log('The result is: ', rows[0].result);
// }); 

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/seller', sellerRouter);
app.use('/admin', adminRouter);
app.use(session({
  secret: 'chh',
  cookie:{
    maxAge:60*1000*30,
    secure:false
  },
  resave: false, // 固定寫法
  saveUninitialized: false // 固定寫法
}));

app.use(cookieParser());
var debug = require('debug')('my-application');
app.set('port', process.env.PORT || 3000);

// 啟動監聽
var server = app.listen(app.get('port'), function() {
debug('Express server listening on port ' + server.address().port);
});


app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
  })
  
//  module.exports = app;
