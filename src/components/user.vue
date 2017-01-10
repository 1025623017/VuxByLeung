<template>
  <div>

    <x-header>
      我的信息&nbsp;&nbsp;
    </x-header>



    <group title="入驻信息">
      <cell title="姓名">{{userInfo.principal}}</cell>
      <cell title="电话">{{userInfo.principalmobile}}</cell>
      <cell title="公司">{{userInfo.name?userInfo.name:'无'}}</cell>
      <cell title="身份证">{{userInfo.card_id}}</cell>
    </group>

    <!-- <group title="身份证">
      <flexbox>
        <flexbox-Item style="text-align: center;">
          <img style="width: 90%;" :src="userInfo.card_front" alt="身份证正面">
        </flexbox-Item>
        <flexbox-Item style="text-align: center;">
          <img style="width: 90%;" :src="userInfo.card_opposite" alt="身份证反面">
        </flexbox-Item>
      </flexbox>
    </group>

    <group title="担保人">
      <cell title="姓名">{{userInfo.guarantor.name}}</cell>
      <cell title="联系电话">{{userInfo.guarantor.mobile}}</cell>
      <cell title="身份证">{{userInfo.guarantor.card_id}}</cell>
    </group> -->

    <group title="推荐人">
      <cell title="姓名">{{userInfo.recommend_fuckname}}{{userInfo.recommend_name}}</cell>
      <cell title="电话">{{userInfo.recommend_mobile}}</cell>
    </group>

    <group v-if="userInfo.account" title="结算账户">
      <cell v-if="userInfo.account.default_account=='WECHAT'" title="默认账户类型">微信</cell>
      <cell v-if="userInfo.account.default_account=='ALIPAY'" title="默认账户类型">支付宝</cell>
      <cell v-if="userInfo.account.default_account=='BANK'" title="默认账户类型">银行卡</cell>

      <cell v-if="userInfo.account.default_account=='ALIPAY'" title="账户ID">{{userInfo.account.alipay_id}}</cell>
      <cell v-if="userInfo.account.default_account=='BANK'" title="账户ID">{{userInfo.account.bank_id}}</cell>
    </group>

    <box gap="20px 10px">
      <x-button type="primary" v-link="{ path: '/steps' }">修改我的信息</x-button>
      <x-button type="primary" plain v-link="{ path: '/password' }">修改密码</x-button>
    </box>

    <group>
      <cell style="font-size: 0.8rem;text-align: center;" title="有问题请联系：400 040 1707"></cell>
    </group>



    <loading :show="showLoading"></loading>
    <toast :show.sync="showError" type="cancel">{{txtError}}</toast>

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
      txtError: '',
      showError: false,
      showLoading: false,
      userInfo: {},
      confirm: false
    } 
  },
  ready () {
    this.getInfo()
  },
  methods: {
    getInfo () {
      this.showLoading = true
      setTimeout(() => {
        this.$http.get(this.$http.options.root+'/api/shop/v2/merchant')
        .then(response => {
          if (response.data.code == 2) {
            this.txtError = response.data.message
            this.showError = true
            setTimeout(() => {
              this.$router.go('/login')
            }, 800)
          }else{
            this.userInfo = response.data.data
            //保密处理
            this.userInfo.card_id = this.userInfo.card_id.substring(0,4)+'**********'+this.userInfo.card_id.substring(this.userInfo.card_id.length-4,this.userInfo.card_id.length)
            this.userInfo.principalmobile = this.userInfo.principalmobile.substring(0,3)+'****'+this.userInfo.principalmobile.substring(this.userInfo.principalmobile.length-4,this.userInfo.principalmobile.length)
            this.userInfo.recommend_mobile = this.userInfo.recommend_mobile.substring(0,3)+'****'+this.userInfo.recommend_mobile.substring(this.userInfo.recommend_mobile.length-4,this.userInfo.recommend_mobile.length)
            this.showLoading = false
          }
        })
        .catch(console.log)
      }, 500)
    }
  }
}
</script>
