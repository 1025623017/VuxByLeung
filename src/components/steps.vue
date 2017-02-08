<template>
	<div id="stepsPage">



		<x-header :left-options="{showBack: false}">填写入驻信息&nbsp;&nbsp;<a slot="right" @click="logout">退出</a></x-header>
        <step style="margin: 20px;" :current="step" background-color='#fbf9fe'>
          <step-item title="商家信息"></step-item>
          <step-item title="产品信息"></step-item>
          <step-item title="推荐人"></step-item>
        </step>

      <!--商家信息-->
      <div id="step1" v-if="step == 0">
        <group title="">
          <x-input title="公司名称" name="comName" placeholder="如无公司，可不填"></x-input>
          <x-input style="margin-left: 15px;" title="负责人" name="comUserName" placeholder="请输入负责人姓名"></x-input>
          <x-input title="联系电话" name="comMobile" placeholder="请输入手机号码" keyboard="number" is-type="china-mobile"></x-input>
          <x-input style="margin-left: 15px;" title="身份证" name="comCardId" placeholder="请输入身份证" keyboard="number"></x-input>
        </group>
        <br>
        <divider>上传身份证</divider>
        <flexbox>
          <flexbox-item style="text-align: center;height: 20vh;border: 3px #f2f2f2 solid;position: relative;" @click="loadFont">
            <img :src="imgFont" style="height: 100%;width: 100%;" :class="imgFont==''?'zIndex':''" alt="">
            <div style="position: absolute;top: 25%;width: 100%;color: #c7c7c7;z-index: -1;">
              <span class="fa fa-plus" style="font-size: 3em;"></span>
              <br>
              <p class="fa">请上传身份证正面</p>
            </div>
          </flexbox-item>
          <flexbox-item style="text-align: center;height: 20vh;border: 3px #f2f2f2 solid;position: relative;" @click="loadBack">
            <img :src="imgBack" style="height: 100%;width: 100%;" :class="imgBack==''?'zIndex':''" alt="">
            <div style="position: absolute;top: 25%;width: 100%;color: #c7c7c7;z-index: -1;">
              <span class="fa fa-plus" style="font-size: 3em;"></span>
              <br>
              <p class="fa">请上传身份证反面</p>
            </div>
          </flexbox-item>
        </flexbox>
      </div>


      <!--产品信息-->
      <div id="step2" v-if="step == 1">
        <panel :header="countList>0?'已添加商品':''" :footer="footer" :list="list" :type="type"></panel>
        <box v-if="countList < 15" gap="10px 10px">
          <x-button plain type="primary" @click="showEdit">+ 添加商品</x-button>
        </box>
      </div>


      <!--推荐人-->
      <div id="step3" v-if="step == 2">
        <group title="">
          <!-- <x-input title="担保人姓名" name="assureName" placeholder="请输入姓名"></x-input>
          <x-input title="担保人手机" name="assureMobile" placeholder="请输入手机号码" keyboard="number" is-type="china-mobile"></x-input>
          <x-input style="margin-left: 30px;" title="验证码" name="assureCode" :required="false" :show-clear="false" placeholder="请输入验证码" class="weui_vcode">
            <x-button slot="right" type="primary" class="btnCode" name="btnSend" @click="getCode">获取</x-button>
          </x-input>
          <x-input title="担保身份证" name="assureId" placeholder="请输入身份证"></x-input> -->
          <x-input title="推荐人姓名" :required="false" name="recommendName" placeholder="选填"></x-input>
          <x-input title="推荐人电话" :required="false" name="recommendMobile" placeholder="选填" keyboard="number" is-type="china-mobile"></x-input>
        </group>
      </div>

      <div id="pageBtn" style="left: 0;">
        
        <!--第1步-->
        <box :class="[step != 0 ? 'hide' : 'show']" gap="10px 10px">
          <x-button type="primary" @click="goToTwo">下一步</x-button>
        </box>
        
        <!--第2步-->
        <div :class="[step != 1 ? 'hide' : 'show']">
          <!--添加面板-->
          <div v-if="addPage == true">
            <group title="添加商品">
              <x-input title="产品名称" name="chargename" placeholder="请输入产品名称"></x-input>
              <x-input title="产地" name="product_place" placeholder="请输入产地"></x-input>
            </group>
            <divider>商品来源</divider>
            <checker :value.sync="goods" @on-change="showEdit" default-item-class="goods-item" selected-item-class="goods-item-selected">
              <checker-item value="self">自产</checker-item>
              <checker-item value="agent">代理</checker-item>
            </checker>
            <group>
              <input name="producer" v-if="goods == 'self'" style="display: none;"></input>
              <x-input title="生产者姓名" name="producer" v-if="goods == 'agent'" placeholder="请输入生产者姓名"></x-input>
            </group>
            <box gap="10px 10px">
              <flexbox>
                <flexbox-item>
                  <x-button type="warn" @click="cancelEdit">取消</x-button>
                </flexbox-item>
                <flexbox-item>
                  <x-button type="primary" @click="saveEdit">保存</x-button>
                </flexbox-item>
              </flexbox>
            </box>
          </div>
          <!--添加按钮-->
          <div v-if="addPage == false">
            <box gap="10px 10px">
              <flexbox>
                <flexbox-item>
                  <x-button plain type="primary" @click="backToOne">上一步</x-button>
                </flexbox-item>
                <flexbox-item>
                  <x-button type="primary" @click="goToThree">下一步</x-button>
                </flexbox-item>
              </flexbox>
            </box>
          </div>
        </div>
        
        <!--第3步-->

        <box :class="[step != 2 ? 'hide' : 'show']" gap="10px 10px">
          <flexbox>
            <flexbox-item>
              <x-button plain type="primary" @click="backToTwo">上一步</x-button>
            </flexbox-item>
            <flexbox-item>
              <x-button type="primary" @click="finish">完成</x-button>
            </flexbox-item>
          </flexbox>
        </box>
      </div>

    <loading :show="showLoading"></loading>
    <toast :show.sync="showSended" :time="3000">短信已发送</toast>
    <toast :show.sync="showError" type="cancel">{{txtError}}</toast>
    <actionsheet :show.sync="takeID" :menus="menus" show-cancel></actionsheet>
    <confirm :show.sync="confirm" title="消息" confirm-text="确定" cancel-text="取消" @on-confirm="onConfirm">
      <p style="text-align:center;">是否退出帐号？</p>
    </confirm>


	</div>
</template>

<script>
import { Confirm, Toast, Loading, Alert, Step, Checker, CheckerItem, Panel, StepItem, XInput, GroupTitle, Group, XButton, Cell, Flexbox, FlexboxItem, Divider, Actionsheet, XHeader, Box } from 'vux/src/components'
export default {
  components: {
    Confirm,
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
      localIdsFont: '',
      localIdsBack: '',
      mediaIdFont: '',
      mediaIdBack: '',
      //身份证正反面路径
      imgFont: '',
      imgBack: '',
      //已添加产品的总数
      countList: '',
      //添加修改产品信息页面
      addPage: false,
      //调用相册和相机
      takeID: false,
      menus: {
        btnCamera: '拍照',
        btnPhotos: '从相册中选择'
      },
      showLoading: false,
      //步骤
      step: 0,
      //错误提示
      txtError: '',
      showError: false,
      //添加列表数据
      type: '1',
      list: [],
      goods: 'self',
      seconds: 30,
      timer: null,
      showSuccess: false,
      confirm: false,
      hasOpenId: false
    }
  },
  ready () {
    this.wxConfig()
    this.stepHistory()
  },
  methods: {
    editHeight () {
      setTimeout(() => {
        const pdBottom = document.getElementById('pageBtn').offsetHeight
        document.getElementById('stepsPage').style.paddingBottom = pdBottom+'px'
      }, 500)
    },
    stepHistory () {
      setTimeout(() => {
        const step = localStorage.getItem('nowStep')*1
        this.step = step
        this.reloadList(this.step)
      }, 800)
    },
    wxConfig () {
      setTimeout(() => {
        //获取openid
        var arr = document.cookie.split('; ')
        for (var i = arr.length - 1; i >= 0; i--) {
          var innerArr = arr[i].split('=')
          if (innerArr[0]=='openid' && innerArr[1].length>0) {
            this.hasOpenId = true
            console.log('已有openid')
          }
          // else{
          //   if (localStorage.getItem('debug')=='false') {
          //     console.log('即将跳转到获取微信')
          //   }
          // }
        }
        if (window.location.host=='10.10.10.88:8080') {
          console.log('测试中无需跳转join')
        }else if (!this.hasOpenId) {
          location.href = '/auth/merchant/join'
        }

        //配置微信上传照片功能
        this.$http.get(this.$http.options.root+'/api/shop/merchant/wxconfig')
        .then(response => {
          // this.txtError = response.data.code
          // this.showError = true
          if (response.data.code == 2) {
            this.txtError = response.data.message
            this.showError = true
            setTimeout(() => {
              this.$router.go('/login')
            }, 800)
          }else{
            const rsp = response.data.data
            wx.config(rsp)
          }
        })
        .catch(console.log)
      }, 800)
    },
    loadFont () {
      const _this = this
      //微信相册API
      wx.chooseImage({
        count: 1,
        success: function (res) {
          _this.localIdsFont = res.localIds[0].toString()
          setTimeout(() => {
            wx.uploadImage({
              localId: _this.localIdsFont,
              success: function (res) {
                _this.mediaIdFont = res.serverId
                localStorage.setItem('mediaIdFont',_this.mediaIdFont)
                //预览图片
                //_this.imgFont = _this.localIdsFont
                setTimeout(() => {
                  _this.$http.post(_this.$http.options.root+'/api/upload',{
                    "wx_res_id": _this.mediaIdFont
                  })
                  .then(response => {
                    if (response.data.code == 2) {
                      this.txtError = response.data.message
                      this.showError = true
                      setTimeout(() => {
                        this.$router.go('/login')
                      }, 800)
                    }else{
                      const rsp = response.data.data
                      _this.imgFont = rsp
                    }
                  })
                  .catch(console.log)
                }, 500)
              },
              fail: function (error) {
                this.txtError = JSON.stringify(error)
                this.showError = true
              }
            })
          }, 100)
        },
        fail: function (res) {
          this.txtError = JSON.stringify(res)
          this.showError = true
        }
      })
    },
    loadBack () {
      const _this = this
      //微信相册API
      wx.chooseImage({
        count: 1,
        success: function (res) {
          _this.localIdsBack = res.localIds[0].toString()
          setTimeout(() => {
            wx.uploadImage({
              localId: _this.localIdsBack,
              success: function (res) {
                _this.mediaIdBack = res.serverId
                localStorage.setItem('mediaIdBack',_this.mediaIdBack)
                //预览图片
                //_this.imgBack = _this.localIdsBack
                setTimeout(() => {
                  _this.$http.post(_this.$http.options.root+'/api/upload',{
                    "wx_res_id": _this.mediaIdBack
                  })
                  .then(response => {
                    if (response.data.code == 2) {
                      this.txtError = response.data.message
                      this.showError = true
                      setTimeout(() => {
                        this.$router.go('/login')
                      }, 800)
                    }else{
                      const rsp = response.data.data
                      _this.imgBack = rsp
                    }
                  })
                  .catch(console.log)
                }, 500)
              },
              fail: function (error) {
                this.txtError = JSON.stringify(error)
                this.showError = true
              }
            })
          }, 100)
        },
        fail: function (res) {
          this.txtError = JSON.stringify(res)
          this.showError = true
        }
      })
    },
    showEdit () {
      this.addPage = true
      this.editHeight()
    },
    saveEdit () {
      const chargename = document.getElementsByName('chargename')[0].value
      const product_place = document.getElementsByName('product_place')[0].value
      const source = this.goods
      const producer = document.getElementsByName('producer')[0].value
      if (chargename == '') {
        this.txtError = '产品名称不能为空'
        this.showError = true
        document.getElementsByName('chargename')[0].focus()
      }else if(product_place == ''){
        this.txtError = '产地不能为空',
        this.showError = true
        document.getElementsByName('product_place')[0].focus()
      }else if(source == 'agent' && producer == ''){
        this.txtError = '生产者姓名不能为空',
        this.showError = true
        document.getElementsByName('producer')[0].focus()
      }else{
        this.$http.post(this.$http.options.root+'/api/shop/goods',{
          "chargename": chargename,
          "producer": producer,
          "product_place": product_place,
          "source": source
        })
        .then(response => {
          if (response.data.code == 2) {
            this.txtError = response.data.message
            this.showError = true
            setTimeout(() => {
              this.$router.go('/login')
            }, 800)
          }else{
            const rsp = response.data
            this.loadPrdList()
          }
        })
        .catch(console.log)
        this.addPage = false
      }
    },
    cancelEdit () {
      this.addPage = false
      this.editHeight()
    },
    reloadList (_step) {
      this.mediaIdFont = localStorage.getItem('mediaIdFont')
      this.mediaIdBack = localStorage.getItem('mediaIdBack')
      localStorage.setItem('nowStep',this.step)
      this.showLoading = true
      setTimeout(() => {
        this.$http.get(this.$http.options.root+'/api/shop/v2/merchant/info')
        .then(response => {
          const rsp = response.data
          console.log(rsp)
          if (rsp.code == 0) {
            if (_step == 0) {
              document.getElementsByName('comName')[0].value = rsp.data.name
              document.getElementsByName('comUserName')[0].value = rsp.data.principal
              document.getElementsByName('comMobile')[0].value = rsp.data.principalmobile
              document.getElementsByName('comCardId')[0].value = rsp.data.card_id
              this.imgFont = rsp.data.card_front
              this.imgBack = rsp.data.card_opposite
            } else if (_step == 1) {
              this.loadPrdList()
            } else if (_step == 2) {
              this.loadRecList()
            }
            this.editHeight()
          }else if(rsp.code == 1){
            console.log(rsp.code)
          }else if(rsp.code == 2){
            this.txtError = rsp.message
            this.showError = true
            localStorage.removeItem('token')
            setTimeout(() => {
              this.$router.go('/login')
            }, 800)
          }
          this.showLoading = false
        })
        .catch(console.log)
      }, 500)
    },
    goToTwo () {
      const _this = this
      const comName = document.getElementsByName('comName')[0].value
      const comUserName = document.getElementsByName('comUserName')[0].value
      const comMobile = document.getElementsByName('comMobile')[0].value
      const comCardId = document.getElementsByName('comCardId')[0].value
      const checkPhone = (/^1[3|4|5|7|8]\d{9}$/.test(comMobile))
      const checkCardId = (comCardId.length==18)
      if (comUserName == '') {
        this.txtError = '负责人不能为空'
        this.showError = true
        document.getElementsByName('comUserName')[0].focus()
      }else if(!checkPhone){
        this.txtError = '请填写正确的手机号码'
        this.showError = true
        document.getElementsByName('comMobile')[0].focus()
      }else if(!checkCardId){
        this.txtError = '请填写18位的身份证号码'
        this.showError = true
        document.getElementsByName('comCardId')[0].focus()
      }else{
        this.showLoading = true
        this.$http.post(this.$http.options.root+'/api/shop/v2/merchant/info',{
          "name": comName,
          "principal": comUserName,
          "principalmobile": comMobile,
          "card_id": comCardId,
          "card_front": _this.imgFont,
          "card_opposite": _this.imgBack
        })
        .then(response => {
          localStorage.setItem('comMobile',comMobile)
          const rsp = response.data
          if (rsp.code == 0) {
            setTimeout(() => {
              this.showLoading = false
              this.step = 1
              localStorage.setItem('nowStep',this.step)
              //回填产品信息
              this.loadPrdList()
              this.editHeight()
            }, 800)
          } else if (rsp.code == 1) {
            this.txtError = rsp.message
            this.showLoading = false
            this.showError = true
          } else if (rsp.code == 2){
            this.txtError = rsp.message
            this.showLoading = false
            this.showError = true
            setTimeout(() => {
              this.$router.go('/login')
            }, 800)
          }
        })
        .catch(console.log)
      }
    },
    goToThree () {
      this.cancelEdit()//重新调整页面高度
      if(this.countList == 0){
        this.txtError = '请添加至少一个商品'
        this.showError = true
      }else{
        this.showLoading = true
        setTimeout(() => {
          this.showLoading = false
          this.step = 2
          localStorage.setItem('nowStep',this.step)
        }, 800)
        this.loadRecList()
        this.editHeight()
      }
    },
    loadRecList () {
      this.showLoading = true
      //读取信息
      setTimeout(() => {
        this.$http.get(this.$http.options.root+'/api/shop/merchant/guarantor')
        .then(response => {
          if (response.data.code == 2) {
            this.txtError = response.data.message
            this.showError = true
            setTimeout(() => {
              this.$router.go('/login')
            }, 800)
          }else if(response.data.code == 1){
            this.txtError = response.data.message
            this.showError = true
          }else{
            const rsp = response.data
            // document.getElementsByName('assureId')[0].value = (rsp.data.card_id == undefined?'':rsp.data.card_id)
            // document.getElementsByName('assureName')[0].value = (rsp.data.name == undefined?'':rsp.data.name)
            // document.getElementsByName('assureMobile')[0].value = (rsp.data.mobile == undefined?'':rsp.data.mobile)
            document.getElementsByName('recommendName')[0].value = (rsp.data.recommend_name == undefined?'':rsp.data.recommend_name)
            document.getElementsByName('recommendMobile')[0].value = (rsp.data.recommend_mobile == undefined?'':rsp.data.recommend_mobile)
          }
          this.showLoading = false
        })
        .catch(console.log)
      },500)
    },
    finish () {
      //提交信息
      // const assureId = document.getElementsByName('assureId')[0].value
      // const assureName = document.getElementsByName('assureName')[0].value
      // const assureMobile = document.getElementsByName('assureMobile')[0].value
      // const assureCode = document.getElementsByName('assureCode')[0].value
      const recommendName = document.getElementsByName('recommendName')[0].value
      const recommendMobile = document.getElementsByName('recommendMobile')[0].value
      // const assPhone = (/^1[3|4|5|7|8]\d{9}$/.test(assureMobile))
      const recPhone = (/^1[3|4|5|7|8]\d{9}$/.test(recommendMobile))
      // if(assureName == ''){
      //   this.txtError = '担保人不能为空'
      //   this.showError = true
      //   document.getElementsByName('assureName')[0].focus()
      // }else if(!assPhone){
      //   this.txtError = '请填写正确的担保人手机'
      //   this.showError = true
      //   document.getElementsByName('assureMobile')[0].focus()
      // }else if(assureId == ''){
      //   this.txtError = '身份证不能为空'
      //   this.showError = true
      //   document.getElementsByName('assureId')[0].focus()
      // }else{
        this.showLoading = true
        this.$http.post(this.$http.options.root+'/api/shop/merchant/guarantor',{
          // "shopguaranteeName": assureName,
          // "shopguaranteeMobile": assureMobile,
          // "shopguaranteeCode": assureCode,
          // "shopguaranteeid": assureId,
          "recommend_name": recommendName,
          "recommend_mobile": recommendMobile
        })
        .then(response => {
          const rsp = response.data
          if (rsp.code == 0) {
            setTimeout(() => {
              this.showLoading = false
              location.href = window.location.origin+'/mobile/#!/'+'joined'
            }, 800)
          }else if(rsp.code == 1){
            this.txtError = rsp.message
            this.showLoading = false
            this.showError = true
          }else if(rsp.code == 2){
            this.txtError = rsp.message
            this.showLoading = false
            this.showError = true
            setTimeout(() => {
              this.$router.go('/login')
            }, 800)
          }
        })
        .catch(console.log)
      // }
    },
    //回填产品信息
    loadPrdList () {
      this.showLoading = true
      setTimeout(() => {
        this.list = []
        this.$http.get(this.$http.options.root+'/api/shop/goods')
        .then(response => {
          if (response.data.code == 2) {
            this.txtError = response.data.message
            this.showError = true
            setTimeout(() => {
              this.$router.go('/login')
            }, 800)
          }else{
            const list = response.data.data.data
            this.countList = list.length
            for (const i in list) {
              const item = {}
              item.title = list[i].chargename
              item.desc = ''
              item.desc += '产地：' + list[i].product_place
              item.desc += '(' + (list[i].source=='self'?'自产':'代理')
              item.desc += (list[i].producer==''?'':'：') + list[i].producer + ')'
              this.list.push(item)
            }
            this.showLoading = false
          }
        })
        .catch(console.log)
      }, 500)
    },
    backToOne () {
      this.step = 0
      localStorage.setItem('nowStep',this.step)
      this.reloadList(this.step)
    },
    backToTwo () {
      this.step = 1
      localStorage.setItem('nowStep',this.step)
      this.reloadList(this.step)
    },
    getCode () {
      const _this = this
      const assureMobile = document.getElementsByName('assureMobile')[0].value
      const btnSend = document.getElementsByName('btnSend')[0]
      const checkPhone = (/^1[3|4|5|7|8]\d{9}$/.test(assureMobile))
      if (!checkPhone) {
        this.txtError = '请填写正确的担保人手机'
        this.showError = true
      }else{
        this.showSended = true
        this.$http.post(this.$http.options.root+'/api/sms/code/guarantor',{
          "mobile": assureMobile,
          "principalmobile": localStorage.getItem('comMobile')
        })
        .then(response => {
          const rsp = response.data
          if (rsp.code == 0) {
            setTimeout(() => {
              this.timer = setInterval(() => {
                if (this.seconds > 0) {
                  this.seconds--
                  btnSend.innerHTML = this.seconds + '秒后重新获取'
                  btnSend.style.background = '#f2f2f2'
                  btnSend.style.color = '#000'
                  btnSend.disabled = true
                }
                if (this.seconds < 1) {
                  clearInterval(this.timer)
                  btnSend.innerHTML = '重新获取'
                  btnSend.style.background = '#04BE02'
                  btnSend.style.color = '#fff'
                  this.seconds = 30
                  btnSend.disabled = false
                }
              }, 1000)
            }, 500)
          }else if(rsp.code == 1){
            this.showLoading = false
            this.txtError = rsp.message
            this.showError = true
          }else if(rsp.code == 2){
            this.txtError = rsp.message
            this.showLoading = false
            this.showError = true
            setTimeout(() => {
              this.$router.go('/login')
            }, 800)
          }
        })
        .catch(console.log)
      }
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
