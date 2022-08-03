<template>
  <div class="formWrap flex-column">
    <div class="tableWrap flex-1">
      <el-table :data="tableData" border style="width: 100%;" size="medium">
        <!-- <el-table-column type="selection" width="40"></el-table-column> -->
        <el-table-column type="index" label="序号" width="55"></el-table-column>
        <el-table-column prop="faultCode" label="故障码" width="100"></el-table-column>
        <el-table-column prop="faultName" label="故障名称" show-overflow-tooltip :formatter="function(row, column, cellValue){return cellValue||'-'}"></el-table-column>
        <el-table-column prop="faultSystemName" label="故障系统" width="120" :formatter="function(row, column, cellValue){return cellValue||'-'}"></el-table-column>
        <el-table-column prop="faultReason" label="可能原因" show-overflow-tooltip :formatter="function(row, column, cellValue){return cellValue||'-'}"></el-table-column>
        <el-table-column prop="advice" label="检修建议" show-overflow-tooltip :formatter="function(row, column, cellValue){return cellValue||'-'}"></el-table-column>
        <el-table-column label="检修指导" width="160">
          <template slot-scope="scope">
            <a class="blue">设备文档</a>
            <el-divider direction="vertical"></el-divider>
            <a class="blue" @click="goPage(scope.row)">检修历史</a>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
export default {
  data(){
    return {
      tableData: JSON.parse(JSON.stringify(this.formDataOld))
    }
  },
  props: {
    superviseType: { type: [Number, String], default: 1 }, // 督办单类型
    prosessCode: { type: Number, default: 4 },
    procCategoryId: [Number, String],
    formDataOld: Array
  },
  watch: {
    formDataOld: {
      deep: true,
      immediate:true,
      handler: function(){
        this.tableData = JSON.parse(JSON.stringify(this.formDataOld))
        this.$nextTick(()=>{
          this.$emit('resize','collapse4') // 数据改变重新计算父组件高度
        })
      }
    }
  },
  created(){},
  methods: {
    goPage(){
      this.$emit('changeHash')
    },
  }
}
</script>

<style scoped lang="less">
.formWrap{
  width: 100%; padding-bottom: 20px;
}
</style>