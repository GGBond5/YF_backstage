<template>
  <div class="managementAdmin">
    <div class="container">
      <el-tabs v-model="activeName" class="orderTabs"  @tab-click="handleClick">
        <el-tab-pane name="#step_1">
          <span slot="label">
            <el-badge :value="projectList?projectList.length:'0'">
              待处理
            </el-badge>
          </span>
        </el-tab-pane>
        <el-tab-pane label="全部" name="#step_2">
        </el-tab-pane>
      </el-tabs>
      <div class="content" v-if="activeName === '#step_1'">
        <el-table
          :data="projectList"
          border
          height="100%"
          style="width: 100%;">
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
            prop="tenderName"
            label="标的名称"
            width="300">
            <template slot-scope="scope">
              <el-popover
                placement="top-start"
                width="300"
                :value="scope.row.popover"
                :content="scope.row.tenderName"
                :visible-arrow="false">
                <span class="headline" slot="reference" @mouseenter="Menter(scope.row, $event)" @mouseleave="Mleave(scope.row)">{{scope.row.tenderName}}</span>
              </el-popover>
            </template>
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
            label="预算金额（元）"
            width="120">
            <template slot-scope="scope">
              <div v-format="'#,##0.####'">{{scope.row.budget}}</div>
            </template>
          </el-table-column>
          <el-table-column
            prop="planPurchasingTime"
            label="计划采购时间"
            width="130">
            <template slot-scope="scope">
              <div>{{scope.row.planPurchasingTime?$moment(scope.row.planPurchasingTime).format('yyyy年MM月DD日'):''}}</div>
            </template>
          </el-table-column>
          <el-table-column
            label="计划入账金额"
            width="200">
            <template slot-scope="scope">
              <div class="centerDistance">
                <span v-format="'#,##0.####'">{{scope.row.billAmountSum}}</span>
                <span class="statusStyle" :class="[`color${getStatusId(scope.row.billStatusName)}`,`bgColor${getStatusId(scope.row.billStatusName)}`,`brColor${getStatusId(scope.row.billStatusName)}`]">{{scope.row.billStatusName}}</span>
              </div>
              <a class="flex-center blue" v-if="scope.row.billAuditEdit" @click="toRecorded(scope.row)" >
                <i class="yfFont icon-chakanxiangqing" style="marginRight:5px"></i>
                <span>{{incomeBtnShow(scope.row)}}</span>
              </a>
            </template>
          </el-table-column>
          <el-table-column
            label="计划付款金额"
            width="200">
            <template slot-scope="scope">
              <div class="centerDistance">
                <span v-format="'#,##0.####'">{{scope.row.payAmountSum}}</span>
                <span class="statusStyle" :class="[`color${getStatusId(scope.row.payStatusName)}`,`bgColor${getStatusId(scope.row.payStatusName)}`,`brColor${getStatusId(scope.row.payStatusName)}`]">{{scope.row.payStatusName}}</span>
              </div>
              <a class="flex-center blue" v-if="scope.row.payAuditEdit" @click="toPayment(scope.row)">
                <i class="yfFont icon-chakanxiangqing" style="marginRight:5px"></i>
                <span>{{paymentBtnShow(scope.row)}}</span>
              </a>
            </template>
          </el-table-column>
          <el-table-column
            prop="progress"
            label="项目进度"
            width="130">
            <template slot-scope="scope">
              <div class="flex-center">
                <span class="yfFont" :class="[scope.row.icon]" :style="`color: ${scope.row.iconColor}`"></span>
                <span>{{scope.row.projectProgressName}}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            prop="status"
            label="审核状态">
            <template slot-scope="scope">
              <span :class="'color'+getStatusId(scope.row.projectStatusName)">{{scope.row.projectStatusName}}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="操作"
            width="140">
            <template slot-scope="scope">
              <el-button @click="toProjectDetails(scope.row)" type="text" size="small">{{scope.row.operation[0]}}</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <YfSearch  v-if="activeName === '#step_2'" @confirm="submit" layout="plant,projectType,budgetCategory,projectProgress,timeRange,keywords,submit"></YfSearch>
      <div  v-if="activeName === '#step_2'" class="content2">
        <el-table
          :data="allProjectList"
          border
          height="100%"
          style="width: 100%;">
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
            prop="tenderName"
            label="标的名称"
            width="300">
            <template slot-scope="scope">
              <el-popover
                placement="top-start"
                width="300"
                :value="scope.row.popover"
                :content="scope.row.tenderName"
                :visible-arrow="false">
                <span class="headline" slot="reference" @mouseenter="Menter(scope.row, $event)" @mouseleave="Mleave(scope.row)">{{scope.row.tenderName}}</span>
              </el-popover>
            </template>
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
            label="预算金额（元）"
            width="120">
            <template slot-scope="scope">
              <div v-format="'#,##0.####'">{{scope.row.budget}}</div>
            </template>
          </el-table-column>
          <el-table-column
            prop="planPurchasingTime"
            label="计划采购时间"
            width="130">
            <template slot-scope="scope">
              <div>{{scope.row.planPurchasingTime?$moment(scope.row.planPurchasingTime).format('yyyy年MM月DD日'):''}}</div>
            </template>
          </el-table-column>
          <el-table-column
            label="计划入账金额"
            width="200">
            <template slot-scope="scope">
              <div class="centerDistance">
                <span v-format="'#,##0.####'">{{scope.row.billAmountSum}}</span>
                <span class="statusStyle" :class="[`color${getStatusId(scope.row.billStatusName)}`,`bgColor${getStatusId(scope.row.billStatusName)}`,`brColor${getStatusId(scope.row.billStatusName)}`]">{{scope.row.billStatusName}}</span>
              </div>
              <a class="flex-center blue" @click="toRecorded(scope.row)"  v-if="scope.row.billAuditEdit">
                <i class="yfFont icon-chakanxiangqing" style="marginRight:5px"></i>
                <span>{{incomeBtnShow(scope.row)}}</span>
              </a>
            </template>
          </el-table-column>
          <el-table-column
            label="计划付款金额"
            width="200">
            <template slot-scope="scope">
              <div class="centerDistance">
                <span v-format="'#,##0.####'">{{scope.row.payAmountSum}}</span>
                <span class="statusStyle" :class="[`color${getStatusId(scope.row.payStatusName)}`,`bgColor${getStatusId(scope.row.payStatusName)}`,`brColor${getStatusId(scope.row.payStatusName)}`]">{{scope.row.payStatusName}}</span>
              </div>
              <a class="flex-center blue" v-if="scope.row.leaveOperation" @click="toPayment(scope.row)">
                <i class="yfFont icon-lijishenhe" style="marginRight:5px"></i>
                <span>{{scope.row.leaveOperation[0]}}</span>
              </a>
            </template>
          </el-table-column>
          <el-table-column
            label="项目进度"
            width="130">
            <template slot-scope="scope">
              <div class="flex-center">
                <span class="yfFont" :class="[scope.row.icon]" :style="`color: ${scope.row.iconColor}`"></span>
                <span>{{scope.row.projectProgressName}}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            label="审核状态">
            <template slot-scope="scope">
              <span :class="'color'+getStatusId(scope.row.projectStatusName)">{{scope.row.projectStatusName}}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="操作"
            width="140">
            <template slot-scope="scope">
              <el-button @click="toProjectDetails(scope.row)" type="text" size="small">{{scope.row.operation[0]}}</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>

<script>
import {mapGetters, mapActions} from 'vuex'
export default {
  data () {
    return {
      activeName: '',
      projectList: [],
      allProjectList: [],
      detailsInfo: {
        centralizedPurchasing: false, //统一采购
        perfect: false,
        isEstablishOff: true,
        isOff: true,
        readnoly: false,
        billReadonly: true,
        payReadonly: true
      },
      statusOperationMap: [{
        status: '待审核',
        operation: ['查看详情']
      },{
        status: '审核不通过',
        operation: ['查看详情']
      },{
        status: '审核中',
        operation: ['立即审核']
      },{
        status: '审核通过',
        operation: ['统一采购']
      },{
        status: '项目完结',
        operation: ['查看详情']
      }],
      progressIcon: [{
        progress: '项目立项',
        icon: 'icon-lixiang',
        iconColor: '#CC66FF'
      },{
        progress: '编制采购文件',
        icon: 'icon-caigou',
        iconColor: '#3399FF'
      },{
        progress: '合同拟稿',
        icon: 'icon-hetong',
        iconColor: '#3399FF'
      },{
        progress: '项目实施',
        icon: 'icon-shishi',
        iconColor: '#FF9933'
      },{
        progress: '入账计划',
        icon: 'icon-shishi',
        iconColor: 'red'
      },{
        progress: '付款计划',
        icon: 'icon-shishi',
        iconColor: 'red'
      },{
        progress: '完工总结',
        icon: 'icon-wangongzongjie',
        iconColor: '#00CC00'
      },{
        progress: '供应商评价',
        icon: 'icon-wangongzongjie',
        iconColor: '#00CC00'
      }]
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
    ...mapGetters(['storage', 'actionMapping'])
  },
  mounted () {
    this.activeName = window.location.hash || '#step_1' 
    if(!location.hash){
      window.location.hash = this.activeName
    }
    window.addEventListener('hashchange', this.hashchange)
    this.init()
  },
  methods: {
    init () {
      this.$http.fetchGet(`/project/getProjectListByAudit?type=1`).then(res => { //type1 -- 待处理
        if (res.code === 0) {
          this.projectList = res.data
          this.projectList && this.projectList.map((val, index) => {
            this.dispose(val, index)
          })
        }
      })
      this.$http.fetchGet(`/project/getProjectListByAudit?type=2`).then(res => { //type2
        if (res.code === 0) {
          this.allProjectList = res.data
          this.allProjectList && this.allProjectList.map((val, index) => {
            this.dispose(val, index)
          })
        }
      })
      this.getDetailsInfo()
    },
    dispose (val, index) {
      //序号
      val.serialNumber = index + 1
      //操作
      let progressObj = this.actionMapping.find(row => {
        return row.progress === val.projectProgressName
      })
      let operationInfo = progressObj.auditStatus.find(par => {
        return par.state === val.projectStatusName
      })
      val.operation = operationInfo.checkOperation
      // 计划入账操作
      let incomeObj = this.actionMapping.find(row => {
        return row.progress === '年度入账计划'
      }) 
      let incomeInfo = incomeObj.auditStatus.find(par => {
        return par.state === val.billStatusName
      })
      val.incomeOperation = incomeInfo?.checkOperation
      // 计划付款操作
      let leaveObj = this.actionMapping.find(row => {
        return row.progress === '年度付款计划'
      })
      let leaveInfo = leaveObj.auditStatus.find(par => {
        return par.state === val.payStatusName
      })
      val.leaveOperation = leaveInfo?.checkOperation
      // icon
      let iconInfo = this.progressIcon.find(param => {
        return param.progress === val.projectProgressName
      })
      val.icon = iconInfo.icon
      val.iconColor = iconInfo.iconColor
    },
    getDetailsInfo () {
      // 详情页数据
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
      this.$http.fetchGet(`/project/getFileTypeList`).then(res => { //采购方式
        this.detailsInfo.fileTypeList = res.data
      })
    },
    handleClick (tab) {
      window.location.hash = tab.name
    },
    hashchange () {
      this.activeName = window.location.hash
    },
    async toProjectDetails (row) {
      this.detailsInfo.title = `审核${row.projectProgressName}`
      await this.$http.fetchGet(`/project/getInfo?projectId=${row.projectId}`).then(res => { 
        this.saveStorage({key: 'adminManagementCheck_details', val: res.data})
      })
      if (row.projectProgressName === '项目立项') {
        if (row.operation[0] === '立即审核') {
          this.detailsInfo.isEstablishOff = false
        }else if (row.operation[0] === '查看详情'){
          this.detailsInfo.readnoly = true
        }else if (row.operation[0] === '统一采购') {
          this.detailsInfo.centralizedPurchasing = true
        }
      }else if (row.projectProgressName === '编制采购文件') {
        this.detailsInfo.title = `审核采购文件`
        if (row.operation[0] === '立即审核') {
          // 
        }else if (row.operation[0] === '查看详情'){
          this.detailsInfo.readnoly = true
        }
      }else if (row.projectProgressName === '合同拟稿') {
        this.detailsInfo.title = `审核合同拟稿`
        if (row.operation[0] === '立即审核') {
          // 
        }else if (row.operation[0] === '查看详情'){
          this.detailsInfo.perfect = true     //完善合同信息
          this.detailsInfo.readnoly = true
        }
      }else if (row.projectProgressName === '项目实施') {
        this.detailsInfo.perfect = true
        if (row.operation[0] === '立即审核') {
          // 
        }else if (row.operation[0] === '查看详情'){
          this.detailsInfo.readnoly = true
        }
      }else if (row.projectProgressName === '完工总结') {
        this.detailsInfo.perfect = true
        if (row.operation[0] === '立即审核') {
          // 
        }else if (row.operation[0] === '查看详情'){
          this.detailsInfo.readnoly = true
        }
      }else if (row.projectProgressName === '供应商评价') {
        this.detailsInfo.perfect = true
        if (row.operation[0] === '立即审核') {
          // 
        }else if (row.operation[0] === '查看详情'){
          this.detailsInfo.readnoly = true
        }
      }
      this.detailsInfo.hash = window.location.hash
      this.saveStorage({key: 'adminManagement_details', val: this.detailsInfo})
      this.$router.push('/expendManagement/adminManagement/adminManagementCheck') 
    },
    projectDel (row) {
      this.$http.fetch(`/project/projectDelete?projectId=${row.projectId}&status=${row.status}`).then(() => {
        this.init()
        this.$message({
          message: '恭喜你，删除成功',
          type: 'success'
        });
      })
    },
    async toRecorded (row) {
        this.detailsInfo.title = `审核入账计划`
        this.detailsInfo.hash = window.location.hash
        if (row.billAuditEdit === 1) this.detailsInfo.billReadonly = true
        this.saveStorage({key: 'adminManagement_details', val: this.detailsInfo})
        await this.$http.fetchGet(`/project/getInfo?projectId=${row.projectId}`).then(res => { 
          this.saveStorage({key: 'adminManagementCheck_details', val: res.data})
        })
        this.$router.push('/expendManagement/adminManagement/adminManagementCheck')
    },
    async toPayment (row) {
        this.detailsInfo.title = `审核付款计划`
        this.detailsInfo.hash = window.location.hash
        if (row.payAuditEdit === 1) this.detailsInfo.payReadonly = true
        this.saveStorage({key: 'adminManagement_details', val: this.detailsInfo})
        await this.$http.fetchGet(`/project/getInfo?projectId=${row.projectId}`).then(res => { 
          this.saveStorage({key: 'adminManagementCheck_details', val: res.data})
        })
        this.$router.push('/expendManagement/adminManagement/adminManagementCheck')
    },
    submit ({budgetCategory, etime, keywords, plantCode, projectProgress, projectType, stime}) {
      this.$http.fetchGet(`/project/getProjectListByAudit?budgetCode=${budgetCategory}&endDate=${etime}&name=${keywords}&plantId=${plantCode}&projectProgress=${projectProgress}&projectType=${projectType}&startDate=${stime}&type=2`).then(res => { //type2 -- 全部
        this.allProjectList = res.data
        this.allProjectList && this.allProjectList.map((val, index) => {
          this.dispose(val, index)
        })
      })
    },
    incomeBtnShow (row) {
      if (row.billAuditEdit === 1) {
        return '立即审核'
      }else {
        return '查看详情'
      }
    },
    paymentBtnShow (row) {
      if (row.payAuditEdit === 1) {
        return '立即审核'
      }else {
        return '查看详情'
      }
    },
    Menter (row, e) {
      if (e.currentTarget.getBoundingClientRect().width > 300) {
        this.$set(row, 'popover', true)
      }
    },
    Mleave (row) {
      row.popover = false
    },
    ...mapActions(['saveStorage'])
  },
  components: {
  }
}
</script>

<style lang="less" scoped>
.managementAdmin {
  height: 100%;
  .container {
    height: 100%;
    display: flex;
    flex-direction: column;
    background-color: #fff;
  }
  .content, .content2 {
    position: relative;
    overflow: auto;
    flex: 1;
    max-height: calc(100% - 40px);
    .headline { //标的名称
      overflow:hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      -o-text-overflow:ellipsis;
    }
    .handrail {
      > span {
        padding-left: 10px;
        margin-left: 10px;
        border-left: 1px solid #409EFF;
      }
    }
    .statusStyle {
      font-size: 10px;
      line-height: 10px;
      padding: 4px;
      border-radius: 4px;
    }
    .centerDistance {
      display:flex;
      align-content: center; 
      align-items:center;
      justify-content: center;
      flex-wrap: wrap;
      > span:nth-of-type(1) {
        margin-right: 5px;
      }
      > span:nth-of-type(2) {
        margin-left: 5px;
      }
    }
    /deep/ .el-button--text {
      padding: 0;
    }
  }
  .content2 {
    max-height: calc(100% - 39px - 66px);
  }
}
</style>