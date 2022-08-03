<template>
  <div>
    <YfSearch tActive="week" :time="time2" @confirm="submit" layout="date,plant,processStatus,submit"></YfSearch>
    <el-table
      :data="tableData"
      border
      id="tabStyle"
      height="100%"
      style="width: 100%;">
      <el-table-column
        prop="serialNumber"
        label="序号"
        width="60">
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
        label="超速次数">
        <template slot-scope="scope">
          <div class="progressBar">
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
        label="超速时长（h）">
        <template slot-scope="scope">
          <div class="progressBar">
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
        label="最大速度（m/s）">
        <template slot-scope="scope">
          <div class="progressBar">
            <span>{{scope.row.damage}}</span>
            <span>
              <el-progress :percentage="(scope.row.damage/200)*100" color="#F2BA38" :show-text="false" :stroke-width="10"></el-progress>
            </span>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        prop="damage"
        sortable
        label="损失电量 (kwh)">
        <template slot-scope="scope">
          <div class="progressBar">
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
          <el-button @click="toDetails(scope.row)" type="text" size="small">{{scope.row.more}}</el-button>
        </template>
      </el-table-column>
      <el-table-column
        prop="status"
        label="处理状态"
        width="120">
        <template slot-scope="scope">
          <span :class="[`color${scope.row.status === '已处理'?'5':'1'}`]">{{scope.row.status}}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        width="120">
        <template slot-scope="scope">
          <el-button @click="initiateSpecific(scope.row)" type="text" size="small">{{scope.row.operation}}</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  data () {
    return {
      time2: this.$moment().format('YYYY-MM-DD'),
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
    }
  },
  methods: {
    submit () {},
    toDetails (row) {

    },
    initiateSpecific (row) {

    }
  }
}
</script>

<style lang="less" scoped>

</style>