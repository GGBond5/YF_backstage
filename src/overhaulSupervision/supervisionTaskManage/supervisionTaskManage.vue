<!-- 计划任务管理 -->
<template>
  <div class="supervision flex-column">
    <div class="planBtnWrap flex-vCenter">
      <a class="btnList flex-vCenter" @click="addPlan">
        <i class="icon yfFont icon-xinzeng"></i>
        <span>新增任务</span>
      </a>
      <!-- <a class="btnList flex-vCenter" @click="copyPlan">
        <i class="icon yfFont icon-fuzhi"></i>
        <span>复制任务</span>
      </a> -->
      <a class="btnList flex-vCenter" @click="delPlan()">
        <i class="icon yfFont icon-shanchu"></i>
        <span>删除任务</span>
      </a>
    </div>
    <div style="width: 100%; height: 10px; background: #fafafa;overflow: hidden;"></div>
    <YfSearch @confirm="submit" layout="orderType,orderCategory,workingType,workingPeriod,submit"></YfSearch>
    <TabularData>
      <el-table :data="tableData" border style="width: 100%;" size="medium" height="100%" @selection-change="selectionChange">
        <el-table-column type="selection" width="40"></el-table-column>
        <el-table-column type="index" label="序号" width="60"></el-table-column>
        <el-table-column prop="deviceTypeName" label="设备类型" width="140"></el-table-column>
        <el-table-column prop="superviseType" label="督办单类型" width="120">
          <template slot-scope="scope">
            <span class="tableCellBtn bgColor2 color2" v-if="scope.row.superviseType==2">定检</span>
            <span class="tableCellBtn bgColor3 color3" v-if="scope.row.superviseType==3">巡检</span>
            <span class="tableCellBtn bgColor4 color4" v-if="scope.row.superviseType==4">维护</span>
            <span class="tableCellBtn bgColor5 color5" v-if="scope.row.superviseType==5">技改</span>
          </template>
        </el-table-column>
        <el-table-column prop="planTaskTypeName" label="工作类型" width="140" show-overflow-tooltip></el-table-column>
        <el-table-column prop="periodName" label="工作周期" width="140" show-overflow-tooltip></el-table-column>
        <el-table-column prop="devicePartTypeName" label="设备部件" width="140" show-overflow-tooltip></el-table-column>
        <el-table-column prop="position" label="检修部位" width="140" show-overflow-tooltip></el-table-column>
        <el-table-column prop="content" label="检修内容" show-overflow-tooltip></el-table-column>
        <el-table-column prop="standard" label="检修标准" width="140" show-overflow-tooltip></el-table-column>
        <el-table-column prop="remark" label="备注" show-overflow-tooltip :formatter="function(row, column, cellValue){return cellValue||'-'}"></el-table-column>
        <el-table-column label="操作" width="120" align="center">
          <template slot-scope="scope">
            <div class="flex-center blue">
              <a @click="editPlan(scope.row)">修改</a>
              <el-divider direction="vertical"></el-divider>
              <a @click="delPlan(scope.row)">删除</a>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </TabularData>
    <el-dialog title="新增任务" :visible.sync="showMenu" custom-class="noTitleDialog">
      <div class="formWrap flex-column">
        <el-form ref="formWork" class="formInPlan" :model="formData" label-suffix=":" label-width="100px" label-position="left" :rules="rules">
          <el-form-item label="设备类型" prop="deviceTypeId">
            <el-select style="width: 100%;" v-model="formData.deviceTypeId" placeholder="请选择" @change="getDevicePartType(true)">
              <el-option v-for="item in optionsCategory" :key="item.deviceTypeId" :label="item.deviceTypeName" :value="item.deviceTypeId"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="督办单类型" prop="superviseType">
            <el-select style="width: 100%;" v-model="formData.superviseType" placeholder="请选择">
              <el-option v-for="item in optionsType" :key="item.superviseType" :label="item.superviseTypeName" :value="item.superviseType"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="工作类型" prop="planTaskTypeId">
            <el-select style="width: 100%;" filterable allow-create default-first-option :key="workTypeKey"
            v-model="formData.planTaskTypeId" @change="changeWork('Type')" @visible-change="hideOptionWorkType" placeholder="请选择或者输入类型标签">
              <el-option :label="item.planTaskTypeName" :value="item.planTaskTypeId" v-for="(item,index) in optionsWorkType" :key="item.planTaskTypeId">
                <span style="float: left;padding: 0 10px;" title="点击编辑该类型" @click.stop="showInp('Type',index,item.planTaskTypeName)" 
                v-if="editTypeIndex!=index">{{ item.planTaskTypeName }}<i class="el-icon-edit color2" style="margin-left: 5px;"></i></span>
                <el-input class="editInp" :minlength="1" v-model="newWorkType"  v-if="editTypeIndex==index" v-focus
                @click.native.stop="function(){}"
                @keyup.enter.native.stop="hideInp('Type',index,item.planTaskTypeId)"></el-input>
                <em style="float: left;padding: 0 10px;font-size: 12px;color: #aaa;" v-if="editTypeIndex==index">回车确认修改</em>
                <span class="icon yfFont icon-shanchu" style="float: right; color: #8492a6; font-size: 13px;padding: 0 6px;" title="点击删除该类型"
                @click.stop="delOptionWorkType(item.planTaskTypeId,index)"></span>
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="工作周期" prop="periodId">
            <el-select style="width: 100%;" filterable allow-create default-first-option :key="workTimeKey"
            v-model="formData.periodId" @change="changeWork('Time')" @visible-change="hideOptionWorkTime" placeholder="请选择或者输入类型标签">
              <el-option :label="item.periodName" :value="item.planTaskPeriodId" v-for="(item,index) in optionsWorkTime" :key="item.planTaskPeriodId">
                <span style="float: left;padding: 0 10px;" title="点击编辑该类型" @click.stop="showInp('Time',index,item.periodName)"
                 v-if="editTimeIndex!=index">{{ item.periodName }}<i class="el-icon-edit color2" style="margin-left: 5px;"></i></span>
                <el-input class="editInp" :minlength="1" v-model="newWorkTime"  v-if="editTimeIndex==index" v-focus
                @click.native.stop="function(){}"
                @keyup.enter.native.stop="hideInp('Time',index,item.planTaskPeriodId)"></el-input>
                <em style="float: left;padding: 0 10px;font-size: 12px;color: #aaa;" v-if="editTimeIndex==index">回车确认修改</em>
                <span class="icon yfFont icon-shanchu" style="float: right; color: #8492a6; font-size: 13px;padding: 0 6px;" title="点击删除该类型"
                @click.stop="delOptionWorkPeriod(item.planTaskPeriodId,index)"></span>
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="设备部件" prop="devicePartTypeId">
            <el-cascader style="width: 100%;" v-model="formData.devicePartTypeId" :options="optionsDevicePartType" :props="propsOption"></el-cascader>
          </el-form-item>
          <el-form-item label="检修部位" prop="position">
            <el-input placeholder="请输入" maxlength="50" v-model="formData.position"></el-input>
          </el-form-item>
          <el-form-item label="检修内容" prop="content">
            <el-input placeholder="请输入" maxlength="50" v-model="formData.content"></el-input>
          </el-form-item>
          <el-form-item label="检修标准" prop="standard">
            <el-input placeholder="请输入" maxlength="50" v-model="formData.standard"></el-input>
          </el-form-item>
          <el-form-item label="备注" prop="remark">
            <el-input placeholder="请输入" maxlength="50" v-model="formData.remark"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <div class="footer flex-center">
        <a class="rightBtn grey flex-center" @click="close()">
          <span>取消</span>
        </a>
        <a class="rightBtn flex-center" @click="save(true)" v-if="!formData.planTaskId">
          <span>保存并创建下一个</span>
        </a>
        <a class="rightBtn primary flex-center" @click="save(false)">
          <span>保存</span>
        </a>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import TabularData from '@/views/operatingIndex/tabularData/TabularData.vue'
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
  components: { TabularData },
  data(){
    return {
      userInfo: JSON.parse(window.sessionStorage.getItem('userInfo')),
      time: [this.$moment().subtract(1,'months').add(1,'days').format('YYYY-MM-DD'), this.$moment().format('YYYY-MM-DD')],
      form: {},
      tableData: [],
      selectionWork: [],
      showMenu: false,
      formData: {
        "content": "",
        "createAccount": "",
        "devicePartTypeId": "",
        "deviceTypeId": "",
        "periodId": "",
        "planTaskId": "",
        "planTaskTypeId": "",
        "position": "",
        "remark": "",
        "standard": "",
        "superviseType": ""
      },
      rules: {
        deviceTypeId: [
          { required: true, message: '请选择设备类型', trigger: 'change' },
        ],
        superviseType: [
          { required: true, message: '请选择督办单类型', trigger: 'change' },
        ],
        devicePartTypeId: [
          { required: true, message: '请选择设备部件', trigger: 'change' },
        ],
        position: [
          { required: true, message: '请输入检修部位', trigger: 'blur' },
        ],
        content: [
          { required: true, message: '请输入检修内容', trigger: 'blur' }
        ],
        standard: [
          { required: true, message: '请输入检修标准', trigger: 'blur' }
        ]
      },
      optionsCategory: [], // 督办单类型
      optionsType: [], // 设备类型
      optionsWorkType: [],
      workTypeKey: this.$moment().valueOf(),
      editTypeIndex: null,
      newWorkType: '',
      optionsWorkTime: [],
      workTimeKey: this.$moment().valueOf()+1,
      editTimeIndex: null,
      newWorkTime: '',
      propsOption: {
        expandTrigger: 'click',
        value: 'id',
        label: 'name',
        emitPath: false,
        checkStrictly: true
      },
      optionsDevicePartType: [],
      deviceTimeKey: this.$moment().valueOf()+2,
    }
  },
  created(){
    // this.$store.commit('set_formRoute', this.$route.path) // 记录历史路由
    window.sessionStorage.setItem('formRoute', JSON.stringify([{path:this.$route.path,query: {}}]));
  },
  methods: {
    submit: function(param){
      if(param){
        this.form = {...param}
        this.getTableData()
      }
    },
    getTableData: function(){
      let data = {
        "deviceTypeId": this.form.deviceTypeId,
        "keyName": this.form.keywords,
        "periodId": this.form.workingPeriodCode,
        "planTaskTypeId": this.form.workingTypeCode,
        "superviseType": this.form.superviseType
      }
      this.$http.fetch(`planTask/queryPlanTask`,data).then(res=>{
        if(res.code==0&&!this._isDestroyed){
          this.tableData = res.data
        }else{
          this.tableData = []
        }
      })
    },
    getOrderType: function(){ // 获取所有督办单类型
      this.$http.fetchGet(`planTask/querySuperviseTypeForPlanTask`).then(res=>{
        if(res.code==0&&!this._isDestroyed){
          this.optionsType = res.data
        }else{
          this.optionsType = []
        }
      })
    },
    getOrderCategory: function(){ // 获取所有设备类型
      this.$http.fetchGet(`planTask/queryDeviceTypeForPlanTask`).then(res=>{
        if(res.code==0&&!this._isDestroyed){
          this.optionsCategory = res.data
        }else{
          this.optionsCategory = []
        }
      })
    },
    getDevicePartType: function(isChange){ // 获取所有设备部件
      if(!this.formData.deviceTypeId){
        return
      }
      if(isChange){
        this.formData.devicePartTypeId = ''
      }
      this.$http.fetchGet(`planTask/queryDeviceTypeTreeForPlanTask?deviceTypeId=${this.formData.deviceTypeId}`).then(res=>{
        if(res.code==0&&!this._isDestroyed){
          this.optionsDevicePartType = res.data
        }else{
          this.optionsDevicePartType = []
        }
        this.deviceTimeKey = this.$moment().valueOf() + 2
      })
    },
    getTaskType: function(){ // 获取所有工作类型
      this.$http.fetchGet(`planTask/queryPlanTaskType`).then(res=>{
        if(res.code==0&&!this._isDestroyed){
          this.optionsWorkType = res.data
          this.workTypeKey = this.$moment().valueOf()
          this.optionsWorkType.forEach(item=>{
            if(this.formData.planTaskTypeId == item.planTaskTypeName){
              this.formData.planTaskTypeId = item.planTaskTypeId
            }
          })
        }else{
          this.optionsWorkType = []
        }
      })
    },
    // 新增工作类型
    addTaskType: function(){
      let data = {
        createAccount: this.userInfo.userAccount,
        planTaskTypeName: this.formData.planTaskTypeId
      }
      this.$http.fetch(`planTask/addPlanTaskType`,data).then(res=>{
        if(res.code==0&&!this._isDestroyed){
          this.getTaskType()
        }else{
          this.formData.planTaskTypeId = ""
        }
      })
    },
    // 删除工作类型
    delOptionWorkType: function(param,index){
      let data = {
        planTaskTypeId: param
      }
      this.$http.fetch(`planTask/deletePlanTaskType`,data).then(res=>{
        if(res.code==0&&!this._isDestroyed){
          if(this.formData.planTaskTypeId == param){
            this.formData.planTaskTypeId = ''
          }
          this.$message.success('删除成功!')
          // this.getTaskType()
          this.optionsWorkType.splice(index,1)
        }
      })
    },
    getTaskPeriod: function(){ // 获取所有工作周期
      this.$http.fetchGet(`planTask/queryPlanTaskPeriod`).then(res=>{
        if(res.code==0&&!this._isDestroyed){
          this.optionsWorkTime = res.data
          this.workTimeKey = this.$moment().valueOf()+1
          this.optionsWorkTime.forEach(item=>{
            if(this.formData.periodId == item.periodName){
              this.formData.periodId = item.planTaskPeriodId
            }
          })
        }else{
          this.optionsWorkTime = []
        }
      })
    },
    // 新增工作周期
    addTaskPeriod: function(){
      let data = {
        createAccount: this.userInfo.userAccount,
        periodName: this.formData.periodId
      }
      this.$http.fetch(`planTask/addPlanTaskPeriod`,data).then(res=>{
        if(res.code==0&&!this._isDestroyed){
          this.getTaskPeriod()
        }else{
          this.formData.periodId = ""
        }
      })
    },
    // 删除工作周期
    delOptionWorkPeriod: function(param,index){
      let data = {
        planTaskPeriodId: param
      }
      this.$http.fetch(`planTask/deletePlanTaskPeriod`,data).then(res=>{
        if(res.code==0&&!this._isDestroyed){
          if(this.formData.periodId == param){
            this.formData.periodId = ''
          }
          this.$message.success('删除成功!')
          // this.getTaskPeriod()
          this.optionsWorkTime.splice(index,1)
        }
      })
    },
    addPlan: function(){
      this.showMenu = true
      this.getOrderCategory()
      this.getOrderType()
      this.getTaskType()
      this.getTaskPeriod()
    },
    editPlan: function(row){
      this.formData = {...row}
      this.addPlan()
      this.getDevicePartType() // 修改初始选择
    },
    copyPlan: function(){},
    selectionChange: function(selection){
      // console.log(selection)
      this.selectionWork = []
      selection.forEach(item=>{
        this.selectionWork.push(item.planTaskId)
      })
    },
    delPlan: function(row){
      let data
      if(row){
        data = {
          "planTaskId": [row.planTaskId]
        }
      }else{
        if(this.selectionWork.length==0){
          this.$message.error('请至少选择一条计划任务！')
          return
        }else{
          data = {
          "planTaskId": this.selectionWork
          }
        }
      }
      this.$confirm('确定删除该计划任务?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http.fetch(`planTask/deletePlanTask`,data).then(res=>{
          if(res.code==0&&!this._isDestroyed){
            this.$message.success('删除成功！')
            this.getTableData()
          }
        })
      }).catch(() => {});
    },
    changeWork: function(key){
      if(key == 'Type'){
        let onselect = this.optionsWorkType.filter(item=>item.planTaskTypeId == this.formData.planTaskTypeId)
        if(!onselect || onselect.length==0){
          this.addTaskType()
        }
      }else{
        let onselect = this.optionsWorkTime.filter(item=>item.planTaskPeriodId == this.formData.periodId)
        if(!onselect || onselect.length==0){
          this.addTaskPeriod()
        }
      }
    },
    showInp: function(key,index,param){
      this['newWork'+key] = param
      this['edit'+key+'Index'] = index
    },
    // 编辑完成
    hideInp: function(key,index,param){
      if(key == 'Type'){
        if(!this.newWorkType){
          this.$message.error('时间类型名称不能为空！')
          return
        }
        let data = {
          "createAccount": this.userInfo.userAccount,
          "planTaskTypeName": this.newWorkType,
          "planTaskTypeId": param
        }
        this.$http.fetch(`planTask/editPlanTaskType`,data).then(res=>{
          if(res.code==0&&!this._isDestroyed){
            this.optionsWorkType[index].planTaskTypeName = this.newWorkType
            this.editTypeIndex = null
            this.$message.success('修改成功!')
          }
        })
      }else{
        if(!this.newWorkTime){
          this.$message.error('时间周期名称不能为空！')
          return
        }
        let data = {
          "createAccount": this.userInfo.userAccount,
          "periodName": this.newWorkTime,
          "planTaskPeriodId": param
        }
        this.$http.fetch(`planTask/updatePlanTaskPeriod`,data).then(res=>{
          if(res.code==0&&!this._isDestroyed){
            this.optionsWorkTime[index].periodName = this.newWorkTime
            this.editTimeIndex = null
            this.$message.success('修改成功!')
          }
        })
      }
    },
    hideOptionWorkType: function(key){
      // console.log(key)
      if(!key){
        this.editTypeIndex = null
        this.newWorkType = null
      }
    },
    hideOptionWorkTime: function(key){
      // console.log(key)
      if(!key){
        this.editTimeIndex = null
        this.newWorkTime = null
      }
    },
    save: function(issure){
      this.$refs.formWork.validate((valid) => {
        if (valid) {
          this.formData.createAccount = this.userInfo.userAccount
          if(this.formData.planTaskId){
            this.$http.fetch(`planTask/updatePlanTask`,this.formData).then(res=>{
              if(res.code==0&&!this._isDestroyed){
                this.showMenu = false
                this.$refs.formWork.resetFields();
                this.$message.success('修改成功!')
                this.getTableData()
              }
            })
          }else{
            this.$http.fetch(`planTask/addPlanTask`,this.formData).then(res=>{
              if(res.code==0&&!this._isDestroyed){
                if(issure){
                  this.$message.success('创建成功!')
                  this.$refs.formWork.resetFields();
                  this.getTableData()
                }else{
                  this.showMenu = false
                  this.$message.success('创建成功!')
                  this.$refs.formWork.resetFields();
                  this.getTableData()
                }
              }
            })
          }
        } else {
          return false;
        }
      });
    },
    close: function(){
      this.showMenu = false
      this.$refs.formWork.resetFields();
    }
  }
}
</script>

<style scoped lang="less">
.planBtnWrap{
  width: 100%;height: 64px; padding: 0 20px;
  .btnList{
    margin-right: 30px; color: #999;
    .icon{
      font-size: 20px;margin-right: 5px;
    }
    &:hover{
      color: #38AEF3;
    }
  }
}
/deep/.noTitleDialog{
  left: 50%; right: auto; top: 15px; width: 660px; margin-left: -330px; height: auto;
  .el-dialog__header{
    display: block; padding: 10px 20px; border-bottom: 1px solid #e5e5e5;
    .el-dialog__title{
      font-size: 14px;font-weight: bold;
    }
  }
  .el-dialog__headerbtn{
    display: block; top: 15px;
  }
  .formInPlan .el-form-item:not(:last-child){margin-bottom: 15px;}
  .footer{
    padding-bottom: 20px;
  }
  
}
</style>