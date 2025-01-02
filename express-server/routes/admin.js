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

// 管理員取得所有會員資料
router.get('/api/adminGetMembers', (req, res) => {
    const query = "SELECT Member_Id, Username, Email, Member_state, Authority, Locked FROM MEMBER WHERE Authority IN ('user', 'seller')";
    dp.query(query, (err, results) => {
        if (err) {
            console.error('Failed to fetch members:', err);
            return res.status(500).send('Internal server error');
        }
        res.json(results);
    });
});

// 管理員切換使用者locked狀態
router.post("/api/locked", (req, res) => {
    const { memberId, lock } = req.body;
  
    // 驗證輸入參數
    if (!memberId || typeof lock !== "boolean") {
      return res.status(400).send("Invalid input: memberId and lock are required");
    }
  
    const query = "UPDATE MEMBER SET Locked = ? WHERE Member_Id = ?";
    dp.query(query, [lock, memberId], (err, result) => {
      if (err) {
        console.error("Failed to update Locked status:", err);
        return res.status(500).send("Internal server error");
      }
      if (result.affectedRows === 0) {
        return res.status(404).send("Member not found");
      }
      res.send({
        message: lock ? "User account locked" : "User account unlocked",
        memberId,
        newStatus: lock
      });
    });
  });

module.exports = router;