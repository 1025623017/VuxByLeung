<template>
  <div id="detailPage">



    <x-header>订单发货</x-header>

    <group title="送货方式">
      <radio :options="shipType" :value.sync="shipTypeNow"></radio>
    </group>

    <group :class="[shipTypeNow != '亲自送货' ? 'hide' : '']" title="给买家留言">
      <x-textarea :max="200" placeholder="请填写详细信息"></x-textarea>
    </group>

    <group :class="[shipTypeNow == '亲自送货' ? 'hide' : '']" title="选择快递">
      <cell title="快递公司" @click="showPop = true" is-link>{{shipperNowName}}</cell>
    </group>

    <group :class="[shipTypeNow == '亲自送货' ? 'hide' : '']" title="快递单号">
      <x-input title="快递单号" :required="false" name="orderId" placeholder="请输入订单号" keyboard="number">
        <x-button type="primary" mini @click="addOrder++">新增单号</x-button>
      </x-input>
      <x-input v-for="el in addOrder" title="追加单号" :required="false" name="newOrder" placeholder="请输入订单号" keyboard="number"></x-input>
    </group>

    <popup :show.sync="showPop">
      <div>
        <search @result-click="resultClick" style="z-index: 999999;" @on-change="getResult" :results="results" :value.sync="keyword" top="46px" placeholder="搜索快递公司"></search>
        <style>
          #search_show {
            height: 75vh;
          }
        </style>
        <picker :data='slidelist' :value.sync='shipperNow' @on-change='changeShippers'></picker>
        <box gap="10px 10px">
          <x-button type="primary" @click="showPop = false">确定</x-button>
        </box>
      </div>
    </popup>
    <input v-model="shippersNum" style="position: fixed;top:-999px;" id="temp">



    <!-- 发货和提示 -->
    <div id="pageBtn" style="z-index: 1;">
      <box gap="10px 10px">
        <x-button type="primary" @click="btnSend">发货</x-button>
      </box>
    </div>
    <confirm confirm-text="确定" cancel-text="取消" :show.sync="confirm" title="消息" @on-confirm="onConfirm">
      <p style="text-align:center;">确认发货？</p>
    </confirm>

    <loading :show="showLoading"></loading>
    <toast :show.sync="showError" type="cancel">{{txtError}}</toast>
    <toast :show.sync="showSuccrss">发货成功</toast>



  </div>
</template>

<script>
import { XTextarea, Popup, Confirm, Picker, Radio, Switch, Search, Tab, TabItem, Sticky, Swiper, SwiperItem, Toast, Loading, Checker, CheckerItem, Panel, XInput, GroupTitle, Group, XButton, Cell, Flexbox, FlexboxItem, Divider, Actionsheet, XHeader, Box } from 'vux/src/components'

export default {
  components: {
    XTextarea,
    Popup,
    Confirm,
    Picker,
    Radio,
    Switch,
    Search,
    Tab,
    TabItem,
    Sticky,
    Swiper,
    SwiperItem,
    Toast,
    Loading,
    Checker,
    CheckerItem,
    Panel,
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
      //提示
      txtError: '',
      showError: false,
      showLoading: false,
      showSuccrss: false,
      confirm: false,
      showPop: false,
      //关键字
      keyword: '',
      //搜索结果
      results: [],
      rsText: '',
      //送货方式
      shipType: ['亲自送货', '快递送货'],
      shipTypeNow: '快递送货',
      //所有快递公司
      shippersList: [],
      slidelist: [],
      //当前快递公司
      shipperNow: ['0'],
      //快递公司拼音
      code: '',
      //拼音对应名称
      shipperNowName: '社区自取',
      //拼音对应数字
      shippersNum: ['1'],
      addOrder: 0
    } 
  },
  watch: {
    shippersNum: {
      handler (val) {
        // this.shipperNow[0] = val
        // this.shipperNow.$set(0, val)
      },
      deep: true
    },
    changeShippers (value) {
      console.log(value)
      this.shippersNum = value[0]
    }
  },
  ready () {
    this.getShippers()
  },
  methods: {
    editHeight () {
      setTimeout(() => {
        const pdBottom = document.getElementById('pageBtn').offsetHeight
        document.getElementById('detailPage').style.paddingBottom = pdBottom+'px'
      }, 500)
    },
    //获取快递列表
    getShippers () {
      const _this = this
      _this.showLoading = true
      setTimeout(() => {
        //快递列表
        this.$http.get(this.$http.options.root+'/api/shop/shippers')
        .then(response => {

          //setTimeout(() => {
            if (localStorage.getItem('orderId') != null) {
              // document.getElementsByName('orderId')[0].value = localStorage.getItem('orderId')
            }
            if (localStorage.getItem('shippersNum') != null) {
                this.shippersNum = localStorage.getItem('shippersNum')
            }
            if (localStorage.getItem('shipper') != null) {
                this.code = localStorage.getItem('shipper')
            }
          //}, 1000)

          if (response.data.code == 2) {
            this.txtError = response.data.message
            this.showError = true
            setTimeout(() => {
              this.$router.go('/login')
            }, 800)
          }else{
            const rsp = response.data.data
            console.log(rsp)
            for (var i in rsp) {
              _this.shippersList.push({
                name: rsp[i].name,
                value: i,
                code: rsp[i].code
              })
            }
            _this.slidelist.push(_this.shippersList)
            _this.showLoading = false
          }
        })
        .catch(console.log)
        this.editHeight()
      }, 500)
    },
    changeShippers (val) {
      this.shippersNum = val[0]
      this.code = this.shippersList[val].code
      setTimeout(() => {
        this.shipperNowName = this.slidelist[0][this.shipperNow].name
      }, 500)
    },
    //搜索快递公司
    resultClick (item) {
      this.keyword = item.title
      this.shippersNum = item.id
      this.code = item.code
      document.getElementById('temp').focus()
      setTimeout(() => {
        document.getElementById('temp').blur()
      }, 100)
      this.shipperNowName = this.keyword
      this.showPop = false
    },
    getResult (val) {
      this.results = val ? this.showRs(this.keyword) : []
    },
    showRs (val) {
      let rs = []
      for (let i in this.shippersList) {
        if(this.shippersList[i].name.indexOf(val)>-1){
          rs.push({
            title: this.shippersList[i].name,
            id: this.shippersList[i].value,
            code: this.shippersList[i].code
          })
        }
      }
      return rs
    },
    //发货按钮
    btnSend () {
      this.confirm = true
    },
    //发货请求
    onConfirm () {
      const _this = this
      if (_this.shipTypeNow == '亲自送货') {
        _this.showLoading = true
        setTimeout(() => {
          this.$http.put(this.$http.options.root+'/api/shop/tuan/orders/' + this.$route.params.id + '/shipper',{
            "shipper": '__PD__',
            "trackingnum": document.getElementsByClassName('weui_textarea')[0].value
          })
          .then(response => {
            const rsp = response.data
            if(rsp.code == 0){
              _this.showSuccrss = true
            }else if (rsp.code = 1){
              _this.txtError = rsp.message
              _this.showError = true
            }
            _this.showLoading = false
            setTimeout(() => {
              _this.$router.go('/tuans/orders')
            }, 1000)
          })
          .catch(console.log)
        }, 500)
      } else {
        const orderId = document.getElementsByName('orderId')[0].value
        if (_this.shipperNowName == '') {
          _this.txtError = '请选择快递公司'
          _this.showError = true
        } else if (orderId == '') {
          _this.txtError = '请填写快递单号'
          _this.showError = true
          document.getElementsByName('orderId')[0].focus()
        } else {
          _this.showLoading = true
          setTimeout(() => {
            //追加单号
            var arr = ''
            for (const i in document.getElementsByName('newOrder')) {
              if (document.getElementsByName('newOrder')[i].value != undefined) {
                arr += '|'
                arr += document.getElementsByName('newOrder')[i].value
              }
            }
            //快递列表
            this.$http.put(this.$http.options.root+'/api/shop/tuan/orders/' + this.$route.params.id + '/shipper',{
              //公司拼音
              "shipper": _this.code,
              //单号拼接
              "trackingnum": orderId + arr
            })
            .then(response => {
              const rsp = response.data
              if(rsp.code == 0){
                localStorage.setItem('orderId',orderId)
                localStorage.setItem('shipper',_this.code)
                localStorage.setItem('shippersNum',_this.shippersNum)
                _this.showSuccrss = true
              }else if (rsp.code = 1){
                _this.txtError = rsp.message
                _this.showError = true
              }
              _this.showLoading = false
              setTimeout(() => {
                _this.$router.go('/tuans/orders')
              }, 1000)
            })
            .catch(console.log)
          }, 500)
        }
      }
    }
  }
}
</script>
