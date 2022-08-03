<template>
  <div class="search flex-vCenter">
    <!-- 可选择类型选择器 -->
    <div class="timeWrap flex-vCenter" v-if="itemList.includes('dateType')">
      <label>时间选择：</label>
      <span class="timeBtn" :class="{active: timeActive=='date'}" @click="handleChangeTimeType('date')">日</span>
      <span class="timeBtn" :class="{active: timeActive=='week'}" @click="handleChangeTimeType('week')">周</span>
      <span class="timeBtn" :class="{active: timeActive=='month'}" @click="handleChangeTimeType('month')">月</span>
      <span class="timeBtn" :class="{active: timeActive=='year'}" @click="handleChangeTimeType('year')">年</span>
      <span class="timeBtn" :class="{active: timeActive=='daterange'}" @click="handleChangeTimeType('daterange')">自定义</span>
      <el-date-picker style="width: 165px;" v-model="timeThis" :type="timeActive" align="left" size="medium" :clearable="false" :key="timeKey" 
      placeholder="开始日期" value-format="yyyy-MM-dd" :format="timeFormat[timeActive]" :picker-options="{firstDayOfWeek:1}" v-if="timeActive!='daterange'"></el-date-picker>
      <el-date-picker style="width: 260px;" v-model="timeFilterThis" type="daterange" align="left" unlink-panels range-separator="至" size="medium" 
      :clearable="false" start-placeholder="开始日期" end-placeholder="结束日期" value-format="yyyy-MM-dd" v-else></el-date-picker>
    </div>
    <!-- end -->
    <!-- 时间选择 单选天 -->
    <div class="timeWrap flex-vCenter" v-if="itemList.includes('date')">
      <label>选择时间：</label>
      <el-date-picker style="width: 165px;" size="medium" v-model="timeThis" :clearable="false" :type="timeActive" placeholder="选择时间" 
      :picker-options="{firstDayOfWeek:1}" value-format="yyyy-MM-dd" :format="timeFormat[timeActive]" @change="timeChange(timeThis)"></el-date-picker>
    </div>
    <!-- 统计对象 风场多选-->
    <div class="timeWrap flex-vCenter" v-if="itemList.includes('plants')">
      <label>统计对象：</label>
      <el-select style="width: 190px;" size="medium" v-model="plantCodes" multiple collapse-tags clearable placeholder="全公司">
        <el-option v-for="item in optionsPlant" :key="item.plantId" :label="item.plantName" :value="item.plantId"></el-option>
      </el-select>
    </div>
    <!-- 所属场站 风场单选-->
    <div class="timeWrap flex-vCenter" v-if="itemList.includes('plant')">
      <label>所属场站：</label>
      <el-select style="width: 140px;" size="medium" v-model="plantCode" :clearable="!userInfo.singlePlantFlag" placeholder="全部" @change="plantSelect" :disabled="checkDis">
        <el-option v-for="item in optionsPlant" :key="item.plantId" :label="item.plantName" :value="item.plantId"></el-option>
      </el-select>
    </div>
    <!-- 督办单类型 级联选择-->
    <div class="timeWrap flex-vCenter" v-if="itemList.includes('orderTypeCascader')">
      <label>督办单类型：</label>
      <el-cascader style="width: 230px;" v-model="typeCascaderCode" size="medium" placeholder="全部" collapse-tags :key="timeSep"
      :options="optionsTypeCascader" :props="propsTypeCascader" clearable></el-cascader>
    </div>
    <!-- 督办单全部类型/类别 级联选择-->
    <div class="timeWrap flex-vCenter" v-if="itemList.includes('orderTypeCascaderAll')">
      <label>督办单类型：</label>
      <el-cascader style="width: 230px;" v-model="typeCascaderCode" size="medium" placeholder="全部" collapse-tags :key="timeSep"
      :options="optionsTypeCascaderAll" :props="propsTypeCascader" clearable></el-cascader>
    </div>
    <!-- 计划策略类型/类别 级联选择-->
    <div class="timeWrap flex-vCenter" v-if="itemList.includes('orderTypeCascaderPlan')">
      <label>计划类型/类别：</label>
      <el-cascader style="width: 230px;" v-model="typeCascaderCodePlan" size="medium" placeholder="全部" collapse-tags :key="timeSep"
      :options="optionsTypeCascaderPlan" :props="propsTypeCascader" clearable></el-cascader>
    </div>
    <!-- 停机记录类型/类别 级联选择-->
    <div class="timeWrap flex-vCenter" v-if="itemList.includes('stopTypeCascader')">
      <label>停机类型/类别：</label>
      <el-cascader style="width: 240px;" v-model="stoptypeCascaderCode" size="medium" placeholder="全部" collapse-tags :key="timeSep"
      :options="optionsStopTypeCascader" :props="propsStopTypeCascader" clearable></el-cascader>
    </div>
    <!-- 督办单状态 -->
    <div class="timeWrap flex-vCenter" v-if="itemList.includes('orderStatus')">
      <label>督办单状态：</label>
      <el-select style="width: 150px;" v-model="orderStatus" placeholder="全部" clearable size="medium">
        <el-option v-for="item in optionsStatus" :key="item.supvProcStatus" :label="item.supvProcStatusName" :value="item.supvProcStatus"></el-option>
      </el-select>
    </div>
    <!-- 停机状态 -->
    <div class="timeWrap flex-vCenter" v-if="itemList.includes('stopStatus')">
      <label>状态：</label>
      <el-select style="width: 120px;" v-model="stopStatus" placeholder="全部" clearable size="medium">
        <el-option v-for="item in optionsStopStatus" :key="item.value" :label="item.name" :value="item.value"></el-option>
      </el-select>
    </div>
    <!-- 负责人 -->
    <div class="timeWrap flex-vCenter" v-if="itemList.includes('director')">
      <label>负责人：</label>
      <el-select style="width: 100px;" v-model="directorCode"  clearable placeholder="全部" size="medium">
        <el-option v-for="item in directorList" :key="item.code" :label="item.name" :value="item.code"></el-option>
      </el-select>
    </div>
    <!-- end -->
    <!-- 生产运营指标 查询指标 -->
    <div class="timeWrap flex-vCenter" v-if="itemList.includes('queryNormal')">
      <label>查询指标：</label>
      <el-select style="width: 140px;" v-model="queryNormalCode"  clearable placeholder="全部" size="medium">
        <el-option v-for="item in optionsQueryNormal" :key="item.code" :label="item.name" :value="item.code"></el-option>
      </el-select>
    </div>
    <!-- end -->
    <!-- 项目管理 项目类型 -->
    <div class="timeWrap flex-vCenter" v-if="itemList.includes('projectType')">
      <label>项目类型：</label>
      <el-select style="width: 100px;" v-model="projectType"  clearable placeholder="全部" size="medium">
        <el-option v-for="item in optionsProjectType" :key="item.projectType" :label="item.projectTypeName" :value="item.projectType"></el-option>
      </el-select>
    </div>
    <!-- 项目管理 预算科目 -->
    <div class="timeWrap flex-vCenter" v-if="itemList.includes('budgetCategory')">
      <label>预算科目：</label>
      <el-select style="width: 120px;" v-model="budgetCategory"  clearable placeholder="全部" size="medium">
        <el-option v-for="item in optionsBudgetCategory" :key="item.budgetCode" :label="item.budgetCodeName" :value="item.budgetCode"></el-option>
      </el-select>
    </div>
    <!-- 项目管理 项目进度 -->
    <div class="timeWrap flex-vCenter" v-if="itemList.includes('projectProgress')">
      <label>项目进度：</label>
      <el-select style="width: 140px;" v-model="projectProgress"  clearable placeholder="全部" size="medium">
        <el-option v-for="item in optionsProjectProgress" :key="item.projectProgress" :label="item.projectProgressName" :value="item.projectProgress"></el-option>
      </el-select>
    </div>
    <!-- 采购计划 项目状态 -->
    <div class="timeWrap flex-vCenter" v-if="itemList.includes('projectStatus')">
      <label>项目状态：</label>
      <el-select style="width: 120px;" v-model="projectStatus"  clearable placeholder="全部" size="medium">
        <el-option v-for="item in optionsProjectStatus" :key="item.auditStatus" :label="item.auditStatusName" :value="item.auditStatus"></el-option>
      </el-select>
    </div>
    <!-- 时间范围 -->
    <div class="timeWrap flex-vCenter" v-if="itemList.includes('timeRange')">
      <label>时间选择：</label>
      <div class="flex-vCenter" v-if="itemList.includes('timeShortcuts')">
        <span class="timeBtn timeBtnMax" :class="{active: timeActive=='nearMonth'}" @click="handleChangeTimeType('nearMonth')">近一月</span>
        <span class="timeBtn timeBtnMax" :class="{active: timeActive=='currentMonth'}" @click="handleChangeTimeType('currentMonth')">当月</span>
      </div>
      <el-date-picker style="width: 260px;" v-model="timeFilterThis" type="daterange" align="left" unlink-panels range-separator="至" size="medium" 
      :clearable="false" start-placeholder="开始日期" end-placeholder="结束日期" value-format="yyyy-MM-dd"></el-date-picker>
    </div>
    <!-- end -->
    <!-- 年月日范围选择 -->
    <div class="timeWrap flex-vCenter" v-if="itemList.includes('dateTypeRange')">
      <label>{{timeTypeName?timeTypeName:'时间类型：'}}</label>
      <div class="flex-vCenter" v-if="itemList.includes('timeShortcuts')">
        <span class="timeBtn timeBtnMax" :class="{active: timeActive=='daterange'}" @click="handleChangeTimeType('daterange')">日统计</span>
        <span class="timeBtn timeBtnMax" :class="{active: timeActive=='monthrange'}" @click="handleChangeTimeType('monthrange')">月统计</span>
        <span class="timeBtn timeBtnMax" :class="{active: timeActive=='year'}" @click="handleChangeTimeType('year')">年统计</span>
      </div>
      <el-date-picker style="width: 165px;" v-model="timeThis" type="year" align="left" size="medium" :clearable="false" :key="timeKey" 
      placeholder="开始日期" value-format="yyyy-MM-dd" :format="timeFormat.year" v-if="timeActive=='year'"></el-date-picker>
      <el-date-picker style="width: 260px;" v-model="timeFilterThis" :type="timeActive" align="left" unlink-panels range-separator="至" size="medium" 
      :clearable="false" start-placeholder="开始日期" end-placeholder="结束日期" value-format="yyyy-MM-dd" @change="selectMonth" v-else :disabled="checkDis"></el-date-picker>
    </div>
    <!-- end -->
    <!-- 督办单类型 单选-->
    <div class="timeWrap flex-vCenter" v-if="itemList.includes('orderType')">
      <label>督办单类型：</label>
      <el-select style="width: 100px;" size="medium" v-model="typeCode" clearable placeholder="全部">
        <el-option v-for="item in optionsType" :key="item.superviseType" :label="item.superviseTypeName" :value="item.superviseType"></el-option>
      </el-select>
    </div>
    <!--设备类型 单选-->
    <div class="timeWrap flex-vCenter" v-if="itemList.includes('orderCategory')">
      <label>设备类型：</label>
      <el-select style="width: 120px;" size="medium" v-model="categoryCode" clearable placeholder="全部">
        <el-option v-for="item in optionsCategory" :key="item.deviceTypeId" :label="item.deviceTypeName" :value="item.deviceTypeId"></el-option>
      </el-select>
    </div>
    <!--工作类型 单选-->
    <div class="timeWrap flex-vCenter" v-if="itemList.includes('workingType')">
      <label>工作类型：</label>
      <el-select style="width: 140px;" size="medium" v-model="workingTypeCode" clearable placeholder="全部">
        <el-option v-for="item in optionsWorkingType" :key="item.planTaskTypeId" :label="item.planTaskTypeName" :value="item.planTaskTypeId"></el-option>
      </el-select>
    </div>
    <!--工作周期 单选-->
    <div class="timeWrap flex-vCenter" v-if="itemList.includes('workingPeriod')">
      <label>工作周期：</label>
      <el-select style="width: 120px;" size="medium" v-model="workingPeriodCode" clearable placeholder="全部">
        <el-option v-for="item in optionsWorkingPeriod" :key="item.planTaskPeriodId" :label="item.periodName" :value="item.planTaskPeriodId"></el-option>
      </el-select>
    </div>
    <!-- 运行指标 处理状态 -->
    <div class="timeWrap flex-vCenter" v-if="itemList.includes('processStatus')">
      <label>处理状态：</label>
      <el-select style="width: 120px;" v-model="processStatus" placeholder="全部" clearable size="medium">
        <el-option v-for="item in optionsProcessStatus" :key="item.code" :label="item.name" :value="item.code"></el-option>
      </el-select>
    </div>
    <!-- 项目管理 预算类别 -->
    <div class="timeWrap flex-vCenter" v-if="itemList.includes('budgetType')">
      <label>预算类别：</label>
      <el-select style="width: 120px;" v-model="budgetType" size="medium" @change="budgetTypeChange(budgetType)">
        <el-option v-for="item in optionsBudgetType" :key="item.code" :label="item.name" :value="item.code"></el-option>
      </el-select>
    </div>
    <!-- 关键字搜索 -->
    <div class="timeWrap flex-vCenter" style="margin-left: 10px;" v-if="itemList.includes('keywords')">
      <el-input style="width: 140px;" v-model="keywords" size="medium" placeholder="请输入关键字" clearable></el-input>
    </div>
    <!-- end -->
    <div class="submit flex-vCenter" @click="submit" v-if="itemList.includes('submit')">
      <span>查询</span>
    </div>
    <div class="flex-1"></div>
    <div class="submit flex-vCenter" @click="submitRight()" v-if="itemList.includes('rightButton')">
      <span>{{rightButtonName}}</span>
    </div>
  </div>
</template>
<script>
export default {
  data(){
    return {
      userInfo: JSON.parse(window.sessionStorage.getItem('userInfo')),
      itemList: [],
      timeActive: this.tActive, // 时间快捷键选中坐标
      timeValue: this.time,
      timeKey: this.$moment().valueOf(),
      timeFormat: {
        date: 'yyyy年MM月dd日',
        week: 'yyyy 第 WW 周',
        month: 'yyyy年MM月',
        year: 'yyyy年'
      },
      timeFilterValue: this.time,
      plantCodes: [10100000000,10200000000,10300000000,10400000000], // 统计对象多选
      optionsPlant: [],
      plantCode: this.plantId || '', // 所属场站单选
      directorCode: '',
      directorList: [
        {name: '张三', code: 10100000000},
        {name: '李四', code: 10200000000},
        {name: '王五', code: 10300000000},
        {name: '赵小七', code: 10400000000}
      ],
      typeCascaderCode: [], // 督办单类型类别
      optionsTypeCascader: [], 
      optionsTypeCascaderAll: [],
      typeCascaderCodePlan: [],
      optionsTypeCascaderPlan: [], 
      propsTypeCascader: { 
        expandTrigger: 'hover',
        emitPath: true,
        value: 'id',
        label: 'name',
        separator: '-',
        multiple: false,
        checkStrictly: true
      },
      stoptypeCascaderCode: [], // 督办单类型类别
      optionsStopTypeCascader: [], // 停机类型类别
      propsStopTypeCascader: { 
        expandTrigger: 'hover',
        emitPath: true,
        value: 'id',
        label: 'value',
        separator: '-',
        multiple: false,
        checkStrictly: true
      },
      orderStatus: '', // 督办单状态
      optionsStatus: [],
      stopStatus: '', // 停机状态
      optionsStopStatus: [{name: '待处理', value: 1},{name: '验收不通过', value: 2},{name: '班组验收中', value: 3},{name: '部门验收中', value: 4}],
      keywords: '',
      typeCode: '', // 督办单类型 单独选
      optionsType: [],
      categoryCode: '', // 设备类型
      optionsCategory: [],
      workingTypeCode: '', // 工作类型
      optionsWorkingType: [], 
      workingPeriodCode: '', // 工作周期
      optionsWorkingPeriod: [],
      queryNormalCode: '', // 查询指标
      optionsQueryNormal: [{name: '平均风速', code: 1},{name: '发电量', code: 2},{name: '综合常用电量', code: 3}],
      processStatus: '', // 运行指标 - 处理状态,
      optionsProcessStatus: [{name: '未处理', code: 1},{name: '已处理', code: 2}],
      budgetType: 1, // 预算类别
      optionsBudgetType: [{name: '投资预算', code: 1},{name: '资金预算', code: 2}],
      projectType: '', // 项目类别
      optionsProjectType: [{name: '物资', code: 1},{name: '服务', code: 2},{name: '工程', code: 3}],
      budgetCategory: '', // 预算科目
      optionsBudgetCategory: [],
      projectProgress: '', // 项目进度
      optionsProjectProgress: [],
      projectStatus: '', // 项目状态
      optionsProjectStatus: [], 
      timeSep: this.$moment().valueOf()
    }
  },
  props: {
    tActive: { type: [String, Number], default: 'date' },
    time: { type: [String, Array], default: ''}, // 时间
    layout: { type: String, default: 'dateType,plants,director,submit,rightButton' },  // 时间类型选择序号
    rightButtonName: { type: String, default: '导出' },
    plantId: {type: [String, Number], default () {return null}}, // 所属场站单选
    checkDis: {type: Boolean, default () {return false}},
    timeTypeName: {type: String, default () {return ''}}
  },
  created(){
    this.itemList = this.layout.split(',')
  },
  mounted(){
    // this.getPlant()
    if(!this.itemList.includes('plant') || !this.userInfo.singlePlantFlag || this.plantCode){
      this.submit()
    }
    if(this.itemList.includes('plant') || this.itemList.includes('plants')){
      this.getPlant()
    }
    if(this.itemList.includes('plant')){
      if(this.itemList.includes('orderTypeCascader')){
        this.getCategory()
      }
      if(this.itemList.includes('orderTypeCascaderPlan')){
        this.getCategoryPlan()
      }
    }
    if(this.itemList.includes('orderTypeCascaderAll')){
      this.getCategoryAll()
    }
    if(this.itemList.includes('orderStatus')){
      this.getStatus()
    }
    if(this.itemList.includes('workingType')){
      this.getTaskType()
    }
    if(this.itemList.includes('workingPeriod')){
      this.getTaskPeriod()
    }
    if(this.itemList.includes('orderType')){
      this.getOrderType()
    }
    if(this.itemList.includes('orderCategory')){
      this.getOrderCategory()
    }
    if(this.itemList.includes('stopTypeCascader')){
      this.getStopTypeCascader()
    }
    if(this.itemList.includes('projectType')){
      this.getProjectType()
    }
    if(this.itemList.includes('budgetCategory')){
      this.getBudgetCategory()
    }
    if(this.itemList.includes('projectProgress')){
      this.getProjectProgress()
    }
    if(this.itemList.includes('projectStatus')){
      this.getProjectStatus()
    }
  },
  witch: {
    time(v){
      if(typeof v == 'string'){
        this.timeValue = v
      }else{
        this.timeFilterValue = v
      }
    },
    // timeRange(v){
    //   this.timeFilterValue = v
    // }
  },
  computed: {
    timeThis: {
      get: function () {
        return this.timeValue
      },
      set: function (v) {
        this.timeValue = v
      }
    },
    timeFilterThis: {
      get: function () {
        return this.timeFilterValue
      },
      set: function (v) {
        this.timeFilterValue = v
      }
    }
  },
  methods: {
    getPlant: function(){
      this.$http.fetchGet(`/plant/deptPlantList`).then(res => {
        if(res.code===0&&!this._isDestroyed){
          this.optionsPlant = res.data
          if(this.userInfo.singlePlantFlag && !this.plantCode){
            this.plantCode = this.optionsPlant[0].plantId
            this.submit()
          }
        }else{
          this.optionsPlant = []
        }
      })
    },
    getCategory: function(){ // 获取督办单类型、类别
      let data = {
        plantId: this.plantCode || ''
      }
      this.$http.fetch(`supervise/querySuperviseCategoryTree`,data).then(res=>{
        if(res.code==0&&!this._isDestroyed){
          this.timeSep = this.$moment().valueOf()
          this.optionsTypeCascader = res.data
        }else{
          this.optionsTypeCascader = []
        }
      })
    },
    getCategoryAll: function(){ // 获取所有督办单类型、类别
      this.$http.fetch(`supervise/querySuperviseAllTree`).then(res=>{
        if(res.code==0&&!this._isDestroyed){
          this.timeSep = this.$moment().valueOf()
          this.optionsTypeCascaderAll = res.data
        }else{
          this.optionsTypeCascaderAll = []
        }
      })
    },
    getCategoryPlan: function(){ // 获取计划策略类型、类别
      let data = {
        plantId: this.plantCode || ''
      }
      this.$http.fetch(`patrol/querySuperviseCategoryTree`,data).then(res=>{
        if(res.code==0&&!this._isDestroyed){
          this.timeSep = this.$moment().valueOf()
          this.optionsTypeCascaderPlan = res.data
        }else{
          this.optionsTypeCascaderPlan = []
        }
      })
    },
    getStatus: function(){ // 获取督办单状态
      this.$http.fetchGet(`supvApproval/querySupvProcStatus`).then(res=>{
        if(res.code==0&&!this._isDestroyed){
          this.optionsStatus = res.data
        }else{
          this.optionsStatus = []
        }
      })
    },
    getTaskType: function(){ // 获取所有工作类型
      this.$http.fetchGet(`planTask/queryPlanTaskType`).then(res=>{
        if(res.code==0&&!this._isDestroyed){
          this.optionsWorkingType = [...res.data,{planTaskTypeName: '未定义',planTaskTypeId: 0}]
        }else{
          this.optionsWorkingType = [{planTaskTypeName: '未定义',planTaskTypeId: 0}]
        }
      })
    },
    getTaskPeriod: function(){ // 获取所有工作周期
      this.$http.fetchGet(`planTask/queryPlanTaskPeriod`).then(res=>{
        if(res.code==0&&!this._isDestroyed){
          this.optionsWorkingPeriod = [...res.data,{periodName: '未定义',planTaskPeriodId: 0}]
        }else{
          this.optionsWorkingPeriod = [{periodName: '未定义',planTaskPeriodId: 0}]
        }
      })
    },
    getOrderType: function(){ // 获取所有督办单类型
      this.$http.fetchGet(`planTask/querySuperviseTypeForPlanTask`).then(res=>{
        if(res.code==0&&!this._isDestroyed){
          this.optionsType = res.data
        }else{
          this.optionsType = []
        }
      })
    },
    getOrderCategory: function(){ // 获取所有设备类型
      this.$http.fetchGet(`planTask/queryDeviceTypeForPlanTask`).then(res=>{
        if(res.code==0&&!this._isDestroyed){
          this.optionsCategory = res.data
        }else{
          this.optionsCategory = []
        }
      })
    },
    getStopTypeCascader: function(){ // 获取停机类型类别
      this.$http.fetchGet(`stop/lossTree`).then(res=>{
        if(res.code==0&&!this._isDestroyed){
          this.optionsStopTypeCascader = res.data
        }else{
          this.optionsStopTypeCascader = []
        }
      })
    },
    getProjectType () {
      this.$http.fetchGet(`/project/getProjectType`).then(res => {
        if (res.code === 0) {
          this.optionsProjectType = res.data
        }else {
          this.optionsProjectType = []
        }
      })
    },
    getBudgetCategory () {
      this.$http.fetchGet(`/budget/getBudgetCodeList`).then(res => {
        if (res.code === 0) {
          this.optionsBudgetCategory = res.data
        }else {
          this.optionsBudgetCategory = []
        }
      })
    },
    getProjectProgress () {
      this.$http.fetchGet(`/project/getProjectProgress`).then(res => {
        if (res.code === 0) {
          this.optionsProjectProgress = res.data
        }else {
          this.optionsProjectProgress = []
        }
      })
    },
    getProjectStatus () {
      this.$http.fetchGet(`/project/getAuditStatus`).then(res => {
        if (res.code === 0) {
          this.optionsProjectStatus = res.data
        }else {
          this.optionsProjectStatus = []
        }
      })
    },
    // 时间改变
    handleChangeTimeType: function(timeType){
      // console.log(timeType)
      if(this.timeActive != timeType){
        this.timeActive = timeType
        this.timeKey = this.$moment().valueOf()
        switch (timeType){
          case 'nearMonth':
            this.timeFilterValue = [this.$moment().subtract(1,'months').add(1,'days').format('YYYY-MM-DD'), this.$moment().format('YYYY-MM-DD')]
            break
          case 'currentMonth':
            this.timeFilterValue = [this.$moment().startOf('month').format('YYYY-MM-DD'), this.$moment().endOf('month').format('YYYY-MM-DD')]
            break
          case 'daterange':
            this.timeFilterValue = [this.$moment(this.timeValue).format('YYYY-MM-DD'), this.$moment(this.timeValue).format('YYYY-MM-DD')]
            break
          case 'year':
            if(this.itemList.includes('dateTypeRange')){
              this.timeValue = this.timeFilterValue[0] || ''
            }
            break
          default:
            break
        }
      }
    },
    handleChangePlant: function(){
    },
    submit: function(){
      let data = {}
      if(this.itemList.includes('dateType')){
        if(this.timeActive!='daterange'){
          data.stime = this.$moment(this.timeValue).startOf(this.timeActive!='week'?this.timeActive:'isoWeek').format('YYYY-MM-DD')
          data.etime = this.$moment(this.timeValue).endOf(this.timeActive!='week'?this.timeActive:'isoWeek').format('YYYY-MM-DD')
        }else{
          data.stime = this.timeFilterValue[0] || ''
          data.etime = this.timeFilterValue[1] || ''
        }
        data.timeActive = this.timeActive
      }
      if(this.itemList.includes('date')){
        data.time = this.timeValue
      }
      if(this.itemList.includes('plants')){
        data.plantCodes = this.plantCodes
      }
      if(this.itemList.includes('plant')){
        data.plantCode = this.plantCode || ''
      }
      if(this.itemList.includes('orderTypeCascader')){
        // console.log(this.typeCascaderCode)
        // data.typeCascaderCode = this.typeCascaderCode
        data.superviseType = this.typeCascaderCode[0] || ''
        data.superviseCategory = this.typeCascaderCode[1] || ''
      }
      if(this.itemList.includes('orderTypeCascaderAll')){
        data.superviseType = this.typeCascaderCode[0] || ''
        data.superviseCategory = this.typeCascaderCode[1] || ''
      }
      if(this.itemList.includes('orderTypeCascaderPlan')){
        data.superviseType = this.typeCascaderCodePlan[0] || ''
        data.superviseCategory = this.typeCascaderCodePlan[1] || ''
      }
      if(this.itemList.includes('stopTypeCascader')){
        // console.log(this.stoptypeCascaderCode)
        // data.stoptypeCascaderCode = this.stoptypeCascaderCode
        data.lossType = this.stoptypeCascaderCode[0] || ''
        data.lossCode = this.stoptypeCascaderCode[1] || ''
      }
      if(this.itemList.includes('orderStatus')){
        data.orderStatus = this.orderStatus
      }
      if(this.itemList.includes('stopStatus')){
        data.stopStatus = this.stopStatus
      }
      if(this.itemList.includes('director')){
        data.directorCode = this.directorCode
      }
      if(this.itemList.includes('queryNormal')){
        data.queryNormalCode = this.queryNormalCode
      }
      if(this.itemList.includes('projectType')){
        data.projectType = this.projectType
      }
      if(this.itemList.includes('budgetCategory')){
        data.budgetCategory = this.budgetCategory
      }
      if(this.itemList.includes('projectProgress')){
        data.projectProgress = this.projectProgress
      }
      if(this.itemList.includes('projectStatus')){
        data.projectStatus = this.projectStatus
      }
      if(this.itemList.includes('timeRange')){
        data.stime = this.timeFilterValue[0] || ''
        data.etime = this.timeFilterValue[1] || ''
      }
      if(this.itemList.includes('dateTypeRange')){
        if(this.timeActive=='year'){
          data.stime = this.$moment(this.timeValue).startOf(this.timeActive).format('YYYY-MM-DD')
          data.etime = this.$moment(this.timeValue).endOf(this.timeActive).format('YYYY-MM-DD')
        }else{
          data.stime = this.timeFilterValue[0] || ''
          data.etime = this.timeFilterValue[1] || ''
        }
        data.timeActive = this.timeActive
      }
      if(this.itemList.includes('keywords')){
        data.keywords = this.keywords
      }
      if(this.itemList.includes('orderType')){
        data.superviseType = this.typeCode
      }
      if(this.itemList.includes('orderCategory')){
        data.deviceTypeId = this.categoryCode
      }
      if(this.itemList.includes('workingType')){
        data.workingTypeCode = this.workingTypeCode
      }
      if(this.itemList.includes('workingPeriod')){
        data.workingPeriodCode = this.workingPeriodCode
      }
      if(this.itemList.includes('processStatus')){
        data.processStatus = this.processStatus
      }
      if(this.itemList.includes('budgetType')){
        data.budgetType = this.budgetType
      }
      this.$emit("confirm",data)
    },
    submitRight: function(){
      this.$emit("submitRight")
    },
    timeChange (time) {
      this.$emit("timeChange", time)
    },
    budgetTypeChange (val) {
      this.$emit('update:changeBudgetType', val)
    },
    plantSelect (e) {
      this.$emit('plantSelect', e)
      if(this.itemList.includes('orderTypeCascader')){
        this.typeCascaderCode = []
        this.getCategory()
      }
      if(this.itemList.includes('orderTypeCascaderPlan')){
        this.typeCascaderCodePlan = []
        this.getCategoryPlan()
      }
    },
    selectMonth (e) {
      this.$emit('selectMonth', e)
    }
  }
};
</script>
 
<style scoped>
.search{width: 100%;min-height: 66px;padding: 15px 0;font-size: 14px;color: #666;background-color: #fff;}
.timeWrap{margin-left: 20px;}
.timeBtn{min-width: 34px;height: 36px;line-height: 34px;padding: 0 6px;color: #666;border-radius: 4px;margin-right: 10px;text-align: center;
cursor: pointer; border: 1px solid #cccccc;font-size: 12px;}
.timeBtn.active{color: #4eb6f0;border-color: #4eb6f0;}
.timeBtn:hover{color: #4eb6f0;}
.timeBtn.timeBtnMax{min-width: 50px;}
.submit{width: 86px;height: 34px;border: 1px solid #4eb6f0;color: #4eb6f0;font-size: 13px;margin-left: 15px;
border-radius: 3px;justify-content: center;cursor: pointer;}
.submit i{margin-right: 5px;margin-top: 2px;}
.submit:hover{color: #1b8cfd;border-color: #1b8cfd;}
</style>