<template>
	<div @keyup.enter="checkVip">

		<x-header :left-options="{showBack: false}">入驻友福诚商</x-header>
  	<div class="join-img">
		  <img src="/static/images/yftxshoplog.jpg" style="width: 60vw;" alt="">
  	</div>
		<group title="">
			<x-input title="手机号码" name="joinmobile" placeholder="请输入手机号码" keyboard="number" is-type="china-mobile"></x-input>
		</group>
    <br>
		<box gap="10px 10px">
  		<x-button type="primary" @click="checkVip">入驻友福诚商</x-button>
		</box>
    <alert :show.sync="showLogin" title="消息" @on-hide="goLogin">帐号已存在，请登录</alert>
    <alert :show.sync="showRegister" title="消息" @on-hide="goRegister">请先注册帐号</alert>
    <alert :show.sync="showError" title="消息" @on-hide="hideError">请输入正确的手机号码</alert>

	</div>
</template>

<script>
import { Alert, XInput, GroupTitle, Group, Switch, XButton, Cell, Flexbox, FlexboxItem, Divider, Actionsheet, XHeader, Box } from 'vux/src/components'



export default {
  components: {
    Switch,
    Alert,
    XHeader,
    Actionsheet,
    Flexbox,
    FlexboxItem,
    Divider,
    XInput,
    Group,
    XButton,
    Cell,
    GroupTitle,
    Box
  },
  data () {
    return {
      showLogin: false,
      showRegister: false,
      showError: false
    }
  },
  ready () {
    this.toSteps()
  },
  methods: {
    //已登录跳转
    toSteps () {
      setTimeout(() => {
        if (localStorage.getItem('token') != null && localStorage.getItem('token') != '') {
          this.$http.get(this.$http.options.root+'/api/shop/merchant/join/status')
          .then(response => {
            const rsp = response.data
            console.log(rsp)
            if (rsp.data.approved == 1) {
              //已审核
              this.$router.go('/dashboard')
            } else if (rsp.data.step >0 && rsp.data.step <4) {
              //入驻中
              this.$router.go('/steps')
            } else if (rsp.data.step == 4) {
              //待审核
              this.$router.go('/joined')
            }
          })
          .catch(console.log)
        }
      }, 500)
    },
    goLogin () {
      this.$router.go('/login')
    },
    goRegister () {
      this.$router.go('/register')
    },
    hideError () {
      this.showError = false
      document.getElementsByName('joinmobile')[0].focus()
    },
    //当前帐号手机
    checkVip () {
      const joinmobile = document.getElementsByName('joinmobile')[0].value
      const checkPhone = (/^1[3|4|5|7|8]\d{9}$/.test(joinmobile))
      this.$http.get(this.$http.options.root+'/api/auth/check',{
        params: {
          'mobile': joinmobile
        }
      })
      .then(response => {
        const rsp = response.data
        if(rsp.code == 1 && checkPhone){
          localStorage.setItem('userMobile',joinmobile)
          this.showLogin = true
        }else if(rsp.code == 0 && checkPhone){
          localStorage.setItem('userMobile',joinmobile)
          this.showRegister = true
        }else{
          this.showError = true
        }
      })
      .catch(console.log)
    }
  }
}
</script>
<style lang="less">
@import '../assets/css/1px.less';
@import '../assets/css/main.css';
</style>