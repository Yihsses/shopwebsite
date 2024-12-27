<template>
    <div class="product-container">
      <h1>賣家商品資訊</h1>
      <div v-if="product" class="product-card">
        <!-- 左側圖片區域 -->
        <div class="product-image">
          <img
            v-if="product.Image_path"
            :src="getImagePath(product.Image_path)"
            alt="商品圖片"
          />
        </div>
        <!-- 右側表單區域 -->
        <div class="product-info">
          <form @submit.prevent="updateProduct">
            <p>
              <strong>商品名稱：</strong>
              <input v-model="editableProduct.Product_name" type="text" />
            </p>
            <p>
              <strong>價格：</strong>
              <input v-model="editableProduct.Price" type="number" min="0" />
            </p>
            <p>
              <strong>庫存數量：</strong>
              <input v-model="editableProduct.Quantity" type="number" min="0" />
            </p>
            <p>
              <strong>描述：</strong>
              <textarea v-model="editableProduct.Descrip"></textarea>
            </p>
            <button type="submit" class="confirm-button">確認修改</button>
          </form>
        </div>
      </div>
      <div v-else class="no-data">
        <p>目前沒有可顯示的商品資訊。</p>
      </div>
    </div>
  </template>
  
  <script>
import axios from "axios";

export default {
  data() {
    return {
      product: null, // 用於存儲原始商品資料
      editableProduct: {}, // 用於編輯的商品資料
      sellerId: 2, // 賣家 ID，根據需求替換為實際值
    };
  },
  mounted() {
    this.fetchSellerProducts(); // 請求商品資料
  },
  methods: {
    async fetchSellerProducts() {
      try {
        const response = await axios.get("http://localhost:3002/api/seller/products", {
          params: { sellerId: this.sellerId },
        });

        if (response.data.success && response.data.data.length > 0) {
          this.product = response.data.data[0]; // 將第一個商品存入資料中
          this.editableProduct = { ...this.product }; // 克隆商品資料，用於編輯
          console.log("成功獲取商品資訊:", this.product);
        } else {
          console.error("無法獲取商品資訊:", response.data.message);
        }
      } catch (error) {
        console.error("API 呼叫失敗:", error);
        alert("無法連接到伺服器，請稍後再試。");
      }
    },
    async updateProduct() {
      try {
        const response = await axios.post("http://localhost:3002/api/seller/updateProduct", this.editableProduct);

        if (response.data.success) {
          alert("商品資訊已成功更新！");
          this.product = { ...this.editableProduct }; // 更新顯示的商品資料
          this.$router.push(`/store`); // 返回商品列表頁面
        } else {
          console.error("更新商品失敗:", response.data.message);
        }
      } catch (error) {
        console.error("更新商品 API 呼叫失敗:", error);
        alert("更新失敗，請稍後再試。");
      }
    },
    getImagePath(relativePath) {
      // 假設 `Image_path` 是 "/assets/*.png"，將其轉為相對於 `src` 的路徑
      return require(`@/assets/${relativePath.split('/assets/')[1]}`);
    },
  },
};
</script>

  
<style scoped>
/* 整體容器 */
.product-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  font-family: Arial, sans-serif;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

/* 標題樣式 */
h1 {
  text-align: center;
  color: #333;
  margin-bottom: 30px;
  font-size: 24px;
}

/* 商品卡片 - Flexbox 佈局 */
.product-card {
  display: flex;
  align-items: flex-start; /* 垂直對齊到頂部 */
  gap: 20px; /* 左右區域間距 */
  background-color: #ffffff;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

/* 商品圖片區域 */
.product-image {
  flex: 1; /* 左側圖片區域占 1 比例 */
  width: 700px; /* 固定圖片區域寬度 */
  height: 300px; /* 固定圖片區域高度 */
  display: flex;
  align-items: center; /* 垂直居中 */
  justify-content: center; /* 水平居中 */
  border-radius: 8px;
  border: 1px solid #ddd;
  background-color: #f4f4f4; /* 添加背景顏色，填充圖片外的空白 */
}

.product-image img {
  max-width: 100%; /* 限制圖片最大寬度 */
  max-height: 100%; /* 限制圖片最大高度 */
  object-fit: contain; /* 保持圖片比例且不裁剪，完整顯示在區域內 */
  display: block;
}

/* 商品表單區域 */
.product-info {
  flex: 1; /* 右側表單區域占 1 比例 */
}

.product-info p {
  margin: 10px 0;
  font-size: 16px;
  color: #555;
}

.product-info strong {
  color: #333;
}

/* 表單輸入框樣式 */
input,
textarea {
  width: 90%; /* 縮小表單寬度 */
  margin-top: 5px;
  padding: 8px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 5px;
  box-sizing: border-box;
}

textarea {
  resize: none;
  height: 80px;
}

/* 確認按鈕樣式 */
.confirm-button {
  background-color: #4caf50;
  color: white;
  border: none;
  padding: 10px 20px;
  margin-top: 15px;
  font-size: 16px;
  border-radius: 5px;
  cursor: pointer;
}

.confirm-button:hover {
  background-color: #45a049;
}

/* 沒有數據提示 */
.no-data {
  text-align: center;
  font-size: 18px;
  color: #888;
  margin-top: 50px;
}
</style>
  