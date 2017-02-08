<template>
	<div id="detailPage">

    <x-header>
      单购订单&nbsp;&nbsp;
    </x-header>

    <group title="物流信息">
      <cell title="订单号">
        <div slot="value">
          <span style="color: #000;">{{detailList.order_no}}</span>
        </div>
      </cell>
      <cell title="订单状态">
        <div slot="value">
          <span style="color: green;">
            {{status}}
          </span>
        </div>
      </cell>
      <cell title="物流详情" v-if="status!='待发货'" @click="btnShow">
        <span v-if="detailList.shipper_name!='亲自送货'">点击查看<span class="fa fa-angle-down"></span></span>
        <span v-else>{{detailList.shipper_name}}</span>
      </cell>
      <timeline v-if="showShip && detailList.shipper_name!='亲自送货'">
        <timeline-item v-for="(key, el) in shiplList | orderBy 'AcceptTime' -1">
          <h4 :class="[key%2 == 0 ? 'recent' : 'discent']" style="font-weight: normal;font-size: 0.9rem;">{{el.AcceptStation}}</h4>
          <p :class="[key%2 == 0 ? 'recent' : 'discent']" style="font-size: 0.8rem;margin-top: 5px;color:#7d7d7d;">{{el.AcceptTime}}</p>
        </timeline-item>
      </timeline>
      <cell title="留言" v-if="detailList.shipper_name=='亲自送货'">
        {{detailList.trackingnum}}
      </cell>
    </group>

    <group title="配送信息">
      <cell :title="'收货人：'+detailList.name">
        <div slot="value">
          <span style="color: #008cff;">{{detailList.mobile}}</span>
        </div>
      </cell>
      <cell title="收货地址" :inline-desc="detailList.address"></cell>
      <cell title="买家留言" :inline-desc="detailList.message==''?'无':detailList.message"></cell>
    </group>

    <group title="商品信息">
      <flexbox style="margin: 10px 0;font-size: 0.8rem;" v-for="el in detailList.goods_arr">
        <flexbox-item style="text-align: center;">
          <img :src="el.pic" style="max-width: 80%;height: 30px;" alt="">
        </flexbox-item>
        <flexbox-item style="overflow: hidden;text-overflow:ellipsis;display:-webkit-box; -webkit-box-orient:vertical;-webkit-line-clamp:3;">
          {{el.goods_name}}
        </flexbox-item>
        <flexbox-item>
          <div style="padding-right: 10px;overflow: hidden;text-overflow:ellipsis;display:-webkit-box; -webkit-box-orient:vertical;-webkit-line-clamp:2;">
            {{el.sku_value}}
          </div>
        </flexbox-item>
        <flexbox-item>
          <span class="fa fa-rmb"></span>
          {{el.price}}
          <b style="color: #008cff;font-size: 1.4em;">x {{el.unit_num}}</b>
        </flexbox-item>
      </flexbox>
    </group>

    <group title="支付信息">
      <cell title="商品总价">
        <div slot="value">
          <span style="color: #000;">{{detailList.goods_fee}}元</span>
        </div>
      </cell>
      <cell title="运费">
        <div slot="value">
          <span style="color: #000;">{{detailList.shipping_fee}}元</span>
        </div>
      </cell>
      <cell title="总计">
        <div slot="value">
          <span style="color: #04BE02;">{{detailList.shipping_fee*1+detailList.goods_fee*1}}元</span>
        </div>
      </cell>
    </group>

    <div id="pageBtn" v-if="detailList.status == 'PAID'">
      <box gap="10px 10px">
        <x-button type="primary" @click="btnShip">发货</x-button>
      </box>
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
      status: '订单状态',
      //订单信息
      detailList: {},
      detailListGoods: {},
      //物流信息
      shiplList: {},
      //显示物流
      showShip: false
    } 
  },
  ready () {
    this.getDetail()
  },
  methods: {
    editHeight () {
      setTimeout(() => {
        if (document.getElementById('pageBtn') != null) {
          const pdBottom = document.getElementById('pageBtn').offsetHeight
          document.getElementById('detailPage').style.paddingBottom = pdBottom+'px'
        }
      }, 800)
    },
    getDetail () {
      setTimeout(() => {
        const _this = this
        this.showLoading = true
        //物流信息
        this.$http.get(this.$http.options.root+'/api/shop/orders/shipper/logistics/'+this.$route.params.id)
        .then(response => {
          if (response.data.code == 2) {
            _this.txtError = response.data.message
            _this.showError = true
            setTimeout(() => {
              this.$router.go('/login')
            }, 800)
          }else{
            const rsp = response.data.data[0].traces
            _this.shiplList = rsp
          }
        })
        .catch(console.log)

        //订单信息
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
            _this.detailList = rsp
            _this.detailListGoods = rsp.goods
            if (rsp.status == 'PAID') {
              _this.status = '待发货'
            }
            if (rsp.status == 'SENT') {
              _this.status = '已发货'
            }
            if (rsp.status == 'CANCELED') {
              _this.status = '已取消订单'
            }
            if (rsp.status == 'SIGNED') {
              _this.status = '已签收'
            }
            this.editHeight()
            _this.showLoading = false
          }
        })
        .catch(console.log)
      }, 500)
    },
    btnShow () {
      this.showShip = !this.showShip
    },
    btnShip () {
      this.$router.go('/orders/' + this.$route.params.id + '/ship')
    }
  }
}
</script>
