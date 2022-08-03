<!-- 督办单发起列表  计划督办单发起 -->
<template>
  <div class="supervision flex-column">
    <YfDetailsHeader :path="formRoute" isQuery :title="`新建${typeName[superviseType]}计划策略`"></YfDetailsHeader>
    <div style="width: 100%; height: 10px; background: #fafafa;overflow: hidden;"></div>
    <div class="flex-1 content flex-column" v-loading="loadingImg" element-loading-text="附件上传中，请不要关闭页面~" element-loading-background="rgba(0, 0, 0, 0.7)">
      <div class="contentTop flex-vCenter">
        <i class="yfFont icon-biaotiqian"></i>
        <h4>风机{{typeName[superviseType]}}策略详情</h4>
        <div class="flex-1"></div>
      </div>
      <div class="flex-1 scrollWrap" style="overflow: auto;padding: 10px 25px;">
        <p style="font-size: 16px;line-height: 40px;color: #38AEF3;">基础信息</p>
        <baseForm ref="baseForm" :formDataOld="baseFormData"></baseForm>
      </div>
      <div class="contentBottom flex-center">
        <a class="rightBtn flex-center" @click="save(false)">
          <span>取消</span>
        </a>
        <a class="rightBtn primary flex-center" @click="save(true)">
          <span>生成计划策略</span>
        </a>
      </div>
    </div>
    <el-backtop target=".scrollWrap" :visibility-height="50" :right="20" :bottom="110"></el-backtop>
  </div>
</template>

<script>
// import {mapGetters} from 'vuex'
import baseForm from '@/views/overhaulSupervision/supervisionPlan/baseForm.vue'
export default {
  components: { baseForm },
  data(){
    return {
      formRoute: window.sessionStorage.getItem('formRoute'),
      superviseType: null,
      plantId: null,
      superviseCategory: null,
      typeName: {
        2: '定检',
        3: '巡检'
      },
      baseFormData: {
        "content": "",
        "createAccount": JSON.parse(window.sessionStorage.getItem('userInfo')).userAccount,
        "departmentId": null,
        "deviceAddressIds": [],
        "deviceTypeId": null,
        "fileList": [],
        "generatedDay": null,
        "isNeedStop": true,
        "planCycleNum": null,
        "planCycleType": null,
        "planDays": null,
        "planTaskPatrolVoList": [],
        "plantId": null,
        "superviseCategory": null,
        "supervisorId": null
      },
      loadingImg: false
    }
  },
  computed: {
    // ...mapGetters(['formRoute'])
  },
  created(){
    this.superviseCategory = this.$route.query.superviseCategory || '' // 创建，通过督办单类别
    this.plantId = this.$route.query.plantId || ''
    this.patrolId = this.$route.query.patrolId // 通过督办单id查找
  },
  mounted(){
    this.getBaseInfo()
  },
  methods: {
    // 点击菜单
    handlePrint: function(){
      console.log('打印')
      this.$message.info('该功能暂未开放！')
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
          }
        })
      }
      if(this.patrolId){ // 根据督办单id获取详情
        this.$http.fetchGet(`patrol/queryPlanPatrolByPatrolId?patrolId=${this.patrolId}`).then(res=>{
          if(res.code==0&&!this._isDestroyed){
            this.baseFormData = {...res.data[0].vplanPatrolDto, planTaskPatrolVoList: res.data[0].vplanTaskList||[],fileList: res.data[0].planPatrolFileList}
            this.superviseType = this.baseFormData.superviseType
            console.log(this.baseFormData)
          }
        })
      }
    },
    // 确定提交
    save: function(issure){
      if(issure){
        this.$refs.baseForm.$refs.form1.validate((valid) => {
          if (valid) {
            let _formData = JSON.parse(JSON.stringify(this.$refs.baseForm.formData))
            if(_formData.planTaskPatrolVoList.length==0){
              this.$message.error('作业内容不能为空！')
              return
            }
            let fileList = [], pendingUpload = [], allFileList = this.$refs.baseForm.formData.fileList
            allFileList.forEach(item=>{
              if(item.fileId){
                fileList.push({ commonId: this.patrolId, fileType: 7, name: item.name, size: item.size, url: item.url })
              }else{
                pendingUpload.push({ commonId: this.patrolId, fileType: 7, name: item.name, size: item.size, url: item.url, file: item.raw })
              }
            })
            // console.log(allFileList)
            if(pendingUpload.length>0){
              this.loadingImg = true
              let pendingUploadUrls = new FormData()
              pendingUpload.forEach(item=>{
                // pendingUploadUrls.push(item.file)
                pendingUploadUrls.append("file", item.file); // append增加数据
              })
              // console.log(pendingUploadUrls)
              this.$http.upload(`supvFile/uploadSupvFile`,pendingUploadUrls).then(res=>{
                this.loadingImg = false
                if(res.code==0&&!this._isDestroyed){
                  res.data.forEach((item,index)=>{
                    fileList.push({...pendingUpload[index],url: item.fileUrl})
                  })
                  this.$message.success('附件上传成功！')
                  _formData.fileList = fileList
                  this.submitLast(_formData)
                }
              })
            }else{
              this.submitLast(_formData)
            }
          } else {
            return false;
          }
        });
      }else{
        this.$router.push(JSON.parse(this.formRoute)[0].path)
      }
    },
    submitLast: function(data){
      let url
      if(this.patrolId){
        url = `patrol/updatePlanTask`
      }else{
        url = `patrol/addPlanTask`
      }
      this.loading = true
      this.$http.fetch(url,data).then(res=>{
        this.loading = false
        if(res.code==0&&!this._isDestroyed){
          this.$message.success(this.patrolId?'保存成功!':'新建成功!')
          this.$router.push(JSON.parse(this.formRoute)[0].path)
        }
      })
    },
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
</style>