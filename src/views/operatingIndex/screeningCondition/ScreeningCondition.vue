<template>
  <div class="screeningCondition">
    <div class="query">
      <slot name="left"></slot>
      <div class="queryBtn" v-if="showBtn">
        <el-button type="primary" plain>查询</el-button>
      </div>
    </div>
    <div>
      <slot name="center"></slot>
    </div>
    <div>
      <slot name="right"></slot>
    </div>

  </div>
</template>

<script>
export default {
  data () {
    return {}
  },
  props: {
    showBtn: {
      type:Boolean,
      default () {
        return true
      }
    }
  }
} 
</script>

<style lang="less" scoped>
.screeningCondition {
  display: flex;
  width: 100%;
  height: 64px;
  padding: 15px;
  border-radius: 6px;
  background-color: #fff;
  margin-bottom: 10px;
  div {
    height: 34px;
    line-height: 34px;
  }
  .query {
    display: flex;
  }
  .queryBtn {
    .el-button {
      padding: 9px 30px;
    }
    /deep/ .el-button--primary.is-plain {
      color: #409EFF;
      background: #fff;
      border-color: #b3d8ff;
    }
    /deep/ .el-button--primary.is-plain:focus {
      color: #409EFF;
      background: #fff;
      border-color: #b3d8ff;
    }
    /deep/ .el-button--primary.is-plain:hover {
      background: #409EFF;
      border-color: #409EFF;
      color: #fff;
    }
  }
}
</style>