<template>
	<div @keyup.enter="register">



		<x-header>友福同享 注册</x-header>
		<div class="join-img">
			<img src="/static/images/logo.png" style="width: 60vw;" alt="">
	  	</div>
	  	<group title="">
      <!-- 姓名 -->
      <span class="fa fa-user" style="position: absolute;top: 13px;left: 20px;font-size: 1.2em;"></span>
      <x-input style="margin-left: 28px;" title="姓名" name="registerName" placeholder="请输入姓名"></x-input>
      <!-- 手机 -->
      <span class="fa fa-mobile-phone" style="position: absolute;top: 50px;left: 22px;font-size: 1.5em;"></span>
      <x-input style="margin-left: 28px;" title="手机" name="registerMobile" placeholder="请输入手机号码" keyboard="number" is-type="china-mobile"></x-input>
			<x-input style="margin-left: 14px;" title="验证码" name="registerCode" :required="false" :show-clear="false" placeholder="请输入验证码" class="weui_vcode">
				<x-button class="btnCode" slot="right" name="btnCode" type="primary" :required="false" @click="getCode">获取</x-button>
			</x-input>
			<x-input title="设置密码" name="registerPwd" type="password" placeholder="请输入密码"></x-input>
			<x-input title="二次密码" name="repeatPwd" type="password" placeholder="请再次输入密码"></x-input>
		</group>
    	<br>
		<box gap="10px 10px">
    		<x-button type="primary" @click="register">注册</x-button>
        <div style="text-align: center;margin-top: 20px;">
          <a style="color: #04BE02;font-size: 0.9rem;" v-link="{ path: 'login' }">返回登录</a>
        </div>
		</box>
    <loading :show="showLoading"></loading>
    <toast :show.sync="showError" type="cancel">{{txtError}}</toast>
  	<toast :show.sync="showSuccess">注册成功</toast>
  	<toast :show.sync="showSended" :time="3000">短信已发送</toast>


	</div>
</template>

<script>
import { Toast, Loading, Alert, XInput, GroupTitle, Group, XButton, Cell, Flexbox, FlexboxItem, Divider, Actionsheet, XHeader, Box } from 'vux/src/components'
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
    Box
  },
  data () {
  	return {
  		showLoading: false,
		showError: false,
  		txtError: '',
  		showSended: false,
  		seconds: 30,
      	timer: null,
  		showSuccess: false
  	}
  },
  ready () {
    this.localVal()
  },
  methods: {
    localVal () {
      document.getElementsByName('registerMobile')[0].value = localStorage.getItem('userMobile')
    },
    register () {
      const registerName = document.getElementsByName('registerName')[0].value
      const registerMobile = document.getElementsByName('registerMobile')[0].value
      const registerCode = document.getElementsByName('registerCode')[0].value
      const registerPwd = document.getElementsByName('registerPwd')[0].value
      const repeatPwd = document.getElementsByName('repeatPwd')[0].value
      if (registerName == '') {
  	  	this.txtError = '姓名不能为空'
  	    this.showError = true
      }else if(registerMobile == ''){
  	  	this.txtError = '手机不能为空'
  	    this.showError = true
  	  }else if(registerCode == ''){
  	  	this.txtError = '验证码不能为空'
  	    this.showError = true
  	  }else if(registerPwd.length<6){
  	  	this.txtError = '请输入6位以上密码'
  	    this.showError = true
  	  }else{
        this.showLoading = true
    		this.$http.post(this.$http.options.root+'/api/auth/register',{
    			"mobile": registerMobile,
    			"code": registerCode,
    			"name": registerName,
    			"password": registerPwd,
    			"repassword": repeatPwd,
    			"aggree": 1
    		})
    		.then(response => {
    			const rsp = response.data
    			if (rsp.code == 0) {
            //设置token
            localStorage.setItem('token',rsp.data.token)
        	  localStorage.setItem('userName',registerName)
        	  localStorage.setItem('userMobile',registerMobile)
    			  this.showLoading = false
    	      this.showSuccess = true
    			  setTimeout(() => {
    			    this.$router.go('/steps')
    			  }, 1500)
    			}else{
    			  setTimeout(() => {
    			  	this.txtError = rsp.message
    			    this.showLoading = false
    			    this.showError = true
    			  }, 800)
    			}
    		})
    		.catch(console.log)
      }
    },
    getCode () {
      clearInterval(this.timer);
      const registerMobile = document.getElementsByName('registerMobile')[0].value
      const btnCode = document.getElementsByName('btnCode')[0]
      const checkPhone = (/^1[3|4|5|7|8]\d{9}$/.test(registerMobile))
      if (!checkPhone) {
        this.txtError = '请填写正确的手机号码',
        this.showError = true
      }else{
        this.showSended = true
        this.$http.post(this.$http.options.root+'/api/sms/code/register',{
          "mobile": registerMobile
        })
        .then(response => {
          const rsp = response.data
          if (rsp.code == 0) {
            setTimeout(() => {
              this.timer = setInterval(() => {
                if (this.seconds > 0) {
                  this.seconds--
                  btnCode.innerHTML = this.seconds + '秒后重新获取'
                  btnCode.style.background = '#f2f2f2'
                  btnCode.style.color = '#000'
                  btnCode.disabled = true
                }
                if (this.seconds == 0) {
                  clearInterval(this.timer)
                  btnCode.innerHTML = '重新获取'
                  btnCode.style.background = '#04BE02'
                  btnCode.style.color = '#fff'
                  this.seconds = 30
                  btnCode.disabled = false
                }
              }, 1000)
            }, 500)
          }else{
            setTimeout(() => {
              this.txtError = rsp.message
              this.showLoading = false
              this.showError = true
            }, 800)
          }
        })
        .catch(console.log)
      }
    }
  }
}
</script>
