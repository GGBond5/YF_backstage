<!-- 督办单发起列表 -->
<template>
  <div class="supervision flex-column">
    <YfSearch tActive="month" :time="time" @confirm="submit" layout="orderCategory,date,submit"></YfSearch>
    <div style="width: 100%; height: 10px; background: #fafafa;overflow: hidden;"></div>
    <div class="flex-1" style="overflow: auto;">
      <div class="content flex-row">
        <div class="wrap1 flex-column">
          <div class="box1 flex-1 flex-column">
            <div class="boxTop flex-vCenter">
              <i class="icon yfFont icon-yusuankemuguanli"></i>
              <span class="tit">本月故障处理情况</span>
              <div class="flex-1"></div>
            </div>
            <div class="itemBox1 flex-row">
              <div class="item flex-column">
                <div class="itemTit">故障消缺率</div>
                <div class="flex-1 flex-vCenter">
                  <span class="numb flex-1">{{$toFixed(errorInfo.faultRatio,2)}}%</span>
                  <div class="flex-column">
                    <p class="flex-vCenter">
                      <span class="label">同比：</span>
                      <span class="flex-1 percent">
                        <i class="color5" v-if="errorInfo.yoy<0">↓</i>
                        <i class="color1" v-if="errorInfo.yoy>0">↑</i>
                        <em :class="{color5:errorInfo.yoy<0,color1:errorInfo.yoy>0}">{{$toFixed(errorInfo.yoy,2)}}%</em>
                      </span>
                    </p>
                    <p class="flex-vCenter">
                      <span class="label">环比：</span>
                      <span class="flex-1 percent">
                        <i class="color5" v-if="errorInfo.mom<0">↓</i>
                        <i class="color1" v-if="errorInfo.mom>0">↑</i>
                        <em :class="{color5:errorInfo.mom<0,color1:errorInfo.mom>0}">{{$toFixed(errorInfo.mom,2)}}%</em>
                      </span>
                    </p>
                  </div>
                </div>
              </div>
              <div class="flex-1"></div>
              <div class="item flex-column">
                <div class="itemTit">故障停机台次</div>
                <div class="flex-1 flex-vCenter">
                  <span class="numb flex-1">{{$toFixed(errorInfo.faultStopNum,0)}}</span>
                  <div class="flex-column">
                    <p class="flex-vCenter">
                      <span class="label">上月：</span>
                      <span class="flex-1 percent"><em>{{$toFixed(errorInfo.lastFaultStopNum,0)}}</em></span>
                    </p>
                    <p class="flex-vCenter">
                      <span class="label">环比：</span>
                      <span class="flex-1 percent color5">
                        <i class="color5" v-if="errorInfo.faultMom<0">↓</i>
                        <i class="color1" v-if="errorInfo.faultMom>0">↑</i>
                        <em :class="{color5:errorInfo.faultMom<0,color1:errorInfo.faultMom>0}">{{$toFixed(errorInfo.faultMom,2)}}%</em>
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div class="chartTop flex-vCenter">
              <span class="tit">故障停机月度统计</span>
              <div class="flex-1"></div>
              <span class="line color1">本月</span>
              <span class="line color2">上月</span>
            </div>
            <div class="chartWrap flex-1 flex-column" style="width: 100%;">
              <YfEcharts id="echartLine1" ref="echartLine1" :options="optionsLine1"></YfEcharts>
            </div>
            <div class="chartTop flex-vCenter">
              <span class="tit">故障消缺率排名</span>
              <div class="flex-1"></div>
              <span class="btn first" :class="{active: chartBar1Index == 'first'}" @click="changeChartSort(1,'first')">前5名</span>
              <span class="btn last" :class="{active: chartBar1Index == 'last'}" @click="changeChartSort(1,'last')">后5名</span>
            </div>
            <div class="chartWrap flex-column" style="width: 100%;height: 175px;padding: 0 20px 15px;">
              <div class="flex-vCenter" style="width: 100%;height: 26px;line-height: 25px;">
                <div class="flex-1" style="font-size: 12px;color: #999;border-bottom: 1px solid #E4E7ED;height:100%;">上月消缺率</div>
                <div style="width: 80px;height: 100%;"></div>
                <div class="flex-1" style="font-size: 12px;color: #999;text-align: right;border-bottom: 1px solid #E4E7ED;height:100%;">本月消缺率</div>
              </div>
              <div class="flex-1 flex-row">
                <div class="chartLabelWrap flex-column" style="width: 55px;height: 100%;font-size: 12px;">
                  <span class="flex-1" :style="{color: optionsBar1.color[0],display:'flex','align-items': 'center'}" v-for="item in optionsBar1.series[0].data" :key="item[1]">{{$toFixed(item[0],2)}}%</span>
                </div>
                <div class="flex-1 flex-column">
                  <YfEcharts id="echartBar1" ref="echartBar1" :options="optionsBar1"></YfEcharts>
                </div>
                <div class="chartLabelWrap flex-column" style="width: 55px;height: 100%;font-size: 12px;text-align: right;">
                  <span class="flex-1" :style="{color: optionsBar1.color[1],display:'flex','align-items': 'center','justify-content': 'right'}" v-for="item in optionsBar1.series[1].data" :key="item[1]">{{$toFixed(item[0],2)}}%</span>
                </div>
              </div>
            </div>
          </div>
          <div style="width: 100%; height: 10px; background: #fafafa;overflow: hidden;"></div>
          <div class="box2 flex-column">
            <div class="boxTop flex-vCenter">
              <i class="icon el-icon-s-tools"></i>
              <span class="tit">本月临时任务工作情况</span>
              <div class="flex-1"></div>
            </div>
            <div class="itemBox2 flex-1 flex-vCenter">
              <div class="flex-1 item flex-middle">
                <span class="numb">{{$toFixed(tempInfo.ratio,2)}}%</span>
                <span class="txt">完成率</span>
              </div>
              <div class="flex-1 item flex-middle">
                <span class="numb">{{$toFixed(tempInfo.totalSupervise,0)}}</span>
                <span class="txt">临时任务数</span>
              </div>
              <div class="flex-1 item flex-middle">
                <span class="numb">{{$toFixed(tempInfo.processedNum,0)}}</span>
                <span class="txt">已处理</span>
              </div>
            </div>
          </div>
        </div>
        <div style="width: 10px; height: 100%; background: #fafafa;overflow: hidden;"></div>
        <div class="flex-1 flex-column">
          <div class="wrap2 flex-vCenter">
            <div class="chartWrap flex-column" style="width: 240px; height: 100%;">
              <YfEcharts id="echartGauge1" ref="echartGauge1" :options="optionsGauge1"></YfEcharts>
            </div>
            <div class="itemBox3 flex-1 flex-vCenter">
              <div class="flex-1 item flex-column">
                <span class="txt">总消除率</span>
                <span class="numb">{{$toFixed(rateData.ratio,2)}}%</span>
              </div>
              <div class="flex-1 item flex-column">
                <span class="txt">同比</span>
                <span class="numb">{{$toFixed(rateData.yoy,2)}}%</span>
              </div>
              <div class="flex-1 item flex-column">
                <span class="txt">环比</span>
                <span class="numb">{{$toFixed(rateData.mom,2)}}%</span>
              </div>
              <div class="flex-1 item flex-column">
                <span class="txt">督办单总件数</span>
                <span class="numb">{{$toFixed(rateData.totalSupervise,0)}}</span>
              </div>
              <div class="flex-1 item flex-column">
                <span class="txt">已处理件数</span>
                <span class="numb">{{$toFixed(rateData.processedNum,0)}}</span>
              </div>
            </div>
          </div>
          <div style="width: 100%; height: 10px; background: #fafafa;overflow: hidden;"></div>
          <div class="flex-1 flex-row">
            <div class="flex-1 flex-column">
              <div class="wrap3 flex-column">
                <div class="boxTop flex-vCenter">
                  <i class="icon el-icon-time"></i>
                  <span class="tit">本月定检工作情况</span>
                  <div class="flex-1"></div>
                  <span class="square color5">完成率</span>
                  <span class="square color2">已处理</span>
                  <span class="square color7">计划工作</span>
                </div>
                <div class="itemBox1 flex-row">
                  <div class="item flex-column">
                    <div class="itemTit">定检完成率</div>
                    <div class="flex-1 flex-vCenter">
                      <span class="numb flex-1">{{$toFixed(dingjianInfo.ratio,2)}}%</span>
                      <div class="flex-column">
                        <p class="flex-vCenter">
                          <span class="label">同比：</span>
                          <span class="flex-1 percent">
                            <i class="color5" v-if="dingjianInfo.yoy<0">↓</i>
                            <i class="color1" v-if="dingjianInfo.yoy>0">↑</i>
                            <em :class="{color5:dingjianInfo.yoy<0,color1:dingjianInfo.yoy>0}">{{$toFixed(dingjianInfo.yoy,2)}}%</em>
                          </span>
                        </p>
                        <p class="flex-vCenter">
                          <span class="label">环比：</span>
                          <span class="flex-1 percent">
                            <i class="color5" v-if="dingjianInfo.mom<0">↓</i>
                            <i class="color1" v-if="dingjianInfo.mom>0">↑</i>
                            <em :class="{color5:dingjianInfo.mom<0,color1:dingjianInfo.mom>0}">{{$toFixed(dingjianInfo.mom,2)}}%</em>
                          </span>
                        </p>
                      </div>
                    </div>
                  </div>
                  <div class="flex-1"></div>
                  <div class="item flex-column">
                    <div class="itemTit">定检计划</div>
                    <div class="flex-1 flex-vCenter">
                      <span class="numb flex-1">{{$toFixed(dingjianInfo.processedNum,0)}} / {{$toFixed(dingjianInfo.totalSupervise,0)}}</span>
                      <div class="flex-column">
                        <p class="flex-vCenter"></p>
                        <p class="flex-vCenter">
                          <span class="label">已处理 / 计划工作</span>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="chartTop flex-vCenter">
                  <span class="tit">定检工作完成率排名</span>
                  <div class="flex-1"></div>
                  <span class="btn first" :class="{active: chartBar2Index == 'first'}" @click="changeChartSort(2,'first')">前5名</span>
                  <span class="btn last" :class="{active: chartBar2Index == 'last'}" @click="changeChartSort(2,'last')">后5名</span>
                </div>
                <div class="chartWrap flex-1 flex-row" style="width: 100%;padding: 0 20px 15px;">
                  <div class="chartLabelWrap flex-column" style="width: 55px;height: 100%;font-size: 12px;">
                    <span class="flex-1" :style="{color: optionsBar2.color[0],display:'flex','align-items': 'center'}" v-for="item in optionsBar2.series[0].data" :key="item[1]">{{item[0]}}%</span>
                  </div>
                  <div class="flex-1 flex-column">
                    <YfEcharts id="echartBar2" ref="echartBar2" :options="optionsBar2"></YfEcharts>
                  </div>
                  <div class="chartLabelWrap flex-column" style="width: 60px;height: 100%;font-size: 12px;text-align: right;">
                    <span class="flex-1" :style="{color: optionsBar2.color[1],display:'flex','align-items': 'center','justify-content': 'right'}" 
                    v-for="(item,index) in optionsBar2.series[1].data" :key="item[1]">{{item[0]}}<em :style="{color: optionsBar2.color[2]}">/{{optionsBar2.series[2].data[index][0]}}</em></span>
                  </div>
                </div>
              </div>
              <div style="width: 100%; height: 10px; background: #fafafa;overflow: hidden;"></div>
              <div class="wrap4 flex-column">
                <div class="boxTop flex-vCenter">
                  <i class="icon yfFont icon-shishi"></i>
                  <span class="tit">本月维护工作情况</span>
                  <div class="flex-1"></div>
                  <span class="line color5">完成率</span>
                  <span class="square color2">已处理</span>
                  <span class="square color7">计划工作</span>
                </div>
                <div class="itemBox4 flex-vCenter">
                  <span class="lab" style="font-size: 14px;margin-right: 30px;">维护完成率</span>
                  <span class="numb" style="font-size: 28px;color: #333;">{{$toFixed(weihuInfo.ratio,2)}}%</span>
                  <div class="flex-2"></div>
                  <span class="lab">同比：</span>
                  <i class="color5" v-if="weihuInfo.yoy<0">↓</i>
                  <i class="color1" v-if="weihuInfo.yoy>0">↑</i>
                  <span :class="{color5:weihuInfo.yoy<0,color1:weihuInfo.yoy>0}">{{$toFixed(weihuInfo.yoy,2)}}%</span>
                  <div class="flex-1"></div>
                  <span class="lab">环比：</span>
                  <i class="color5" v-if="weihuInfo.mom<0">↓</i>
                  <i class="color1" v-if="weihuInfo.mom>0">↑</i>
                  <span :class="{color5:weihuInfo.mom<0,color1:weihuInfo.ymomoy>0}">{{$toFixed(weihuInfo.mom,2)}}%</span>
                </div>
                <div class="chartTop flex-vCenter">
                  <span class="tit">维护工作完成率排名</span>
                  <div class="flex-1"></div>
                  <span class="btn first" :class="{active: chartBar3Index == 'first'}" @click="changeChartSort(3,'first')">前5名</span>
                  <span class="btn last" :class="{active: chartBar3Index == 'last'}" @click="changeChartSort(3,'last')">后5名</span>
                </div>
                <div class="chartWrap flex-1 flex-column" style="width: 100%;">
                  <YfEcharts id="echartBar3" ref="echartBar3" :options="optionsBar3"></YfEcharts>
                </div>
              </div>
            </div>
            <div style="width: 10px; height: 100%; background: #fafafa;overflow: hidden;"></div>
            <div class="flex-1 flex-column">
              <div class="wrap3 flex-column">
                <div class="boxTop flex-vCenter">
                  <i class="icon yfFont icon-lijishenhe"></i>
                  <span class="tit">本月巡检工作情况</span>
                  <div class="flex-1"></div>
                  <span class="square color5">完成率</span>
                  <span class="square color2">已处理</span>
                  <span class="square color7">计划工作</span>
                </div>
                <div class="itemBox1 flex-row">
                  <div class="item flex-column">
                    <div class="itemTit">巡检完成率</div>
                    <div class="flex-1 flex-vCenter">
                      <span class="numb flex-1">{{$toFixed(xunjianInfo.ratio,2)}}%</span>
                      <div class="flex-column">
                        <p class="flex-vCenter">
                          <span class="label">同比：</span>
                          <span class="flex-1 percent color1">
                            <i class="color5" v-if="xunjianInfo.yoy<0">↓</i>
                            <i class="color1" v-if="xunjianInfo.yoy>0">↑</i>
                            <em :class="{color5:xunjianInfo.yoy<0,color1:xunjianInfo.yoy>0}">{{$toFixed(xunjianInfo.yoy,2)}}%</em>
                          </span>
                        </p>
                        <p class="flex-vCenter">
                          <span class="label">环比：</span>
                          <span class="flex-1 percent color5">
                            <i class="color5" v-if="xunjianInfo.mom<0">↓</i>
                            <i class="color1" v-if="xunjianInfo.mom>0">↑</i>
                            <em :class="{color5:xunjianInfo.mom<0,color1:xunjianInfo.mom>0}">{{$toFixed(xunjianInfo.mom,2)}}%</em>
                          </span>
                        </p>
                      </div>
                    </div>
                  </div>
                  <div class="flex-1"></div>
                  <div class="item flex-column">
                    <div class="itemTit">巡检计划</div>
                    <div class="flex-1 flex-vCenter">
                      <span class="numb flex-1">{{$toFixed(xunjianInfo.processedNum,0)}} / {{$toFixed(xunjianInfo.totalSupervise,0)}}</span>
                      <div class="flex-column">
                        <p class="flex-vCenter"></p>
                        <p class="flex-vCenter">
                          <span class="label">已处理 / 计划工作</span>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="chartTop flex-vCenter">
                  <span class="tit">巡检工作完成率排名</span>
                  <div class="flex-1"></div>
                  <span class="btn first" :class="{active: chartBar4Index == 'first'}" @click="changeChartSort(4,'first')">前5名</span>
                  <span class="btn last" :class="{active: chartBar4Index == 'last'}" @click="changeChartSort(4,'last')">后5名</span>
                </div>
                <div class="chartWrap flex-1 flex-row" style="width: 100%;padding: 0 20px 15px;">
                  <div class="chartLabelWrap flex-column" style="width: 55px;height: 100%;font-size: 12px;">
                    <span class="flex-1" :style="{color: optionsBar4.color[0],display:'flex','align-items': 'center'}" v-for="item in optionsBar4.series[0].data" :key="item[1]">{{item[0]}}%</span>
                  </div>
                  <div class="flex-1 flex-column">
                    <YfEcharts id="echartBar4" ref="echartBar4" :options="optionsBar4"></YfEcharts>
                  </div>
                  <div class="chartLabelWrap flex-column" style="width: 60px;height: 100%;font-size: 12px;text-align: right;">
                    <span class="flex-1" :style="{color: optionsBar4.color[1],display:'flex','align-items': 'center','justify-content': 'right'}" 
                    v-for="(item,index) in optionsBar4.series[1].data" :key="item[1]">{{item[0]}}<em :style="{color: optionsBar4.color[2]}">/{{optionsBar4.series[2].data[index][0]}}</em></span>
                  </div>
                </div>
              </div>
              <div style="width: 100%; height: 10px; background: #fafafa;overflow: hidden;"></div>
              <div class="wrap4 flex-column">
                <div class="boxTop flex-vCenter">
                  <i class="icon el-icon-key"></i>
                  <span class="tit">本月技改工作情况</span>
                  <div class="flex-1"></div>
                  <span class="line color5">完成率</span>
                  <span class="square color2">已处理</span>
                  <span class="square color7">计划工作</span>
                </div>
                <div class="itemBox4 flex-vCenter">
                  <span class="lab" style="font-size: 14px;margin-right: 30px;">技改完成率</span>
                  <span class="numb" style="font-size: 28px;color: #333;">{{$toFixed(jigaiInfo.ratio,2)}}%</span>
                  <div class="flex-2"></div>
                  <span class="lab">同比：</span>
                  <i class="color5" v-if="jigaiInfo.yoy<0">↓</i>
                  <i class="color1" v-if="jigaiInfo.yoy>0">↑</i>
                  <span :class="{color5:jigaiInfo.yoy<0,color1:jigaiInfo.yoy>0}">{{$toFixed(jigaiInfo.yoy,2)}}%</span>
                  <div class="flex-1"></div>
                  <span class="lab">环比：</span>
                  <i class="color5" v-if="jigaiInfo.mom<0">↓</i>
                  <i class="color1" v-if="jigaiInfo.mom>0">↑</i>
                  <span :class="{color5:jigaiInfo.mom<0,color1:jigaiInfo.ymomoy>0}">{{$toFixed(jigaiInfo.mom,2)}}%</span>
                </div>
                <div class="chartTop flex-vCenter">
                  <span class="tit">技改工作完成率排名</span>
                  <div class="flex-1"></div>
                  <span class="btn first" :class="{active: chartBar5Index == 'first'}" @click="changeChartSort(5,'first')">前5名</span>
                  <span class="btn last" :class="{active: chartBar5Index == 'last'}" @click="changeChartSort(5,'last')">后5名</span>
                </div>
                <div class="chartWrap flex-1 flex-column" style="width: 100%;">
                  <YfEcharts id="echartBar5" ref="echartBar5" :options="optionsBar5"></YfEcharts>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div style="width: 100%; height: 10px; background: #fafafa;overflow: hidden;"></div>
  </div>
</template>

<script>
export default {
  data(){
    return {
      time: this.$moment().format('YYYY-MM-DD'),
      form: {},
      rateData: {},
      allData: {}, // 所有数据
      errorInfo: {}, // 故障部分数据
      tempInfo: {}, // 临时任务数据
      dingjianInfo: {}, // 定检数据
      xunjianInfo: {}, // 巡检数据
      weihuInfo: {}, // 维护数据
      jigaiInfo: {}, // 技改数据
      optionsLine1:{
        animation:false,color: ['#FF6666','#38AEF3'],
        grid:{bottom:5,top:10,left:20,right:20,containLabel:true},
        tooltip:{trigger:'axis',formatter:(param)=>{return this.getTooltip(param,'故障停机台次',['台次','台次'],'日')}},
        xAxis:[
          {type: 'category',axisLine:{show:false},
          splitLine:{show:true,lineStyle:{color:"#e5e5e5",type:"dashed"}},
          axisTick:{show:false},axisLabel:{color:"#999",fontSize:12,showMaxLabel:true,formatter: '{value}日'}}
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
      chartBar1Index: 'first',
      optionsBar1:{
        animation:false,color: ['#38AEF3','#26D2A1'],
        grid: [{left: 0,width: 160,bottom: 0,top: 0,right: 240},{width: 160,right: 0,bottom: 0,top: 0 }],
        tooltip:{trigger:'axis',formatter:(param)=>{return this.getTooltip1(param,'故障消缺率排名',['%','%'],'')},confine: true},
        xAxis:[
          {type: 'value',min:0,max: 100,axisLine:{show:false},axisTick:{show:false},gridIndex: 0,
          axisLabel:{show:false},splitLine:{show:false},position: 'top',inverse:true},
          {type: 'value',min:0,max: 100,axisLine:{show:false},axisTick:{show:false},gridIndex: 1,
          axisLabel:{show:false},splitLine:{show:false},position: 'top'}
        ],
        yAxis:[
          {type: 'category',axisLine:{lineStyle: {color:"#e5e5e5"}},position: 'right',splitLine:{show:false},gridIndex: 0,
          axisTick:{show:false},axisLabel:{color:"#999",fontSize:12,showMaxLabel:true,width: 80,align: 'center',margin: 40},inverse:true},
          {type: 'category',axisLine:{lineStyle: {color:"#e5e5e5"}}, splitLine:{show:false},gridIndex: 1,
          axisTick:{show:false},axisLabel:{show:false},inverse:true}
        ],
        series:[
          {name: '上月', type: 'bar',showSymbol: false, xAxisIndex:0,yAxisIndex:0,barWidth: 10,showBackground: true,backgroundStyle: {color: 'rgba(180, 180, 180, 0.15)'},
          data:[]},
          {name: '本月', type: 'bar',showSymbol: false, xAxisIndex:1,yAxisIndex:1,barWidth: 10,showBackground: true,backgroundStyle: {color: 'rgba(180, 180, 180, 0.15)'},
          data:[]}
        ]
      },
      optionsGauge1: {
        series: [
          {
            type: 'gauge', startAngle: 180, endAngle: 0, min: 0, max: 100, splitNumber: 5, center: ['50%', '78%'], radius: '140%',
            progress: {show: true,width: 12,itemStyle:{
              color: new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [
                {offset: 0, color: 'rgba(50, 205, 153, 1)'}, {offset: 1, color: 'rgba(1, 254, 153, 1)'}
              ])
            }}, axisLine: {lineStyle: { width: 12 }}, axisTick: {show: false}, 
            splitLine: {length: 4,distance: 0, lineStyle: { width: 1, color: '#aaa' }},
            axisLabel: {distance: 16, color: '#aaa', fontSize: 12},pointer: {itemStyle:{color: '#26D2A1'}},
            anchor: {show: true, showAbove: true, size: 12, itemStyle: { borderWidth: 1,borderColor: '#26D2A1' }},
            title: { show: true,fontSize: 12, color: '#aaa' }, detail: { show: false },
            data: [{ value: 0, name: '总消除率(%)' }]
          }
        ]
      },
      chartBar2Index: 'first',
      optionsBar2:{
        animation:false,color: ['#26D2A1','#38AEF3','#F6BD16'],
        grid: [{left: 0,width: 160,bottom: 0,top: 0,right: 240},{width: 160,right: 0,bottom: 0,top: 0 }],
        tooltip:{trigger:'axis',formatter:(param)=>{return this.getTooltip1(param,'定检任务统计',['%','次','次'],'')},confine: true},
        xAxis:[
          {type: 'value',min:0,max: 100,axisLine:{show:false},axisTick:{show:false},gridIndex: 0,
          axisLabel:{show:false},splitLine:{show:false},position: 'top',inverse:true},
          {type: 'value',axisLine:{show:false},axisTick:{show:false},gridIndex: 1,
          axisLabel:{show:false},splitLine:{show:false},position: 'top'}
        ],
        yAxis:[
          {type: 'category',axisLine:{lineStyle: {color:"#e5e5e5"}},position: 'right',splitLine:{show:false},gridIndex: 0,
          axisTick:{show:false},axisLabel:{color:"#999",fontSize:12,showMaxLabel:true,width: 80,align: 'center',margin: 40},inverse:true},
          {type: 'category',axisLine:{lineStyle: {color:"#e5e5e5"}}, splitLine:{show:false},gridIndex: 1,
          axisTick:{show:false},axisLabel:{show:false},inverse:true}
        ],
        series:[
          {name: '完成率', type: 'bar',showSymbol: false, xAxisIndex:0,yAxisIndex:0,barWidth: 10,showBackground: true,backgroundStyle: {color: 'rgba(180, 180, 180, 0.15)'},
          data:[]},
          {name: '已处理', type: 'bar',showSymbol: false, xAxisIndex:1,yAxisIndex:1,barWidth: 8,
          data:[]},
          {name: '计划量', type: 'bar',showSymbol: false, xAxisIndex:1,yAxisIndex:1,barWidth: 8,
          data:[]}
        ]
      },
      chartBar3Index: 'first',
      optionsBar3:{
        animation:false,color: ['#26D2A1','#38AEF3','#F6BD16'],
        grid: {bottom:5,top:10,left:20,right:20,containLabel:true},
        tooltip:{trigger:'axis',formatter:(param)=>{return this.getTooltip(param,'维护任务统计',['%','次','次'],'')},confine: true},
        xAxis:[
          {type: 'category',axisLine:{lineStyle: {color:"#e5e5e5"}},axisTick:{show:false},
          axisLabel:{color:"#999",fontSize:12},splitLine:{show:false}}
        ],
        yAxis:[
          {type: 'value',min:0,max: 100,axisLine:{show:true,lineStyle: {color:"#e5e5e5"}}, splitLine:{show:false},
          axisTick:{show:false},axisLabel:{color:"#999",fontSize:12,formatter: '{value}%'}},
          {type: 'value',axisLine:{show:true,lineStyle: {color:"#e5e5e5"}},splitLine:{show:false},
          axisTick:{show:false},axisLabel:{color:"#999",fontSize:12}},
        ],
        series:[
          {name: '完成率', type: 'line',yAxisIndex:0,
          data:[]},
          {name: '已处理', type: 'bar',showSymbol: false,yAxisIndex:1, barWidth: 8,
          data:[]},
          {name: '计划量', type: 'bar',showSymbol: false,yAxisIndex:1, barWidth: 8,
          data:[]}
        ]
      },
      chartBar4Index: 'first',
      optionsBar4:{
        animation:false,color: ['#26D2A1','#38AEF3','#F6BD16'],
        grid: [{left: 0,width: 160,bottom: 0,top: 0,right: 240},{width: 160,right: 0,bottom: 0,top: 0 }],
        tooltip:{trigger:'axis',formatter:(param)=>{return this.getTooltip1(param,'巡检任务统计',['%','次','次'],'')},confine: true},
        xAxis:[
          {type: 'value',min:0,max: 100,axisLine:{show:false},axisTick:{show:false},gridIndex: 0,
          axisLabel:{show:false},splitLine:{show:false},position: 'top',inverse:true},
          {type: 'value',axisLine:{show:false},axisTick:{show:false},gridIndex: 1,
          axisLabel:{show:false},splitLine:{show:false},position: 'top'}
        ],
        yAxis:[
          {type: 'category',axisLine:{lineStyle: {color:"#e5e5e5"}},position: 'right',splitLine:{show:false},gridIndex: 0,
          axisTick:{show:false},axisLabel:{color:"#999",fontSize:12,showMaxLabel:true,width: 80,align: 'center',margin: 40},inverse:true},
          {type: 'category',axisLine:{lineStyle: {color:"#e5e5e5"}}, splitLine:{show:false},gridIndex: 1,
          axisTick:{show:false},axisLabel:{show:false},inverse:true}
        ],
        series:[
          {name: '完成率', type: 'bar',showSymbol: false, xAxisIndex:0,yAxisIndex:0,barWidth: 10,showBackground: true,backgroundStyle: {color: 'rgba(180, 180, 180, 0.15)'},
          data:[]},
          {name: '已处理', type: 'bar',showSymbol: false, xAxisIndex:1,yAxisIndex:1,barWidth: 8,
          data:[]},
          {name: '计划量', type: 'bar',showSymbol: false, xAxisIndex:1,yAxisIndex:1,barWidth: 8,
          data:[]}
        ]
      },
      chartBar5Index: 'first',
      optionsBar5:{
        animation:false,color: ['#26D2A1','#38AEF3','#F6BD16'],
        grid: {bottom:5,top:10,left:20,right:20,containLabel:true},
        tooltip:{trigger:'axis',formatter:(param)=>{return this.getTooltip(param,'技改任务统计',['%','次','次'],'')},confine: true},
        xAxis:[
          {type: 'category',axisLine:{lineStyle: {color:"#e5e5e5"}},axisTick:{show:false},
          axisLabel:{color:"#999",fontSize:12},splitLine:{show:false}}
        ],
        yAxis:[
          {type: 'value',min:0,max: 100,axisLine:{show:true,lineStyle: {color:"#e5e5e5"}}, splitLine:{show:false},
          axisTick:{show:false},axisLabel:{color:"#999",fontSize:12,formatter: '{value}%'}},
          {type: 'value',axisLine:{show:true,lineStyle: {color:"#e5e5e5"}},splitLine:{show:false},
          axisTick:{show:false},axisLabel:{color:"#999",fontSize:12}},
        ],
        series:[
          {name: '完成率', type: 'line',yAxisIndex:0,
          data:[]},
          {name: '已处理', type: 'bar',showSymbol: false,yAxisIndex:1, barWidth: 8,
          data:[]},
          {name: '计划量', type: 'bar',showSymbol: false,yAxisIndex:1, barWidth: 8,
          data:[]}
        ]
      },
    }
  },
  watch: {},
  created(){
  },
  methods: {
    submit: function(param){
      if(param){
        this.form = {...param}
        console.log(param)
        this.getRateData()
        this.getAllData()
      }
    },
    changeChartSort: function(type,index){
      if(this['chartBar'+type+'Index'] != index){
        this['chartBar'+type+'Index'] = index
        this.changeChartType(type,index)
      }
    },
    getRateData: function(){
      let data = {
        startDate: this.$moment(this.form.time).startOf('month').format('YYYY-MM-DD'),
        endDate: this.$moment(this.form.time).endOf('month').format('YYYY-MM-DD'),
        deviceTypeId: this.form.deviceTypeId
      }
      this.$http.fetch(`supvHome/queryAllProcessingRaito`,data).then(res=>{
        if(res.code==0&&!this._isDestroyed){
          this.rateData = res.data[0] || {}
          this.optionsGauge1.series[0].data[0].value = res.data[0].ratio
        }else{
          this.rateData = {}
        }
      })
    },
    getAllData: function(){
      let data = {
        startDate: this.$moment(this.form.time).startOf('month').format('YYYY-MM-DD'),
        endDate: this.$moment(this.form.time).endOf('month').format('YYYY-MM-DD'),
        deviceTypeId: this.form.deviceTypeId
      }
      this.$http.fetch(`supvHome/queryRatioBySuperviseType`,data).then(res=>{
        if(res.code==0&&!this._isDestroyed){
          this.allData = res.data[0] || {}
          this.errorInfo = {
            lastFaultStopNum: this.allData.supvStatisticsFaultVo.lastFaultStopNum, // 上月停机台次
            faultStopNum: this.allData.supvStatisticsFaultVo.faultStopNum, // 本月停机台次
            faultYoy: this.allData.supvStatisticsFaultVo.faultYoy, // 停机台次同比
            faultMom: this.allData.supvStatisticsFaultVo.faultMom, // 停机台次环比
            faultRatio: this.allData.supvStatisticsFaultVo.faultRatio, // 消缺率
            mom: this.allData.supvStatisticsFaultVo.faultRatio, // 消缺率环比
            yoy: this.allData.supvStatisticsFaultVo.faultRatio, // 消缺率同比
          }
          this.optionsLine1.series[0].data = this.allData.supvStatisticsFaultVo.curMonthList
          this.optionsLine1.series[1].data = this.allData.supvStatisticsFaultVo.lastMonthList
          this.tempInfo = {
            ratio: this.allData.otherList[4].statisticResultVo.ratio,
            totalSupervise: this.allData.otherList[4].statisticResultVo.totalSupervise,
            processedNum: this.allData.otherList[4].statisticResultVo.processedNum
          }
          this.changeChartType(1, this.chartBar1Index)

          this.dingjianInfo = {
            ratio: this.allData.otherList[0].statisticResultVo.ratio,
            mom: this.allData.otherList[0].statisticResultVo.mom,
            yoy: this.allData.otherList[0].statisticResultVo.yoy,
            processedNum: this.allData.otherList[0].statisticResultVo.processedNum,
            totalSupervise: this.allData.otherList[0].statisticResultVo.totalSupervise
          }
          this.changeChartType(2, this.chartBar2Index)

          this.xunjianInfo = {
            ratio: this.allData.otherList[1].statisticResultVo.ratio,
            mom: this.allData.otherList[1].statisticResultVo.mom,
            yoy: this.allData.otherList[1].statisticResultVo.yoy,
            processedNum: this.allData.otherList[1].statisticResultVo.processedNum,
            totalSupervise: this.allData.otherList[1].statisticResultVo.totalSupervise
          }
          this.changeChartType(4, this.chartBar4Index)

          this.weihuInfo = {
            ratio: this.allData.otherList[2].statisticResultVo.ratio,
            mom: this.allData.otherList[2].statisticResultVo.mom,
            yoy: this.allData.otherList[2].statisticResultVo.yoy,
            processedNum: this.allData.otherList[2].statisticResultVo.processedNum,
            totalSupervise: this.allData.otherList[2].statisticResultVo.totalSupervise
          }
          this.changeChartType(3, this.chartBar3Index)

          this.jigaiInfo = {
            ratio: this.allData.otherList[3].statisticResultVo.ratio,
            mom: this.allData.otherList[3].statisticResultVo.mom,
            yoy: this.allData.otherList[3].statisticResultVo.yoy,
            processedNum: this.allData.otherList[3].statisticResultVo.processedNum,
            totalSupervise: this.allData.otherList[3].statisticResultVo.totalSupervise
          }
          this.changeChartType(5, this.chartBar5Index)
        }else{
          this.allData = {}
          this.errorInfo = {}
          this.optionsLine1.series[0].data = []
          this.optionsLine1.series[1].data = []
          this.tempInfo = {}
        }
      })
    },
    changeChartType: function(type, index){
      if(type == 1){ // 故障
        let first = [], last = [], 
        arr = index=='first'?this.allData.supvStatisticsFaultVo.supvStatisticsFaultStopVo:this.allData.supvStatisticsFaultVo.supvStatisticsFaultLastVo
        arr.forEach(item=>{
          first.push([item.ratio,item.plantName.slice(0,item.plantName.length-3)])
          last.push([item.lastRatio,item.plantName.slice(0,item.plantName.length-3)])
        })
        this.optionsBar1.series[0].data = last
        this.optionsBar1.series[1].data = first
      }else if(type == 2){ // 定检
        let first = [], seccond = [], third = [], 
        arr = index=='first'?this.allData.otherList[0].supvPlantFrontVo:this.allData.otherList[0].supvPlantBackVo
        arr.forEach(item=>{
          first.push([item.ratio,item.plantName.slice(0,item.plantName.length-3)])
          seccond.push([item.processNum,item.plantName.slice(0,item.plantName.length-3)])
          third.push([item.totalNum,item.plantName.slice(0,item.plantName.length-3)])
        })
        this.optionsBar2.series[0].data = first
        this.optionsBar2.series[1].data = seccond
        this.optionsBar2.series[2].data = third
        console.log(this.optionsBar2)
      }else if(type == 3){ // 维护
        let first = [], seccond = [], third = [], 
        arr = index=='first'?this.allData.otherList[2].supvPlantFrontVo:this.allData.otherList[2].supvPlantBackVo
        arr.forEach(item=>{
          first.push([item.plantName.slice(0,item.plantName.length-3),item.ratio])
          seccond.push([item.plantName.slice(0,item.plantName.length-3),item.processNum])
          third.push([item.plantName.slice(0,item.plantName.length-3),item.totalNum])
        })
        this.optionsBar3.series[0].data = first
        this.optionsBar3.series[1].data = seccond
        this.optionsBar3.series[2].data = third
      }else if(type == 4){ // 巡检
        
        let first = [], seccond = [], third = [], 
        arr = index=='first'?this.allData.otherList[1].supvPlantFrontVo:this.allData.otherList[1].supvPlantBackVo
        arr.forEach(item=>{
          first.push([item.ratio,item.plantName.slice(0,item.plantName.length-3)])
          seccond.push([item.processNum,item.plantName.slice(0,item.plantName.length-3)])
          third.push([item.totalNum,item.plantName.slice(0,item.plantName.length-3)])
        })
        this.optionsBar4.series[0].data = first
        this.optionsBar4.series[1].data = seccond
        this.optionsBar4.series[2].data = third
      }else if(type == 5){ // 技改
        let first = [], seccond = [], third = [], 
        arr = index=='first'?this.allData.otherList[3].supvPlantFrontVo:this.allData.otherList[3].supvPlantBackVo
        arr.forEach(item=>{
          first.push([item.plantName.slice(0,item.plantName.length-3),item.ratio])
          seccond.push([item.plantName.slice(0,item.plantName.length-3),item.processNum])
          third.push([item.plantName.slice(0,item.plantName.length-3),item.totalNum])
        })
        this.optionsBar5.series[0].data = first
        this.optionsBar5.series[1].data = seccond
        this.optionsBar5.series[2].data = third
      }
    },
    getTooltip: function(param,name,dataUnit,labelUnit){
      let html = `${name} (${param[0].axisValueLabel}${labelUnit})<br>`
      param.forEach(item=>{
        html += `<div style="display:flex;"><span>${item.marker}${item.seriesName}：</span><b style="flex:1;display: inline-block;text-align:right;margin-left: 15px">${this.$toFixed(item.data[1])} ${dataUnit[item.seriesIndex]}</b></div>`
      })
      return html
    },
    getTooltip1: function(param,name,dataUnit,labelUnit){
      let html = `${name} (${param[0].axisValueLabel}${labelUnit})<br>`
      param.forEach(item=>{
        html += `<div style="display:flex;"><span>${item.marker}${item.seriesName}：</span><b style="flex:1;display: inline-block;text-align:right;margin-left: 15px">${this.$toFixed(item.data[0])} ${dataUnit[item.seriesIndex]}</b></div>`
      })
      return html
    }
  }
}
</script>

<style scoped lang="less">
.content{
  width: 100%;height: 100%;min-width: 1660px;min-height: 790px;
  .wrap1{
    width: 550px;height: 100%;
    .box2{
      width: 100%;height: 130px;
    }
  }
  .wrap2{
    width: 100%;height: 130px;
  }
  .wrap3{
    width: 100%;height: calc(50% + 20px);
    .itemBox1 .item .numb{margin-right: 20px;}
  }
  .wrap4{
    width: 100%;height: calc(50% - 30px);
  }
  .boxTop{
    width: 100%;height: 45px;font-size: 14px;padding: 0 15px;border-bottom: 1px solid #E4E7ED;
    >i.icon{margin-right: 6px;font-size: 18px;color: #666;}
    .line{
      color: #999;padding-left: 34px;position: relative; margin-left: 20px; font-size: 12px;
      &::before{
        content: '';display: block;width: 8px;height: 8px;border-radius: 100%;overflow: hidden;position: absolute;top: 50%;left: 10px;margin-top: -3px;
      }
      &::after{
        content: '';display: block;width: 28px;height: 2px;overflow: hidden;position: absolute;top: 50%;left: 0px;margin-top: 0px;
      }
    }
    .square{
      color: #999;padding-left: 18px;position: relative; margin-left: 20px; font-size: 12px;
      &::before{
        content: '';display: block;width: 10px;height: 10px;overflow: hidden;position: absolute;top: 50%;left: 0;margin-top: -4px;
      }
    }
    .color7::before, .color7::after{background-color: var(--color7);}
    .color5::before, .color5::after{background-color: var(--color5);}
    .color2::before, .color2::after{background-color: var(--color2);}
  }
  .itemBox1{
    width: 100%;height: 100px;font-size: 14px;color: #999; padding: 15px 20px 10px;
    .item{
      height: 100%;
      .itemTit{margin-bottom: 5px;}
      .numb{font-size: 28px;color: #333;margin-right: 40px;}
      >.flex-vCenter .flex-column{padding-bottom: 15px;}
      p{height: 22px;line-height: 22px;font-size: 12px;}
      .percent{
        text-align: right;
        i, em{display: inline-block;vertical-align: middle;}
        i{margin-right: 3px;margin-top: -4px;}
      }
    }
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
    .btn{
      width: 58px;height: 24px;line-height: 22px;font-size: 12px;color: #999;text-align: center;border: 1px solid #E4E7ED;cursor: pointer;
      &.first{
        border-top-left-radius: 3px;border-bottom-left-radius: 3px;border-right: none;position: relative;
        &::after{content: '';display: block;width: 1px;height: 24px;overflow: hidden;position: absolute;top: -1px;right: 0;background-color: var(--color2);}
      }
      &.last{border-top-right-radius: 3px;border-bottom-right-radius: 3px;border-left: none;}
      &.active{border-color: var(--color2);color: var(--color2);}
    }
  }
  .itemBox2 .item{
    .numb{font-size: 28px;}
    .txt{color: #999;}
  }
  .itemBox3 .item{
    padding-left: 35px;
    .numb{font-size: 30px;}
    .txt{color: #999;margin-bottom: 15px;}
  }
  .itemBox4{
    width: calc(100% - 32px);height: 60px;padding: 0 16px;margin: 10px 16px 3px;background: #fafafa;color: #999;font-size: 12px;
    i, em{display: inline-block;vertical-align: middle;}
    i{margin-right: 3px;margin-top: -4px;}
  }
}
</style>