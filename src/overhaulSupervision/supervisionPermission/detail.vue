<!-- 督办单发起列表  计划督办单开工批准和验收 -->
<template>
  <div class="supervision flex-column">
    <YfDetailsHeader :path="formRoute" isQuery title="验收督办单" print @handlePrint="handlePrint"></YfDetailsHeader>
    <div style="width: 100%; height: 10px; background: #fafafa;overflow: hidden;"></div>
    <div class="flex-1 content flex-column">
      <el-tabs class="orderTabs" v-model="activeName" @tab-click="handleTabClick">
        <el-tab-pane label="督办单" name="#/step_1">
        </el-tab-pane>
        <el-tab-pane label="检修过程" name="#/step_2">
        </el-tab-pane>
        <el-tab-pane label="设备文档" name="#/step_3">
        </el-tab-pane>
        <el-tab-pane label="检修历史" name="#/step_4">
        </el-tab-pane>
      </el-tabs>
      <div class="flex-1 scrollWrap" style="overflow: auto;" v-loading="loading" element-loading-background="rgba(0, 0, 0, 0)">
        <YfCollapse title="基础信息"  style="padding: 5px 15px 0 7px;" ref="collapse1" key="1" v-if="activeName=='#/step_1'">
          <baseForm ref="baseForm" :prosessCode="4" :superviseType="superviseType" :procCategoryId="procCategoryId" :formDataOld="baseFormData" @resize="resize"></baseForm>
        </YfCollapse>
        <YfCollapse title="流转过程"  style="padding: 5px 15px 0 7px;" ref="collapse2" key="2" v-if="activeName=='#/step_1'">
          <div class="statusWrap flex-center" slot="status">
            <span class="name">当前状态：</span>
            <span class="status color1 bgColor1 brColor1" v-if="baseFormData.supvProcStatus==4 || baseFormData.supvProcStatus==7">{{baseFormData.supvProcStatusName}}</span>
            <span class="status color3 bgColor3 brColor3" v-if="baseFormData.supvProcStatus==1 || baseFormData.supvProcStatus==2 || baseFormData.supvProcStatus==3">{{baseFormData.supvProcStatusName}}</span>
            <span class="status color4 bgColor4 brColor4" v-if="baseFormData.supvProcStatus==5 || baseFormData.supvProcStatus==6 || baseFormData.supvProcStatus==8">{{baseFormData.supvProcStatusName}}</span>
            <span class="status color5 bgColor5 brColor5" v-if="baseFormData.supvProcStatus==9">{{baseFormData.supvProcStatusName}}</span>
          </div>
          <timelineForm :superviseId="superviseId" @resize="resize"></timelineForm>
        </YfCollapse>
        <YfCollapse title="停机信息"  style="padding: 5px 15px 0 7px;" ref="collapse3" key="3" v-if="activeName=='#/step_2'&&baseFormData.isNeedStop">
          <stopForm ref="stopForm" :prosessCode="4" :superviseType="superviseType" :procCategoryId="procCategoryId" :formDataOld="lossFormData" @resize="resize"></stopForm>
        </YfCollapse>
        <YfCollapse title="处理过程"  style="padding: 5px 15px 0 7px;" ref="collapse4" key="4" v-if="activeName=='#/step_2'&&superviseType!=1">
          <processingForm ref="processing" :prosessCode="4" :superviseType="superviseType" :procCategoryId="procCategoryId" :formDataOld="processingFormData" @resize="resize"></processingForm>
        </YfCollapse>
        <YfCollapse title="故障信息"  style="padding: 5px 15px 0 7px;" ref="collapse4" key="4" v-if="activeName=='#/step_2'&&superviseType==1&&baseFormData.deviceTypeId == 5">
          <errorInfoTable ref="errorInfoTableForm" :prosessCode="4" :superviseType="superviseType" :procCategoryId="procCategoryId" :formDataOld="errorInfoTableData" @resize="resize" @changeHash="changeHash"></errorInfoTable>
        </YfCollapse>
        <YfCollapse title="故障处理"  style="padding: 5px 15px 0 7px;" ref="collapse7" key="7" v-if="activeName=='#/step_2'&&superviseType==1">
          <errorDealwith ref="errorDealwithForm" :prosessCode="4" :superviseType="superviseType" :procCategoryId="procCategoryId" :formDataOld="errorDealwithData" @resize="resize"></errorDealwith>
        </YfCollapse>
        <!-- <YfCollapse title="联动处理督办单"  style="padding: 5px 15px 0 7px;" ref="collapse5" key="5" v-if="activeName=='#/step_2'">
          <linkageForm :prosessCode="3"></linkageForm>
        </YfCollapse> -->
        <YfCollapse title="部件更换信息"  style="padding: 5px 15px 0 7px;" ref="collapse6" key="6" v-if="activeName=='#/step_2'">
          <partsReplacementForm ref="parts" :prosessCode="4" :superviseType="superviseType" :procCategoryId="procCategoryId" :formDataOld="partsFormData" @resize="resize"></partsReplacementForm>
        </YfCollapse>
        <YfCollapse title="督办单处理结果"  style="padding: 5px 15px 0 7px;" ref="collapse8" key="8" v-if="activeName=='#/step_2'&&baseFormData.supvProcStatus>=6">
          <resultForm ref="result" :prosessCode="2" :superviseType="superviseType" :procCategoryId="procCategoryId" :formDataOld="resultFormData" @resize="resize"></resultForm>
        </YfCollapse>
        <history v-if="activeName=='#/step_4'" :superviseId="baseFormData.superviseId" :showSearch="isShowSearch"></history>
      </div>
      <div class="contentBottomForm flex-column" v-if="activeName=='#/step_2'">
        <div class="formWrap flex-column">
          <el-form class="formInDispose" :model="formData" label-suffix=":" label-width="88px" label-position="left">
            <el-form-item label="审核结果" prop="inspectType">
              <el-radio-group v-model="formData.inspectType">
                <el-radio :label="1" v-if="procCategoryId==61||procCategoryId==64">验收通过并申请场站验收</el-radio>
                <el-radio :label="1" v-if="procCategoryId==62||procCategoryId==65">验收通过并申请部门验收</el-radio>
                <el-radio :label="2" v-if="procCategoryId==61||procCategoryId==62||procCategoryId==63">验收通过并挂起</el-radio>
                <el-radio :label="2" v-if="procCategoryId==64||procCategoryId==65||procCategoryId==66">验收通过并关闭</el-radio>
                <el-radio :label="3">验收不通过</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="意见或建议">
              <el-input type="textarea" :rows="3" maxlength="50" placeholder="请输入" v-model="formData.remark"></el-input>
            </el-form-item>
            <el-form-item class="flex-center">
              <a class="rightBtn flex-center" @click="save()">
                <span>取消</span>
              </a>
              <a class="rightBtn primary flex-center" @click="save(true)">
                <span>提交</span>
              </a>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </div>
    <el-backtop target=".scrollWrap" :visibility-height="50" :right="20" :bottom="250"></el-backtop>
  </div>
</template>

<script>
// import {mapGetters} from 'vuex'
import baseForm from '@/views/overhaulSupervision/supervisionInitiate/baseForm.vue'
import timelineForm from '@/views/overhaulSupervision/supervisionInitiate/timelineForm.vue'
import stopForm from '@/views/overhaulSupervision/supervisionInitiate/stopForm.vue'
import processingForm from '@/views/overhaulSupervision/supervisionInitiate/processingForm.vue'
import errorInfoTable from '@/views/overhaulSupervision/supervisionInitiate/errorInfoTable.vue'
import errorDealwith from '@/views/overhaulSupervision/supervisionInitiate/errorDealwith.vue'
// import linkageForm from '@/views/overhaulSupervision/supervisionInitiate/linkageForm.vue'
import partsReplacementForm from '@/views/overhaulSupervision/supervisionInitiate/partsReplacementForm.vue'
import resultForm from '@/views/overhaulSupervision/supervisionInitiate/resultForm.vue'
import history from '@/views/overhaulSupervision/supervisionInitiate/history.vue'
export default {
  components: { baseForm, timelineForm, stopForm, processingForm, errorInfoTable, errorDealwith, partsReplacementForm, history, resultForm },
  data(){
    return {
      formRoute: window.sessionStorage.getItem('formRoute'),
      userInfo: JSON.parse(window.sessionStorage.getItem('userInfo')),
      activeName: '',
      superviseCategory: null, // 设备类别编码
      superviseType: null, // 类型
      procCategoryId: null, // 状态细分编码
      baseFormData: {},
      lossFormData: {}, // 停机信息
      processingFormData: {}, // 处理过程信息
      supvLinkFormData: {
        type: 3,
        linkSuperviseIds: []
      }, // 督办单联动信息
      partsFormData: {
        spareFileBeforeDto: [],
        spareFileAfterDto: [],
        largerFileBeforeDto: [],
        largerFileAfterDto: [],
        partsSpareDtoList: [],
        partsLargerDtoList: [],
        deviceTypeId: 5
      }, // 更换部件信息
      resultFormData: {
        linkSupervise: [],
        operationTime: '',
        userAccount: "",
        userName: "",
      }, // 验收信息
      loading: false,
      formData: {
        inspectType: 2,
        remark: ''
      },
      errorInfoTableData: [], // 故障信息
      errorDealwithData: {}, // 故障处理
    }
  },
  computed: {
    // ...mapGetters(['formRoute'])
  },
  created(){
    console.log(this.$route)
    this.superviseId = this.$route.query.superviseId // 通过督办单id查找
    this.activeName = location.hash||this.$route.query.isStep||'#/step_1'
    if(this.$route.query.isStep == '#/step_4'){
      this.isShowSearch = true
    }
    if(!location.hash){
      window.location.hash = this.activeName
    }
  },
  mounted(){
    if(this.superviseId){
      this.getBaseInfo()
    }
    console.log(JSON.parse(window.sessionStorage.getItem('userInfo')))
  },
  methods: {
    getBaseInfo: function(){
      this.$http.fetchGet(`supervise/querySuperviseById?superviseId=${this.superviseId}`).then(res=>{
        if(res.code==0&&!this._isDestroyed){
          this.baseFormData = res.data
          this.superviseType = res.data.superviseType
          this.procCategoryId = res.data.procCategoryId
          // this.resize('collapse1')
          if(this.activeName == '#/step_2'){
            this.getProcessInfo()
          }
        }
      })
    },
    // 获取检修过程
    getProcessInfo: function(){
      let url
      if(this.superviseType == 1){
        if(this.baseFormData.deviceTypeId == 5){ // 风机故障
          url = `supvHandle/querySupvFanFaultHandleBySupvId`
        }else{ // 其它故障
          url = `supvHandle/querySupvOtherFaultHandleBySupvId`
        }
      }else if(this.superviseType == 6){ // 临时任务
        url = `supvHandle/querySupvTempHandleBySupvId`
      }else{ // 定检，巡检，技改，维护
        url = `supvHandle/querySupvPlanHandleBySupvId`
      }
      this.$http.fetchGet(`${url}?superviseId=${this.superviseId}`).then(res=>{
        if(res.code==0&&!this._isDestroyed){
          this.lossFormData = res.data.repairLossInfoVo
          this.processingFormData = this.superviseType == 6 ? res.data.supvTempVo : res.data.planHandlingVo
          if(this.superviseType == 6){
            this.processingFormData.beforeDealDto = res.data.beforeDealDto
            this.processingFormData.afterDealDto = res.data.afterDealDto
          }
          this.partsFormData = {...res.data.replacePartInfoVo, spareFileBeforeDto: res.data.spareFileBeforeDto, spareFileAfterDto: res.data.spareFileAfterDto,deviceTypeId: this.baseFormData.deviceTypeId}
          if(this.baseFormData.deviceTypeId == 5 || this.baseFormData.deviceTypeId == 4){ // 风机和箱变
            this.partsFormData.largerFileBeforeDto = res.data.largerFileBeforeDto
            this.partsFormData.largerFileAfterDto = res.data.largerFileAfterDto
          }
          this.resultFormData = {
            isSupvLink: this.baseFormData.isSupvLink,
            applyContent: this.baseFormData.applyContent,
            operationTime: res.data.supvLinkDto.operationTime,
            userAccount: res.data.supvLinkDto.userAccount,
            userName: res.data.supvLinkDto.userName,
            linkSupervise: this.baseFormData.isSupvLink == 1? res.data.supvLinkDto.mainSupervise : res.data.supvLinkDto.linkSupervise
          }
          if(this.superviseType == 1){
            this.errorDealwithData = res.data.repairFaultDto
            this.errorDealwithData.beforeDealDto = res.data.beforeDealDto
            this.errorDealwithData.afterDealDto = res.data.afterDealDto
            if(this.baseFormData.deviceTypeId == 5){
              this.errorInfoTableData = res.data.faultInfoDtoList
            }
          }
        }
      })
    },
    handleTabClick: function(tab){
      window.location.hash = tab.name
      this.isShowSearch = false
      if(tab.name == '#/step_2'){
        this.getProcessInfo()
      }
    },
    // 点击菜单
    handlePrint: function(){
      console.log('打印')
      this.$message.info('该功能暂未开放！')
    },
    // 验收
    save: function(issure){
      if(issure){
        let depart = { 61: 1, 62: 2, 63: 3, 64: 1, 65: 2, 66: 3 }
        let data = {
          createAccount: this.userInfo.userAccount,
          depType: depart[this.baseFormData.procCategoryId],
          inspectType: this.formData.inspectType,
          remark: this.formData.remark,
          superviseId: this.superviseId
        }
        let url
        if(this.baseFormData.procCategoryId<64){
          url = `supvDeal/suspensionInspect`
        }else{
          url = `supvDeal/closeInspect`
        }
        this.$http.fetch(url,data).then(res=>{
          this.loading = false
          if(res.code==0&&!this._isDestroyed){
            this.$message.success('操作成功！')
            this.$router.push(JSON.parse(this.formRoute)[0].path)
          }
        })
      }else{
        this.$router.push(JSON.parse(this.formRoute)[0].path)
      }
    },
    resize: function(param){
      // console.log(param)
      this.$refs[param].settingDefaultShow()
    },
    changeHash: function(){
      window.location.hash = '#/step_4'
      this.isShowSearch = true
      this.activeName = '#/step_4'
    }
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