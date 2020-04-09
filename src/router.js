import Vue from 'vue'
import Router from 'vue-router'
import Login from './components/Login.vue'
import Home from './components/Home.vue'
import welcome from './components/Welcome.vue'
import user from './components/user/user.vue'
Vue.use(Router)

const router = new Router ({
  routes: [
    {path: '/', redirect: '/login'},
    {path: '/login', component: Login},
    {path: '/home', component: Home,
    redirect: '/welcome',
     children:[
      {path: '/welcome', component: welcome},
      {path: '/users', component: user}
    ]}
  ]
})

//挂载路由导航守卫
//to表示将要访问的路径
//from 代表从哪个路径跳转而来
//next 是一个函数， 表示放行
//next() 放行 next('/login) 强制跳转到login页面
router.beforeEach((to, from, next) => {
  if(to.path === '/login') return next()
  //获取token
  const tokenStr = window.sessionStorage.getItem('token')
  if(!tokenStr)  return next('/login') 
  console.log(111)
  next()
})

export default router