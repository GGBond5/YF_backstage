<!-- 计划策略列表列表  全部 -->
<template>
  <div class="supervision flex-column">
    <div class="planBtnWrap flex-vCenter">
      <a class="btnList flex-vCenter" @click="addPlan()">
        <i class="icon yfFont icon-xinzeng"></i>
        <span>新增策略</span>
      </a>
      <!-- <a class="btnList flex-vCenter" @click="copyPlan">
        <i class="icon yfFont icon-fuzhi"></i>
        <span>复制策略</span>
      </a> -->
      <a class="btnList flex-vCenter" @click="delPlan()">
        <i class="icon yfFont icon-shanchu"></i>
        <span>删除策略</span>
      </a>
    </div>
    <div style="width: 100%; height: 10px; background: #fafafa;overflow: hidden;"></div>
    <YfSearch @confirm="submit" layout="plant,orderTypeCascaderPlan,submit"></YfSearch>
    <TabularData>
      <el-table :data="tableData" border style="width: 100%;" size="medium" height="100%" @selection-change="selectionChange">
        <el-table-column type="selection" width="40"></el-table-column>
        <el-table-column type="index" label="序号" width="60"></el-table-column>
        <el-table-column prop="content" label="工作内容" show-overflow-tooltip :formatter="function(row, column, cellValue){return cellValue||'-'}"></el-table-column>
        <el-table-column prop="superviseTypeName" label="计划类型" width="120">
          <template slot-scope="scope">
            <span class="tableCellBtn bgColor1 color1" v-if="scope.row.superviseType==1">故障</span>
          <span class="tableCellBtn bgColor2 color2" v-if="scope.row.superviseType==2">定检</span>
          <span class="tableCellBtn bgColor3 color3" v-if="scope.row.superviseType==3">巡检</span>
          <span class="tableCellBtn bgColor4 color4" v-if="scope.row.superviseType==4">维护</span>
          <span class="tableCellBtn bgColor5 color5" v-if="scope.row.superviseType==5">技改</span>
          <span class="tableCellBtn bgColor6 color6" v-if="scope.row.superviseType==6">临时任务</span>
          </template>
        </el-table-column>
        <el-table-column prop="superviseCategoryName" label="计划类别" width="160"></el-table-column>
        <el-table-column prop="plantName" label="所属场站" width="160"></el-table-column>
        <el-table-column prop="deviceAddressTeam" label="设备名称" width="240" show-overflow-tooltip></el-table-column>
        <el-table-column prop="planCycle" label="计划周期" width="140">
          <template slot-scope="scope">每{{scope.row.planCycleNum!=1?scope.row.planCycleNum:''}}{{planCycleText[scope.row.planCycleType]}}</template>
        </el-table-column>
        <el-table-column prop="generatedDay" label="计划工作天数" width="140" :formatter="function(row, column, cellValue){return cellValue||'-'}"></el-table-column>
        <el-table-column label="操作" width="140" align="center">
          <template slot-scope="scope">
            <div class="flex-center blue">
              <a @click="edit(scope.row)">修改</a>
              <el-divider direction="vertical"></el-divider>
              <a @click="delPlan(scope.row)">删除</a>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </TabularData>
    <el-dialog title="新建策略" :visible.sync="showMenu" @close="resetForm" custom-class="noTitleDialog">
      <div class="formWrap flex-column">
        <el-form class="formInPlan" ref="formInPlan" :model="formData" label-suffix=":" label-width="100px" label-position="left">
          <el-form-item label="场站名称" prop="plantId">
            <el-select style="width: 100%;" v-model="formData.plantId" placeholder="请选择" @change="getCategory">
              <el-option :label="item.plantName" :value="item.plantId" v-for="item in plantList" :key="item.plantId"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="计划策略类型" prop="superviseCategory">
            <el-cascader style="width: 100%;" v-model="formData.superviseCategory" :options="optionsSuperviseCategory" :props="propsOption"></el-cascader>
          </el-form-item>
        </el-form>
      </div>
      <div class="footer flex-center">
        <a class="rightBtn grey flex-center" @click="close()">
          <span>取消</span>
        </a>
        <a class="rightBtn primary flex-center" @click="goPage()">
          <span>确定</span>
        </a>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import TabularData from '@/views/operatingIndex/tabularData/TabularData.vue'
export default {
  components: { TabularData },
  data(){
    return {
      userInfo: JSON.parse(window.sessionStorage.getItem('userInfo')),
      time: [this.$moment().subtract(1,'months').add(1,'days').format('YYYY-MM-DD'), this.$moment().format('YYYY-MM-DD')],
      form: {},
      tableData: [],
      showMenu: false,
      formData: {
        plantId: '',
        superviseCategory: ''
      },
      planCycleText: {1: '日', 2: '周', 3: '月', 4: '年'},
      plantList: [],
      optionsSuperviseCategory: [],
      propsOption: {
        expandTrigger: 'hover',
        value: 'id',
        label: 'name',
        emitPath: false
      },
      selectionWork: [],
    }
  },
  created(){
    // this.$store.commit('set_formRoute', this.$route.path) // 记录历史路由
    window.sessionStorage.setItem('formRoute', JSON.stringify([{path:this.$route.path,query: {}}]));
  },
  mounted(){
    this.getPlant()
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
        "currentPage": 1,
        "pageSize": 10000,
        "plantId": this.form.plantCode,
        "superviseCategory": this.form.superviseCategory,
        "superviseType": this.form.superviseType
      }
      this.$http.fetch(`patrol/queryPlanPatrolForPage`,data).then(res=>{
        if(res.code==0&&!this._isDestroyed){
          this.tableData = res.data.list
        }else{
          this.tableData = []
        }
      })
    },
    goPage: function(){
      // console.log(path)
      if(!this.formData.plantId){
        this.$message.error('请选择场站！')
        return
      }
      if(!this.formData.superviseCategory){
        this.$message.error('请选择计划策略类别！')
        return
      }
      this.$router.push({
        path: `/overhaulSupervision/supervisionPlan/supervisionPlanDetail`, 
        query: {...this.formData},
      })
    },
    edit: function(row){
      this.$router.push({
        path: `/overhaulSupervision/supervisionPlan/supervisionPlanDetail`, 
        query: {patrolId: row.patrolId},
      })
    },
    getPlant: function(){
      this.$http.fetchGet(`supvApproval/queryPlantAll`).then(res=>{
        if(res.code==0&&!this._isDestroyed){
          this.plantList = res.data
        }else{
          this.plantList = []
        }
      })
    },
    getCategory: function(){
      let data = {
        plantId: this.formData.plantId
      }
      this.$http.fetch(`patrol/querySuperviseCategoryTree`,data).then(res=>{
        if(res.code==0&&!this._isDestroyed){
          this.optionsSuperviseCategory = res.data
        }else{
          this.optionsSuperviseCategory = []
        }
      })
    },
    addPlan: function(){
      this.showMenu = true
    },
    selectionChange: function(selection){
      // console.log(selection)
      this.selectionWork = []
      selection.forEach(item=>{
        this.selectionWork.push(item.patrolId)
      })
    },
    delPlan: function(row){
      let data
      if(row){
        data = {
          "patrolIdList": [row.patrolId]
        }
      }else{
        if(this.selectionWork.length==0){
          this.$message.error('请至少选择一条计划任务！')
          return
        }else{
          data = {
          "patrolIdList": this.selectionWork
          }
        }
      }
      this.$confirm('确定删除该计划策略?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http.fetch(`patrol/deletePlanPatrolByPatrolId`,data).then(res=>{
          if(res.code==0&&!this._isDestroyed){
            this.$message.success('删除成功！')
            this.getTableData()
          }
        })
      }).catch(() => {});
    },
    close: function(){
      this.showMenu = false
      this.$refs.formInPlan.resetFields()
      this.optionsSuperviseCategory = []
    },
    // 弹窗消失重置表单
    resetForm: function(){
      this.$refs.formInPlan.resetFields()
      this.optionsSuperviseCategory = []
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
  left: 50%; right: auto; top: 0; width: 520px; margin-left: -260px; height: auto;
  .el-dialog__header{
    display: block; padding: 10px 20px; border-bottom: 1px solid #e5e5e5;
    .el-dialog__title{
      font-size: 14px;font-weight: bold;
    }
  }
  .el-dialog__headerbtn{
    display: block; top: 15px;
  }
  .footer{
    padding-bottom: 20px;
  }
  
}
</style>