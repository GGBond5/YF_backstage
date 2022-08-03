<template>
  <div class="flex-1 flex-column">
    <YfSearch layout="dateType,submit" @confirm="submit"></YfSearch>
    <div class="statisticsHeader">
      <div class="chartTop flex-between">
        <span class="tit">故障消缺率排名</span>
        <div class="flex-row">
          <span class="btn first" :class="{active: chartBar1Index == 'first'}" @click="changeChartSort('first')">前5名</span>
          <span class="btn last" :class="{active: chartBar1Index == 'last'}" @click="changeChartSort('last')">后5名</span>
        </div>
      </div>
      <div class="eList flex-1 flex-row"> 
        <div class="echarts flex-column">
          <div class="echartsTitle">xxxxxxxxx</div>
          <div class="flex-row flex-1">
            <YfEcharts id="echartBar1" ref="echartBar1" :options="optionsBar1"></YfEcharts>
            <div class="describe flex-column">
              <span v-for="(v, i) in optionsBar1.series[0].data" :key="i+'bar1'" class="flex-1">{{v[0]}}</span>
            </div>
          </div>
        </div>
        <div class="echarts flex-column">
          <div class="echartsTitle">xxxxxxxxx</div>
          <div class="flex-row flex-1">
            <YfEcharts id="echartBar2" ref="echartBar1" :options="optionsBar1"></YfEcharts>
            <div class="describe flex-column">
              <span v-for="(v, i) in optionsBar1.series[0].data" :key="i+'bar1'" class="flex-1">{{v[0]}}</span>
            </div>
          </div>
        </div>
        <div class="echarts flex-column">
          <div class="echartsTitle">xxxxxxxxx</div>
          <div class="flex-row flex-1">
            <YfEcharts id="echartBar3" ref="echartBar1" :options="optionsBar1"></YfEcharts>
            <div class="describe flex-column">
              <span v-for="(v, i) in optionsBar1.series[0].data" :key="i+'bar1'" class="flex-1">{{v[0]}}</span>
            </div>
          </div>
        </div>
        <div class="echarts flex-column">
          <div class="echartsTitle">xxxxxxxxx</div>
          <div class="flex-row flex-1">
            <YfEcharts id="echartBar4" ref="echartBar1" :options="optionsBar1"></YfEcharts>
            <div class="describe flex-column">
              <span v-for="(v, i) in optionsBar1.series[0].data" :key="i+'bar1'" class="flex-1">{{v[0]}}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="flex-1">
      <el-table
        :data="tableData"
        border
        height="100%"
        :summary-method="getSummaries"
        show-summary
        style="width: 100%;">
        <el-table-column
          prop="id"
          label="ID"
          width="60">
        </el-table-column>
        <el-table-column
          prop="name"
          label="姓名"
          width="120">
        </el-table-column>
        <el-table-column
          prop="amount1"
          label="数值 1（元）">
        </el-table-column>
        <el-table-column
          prop="amount2"
          label="数值 2（元）">
        </el-table-column>
        <el-table-column
          prop="amount3"
          label="数值 3（元）">
        </el-table-column>
        <el-table-column
          prop="amount3"
          label="数值 4（元）">
        </el-table-column>
        <el-table-column
          prop="name"
          label="姓名"
          width="120">
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      chartBar1Index: 'first',
      optionsBar1:{
        animation:false,color: ['#FF9900'],
        grid: [{left: 0,width: 300,bottom: 0,top: 0,left: 80}],
        tooltip:{trigger:'axis',formatter:(param)=>{return this.getTooltip1(param)}},
        xAxis:[
          {type: 'value',min:0,max: 100,axisLine:{show:false},axisTick:{show:false},gridIndex: 0,
          axisLabel:{show:false},splitLine:{show:false},position: 'top'}
        ],
        yAxis:[
          {type: 'category',axisLine:{lineStyle: {color:"#e5e5e5"}},position: 'left',splitLine:{show:false},gridIndex: 0,
          axisTick:{show:false},axisLabel:{color:"#999",fontSize:12,showMaxLabel:true,width: 80,align: 'center',margin: 40},inverse:true},
        ],
        series:[
          {name: '本月', type: 'bar',showSymbol: false, xAxisIndex:0,yAxisIndex:0,barWidth: 10,showBackground: true,backgroundStyle: {color: 'rgba(180, 180, 180, 0.15)'},
          data:[[82.5,'大山坪'],[76,'乌江源'],[64.25,'南山'],[50,'雪山'],[22.1,'韭菜坪']]}
        ]
      },
      tableData: [{
        id: '1',
        name: '王小虎',
        amount1: '234',
        amount2: '3.2',
        amount3: 10
      }, {
        id: '2',
        name: '王小虎',
        amount1: '165',
        amount2: '4.43',
        amount3: 12
      }, {
        id: '3',
        name: '王小虎',
        amount1: '324',
        amount2: '1.9',
        amount3: 9
      }, {
        id: '4',
        name: '王小虎',
        amount1: '621',
        amount2: '2.2',
        amount3: 17
      }, {
        id: '5',
        name: '王小虎',
        amount1: '539',
        amount2: '4.1',
        amount3: 15
      }, {
        id: '6',
        name: '王小虎',
        amount1: '165',
        amount2: '4.43',
        amount3: 12
      }, {
        id: '7',
        name: '王小虎',
        amount1: '324',
        amount2: '1.9',
        amount3: 9
      }, {
        id: '8',
        name: '王小虎',
        amount1: '621',
        amount2: '2.2',
        amount3: 17
      }, {
        id: '9',
        name: '王小虎',
        amount1: '539',
        amount2: '4.1',
        amount3: 15
      }, {
        id: '10',
        name: '王小虎',
        amount1: '621',
        amount2: '2.2',
        amount3: 17
      }, {
        id: '11',
        name: '王小虎',
        amount1: '539',
        amount2: '4.1',
        amount3: 15
      }]
    }
  },
  created() {
    console.log(+new Date());
  },
  methods: {
    getTooltip1 (param){
      let html = `故障消除率 (${param[0].axisValueLabel})<br>`
      param.forEach(item=>{
        html += `<div style="display:flex;"><span>${item.marker}${item.seriesName}：</span><b style="flex:1;display: inline-block;text-align:right;margin-left: 15px">${item.data[0]} 次</b></div>`
      })
      return html
    },
    changeChartSort (index){
      if(this.chartBar1Index != index){
        this.chartBar1Index = index
      }
    },
    submit (data) {
      console.log(data);
    },
    getSummaries(param) {
      const { columns, data } = param;
      const sums = [];
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = '总计';
          return;
        }
        const values = data.map(item => Number(item[column.property]));
        if (!values.every(value => isNaN(value))) {
          sums[index] = values.reduce((prev, curr) => {
            const value = Number(curr);
            if (!isNaN(value)) {
              return prev + curr;
            } else {
              return prev;
            }
          }, 0);
          sums[index] = sums[index].toFixed(2) + ' 元';
        } else {
          sums[index] = 'N/A';
        }
      });
      return sums;
    }
  }
}
</script>

<style lang="less" scoped>
.statisticsHeader {
  margin: 10px;
  margin-top: 0;
  max-height: 260px;
  border: 1px solid #f2f2f2;
  .chartTop{
    height: 40px;width: 100%;font-size: 14px; padding: 0 20px;border-bottom:1px solid #f2f2f2;
    .tit {font-size: 12px;}
    .btn{
      display: block;width: 58px;height: 24px;line-height: 22px;font-size: 12px;color: #999;text-align: center;border: 1px solid #E4E7ED;cursor: pointer;
      &.first{
        border-top-left-radius: 3px;border-bottom-left-radius: 3px;border-right: none;position: relative;
        &::after{content: '';display: block;width: 1px;height: 24px;overflow: hidden;position: absolute;top: -1px;right: 0;background-color: var(--color2);}
      }
      &.last{border-top-right-radius: 3px;border-bottom-right-radius: 3px;border-left: none;}
      &.active{border-color: var(--color2);color: var(--color2);}
    }
  }
  .eList {
    .echarts {
      flex: 1;
      height: 200px;
      min-width: 320px;
      .echartsTitle {
        line-height: 40px;
        padding: 0 20px;
      }
      .describe {
        width: 60px;
        height: 100%;
        padding-right: 14px;
        font-size: 12px;
        text-align: right;
        color: var(--color4);
        > span {
          line-height: 32px;
        }
      }
    }
  }
}
</style>