<!-- 督办单发起列表  计划督办单处理 -->
<template>
  <div class="supervision flex-column">
    <YfDetailsHeader :path="formRoute" isQuery title="处理督办单" print @handlePrint="handlePrint"></YfDetailsHeader>
    <div style="width: 100%; height: 10px; background: #fafafa;overflow: hidden;"></div>
    <div class="flex-1 content flex-column" v-loading="loadingImg" element-loading-text="图片上传中，请不要关闭页面~" element-loading-background="rgba(0, 0, 0, 0.7)">
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
          <stopForm ref="stopForm" :prosessCode="3" :superviseType="superviseType" :procCategoryId="procCategoryId" :formDataOld="lossFormData" @resize="resize"></stopForm>
        </YfCollapse>
        <YfCollapse title="处理过程"  style="padding: 5px 15px 0 7px;" ref="collapse4" key="4" v-if="activeName=='#/step_2'&&superviseType!=1">
          <processingForm ref="processing" :prosessCode="3" :superviseType="superviseType" :procCategoryId="procCategoryId" :formDataOld="processingFormData" @resize="resize"></processingForm>
        </YfCollapse>
        <YfCollapse title="故障信息"  style="padding: 5px 15px 0 7px;" ref="collapse4" key="4" v-if="activeName=='#/step_2'&&superviseType==1&&baseFormData.deviceTypeId == 5">
          <errorInfoTable ref="errorInfoTableForm" :prosessCode="3" :superviseType="superviseType" :procCategoryId="procCategoryId" :formDataOld="errorInfoTableData" @resize="resize" @changeHash="changeHash"></errorInfoTable>
        </YfCollapse>
        <YfCollapse title="故障处理"  style="padding: 5px 15px 0 7px;" ref="collapse7" key="7" v-if="activeName=='#/step_2'&&superviseType==1">
          <errorDealwith ref="errorDealwithForm" :prosessCode="3" :superviseType="superviseType" :procCategoryId="procCategoryId" :formDataOld="errorDealwithData" @resize="resize"></errorDealwith>
        </YfCollapse>
        <!-- <YfCollapse title="联动处理督办单"  style="padding: 5px 15px 0 7px;" ref="collapse5" key="5" v-if="activeName=='#/step_2'">
          <linkageForm :prosessCode="3"></linkageForm>
        </YfCollapse> -->
        <YfCollapse title="部件更换信息"  style="padding: 5px 15px 0 7px;" ref="collapse6" key="6" v-if="activeName=='#/step_2'">
          <partsReplacementForm ref="parts" :prosessCode="3" :superviseType="superviseType" :procCategoryId="procCategoryId" :formDataOld="partsFormData" @resize="resize"></partsReplacementForm>
        </YfCollapse>
        <history v-if="activeName=='#/step_4'" :superviseId="baseFormData.superviseId" :showSearch="isShowSearch"></history>
      </div>
      <div class="contentBottomForm flex-column" v-if="activeName=='#/step_2'">
        <div class="formWrap flex-column">
          <el-form class="formInDispose" :model="supvLinkFormData" label-suffix=":" label-position="left">
            <el-form-item label="督办单处理" prop="type">
              <el-radio-group v-model="supvLinkFormData.type" @change="changeSupvLink(supvLinkFormData.type)">
                <el-radio :label="2">挂起督办单</el-radio>
                <el-radio :label="3">关闭督办单</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="联动关闭督办单" prop="linkSuperviseIds">
              <el-select ref="supvLink" style="width: 360px;" v-model="supvLinkFormData.linkSuperviseIds" multiple collapse-tags placeholder="请选择" :disabled="supvLinkFormData.type!=3"
              @visible-change="showSuperviseList">
                <el-option v-for="item in optionSuperviseList" :key="item.superviseId" :label="item.superviseCode" :value="item.superviseId">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item class="flex-center">
              <a class="rightBtn flex-center" @click="save(false)">
                <span>保存为草稿</span>
              </a>
              <a class="rightBtn primary flex-center" @click="save(true)">
                <span>提交申请</span>
              </a>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </div>
    <el-backtop target=".scrollWrap" :visibility-height="50" :right="20" :bottom="190"></el-backtop>
    <el-dialog title="联动处理督办单" :visible.sync="showMenu2" :close-on-click-modal="false" custom-class="isTitleDialog">
      <div class="formWrap flex-column">
        <div class="tableWrap flex-1" style="width: 100%;">
          <el-table ref="workContent" :data="optionSuperviseList" border style="width: 100%;" height="100%" size="small"
          @select="handleSelect" @select-all="handleSelect" @row-click="handleClick" :key="isSemp">
            <el-table-column type="selection" width="40"></el-table-column>
            <el-table-column type="index" label="序号" width="50"></el-table-column>
            <el-table-column prop="type" label="督办单类型" width="100">
              <template slot-scope="scope">
                <span class="tableCellBtn bgColor1 color1" v-if="scope.row.superviseType==1">故障</span>
                <span class="tableCellBtn bgColor2 color2" v-if="scope.row.superviseType==2">定检</span>
                <span class="tableCellBtn bgColor3 color3" v-if="scope.row.superviseType==3">巡检</span>
                <span class="tableCellBtn bgColor4 color4" v-if="scope.row.superviseType==4">维护</span>
                <span class="tableCellBtn bgColor5 color5" v-if="scope.row.superviseType==5">技改</span>
                <span class="tableCellBtn bgColor6 color6" v-if="scope.row.superviseType==6">临时任务</span>
              </template>
            </el-table-column>
            <el-table-column prop="superviseCategoryName" label="督办单类别" width="110"></el-table-column>
            <el-table-column prop="content" label="工作内容" show-overflow-tooltip :formatter="function(row, column, cellValue){return cellValue||'-'}"></el-table-column>
            <el-table-column prop="planStartTime" label="计划开工时间" width="120"></el-table-column>
            <el-table-column prop="maintainerName" label="检修人" width="100" :formatter="function(row, column, cellValue){return cellValue||'-'}"></el-table-column>
            <el-table-column prop="supvProcStatusName" label="督办单状态" width="140">
              <template slot-scope="scope">
                <div class="flex-center color1" v-if="scope.row.supvProcStatus==4">
                  <span>未开工</span>
                </div>
                <div class="flex-center color4" v-if="scope.row.supvProcStatus==8">
                  <span>挂起中</span>
                </div>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
      <div class="footer flex-center">
        <a class="rightBtn grey flex-center" @click="close2()">
          <span>取消</span>
        </a>
        <a class="rightBtn primary flex-center" @click="saveLink()">
          <span>确定</span>
        </a>
      </div>
    </el-dialog>
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
import history from '@/views/overhaulSupervision/supervisionInitiate/history.vue'
export default {
  components: { baseForm, timelineForm, stopForm, processingForm, errorInfoTable, errorDealwith, partsReplacementForm, history },
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
      resultFormData: {}, // 验收信息
      loading: false,
      loadingImg: false,
      optionSuperviseList: [], // 可以关联的督办单列表
      errorInfoTableData: [], // 故障信息
      errorDealwithData: {}, // 故障处理
      showMenu2: false, // 联动处理督办单
      currentSelectLink: [],
      isSemp: this.$moment().valueOf()
    }
  },
  computed: {
    // ...mapGetters(['formRoute'])
  },
  created(){
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
    console.log(this.formRoute)
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
            this.getSuperviseList()
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
          if(res.data.superviseLinkVos && res.data.superviseLinkVos.length>0){
            let _isLinkIds = []
            res.data.superviseLinkVos.forEach(item=>{
              _isLinkIds.push(item.superviseId)
            })
            this.supvLinkFormData.linkSuperviseIds = _isLinkIds
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
    // 获取可联动关闭的督办单
    getSuperviseList: function(){
      this.$http.fetchGet(`supvDeal/querySuperviseLink?deviceAddressId=${this.baseFormData.deviceAddressId}`).then(res=>{
        if(res.code==0&&!this._isDestroyed){
          this.optionSuperviseList = res.data
        }
      })
    },
    showSuperviseList: function(isShow){
      if(isShow){
        this.showMenu2 = true
        this.isSemp = this.$moment().valueOf()
        this.$refs.supvLink.blur()
        this.$nextTick(()=>{
          this.currentSelectLink = [...this.supvLinkFormData.linkSuperviseIds]
          this.optionSuperviseList.forEach(item=>{
            if(this.supvLinkFormData.linkSuperviseIds.includes(item.superviseId)){
              this.$refs.workContent.toggleRowSelection(item,true)
            }
          })
        })
      }
    },
    close2: function(){
      this.showMenu2 = false
    },
    handleSelect: function(selections){
      this.currentSelectLink = []
      selections.forEach(item=>{
        this.currentSelectLink.push(item.superviseId)
      })
    },
    handleClick: function(row){
      let index = this.currentSelectLink.indexOf(row.superviseId)
      if(index != -1){
        this.currentSelectLink.splice(index,1)
        this.$refs.workContent.toggleRowSelection(row,false)
      }else{
        this.currentSelectLink.push(row.superviseId)
        this.$refs.workContent.toggleRowSelection(row,true)
      }
    },
    saveLink: function(){
      if(this.currentSelectLink.length == 0){
        this.$message.error('请至少选择一条督办单！')
        return
      }
      this.supvLinkFormData.linkSuperviseIds = [...this.currentSelectLink]
      this.showMenu2 = false
    },
    changeSupvLink: function(type){
      if(type != 3){
        this.supvLinkFormData.linkSuperviseIds = []
      }
    },
    handleTabClick: function(tab){
      window.location.hash = tab.name
      this.isShowSearch = false
      if(tab.name == '#/step_2'){
        this.getProcessInfo()
        this.getSuperviseList()
      }
    },
    // 点击菜单
    handlePrint: function(){
      console.log('打印')
      this.$message.info('该功能暂未开放！')
    },
    // 确定指派
    save: function(issure){
      if(!issure){ // 保存草稿
        this.supvLinkFormData.type = 1
      }
      let data = {
        fileList: [], // 所有图片
        supvDealOrderVo: { // 督办单处理
          createAccount: this.userInfo.userAccount,
          superviseId: this.superviseId,
          type: this.supvLinkFormData.type
        },
        supvLinkVo: { // 督办单关联
          linkSuperviseIds: this.supvLinkFormData.linkSuperviseIds,
          superviseId: this.superviseId,
          createAccount: this.userInfo.userAccount,
        }
      }
      let pendingUpload = [] //待上传的文件集合
      // ********************************************* 停机信息，需要判断是否是停机督办单 ******************************
      if(this.baseFormData.isNeedStop){
        data.repairLossInfoEditVo = {
          createAccount: this.userInfo.userAccount,
          lossInfoDtos: []
        }
        let _repairLossInfoEditVo = this.$refs.stopForm.formData
        console.log('停机信息',_repairLossInfoEditVo)
        _repairLossInfoEditVo.vlossInfoList.forEach(item=>{
          data.repairLossInfoEditVo.lossInfoDtos.push({
            leftoverProblem: item.leftoverProblem || '',
            lossInfoId: item.id,
            protectiveStep: item.protectiveStep || '',
            remark: item.remark || '',
            restoringTime: item.restoringTime || ''
          })
        })
      }
      let _replacePartInfoVo = this.$refs.parts.formData
      // *************************************************************************** 处理过程数据 ******************************
      console.log('部件更换',_replacePartInfoVo)
      if(this.superviseType == 6){ // 临时任务
        let _supvPlanEditVo = this.$refs.processing.formData
        data.supvTempEditVo = {
          createAccount: this.userInfo.userAccount,
          disposition: _supvPlanEditVo.disposition || '',
          jobCode: _supvPlanEditVo.jobCode || '',
          tempHandlingId: _supvPlanEditVo.tempHandlingId
        }
        let beforeDealDto = this.$refs.processing.beforeDealDto
        let afterDealDto = this.$refs.processing.afterDealDto
        console.log('临时任务处理照片',beforeDealDto,afterDealDto)
        beforeDealDto.forEach(item=>{
          if(item.fileId){
            data.fileList.push({ commonId: this.superviseId, fileType: 4, name: item.name, repairType: 1, size: item.size, url: item.url })
          }else{
            pendingUpload.push({ commonId: this.superviseId, fileType: 4, name: item.name, repairType: 1, size: item.size, url: item.url, file: item.raw })
          }
        })
        afterDealDto.forEach(item=>{
          if(item.fileId){
            data.fileList.push({ commonId: this.superviseId, fileType: 4, name: item.name, repairType: 2, size: item.size, url: item.url })
          }else{
            pendingUpload.push({ commonId: this.superviseId, fileType: 4, name: item.name, repairType: 2, size: item.size, url: item.url, file: item.raw })
          }
        })
      }
      if(this.superviseType>1 && this.superviseType<6){ // 计划任务
        let _supvPlanEditVo = this.$refs.processing.formData
        data.supvPlanEditVo = {
          createAccount: this.userInfo.userAccount,
          jobCode: _supvPlanEditVo.jobCode || '',
          planHandlingId: _supvPlanEditVo.planHandlingId,
          planWorkEditVos: _supvPlanEditVo.planWorks || [],
          superviseId: this.superviseId
        }
        console.log('计划任务处理照片',_supvPlanEditVo.planWorks)
        _supvPlanEditVo.planWorks.forEach(list=>{
          if(list.planBeforeImages&&list.planBeforeImages.length>0){
            list.planBeforeImages.forEach(before=>{
              if(before.fileId){
                data.fileList.push({ commonId: list.planWorkId, fileType: 3, name: before.name, repairType: 1, size: before.size, url: before.url })
              }else{
                pendingUpload.push({ commonId: list.planWorkId, fileType: 3, name: before.name, repairType: 1, size: before.size, url: before.url, file: before.raw })
              }
            })
          }
          if(list.planAfterImages && list.planAfterImages.length>0){
            list.planAfterImages.forEach(after=>{
              if(after.fileId){
                data.fileList.push({ commonId: list.planWorkId, fileType: 3, name: after.name, repairType: 2, size: after.size, url: after.url })
              }else{
                pendingUpload.push({ commonId: list.planWorkId, fileType: 3, name: after.name, repairType: 2, size: after.size, url: after.url, file: after.raw })
              }
            })
          }
        })
      }
      if(this.superviseType == 1){
        data.repairFaultDto = this.$refs.errorDealwithForm.formData
        data.repairFaultDto.createAccount = this.userInfo.userAccount
        data.repairFaultDto.superviseId = this.superviseId
        let beforeDealDto = this.$refs.errorDealwithForm.beforeDealDto
        let afterDealDto = this.$refs.errorDealwithForm.afterDealDto
        console.log('故障处理照片',beforeDealDto,afterDealDto)
        beforeDealDto.forEach(item=>{
          if(item.fileId){
            data.fileList.push({ commonId: this.superviseId, fileType: 2, name: item.name, repairType: 1, size: item.size, url: item.url })
          }else{
            pendingUpload.push({ commonId: this.superviseId, fileType: 2, name: item.name, repairType: 1, size: item.size, url: item.url, file: item.raw })
          }
        })
        afterDealDto.forEach(item=>{
          if(item.fileId){
            data.fileList.push({ commonId: this.superviseId, fileType: 2, name: item.name, repairType: 2, size: item.size, url: item.url })
          }else{
            pendingUpload.push({ commonId: this.superviseId, fileType: 2, name: item.name, repairType: 2, size: item.size, url: item.url, file: item.raw })
          }
        })
      }
      // ****************************************************************** 备品备件数据 ******************************
      data.replacePartInfoVo = {
        createAccount: this.userInfo.userAccount,
        partsSpareDtoList: _replacePartInfoVo.partsSpareDtoList.filter(item=>item.subjectPartsId) || [],
        superviseId: this.superviseId
      }
      // 备品备件图片
      _replacePartInfoVo.spareFileBeforeDto.forEach(item=>{
        if(item.fileId){
          data.fileList.push({ commonId: this.superviseId, fileType: 6, name: item.name, repairType: 1, size: item.size, url: item.url })
        }else{
          pendingUpload.push({ commonId: this.superviseId, fileType: 6, name: item.name, repairType: 1, size: item.size, url: item.url, file: item.raw })
        }
      })
      _replacePartInfoVo.spareFileAfterDto.forEach(item=>{
        if(item.fileId){
          data.fileList.push({ commonId: this.superviseId, fileType: 6, name: item.name, repairType: 2, size: item.size, url: item.url })
        }else{
          pendingUpload.push({ commonId: this.superviseId, fileType: 6, name: item.name, repairType: 2, size: item.size, url: item.url, file: item.raw })
        }
      })
      if(this.baseFormData.deviceTypeId==4 || this.baseFormData.deviceTypeId==5){ // 风机或箱变有大部件
        data.replacePartInfoVo.partsLargerDtoList = _replacePartInfoVo.partsLargerDtoList.filter(item=>item.largerPartId) || []
        // 大部件图片
        _replacePartInfoVo.largerFileBeforeDto.forEach(item=>{
          if(item.fileId){
            data.fileList.push({ commonId: this.superviseId, fileType: 5, name: item.name, repairType: 1, size: item.size, url: item.url })
          }else{
            pendingUpload.push({ commonId: this.superviseId, fileType: 5, name: item.name, repairType: 1, size: item.size, url: item.url, file: item.raw })
          }
        })
        _replacePartInfoVo.largerFileAfterDto.forEach(item=>{
          if(item.fileId){
            data.fileList.push({ commonId: this.superviseId, fileType: 5, name: item.name, repairType: 2, size: item.size, url: item.url })
          }else{
            pendingUpload.push({ commonId: this.superviseId, fileType: 5, name: item.name, repairType: 2, size: item.size, url: item.url, file: item.raw })
          }
        })
      }
      console.log(data,pendingUpload)
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
              data.fileList.push({...pendingUpload[index],url: item.fileUrl})
            })
            this.$message.success('图片上传成功！')
            console.log(data)
            this.submitLast(data,issure)
          }
        })
      }else{
        this.submitLast(data,issure)
      }
    },
    submitLast: function(data,issure){
      let url
      if(this.superviseType == 1){
        if(this.baseFormData.deviceTypeId == 5){ // 风机故障
          url = `supvHandle/saveOrUpdateSupvFanFaultHandle`
        }else{ // 其它故障
          url = `supvHandle/saveOrUpdateSupvOtherFaultHandle`
        }
      }else if(this.superviseType == 6){ // 临时任务
        url = `supvHandle/saveOrUpdateSupvTempHandleEdit`
      }else{ // 定检，巡检，技改，维护
        url = `supvHandle/saveOrUpdateSupvPlanHandleEdit`
      }
      // return
      this.loading = true
      this.$http.fetch(url,data).then(res=>{
        this.loading = false
        if(res.code==0&&!this._isDestroyed){
          this.$message.success(issure?'提交成功!':'已保存草稿!')
          this.$router.push(JSON.parse(this.formRoute)[0].path)
        }
      })
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
/deep/.isTitleDialog{
  left: 50%; right: auto; top: 50px; width: 1240px; margin-left: -620px; height: 620px;
  .el-dialog__header{
    display: block; padding: 10px 20px; border-bottom: 1px solid #e5e5e5;
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
       height: calc(100% - 80px); margin-bottom: 20px;
    }
  }
  .footer{
    padding-bottom: 20px;
  }
  .el-table{
    .el-table__placeholder{ display: none;}
  }
  
}
</style>