<template>
  <div class="tableContainer">
    <h4 v-if="title">{{title}}</h4>
    <slot></slot>
  </div>
</template>

<script>
export default {
  data () {
    return {

    }
  },
  props: {
    title: {
      type: String,
      default () {
        return ''
      }
    }
  }
}
</script>

<style lang="less" scoped>
.tableContainer {
  flex: 1;
  min-height: 500px;
  // border-radius: 6px;
  background-color: #fff;
  overflow: auto;
  h4 {
    padding: 15px;
  }
}
</style>
