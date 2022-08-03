<template>
  <div class="formWrap flex-column">
    <el-timeline>
      <el-timeline-item
        v-for="(activity, index) in activities" :key="index" :timestamp="activity.operationTime">
        <div slot="dot" class="dot">{{activity.no}}</div>
        <span>{{activity.operationTitle}}</span>
        <span>{{activity.operationContent}}</span>
      </el-timeline-item>
    </el-timeline>
  </div>
</template>

<script>
export default {
  data(){
    return {
      activities: [],
    }
  },
  props: {
    superviseId: String
  },
  watch: {},
  created(){},
  mounted(){
    this.getLog()
  },
  methods: {
    // 获取督办单日志
    getLog: function(){
      this.$http.fetchGet(`supvApproval/querySupvAuthLogBySupvId?superviseId=${this.superviseId}`).then(res=>{
        if(res.code==0&&!this._isDestroyed){
          let len = res.data.length
          res.data.forEach((item,index)=>{
            item.no = len - index
          })
          this.activities = res.data
          this.$emit('resize','collapse2')
        }
      })
    },
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