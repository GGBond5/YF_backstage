<template>
  <div class="supervision flex-column">
    <h2></h2>
    <el-tabs class="orderTabs" v-model="activeName">
      <el-tab-pane label="督办单发起/许可" name="1">
        <YfSearch tActive="nearMonth" :time="time1" @confirm="submit" layout="plant,orderTypeCascader,orderStatus,timeShortcuts,timeRange,keywords,submit"></YfSearch>
      </el-tab-pane>
      <el-tab-pane label="督办单查看" name="2" lazy>
        <YfSearch tActive="nearMonth" :time="time1" @confirm="submit" layout="plant,orderTypeCascader,orderStatus,director,timeShortcuts,timeRange,keywords,submit"></YfSearch>
      </el-tab-pane>
      <el-tab-pane label="督办单统计" name="3" lazy>
        <YfSearch tActive="date" :time="time2" @confirm="submit" layout="dateType,plants,director,submit,rightButton"></YfSearch>
      </el-tab-pane>
      <el-tab-pane label="督办单计划策略" name="4" lazy>
        <YfSearch @confirm="submit" layout="plant,orderTypeCascader,submit"></YfSearch>
      </el-tab-pane>
      <el-tab-pane label="督办单计划任务" name="5" lazy>
        <YfSearch @confirm="submit" layout="orderType,orderCategory,workingType,workingPeriod,submit"></YfSearch>
      </el-tab-pane>
      <el-tab-pane label="部件科目管理" name="6" lazy>
        <YfSearch @confirm="submit" layout="keywords,submit"></YfSearch>
      </el-tab-pane>
      <el-tab-pane label="停机记录全部/查看/编辑" name="7" lazy>
        <YfSearch tActive="nearMonth" :time="time1" @confirm="submit" layout="plant,stopTypeCascader,stopStatus,timeShortcuts,timeRange,keywords,submit"></YfSearch>
      </el-tab-pane>
      <el-tab-pane label="停机记录统计" name="8" lazy>
        <YfSearch tActive="date" :time="time2" @confirm="submit" layout="dateType,plants,submit"></YfSearch>
      </el-tab-pane>
      <el-tab-pane label="故障停机统计" name="9" lazy>
        <YfSearch tActive="date" :time="time2" @confirm="submit" layout="dateType,submit"></YfSearch>
      </el-tab-pane>
      <el-tab-pane label="生产运营指标" name="10" lazy>
        <YfSearch tActive="daterange" :time="time1" @confirm="submit" layout="plant,queryNormal,timeShortcuts,dateTypeRange,submit"></YfSearch>
      </el-tab-pane>
      <el-tab-pane label="定制报表" name="11" lazy>
        <YfSearch tActive="month" :time="time2" @confirm="submit" layout="date,submit"></YfSearch>
      </el-tab-pane>
      <el-tab-pane label="超温/超压监视" name="12" lazy>
        <YfSearch tActive="week" :time="time2" @confirm="submit" layout="date,plant,processStatus,submit"></YfSearch>
      </el-tab-pane>
      <el-tab-pane label="项目管理" name="13" lazy>
        <YfSearch tActive="year" :time="time2" @confirm="submit" layout="date,budgetType,submit"></YfSearch>
      </el-tab-pane>
      <el-tab-pane label="项目发起" name="14" lazy>
        <YfSearch :time="time1" @confirm="submit" layout="plant,projectType,budgetCategory,projectProgress,timeRange,keywords,submit"></YfSearch>
      </el-tab-pane>
      <el-tab-pane label="年度采购" name="15" lazy>
        <YfSearch :time="time1" @confirm="submit" layout="plant,projectType,budgetCategory,projectStatus,timeRange,keywords,submit"></YfSearch>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
export default {
  data(){
    return {
      activeName: '1',
      time1: [this.$moment().subtract(1,'months').add(1,'days').format('YYYY-MM-DD'), this.$moment().format('YYYY-MM-DD')],
      time2: this.$moment().format('YYYY-MM-DD'),
      form: {}
    }
  },
  methods: {
    submit: function(param){
      if(param){
        this.form = {...param}
      }
    }
  }
}
</script>

<style>

</style>