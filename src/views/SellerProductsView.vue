<template>
<div class="product-table">
    <h2>商品列表</h2>
    <table border="1">
      <thead>
        <tr>
          <th>商品編號</th>
          <th>商品名稱</th>
          <th>庫存數量</th>
          <th>價格</th>
          <th>商品圖片</th> <!-- 新增圖片列 -->
          <th>操作</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="product in sellerProducts" :key="product.Product_Id">
          <td>{{ product.Product_Id }}</td>
          <td>{{ product.Product_name }}</td>
          <td>{{ product.Quantity }}</td>
          <td>{{ product.Price }}</td>
          <!-- 顯示圖片 -->
          <td>
            <img v-if="product.Image_path" :src= product.Image_path alt="Product Image" width="100" height="100">
          </td>
          <td>
            <button class="edit-button" @click="editProduct(product.Product_Id)">編輯</button>
            <button class="delete-button" @click="confirmDeleteProduct(product.Product_Id)">刪除</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>

</template>

<script>
import axios from "axios";
import { useCookies } from "vue3-cookies";
const { cookies } = useCookies();
import { jwtDecode } from "jwt-decode";

export default {
data() {
  return {
    sellerProducts: [], // 賣家商品列表
    sellerId: jwtDecode(cookies.get('token')).Member_Id, // 假設賣家 ID
  };
},
mounted() {
  this.fetchSellerProducts(); // 請求商品資料
},
methods: {
  goToSearchOrdersPage() {
    this.$router.push("/store/orders");  // 跳轉到訂單頁面
  },
  goToMainPage() {
    this.$router.push("/"); // 跳回主頁
  },
  // 跳轉到新增商品頁面
  goToAddProductPage() {
    this.$router.push("/addProduct");
  },
  async fetchSellerProducts() {
    try {

      const response = await axios.get("http://localhost:3002/seller/api/products", {
        params: { sellerId: this.sellerId },
      });

      if (response.data.success) {
        this.sellerProducts = response.data.data; // 將商品列表存入資料中
        console.log("成功獲取商品列表:", this.sellerProducts);
      } else {
        console.error("無法獲取商品列表:", response.data.message);
      }
    } catch (error) {
      console.error("API 呼叫失敗:", error);
      alert("無法連接到伺服器，請稍後再試。");
    }
  },
  editProduct(productId) {
    this.$router.push("/editProduct/" + productId);
  },
  // 刪除商品
  confirmDeleteProduct(productId) {
    const isConfirmed = window.confirm(`確定要刪除商品 ID: ${productId} 嗎？`);
    if (isConfirmed) {
      this.deleteProduct(productId);
    }
  },
  async deleteProduct(productId) {
    try {
      const response = await axios.delete(`http://localhost:3002/seller/api/products/${productId}`);
      if (response.data.success) {
        alert(`商品 ID: ${productId} 已成功刪除！`);
        this.fetchSellerProducts();
      } else {
        console.error("刪除商品失敗:", response.data.message);
        alert("刪除失敗：" + response.data.message);
      }
    } catch (error) {
      console.error("刪除商品 API 呼叫失敗:", error);
      alert("刪除失敗，請稍後再試。");
    }
  },
  // 登出功能
  logout() {
    cookies.remove('token'); // 清除 token
    this.$router.push("/login"); // 轉到登入頁面
  }
},
};
</script>

<style>
.seller-dashboard {
padding: 20px;
font-family: Arial, sans-serif;
background-color: #f9f9f9;
position: relative;
}

.back-button {
position: absolute;
top: 16px;
left: 20px;
padding: 10px 20px;
background-color: #007bff;
color: white;
border: none;
border-radius: 4px;
cursor: pointer;
}

.back-button:hover {
background-color: #0056b3;
}

.logout-button {
position: absolute;
top: 16px;
right: 20px;
padding: 10px 20px;
background-color: #dc3545;
color: white;
border: none;
border-radius: 4px;
cursor: pointer;
}

.logout-button:hover {
background-color: #c82333;
}

h1 {
color: #333;
text-align: center;
margin-bottom: 20px;
}

.product-table {
margin: 0 auto;
max-width: 90%;
background: #ffffff;
border-radius: 8px;
box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
overflow: hidden;
}

.product-table h2 {
text-align: center;
color: #555;
padding: 10px;
background: #f1f1f1;
margin: 0;
border-bottom: 2px solid #ddd;
}

.product-table table {
width: 100%;
border-collapse: collapse;
}

.product-table th,
.product-table td {
padding: 12px;
text-align: center;
border-bottom: 1px solid #eee;
}

.product-table th {
background-color: #f7f7f7;
color: #333;
font-weight: bold;
}

.product-table tr:hover {
background-color: #f5f5f5;
}

.add-product-button {
margin: 20px 0;
text-align: center;
justify-content: center; /* 居中排列按鈕 */
display: flex; /* 使用 Flexbox 使按鈕並排 */
gap: 10px; /* 設定按鈕之間的間隔 */
}

.add-product-button button {
padding: 10px 20px;
background-color: #28a745;
color: white;
border: none;
border-radius: 4px;
cursor: pointer;
font-size: 16px;
}

.add-product-button button:hover {
background-color: #218838;
}

.edit-button,
.delete-button {
padding: 6px 12px;
border: none;
border-radius: 4px;
cursor: pointer;
color: #fff;
font-size: 14px;
}

.edit-button {
background-color: #4caf50;
margin-right: 5px;
}

.delete-button {
background-color: #f44336;
}

.edit-button:hover {
background-color: #45a049;
}

.delete-button:hover {
background-color: #e53935;
}

/* 圖片顯示樣式 */
.product-table td img {
max-width: 100px;  /* 調整圖片寬度 */
max-height: 100px; /* 調整圖片高度 */
object-fit: cover;  /* 保持圖片比例 */
display: block;     /* 讓圖片成為區塊級元素 */
margin: 0 auto;     /* 使圖片居中顯示 */
padding-left: 10px;  /* 可選：增加左邊間距 */
}
</style>
