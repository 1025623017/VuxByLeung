<template>
  <div>

    <x-header>
      修改密码&nbsp;&nbsp;
    </x-header>

    <group>
      <x-input title="原密码" type="password" name="pwd-old" placeholder="请输入旧密码"></x-input>
      <x-input title="新密码" type="password" name="pwd-new" placeholder="请输入新的密码"></x-input>
      <x-input title="确认密码" type="password" name="pwd-repeat" placeholder="请再次输入新密码"></x-input>
    </group>
    <br>
    <box gap="10px 10px">
        <x-button type="primary" @click="editPwd">确认修改</x-button>
    </box>
    <loading :show="showLoading"></loading>
    <toast :show.sync="showError" type="cancel">{{txtError}}</toast>
    <toast :show.sync="showSuccess">修改成功，请重新登录</toast>
    <confirm confirm-text="确定" cancel-text="取消" :show.sync="confirm" title="消息" @on-confirm="onConfirm">
      <p style="text-align:center;">确认要修改密码吗？</p>
    </confirm>



  </div>
</template>

<script>
import { Card, Toast, Flexbox, FlexboxItem, Confirm, XInput, GroupTitle, Group, XButton, Cell, XHeader, Box, Loading } from 'vux/src/components'

export default {
  components: {
    Card,
    Confirm,
    Toast,
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
      showLoading: false,
      showError: false,
      txtError: '',
      showSuccess: false,
      confirm: false
    } 
  },
  methods: {
    editPwd () {
      const pwd_old = document.getElementsByName('pwd-old')[0]
      const pwd_new = document.getElementsByName('pwd-new')[0]
      const pwd_repeat = document.getElementsByName('pwd-repeat')[0]
      if (pwd_old.value=='') {
        this.txtError = '请输入旧密码'
        this.showError = true
        pwd_old.focus()
      }else if(pwd_new.value.length<6){
        this.txtError = '请输入6位以上新密码'
        this.showError = true
        pwd_new.focus()
      }else if(pwd_repeat.value!=pwd_new.value){
        this.txtError = '重复密码不正确'
        this.showError = true
        pwd_repeat.focus()
      }else{
        this.confirm = true
      }
    },
    onConfirm () {
      const pwd_old = document.getElementsByName('pwd-old')[0].value
      const pwd_new = document.getElementsByName('pwd-new')[0].value
      const pwd_repeat = document.getElementsByName('pwd-repeat')[0].value
      const _this = this

      _this.showLoading = true
      setTimeout(() => {
        this.$http.post(this.$http.options.root+'/api/auth/modify',{
          oldpassword: pwd_old,
          newpassword: pwd_new,
          repassword: pwd_repeat
        })
        .then(response => {
          const rsp = response.data
          if(rsp.code == 0){
            _this.showSuccess = true
            setTimeout(() => {
              this.$http.get(this.$http.options.root+'/api/auth/logout')
              .then(response => {
                localStorage.clear()
                this.$router.go('/login')
              })
              .catch(console.log)
            }, 1000)
          }else if (rsp.code = 1){
            _this.txtError = rsp.message
            _this.showError = true
          }
          _this.showLoading = false
        })
        .catch(console.log)
      }, 500)
    }
  }
}
</script>
