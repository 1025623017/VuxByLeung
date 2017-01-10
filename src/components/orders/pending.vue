<template>
	<div>



    <x-header>
      单购问题订单&nbsp;&nbsp;
    </x-header>

    <group title="订单信息">
      <cell :title="'收货人：'+detailList.name">
        <div slot="value">
          <span style="color: #008cff;">{{detailList.mobile}}</span>
        </div>
      </cell>
      <cell title="收货地址" :inline-desc="detailList.address"></cell>
      <cell title="买家留言" :inline-desc="detailList.message==''?'无':detailList.message"></cell>
    </group>

    <group title="处理记录">
      <timeline>
        <timeline-item style="padding-bottom: 20px;" v-for="(key, el) in detailHistory | orderBy 'id' -1">
          <!-- 用户名和处理时间 -->
          <h4>
            <img :src="el.customer.headimgurl" height="25" alt="">
            <b style="position: relative;top: -10px;">{{el.customer.name}}</b>
            <span style="float: right;color: #09BB07;">{{el.dateline * 1000 | date}}</span>
          </h4>
          <!-- 内容 -->
          <div style="padding-left: 2em;">
            <!-- 友福券补偿 -->
            <div v-if="el.status=='VOUCHER'">
              <span class="commitItem" style="background: #DD5A43;" v-if="el.addon=='SELLER'">
                商家
              </span>
              <span class="commitItem" v-if="el.addon=='UFUTX'">
                友福平台
              </span>
              <b style="color: #478FCA;">补偿了友福券：<span class="fa fa-rmb"></span> {{el.addon2}}</b>
            </div>
            <!-- 退款标签 -->
            <div v-if="el.status=='REFUND'">
              <div style="font-size: 0.8rem;margin-top: 5px;">
                <div style="color: #DD5A43;">
                  <b>退款：<span class="fa fa-rmb"></span> {{el.addon * 1 + el.addon2 * 1}}</b>
                </div>
                <span class="commitItem">
                  微信：<span class="fa fa-rmb"></span> {{el.addon * 1}}
                </span>
                <span class="commitItem">
                  零钱：<span class="fa fa-rmb"></span> {{el.addon2 * 1}}
                </span>
                <span v-if="el.notice_dateline == 0" class="commitItem" style="background: #DD5A43;">
                  退款中
                </span>
                <span v-else class="commitItem" style="background: #87B87F;">
                  退款成功
                </span>
              </div>
            </div>
            <!-- 退款原因 -->
            <div style="font-size: 0.8rem;margin: 10px 0;color:#7d7d7d;">
              {{el.comment}}
            </div>
            <!-- 退款图片 -->
            <div>
              <img @click="showPic(el.pic)" :src="el.pic" v-if="el.pic" height="60" alt="图片加载失败">
            </div>
          </div>
        </timeline-item>
      </timeline>
    </group>



    <div id="imgShadow" @click="showImg=false" v-if="showImg" style="position: fixed;top:0;width:100vw;height: 100vh;background: rgba(0,0,0,0.5);">
      <div style="display: table;text-align: center;width: 100vw;height: 100vh;position: fixed;top: 0;">
        <div style="display: table-cell;margin: 0 auto;vertical-align: middle;width: 100%;height: 50%;">
          <img id="imgBig" style="width: 80vw;max-height: 75vh;color: #fff;" :src="imgBig" alt="图片加载失败"></img>
        </div>
      </div>
    </div>
    <loading :show="showLoading"></loading>
    <toast :show.sync="showError" type="cancel">{{txtError}}</toast>

	</div>
</template>

<script>
import { Switch, Timeline, TimelineItem, Scroller, Badge, Search, Tab, TabItem, Sticky, Swiper, SwiperItem, Toast, Loading, Alert, Step, Checker, CheckerItem, Panel, StepItem, XInput, GroupTitle, Group, XButton, Cell, Flexbox, FlexboxItem, Divider, Actionsheet, XHeader, Box } from 'vux/src/components'
export default {
  components: {
    Switch,
    Timeline,
    TimelineItem,
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
      showLoading: false,
      //错误提示
      txtError: '',
      showError: false,
      //显示大图
      showImg: false,
      imgBig: '图片路径',
      //订单信息
      detailList: {},
      //商品信息
      detailListGoods: {},
      //处理记录
      detailHistory: []
    }
  },
  ready () {
    this.getDetail()
  },
  methods: {
    getDetail () {
      setTimeout(() => {
        const _this = this
        this.showLoading = true
        this.$http.get(this.$http.options.root+'/api/shop/orders/'+this.$route.params.id)
        .then(response => {
          if (response.data.code == 2) {
            this.txtError = response.data.message
            this.showError = true
            setTimeout(() => {
              this.$router.go('/login')
            }, 800)
          }else{
            const rsp = response.data.data
            //订单信息
            this.detailList = rsp
            //商品信息
            this.detailListGoods = rsp.goods
            //处理记录
            this.$http.get(this.$http.options.root+'/api/shop/orders/'+this.$route.params.id+'/status')
            .then(response => {
              const rsp = response.data.data
              this.detailHistory = rsp
              this.showLoading = false
            })
            .catch(console.log)
          }
        })
        .catch(console.log)
      }, 500)
    },
    showPic (src) {
      this.showImg = true
      this.imgBig = src
    }
  }
}
</script>
<style lang="less">
  .commitItem {
    display: inline-block;
    background: #478FCA;
    margin: 2px;
    color: #fff;
    padding: 1px 5px;
  }
  .timeline-demo {
    p {
      color: #888;
      font-size: 0.8rem;
    }
    h4 {
      color: #666;
      font-weight: normal;
    }
    .recent {
      color: rgb(4, 190, 2)
    }
  }
</style>