<template>
  <div class="malfunctionStatistics">
    <el-tabs v-model="activeName">
      <el-tab-pane label="统计分析" name="first">
        <div class="specific" >
          <YfSearch tActive="week" :time="time2" @confirm="submit" layout="date,plant,processStatus,submit"></YfSearch>
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
              <el-table-column
                prop="status"
                label="处理状态"
                width="120">
              </el-table-column>
              <el-table-column
                label="操作"
                width="120">
                <template slot-scope="scope">
                  <el-button @click="handleClick(scope.row)" type="text" size="small">{{scope.row.operation}}</el-button>
                </template>
              </el-table-column>
            </el-table>
          </TabularData>
        </div>
      </el-tab-pane>
      <el-tab-pane label="数据查询" name="second">
        <div class="specific" >
          <YfSearch tActive="week" :time="time2" @confirm="submit" layout="plant,timeShortcuts,timeRange,submit"></YfSearch>
          <TabularData>
            <el-table
              :data="tableData"
              border
              style="width: 100%;">
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
                  <el-button @click="toDetails(scope.row)" type="text" size="small">{{scope.row.more}}</el-button>
                </template>
              </el-table-column>
            </el-table>
          </TabularData>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import TabularData from '@/views/operatingIndex/tabularData/TabularData.vue'
export default {
  data () {
    return {
      time2: this.$moment().format('YYYY-MM-DD'),
      activeName: 'first',
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
      }]
    }
  },
  methods: {
    submit () {},
    handleClick (row) {
      console.log(row)
    }
  },
  components: {
    TabularData
  }
}
</script>

<style lang="less" scoped>
.malfunctionStatistics {
  width: 100%;
  height: 100%;
  .specific {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
  }
  /deep/ .el-tabs {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
  }
  /deep/ .el-tabs__content {  //为了解决tabs Content的白色背景填充
    flex: 1;
  }
  /deep/ .el-tab-pane {
    width: 100%;
    height: 100%;
  }
}
</style>