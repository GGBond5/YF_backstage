<template>
<!-- 折叠面板, 收纳内容区域 -->
  <div class="collapse">
    <div class="title flex-between" @click="opener()">
      <span><i class="el-icon-arrow-right" :style="{transform: show?'rotate(90deg)':'none',transition: 'all 0.3s ease-in-out'}"></i>{{title}}</span>
      <slot name="status"></slot>
    </div>
    <div class="content" ref="onOffContent">
      <div class="recordHeight">
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      show: this.isShow,
      timer: true
    }
  },
  props: {
    title: {
      type: String,
      default () {
        return 'No Title'
      }
    },
    isShow: {
      type: Boolean,
      default () {
        return true
      }
    }
  },
  mounted () {
    this.settingDefaultShow()
  },
  methods: {
    opener () {
      if (this.timer) {
        this.timer = false
        this.onOff()
        setTimeout(() => {
          this.timer = true
        }, 300)
      }
    },
    onOff () {
      //控制开关
      this.show = !this.show
      if (this.$refs.onOffContent.offsetHeight == 0) {
        this.$refs.onOffContent.style.height = `${this.$refs.onOffContent.children[0].offsetHeight}px`
      }else {
        this.$refs.onOffContent.style.height = '0px'
      }
    },
    settingDefaultShow (resize) {
      //根据isShow设置默认展示还是隐藏
      if (this.isShow || resize) {
        this.$nextTick(()=>{
          this.$refs.onOffContent.style.height = `${this.$refs.onOffContent.children[0].offsetHeight}px`
        })
      }else {
        this.$refs.onOffContent.style.height = '0px'
      }
    }
  }
}
</script>

<style lang="less" scoped>
.collapse {
  width: 100%;
  position: relative;
  &:not(:last-of-type)::before{
    content: '';
    width: calc(100% - 40px);
    height: 1px;
    overflow: hidden;
    display: block;
    background: #f0f0f0;
    position: absolute;
    left: 20px;
    bottom: 0;
    z-index: 3;
  }
  .title {
    position: sticky;
    top: 0;
    left: 0;
    z-index: 2;
    background-color: #fff;
    line-height: 66px;
    -webkit-user-select:none;/*webkit浏览器*/ 
    -moz-user-select:none;/*火狐*/ 
    -ms-user-select:none;/*IE10*/ 
    user-select:none;
    cursor: pointer;
    >span:nth-of-type(1) {
      font-size: 16px;
      color: #409EFF;
      i {
        font-size: 20px;
        margin: 0 10px;
      }
    }
    >div {
      padding-right: 20px;
    }
  }
  .content {
    padding: 0 20px;
    height: 0;
    overflow: hidden;
    transition: all 0.3s ease-in-out;
  }
}
</style>