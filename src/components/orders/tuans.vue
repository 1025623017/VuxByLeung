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
      拼团管理&nbsp;&nbsp;
      <a slot="right" @click="logout">退出</a>
    </x-header>

    <tab @on-index-change="getList(index, '', 'click')" :line-width="3" :index.sync="index">
      <tab-item class="vux-center badgeWrap">
        拼团中
        <span v-if="index==0" class="badgeNum corner">
          {{badgeNum}}
        </span>
      </tab-item>
      <tab-item class="vux-center badgeWrap">
        拼团成功
        <span v-if="index==1" class="badgeNum corner">
          {{badgeNum}}
        </span>
      </tab-item>
      <tab-item class="vux-center badgeWrap">
        拼团失败
        <span v-if="index==2" class="badgeNum corner">
          {{badgeNum}}
        </span>
      </tab-item>
    </tab>

    <search :auto-fixed="atf" top="2px" style="z-index: 999999;" @on-change="searchBy" @on-cancel="searchBy" placeholder="ID、商品名、订单号、姓名或手机"></search>

    <style>
      .vux-search-fixed {
        height: 0;
      }
    </style>

    <!-- <div class="tab-item" v-show="index==0">
      <card style="font-size: 12px;padding-top: 5px;" :footer="{title:'查看', link:'/shop/tuans/'+el.id}" v-for="el in dataList" :header="{title: ''}">
        <flexbox slot="content" class="card-padding">
          <flexbox-item>
            <img style="width: 50%;margin-top: 10px;" :src="el.goods.bigpic" alt="">
          </flexbox-item>
          <flexbox-item style="position: relative;left: -70px;">
            <div>
              {{el.goods.chargename}}
            </div>
            <div style="padding: 5px 0;">
              {{el.joined_num}} / {{el.goods_tuan_info.threshold}} 人
              <span style="color: #EC5050;" v-if="el.shippable == 0">不可发货</span>
              <span style="color: #09BB07;" v-else>可发货</span>
            </div>
            <div>
              开团时间：{{el.dateline * 1000 | date '%F'}}
            </div>
          </flexbox-item>
          <x-button mini plain @click="showApproved(el.id,el.goods.chargename)" type="default" class="more">●●●</x-button>
        </flexbox>
      </card>
      <box gap="10px 10px">
        <x-button v-if="last == false" type="primary" style="font-size: 14px;" @click="getList(index, nextPageUrl, 'click')">点击加载更多</x-button>
        <divider v-else>加载完成</divider>
        <br>
      </box>
    </div>
    <div class="tab-item" v-show="index==1">
      <card style="font-size: 12px;padding-top: 5px;" :footer="{title:'查看', link:'/shop/tuans/'+el.id}" v-for="el in dataList" :header="{title: ''}">
        <flexbox slot="content" class="card-padding">
          <flexbox-item>
            <img style="width: 50%;margin-top: 10px;" :src="el.goods.bigpic" alt="">
          </flexbox-item>
          <flexbox-item style="position: relative;left: -70px;">
            <div>
              {{el.goods.chargename}}
            </div>
            <div style="padding: 5px 0;">
              {{el.joined_num}} / {{el.goods_tuan_info.threshold}} 人
              <span style="color: #EC5050;" v-if="el.shippable == 0">不可发货</span>
              <span style="color: #09BB07;" v-else>可发货</span>
            </div>
            <div>
              开团时间：{{el.dateline * 1000 | date '%F'}}
            </div>
          </flexbox-item>
          <x-button mini plain @click="showApproved(el.id,el.goods.chargename)" type="default" class="more">●●●</x-button>
        </flexbox>
      </card>
      <box gap="10px 10px">
        <x-button v-if="last == false" type="primary" style="font-size: 14px;" @click="getList(index, nextPageUrl, 'click')">点击加载更多</x-button>
        <divider v-else>加载完成</divider>
        <br>
      </box>
    </div>
    <div class="tab-item" v-show="index==2">
      <card style="font-size: 12px;padding-top: 5px;" :footer="{title:'查看', link:'/shop/tuans/'+el.id}" v-for="el in dataList" :header="{title: ''}">
        <flexbox slot="content" class="card-padding">
          <flexbox-item>
            <img style="width: 50%;margin-top: 10px;" :src="el.goods.bigpic" alt="">
          </flexbox-item>
          <flexbox-item style="position: relative;left: -70px;">
            <div>
              {{el.goods.chargename}}
            </div>
            <div style="padding: 5px 0;">
              {{el.joined_num}} / {{el.goods_tuan_info.threshold}} 人
              <span style="color: #EC5050;" v-if="el.shippable == 0">不可发货</span>
              <span style="color: #09BB07;" v-else>可发货</span>
            </div>
            <div>
              开团时间：{{el.dateline * 1000 | date '%F'}}
            </div>
          </flexbox-item>
          <x-button mini plain @click="showApproved(el.id,el.goods.chargename)" type="default" class="more">●●●</x-button>
        </flexbox>
      </card>
      <box gap="10px 10px">
        <x-button v-if="last == false" type="primary" style="font-size: 14px;" @click="getList(index, nextPageUrl, 'click')">点击加载更多</x-button>
        <divider v-else>加载完成</divider>
        <br>
      </box>
    </div> -->

    <swiper :index.sync="index" :threshold="150" :show-dots="false" @on-index-change="getList(index, '', 'click')">
      <swiper-item>
        <card style="font-size: 12px;padding-top: 5px;" :footer="{title:'查看', link:'/shop/tuans/'+el.id}" v-for="el in dataList" :header="{title: ''}">
          <flexbox slot="content" class="card-padding">
            <flexbox-item>
              <img style="width: 50%;margin-top: 10px;" :src="el.goods.bigpic" alt="">
            </flexbox-item>
            <flexbox-item style="position: relative;left: -70px;">
              <div>
                {{el.goods.chargename}}
              </div>
              <div style="padding: 5px 0;">
                {{el.joined_num}} / {{el.goods_tuan_info.threshold}} 人
                <span style="color: #EC5050;" v-if="el.shippable == 0">不可发货</span>
                <span style="color: #09BB07;" v-else>可发货</span>
              </div>
              <div>
                开团时间：{{el.dateline * 1000 | date '%F'}}
              </div>
            </flexbox-item>
            <x-button mini plain @click="showApproved(el.id,el.goods.chargename)" type="default" class="more">●●●</x-button>
          </flexbox>
        </card>
        <box gap="10px 10px">
          <x-button v-if="last == false" type="primary" style="font-size: 14px;" @click="getList(index, nextPageUrl, 'click')">点击加载更多</x-button>
          <divider v-else>加载完成</divider>
          <br>
        </box>
      </swiper-item>
      <swiper-item>
        <card style="font-size: 12px;padding-top: 5px;" :footer="{title:'查看', link:'/shop/tuans/'+el.id}" v-for="el in dataList" :header="{title: ''}">
          <flexbox slot="content" class="card-padding">
            <flexbox-item>
              <img style="width: 50%;margin-top: 10px;" :src="el.goods.bigpic" alt="">
            </flexbox-item>
            <flexbox-item style="position: relative;left: -70px;">
              <div>
                {{el.goods.chargename}}
              </div>
              <div style="padding: 5px 0;">
                {{el.joined_num}} / {{el.goods_tuan_info.threshold}} 人
                <span style="color: #EC5050;" v-if="el.shippable == 0">不可发货</span>
                <span style="color: #09BB07;" v-else>可发货</span>
              </div>
              <div>
                开团时间：{{el.dateline * 1000 | date '%F'}}
              </div>
            </flexbox-item>
          </flexbox>
        </card>
        <box gap="10px 10px">
          <x-button v-if="last == false" type="primary" style="font-size: 14px;" @click="getList(index, nextPageUrl, 'click')">点击加载更多</x-button>
          <divider v-else>加载完成</divider>
          <br>
        </box>
      </swiper-item>
      <swiper-item>
        <card style="font-size: 12px;padding-top: 5px;" :footer="{title:'查看', link:'/shop/tuans/'+el.id}" v-for="el in dataList" :header="{title: ''}">
          <flexbox slot="content" class="card-padding">
            <flexbox-item>
              <img style="width: 50%;margin-top: 10px;" :src="el.goods.bigpic" alt="">
            </flexbox-item>
            <flexbox-item style="position: relative;left: -70px;">
              <div>
                {{el.goods.chargename}}
              </div>
              <div style="padding: 5px 0;">
                {{el.joined_num}} / {{el.goods_tuan_info.threshold}} 人
                <span style="color: #EC5050;" v-if="el.shippable == 0">不可发货</span>
                <span style="color: #09BB07;" v-else>可发货</span>
              </div>
              <div>
                开团时间：{{el.dateline * 1000 | date '%F'}}
              </div>
            </flexbox-item>
          </flexbox>
        </card>
        <box gap="10px 10px">
          <x-button v-if="last == false" type="primary" style="font-size: 14px;" @click="getList(index, nextPageUrl, 'click')">点击加载更多</x-button>
          <divider v-else>加载完成</divider>
          <br>
        </box>
      </swiper-item>
    </swiper>

    <loading :show="showLoading"></loading>
    <toast :show.sync="showError">{{txtError}}</toast>
    <confirm :show.sync="confirm" title="消息" confirm-text="确定" cancel-text="取消" @on-confirm="onConfirm">
      <p style="text-align:center;">是否退出帐号？</p>
    </confirm>
    <confirm :show.sync="addTuan" title="成团" confirm-text="确定" cancel-text="取消" @on-confirm="onAdd">
      <p v-if="addTuan" style="text-align:center;">是否让 <span style="color: #04BE02;">{{_name}}</span> 成团？</p>
    </confirm>
    <confirm :show.sync="delTuan" title="取消拼团" confirm-text="确定" cancel-text="取消" @on-confirm="onDel">
      <p v-if="delTuan" style="text-align:center;">是否取消 <span style="color: #EC5050;">{{_name}}</span> 的拼团？</p>
      <p style="text-align: center;font-size: 0.8rem;color: #EC5050;">(退团以后团内的订单将自动取消，并进行退款)</p>
    </confirm>
    <actionsheet :show.sync="showSheet" :menus="menus" :cancel-text="'取消'" @on-click-menu="approved" show-cancel></actionsheet>


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
      showSheet: false,
      addTuan: false,
      delTuan: false,
      menus: {
        add: '<span style="color: #04BE02">成团</span>',
        del: '<span style="color: #EC5050">取消拼团</span>'
      },
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
      //预存操作中团id和商品名
      _id: '',
      _name: ''
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
      const _this = this
      this.dataList = []
      setTimeout(() => {
        var status = ''
        if (index == 0) {
          status = 'PROCESSING'
        }
        if (index == 1) {
          status = 'SETTLED'
        }
        if (index == 2) {
          status = 'CANCELED'
        }
        clearTimeout(this.searchTimer)
        this.searchTimer = setTimeout(() => {
          this.showLoading = true
          if (url == undefined || url == '') {
            this.$http.get(this.$http.options.root+'/api/shop/tuans',{
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
    showApproved (_id,_name) {
      this._id = _id
      this._name = _name
      this.showSheet = true
    },
    approved (key) {
      if (key=='add') {
        this.addTuan = true
      }else if(key=='del'){
        this.delTuan = true
      }
    },
    onAdd () {
      this.showLoading = true
      setTimeout(() => {
        this.$http.post(this.$http.options.root+'/api/shop/tuans/'+this._id+'/success')
        .then(response => {
          if (response.data.code==0) {
            this.txtError = '拼团成功'
            this.showError = true
            this.showLoading = false
          }else{
            this.txtError = response.data.message
            this.showError = true
            this.showLoading = false
          }
          this.getList(0, '', 'click')
        })
        .catch(console.log)
      }, 500)
    },
    onDel () {
      this.showLoading = true
      setTimeout(() => {
        this.$http.post(this.$http.options.root+'/api/shop/tuans/'+this._id+'/close')
        .then(response => {
          if (response.data.code==0) {
            this.txtError = '取消成功'
            this.showError = true
            this.showLoading = false
          }else{
            this.txtError = response.data.message
            this.showError = true
            this.showLoading = false
          }
          this.getList(0, '', 'click')
        })
        .catch(console.log)
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
.popover-demo-content {
  padding: 5px 10px;
}
</style>
