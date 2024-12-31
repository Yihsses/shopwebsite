<template>

  <div class="home">
    <HeadMenu/>
    <div class = "slidshowimage">
      <Slidshowimage/>
    </div>
  </div>
  <div class ="newarrival">
      <h1>NEW ARRIVAL</h1>
      <h1>新商品</h1>
        <v-row class="one_row" justify="center" >
          <v-col class="pa-2_ma-2"  v-for ="(item,index) in getimage(1)"  cols="2"  :key = "index">
              <v-img :src="item.src"  class="product-image"></v-img>
              <v-row class="name-row">
                <v-col>
                  <p class="product-name">{{ item.description }}</p>
                </v-col>
              </v-row>
          </v-col>
        </v-row>
        <v-row class="mb-6" justify="center" >
          <v-col class="pa-2_ma-2"  v-for ="(item,index) in getimage(5)"  cols="2"  :key = "index">
              <v-img :src="item.src" alt="item.description" class="product-image"></v-img>
              <v-row class="name-row">
                <v-col>
                  <p class="product-name">{{ item.description }}</p>
                </v-col>
              </v-row>
          </v-col>
        </v-row>
    </div>
  <div class = "testlogic">
    <a>登入測試:{{loginstate}}</a>
    </div>
</template>

<script>
// @ is an alias to /src
// import axios from "axios"

// axios.get('http://localhost:3002/api/product/GetAllProduct')
//       .then(response => {
//         console.log("ok");
//          console.log(response.data[0].Image_path);
//       })
//       .catch(error => {
//         console.log("notok");
//         console.error(error);
//       });
import HeadMenu from '@/components/HeadMenu.vue'
import Slidshowimage from '@/components/SlideshowImage.vue'
import { useCookies } from "vue3-cookies";
const { cookies } = useCookies();

export default {
  name: 'HomeView' ,
  components: {
    HeadMenu,Slidshowimage
  },
  data:function(){
    return {
      loginstate : cookies.get('LoggedIn'),
      images: (function () {
        let filearr = [];
        for (let i = 1; i <= 4; i++) {
          filearr.push({
            src: require(`../assets/test${i}.png`),
            description: `商品描述 ${i}` // 添加描述
          });
        }
        return filearr;
      })(),
      images2: (function () {
        let filearr = [];
        for (let i = 5; i <= 8; i++) {
          filearr.push({
            src: require(`../assets/test${i}.png`),
            description: `商品描述 ${i}` // 添加描述
          });
        }
        return filearr;
      })(),
    }

  },
  computed:{
    getimage(){
      return(index) =>{
        let filearr = [];
        for (let i = index; i <= index+3; i++) {
          filearr.push({
            src: require(`../assets/test${i}.png`),
            description: `商品描述 ${i}` // 添加描述
          });
        }
        return filearr;
      };

    }
  }
}
</script>

<style scoped>

.one_row{
  margin-top: 20px;
}
.testlogic{
  top:200px;
  position: relative;
}


.home .slidshowimage{
  overflow:hidden;
  position: relative;
  top:120px;
}


.newarrival{
  position: relative;
  top: 200px;
  margin: 0px 0px;
  
}




.newarrival h1{
  font-size: 30px;
  font-family:'fantasy';
  color: rgba(149, 75, 219, 0.842);
}


.description {
  font-size: 16px;
  color: #555;
  text-align: left;
}
img{
  max-width:68%;
  height: auto;
}

</style>