<template>
  <div class="formWrap flex-column">
    <YfSearch tActive="nearMonth" :time="time" @confirm="submit" layout="director,timeShortcuts,timeRange,keywords,submit" v-if="!showSearch"></YfSearch>
    <div class="tableWrap flex-1" style="width: 100%;">
      <el-table :data="tableData" border style="width: 100%;" height="100%" size="medium">
        <!-- <el-table-column type="selection" width="40"></el-table-column> -->
        <el-table-column type="index" label="序号" width="55"></el-table-column>
        <el-table-column prop="content" label="工作内容" show-overflow-tooltip :formatter="function(row, column, cellValue){return cellValue||'-'}"></el-table-column>
        <el-table-column prop="stime" label="实际开工时间" width="150" :formatter="function(row, column, cellValue){return cellValue||'-'}"></el-table-column>
        <el-table-column prop="etime" label="实际完工时间" width="150" :formatter="function(row, column, cellValue){return cellValue||'-'}"></el-table-column>
        <el-table-column prop="message" label="处理情况" show-overflow-tooltip :formatter="function(row, column, cellValue){return cellValue||'-'}"></el-table-column>
        <el-table-column prop="director" label="检修人" width="100" :formatter="function(row, column, cellValue){return cellValue||'-'}"></el-table-column>
        <el-table-column label="操作" width="100">
          <template slot-scope="scope">
            <a class="blue" @click="goPage(scope.row)">查看详情</a>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
export default {
  data(){
    return {
      form: {},
      time: [this.$moment().subtract(1,'months').add(1,'days').format('YYYY-MM-DD'), this.$moment().format('YYYY-MM-DD')],
      tableData: []
    }
  },
  props: {
    superviseId: [Number, String],
    showSearch: {type: Boolean, default: false}
  },
  watch: {
    superviseId: function(newData){
      if(newData){
        this.getHistory()
      }
    }
  },
  created(){},
  mounted(){
    console.log(this.$route)
  },
  methods: {
    // 获取检修历史
    getHistory: function(){
      let data = {
        "currentPage": 1,
        "endDate": this.showSearch?'':this.form.stime,
        "keyName": this.showSearch?'':this.form.keywords,
        "pageSize": 10000,
        "startDate": this.showSearch?'':this.form.etime,
        "superviseId": this.superviseId
      }
      this.$http.fetch(`supervise/querySuperviseHistoryForPage`,data).then(res=>{
        if(res.code==0&&!this._isDestroyed){
          this.tableData = res.data.list
        }
      })
    },
    goPage(row){
      let routeList = JSON.parse(window.sessionStorage.getItem('formRoute'))
      routeList.push({path:this.$route.path,query: {superviseId: this.superviseId}})
      window.sessionStorage.setItem('formRoute', JSON.stringify(routeList));
      this.$router.push({
        path: `/overhaulSupervision/supervisionLookOver/supervisionLookOverDetail`, 
        query: {superviseId: row.superviseId}
      })
    },
    submit: function(param){
      if(param){
        this.form = {...param}
        if(this.superviseId){
          this.getHistory()
        }
      }
    }
  }
}
</script>

<style scoped lang="less">
.formWrap{
  width: 100%; height: 100%;
}
</style>