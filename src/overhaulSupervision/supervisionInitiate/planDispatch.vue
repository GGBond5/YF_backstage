<!-- 督办单发起列表  计划督办单派单 -->
<template>
  <div class="supervision flex-column">
    <YfDetailsHeader path="/overhaulSupervision/supervisionInitiate/supervisionInitiatePending" title="指派检修人" print @handlePrint="handlePrint"></YfDetailsHeader>
    <div style="width: 100%; height: 10px; background: #fafafa;overflow: hidden;"></div>
    <div class="flex-1 content flex-column">
      <el-tabs class="orderTabs" v-model="activeName" @tab-click="handleTabClick">
        <el-tab-pane label="督办单" name="#/step_1">
        </el-tab-pane>
        <el-tab-pane label="检修过程" name="#/step_2">
        </el-tab-pane>
        <el-tab-pane label="设备文档" name="#/step_3">
        </el-tab-pane>
        <el-tab-pane label="检修历史" name="#/step_4">
        </el-tab-pane>
      </el-tabs>
      <div class="flex-1 scrollWrap" style="overflow: auto;">
        <YfCollapse title="基础信息"  style="padding: 5px 15px 0 7px;" ref="collapse1" key="1" v-if="activeName=='#/step_1'">
          <baseForm :type="2" @resize="resize"></baseForm>
        </YfCollapse>
        <YfCollapse title="流转过程"  style="padding: 5px 15px 0 7px;" ref="collapse2" key="2" v-if="activeName=='#/step_1'">
          <div class="statusWrap flex-center" slot="status">
            <span class="name">当前状态：</span>
            <span class="status color1 bgColor1 brColor1">未开工</span>
          </div>
          <timelineForm></timelineForm>
        </YfCollapse>
        <YfCollapse title="停机信息"  style="padding: 5px 15px 0 7px;" ref="collapse3" key="3" v-if="activeName=='#/step_2'">
          <stopForm></stopForm>
        </YfCollapse>
        <YfCollapse title="处理过程"  style="padding: 5px 15px 0 7px;" ref="collapse4" key="4" v-if="activeName=='#/step_2'">
          <processingForm @resize="resize"></processingForm>
        </YfCollapse>
        <YfCollapse title="联动处理督办单"  style="padding: 5px 15px 0 7px;" ref="collapse5" key="5" v-if="activeName=='#/step_2'">
          <linkageForm></linkageForm>
        </YfCollapse>
        <YfCollapse title="部件更换信息"  style="padding: 5px 15px 0 7px;" ref="collapse6" key="6" v-if="activeName=='#/step_2'">
          <partsReplacementForm @resize="resize"></partsReplacementForm>
        </YfCollapse>
        <history v-if="activeName=='#/step_4'">></history>
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
import stopForm from '@/views/overhaulSupervision/supervisionInitiate/stopForm.vue'
import processingForm from '@/views/overhaulSupervision/supervisionInitiate/processingForm.vue'
import linkageForm from '@/views/overhaulSupervision/supervisionInitiate/linkageForm.vue'
import partsReplacementForm from '@/views/overhaulSupervision/supervisionInitiate/partsReplacementForm.vue'
import history from '@/views/overhaulSupervision/supervisionInitiate/history.vue'
export default {
  components: { baseForm, timelineForm, stopForm, processingForm, linkageForm, partsReplacementForm, history },
  data(){
    return {
      activeName: ''
    }
  },
  created(){
    console.log(location.hash)
    this.activeName = location.hash||'#/step_1'
    if(!location.hash){
      window.location.hash = this.activeName
    }
  },
  mounted(){},
  methods: {
    // table添加单元格Style
    cellStyleFun: function({rowIndex, columnIndex}){
      if(columnIndex==7){
        if(rowIndex==2){
          return {backgroundColor: '#FF6666'}
        }
      }
    },
    handleTabClick: function(tab){
      window.location.hash = tab.name
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