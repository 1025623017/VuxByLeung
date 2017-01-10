<template>
  <style>
    .vux-swiper,
    .vux-slider {
      overflow-y: auto!important;
    }
  </style>
	<div id="listPage">



		<x-header :left-options="{showBack: false}">
      <a slot="left" v-link="{ path: '/dashboard' }"><i class="fa fa-bars fa-lg"></i>&nbsp;菜单</a>
      商品列表&nbsp;&nbsp;
      <a slot="right" @click="logout">退出</a>
    </x-header>

    <tab :line-width="3" :index.sync="index">
      <tab-item class="vux-center">已上架</tab-item>
      <tab-item class="vux-center">已下架</tab-item>
    </tab>
    
    <search :auto-fixed="atf" top="2px" style="z-index: 999;" @on-change="searchBy" @on-cancel="searchBy" placeholder="商品名、简介"></search>

    <style>
      .vux-search-fixed {
        height: 0;
      }
    </style>

    <swiper :index.sync="index" :threshold="150" :show-dots="false" @on-index-change="getList(index)">
      <swiper-item>
        <card @click="linkTo(el.id)" style="font-size: 12px;" v-for="el in dataList" :header="{title: '' }">
          <flexbox slot="content" class="card-padding">
            <flexbox-item>
              <img style="width: 50%;margin-top: 10px;" :src="el.bigpic" alt="">
            </flexbox-item>
            <flexbox-item style="position: relative;left: -70px;">
              <b style="font-size: 0.8rem;">
                {{el.chargename}}
              </b>
              <div style="padding: 5px 0;">
                <span class="fa fa-rmb"></span>
                &nbsp;{{el.price}}
              </div>
              <div>
                <span class="fa fa-plus"></span>
                销量：{{el.salednum}}
              </div>
              <div style="padding: 5px 0;">
                <span class="fa fa-clock-o"></span>
                添加时间：{{el.dateline * 1000 | date '%F'}}
              </div>
            </flexbox-item>
            <x-button mini type="primary" v-link="{ path: '/tuans/orders/'+el.id }" style="font-size: 14px;position: relative;left: -30px;">
              查看
            </x-button>
          </flexbox>
        </card>
        <box gap="10px 10px">
          <x-button v-if="last == false" type="primary" style="font-size: 14px;" @click="getList(index, nextPageUrl)">点击加载更多</x-button>
          <divider v-else>加载完成</divider>
        </box>
      </swiper-item>
      <swiper-item>
        <card @click="linkTo(el.id)" style="font-size: 12px;" v-for="el in dataList" :header="{title: '' }">
          <flexbox slot="content" class="card-padding">
            <flexbox-item>
              <img style="width: 50%;margin-top: 10px;" :src="el.bigpic" alt="">
            </flexbox-item>
            <flexbox-item style="position: relative;left: -70px;">
              <b style="font-size: 0.8rem;">
                {{el.chargename}}
              </b>
              <div style="padding: 5px 0;">
                <span class="fa fa-rmb"></span>
                &nbsp;{{el.price}}
              </div>
              <div>
                <span class="fa fa-plus"></span>
                销量：{{el.salednum}}
              </div>
              <div style="padding: 5px 0;">
                <span class="fa fa-clock-o"></span>
                添加时间：{{el.dateline * 1000 | date '%F'}}
              </div>
            </flexbox-item>
            <x-button mini type="primary" v-link="{ path: '/tuans/orders/'+el.id }" style="font-size: 14px;position: relative;left: -30px;">
              查看
            </x-button>
          </flexbox>
        </card>
        <box gap="10px 10px">
          <x-button v-if="last == false" type="primary" style="font-size: 14px;" @click="getList(index, nextPageUrl)">点击加载更多</x-button>
          <divider v-else>加载完成</divider>
        </box>
        <br>
      </swiper-item>
    </swiper>

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
      dataList: [],
      //搜索关键字
      key: '',
      searchTimer: null,
      nextPageUrl: '',
      //是否最后一页
      last: false
    } 
  },
  ready () {
    //调整正文高度
    this.swiperHeight()
    this.getList(0)
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
      this.getList(this.index)
    },
    //第一页
    getList (index,url) {
      const _this = this
      _this.showLoading = true
      clearTimeout(_this.searchTimer)
      this.searchTimer = setTimeout(() => {
        var shelve = ''
        if (index == 0) {
          shelve = 1
        }
        if (index == 1) {
          shelve = 0
        }
        setTimeout(() => {
          if (url == undefined) {
            this.$http.get(this.$http.options.root+'/api/shop/goods',{
              params: {
                "shelve": shelve,
                "keyword": _this.key
              }
            })
            .then(response => {
              const rsp = response.data
              this.dataList = rsp.data.data
              this.nextPageUrl = rsp.data.next_page_url
              if (rsp.data.next_page_url == null) {
                this.last = true
              }else{
                this.last = false
              }
              _this.showLoading = false
            })
            .catch(console.log)
          }else{
            this.$http.get(url,{
              params: {
                "shelve": shelve,
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
        }, 500)
      }, 1000)
    },
    linkTo (_id) {
      location.href = this.$http.options.root+'/frontend/goods/'+_id
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
