<template>
  <div class="container">
    <div class="header">
      <img class="containerLogo" src="~images/top/top_logo.png" alt="">
      <h3>
        基于数据驱动的自主检修过程监管和决策支持系统
      </h3>
      <div class="routerList flex-1">
        <p v-for="(item, index) in menu" :key="index" @click="selected(item)" :class="{isAction: currentMenuIndex == item.id}">{{item.unit}}</p>
        <div class="flex-1"></div>
        <div class="userWrap flex-vCenter">
          <i class="yfFont icon-yonghu"></i>
          <span>{{userInfo.workRoleName || userInfo.userName}}</span>
          <a title="退出登录" @click="logout()">退出</a>
        </div>
      </div>
    </div>
    <div class="content">
      <YfLeftNav :showList="leftNavList" :currentIndex="currentMenuIndex"></YfLeftNav>
      <div class="module">
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<script>
import util from '@/plugins/util.js'
import {mapGetters} from 'vuex'
export default {
  data () {
    return {
      userInfo: JSON.parse(window.sessionStorage.getItem('userInfo'))||{},
    }
  },
  computed: {
    ...mapGetters(['menu','currentMenuIndex']),
    leftNavList () {
      //根据当前选择的header索引，来展示leftNav路由
      let currentMenu = this.menu.find((val) => {
        return this.currentMenuIndex == val.id
      })
      return currentMenu.children
    },
  },
  created () {
    this.init()
  },
  methods: {
    selected (item) {  //切换header路由
      if (this.$route.path.includes(item.path)) {
        return
      }
      //点击后，被选状态展现
      this.$store.commit('set_currentMenuIndex', item.id)
      //跳转路由
      this.$router.push(item.path)
      //重置leftNav索引
      this.$store.commit('set_leftNavIndex', item.children[0].id)
    },
    init () {
      // 根据当前路由路径设置currentMenuIndex, 防止每次刷新当前页面丢失
      let currentMenu = this.menu.find((val) => {
        return this.$route.path.indexOf(val.path) >= 0
      })
      this.$store.commit('set_currentMenuIndex', currentMenu.id)
    },
    logout: function(){
      util.delCookie('accessToken'); // 删除token
      window.sessionStorage.removeItem("userInfo");
      window.sessionStorage.removeItem('menuList')
      window.sessionStorage.removeItem('firstRoute')
      this.$router.push('/Login')
    }
  }
}
</script>

<style lang="less" scoped>
.container {
  width: 100%;
  min-width: 1024px;
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: #fafafa;
  .header {
    width: 100%;
    height: 68px;
    display: flex;
    background-color: #38AEF3;
    box-shadow: 0 5px 5px rgba(15, 15, 15, 0.2);
    .containerLogo {
      margin:0 20px;
    }
    h3 {
      min-width: 396px;
      color: #fff;
      font-size: 18px;
      font-weight: bold;
      line-height: 68px;
      margin-right: 76px;
    }
    .routerList {
      display: flex;
      min-width: 1000px;
      p {
        padding: 0 24px;
        text-align: center;
        line-height: 68px;
        font-size: 16px;
        color: #fff;
        &:hover {
          background-color:rgba(238, 250, 255, 0.2);
          cursor: pointer;
        }
      }
      .userWrap{
        .icon-yonghu{font-size: 26px;color: #fff;margin-right: 10px;}
        span{font-size: 14px;color: #fff;margin-right: 10px;}
        a{font-size: 14px;color: #fff;margin-right: 20px;text-decoration: underline;}
      }
    }
  }
  .content {
    flex: 1;
    display: flex;
    margin-top: 10px;
    .module {
      flex: 1;
      max-height: calc(100vh - 78px);
      padding: 0px 10px;
      overflow: hidden;
    }
  }
}

.isAction {
  color: #199ED8 !important;
  background-color: #fff !important;
}
</style>