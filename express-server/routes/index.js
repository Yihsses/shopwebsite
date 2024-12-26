var express = require('express');
var router = express.Router();

var mysql = require('mysql');
var dp = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '1234',
    database:'vspo_dp',
    port: 3306
});

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});



router.get('/api/product/GetAllProduct',function(req,res,next){
   var sql = 'SELECT * FROM product';
   dp.query(sql,function(err,result){
      if(err){
        console.log("查詢錯誤");
      }else{
        console.log(result);
      }
      res.send(result);
   });
  // dp.query('SELECT 12 + 34 AS result', function(err, rows, fields) {
  //   if (err) throw err;
  //   console.log('The result is: ', rows[0].result);
  // }); 
});

router.get('/api/member/CheckMemberAccount',function(req,res,next){

  let  account =  encodeURIComponent(req.query.account);
  account = account.replace("%40","@")
  const account_password = (req.query.password) ;
  const jwt = require("jsonwebtoken");
  const expressJWT = require("express-jwt");
  const secretKey = 'DEMO';

  var sql = `SELECT Username, Password FROM member WHERE Email = '${account}' AND Password = '${account_password}'`;
  dp.query(sql,function(err,result){
    if(err){
      console.log("查詢錯誤");
    }else{
      if(result.length == 0 ){
        return res.json({
          success: false,
          message: '帳號或密碼錯誤'
      });
      }else{
        const payload = {
          LoggedIn: true
      }
        const token = jwt.sign(payload, secretKey, { expiresIn: '600s' });
        //  res.cookie('LoggedIn', true, {maxAge:600000}); 
         return res.json({
          success: true,  // 標示操作是否成功
          message: '登入成功',
          token
      });
      }
    }
  });
});

router.get('/api/product/GetProductInfo',function(req,res,next){
  let Product_id =  req.query.id;
  var sql = `select * from product where Product_id = '${Product_id}' ;`;
  dp.query(sql,function(err,result){
    if(err){
      console.log("查詢錯誤");
    }else{
      console.log(result);
      res.send(result);
    }
  });

});

router.post('/api/member/register', function(req, res) {
  // 獲取註冊表單資料
  const email = encodeURIComponent(req.body.email).replace("%40","@");
  const password = req.body.password;
  const username = req.body.username;
  
  // 先檢查 email 是否已經存在
  const checkEmailSql = `SELECT Email FROM member WHERE Email = '${email}'`;
  
  dp.query(checkEmailSql, function(err, result) {
    if (err) {
      console.log("查詢錯誤", err);
      return res.json({
        success: false,
        message: '註冊失敗，請稍後再試'
      });
    }
    
    // 如果 email 已存在
    if (result.length > 0) {
      return res.json({
        success: false,
        message: '此 Email 已被註冊'
      });
    }
    
    // 新增會員資料
    const insertSql = `
      INSERT INTO member (
      Phone, 
      Email, 
      Username, 
      Password, 
      Member_state, 
      Authority
      ) VALUES (
      '0000000000',
      '${email}',
      '${username}',
      '${password}',
      'verification',
      'user'
      )`;
    dp.query(insertSql, function(err, result) {
      if (err) {
        console.log("新增錯誤", err);
        return res.json({
          success: false,
          message: '註冊失敗，請稍後再試'
        });
      }
        
      // 註冊成功，回傳成功訊息
      return res.json({
        success: true,
        message: '註冊成功'
      });
    });
  });
});

module.exports = router;
