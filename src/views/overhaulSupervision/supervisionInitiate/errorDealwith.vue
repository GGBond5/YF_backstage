<template>
  <div class="formWrap flex-column">
    <el-form class="formInline" :inline="true" :model="formData"  label-suffix=":" :rules="rules" :disabled="prosessCode!=3">
      <el-form-item label="故障名称" prop="faultName" style="width: calc(100% - 20px);">
        <el-input v-model="formData.faultName" maxlength="50" placeholder="请输入"></el-input>
      </el-form-item>
      <el-form-item label="故障类别" prop="faultType">
        <el-select v-model="formData.faultType" placeholder="请选择">
          <el-option v-for="item in errorTypeList" :key="item.faultType" :label="item.faultTypeName" :value="item.faultType"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="故障部件" prop="faultSystemId">
        <el-select v-model="formData.faultSystemId" placeholder="请选择">
          <el-option v-for="item in errorSystemList" :key="item.faultSystemId" :label="item.faultSystemName" :value="item.faultSystemId"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="故障代码" prop="faultCode">
        <el-input v-model="formData.faultCode" maxlength="50" placeholder="请输入"></el-input>
      </el-form-item>
      <el-form-item label="故障原因" prop="faultReason" style="width: 100%;">
        <el-input v-model="formData.faultReason" maxlength="50" placeholder="请输入"></el-input>
      </el-form-item>
      <el-form-item label="缺陷等级" prop="defectLevel">
        <el-select v-model="formData.defectLevel" placeholder="请选择">
          <el-option v-for="item in defectLevelList" :key="item.defectLevelID" :label="item.defectLevelName" :value="item.defectLevelID"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="缺陷单编号" prop="defectCode">
        <el-input v-model="formData.defectCode" maxlength="50" placeholder="请输入"></el-input>
      </el-form-item>
      <el-form-item label="工作号编号" prop="jobCode">
        <el-input v-model="formData.jobCode" maxlength="50" placeholder="请输入"></el-input>
      </el-form-item>
      <el-form-item label="处理情况" prop="disposition" style="width:calc(66.7% - 20px);">
        <el-input type="textarea" :rows="3" maxlength="200" placeholder="请填写" v-model="formData.disposition"></el-input>
      </el-form-item>
      <el-form-item label="修前照片" style="width: calc(50% - 20px);">
        <!-- <el-upload
          action="https://jsonplaceholder.typicode.com/posts/"
          list-type="picture-card" :limit="9"
          :on-preview="handlePictureCardPreview"
          :on-remove="handleRemove"
          :on-change="handlePictureChange">
          <i class="el-icon-plus"></i>
        </el-upload> -->
        <YfUploadImg :imgListOld="beforeDealDto" keys="beforeDealDto" :type="2" :idEdit="prosessCode==3" @delImg="delImg" @changeImg="changeImg"></YfUploadImg>
      </el-form-item>
      <el-form-item label="验收照片" style="width: calc(50% - 20px);">
        <!-- <el-upload
          action="https://jsonplaceholder.typicode.com/posts/"
          list-type="picture-card" :limit="9"
          :on-preview="handlePictureCardPreview"
          :on-remove="handleRemove"
          :on-change="handlePictureChange">
          <i class="el-icon-plus"></i>
        </el-upload> -->
        <YfUploadImg :imgListOld="afterDealDto" keys="afterDealDto" :type="2" :idEdit="prosessCode==3" @delImg="delImg" @changeImg="changeImg"></YfUploadImg>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  data(){
    return {
      formData: {
        faultType: null,
        faultSystemId: null
      },
      rules: {
        faultName: [
          { required: true, message: '请输入故障名称！', trigger: 'blur' },
        ],
        faultType: [
          {  required: true, message: '请选择故障类型', trigger: 'change' }
        ],
        faultSystemId: [
          {  required: true, message: '请选择故障部件', trigger: 'change' }
        ],
        faultCode: [
          { required: true, message: '请输入故障代码', trigger: 'blur' }
        ],
        faultReason: [
          { required: true, message: '请输入故障原因', trigger: 'blur' }
        ],
        disposition: [
          { required: true, message: '请输入处理情况', trigger: 'blur' }
        ]
      },
      errorTypeList: [], // 故障类别
      errorSystemList: [],
      defectLevelList: [], 
      beforeDealDto: [], // 修前照片
      afterDealDto: [], // 修后照片
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
      // immediate:true,
      handler: function(){
        console.log(this.formDataOld)
        this.formData = JSON.parse(JSON.stringify(this.formDataOld))
        this.beforeDealDto = this.formData.beforeDealDto
        this.afterDealDto = this.formData.afterDealDto
        this.$nextTick(()=>{
          this.$emit('resize','collapse7') // 数据改变重新计算父组件高度
        })
      }
    }
  },
  created(){
    this.getErrorType()
    this.getErrorSystem()
    this.getDefectLevel()
  },
  methods: {
    // 获取故障类别
    getErrorType: function(){
      this.$http.fetchGet(`supvDeal/queryFaultType`).then(res=>{
        if(res.code==0&&!this._isDestroyed){
          this.errorTypeList = res.data
        }else{
          this.errorTypeList = []
        }
      })
    },
    // 获取故障部件
    getErrorSystem: function(){
      this.$http.fetchGet(`supvDeal/queryFaultSystem`).then(res=>{
        if(res.code==0&&!this._isDestroyed){
          this.errorSystemList = res.data
        }else{
          this.errorSystemList = []
        }
      })
    },
    // 获取缺陷等级
    getDefectLevel: function(){
      this.$http.fetchGet(`supvDeal/queryDefectLevel`).then(res=>{
        if(res.code==0&&!this._isDestroyed){
          this.defectLevelList = res.data
        }else{
          this.defectLevelList = []
        }
      })
    },
    // 删除服务器图片
    delImg: function(param){
      // console.log(param)
      let data = {
        "commonId": [this[param.keys][param.index].fileId],
        "fileType": param.type
      }
      this.$http.fetch(`supvFile/deleteSupvFile`,data).then(res=>{
        if(res.code==0&&!this._isDestroyed){
          this.$message.success('删除成功！')
          this[param.keys].splice(param.index,1)
        }
      })
    },
    changeImg: function(param){
      // console.log(param,this.formData)
      this[param.keys] = param.files
    },
    close: function(){
      this.dialogVisible = false;
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
        .el-upload-list--picture-card{
          display: inline-block; max-width: calc(100% - 88px); overflow: auto; margin-right: 8px;white-space: nowrap;
          .el-upload-list__item{
            margin-bottom: 0;
            &:last-child{
              margin-right: 0;
            }
          }
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
      &:nth-child(11), &:nth-child(12){
        .el-form-item__content{line-height: 0;}
      }
    }
  }
}
</style>