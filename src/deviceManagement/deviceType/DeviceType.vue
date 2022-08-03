<template>
  <div class="supervision flex-row">
    <div class="treeWrap flex-column" style="width: 320px;height: 100%;">
      <div class="treeTit">设备类型</div>
      <a class="btnList flex-vCenter" @click="addDevice()">
        <i class="icon yfFont icon-xinzeng"></i>
        <span>新增设备类型</span>
      </a>
      <div class="flex-1">
        <el-tree :props="props" :data="treeData" node-key="id" accordion empty-text="还未添加设备类型" :current-node-key="currentNodeKey" @node-click="treeClick">
          <span class="custom-tree-node" slot-scope="{ node,data }">
            <span v-if="node.label.length<=10">{{ node.label }}</span>
            <el-tooltip class="item" effect="dark" :content="node.label" placement="top" v-else>
              <span>{{ textOverflow(node.label) }}</span>
            </el-tooltip>
            <span class="btn">
              <i class="el-icon-plus" title="新增" @click.stop="addDevice(node)"></i>
              <i class="el-icon-edit" title="修改" @click.stop="editDevice(node)"></i>
              <i class="el-icon-delete" title="删除" @click.stop="delDevice(data)"></i>
            </span>
          </span>
        </el-tree>
      </div>
    </div>
    <div style="width: 10px; height: 100%; background: #fafafa;overflow: hidden;"></div>
    <div class="tableWrap flex-1 flex-column" style="height: 100%;">
      <div class="search flex-vCenter">
        <div class="timeWrap flex-vCenter">
          <el-input style="width: 240px;" v-model="keywords" size="medium" placeholder="请输入关键字" clearable></el-input>
        </div>
        <div class="submit flex-vCenter" @click="getDevice()">
          <span>查询</span>
        </div>
        <div class="flex-1"></div>
        <a class="btnList flex-vCenter" @click="delDevice()">
          <i class="icon yfFont icon-shanchu"></i>
          <span>删除</span>
        </a>
      </div>
      <div class="tableBox flex-1">
        <el-table :data="tableData" border style="width: 100%;" height="100%" size="medium" @select="handleSelect" @select-all="handleSelect">
          <el-table-column type="selection" width="40"></el-table-column>
          <el-table-column type="index" label="序号" width="55"></el-table-column>
          <el-table-column prop="deviceTypeName" label="设备类型名称" show-overflow-tooltip></el-table-column>
          <el-table-column prop="typeCode" label="设备类型编码" show-overflow-tooltip></el-table-column>
          <el-table-column prop="parentTypeName" label="上级类型名称" show-overflow-tooltip :formatter="function(row, column, cellValue){return cellValue||'-'}"></el-table-column>
          <el-table-column prop="remark" label="备注" show-overflow-tooltip :formatter="function(row, column, cellValue){return cellValue||'-'}"></el-table-column>
        </el-table>
      </div>
    </div>
    <el-dialog :title="formData.deviceTypeId?'编辑设备类型':'新增设备类型'" :visible.sync="showMenu1" @close="resetForm" :close-on-click-modal="false" custom-class="noTitleDialog">
      <div class="formWrap flex-column">
        <el-form class="formInPlan" ref="formInPlan" :model="formData" :rules="rules" label-suffix=":" label-width="110px" label-position="left">
          <el-form-item label="上级类型名称" prop="parentTypeName">
            <el-input v-model="formData.parentTypeName" placeholder="-" disabled></el-input>
          </el-form-item>
          <el-form-item label="上级类型编码" prop="parentTypeCode">
            <el-input v-model="formData.parentTypeCode" placeholder="-" disabled></el-input>
          </el-form-item>
          <el-form-item label="设备类型名称" prop="deviceTypeName">
            <el-input maxlength="50" v-model="formData.deviceTypeName" placeholder="请输入设备类型名称"></el-input>
          </el-form-item>
          <el-form-item label="设备类型编码" prop="typeCode">
            <el-input maxlength="50" v-model="formData.typeCode" placeholder="请输入设备类型编码"></el-input>
          </el-form-item>
          <el-form-item label="备注" prop="remark">
            <el-input maxlength="200" v-model="formData.remark" placeholder="请输入登录账号"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <div class="footer flex-center">
        <a class="rightBtn grey flex-center" @click="close()">
          <span>取消</span>
        </a>
        <a class="rightBtn primary flex-center" @click="saveDevice()">
          <span>保存</span>
        </a>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data(){
    return {
      props: {
        label: 'name',
        children: 'children'
      },
      treeData: [],
      currentNodeKey: 1, // 当前选中节点
      tableData: [], 
      keywords: '',
      showMenu1: false, // 显示新增组织弹窗
      formData: {
        deviceTypeName: '',
        typeCode: '',
        deviceTypeId: null,
        parentId: 0,
        parentTypeCode: '',
        parentTypeName: '',
        remark: ''
      },
      rules: {
        deviceTypeName: [
          { required: true, message: '请输入设备类型名称！', trigger: 'blur' },
        ],
        typeCode: [
          { required: true, message: '请输入设备类型编码！', trigger: 'blur' },
        ]
      },
      currentSelect: []
    }
  },
  created(){
    this.getDeviceTree()
  },
  methods: {
    // 查询当前项目已关联的劳务人员机构
    getDeviceTree: function(){
      this.$http.fetchGet(`deviceType/queryDeviceTypeTree`).then(res => {
				if(res.code==0&&!this._isDestroyed){
					this.treeData = res.data;
          if(res.data && res.data.length>0){
            this.currentNodeKey = this.currentNodeKey || res.data[0].id
            this.getDevice()
          }else{
            this.tableData = []
          }
				}else{
          this.tableData = []
        }
			});
    },
    getDevice: function(){
      let data = {
        deviceTypeId: this.currentNodeKey,
        keyName: this.keywords
      }
      this.$http.fetch(`deviceType/queryDeviceTypeList`,data).then(res => {
				if(res.code==0&&!this._isDestroyed){
					this.tableData = res.data;
				}else{
          this.tableData = []
        }
        this.currentSelect = []
			});
    },
    textOverflow: function(text){
      if(text.length<=10){
        return text
      }else{
        return text.substring(0,10)+'...'
      }
    },
    // 树节点被点击
    treeClick: function(data){
      // console.log(data,none)
      this.currentNodeKey = data.id
      this.getDevice()
    },
    // 新增单位或者组织
    addDevice: function(data){
      this.showMenu1 = true;
      this.$nextTick(()=>{
        if(data){
          this.formData = {
            deviceTypeName: '',
            typeCode: '',
            deviceTypeId: null,
            parentId: data.data.deviceTypeId,
            parentTypeCode: data.data.typeCode,
            parentTypeName: data.data.deviceTypeName,
            remark: ''
          }
        }else{
          this.formData = {
            deviceTypeName: '',
            typeCode: '',
            deviceTypeId: null,
            parentId: 0,
            parentTypeCode: '',
            parentTypeName: '',
            remark: ''
          }
        }
      })
    },
    // 修改单位或者组织
    editDevice: function(data){
      this.showMenu1 = true;
      this.$nextTick(()=>{
        this.formData = {
          deviceTypeName: data.data.deviceTypeName,
          typeCode: data.data.typeCode,
          deviceTypeId: data.data.deviceTypeId,
          parentId: data.data.parentId,
          parentTypeCode: data.data.parentTypeCode,
          parentTypeName: data.data.parentTypeName,
          remark: data.data.remark
        }
      })
    },
    // 删除组织机构
    delDevice: function(data){
      if(!data && this.currentSelect.length==0){
        this.$message.error('请至少选择一个设备类型！')
        return
      }
      this.$confirm(data?'确定删除该设备类型？':'确定删除所有选择的设备类型？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http.fetch(`deviceType/deleteDeviceTypeList`,{deviceTypeIds: data?[data.deviceTypeId]:this.currentSelect}).then(res => {
          if(res.code===0){
            if(data.deviceTypeId == this.currentNodeKey || this.currentSelect.includes(this.currentNodeKey)){
              this.currentNodeKey = null
            }
            this.$message({
              message: '删除成功！',
              type: 'success',
              duration: 1000,
              onClose: ()=>{
                this.getDeviceTree();
              }
            })
          }
        });
      }).catch(() => {});
    },
    handleSelect: function(selections){
      this.currentSelect = []
      selections.forEach(item=>{
        this.currentSelect.push(item.deviceTypeId)
      })
    },
    saveDevice: function(){
      this.$refs.formInPlan.validate((valid) => {
        if (valid) {
          if(!this.formData.deviceTypeId){
            this.$http.fetch(`deviceType/addDeviceType`,this.formData).then(res => {
              if(res.code===0){
                this.$message({
                  message: '添加成功！',
                  type: 'success',
                  duration: 2000,
                  onClose: ()=>{
                    this.$refs.formInPlan.resetFields();
                    this.showMenu1 = false
                    this.getDeviceTree()
                  }
                })
              }
            });
          }else{
            this.$http.fetch(`deviceType/updateDeviceType`,this.formData).then(res => {
              if(res.code===0){
                this.$message({
                  message: '修改成功！',
                  type: 'success',
                  duration: 2000,
                  onClose: ()=>{
                    this.$refs.formInPlan.resetFields();
                    this.showMenu1 = false
                    this.getDeviceTree()
                  }
                }) 
              }
            });
          }
        } else {
          return false;
        }
      });
    },
    close: function(){
      this.showMenu1 = false
      this.$refs.formInPlan.resetFields()
    },
    // 弹窗消失重置表单
    resetForm: function(){
      this.$refs.formInPlan.resetFields()
    },
  }
}
</script>

<style scoped lang="less">
.treeWrap{
  padding: 0 0 15px;
  .treeTit{font-size: 14px;color: #000;font-weight: bold;border-bottom: 1px solid #e5e5e5;text-indent: 20px;line-height: 46px;}
  .btnList{
    color: #38AEF3; height: 42px;padding-left: 16px;
    .icon{
      font-size: 20px;margin-right: 5px;
    }
    &:hover{
      color: #38AEF3;
    }
  }
}
/deep/.el-tree{
  height: 100%; overflow-y: auto;
  .el-tree-node.is-current > .el-tree-node__content{background: #eaf4ff;}
  .el-tree-node__content{
    color: #333;font-size: 14px;font-weight: bold;position: relative;height: 32px;
    span.btn{
      margin-left: 50px;font-weight: bold;font-size: 12px;opacity: 0;transition: opacity 0.25s ease-in-out;
      i{color: #fff;margin-right: 10px;padding: 4px;border-radius: 100%;background-color: #409EFF;}
    }
    &:hover span.btn{opacity: 1;}
  }
  .el-tree-node__children{
    .custom-tree-node span{
      font-weight: normal;font-size: 13px;
    }
  }
  .icon{font-size: 18px;margin: 1px 8px 0 2px;display: inline-block;vertical-align: middle;}
  .custom-tree-node span{display: inline-block;vertical-align: middle;}
}

.search{
  width: 100%;min-height: 66px;padding: 15px 0;font-size: 14px;color: #666;background-color: #fff;
  .btnList{
    margin-right: 20px;
    .icon{margin-right: 5px;margin-top: 2px;}
    &:hover{color: #38AEF3;}
  }
}
.timeWrap{margin-left: 20px;}
.submit{width: 86px;height: 34px;border: 1px solid #4eb6f0;color: #4eb6f0;font-size: 13px;margin-left: 15px;
border-radius: 3px;justify-content: center;cursor: pointer;}
.submit i{margin-right: 5px;margin-top: 2px;}
.submit:hover{color: #1b8cfd;border-color: #1b8cfd;}

/deep/.noTitleDialog{
  left: 50%; right: auto; top: 80px; width: 420px; margin-left: -210px; height: auto;
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
</style>