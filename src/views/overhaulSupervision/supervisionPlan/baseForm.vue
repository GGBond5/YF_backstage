<template>
  <div class="formWrap flex-column">
    <el-form class="formInline" ref="form1" :inline="true" :model="formData"  label-suffix=":" :rules="rules">
      <el-form-item label="场站名称" prop="plantName">
        <el-input v-model="formData.plantName" placeholder="请输入" disabled></el-input>
      </el-form-item>
      <el-form-item label="计划分类" prop="superviseCategoryName">
        <el-input v-model="formData.superviseCategoryName" placeholder="请输入" disabled></el-input>
      </el-form-item>
      <el-form-item label="设备类型" prop="deviceTypeName">
        <el-input v-model="formData.deviceTypeName" placeholder="请输入" disabled></el-input>
      </el-form-item>
      <el-form-item label="设备名称" prop="deviceAddressIds">
        <el-select v-model="formData.deviceAddressIds" multiple collapse-tags placeholder="请选择设备位置">
          <el-option :label="item.addressName" :value="item.deviceAddressId" v-for="item in deviceAddressList" :key="item.deviceAddressId"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="负责人" prop="supervisorId">
        <el-select v-model="formData.supervisorId" placeholder="请选择">
          <el-option :label="item.userName" :value="item.id" v-for="item in workerAll" :key="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="工作部门" prop="supervisorDeptId">
        <el-select v-model="formData.supervisorDeptId" placeholder="请选择">
          <el-option :label="item.departmentName" :value="item.id" v-for="item in departmentList" :key="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="计划周期" prop="planCycleType">
        <el-select v-model="formData.planCycleType" placeholder="请选择">
          <el-option :label="item.name" :value="item.id" v-for="item in planCycleList" :key="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item prop="planCycleNum">
        <el-input v-model="formData.planCycleNum" type="number" placeholder="请输入">
          <template slot="prepend">每</template>
          <template slot="append">{{planCycleText[formData.planCycleType]||'天'}}</template>
        </el-input>
      </el-form-item>
      <el-form-item label="计划天数" prop="planDays">
        <el-input v-model="formData.planDays" type="number" placeholder="请输入">
          <template slot="prepend">计划工作</template>
          <template slot="append">天</template>
        </el-input>
      </el-form-item>
      <el-form-item label="督办单生成时间" prop="generatedDay">
        <el-input v-model="formData.generatedDay" type="number" placeholder="请输入">
          <template slot="prepend">提前</template>
          <template slot="append">天</template>
        </el-input>
      </el-form-item>
      <el-form-item label="工作内容" prop="content" style="width: calc(66.7% - 20px);">
        <el-input v-model="formData.content" maxlength="50" placeholder="请输入"></el-input>
      </el-form-item>
      <el-form-item label="是否停机" prop="isNeedStop">
        <el-radio-group v-model="formData.isNeedStop">
          <el-radio :label="true">是</el-radio>
          <el-radio :label="false">否</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="作业内容" style="width: 100%;" >
        <el-table :data="planWorkList" border style="width: 100%;" size="medium" :span-method="arraySpanMethod">
          <el-table-column type="index" label="序号" width="55">
            <template slot-scope="scope">
              <span v-if="scope.$index">{{scope.$index}}</span>
              <div class="flex-center blue" v-else style="width: 100%;" @click="showWorkListDialog">
                <i class="yfFont icon-tianjiazuoyeneirong"></i>
                <span style="cursor: pointer;">添加作业内容</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="devicePartTypeName" label="设备部件"></el-table-column>
          <el-table-column prop="position" label="检修部位" show-overflow-tooltip></el-table-column>
          <el-table-column prop="content" label="检修内容" show-overflow-tooltip></el-table-column>
          <el-table-column prop="standard" label="检修标准" show-overflow-tooltip></el-table-column>
          <el-table-column prop="remark" label="备注" show-overflow-tooltip></el-table-column>
          <el-table-column label="操作" width="100">
            <template slot-scope="scope">
              <a class="blue" @click="delWork(scope.$index)">移除</a>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item label="附件" style="width: calc(66.7% - 20px);">
        <YfUploadFile :imgListOld="formData.fileList" idEdit @delFile="delFile" @changeFile="changeFile"></YfUploadFile>
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
            <el-table-column prop="planTaskTypeName" label="工作类型" width="130"></el-table-column>
            <el-table-column prop="periodName" label="工作周期" width="100">
              <!-- <template slot-scope="scope">{{scope.row.children && scope.row.children.length>0 ? scope.row.periodName : ''}}</template> -->
            </el-table-column>
            <el-table-column prop="devicePartTypeName" label="设备部件" width="100"></el-table-column>
            <el-table-column prop="position" label="检修部位" width="100"></el-table-column>
            <el-table-column prop="content" label="检修内容" show-overflow-tooltip></el-table-column>
            <el-table-column prop="standard" label="检修标准" width="120"></el-table-column>
            <el-table-column prop="remark" label="备注" show-overflow-tooltip></el-table-column>
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
    var isNum = (rule, value, callback) => {
      const age= /^\+?[1-9][0-9]*$/
      if (!age.test(value)) {
        callback(new Error('请输入正整数！'))
      }else{
        callback()
      }
    }
    return {
      formData: JSON.parse(JSON.stringify(this.formDataOld)),
      rules: {
        deviceAddressIds: [
          { required: true, message: '请选择设备位置', trigger: 'change' },
        ],
        planCycleType: [
          { required: true, message: '请选择计划周期类型', trigger: 'change' }
        ],
        planCycleNum: [
          { required: true, message: '请输入计划周期', trigger: 'blur' },
          { validator: isNum, trigger: 'blur' }
        ],
        planDays: [
          { required: true, message: '请输入计划工作天数', trigger: 'blur' },
          { validator: isNum, trigger: 'blur' }
        ],
        generatedDay: [
          { required: true, message: '请输入提前生成督办单时间', trigger: 'blur' },
          { validator: isNum, trigger: 'blur' }
        ],
        content: [
          { required: true, message: '请填写工作内容', trigger: 'blur' }
        ],
        isNeedStop: [
          { required: true, message: '请选择是否停机', trigger: 'change' }
        ]
      },
      planWorkList: [{}], // 作业内容列表
      planWorkListAll: [], // 弹窗所有作业内容
      workerAll: [], // 所有人员
      departmentList: [], // 部门
      departmentWorker: [], // 部门所属人员
      deviceAddressList: [], // 设备位置列表
      planCycleList: [{id: 1, name: '按日'},{id: 2, name: '按周'},{id: 3, name: '按月'},{id: 4, name: '按年'}],
      planCycleText: {1: '日', 2: '周', 3: '月', 4: '年'},
      showMenu: false, // 作业内容弹窗
      form: {
        "keywords": "",
        "workingPeriodCode": "",
        "workingTypeCode": ""
      }, // 作业内容检索表单
      oldSelectWorkId: [], // 父页面工作内容
    }
  },
  props: {
    formDataOld: Object
  },
  watch: {
    formDataOld: {
      deep: true,
      handler: function(value){
        console.log(value)
        if(value && Object.keys(value).length>0){
          this.init()
        }
      }
    },
  },
  created(){},
  methods: {
    init: function(){
      this.formData = JSON.parse(JSON.stringify(this.formDataOld))
      if(this.formData.plantId){
        // this.getPlant()
        this.getWorkAll()
        this.getDepartment()
        this.getDeviceAddress()
      }
      // 新建督办单，草稿督办单，驳回督办单作业内容可以编辑，新增首行编辑按钮
      this.planWorkList = [{},...this.formData.planTaskPatrolVoList]
    },
    arraySpanMethod: function({ rowIndex, columnIndex }){
      if (rowIndex === 0) {
        if (columnIndex === 0) {
          return [1, 7];
        } else{
          return [0, 0];
        }
      }
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
    // 显示添加作业弹窗 已经有的要选中并且复制备注
    showWorkListDialog: function(){
      this.oldSelectWorkId = []
      this.planWorkList.forEach(item=>{
        this.oldSelectWorkId.push(item.planTaskId)
      })
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
        "deviceTypeId": this.formData.deviceTypeId,
        "keyName": this.form.keywords,
        "periodId": this.form.workingPeriodCode,
        "planTaskTypeId": this.form.workingTypeCode,
        "superviseType": this.formData.superviseType
      }
      this.$http.fetch(`patrol/queryPlanTaskByDeviceTypeId`,data).then(res=>{
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
          item.selection = this.oldSelectWorkId.includes(item.planTaskId)?true: false
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
    // 删除服务器文件
    delFile: function(param){
      console.log(param)
      let data = {
        "commonId": [this.formData.fileList[param.index].fileId],
        "fileType": 7
      }
      this.$http.fetch(`supvFile/deleteSupvFile`,data).then(res=>{
        if(res.code==0&&!this._isDestroyed){
          this.$message.success('删除成功！')
          this.formData.fileList.splice(param.index,1)
        }
      })
    },
    changeFile: function(param){
      console.log(param,this.formData)
      this.formData.fileList = param.files
    },
    close: function(){
      this.showMenu = false
    },
    saveWork: function(){
      let _workList = []
      this.planWorkListAll.forEach(item=>{
        if(item.selection){
          _workList.push(item)
        }
      })
      this.planWorkList = [{},..._workList]
      this.formData.planTaskPatrolVoList = [..._workList]
      console.log(this.planWorkList)
      this.showMenu = false
    },
    delWork: function(index){
      this.planWorkList.splice(index,1)
      this.formData.planTaskPatrolVoList.splice(index-1,1)
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
      &:nth-child(7){width: 11.1%; margin-right: 5px;}
      &:nth-child(8){width: calc(22.2% - 25px);}
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