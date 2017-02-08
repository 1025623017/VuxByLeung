import Vue from 'vue'
import Vuex from 'vuex'
import VueRouter from 'vue-router'
import VueFilter from 'vue-filter'
import VueResource from 'vue-resource'

//登录注册、修密忘记
import join from './components/join.vue'
import login from './components/login.vue'
import register from './components/register.vue'
import password from './components/password.vue'
import forget from './components/forget.vue'

//入驻
import steps from './components/steps.vue'
import joined from './components/joined.vue'

//控制面板
import dashboard from './components/dashboard.vue'
import ordersRouter from './components/ordersRouter.vue'
import user from './components/user.vue'
import datas from './components/datas.vue'
import charts from './components/charts.vue'

//商品
import goods from './components/goods/goods.vue'
import good from './components/goods/good.vue'

//单购
import orders from './components/orders/orders.vue'
import order from './components/orders/order.vue'
import ship from './components/orders/ship.vue'

//拼团
import tuanPending from './components/tuans/pending.vue'
import tuanOrders from './components/tuans/orders.vue'
import tuanOrder from './components/tuans/order.vue'
import tuanShip from './components/tuans/ship.vue'

//订单
import pendings from './components/orders/pendings.vue'
import pending from './components/orders/pending.vue'
import tuans from './components/orders/tuans.vue'
import tuan from './components/orders/tuan.vue'

//提现
import cash from './components/cash/cash.vue'
import income from './components/cash/income.vue'
import withdraws from './components/cash/withdraws.vue'
import withdrawing from './components/cash/withdrawing.vue'
import withdraw from './components/cash/withdraw.vue'

//测试页面
import test from './components/test.vue'

//配置
import config from './config'

Vue.use(Vuex)
Vue.use(VueFilter)
Vue.use(VueResource)
Vue.use(VueRouter)

var App = Vue.extend({})

const router = new VueRouter({
    saveScrollPosition: true
})

router.map({
    '/join': {
        component: join,
        gust: true
    },
    '/login': {
        component: login,
        gust: true
    },
    '/register': {
        component: register,
        gust: true
    },
    '/forget': {
        component: forget,
        gust: true
    },
    '/password': {
        component: password
    },
    '/steps': {
        component: steps
    },
    '/joined': {
        component: joined
    },
    '/dashboard': {
        component: dashboard
    },
    '/ordersRouter': {
        component: ordersRouter
    },
    '/user': {
        component: user
    },
    '/datas': {
        component: datas
    },
    '/datas/charts/:id': {
        component: charts
    },
    '/goods': {
        component: goods
    },
    '/goods/:id': {
        component: good
    },
    '/tuans/orders': {
        component: tuanOrders
    },
    '/tuans/orders/:id': {
        component: tuanOrder
    },
    '/tuans/orders/:id/ship': {
        component: tuanShip
    },
    '/tuans/orders/pendings/:id': {
        component: tuanPending
    },
    '/orders': {
        component: orders
    },
    '/orders/:id': {
        component: order
    },
    '/orders/:id/ship': {
        component: ship
    },
    '/orders/pendings': {
        component: pendings
    },
    '/orders/pendings/:id': {
        component: pending
    },
    '/shop/tuans': {
        component: tuans
    },
    '/shop/tuans/:id': {
        component: tuan
    },
    '/cash': {
        component: cash
    },
    '/cash/income': {
        component: income
    },
    '/cash/withdraws': {
        component: withdraws
    },
    '/cash/withdrawing': {
        component: withdrawing
    },
    //旧路径
    '/cash/withdraw/:id':{component:withdraw},
    '/cash/withdraws/:id': {
        component: withdraw
    },
    '/test': {
        component: test
    }
})

router.redirect({
 '/': '/login',
 '*': '/login'
})

Vue.config.debug = false

router.beforeEach((transition) => {
    let token = localStorage.getItem('token')
    if (!transition.to.gust && (!token || token === null)) {
        localStorage.setItem('targetUrl',window.location.href)
        router.go('/login')
    }else if(transition.to.gust && token != null){
        if (localStorage.getItem('nowStep')==null) {
            router.go('/dashboard')
        }else if ((localStorage.getItem('nowStep')*1)<3) {
            router.go('/steps')
        }else{
            router.go('/dashboard')
        }
    }
    //是否开启debug模式
    localStorage.setItem('debug',Vue.config.debug)
    Vue.http.headers.common['Authorization'] = 'Bearer ' + token;
    transition.next()
});

router.start(App, '#app')

/* eslint-disable no-new */
// new Vue({
//   el: '#app',
//   components: { join }
// })

// 创建一个对象来保存应用启动时的初始状态
const state = {
  // TODO: 放置初始状态
}

// 创建一个对象存储一系列我们接下来要写的 mutation 函数
const mutations = {
  // TODO: 放置我们的状态变更函数
}

// 整合初始状态和变更函数，我们就得到了我们所需的 store
// 至此，这个 store 就可以连接到我们的应用中
export default new Vuex.Store({
  state,
  mutations
})

Vue.http.options.root = 'http://'+config.server.host

// Vue.http.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem('token')
