<template>
  <div class="firstPageTemp flex-column">
    <el-tabs v-model="activeName" type="border-card" @tab-click="handleClick">
      <el-tab-pane label="督办决策" name="home"></el-tab-pane>
      <el-tab-pane label="按风场统计" name="plant"></el-tab-pane>
      <el-tab-pane label="按风机统计" name="apparatus"></el-tab-pane>
    </el-tabs>
    <div class="flex-1 flex-column" >
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      activeName: 'home',
    }
  },
  props: {
    path: {
      type: String,
      default () {
        return ''
      }
    }
  },
  created () {
    this.activeName = this.$route.path.split('/').at(-1)
  },
  methods: {
    handleClick (tab) {
      tab.name !== this.$route.path.split('/').at(-1) && this.$router.push(this.path + tab.name)
    }
  },
  watch: {
    '$route.path': {
      handler (newVal) {
        this.activeName = newVal.split('/').at(-1)
      }
    }
  }
}
</script>

<style lang="less" scoped>
.firstPageTemp {
  height: 100%;
  // el-tabs样式
  /deep/ .el-tabs__nav {
    margin: 0;
  }
  /deep/ .el-tabs__content {
    display: none;
  }
  /deep/ .el-tabs--border-card {
    border: 0;
    box-shadow: none;
  }
}
.progress {
  display: flex;
  justify-content:flex-start;
  align-items: center;
  padding: 0 30px 0 10px;
  span:nth-of-type(1) {
    width: 50px; 
    text-align: right;
    margin-right: 20px;
  }
  span:nth-of-type(2) {
    flex: 1;
  }
}
</style>
<style lang="less">
.progressBar {
  display: flex;
  justify-content:flex-start;
  align-items: center;
  padding-right: 10px;
  span:nth-of-type(1) {
    width: 50px;
    text-align: center;
    margin-right: 10px;
  }
  span:nth-of-type(2) {
    flex: 1;
  }
}
</style>