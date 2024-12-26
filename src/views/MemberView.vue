<template>
  <HeadMenu/>
  <div class="member-page">
    <div class="content">
      <h1>Welcome to the Member Page</h1>
      <p>Manage your account and enjoy our services!</p>
      <button class="sign_out" type="button" @click="signout">Sign Out</button>
    </div>
  </div>
</template>

<script>
import { useCookies } from "vue3-cookies";
const { cookies } = useCookies();

import HeadMenu from '@/components/HeadMenu.vue'

export default {
  name: 'MemberView',
  components: {
    HeadMenu
  },
  methods: {
    signout() {
      try {
        cookies.remove('token');
        alert("You have been logged out successfully.");
        this.$router.push('/');
      } catch (error) {
        alert("Logout failed, please try again.");
      }
    }
  }
}
</script>

<style scoped>
.member-page {
  background-color: #f9f9f9;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
}

.content {
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  padding: 30px;
  max-width: 400px;
  width: 100%;
  text-align: center;
}

h1 {
  font-size: 28px;
  color: #333;
  margin-bottom: 20px;
  font-weight: 600;
}

p {
  font-size: 16px;
  color: #555;
  margin-bottom: 30px;
}

.sign_out {
  background-color: #9954f3;
  color: white;
  font-size: 18px;
  font-weight: 600;
  padding: 12px 30px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.sign_out:hover {
  background-color: #7f33c8;
}

@media screen and (max-width: 768px) {
  .content {
    padding: 20px;
  }

  h1 {
    font-size: 24px;
  }

  p {
    font-size: 14px;
  }

  .sign_out {
    font-size: 16px;
    padding: 10px 25px;
  }
}
</style>
