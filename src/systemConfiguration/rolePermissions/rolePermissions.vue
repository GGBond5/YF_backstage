<template>
  <div class="supervision flex-column">
    <div class="planBtnWrap flex-vCenter">
      <a class="btnList flex-vCenter" @click="addRole()">
        <i class="icon yfFont icon-xinzeng"></i>
        <span>新增角色</span>
      </a>
    </div>
    <div style="width: 100%; height: 10px; background: #fafafa;overflow: hidden;"></div>
    <div class="tableWrap flex-1" style="width: 100%;">
      <el-table :data="tableData" border style="width: 100%;" height="100%" size="medium">
        <!-- <el-table-column type="selection" width="40"></el-table-column> -->
        <el-table-column type="index" label="序号" width="55"></el-table-column>
        <el-table-column prop="workRoleName" label="角色名称" width="200" show-overflow-tooltip></el-table-column>
        <el-table-column prop="workRoleDesc" label="角色描述" show-overflow-tooltip :formatter="function(row, column, cellValue){return cellValue||'-'}"></el-table-column>
        <el-table-column prop="etime" label="关联用户" width="300" :formatter="function(row, column, cellValue){return cellValue||'-'}"></el-table-column>
        <el-table-column label="操作" width="200">
          <template slot-scope="scope">
            <a class="blue" @click="editRole(scope.row)">修改</a>
            <el-divider direction="vertical" v-if="scope.row.isAllowDelete"></el-divider>
            <a class="blue" @click="delRole(scope.row.id)" v-if="scope.row.isAllowDelete">删除</a>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog :title="formData.id?'编辑角色':'新增角色'" :visible.sync="showMenu1" @close="resetForm" :close-on-click-modal="false" custom-class="noTitleDialog">
      <div class="formWrap flex-column">
        <el-form class="formInPlan" ref="formInPlan" :model="formData" :rules="rules" label-suffix=":" label-position="left">
          <el-form-item label="角色名称" prop="workRoleName">
            <el-input maxlength="50" v-model="formData.workRoleName" placeholder="请输入角色名称"></el-input>
          </el-form-item>
          <el-form-item label="角色描述" prop="workRoleDesc">
            <el-input maxlength="50" v-model="formData.workRoleDesc" placeholder="请输入角色描述"></el-input>
          </el-form-item>
          <el-form-item label="权限设置" prop="authorityList">
            <el-table :data="limitData" border style="width: 100%;" height="490px" size="small">
              <el-table-column prop="authorityName" label="一级菜单">
                <template slot-scope="scope">
                  <div class="list">
                    <el-checkbox v-model="scope.row.checkedFlag" @change="(param)=>{handleSelect(param, scope.row)}">{{scope.row.authorityName}}</el-checkbox>
                  </div>
                </template>
              </el-table-column>
              <el-table-column prop="authorityName2" label="二级菜单">
                <template slot-scope="scope">
                  <div class="list" v-for="item in scope.row.childList" :key="item.id">
                    <el-checkbox v-model="item.checkedFlag" @change="(param)=>{handleSelect(param, item, scope.row)}">{{item.authorityName}}</el-checkbox>
                  </div>
                </template>
              </el-table-column>
              <el-table-column prop="authorityName3" label="功能选项">
                <template slot-scope="scope">
                  <div class="list" v-for="item in scope.row.childList" :key="item.id">
                    <el-checkbox v-model="item.havePermission"  :true-label="1" :false-label="0" 
                    v-if="item.funcOption1Name" :disabled="item.disabled">{{item.funcOption1Name}}</el-checkbox>
                  </div>
                </template>
              </el-table-column>
            </el-table>
          </el-form-item>
          <el-form-item label="督办单验收权限" prop="supvAcceptAuthId" v-if="isSelectAcceptAuth">
            <el-select style="width: 100%;" v-model="formData.supvAcceptAuthId" placeholder="请选择">
              <el-option :label="item.name" :value="item.id" v-for="item in supvAcceptAuthList" :key="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="督办单验收权限" prop="supvAcceptAuthIds" v-if="!isSelectAcceptAuth">
            <el-select style="width: 100%;" v-model="formData.supvAcceptAuthIds" placeholder="请选择" disabled>
              <el-option :label="item.name" :value="item.id" v-for="item in supvAcceptAuthList" :key="item.id"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </div>
      <div class="footer flex-center">
        <a class="rightBtn grey flex-center" @click="close()">
          <span>取消</span>
        </a>
        <a class="rightBtn primary flex-center" @click="save()">
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
      tableData: [],
      currentRow: {}, // 当前操作节点
      plantList: [], // 所有风场列表
      showMenu1: false, // 显示新增组织弹窗
      formData: {
        workRoleName: '',
        workRoleDesc: '',
        supvAcceptAuthId: null,
        isAllowDelete: 0,
        authorityList: []
      },
      rules: {
        workRoleName: [
          { required: true, message: '请输入角色名称！', trigger: 'blur' },
        ],
        supvAcceptAuthId: [
          { required: true, message: '请选择管理场站！', trigger: 'change' },
        ],
      },
      supvAcceptAuthList: [{name: '班组验收', id: 1},{name: '场站验收', id: 2},{name: '部门验收', id: 3}],
      isSelectAcceptAuth: false, // 是否需要选择验收部门
      limitData: [],
      currentSelectId: [], // 选中的id
    }
  },
  created(){
    this.getRoles()
    // this.getLimits()
  },
  methods: {
    // 获取所有角色
    getRoles: function(){
      this.$http.fetchGet(`system/getRoleList`).then(res => {
				if(res.code==0&&!this._isDestroyed){
					this.tableData = res.data;
				}
			});
    },
    // 获取所有权限
    // getLimits: function(){
    //   this.$http.fetchGet(`system/getAuthorityList`).then(res => {
		// 		if(res.code==0&&!this._isDestroyed){
    //       this.resetLimit(res.data)
		// 			this.limitData = res.data;
    //       console.log(this.limitData)
		// 		}
		// 	});
    // },
    // 重设disabled属性
    resetLimit: function(data){
      data.forEach(child=>{
        // child.checkedFlag = this.currentSelectId.includes(child.id)
        if(child.id === 101){
          if(child.childList[1].checkedFlag || child.childList[2].checkedFlag){
            this.isSelectAcceptAuth = true
          }else{
            this.isSelectAcceptAuth = false
          }
        }
        if(child.childList && child.childList.length>0){
          child.childList.forEach(item=>{
            // item.checkedFlag = this.currentSelectId.includes(item.id)
            // item.disabled = !this.currentSelectId.includes(item.id)
            // item.havePermission = this.currentSelectId.includes(item.id)?1:0
            item.disabled = !item.checkedFlag
          })
        }
      })
    },
    // 选择权限
    handleSelect: function(param, row, parent){
      if(row.id === 101 || row.id === 10102 || row.id === 10103){ // 点击检修督办，督办单创建&验收， 督办单批准&验收
        this.isSelectAcceptAuth = param
        if(!param){
          this.formData.supvAcceptAuthId = null
        }
      }
      if(row.id === 10104 || row.id === 10105){
        this.isSelectAcceptAuth = false
        this.formData.supvAcceptAuthId = null
      }
      // console.log(param, row, parent)
      if(parent){
        // 操作二级权限
        if(param){ // 二级选中
          row.disabled = false // 三级功能权限清除不可选状态
          parent.checkedFlag = true // 父级选中
          // 相邻二级权限 rankNo 相同的取消选中，同时取消其子级选中状态，并且变为不可选
          parent.childList.forEach(item=>{
            if(item.rankNo == row.rankNo && item.id != row.id){
              item.checkedFlag = false
              item.disabled = true
              item.havePermission = 0
            }
          })
        }else{ // 取消
          // 三级权限取消选中，且不可选
          row.disabled = true
          row.havePermission = 0
          // 如果当前父级权限下的子级都未选中，则父级取消选中
          let isParentSelect = false
          parent.childList.forEach(item=>{
            if(item.checkedFlag){
              isParentSelect = true
            }
          })
          parent.checkedFlag = isParentSelect
        }
      }else{
        // 操作一级权限
        // console.log(param)
        if(param){ // 一级权限选中
          // 不同rankNo子级权限全部选中，并清空第三级功能权限不可选中状态，相同rankNo选中第一个
          let rankNo = null
          row.childList.forEach(item=>{
            if(item.rankNo != rankNo){
              item.checkedFlag = true
              item.disabled = false
            }
            rankNo = item.rankNo
          })
          // 相同rankNo的一级权限取消选中，并且其子级取消选中，第三级取消选中并不可选
          this.limitData.forEach(child=>{
            if(child.rankNo == row.rankNo && child.id != row.id){
              child.checkedFlag = false
              if(child.childList && child.childList.length>0){
                child.childList.forEach(item=>{
                  item.checkedFlag = false
                  item.disabled = true
                  item.havePermission = 0
                })
              }
            }
          })
        }else{
          row.childList.forEach(item=>{
            item.checkedFlag = false
            item.havePermission = 0
            item.disabled = true
          })
        }
      }
    },
    // 新增角色
    addRole: function(){
      this.$http.fetchGet(`system/getAuthorityList`).then(res => {
				if(res.code==0&&!this._isDestroyed){
          this.resetLimit(res.data)
					this.limitData = res.data;
          this.showMenu1 = true;
          this.formData = {
            workRoleName: '',
            workRoleDesc: '',
            supvAcceptAuthId: null,
            isAllowDelete: 0,
            authorityList: []
          }
				}
			});
    },
    // 修改角色
    editRole: function(row){
      // console.log(data)
      this.showMenu1 = true;
      this.$http.fetchGet(`system/getRoleInfo?roleId=${row.id}`).then(res => {
				if(res.code==0&&!this._isDestroyed){
          this.resetLimit(res.data.authorityList)
					this.limitData = res.data.authorityList;
          this.showMenu1 = true;
          this.formData = {
            workRoleName: res.data.workRoleName,
            workRoleDesc: res.data.workRoleDesc,
            supvAcceptAuthId: res.data.supvAcceptAuthId,
            id: res.data.roleId,
            isAllowDelete: 0,
            authorityList: []
          }
				}
			});
    },
    // 删除组织机构
    delRole: function(id){
      // console.log(data);
      this.$confirm('确定删除该该角色？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http.fetch(`system/delRole?roleId=${id}`).then(res => {
          if(res.code===0){
            this.$message({
              message: '删除成功！',
              type: 'success',
              duration: 1000,
              onClose: ()=>{
                this.getRoles();
              }
            })
          }
        });
      }).catch(() => {         
      });
    },
    save: function(){
      this.$refs.formInPlan.validate((valid) => {
        if (valid) {
          let _limitData = []
          this.limitData.forEach(child=>{
            if(child.checkedFlag){
              _limitData.push({key: child.id, value: 0})
            }
            child.childList.forEach(item=>{
              if(item.checkedFlag){
                _limitData.push({key: item.id, value: item.havePermission})
              }
            })
          })
          this.formData.authorityList = _limitData
          if(!this.formData.authorityList || this.formData.authorityList.length==0){
            this.$message.error('请至少选择一项权限！')
            return
          }
          // console.log(this.formData)
          if(!this.formData.id){
            this.$http.fetch(`system/saveRole`,this.formData).then(res => {
              if(res.code===0){
                this.$message({
                  message: '添加成功！',
                  type: 'success',
                  duration: 2000,
                  onClose: ()=>{
                    this.$refs.formInPlan.resetFields();
                    // this.currentSelectId = []
                    this.showMenu1 = false
                    this.getRoles()
                  }
                }) 
              }
            });
          }else{
            this.$http.fetch(`system/roleEdit`,this.formData).then(res => {
              if(res.code===0){
                this.$message({
                  message: '修改成功！',
                  type: 'success',
                  duration: 2000,
                  onClose: ()=>{
                    this.$refs.formInPlan.resetFields();
                    // this.currentSelectId = []
                    this.showMenu1 = false
                    this.getRoles()
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
      this.$refs.formInPlan.resetFields()
      this.showMenu1 = false
      // this.currentSelectId = []
    },
    // 弹窗消失重置表单
    resetForm: function(){
      // this.currentSelectId = []
      this.$refs.formInPlan.resetFields()
    },
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
/deep/.noTitleDialog{
  left: 50%; right: auto; top: 50%; width: 760px; margin-left: -210px; height: 800px; margin-top: -370px !important;
  .el-dialog__header{
    display: block; padding: 10px 20px; border-bottom: 1px solid #e5e5e5;
    .el-dialog__title{
      font-size: 14px;font-weight: bold;
    }
  }
  .formWrap{
    .el-form-item{
      display: flex;
      .el-form-item__label{
        min-width: 80px;
      }
      .el-form-item__content{ flex: 1;}
    }
    .el-table{
      .el-table__header{ line-height: 23px;}
      .el-table__body{
        td{
          padding: 0;
          .cell{
            padding: 0;
            .list{
              text-align: left; padding: 0 15px; height: 38px; line-height: 38px;
            }
          }
          &:not(:first-child) .cell .list{
            border-bottom: 1px solid #f0f0f0;
            &:last-child{ border-bottom: none;}
          }
        }
        .el-table__row:hover td .cell .list{ border-color: #eaeaea;}
      }
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