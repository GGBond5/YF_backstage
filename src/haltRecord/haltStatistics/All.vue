<!-- 督办单发起列表  全部 -->
<template>
  <div class="supervision flex-column">
    <YfSearch tActive="month" :time="time" @confirm="submit" layout="date,stopTypeCascader,submit"></YfSearch>
    <div class="flex-1 flex-row">
      <div class="wrap1 flex-column">
        <div class="box1 flex-column">
          <div class="box11 flex-1 flex-row">
            <div class="box111 flex-1 flex-column">
              <p class="p1">停机台次</p>
              <p class="p2">{{$toFixed(allData.stopTimes)}}</p>
              <div class="percent flex-vCenter">
                <div class="flex-1 flex-vCenter">
                  <p class="p3">环比：</p>
                  <i class="color5" v-if="allData.stopTimesQG<0">↓</i>
                  <i class="color1" v-if="allData.stopTimesQG>0">↑</i>
                  <span class="numb" :class="{color5:allData.stopTimesQG<0,color1:allData.stopTimesQG>0}">{{$toFixed(allData.stopTimesQG,2)}}%</span>
                </div>
                <div class="flex-1 flex-vCenter">
                  <p class="p3">同比：</p>
                  <i class="color5" v-if="allData.stopTimesQOQ<0">↓</i>
                  <i class="color1" v-if="allData.stopTimesQOQ>0">↑</i>
                  <span class="numb" :class="{color5:allData.stopTimesQOQ<0,color1:allData.stopTimesQOQ>0}">{{$toFixed(allData.stopTimesQOQ,2)}}%</span>
                </div>
              </div>
            </div>
            <div class="box111 flex-1 flex-column">
              <p class="p1">停机时长(h)</p>
              <p class="p2">{{$toFixed(allData.stopHours,2)}}</p>
              <div class="percent flex-vCenter">
                <div class="flex-1 flex-vCenter">
                  <p class="p3">环比：</p>
                  <i class="color5" v-if="allData.stopHoursQG<0">↓</i>
                  <i class="color1" v-if="allData.stopHoursQG>0">↑</i>
                  <span class="numb" :class="{color5:allData.stopHoursQG<0,color1:allData.stopHoursQG>0}">{{$toFixed(allData.stopHoursQG,2)}}%</span>
                </div>
                <div class="flex-1 flex-vCenter">
                  <p class="p3">同比：</p>
                  <i class="color5" v-if="allData.stopHoursQOQ<0">↓</i>
                  <i class="color1" v-if="allData.stopHoursQOQ>0">↑</i>
                  <span class="numb" :class="{color5:allData.stopHoursQOQ<0,color1:allData.stopHoursQOQ>0}">{{$toFixed(allData.stopHoursQOQ,2)}}%</span>
                </div>
              </div>
            </div>
          </div>
          <div class="box12 flex-vCenter">
            <p class="p1">损失电量 (万kwh)</p>
            <p class="p2">{{$toFixed(allData.lossTotal,2)}}</p>
            <div class="flex-1"></div>
            <div class="percent flex-column">
              <div class="flex-1 flex-vCenter">
                <p class="p3">环比：</p>
                <i class="color5" v-if="allData.lossTotalQG<0">↓</i>
                <i class="color1" v-if="allData.lossTotalQG>0">↑</i>
                <span class="numb" :class="{color5:allData.lossTotalQG<0,color1:allData.lossTotalQG>0}">{{$toFixed(allData.lossTotalQG,2)}}%</span>
              </div>
              <div class="flex-1 flex-vCenter">
                <p class="p3">同比：</p>
                <i class="color5" v-if="allData.lossTotalQOQ<0">↓</i>
                <i class="color1" v-if="allData.lossTotalQOQ>0">↑</i>
                <span class="numb" :class="{color5:allData.lossTotalQOQ<0,color1:allData.lossTotalQOQ>0}">{{$toFixed(allData.lossTotalQOQ,2)}}%</span>
              </div>
            </div>
          </div>
        </div>
        <div class="box2 flex-1 flex-column">
          <div class="boxTop flex-vCenter">
            <i class="icon el-icon-set-up"></i>
            <span class="tit">停机情况统计分析</span>
          </div>
          <div class="box2Item flex-1 flex-column">
            <div class="chartTop flex-vCenter">
              <span class="tit">停机台次月度统计</span>
              <div class="flex-1"></div>
              <span class="line color1">本月</span>
              <span class="line color2">上月</span>
            </div>
            <div class="chartWrap flex-column" style="width: 100%;height: calc(50% - 50px)">
              <YfEcharts id="echartLine1" ref="echartLine1" :options="optionsLine1"></YfEcharts>
            </div>
            <div class="chartTop flex-vCenter">
              <span class="tit">停机情况月度对标分析</span>
            </div>
            <div class="tableWrap flex-1 flex-column">
              <el-table :data="tableData1" border height="100%" style="width: 100%;" size="small">
                <el-table-column type="index" label="序号" width="55"></el-table-column>
                <el-table-column prop="name" label="统计周期"></el-table-column>
                <el-table-column prop="stopTimes" label="停机台次">
                  <template slot-scope="scope">
                    <div class="tableEditWrap flex-center" v-if="scope.$index>2">
                      <i class="color5" v-if="scope.row.stopTimes<0">↓</i>
                      <i class="color1" v-if="scope.row.stopTimes>0">↑</i>
                      <span class="numb" :class="{color5:scope.row.stopTimes<0,color1:scope.row.stopTimes>0}">{{$toFixed(scope.row.stopTimes,2)}}%</span>
                    </div>
                    <div v-else>{{scope.row.stopTimes}}</div>
                  </template>
                </el-table-column>
                <el-table-column prop="stopHours" label="停机时长(h)">
                  <template slot-scope="scope">
                    <div class="tableEditWrap flex-center" v-if="scope.$index>2">
                      <i class="color5" v-if="scope.row.stopHours<0">↓</i>
                      <i class="color1" v-if="scope.row.stopHours>0">↑</i>
                      <span class="numb" :class="{color5:scope.row.stopHours<0,color1:scope.row.stopHours>0}">{{$toFixed(scope.row.stopHours,2)}}%</span>
                    </div>
                    <div v-else>{{scope.row.stopHours}}</div>
                  </template>
                </el-table-column>
                <el-table-column prop="stopLoss" label="损失电量(万kwh)">
                  <template slot-scope="scope">
                    <div class="tableEditWrap flex-center" v-if="scope.$index>2">
                      <i class="color5" v-if="scope.row.stopLoss<0">↓</i>
                      <i class="color1" v-if="scope.row.stopLoss>0">↑</i>
                      <span class="numb" :class="{color5:scope.row.stopLoss<0,color1:scope.row.stopLoss>0}">{{$toFixed(scope.row.stopLoss,2)}}%</span>
                    </div>
                    <div v-else>{{scope.row.stopLoss}}</div>
                  </template>
                </el-table-column>
                <!-- <el-table-column prop="tp" label="环比">
                  <template slot-scope="scope">
                    <div class="tableEditWrap flex-center">
                      <i class="color5">↓</i>
                      <span class="numb color5">{{scope.row.tp}}%</span>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column prop="tb" label="同比">
                  <template slot-scope="scope">
                    <div class="tableEditWrap flex-center">
                      <i class="color5">↓</i>
                      <span class="numb color5">{{scope.row.tb}}%</span>
                    </div>
                  </template>
                </el-table-column> -->
              </el-table>
            </div>
          </div>
        </div>
      </div>
      <div class="wrap2 flex-1 flex-column">
        <div class="tableWrap flex-1 flex-column">
          <div class="boxTop flex-vCenter">
            <i class="icon el-icon-set-up"></i>
            <span class="tit">停机台次月度对标分析(台次)</span>
          </div>
          <div class="tableBox flex-1">
            <el-table :data="tableData2" border height="100%" style="width: 100%;" size="small">
              <el-table-column type="index" label="序号" width="55"></el-table-column>
              <el-table-column prop="plantName" label="风场名称"></el-table-column>
              <el-table-column prop="now" label="本月"></el-table-column>
              <el-table-column prop="lastMonth" label="上月"></el-table-column>
              <el-table-column prop="lastYear" label="去年同月"></el-table-column>
              <el-table-column prop="qg" label="环比">
                <template slot-scope="scope">
                  <div class="tableEditWrap flex-center">
                    <i class="color5" v-if="scope.row.qg<0">↓</i>
                    <i class="color1" v-if="scope.row.qg>0">↑</i>
                    <span class="numb" :class="{color5:scope.row.qg<0,color1:scope.row.qg>0}">{{$toFixed(scope.row.qg,2)}}%</span>
                  </div>
                </template>
              </el-table-column>
              <el-table-column prop="qoq" label="同比">
                <template slot-scope="scope">
                  <div class="tableEditWrap flex-center">
                    <i class="color5" v-if="scope.row.qoq<0">↓</i>
                    <i class="color1" v-if="scope.row.qoq>0">↑</i>
                    <span class="numb" :class="{color5:scope.row.qoq<0,color1:scope.row.qoq>0}">{{$toFixed(scope.row.qoq,2)}}%</span>
                  </div>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
        <div class="tableWrap flex-1 flex-column">
          <div class="boxTop flex-vCenter">
            <i class="icon el-icon-set-up"></i>
            <span class="tit">停机时长月度对标分析(h)</span>
          </div>
          <div class="tableBox flex-1">
            <el-table :data="tableData3" border height="100%" style="width: 100%;" size="small">
              <el-table-column type="index" label="序号" width="55"></el-table-column>
              <el-table-column prop="plantName" label="风场名称"></el-table-column>
              <el-table-column prop="now" label="本月"></el-table-column>
              <el-table-column prop="lastMonth" label="上月"></el-table-column>
              <el-table-column prop="lastYear" label="去年同月"></el-table-column>
              <el-table-column prop="qg" label="环比">
                <template slot-scope="scope">
                  <div class="tableEditWrap flex-center">
                    <i class="color5" v-if="scope.row.qg<0">↓</i>
                    <i class="color1" v-if="scope.row.qg>0">↑</i>
                    <span class="numb" :class="{color5:scope.row.qg<0,color1:scope.row.qg>0}">{{$toFixed(scope.row.qg,2)}}%</span>
                  </div>
                </template>
              </el-table-column>
              <el-table-column prop="qoq" label="同比">
                <template slot-scope="scope">
                  <div class="tableEditWrap flex-center">
                    <i class="color5" v-if="scope.row.qoq<0">↓</i>
                    <i class="color1" v-if="scope.row.qoq>0">↑</i>
                    <span class="numb" :class="{color5:scope.row.qoq<0,color1:scope.row.qoq>0}">{{$toFixed(scope.row.qoq,2)}}%</span>
                  </div>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
        <div class="tableWrap flex-1 flex-column">
          <div class="boxTop flex-vCenter">
            <i class="icon el-icon-set-up"></i>
            <span class="tit">损失电量月度对标分析(万kwh)</span>
          </div>
          <div class="tableBox flex-1">
            <el-table :data="tableData4" border height="100%" style="width: 100%;" size="small">
              <el-table-column type="index" label="序号" width="55"></el-table-column>
              <el-table-column prop="plantName" label="风场名称"></el-table-column>
              <el-table-column prop="now" label="本月"></el-table-column>
              <el-table-column prop="lastMonth" label="上月"></el-table-column>
              <el-table-column prop="lastYear" label="去年同月"></el-table-column>
              <el-table-column prop="qg" label="环比">
                <template slot-scope="scope">
                  <div class="tableEditWrap flex-center">
                    <i class="color5" v-if="scope.row.qg<0">↓</i>
                    <i class="color1" v-if="scope.row.qg>0">↑</i>
                    <span class="numb" :class="{color5:scope.row.qg<0,color1:scope.row.qg>0}">{{$toFixed(scope.row.qg,2)}}%</span>
                  </div>
                </template>
              </el-table-column>
              <el-table-column prop="qoq" label="同比">
                <template slot-scope="scope">
                  <div class="tableEditWrap flex-center">
                    <i class="color5" v-if="scope.row.qoq<0">↓</i>
                    <i class="color1" v-if="scope.row.qoq>0">↑</i>
                    <span class="numb" :class="{color5:scope.row.qoq<0,color1:scope.row.qoq>0}">{{$toFixed(scope.row.qoq,2)}}%</span>
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
      form: {},
      allData: {},
      tableData1: [
        {name: '本月', stopTimes: null, stopHours: null, stopLoss: null},
        {name: '上月', stopTimes: null, stopHours: null, stopLoss: null},
        {name: '去年同月', stopTimes: null, stopHours: null, stopLoss: null},
        {name: '环比', stopTimes: null, stopHours: null, stopLoss: null},
        {name: '同比', stopTimes: null, stopHours: null, stopLoss: null}
      ],
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
      this.$http.fetchGet(`stop/overview?date=${this.form.time}&lossType=${this.form.lossType}&lossCode=${this.form.lossCode}`).then(res=>{
        if(res.code==0&&!this._isDestroyed){
          this.allData = res.data
          this.optionsLine1.series[0].data = res.data.now || []
          this.optionsLine1.series[1].data = res.data.last || []
          let _tableData1 = [
            {name: '本月', stopTimes: null, stopHours: null, stopLoss: null},
            {name: '上月', stopTimes: null, stopHours: null, stopLoss: null},
            {name: '去年同月', stopTimes: null, stopHours: null, stopLoss: null},
            {name: '环比', stopTimes: null, stopHours: null, stopLoss: null},
            {name: '同比', stopTimes: null, stopHours: null, stopLoss: null}
          ]
          res.data.stat.forEach((item, index) => {
            _tableData1[index] = {..._tableData1[index], ...item}
          })
          this.tableData1 = _tableData1
          this.tableData2 = res.data.plantStopTimesTop || []
          this.tableData3 = res.data.plantStopHoursTop || []
          this.tableData4 = res.data.plantStopLossTop || []
        }else{
          this.allData = {}
          this.optionsLine1.series[0].data = []
          this.optionsLine1.series[1].data = []
          this.tableData1 = [
            {name: '本月', stopTimes: null, stopHours: null, stopLoss: null},
            {name: '上月', stopTimes: null, stopHours: null, stopLoss: null},
            {name: '去年同月', stopTimes: null, stopHours: null, stopLoss: null},
            {name: '环比', stopTimes: null, stopHours: null, stopLoss: null},
            {name: '同比', stopTimes: null, stopHours: null, stopLoss: null}
          ]
          this.tableData2 = []
          this.tableData3 = []
          this.tableData4 = []
        }
      })
    },
    getTooltip: function(param){
      let html = `故障停机台次 (${param[0].axisValueLabel})<br>`
      param.forEach(item=>{
        html += `<div style="display:flex;"><span>${item.marker}${item.seriesName}：</span><b style="flex:1;display: inline-block;text-align:right;margin-left: 15px">${item.data[1]} 次</b></div>`
      })
      return html
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
    width: 100%;height: 242px; margin-bottom: 10px;
    .box11{
      width: 100%; margin-bottom: 4px;
      .box111{
        height: 100%; background: #fafafa; border-radius: 4px; justify-content: center; padding: 0 30px;
        &:first-child{margin-right: 4px;}
        .p1{font-size: 16px; color: #333;}
        .p2{font-size: 36px; color: #333;line-height: 60px;}
        .p3{font-size: 14px;color: #999;}
        i{margin: -3px 3px 0 0;}
        .numb{font-size: 18px;}
      }
    }
    .box12{
      width: 100%;height: 36%; background: #fafafa; border-radius: 4px;padding: 0 30px;
      .percent>.flex-1:first-child{margin-bottom: 4px;}
      .p1{font-size: 16px; color: #333;}
      .p2{font-size: 36px; color: #333;margin-left: 30px;}
      .p3{font-size: 14px;color: #999;}
      i{margin: -3px 3px 0 0;}
      .numb{font-size: 18px;}
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