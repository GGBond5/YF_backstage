<template>
  <div class="container flex-column">
    <el-tabs v-model="activeName" class="orderTabs" @tab-click="handleClick">
      <el-tab-pane name="#step_1">
        <span slot="label">
          <el-badge :value="tableData.length">
            待处理
          </el-badge>
        </span>
      </el-tab-pane>
      <el-tab-pane label="全部" name="#step_2">
      </el-tab-pane>
    </el-tabs>
    <div class="content" v-if="activeName === '#step_1'">
      <div class="flex-center tabRightWrap"  v-if="!adminRole">
        <a class="flex-center blue" @click="newPurchasePlan()">
          <i class="el-icon-circle-plus-outline" style="font-size: 16px;"></i>
          <span>新建采购计划</span>
        </a>
      </div>
      <el-table
        :data="tableData"
        border
        style="width: 100%;">
        <el-table-column
          prop="serialNumber"
          label="序号"
          width="60">
        </el-table-column>
        <el-table-column
          prop="plantName"
          label="场次">
        </el-table-column>
        <el-table-column
          prop="tenderName"
          label="标的名称"
          width="300">
        </el-table-column>
        <el-table-column
          prop="projectTypeName"
          label="项目类型"
          width="80">
        </el-table-column>
        <el-table-column
          prop="budgetCodeName"
          label="预算科目">
        </el-table-column>
        <el-table-column
          prop="budget"
          label="预算金额（元）">
          <template slot-scope="scope">
            <span v-format="'#,##0.####'">{{scope.row.budget}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="planPurchasingTime"
          label="计划采购时间">
          <template slot-scope="scope">
            <div>{{scope.row.planPurchasingTime?$moment(scope.row.planPurchasingTime).format('yyyy年MM月DD日'):''}}</div>
          </template>
        </el-table-column>
        <el-table-column
          prop="auditStatusName"
          label="审核状态"
          width="140">
          <template slot-scope="scope">
            <span :class="'color'+getStatusId(scope.row.auditStatusName)">{{scope.row.auditStatusName}}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          width="140">
          <template slot-scope="scope">
            <el-button @click="toProjectDetails(scope.row, adminRole)" type="text" size="small">{{scope.row.operate[0]}}</el-button>
            <el-popconfirm
              title="确定删除吗？"
              @confirm="projectDel(scope.row)"
            >
              <el-button slot="reference" type="text" size="small" class="handrail" v-if="scope.row.operate[1]">{{scope.row.operate[1]}}</el-button>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <YfSearch @confirm="submit" layout="plant,projectType,budgetCategory,projectStatus,timeRange,keywords,submit" v-if="activeName === '#step_2'"></YfSearch>
    <div class="content2" v-if="activeName === '#step_2'">
      <el-table
        :data="allData"
        border
        style="width: 100%;">
        <el-table-column
          prop="serialNumber"
          label="序号"
          width="60">
        </el-table-column>
        <el-table-column
          prop="plantName"
          label="场次">
        </el-table-column>
        <el-table-column
          prop="tenderName"
          label="标的名称"
          width="300">
        </el-table-column>
        <el-table-column
          prop="projectTypeName"
          label="项目类型"
          width="80">
        </el-table-column>
        <el-table-column
          prop="budgetCodeName"
          label="预算科目"> 
        </el-table-column>
        <el-table-column
          prop="budget"
          label="预算金额（元）">
          <template slot-scope="scope">
            <span v-format="'#,##0.####'">{{scope.row.budget}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="planPurchasingTime"
          label="计划采购时间">
          <template slot-scope="scope">
            <div>{{scope.row.planPurchasingTime?$moment(scope.row.planPurchasingTime).format('yyyy年MM月DD日'):''}}</div>
          </template>
        </el-table-column>
        <el-table-column
          prop="auditStatusName"
          label="审核状态"
          width="140">
          <template slot-scope="scope">
            <span :class="'color'+getStatusId(scope.row.auditStatusName)">{{scope.row.auditStatusName}}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          width="140">
          <template slot-scope="scope">
            <el-button @click="toProjectDetails(scope.row, adminRole)" type="text" size="small">{{scope.row.operate[0]}}</el-button>
            <el-popconfirm
              title="确定删除吗？"
              @confirm="projectDel(scope.row)"
            >
              <el-button slot="reference" type="text" size="small" class="handrail" v-if="scope.row.operate[1]">{{scope.row.operate[1]}}</el-button>
            </el-popconfirm>
          </template>
          <!-- <template slot-scope="scope">
            <el-button @click="toProjectDetails(scope.row, adminRole)" type="text" size="small">{{scope.row.operate[0]}}</el-button>
            <el-button @click="toProjectDetails(scope.row, adminRole)" type="text" size="small" class="handrail" v-if="scope.row.operate[1]">{{scope.row.operate[1]}}</el-button>
          </template> -->
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import {mapGetters, mapActions} from 'vuex'
export default {
  data () {
    return {
      activeName: '',
      detailsInfo: {
        isEstablishOff: false,
        readonly:true
      },
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
    adminRole: {
      type: Boolean,
      default () {
        return false
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
    ...mapGetters(['storage'])
  },
  created() {
    this.activeName = window.location.hash || '#step_1' 
    if(!location.hash){
      window.location.hash = this.activeName
    }
    window.addEventListener('hashchange', this.hashchange)
    this.init()
  }, 
  methods: {
    init () {
      this.$http.fetchGet(`/plant/deptPlantList`).then(res => { //所属场站
        this.detailsInfo.deptPlantList = res.data
      })
      this.$http.fetchGet(`/project/getProjectType`).then(res => { //项目类型
        this.detailsInfo.ProjectType = res.data
      })
      this.$http.fetchGet(`/budget/getBudgetCodeList`).then(res => { //预算科目
        this.detailsInfo.budgetCodeList = res.data
      })
      this.$http.fetchGet(`/project/getPurchasingMethod`).then(res => { //采购方式
        this.detailsInfo.purchasingMethod = res.data
      })
      this.$http.fetchGet(`/project/getFileTypeList`).then(res => { 
        this.detailsInfo.approvalBtns = res.data[8].children 
      })
    },
    handleClick (tab) {
      window.location.hash = tab.name
    },
    hashchange () {
      this.activeName = window.location.hash
    },
    async toProjectDetails (row, role) {
      if (row.operate[0] === '统一采购') {
        this.detailsInfo.isEstablishOff = true
      }
      await this.$http.fetchGet(`/project/getYearProjectInfo?id=${row.id}`).then(res => { 
        if (res.code === 0) {
          this.detailsInfo.plan =  res.data
        }
      })
      this.detailsInfo.hash = window.location.hash
      if (role) {
        if (row.operate[0] === '立即审核') this.detailsInfo.readonly = false
        this.$router.push('/expendManagement/adminPurchase/adminPurchaseCheck')
      }else {
        if (row.operate[0] === '编辑') this.detailsInfo.readonly = false
        this.$router.push('/expendManagement/purchase/purchaseNewPlan')
      }
      this.saveStorage({key: 'yearPlan_details', val: this.detailsInfo})
    },
    newPurchasePlan () {
      this.saveStorage({key: 'yearPlan_details', val: this.detailsInfo})
      this.$router.push('/expendManagement/purchase/purchaseNewPlan')
    },
    submit (data) {
      this.$emit('searchSubmit', data)
    },
    projectDel (row) {
      this.$http.fetch(`/project/yearProjectDelete?id=${row.id}&status=${row.status}`).then((res) => {
        if (res.code === 0) {
          this.$emit('reInit')
          this.$message({
            message: '恭喜你，删除成功',
            type: 'success'
          });
        }else {
          
        }
      })
    },
    ...mapActions(['saveStorage'])
  },
  components: {
  }
}
</script>

<style lang="less" scoped>
.container {
  height: 100%;
  background-color: #fff;
  .content, .content2 {
    flex: 1;
    position: relative;
    .handrail {
      padding: 0;
      padding-left: 10px;
      margin-left: 10px;
      border-left: 1px solid #409EFF;
    }
  }
  .content2 {
    max-height: calc(100% - 39px - 66px);
  }
  /deep/ .el-table {
    height: 100%;
    display: flex;
    flex-direction: column;
  }
  /deep/ .el-table__body-wrapper {
    flex: 1;
  }
}
</style>