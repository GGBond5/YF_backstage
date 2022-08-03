<template>
  <div class="navTree">
    <el-tree
      :data="data"
      :props="defaultProps"
      accordion
      @node-click="handleNodeClick"
      :default-expanded-keys="['全公司']"
      :default-checked-keys="['全公司']"
      highlight-current
      ref="myTree"
      node-key="value">
    </el-tree>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        defaultProps: {
          children: 'children',
          label: 'value'
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
    },
    methods: {
      handleNodeClick(data) {
        console.log(data);
        if (data.children?.length > 0) {
          if (data.value === '全公司') {
            console.log('11');
          }else {
            console.log('22');
          }
        }
      },
      setDefaultSelected () {
        this.$nextTick(() => {
          //默认选中第一个节点
          this.$refs.myTree.setCurrentKey(this.data[0].value);
        });
      }
    }
  };
</script>

<style lang="less" scoped>
.navTree {
  min-width: 200px;
  height: 100%;
  padding-top: 10px;
  background-color: #fff;
  /deep/ .el-tree-node__expand-icon {
    font-size: 20px;
    pointer-events: none;
  }
  /deep/ .el-tree--highlight-current .el-tree-node.is-current>.el-tree-node__content {
    background-color: rgba(64, 158, 255, 0.2);
  }
}
</style>