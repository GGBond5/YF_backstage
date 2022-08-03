<!-- 督办单发起列表  全部 -->
<template>
  <div class="supervision flex-column">
    <YfSearch tActive="month" :time="time" @confirm="submit" layout="date,orderTypeCascaderAll,submit"></YfSearch>
    <div class="flex-1 flex-row">
      <div class="wrap1 flex-column">
        <div class="box1 flex-vCenter">
          <div class="chartWrap flex-column">
            <p class="tit">消除率</p>
            <YfEcharts id="echartGauge1" ref="echartGauge1" :options="optionsGauge1"></YfEcharts>
          </div>
          <div class="numbWrap flex-1 flex-column">
            <p class="tit">督办单总件数</p>
            <numbScroll :long="6" :value="allData.totalNum||0"></numbScroll>
            <p class="tit">平均处理时长</p>
            <numbScroll :long="3" :precision="2" :value="allData.processHours||0" unit="h"></numbScroll>
          </div>
        </div>
        <div class="box2 flex-1 flex-column">
          <div class="boxTop flex-vCenter">
            <i class="icon el-icon-set-up"></i>
            <span class="tit">处理情况统计分析</span>
          </div>
          <div class="box2Item flex-1 flex-column">
            <div class="chartTop flex-vCenter">
              <span class="tit">督办单件数月度累计</span>
              <div class="flex-1"></div>
              <span class="line color1">本月</span>
              <span class="line color2">上月</span>
            </div>
            <div class="chartWrap flex-column" style="width: 100%;height: calc(50% - 50px)">
              <YfEcharts id="echartLine1" ref="echartLine1" :options="optionsLine1"></YfEcharts>
            </div>
            <div class="chartTop flex-vCenter">
              <span class="tit">处理情况月度对标分析</span>
            </div>
            <div class="tableWrap flex-1 flex-column">
              <el-table :data="tableData1" border height="100%" style="width: 100%;" size="small">
                <el-table-column type="index" label="序号" width="55"></el-table-column>
                <el-table-column prop="name" label="统计周期"></el-table-column>
                <el-table-column prop="ratio" label="消除率">
                  <template slot-scope="scope">
                    <div class="tableEditWrap flex-center" v-if="scope.$index>2">
                      <i class="color5" v-if="scope.row.ratio<0">↓</i>
                      <i class="color1" v-if="scope.row.ratio>0">↑</i>
                      <span class="numb" :class="{color5:scope.row.ratio<0,color1:scope.row.ratio>0}">{{$toFixed(scope.row.ratio,2)}}%</span>
                    </div>
                    <div v-else>{{$toFixed(scope.row.ratio,2)}}%</div>
                  </template>
                </el-table-column>
                <el-table-column prop="superviseNum" label="督办单件数">
                  <template slot-scope="scope">
                    <div class="tableEditWrap flex-center" v-if="scope.$index>2">
                      <i class="color5" v-if="scope.row.superviseNum<0">↓</i>
                      <i class="color1" v-if="scope.row.superviseNum>0">↑</i>
                      <span class="numb" :class="{color5:scope.row.superviseNum<0,color1:scope.row.superviseNum>0}">{{$toFixed(scope.row.superviseNum,0)}}%</span>
                    </div>
                    <div v-else>{{$toFixed(scope.row.superviseNum,0)}}</div>
                  </template>
                </el-table-column>
                <el-table-column prop="processHours" label="平均处理时长(h)">
                  <template slot-scope="scope">
                    <div class="tableEditWrap flex-center" v-if="scope.$index>2">
                      <i class="color5" v-if="scope.row.processHours<0">↓</i>
                      <i class="color1" v-if="scope.row.processHours>0">↑</i>
                      <span class="numb" :class="{color5:scope.row.processHours<0,color1:scope.row.processHours>0}">{{$toFixed(scope.row.processHours,2)}}%</span>
                    </div>
                    <div v-else>{{$toFixed(scope.row.processHours,2)}}</div>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </div>
        </div>
      </div>
      <div class="wrap2 flex-1 flex-column">
        <div class="tableWrap flex-1 flex-column">
          <div class="boxTop flex-vCenter">
            <i class="icon el-icon-set-up"></i>
            <span class="tit">消除率月度对标分析</span>
          </div>
          <div class="tableBox flex-1">
            <el-table :data="tableData2" border height="100%" style="width: 100%;" size="small">
              <el-table-column type="index" label="序号" width="55"></el-table-column>
              <el-table-column prop="plantName" label="风场名称"></el-table-column>
              <el-table-column prop="curMonth" label="本月">
                <template slot-scope="scope">{{$toFixed(scope.row.curMonth,0)}}</template>
              </el-table-column>
              <el-table-column prop="lastMonth" label="上月">
                <template slot-scope="scope">{{$toFixed(scope.row.lastMonth,0)}}</template>
              </el-table-column>
              <el-table-column prop="lastYearMonth" label="去年同月">
                <template slot-scope="scope">{{$toFixed(scope.row.lastYearMonth,0)}}</template>
              </el-table-column>
              <el-table-column prop="mom" label="环比">
                <template slot-scope="scope">
                  <div class="tableEditWrap flex-center">
                    <i class="color5" v-if="scope.row.mom<0">↓</i>
                    <i class="color1" v-if="scope.row.mom>0">↑</i>
                    <span class="numb" :class="{color5:scope.row.mom<0,color1:scope.row.mom>0}">{{$toFixed(scope.row.mom,2)}}%</span>
                  </div>
                </template>
              </el-table-column>
              <el-table-column prop="yoy" label="同比">
                <template slot-scope="scope">
                  <div class="tableEditWrap flex-center">
                    <i class="color5" v-if="scope.row.yoy<0">↓</i>
                    <i class="color1" v-if="scope.row.yoy>0">↑</i>
                    <span class="numb" :class="{color5:scope.row.yoy<0,color1:scope.row.yoy>0}">{{$toFixed(scope.row.yoy,2)}}%</span>
                  </div>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
        <div class="tableWrap flex-1 flex-column">
          <div class="boxTop flex-vCenter">
            <i class="icon el-icon-set-up"></i>
            <span class="tit">督办单件数月度对标分析</span>
          </div>
          <div class="tableBox flex-1">
            <el-table :data="tableData3" border height="100%" style="width: 100%;" size="small">
              <el-table-column type="index" label="序号" width="55"></el-table-column>
              <el-table-column prop="plantName" label="风场名称"></el-table-column>
              <el-table-column prop="curMonth" label="本月">
                <template slot-scope="scope">{{$toFixed(scope.row.curMonth,0)}}</template>
              </el-table-column>
              <el-table-column prop="lastMonth" label="上月">
                <template slot-scope="scope">{{$toFixed(scope.row.lastMonth,0)}}</template>
              </el-table-column>
              <el-table-column prop="lastYearMonth" label="去年同月">
                <template slot-scope="scope">{{$toFixed(scope.row.lastYearMonth,0)}}</template>
              </el-table-column>
              <el-table-column prop="tp" label="环比">
                <template slot-scope="scope">
                  <div class="tableEditWrap flex-center">
                    <i class="color5" v-if="scope.row.mom<0">↓</i>
                    <i class="color1" v-if="scope.row.mom>0">↑</i>
                    <span class="numb" :class="{color5:scope.row.mom<0,color1:scope.row.mom>0}">{{$toFixed(scope.row.mom,2)}}%</span>
                  </div>
                </template>
              </el-table-column>
              <el-table-column prop="tb" label="同比">
                <template slot-scope="scope">
                  <div class="tableEditWrap flex-center">
                    <i class="color5" v-if="scope.row.yoy<0">↓</i>
                    <i class="color1" v-if="scope.row.yoy>0">↑</i>
                    <span class="numb" :class="{color5:scope.row.yoy<0,color1:scope.row.yoy>0}">{{$toFixed(scope.row.yoy,2)}}%</span>
                  </div>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
        <div class="tableWrap flex-1 flex-column">
          <div class="boxTop flex-vCenter">
            <i class="icon el-icon-set-up"></i>
            <span class="tit">平均处理时长月度对标分析</span>
          </div>
          <div class="tableBox flex-1">
            <el-table :data="tableData4" border height="100%" style="width: 100%;" size="small">
              <el-table-column type="index" label="序号" width="55"></el-table-column>
              <el-table-column prop="plantName" label="风场名称"></el-table-column>
              <el-table-column prop="curMonth" label="本月">
                <template slot-scope="scope">{{$toFixed(scope.row.curMonth,0)}}</template>
              </el-table-column>
              <el-table-column prop="lastMonth" label="上月">
                <template slot-scope="scope">{{$toFixed(scope.row.lastMonth,0)}}</template>
              </el-table-column>
              <el-table-column prop="lastYearMonth" label="去年同月">
                <template slot-scope="scope">{{$toFixed(scope.row.lastYearMonth,0)}}</template>
              </el-table-column>
              <el-table-column prop="tp" label="环比">
                <template slot-scope="scope">
                  <div class="tableEditWrap flex-center">
                    <i class="color5" v-if="scope.row.mom<0">↓</i>
                    <i class="color1" v-if="scope.row.mom>0">↑</i>
                    <span class="numb" :class="{color5:scope.row.mom<0,color1:scope.row.mom>0}">{{$toFixed(scope.row.mom,2)}}%</span>
                  </div>
                </template>
              </el-table-column>
              <el-table-column prop="tb" label="同比">
                <template slot-scope="scope">
                  <div class="tableEditWrap flex-center">
                    <i class="color5" v-if="scope.row.yoy<0">↓</i>
                    <i class="color1" v-if="scope.row.yoy>0">↑</i>
                    <span class="numb" :class="{color5:scope.row.yoy<0,color1:scope.row.yoy>0}">{{$toFixed(scope.row.yoy,2)}}%</span>
                  </div>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import TabularData from '@/views/operatingIndex/tabularData/TabularData.vue'
import numbScroll from '@/views/overhaulSupervision/supervisionStatistics/numbScroll.vue'
export default {
  components: { TabularData, numbScroll },
  data(){
    return {
      time: this.$moment().startOf('month').format('YYYY-MM-DD'),
      form: {
        "endDate": "",
        "superviseCategory": 0,
        "superviseType": 0,
        "startDate": ""
      },
      allData: {},
      tableData1: [
        {name: '本月', stopTimes: null, stopHours: null, stopLoss: null},
        {name: '上月', stopTimes: null, stopHours: null, stopLoss: null},
        {name: '去年同月', stopTimes: null, stopHours: null, stopLoss: null},
        {name: '环比', stopTimes: null, stopHours: null, stopLoss: null},
        {name: '同比', stopTimes: null, stopHours: null, stopLoss: null}
      ],
      optionsGauge1: {
        series: [
          {
            type: 'gauge', min: 0, max: 100, splitNumber: 5, center: ['50%', '50%'], radius: '100%',
            progress: {show: true,width: 12,itemStyle:{
              color: new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [
                {offset: 0, color: 'rgba(50, 205, 153, 1)'}, {offset: 1, color: 'rgba(1, 254, 153, 1)'}
              ])
            }}, axisLine: {lineStyle: { width: 12 }}, axisTick: {show: false}, 
            splitLine: {length: 4,distance: 0, lineStyle: { width: 1, color: '#aaa' }},
            axisLabel: {distance: 16, color: '#aaa', fontSize: 12},pointer: {itemStyle:{color: '#26D2A1'}},
            anchor: {show: true, showAbove: true, size: 12, itemStyle: { borderWidth: 1,borderColor: '#26D2A1' }},
            title: { show: true,fontSize: 12, color: '#aaa' }, 
            detail: { show: true,offsetCenter: [-3, '70%'],formatter: (param)=>{return this.getTooltip1(param)},
              fontSize: 22, color: '#454545',fontWeight: 'normal' 
            },
            data: [{ value: 0, name: '总消除率' }]
          }
        ]
      },
      tableData2: [],
      tableData3: [],
      tableData4: [],
      optionsLine1:{
        animation:false,color: ['#FF6666','#38AEF3'],
        grid:{bottom:0,top:10,left:20,right:20,containLabel:true},
        tooltip:{trigger:'axis',formatter:(param)=>{return this.getTooltip(param)}},
        xAxis:[
          {type: 'category',axisLine:{show:false},
          splitLine:{show:true,lineStyle:{color:"#e5e5e5",type:"dashed"}},
          axisTick:{show:false},axisLabel:{color:"#999",fontSize:12,showMaxLabel:true}}
        ],
        yAxis:[
          {type: 'value',min:0,max: 100,axisLine:{lineStyle:{color:"transparent"}},axisTick:{show:false},
          axisLabel:{color:"#999"},splitLine:{show:true,lineStyle:{color:"#e5e5e5",type:"dashed"}}}
        ],
        series:[
          {name: '本月', type: 'line',showSymbol: false, data:[]},
          {name: '上月', type: 'line',showSymbol: false, data:[]}
        ]
      },
    }
  },
  methods: {
    getAllData: function(){
      let data = {
        "startDate": this.$moment(this.form.time).startOf('month').format('YYYY-MM-DD'),
        "endDate": this.$moment(this.form.time).endOf('month').format('YYYY-MM-DD'),
        "superviseCategory": this.form.superviseCategory,
        "superviseType": this.form.superviseType
      }
      this.$http.fetch(`supvHome/querySupvAnalysisPandect`,data).then(res=>{
        if(res.code==0&&!this._isDestroyed){
          this.allData = res.data
          this.optionsGauge1.series[0].data[0].value = res.data.totalRatio
          this.optionsLine1.series[0].data = res.data.now || []
          this.optionsLine1.series[1].data = res.data.last || []
          let _tableData1 = [
            {name: '本月', ratio: null, processHours: null, superviseNum: null},
            {name: '上月', ratio: null, processHours: null, superviseNum: null},
            {name: '去年同月', ratio: null, processHours: null, superviseNum: null},
            {name: '环比', ratio: null, processHours: null, superviseNum: null},
            {name: '同比', ratio: null, processHours: null, superviseNum: null}
          ]
          res.data.supvStat.forEach((item, index) => {
            _tableData1[index] = {..._tableData1[index], ...item}
          })
          this.tableData1 = _tableData1
          this.tableData2 = res.data.ratioMonthAnalysis || []
          this.tableData3 = res.data.supvNumMonthAnalysis || []
          this.tableData4 = res.data.processHourMonthAnalysis || []
        }else{
          this.allData = {}
          this.optionsGauge1.series[0].data[0].value = 0
          this.optionsLine1.series[0].data = []
          this.optionsLine1.series[1].data = []
          this.tableData1 = [
            {name: '本月', ratio: null, processHours: null, superviseNum: null},
            {name: '上月', ratio: null, processHours: null, superviseNum: null},
            {name: '去年同月', ratio: null, processHours: null, superviseNum: null},
            {name: '环比', ratio: null, processHours: null, superviseNum: null},
            {name: '同比', ratio: null, processHours: null, superviseNum: null}
          ]
          this.tableData2 = []
          this.tableData3 = []
          this.tableData4 = []
        }
      })
    },
    getTooltip: function(param){
      let html = `累计督办单 (${param[0].axisValueLabel}日)<br>`
      param.forEach(item=>{
        html += `<div style="display:flex;"><span>${item.marker}${item.seriesName}：</span><b style="flex:1;display: inline-block;text-align:right;margin-left: 15px">${item.data[1]} 件</b></div>`
      })
      return html
    },
    getTooltip1: function(param){
      if(isNaN(param)||param == undefined){
        return '-%'
      }else{
        return param+'%'
      }
    },
    submit: function(param){
      if(param){
        this.form = {...param}
        this.getAllData()
      }
    }
  }
}
</script>

<style scoped lang="less">
.boxTop{
  width: 100%;height: 48px;font-size: 14px;padding: 0 15px;border: 1px solid #f2f2f2;border-bottom: none;
  >i.icon{margin-right: 6px;font-size: 18px;color: #666;}
}
.wrap1{
  height: 100%;width: 41.667%; min-width: 600px; padding: 0 10px 10px;
  .box1{
    width: 100%;height: 242px; margin-bottom: 10px; border: 1px solid #f2f2f2; border-radius: 5px;
    .chartWrap{
      width: 250px;height: 100%;
      .tit{font-size: 16px;text-indent: 30px;margin-top: 20px;line-height: 26px;}
    }
    .numbWrap{
      padding: 0 10px;
      .tit{font-size: 16px;text-indent: 5px;margin-top: 5px;line-height: 26px;}
    }
  }
  .box2{
    width: 100%; border-radius: 5px;
    .boxTop{
      border-bottom: 1px solid #f2f2f2;
    }
    .box2Item{
      border: 1px solid #f2f2f2; border-top: none;
    }
    .chartTop{
      height: 40px;width: 100%;font-size: 14px; padding: 0 20px;
      .line{
        color: #666;padding-left: 34px;position: relative; margin-left: 20px; font-size: 12px;
        &::before{
          content: '';display: block;width: 8px;height: 8px;border-radius: 100%;overflow: hidden;position: absolute;top: 50%;left: 10px;margin-top: -3px;
        }
        &::after{
          content: '';display: block;width: 28px;height: 2px;overflow: hidden;position: absolute;top: 50%;left: 0px;margin-top: 0px;
        }
      }
      .color1::before, .color1::after{background-color: var(--color1);}
      .color2::before, .color2::after{background-color: var(--color2);}
    }
    .tableWrap{ padding: 0 20px 10px;}
  }
}
.wrap2{
  height: 100%; padding: 0 10px 0 0;
  .tableWrap{
    width: 100%; border-radius: 5px; margin-bottom: 10px;
  }
}
</style>