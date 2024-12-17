<template>
    <div class="about">
      <h1>This is an member page</h1>
      <button class="sign_out" type="button" @click="signout">sign_out</button>
    </div>
</template>


<script>
import { useCookies } from "vue3-cookies";
const { cookies } = useCookies();

  export default {
    methods:{
        signout(){
          try{
            cookies.remove('token');
            cookies.get('token');
            alert("登出成功")
            this.$router.push('/');
          }catch{
            alert("登出失敗")
          }

        }
    }
  }
  
</script>
  