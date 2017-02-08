<template>
  <style>
    .vux-swiper,
    .vux-slider {
      overflow-y: auto!important;
    }
    .card-padding {
      padding: 5px 15px;
    }
  </style>
	<div id="listPage">



		<x-header :left-options="{showBack: false}">
      <a slot="left" v-link="{ path: '/dashboard' }"><i class="fa fa-bars fa-lg"></i>&nbsp;菜单</a>
      问题订单&nbsp;&nbsp;
      <a slot="right" @click="logout">退出</a>
    </x-header>

    <tab :line-width="3" :index.sync="index">
      <tab-item class="vux-center badgeWrap">
        待处理
        <span v-if="index==0" class="badgeNum" style="position: relative;">
          {{badgeNum}}
        </span>
      </tab-item>
      <tab-item class="vux-center">
        全部
      </tab-item>
    </tab>
    
    <search :auto-fixed="atf" top="2px" style="z-index: 999;" @on-change="searchBy" @on-cancel="searchBy" placeholder="ID、商品名、订单号、姓名或手机"></search>

    <style>
      .vux-search-fixed {
        height: 0;
      }
    </style>

    <swiper :index.sync="index" :threshold="150" :show-dots="false" @on-index-change="getList(index, '', 'click')">
      <swiper-item>
        <card style="font-size: 12px;" :footer="{title:'查看', link: (el.type=='tuan'?'/tuans':'')+'/orders/pendings/'+el.orderid}" v-for="el in dataList" :header="{title: '订单号：'+el.order_no}">
          <flexbox slot="content" class="card-padding">
          	<flexbox-item>
              <img style="width: 50%;margin-top: 10px;" :src="el.pic" alt="">
            </flexbox-item>
            <flexbox-item style="position: relative;left: -70px;">
              <div>
                {{el.name}}
              </div>
              <div style="padding: 5px 0;">
                {{el.mobile}}
              </div>
              <div>
                下单时间:{{el.dateline * 1000 | date '%F'}}
              </div>
            </flexbox-item>
            <x-button mini type="warn" @click="btnClose(el.orderid)" style="font-size: 14px;position: relative;left: -30px;">关闭处理</x-button>
          </flexbox>
        </card>
        <box gap="10px 10px">
          <x-button v-if="last == false" type="primary" style="font-size: 14px;" @click="getList(index, nextPageUrl, 'click')">点击加载更多</x-button>
          <divider v-else>加载完成</divider>
        </box>
      </swiper-item>
      <swiper-item>
        <card style="font-size: 12px;" :footer="{title:'查看', link:'/orders/pendings/'+el.orderid}" v-for="el in dataList" :header="{title: '订单号：'+el.order_no}">
          <flexbox slot="content" class="card-padding">
          	<flexbox-item>
              <img style="width: 50%;margin-top: 10px;" :src="el.pic" alt="">
            </flexbox-item>
            <flexbox-item style="position: relative;left: -70px;">
              <div>
                {{el.name}}
              </div>
              <div style="padding: 5px 0;">
                {{el.mobile}}
              </div>
              <div>
                下单时间:{{el.dateline * 1000 | date '%F'}}
              </div>
            </flexbox-item>
          </flexbox>
        </card>
        <box gap="10px 10px">
          <x-button v-if="last == false" type="primary" style="font-size: 14px;" @click="getList(index, nextPageUrl, 'click')">点击加载更多</x-button>
          <divider v-else>加载完成</divider>
        </box>
      </swiper-item>
    </swiper>

    <loading :show="showLoading"></loading>
    <toast :show.sync="showError" type="cancel">{{txtError}}</toast>
    <confirm :show.sync="confirm" title="消息" confirm-text="确定" cancel-text="取消" @on-confirm="onConfirm">
      <p style="text-align:center;">是否退出帐号？</p>
    </confirm>
    <confirm :show.sync="confirmClose" title="关闭处理" confirm-text="确定" cancel-text="取消" @on-confirm="onClose">
      <p style="text-align:center;">是否关闭处理？</p>
    </confirm>


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
      confirmClose: false,
      //默认标签
      index: 0,
      //列表数据
      dataList: [],
      //搜索关键字
      key: '',
      searchTimer: null,
      nextPageUrl: '',
      //是否最后一页
      last: false,
      //页面数据总数
      badgeNum: 0,
      //预存关闭订单id
      _id: ''
    } 
  },
  ready () {
    //调整正文高度
    this.swiperHeight()
    this.getList(0, '', 'click')
  },
  methods: {
    swiperHeight () {
      setTimeout(() => {
        if (document.getElementsByClassName('vux-swiper').length > 0) {
          document.getElementsByClassName('vux-swiper')[0].style.height = window.screen.height - 200 + 'px'
        }
      }, 800)
    },
    searchBy () {
      setTimeout(() => {
        this.key = document.getElementById('search_input').value
      }, 500)
      this.getList(this.index,'','')
    },
    //第一页
    getList (index,url,click) {
      // console.log(Swiper._options.threshold)
      const _this = this
      setTimeout(() => {
        var status = ''
        if (index == 0) {
          status = 1
        }
        if (index == 1) {
          status = ''
        }
        clearTimeout(this.searchTimer)
        this.searchTimer = setTimeout(() => {
          this.showLoading = true
          if (url == undefined || url == '') {
            this.$http.get(this.$http.options.root+'/api/shop/orders/pending',{
              params: {
                "status": status,
                "keyword": _this.key
              }
            })
            .then(response => {
              const rsp = response.data
              this.dataList = rsp.data.data
              this.nextPageUrl = rsp.data.next_page_url
              this.badgeNum = rsp.data.total
              if (rsp.data.next_page_url == null) {
                this.last = true
              }else{
                this.last = false
              }
              this.showLoading = false
            })
            .catch(console.log)
          }else{
            this.$http.get(url,{
              params: {
                "status": status,
                "keyword": _this.key
              }
            })
            .then(response => {
              const rsp = response.data
              this.nextPageUrl = rsp.data.next_page_url
              console.log(rsp.data.data)
              if (rsp.data.next_page_url == null) {
                for(const i in rsp.data.data){
                  this.dataList.push(rsp.data.data[i])
                }
                this.last = true
              }else{
                for(const i in rsp.data.data){
                  this.dataList.push(rsp.data.data[i])
                }
                this.last = false
              }
              this.showLoading = false
            })
            .catch(console.log)
          }
        }, click=='click'?0:1000)
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
    },
    btnClose (_id){
    	this._id = _id
    	this.confirmClose = true
    },
    onClose () {
      this.showLoading = true
      this.$http.put(this.$http.options.root+'/api/shop/orders/'+this._id,{
      		'pending': 0
      })
      .then(response => {
        if (response.data.code == 2) {
    			this.showLoading = false
          this.txtError = response.data.message
          this.showError = true
          setTimeout(() => {
            this.$router.go('/login')
          }, 800)
        }else{
    			this.getList(0, '', 'click')
        }
      })
      .catch(console.log)
    }
  }
}
</script>

<style lang="less">
/*切换标签置顶*/
.vux-tab {
  position: fixed;
  top: 45px;
  width: 100vw;
}
/*搜索栏被挡*/
.weui_search_bar {
  z-index: 999;
}
.weui_media_box .weui_media_desc {
  -webkit-line-clamp: 10;
}
</style>
