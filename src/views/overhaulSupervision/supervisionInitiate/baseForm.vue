<template>
  <div class="formWrap flex-column">
    <el-form ref="form1" class="formInline" :inline="true" :model="formData"  label-suffix=":" :rules="rules" :disabled="prosessCode!=1">
      <el-form-item label="督办单编号" prop="superviseCode">
        <el-input v-model="formData.superviseCode" placeholder="由系统自动生成" disabled></el-input>
      </el-form-item>
      <el-form-item label="督办单类型" prop="superviseTypeName">
        <el-input v-model="formData.superviseTypeName" placeholder="请输入" disabled></el-input>
      </el-form-item>
      <el-form-item label="督办单类别" prop="superviseCategoryName">
        <el-input v-model="formData.superviseCategoryName" placeholder="请输入" disabled></el-input>
      </el-form-item>
      <el-form-item label="场站名称" prop="plantName">
        <!-- <el-select v-model="formData.plantId" placeholder="请选择" disabled>
          <el-option :label="item.plantName" :value="item.plantId" v-for="item in plantList" :key="item.plantId"></el-option>
        </el-select> -->
        <el-input v-model="formData.plantName" placeholder="请输入" disabled></el-input>
      </el-form-item>
      <el-form-item label="设备类型" prop="deviceTypeName">
        <!-- <el-select v-model="formData.plantName" placeholder="请选择" disabled>
          <el-option label="区域一" value="shanghai"></el-option>
          <el-option label="区域二" value="beijing"></el-option>
        </el-select> -->
        <el-input v-model="formData.deviceTypeName" placeholder="请输入" disabled></el-input>
      </el-form-item>
      <el-form-item label="设备名称" prop="deviceAddressId">
        <!-- <el-input v-model="formData.plantName" placeholder="请输入" :disabled="procCategoryId==20||procCategoryId>=40"></el-input> -->
        <el-select v-model="formData.deviceAddressId" placeholder="请选择设备位置" :disabled="procCategoryId==20||procCategoryId>=40" @change="handleSelectAddress">
          <el-option :label="item.addressName" :value="item.deviceAddressId" v-for="item in deviceAddressList" :key="item.deviceAddressId"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="设备编码" prop="addressCode">
        <el-input v-model="formData.addressCode" placeholder="由设备位置带入" disabled></el-input>
      </el-form-item>
      <el-form-item label="计划开工时间" prop="planStartTime" v-if="superviseType>1">
        <el-date-picker type="date" placeholder="选择时间" v-model="formData.planStartTime" value-format="yyyy-MM-dd" :disabled="procCategoryId==20||procCategoryId>=40"></el-date-picker>
      </el-form-item>
      <el-form-item label="计划完工时间" prop="planEndTime" v-if="superviseType>1">
        <el-date-picker type="date" placeholder="选择时间" v-model="formData.planEndTime" value-format="yyyy-MM-dd" :disabled="procCategoryId==20||procCategoryId>=40"></el-date-picker>
      </el-form-item>
      <el-form-item label="负责人" prop="supervisorId">
        <el-select v-model="formData.supervisorId" placeholder="请选择" :disabled="procCategoryId==20||procCategoryId==42">
          <el-option :label="item.userName" :value="item.id" v-for="item in workerAll" :key="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="工作部门" prop="supervisorDeptId">
        <el-select v-model="formData.supervisorDeptId" placeholder="请选择" :disabled="procCategoryId==20||procCategoryId==42" @change="getDepartmentWorker">
          <el-option :label="item.departmentName" :value="item.id" v-for="item in departmentList" :key="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="检修人" prop="maintainerId">
        <el-select v-model="formData.maintainerId" placeholder="请选择" :disabled="procCategoryId==20||procCategoryId==42">
          <el-option :label="item.userName" :value="item.id" v-for="item in departmentWorker" :key="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="停机时间" v-if="superviseType==1">
        <el-input v-model="formData.user" disabled placeholder="默认停机时间"></el-input>
      </el-form-item>
      <el-form-item label="工作内容" prop="content" style="width: calc(66.7% - 20px);" v-if="superviseType>1">
        <el-input v-model="formData.content" placeholder="请输入" :disabled="procCategoryId==20||procCategoryId>=40"></el-input>
      </el-form-item>
      <el-form-item label="是否停机" prop="isNeedStop" v-if="superviseType>1">
        <el-radio-group v-model="formData.isNeedStop" :disabled="procCategoryId==20||procCategoryId>=40">
          <el-radio :label="1">是</el-radio>
          <el-radio :label="0">否</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="作业内容" style="width: 100%;" v-if="superviseType==2||superviseType==3||superviseType==4||superviseType==5">
        <el-table :data="planWorkList" border style="width: 100%;" size="medium" :span-method="arraySpanMethod">
          <el-table-column type="index" label="序号" width="55" v-if="!formData.supvProcStatus || formData.supvProcStatus==1 || formData.supvProcStatus==3">
            <template slot-scope="scope">
              <span v-if="scope.$index">{{scope.$index}}</span>
              <div class="flex-center blue" v-else style="width: 100%;" @click="showWorkListDialog">
                <i class="yfFont icon-tianjiazuoyeneirong"></i>
                <span style="cursor: pointer;">添加作业内容</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column type="index" label="序号" width="55" v-else></el-table-column>
          <el-table-column prop="addressName" label="设备部件" :formatter="function(row, column, cellValue){return cellValue||'-'}"></el-table-column>
          <el-table-column prop="position" label="检修部位" :formatter="function(row, column, cellValue){return cellValue||'-'}"></el-table-column>
          <el-table-column prop="content" label="检修内容" :formatter="function(row, column, cellValue){return cellValue||'-'}"></el-table-column>
          <el-table-column prop="standard" label="检修标准" :formatter="function(row, column, cellValue){return cellValue||'-'}"></el-table-column>
          <el-table-column prop="remark" label="备注">
            <template slot-scope="scope">
              <div class="tableEditWrap flex-center" v-if="(!formData.supvProcStatus || formData.supvProcStatus==1 || formData.supvProcStatus==3)&&editRemarkIndex!='remark'+scope.$index" @click.stop="showInput('remark',scope.$index)">
                <span class="textBox flex-1">{{scope.row.remark||'-'}}</span>
                <a class="blue yfFont icon-bianji" title="点击编辑"></a>
              </div>
              <span v-else>{{scope.row.remark||'-'}}</span>
              <el-input class="editInp" v-model="scope.row.remark"  v-if="(!formData.supvProcStatus || formData.supvProcStatus==1 || formData.supvProcStatus==3)&&editRemarkIndex=='remark'+scope.$index" v-focus
                @blur="hideInput(scope.row)"></el-input>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="100" v-if="!formData.supvProcStatus || formData.supvProcStatus==1 || formData.supvProcStatus==3">
            <template slot-scope="scope">
              <a class="blue" @click="delWork(scope.$index)">移除</a>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item label="作业内容" style="width:calc(66.7% - 20px);" v-if="superviseType==6" prop="jobContent">
        <el-input type="textarea" :rows="5" placeholder="请输入作业内容" v-model="formData.jobContent" :disabled="procCategoryId==20||procCategoryId>=40"></el-input>
      </el-form-item>
      <el-form-item label="附件" style="width: calc(66.7% - 20px);" v-if="superviseType>1">
        <YfUploadFile :imgListOld="formData.fileList" :idEdit="prosessCode==1" @delFile="delFile" @changeFile="changeFile"></YfUploadFile>
      </el-form-item>
    </el-form>
    <el-dialog title="添加作业内容" :visible.sync="showMenu" :close-on-click-modal="false" custom-class="isTitleDialog">
      <div class="formWrap flex-column">
        <YfSearch @confirm="submit" layout="workingType,workingPeriod,keywords,submit"></YfSearch>
        <div class="tableWrap flex-1" style="width: 100%;">
          <el-table ref="workContent" :data="planWorkListAll" border style="width: 100%;" height="100%" size="small" row-key="treeCode" :indent="0" @row-click="selectionChange">
            <!-- <el-table-column type="selection" width="40"></el-table-column> -->
            <el-table-column prop="index" label="序号" width="50">
              <template slot-scope="scope">
                <div class="flex-center" v-if="!scope.row.children || scope.row.children.length==0">
                  <el-checkbox v-model="scope.row.selection" @click.native.stop="function(){}"></el-checkbox>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="planTaskTypeName" label="工作类型" width="130" :formatter="function(row, column, cellValue){return cellValue||'-'}"></el-table-column>
            <el-table-column prop="periodName" label="工作周期" width="100" :formatter="function(row, column, cellValue){return cellValue||'-'}">
              <!-- <template slot-scope="scope">{{scope.row.children && scope.row.children.length>0 ? scope.row.periodName : ''}}</template> -->
            </el-table-column>
            <el-table-column prop="devicePartTypeName" label="设备部件" width="100" :formatter="function(row, column, cellValue){return cellValue||'-'}"></el-table-column>
            <el-table-column prop="position" label="检修部位" width="100" :formatter="function(row, column, cellValue){return cellValue||'-'}"></el-table-column>
            <el-table-column prop="content" label="检修内容" show-overflow-tooltip :formatter="function(row, column, cellValue){return cellValue||'-'}"></el-table-column>
            <el-table-column prop="standard" label="检修标准" width="120" :formatter="function(row, column, cellValue){return cellValue||'-'}"></el-table-column>
            <el-table-column prop="remark" label="备注" show-overflow-tooltip :formatter="function(row, column, cellValue){return cellValue||'-'}"></el-table-column>
          </el-table>
        </div>
      </div>
      <div class="footer flex-center">
        <a class="rightBtn grey flex-center" @click="close()">
          <span>取消</span>
        </a>
        <a class="rightBtn primary flex-center" @click="saveWork()">
          <span>确定</span>
        </a>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  directives: {
    // 注册一个局部的自定义指令 v-focus
    focus: {
      // 指令的定义
      inserted: function (el) {
        // 聚焦元素
        el.querySelector('input').focus()
      }
    }
  },
  data(){
    return {
      formData: JSON.parse(JSON.stringify(this.formDataOld)),
      rules: {
        deviceAddressId: [
          { required: true, message: '请选择设备位置', trigger: 'change' },
        ],
        planStartTime: [
          { required: true, message: '请选择计划开工时间', trigger: 'change' }
        ],
        planEndTime: [
          { required: true, message: '请选择计划完工时间', trigger: 'change' }
        ],
        supervisorId: [
          { required: true, message: '请选择负责人', trigger: 'change' }
        ],
        supervisorDeptId: [
          { required: true, message: '请选择工作部门', trigger: 'change' }
        ],
        content: [
          { required: true, message: '请填写工作内容', trigger: 'blur' }
        ],
        maintainerId: [
          { required: false, message: '请选择检修人', trigger: 'change' }
        ]
      },
      // plantList: [],
      fileList: [],
      planWorkList: [{}], // 作业内容列表
      planWorkListAll: [], // 弹窗所有作业内容
      workerAll: [], // 所有人员
      departmentList: [], // 部门
      departmentWorker: [], // 部门所属人员
      deviceAddressList: [], // 设备位置列表
      showMenu: false, // 作业内容弹窗
      form: {
        "keywords": "",
        "workingPeriodCode": "",
        "workingTypeCode": ""
      }, // 作业内容检索表单
      oldSelectWork: {}, // 父页面工作内容
      editRemarkIndex: ''
    }
  },
  props: {
    superviseType: { type: [Number, String], default: 1 }, // 督办单类型
    prosessCode: { type: Number, default: 4 },
    procCategoryId: [Number, String],
    formDataOld: Object
  },
  watch: {
    formDataOld: {
      deep: true,
      immediate:true,
      handler: function(value){
        if(value && Object.keys(value).length>0){
          this.init()
        }
      }
    },
    procCategoryId: {
      immediate:true,
      handler: function(value){
        if(value>40){
          this.rules.maintainerId[0].required = true
          this.$nextTick(()=>{
            this.$refs.form1.resetFields();
            this.init()
          })
        }
      }
    }
  },
  created(){
  },
  mounted(){
  },
  methods: {
    init: function(){
      this.formData = JSON.parse(JSON.stringify(this.formDataOld))
      if(this.formData.plantId){
        // this.getPlant()
        this.getWorkAll()
        this.getDepartment()
        this.getDeviceAddress()
      }
      if(this.formData.supervisorDeptId){
        this.getDepartmentWorker()
      }
      // 新建督办单，草稿督办单，驳回督办单作业内容可以编辑，新增首行编辑按钮
      if(!this.formData.supvProcStatus || this.formData.supvProcStatus==1 || this.formData.supvProcStatus==3){
        this.planWorkList = [{},...this.formData.planWorkList]
      }else{
        this.planWorkList = [...this.formData.planWorkList]
      }
      this.$nextTick(()=>{
        this.$emit('resize','collapse1') // 数据改变重新计算父组件高度
      })
    },
    arraySpanMethod: function({ rowIndex, columnIndex }){
      if (rowIndex === 0 && (!this.formData.supvProcStatus || this.formData.supvProcStatus==1 || this.formData.supvProcStatus==3)) {
        if (columnIndex === 0) {
          return [1, 7];
        } else{
          return [0, 0];
        }
      }
    },
    // getPlant: function(){
    //   this.$http.fetchGet(`supvApproval/queryPlantAll`).then(res=>{
    //     if(res.code==0&&!this._isDestroyed){
    //       this.plantList = res.data
    //     }else{
    //       this.plantList = []
    //     }
    //   })
    // },
    // 获取所有人员
    getWorkAll: function(){
      this.$http.fetchGet(`supervise/queryUserAll`).then(res=>{
        if(res.code==0&&!this._isDestroyed){
          this.workerAll = res.data
        }else{
          this.workerAll = []
        }
      })
    },
    // 获取部门列表
    getDepartment: function(){
      this.$http.fetchGet(`supervise/queryDepartmentAll`).then(res=>{
        if(res.code==0&&!this._isDestroyed){
          this.departmentList = res.data
        }else{
          this.departmentList = []
        }
      })
    },
    // 获取部门所属人员列表
    getDepartmentWorker: function(){
      this.$http.fetchGet(`supervise/queryUserByDepartmentId?departmentId=${this.formData.supervisorDeptId}`).then(res=>{
        if(res.code==0&&!this._isDestroyed){
          this.departmentWorker = res.data
        }else{
          this.departmentWorker = []
        }
      })
    },
    // 获取所有设备位置列表
    getDeviceAddress: function(){
      this.$http.fetchGet(`supervise/queryDeviceNameByPlantIdAndAddressId?deviceTypeId=${this.formData.deviceTypeId}&plantId=${this.formData.plantId}`).then(res=>{
        if(res.code==0&&!this._isDestroyed){
          this.deviceAddressList = res.data
        }else{
          this.deviceAddressList = []
        }
      })
    },
    // 选择设备位置时获取设备编码
    handleSelectAddress: function(){
      let currentAddress = this.deviceAddressList.filter(item=>this.formData.deviceAddressId==item.deviceAddressId)
      if(currentAddress && currentAddress.length>0){
        this.formData.addressCode = currentAddress[0].addressCode
        this.getPlanTask()
      }
    },
    // 删除服务器文件
    delFile: function(param){
      console.log(param)
      let data = {
        "commonId": [this.formData.fileList[param.index].fileId],
        "fileType": 1
      }
      this.$http.fetch(`supvFile/deleteSupvFile`,data).then(res=>{
        if(res.code==0&&!this._isDestroyed){
          this.$message.success('删除成功！')
          this.formData.fileList.splice(param.index,1)
          this.$nextTick(()=>{
            this.$emit('resize','collapse1') // 数据改变重新计算父组件高度
          })
        }
      })
    },
    changeFile: function(param){
      console.log(param,this.formData)
      this.formData.fileList = param.files
      this.$nextTick(()=>{
        this.$emit('resize','collapse1') // 数据改变重新计算父组件高度
      })
    },
    // 显示添加作业弹窗 已经有的要选中并且复制备注
    showWorkListDialog: function(){
      if(!this.formData.deviceAddressId){
        this.$message.error('请先选择设备位置!')
        return
      }
      let _work = {}
      this.planWorkList.forEach(item=>{
        _work[item.deviceAddressId] = item
      })
      this.oldSelectWork = _work
      console.log(this.oldSelectWork)
      this.addHasChildren(this.planWorkListAll)
      this.showMenu = true
    },
    submit: function(param){
      if(param){
        this.form = {...param}
        this.getPlanTask()
      }
    },
    // 获取所有计划任务/作业内容
    getPlanTask: function(){
      let data = {
        "deviceAddressId": this.formData.deviceAddressId,
        "deviceTypeId": this.formData.deviceTypeId,
        "keyName": this.form.keywords,
        "periodId": this.form.workingPeriodCode,
        "planTaskTypeId": this.form.workingTypeCode,
        "superviseType": this.formData.superviseType
      }
      this.$http.fetch(`planTask/queryVPlanTaskByCondition`,data).then(res=>{
        if(res.code==0&&!this._isDestroyed){
          this.addHasChildren(res.data)
          this.planWorkListAll = res.data
        }else{
          this.planWorkListAll = []
        }
      })
    },
    addHasChildren: function(data){
      data.forEach(item=>{
        // item.hasChildren = false
        if(item.children && item.children.length>0){
          this.addHasChildren(item.children)
        }else{
          item.selection = this.oldSelectWork[item.deviceAddressId]?true: false
          item.remark = this.oldSelectWork[item.deviceAddressId]?this.oldSelectWork[item.deviceAddressId].remark: item.remark
        }
      })
    },
    selectionChange: function(row){
      console.log(row)
      if(row.children && row.children.length>0){
        this.$refs.workContent.toggleRowExpansion(row)
      }else{
        row.selection = !row.selection
      }
    },
    // 编辑备注
    showInput: function(rowName,index){
      this.editRemarkIndex = rowName+index
    },
    hideInput: function(){
      this.editRemarkIndex = null
    },
    close: function(){
      this.showMenu = false
    },
    saveWork: function(){
      let _workList = []
      this.planWorkListAll.forEach(planWork=>{
        if(planWork.children&&planWork.children.length>0){
          planWork.children.forEach(item=>{
            if(item.selection){
              _workList.push(item)
            }
          })
        }else{
          if(planWork.selection){
            _workList.push(planWork)
          }
        }
      })
      this.planWorkList = [{},..._workList]
      this.formData.planWorkList = [..._workList]
      console.log(this.planWorkList)
      this.showMenu = false
      this.$nextTick(()=>{
        this.$emit('resize','collapse1') // 数据改变重新计算父组件高度
      })
    },
    delWork: function(index){
      this.planWorkList.splice(index,1)
      this.formData.planWorkList.splice(index-1,1)
    }
  }
}
</script>

<style scoped lang="less">
.formWrap{
  width: 100%;
  .formInline{
    display: flex; flex-wrap: wrap;
    /deep/ .el-form-item{
      width: calc(33.3% - 20px); margin-right: 20px; display: flex;
      label{
        min-width: 90px;text-align: left;
      }
      .el-form-item__content{
        flex: 1;
        .el-select{
          width: 100%;
        }
        .el-input{
          width: 100%;
        }
        .el-table{
          line-height: 23px;
          /deep/ .tableEditWrap{
            width: 100%;padding: 0 20px;
            .textBox{
              padding-right: 10px;
            }
            .icon-bianji{
              font-size: 18px;position: absolute;
            }
          }
        }
        .el-upload{
          .icon-fujian{margin-top: 1px;margin-right: 5px;}
        }
        .el-upload-list{
          .el-upload-list__item:first-child{margin-top: 0;}
          .el-upload-list__item{background-color:#f5f7fa}
        }
      }
    }
  }
}
/deep/.isTitleDialog{
  left: 50%; right: auto; top: 50px; width: 1120px; margin-left: -560px; height: 620px;
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