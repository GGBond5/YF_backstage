<!-- 督办单发起列表  全部 -->
<template>
  <div class="supervision flex-column">
    <YfSearch tActive="nearMonth" :time="time" @confirm="submit" layout="plant,orderTypeCascader,orderStatus,timeShortcuts,timeRange,keywords,submit"></YfSearch>
    <tableList :tableData="tableData" @refresh="getTableData"></tableList>
  </div>
</template>

<script>
// prosessCode 进度编码 1=>发起，派单，开工许可 2=>验收 3=>处理 4=>查看
import tableList from '@/haltRecord/list/list.vue'
export default {
  components: { tableList },
  data(){
    return {
      time: [this.$moment().subtract(1,'months').add(1,'days').format('YYYY-MM-DD'), this.$moment().format('YYYY-MM-DD')],
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
        "stopStatusId": this.form.stopStatusId,
        "startDate": this.form.stime,
        "lossCode": this.form.lossCode,
        "lossType": this.form.lossType
      }
      this.$http.fetch(`supvLoss/querySupvLossAllForPage`,data).then(res=>{
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