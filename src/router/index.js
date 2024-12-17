import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import AllProductView from '../views/AllProductView.vue'
import LoginView from '../views/LoginView.vue'
import MemberView from '../views/MemberView.vue'
import ProductView from '../views/ProductView.vue'
import RegisterView from '../views/RegisterView.vue'
import { jwtDecode } from "jwt-decode";
import { useCookies } from "vue3-cookies";
const { cookies } = useCookies();

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
  },
  {
    path: '/product',
    name: 'allproduct',
    children: [
      {
        path: '',
        component: AllProductView,
      }
    ]
  },
  {
    path:'/Login',
    name: 'login',
    component: LoginView,
    meta: { Islogined: false },
  },
  {
    path:'/member',
    name: 'member',
    component: MemberView,
  },
  {
    path:'/product/:id',
    name: 'product',
    component: ProductView,
  },
  {
    path:'/register',
    name: 'register',
    component: RegisterView,
  }
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
});

// 添加路由守衛
router.beforeEach((to, from, next) => {
  // 如果進入的路徑是 member 頁面且用戶未登入
  if (to.name === 'member') {
    // 檢查是否有 token 且 token 是否有效
    if (!cookies.get('token') || !jwtDecode(cookies.get('token')).LoggedIn) {
      // 若未登入，重定向到登入頁面
      next({ name: 'login' });
    } else {
      // 若已登入，繼續訪問 member 頁面
      next();
    }
  } else {
    // 其他頁面，正常進行路由跳轉
    next();
  }
  if(to.name == 'login'){
    if(cookies.get('token') != null)  {
      if (!(to.meta.Islogined || !(jwtDecode(cookies.get('token')).LoggedIn))) {
        return {
          path: '/member',
        }
      }
    }
  } 
});

export default router;
