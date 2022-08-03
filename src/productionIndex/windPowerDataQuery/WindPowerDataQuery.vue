<template>
  <div class="windPowerDataQuery">
    <YfSearch tActive="daterange" @confirm="submit" layout="plant,queryNormal,timeShortcuts,dateTypeRange,submit"></YfSearch>
    <TabularData title="风场生产运营指标">
      <el-table
        :data="tableData"
        fit
        :cell-style="{ textAlign: 'center'}"
        :header-cell-style="{textAlign: 'center'}"
        style="width: 100%;">
        <el-table-column>
          <el-table-column
            prop="name"
            label="序号">
          </el-table-column>
          <el-table-column
            prop="province"
            label="风机名称">
          </el-table-column>
          <el-table-column
            prop="city"
            label="平均风速">
          </el-table-column>
        </el-table-column>
        <el-table-column label="发电量指标">
          <el-table-column
            prop="name"
            label="发电量">
          </el-table-column>
          <el-table-column
            prop="province"
            label="上网电量">
          </el-table-column>
          <el-table-column
            prop="city"
            label="下网电量">
          </el-table-column>
        </el-table-column>
        <el-table-column label="故障停机">
          <el-table-column
            prop="name"
            label="生产常用电量">
          </el-table-column>
          <el-table-column
            prop="province"
            label="损失电量">
          </el-table-column>
          <el-table-column
            prop="city"
            label="故障台次">
          </el-table-column>
          <el-table-column
            prop="city"
            label="故障时间">
          </el-table-column>
        </el-table-column>
        <el-table-column label="计划停机">
          <el-table-column
            prop="name"
            label="损失电量">
          </el-table-column>
          <el-table-column
            prop="province"
            label="故障台次">
          </el-table-column>
          <el-table-column
            prop="city"
            label="故障时间">
          </el-table-column>
        </el-table-column>
        <el-table-column label="受累停机">
          <el-table-column
            prop="name"
            label="损失电量">
          </el-table-column>
          <el-table-column
            prop="province"
            label="故障台次">
          </el-table-column>
          <el-table-column
            prop="city"
            label="故障时间">
          </el-table-column>
        </el-table-column>
        <el-table-column label="不可抗力停机">
          <el-table-column
            prop="name"
            label="损失电量">
          </el-table-column>
          <el-table-column
            prop="province"
            label="故障台次">
          </el-table-column>
          <el-table-column
            prop="city"
            label="故障时间">
          </el-table-column>
        </el-table-column>
        <el-table-column label="运行指标">
          <el-table-column
            prop="name"
            label="风机无故障运行时长">
          </el-table-column>
          <el-table-column
            prop="province"
            label="风场无故障运行时长">
          </el-table-column>
          <el-table-column
            prop="city"
            label="风机定检后无故障运行时长">
          </el-table-column>
          <el-table-column
            prop="city"
            label="风电场定检后无故障运行时长">
          </el-table-column>
        </el-table-column>
      </el-table>
    </TabularData>
  </div>
</template>

<script>
import TabularData from '../../views/operatingIndex/tabularData/TabularData.vue'
export default {
  data () {
    return {
      tableData: [{
        date: '2016-05-03',
        name: '王小虎',
        province: '上海',
        city: '普陀区',
        address: '上海市普陀区金沙江路 1518 弄',
        zip: 200333
      }, {
        date: '2016-05-02',
        name: '王小虎',
        province: '上海',
        city: '普陀区',
        address: '上海市普陀区金沙江路 1518 弄',
        zip: 200333
      }, {
        date: '2016-05-04',
        name: '王小虎',
        province: '上海',
        city: '普陀区',
        address: '上海市普陀区金沙江路 1518 弄',
        zip: 200333
      }, {
        date: '2016-05-01',
        name: '王小虎',
        province: '上海',
        city: '普陀区',
        address: '上海市普陀区金沙江路 1518 弄',
        zip: 200333
      }, {
        date: '2016-05-08',
        name: '王小虎',
        province: '上海',
        city: '普陀区',
        address: '上海市普陀区金沙江路 1518 弄',
        zip: 200333
      }, {
        date: '2016-05-06',
        name: '王小虎',
        province: '上海',
        city: '普陀区',
        address: '上海市普陀区金沙江路 1518 弄',
        zip: 200333
      }, {
        date: '2016-05-07',
        name: '王小虎',
        province: '上海',
        city: '普陀区',
        address: '上海市普陀区金沙江路 1518 弄',
        zip: 200333
      }]
    }
  },
  methods: {
    submit () {
      
    }
  },
  components: {
    TabularData
  }
}
</script>

<style lang="less" scoped>
.windPowerDataQuery {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
}
</style>