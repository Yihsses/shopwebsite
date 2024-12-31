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

          <!-- 顧客評論與給分 -->
          <div class="review-section">
            <v-rating v-model="rating" :length="5" color="yellow" background-color="grey lighten-2"></v-rating>
            <v-textarea
              v-model="review"
              label="Leave a review"
              rows="3"
              outlined
              class="review-textarea"
            ></v-textarea>
            <v-btn @click="submitReview" color="primary" class="submit-review-btn">提交評論</v-btn>

            <!-- 顯示所有評論 -->
            <div v-if="reviews.length" class="reviews-display">
              <v-card v-for="(item, index) in reviews" :key="index" class="review-card">
                <v-row>
                  <conso class="log"></conso>
                  <v-rating :model-value="item.rating" :length="5" color="yellow" background-color="grey lighten-2" readonly></v-rating>
                </v-row>
                <v-row>
                  <p class="review-text">{{ item.text }}</p>
                </v-row>
              </v-card>
            </div>
          </div>
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
      rating: 0, // 評分
      review: "", // 評論文字
      reviews: [], // 所有評論
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
          this.test_path =response.data[0].Image_path;
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
          window.location.reload();
        } else {
          alert("加入購物車失敗，請稍後再試");
        }
      } catch (error) {
        console.error("加入購物車時發生錯誤:", error);
        alert("加入購物車失敗，請稍後再試");
      }
    },
    submitReview() {
      if (this.rating > 0 && this.review.trim()) {
        this.reviews.push({
          rating: this.rating,
          text: this.review
        });
        this.rating = 0;
        this.review = "";
      } else {
        alert("請提供評分和評論！");
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

.review-section {
  margin-top: 40px;
}

.review-textarea {
  margin-top: 10px;
}

.submit-review-btn {
  margin-top: 10px;
}

.reviews-display {
  margin-top: 20px;
}

.review-card {
  margin-bottom: 10px;
  padding: 10px;
}

.review-text {
  color: gray;
  font-size: 14px;
}
</style>
