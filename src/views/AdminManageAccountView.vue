<template>
    <div class="user-table">
      <h2>用戶列表</h2>
      <table border="1">
        <thead>
          <tr>
            <th>用戶編號</th>
            <th>用戶名稱</th>
            <th>Email</th>
            <th>狀態</th>
            <th>用戶身分</th>
            <th>鎖定狀態</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in users" :key="user.Member_Id">
            <td>{{ user.Member_Id }}</td>
            <td>{{ user.Username }}</td>
            <td>{{ user.Email }}</td>
            <td>{{ user.Member_state }}</td>
            <td>{{ user.Authority }}</td>
            <td>
              <input 
                type="checkbox" 
                :checked="user.Locked" 
                @change="toggleLock(user)"
              />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </template>
  
  <script>
  import axios from "axios";
  
  export default {
    data() {
      return {
        users: [], // 用於存儲用戶資料
      };
    },
    methods: {
      async fetchUsers() {
        try {
          const response = await axios.get("http://localhost:3002/admin/api/adminGetMembers"); // 獲取user和seller數據
          this.users = response.data;
        } catch (error) {
          console.error("Failed to fetch users:", error);
        }
      },
      async toggleLock(user) {
        const updatedLockStatus = !user.Locked; // 反轉鎖定狀態
        try {
          await axios.post("http://localhost:3002/admin/api/locked", {
            memberId: user.Member_Id,
            lock: updatedLockStatus,
          });
          user.Locked = updatedLockStatus; // 更新前端顯示
        } catch (error) {
          console.error("Failed to update lock status:", error);
          alert("無法更改鎖定狀態！");
        }
      },
    },
    mounted() {
      this.fetchUsers(); // 初次加載時獲取用戶資料
    },
  };
  </script>
  
  <style>
  .user-table {
    margin: 0 auto;
    max-width: 90%;
    background: #ffffff;
    border-radius: 8px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    overflow: hidden;
  }
  
  .user-table h2 {
    text-align: center;
    color: #555;
    padding: 10px;
    background: #f1f1f1;
    margin: 0;
    border-bottom: 2px solid #ddd;
  }
  
  .user-table table {
    width: 100%;
    border-collapse: collapse;
  }
  
  .user-table th,
  .user-table td {
    padding: 12px;
    text-align: center;
    border-bottom: 1px solid #eee;
  }
  
  .user-table th {
    background-color: #f7f7f7;
    color: #333;
    font-weight: bold;
  }
  
  .user-table tr:hover {
    background-color: #f5f5f5;
  }
  
  .edit-button {
    padding: 6px 12px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    color: #fff;
    font-size: 14px;
    background-color: #4caf50;
  }
  
  .edit-button:hover {
    background-color: #45a049;
  }
  
  input[type="checkbox"] {
    transform: scale(1.2); /* 增大開關大小 */
    cursor: pointer;
  }
  </style>
  