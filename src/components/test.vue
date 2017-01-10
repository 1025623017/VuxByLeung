<template>
	<div>

    <style>
      #ad {
        position: fixed;
        top: 0;
        width: 100vw;
        height: 95px;
        z-index: 999999;
        background: url("https://img.alicdn.com/tps/TB1kYPMOXXXXXbCXXXXXXXXXXXX-1125-336.jpg_q50.jpg") 100% 100%;
        background-size: 100% 100%;
      }
      #side {
        z-index: 999999;
        position: fixed;
        bottom: 35vw;
        right: 0;

        width: 80px;
        height: 80px;

        background: #fce614;
        color: #ff3256;

        text-align: center;
        border-radius: 50px;
      }
      #tip {
        position: fixed;
        bottom: 45px;
        width: 100vw;
        z-index: 999999;
        background: rgba(0,0,0,0.5);
        color: #fff;
        padding: 0.5em;
      }
      #btn-top {
        position: absolute;
        right: 10px;
        top: 20%;
        font-size: 2rem;
        color: #fff;
      }
      #btn-bottom {
        position: absolute;
        right: 30px;
        top: -3px;
        font-size: 2rem;
      }














      #bar-bottom {
        position: fixed;
        bottom: 0;
        right: 0;
        width: 100vw;
        z-index: 999999;
        background: #fff;
        padding: 10px 0;
      }
      #bar-bottom span {
        margin: 0 20px;
      }
    </style>

    <div id="ad">
      <a id="btn-top">×</a>
    </div>
    <div id="tip">
      您还有友福券仍未使用！<a id="btn-bottom">×</a>
    </div>
    <div id="bar-bottom">
      <span>导航</span>
      <span>导航</span>
      <span>导航</span>
      <span>导航</span>
    </div>
    <div id="side" onclick="toggleSide()">
      <img src="http://images.ufutx.com/201611/07/fdd4f6f4cb3458189d2ed179c56dfbbd.png" style="width: 60%;position: relative;top:5px;" alt=""><br><b>快点我!</b>
    </div>
    <script src="http://cdn.bootcss.com/jquery/1.12.4/jquery.js"></script>
    <script>
      $(function() {
        function toggleSide() {
          $('#side').animate({
            'width': '50vw'
          })
        }
      });
    </script>



		<x-header :left-options="{showBack: false}">控制面板&nbsp;&nbsp;<a slot="right" @click="logout">退出</a></x-header>

    <card :header="{title: ''}" style="margin-top: 0;padding-top: 10px;background: rgb(77,144,231);color: #fff;">
      <div slot="content" class="card-flex card-content dashboard-card">
        <div>
          <span>今日付款金额(元)</span>
          <br/>
          <span style="font-size: 3rem;">{{dashboardData.today_income}}</span>
        </div>
      </div>
      <div slot="content" class="card-flex card-content dashboard-card">
        <div style="border-right: 1px #fff solid;">
          <span>拼团订单</span>
        </div>
        <div>
          <span>问题订单</span>
        </div>
      </div>
      <div slot="content" class="card-flex card-content dashboard-card">
        <div>
          <span>{{dashboardData.no_tuan_count}}</span>
        </div>
        <div class="vux-1px-r">
          <span>{{dashboardData.pending_orders}}</span>
        </div>
      </div>
      <div slot="content" class="card-flex card-content dashboard-card" style="margin-top: 10px;">
        <div style="border-right: 1px #fff solid;">
          <span>浏览人数</span>
        </div>
        <div>
          <span>支付订单</span>
        </div>
      </div>
      <div slot="content" class="card-flex card-content" style="padding-top: 0;">
        <div>
          <span>{{dashboardData.tool_click}}</span>
        </div>
        <div class="vux-1px-r">
          <span>{{dashboardData.unsent_orders}}</span>
        </div>
      </div>
    </card>

    <flexbox style="text-align: center;color: #717171;margin-top: 40px;">
      <flexbox-item v-link="{ path: '/dashboard' }">
        <img src="/static/images/goods.png" style="width: 25%;" alt="">
        <div>
          商品
        </div>
      </flexbox-item>
      <flexbox-item v-link="{ path: '/ordersRouter' }">
        <img src="/static/images/orders.png" style="width: 25%;" alt="">
        <div>
          订单
        </div>
      </flexbox-item>
    </flexbox>
    <flexbox style="text-align: center;color: #717171;margin-top: 40px;">
      <flexbox-item v-link="{ path: '/dashboard' }">
        <img src="/static/images/cash.png" style="width: 25%;" alt="">
        <div>
          提现
        </div>
      </flexbox-item>
      <flexbox-item v-link="{ path: '/dashboard' }">
        <img src="/static/images/shops.png" style="width: 25%;" alt="">
        <div>
          我的
        </div>
      </flexbox-item>
    </flexbox>


    <flexbox style="text-align: center;color: #717171;margin-top: 40px;">
      <flexbox-item v-link="{ path: '/dashboard' }">
        <img src="/static/images/goods.png" style="width: 25%;" alt="">
        <div>
          商品
        </div>
      </flexbox-item>
      <flexbox-item v-link="{ path: '/ordersRouter' }">
        <img src="/static/images/orders.png" style="width: 25%;" alt="">
        <div>
          订单
        </div>
      </flexbox-item>
    </flexbox>
    <flexbox style="text-align: center;color: #717171;margin-top: 40px;">
      <flexbox-item v-link="{ path: '/dashboard' }">
        <img src="/static/images/cash.png" style="width: 25%;" alt="">
        <div>
          提现
        </div>
      </flexbox-item>
      <flexbox-item v-link="{ path: '/dashboard' }">
        <img src="/static/images/shops.png" style="width: 25%;" alt="">
        <div>
          我的
        </div>
      </flexbox-item>
    </flexbox>



    <loading :show="showLoading"></loading>
    <confirm :show.sync="confirm" title="消息" confirm-text="确定" cancel-text="取消" @on-confirm="onConfirm">
      <p style="text-align:center;">是否退出帐号？</p>
    </confirm>

	</div>
</template>

<script>
import { Card, Flexbox, FlexboxItem, Confirm, XInput, GroupTitle, Group, XButton, Cell, XHeader, Box, Loading } from 'vux/src/components'
export default {
  components: {
    Card,
    Confirm,
    Flexbox,
    FlexboxItem,
    Loading,
    XHeader,
    XInput,
    Group,
    XButton,
    Cell,
    GroupTitle,
    Box
  },
  data () {
    return {
      confirm: false,
      showLoading: false,
      dashboardData: {}
    }
  },
  ready () {
    this.getDashboard()
  },
  methods: {
    getDashboard () {
      this.showLoading = true
      setTimeout(() => {
        this.$http.get(this.$http.options.root+'/api/dashboard/data/sum')
        .then(response => {
          this.dashboardData = response.data.data
          this.showLoading = false
        })
        .catch(console.log)
      }, 500)
    },
    logout () {
      this.confirm = true
    },
    onConfirm () {
      this.showLoading = true
      setTimeout(() => {
        this.$http.get(this.$http.options.root+'/api/auth/logout')
        .then(response => {
          localStorage.clear()
          this.showLoading = false
          this.$router.go('/login')
        })
        .catch(console.log)
      }, 500)
    }
  }
}
</script>
