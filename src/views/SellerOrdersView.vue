<template>
    <div class="seller-orders">
      <h2>訂單列表</h2>
      <table>
        <thead>
          <tr>
            <th>訂單編號</th>
            <th>顧客名稱</th>
            <th>商品名稱</th>
            <th>數量</th>
            <th>狀態</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="order in orders" :key="order.id">
            <td>{{ order.Order_Id }}</td>
            <td>{{ order.username }}</td>
            <td>{{ order.Product_name}}</td>
            <td>{{ order.quantity }}</td>
            <td>{{ order.status }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  import { useCookies } from "vue3-cookies";
    const { cookies } = useCookies();
    import { jwtDecode } from "jwt-decode";

  export default {
    data() {
      return {
        orders: [] , // 用來存放訂單資料
        memberid: jwtDecode(cookies.get('token')).Member_Id ,
      };
    },
    mounted() {
      this.fetchOrders();  // 請求訂單資料
    },
    methods: {
      async fetchOrders() {
        try {
    
          const response = await axios.get('http://localhost:3002/seller/api/orders/GetALLOrders',{
            params: { memberid:  this.memberid  },
          });

          if (response.data.success) {
            this.orders = response.data.data; 
            console.log(this.orders) ; 
          } else {
            console.error("無法獲取訂單資料:", response.data.message);
          }
        } catch (error) {
          console.error("API 呼叫失敗:", error);
          alert("無法連接到伺服器，請稍後再試。");
        }
      }
    }
  };
  </script>
  
  <style scoped>
  /* 訂單列表容器 */
  .seller-orders {
    
    margin: 20px auto;
    max-width: 90%;
    padding: 20px;
    background-color: #f9f9f9;
    border-radius: 8px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  }
  
  /* 標題樣式 */
  .seller-orders h2 {
    font-size: 24px;
    text-align: center;
    color: #333;
    margin-bottom: 20px;
  }
  
  /* 表格樣式 */
  table {
    width: 100%;
    border-collapse: collapse;
    background-color: #fff;
    border-radius: 8px;
    overflow: hidden;
  }
  
  th, td {
    padding: 12px;
    text-align: left;
    font-size: 16px;
  }
  
  th {
    background-color: #888; /* 改為灰色背景 */
    color: #fff;
  }
  
  td {
    border-bottom: 1px solid #ddd;
  }
  
  tr:hover {
    background-color: #f5f5f5;
  }
  
  td, th {
    font-family: 'Arial', sans-serif;
  }
  
  /* 表格列高亮 */
  tr:nth-child(even) {
    background-color: #f9f9f9;
  }
  
  /* 總體頁面背景 */
  body {
    background-color: #fafafa;
    font-family: 'Arial', sans-serif;
  }
  
  /* 訂單狀態顯示 */
  td:nth-child(5) {
    font-weight: bold;
    color: #FFFF ; /* 改為灰色 */
  }
  

  
  </style>