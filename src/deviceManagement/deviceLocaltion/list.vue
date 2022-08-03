<template>
  <div class="supervision flex-row">
    <div class="treeWrap flex-column" style="width: 320px;height: 100%;">
      <div class="treeTit">设备位置</div>
      <a class="btnList flex-vCenter" @click="addDevice()">
        <i class="icon yfFont icon-xinzeng"></i>
        <span>新增设备位置</span>
      </a>
      <div class="flex-1">
        <el-tree :props="props" :data="treeData" node-key="id" accordion empty-text="还未添加设备位置" :current-node-key="currentNodeKey" @node-click="treeClick">
          <span class="custom-tree-node" slot-scope="{ node,data }">
            <span v-if="node.label.length<=10">{{ node.label }}</span>
            <el-tooltip class="item" effect="dark" :content="node.label" placement="top" v-else>
              <span>{{ textOverflow(node.label) }}</span>
            </el-tooltip>
            <span class="btn">
              <i class="el-icon-plus" title="新增" @click.stop="addDevice(data)"></i>
              <i class="el-icon-edit" title="修改" @click.stop="editDevice(data)"></i>
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
          <el-table-column prop="addressName" label="设备位置名称" show-overflow-tooltip></el-table-column>
          <el-table-column prop="addressCode" label="设备位置编码" show-overflow-tooltip></el-table-column>
          <el-table-column prop="deviceTypeName" label="设备类型" show-overflow-tooltip :formatter="function(row, column, cellValue){return cellValue||'-'}"></el-table-column>
          <el-table-column prop="parentAddressName" label="上级位置名称" show-overflow-tooltip :formatter="function(row, column, cellValue){return cellValue||'-'}"></el-table-column>
          <el-table-column label="操作" width="120">
            <template slot-scope="scope">
              <div class="flex-center blue">
                <a @click="editDevice(scope.row)">编辑</a>
                <el-divider direction="vertical"></el-divider>
                <a @click="delDevice(scope.row)">删除</a>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
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
      formData: {},
      currentSelect: []
    }
  },
  created(){
    window.sessionStorage.setItem('formRoute', JSON.stringify([{path:this.$route.path,query: {}}]));
    this.getDeviceTree()
  },
  methods: {
    // 查询当前项目已关联的劳务人员机构
    getDeviceTree: function(){
      this.$http.fetchGet(`deviceAddress/queryDeviceAddressForTree`).then(res => {
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
        deviceAddressId: this.currentNodeKey,
        keyName: this.keywords
      }
      this.$http.fetch(`deviceAddress/queryDeviceAddress`,data).then(res => {
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
      this.$router.push({
        path: `/deviceManagement/deviceLocaltion/detail`, 
        query: {parentId: data?data.deviceAddressId:0}
      })
    },
    // 修改单位或者组织
    editDevice: function(data){
      this.$router.push({
        path: `/deviceManagement/deviceLocaltion/detail`, 
        query: {deviceAddressId: data.deviceAddressId}
      })
    },
    // 删除组织机构
    delDevice: function(data){
      if(!data && this.currentSelect.length==0){
        this.$message.error('请至少选择一个设备位置！')
        return
      }
      this.$confirm(data?'确定删除该设备位置？':'确定删除所有选择的设备位置？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http.fetch(`deviceAddress/deleteDeviceAddress`,{devicAddressIds: data?[data.deviceAddressId]:this.currentSelect}).then(res => {
          if(res.code===0){
            if(data.deviceAddressId == this.currentNodeKey || this.currentSelect.includes(this.currentNodeKey)){
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
        this.currentSelect.push(item.deviceAddressId)
      })
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