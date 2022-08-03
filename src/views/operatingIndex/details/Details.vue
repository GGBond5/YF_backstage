<template>
  <div class="details">
    <ScreeningCondition :showBtn="false" class="around">
      <div slot="left" class="leftGoBack">
        <span @click="goBack()"><i class="el-icon-arrow-left"></i></span>
        <span @click="goBack()">返回上级</span>
        <h4>
        【大爬山A01——2022年1月】风机超温详情记录
        </h4>
      </div>
      <div slot="right" class="rightInitiator">
        <span>
          <el-button type="primary" round size="small">发起检查督办</el-button>
        </span>
        <span @click="goBack()" class="el-icon-close"></span>
      </div>
    </ScreeningCondition>
    <div class="detailsContent">
      <div class="contentTitle">
        <p>超温监视条件分析</p>
        <p>
          <el-row>
            <el-button plain size="small">全部</el-button>
            <el-button type="info" plain size="small" v-for="(v, i) in classification" :key="i">{{v.name}}</el-button>
          </el-row>
        </p>
      </div>
      <div style="height:1px;backgroundColor:rgba(228, 228, 228, 0.5);"></div>
      <div class="conditinAnalysis">
        <div class="selectionCondition">
          <div class="conditin" :class="{conditinSelected: currentConditinSelected == index}" @click="changeSelected(index)" v-for="(item, index) in 3" :key="index">
            <div>
              <p>台次</p>
              <p>
                <span>16</span>
                <span>台次</span>
              </p>
            </div>
            <div>
              <p>
                <span>同比：</span>
                <span class="triangleUp"></span>
                <span style="color:red">1.03%, 2台次</span>
              </p>
              <p>
                <span>环比：</span>
                <span class="triangleDown"></span>
                <span style="color:green">2.48%, 3台次</span>
              </p>
            </div>
          </div>
        </div>
        <div class="trendEcharts">
          <h3>变化趋势</h3>
          <YfEcharts :options="options"></YfEcharts>
        </div>
      </div>
      <div style="height:1px;backgroundColor:rgba(228, 228, 228, 0.5);"></div>
      <div class="recordList">
        <div>
          <p>超温记录列表</p>
          <p>
            <span>等级：</span>
            <span>
              <el-select v-model="value" placeholder="请选择" size="small">
                <el-option
                  v-for="item in option"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </span>
          </p>
        </div>
        <el-table
          :data="tableData"
          border
          :header-cell-style="{textAlign: 'center'}"
          :cell-style="{ textAlign: 'center' }"
          style="width: 100%">
          <el-table-column
            prop="date"
            label="序号"
            width="60">
          </el-table-column>
          <el-table-column
            prop="name"
            label="开始时间"
            width="180">
          </el-table-column>
          <el-table-column
            prop="name"
            label="结束时间"
            width="180">
          </el-table-column>
          <el-table-column
            prop="address"
            label="超温部件">
          </el-table-column>
          <el-table-column
            prop="date"
            label="所属系统"
            width="180">
          </el-table-column>
          <el-table-column
            prop="level"
            label="等级"
            width="100">
          </el-table-column>
          <el-table-column
            prop="address"
            label="持续时长（h）">
          </el-table-column>
          <el-table-column
            prop="address"
            label="损失电量（万kwh）">
          </el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>

<script>
import ScreeningCondition from '@/views/operatingIndex/screeningCondition/ScreeningCondition.vue'

export default {
  data () {
    return {
      currentConditinSelected: 0,
      option: [{
        value: '选项1',
        label: '黄金糕'
      }, {
        value: '选项2',
        label: '双皮奶'
      }, {
        value: '选项3',
        label: '蚵仔煎'
      }, {
        value: '选项4',
        label: '龙须面'
      }, {
        value: '选项5',
        label: '北京烤鸭'
      }],
      value: '',
      tableData: [{
        date: '01',
        name: 'xxxx-xx-xx xx:xx:xx',
        address: '上海市普陀区金沙江路 1518 弄',
        level:'L1'
      }, {
        date: '02',
        name: 'xxxx-xx-xx xx:xx:xx',
        address: '上海市普陀区金沙江路 1517 弄',
        level:'L1'
      }, {
        date: '03',
        name: 'xxxx-xx-xx xx:xx:xx',
        address: '上海市普陀区金沙江路 1519 弄',
        level:'L1'
      }, {
        date: '04',
        name: 'xxxx-xx-xx xx:xx:xx',
        address: '上海市普陀区金沙江路 1516 弄',
        level:'L1'
      }],
      classification: [
        {name:'齿轮箱轴承'},
        {name:'齿轮箱油温'},
        {name:'发电机轴承'},
        {name:'发电机油温'},
        {name:'变流器'},
      ],
      options:{
        xAxis: {
          type: 'category',
          data: ['2022-01-01', ' ', ' ', '2022-01-15', ' ', ' ', '2022-01-31']
        },
        yAxis: {
          type: 'value'
        },
        grid: {
          x:30,
          y:30,
          x2:30,
          y2:30
        },
        tooltip: {
          trigger: 'axis',   // axis   item   none三个值
          formatter: function (params) {
            if (params[0].axisValue.length > 1) {
                return params[0].axisValue+'&ensp;&ensp;&ensp;'+params[0].data+'台次'
              }
            return params[0].data+'台次'
          },
          axisPointer:{
          type : 'line',
          lineStyle: {
            type : 'solid',
            width : 2
            }
          }
        },
        series: [
          {
            data: [2, 10, 4, 0, 8, 5, 8],
            type: 'line',
            symbol: 'circle',     //实心折点
            symbolSize: 10,       //折点大小
            itemStyle: {
              normal: {
                color: '#409EFF', //改变折线点的颜色
              }
            },
          }
        ]
      }
    }
  },
  methods: {
    goBack () {
      this.$emit('back')
    },
    changeSelected (index) {
      this.currentConditinSelected = index
    }
  },
  components: {
    ScreeningCondition
  }
}
</script>

<style lang="less" scoped>
.details {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  .around {
    justify-content: space-between;
    .leftGoBack {
      display: flex;
      align-items: center;
      span:nth-of-type(1) {
        color: #199ED8;
        font-size: 26px;
      }
      span:nth-of-type(2) {
        color: #199ED8;
        border-right: 1px solid black;
        height: 30px;
        line-height: 30px;
        padding-right: 20px;
        margin-right: 20px;
      }
      &:hover {
        cursor: pointer;
      }
    }
    .rightInitiator {
      display: flex;
      align-items: center;
      span:nth-of-type(2) {
        margin-left: 20px;
        font-size: 30px;
        cursor: pointer;
      }
    }
  }
  .detailsContent {
    flex: 1;
    background-color: #fff;
    border-radius: 6px;
    .contentTitle {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 10px;
      /deep/ .is-plain:focus, .el-button--info.is-plain:hover {
        color: #409eff;
        background-color: rgba(64, 158, 255, 0.2);
        border: 1px solid rgba(64, 158, 255, 0.2);
      }
    }
    .conditinAnalysis  {
      display: flex;
      height: 330px;
      .selectionCondition {
        width: 500px;
        padding: 20px;
        padding-bottom: 0;
        .conditin {
          display: flex;
          justify-content: space-between;
          position: relative;
          padding: 15px 30px;
          border: 1px solid rgba(128, 128, 128, 0.2);
          margin-bottom: 20px;
          &:hover {
            cursor: pointer;
            box-shadow: 3px 3px 5px rgba(128, 128, 128, 0.2);
          }
          div:nth-of-type(1) {
            color: #199ED8;
            p:nth-of-type(1) {
              font-size: 16px;
            }
            p:nth-of-type(2) {
              span:nth-of-type(1) {
                margin-right: 12px;
                font-weight: bold;
                font-size: 18px;
                line-height: 30px;
              }
            }
          }
          div:nth-of-type(2) {
            p {
              display: flex;
              align-items: center;
              font-size: 12px;
              span:nth-of-type(1) {
                margin-right: 30px;
                color: rgba(128, 128, 128, 0.5);
              }
              span:nth-of-type(2) {
                margin-right: 15px;
              }
            }
            p:nth-of-type(1) {
              margin-top: 16px;
            }
          }
        }
      }
      .trendEcharts {
        flex: 1;
        display: flex;
        flex-direction: column;
        h3 {
          line-height: 30px;
        }
      }
    }
    .recordList {
      height: 400px;
      div:nth-of-type(1) {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 5px;
        p {
          display: flex;
          align-items: center;
        }
      }
    }
  }
}
.triangleUp {
  width: 0;
  height: 0;
  border-left: 7px solid transparent;
  border-right: 7px solid transparent;
  border-bottom: 7px solid red;
}
.triangleDown {
  width: 0;
  height: 0;
  border-top: 7px solid green;
  border-left: 7px solid transparent;
  border-right: 7px solid transparent;
}
.conditinSelected {
  border-left: 0;
  box-shadow: 3px 3px 5px rgba(128, 128, 128, 0.2);
  &::before {
    content: '';
    position: absolute;
    left: 0px;
    top: 0;
    width: 6px;
    height: 100%;
    background-color: #199ED8;
  }
}
</style>