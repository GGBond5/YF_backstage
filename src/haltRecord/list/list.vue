<template>
  <TabularData>
    <el-table class="stopTable" ref="stopTable" :data="tableDatas" border style="width: 100%;" size="medium" height="100%" highlight-current-row>
      <!-- <el-table-column type="selection" width="40"></el-table-column> -->
      <el-table-column type="index" label="序号" width="55"></el-table-column>
      <el-table-column prop="devName" label="设备名称" width="80"></el-table-column>
      <el-table-column prop="plantName" label="场站" width="120"></el-table-column>
      <el-table-column prop="lossType" label="停机类型" width="100">
        <template slot-scope="scope">
          <span class="tableCellBtn bgColor6 color6" v-if="scope.row.lossType==1">场外受累</span>
          <span class="tableCellBtn bgColor2 color2" v-if="scope.row.lossType==2">场内受累</span>
          <span class="tableCellBtn bgColor5 color5" v-if="scope.row.lossType==3">计划停机</span>
          <span class="tableCellBtn bgColor1 color1" v-if="scope.row.lossType==4">故障停机</span>
          <span class="tableCellBtn bgColor3 color3" v-if="scope.row.lossType==5">其他</span>
        </template>
      </el-table-column>
      <el-table-column prop="lossCodeName" label="停机类别" width="110" show-overflow-tooltip></el-table-column>
      <el-table-column prop="startTime" label="开始时间" width="130" align="center">
        <template slot-scope="scope">
          <el-date-picker class="rangeDate" :class="{blue: scope.row.isChangestartTime}" v-model="scope.row.startTime" type="datetime" size="small" 
          value-format="yyyy-MM-dd HH:mm" format="yyyy-MM-dd HH:mm" @change="remember(scope.row,'startTime')" @focus="selectThisRow(scope.row)"></el-date-picker>
        </template>
      </el-table-column>
      <el-table-column prop="endTime" label="结束时间" width="130" align="center">
        <template slot-scope="scope">
          <el-date-picker class="rangeDate" :class="{blue: scope.row.isChangeendTime}" v-model="scope.row.endTime" type="datetime" size="small" 
          value-format="yyyy-MM-dd HH:mm" format="yyyy-MM-dd HH:mm" placeholder="-" @change="remember(scope.row,'endTime')" @focus="selectThisRow(scope.row)"></el-date-picker>
        </template>
      </el-table-column>
      <el-table-column prop="duration" label="持续小时数" width="100">
        <template slot-scope="scope">
          <el-tooltip placement="right" effect="light" popper-class="elTooltip" v-if="scope.row.duration>=120 && scope.row.duration<180">
            <div slot="content" class="color4"><i class="el-icon-warning"></i><span>{{scope.row.duration}}小时前发生故障</span></div>
            <div class="flex-center back4"><span>{{scope.row.duration}}</span></div>
          </el-tooltip>
          <el-tooltip placement="right" effect="light" popper-class="elTooltip" v-else-if="scope.row.duration>=180">
            <div slot="content" class="color1"><i class="el-icon-warning"></i><span>{{scope.row.duration}}小时前发生故障</span></div>
            <div class="flex-center back1"><span>{{scope.row.duration}}</span></div>
          </el-tooltip>
          <a class="durationDefault flex-center" v-else>
            <span>{{scope.row.duration||'-'}}</span>
          </a>
        </template>
      </el-table-column>
      <el-table-column prop="lossTotal" label="损失电量(万Kwh)" width="125" :formatter="function(row, column, cellValue){return cellValue||'-'}"></el-table-column>
      <el-table-column prop="superviseCode" label="关联督办单" width="140" show-overflow-tooltip :formatter="function(row, column, cellValue){return cellValue||'-'}"></el-table-column>
      <el-table-column prop="leftoverProblem" label="发生原因" show-overflow-tooltip :formatter="function(row, column, cellValue){return cellValue||'-'}"></el-table-column>
      <el-table-column prop="supervisorName" label="负责人" width="95" :formatter="function(row, column, cellValue){return cellValue||'-'}"></el-table-column>
      <el-table-column prop="maintainerName" label="检修人" width="100" :formatter="function(row, column, cellValue){return cellValue||'-'}"></el-table-column>
      <el-table-column prop="stopStatusId" label="处理状态" width="100">
        <template slot-scope="scope">
          <div class="flex-center color1" v-if="scope.row.stopStatusId==1">
            <span>未开工</span>
          </div>
          <div class="flex-center color2" v-if="scope.row.stopStatusId==2">
            <span>处理中</span>
          </div>
          <div class="flex-center color4" v-if="scope.row.stopStatusId==3">
            <span>验收中</span>
          </div>
          <div class="flex-center color1" v-if="scope.row.stopStatusId==4">
            <span>验收不通过</span>
          </div>
          <div class="flex-center color5" v-if="scope.row.stopStatusId==5">
            <span>已处理</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="140" align="center">
        <template slot-scope="scope">
          <div class="flex-center blue">
            <a @click="save(scope.row)">保存</a>
            <el-divider direction="vertical"></el-divider>
            <a v-if="!scope.row.supervisionId" @click="getLossList(scope.row)">关联督办单</a>
            <a v-else @click="goPage(scope.row.supervisionId)">处理详情</a>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog title="关联督办单" :visible.sync="showMenu" @close="resetForm" custom-class="noTitleDialog">
      <div class="formWrap flex-column">
        <el-form class="formInPlan" ref="formInPlan" :model="formData" :rules="rulesLoss" label-suffix=":" label-width="110px" label-position="left">
          <el-form-item>
            <p>该停机记录尚未关联督办单！</p>
          </el-form-item>
          <el-form-item label="关联停机记录" prop="superviseId">
            <el-select style="width: 100%;" v-model="formData.superviseId" placeholder="请选择">
              <el-option :label="item.superviseLinkName" :value="item.superviseId" v-for="item in superviseList" :key="item.lossInfoId"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </div>
      <div class="footer flex-center">
        <a class="rightBtn grey flex-center" @click="close()">
          <span>取消</span>
        </a>
        <a class="rightBtn primary flex-center" @click="submit()">
          <span>确定</span>
        </a>
      </div>
    </el-dialog>
  </TabularData>
</template>
<script>
import TabularData from '@/views/operatingIndex/tabularData/TabularData.vue'
export default {
  components: { TabularData },
  data(){
    return {
      userInfo: JSON.parse(window.sessionStorage.getItem('userInfo')),
      tableDatas: this.tableData,
      showMenu: false,
      currentRow: {},
      formData: {
        superviseId: null
      },
      rulesLoss: {
        superviseId: [
          { required: true, message: '请关联督办单', trigger: 'change' },
        ],
      },
      superviseList: []
    }
  },
  props: {
    prosessCode: { type: Number, default: 1 },
    tableData: Array
  },
  watch: {
    tableData: {
      deep: true,
      handler(newData){
        // console.log(newData)
        this.tableDatas = newData
      }
    },
    filterText(val) {
      this.$refs.tree.filter(val);
    }
  },
  mounted(){
  },
  methods: {
    save: function(row){
      // console.log(row)
      this.loading = true
      // row.timeout = 300000
      this.$http.fetch(`supvLoss/updateLossInfo`,row).then(res => {
        this.loading = false
				if(res.code===0){
          this.$message.success('修改成功！')
          this.$emit('refresh')
        }
			})
    },
    remember: function(row,key){
      // row['isChange'+key] = true
      this.$set(row,'isChange'+key,true)
    },
    selectThisRow: function(row){
      this.$refs.stopTable.setCurrentRow(row)
    },
    close: function(){
      this.$refs.formInPlan.resetFields()
      this.showMenu = false
    },
    // 弹窗消失重置表单
    resetForm: function(){
      this.$refs.formInPlan.resetFields()
    },
    goPage: function(id){
      this.$router.push({
        path: `/overhaulSupervision/supervisionLookOver/supervisionLookOverDetail`, 
        query: {superviseId: id},
      })
    },
    // 获取督办单列表
    getLossList: function(param){
      this.currentRow = param
      this.$http.fetch(`supvLoss/querySuperviseForLoss`,{deviceAddressId: param.deviceAddressId}).then(res=>{
        if(res.code==0&&!this._isDestroyed){
          this.superviseList = res.data
          this.showMenu = true
        }else{
          this.superviseList = []
        }
      })
    },
    // 关联停机记录并跳转处理页面
    submit: function(){
      this.$refs.formInPlan.validate((valid) => {
        if (valid) {
          let data = {
            "createAccount": this.userInfo.userAccount,
            "lossInfoId": this.currentRow.id,
            "superviseId": this.formData.superviseId
          }
          this.$http.fetch(`supvLoss/updateSupvLossLink`,data).then(res=>{
            if(res.code==0&&!this._isDestroyed){
              this.$message({
                type: 'success',
                message: '关联成功！',
                duration: 1500,
                onClose: ()=>{
                  this.goPage(this.formData.superviseId)
                }
              })
            }
          })
        } else {
          return false;
        }
      });
    }
  }
}
</script>

<style scoped lang="less">
/deep/.stopTable{
  th{
    font-size: 14px;font-weight: normal;
    .cell{padding: 0 6px;}
  }
  td:nth-child(6) .cell, td:nth-child(7) .cell{ padding: 0;}
  td:nth-child(8){
    padding: 0;
    .cell{
      padding: 0; height: 44px; line-height: 44px;
      .el-tooltip{
        width: 100%;height: 100%; color: #fff;
        &.back1{
          background: #FF6666;
        }
        &.back4{
          background: #FF9900;
        }
      }
      .durationDefault{
        width: 100%;height: 44px; line-height: 44px;
      }
    }
  }
  .el-date-editor--datetime{width: 130px;}
  .el-input__inner{
    border: none; padding: 0; background-color: transparent; height: 23px;line-height: 23px; text-align: center;
  }
  .el-input__prefix, .el-input__suffix{ display: none;}
}
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