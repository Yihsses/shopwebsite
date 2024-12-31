<template>
  <HeadMenu/>
  <div class="member-page">
    <div class="content">
      <h1>Welcome to the Member Page</h1>
      <p>Manage your account and enjoy our services!</p>

      <!-- 訂單列表 -->
      <div class="order-section">
        <h2>Your Orders</h2>
        <ul class="order-list" v-if="orders.length > 0">
          <li v-for="(order, index) in orders" :key="index" class="order-item">
            <p>Order ID: {{ order.Order_Id }}</p>
            <p>Total: {{ order.Fee }}円</p>
            <p>Date: {{ order.Order_date }}</p>
            <p>Status: {{ order.Status }}</p>
            <p>Items:</p>
            <ul>
              <li v-for="(item, i) in order.items" :key="i">
               {{item.Product_name}} x {{ item.Quantity }} - {{ item.Price}}円
               
                <!-- {{ item.Product_name }} x {{ item.Quantity }} - {{ item.price }}円 -->
              </li>
            </ul>
          </li>
        </ul>
        <p v-else>No orders found.</p>
      </div>

      <!-- 登出按鈕 -->
      <button class="sign_out" type="button" @click="signout">Sign Out</button>
    </div>
  </div>
</template>

<script>
import { useCookies } from "vue3-cookies";
const { cookies } = useCookies();

import axios from "axios";
import HeadMenu from '@/components/HeadMenu.vue';

export default {
  name: 'MemberView',
  components: {
    HeadMenu
  },
  data() {
    return {
      orders: [], // 儲存用戶的訂單資料
      detail_orders:[]
    };
  },
  methods: {
    fetchOrders() {
      const token = cookies.get('token');
      if (token) {
        const memberId = this.decodeToken(token).Member_Id;
        axios.get('http://localhost:3002/api/order/GetOrders', {
          params: { member_id: memberId }
        })
        .then(response => {
          console.log(response.data.data)
          this.orders = response.data.data || [];

        })
        .catch(error => {
          console.error('Failed to fetch orders:', error);
        });
      }
    },
    decodeToken(token) {
      try {
        return JSON.parse(atob(token.split('.')[1])); // 簡單解析 JWT
      } catch (error) {
        console.error('Failed to decode token:', error);
        return {};
      }
    },
    signout() {
      try {
        cookies.remove('token');
        alert("You have been logged out successfully.");
        this.$router.push('/');
      } catch (error) {
        alert("Logout failed, please try again.");
      }
    }
  },
  mounted() {
    this.fetchOrders(); // 頁面載入時獲取訂單資料
  }
};
</script>

<style scoped>
.member-page {
  background-color: #f9f9f9;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
}

.content {
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  padding: 30px;
  max-width: 600px;
  width: 100%;
  text-align: center;
  height: auto;  /* 保證內容區域會隨內容增長 */
  min-height: 400px;  /* 設置最小高度，避免頁面內容被壓縮 */
}

h1 {
  font-size: 28px;
  color: #333;
  margin-bottom: 20px;
  font-weight: 600;
}

p {
  font-size: 16px;
  color: #555;
  margin-bottom: 30px;
}

.order-section {
  text-align: left;
  margin-top: 20px;
}

.order-section h2 {
  font-size: 22px;
  color: #333;
  margin-bottom: 10px;
}

.order-list {
  list-style: none;
  padding: 0;
  max-height: 500px; /* 設置最大高度 */
  overflow-y: auto;  /* 當內容超出時顯示垂直滾動條 */
}

.order-item {
  background-color: #f4f4f4;
  margin-bottom: 15px;
  padding: 10px;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.order-item p {
  margin: 5px 0;
  color: #555;
}

.sign_out {
  background-color: #9954f3;
  color: white;
  font-size: 18px;
  font-weight: 600;
  padding: 12px 30px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  margin-top: 20px;
}

.sign_out:hover {
  background-color: #7f33c8;
}
</style>
