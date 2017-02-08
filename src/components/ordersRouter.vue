<template>
	<div>



		<x-header @click="bbb=true">订单<a slot="right" @click="logout">退出</a></x-header>


    <div v-if="!closeTips" id="tips" style="background: #C53627;color: #fff;text-indent: 10px;word-break: break-all;padding: 10px 40px 10px 10px;font-size: 0.9rem;">
      <span class="fa fa-bell" style="color: #fff;"></span>
      注意：单购订单与拼团订单不重叠，若同时有标记即表明都有订单需要您及时发货
      <span @click="closeTips=true" class="fa fa-close" style="position:absolute;font-size: 1.4rem;color: #fff;top: 67px;right: 17px;"></span>
    </div>
    <flexbox style="text-align: center;color: #717171;margin-top: 40px;">
      <flexbox-item v-link="{ path: '/orders' }">
        <img src="/static/images/view_details.png" style="width: 25%;" alt="">
        <br>
        <span style="position: relative;">
          单购订单
          <span v-if="dashboardData.mall_unsent_orders*1>0" class="badgeNum corner" style="background: #04be02;top: -15px;right: -15px;">
            {{dashboardData.mall_unsent_orders}}
          </span>
        </span>
      </flexbox-item>
      <flexbox-item v-link="{ path: '/tuans/orders' }">
        <img src="/static/images/orders.png" style="width: 25%;" alt="">
        <br>
        <span style="position: relative;">
          拼团订单
          <span v-if="dashboardData.tuan_unsent_orders*1>0" class="badgeNum corner" style="background: #04be02;top: -15px;right: -15px;">
            {{dashboardData.tuan_unsent_orders}}
          </span>
        </span>
      </flexbox-item>
    </flexbox>
    <flexbox v-if="is_admin==1" style="text-align: center;color: #717171;margin-top: 40px;">
      <flexbox-item v-link="{ path: '/orders/pendings' }">
        <img src="/static/images/high_priority.png" style="width: 25%;" alt="">
        <div>
          问题订单
        </div>
      </flexbox-item>
      <flexbox-item v-link="{ path: '/shop/tuans' }">
        <img src="/static/images/survey.png" style="width: 25%;" alt="">
        <div>
          拼团管理
        </div>
      </flexbox-item>
    </flexbox>



    <loading :show="showLoading"></loading>
    <confirm :show.sync="confirm" title="消息" confirm-text="确定" cancel-text="取消" @on-confirm="onConfirm">
      <p style="text-align:center;">是否退出帐号？</p>
    </confirm>
    <toast :show.sync="showError" type="cancel">{{txtError}}</toast>

	</div>
</template>

<script>
import { Card, Flexbox, FlexboxItem, Toast, Confirm, XInput, GroupTitle, Group, XButton, Cell, XHeader, Box, Loading } from 'vux/src/components'
export default {
  components: {
    Toast,
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
      is_admin: 0,
      dashboardData: {},
      closeTips: false,
      //错误提示
      txtError: '',
      showError: false
    }
  },
  ready () {
    this.isAdmin()
    this.sum()
  },
  methods: {
    isAdmin () {
      this.is_admin = localStorage.getItem('is_admin')
    },
    sum () {
      this.showLoading = true
      setTimeout(() => {
        this.$http.get(this.$http.options.root+'/api/dashboard/data/sum')
        .then(response => {
          if (response.data.code==2) {
            this.showLoading = false
            this.txtError = response.data.message
            this.showError = true
            localStorage.removeItem('token')
            setTimeout(() => {
              this.$router.go('/login')
            }, 800)
          }else{
            this.dashboardData = response.data.data
            this.showLoading = false
          }
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
