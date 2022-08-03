<!-- 督办单发起列表  计划督办单发起 -->
<template>
  <div class="supervision flex-column">
    <YfDetailsHeader :path="formRoute" isQuery title="设备位置"></YfDetailsHeader>
    <div style="width: 100%; height: 10px; background: #fafafa;overflow: hidden;"></div>
    <div class="flex-1 content flex-column" v-loading="loadingImg" element-loading-text="附件上传中，请不要关闭页面~" element-loading-background="rgba(0, 0, 0, 0.7)">
      <div class="contentTop flex-vCenter">
        <i class="yfFont icon-biaotiqian"></i>
        <h4>设备位置详情</h4>
        <div class="flex-1"></div>
        <el-button type="primary" size="small">同步</el-button>
      </div>
      <div class="flex-1 scrollWrap" style="overflow: auto;"  v-loading="loading" element-loading-background="rgba(0, 0, 0, 0)">
        <el-form ref="form1" class="formInline" :inline="true" :model="formData"  label-suffix=":" :rules="rules">
          <h2>位置信息</h2>
          <el-form-item label="所属场站" prop="plantId">
            <el-select v-model="formData.plantId" placeholder="请选择场站">
              <el-option :label="item.plantName" :value="item.plantId" v-for="item in plantList" :key="item.plantId"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="上级位置名称" prop="parentAddressCode">
            <el-input v-model="formData.parentAddressCode" placeholder="-" disabled></el-input>
          </el-form-item>
          <el-form-item label="上级位置编码" prop="parentAddressName">
            <el-input v-model="formData.parentAddressName" placeholder="-" disabled></el-input>
          </el-form-item>
          <el-form-item label="位置名称" prop="addressName">
            <el-input maxlength="50" v-model="formData.addressName" placeholder="请输入"></el-input>
          </el-form-item>
          <el-form-item label="位置编码" prop="addressCode">
            <el-input maxlength="50" v-model="formData.addressCode" placeholder="请输入"></el-input>
          </el-form-item>
          <el-form-item label="设备类型" prop="deviceTypeId">
            <el-select v-model="formData.deviceTypeId" placeholder="请选择设备位置">
              <el-option :label="item.deviceTypeName" :value="item.deviceTypeId" v-for="item in deviceTypeList" :key="item.deviceTypeId"></el-option>
            </el-select>
          </el-form-item>
          <h2>资产信息</h2>
          <el-form-item label="生产厂家" prop="manufacturer">
            <el-input maxlength="50" v-model="formData.manufacturer" placeholder="请输入"></el-input>
          </el-form-item>
          <el-form-item label="规格型号" prop="specificationModel">
            <el-input maxlength="50" v-model="formData.specificationModel" placeholder="请输入"></el-input>
          </el-form-item>
          <el-form-item label="设备名称" prop="deviceName">
            <el-input maxlength="50" v-model="formData.deviceName" placeholder="请输入"></el-input>
          </el-form-item>
          <el-form-item label="设备型号" prop="deviceModel">
            <el-input maxlength="50" v-model="formData.deviceModel" placeholder="请输入"></el-input>
          </el-form-item>
          <el-form-item label="出厂日期" prop="releaseDate">
            <el-date-picker type="date" placeholder="选择时间" v-model="formData.releaseDate" value-format="yyyy-MM-dd"></el-date-picker>
          </el-form-item>
          <el-form-item label="出厂编号" prop="identificationNumber">
            <el-input maxlength="50" v-model="formData.identificationNumber" placeholder="请输入"></el-input>
          </el-form-item>
          <el-form-item label="投运日期" prop="commissioningDate">
            <el-date-picker type="date" placeholder="选择时间" v-model="formData.commissioningDate" value-format="yyyy-MM-dd"></el-date-picker>
          </el-form-item>
          <el-form-item label="备注" prop="remark" style="width: calc(66.7% - 20px)">
            <el-input maxlength="200" v-model="formData.remark" placeholder="请输入"></el-input>
          </el-form-item>
          <h2>扩展信息</h2>
          <el-tabs v-model="activeName" type="card">
            <el-tab-pane label="扩展属性" name="first">
              <el-table :data="attributeList" border style="width: 100%;" size="small" :span-method="arraySpanMethod">
                <el-table-column type="index" label="序号" width="55">
                  <template slot-scope="scope">
                    <span v-if="scope.$index">{{scope.$index}}</span>
                    <div class="flex-center blue" v-else style="width: 100%;" @click="showWorkListDialog">
                      <i class="yfFont icon-tianjiazuoyeneirong"></i>
                      <span style="cursor: pointer;">新增属性</span>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column prop="attributeCode" label="属性编码"></el-table-column>
                <el-table-column prop="attributeName" label="属性名称"></el-table-column>
                <el-table-column prop="attributeValue" label="属性值"></el-table-column>
                <el-table-column prop="remark" label="备注" :formatter="function(row, column, cellValue){return cellValue||'-'}"></el-table-column>
                <el-table-column label="操作" width="100">
                  <template slot-scope="scope">
                    <div class="flex-center blue">
                      <a @click="editDevice(scope.row)">修改</a>
                      <el-divider direction="vertical"></el-divider>
                      <a @click="delDevice(scope.row)">移除</a>
                    </div>
                  </template>
                </el-table-column>
              </el-table>
            </el-tab-pane>
            <el-tab-pane label="设备照片" name="second">
              <div class="fileContent">
                <YfUploadImg :imgListOld="formData.imageList" keys="imageList" :type="6" idEdit @delImg="delImg" @changeImg="changeImg"></YfUploadImg>
              </div>
            </el-tab-pane>
            <el-tab-pane label="文档资料" name="third">
              <div class="fileContent">
                <YfUploadFile :imgListOld="formData.fileList" idEdit @delFile="delFile" @changeFile="changeFile"></YfUploadFile>
              </div>
            </el-tab-pane>
          </el-tabs>
        </el-form>
      </div>
      <div class="contentBottom flex-center">
        <a class="rightBtn flex-center" @click="save(0)">
          <span>取消</span>
        </a>
        <a class="rightBtn primary flex-center" @click="save(1)">
          <span>保存</span>
        </a>
      </div>
    </div>
    <el-backtop target=".scrollWrap" :visibility-height="50" :right="20" :bottom="110"></el-backtop>
  </div>
</template>

<script>
// import {mapGetters} from 'vuex'
import baseForm from '@/views/overhaulSupervision/supervisionInitiate/baseForm.vue'
export default {
  components: { baseForm },
  data(){
    return {
      formRoute: window.sessionStorage.getItem('formRoute'),
      userInfo: JSON.parse(window.sessionStorage.getItem('userInfo')),
      formData: {
        "addressCode": "",
        "addressName": "",
        "attributeList": [],
        "commissioningDate": "",
        "deviceAddressId": null,
        "deviceModel": "",
        "deviceName": "",
        "deviceTypeId": null,
        "deviceTypeName": "",
        "fileList": [],
        "identificationNumber": "",
        "imageList": [],
        "manufacturer": "",
        "parentAddressCode": "",
        "parentAddressName": "",
        "parentId": null,
        "plantId": null,
        "plantName": "",
        "releaseDate": "",
        "remark": "",
        "specificationModel": ""
      },
      attributeList: [{}], // 扩展属性,第一行新增按钮
      loading: false,
      loadingImg: false,
      rules: {
        addressName: [
          { required: true, message: '请输入位置名称！', trigger: 'blur' },
        ],
        addressCode: [
          { required: true, message: '请输入位置编码！', trigger: 'blur' },
        ]
      },
      plantList: [],
      deviceTypeList: [],
      activeName: 'first'
    }
  },
  computed: {
    // ...mapGetters(['formRoute'])
  },
  created(){
    // console.log(this.$route)
    this.parentId = this.$route.query.parentId || 0
    this.deviceAddressId = this.$route.query.deviceAddressId || null
  },
  mounted(){
    this.getBaseInfo()
  },
  methods: {
    arraySpanMethod: function({ rowIndex, columnIndex }){
      if (rowIndex === 0) {
        if (columnIndex === 0) {
          return [1, 7];
        } else{
          return [0, 0];
        }
      }
    },
    getBaseInfo: function(){
      if(this.plantId){ // 根据风场id和督办单类别获取设备信息
        let data = {
          plantId: this.plantId,
          superviseCategory: this.superviseCategory
        }
        this.$http.fetch(`supervise/querySuperviseCategoryForDetail`,data).then(res=>{
          if(res.code==0&&!this._isDestroyed){
            this.baseFormData = {...this.baseFormData,...res.data}
            this.superviseType = res.data.superviseType
            this.procCategoryId = res.data.procCategoryId
            // console.log(this.baseFormData)
          }
        })
      }
      if(this.superviseId){ // 根据督办单id获取详情
        this.$http.fetchGet(`supervise/querySuperviseById?superviseId=${this.superviseId}`).then(res=>{
          if(res.code==0&&!this._isDestroyed){
            this.baseFormData = {...res.data}
            this.superviseType = res.data.superviseType
            this.procCategoryId = res.data.procCategoryId
            this.formData.superviseId = res.data.superviseId
            console.log(this.baseFormData)
          }
        })
      }
    },
    showWorkListDialog: function(){},
    // 删除服务器文件
    delFile: function(param){
      console.log(param)
      let data = {
        "commonId": [this.formData.fileList[param.index].fileId],
        "fileType": 1
      }
      this.$http.fetch(`supvFile/deleteSupvFile`,data).then(res=>{
        if(res.code==0&&!this._isDestroyed){
          this.$message.success('删除成功！')
          this.formData.fileList.splice(param.index,1)
          this.$nextTick(()=>{
            this.$emit('resize','collapse1') // 数据改变重新计算父组件高度
          })
        }
      })
    },
    changeFile: function(param){
      console.log(param,this.formData)
      this.formData.fileList = param.files
      this.$nextTick(()=>{
        this.$emit('resize','collapse1') // 数据改变重新计算父组件高度
      })
    },
    save: function(type){
      // console.log(type, this.$refs.baseForm.formData)
      if(type){
        this.$refs.baseForm.$refs.form1.validate((valid) => {
          if (valid) {
            let data = JSON.parse(JSON.stringify(this.$refs.baseForm.formData))
            data.type = type
            let fileList = [], pendingUpload = [], allFileList = this.$refs.baseForm.formData.fileList
            allFileList.forEach(item=>{
              if(item.fileId){
                fileList.push({ commonId: this.patrolId, fileType: 1, name: item.name, size: item.size, url: item.url })
              }else{
                pendingUpload.push({ commonId: this.patrolId, fileType: 1, name: item.name, size: item.size, url: item.url, file: item.raw })
              }
            })
            console.log(allFileList)
            if(pendingUpload.length>0){
              this.loadingImg = true
              let pendingUploadUrls = new FormData()
              pendingUpload.forEach(item=>{
                // pendingUploadUrls.push(item.file)
                pendingUploadUrls.append("file", item.file); // append增加数据
              })
              console.log(pendingUploadUrls)
              this.$http.upload(`supvFile/uploadSupvFile`,pendingUploadUrls).then(res=>{
                this.loadingImg = false
                if(res.code==0&&!this._isDestroyed){
                  res.data.forEach((item,index)=>{
                    fileList.push({...pendingUpload[index],url: item.fileUrl})
                  })
                  this.$message.success('附件上传成功！')
                  data.fileList = fileList
                  this.submitLast(data)
                }
              })
            }else{
              this.submitLast(data)
            }
          } else {
            return false;
          }
        });
      }else{
        let data = JSON.parse(JSON.stringify(this.$refs.baseForm.formData))
        data.type = type
        let fileList = [], pendingUpload = [], allFileList = this.$refs.baseForm.formData.fileList
        allFileList.forEach(item=>{
          if(item.fileId){
            fileList.push({ commonId: this.patrolId, fileType: 1, name: item.name, size: item.size, url: item.url })
          }else{
            pendingUpload.push({ commonId: this.patrolId, fileType: 1, name: item.name, size: item.size, url: item.url, file: item.raw })
          }
        })
        console.log(allFileList)
        if(pendingUpload.length>0){
          this.loadingImg = true
          let pendingUploadUrls = new FormData()
          pendingUpload.forEach(item=>{
            // pendingUploadUrls.push(item.file)
            pendingUploadUrls.append("file", item.file); // append增加数据
          })
          console.log(pendingUploadUrls)
          this.$http.upload(`supvFile/uploadSupvFile`,pendingUploadUrls).then(res=>{
            this.loadingImg = false
            if(res.code==0&&!this._isDestroyed){
              res.data.forEach((item,index)=>{
                fileList.push({...pendingUpload[index],url: item.fileUrl})
              })
              this.$message.success('附件上传成功！')
              data.fileList = fileList
              this.submitLast(data)
            }
          })
        }else{
          this.submitLast(data)
        }
      }
    },
    submitLast: function(data){
      let url
      if(this.superviseId){
        url = `supervise/addTempSuperviseOrderAgain`
      }else{
        url = `supervise/addTempSuperviseOrderAgain`
      }
      this.loading = true
      this.$http.fetch(url,data).then(res=>{
        this.loading = false
        if(res.code==0&&!this._isDestroyed){
          this.$message.success('创建成功!')
          this.$router.go(-1)
        }
      })
    },
    goPage(){},
  }
}
</script>

<style scoped lang="less">
.statusWrap{
  font-size: 14px;color: #666;margin-left: 85px;
  .name{
    margin-right: 10px;
  }
  .status{
    height: 30px;width: 80px;border-radius: 3px;line-height: 30px;text-align: center;
  }
}
.scrollWrap{
  width: 100%; padding: 15px 0 0 20px;
  .formInline{
    display: flex; flex-wrap: wrap;
    h2{width: 100%;font-size: 16px;color: #409EFF;font-weight: normal;line-height: 42px;}
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
        }
        .el-upload{
          .icon-fujian{margin-top: 1px;margin-right: 5px;}
        }
        .el-upload-list{
          .el-upload-list__item:first-child{margin-top: 0;}
          .el-upload-list__item{background-color:#f5f7fa}
        }
      }
    }
    /deep/.el-tabs{
      width: calc(100% - 20px);
      .el-tabs__nav{
        margin-left: 0;
      }
      .el-tabs__header{margin: 0;}
      .fileContent{
        border: 1px solid #e5e5e5; border-top: none; padding: 15px;
      }
    }
  }
}
</style>