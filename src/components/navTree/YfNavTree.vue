<template>
  <div class="navTree">
    <h4>设备类型</h4>
    <el-tree
      :data="data"
      :props="defaultProps"
      accordion
      @node-click="handleNodeClick"
      highlight-current
      ref="myTree"
      node-key="label">
    </el-tree>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        defaultProps: {
          children: 'children',
          label: 'label'
        } 
      };
    },
    props: {
      data: {
        type: Array,
        default () {
          return []
        }
      }
    },
    mounted () {
      this.setDefaultSelected()
    },
    methods: {
      handleNodeClick(data) {
        console.log(data);
      },
      setDefaultSelected () {
        this.$nextTick(() => {
          //默认选中第一个节点
          this.$refs.myTree.setCurrentKey(this.data[0].label);
        });
      }
    }
  };
</script>

<style lang="less" scoped>
.navTree {
  min-width: 200px;
  height: 100%;
  background-color: #fff;
  h4 {
    padding: 0 10px;
    margin-bottom: 10px;
    line-height: 40px;
    border-bottom: 1px solid rgba(0, 0, 0, 0.2);
  }
  /deep/ .el-tree-node__expand-icon {
    font-size: 20px;
  }
  /deep/ .el-tree--highlight-current .el-tree-node.is-current>.el-tree-node__content {
    background-color: rgba(64, 158, 255, 0.2);
  }
}
</style>