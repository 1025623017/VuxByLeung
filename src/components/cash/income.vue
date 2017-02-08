<template>
  <style>
    .card-padding {
      padding: 5px 15px;
    }
  </style>
	<div>

		<x-header>收支记录&nbsp;&nbsp;</x-header>

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
            const rsp = response.data.data.logs
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
            const rsp = response.data.data.logs
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
