<template>
	<div id="detailPage">

    <x-header>
      拼团管理&nbsp;&nbsp;
    </x-header>

    <group title="拼团详情">
      <cell :title="">
        <img slot="icon" width="80" style="display:block;margin-right: 10px;" :src="tuanInfo.goods.bigpic">
        <div slot="value">
          <span style="color: #000;">{{tuanInfo.goods.chargename}}</span>
        </div>
      </cell>
      <cell title="拼团人数 / 最低开团人数">
        <div slot="value">
          <span style="color: #000;"><b style="color: #09BB07;">{{tuanInfo.joined_num}}</b> / {{tuanInfo.goods_tuan_info.threshold}}</span>
        </div>
      </cell>
      <cell title="拼团状态">
        <div slot="value">
          <span style="color: #10AEFF;" v-if="tuanInfo.status=='PROCESSING'">拼团中</span>
          <span style="color: #09BB07;" v-if="tuanInfo.status=='SETTLED'">拼团成功</span>
          <span style="color: #EC5050;" v-if="tuanInfo.status=='CANCELED'">拼团失败</span>
        </div>
      </cell>
      <cell title="查看商品详情" is-link v-link="{ path: '/goods/'+tuanInfo.goods.id }"></cell>
    </group>

    <group class="tuan-people" title="拼团成员">
      <card style="font-size: 12px;padding-top: 5px;" :footer="{title:'查看', link:'/tuans/orders/' + el.id}" v-for="el in tuanInfo.orders" :header="{title: '订单号：'+el.orderid}">
        <flexbox slot="content" class="card-padding">
          <flexbox-item>
            <div>
              {{el.name}}
              <span>
                （联系电话：{{el.mobile}}）
              </span>
            </div>
            <div style="padding: 10px 0;">
              地址：{{el.address}}
            </div>
            <div>
              订单状态：
              <span style="color: orange;" v-if="el.status=='UNPAID' || el.status==''">未支付</span>
              <span style="color: green;" v-if="el.status=='PAID'">已支付</span>
              <span style="color: green;" v-if="el.status=='SENT'">已发货</span>
              <span style="color: blue;" v-if="el.status=='SIGNED'">已签收</span>
              <span style="color: black;" v-if="el.status=='SETTLED'">已结算</span>
              <span style="color: red;" v-if="el.status=='CANCELED'">取消订单</span>
            </div>
          </flexbox-item>
        </flexbox>
      </card>
    </group>
    <group>
    </group>

    <div id="pageBtn" v-if="tuanInfo.status == 'PROCESSING'">
      <flexbox>
        <flexbox-item>
          <box gap="10px 0px 10px 5px">
            <x-button type="primary" @click="addTuan=true">成团</x-button>
          </box>
        </flexbox-item>
        <flexbox-item>
          <box gap="10px 5px 10px 0px">
            <x-button plain type="warn" @click="delTuan=true">取消拼团</x-button>
          </box>
        </flexbox-item>
      </flexbox>
    </div>



    <confirm :show.sync="addTuan" title="成团" confirm-text="确定" cancel-text="取消" @on-confirm="onAdd">
      <p v-if="addTuan" style="text-align:center;">是否让 <span style="color: #04BE02;">{{tuanInfo.goods.chargename}}</span> 成团？</p>
    </confirm>
    <confirm :show.sync="delTuan" title="取消拼团" confirm-text="确定" cancel-text="取消" @on-confirm="onDel">
      <p v-if="delTuan" style="text-align:center;">是否取消 <span style="color: #EC5050;">{{tuanInfo.goods.chargename}}</span> 的拼团？</p>
      <p style="text-align: center;font-size: 0.8rem;color: #EC5050;">(退团以后团内的订单将自动取消，并进行退款)</p>
    </confirm>
    <loading :show="showLoading"></loading>
    <toast :show.sync="showError">{{txtError}}</toast>

	</div>
</template>

<script>
import { Confirm, Card, Switch, Timeline, TimelineItem, Scroller, Badge, Search, Tab, TabItem, Sticky, Swiper, SwiperItem, Toast, Loading, Alert, Step, Checker, CheckerItem, Panel, StepItem, XInput, GroupTitle, Group, XButton, Cell, Flexbox, FlexboxItem, Divider, Actionsheet, XHeader, Box } from 'vux/src/components'
export default {
  components: {
    Confirm,
    Card,
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
      txtError: '',
      showError: false,
      addTuan: false,
      delTuan: false,
      //订单信息
      tuanInfo: {}
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
        //订单信息
        this.$http.get(this.$http.options.root+'/api/shop/tuans/'+this.$route.params.id)
        .then(response => {
          if (response.data.code == 2) {
            this.txtError = response.data.message
            this.showError = true
            setTimeout(() => {
              this.$router.go('/login')
            }, 800)
          }else{
            const rsp = response.data.data
            _this.tuanInfo = rsp
            _this.showLoading = false
          }
          this.editHeight()
        })
        .catch(console.log)
      }, 500)
    },
    onAdd () {
      this.showLoading = true
      setTimeout(() => {
        this.$http.post(this.$http.options.root+'/api/shop/tuans/'+this.$route.params.id+'/success')
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
          this.getDetail()
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
          this.getDetail()
        })
        .catch(console.log)
      }, 500)
    }
  }
}
</script>
