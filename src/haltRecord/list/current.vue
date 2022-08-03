<!-- 督办单发起列表  待处理 -->
<template>
  <div class="supervision flex-column">
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
      plantId: JSON.parse(window.sessionStorage.getItem('userInfo')).lastLoginPlantId, 
      tableData: []
    }
  },
  created(){
    // this.$store.commit('set_formRoute', this.$route.path) // 记录历史路由
    window.sessionStorage.setItem('formRoute', JSON.stringify([{path:this.$route.path,query: {}}]));
  },
  mounted(){
    this.getTableData()
    console.log(JSON.parse(window.sessionStorage.getItem('userInfo')))
  },
  methods: {
    getTableData: function(){
      let data = {
        "currentPage": 1,
        "pageSize": 10000,
        "plantId": this.plantId
      }
      this.$http.fetch(`supvLoss/querySupvLossForPage`,data).then(res=>{
        if(res.code==0&&!this._isDestroyed){
          this.tableData = res.data.list
        }else{
          this.tableData = []
        }
      })
    }
  }
}
</script>

<style scoped lang="less">
/deep/.noTitleDialog{
  left: 50%; right: auto; top: 0; width: 520px; margin-left: -260px; height: auto;
  .el-dialog__header{
    display: block; padding: 10px 20px; border-bottom: 1px solid #e5e5e5;
    .el-dialog__title{
      font-size: 14px;font-weight: bold;
    }
  }
  .el-dialog__headerbtn{
    display: block; top: 15px;
  }
  .footer{
    padding-bottom: 20px;
  }
  
}
</style>