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
  </div>
</template>

<script>
export default {
  data(){
    return {
    }
  },
  created(){
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
  }
}
</script>

<style scoped lang="less">

</style>