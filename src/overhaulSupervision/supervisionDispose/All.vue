<!-- 督办单发起列表  全部 -->
<template>
  <div class="supervision flex-column">
    <YfSearch tActive="currentMonth" :time="time" @confirm="submit" layout="plant,orderTypeCascader,orderStatus,timeShortcuts,timeRange,keywords,submit"></YfSearch>
    <tableList :tableData="tableData" :prosessCode="3" @refresh="getTableData" @getLossList="getLossList"></tableList>
    <el-dialog title="督办单处理" :visible.sync="showMenu" @close="resetForm" custom-class="noTitleDialog">
      <div class="formWrap flex-column">
        <el-form class="formInPlan" ref="formInPlan" :model="formData" :rules="rulesLoss" label-suffix=":" label-width="110px" label-position="left">
          <el-form-item>
            <p>该督办单尚未关联停机记录！</p>
          </el-form-item>
          <el-form-item label="关联停机记录" prop="lossInfoId">
            <el-select style="width: 100%;" v-model="formData.lossInfoId" placeholder="请选择">
              <el-option :label="item.lossInfoName" :value="item.lossInfoId" v-for="item in lossInfoList" :key="item.lossInfoId"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </div>
      <div class="footer flex-center">
        <a class="rightBtn grey flex-center" @click="close()">
          <span>取消</span>
        </a>
        <a class="rightBtn primary flex-center" @click="goPage()">
          <span>确定</span>
        </a>
      </div>
    </el-dialog>
  </div>
</template>

<script>
// prosessCode 进度编码 1=>发起 2=>开工许可 3=>处理 4=>查看
import tableList from '@/overhaulSupervision/list.vue'
export default {
  components: { tableList },
  data(){
    return {
      time: [this.$moment().startOf('month').format('YYYY-MM-DD'), this.$moment().endOf('month').format('YYYY-MM-DD')],
      form: {},
      tableData: [],
      showMenu: false,
      rulesLoss: {
        lossInfoId: [
          { required: true, message: '请关联停机记录', trigger: 'change' },
        ],
      },
      lossInfoList: [],
      formData: {
        lossInfoId: '1'
      },
      currentRow: {}
    }
  },
  created(){
    // this.$store.commit('set_formRoute', this.$route.path) // 记录历史路由
    window.sessionStorage.setItem('formRoute', JSON.stringify([{path:this.$route.path,query: {}}]));
  },
  methods: {
    submit: function(param){
      if(param){
        this.form = {...param}
        this.getTableData()
      }
    },
    getTableData: function(){
      let data = {
        "currentPage": 1,
        "pageSize": 10000,
        "plantId": this.form.plantCode,
        "endDate": this.form.etime,
        "keyName": this.form.keywords,
        "supvProcStatus": this.form.orderStatus,
        "startDate": this.form.stime,
        "superviseCategory": this.form.superviseCategory,
        "superviseType": this.form.superviseType
      }
      this.$http.fetch(`supervise/querySuperviseAllForPage`,data).then(res=>{
        if(res.code==0&&!this._isDestroyed){
          this.tableData = res.data.list
        }else{
          this.tableData = []
        }
      })
    },
    // 获取停机记录
    getLossList: function(param){
      this.currentRow = param
      this.$http.fetchGet(`supvDeal/queryLossInfoByDeviceAddressId?deviceAddressId=${param.deviceAddressId}`).then(res=>{
        if(res.code==0&&!this._isDestroyed){
          this.lossInfoList = res.data.list
          this.showMenu = true
        }else{
          this.lossInfoList = []
        }
      })
    },
    // 关联停机记录并跳转处理页面
    goPage: function(){
      this.$refs.formInPlan.validate((valid) => {
        if (valid) {
          let data = {
            "lossInfoId": this.formData.lossInfoId,
            "superviseId": this.currentRow.superviseId
          }
          this.$http.fetch(`supvDeal/updateLossInfoBySupvId`,data).then(res=>{
            if(res.code==0&&!this._isDestroyed){
              this.$message({
                type: 'success',
                message: '关联成功！',
                duration: 1500,
                onClose: ()=>{
                  this.$router.push({
                    path: `/overhaulSupervision/supervisionDispose/supervisionDisposeDetail`, 
                    query: {superviseId: this.currentRow.superviseId},
                  })
                }
              })
            }
          })
        } else {
          return false;
        }
      });
    },
    close: function(){
      this.showMenu = false
      this.$refs.formInPlan.resetFields()
    },
    // 弹窗消失重置表单
    resetForm: function(){
      this.$refs.formInPlan.resetFields()
    }
  }
}
</script>

<style scoped lang="less">
/deep/.noTitleDialog{
  left: 50%; right: auto; top: 50px; width: 520px; margin-left: -260px; height: auto;
  .el-dialog__header{
    display: block; padding: 10px 20px; border-bottom: 1px solid #e5e5e5;
    .el-dialog__title{
      font-size: 14px;font-weight: bold;
    }
  }
  .el-form .el-form-item:first-child .el-form-item__content{ margin-left: 10px;}
  .el-dialog__headerbtn{
    display: block; top: 15px;
  }
  .footer{
    padding-bottom: 20px;
  }
  
}
</style>