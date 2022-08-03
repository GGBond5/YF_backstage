<!-- 督办单发起列表  全部 -->
<template>
  <div class="supervision flex-column">
    <YfSearch tActive="currentMonth" :time="time" @confirm="submit" layout="plant,orderTypeCascader,orderStatus,timeShortcuts,timeRange,keywords,submit"></YfSearch>
    <tableList :tableData="tableData" :prosessCode="1" @refresh="getTableData"></tableList>
  </div>
</template>

<script>
// prosessCode 进度编码 1=>发起，派单，开工许可 2=>验收 3=>处理 4=>查看
import tableList from '@/overhaulSupervision/list.vue'
export default {
  components: { tableList },
  data(){
    return {
      time: [this.$moment().startOf('month').format('YYYY-MM-DD'), this.$moment().endOf('month').format('YYYY-MM-DD')],
      form: {},
      tableData: []
    }
  },
  created(){
    // this.$store.commit('set_formRoute', this.$route.path) // 记录历史路由
    window.sessionStorage.setItem('formRoute', JSON.stringify([{path:this.$route.path,query: {}}]));
  },
  mounted(){
  },
  methods: {
    submit: function(param){
      if(param){
        this.form = {...param}
        this.getTableData()
      }
    },
    getTableData: function(){
      let data = {
        "currentPage": 1,
        "pageSize": 10000,
        "plantId": this.form.plantCode,
        "endDate": this.form.etime,
        "keyName": this.form.keywords,
        "supvProcStatus": this.form.orderStatus,
        "startDate": this.form.stime,
        "superviseCategory": this.form.superviseCategory,
        "superviseType": this.form.superviseType
      }
      this.$http.fetch(`supervise/querySuperviseAllForPage`,data).then(res=>{
        if(res.code==0&&!this._isDestroyed){
          this.tableData = res.data.list
        }else{
          this.tableData = []
        }
      })
    },
  }
}
</script>

<style scoped>

</style>