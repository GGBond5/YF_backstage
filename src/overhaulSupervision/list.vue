<template>
  <TabularData>
    <el-table :data="tableDatas" border style="width: 100%;" size="medium" height="100%" :cell-style="cellStyleFun" :highlight-current-row="isHighlight"
    @current-change="currentChange">
      <!-- <el-table-column type="selection" width="40"></el-table-column> -->
      <el-table-column type="index" label="序号" width="55"></el-table-column>
      <el-table-column prop="superviseCode" label="督办单编号" width="240" show-overflow-tooltip></el-table-column>
      <el-table-column prop="type" label="督办单类型" width="100">
        <template slot-scope="scope">
          <span class="tableCellBtn bgColor1 color1" v-if="scope.row.superviseType==1">故障</span>
          <span class="tableCellBtn bgColor2 color2" v-if="scope.row.superviseType==2">定检</span>
          <span class="tableCellBtn bgColor3 color3" v-if="scope.row.superviseType==3">巡检</span>
          <span class="tableCellBtn bgColor4 color4" v-if="scope.row.superviseType==4">维护</span>
          <span class="tableCellBtn bgColor5 color5" v-if="scope.row.superviseType==5">技改</span>
          <span class="tableCellBtn bgColor6 color6" v-if="scope.row.superviseType==6">临时任务</span>
        </template>
      </el-table-column>
      <el-table-column prop="superviseCategoryName" label="督办单类别" width="110" show-overflow-tooltip></el-table-column>
      <el-table-column prop="plantName" label="场站名称" width="120"></el-table-column>
      <el-table-column prop="addressName" label="设备名称" width="105"></el-table-column>
      <el-table-column prop="content" label="工作内容" show-overflow-tooltip :formatter="function(row, column, cellValue){return cellValue||'-'}"></el-table-column>
      <el-table-column prop="planStartTime" label="计划开工时间" width="120">
        <template slot-scope="scope">
          <el-tooltip placement="right" effect="light" popper-class="elTooltip" 
          v-if="scope.row.superviseType!=1 && scope.row.supvProcStatus<=4 && getRangeDays(scope.row)>-7 && getRangeDays(scope.row)<0">
            <div slot="content" class="color5"><i class="el-icon-warning"></i><span>计划{{-getRangeDays(scope.row)}}天后开工</span></div>
            <div class="flex-center color5"><span>{{scope.row.planStartTime}}</span><i class="el-icon-warning"></i></div>
          </el-tooltip>
          <el-tooltip placement="right" effect="light" popper-class="elTooltip" 
          v-else-if="scope.row.superviseType!=1 && scope.row.supvProcStatus<=4 && getRangeDays(scope.row)==0">
            <div slot="content" class="color4"><i class="el-icon-warning"></i><span>计划今日开工</span></div>
            <div class="flex-center color4"><span>{{scope.row.planStartTime}}</span><i class="el-icon-warning"></i></div>
          </el-tooltip>
          <el-tooltip placement="right" effect="light" popper-class="elTooltip" 
          v-else-if="scope.row.superviseType!=1 && scope.row.supvProcStatus<=4 && getRangeDays(scope.row)>0">
            <div slot="content" class="color1"><i class="el-icon-warning"></i><span>已逾期{{getRangeDays(scope.row)}}天</span></div>
            <div class="flex-center color1"><span>{{scope.row.planStartTime}}</span><i class="el-icon-warning"></i></div>
          </el-tooltip>
          <el-tooltip placement="right" effect="light" popper-class="elTooltip" 
          v-else-if="scope.row.superviseType==1 && scope.row.supvProcStatus<=4 && getRangeDays(scope.row)<24">
            <div slot="content" class="color5"><i class="el-icon-warning"></i><span>{{getRangeDays(scope.row)}}小时前发生故障</span></div>
            <div class="flex-center color5"><span>{{scope.row.planStartTime}}</span><i class="el-icon-warning"></i></div>
          </el-tooltip>
          <el-tooltip placement="right" effect="light" popper-class="elTooltip" 
          v-else-if="scope.row.superviseType==1 && scope.row.supvProcStatus<=4 && getRangeDays(scope.row)>=24 && getRangeDays(scope.row)<72">
            <div slot="content" class="color4"><i class="el-icon-warning"></i><span>{{getRangeDays(scope.row)}}小时前发生故障</span></div>
            <div class="flex-center color4"><span>{{scope.row.planStartTime}}</span><i class="el-icon-warning"></i></div>
          </el-tooltip>
          <el-tooltip placement="right" effect="light" popper-class="elTooltip" 
          v-else-if="scope.row.superviseType==1 && scope.row.supvProcStatus<=4  && getRangeDays(scope.row)>=72 && (getRangeDays(scope.row)<=168 || scope.row.receiveTime)">
            <div slot="content" class="color1"><i class="el-icon-warning"></i><span>{{getRangeDays(scope.row)}}小时前发生故障</span></div>
            <div class="flex-center color1"><span>{{scope.row.planStartTime}}</span><i class="el-icon-warning"></i></div>
          </el-tooltip>
          <el-tooltip placement="right" effect="light" popper-class="elTooltip" 
          v-else-if="scope.row.superviseType==1 && getRangeDays(scope.row)>168 && !scope.row.receiveTime">
            <div slot="content" class="color1"><i class="el-icon-warning"></i><span>{{getRangeDays(scope.row)}}小时前发生故障</span></div>
            <div class="flex-center"><span style="color: #fff;">{{scope.row.planStartTime}}</span></div>
          </el-tooltip>
          <a class="flex-center" v-else>
            <span>{{scope.row.planStartTime}}</span>
          </a>
        </template>
      </el-table-column>
      <el-table-column prop="realStartTime" label="实际开工时间" width="105" show-overflow-tooltip :formatter="(row)=>row.realStartTime||'-'"></el-table-column>
      <el-table-column prop="receiveTime" label="验收完成时间" width="105" show-overflow-tooltip :formatter="(row)=>row.receiveTime||'-'"></el-table-column>
      <el-table-column prop="supervisorName" label="负责人" width="95" :formatter="function(row, column, cellValue){return cellValue||'-'}"></el-table-column>
      <el-table-column prop="maintainerName" label="检修人" width="120">
        <template slot-scope="scope">
          <div class="flex-center" v-if="scope.row.procCategoryId==41" @click="showDialog(scope.row)">
            <el-tooltip class="item" effect="dark" content="点击指派检修人" placement="top" :enterable="false">
              <a class="default">待认领</a>
            </el-tooltip>
            <!-- <a class="default">待认领</a> -->
          </div>
          <div class="flex-center" v-else-if="scope.row.procCategoryId==42" @click="showDialog(scope.row)">
            <!-- <span>{{scope.row.maintainerName}}</span><span class="tableUserBtn bgColor4 brColor4 color4">申请中</span> -->
            <el-tooltip placement="right" effect="light" popper-class="elTooltip">
              <div slot="content" class="color5"><span>申请中</span></div>
              <div class="flex-center"><span>{{scope.row.maintainerName||'-'}}</span><i class="el-icon-warning color4" style="margin-left: 3px;"></i></div>
            </el-tooltip>
          </div>
          <div class="flex-center" v-else-if="scope.row.procCategoryId==43" @click="showDialog(scope.row)">
            <!-- <span>{{scope.row.maintainerName}}</span><span class="tableUserBtn bgColor2 brColor2 color2">已指派</span> -->
            <el-tooltip placement="right" effect="light" popper-class="elTooltip">
              <div slot="content" class="color5"><span>已指派</span></div>
              <div class="flex-center"><span>{{scope.row.maintainerName||'-'}}</span><i class="el-icon-success color5" style="margin-left: 3px;"></i></div>
            </el-tooltip>
          </div>
          <div class="flex-center" v-else>
            <span>{{scope.row.maintainerName||'-'}}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="supvProcStatus" label="督办单状态" width="140">
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
            <span class="tableUserBtn brColor5 color5" style="border-style: dashed;" v-if="scope.row.procCategoryId==62||scope.row.procCategoryId==65">班组已验收</span>
            <span class="tableUserBtn brColor5 color5" style="border-style: dashed;" v-if="scope.row.procCategoryId==63||scope.row.procCategoryId==66">场站已验收</span>
            <!-- <span class="tableUserBtn brColor5 color5" style="border-style: dashed;" v-if="scope.row.procCategoryId==66">部门已验收</span> -->
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
      <el-table-column label="操作" width="125" align="center" v-if="prosessCode==1">
        <template slot-scope="scope">
          <div class="flex-center blue" v-if="scope.row.supvProcStatus==1 || scope.row.supvProcStatus==3">
            <a @click="goPage(1,scope.row)">编辑</a>
            <el-divider direction="vertical"></el-divider>
            <a @click="delSupervise(scope.row)">删除</a>
          </div>
          <div class="flex-center blue" v-else-if="scope.row.supvProcStatus==4">
            <a @click="goPage(1,scope.row)">{{scope.row.procCategoryId==41?'指派检修人':(scope.row.procCategoryId==42?'批准检修人':'重新指派')}}</a>
          </div>
          <div class="flex-center blue" v-else>
            <a @click="goPage(4,scope.row)">详情</a>
            <el-divider direction="vertical" v-if="scope.row.supvProcStatus==6"></el-divider>
            <a v-if="scope.row.supvProcStatus==6" @click="goPage(2,scope.row)">立即验收</a>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="125" align="center" v-if="prosessCode==2">
        <template slot-scope="scope">
          <div class="flex-center blue" v-if="scope.row.supvProcStatus==2">
            <a @click="goPage(1,scope.row)">开工批准</a>
          </div>
          <div class="flex-center blue" v-else-if="scope.row.supvProcStatus==4">
            <a @click="goPage(1,scope.row)">{{scope.row.procCategoryId==41?'指派检修人':(scope.row.procCategoryId==42?'批准检修人':'重新指派')}}</a>
          </div>
          <div class="flex-center blue" v-else>
            <a @click="goPage(4,scope.row)">详情</a>
            <el-divider direction="vertical" v-if="scope.row.supvProcStatus==6"></el-divider>
            <a v-if="scope.row.supvProcStatus==6" @click="goPage(2,scope.row)">立即验收</a>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="125" align="center" v-if="prosessCode==3">
        <template slot-scope="scope">
          <div class="flex-center blue" v-if="scope.row.procCategoryId==41">
            <a @click="processing(scope.row)">申请处理</a>
          </div>
          <div class="flex-center blue" v-else>
            <a @click="goPage(4,scope.row)">详情</a>
            <el-divider direction="vertical" v-if="scope.row.procCategoryId==43||scope.row.supvProcStatus==5||scope.row.supvProcStatus==7"></el-divider>
            <a v-if="scope.row.procCategoryId==43||scope.row.supvProcStatus==5||scope.row.supvProcStatus==7" @click="goPage(3,scope.row)">立即处理</a>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="125" align="center" v-if="prosessCode==4">
        <template slot-scope="scope">
          <div class="flex-center blue">
            <a @click="goPage(4,scope.row)">详情</a>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog :visible.sync="showMenu" custom-class="noTitleDialog1">
      <div slot="title"></div>
      <div class="workWrap flex-column">
        <el-input placeholder="搜索" v-model="filterText"></el-input>
        <div class="workBox flex-1">
          <div class="workList flex-vCenter" :class="{active: maintainerId == item.id}" 
          v-for="item in maintainerList" :key="item.id" @click="handleSelectWork(item)">
            <span class="name">{{item.name}}</span>
            <span class="lab color2 bgColor2 brColor2" v-if="currentRow.maintainerId == item.id">已指派</span>
            <span class="flex-1"></span>
            <i class="el-icon-check color2" v-show="maintainerId == item.id"></i>
          </div>
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
  </TabularData>
</template>
<script>
import TabularData from '@/views/operatingIndex/tabularData/TabularData.vue'
export default {
  components: { TabularData },
  data(){
    return {
      userInfo: JSON.parse(window.sessionStorage.getItem('userInfo')),
      tableDatas: this.tableData,
      showMenu: false,
      currentRow: {},
      filterText: '',
      maintainerId: null, // 当前选择的检修人id
      maintainerList: [], // 检修人列表
      currentHighRow: null
    }
  },
  props: {
    prosessCode: { type: Number, default: 1 },
    tableData: Array,
    isHighlight: { type: Boolean, default: false }
  },
  watch: {
    tableData: {
      deep: true,
      handler(newData){
        // console.log(newData)
        this.tableDatas = newData
      }
    },
    filterText(val) {
      this.$refs.tree.filter(val);
    }
  },
  mounted(){
  },
  methods: {
    getRangeDays: function(row){
      let days
      if(row.superviseType != 1){
        days = (this.$moment().startOf('day').valueOf() - this.$moment(row.planStartTime).valueOf())/(1000*3600*24)
      }else{
        days = parseInt((this.$moment().valueOf() - this.$moment(row.planStartTime).valueOf())/(1000*3600))
      }
      return days
    },
    // table添加单元格Style
    cellStyleFun: function({row, columnIndex}){
      if(columnIndex==7){
        if(row.superviseType==1 && this.getRangeDays(row)>168 && !row.receiveTime){
          return {backgroundColor: '#FF6666'}
        }
      }
    },
    filterNode(value, data) {
      if (!value) return true;
      return data.name.indexOf(value) !== -1;
    },
    currentChange: function(currentRow){
      this.currentHighRow = currentRow
    },
    showDialog: function(row){
      this.filterText = ''
      this.maintainerId = null
      this.showMenu = true
      this.currentRow = row
    },
    handleSelectWork: function(item){
      this.maintainerId = item.id
    },
    close: function(){
      this.showMenu = false
    },
    saveWork: function(){
      let data = {
        "createAccount": this.userInfo.userAccount,
        "maintainerId": this.maintainerId,
        "superviseId": this.currentRow.superviseId
      }
      this.$http.fetch(`supvAssign/updateSupvAssign`,data).then(res=>{
        if(res.code==0&&!this._isDestroyed){
          this.$message.success('指派成功！')
          this.$emit('refresh')
        }
      })
    },
    goPage: function(prosessCode,row){
      // console.log(path)
      if(prosessCode==4){ // 查看权限
        this.$router.push({
          path: `/overhaulSupervision/supervisionLookOver/supervisionLookOverDetail`, 
          query: {superviseId: row.superviseId},
        })
      }else if(prosessCode==3){
        if(row.isLoss){
          this.$emit('getLossList',row)
        }else{
          this.$router.push({
            path: `/overhaulSupervision/supervisionDispose/supervisionDisposeDetail`, 
            query: {superviseId: row.superviseId},
          })
        }
      }else if(prosessCode==2){
        this.$router.push({
          path: `/overhaulSupervision/supervisionPermission/supervisionPermissionDetail`, 
          query: {superviseId: row.superviseId},
        })
      }else{
        if(row.supvProcStatus==1||row.supvProcStatus==2||row.supvProcStatus==3){
          this.$router.push({
            path: `/overhaulSupervision/supervisionInitiate/supervisionInitiateInit`, 
            query: {superviseId: row.superviseId},
          })
        }else{
          this.$router.push({
            path: `/overhaulSupervision/supervisionInitiate/supervisionInitiateDetail`, 
            query: {superviseId: row.superviseId},
          })
        }
      }
    },
    // 申请处理
    processing: function(row){
      // console.log(this.userInfo, row)
      this.$confirm('确定申请处理该督办单?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let data = {
          "createAccount": this.userInfo.userAccount,
          "maintainerId": this.userInfo.userId,
          "superviseId": row.superviseId
        }
        this.$http.fetch(`supvAssign/updateSupvAssignApply`,data).then(res=>{
          if(res.code==0&&!this._isDestroyed){
            this.$message.success('已申请！')
            this.$emit('refresh')
          }
        })
      }).catch(() => {});
    },
    // 删除督办单
    delSupervise: function(row){
      this.$confirm('确定删除该督办单？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http.fetch(`supervise/deleteSuperviseList`,{superviseIds: [row.superviseId]}).then(res => {
          if(res.code===0){
            this.$message({
              message: '删除成功！',
              type: 'success',
              duration: 1000,
              onClose: ()=>{
                this.$emit('refresh')
              }
            })
          }
        });
      }).catch(() => {});
    },
  }
}
</script>

<style scoped lang="less">
/deep/.noTitleDialog1{
  left: auto; right: 400px; top: 25px; width: 184px; height: 300px; position: absolute;
  .el-dialog__header{
    display: none;
  }
  .el-dialog__headerbtn{
    display: none;
  }
  .el-dialog__body{padding: 15px;height: 100%;}
  .workWrap{
     height: calc(100% - 40px);
    .workBox{
      margin-top: 10px; overflow: auto;
      .workList{
        height: 36px;line-height: 36px; cursor: pointer;
        .name{font-size: 14px;color: #666;}
        .lab{font-size: 12px;border-radius: 3px;margin-left: 5px;height: 22px;line-height: 22px;transform: scale(0.9);padding: 0 3px;}
        i{font-size: 14px;font-weight: bold;}
        &:hover{background: #f5f7f9;}
      }
    }
  }
  .footer{
    margin-top: 10px;
    .rightBtn{
      width: 60px;min-width: 60px;height: 30px;line-height: 30px;
      &:first-child{margin-left: 0;}
    }
  }
  
}
</style>