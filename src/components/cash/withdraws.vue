<template>
  <style>
    .card-padding {
      padding: 5px 15px;
    }
  </style>
	<div>

		<x-header>提现记录&nbsp;&nbsp;</x-header>

    <card style="font-size: 12px;" :header="{title: ''}" v-for="el in withdrawList" track-by="$index" :footer="{title:'查看',link: '/cash/withdraws/'+el.id }">
      <flexbox slot="content" class="card-padding">
        <flexbox-item>
          退款金额：<i class="fa fa-rmb" style="font-size: 0.8rem;color: #000;">&nbsp;{{el.refund}}</i>
        </flexbox-item>
        <flexbox-item>
          提现金额：<i class="fa fa-rmb" style="font-size: 0.8rem;color: #04BE02;">&nbsp;{{el.value}}</i>
        </flexbox-item>
      </flexbox>
      <flexbox slot="content" class="card-padding">
        <flexbox-item>
          管理费：<i class="fa fa-rmb" style="font-size: 0.8rem;color: #000;">&nbsp;{{el.fee}}</i>
        </flexbox-item>
        <flexbox-item>
          提现时间：{{el.dateline * 1000 | date '%F'}}
        </flexbox-item>
      </flexbox>
    </card>
    <box gap="10px 10px">
      <x-button v-if="last == false" type="primary" style="font-size: 14px;" @click="getCash(nextPageUrl)">点击加载更多</x-button>
      <divider v-else>加载完成</divider>
    </box>

    <loading :show="showLoading"></loading>
    <toast :show.sync="showError" type="cancel">{{txtError}}</toast>

	</div>
</template>

<script>
import { Card, Confirm, Scroller, Badge, Search, Tab, TabItem, Sticky, Swiper, SwiperItem, Toast, Loading, Alert, Step, Checker, CheckerItem, Panel, StepItem, XInput, GroupTitle, Group, XButton, Cell, Flexbox, FlexboxItem, Divider, Actionsheet, XHeader, Box } from 'vux/src/components'
export default {
  components: {
    Card,
    Confirm,
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
      atf: true,
      txtError: '',
      showError: false,
      confirm: false,
      showLoading: false,
      //默认标签
      index: 0,
      //列表数据
      withdrawList: [],
      //搜索关键字
      key: '',
      searchTimer: null,
      nextPageUrl: '',
      //是否最后一页
      last: false
    }
  },
  ready () {
    this.getCash()
  },
  methods: {
    getCash (url) {
      this.showLoading = true
      setTimeout(() => {
        if (url == undefined) {
          this.$http.get(this.$http.options.root+'/api/shop/cash/withdraw')
          .then(response => {
            const rsp = response.data.data.withdraw_logs
            this.withdrawList = rsp.data
            this.nextPageUrl = rsp.next_page_url
            if (rsp.next_page_url == null) {
              this.last = true
            }else{
              this.last = false
            }
            this.showLoading = false
          })
          .catch(console.log)
        }else{
          this.$http.get(url)
          .then(response => {
            const rsp = response.data.data.withdraw_logs
            this.nextPageUrl = rsp.next_page_url
            if (rsp.next_page_url == null) {
              for(const i in rsp.data){
                this.withdrawList.push(rsp.data[i])
              }
              this.last = true
            }else{
              for(const i in rsp.data){
                this.withdrawList.push(rsp.data[i])
              }
              this.last = false
            }
            this.showLoading = false
          })
          .catch(console.log)
        }
      }, 500)
    },
  }
}
</script>
