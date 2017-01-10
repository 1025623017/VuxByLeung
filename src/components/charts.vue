<template>
	<div>

		<x-header>感恩节统计&nbsp;&nbsp;</x-header>

    <button-tab class="category">
      <button-tab-item @click="getEmap('交易金额',categoryTime)" selected>
        交易金额
      </button-tab-item>
      <button-tab-item @click="getEmap('支付订单',categoryTime)">
        支付订单
      </button-tab-item>
      <button-tab-item @click="getEmap('全部订单',categoryTime)">
        全部订单
      </button-tab-item>
      <button-tab-item @click="getEmap('访问量',categoryTime)">
        访问量
      </button-tab-item>
    </button-tab>
    <button-tab>
      <button-tab-item @click="getEmap(categoryType,'today')" selected>
        今天
      </button-tab-item>
      <button-tab-item @click="getEmap(categoryType,'yesterday')" >
        昨天
      </button-tab-item>
      <button-tab-item @click="getEmap(categoryType,7)" >
        7天
      </button-tab-item>
      <button-tab-item @click="getEmap(categoryType,30)" >
        30天
      </button-tab-item>
    </button-tab>

    <card style="margin-top: 0;background: #E74D5B;color: #fff;"><!-- 4D90E7 -->
      <div slot="content" class="card-flex card-content dashboard-card">
        <div id="emap" style="width: 100vw;height: 50vh;">正在加载中......</div>
      </div>
    </card>



    <loading :show="showLoading"></loading>
    <confirm :show.sync="confirm" title="消息" confirm-text="确定" cancel-text="取消" @on-confirm="onConfirm">
      <p style="text-align:center;">是否退出帐号？</p>
    </confirm>

	</div>
</template>

<script>
import { ButtonTab, ButtonTabItem, Card, Flexbox, FlexboxItem, Confirm, XInput, GroupTitle, Group, XButton, Cell, XHeader, Box, Loading } from 'vux/src/components'
export default {
  components: {
    ButtonTab,
    ButtonTabItem,
    Card,
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
      confirm: false,
      showLoading: false,
      //ECharts数据源
      sumData: [],
      categoryType: '交易金额',
      categoryTime: 'today'
    }
  },
  ready () {
    this.getEmap(this.categoryType,this.categoryTime)
  },
  methods: {
    getEmap (_type,_time) {
      const _this = this
      this.categoryType = _type
      this.categoryTime = _time
      this.showLoading = true
      setTimeout(() => {
        var url = ''
        if (this.categoryTime=='today') {
          url = this.$http.options.root+'/api/dashboard/v2/goods/' + this.$route.params.id + '/orders/data'
        }else if(this.categoryTime=='yesterday'){
          url = this.$http.options.root+'/api/dashboard/v1/goods/' + this.$route.params.id + '/orders/data'
        }else{
          url = this.$http.options.root+'/api/dashboard/goods/' + this.$route.params.id + '/orders/data/' + this.categoryTime
        }
        this.$http.get(url)
        .then(response => {
          this.sumData = response.data.data

          //数据图线条数量
          var ecData = [];
          var ecTitle = [];
          if (_this.sumData.ys) {
            console.log(_this.categoryType)
            for (var i = 0; i < _this.sumData.ys.length; i++) {
              if (_this.sumData.ys[i].name==_this.categoryType) {
                var item = {
                  name: _this.sumData.ys[i].name,
                  type: 'line',
                  stack: _this.sumData.ys[i].name,
                  smooth: true,
                  //点值
                  label: {
                    normal: {
                      show: true,
                      position: 'top'
                    }
                  },
                  itemStyle: {
                    normal: {
                      //线条颜色
                      color: '#fff'//_this.sumData.ys[i].color
                    }
                  },
                  //数据
                  data: _this.sumData.ys[i].data
                };
                ecData.push(item);

                // var item = _this.sumData.ys[i].name;
                // ecTitle.push(item);
              }
            };

            //生成数据图
            var crowd = echarts.init(document.getElementById('emap'));
            var option = {
              title: {
                text: ''
              },
              tooltip: {
                trigger: 'axis'
              },
              legend: {
                data: ecTitle
              },
              grid: {
                containLabel: true,
                borderColor: '#fff'
              },
              toolbox: {
                feature: {
                  dataZoom: {
                    yAxisIndex: 'none'
                  },
                  restore: {},
                  saveAsImage: {}
                }
              },
              //时间调节栏
              dataZoom: [
                {
                  show: false,
                  realtime: true,
                  start: 0,
                  end: 100
                },
                {
                  type: 'inside',
                  realtime: true,
                  start: 65,
                  end: 85
                }
              ],
              xAxis: {
                name: '',
                type: 'category',
                boundaryGap: false,
                data: _this.sumData.x,
                axisLine: {
                  lineStyle: {
                    color: '#fff',
                    width: 2
                  }
                }
              },
              yAxis: {
                name: '',
                type: 'value',
                axisLine: {
                  lineStyle: {
                    color: '#fff',
                    width: 2
                  }
                }
              },
              series: ecData
            };
            crowd.setOption(option);
            window.onresize = crowd.resize;
          }
          this.showLoading = false
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
