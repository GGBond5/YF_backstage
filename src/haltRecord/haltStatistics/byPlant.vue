<!-- 督办单发起列表  全部 -->
<template>
  <div class="supervision flex-column">
    <YfSearch tActive="date" :time="time" @confirm="submit" layout="dateType,stopTypeCascader,submit"></YfSearch>
    <!-- <div class="wrap1 flex-row">
      <div class="itemBox flex-vCenter">
        <div class="itemLeft flex-1 flex-column">
          <p class="tit">总消除率</p>
          <div class="flex-1 flex-vCenter">
            <span class="icon bgColor5 color5 flex-center">
              <i class="el-icon-pie-chart"></i>
            </span>
            <span class="numb">68.86</span>
            <span class="unit">%</span>
            <div class="limit">
              <p>max：98.75%</p>
              <p>min：32.17%</p>
            </div>
          </div>
        </div>
      </div>
      <div class="itemBox flex-1 flex-vCenter">
        <div class="itemLeft flex-column">
          <p class="tit">督办单件数</p>
          <div class="flex-1 flex-vCenter">
            <span class="icon bgColor2 color2 flex-center">
              <i class="el-icon-document"></i>
            </span>
            <span class="numb" style="margin-right: 30px;">128</span>
          </div>
        </div>
        <div class="itemRight flex-1 flex-vCenter">
          <div class="list flex-1 flex-column" v-for="(item,index) in statusList" :key="index">
            <p class="numb">{{item.value}}</p>
            <p class="name">{{item.name}}</p>
          </div>
        </div>
      </div>
      <div class="itemBox flex-vCenter">
        <div class="itemLeft flex-1 flex-column">
          <p class="tit">平均处理时长</p>
          <div class="flex-1 flex-vCenter">
            <span class="icon bgColor3 color3 flex-center">
              <i class="el-icon-time"></i>
            </span>
            <span class="numb">68.86</span>
            <span class="unit">h</span>
            <div class="limit">
              <p>max：98.75h</p>
              <p>min：32.17h</p>
            </div>
          </div>
        </div>
      </div>
    </div> -->
    <div class="wrap2 flex-row">
      <div class="itemBox flex-1 flex-column">
        <div class="boxTop flex-vCenter">
          <i class="icon el-icon-set-up"></i>
          <span class="tit">停机记录排名</span>
          <div class="flex-1"></div>
          <div class="btnWrap flex-center">
            <a :class="{active: currentIndex == 0}" @click="changeTab(0)">前5名</a>
            <a :class="{active: currentIndex == 1}" @click="changeTab(1)">后5名</a>
          </div>
        </div>
        <div class="chartWrap flex-1 flex-row">
          <div class="flex-1 flex-column">
            <p class="tit">停机次数排名(台次)</p>
            <div class="flex-1 flex-row">
              <div class="chartBox flex-1 flex-column">
                <YfEcharts id="echartBar1" ref="echartBar1" :options="optionsBar1"></YfEcharts>
              </div>
              <div class="legendWrap flex-column">
                <span class="flex-1" :style="{color: optionsBar1.color[0],display:'flex','align-items': 'center','justify-content': 'right'}" 
                  v-for="(item,index) in optionsBar1.series[0].data" :key="index">{{item[0]}}</span>
              </div>
            </div>
          </div>
          <div class="flex-1 flex-column">
            <p class="tit">停机时长排名(h)</p>
            <div class="flex-1 flex-row">
              <div class="chartBox flex-1 flex-column">
                <YfEcharts id="echartBar2" ref="echartBar2" :options="optionsBar2"></YfEcharts>
              </div>
              <div class="legendWrap flex-column">
                <span class="flex-1" :style="{color: optionsBar2.color[0],display:'flex','align-items': 'center','justify-content': 'right'}" 
                  v-for="(item,index) in optionsBar2.series[0].data" :key="index">{{item[0]}}</span>
              </div>
            </div>
          </div>
          <div class="flex-1 flex-column">
            <p class="tit">损失电量排名(万kwh)</p>
            <div class="flex-1 flex-row">
              <div class="chartBox flex-1 flex-column">
                <YfEcharts id="echartBar3" ref="echartBar3" :options="optionsBar3"></YfEcharts>
              </div>
              <div class="legendWrap flex-column">
                <span class="flex-1" :style="{color: optionsBar3.color[0],display:'flex','align-items': 'center','justify-content': 'right'}" 
                  v-for="(item,index) in optionsBar3.series[0].data" :key="index">{{item[0]}}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="tableWrap flex-1 flex-column">
      <el-table :data="tableData" border height="100%" style="width: 100%;" size="small" show-summary>
        <el-table-column type="index" label="序号" width="55"></el-table-column>
        <el-table-column prop="plantName" label="风场名称"></el-table-column>
        <el-table-column prop="stopTimes" label="停机次数" sortable></el-table-column>
        <el-table-column prop="notStarted" label="未开工" sortable></el-table-column>
        <el-table-column prop="processing" label="处理中" sortable></el-table-column>
        <el-table-column prop="accepting" label="验收中" sortable></el-table-column>
        <el-table-column prop="acceptanceFailed" label="验收不通过" sortable></el-table-column>
        <el-table-column prop="processed" label="已处理" sortable></el-table-column>
        <el-table-column prop="stopHours" label="停机时长(h)" sortable></el-table-column>
        <el-table-column prop="lossTotal" label="损失电量(万kwh)" sortable></el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import TabularData from '@/views/operatingIndex/tabularData/TabularData.vue'
export default {
  components: { TabularData },
  data(){
    return {
      time: this.$moment().format('YYYY-MM-DD'),
      form: {},
      allData: {},
      tableData: [],
      statusList: [
        {name: '未开工', value: 14},
        {name: '处理中', value: 23},
        {name: '验收中', value: 16},
        {name: '验收不通过', value: 0},
        {name: '挂起中', value: 19},
        {name: '已处理', value: 137}
      ],
      currentIndex: 0,
      optionsBar1:{
        animation:false,color: ['#26D2A1'],
        grid: {bottom:5,top:5,left:20,right:20,containLabel:true},
        xAxis:[
          {type: 'value',min: 0, axisLine:{show:false},axisTick:{show:false}, axisLabel:{show:false},splitLine:{show:false},scale:true},
        ],
        yAxis:[
          {type: 'category',axisLine:{show:false},splitLine:{show:false}, axisTick:{show:false},axisLabel:{color:"#333",fontSize:13,align: 'right'},inverse:true}
        ],
        series:[
          {name: '消除率', type: 'bar',showSymbol: false, barWidth: 12,
          data:[]}
        ]
      },
      optionsBar2:{
        animation:false,color: ['#FF9900'],
        grid: {bottom:5,top:5,left:20,right:20,containLabel:true},
        xAxis:[
          {type: 'value',min: 0, axisLine:{show:false},axisTick:{show:false}, axisLabel:{show:false},splitLine:{show:false},scale:true},
        ],
        yAxis:[
          {type: 'category',axisLine:{show:false},splitLine:{show:false}, axisTick:{show:false},axisLabel:{color:"#333",fontSize:13,align: 'right'},inverse:true}
        ],
        series:[
          {name: '督办单件数', type: 'bar',showSymbol: false, barWidth: 12,
          data:[]}
        ]
      },
      optionsBar3:{
        animation:false,color: ['#38AEF3'],
        grid: {bottom:5,top:5,left:20,right:20,containLabel:true},
        xAxis:[
          {type: 'value',min: 0, axisLine:{show:false},axisTick:{show:false}, axisLabel:{show:false},splitLine:{show:false},scale:true},
        ],
        yAxis:[
          {type: 'category',axisLine:{show:false},splitLine:{show:false}, axisTick:{show:false},axisLabel:{color:"#333",fontSize:13,align: 'right'},inverse:true}
        ],
        series:[
          {name: '平均处理时长', type: 'bar',showSymbol: false, barWidth: 12,
          data:[]}
        ]
      },
    }
  },
  methods: {
    getAllData: function(){
      this.$http.fetchGet(`stop/plantStat?startDate=${this.form.stime}&endDate=${this.form.etime}&lossType=${this.form.lossType}&lossCode=${this.form.lossCode}`).then(res=>{
        if(res.code==0&&!this._isDestroyed){
          this.allData = res.data
          this.tableData = res.data.plantLossInfoList || []
          this.resetBar()
        }else{
          this.allData = {}
          this.tableData = []
          this.optionsBar1.series[0].data = []
          this.optionsBar2.series[0].data = []
          this.optionsBar3.series[0].data = []
        }
      })
    },
    resetBar: function(){
      if(this.currentIndex){
        this.optionsBar1.series[0].data = this.allData.plantStopTimesRankArr.value1 || []
        this.optionsBar2.series[0].data = this.allData.plantStopHoursRankArr.value1 || []
        this.optionsBar3.series[0].data = this.allData.plantStopLossRankArr.value1 || []
      }else{
        this.optionsBar1.series[0].data = this.allData.plantStopTimesRankArr.value0 || []
        this.optionsBar2.series[0].data = this.allData.plantStopHoursRankArr.value0 || []
        this.optionsBar3.series[0].data = this.allData.plantStopLossRankArr.value0 || []
      }
    },
    changeTab: function(n){
      if(this.currentIndex != n){
        this.currentIndex = n
        this.resetBar()
      }
    },
    submit: function(param){
      if(param){
        console.log(param)
        this.form = {...param}
        this.getAllData()
      }
    }
  }
}
</script>

<style scoped lang="less">
.wrap1{
  padding: 0 10px; width: 100%; height: 88px;
  .itemBox{
    margin-right: 10px; padding: 0 20px; border: 1px solid #f2f2f2; border-radius: 5px; overflow: hidden;
    &:last-child{ margin-right: 0; }
    .itemLeft{
      .tit{margin-bottom: 6px;}
      .icon{width: 28px;height: 28px;overflow: hidden;border-radius: 100%;margin-right: 15px;}
      .numb{font-size: 28px;margin-right: 5px;}
      .unit{margin-top: 6px;}
      .limit{font-size: 12px;color: #999;line-height: 14px;margin-left: 30px;}
    }
    .itemRight{
      height: 100%; border-left: 1px solid #f2f2f2;
      .list{
        justify-content: center; align-items: center;
        .numb{ font-size: 24px; margin-bottom: 10px;}
        .name{ font-size: 12px; }
      }
    }
  }
}
.wrap2{
  width: 100%;height: 260px; padding: 0 10px 10px;
  .itemBox{
    height: 100%; border: 1px solid #f2f2f2; border-radius: 5px;
  }
  .boxTop{
    width: 100%;height: 48px;font-size: 14px;padding: 0 15px;border-bottom: 1px solid #f2f2f2;
    >i.icon{margin-right: 6px;font-size: 18px;color: #666;}
  }
  .chartWrap{
    padding: 10px 0;
    .tit{padding: 0 20px;}
    .legendWrap{
      margin: 0 30px 0 0; font-size: 13px;font-weight: bold;
    }
  }
  .btnWrap{
    position: relative;
    &::after{content: '';width: 1px;height: 28px; background: #38AEF3;overflow: hidden;display: block;position: absolute; top: 0;left: 50%;}
    a{
      width: 58px; height: 28px; font-size: 12px; color: #999; line-height: 28px;text-align: center;
      &:nth-child(1){border: 1px solid #e5e5e5; border-right: none; border-top-left-radius: 5px;border-bottom-left-radius: 5px;}
      &:nth-child(2){border: 1px solid #e5e5e5; border-left: none; border-top-right-radius: 5px;border-bottom-right-radius: 5px;}
      &.active{border-color: #38AEF3; color: #38AEF3;}
    }
  }
}
</style>