<template>
  <div class="login">
    <div class="companyLogo">
    </div>
    <div class="container">
      <div class="loginInfo" v-if="isSucceed">
        <h1>基于数据驱动的自主检修过程监管和决策支持系统</h1>
        <el-form class="content" ref="form" :model="form" :rules="rules" label-width="0"  @keyup.enter = "login">
          <el-form-item prop="account">
            <el-input @keyup.down = "focus('password')"  ref="account"  maxlength="50" @change="changeInput" autocomplete="off"
            placeholder="用户名" prefix-icon="el-icon-s-custom" v-model="form.account">
            </el-input>
          </el-form-item>
          <el-form-item prop="password" :error="errorMsg">
            <el-input @keyup.down = "focus('account')"  ref="password"  maxlength="50" @change="changeInput" autocomplete="off"
            placeholder="密码" prefix-icon="el-icon-unlock" v-model="form.password" show-password>
            </el-input>
          </el-form-item>
          <el-form-item>
            <el-checkbox v-model="form.rememberMe">自动登录</el-checkbox>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" style="width:100%" @click="submitForm('form')">登录</el-button>
          </el-form-item>
        </el-form>
      </div>
      <!-- 检修人员选择风场 -->
      <div class="selectSite" v-else>
        <div>{{userInfo.userName || userInfo.userAccount}}({{userInfo.workRoleName||'游客'}})，欢迎您!</div>
        <div>请选择您此次需要进入的风场：</div>
        <div class="site">
          <span v-for="item in plantList" :key="item.key" @click="selected(item.key)" :class="{isAction: currentIndex === item.key}">{{item.value}}</span>
        </div>
        <div>
          <!-- <el-button style="width:210px" @click="cancel()">取消</el-button> -->
          <el-button type="primary" style="width:210px" @click="entrance()">确认</el-button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { JSEncrypt } from 'jsencrypt'
import util from '@/plugins/util.js'
import {mapGetters} from 'vuex'
export default {
  data () {
    return {
      errorMsg:'',
      form: {
          account:'admin',
          password:'123456',
          rememberMe:false
        },
      rules: {
          account: [
            { required: true, message: '用户名不能为空', trigger: 'change' },
            { min: 4, message: '请输入完整的用户名', trigger: 'blur' }
          ],
          password: [
            { required: true, message: '密码不能为空', trigger: 'change' },
            { min: 4, message: '请输入正确的密码', trigger: 'blur' }
          ],
        },
      isSucceed:true,   //true显示登录,false显示风场选择
      userInfo: {},
      plantList:[],
      currentIndex: null
    }
  },
  computed: {
    ...mapGetters(['menu'])
  },
  created(){
  },
  methods:{
    focus(elem){
			this.$refs[elem].focus();
		},
    // 输入框有改变时，清空记住的密码
		changeInput: function(){
			this.form.passwordjm = null;
		},
    submitForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.getPublicKey();
          // this.isSucceed = false
        } else {
          console.log('error submit!');
          return false;
        }
      });
    },
    // 获取公钥
		getPublicKey: function(){
			this.$http.fetch("login/getPublicKey").then(res => {
				if(res){
					// console.log(1,res)
					if(res.code===0){
						var loginData = {
              account: this.form.account,
              platform: 0,
              pwd: this.encryptedData(res.data,this.form.password),
              rememberMe: this.form.rememberMe
            };
						// loginData.account = this.form.account;
						// console.log(this.encryptedData(res.data,this.form.password))
						// loginData.pwd = this.form.passwordjm =  this.encryptedData(res.data,this.form.password);
						// loginData.platform = 0;
						this.loginApi(loginData);
					}
				}
			});
		},
		// 加密
    encryptedData(publicKey, data) {
      // 新建JSEncrypt对象
      let encryptor = new JSEncrypt();
      // 设置公钥
      encryptor.setPublicKey(publicKey);
      // 加密数据
      return encryptor.encrypt(data);
		},
    // 请求登录接口
		loginApi: function(data){
			// console.log(2,data);
			this.$http.fetch("login/login",data).then(res => {
				if(res){
					// console.log(3,res)
					if(res.code===0){
						if(this.form.rememberMe){
							localStorage.setItem("autoLogin",res.data.sessionId);
						}else{
							localStorage.removeItem("autoLogin");
						}
            this.userInfo = res.data
            //**************** */ 权限部分
            // let _userMenuId = []
            // this.userInfo.authorityVos.forEach(first=>{
            //   _userMenuId.push(first.id)
            //   if(first.childList && first.childList.length>0){
            //     first.childList.forEach(seccond=>{
            //       _userMenuId.push(seccond.id)
            //     })
            //   }
            // })
            // console.log(_userMenuId,this.menu)
            // let currentMenu = [], firstRoute = ''
            // this.menu.forEach((first,firstIndex)=>{
            //   if(_userMenuId.includes(first.index)){
            //     currentMenu.push({...first,children: []})
            //     if(first.children && first.children.length>0){
            //       first.children.forEach(seccond=>{
            //         if(_userMenuId.includes(seccond.index)){
            //           currentMenu[firstIndex].children.push(seccond)
            //         }
            //       })
            //     }
            //   }
            // })
            // console.log(currentMenu)
            // firstRoute = currentMenu[0].children[0].path
            // window.sessionStorage.setItem('menuList', JSON.stringify(currentMenu));
            // window.sessionStorage.setItem('firstRoute', firstRoute);
            // this.$store.commit('set_menu', currentMenu)
						window.sessionStorage.setItem('userInfo', JSON.stringify(this.userInfo));
            util.setCookie('accessToken', res.data.sessionId); //储存token
            //******************** */ 权限结束
            if(!this.userInfo.singlePlantFlag || this.userInfo.lastLoginPlantId){
              // this.$router.push(firstRoute)
              this.$router.push('/overhaulSupervision')
            }else{
              this.plantList = this.userInfo.plantList
              this.isSucceed = false
            }
            
						// 根据权限判断显示隐藏导航
					}
				}
			});
		},
    selected (index) {
      if(this.currentIndex != index){
        this.currentIndex = index
      }
    },
    cancel () {
      this.isSucceed = true
      // util.delCookie('accessToken'); // 删除token
    },
    entrance () {
      if(this.currentIndex){
        this.$http.fetchGet(`login/plant?plantId=${this.currentIndex}`).then(res => {
          if(res){
            if(res.code===0){
              this.userInfo.lastLoginPlantId = this.currentIndex
              window.sessionStorage.setItem('userInfo', JSON.stringify(this.userInfo));
              this.$router.push(window.sessionStorage.getItem('firstRoute'))
            }
          }
        });
      }else{
        this.$message.error('请选择场站进入！')
      }
    }
  }
}
</script>

<style lang="less" scoped>
.login {
  width: 100vw;
  height: 100vh;
  position: relative;
  top: 0;
  left: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  background: url(~images/login/bg_login.png);
  .companyLogo {
    position: absolute;
    top: 32px;
    left: 38px;
    width: 388px;
    height: 110px;
    background:url(~images/login/logo.png);
  }
  .container {
    width: 754px;
    min-height: 266px;
    background-color: #FFFFFF;
    .loginInfo {
      display: flex;
      flex-direction: column;
      align-items: center;
      h1 {
        margin: 30px 0px 40px 0px;
        font-size: 28px;
        font-weight: bold;
      }
      .content {
        width: 368px;
        // height: 219px;
        text-align: left;
        /deep/ .el-input__inner {
          border-radius: 18px;
        }
      }
    }
    .selectSite {
      width: 632px;
      height: 40px;
      margin: 0 auto;
      text-align: left;
      div:nth-of-type(1) {
        margin: 21px 0px 27px 0px;
        line-height: 24px;
        font-size: 20px;
        font-weight: bold;
      }
      div:nth-of-type(2) {
        font-size: 16px;
        line-height: 19px;
      }
      .site {
        margin-top: 20px;
        display: flex;
        flex-wrap: wrap;
        span {
          width: 140px;      
          height: 40px;
          margin-right: 24px;
          margin-bottom: 17px;  
          border-radius: 18px;
          line-height: 40px;
          text-align: center; 
          border: 1px solid rgb(187, 187, 187);
          // 文字不可选中
          -webkit-user-select:none;
          -moz-user-select:none;
          -ms-user-select:none;
          user-select:none;
          &:hover {
            color: #199ED8;
            border: 1px solid #199ED8; 
            cursor: pointer;
          }
        }
        span:nth-of-type(4n) {
          margin-right: 0;   
        }
      }
      div:nth-of-type(4) {
        margin-top: 14px;
        display: flex;
        justify-content: space-evenly;
        /deep/ .el-button--default {
          color: #199ED8;
          border: 1px solid #199ED8;
        }
      }
    }
  }
}
.isAction {
  color: #fff !important;
  border: 1px solid #199ED8 !important; 
  background-color: #199ED8;
}
</style>