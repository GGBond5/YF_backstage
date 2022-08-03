<!-- 督办单发起列表 -->
<template>
  <div class="supervision flex-column">
    <el-tabs class="orderTabs" v-model="activeName" v-if="filterRoute.includes(activeName)">
      <el-tab-pane label="待处理" name="/haltRecord/list/current">
        <span slot="label">
          <el-badge :value="5" class="item">待处理</el-badge>
        </span>
      </el-tab-pane>
      <el-tab-pane label="全部" name="/haltRecord/list/all">
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
      activeName: '/haltRecord/list/current',
      filterRoute: [
        '/haltRecord/list/current',
        '/haltRecord/list/all'
      ]
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
  },
  methods: {
  }
}
</script>

<style scoped>

</style>