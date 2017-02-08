<template>
	<div @keyup.enter="login">

		<!-- <x-header :left-options="{showBack: false}">友福同享 登录</x-header> -->
		<div class="join-img">
			<img src="/static/images/logo.png" style="width: 60vw;" alt="">
    </div>
    <group title="">
      <!-- 帐号 -->
      <span class="fa fa-user" style="position: absolute;top: 13px;left: 14px;font-size: 1.2em;"></span>
      <x-input style="margin-left: 20px;" title="帐号" keyboard="number" name="loginName" placeholder="手机号码/邮箱"></x-input>
      <!-- 密码 -->
      <span class="fa fa-lock" style="position: absolute;top: 53px;left: 15px;font-size: 1.2em;"></span>
			<x-input style="margin-left: 20px;" class="icon" title="密码" name="loginPwd" type="password" placeholder="密码/邀请码"></x-input>
      <switch style="margin-left: 20px;" title="自动登录" :value.sync="isAutoLogin"></switch>
		</group>
    <br>
		<box gap="10px 10px" style="text-align: center;">
        <x-button type="primary" @click="login">登录</x-button>
        <flexbox style="margin-top: 20px;font-size: 0.9rem;">
          <flexbox-item>
            <a style="color: #04BE02;margin-left: 10px;" v-link="{ path: 'register' }">快速注册</a>
          </flexbox-item>
          <flexbox-item style="text-align: right;">
            <a style="color: #EF4F4F;margin-right: 5px;" v-link="{ path: 'forget' }">忘记密码？</a>
          </flexbox-item>
        </flexbox>
		</box>
    <loading :show="showLoading" :text="txtLoading"></loading>
    <toast :show.sync="showError" type="cancel">手机号/密码错误</toast>

	</div>
</template>

<script>
import { Toast, Loading, Alert, XInput, GroupTitle, Switch, Group, XButton, Cell, Flexbox, FlexboxItem, Divider, Actionsheet, XHeader, Box } from 'vux/src/components'
export default {
  components: {
    Toast,
    Loading,
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
    Box,
    Switch
  },
  data () {
    return {
      isAutoLogin: true,
      showError: false,
      showLoading: false,
      txtLoading: '登录中'
    }
  },
  ready () {
    this.localVal()
  },
  methods: {
    localVal () {
      document.getElementsByName('loginName')[0].value = localStorage.getItem('userMobile')
    },
    login () {
      const loginName = document.getElementsByName('loginName')[0].value
      const loginPwd = document.getElementsByName('loginPwd')[0].value
      const auto = (this.isAutoLogin * 1)
      this.showLoading = true
      this.$http.post(this.$http.options.root+'/api/auth/login',{
        'mobile': loginName,
        'password': loginPwd,
        'remember': auto
      })
      .then(response => {
        const rsp = response.data
        if(rsp.code == 0){
          //设置token
          localStorage.setItem('token',rsp.data.token)
          localStorage.setItem('is_admin',rsp.data.is_admin)
          //登陆成功
          this.stepHistory(rsp.data.token)
        }else{
          setTimeout(() => {
            this.showLoading = false
            this.showError = true
          }, 800)
        }
      })
      .catch(console.log)
    },
    stepHistory (token) {
      setTimeout(() => {
        this.$http.get(this.$http.options.root+'/api/shop/merchant/join/status',{
          headers: {
            'Authorization': 'Bearer' + token
          }
        })
        .then(response => {
          if (response.data.code == 2) {
            this.txtError = response.data.message
            this.showError = true
            setTimeout(() => {
              this.$router.go('/login')
            }, 800)
          }else{
            const step = response.data.data.step
            const approved = response.data.data.approved
            if (localStorage.getItem('targetUrl') != null) {
              const temp = localStorage.getItem('targetUrl')
              localStorage.removeItem('targetUrl')
              location.href = temp
            }else if (approved == 1) {
              this.$router.go('/dashboard')
            }else if(step==4){
              this.$router.go('/joined')
            }else if(step<4){
              this.$router.go('/steps')
            }
          }
        })
        .catch(console.log)
      }, 800)
    }
  }
}
</script>
