<!-- 督办单发起列表  待处理 -->
<template>
  <div class="supervision flex-column">
    <tableList :tableData="tableData" :prosessCode="2" @refresh="getTableData"></tableList>
  </div>
</template>

<script>
import tableList from '@/overhaulSupervision/list.vue'
export default {
  components: { tableList },
  data(){
    return {
      userInfo: JSON.parse(window.sessionStorage.getItem('userInfo')),
      tableData: [],
    }
  },
  created(){
    // this.$store.commit('set_formRoute', this.$route.path) // 记录历史路由
    window.sessionStorage.setItem('formRoute', JSON.stringify([{path:this.$route.path,query: {}}]));
  },
  mounted(){
    this.getTableData()
  },
  methods: {
    getTableData: function(){
      let data = {
        "currentPage": 1,
        "pageSize": 10000,
        "plantId": this.userInfo.singlePlantFlag?this.userInfo.lastLoginPlantId:'',
        "type": 2
      }
      this.$http.fetch(`supervise/queryPendSuperviseForPage`,data).then(res=>{
        if(res.code==0&&!this._isDestroyed){
          this.tableData = res.data.list || []
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