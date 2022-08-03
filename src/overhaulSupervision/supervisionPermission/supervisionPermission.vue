<!-- 督办单发起列表 -->
<template>
  <div class="supervision flex-column">
    <el-tabs class="orderTabs" v-model="activeName" v-if="filterRoute.includes(activeName)">
      <el-tab-pane label="待处理" name="/overhaulSupervision/supervisionPermission/supervisionPermissionCurrent">
        <span slot="label">
          <el-badge :value="currentNo" class="item">待处理</el-badge>
        </span>
      </el-tab-pane>
      <el-tab-pane label="全部" name="/overhaulSupervision/supervisionPermission/supervisionPermissionAll">
      </el-tab-pane>
    </el-tabs>
    <div class="flex-1 flex-column">
      <router-view ref="supervisionInitiateChild"></router-view>
    </div>
  </div>
</template>

<script>
export default {
  data(){
    return {
      activeName: '/overhaulSupervision/supervisionPermission/supervisionPermissionCurrent',
      filterRoute: [
        '/overhaulSupervision/supervisionPermission/supervisionPermissionCurrent',
        '/overhaulSupervision/supervisionPermission/supervisionPermissionAll'
      ],
      currentNo: 0
    }
  },
  watch: {
    $route(to,form){
      this.activeName = to.path
    },
    activeName: function(newData){
      if(this.$route.path != newData){
        this.$router.push(newData)
      }
    }
  },
  created(){
    this.activeName = this.$route.path
    this.getTableNum()
  },
  methods: {
    getTableNum: function(){
      this.$http.fetch(`supervise/querySuperviseWaitingNum`,{type: 2}).then(res=>{
        if(res.code==0&&!this._isDestroyed){
          this.currentNo = res.data
        }else{
          this.currentNo = 0
        }
      })
    }
  }
}
</script>

<style scoped>

</style>