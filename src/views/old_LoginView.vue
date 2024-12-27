<template>
    <HeadMenu/>
    <div class="login-form-container">
        <h1>登入</h1>
        <div class="input_Common_Input_Box">
            <form  @submit.prevent="handleLogin()">
                <input type="email" v-model="account" id="customer[email]" placeholder="電子郵件" autocomplete="email" class="input__field" name="customer[email]" required="required"><br>
                <input type="password" v-model="password" id="customer[password]" placeholder="密碼" class="input__field" name="customer[password]" required="required" autocomplete="current-password"><br>
                <input type="submit" value="登入" class="button"/>
            </form>
        </div>
        <p id="entry-title"></p>
            <hr>
        <div class="form__secondary-action Customer_Login_RegisterBox">
            <p class="Common_Subtitle_Text">首次登入請點這裡</p>
            <button class ="register">註冊</button>
        </div>
    </div>
</template>

<script>

import HeadMenu from '../components/HeadMenu.vue'
import { useCookies } from "vue3-cookies";
const { cookies } = useCookies();
import axios from "axios"



axios.defaults.withCredentials = true 

// console.log(cookies.get('LoggedIn'));
// axios.get('http://localhost:3002/api/member/CheckMemberAccount?account=Yihss&password=1234');

  // 
 // v2
export default {
    name: 'MemberView' ,
    components: {
      HeadMenu
    },
    data(){
 
    },
    methods:{
        async handleLogin() {
            try {
                // 發送 GET 請求，帶上使用者輸入的帳號和密碼
                const response = await axios.get('http://localhost:3002/api/member/CheckMemberAccount', {
                    params: {
                        account: this.account,
                        password: this.password
                    }
                });
                //   console.log(response.data);
                if (response.data.success) {                   
                    cookies.set('token',response.data.token);

                    alert('登入成功');
                    this.$router.push('/');

                } else {
                    alert('登入失敗，帳號或密碼錯誤');
                }
            } catch (error) {
                console.error(error);
                alert('登入失敗，請檢查伺服器連接');
            }

        }
    }
}
</script>

<style scope>
.login-form-container{
  position: relative;
  top: 200px;
  margin: 0px 0px;
  
}
.login-form-container h1{
    font-size: 50px;
    color: black;
    font-weight: 400;
}

.input__field {
    width: 80%; /* 设置宽度为父容器的 80% */
    max-width: 400px; /* 最大宽度限制 */
    padding: 12px 15px; /* 输入框内边距 */
    font-size: 16px; /* 字体大小 */
    border: 1px solid #ccc; /* 边框颜色和样式 */
    border-radius: 5px; /* 圆角效果 */
    margin: 10px 0; /* 输入框之间的间距 */
    box-sizing: border-box; /* 确保 padding 不影响宽度 */
}

.input__field:focus {
    border-color: #007bff; /* 聚焦时改变边框颜色 */
    outline: none; /* 去除默认的聚焦边框 */
    box-shadow: 0 0 5px rgba(0, 123, 255, 0.5); /* 添加阴影效果 */
}

.button {
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


#entry-title{
    margin: 40px 0;
}
.Common_Subtitle_Text{
    font-size: 25px;
    color: black;
    font-weight: 400;
    padding: 0px 20px,0px;
}
.login-form-container hr{
  width: 30%; 
  text-align: center;
  margin: 25px auto; 
  text-align: right;
  border: 0;
  border-top: 2px solid #e7e7e7; /* 顏色較淺的灰色 */

}
.register{
    margin: 25px auto; 
    width: 80%; /* 设置宽度为父容器的 80% */
    max-width: 400px; /* 最大宽度限制 */
    font-weight: 900;
    font-size: 20px;
    background-color: #9954f3;
    color: white;
    border: none;
    padding: 12px 20px;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s ease;
}
</style>