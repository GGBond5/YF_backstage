<!-- 督办单发起列表  计划督办单发起 -->
<template>
  <div class="supervision flex-column">
    <YfDetailsHeader :path="formRoute" isQuery :title="procCategoryId?(procCategoryId==20?'批准开工许可':'编辑督办单'):'创建督办单'" print @handlePrint="handlePrint"></YfDetailsHeader>
    <div style="width: 100%; height: 10px; background: #fafafa;overflow: hidden;"></div>
    <div class="flex-1 content flex-column" v-loading="loadingImg" element-loading-text="附件上传中，请不要关闭页面~" element-loading-background="rgba(0, 0, 0, 0.7)">
      <div class="contentTop flex-vCenter">
        <i class="yfFont icon-biaotiqian"></i>
        <h4>风机{{typeName[superviseType]}}督办单详情</h4>
        <div class="flex-1"></div>
        <a class="rightBtn flex-center" v-if="!superviseId" @click="copySupervise()">
          <i class="yfFont icon-conglishifuzhi"></i>
          <span>从历史{{typeName[superviseType]}}督办单复制</span>
        </a>
        <!-- <a class="rightBtn flex-center" v-if="!superviseId" @click="addSupervises()">
          <i class="yfFont icon-piliangshengcheng"></i>
          <span>批量生成督办单</span>
        </a> -->
      </div>
      <div class="flex-1 scrollWrap" style="overflow: auto;"  v-loading="loading" element-loading-background="rgba(0, 0, 0, 0)">
        <YfCollapse title="基础信息"  style="padding: 0 15px 0 7px;" ref="collapse1">
          <baseForm ref="baseForm" :superviseType="superviseType" :procCategoryId="procCategoryId" :prosessCode="1" :formDataOld="baseFormData" @resize="resize"></baseForm>
        </YfCollapse>
      </div>
      <div class="contentBottom flex-center" v-if="procCategoryId!=20">
        <a class="rightBtn flex-center" @click="save(0)">
          <span>保存为草稿</span>
        </a>
        <a class="rightBtn primary flex-center" @click="save(1)">
          <span>申请开工许可</span>
        </a>
      </div>
      <div class="contentBottomForm flex-column" v-if="procCategoryId==20">
        <div class="formWrap flex-column">
          <el-form class="formInDispose" :model="formData" label-suffix=":" label-width="88px" label-position="left">
            <el-form-item label="处理结果" prop="approvalResult">
              <el-radio-group v-model="formData.approvalResult">
                <el-radio :label="1">批准开工许可</el-radio>
                <el-radio :label="2">不批准</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="意见或建议">
              <el-input type="textarea" :rows="3" :maxlength="50" placeholder="请输入作业内容" v-model="formData.remark"></el-input>
            </el-form-item>
            <el-form-item class="flex-center">
              <a class="rightBtn flex-center" @click="approve(false)">
                <span>取消</span>
              </a>
              <a class="rightBtn primary flex-center" @click="approve(true)">
                <span>提交</span>
              </a>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </div>
    <el-backtop target=".scrollWrap" :visibility-height="50" :right="20" :bottom="procCategoryId==20?250:110"></el-backtop>
    <el-dialog :title="`历史${typeName[superviseType]}任务列表`" :visible.sync="showMenu2" :close-on-click-modal="false" custom-class="isTitleDialog">
      <div class="formWrap flex-column">
        <YfSearch tActive="nearMonth" :time="time" @confirm="submit" layout="timeShortcuts,timeRange,keywords,submit"></YfSearch>
        <div class="tableWrap flex-1" style="width: 100%;">
          <el-table ref="workContent" :data="superviseOldList" border style="width: 100%;" height="100%" size="small">
            <!-- <el-table-column type="selection" width="40"></el-table-column> -->
            <el-table-column type="index" label="序号" width="50"></el-table-column>
            <el-table-column prop="content" label="工作内容" show-overflow-tooltip :formatter="function(row, column, cellValue){return cellValue||'-'}"></el-table-column>
            <el-table-column prop="planStartTime" label="计划开工时间" width="110"></el-table-column>
            <el-table-column prop="realStartTime" label="实际开工时间" width="180" :formatter="function(row, column, cellValue){return cellValue||'-'}"></el-table-column>
            <el-table-column prop="receiveTime" label="验收完成时间" width="180" :formatter="function(row, column, cellValue){return cellValue||'-'}"></el-table-column>
            <el-table-column prop="maintainerName" label="检修人" width="100" :formatter="function(row, column, cellValue){return cellValue||'-'}"></el-table-column>
            <el-table-column prop="supvProcStatusName" label="督办单状态" width="140">
              <template slot-scope="scope">
                <div class="flex-center color3" v-if="scope.row.supvProcStatus==1">
                  <span>待开工许可</span>
                </div>
                <div class="flex-center color3" v-if="scope.row.supvProcStatus==2">
                  <span>开工许可申请中</span>
                </div>
                <div class="flex-center color3" v-if="scope.row.supvProcStatus==3">
                  <span>开工许可不通过</span>
                </div>
                <div class="flex-center color1" v-if="scope.row.supvProcStatus==4">
                  <span>未开工</span>
                </div>
                <div class="flex-center color4" v-if="scope.row.supvProcStatus==5">
                  <span>处理中</span>
                </div>
                <div class="flex-center color4" v-if="scope.row.supvProcStatus==6">
                  <span>验收中</span>
                </div>
                <div class="flex-center color1" v-if="scope.row.supvProcStatus==7">
                  <span>验收不通过</span>
                </div>
                <div class="flex-center color4" v-if="scope.row.supvProcStatus==8">
                  <span>挂起中</span>
                </div>
                <div class="flex-center color5" v-if="scope.row.supvProcStatus==9">
                  <span>已处理</span>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="120">
              <template slot-scope="scope">
                <div class="flex-center blue">
                  <a @click="copy(scope.row)">复制</a>
                  <el-divider direction="vertical"></el-divider>
                  <a @click="goPage(scope.row)">详情</a>
                </div>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
      <div class="footer flex-center">
        <a class="rightBtn grey flex-center" @click="close()">
          <span>取消</span>
        </a>
        <a class="rightBtn primary flex-center" @click="saveCopy()">
          <span>确定</span>
        </a>
      </div>
    </el-dialog>
  </div>
</template>

<script>
// prosessCode 进度编码 1=>发起，派单，开工许可 2=>验收 3=>处理 4=>查看
// import {mapGetters} from 'vuex'
import baseForm from '@/views/overhaulSupervision/supervisionInitiate/baseForm.vue'
export default {
  components: { baseForm },
  data(){
    return {
      formRoute: window.sessionStorage.getItem('formRoute'),
      userInfo: JSON.parse(window.sessionStorage.getItem('userInfo')),
      plantId: null, // 风场id
      superviseCategory: null, // 设备类别编码
      superviseType: null, // 类型
      typeName: {
        2: '定检',
        3: '巡检',
        4: '维护',
        5: '技改',
        6: '临时任务'
      },
      procCategoryId: null, // 状态细分编码
      baseFormData: {
        "superviseCode": "",
        "content": "",
        "createAccount": JSON.parse(window.sessionStorage.getItem('userInfo')).userAccount,
        "deviceAddressId": null,
        "fileList": [],
        "isNeedStop": 1,
        "jobContent": "",
        "maintainerId": null,
        "planEndTime": "",
        "planStartTime": "",
        "planWorkList": [],
        "plantId": null,
        "procCategoryId": null,
        "superviseCategory": null,
        "supervisorDeptId": null,
        "supervisorId": null,
        "type": 0
      },
      formData: {
        approvalResult: 1,
        remark: '',
        superviseId: ''
      },
      loading: false,
      loadingImg: false,
      showMenu2: false,
      form: {},
      time: [this.$moment().subtract(1,'months').add(1,'days').format('YYYY-MM-DD'), this.$moment().format('YYYY-MM-DD')],
      superviseOldList: []
    }
  },
  computed: {
    // ...mapGetters(['formRoute'])
  },
  created(){
    // console.log(this.$route)
    this.superviseCategory = this.$route.query.superviseCategory || '' // 创建，通过督办单类别
    this.plantId = this.$route.query.plantId || ''
    this.superviseId = this.$route.query.superviseId || ''  // 编辑，查看，批准开工许可 通过督办单id查找
  },
  mounted(){
    this.getBaseInfo()
    // if(this.superviseId){
    //   this.getBaseInfo()
    // }
  },
  methods: {
    getBaseInfo: function(){
      if(this.plantId){ // 根据风场id和督办单类别获取设备信息
        let data = {
          plantId: this.plantId,
          superviseCategory: this.superviseCategory
        }
        this.$http.fetch(`supervise/querySuperviseCategoryForDetail`,data).then(res=>{
          if(res.code==0&&!this._isDestroyed){
            this.baseFormData = {...this.baseFormData,...res.data}
            this.superviseType = res.data.superviseType
            this.procCategoryId = res.data.procCategoryId
            // console.log(this.baseFormData)
          }
        })
      }
      if(this.superviseId){ // 根据督办单id获取详情
        this.$http.fetchGet(`supervise/querySuperviseById?superviseId=${this.superviseId}`).then(res=>{
          if(res.code==0&&!this._isDestroyed){
            this.baseFormData = {...res.data}
            this.superviseType = res.data.superviseType
            this.procCategoryId = res.data.procCategoryId
            this.formData.superviseId = res.data.superviseId
            console.log(this.baseFormData)
          }
        })
      }
    },
    // 点击菜单
    handlePrint: function(){
      console.log('打印')
      this.$message.info('该功能暂未开放！')
    },
    resize: function(param){
      // console.log(param)
      this.$refs[param].settingDefaultShow()
    },
    save: function(type){
      // console.log(type, this.$refs.baseForm.formData)
      if(type){
        this.$refs.baseForm.$refs.form1.validate((valid) => {
          if (valid) {
            let data = JSON.parse(JSON.stringify(this.$refs.baseForm.formData))
            data.type = type
            let fileList = [], pendingUpload = [], allFileList = this.$refs.baseForm.formData.fileList
            allFileList.forEach(item=>{
              if(item.fileId){
                fileList.push({ commonId: this.patrolId, fileType: 1, name: item.name, size: item.size, url: item.url })
              }else{
                pendingUpload.push({ commonId: this.patrolId, fileType: 1, name: item.name, size: item.size, url: item.url, file: item.raw })
              }
            })
            console.log(allFileList)
            if(pendingUpload.length>0){
              this.loadingImg = true
              let pendingUploadUrls = new FormData()
              pendingUpload.forEach(item=>{
                // pendingUploadUrls.push(item.file)
                pendingUploadUrls.append("file", item.file); // append增加数据
              })
              console.log(pendingUploadUrls)
              this.$http.upload(`supvFile/uploadSupvFile`,pendingUploadUrls).then(res=>{
                this.loadingImg = false
                if(res.code==0&&!this._isDestroyed){
                  res.data.forEach((item,index)=>{
                    fileList.push({...pendingUpload[index],url: item.fileUrl})
                  })
                  this.$message.success('附件上传成功！')
                  data.fileList = fileList
                  this.submitLast(data)
                }
              })
            }else{
              this.submitLast(data)
            }
          } else {
            return false;
          }
        });
      }else{
        let data = JSON.parse(JSON.stringify(this.$refs.baseForm.formData))
        data.type = type
        let fileList = [], pendingUpload = [], allFileList = this.$refs.baseForm.formData.fileList
        allFileList.forEach(item=>{
          if(item.fileId){
            fileList.push({ commonId: this.patrolId, fileType: 1, name: item.name, size: item.size, url: item.url })
          }else{
            pendingUpload.push({ commonId: this.patrolId, fileType: 1, name: item.name, size: item.size, url: item.url, file: item.raw })
          }
        })
        console.log(allFileList)
        if(pendingUpload.length>0){
          this.loadingImg = true
          let pendingUploadUrls = new FormData()
          pendingUpload.forEach(item=>{
            // pendingUploadUrls.push(item.file)
            pendingUploadUrls.append("file", item.file); // append增加数据
          })
          console.log(pendingUploadUrls)
          this.$http.upload(`supvFile/uploadSupvFile`,pendingUploadUrls).then(res=>{
            this.loadingImg = false
            if(res.code==0&&!this._isDestroyed){
              res.data.forEach((item,index)=>{
                fileList.push({...pendingUpload[index],url: item.fileUrl})
              })
              this.$message.success('附件上传成功！')
              data.fileList = fileList
              this.submitLast(data)
            }
          })
        }else{
          this.submitLast(data)
        }
      }
    },
    submitLast: function(data){
      let url
      if(this.superviseId){
        if(this.superviseType ==6){
          url = `supervise/addTempSuperviseOrderAgain`
        }else{
          url = `supervise/addPlanSuperviseOrderAgain`
        }
      }else{
        if(this.superviseType ==6){
          url = `supervise/addTempSuperviseOrder`
        }else{
          url = `supervise/addPlanSuperviseOrder`
        }
      }
      this.loading = true
      this.$http.fetch(url,data).then(res=>{
        this.loading = false
        if(res.code==0&&!this._isDestroyed){
          this.$message.success('创建成功!')
          this.$router.go(-1)
        }
      })
    },
    // 开工许可
    approve: function(issure){
      if(issure){
        this.loading = true
        this.$http.fetch(`supvApproval/approvalSuperviseById`,this.formData).then(res=>{
          this.loading = false
          if(res.code==0&&!this._isDestroyed){
            this.$message.success('提交成功!')
            this.$router.go(-1)
          }
        })
      }else{
        this.$router.go(-1)
      }
    },
    // 复制督办单
    copySupervise: function(){
      this.$refs.baseForm.$refs.form1.validateField("deviceAddressId",(valid)=>{
        console.log(valid)
        if(!valid){
          this.showMenu2 = true
        }else{
          return false;
        }
      })
    },
    getOldSupervise: function(){
      let data = {
        currentPage: 1,
        deviceAddressId: this.$refs.baseForm.formData.deviceAddressId,
        endDate: this.form.etime,
        keyName: this.form.keywords,
        pageSize: 10000,
        startDate: this.form.stime,
        superviseCategory: this.baseFormData.superviseCategory
      }
      this.$http.fetch(`supervise/querySuperviseHistoryForCopy`,data).then(res=>{
        if(res.code==0&&!this._isDestroyed){
          this.superviseOldList = res.data.list
        }else{
          this.superviseOldList = []
        }
      })
    },
    submit: function(param){
      console.log(param)
      if(param){
        this.form = param
        this.getOldSupervise()
      }
    },
    copy: function(row){
      this.$http.fetchGet(`supervise/querySuperviseById?superviseId=${row.superviseId}`).then(res=>{
        if(res.code==0&&!this._isDestroyed){
          this.baseFormData = {
            "content": res.data.content,
            "createAccount": this.userInfo.userAccount,
            "deviceAddressId": res.data.deviceAddressId,
            "addressCode": res.data.addressCode,
            "fileList": res.data.fileList,
            "isNeedStop": res.data.isNeedStop,
            "jobContent": res.data.jobContent,
            "maintainerId": res.data.maintainerId,
            "planEndTime": res.data.planEndTime,
            "planStartTime": res.data.planStartTime,
            "planWorkList": res.data.planWorkList,
            "plantId": res.data.plantId,
            "superviseCategory": res.data.superviseCategory,
            "supervisorDeptId": res.data.supervisorDeptId,
            "supervisorId": res.data.supervisorId,
            "deviceTypeId": res.data.deviceTypeId,
            "deviceTypeName": res.data.deviceTypeName,
            "plantName": res.data.plantName,
            "superviseCategoryName": res.data.superviseCategoryName,
            "superviseType": res.data.superviseType,
            "superviseTypeName": res.data.superviseTypeName,
            "superviseCode": null,
            "type": 0
          }
          this.showMenu2 = false
        }
      })
    },
    goPage(){},
    close: function(){
      this.showMenu2 = false
    }
  }
}
</script>

<style scoped lang="less">
.statusWrap{
  font-size: 14px;color: #666;margin-left: 85px;
  .name{
    margin-right: 10px;
  }
  .status{
    height: 30px;width: 80px;border-radius: 3px;line-height: 30px;text-align: center;
  }
}
/deep/.isTitleDialog{
  left: 50%; right: auto; top: 50px; width: 1240px; margin-left: -620px; height: 620px;
  .el-dialog__header{
    display: block; padding: 10px 20px; border-bottom: 1px solid #e5e5e5;
    .el-dialog__title{
      font-size: 14px;font-weight: bold;
    }
  }
  .el-form{width: 100%;}
  .el-dialog__headerbtn{
    display: block; top: 15px;
  }
  .el-dialog__body{
    padding: 0; height: calc(100% - 45px);
    .formWrap{
       height: calc(100% - 80px); margin-bottom: 20px;
    }
  }
  .footer{
    padding-bottom: 20px;
  }
  .el-table{
    .el-table__placeholder{ display: none;}
  }
  
}
</style>