<!-- 督办单发起列表  待处理 -->
<template>
  <div class="supervision flex-column">
    <tableList ref="tabList" :tableData="tableData" :prosessCode="1" isHighlight @refresh="getTableData"></tableList>
    <!-- <el-dialog :visible.sync="showMenu" custom-class="noTitleDialog">
      <div slot="title"></div>
      <div class="menuWrap flex-row">
        <div class="menuLeft flex-column">
          <a class="menuList flex-center" :class="{active: currentMenuFirst==item.code}" v-for="item in menuList" :key="item.code"
          @click="handleClickMenu(item)">{{item.name}}</a>
        </div>
        <div class="menuBox flex-1 flex-row">
          <div class="menuItem flex-column" v-for="item in menuItem" :key="item.code" @click="goPage(item.parent)">
            <span class="icon icon1"></span>
            <p>{{item.name}}</p>
          </div>
        </div>
      </div>
      <div class="footer"></div>
    </el-dialog> -->
    <el-dialog title="新建督办单" :visible.sync="showMenu" @close="resetForm" custom-class="noTitleDialog">
      <div class="formWrap flex-column">
        <el-form class="formInPlan" ref="formInPlan" :model="formData" label-suffix=":" label-width="100px" label-position="left">
          <el-form-item label="场站名称" prop="plantId">
            <el-select style="width: 100%;" v-model="formData.plantId" placeholder="请选择" @change="getCategory">
              <el-option :label="item.plantName" :value="item.plantId" v-for="item in plantList" :key="item.plantId"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="督办单类型" prop="superviseCategory">
            <el-cascader style="width: 100%;" v-model="formData.superviseCategory" :options="optionsSuperviseCategory" :props="propsOption"></el-cascader>
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
    <el-dialog title="批量生成督办单" :visible.sync="showMenu2" :close-on-click-modal="false" custom-class="noTitleDialog2">
      <div class="formWrap flex-column">
        <el-form class="formInPlan" ref="formInPlan2" :model="formData2" :rules="rules" label-suffix=":" label-width="85px" label-position="left">
          <el-form-item label="选择设备" prop="deviceAddressIdList">
            <el-select style="width: 100%;" v-model="formData2.deviceAddressIdList" multiple collapse-tags placeholder="请选择">
              <el-option :label="item.addressName" :value="item.deviceAddressId" v-for="item in deviceAddressList" :key="item.deviceAddressId" :disabled="item.disabled"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </div>
      <div class="footer flex-center">
        <a class="rightBtn grey flex-center" @click="close2()">
          <span>取消</span>
        </a>
        <a class="rightBtn primary flex-center" @click="saveDeviceAddressIdList()">
          <span>确定</span>
        </a>
      </div>
    </el-dialog>
  </div>
</template>

<script>
// prosessCode 进度编码 1=>发起，派单，开工许可 2=>验收 3=>处理 4=>查看
import tableList from '@/overhaulSupervision/list.vue'
export default {
  components: { tableList },
  data(){
    return {
      userInfo: JSON.parse(window.sessionStorage.getItem('userInfo')),
      tableData: [],
      showMenu: false,
      formData: {
        plantId: '',
        superviseCategory: ''
      },
      plantList: [],
      optionsSuperviseCategory: [],
      propsOption: {
        expandTrigger: 'hover',
        value: 'id',
        label: 'name',
        emitPath: false
      },
      menuItem: [],
      currentMenuFirst: 2,
      currentMenuSecond: 1,
      showMenu2: false, // 批量生成督办单
      formData2: {
        deviceAddressIdList: []
      },
      deviceAddressList: [],
      rules: {
        deviceAddressIdList: [
          { required: true, message: '请选择设备位置', trigger: 'change' }
        ]
      }
    }
  },
  created(){
    // this.$store.commit('set_formRoute', this.$route.path) // 记录历史路由
    window.sessionStorage.setItem('formRoute', JSON.stringify([{path:this.$route.path,query: {}}]));
  },
  mounted(){
    this.getTableData()
    this.getPlant()
  },
  methods: {
    goPage: function(){
      // console.log(path)
      if(!this.formData.plantId){
        this.$message.error('请选择场站！')
        return
      }
      if(!this.formData.superviseCategory){
        this.$message.error('请选择督办单类别！')
        return
      }
      this.$router.push({
        path: `/overhaulSupervision/supervisionInitiate/supervisionInitiateInit`, 
        query: {...this.formData}
      })
    },
    getTableData: function(){
      let data = {
        "currentPage": 1,
        "pageSize": 10000,
        "plantId": this.userInfo.singlePlantFlag?this.userInfo.lastLoginPlantId:'',
        "type": 1
      }
      this.$http.fetch(`supervise/queryPendSuperviseForPage`,data).then(res=>{
        if(res.code==0&&!this._isDestroyed){
          this.tableData = res.data.list || []
        }else{
          this.tableData = []
        }
      })
    },
    getPlant: function(){
      this.$http.fetchGet(`supvApproval/queryPlantAll`).then(res=>{
        if(res.code==0&&!this._isDestroyed){
          this.plantList = res.data
        }else{
          this.plantList = []
        }
      })
    },
    getCategory: function(){
      let data = {
        plantId: this.formData.plantId
      }
      this.$http.fetch(`supervise/querySuperviseCategoryTree`,data).then(res=>{
        if(res.code==0&&!this._isDestroyed){
          this.optionsSuperviseCategory = res.data
        }else{
          this.optionsSuperviseCategory = []
        }
      })
    },
    getDeviceAddress: function(){
      let data = {
        deviceTypeId: this.$refs.tabList.currentHighRow.deviceTypeId,
        plantId: this.$refs.tabList.currentHighRow.plantId
      }
      this.$http.fetch(`supervise/queryDeviceAddressForBatch`,data).then(res=>{
        if(res.code==0&&!this._isDestroyed){
          res.data.forEach(item=>{
            if(item.deviceAddressId == this.$refs.tabList.currentHighRow.deviceAddressId){
              this.deviceAddressList.push({...item, disabled: true})
            }else{
              this.deviceAddressList.push({...item, disabled: false})
            }
          })
        }else{
          this.deviceAddressList = []
        }
      })
    },
    saveDeviceAddressIdList: function(){
      this.$refs.formInPlan2.validate((valid) => {
        if(valid){
          let data = {
            deviceAddressIdList: this.formData2.deviceAddressIdList,
            superviseId: this.$refs.tabList.currentHighRow.superviseId,
          }
          this.$http.fetch(`supervise/addSuperviseBatch`,data).then(res=>{
            if(res.code==0&&!this._isDestroyed){
              this.$message({
                message: '成功批量生成督办单！',
                type: 'success',
                duration: 1500,
                onClose: ()=>{
                  this.$refs.formInPlan2.resetFields()
                  this.showMenu2 = false
                  this.getTableData()
                }
              }) 
            }
          })
        }else{
          return false
        }
      })
    },
    close: function(){
      this.$refs.formInPlan.resetFields()
      this.showMenu = false
    },
    close2: function(){
      this.$refs.formInPlan2.resetFields()
      this.showMenu2 = false
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
  left: 50%; right: auto; top: 0; width: 520px; margin-left: -260px; height: auto;
  .el-dialog__header{
    display: block; padding: 10px 20px; border-bottom: 1px solid #e5e5e5;
    .el-dialog__title{
      font-size: 14px;font-weight: bold;
    }
  }
  .el-dialog__headerbtn{
    display: block; top: 15px;
  }
  .footer{
    padding-bottom: 20px;
  }
  
}
/deep/.noTitleDialog2{
  top: 65px; width: 360px; height: auto;
  .el-dialog__header{
    display: block; padding: 10px 20px; border-bottom: 1px solid #e5e5e5;
    .el-dialog__title{
      font-size: 14px;font-weight: bold;
    }
  }
  .el-dialog__body{padding: 0;}
  .el-dialog__headerbtn{
    display: block; top: 15px;
  }
  .footer{
    padding-bottom: 20px; 
  }
  
}
</style>