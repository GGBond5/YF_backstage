<template>
  <div class="formWrap flex-column" :class="{notLimit: prosessCode!=3}">
    <el-form class="formInline" :inline="true" :model="formData" label-suffix=":" label-width="100px" :disabled="prosessCode!=3">
      <el-form-item label="大部件更换" style="width: 100%;" v-if="deviceTypeIdShowMax">
        <el-table :data="formData.partsLargerDtoList" border style="width: 100%;" size="medium" :span-method="arraySpanMethod">
          <el-table-column type="index" label="序号" width="55" v-if="prosessCode==3">
            <template slot-scope="scope">
              <span v-if="scope.$index">{{scope.$index}}</span>
              <div class="flex-center blue" v-else style="width: 100%;" @click="showLargerPartDialog">
                <i class="yfFont icon-tianjiazuoyeneirong"></i>
                <span style="cursor: pointer;">添加大部件更换记录</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="largerPartName" label="大部件名称" width="220"></el-table-column>
          <el-table-column prop="sourceModel" label="原部件品牌及型号" width="220">
            <template slot-scope="scope">
              <div class="tableEditWrap flex-center" v-if="editRemarkIndex!='sourceModel'+scope.$index" @click.stop="showInput('sourceModel',scope.$index)">
                <span class="textBox flex-1">{{scope.row.sourceModel||'-'}}</span>
                <a class="blue yfFont icon-bianji" title="点击编辑"></a>
              </div>
              <el-input class="editInp" v-model="scope.row.sourceModel"  v-if="editRemarkIndex=='sourceModel'+scope.$index" v-focus
                @blur="hideInput(scope.row)"></el-input>
            </template>
          </el-table-column>
          <el-table-column prop="targetModel" label="更换部件品牌及型号" width="220">
            <template slot-scope="scope">
              <div class="tableEditWrap flex-center" v-if="editRemarkIndex!='targetModel'+scope.$index" @click.stop="showInput('targetModel',scope.$index)">
                <span class="textBox flex-1">{{scope.row.targetModel||'-'}}</span>
                <a class="blue yfFont icon-bianji" title="点击编辑"></a>
              </div>
              <el-input class="editInp" v-model="scope.row.targetModel"  v-if="editRemarkIndex=='targetModel'+scope.$index" v-focus
                @blur="hideInput(scope.row)"></el-input>
            </template>
          </el-table-column>
          <el-table-column prop="replaceNum" label="更换数量" width="160">
            <template slot-scope="scope">
              <el-input-number v-model="scope.row.replaceNum" :min="1" size="small"></el-input-number>
            </template>
          </el-table-column>
          <el-table-column prop="remark" label="备注" show-overflow-tooltip>
            <template slot-scope="scope">
              <div class="tableEditWrap flex-center" v-if="editRemarkIndex!='remark'+scope.$index" @click.stop="showInput('remark',scope.$index)">
                <span class="textBox flex-1">{{scope.row.remark||'-'}}</span>
                <a class="blue yfFont icon-bianji" title="点击编辑"></a>
              </div>
              <el-input class="editInp" v-model="scope.row.remark"  v-if="editRemarkIndex=='remark'+scope.$index" v-focus
                @blur="hideInput(scope.row)"></el-input>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="100" v-if="prosessCode==3">
            <template slot-scope="scope">
              <a class="blue" @click="delWork(scope.$index,'partsLargerDtoList')">移除</a>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item label="大部件更换前照片" style="width: calc(50% - 20px);" v-if="deviceTypeIdShowMax">
        <!-- <el-upload
          action="https://jsonplaceholder.typicode.com/posts/" :http-request="uploadFile"
          list-type="picture-card" :limit="9" :file-list="largerFileBeforeDto"
          :on-preview="(file)=>{ handlePictureCardPreview(file, 'largerFileBeforeDto') }"
          :on-remove="(file, fileList)=>{ handleRemove(file, fileList, 'largerFileBeforeDto') }"
          :on-change="(file, fileList)=>{ handlePictureChange(file, fileList, 'largerFileBeforeDto') }">
          <i class="el-icon-plus"></i>
        </el-upload> -->
        <YfUploadImg :imgListOld="formData.largerFileBeforeDto" keys="largerFileBeforeDto" :type="5" :idEdit="prosessCode==3" @delImg="delImg" @changeImg="changeImg"></YfUploadImg>
      </el-form-item>
      <el-form-item label="大部件更换后照片" style="width: calc(50% - 20px);" v-if="deviceTypeIdShowMax">
        <!-- <el-upload
          action="https://jsonplaceholder.typicode.com/posts/" :http-request="uploadFile"
          list-type="picture-card" :limit="9" :file-list="largerFileAfterDto"
          :on-preview="(file)=>{ handlePictureCardPreview(file, 'largerFileAfterDto') }"
          :on-remove="(file, fileList)=>{ handleRemove(file, fileList, 'largerFileAfterDto') }"
          :on-change="(file, fileList)=>{ handlePictureChange(file, fileList, 'largerFileAfterDto') }">
          <i class="el-icon-plus"></i>
        </el-upload> -->
        <YfUploadImg :imgListOld="formData.largerFileAfterDto" keys="largerFileAfterDto" :type="5" :idEdit="prosessCode==3" @delImg="delImg" @changeImg="changeImg"></YfUploadImg>
      </el-form-item>
      <el-form-item :label="`${deviceTypeIdShowMax?'备品备件':'部件'}更换`" style="width: 100%;">
        <el-table :data="formData.partsSpareDtoList" border style="width: 100%;" size="medium" :span-method="arraySpanMethod">
          <el-table-column type="index" label="序号" width="55" v-if="prosessCode==3">
            <template slot-scope="scope">
              <span v-if="scope.$index">{{scope.$index}}</span>
              <div class="flex-center blue" v-else style="width: 100%;" @click="showSpareFileDialog">
                <i class="yfFont icon-tianjiazuoyeneirong"></i>
                <span style="cursor: pointer;">添加{{deviceTypeIdShowMax?'备品备件':'部件'}}更换记录</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="partsName" :label="`${deviceTypeIdShowMax?'备品备件':'部件'}名称`" width="220"></el-table-column>
          <el-table-column prop="sourceModel" label="原部件品牌及型号" width="220">
            <template slot-scope="scope">
              <div class="tableEditWrap flex-center" v-if="editSourceIndex!='sourceModel'+scope.$index" @click.stop="showInput1('sourceModel',scope.$index)">
                <span class="textBox flex-1">{{scope.row.sourceModel||'-'}}</span>
                <a class="blue yfFont icon-bianji" title="点击编辑"></a>
              </div>
              <el-input class="editInp" v-model="scope.row.sourceModel"  v-if="editSourceIndex=='sourceModel'+scope.$index" v-focus
                @blur="hideInput1(scope.row)"></el-input>
            </template>
          </el-table-column>
          <el-table-column prop="targetModel" label="更换部件品牌及型号" width="220">
            <template slot-scope="scope">
              <div class="tableEditWrap flex-center" v-if="editSourceIndex!='targetModel'+scope.$index" @click.stop="showInput1('targetModel',scope.$index)">
                <span class="textBox flex-1">{{scope.row.targetModel||'-'}}</span>
                <a class="blue yfFont icon-bianji" title="点击编辑"></a>
              </div>
              <el-input class="editInp" v-model="scope.row.targetModel"  v-if="editSourceIndex=='targetModel'+scope.$index" v-focus
                @blur="hideInput1(scope.row)"></el-input>
            </template>
          </el-table-column>
          <el-table-column prop="replaceNum" label="更换数量" width="160">
            <template slot-scope="scope">
              <el-input-number v-model="scope.row.replaceNum" :min="1" size="small"></el-input-number>
            </template>
          </el-table-column>
          <el-table-column prop="remark" label="备注" show-overflow-tooltip>
            <template slot-scope="scope">
              <div class="tableEditWrap flex-center" v-if="editSourceIndex!='remark'+scope.$index" @click.stop="showInput1('remark',scope.$index)">
                <span class="textBox flex-1">{{scope.row.remark||'-'}}</span>
                <a class="blue yfFont icon-bianji" title="点击编辑"></a>
              </div>
              <el-input class="editInp" v-model="scope.row.remark"  v-if="editSourceIndex=='remark'+scope.$index" v-focus
                @blur="hideInput1(scope.row)"></el-input>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="100" v-if="prosessCode==3">
            <template slot-scope="scope">
              <a class="blue" @click="delWork(scope.$index,'partsSpareDtoList')">移除</a>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item :label="`${deviceTypeIdShowMax?'备品备件':'部件'}更换前照片`" style="width: calc(50% - 20px);">
        <!-- <el-upload
          action="https://jsonplaceholder.typicode.com/posts/" :http-request="uploadFile"
          list-type="picture-card" :limit="9" :file-list="spareFileBeforeDto"
          :on-preview="(file)=>{ handlePictureCardPreview(file, 'spareFileBeforeDto') }"
          :on-remove="(file, fileList)=>{ handleRemove(file, fileList, 'spareFileBeforeDto') }"
          :on-change="(file, fileList)=>{ handlePictureChange(file, fileList, 'spareFileBeforeDto') }">
          <i class="el-icon-plus"></i>
        </el-upload> -->
        <YfUploadImg :imgListOld="formData.spareFileBeforeDto" keys="spareFileBeforeDto" :type="6" :idEdit="prosessCode==3" @delImg="delImg" @changeImg="changeImg"></YfUploadImg>
      </el-form-item>
      <el-form-item :label="`${deviceTypeIdShowMax?'备品备件':'部件'}更换后照片`" style="width: calc(50% - 20px);">
        <!-- <el-upload
          action="https://jsonplaceholder.typicode.com/posts/" :http-request="uploadFile"
          list-type="picture-card" :limit="9" :file-list="spareFileAfterDto"
          :on-preview="(file)=>{ handlePictureCardPreview(file, 'spareFileAfterDto') }"
          :on-remove="(file, fileList)=>{ handleRemove(file, fileList, 'spareFileAfterDto') }"
          :on-change="(file, fileList)=>{ handlePictureChange(file, fileList, 'spareFileAfterDto') }">
          <i class="el-icon-plus"></i>
        </el-upload> -->
        <YfUploadImg :imgListOld="formData.spareFileAfterDto" keys="spareFileAfterDto" :type="6" :idEdit="prosessCode==3" @delImg="delImg" @changeImg="changeImg"></YfUploadImg>
      </el-form-item>
    </el-form>
    <el-dialog title="大部件更换记录" :visible.sync="showMenu1" :close-on-click-modal="false" custom-class="isTitleDialog1">
      <div class="formWrap flex-column">
        <el-select v-model="selectLargePart" value-key="largerPartId" multiple filterable collapse-tags placeholder="请选择">
          <el-option v-for="item in optionsLargePart" :key="item.largerPartId" :label="item.largerPartName" :value="item"></el-option>
        </el-select>
      </div>
      <div class="footer flex-center">
        <a class="rightBtn grey flex-center" @click="close()">
          <span>取消</span>
        </a>
        <a class="rightBtn primary flex-center" @click="saveLargePart()">
          <span>确定</span>
        </a>
      </div>
    </el-dialog>
    <el-dialog :title="`${deviceTypeIdShowMax?'备品备件':'部件'}更换记录`" :visible.sync="showMenu2" :close-on-click-modal="false" custom-class="isTitleDialog1">
      <div class="formWrap flex-column">
        <!-- <el-cascader-panel :options="optionsLargePart" filterable placeholder="输入关键字" :props="propsTypeCascader"></el-cascader-panel> -->
        <el-cascader v-model="selectSpareFile" placeholder="搜索关键字" :options="optionsSpareFile" :props="propsTypeCascader" filterable collapse-tags
        :show-all-levels="false"></el-cascader>
      </div>
      <div class="footer flex-center">
        <a class="rightBtn grey flex-center" @click="close()">
          <span>取消</span>
        </a>
        <a class="rightBtn primary flex-center" @click="saveSpareFile()">
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
    return {
      formData: JSON.parse(JSON.stringify(this.formDataOld)),
      deviceTypeIdShowMax: true, // 是否为风机或箱变
      propsTypeCascader: {
        emitPath: false,
        value: 'id',
        label: 'name',
        multiple: true
      },
      showMenu1: false,
      optionsLargePart: [],
      selectLargePart: [],
      showMenu2: false,
      optionsSpareFile: [],
      selectSpareFile: [], // 当前选中备品备件id集合
      selectSpareFileObj: {}, // 当前选中备品备件id，list键值对
      editRemarkIndex: '',
      editSourceIndex: ''
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
        if(this.prosessCode==3){
          this.formData.partsSpareDtoList = [{},...this.formData.partsSpareDtoList]
          this.formData.partsLargerDtoList = [{},...this.formData.partsLargerDtoList]
        }
        this.deviceTypeIdShowMax = this.formData.deviceTypeId == 5 || this.formData.deviceTypeId == 4 ? true : false
        this.$nextTick(()=>{
          this.$emit('resize','collapse6') // 数据改变重新计算父组件高度
        })
      }
    }
  },
  created(){},
  methods: {
    arraySpanMethod: function({ rowIndex, columnIndex }){
      if (rowIndex === 0 && this.prosessCode==3) {
        if (columnIndex === 0) {
          return [1, 7];
        } else{
          return [0, 0];
        }
      }
    },
    // 删除服务器图片
    delImg: function(param){
      console.log(param)
      let data = {
        "commonId": [this.formData[param.keys][param.index].fileId],
        "fileType": param.type
      }
      this.$http.fetch(`supvFile/deleteSupvFile`,data).then(res=>{
        if(res.code==0&&!this._isDestroyed){
          this.$message.success('删除成功！')
          this.formData[param.keys].splice(param.index,1)
        }
      })
    },
    changeImg: function(param){
      console.log(param,this.formData)
      this.formData[param.keys] = param.files
    },
    // 获取所有大部件
    getLargerPart: function(){
      this.$http.fetchGet(`supvDeal/queryLargerParts?deviceTypeId=${this.formData.deviceTypeId}`).then(res=>{
        if(res.code==0&&!this._isDestroyed){
          this.optionsLargePart = res.data
          this.selectLargePart = []
          this.optionsLargePart.forEach((item,index)=>{
            let _data = this.formData.partsLargerDtoList.filter(value=>value.largerPartId==item.largerPartId)
            let dataCommon = {sourceModel: '',targetModel: '',replaceNum: 1,remark:''}
            if(_data.length>0){
              this.optionsLargePart[index] = {..._data[0]}
              this.selectLargePart.push({..._data[0]})
            }else{
              this.optionsLargePart[index] = {...item,...dataCommon}
            }
          })
          // console.log(this.optionsLargePart)
        }else{
          this.optionsLargePart = []
        }
      })
    },
    // 获取所有备品备件
    getSpareFile: function(){
      this.$http.fetchGet(`supvDeal/querySpareParts?deviceTypeId=${this.formData.deviceTypeId}`).then(res=>{
        if(res.code==0&&!this._isDestroyed){
          this.optionsSpareFile = res.data
        }else{
          this.optionsSpareFile = []
        }
      })
    },
    showLargerPartDialog: function(){
      this.showMenu1 = true
      this.getLargerPart()
    },
    showSpareFileDialog: function(){
      // 记录父页面数据
      this.selectSpareFileObj = {}
      this.selectSpareFile = []
      this.formData.partsSpareDtoList.forEach(item=>{
        if(item.subjectPartsId){ // 排除prosessCode==3时手动加的编辑空项
          this.selectSpareFileObj[item.subjectPartsId] = item
          this.selectSpareFile.push(item.subjectPartsId)
        }
      })
      this.showMenu2 = true
      this.getSpareFile()
    },
    // 编辑备注
    showInput: function(rowName,index){
      this.editRemarkIndex = rowName+index
    },
    hideInput: function(){
      this.editRemarkIndex = null
    },
    // 编辑备注
    showInput1: function(rowName,index){
      this.editSourceIndex = rowName+index
    },
    hideInput1: function(){
      this.editSourceIndex = null
    },
    saveLargePart: function(){
      console.log(this.selectLargePart)
      this.formData.partsLargerDtoList = this.prosessCode==3?[{},...this.selectLargePart] : this.selectLargePart
      this.showMenu1 = false
      this.$nextTick(()=>{
        this.$emit('resize','collapse6') // 数据改变重新计算父组件高度
      })
    },
    saveSpareFile: function(){
      console.log(this.selectSpareFile)
      let _SpareFile = []
      let dataCommon = {sourceModel: '',targetModel: '',replaceNum: 1,remark:''}
      this.selectSpareFile.forEach(item=>{
        if(this.selectSpareFileObj[item]){
          _SpareFile.push(this.selectSpareFileObj[item])
        }else{
          _SpareFile.push({subjectPartsId: item, partsName: this.filterSpareFileName(item),...dataCommon})
        }
      })
      this.formData.partsSpareDtoList = this.prosessCode==3?[{},..._SpareFile] : _SpareFile
      console.log(this.formData.partsSpareDtoList)
      this.showMenu2 = false
      this.$nextTick(()=>{
        this.$emit('resize','collapse6') // 数据改变重新计算父组件高度
      })
    },
    filterSpareFileName: function(id){
      let _name = ''
      this.optionsSpareFile.forEach(child=>{
        child.children.forEach(item=>{
          if(item.id == id){
            _name = item.name
          }
        })
      })
      return _name
    },
    delWork: function(index,key){
      this.formData[key].splice(index,1)
    },
    close: function(){
      this.showMenu1 = false
      this.showMenu2 = false
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
        .el-table{
          line-height: 23px;
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
      &:nth-child(2){
        .el-form-item__content{line-height: 0;}
      }
      &:nth-child(2), &:nth-child(3), &:nth-child(4), &:nth-child(5), &:nth-child(6), &:nth-child(8){
        >label{line-height: 20px;padding: 10px 12px 10px 0;}
      }
    }
  }
}
/deep/.isTitleDialog1{
  left: 50%; right: auto; top: 140px; width: 400px; margin-left: -200px; height: 185px;
  .el-dialog__header{
    display: block; padding: 10px 20px;
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
       height: calc(100% - 60px); padding: 20px;
    }
  }
  .footer{
    padding-bottom: 20px;
  }
  
}
</style>