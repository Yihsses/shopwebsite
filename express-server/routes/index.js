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

  var sql = `SELECT Member_Id, Password FROM member WHERE Email = '${account}' AND Password = '${account_password}'`;
 
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
       // console.log(result[0].Member_Id) ; 
        const payload = {
          Member_Id : result[0].Member_Id , 
          LoggedIn: true,
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
router.post('/api/cart/PostProductCart', function(req, res, next) {
  console.log("成功");
  // 從請求中提取會員 ID、商品 ID 和數量
  const { product_id, member_id, quantity } = req.body.param;

  // 確保數量默認為 1，如果沒提供數量
  const productQuantity = quantity || 1;

  // 檢查該商品是否已經存在於該會員的購物車中
  const checkSql = `SELECT * FROM cart WHERE Member_Id = ? AND Product_Id = ?`;

  dp.query(checkSql, [member_id, product_id], function(err, result) {
    if (err) {
      console.error("查詢錯誤", err);
      return res.status(500).json({ success: false, message: '資料庫查詢錯誤' });
    }

    if (result.length > 0) {
      // 如果商品已經存在，更新數量
      const updateSql = `UPDATE cart SET Quantity = Quantity + ? WHERE Member_Id = ? AND Product_Id = ?`;
      dp.query(updateSql, [productQuantity, member_id, product_id], function(err, updateResult) {
        if (err) {
          console.error("更新錯誤", err);
          return res.status(500).json({ success: false, message: '更新購物車錯誤' });
        }
        return res.json({ success: true, message: '購物車更新成功' });
      });
    } else {
      // 如果商品不存在於購物車中，插入新的記錄
      const insertSql = `INSERT INTO cart (Member_Id, Product_Id, Quantity) VALUES (?, ?, ?)`;
      dp.query(insertSql, [member_id, product_id, productQuantity], function(err, insertResult) {
        if (err) {
          console.error("插入錯誤", err);
          return res.status(500).json({ success: false, message: '加入購物車錯誤' });
        }
        return res.json({ success: true, message: '商品成功加入購物車' });
      });
    }
  });
});

router.get('/api/cart/GetCartItems', function(req, res, next) {
  const memberId = req.query.member_id;
  const sql = `
      SELECT c.Product_Id, p.price,c.Quantity,p.Image_path
      FROM cart c
      JOIN product p ON c.Product_Id = p.Product_Id
      where c.Member_Id = ? ; 
  `;
  dp.query(sql, [memberId], function(err, result) {
    if (err) {
      console.error("查詢錯誤", err);
      return res.status(500).json({ success: false, message: "伺服器錯誤" });
    }
    return res.json(result);
  });
});

module.exports = router;
