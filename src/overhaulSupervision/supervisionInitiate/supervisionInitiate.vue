<!-- 督办单发起列表 -->
<template>
  <div class="supervision flex-column">
    <el-tabs class="orderTabs" v-model="activeName" v-if="filterRoute.includes(activeName)">
      <el-tab-pane label="待处理" name="/overhaulSupervision/supervisionInitiate/supervisionInitiateCurrent">
        <span slot="label">
          <el-badge :value="currentNo" class="item">待处理</el-badge>
        </span>
      </el-tab-pane>
      <el-tab-pane label="全部" name="/overhaulSupervision/supervisionInitiate/supervisionInitiateAll">
      </el-tab-pane>
      <div class="tabRightWrap flex-center" v-if="activeName=='/overhaulSupervision/supervisionInitiate/supervisionInitiateCurrent'">
        <a class="flex-center blue" @click="handleClick(1)">
          <i class="el-icon-circle-plus-outline" style="font-size: 16px;"></i>
          <span>新建督办单</span>
        </a>
        <a class="flex-center blue" style="margin-left: 20px;" @click="handleClick(2)">
          <i class="yfFont icon-piliangshengcheng"></i>
          <span>批量生成督办单</span>
        </a>
      </div>
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
      activeName: '/overhaulSupervision/supervisionInitiate/supervisionInitiateCurrent',
      time: [this.$moment().subtract(1,'months').add(1,'days').format('YYYY-MM-DD'), this.$moment().format('YYYY-MM-DD')],
      form: {},
      filterRoute: [
        '/overhaulSupervision/supervisionInitiate/supervisionInitiateCurrent',
        '/overhaulSupervision/supervisionInitiate/supervisionInitiateAll'
      ],
      currentNo: 0
    }
  },
  watch: {
    $route(to){
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
    handleClick: function(n){
      if(n==1){
        this.$refs.supervisionInitiateChild.showMenu = true
      }else{
        if(this.$refs.supervisionInitiateChild.$refs.tabList.currentHighRow && this.$refs.supervisionInitiateChild.$refs.tabList.currentHighRow.superviseType !=1){
          this.$refs.supervisionInitiateChild.showMenu2 = true
          this.$refs.supervisionInitiateChild.deviceAddressList = []
          this.$refs.supervisionInitiateChild.getDeviceAddress()
        }else{
          this.$message.error(!this.$refs.supervisionInitiateChild.$refs.tabList.currentHighRow?'请先选中督办单！':'不能批量生成故障督办单！')
        }
      }
    },
    getTableNum: function(){
      this.$http.fetch(`supervise/querySuperviseWaitingNum`,{type: 1}).then(res=>{
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