<template>
    <div class="seller-dashboard">
      <button class="back-button" @click="goToMainPage">回到主介面</button>
      <h1>賣家管理介面</h1>
  
      <!-- 新增商品按鈕 -->
      <div class="add-product-button">
        <button @click="goToAddProductPage">新增商品</button>
      </div>
  
      <!-- 商品表格區域 -->
      <div class="product-table">
        <h2>商品列表</h2>
        <table border="1">
          <thead>
            <tr>
              <th>商品編號</th>
              <th>商品名稱</th>
              <th>庫存數量</th>
              <th>價格</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="product in sellerProducts" :key="product.Product_Id">
              <td>{{ product.Product_Id }}</td>
              <td>{{ product.Product_name }}</td>
              <td>{{ product.Quantity }}</td>
              <td>{{ product.Price }}</td>
              <td>
                <button class="edit-button" @click="editProduct(product.Product_Id)">編輯</button>
                <button class="delete-button" @click="confirmDeleteProduct(product.Product_Id)">刪除</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </template>
  
  <script>
  import axios from "axios";
  
  export default {
    data() {
      return {
        sellerProducts: [], // 賣家商品列表
        sellerId: 2, // 假設賣家 ID
      };
    },
    mounted() {
      this.fetchSellerProducts(); // 請求商品資料
    },
    methods: {
      goToMainPage() {
        this.$router.push("/");
      },
      // 跳轉到新增商品頁面
      goToAddProductPage() {
        this.$router.push("/addProduct");
      },
      async fetchSellerProducts() {
        try {
          const response = await axios.get("http://localhost:3002/api/seller/products", {
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
          const response = await axios.delete(`http://localhost:3002/api/seller/products/${productId}`);
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
  </style>
  