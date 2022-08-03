<template>
  <div class="formWrap flex-column">
    <el-form class="formInline" :inline="true" :model="formData"  label-suffix=":" :rules="rules" :disabled="prosessCode!=3">
      <el-form-item label="联动处理" prop="plantName">
        <el-select v-model="formData.plantName" placeholder="请选择">
          <el-option label="区域一" value="shanghai"></el-option>
          <el-option label="区域二" value="beijing"></el-option>
        </el-select>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  data(){
    return {
      formData: {},
      rules: {
        plantName: [
          { required: true, message: '请选择场站名称', trigger: 'change' },
        ]
      },
    }
  },
  props: {
    type: { type: Number, default: 1 },
    prosessCode: { type: Number, default: 4 }
  },
  watch: {},
  created(){},
  methods: {
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
  }
}
</style>