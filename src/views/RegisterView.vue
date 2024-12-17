<template>
    <HeadMenu />
    <v-form v-model="valid">
      <!-- 置中容器 -->
      <v-container class="product_container" fluid>
        <v-row justify="center" style="height: 100vh">
          <v-col cols="12" md="6">
            <!-- 表單標題 -->
            <h1 class="text-center mb-4">註冊</h1>
            <!-- 表單欄位 -->
            <v-row>
              <!-- First Name -->
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="firstname"
                  :counter="10"
                  :rules="nameRules"
                  label="First name"
                  required
                ></v-text-field>
              </v-col>
  
              <!-- Last Name -->
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="lastname"
                  :counter="10"
                  :rules="nameRules"
                  label="Last name"
                  required
                ></v-text-field>
              </v-col>
  
              <!-- E-mail -->
              <v-col cols="12">
                <v-text-field
                  v-model="email"
                  :rules="emailRules"
                  label="E-mail"
                  required
                ></v-text-field>
              </v-col>
  
              <!-- Password -->
              <v-col cols="12">
                <v-text-field
                  v-model="password"
                  :rules="passwordRules"
                  label="Password"
                  type="password"
                  required
                ></v-text-field>
              </v-col>
  
              <!-- Confirm Password -->
              <v-col cols="12">
                <v-text-field
                  v-model="confirmPassword"
                  :rules="confirmPasswordRules"
                  label="Confirm Password"
                  type="password"
                  required
                ></v-text-field>
              </v-col>
  
              <!-- Register Button -->
              <v-col cols="12" class="register_button">
                <v-btn
                  :disabled="!valid"
                  color="primary"
                  @click="register"
                size=90
                style="width: 20%;"
                  >
                  註冊
                  
                </v-btn>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </v-container>
    </v-form>
  </template>
  
  <script>
  import HeadMenu from "../components/HeadMenu.vue";
  
  export default {
    name: "RegisterForm",
    components: {
      HeadMenu,
    },
    data() {
      return {
        valid: true,
        firstname: "",
        lastname: "",
        email: "",
        password: "",
        confirmPassword: "",
        nameRules: [
          (v) => !!v || "Name is required",
          (v) => (v && v.length <= 10) || "Name must be less than 10 characters",
        ],
        emailRules: [
          (v) => !!v || "E-mail is required",
          (v) => /.+@.+\..+/.test(v) || "E-mail must be valid",
        ],
        passwordRules: [
          (v) => !!v || "Password is required",
          (v) => (v && v.length >= 6) || "Password must be at least 6 characters",
        ],
        confirmPasswordRules: [
          (v) => !!v || "Please confirm your password",
          (v) => v === this.password || "Passwords do not match",
        ],
      };
    },
    methods: {
      register() {
        // Add your registration logic here
        console.log("Form submitted");
      },
    },
  };
  </script>
  
  <style scoped>
  .product_container {
    position: relative;
    top: 200px;
    margin: 0px 0px;
    background-color: #ffffff; /* 背景顏色 */
  }
  
  .product_container h1 {
    font-size: 35px;
    color: black;
    font-weight: 400;
  }
  .register_button .v-btn {
  font-size: 18px; /* Adjust font size */
  padding: 12px 24px; /* Adjust padding */
    }
  </style>
  