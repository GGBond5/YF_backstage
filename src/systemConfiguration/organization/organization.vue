<template>
  <div class="supervision flex-column">
    <div class="planBtnWrap flex-vCenter">
      <a class="btnList flex-vCenter" @click="addCompanyInfo()">
        <i class="icon yfFont icon-xinzeng"></i>
        <span>新增组织机构</span>
      </a>
    </div>
    <div style="width: 100%; height: 10px; background: #fafafa;overflow: hidden;"></div>
    <div class="treeWrap flex-1" style="width: calc(100% - 20px);">
      <el-tree :props="props" :data="treeData" node-key="id" :default-expanded-keys="expanded"
      @node-expand="nodeExpand" @node-collapse="nodeCollapse" empty-text="还未添加组织机构">
        <span class="custom-tree-node" slot-scope="{ node, data }">
          <i class="icon el-icon-office-building" v-if="node.level==1"></i>
          <i class="icon el-icon-school" v-if="node.level==2"></i>
          <i class="icon el-icon-suitcase-1" v-if="node.level>2"></i>
          <span>{{ node.label }}</span>
          <span class="btn">
            <i class="el-icon-plus" title="新增" @click.stop="addCompanyInfo(node)"></i>
            <i class="el-icon-edit" title="修改" @click.stop="editCompanyInfo(node)"></i>
            <i class="el-icon-delete" title="删除" @click.stop="delCompanyInfo(data)"></i>
          </span>
        </span>
      </el-tree>
    </div>
    <el-dialog :title="`${formData.id?'编辑':'新增'}组织机构${formData.parentId===0?'':'部门'}`" :visible.sync="showMenu1" @close="resetForm" :close-on-click-modal="false" custom-class="noTitleDialog">
      <div class="formWrap flex-column">
        <el-form class="formInPlan" ref="formInPlan" :model="formData" :rules="rules" label-suffix=":" label-width="90px" label-position="left">
          <el-form-item label="单位名称" prop="departmentName">
            <el-input maxlength="50" v-model="formData.departmentName" placeholder="请输入组织机构名称"></el-input>
          </el-form-item>
          <el-form-item label="管理场站" prop="plantIdList" v-if="formData.parentId === 0">
            <el-select style="width: 100%;" v-model="formData.plantIdList" multiple collapse-tags placeholder="请选择">
              <el-option :label="item.plantName" :value="item.plantId" v-for="item in plantList" :key="item.plantId"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="" prop="singlePlantFlag" v-if="formData.parentId === 0">
            <el-checkbox v-model="formData.singlePlantFlag" :true-label="1" :false-label="0">登录时选择风场</el-checkbox>
          </el-form-item>
        </el-form>
      </div>
      <div class="footer flex-center">
        <a class="rightBtn grey flex-center" @click="close()">
          <span>取消</span>
        </a>
        <a class="rightBtn primary flex-center" @click="saveLargePart()">
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
        label: 'departmentName',
        children: 'child'
      },
      treeData: [],
      expanded: [], //当前展开节点
      plantList: [], // 所有风场列表
      showMenu1: false, // 显示新增组织弹窗
      formData: {
        parentId: 0,
        departmentName: '',
        plantIdList: [],
        singlePlantFlag: 0
      },
      rules: {
        departmentName: [
          { required: true, message: '请输入组织机构名称！', trigger: 'blur' },
        ],
        plantIdList: [
          { required: true, message: '请选择管理场站！', trigger: 'change' },
        ],
      }
    }
  },
  created(){
    this.getCompanyTree()
    this.getPlantList()
  },
  methods: {
    // 查询当前项目已关联的劳务人员机构
    getCompanyTree: function(){
      this.$http.fetchGet(`system/org`).then(res => {
				if(res.code==0&&!this._isDestroyed){
					this.treeData = res.data;
          // console.log(this.expanded)
          // if(this.expanded.length==0){
          //   this.expanded.push(res.data[0].id)
          // }
				}
			});
    },
    getPlantList: function(){
      this.$http.fetchGet(`plant/plantList`).then(res => {
				if(res.code==0&&!this._isDestroyed){
					this.plantList = res.data;
				}
			});
    },
    // 新增单位或者组织
    addCompanyInfo: function(data){
      console.log(data)
      this.showMenu1 = true;
      this.$nextTick(()=>{
        if(data){
          this.formData = {
            parentId: data.data.id,
            departmentName: ''
          }
        }else{
          this.formData = {
            parentId: 0,
            departmentName: '',
            plantIdList: [],
            singlePlantFlag: 0
          }
        }
      })
      
    },
    // 修改单位或者组织
    editCompanyInfo: function(data){
      // console.log(data)
      this.showMenu1 = true;
      this.$nextTick(()=>{
        if(data.data.level === 1){
          let plantId = []
          data.data.plantList.forEach(item=>{
            plantId.push(item.key)
          })
          this.formData = {
            parentId: data.data.parentId,
            id: data.data.id,
            departmentName: data.data.departmentName,
            plantIdList: plantId,
            singlePlantFlag: data.data.singlePlantFlag,
            rankNo: data.data.rankNo
          }
        }else{
          this.formData = {
            parentId: data.data.parentId,
            id: data.data.id,
            departmentName: data.data.departmentName,
            plantIdList: null,
            singlePlantFlag: data.data.singlePlantFlag,
            rankNo: data.data.rankNo
          }
        }
      })
      
    },
    // 删除组织机构
    delCompanyInfo: function(data){
      // console.log(data);
      this.$confirm('确定删除该组织机构及其子部门？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http.fetch(`system/orgDel?id=${data.id}`).then(res => {
          if(res.code===0){
            this.$message({
              message: '删除成功！',
              type: 'success',
              duration: 2000,
              onClose: ()=>{
                this.getCompanyTree()
              }
            }) 
          }
        });
      }).catch(() => {         
      });
    },
    saveLargePart: function(){
      console.log(this.formData)
      this.$refs.formInPlan.validate((valid) => {
        if (valid) {
          if(!this.formData.id){ // 新增
            let data
            if(this.formData.parentId === 0){
              data = {
                departmentName: this.formData.departmentName,
                parentId: this.formData.parentId,
                plantIdList: this.formData.plantIdList,
                singlePlantFlag: this.formData.singlePlantFlag
              }
            }else{
              data = {
                departmentName: this.formData.departmentName,
                parentId: this.formData.parentId
              }
            }
            this.$http.fetch("system/orgAdd",data).then(res => {
              if(res.code===0){
                this.$message({
                  message: '添加成功！',
                  type: 'success',
                  duration: 2000,
                  onClose: ()=>{
                    this.getCompanyTree()
                    this.$refs.formInPlan.resetFields()
                    this.showMenu1 = false;
                  }
                }) 
              }
            });
          }else{
            this.$http.fetch("system/orgEdit",this.formData).then(res => {
              if(res.code===0){
                this.$message({
                  message: '编辑成功！',
                  type: 'success',
                  duration: 2000,
                  onClose: ()=>{
                    this.getCompanyTree()
                    this.$refs.formInPlan.resetFields()
                    this.showMenu1 = false;
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
    // 节点展开，添加id
    nodeExpand: function(row){
      if(!this.expanded.includes(row.id)){
        this.expanded.push(row.id);
      }
    },
    // 节点被收起，删除id
    nodeCollapse: function(row){
      console.log(this.expanded)
      if(this.expanded && this.expanded.length>0){
        let index = this.expanded.indexOf(row.id);
        this.expanded.splice(index,1);
      }
    },
    close: function(){
      this.$refs.formInPlan.resetFields()
      this.showMenu1 = false
    },
    // 弹窗消失重置表单
    resetForm: function(){
      this.$refs.formInPlan.resetFields()
    }
  }
}
</script>

<style scoped lang="less">
.planBtnWrap{
  width: 100%;height: 64px; padding: 0 20px;
  .btnList{
    margin-right: 30px; color: #38AEF3;
    .icon{
      font-size: 20px;margin-right: 5px;
    }
    &:hover{
      color: #38AEF3;
    }
  }
}
.treeWrap{padding: 0 0 15px;}
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
/deep/.noTitleDialog{
  left: 50%; right: auto; top: 80px; width: 420px; margin-left: -210px; height: auto;
  .el-dialog__header{
    display: block; padding: 10px 20px; border-bottom: 1px solid #e5e5e5;
    .el-dialog__title{
      font-size: 14px;font-weight: bold;
    }
  }
  .el-form-item:nth-child(2){margin-bottom: 3px;}
  .el-dialog__headerbtn{
    display: block; top: 15px;
  }
  .footer{
    padding-bottom: 20px;
  }
  
}
</style>