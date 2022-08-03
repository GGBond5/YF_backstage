<template>
  <div class="formWrap flex-column">
    <el-form class="formInline" :inline="true" :model="formData"  label-suffix=":" :rules="rules">
      <el-form-item label="申请内容" prop="plantName">
        <div class="flex-vCenter color5" v-if="formData.applyContent==2">
          <i class="el-icon-success" style="font-size: 16px;margin-right: 5px;"></i>
          <span>关闭督办单</span>
        </div>
        <div class="flex-vCenter color4" v-if="formData.applyContent==1">
          <i class="el-icon-warning" style="font-size: 16px;margin-right: 5px;"></i>
          <span>挂起督办单</span>
        </div>
        <div class="flex-vCenter color5" v-if="formData.applyContent==3">
          <i class="el-icon-success" style="font-size: 16px;margin-right: 5px;"></i>
          <span>申请关闭主督办单时，联动关闭本督办单</span>
        </div>
      </el-form-item>
      <el-form-item label="申请人" prop="addressName">
        <!-- <el-input v-model="formData.userName" placeholder="请输入" disabled></el-input> -->
        <span>{{formData.userName}}</span>
      </el-form-item>
      <el-form-item label="申请时间" prop="deviceModel">
        <!-- <el-input v-model="formData.deviceModel" placeholder="请输入" disabled></el-input> -->
        <span>{{formData.operationTime || '-'}}</span>
      </el-form-item>
      <el-form-item label="联动关闭" style="width: 100%;">
        <el-table ref="stopTable" :data="formData.linkSupervise" border style="width: 100%;" size="small">
          <el-table-column type="index" label="序号" width="55"></el-table-column>
          <el-table-column prop="superviseCode" label="督办单编号"></el-table-column>
          <el-table-column prop="superviseType" label="督办单类型">
            <template slot-scope="scope">
              <span class="tableCellBtn bgColor1 color1" v-if="scope.row.superviseType==1">故障</span>
              <span class="tableCellBtn bgColor2 color2" v-if="scope.row.superviseType==2">定检</span>
              <span class="tableCellBtn bgColor3 color3" v-if="scope.row.superviseType==3">巡检</span>
              <span class="tableCellBtn bgColor4 color4" v-if="scope.row.superviseType==4">维护</span>
              <span class="tableCellBtn bgColor5 color5" v-if="scope.row.superviseType==5">技改</span>
              <span class="tableCellBtn bgColor6 color6" v-if="scope.row.superviseType==6">临时任务</span>
            </template>
          </el-table-column>
          <el-table-column prop="superviseCategoryName" label="督办单类别"></el-table-column>
          <el-table-column prop="content" label="工作内容" :formatter="function(row, column, cellValue){return cellValue||'-'}"></el-table-column>
          <el-table-column prop="planStartTime" label="计划开工时间"></el-table-column>
          <el-table-column prop="maintainerName" label="检修人" :formatter="function(row, column, cellValue){return cellValue||'-'}"></el-table-column>
          <el-table-column prop="lossTotal" label="督办单状态">
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
                <span class="tableUserBtn brColor5 color5" style="border-style: dashed;" v-if="scope.row.procCategoryId==64">班组已验收</span>
                <span class="tableUserBtn brColor5 color5" style="border-style: dashed;" v-if="scope.row.procCategoryId==65">场站已验收</span>
                <span class="tableUserBtn brColor5 color5" style="border-style: dashed;" v-if="scope.row.procCategoryId==66">部门已验收</span>
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
        </el-table>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
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
      fileList: []
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
      handler: function(){
        this.formData = JSON.parse(JSON.stringify(this.formDataOld))
        console.log(this.formData)
        this.$nextTick(()=>{
          this.$emit('resize','collapse8') // 数据改变重新计算父组件高度
        })
      }
    }
  },
  created(){},
  methods: {
    handleExpandTable: function(){
      this.$emit('resize','collapse8')
    },
    selectionChange: function(row){
      this.$refs.stopTable.toggleRowExpansion(row)
    },
    onSubmit: function(){
      
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
      &:not(:last-child){margin-bottom: 5px;}
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
      }
    }
    .el-table{
      line-height: 23px;
      .formInlineTable{
        padding: 10px 25px 0;display: flex;flex-wrap: wrap;
        .el-form-item{
          margin-bottom: 20px;text-align: left;
        }
        .el-form-item:nth-child(1){
          width: 100%; text-align: left;
        }
        .el-form-item:nth-child(2){
          .el-form-item__content{ line-height: 0; }
          .el-upload-list--picture-card .el-upload-list__item{margin-bottom: 0;}
        }
        .el-upload--picture-card{
          width: 80px;height: 80px;line-height: 84px;
        }
        .el-upload-list__item{
          width: 80px;height: 80px;
          .el-upload-list__item-status-label{
            width: 42px;min-width: unset;right: -14px;top: -2px;height: 20px;
            i{margin-top: 0; margin-left: 15px;}
          }
        }
      }
    }
  }
}
</style>