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
            <td>{{ order.id }}</td>
            <td>{{ order.customerName }}</td>
            <td>{{ order.productName }}</td>
            <td>{{ order.quantity }}</td>
            <td>{{ order.status }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
    data() {
      return {
        orders: []  // 用來存放訂單資料
      };
    },
    mounted() {
      this.fetchOrders();  // 請求訂單資料
    },
    methods: {
      async fetchOrders() {
        try {
          const response = await axios.get('http://localhost:3002/seller/api/orders'); // 假設有這個 API 來獲取訂單資料
          if (response.data.success) {
            this.orders = response.data.data;  // 設置訂單資料
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
  /* 可以在這裡添加訂單列表的樣式 */
  </style>