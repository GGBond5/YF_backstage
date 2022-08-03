<!-- 督办单发起列表  全部 -->
<template>
  <div class="supervision flex-column" style="position: relative;">
    <a class="arrowRight el-icon-arrow-right" :class="{arrowDown: isshowFilter}" @click="isshowFilter=!isshowFilter"></a>
    <YfSearch tActive="date" :time="time" @confirm="submit" layout="dateType,stopTypeCascader,submit"></YfSearch>
    <fanFilter @confirm="fanFilter" v-show="isshowFilter"></fanFilter>
    <div class="tableWrap flex-1 flex-column">
      <el-table ref="table1" :data="tableData" border height="100%" style="width: 100%;overflow: hidden;" size="small" show-summary>
        <el-table-column type="index" label="序号" width="55"></el-table-column>
        <el-table-column prop="subPlantName" label="风场项目名称"></el-table-column>
        <el-table-column prop="innerCode" label="风机名称"></el-table-column>
        <el-table-column prop="manufacturerName" label="厂家"></el-table-column>
        <el-table-column prop="modelPowerName" label="容量"></el-table-column>
        <el-table-column prop="modelType" label="类型"></el-table-column>
        <el-table-column prop="stopTimes" label="停机次数" sortable></el-table-column>
        <el-table-column prop="notStarted" label="未开工" sortable></el-table-column>
        <el-table-column prop="processing" label="处理中" sortable></el-table-column>
        <el-table-column prop="accepting" label="验收中" sortable></el-table-column>
        <el-table-column prop="acceptanceFailed" label="验收不通过" sortable></el-table-column>
        <el-table-column prop="processed" label="已处理" sortable></el-table-column>
        <el-table-column prop="stopHours" label="停机时长(h)" sortable></el-table-column>
        <el-table-column prop="lossTotal" label="损失电量(万kwh)" min-width="100" sortable></el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import TabularData from '@/views/operatingIndex/tabularData/TabularData.vue'
import fanFilter from '@/views/overhaulSupervision/supervisionStatistics/fanFilter.vue'
export default {
  components: { TabularData, fanFilter },
  data(){
    return {
      isshowFilter: false,
      time: this.$moment().format('YYYY-MM-DD'),
      form: {
        "endDate": "",
        "fanFilter": {
          "manufacturerSet": [],
          "modelPowerSet": [],
          "modelTypeSet": [],
          "subPlantSet": []
        },
        "lossCode": 0,
        "lossType": 0,
        "startDate": ""
      },
      tableData: [],
    }
  },
  methods: {
    fanFilter: function(param){
      if(param){
        console.log(param)
        this.form.fanFilter = param
        this.getTableData()
      }
    },
    submit: function(param){
      if(param){
        this.form.startDate = param.stime
        this.form.endDate = param.etime
        this.form.lossCode = param.lossCode
        this.form.lossType = param.lossType
        this.getTableData()
      }
    },
    getTableData: function(){
      this.$http.fetch(`stop/filter`,this.form).then(res=>{
        if(res.code==0&&!this._isDestroyed){
          this.tableData = res.data|| []
          this.$nextTick(()=>{
            this.$refs.table1.doLayout()
          })
        }else{
          this.tableData = []
        }
      })
    }
  }
}
</script>

<style scoped>
.arrowRight{
  font-size: 20px; position: absolute; top: 20px;right: 20px; display: block; padding: 3px; color: #999;
}
.arrowRight.arrowDown{transform: rotate(90deg);}
</style>