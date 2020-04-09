import Vue from 'vue'
import App from './App.vue'
import router from './router.js'

// 引入全局样式
import './assets/css/global.css'

import './plugins/element.js'

import axios from 'axios'
// 配置请求根路径
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'

Vue.prototype.$http = axios
axios.interceptors.request.use(config => {
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
})



Vue.config.productionTip = false
import './assets/fonts/iconfont.css'
new Vue({
  router,
  render: h => h(App),
}).$mount('#app')
