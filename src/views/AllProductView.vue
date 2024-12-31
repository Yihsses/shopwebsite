<template>
  <div class="home">
    <!-- Header -->
    <header class="header">
      <HeadMenu />
    </header>

    <!-- 主內容 -->
    <v-container class="main-container" fluid>
      <h1 class="new-arrival-title">グッズ</h1>
      <h2 class="new-arrival-subtitle">Goods</h2>

      <v-row>
        <v-col
          v-for="(product, index) in products"
          :key="index"
          :cols="3"
          class="AllProduct"
        >
          <a :href="'/product/' + product.product_id">
            <ProductCard
              :image="product.Image_path"
             
              :name="product.Product_name"
              :price="`¥${product.Price}`"
            />
          </a>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import HeadMenu from "@/components/HeadMenu.vue";
import ProductCard from "@/components/ProductCard.vue";
import axios from "axios";

export default {
  name: "HomeView",
  components: {
    HeadMenu,
    ProductCard,
  },
  data() {
    return {
      products: [], // 初始化為空陣列
    };
  },
  methods: {
    fetchProducts() {
      axios
        .get("http://localhost:3002/api/product/GetAllProduct")
        .then((response) => {
          this.products = response.data.map((product) => ({
            product_id: product.product_id,
            Image_path: product.Image_path,
            Product_name: product.Product_name,
            Price: product.Price,
            Descip: product.Descip, // 商品描述（若需要展示）
            Quantity: product.Quantity, // 庫存數量（若需要展示）
          }));
        })
        .catch((error) => {
          console.error("API 請求錯誤", error);
        });
    },
  },
  mounted() {
    this.fetchProducts(); // 組件掛載後請求商品資料
  },
};
</script>

<style scoped>
.main-container {
  margin-top: 100px;
  padding: 20px;
}

.new-arrival-title {
  text-align: center;
  font-size: 24px;
  color: purple;
}

.new-arrival-subtitle {
  text-align: center;
  font-size: 18px;
  color: gray;
  margin-bottom: 20px;
}
</style>
