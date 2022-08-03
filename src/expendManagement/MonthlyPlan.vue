<template>
  <div class="monthlyPlan flex-column">
    <el-tabs v-model="activeName" class="orderTabs" @tab-click="handleClick">
      <el-tab-pane name="#step_1">
        <span slot="label">
          <el-badge :value="tableData?tableData.length:'0'" class="item"> 
            待处理
          </el-badge>
        </span>
      </el-tab-pane>
      <el-tab-pane label="全部" name="#step_2">
      </el-tab-pane>
    </el-tabs>
    <div class="content" v-if="activeName === '#step_1'">
      <div class="flex-center tabRightWrap" v-if="newPlan[0]">
        <a class="flex-center blue" @click="newPlanClick()">
          <i class="el-icon-circle-plus-outline" style="font-size: 16px;"></i>
          <span>{{newPlan[1]}}</span>
        </a>
      </div>
      <el-table
        :data="tableData"
        border
        height="100%"
        style="width: 100%">
        <el-table-column
          prop="serialNumber"
          label="序号"
          width="60">
        </el-table-column>
        <el-table-column
          prop="plantName"
          label="场站">
        </el-table-column>
        <el-table-column
          prop="dataDate"
          label="月份"
          width="180">
          <template slot-scope="scope">
            {{$moment(scope.row.dataDate).format('yyyy年MM月')}}
          </template>
        </el-table-column>
        <el-table-column
          prop="count"
          label="计划入账项目数"
          width="180">
        </el-table-column>
        <el-table-column
          prop="amount"
          label="计划入账金额（元）"
          width="180">
          <template slot-scope="scope">
            <span v-format="'#,##0.####'">{{scope.row.amount}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="statusName"
          label="审核状态"
          width="140">
          <template slot-scope="scope">
            <span :class="'color'+getStatusId(scope.row.statusName)">{{scope.row.statusName}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="operation"
          label="操作"
          width="140">
          <template slot-scope="scope">
            <el-button @click="functionality(scope.row)" type="text" size="small">{{scope.row.operation[0]}}</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <YfSearch @confirm="submit" layout="plant,projectStatus,submit" v-if="activeName === '#step_2'"></YfSearch>
    <div class="content2" v-if="activeName === '#step_2'">
      <el-table
        :data="allData"
        border
        height="100%"
        style="width: 100%">
        <el-table-column
          prop="serialNumber"
          label="序号"
          width="60">
        </el-table-column>
        <el-table-column
          prop="plantName"
          label="场站">
        </el-table-column>
        <el-table-column
          prop="dataDate"
          label="月份"
          width="180">
          <template slot-scope="scope">
            {{$moment(scope.row.dataDate).format('yyyy年MM月')}}
          </template>
        </el-table-column>
        <el-table-column
          prop="count"
          label="计划入账项目数"
          width="180">
        </el-table-column>
        <el-table-column
          prop="amount"
          label="计划入账金额（元）"
          width="180">
          <template slot-scope="scope">
            <span v-format="'#,##0.####'">{{scope.row.amount}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="statusName"
          label="审核状态"
          width="140">
          <template slot-scope="scope">
            <span :class="'color'+getStatusId(scope.row.statusName)">{{scope.row.statusName}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="operation"
          label="操作"
          width="140">
          <template slot-scope="scope">
            <el-button @click="functionality(scope.row)" type="text" size="small">{{scope.row.operation[0]}}</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      activeName: '',
    }
  },
  props: {
    tableData: {
      type: Array,
      default () {
        return []
      }
    },
    allData: {
      type: Array,
      default () {
        return []
      }
    },
    newPlan: {
      type: Array,
      default () {
        return []
      }
    }
  },
  computed: {
    getStatusId () {
      return function (row) {
        if (row === '审核通过') {
          return '5'
        }else if (row === '审核不通过') {
          return '1'
        }else if (row === '项目完结') {
          return '2'
        }else if (row === '待审核') {
          return '3'
        }else if (row === '审核中') {
          return '4'
        }
      }
    },
  },
  created() {
    console.log(this.allData);
    this.activeName = window.location.hash || '#step_1' 
    if(!location.hash){
      window.location.hash = this.activeName
    }
    window.addEventListener('hashchange', this.hashchange)
  }, 
  mounted() {
  },
  methods: {
    handleClick (tab) {
      window.location.hash = tab.name
    },
    hashchange () {
      this.activeName = window.location.hash
    },
    newPlanClick (e) {
      this.$emit('newPlanClick', e)
    },
    functionality (row) {
      this.$emit('functionality', row, window.location.hash)
    },
    submit (data) {
      this.$emit('searchSubmit', data)
    }
  }
};
</script>

<style lang="less" scoped>
.monthlyPlan {
  height: 100%;
  background-color: #fff;
  .content, .content2 {
    flex: 1;
    position: relative;
  }
  .content2 {
    max-height: calc(100% - 39px - 66px);
  }
  /deep/ .el-button--text {
    padding: 0;
  }
}
</style>