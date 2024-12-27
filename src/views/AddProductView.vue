<template>
  <div class="add-product-view">
    <button class="back-button" @click="goBack">回到賣家管理介面</button>
    <h1>新增商品</h1>

    <form @submit.prevent="addProduct">
      <div class="form-group">
        <label for="product-name">商品名稱</label>
        <input id="product-name" v-model="newProduct.name" type="text" required />
      </div>

      <div class="form-group">
        <label for="quantity">庫存數量</label>
        <input id="quantity" v-model.number="newProduct.quantity" type="number" required />
      </div>

      <div class="form-group">
        <label for="price">價格</label>
        <input id="price" v-model.number="newProduct.price" type="number" required />
      </div>

      <div class="form-group">
        <label for="description">商品描述</label>
        <textarea id="description" v-model="newProduct.description" required></textarea>
      </div>

      <div class="form-group">
        <label for="image">商品圖片</label>
        <input id="image" type="file" @change="handleImageUpload" required />
      </div>

      <!-- 圖片預覽 -->
      <div v-if="base64Image" class="image-preview">
        <h4>圖片預覽：</h4>
        <img :src="base64Image" alt="Image Preview" />
      </div>

      <button type="submit" class="submit-button">新增商品</button>
    </form>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      newProduct: {
        name: "",
        quantity: 0,
        price: 0,
        description: "",
        image: null,
      },
      base64Image: null, // 用於存儲 Base64 格式的圖片
    };
  },
  methods: {
    goBack() {
      this.$router.push("/store");
    },
    handleImageUpload(event) {
      const file = event.target.files[0];
      if (!file) return;

      this.newProduct.image = file;

      const reader = new FileReader();
      reader.readAsDataURL(file);

      reader.onload = (e) => {
        this.base64Image = e.target.result; // 將 Base64 字符串儲存在 data 中
        console.log("Base64 Image:", this.base64Image); // 在控制台中檢查
      };

      reader.onerror = (error) => {
        console.error("Error reading file:", error);
      };
    },
    async addProduct() {
      try {
        
        const response = await axios.post("http://localhost:3002/seller/api/updateProduct", {
          name:  this.newProduct.name,
          price: this.newProduct.price,
          quantity: this.newProduct.quantity,
          description : this.newProduct.description, 
          base64 :this.base64Image 
        });

        if (response.data.success) {
          alert("商品新增成功！");
          this.$router.push("/store");
        } else {
          alert("新增失敗: " + response.data.message);
        }
      } catch (error) {
        console.error("新增商品失敗:", error);
        alert("新增商品失敗，請稍後再試。");
      }
    },
  },
};
</script>

<style scoped>
.add-product-view {
  padding: 20px;
  font-family: Arial, sans-serif;
  background-color: #f9f9f9;
  max-width: 600px;
  margin: 0 auto;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.back-button {
  margin-bottom: 20px;
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

form {
  display: flex;
  flex-direction: column;
}

.form-group {
  margin-bottom: 15px;
}

.form-group label {
  display: block;
  font-weight: bold;
  margin-bottom: 5px;
}

.form-group input,
.form-group textarea {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

textarea {
  resize: vertical;
}

.submit-button {
  padding: 10px;
  background-color: #28a745;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
}

.submit-button:hover {
  background-color: #218838;
}

.image-preview {
  margin-top: 15px;
  text-align: center;
}

.image-preview img {
  max-width: 100%;
  max-height: 200px;
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 5px;
  background: #fff;
}
</style>