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

  var sql = `SELECT Member_Id,Locked,Authority, Password FROM member WHERE Email = '${account}' AND Password = '${account_password}'`;
 
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
        if(result[0].Locked == "1"){
          return res.json({
            success: false,
            message: '帳號被鎖定'
        });
        }
        // console.log(result[0].Authority) ; 
        const payload = {
          Member_Id : result[0].Member_Id , 
          LoggedIn: true,
          Authority : result[0].Authority
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

router.post('/api/member/register', function(req, res) {
  // 獲取註冊表單資料
  const email = encodeURIComponent(req.body.email).replace("%40","@");
  const password = req.body.password;
  const username = req.body.username;
  const phone = req.body.phone ; 
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
      '${phone}',
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

router.delete('/api/cart/RemoveCartItem', function(req, res, next) {
  const { member_id, product_id } = req.body;

  if (!member_id || !product_id) {
    return res.status(400).json({ success: false, message: '缺少必要參數' });
  }

  const sql = `DELETE FROM cart WHERE Member_Id = ? AND Product_Id = ?`;

  dp.query(sql, [member_id, product_id], function(err, result) {
    if (err) {
      console.error("刪除錯誤", err);
      return res.status(500).json({ success: false, message: '移除商品失敗' });
    }

    if (result.affectedRows > 0) {
      return res.json({ success: true, message: '商品已成功移除' });
    } else {
      return res.json({ success: false, message: '購物車中未找到該商品' });
    }
  });
});

router.delete('/api/cart/ClearCart', function(req, res, next) {
  const memberId = req.query.member_id;

  const sql = `DELETE FROM cart WHERE Member_Id = ?`;

  dp.query(sql, [memberId], function(err, result) {
    if (err) {
      console.error("刪除錯誤", err);
      return res.status(500).json({ success: false, message: '移除商品失敗' });
    }

    if (result.affectedRows > 0) {
      return res.json({ success: true, message: '商品已成功移除' });
    } else {
      return res.json({ success: false, message: '購物車中未找到該商品' });
    }
  });
});

router.post('/api/order/SubmitOrder', function (req, res, next) {


  const { member_id, items, shippingAddress, paymentMethod,pickupMethod,totalAmount } = req.body;


  // 驗證請求參數
  if (!member_id || !items || !shippingAddress || !paymentMethod || !totalAmount || !pickupMethod) {
    return res.status(400).json({ success: false, message: '缺少必要參數' });
  }

  // 準備 SQL 插入語句
  const insertOrderSql = `
    INSERT INTO \`_order\` (Member_Id, Address, Payment_method,Takeing_method,Fee, Order_date,Status)
    VALUES (?, ?, ?, ?, ? , NOW(),'BackOrder');
  `;

  // 插入訂單主記錄
  dp.query(
    insertOrderSql,
    [member_id, shippingAddress, paymentMethod, pickupMethod ,totalAmount],
    function (err, orderResult) {
      if (err) {
        console.error('插入訂單主記錄失敗:', err);
        return res.status(500).json({ success: false, message: '提交訂單失敗' });
      }

      const orderId = orderResult.insertId; // 取得新插入訂單的 ID
      console.log(orderId)
      // 構建訂單詳細資料的插入語句
      const insertOrderDetailsSql = `
        INSERT INTO order_details (Order_Id, Product_Id, Quantity, Price)
        VALUES ?;
      `;

      // 構建批量插入的資料
      const orderDetailsData = items.map((item) => [
        orderId,
        item.Product_Id,
        item.Quantity,
        item.price,
      ]);

      // 插入訂單詳細資料
      dp.query(insertOrderDetailsSql, [orderDetailsData], function (err) {
        if (err) {
          console.error('插入訂單詳細資料失敗:', err);
          return res.status(500).json({ success: false, message: '提交訂單詳細資料失敗' });
        }
      
        // 使用一個函數來逐一執行每條更新語句
        const updateStockSequentially = async () => {
          for (const item of items) {
            const updateStockSql = `UPDATE product SET Quantity = Quantity - ? WHERE product_id = ?;`;
      
            // 使用參數化查詢防止 SQL 注入
            const params = [item.Quantity, item.Product_Id];
            
            try {
              await new Promise((resolve, reject) => {
                dp.query(updateStockSql, params, (err) => {
                  if (err) return reject(err);
                  resolve();
                });
              });
            } catch (error) {
              console.error('更新庫存失敗:', error);
              return res.status(500).json({ success: false, message: '更新庫存失敗' });
            }
          }
      
          // 如果所有更新都成功，返回成功響應
        };
      
        // 執行逐一更新庫存的函數
        try {
          updateStockSequentially();
          return res.json({ success: true, message: '訂單提交成功', orderId });
        }catch{
          return res.json({ success: true, message: '訂單提交失敗', orderId });

        }
      });
    }
  );
});

router.get('/api/order/GetOrders', function(req, res, next) {
  let member_id = req.query.member_id;

  // 查詢訂單基本資料
  var sql = `
    SELECT O.Order_Id, O.Fee, O.Order_date,O.Status
    FROM _order O
    WHERE O.Member_Id = '${member_id}';
  `;

  dp.query(sql, function(err, result) {
    if (err) {
      console.log("查詢錯誤", err);
      res.status(500).send({ success: false, message: "查詢訂單失敗" });
      return;
    } else {
      // 組合訂單和商品資料
      const orders = [];
      result.forEach(order => {
        // 查詢每個訂單的商品詳情
        var itemSql = `
          SELECT P.Image_path, P.Product_name, OD.Quantity, OD.Price
          FROM order_details OD
          JOIN product P ON P.product_id = OD.Product_Id
          WHERE OD.Order_Id = '${order.Order_Id}';
        `;
        
        dp.query(itemSql, function(err, itemResult) {
          if (err) {
            console.log("查詢商品詳情錯誤", err);
          } else {
            // 組合商品資料到訂單的 items 陣列
            order.items = itemResult;
            //console.log(order)

            // 將組合好的訂單推入 orders 陣列
            orders.push(order);

            // 當所有訂單資料和商品資料都查詢完成後回傳結果
            if (orders.length === result.length) {
              console.log(orders)
              res.send({ success: true, data: orders });
            }
          }
        });
      });
    }
  });
});


module.exports = router;
