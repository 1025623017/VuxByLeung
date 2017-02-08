<template>
	<div>

		<x-header>提现详情&nbsp;&nbsp;</x-header>


    <card :header="{title: '商家信息'}" style="margin-top: 0;">
      <div slot="content" class="card-flex card-content">
        <div class="vux-1px-l vux-1px-r">
          <span class="card-name">公司(负责人)</span>
          <br/>
          {{merchant.name?merchant.name+'('+merchant.principal+')':merchant.principal}}
        </div>
        <div class="vux-1px-r">
          <span class="card-name">联系电话</span>
          <br/>
          {{merchant.principalmobile}}
        </div>
      </div>
      <div slot="content" class="card-flex card-content">
        <div class="vux-1px-l vux-1px-r">
          <span class="card-name">结算金额</span>
          <br/>
          <span style="color: #42b983;">{{merchantRsp.value}}</span>
        </div>
        <div class="vux-1px-r">
          <span class="card-name">退款金额</span>
          <br/>
          <span style="color: red;">{{merchantRsp.refund?merchantRsp.refund:0}}</span>
        </div>
        <div>
          <span class="card-name">管理费</span>
          <br/>
          {{merchantRsp.fee}}
        </div>
      </div>
    </card>



    <group title="记录列表"></group>
    <card style="font-size: 12px;" v-for="el in withdrawList" :header="{title: el.comment}">
      <flexbox slot="content" class="card-padding">
        <flexbox-item v-if="el.value>0" :style="{ color: (el.value>0?'#42b983':'red') }">
          ￥{{el.value}}
        </flexbox-item>
        <flexbox-item v-else :style="{ color: (el.value>0?'#42b983':'red') }">
          -￥{{-el.value}}
        </flexbox-item>
        <flexbox-item v-if="el.type == 1">
          拼团商品订单
        </flexbox-item>
        <flexbox-item v-if="el.type == 2">
          诚商商品订单
        </flexbox-item>
        <flexbox-item v-if="el.type == 3">
          商品管理费
        </flexbox-item>
        <flexbox-item v-if="el.type == 4">
          友福券
        </flexbox-item>
        <flexbox-item v-if="el.type == 5">
          打折
        </flexbox-item>
        <flexbox-item v-if="el.type == 6">
          退费
        </flexbox-item>
        <flexbox-item v-if="el.type == 7">
          免费派
        </flexbox-item>
        <flexbox-item>
          {{el.dateline * 1000 | date "%F"}}
        </flexbox-item>
      </flexbox>
    </card>



    <box gap="10px 10px">
      <x-button v-if="last == false" type="primary" style="font-size: 14px;" @click="getWithdraw(nextPageUrl)">加载更多...</x-button>
      <divider v-else>加载完成</divider>
    </box>



    <loading :show="showLoading"></loading>
    <toast :show.sync="showError" type="cancel">{{txtError}}</toast>
    <confirm :show.sync="confirm" title="消息" confirm-text="确定" cancel-text="取消" @on-confirm="onConfirm">
      <p style="text-align:center;">是否退出帐号？</p>
    </confirm>

	</div>
</template>

<script>
import { Card, Confirm, Scroller, Badge, Search, Tab, TabItem, Sticky, Swiper, SwiperItem, Toast, Loading, Alert, Step, Checker, CheckerItem, Panel, StepItem, XInput, GroupTitle, Group, XButton, Cell, Flexbox, FlexboxItem, Divider, Actionsheet, XHeader, Box } from 'vux/src/components'
export default {
  components: {
    Confirm,
    Card,
    Scroller,
    Badge,
    Search,
    Tab,
    TabItem,
    Sticky,
    Swiper,
    SwiperItem,
    Toast,
    Loading,
    Alert, 
    Checker,
    CheckerItem,
    Panel,
    Step,
    StepItem,
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
      txtError: '',
      showError: false,
      confirm: false,
      showLoading: false,
      merchant: [],
      merchantRsp: [],
      withdrawList: [],
      nextPageUrl: '',
      //是否最后一页
      last: false
    } 
  },
  ready () {
    this.getWithdraw()
  },
  methods: {
    getWithdraw (url) {
      this.showLoading = true
      setTimeout(() => {
        if (url == undefined) {
          this.$http.get(this.$http.options.root+'/api/shop/cash/withdraw/'+this.$route.params.id)
          .then(response => {
            const rsp = response.data
            this.merchantRsp = rsp.data
            this.merchant = rsp.data.merchant
            this.nextPageUrl = rsp.data.log.next_page_url
            if (rsp.data.log.next_page_url == null) {
              this.last = true
            }else{
              this.last = false
            }
            for(const i in rsp.data.log.data){
              this.withdrawList.push(rsp.data.log.data[i])
            }
            this.showLoading = false
          })
          .catch(console.log)
        }else{
          this.$http.get(url)
          .then(response => {
            const rsp = response.data
            this.nextPageUrl = rsp.data.log.next_page_url
            if (rsp.data.log.next_page_url == null) {
              for(const i in rsp.data.log.data){
                this.withdrawList.push(rsp.data.log.data[i])
              }
              this.last = true
            }else{
              for(const i in rsp.data.log.data){
                this.withdrawList.push(rsp.data.log.data[i])
              }
              this.last = false
            }
            this.showLoading = false
            console.log(this.withdrawList)
          })
          .catch(console.log)
        }
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
