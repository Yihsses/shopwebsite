var express = require('express');
var router = express.Router();

var mysql = require('mysql');
var dp = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '0802',
    database:'vspo_dp',
    port: 3306
});

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
})



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

  var sql = `SELECT Username, Password, Authority FROM member WHERE Email = '${account}' AND Password = '${account_password}'`;
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
          LoggedIn: true,
          authority: result[0].Authority,
          userId: result[0].Member_Id, // 新增 userId 到 JWT payload
      }
      const token = jwt.sign(payload, secretKey, { expiresIn: '600s' });
      //  res.cookie('LoggedIn', true, {maxAge:600000}); 
      return res.json({
        success: true,  // 標示操作是否成功
        message: '登入成功',
        authority: result[0].Authority,
        userId: result[0].Member_Id, // 新增 userId 到回應中
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

// 註冊
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

// 賣家管理
// 獲取賣家商品列表
router.get('/api/seller/products', function(req, res) {
  const sellerId = req.query.sellerId;
  const sql = `SELECT Product_Id, Product_name, Quantity, Price, Descrip, Image_path, Seller_id FROM product WHERE Seller_id = ?`;
  
  dp.query(sql, [sellerId], function(err, result) {
    if (err) {
      console.log("查詢錯誤:", err);
      return res.json({
        success: false,
        message: '獲取商品列表失敗'
      });
    }
    res.json({
      success: true,
      data: result
    });
  });
});

// 編輯商品
router.post("/api/seller/updateProduct", (req, res) => {
  const { Product_Id, Product_name, Price, Quantity, Descrip } = req.body;
  // 確保必須欄位不為空
  if (!Product_Id || !Product_name || !Price || !Quantity || Descrip === undefined) {
    return res.status(400).json({
      success: false,
      message: "請提供完整的商品資訊",
    });
  }

  // 更新商品資訊的 SQL 語句
  const sql = `
    UPDATE product
    SET Product_name = ?, Price = ?, Quantity = ?, Descrip = ?
    WHERE Product_Id = ?
  `;

  // 執行 SQL 更新操作
  dp.query(
    sql,
    [Product_name, Price, Quantity, Descrip, Product_Id],
    (err, result) => {
      if (err) {
        console.error("更新商品失敗:", err);
        return res.status(500).json({
          success: false,
          message: "更新商品資訊失敗，請稍後再試",
        });
      }

      // 檢查是否有更新的行數
      if (result.affectedRows === 0) {
        return res.status(404).json({
          success: false,
          message: "未找到指定的商品，無法更新",
        });
      }

      // 更新成功
      res.json({
        success: true,
        message: "商品資訊更新成功",
      });
    }
  );
});

// 刪除商品
router.delete("/api/seller/products/:id", (req, res) => {
  const productId = req.params.id;

  const sql = "DELETE FROM product WHERE Product_Id = ?";
  dp.query(sql, [productId], (err, result) => {
    if (err) {
      console.error("刪除商品失敗:", err);
      return res.status(500).json({
        success: false,
        message: "刪除商品失敗，請稍後再試。",
      });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "未找到指定的商品，無法刪除。",
      });
    }

    res.json({
      success: true,
      message: "商品已成功刪除！",
    });
  });
});

module.exports = router;
