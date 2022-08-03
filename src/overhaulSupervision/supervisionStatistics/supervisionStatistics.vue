<!-- 督办单发起列表 -->
<template>
  <div class="supervision flex-column">
    <el-tabs class="orderTabs" v-model="activeName">
      <el-tab-pane label="总览分析" name="/overhaulSupervision/supervisionStatistics/All"></el-tab-pane>
      <el-tab-pane label="按风场统计" name="/overhaulSupervision/supervisionStatistics/byPlant"></el-tab-pane>
      <el-tab-pane label="按风机统计" name="/overhaulSupervision/supervisionStatistics/byFan"></el-tab-pane>
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
      activeName: '/overhaulSupervision/supervisionStatistics/All',
      time: [this.$moment().subtract(1,'months').add(1,'days').format('YYYY-MM-DD'), this.$moment().format('YYYY-MM-DD')],
      form: {}
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
  },
  methods: {
  }
}
</script>

<style scoped>

</style>