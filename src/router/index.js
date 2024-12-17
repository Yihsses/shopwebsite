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
        path: '' , 
        component: AllProductView,
      }
    ]
  },
  {
    path:'/Login',
    name: 'login',
    component:LoginView,
    meta: { Islogined: false },
  },
  {
    path:'/member',
    name: 'member',
    component:MemberView,
  },
  {
    path:'/product/:id',
    name: 'product',
    component:ProductView,
  },
  {
    path:'/register',
    name:'register',
    component:RegisterView,
  }

]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

router.beforeEach((to) => {
  if(to.name == 'login'){
    if(cookies.get('token') != null)  {
      if (!(to.meta.Islogined || !(jwtDecode(cookies.get('token')).LoggedIn))) {
        return {
          path: '/member',
        }
      }
    }
  } 

})

export default router
