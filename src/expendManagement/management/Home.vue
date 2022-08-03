<template>
  <div class="management">
    <div class="container">
      <el-tabs v-model="activeName" class="orderTabs" @tab-click="handleClick">
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
        <div class="flex-center tabRightWrap">
          <a class="flex-center blue" @click="toProjectDetails({operation:['项目立项']})">
            <i class="el-icon-circle-plus-outline" style="font-size: 16px;"></i>
            <span>新建项目</span>
          </a>
        </div>
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
              <a class="flex-center blue" style="marginTop:4px" v-if="scope.row.billEdit" @click="toRecorded(scope.row)">
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
              <a class="flex-center blue"  style="marginTop:4px"  v-if="scope.row.payEdit" @click="toPayment(scope.row)">
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
              <el-popconfirm
                title="确定删除吗？"
                @confirm="projectDel(scope.row)"
              >
                <el-button slot="reference" type="text" size="small" class="handrail" v-if="scope.row.operation[1]">{{scope.row.operation[1]}}</el-button>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <YfSearch v-if="activeName === '#step_2'" @confirm="submit" layout="plant,projectType,budgetCategory,projectProgress,timeRange,keywords,submit"></YfSearch>
      <div v-if="activeName === '#step_2'" class="content2">
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
              <a class="flex-center blue" style="marginTop:4px"  @click="toRecorded(scope.row)" v-if="scope.row.billEdit">
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
              <a class="flex-center blue" style="marginTop:4px"  @click="toPayment(scope.row)" v-if="scope.row.leaveOperation">
                <i class="yfFont icon-lijishenhe" style="marginRight:5px"></i>
                <span>{{paymentBtnShow(scope.row)}}</span>
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
              <el-popconfirm
                title="确定删除吗？"
                @confirm="projectDel(scope.row)"
              >
                <el-button slot="reference" type="text" size="small" class="handrail" v-if="scope.row.operation[1]">{{scope.row.operation[1]}}</el-button>
              </el-popconfirm>
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
        title: '',
        isEstablishOff: true,
        isPurchaseOff: true,
        isDraftOff: true,
        isImplementation: true,
        isInvestOff: true,
        isCapitalOff: true,
        isSummarize: true,
        billReadonly: true,
        payReadonly: true,
        isEvaluate: true
      },
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
  created () {
    this.activeName = window.location.hash || '#step_1' 
    if(!location.hash){
      window.location.hash = this.activeName
    }
    window.addEventListener('hashchange', this.hashchange)
    this.init(this.getDetailsInfo)
  },
  methods: {
    async init (DetailsInfo) {
      await this.$http.fetchGet(`/project/getProjectList?type=1`).then(res => { //type1 -- 待处理
        if (res.code === 0) {
          this.projectList = res.data
          this.projectList && this.projectList.map((val, index) => {
            this.dispose(val, index)
          })
        }
      })
      await this.$http.fetchGet(`/project/getProjectList?type=2`).then(res => { //type2 -- 全部
        if (res.code === 0) {
          this.allProjectList = res.data
          this.allProjectList && this.allProjectList.map((val, index) => {
            this.dispose(val, index)
          })
        }
      })
      DetailsInfo?.()
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
      val.operation = operationInfo.operation
      // 计划入账操作
      let incomeObj = this.actionMapping.find(row => {
        return row.progress === '年度入账计划'
      }) 
      let incomeInfo = incomeObj.auditStatus.find(par => {
        return par.state === val.billStatusName
      })
      val.incomeOperation = incomeInfo?.operation
      // 计划付款操作
      let leaveObj = this.actionMapping.find(row => {
        return row.progress === '年度付款计划'
      })
      let leaveInfo = leaveObj.auditStatus.find(par => {
        return par.state === val.payStatusName
      })
      val.leaveOperation = leaveInfo?.operation
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
      console.log(row);
      this.detailsInfo.title = row.operation[0]
      if (row.operation[0] === '项目立项') { //新建项目
        this.detailsInfo.isEstablishOff = false
        this.saveStorage({key: 'managementEdit_details', val: null})
      }else {
        await this.$http.fetchGet(`/project/getInfo?projectId=${row.projectId}`).then(res => { 
          this.saveStorage({key: 'managementEdit_details', val: res.data})
        })
        if (row.projectProgressName === '项目立项') {
          if (row.operation[0] === '编辑') {
            this.detailsInfo.title = '项目立项'
            this.detailsInfo.isEstablishOff = false
          }else if (row.operation[0] === '查看详情'){
            this.detailsInfo.title = '项目立项'

          }else if (row.operation[0] === '编制采购文件') {
            this.detailsInfo.isPurchaseOff = false
          }
        } else if (row.projectProgressName === '编制采购文件') {
          if (row.operation[0] === '编辑') {
             this.detailsInfo.title = '编制采购文件'
             this.detailsInfo.isPurchaseOff = false
          }else if (row.operation[0] === '查看详情'){
            this.detailsInfo.title = '编制采购文件'
            
          }else if (row.operation[0] === '合同拟稿') {
            this.detailsInfo.isDraftOff = false
          }
        } else if (row.projectProgressName === '合同拟稿') {
          if (row.operation[0] === '编辑') {
            this.detailsInfo.title = '合同拟稿'
            this.detailsInfo.isDraftOff = false
          }else if (row.operation[0] === '查看详情'){
            this.detailsInfo.title = '合同拟稿'
            
          }else if (row.operation[0] === '项目实施') {
            this.detailsInfo.isImplementation = false
          }
        } else if (row.projectProgressName === '项目实施') {
          if (row.operation[0] === '编辑') {
            this.detailsInfo.title = '项目实施'
            this.detailsInfo.isImplementation = false
          }else if (row.operation[0] === '查看详情'){
            this.detailsInfo.title = '项目实施'
          }else if (row.operation[0] === '完工总结') { 
            this.detailsInfo.isSummarize = false
          }
        } else if (row.projectProgressName === '完工总结') {
          if (row.operation[0] === '编辑') {
            this.detailsInfo.title = '完工总结'
            this.detailsInfo.isSummarize = false
          }else if (row.operation[0] === '查看详情'){
            this.detailsInfo.title = '完工总结'
          }else if (row.operation[0] === '供应商评价') {
            if (!this.storage.managementEdit_details.purchase.contractSigningOrg) {
              this.$notify({
                title: '警告',
                message: '管理员尚未完善合同信息',
                type: 'warning'
              });
              return ;
            }else {
              this.detailsInfo.isEvaluate = false
            }
          }
        } else if (row.projectProgressName === '供应商评价') {
          this.detailsInfo.title = '供应商评价'
          if (row.operation[0] === '编辑') {
            this.detailsInfo.isEvaluate = false
          }else if (row.operation[0] === '查看详情'){
            
          }
        }
      }
      if (row.billEdit === 1) {
        this.detailsInfo.billReadonly = false
      }else if (row.payEdit === 1) {
        this.detailsInfo.payReadonly = false
      }
      this.detailsInfo.hash = window.location.hash
      this.saveStorage({key: 'management_details', val: this.detailsInfo})
      this.$router.push('/expendManagement/management/managementDetails')
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
    submit ({budgetCategory, etime, keywords, plantCode, projectProgress, projectType, stime}) {
      this.$http.fetchGet(`/project/getProjectList?budgetCode=${budgetCategory}&endDate=${etime}&name=${keywords}&plantId=${plantCode}&projectProgress=${projectProgress}&projectType=${projectType}&startDate=${stime}&type=2`).then(res => { //type2 -- 全部
        this.allProjectList = res.data
        this.allProjectList && this.allProjectList.map((val, index) => {
          this.dispose(val, index)
        })
      })
    },
    incomeBtnShow (row) {
      if (row.projectProgress >= 3 && row.incomeOperation) {
        return row.incomeOperation?.[0]
      }else if (row.projectProgress === 3 && row.projectStatus === 4) {
        return '年度入账计划'
      }else if (row.projectProgress > 3) {
        return '年度入账计划'
      }
    },
    paymentBtnShow (row) {
      return row.leaveOperation? row.leaveOperation[0]: '年度付款计划'
    },
    toRecorded (row) {
        if (row.billEdit === 1) this.detailsInfo.billReadonly = false
        this.$http.fetchGet(`/project/getInfo?projectId=${row.projectId}`).then(res => { 
          this.saveStorage({key: 'managementEdit_details', val: res.data})
          this.detailsInfo.title = '入账计划'
          this.detailsInfo.isInvestOff = false
          this.detailsInfo.hash = window.location.hash
          this.saveStorage({key: 'management_details', val: this.detailsInfo})
          this.$router.push('/expendManagement/management/managementDetails')
        })
    },
    toPayment (row) {
        if (row.payEdit === 1) this.detailsInfo.payReadonly = false
        this.$http.fetchGet(`/project/getInfo?projectId=${row.projectId}`).then(res => { 
          this.saveStorage({key: 'managementEdit_details', val: res.data})
          this.detailsInfo.title = '付款计划'
          this.detailsInfo.isCapitalOff = false
          this.detailsInfo.hash = window.location.hash
          this.saveStorage({key: 'management_details', val: this.detailsInfo})
          this.$router.push('/expendManagement/management/managementDetails')
        })
    },
    isPopover (row) {
      console.log('opover', row, this.$refs.text);
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
.management {
  height: 100%;
  .container {
    height: 100%;
    display: flex;
    flex-direction: column;
    background-color: #fff;
    .content, .content2 {
      position: relative;
      flex: 1;
      max-height: 100%; 
      .headline { //标的名称
        overflow:hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        -o-text-overflow:ellipsis;
      }
      .handrail {
        padding: 0;
        padding-left: 10px;
        margin-left: 10px;
        border-left: 1px solid #409EFF;
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
    }
    .content2 {
      max-height: calc(100% - 39px - 66px);
    }
    /deep/ .el-button--text {
      padding: 0;
    }
  }
}
</style>