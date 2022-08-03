<!-- 督办单发起列表  全部 -->
<template>
  <div class="supervision flex-column" style="position: relative;">
    <a class="arrowRight el-icon-arrow-right" :class="{arrowDown: isshowFilter}" @click="isshowFilter=!isshowFilter"></a>
    <YfSearch tActive="date" :time="time" @confirm="submit" layout="dateType,orderTypeCascaderAll,submit"></YfSearch>
    <fanFilter @confirm="fanFilter" v-show="isshowFilter"></fanFilter>
    <div class="tableWrap flex-1 flex-column">
      <el-table ref="table1" :data="tableData" border height="100%" style="width: 100%;overflow: hidden;" size="small" show-summary>
        <el-table-column type="index" label="序号" width="55"></el-table-column>
        <el-table-column prop="plantName" label="风场项目名称"></el-table-column>
        <el-table-column prop="fanName" label="风机名称"></el-table-column>
        <el-table-column prop="manufacturerName" label="厂家"></el-table-column>
        <el-table-column prop="modelPowerName" label="容量"></el-table-column>
        <el-table-column prop="modelType" label="类型"></el-table-column>
        <el-table-column prop="superviseNum" label="件数" sortable></el-table-column>
        <el-table-column prop="noProcessNum" label="未开工" sortable></el-table-column>
        <el-table-column prop="processingNum" label="处理中" sortable></el-table-column>
        <el-table-column prop="receivingNum" label="验收中" sortable></el-table-column>
        <el-table-column prop="receiveFailNum" label="验收不通过" sortable></el-table-column>
        <el-table-column prop="suspendNum" label="挂起中" sortable></el-table-column>
        <el-table-column prop="processedNum" label="已处理" sortable></el-table-column>
        <el-table-column prop="processHours" label="处理时长(h)" sortable>
          <template slot-scope="scope">{{$toFixed(scope.row.processHours,2)}}</template>
        </el-table-column>
        <el-table-column prop="ratio" label="消除率(%)" sortable>
          <template slot-scope="scope">{{$toFixed(scope.row.ratio,2)}}</template>
        </el-table-column>
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
        "superviseCategory": 0,
        "superviseType": 0,
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
        this.form.superviseCategory = param.superviseCategory
        this.form.superviseType = param.superviseType
        this.getTableData()
      }
    },
    getTableData: function(){
      this.$http.fetch(`supvHome/fanStat`,this.form).then(res=>{
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