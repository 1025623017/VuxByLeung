<template>
	<div>
    <style>
      .vux-slider > .vux-swiper {
        overflow-y: auto;
      }
      .vux-slider {
        padding-top: 45px;
      }
      .vux-tab {
        z-index: 999;
      }
      .vux-circle-content {
        top: 47%;
      }
      .weui_panel {
        min-height: auto;
      }
      .weui_panel,
      .weui_panel_access {
        margin-top: 0;
        text-align: center;
      }
      .card-padding {
        padding-left: 0;
      }
    </style>


		<x-header :left-options="{showBack: false}">
      <a slot="left" v-link="{ path: '/dashboard' }"><i class="fa fa-bars fa-lg"></i>&nbsp;菜单</a>
      数据统计&nbsp;&nbsp;
      <a slot="right" @click="logout">退出</a>
    </x-header>

    <tab :line-width="3" :index.sync="index">
      <tab-item class="vux-center">感恩节</tab-item>
      <tab-item class="vux-center">一周统计</tab-item>
      <tab-item class="vux-center">分享收益</tab-item>
      <tab-item class="vux-center">小店收益</tab-item>
      <tab-item class="vux-center">全场八折</tab-item>
    </tab>

    <swiper :index.sync="index" :threshold="150" :show-dots="false" @on-index-change="getList(index)">
      <swiper-item>
        <card :header="{title: ''}" style="margin-top: 0;padding-top: 10px;background: #4BADC3;color: #fff;">
          <div slot="content" class="card-flex card-content dashboard-card">
            <div>
              <span>销售金额(元)</span>
              <br/>
              <span style="font-size: 3rem;">{{thankgiving.all_sale_money}}</span>
            </div>
          </div>
          <div slot="content" class="card-flex card-content dashboard-card">
            <div style="border-right: 1px #fff solid;">
              <span>优惠金额</span>
            </div>
            <div style="border-right: 1px #fff solid;">
              <span>成功支付 / 下单 数</span>
            </div>
            <div>
              <span>商品访问数</span>
            </div>
          </div>
          <div slot="content" class="card-flex card-content dashboard-card" style="margin-bottom: 10px;">
            <div style="padding-top: 1rem;">
              <span style="font-size: 1.5rem;">{{thankgiving.discount}}</span>
            </div>
            <div>
              <div style="width: 70%;margin: 10px auto;">
                <circle :percent="(thankgiving.paid_order/thankgiving.all_orders)*100" :stroke-width="5" stroke-color="#fff">
                  <span>{{thankgiving.paid_order}} / {{thankgiving.all_orders}}</span>
                </circle>
              </div>
            </div>
            <div style="padding-top: 1rem;">
              <span style="font-size: 1.5rem;">{{thankgiving.tool_click}}</span>
            </div>
          </div>
        </card>
        <group title="统计详情">
          <cell is-link title="数据统计图" v-link="{ path: '/datas/charts/0' }"></cell>
        </group>
      </swiper-item>
      <swiper-item>
        <card style="font-size: 12px;" v-for="el in weekList" :header="{title: ''}">
          <flexbox slot="content" class="card-padding" style="text-align: center;">
            <flexbox-item>
              {{el[0]}}
            </flexbox-item>
            <flexbox-item>
              {{el[1]}}
            </flexbox-item>
            <flexbox-item>
              {{el[2]}}
            </flexbox-item>
            <flexbox-item>
              {{el[3]}}
            </flexbox-item>
          </flexbox>
        </card>
      </swiper-item>
      <swiper-item>
        <card :header="{title: ''}" style="padding: 32px 0;background: #0EC367;color: #fff;">
          <div slot="content" class="card-flex card-content dashboard-card">
            <div style="border-right: 1px #fff solid;">
              <center style="font-size: 1.5rem;">好友</center>
              <span>优惠券 使用 / 获取 数</span>
            </div>
            <div>
              <center style="font-size: 1.5rem;">系统</center>
              <span>优惠劵 使用 / 获取 数</span>
            </div>
          </div>
          <div slot="content" class="card-flex card-content dashboard-card">
            <div>
              <div style="width: 50%;margin: 10px auto;">
                <circle :percent="(sumList.use_friendly_voucher/sumList.friendly_voucher)*100" :stroke-width="5" stroke-color="#fff">
                  <span>{{sumList.use_friendly_voucher}} / {{sumList.friendly_voucher}}</span>
                </circle>
              </div>
            </div>
            <div>
              <div style="width: 50%;margin: 10px auto;">
                <circle :percent="(sumList.use_system_voucher/sumList.system_voucher)*100" :stroke-width="5" stroke-color="#fff">
                  <span>{{sumList.use_system_voucher}} / {{sumList.system_voucher}}</span>
                </circle>
              </div>
            </div>
          </div>
        </card>
      </swiper-item>
      <swiper-item>
        <card :header="{title: ''}" style="padding: 20px 0;background: #17B2E0;color: #fff;">
          <div slot="content" class="card-flex card-content dashboard-card">
            <div>
              <span>开通小店人数</span>
              <br/>
              <span style="font-size: 3rem;">{{sumList.distributor_count}}</span>
            </div>
          </div>
          <div slot="content" class="card-flex card-content dashboard-card">
            <div style="border-right: 1px #fff solid;">
              <span>小店下单人数</span>
            </div>
            <div>
              <span>小店支付人数</span>
            </div>
          </div>
          <div slot="content" class="card-flex card-content dashboard-card" style="margin-bottom: 10px;">
            <div>
              <span style="font-size: 1.5rem;">{{sumList.unpaid_store_voucher}}</span>
            </div>
            <div>
              <span style="font-size: 1.5rem;">{{sumList.use_store_voucher}}</span>
            </div>
          </div>
        </card>
      </swiper-item>
      <swiper-item>
        <card :header="{title: ''}" style="margin-top: 0;padding-top: 10px;background: #4BADC3;color: #fff;">
          <div slot="content" class="card-flex card-content dashboard-card">
            <div>
              <span>支付金额(元)</span>
              <br/>
              <span style="font-size: 3rem;">{{sumList.paid_money}}</span>
            </div>
          </div>
          <div slot="content" class="card-flex card-content dashboard-card">
            <div style="border-right: 1px #fff solid;">
              <span>优惠金额</span>
            </div>
            <div style="border-right: 1px #fff solid;">
              <span>成功支付 / 下单 数</span>
            </div>
            <div>
              <span>商品访问数</span>
            </div>
          </div>
          <div slot="content" class="card-flex card-content dashboard-card" style="margin-bottom: 10px;">
            <div style="padding-top: 1rem;">
              <span style="font-size: 1.5rem;">{{sumList.discount}}</span>
            </div>
            <div>
              <div style="width: 70%;margin: 10px auto;">
                <circle :percent="(sumList.paid_order/sumList.unpaid_order)*100" :stroke-width="5" stroke-color="#fff">
                  <span>{{sumList.paid_order}} / {{sumList.unpaid_order}}</span>
                </circle>
              </div>
            </div>
            <div style="padding-top: 1rem;">
              <span style="font-size: 1.5rem;">{{sumList.access_number}}</span>
            </div>
          </div>
        </card>
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
import { Card, Circle, Icon, Confirm, Scroller, Badge, Search, Tab, TabItem, Sticky, Swiper, SwiperItem, Toast, Loading, Alert, Step, Checker, CheckerItem, Panel, StepItem, XInput, GroupTitle, Group, XButton, Cell, Flexbox, FlexboxItem, Divider, Actionsheet, XHeader, Box } from 'vux/src/components'
export default {
  components: {
    Card,
    Confirm,
    Scroller,
    Circle,
    Icon,
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
      showLoading: false,
      //错误提示
      txtError: '',
      showError: false,
      confirm: false,
      //默认页
      index: 0,
      sumList: {},
      weekList: {},
      thankgiving: {}
    }
  },
  ready () {
    //调整正文高度
    this.swiperHeight()
    this.getList()
  },
  methods: {
    swiperHeight () {
      setTimeout(() => {
        if (document.getElementsByClassName('vux-swiper').length > 0) {
          document.getElementsByClassName('vux-swiper')[0].style.height = window.screen.height - 90 + 'px'
        }
      }, 800)
    },
    getList () {
      //感恩节
      setTimeout(() => {
        this.$http.get(this.$http.options.root+'/api/dashboard/thankgiving/data')
        .then(response => {
          this.thankgiving = response.data.data
        })
      }, 500)
      //一周统计
      setTimeout(() => {
        this.$http.get(this.$http.options.root+'/api/dashboard/week/data')
        .then(response => {
          this.weekList = response.data.data
        })
      }, 500)
      //其他数据
      setTimeout(() => {
        this.$http.get(this.$http.options.root+'/api/dashboard/data/sum')
        .then(response => {
          this.sumList = response.data.data
        })
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