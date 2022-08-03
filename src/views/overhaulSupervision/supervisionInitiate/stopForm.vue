<template>
  <div class="formWrap flex-column">
    <el-form class="formInline" :inline="true" :model="formData"  label-suffix=":" :rules="rules">
      <el-form-item label="场站名称" prop="plantName">
        <el-input v-model="formData.plantName" placeholder="请输入" disabled></el-input>
      </el-form-item>
      <el-form-item label="设备名称" prop="addressName">
        <el-input v-model="formData.addressName" placeholder="请输入" disabled></el-input>
      </el-form-item>
      <el-form-item label="设备型号" prop="deviceModel">
        <el-input v-model="formData.deviceModel" placeholder="请输入" disabled></el-input>
      </el-form-item>
      <el-form-item label="停机信息" style="width: 100%;">
        <el-table ref="stopTable" :data="formData.vlossInfoList" border style="width: 100%;" size="small" @expand-change="handleExpandTable" @row-click="selectionChange">
          <el-table-column type="expand">
            <template slot-scope="scope">
              <el-form label-position="left" :inline="true" class="formInlineTable" label-suffix=":" :disabled="prosessCode!=3">
                <el-form-item label="遗留问题" style="width: calc(50% - 20px);">
                  <el-input type="textarea" :rows="3" placeholder="请输入" v-model="scope.row.leftoverProblem"></el-input>
                </el-form-item>
                <el-form-item label="采取的控制及防范措施" style="width: calc(50% - 20px);">
                  <el-input type="textarea" :rows="3" placeholder="请输入" v-model="scope.row.protectiveStep"></el-input>
                </el-form-item>
                <el-form-item label="预计恢复时间" prop="restoringTime" style="width: calc(50% - 20px);">
                  <el-date-picker v-model="scope.row.restoringTime" type="date" align="left" size="medium" clearable placeholder="选择日期" value-format="yyyy-MM-dd"></el-date-picker>
                </el-form-item>
                <el-form-item label="备注" style="width: calc(50% - 20px);">
                  <el-input v-model="scope.row.remark" placeholder="请输入"></el-input>
                </el-form-item>
              </el-form>
            </template>
          </el-table-column>
          <el-table-column type="index" label="序号" width="55"></el-table-column>
          <el-table-column prop="startTime" label="停机时间"></el-table-column>
          <el-table-column prop="lossCodeName" label="停机类别"></el-table-column>
          <el-table-column prop="endTime" label="启机时间" :formatter="function(row, column, cellValue){return cellValue||'-'}"></el-table-column>
          <el-table-column prop="duration" label="停机小时 (h)"></el-table-column>
          <el-table-column prop="lossTotal" label="损失电量 (万kWh)"></el-table-column>
        </el-table>
      </el-form-item>
      <!-- <el-form-item label="停机时间" prop="stime">
        <el-date-picker type="datetime" placeholder="选择时间" v-model="formData.stime" value-format="yyyy-MM-dd hh:mm:ss"></el-date-picker>
      </el-form-item>
      <el-form-item label="启机时间" prop="etime">
        <el-date-picker type="datetime" placeholder="选择时间" v-model="formData.etime" value-format="yyyy-MM-dd hh:mm:ss"></el-date-picker>
      </el-form-item>
      <el-form-item label="停机小时" prop="content">
        <el-input v-model="formData.content" placeholder="请输入"></el-input>
      </el-form-item>
      <el-form-item label="损失电量" prop="content">
        <el-input v-model="formData.content" placeholder="请输入"></el-input>
      </el-form-item> -->
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
        this.$nextTick(()=>{
          this.$emit('resize','collapse3') // 数据改变重新计算父组件高度
        })
      }
    }
  },
  created(){},
  methods: {
    handleExpandTable: function(){
      this.$emit('resize','collapse3')
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