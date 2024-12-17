<template>
  <HeadMenu/>

    <v-container class="product_container">
      <v-row justify="space-around" >
        <!-- 左侧部分 -->
        <v-col cols="6"  class="left-panel">
          <v-img :src="test_path " class = "productimage">

          </v-img>
        </v-col>
  
        <!-- 右侧部分 -->
        <v-col cols="6"  class="right-panel">
          <v-sheet class="pa-2 ma-2">
              <h1>{{title}}</h1>
              <div v-html=Descrip></div>
              <button class ="BuyButton">購買</button>
          </v-sheet>
        </v-col>
      </v-row>

  
    </v-container>


  </template>
  
  <script>
  import HeadMenu from "@/components/HeadMenu.vue";
  import axios from "axios"


   
  export default {
    name: "LeftRightLayout",
    components: {
      HeadMenu
    },
    data:function(){
      return{
      test_path:null,
      Descrip:null,
      title:null ,
       product_info : axios.get('http://localhost:3002/api/product/GetProductInfo', {
          params: {
              id: this.$route.params.id,
            }
          }).then(response => {
            this.title = response.data[0].Product_name
            this.product_info = response.data
            this.Descrip = response.data[0].Descrip.replace(/\n/g,'<br>')
            console.log(response.data[0].Image_path)
            this.test_path =  require(`@/assets/images/${ response.data[0].Image_path}`)
            console.log( this.Descrip)
           
           console.log(this.product_info.data[0].Image_path)
          //   let Image_path = require('../assets/images/' + 'test.png')
          //   console.log(Image_path)
        })
        .catch(error => {
          console.error(error);
        }),
      }
    },

    computed(){

    },
    methods:{

    }
  };
  </script>
  
  <style scoped>

.BuyButton{
  margin-top: 40px;
    width: 80%; /* 设置宽度为父容器的 80% */
    max-width: 400px; /* 最大宽度限制 */
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

.productimage{
  height: 500px;
  top:20px;
}
  .v-container{
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
  
  </style>