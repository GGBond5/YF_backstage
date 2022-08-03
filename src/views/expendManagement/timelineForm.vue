<template>
  <div class="formWrap flex-column">
    <el-timeline>
      <el-timeline-item v-for="(activity, index) in reactivities" :key="index" :timestamp="activity.createTime">
        <div slot="dot" class="dot">{{activity.no}}</div>
        <span>{{activity.progressStatus}}</span>
        <span>{{activity.context}}</span>
      </el-timeline-item>
    </el-timeline>
  </div>
</template>

<script>
export default {
  data () {
    return {
      reactivities: this.activities.reverse()
    }
  },
  props: {
    activities: {
      type: Array,
      default () {
        return []
      }
    }
  },
  methods: {
    onSubmit: function(){
      
    }
  }
}
</script>

<style scoped lang="less">
.formWrap{
  width: 100%;
  padding: 10px 20px 0;
  .dot {
    height: 20px;
    width: 20px;
    text-align: center;
    line-height: 18px;
    border-radius: 30px;
    border: 1px solid black;
    background-color: #fff;
    margin-left: -5px;
  }
  /deep/ .el-timeline {
    position: relative;
    margin-left: 140px;
    .el-timeline-item__content {
      line-height: 26px;
      >span:nth-of-type(2) {
        margin-left: 40px;
        color: rgba(0, 0, 0,0.5);
      }
    }
    .el-timeline-item__timestamp {
      position: absolute;
      left: -140px;
      top: 0;
    }
  }
}
</style>