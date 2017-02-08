<template>
  <div id="cashPage">

    <x-header>
      资金提现&nbsp;&nbsp;
      <a slot="right" @click="logout">退出</a>
    </x-header>

    <card :header="{title: ''}" style="margin-top: 0;padding-top: 10px;background: #04BE02;color: #fff;">
      <div slot="content" class="card-flex card-content dashboard-card">
        <div>
          <span>可提现(元)</span>
          <br/>
          <span style="font-size: 3rem;">{{cashList.value}}</span>
        </div>
      </div>
      <div slot="content" class="card-flex card-content dashboard-card">
        <div style="border-right: 1px #fff solid;">
          <span>已提现</span>
        </div>
        <div>
          <span>提现状态</span>
        </div>
      </div>
      <div slot="content" class="card-flex card-content dashboard-card" style="padding-bottom: 10px;">
        <div>
          <span>{{cashList.valued}}</span>
        </div>
        <div>
          <span v-if="status == 0">可提现</span>
          <span v-if="status == 1">申请中</span>
          <span v-if="status == 2">已提现</span>
        </div>
      </div>
    </card>


    <group>
      <cell title="待提现" v-link="{ path: '/cash/withdrawing' }" is-link></cell>
      <cell title="提现记录" v-link="{ path: '/cash/withdraws' }" is-link></cell>
      <cell title="收支记录" v-link="{ path: '/cash/income' }" is-link></cell>
    </group>



    <div v-if="status != 1" id="pageBtn">
      <box gap="10px 10px">
        <x-button type="primary" @click="confirmApply()">提现</x-button>
      </box>
    </div>



    <loading :show="showLoading"></loading>
    <confirm :show.sync="confirm" title="消息" confirm-text="确定" cancel-text="取消" @on-confirm="onConfirm">
      <p style="text-align:center;">是否退出帐号？</p>
    </confirm>
    <confirm :show.sync="isApply" title="消息" confirm-text="确定" cancel-text="取消" @on-confirm="apply">
      <p style="text-align:center;">是否申请提现？</p>
    </confirm>
    <toast :show.sync="showError">{{txtError}}</toast>

  </div>
</template>

<script>
import { Card, Flexbox, Toast, FlexboxItem, Confirm, XInput, GroupTitle, Group, XButton, Cell, XHeader, Box, Loading } from 'vux/src/components'
export default {
  components: {
    Card,
    Toast,
    Confirm,
    Flexbox,
    FlexboxItem,
    Loading,
    XHeader,
    XInput,
    Group,
    XButton,
    Cell,
    GroupTitle,
    Box
  },
  data () {
    return {
      showError: false,
      txtError: '',
      isApply: false,
      confirm: false,
      showLoading: false,
      cashList: {},
      status: 0
    }
  },
  ready () {
    this.editHeight()
    this.getCash()
  },
  methods: {
    editHeight () {
      setTimeout(() => {
        if (document.getElementById('pageBtn') != null) {
          const pdBottom = document.getElementById('pageBtn').offsetHeight
          document.getElementById('cashPage').style.paddingBottom = pdBottom+'px'
        }
      }, 800)
    },
    apply () {
      this.showLoading = true
      setTimeout(() => {
        this.$http.get(this.$http.options.root+'/api/shop/cash/withdraw/apply')
        .then(response => {
          this.showLoading = false
          this.txtError = '申请成功，请等待审核通过'
          this.showError = true
          setTimeout(() => {
            this.$router.go('/cash/withdrawing')
          }, 500)
        })
        .catch(console.log)
      }, 500)
    },
    getCash () {
      this.showLoading = true
      setTimeout(() => {
        this.$http.get(this.$http.options.root+'/api/shop/cash/withdraw')
        .then(response => {
          this.cashList = response.data.data
          this.showLoading = false
        })
        .catch(console.log)
        //提现状态
        this.$http.get(this.$http.options.root+'/api/shop/cash/withdraw/status')
        .then(response => {
          this.status = response.data.data.status
          this.showLoading = false
        })
        .catch(console.log)
      }, 500)
    },
    confirmApply () {
      this.isApply = true
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
