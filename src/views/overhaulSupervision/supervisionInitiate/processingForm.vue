<template>
  <div class="formWrap flex-column">
    <el-form class="formInline" :inline="true" :model="formData"  label-suffix=":" :rules="rules" :disabled="prosessCode!=3">
      <el-form-item label="工作内容" prop="content" style="width: calc(66.7% - 20px);">
        <el-input v-model="formData.content" placeholder="请输入" disabled></el-input>
      </el-form-item>
      <el-form-item label="工作票编号" prop="jobCode">
        <el-input v-model="formData.jobCode" placeholder="请输入"></el-input>
      </el-form-item>
      <el-form-item label="作业内容" style="width: 100%;" v-if="superviseType != 6">
        <el-table ref="workContent" :data="formData.planWorks" border style="width: 100%;" size="medium" @expand-change="handleExpandTable" @row-click="selectionChange">
          <el-table-column type="expand">
            <template slot-scope="scope">
              <el-form label-position="left" :inline="true" class="formInlineTable" label-suffix=":" :disabled="prosessCode!=3">
                <el-form-item label="检修前数值" v-if="superviseType!=3" style="width: calc(50% - 20px);">
                  <el-input v-model="scope.row.beforeValue" placeholder="请输入"></el-input>
                </el-form-item>
                <el-form-item label="检修后数值" v-if="superviseType!=3" style="width: calc(50% - 20px);">
                  <el-input v-model="scope.row.afterValue" placeholder="请输入"></el-input>
                </el-form-item>
                <el-form-item label="检修时数值" v-if="superviseType==3" style="width: calc(100% - 40px);">
                  <el-input v-model="scope.row.afterValue" placeholder="请输入"></el-input>
                </el-form-item>
                <el-form-item label="修前照片" style="width: calc(50% - 20px);" v-if="superviseType!=3">
                  <!-- <el-upload
                    action="https://jsonplaceholder.typicode.com/posts/" :auto-upload="false"
                    list-type="picture-card" :limit="9" :file-list="scope.row.planBeforeImages"
                    :on-preview="(file)=>{ handlePictureCardPreview(file,scope.$index,'planBeforeImages') }"
                    :on-remove="(file, fileList)=>{ handleRemove(file, fileList, scope.$index,'planBeforeImages') }"
                    :on-change="(file, fileList)=>{ handlePictureChange(file, fileList, scope.$index,'planBeforeImages') }">
                    <i class="el-icon-plus"></i>
                  </el-upload> -->
                  <YfUploadImg :imgListOld="scope.row.planBeforeImages" keys="planBeforeImages" :tabindex="scope.$index" :type="3" :idEdit="prosessCode==3" @delImg="delImg" @changeImg="changeImg"></YfUploadImg>
                </el-form-item>
                <el-form-item label="验收照片" style="width: calc(50% - 20px);" v-if="superviseType!=3">
                  <!-- <el-upload
                    action="https://jsonplaceholder.typicode.com/posts/" :auto-upload="false"
                    list-type="picture-card" :limit="9" :file-list="scope.row.planAfterImages"
                    :on-preview="(file)=>{ handlePictureCardPreview(file,scope.$index,'planAfterImages') }"
                    :on-remove="(file, fileList)=>{ handleRemove(file, fileList, scope.$index,'planBeforeImages') }"
                    :on-change="(file, fileList)=>{ handlePictureChange(file, fileList, scope.$index,'planBeforeImages') }">
                    <i class="el-icon-plus"></i>
                  </el-upload> -->
                  <YfUploadImg :imgListOld="scope.row.planAfterImages" keys="planAfterImages" :tabindex="scope.$index" :type="3" :idEdit="prosessCode==3" @delImg="delImg" @changeImg="changeImg"></YfUploadImg>
                </el-form-item>
                <el-form-item label="检修时照片" style="width: calc(100% - 40px);" v-if="superviseType==3">
                  <!-- <el-upload
                    action="https://jsonplaceholder.typicode.com/posts/" :auto-upload="false"
                    list-type="picture-card" :limit="9" :file-list="scope.row.planAfterImages"
                    :on-preview="(file)=>{ handlePictureCardPreview(file,scope.$index,'planAfterImages') }"
                    :on-remove="(file, fileList)=>{ handleRemove(file, fileList, scope.$index,'planBeforeImages') }"
                    :on-change="(file, fileList)=>{ handlePictureChange(file, fileList, scope.$index,'planBeforeImages') }">
                    <i class="el-icon-plus"></i>
                  </el-upload> -->
                  <YfUploadImg :imgListOld="scope.row.planAfterImages" keys="planAfterImages" :tabindex="scope.$index" :type="3" :idEdit="prosessCode==3" @delImg="delImg" @changeImg="changeImg"></YfUploadImg>
                </el-form-item>
                <el-form-item label="是否有缺陷" prop="isDefect">
                  <el-radio-group v-model="scope.row.isDefect" @change="changeIsDefect(scope.row)">
                    <el-radio :label="1">是</el-radio>
                    <el-radio :label="0">否</el-radio>
                  </el-radio-group>
                </el-form-item>
                <el-form-item label="缺陷描述" prop="defectDescription" style="width: calc(66.7% - 20px);">
                  <el-input v-model="scope.row.defectDescription" placeholder="请输入" :disabled="!scope.row.isDefect"></el-input>
                </el-form-item>
                <el-form-item label="处理情况" style="width: 100%;" prop="description">
                  <el-input type="textarea" :rows="3" placeholder="请输入处理情况" v-model="scope.row.description"></el-input>
                </el-form-item>
              </el-form>
            </template>
          </el-table-column>
          <el-table-column type="index" label="序号" width="55"></el-table-column>
          <el-table-column prop="addressName" label="设备位置" :formatter="function(row, column, cellValue){return cellValue||'-'}"></el-table-column>
          <el-table-column prop="position" label="检修部位" :formatter="function(row, column, cellValue){return cellValue||'-'}"></el-table-column>
          <el-table-column prop="content" label="检修内容" :formatter="function(row, column, cellValue){return cellValue||'-'}"></el-table-column>
          <el-table-column prop="standard" label="检修标准" :formatter="function(row, column, cellValue){return cellValue||'-'}"></el-table-column>
          <el-table-column prop="remark" label="备注" :formatter="function(row, column, cellValue){return cellValue||'-'}"></el-table-column>
          <el-table-column label="操作" width="100" v-if="false">
            <template slot-scope="scope">
              <a class="blue">移除{{scope.$index}}</a>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item label="作业内容" prop="jobContent" style="width: calc(66.7% - 20px);" v-if="superviseType == 6">
        <el-input type="textarea" :rows="3" v-model="formData.jobContent" placeholder="请输入" disabled></el-input>
      </el-form-item>
      <el-form-item label="处理情况" prop="disposition" style="width: calc(66.7% - 20px);" v-if="superviseType == 6">
        <el-input type="textarea" :rows="3" v-model="formData.disposition" placeholder="请输入"></el-input>
      </el-form-item>
      <el-form-item class="tempPic" label="修前照片" style="width: calc(50% - 20px);" v-if="superviseType == 6">
        <!-- <el-upload
          action="https://jsonplaceholder.typicode.com/posts/" :auto-upload="false"
          list-type="picture-card" :limit="9" :file-list="beforeDealDto"
          :on-preview="(file)=>{ handlePictureCardPreview(file, 'beforeDealDto') }"
          :on-remove="(file, fileList)=>{ handleRemove(file, fileList, 'beforeDealDto') }"
          :on-change="(file, fileList)=>{ handlePictureChange(file, fileList, 'beforeDealDto') }">
          <i class="el-icon-plus"></i>
        </el-upload> -->
        <YfUploadImg :imgListOld="beforeDealDto" keys="beforeDealDto" :type="4" :idEdit="prosessCode==3" @delImg="delImg" @changeImg="changeImg"></YfUploadImg>
      </el-form-item>
      <el-form-item class="tempPic" label="验收照片" style="width: calc(50% - 20px);" v-if="superviseType == 6">
        <!-- <el-upload
          action="https://jsonplaceholder.typicode.com/posts/" :auto-upload="false"
          list-type="picture-card" :limit="9" :file-list="afterDealDto"
          :on-preview="(file)=>{ handlePictureCardPreview(file, 'afterDealDto') }"
          :on-remove="(file, fileList)=>{ handleRemove(file, fileList, 'afterDealDto') }"
          :on-change="(file, fileList)=>{ handlePictureChange(file, fileList, 'afterDealDto') }">
          <i class="el-icon-plus"></i>
        </el-upload> -->
        <YfUploadImg :imgListOld="afterDealDto" keys="afterDealDto" :type="4" :idEdit="prosessCode==3" @delImg="delImg" @changeImg="changeImg"></YfUploadImg>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
// type文件类型: 1.督办单附件 2.故障处理 3.计划处理过程 4.临时处理 5.大部件更换 6.备品备件
export default {
  data(){
    return {
      formData: JSON.parse(JSON.stringify(this.formDataOld)),
      rules: {},
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
      immediate:true,
      handler: function(){
        this.formData = JSON.parse(JSON.stringify(this.formDataOld))
        if(this.formData.planWorks && this.formData.planWorks.length>0){
          this.formData.planWorks.forEach(item=>{
            item.isDefect = item.isDefect || 0
          })
        }
        if(this.superviseType == 6){
          this.beforeDealDto = this.formData.beforeDealDto
          this.afterDealDto = this.formData.afterDealDto
        }
        this.$nextTick(()=>{
          this.$emit('resize','collapse4') // 数据改变重新计算父组件高度
        })
      }
    }
  },
  created(){},
  methods: {
    // 展开表格项
    handleExpandTable: function(){
      this.$emit('resize','collapse4')
    },
    selectionChange: function(row){
      console.log(row)
      this.$refs.workContent.toggleRowExpansion(row)
    },
    // 删除服务器图片
    delImg: function(param){
      console.log(param)
      let data = {
        "commonId": [param.type==4?this[param.keys][param.index].fileId:this.formData.planWorks[param.tabindex][param.keys][param.index].fileId],
        "fileType": param.type
      }
      this.$http.fetch(`supvFile/deleteSupvFile`,data).then(res=>{
        if(res.code==0&&!this._isDestroyed){
          this.$message.success('删除成功！')
          if(param.type==4){
            this[param.keys].splice(param.index,1)
          }else{
            this.formData.planWorks[param.tabindex][param.keys].splice(param.index,1)
          }
        }
      })
    },
    changeImg: function(param){
      console.log(param,this.formData)
      if(param.type==4){
        this[param.keys] = param.files
      }else{
        this.formData.planWorks[param.tabindex][param.keys] = param.files
      }
    },
    // 切换是否有缺陷
    changeIsDefect: function(row){
      console.log(row)
      if(!row.isDefect){
        row.defectDescription = ''
      }
    },
    close: function(){
      this.dialogVisible = false;
    },
    onSubmit: function(){
      
    },
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
          .formInlineTable{
            padding: 10px 25px 0;display: flex;flex-wrap: wrap;
            .el-form-item{
              margin-bottom: 20px;text-align: left;
            }
            .el-form-item:nth-child(1){
              width: 100%; text-align: left;
            }
            // .el-form-item:nth-child(2){
            //   .el-form-item__content{ line-height: 0; }
            //   .el-upload-list--picture-card .el-upload-list__item{margin-bottom: 0;}
            // }
            // .el-upload--picture-card{
            //   width: 80px;height: 80px;line-height: 84px;
            // }
            // .el-upload-list__item{
            //   width: 80px;height: 80px;
            //   .el-upload-list__item-status-label{
            //     width: 42px;min-width: unset;right: -14px;top: -2px;height: 20px;
            //     i{margin-top: 0; margin-left: 15px;}
            //   }
            // }
          }
        }
        // .el-upload{
        //   .icon-fujian{margin-top: 1px;margin-right: 5px;}
        // }
        // .el-upload-list{
        //   .el-upload-list__item:first-child{margin-top: 0;}
        //   .el-upload-list__item{background-color:#f5f7fa}
        // }
      }
    }
    /deep/.tempPic{
      .el-form-item__content{ overflow: hidden; }
    }
  }
}
</style>