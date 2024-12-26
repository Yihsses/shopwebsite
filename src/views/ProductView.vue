<template>
  <HeadMenu/>

  <v-container class="product_container">
    <v-row justify="space-around">
      <!-- 左侧部分 -->
      <v-col cols="6" class="left-panel">
        <v-img :src="test_path" class="productimage">
        </v-img>
      </v-col>

      <!-- 右侧部分 -->
      <v-col cols="6" class="right-panel">
        <v-sheet class="pa-2 ma-2">
          <h1>{{ title }}</h1>
          <div v-html="Descrip"></div>

          <!-- 數量選擇 -->
          <v-select
            v-model="quantity"
            :items="quantityOptions"
            label="選擇數量"
            outlined
            class="quantity-select"
          ></v-select>

          <button @click="HandleBuy" class="BuyButton">購買</button>
        </v-sheet>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import HeadMenu from "@/components/HeadMenu.vue";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useCookies } from "vue3-cookies";
const { cookies } = useCookies();

export default {
  name: "LeftRightLayout",
  components: {
    HeadMenu
  },
  data() {
    return {
      test_path: null,
      Descrip: null,
      title: null,
      quantity: 1,  // 初始購買數量設為 1
      quantityOptions: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],  // 可選擇的數量範圍
      product_info: axios
        .get("http://localhost:3002/api/product/GetProductInfo", {
          params: {
            id: this.$route.params.id
          }
        })
        .then(response => {
          this.title = response.data[0].Product_name;
          this.product_info = response.data;
          this.Descrip = response.data[0].Descrip.replace(/\n/g, "<br>");
          console.log(response.data[0].Image_path);
          this.test_path = require(`@/assets/images/${response.data[0].Image_path}`);
          console.log(this.Descrip);
          console.log(this.product_info.data[0].Image_path);
        })
        .catch(error => {
          console.error(error);
        })
    };
  },
  methods: {
    async HandleBuy() {
      console.log(jwtDecode(cookies.get('token')).Member_Id) ; 
      try {
        const response = await axios.post("http://localhost:3002/api/cart/PostProductCart", {
          param: {
            product_id: this.$route.params.id,  // 取得商品 ID
            member_id: jwtDecode(cookies.get('token')).Member_Id,  // 取得會員 ID
            quantity: this.quantity  // 發送選擇的數量
          }
        });

        // 顯示成功加入購物車的訊息
        if (response.data.success) {
          alert("商品已成功加入購物車!");
        } else {
          alert("加入購物車失敗，請稍後再試");
        }
      } catch (error) {
        console.error("加入購物車時發生錯誤:", error);
        alert("加入購物車失敗，請稍後再試");
      }
    }
  }
};
</script>

<style scoped>
.BuyButton {
  margin-top: 40px;
  width: 80%;
  max-width: 400px;
  font-weight: 900;
  font-size: 20px;
  background-color: #9954f3;
  color: white !important;
  border: none;
  padding: 12px 20px;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.productimage {
  height: 500px;
  top: 20px;
}

.v-container {
  margin-top: 100px;
  width: 70%;
  text-align: left;
}

.left-panel {
  background-color: #ffffff;
  padding: 20px;
}

.right-panel {
  background-color: #ffffff;
  padding: 20px;
}

.quantity-select {
  margin-top: 20px;
  width: 100%;
}
</style>
