<template>
	<div @keyup.enter="reset">



		<x-header>重置密码</x-header>



		<div class="join-img">
			<img src="/static/images/logo.png" style="width: 60vw;" alt="">
  	</div>



  	<group>
      <x-input title="帐号" style="margin-left: 15px;" name="forgetMobile" keyboard="number" placeholder="手机号码/邮箱"></x-input>
      <x-input title="验证码" keyboard="number" name="forgetCode" :required="false" :show-clear="false" placeholder="请输入验证码" class="weui_vcode">
        <x-button slot="right" class="btnCode" type="primary" name="btnSend" @click="getCode">获取</x-button>
      </x-input>
		</group><br>



		<box gap="10px 10px" style="text-align: center;">
        <x-button type="primary" @click="reset">重置</x-button>
		</box>



    <loading :show="showLoading"></loading>
    <toast :show.sync="showError" type="cancel">{{txtError}}</toast>
    <toast :show.sync="showSended" :time="3000">短信已发送</toast>
    <toast :show.sync="showSuccess">重置密码已发送</toast>



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
      showSended: false,
      showError: false,
      txtError: '',
      showLoading: false,
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
      document.getElementsByName('forgetMobile')[0].value = localStorage.getItem('userMobile')
    },
    getCode () {
      const forgetMobile = document.getElementsByName('forgetMobile')[0].value
      const btnSend = document.getElementsByName('btnSend')[0]
      const checkPhone = (/^1[3|4|5|7|8]\d{9}$/.test(forgetMobile))
      if (!checkPhone) {
        this.txtError = '请填写正确的帐号',
        this.showError = true
      }else{
        this.showSended = true
        this.$http.post(this.$http.options.root+'/api/sms/code/reset',{
          "mobile": forgetMobile
        })
        .then(response => {
          const rsp = response.data
          if (rsp.code == 0) {
            setTimeout(() => {
              this.timer = setInterval(() => {
                if (this.seconds > 0) {
                  this.seconds--
                  btnSend.innerHTML = this.seconds + '秒后重新获取'
                  btnSend.style.background = '#f2f2f2'
                  btnSend.style.color = '#000'
                  btnSend.disabled = true
                }
                if (this.seconds == 0) {
                  clearInterval(this.timer)
                  btnSend.innerHTML = '重新获取'
                  btnSend.style.background = '#04BE02'
                  btnSend.style.color = '#fff'
                  this.seconds = 30
                  btnSend.disabled = false
                }
              }, 1000)
            }, 800)
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
    reset () {
      const forgetMobile = document.getElementsByName('forgetMobile')[0].value
      const forgetCode = document.getElementsByName('forgetCode')[0].value
      if(forgetMobile == ''){
        this.txtError = '请填写帐号',
        this.showError = true
      }else if(forgetCode == ''){
        this.txtError = '请填写验证码',
        this.showError = true
      }else{
        this.showLoading = true
        this.$http.post(this.$http.options.root+'/api/password/reset',{
          "mobile": forgetMobile,
          "code": forgetCode
        })
        .then(response => {
          const rsp = response.data
          if (rsp.code == 0) {
            this.showSuccess = true
            setTimeout(() => {
              this.$router.go('/login')
            }, 1000)
          }else{
            setTimeout(() => {
              this.txtError = rsp.message
              this.showLoading = false
              this.showError = true
            }, 800)
          }
          this.showLoading = false
        })
        .catch(console.log)
      }
    }
  }
}
</script>
