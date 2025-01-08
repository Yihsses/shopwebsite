

<template>
    <div class="w-screen h-screen bg-gradient-to-tr from-blue-700 to-rose-400 flex items-center justify-center">
    <div class="w-96 h-96 bg-white bg-opacity-75 rounded-lg p-8 shadow-md">
      <div class="text-2xl mb-4">
        Login
      </div>
      <div class="mb-4">
        <p>Email</p>
        <input class="w-full p-2 border border-gray-300 rounded" type="email" v-model="account" id="customer[email]" placeholder="Email" autocomplete="email" name="customer[email]" required="required/">
      </div>
      <div class="mb-4">
        <p>Password</p>
        <input class="w-full p-2 border border-gray-300 rounded" type="password" v-model="password" id="customer[password]" placeholder="Password" name="customer[password]" required="required" autocomplete="current-password"/>
      </div>
      <div class="mb-4 flex items-center justify-between">
        <div class="flex items-center">
          <input type="checkbox" class="mr-2" />
          <p>Remember me</p>
        </div>
        <div>
          <a href="#" class="text-blue-500">Forgot password?</a>
        </div>
      </div>
      <button @click="handleLogin" class="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600">Login</button>
      <a href="/shopwebsite/register" ><button class="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600 mt-3">Register</button></a>

    </div>
  </div>
</template>

<script>

import { useCookies } from "vue3-cookies";
const { cookies } = useCookies();
import axios from "axios"
import { jwtDecode } from "jwt-decode";
axios.defaults.withCredentials = true

export default {
    name: 'LoginComp',
    data() {

    },
    methods: {
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
                    cookies.set('token', response.data.token);
                    console.log(jwtDecode(cookies.get('token')).Authority)
                    alert('登入成功');
                    this.$router.push('/');

                } else {
                    alert('登入失敗');
                }
            } catch (error) {
                console.error(error);

                alert('登入失敗，請檢查伺服器連接');
            }

        }
    }
}
</script>
<style scoped>
/* 你的樣式 */
</style>
