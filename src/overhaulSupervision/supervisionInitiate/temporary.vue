<!-- 督办单发起列表  临时任务发起 -->
<template>
  <div class="supervision flex-column">
    <YfDetailsHeader path="/overhaulSupervision/supervisionInitiate/supervisionInitiatePending" title="创建督办单" print @handlePrint="handlePrint"></YfDetailsHeader>
    <div style="width: 100%; height: 10px; background: #fafafa;overflow: hidden;"></div>
    <div class="flex-1 content flex-column">
      <div class="contentTop flex-vCenter">
        <i class="yfFont icon-biaotiqian"></i>
        <h4>风机临时任务督办单详情</h4>
        <div class="flex-1"></div>
        <a class="rightBtn flex-center">
          <i class="yfFont icon-conglishifuzhi"></i>
          <span>从历史巡检督办单复制</span>
        </a>
        <a class="rightBtn flex-center">
          <i class="yfFont icon-piliangshengcheng"></i>
          <span>批量生成督办单</span>
        </a>
      </div>
      <div class="flex-1 scrollWrap" style="overflow: auto;">
        <YfCollapse title="基础信息"  style="padding: 0 15px 0 7px;" ref="collapse1">
          <baseForm :type="6" @resize="resize"></baseForm>
        </YfCollapse>
      </div>
      <div class="contentBottom flex-center">
        <a class="rightBtn flex-center">
          <span>保存为草稿</span>
        </a>
        <a class="rightBtn primary flex-center">
          <span>申请开工许可</span>
        </a>
      </div>
    </div>
    <el-backtop target=".scrollWrap" :visibility-height="50" :right="20" :bottom="110"></el-backtop>
  </div>
</template>

<script>
import baseForm from '@/views/overhaulSupervision/supervisionInitiate/baseForm.vue'
import timelineForm from '@/views/overhaulSupervision/supervisionInitiate/timelineForm.vue'
export default {
  components: { baseForm, timelineForm },
  data(){
    return {
    }
  },
  created(){
  },
  methods: {
    // table添加单元格Style
    cellStyleFun: function({rowIndex, columnIndex}){
      if(columnIndex==7){
        if(rowIndex==2){
          return {backgroundColor: '#FF6666'}
        }
      }
    },
    // 点击菜单
    handlePrint: function(){
      console.log('打印')
      this.$message.info('该功能暂未开放！')
    },
    resize: function(param){
      console.log(param)
      this.$refs[param].settingDefaultShow()
    }
  }
}
</script>

<style scoped lang="less">
.statusWrap{
  font-size: 14px;color: #666;margin-left: 85px;
  .name{
    margin-right: 10px;
  }
  .status{
    height: 30px;width: 80px;border-radius: 3px;line-height: 30px;text-align: center;
  }
}
</style>