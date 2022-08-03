<!-- 督办单发起列表  全部 -->
<template>
  <div class="supervision flex-column">
    <YfSearch tActive="date" :time="time" @confirm="submit" layout="dateType,submit"></YfSearch>
    <div class="flex-1 flex-row">
      <div class="wrap1 flex-column">
        <div class="box1 flex-column">
          <div class="box11 flex-1 flex-row">
            <div class="box111 flex-1 flex-column">
              <p class="p1">故障停机台次</p>
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
              <p class="p1">故障停机时长(h)</p>
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
            <p class="p1">故障损失电量 (万kwh)</p>
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
            <span class="tit">风机故障部件统计分析</span>
            <div class="flex-1"></div>
            <span>统计对象：</span>
            <el-select style="width: 160px;" v-model="plantId" placeholder="全公司" size="small" clearable @change="getAllData()">
              <el-option :label="item.plantName" :value="item.plantId" v-for="item in plantList" :key="item.plantId"></el-option>
            </el-select>
          </div>
          <div class="box2Item flex-1 flex-column">
            <div class="chartWrap flex-row" style="height: calc(50% - 40px)">
              <div class="flex-1 flex-column">
                <p class="tit">故障停机台次前五名</p>
                <div class="flex-1 flex-row">
                  <div class="chartBox flex-1 flex-column">
                    <YfEcharts id="echartBar1" ref="echartBar1" :options="optionsBar1"></YfEcharts>
                  </div>
                  <div class="legendWrap flex-column">
                    <span class="flex-1" :style="{color: optionsBar1.color[0],display:'flex','align-items': 'center','justify-content': 'right'}" 
                      v-for="(item,index) in optionsBar1.series[0].data" :key="index">{{item[0]}}%</span>
                  </div>
                </div>
              </div>
              <div class="flex-1 flex-column">
                <p class="tit">故障停机台次后五名</p>
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
            </div>
            <div class="chartTop flex-vCenter">
              <span class="tit">故障部件对标分析</span>
            </div>
            <div class="tableWrap flex-1 flex-column">
              <el-table :data="tableData1" border height="100%" style="width: 100%;" size="small">
                <el-table-column type="index" label="序号" width="55"></el-table-column>
                <el-table-column prop="systemName" label="风机部件" min-width="120px"></el-table-column>
                <el-table-column prop="now" label="本周期"></el-table-column>
                <el-table-column prop="lastMonth" label="上周期"></el-table-column>
                <el-table-column prop="lastYear" label="去年同期"></el-table-column>
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
      <div class="wrap2 flex-1 flex-column">
        <div class="tableWrap flex-1 flex-column">
          <div class="boxTop flex-vCenter">
            <i class="icon el-icon-set-up"></i>
            <span class="tit">故障停机台次对标分析(台次)</span>
          </div>
          <div class="tableBox flex-1">
            <el-table :data="tableData2" border height="100%" style="width: 100%;" size="small">
              <el-table-column type="index" label="序号" width="55"></el-table-column>
              <el-table-column prop="plantName" label="风场名称"></el-table-column>
              <el-table-column prop="now" label="本周期"></el-table-column>
              <el-table-column prop="lastMonth" label="上周期"></el-table-column>
              <el-table-column prop="lastYear" label="去年同期"></el-table-column>
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
            <span class="tit">故障停机时长对标分析(h)</span>
          </div>
          <div class="tableBox flex-1">
            <el-table :data="tableData3" border height="100%" style="width: 100%;" size="small">
              <el-table-column type="index" label="序号" width="55"></el-table-column>
              <el-table-column prop="plantName" label="风场名称"></el-table-column>
              <el-table-column prop="now" label="本周期"></el-table-column>
              <el-table-column prop="lastMonth" label="上周期"></el-table-column>
              <el-table-column prop="lastYear" label="去年同期"></el-table-column>
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
            <span class="tit">故障损失电量对标分析(万kwh)</span>
          </div>
          <div class="tableBox flex-1">
            <el-table :data="tableData4" border height="100%" style="width: 100%;" size="small">
              <el-table-column type="index" label="序号" width="55"></el-table-column>
              <el-table-column prop="plantName" label="风场名称"></el-table-column>
              <el-table-column prop="now" label="本周期"></el-table-column>
              <el-table-column prop="lastMonth" label="上周期"></el-table-column>
              <el-table-column prop="lastYear" label="去年同期"></el-table-column>
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
      time: this.$moment().format('YYYY-MM-DD'),
      form: {},
      plantId: '',
      plantList: [], // 所有风场列表
      allData: {},
      tableData1: [],
      tableData2: [],
      tableData3: [],
      tableData4: [],
      optionsBar1:{
        animation:false,color: ['#FF6666'],
        grid: {bottom:5,top:5,left:20,right:20,containLabel:true},
        xAxis:[
          {type: 'value',min: 0, axisLine:{show:false},axisTick:{show:false}, axisLabel:{show:false},splitLine:{show:false},scale:true},
        ],
        yAxis:[
          {type: 'category',axisLine:{show:false},splitLine:{show:false}, axisTick:{show:false},axisLabel:{color:"#999",fontSize:13,align: 'right'},inverse:true}
        ],
        series:[
          {name: '前5名', type: 'bar',showSymbol: false, barWidth: 12,
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
          {type: 'category',axisLine:{show:false},splitLine:{show:false}, axisTick:{show:false},axisLabel:{color:"#999",fontSize:13,align: 'right'},inverse:true}
        ],
        series:[
          {name: '后5名', type: 'bar',showSymbol: false, barWidth: 12,
          data:[]}
        ]
      },
    }
  },
  mounted(){
    this.getPlantList()
  },
  methods: {
    getPlantList: function(){
      this.$http.fetchGet(`plant/plantList`).then(res => {
				if(res.code==0&&!this._isDestroyed){
					this.plantList = res.data;
				}
			});
    },
    getAllData: function(){
      this.$http.fetchGet(`stop/fanErrorOverview?startDate=${this.form.stime}&endDate=${this.form.etime}&plantId=${this.plantId}`).then(res=>{
        if(res.code==0&&!this._isDestroyed){
          this.allData = res.data
          this.optionsBar1.series[0].data = res.data.now || []
          this.optionsBar2.series[0].data = res.data.last || []
          this.tableData1 = res.data.errorSystemTop || []
          this.tableData2 = res.data.plantStopTimesTop || []
          this.tableData3 = res.data.plantStopHoursTop || []
          this.tableData4 = res.data.plantStopLossTop || []
        }else{
          this.allData = {}
          this.optionsBar1.series[0].data = []
          this.optionsBar2.series[0].data = []
          this.tableData1 = []
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
        .p2{font-size: 36px; color: #333;margin-left: -2px;line-height: 60px;}
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
      height: 40px;width: 100%;font-size: 14px; padding: 0 20px; margin-bottom: 10px;
    }
    .chartWrap{
      padding: 20px 0 0;
      .tit{padding: 0 20px;}
      .legendWrap{
        margin: 0 30px 0 0; font-size: 13px;font-weight: bold;
      }
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