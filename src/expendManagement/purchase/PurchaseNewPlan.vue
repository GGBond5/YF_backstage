<template>
  <div class="purchaseNewPlan flex-column">
    <YfDetailsHeader :path="'/expendManagement/purchase'+this.info.hash" title="采购计划立项"></YfDetailsHeader>
    <div class="header flex-vCenter">
      <i class="yfFont icon-biaotiqian"></i>
      <span>项目详情</span>
    </div>
    <div class="container">
      <div class="detailsContent">
        <YfCollapse title="项目立项管理" ref="collapse">
          <div class="projectSetUp">
            <el-form :model="proSetUpForm" :rules="rules" ref="proSetUpForm" label-width="110px" label-position="left" label-suffix=":" class="demo-ruleForm">
              <p>
                <el-form-item label="所属场站" prop="proSetUpPlant">
                  <el-select v-model="proSetUpForm.proSetUpPlant" placeholder="请选择" :disabled="info.readonly" @change="budgetary()">
                    <el-option v-for="(item, index) in deptPlantList" :key="index" :label="item.plantName" :value="item.plantId"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item>
                </el-form-item>
              </p>
              <p>
                <el-form-item label="标的名称" prop="proSetUpActivityName">
                  <el-input v-model="proSetUpForm.proSetUpActivityName" :disabled="info.readonly" maxlength="50"></el-input>
                </el-form-item>
              </p>
              <p>
                <el-form-item label="项目类型" prop="proSetUpProjectType">
                  <el-select v-model="proSetUpForm.proSetUpProjectType" placeholder="请选择项目类型" :disabled="info.readonly">
                    <el-option v-for="(item, index) in ProjectType" :key="index" :label="item.projectTypeName" :value="item.projectType"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="预算科目" prop="proSetUpBudgetCode">
                  <el-select v-model="proSetUpForm.proSetUpBudgetCode" placeholder="请选择预算科目" :disabled="info.readonly" @change="budgetary()">
                    <el-option v-for="(item, index) in budgetCodeList" :key="index" :label="item.budgetCodeName" :value="item.budgetCode"></el-option>
                  </el-select>
                </el-form-item>
              </p>
              <p>
                <el-form-item label="预算金额" prop="proSetUpMoney">
                  <el-input v-model.number="proSetUpForm.proSetUpMoney" :disabled="info.readonly" @input="budgetary()" oninput="value=value.replace(/^\D*(\d*(?:\.\d{0,2})?).*$/g,'$1')" maxlength="50">
                    <span slot="suffix" style="marginRight: 10px;">元</span>
                  </el-input>
                </el-form-item>
                <el-form-item label="预算检查" required>
                  <el-tooltip class="item" effect="light" placement="top-start" :disabled="!proSetUpForm.proSetUpCheck" >
                    <div slot="content" class="tooltip">
                      <!-- <p>场站的可用投资预算（元）:</p> -->
                      <h4>{{proSetUpForm.plantResidue}}</h4>
                      <!-- <p>项目公司的可用投资预算（元）:</p> -->
                      <h4>{{proSetUpForm.totalResidue}}</h4>
                    </div>
                    <span :class="`color${proSetUpForm.proSetUpCheck?1:5}`">{{proSetUpForm.proSetUpCheck? '超预算': '未超预算'}}</span>
                  </el-tooltip>
                </el-form-item>
              </p>
              <p>
                <el-form-item label="计划采购时间" prop="proSetUpTime">
                  <el-date-picker
                    v-model="proSetUpForm.proSetUpTime"
                    type="date"
                    placeholder="选择日期"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    :disabled="info.readonly"
                    @change="budgetary()">
                  </el-date-picker>
                </el-form-item>
                <el-form-item label="采购方式" prop="proSetUpPurchasingMethod">
                  <el-select v-model="proSetUpForm.proSetUpPurchasingMethod" placeholder="请选择采购方式" :disabled="info.readonly">
                    <el-option v-for="(item, index) in purchasingMethod" :key="index" :label="item.purchasingMethodName" :value="item.purchasingMethod"></el-option>
                  </el-select>
                </el-form-item>
              </p>
              <p class="uploading">
                <el-form-item label="立项支撑文件" required :error="fileErrList.approvalErr">
                  <el-upload
                    class="upload-demo"
                    ref="upload1"
                    action="http://192.168.10.181:10002/file/uploadFileList"
                    :on-preview="handlePreview"
                    :on-remove="handleRemove"
                    :on-change="(file, fileList) => {return handleChange(file, fileList, '立项支撑文件')}" 
                    :file-list="approvalList"
                    :auto-upload="false"
                    :show-file-list="false"
                    v-if="!info.readonly">
                    <el-button slot="trigger" v-for="(item, index) in approvalBtns" :key="index" @click="selectFile(item)" v-show="!info.readonly"><i class="el-icon-plus" style="marginRight:10px;"></i>{{item.value}}</el-button>
                  </el-upload>
                  <div class="uploadList" v-if="approvalList && approvalList.length > 0">
                    <ul>
                      <li v-for="(item, index) in approvalList" :key="`file${index}`">
                        <span>
                          <span :class="[`color${findTagColor(item, 'approvalBtns')}`,`bgColor${findTagColor(item, 'approvalBtns')}`]">{{item.tag}}</span>
                        </span>
                        <span>{{item.name}}</span>
                        <span><label v-format="'0.#0'">{{item.fileSize/1024/1024}}</label>MB</span>
                        <span v-if="!info.readonly">
                          <i class="el-icon-close" @click="fileDel(item, approvalList, 'collapse1', 1)"></i>
                        </span>
                        <span v-else class="yfFont icon-xiazai" @click="download(item)"></span> 
                      </li>
                    </ul>
                  </div>
                </el-form-item>
              </p>
            </el-form>
          </div>
        </YfCollapse>
        <div class="btns" v-if="!info.readonly">
          <el-button @click="cencel()" plain>取消</el-button>
          <el-button plain @click="temporaryStorage()">保存草稿</el-button>
          <el-popconfirm
            confirm-button-text='确认'
            cancel-button-text='取消'
            icon="el-icon-info"
            icon-color="red"
            title="确认提交审核吗？"
            @confirm="submitForm()"
          >
            <el-button type="primary" slot="reference">提交审核</el-button>
          </el-popconfirm>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {mapGetters} from 'vuex'
export default {
  data() {
    return {
      tag: '',
      code: '',
      tagMapColor: [], //tag颜色映射表
      approvalList: [],//项目立项页面的上传列表
      approvalBtns: [],  //项目立项上传按钮
      proSetUpForm: { //项目立项表单
        proSetUpPlant: 1,
        proSetUpActivityName: '',
        proSetUpProjectType: '',
        proSetUpBudgetCode: '',
        proSetUpMoney: '',
        proSetUpCheck: false,
        proSetUpTime: this.$moment().format('yyyy-MM-DD HH:mm:ss'),
        proSetUpPurchasingMethod: '',
        plantResidue: '0',
        totalResidue: '0',
      }, 
      deptPlantList: [],
      ProjectType: [],
      budgetCodeList: [],
      purchasingMethod: [],
      info: {},
      fileErrList: {
        approvalErr: '',
      },
      delList: {},
      rules: {  //表单校验
        proSetUpPlant: [
          { required: true, message: '请选择一种所属场站', trigger: 'change' }
        ],
        proSetUpActivityName: [
          { required: true, message: '请输入活动名称', trigger: 'blur' },
          { max: 50, message: '最多输入 50 个字符', trigger: 'change' }
        ],
        proSetUpProjectType: [
          { required: true, message: '请选择一种项目类型', trigger: 'change' }
        ],
        proSetUpBudgetCode: [
          { required: true, message: '请选择一种预算科目', trigger: 'change' }
        ],
        proSetUpMoney: [
          { required: true, message: '请输入预算金额', trigger: 'change' }
        ],
        proSetUpTime: [
          { required: true, message: '请输入计划采购时间', trigger: 'change' }
        ],
        proSetUpPurchasingMethod: [
          { required: true, message: '请选择一种采购方式', trigger: 'change' }
        ],
      },
    }
  },
  computed: {
    findTagColor () {
      return function (val, btns) {
        const item = this[btns].find(row => row.value === val.tag)
        return item.id%10 < 7 ? item.id%10 + 1 : 1
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
      this.deptPlantList = this.info?.deptPlantList
      this.ProjectType = this.info?.ProjectType
      this.budgetCodeList = this.info?.budgetCodeList
      this.purchasingMethod = this.info?.purchasingMethod
      this.approvalBtns = this.info?.approvalBtns
      this.projectEdit = this.info?.plan
      this.files = this.info?.plan?.files
      if (this.projectEdit) { //项目立项需要显示的信息
        this.proSetUpForm.projectId = this.projectEdit.id
        this.proSetUpForm.proSetUpPlant = this.projectEdit.plantId
        this.proSetUpForm.proSetUpActivityName = this.projectEdit.tenderName
        this.proSetUpForm.proSetUpProjectType = this.projectEdit.projectType
        this.proSetUpForm.proSetUpBudgetCode = this.projectEdit.budgetCode
        this.proSetUpForm.proSetUpMoney = this.projectEdit.budget
        this.proSetUpForm.proSetUpCheck = this.projectEdit.budgetCheck
        this.proSetUpForm.proSetUpTime = this.projectEdit.planPurchasingTime
        this.proSetUpForm.proSetUpPurchasingMethod = this.projectEdit.purchasingMethod
      }
      console.log(this.proSetUpForm); 
      if (this.files) {
        this.approvalList = this.files
        this.approvalList.map(val => {
          val.name = val.fileName
          val.tag = val.fileCodeName
        })
      }
    },
    handleRemove(file, fileList) {  //文件列表移除文件时的钩子
      console.log(file, fileList);
    },
    handlePreview(file) {   //点击文件列表中已上传的文件时的钩子
      console.log(file);
    },
    selectFile (item) { //选择文件完毕等待上传
      this.tag = item.value   //给文件打上tag，如‘可行性研究报告’
      this.code = item.id 
    },
    handleChange (file, fileList) {
      this.approvalList = fileList
      file.tag = this.tag
      file.code = this.code
      file.fileSize = file.size
      this.$nextTick(()=>{  //页面发生改变时，触发收缩面板重新计算高度
        this.$refs.collapse.settingDefaultShow()
      })
    },
    budgetary () {},
    submitForm () {
      let loser = false
      const formDatas = new FormData();
      const uploadFile = this.$http.upload(`/file/uploadFileList?date=${this.$moment().format('yyyy-MM-DD')}&type=3`, formDatas)
      // 表单校验
      this.fileErrList.approvalErr = this.approvalList.length > 0?'':'请选择1个或以上立项支撑文件'
      this.$refs.proSetUpForm.validate((valid) => {
        if (valid && this.approvalList.length > 0) {
          // alert('submit!');
        } else {
          console.log('error submit!!');
          loser = true
          return false;
        }
      });
      if (loser) return
      let list = []
      this.approvalList.forEach((val)=>{
        if(val.raw){
          formDatas.append("file", val.raw);
          list.push({
            fileCode: val.code,
            fileName: val.name,
            fileSize: val.size,
          })
        }      
      });
      Promise.all([uploadFile, this.$http.fetch(`/project/yearProjectEdit`, {
        "budget": this.proSetUpForm.proSetUpMoney,
        "budgetCheck": this.proSetUpForm.proSetUpCheck,
        "budgetCode": this.proSetUpForm.proSetUpBudgetCode,
        "delFileUri": Object.keys(this.delList).length > 0 ? this.delList : undefined,
        "isAudit": true,
        "planPurchasingTime": this.proSetUpForm.proSetUpTime,
        "plantId": this.proSetUpForm.proSetUpPlant,
        "projectId": this.proSetUpForm?.projectId, 
        "projectType": this.proSetUpForm.proSetUpProjectType,
        "purchasingMethod": this.proSetUpForm.proSetUpPurchasingMethod,
        "status": this.projectEdit?.projectStatus,
        "tenderName": this.proSetUpForm.proSetUpActivityName
      })]).then(result => {
        list.map((val, index) => {
          val.fileUrl = result[0].data[index]
          val.projectId = result[1].data
        })
        this.$http.fetch(`/file/saveFileList`, list).then(res => {
          if (res.code === 0) {
            this.$router.push('/expendManagement/purchase')
          }
        })
      }).catch (error => {
        console.log(error)
      })
    },
    temporaryStorage () {
      let loser = false
      const formDatas = new FormData();
      const uploadFile = this.$http.upload(`/file/uploadFileList?date=${this.$moment().format('yyyy-MM-DD')}&type=3`, formDatas)
      let list = []
      this.approvalList.forEach((val)=>{
        if(val.raw){
          formDatas.append("file", val.raw);
          list.push({
            fileCode: val.code,
            fileName: val.name,
            fileSize: val.size,
          })
        }      
      });
      Promise.all([uploadFile, this.$http.fetch(`/project/yearProjectEdit`, {
        "budget": this.proSetUpForm.proSetUpMoney,
        "budgetCheck": this.proSetUpForm.proSetUpCheck,
        "budgetCode": this.proSetUpForm.proSetUpBudgetCode,
        "delFileUri": Object.keys(this.delList).length > 0 ? this.delList : undefined,
        "isAudit": false,
        "planPurchasingTime": this.proSetUpForm.proSetUpTime,
        "plantId": this.proSetUpForm.proSetUpPlant,
        "projectId": this.proSetUpForm?.projectId, 
        "projectType": this.proSetUpForm.proSetUpProjectType,
        "purchasingMethod": this.proSetUpForm.proSetUpPurchasingMethod,
        "status": this.projectEdit?.projectStatus,
        "tenderName": this.proSetUpForm.proSetUpActivityName
      })]).then(result => {
        list.map((val, index) => {
          val.fileUrl = result[0].data[index]
          val.projectId = result[1].data
        })
        this.$http.fetch(`/file/saveFileList`, list).then(res => {
          if (res.code === 0) {
            this.$router.push('/expendManagement/purchase')
          }
        })
      }).catch (error => {
        console.log(error)
      })
    },
    cencel () {
      this.$router.push('/expendManagement/purchase')
    },
    fileDel (file, fileList, coll, fileNum) {
      const exist = this.files?.[fileNum]?.find(val => val.fileCode === file.fileCode && val.fileName === file.fileName)
      if (exist) this.delList[exist.id] = exist.fileUrl
      // 删除时判断是否是数据库来的数据，是数据库来的就记录一下
      const index = fileList.findIndex(val => {
        return val.uid === file.uid
      })
      fileList.splice(index, 1)
      this.$nextTick(()=>{  //页面发生改变时，触发收缩面板重新计算高度
        this.$refs[coll].settingDefaultShow()
      })
    },
  }
}
</script>

<style lang="less" scoped>
.purchaseNewPlan {
  width: 100%;
  height: 100%;
  .header {
    min-height: 64px;
    line-height: 64px;
    font-size: 16px;
    margin-top: 10px;
    padding-left: 22px;
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
    max-height: calc(100% - 64px - 74px - 96px);
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
        > button:nth-of-type(2) {
          margin: 0 10px;
        }
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
}
</style>