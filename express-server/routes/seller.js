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

router.post("/api/updateProduct", (req, res) => {
    const Product_name =  req.body.name ; 
    const Price =  req.body.price ; 
    const Quantity = req.body.quantity; 
    const Descrip =  req.body.description; 
    const Base64 =  req.body.base64 ; 
    // 確保必須欄位不為空
    if ( !Product_name || !Price || !Quantity || Descrip === undefined) {
      return res.status(400).json({
        success: false,
        message: "請提供完整的商品資訊",
      });
    }
  
    // 更新商品資訊的 SQL 語句
    const sql = `
            INSERT INTO product(Product_name,Quantity,Price,Descrip,Image_path) Value(
            '${Product_name}',
            '${Price}',
            '${Quantity}',
            '${Descrip}',
            '${Base64}'
            ); 
        `
        console.log(Product_name);
    ;
  
    // 執行 SQL 更新操作
    dp.query(sql,(err, result) => {
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
router.get('/api/products', function(req, res) {
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
  
  
  // 刪除商品
  router.delete("/api/products/:id", (req, res) => {
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