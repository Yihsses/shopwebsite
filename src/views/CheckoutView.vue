<template>
    <HeadMenu/>
    <div class="checkout-page">
      <h1>結帳頁面</h1>
      
      <div class="cart-items">

        <v-row>
          <v-col v-if="cartItems.length === 0" class="text-center" cols="12">
            <p>您的購物車目前是空的。</p>
          </v-col>
  
          <v-col v-for="(item, index) in cartItems" :key="index" class="d-flex align-center" cols="12">
            <v-img :src="item.Image_path" width="100px" height="100px" class="mr-3"></v-img>
            <div class="text-container" style="flex-grow: 1;">
              <p>{{ item.Product_Id }} - {{ item.price }}円 x {{ item.Quantity }}</p>
            </div>
          </v-col>
        </v-row>
      </div>
  
      <div class="checkout-form">
        <h2>送貨地址</h2>
        <v-text-field v-model="shippingAddress" label="請輸入送貨地址" required></v-text-field>
  
        <h2>支付方式</h2>
        <v-select v-model="paymentMethod" :items="paymentOptions" label="選擇支付方式" required></v-select>
        <h2>取貨方式</h2>
        <v-select 
          v-model="pickupMethod" 
          :items="pickupOptions" 
          label="選擇取貨方式" 
          required
        ></v-select>
        <div class="total-price">
          <h3>總金額: {{ totalAmount }}円</h3>
        </div>
  
        <v-btn color="purple lighten-2" @click="submitOrder" large>
          提交訂單
        </v-btn>
      </div>
    </div>
  </template>
  
  <script>
  import HeadMenu from '@/components/HeadMenu.vue'
  import axios from "axios";
  import { useCookies } from "vue3-cookies";
  const { cookies } = useCookies();
  import { jwtDecode } from "jwt-decode";
  
  export default {
    name: "CheckoutPage",
    components: {
        HeadMenu
    }, 
    data() {
      return {
        cartItems: [],
        shippingAddress: "",
        paymentMethod: "",
        paymentOptions: ["信用卡", "現金支付", "線上支付"], // 支付方式選項
        pickupMethod: "", // 新增的取貨方式
        pickupOptions: ["宅配到府", "超商取貨", "店內取貨"], // 取貨方式選項
      };
    },
    computed: {
      totalAmount() {
        return this.cartItems.reduce((total, item) => total + item.price * item.Quantity, 0);
      },
    },
    methods: {
      fetchCartItems() {
        const token = cookies.get('token');
        if (token) {
          try {
            const decodedToken = jwtDecode(token);
            const memberId = decodedToken.Member_Id;
  
            axios.get("http://localhost:3002/api/cart/GetCartItems", {
              params: { member_id: memberId },
            })
            .then((response) => {
              this.cartItems = response.data.map((item) => {
                return {
                  ...item,
                  Image_path: item.Image_path,
                };
              });
            })
            .catch((error) => {
              console.error("獲取購物車資料失敗", error);
            });
          } catch (error) {
            console.error("解碼 token 失敗", error);
          }
        }
      },
      submitOrder() {
        const orderData = {
          member_id: jwtDecode(cookies.get("token")).Member_Id,
          items: this.cartItems,
          shippingAddress: this.shippingAddress,
          paymentMethod: this.paymentMethod,
          pickupMethod: this.pickupMethod,
          totalAmount: this.totalAmount,
        };

          axios
            .post("http://localhost:3002/api/order/SubmitOrder", orderData)
            .then((response) => {
              if (response.data.success) {
                // 呼叫 API 清空購物車
                const token = cookies.get("token");
                const memberId = jwtDecode(token).Member_Id;

                axios
                  .delete(`http://localhost:3002/api/cart/ClearCart`, { params: { member_id: memberId } })
                  .then(() => {
                    alert("訂單提交成功!");
                    this.cartItems = []; // 前端清空購物車
                    this.$router.push('/'); // 跳轉到訂單成功頁面
                  })
                  .catch((error) => {
                    console.error("清空購物車失敗", error);
                    alert("清空購物車時發生問題，但訂單已提交成功");
                  });
              } else {
                alert("訂單提交失敗，請稍後再試");
              }
            })
            .catch((error) => {
              console.error("提交訂單失敗", error);
              alert("訂單提交失敗");
            });
        },
    },
    mounted() {
      this.fetchCartItems(); // 組件掛載後立刻加載購物車資料
    },
  };
  </script>
  
  <style scoped>
.checkout-page {
  padding: 20px;
  padding-top: 100px; /* 添加 padding-top，避免被頭部菜單擋住 */
}

.cart-items {
  margin-bottom: 20px;
}

.checkout-form {
  background-color: #f9f9f9;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.checkout-form h2 {
  margin-bottom: 15px;
}

.total-price {
  margin-top: 20px;
  font-size: 18px;
  font-weight: bold;
}

.v-btn {
  width: 100%;
  margin-top: 20px;
}
</style>
  