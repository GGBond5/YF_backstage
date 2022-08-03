<template>
  <div class="supervision flex-column">
    <div class="planBtnWrap flex-vCenter">
      <a class="btnList flex-vCenter" @click="addUser()">
        <i class="icon yfFont icon-xinzeng"></i>
        <span>新增用户</span>
      </a>
    </div>
    <div style="width: 100%; height: 10px; background: #fafafa;overflow: hidden;"></div>
    <div class="flex-1 flex-row">
      <div class="treeWrap" style="width: 320px;height: 100%;">
        <el-tree :props="props" :data="treeData" node-key="id" accordion empty-text="还未添加组织机构" :current-node-key="currentNodeKey" @node-click="treeClick">
          <span class="custom-tree-node" slot-scope="{ node }">
            <i class="icon el-icon-office-building" v-if="node.level==1"></i>
            <i class="icon el-icon-school" v-if="node.level==2"></i>
            <i class="icon el-icon-suitcase-1" v-if="node.level>2"></i>
            <!-- <span :title="node.label.length>16?node.label:''">{{ textOverflow(node.label) }}</span> -->
            <span v-if="node.label.length<=16">{{ node.label }}</span>
            <el-tooltip class="item" effect="dark" :content="node.label" placement="top" v-else>
              <span>{{ textOverflow(node.label) }}</span>
            </el-tooltip>
          </span>
        </el-tree>
      </div>
      <div class="tableWrap flex-1" style="height: 100%;">
        <el-table :data="tableData" border style="width: 100%;" height="100%" size="medium">
          <!-- <el-table-column type="selection" width="40"></el-table-column> -->
          <el-table-column type="index" label="序号" width="55"></el-table-column>
          <el-table-column prop="userName" label="用户姓名" show-overflow-tooltip></el-table-column>
          <el-table-column prop="userAccount" label="登录账号" show-overflow-tooltip></el-table-column>
          <el-table-column prop="departmentName" label="所属部门" show-overflow-tooltip min-width="160" :formatter="function(row, column, cellValue){return cellValue||'-'}"></el-table-column>
          <el-table-column prop="workRoleName" label="用户角色" show-overflow-tooltip></el-table-column>
          <el-table-column prop="deleteFlag" label="状态">
            <template slot-scope="scope">{{scope.row.deleteFlag?'停用':'启用'}}</template>
          </el-table-column>
          <el-table-column label="操作" width="200">
            <template slot-scope="scope">
              <a class="blue" @click="editUser(scope.row)">修改</a>
              <el-divider direction="vertical"></el-divider>
              <a class="blue" @click="delUser(scope.row.userId)">删除</a>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <el-dialog :title="formData.userID?'编辑组织机构':'新增组织机构'" :visible.sync="showMenu1" @close="resetForm" :close-on-click-modal="false" custom-class="noTitleDialog">
      <div class="formWrap flex-column">
        <el-form class="formInPlan" ref="formInPlan" :model="formData" :rules="rules" label-suffix=":" label-width="90px" label-position="left">
          <el-form-item label="用户名称" prop="userName">
            <el-input maxlength="50" v-model="formData.userName" placeholder="请输入用户名称"></el-input>
          </el-form-item>
          <el-form-item label="登录账号" prop="account">
            <el-input maxlength="50" v-model="formData.account" placeholder="请输入登录账号"></el-input>
          </el-form-item>
          <el-form-item label="所属单位" prop="orgID">
            <el-select style="width: 100%;" v-model="formData.orgID" placeholder="请选择" @change="getDepartment">
              <el-option :label="item.departmentName" :value="item.id" v-for="item in treeData" :key="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="所属部门" prop="departmentID">
            <!-- <el-select style="width: 100%;" v-model="formData.departmentID"  placeholder="请选择">
              <el-option :label="item.departmentName" :value="item.id" v-for="item in departmentList" :key="item.id"></el-option>
            </el-select> -->
            <el-cascader style="width: 100%;" v-model="formData.departmentID" :options="departmentList" :props="propsOption"></el-cascader>
          </el-form-item>
          <el-form-item label="用户角色" prop="roleID">
            <el-select style="width: 100%;" v-model="formData.roleID" placeholder="请选择">
              <el-option :label="item.workRoleName" :value="item.id" v-for="item in rolesList" :key="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item :label="formData.userID?'新密码':'初始密码'" prop="pwd">
            <el-input maxlength="50" type="password" autocomplete="off" v-model="formData.pwd" placeholder="请输入密码"></el-input>
          </el-form-item>
          <el-form-item label="确认密码" prop="pwdNew">
            <el-input maxlength="50" type="password" autocomplete="off" v-model="formData.pwdNew" placeholder="确认密码"></el-input>
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
    var validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'));
      } else {
        if (this.formData.pwdNew !== '') {
          this.$refs.formInPlan.validateField('pwdNew');
        }
        callback();
      }
    };
    var validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'));
      } else if (value !== this.formData.pwd) {
        callback(new Error('两次输入密码不一致!'));
      } else {
        callback();
      }
    };
    return {
      props: {
        label: 'departmentName',
        children: 'child'
      },
      treeData: [],
      currentNodeKey: 1, // 当前选中节点
      tableData: [], 
      departmentList: [], // 部门列表
      rolesList: [], // 角色列表
      propsOption: {
        expandTrigger: 'hover',
        value: 'id',
        label: 'departmentName',
        children: 'child',
        emitPath: false,
        checkStrictly: true
      },
      showMenu1: false, // 显示新增组织弹窗
      formData: {
        account: '',
        departmentID: null,
        orgID: null,
        pwd: '',
        pwdNew: '',
        roleID: null,
        userID: null,
        userName: ''
      },
      rules: {
        userName: [
          { required: true, message: '请输入用户名称！', trigger: 'blur' },
        ],
        account: [
          { required: true, message: '请输入登录账号！', trigger: 'blur' },
        ],
        orgID: [
          { required: true, message: '请选择组织机构！', trigger: 'change' },
        ],
        departmentID: [
          { required: true, message: '请选择部门！', trigger: 'change' },
        ],
        roleID: [
          { required: true, message: '请选择角色！', trigger: 'change' },
        ],
        pwd: [
          { validator: validatePass, trigger: 'blur' }
        ],
        pwdNew: [
          { validator: validatePass2, trigger: 'blur' }
        ],
      },
    }
  },
  created(){
    this.getCompanyTree()
    this.getRoles()
  },
  methods: {
    // 查询当前项目已关联的劳务人员机构
    getCompanyTree: function(){
      this.$http.fetchGet(`system/org`).then(res => {
				if(res.code==0&&!this._isDestroyed){
					this.treeData = res.data;
          if(res.data && res.data.length>0){
            this.currentNodeKey = res.data[0].id
            this.getUser()
          }else{
            this.tableData = []
          }
				}else{
          this.tableData = []
        }
			});
    },
    textOverflow: function(text){
      if(text.length<=16){
        return text
      }else{
        return text.substring(0,16)+'...'
      }
    },
    // 树节点被点击
    treeClick: function(data){
      // console.log(data,none)
      this.currentNodeKey = data.id
      this.getUser()
    },
    // 获取用户列表
    getUser: function(){
      this.$http.fetchGet(`system/getUserList?departmentId=${this.currentNodeKey}`).then(res => {
				if(res.code==0&&!this._isDestroyed){
					this.tableData = res.data;
				}else{
          this.tableData = []
        }
			});
    },
    getRoles: function(){
      this.$http.fetchGet(`system/getRoleList`).then(res => {
				if(res.code==0&&!this._isDestroyed){
					this.rolesList = res.data;
				}
			});
    },
    // 新增单位或者组织
    addUser: function(){
      if(!this.treeData || this.treeData.length == 0){
        this.$message.error('请先添加组织机构！')
        return
      }
      this.showMenu1 = true;
      this.$nextTick(()=>{
        this.departmentList = []
        this.formData.userID = null
      })
    },
    // 修改单位或者组织
    editUser: function(row){
      this.showMenu1 = true;
      this.$nextTick(()=>{
        this.formData = {
          account: row.userAccount,
          departmentID: row.departmentId,
          orgID: row.companyId, // 点击事件记录
          pwd: row.userPassword,
          pwdNew: row.userPassword,
          roleID: row.roleId,
          userID: row.userId,
          userName: row.userName
        }
        this.getDepartment()
      })
    },
    // 获取当前组织下面的部门
    getDepartment: function(){
      this.treeData.forEach(item=>{
        if(item.id == this.formData.orgID){
          this.departmentList = [item]
        }
      })
    },
    // 删除组织机构
    delUser: function(id){
      // console.log(data);
      this.$confirm('确定删除该用户？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http.fetch(`system/delUser?userId=${id}`).then(res => {
          if(res.code===0){
            this.$message({
              message: '删除成功！',
              type: 'success',
              duration: 1000,
              onClose: ()=>{
                this.getUser();
              }
            })
          }
        });
      }).catch(() => {         
      });
    },
    saveLargePart: function(){
      this.$refs.formInPlan.validate((valid) => {
        if (valid) {
          if(!this.formData.userID){
            this.$http.fetch(`system/saveUser`,this.formData).then(res => {
              if(res.code===0){
                this.$message({
                  message: '添加成功！',
                  type: 'success',
                  duration: 2000,
                  onClose: ()=>{
                    this.$refs.formInPlan.resetFields();
                    // this.currentSelectId = []
                    this.showMenu1 = false
                    this.getUser()
                  }
                }) 
              }
            });
          }else{
            this.$http.fetch(`system/editUser`,this.formData).then(res => {
              if(res.code===0){
                this.$message({
                  message: '修改成功！',
                  type: 'success',
                  duration: 2000,
                  onClose: ()=>{
                    this.$refs.formInPlan.resetFields();
                    // this.currentSelectId = []
                    this.showMenu1 = false
                    this.getUser()
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
  .el-dialog__headerbtn{
    display: block; top: 15px;
  }
  .footer{
    padding-bottom: 20px;
  }
  
}
</style>