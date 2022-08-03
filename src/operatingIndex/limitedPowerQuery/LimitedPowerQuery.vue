<template>
  <div class="limitedPowerQuery">
    <YfSearch tActive="week" :time="time2" @confirm="submit" layout="plant,timeShortcuts,timeRange,submit"></YfSearch>
    <TabularData>
      <el-table
        :data="tableData"
        border
        style="width: 100%">
        <!-- <el-table-column
          type="selection"
          width="40">
        </el-table-column> -->
        <el-table-column
          prop="serialNumber"
          label="序号"
          width="120">
        </el-table-column>
        <el-table-column
          prop="type"
          label="风机"
          width="120">
        </el-table-column>
        <el-table-column
          prop="belongSite"
          label="所属场站"
          width="120">
        </el-table-column>
        <el-table-column
          prop="frequency"
          sortable
          label="台次">
          <template slot-scope="scope">
            <div class="progress">
              <span>{{scope.row.frequency}}</span>
              <span>
                <el-progress :percentage="(scope.row.frequency/16)*100" color="#F2BA38" :show-text="false" :stroke-width="10"></el-progress>
              </span>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          prop="time"
          sortable
          label="时长 (h)">
          <template slot-scope="scope">
            <div class="progress">
              <span>{{scope.row.time}}</span>
              <span>
                <el-progress :percentage="(scope.row.time/16)*100" color="#F2BA38" :show-text="false" :stroke-width="10"></el-progress>
              </span>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          prop="damage"
          sortable
          label="损失电量 (kwh)">
          <template slot-scope="scope">
            <div class="progress">
              <span>{{scope.row.damage}}</span>
              <span>
                <el-progress :percentage="(scope.row.damage/200)*100" color="#F2BA38" :show-text="false" :stroke-width="10"></el-progress>
              </span>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          label="更多"
          width="120">
          <template slot-scope="scope">
            <el-button @click="handleClick(scope.row)" type="text" size="small">{{scope.row.more}}</el-button>
          </template>
        </el-table-column>
      </el-table>
    </TabularData>
    <el-dialog
      title="【大爬山A01—2022-01-16至2022-02-16】调度限电记录"
      :visible.sync="dialogVisible"
      width="781px">
      <el-table
        :data="tableData2"
        border
        show-summary
        :summary-method="getSummaries">
        <el-table-column
          prop="id"
          label="序号"
          width="60">
        </el-table-column>
        <el-table-column
          prop="name"
          label="限电开始时间"
          width="150">
        </el-table-column>
        <el-table-column
          prop="name"
          label="限电结束时间"
          width="150">
        </el-table-column>
        <el-table-column
          prop="amount1"
          label="限电时长 (h)"
          width="120">
        </el-table-column>
        <el-table-column
          prop="amount2"
          label="限电损失电量 (万kwh)"
          width="180">
        </el-table-column>
        <el-table-column
          prop="amount3"
          label="限制出力 (MW)"
          width="120">
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
import TabularData from '@/views/operatingIndex/tabularData/TabularData.vue'
export default {
  data () {
    return {
      time2: this.$moment().format('YYYY-MM-DD'),
      dialogVisible: false,
      tableData: [{
        serialNumber:'01',
        type:'A41',
        belongSite:'大爬山',
        frequency:16,
        time:15.28,
        damage:187.23,
        more:'详细记录',
        status:'未处理',
        operation:'发起检查督办',
      }, {
        serialNumber:'02',
        type:'A02',
        belongSite:'大爬山',
        frequency:11,
        time:4.56,
        damage:199.93,
        more:'详细记录',
        status:'已处理',
        operation:'查看详情',
      }, {
        serialNumber:'03',
        type:'A41',
        belongSite:'大爬山',
        frequency:5,
        time:8.73,
        damage:25.83,
        more:'详细记录',
        status:'已处理',
        operation:'查看详情',
      }, {
        serialNumber:'04',
        type:'A02',
        belongSite:'大爬山',
        frequency:8,
        time:11.35,
        damage:47.28,
        more:'详细记录',
        status:'未处理',
        operation:'查看详情',
      }],
        tableData2: [{
          id: '01',
          name: '王小虎',
          amount1: '234',
          amount2: '3.2',
          amount3: 10
        }, {
          id: '02',
          name: '王小虎',
          amount1: '165',
          amount2: '4.43',
          amount3: 12
        }, {
          id: '03',
          name: '王小虎',
          amount1: '324',
          amount2: '1.9',
          amount3: 9
        }, {
          id: '04',
          name: '王小虎',
          amount1: '621',
          amount2: '2.2',
          amount3: 17
        }, {
          id: '05',
          name: '王小虎',
          amount1: '539',
          amount2: '4.1',
          amount3: 15
        }]
    }
  },
  methods: {
    submit () {},
    handleClick (row) {
      console.log(row)
      this.dialogVisible = true
    },
    close () {
      console.log('close');
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
          // sums[index] += ' 元';
        } else {
          sums[index] = '--';
        }
      });
      return sums;
    }
  },
  components: {
    TabularData
  }
}
</script>

<style lang="less" scoped>
.limitedPowerQuery {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  /deep/ .el-table .cell {
    text-align: center;
  }
  /deep/ .el-dialog__body {
    padding: 0 ;
  }
}
</style>