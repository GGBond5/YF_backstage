<template>
  <div class="adminPurchaseCheck flex-column">
    <YfDetailsHeader :path="'/expendManagement/adminPurchase'+this.info.hash" title="审核项目立项"></YfDetailsHeader>
    <div class="header flex-vCenter">
      <i class="yfFont icon-biaotiqian"></i>
      <span>项目详情</span>
    </div>
    <div class="container">
      <div class="detailsContent">
        <YfCollapse title="项目立项管理" :isShow="info.title === '审核项目立项' ? true : false" ref="collapse1">
          <div class="projectSetUp">
            <el-form :model="proSetUpForm" ref="ruleForm"  label-width="110px" label-position="left" class="demo-ruleForm">
              <p>
                <el-form-item label="所属场站：">
                  <el-select v-model="proSetUpForm.proSetUpPlant" placeholder="请选择" :disabled="true">
                    <el-option v-for="(item, index) in deptPlantList" :key="index" :label="item.plantName" :value="item.plantId"></el-option>
                  </el-select>
                </el-form-item>
              </p>
              <p>
                <el-form-item label="标的名称：">
                  <el-input v-model="proSetUpForm.proSetUpActivityName" :disabled="true"></el-input>
                </el-form-item>
              </p>
              <p>
                <el-form-item label="项目类型：">
                  <el-select v-model="proSetUpForm.proSetUpProjectType" placeholder="请选择项目类型" :disabled="true">
                    <el-option v-for="(item, index) in ProjectType" :key="index" :label="item.projectTypeName" :value="item.projectType"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="预算科目：">
                  <el-select v-model="proSetUpForm.proSetUpBudgetCode" placeholder="请选择预算科目" :disabled="true">
                    <el-option v-for="(item, index) in budgetCodeList" :key="index" :label="item.budgetCodeName" :value="item.budgetCode"></el-option>
                  </el-select>
                </el-form-item>
              </p>
              <p>
                <el-form-item label="预算金额： ">
                  <el-input v-model.number="proSetUpForm.proSetUpMoney" :disabled="true" oninput="value=value.replace(/^\D*(\d*(?:\.\d{0,2})?).*$/g,'$1')">
                    <span slot="suffix" style="marginRight: 10px;">元</span>
                  </el-input>
                </el-form-item>
                <el-form-item label="预算检查： ">
                  <el-tooltip class="item" effect="light" placement="top-start">
                    <div slot="content" class="tooltip">
                      <p>场站的可用投资预算（元）:</p>
                      <h4>￥{{proSetUpForm.plantResidue}}</h4>
                      <p>项目公司的可用投资预算（元）:</p>
                      <h4>￥{{proSetUpForm.totalResidue}}</h4>
                    </div>
                    <span :style="{color: proSetUpForm.proSetUpCheck? 'red': 'green'}">{{proSetUpForm.proSetUpCheck? '超预算': '未超预算'}}</span>
                  </el-tooltip>
                </el-form-item>
              </p>
              <p>
                <el-form-item label="计划采购时间： ">
                  <el-date-picker
                    v-model="proSetUpForm.proSetUpTime"
                    type="date"
                    placeholder="选择日期"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    :disabled="true">
                  </el-date-picker>
                </el-form-item>
                <el-form-item label="采购方式：">
                  <el-select v-model="proSetUpForm.proSetUpPurchasingMethod" placeholder="请选择采购方式" :disabled="true">
                    <el-option v-for="(item, index) in purchasingMethod" :key="index" :label="item.purchasingMethodName" :value="item.purchasingMethod"></el-option>
                  </el-select>
                </el-form-item>
              </p>
              <p class="uploading">
                <el-form-item label="立项支撑文件：">
                  <div class="uploadList" v-if="approvalList && approvalList.length > 0">
                    <ul>
                      <li v-for="(item, index) in approvalList" :key="`file${index}`">
                        <span>
                          <span :class="[`color${item.fileCode%10 < 7 ? item.fileCode%10 + 1 : 1}`,`bgColor${item.fileCode%10 < 7 ? item.fileCode%10 + 1 : 1}`]">{{item.fileCodeName}}</span>
                        </span>
                        <span>{{item.fileName}}</span>
                        <span><label v-format="'0.#0'">{{item.fileSize/1024/1024}}</label>MB</span>
                        <span class="yfFont icon-xiazai" @click="download(item)"></span> 
                      </li>
                    </ul>
                  </div>
                </el-form-item>
              </p>
              <p v-if="info.isEstablishOff">
                <el-form-item label="统一采购项目:">
                  <el-table
                    :data="purchaseTableData"
                    border
                    :span-method="arraySpanMethod2"
                    style="width: 100%">
                    <el-table-column
                      label="序号"
                      width="60">
                      <template slot-scope="scope">
                        <div :class="setBlue(scope.row)" @click="increasePurchase(scope.row)"><i class="el-icon-plus" v-if="scope.row.serialNumber === '添加统一采购项目'" style="marginRight: 5px"></i>{{scope.row.serialNumber}}</div>
                      </template>
                    </el-table-column>
                    <el-table-column
                      prop="plantName"
                      label="场站"
                      width="180">
                    </el-table-column>
                    <el-table-column
                      prop="tenderName"
                      label="标的名称"
                      width="300"
                      show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column
                      prop="projectTypeName"
                      label="项目类型">
                    </el-table-column>
                    <el-table-column
                      prop="budgetCodeName"
                      label="预算科目">
                    </el-table-column>
                    <el-table-column
                      prop="budget"
                      label="预算金额（元）">
                      <template slot-scope="scope">
                        <div v-format="'#,##0.####'">{{scope.row.budget}}</div>
                      </template>
                    </el-table-column>
                    <el-table-column
                      prop="planPurchasingTime"
                      label="计划采购时间">
                      <template slot-scope="scope">
                        <div>{{$moment(scope.row.planPurchasingTime).format('yyyy-MM-DD')}}</div>
                      </template>
                    </el-table-column>
                    <el-table-column
                      prop="purchasingMethodName"
                      label="采购方式">
                    </el-table-column>
                    <el-table-column
                      prop="operation"
                      label="操作"
                      width="180">
                      <template slot-scope="scope">
                        <div class="blueTextBtn" @click="purchaseRemove(scope.row)">移除</div>
                      </template>
                    </el-table-column>
                  </el-table>
                </el-form-item>
              </p>
            </el-form>
            <div class="btns" v-if="info.centralizedPurchasing && purchaseAuth">
              <el-button plain @click="cencel()">取消</el-button>
              <el-button type="primary" @click="changeSave()">保存</el-button>
            </div>
            <!-- 添加统一采购项目 -->
            <el-dialog
              title="统一采购项目"
              :visible.sync="purchaseDialog"
              ref="multipleTable"
              width="70%">
              <el-table
                ref="multipleTable"
                :data="purchaseData"
                border
                style="width: 100%"
                @selection-change="handleSelectionChange">
                <el-table-column
                  type="selection"
                  width="40">
                </el-table-column>
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
                  width="300"
                  show-overflow-tooltip>
                </el-table-column>
                <el-table-column
                  prop="projectTypeName"
                  label="项目类型">
                </el-table-column>
                <el-table-column
                  prop="budgetCodeName"
                  label="预算科目">
                </el-table-column>
                <el-table-column
                  prop="budget"
                  label="预算金额（元）">
                  <template slot-scope="scope">
                    <div v-format="'#,##0.####'">{{scope.row.budget}}</div>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="planPurchasingTime"
                  label="计划采购时间">
                  <template slot-scope="scope">
                    <div>{{$moment(scope.row.planPurchasingTime).format('yyyy-MM-DD')}}</div>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="purchasingMethodName"
                  label="采购方式">
                </el-table-column>
              </el-table>
              <span slot="footer" class="dialog-footer flex-center">
                <el-button @click="purchaseDialog = false">取 消</el-button>
                <el-button type="primary" @click="pitchOn()">确 定</el-button>
              </span>
            </el-dialog>
          </div>
        </YfCollapse>
        <!-- 审核结果 -->
        <div class="auditOpinion" v-if="!info.isEstablishOff && !info.readonly">
          <el-form ref="auditForm" :model="auditForm" label-width="120px" > 
            <el-form-item label="审核结果：">
              <el-radio-group v-model="auditForm.pass">
                <el-radio :label="true">通过</el-radio>
                <el-radio :label="false">不通过</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="意见及建议：">
            <el-input
              type="textarea"
              :rows="2"
              resize='none'
              placeholder="请输入内容"
              v-model="auditForm.suggest">
            </el-input> 
            </el-form-item>
          </el-form> 
          <!-- 提交按钮 -->
          <div class="btns" v-if="!info.isEstablishOff">
            <el-button @click="cencel()" plain>取消</el-button>
            <el-button type="primary" @click="submitAudit()">提交</el-button>
          </div>
        </div>
      </div>
    </div>
    <!-- 流转过程 -->
    <div class="process">
      <YfCollapse title="流转过程" ref="collapse8" :isShow="false">
        <div class="statusWrap flex-center" slot="status">
          <span class="name">当前状态：</span>
          <span :class="[`color${getStatusId(rowInfo.projectStatus)}`,`bgColor${getStatusId(rowInfo.projectStatus)}`,`brColor${getStatusId(rowInfo.projectStatus)}`]">{{getStatusName(rowInfo.projectStatus)}}</span>
        </div>
        <timelineForm :activities="activities"></timelineForm>
      </YfCollapse>
    </div>
  </div>
</template>

<script>
import {mapGetters, mapActions} from 'vuex'
import timelineForm from '@/views/expendManagement/timelineForm.vue'
export default {
  data() {
    return {
      info: {},
      rowInfo: {},
      activities: [],
      purchaseDialog: false,  //添加统一采购项目弹窗
      tagMapColor: [], //tag颜色映射表
      approvalList: [],
      approvalBtns: [],  //项目立项上传按钮
      proSetUpForm: { //项目立项表单
        proSetUpPlant: '',
        proSetUpActivityName: '',
        proSetUpProjectType: '',
        proSetUpBudgetCode: '',
        proSetUpMoney: '',
        proSetUpCheck: false,
        proSetUpTime: '',
        proSetUpPurchasingMethod: '',
        plantResidue: '0',
        totalResidue: '0',
      },
      purchaseTableData: [{ //统一采购项目表格
        serialNumber: '添加统一采购项目',
      }],
      purchaseData: [],
      tableSelectRow: [],
      auditForm: {  //评论意见
        pass: true,
        suggest: '',
      },
      deptPlantList: [],
      ProjectType: [],
      budgetCodeList: [],
      purchasingMethod: [],
    }
  },
  computed: {
    getStatusName () {
      return function (params) {
        if (params === 1) {
          return '待审核'
        }else if (params === 2) {
          return '审核中'
        }else if (params === 3) {
          return '审核不通过'
        }else {
          return '审核通过'
        }
      }
    },
    getStatusId () {
      return function (params) {
        if (params === 1) {
          return 3
        }else if (params === 2) {
          return 4
        }else if (params === 3) {
          return 1
        }else {
          return 5
        }
      }
    },
     ...mapGetters(['storage'])
  },
  created () {
    this.init()
  },
  methods: {
    init () {
      this.info = this.storage.yearPlan_details
      this.rowInfo = this.storage.yearPlan_details.plan
      this.deptPlantList = this.info.deptPlantList
      this.ProjectType = this.info.ProjectType
      this.budgetCodeList = this.info.budgetCodeList
      this.purchasingMethod = this.info.purchasingMethod
      this.proSetUpForm.proSetUpPlant = this.rowInfo.plantId 
      this.proSetUpForm.proSetUpActivityName = this.rowInfo.tenderName 
      this.proSetUpForm.proSetUpProjectType = this.rowInfo.projectType
      this.proSetUpForm.proSetUpBudgetCode = this.rowInfo.budgetCode
      this.proSetUpForm.proSetUpMoney = this.rowInfo.budget
      this.proSetUpForm.proSetUpCheck = this.rowInfo.budgetCheck
      this.proSetUpForm.proSetUpTime = this.rowInfo.planPurchasingTime
      this.proSetUpForm.proSetUpPurchasingMethod = this.rowInfo.purchasingMethod
      this.approvalList = this.rowInfo.files
      // 统一采购
      this.$http.fetchGet(`/project/getYearPurchaseList?budgetCode=${this.rowInfo.budgetCode}
      &id=${this.rowInfo.id}&projectType=${this.rowInfo.projectType}
      &purchasingMethod=${this.rowInfo.purchasingMethod}`).then(res => {
        this.purchaseData = res.data
        this.purchaseData.map((item, index) => { 
          item.serialNumber = index + 1
        })
      })
    },
    handleRemove(file, fileList) {  //文件列表移除文件时的钩子
      console.log(file, fileList);
    },
    handlePreview(file) {   //点击文件列表中已上传的文件时的钩子
      console.log(file);
    },
    selectFile (item) { //选择文件完毕等待上传
      this.tag = item   //给文件打上tag，如‘可行性研究报告’
    },
    handleChange (file, fileList) {
      this.approvalList = fileList
      file.tag = this.tag
      this.$nextTick(()=>{  //页面发生改变时，触发收缩面板重新计算高度
        this.$refs.collapse.settingDefaultShow()
      })
    },
    pitchOn () {
      this.purchaseTableData = [{
        serialNumber: '添加统一采购项目',
      },...this.tableSelectRow]
      this.purchaseDialog = false
      this.$nextTick(()=>{  //页面发生改变时，触发收缩面板重新计算高度
        this.$refs.collapse.settingDefaultShow()
      })
    },
    increasePurchase (row) { //新增付款
      if (row.serialNumber === '添加统一采购项目') {
        this.purchaseDialog = true
      }
    },
    handleSelectionChange (val) { //被多选框选中的数据行
      console.log(val); 
      this.tableSelectRow = val 
      this.tableSelectRow.sort((a, b) => {
        if (a.serialNumber < b.serialNumber) {
          return -1
        }
        if (a.serialNumber > b.serialNumber) {
          return 1
        }
        return 0
      })
    },
    setBlue (row) {
      if (['添加统一采购项目'].includes(row.serialNumber)) { //新增入账计划的样式
        return {
          blueTextBtn: true
        }
      }
    },
    moneyFormat(money) {  //千分位带两位小数
      if ((money ?? '') === '') {return ''}
      return Number(money).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,')
    },
    arraySpanMethod2({ row, column, rowIndex, columnIndex }) { //表格合并
      if (rowIndex  === 0) {
        if (columnIndex === 0) {
          return [1, 8];
        } else {
          return [0, 0];
        }
      }
    },
    changeSave () {
      const list = this.tableSelectRow.map(val => {
        return val.id
      })
      this.$http.fetch(`/project/yearPurchaseList?ids=${list}&id=${this.info.plan.id}`).then(res => {
        if (res.code === 0) {
          this.$router.push('/expendManagement/adminPurchase')
        }
      }) 
    },
    submitAudit () {
      this.$http.fetch(`/project/yearProjectAudit`, {
        auditFlag: this.auditForm.pass,
        comment: this.auditForm.suggest,
        projectId: this.info.plan.id,
      }).then(res => {
        if (res.code === 0) {
          this.$router.push('/expendManagement/adminPurchase')
        }
      })
    },
    download (row) {
      this.$http.download(`/file/downloadFile?id=${row.id}`).then(res => {
        this.$fileDownload(res.data, row.fileName)
      })
    },
  },
  components: {timelineForm}
}
</script>

<style lang="less" scoped>
.adminPurchaseCheck {
  width: 100%;
  height: 100%;
  .header {
    height: 64px;
    line-height: 64px;
    font-size: 16px;
    margin-top: 10px;
    padding-left: 30px;
    border-bottom: 1px solid #f2f2f2;
    background-color: #fff; 
    span {
      line-height: 26px;
    }
    i {
      font-size: 26px;
    }
  }
  .container {
    flex: 1;
    overflow: auto;
    border-radius: 6px;
    background-color: #fff;
    .detailsContent {
      padding: 0 10px;
      .projectSetUp {
        p {
          display: flex;
          > div {
            flex: 1;
            padding: 0 20px;
            /deep/ .el-select, .el-date-editor {
              width: 100%;
            }
          }
        }
        .uploading {
          button {
            height: 36px;
            padding: 0 20px;
            border: 1px dashed #DCDFE6;
            border-radius: 0;
          }
          .upload-demo {
            margin-bottom: 10px;
          }
          .uploadList {
            margin-top: 10px;
            max-width: 1240px;
            min-height: 40px;
            padding: 10px;
            border: 1px solid rgba(0, 0, 0, 0.1);
            ul li {
              display: flex;
              justify-content: flex-end;
              align-items: center;
              padding: 0 10px;
              margin-bottom: 10px;
              list-style: none;
              background-color: rgba(0, 0, 0, 0.03);
              >span:nth-of-type(1) {
                >span:nth-of-type(1) {
                  display: inline-block;
                  width: 160px;
                  height: 24px;
                  line-height: 24px;
                  font-size: 10px;
                  padding: 0 14px;
                  text-align: center;
                  border-radius: 4px;
                }
              }
              >span:nth-of-type(2) {
                flex: 1;
                margin: 0 20px;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
              }
              >span:nth-of-type(3) {
                margin: 0 20px;
              }
              >span:nth-of-type(4) {
                margin-right: 10px;
                font-size: 20px;
                cursor: pointer;
              }
            }
            ul li:nth-last-of-type(1) {
              margin-bottom: 0px;
            }
          }
        }
      }
      /deep/ .el-upload {
        text-align: left;
      }
      .btns {
        display: flex;
        justify-content: center;
      }
      /deep/ .el-button {
        color: #409EFF;
      }
      /deep/ .el-button--primary {
        color: #fff;
      }
      /deep/ .el-upload--picture-card {
        text-align: center;
        width: 96px;
        height: 96px;
        line-height: 96px;
      }
      /deep/ .el-upload-list--picture-card .el-upload-list__item {
        width: 96px;
        height: 96px;
      }
      /deep/ .el-dialog__body {
        padding: 30px 20px 0 20px;
      }
      /deep/ .el-dialog__footer {
        text-align: center;
      }
    }
  }
  .process {
    margin-top: 10px;
    background-color: #fff;
    min-height: 66px;
    max-height: 250px;
    overflow: auto;
    .statusWrap {
      > span:nth-of-type(2) {
        font-size: 12px;
        height: 34px;
        line-height: 34px;
        padding: 0 30px;
        border-radius: 4px;
      }
    }
  }
}
</style>