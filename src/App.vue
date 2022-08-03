<template>
  <div id="app">
    <router-view v-if="isRouterAlive" />
  </div>
</template>

<script>
import {mapGetters} from 'vuex'
export default {
  name: 'App',
  provide () {    //父组件中通过provide来提供变量，在子组件中通过inject来注入变量。                                             
    return {
      reload: this.reload                                              
    }
  },
  data() {
    return{
      userInfo: JSON.parse(window.sessionStorage.getItem('userInfo')),
      isRouterAlive: true,                    //控制视图是否显示的变量
      firstRoute: window.sessionStorage.getItem('firstRoute')
    }
  },
  computed: {
    ...mapGetters(['menu'])
  },
  watch: {
    $route(to){
      // console.log(to)
      let pathArr = to.path.split('/')
      let currentIndex
      if(pathArr.length>2 && pathArr.length<5){
        this.menu.forEach(first=>{
          first.children.forEach(seccond=>{
            if(seccond.path == `/${pathArr[1]}/${pathArr[2]}`){
              currentIndex = seccond.index
            }
          })
        })
        if(!currentIndex){
          console.log('执行了')
          // 一级路由不变的情况下，二级路由的选中状态没有重置，所以需要手动重置
          let firstRoutePath = this.firstRoute.split('/')
          this.$store.commit('set_leftNavIndex', firstRoutePath[2])
          this.$router.push(this.firstRoute)
        }
      }
    }
  },
  methods: {
    reload () {
      this.isRouterAlive = false;            //先关闭，
      this.$nextTick(function () {
        this.isRouterAlive = true;         //再打开
      }) 
    }
  }
}
</script>

<style lang="less">
* {
	margin: 0;
	padding: 0;
  box-sizing: border-box;
}
html, body, #app {
  width: 100%;
  height: 100%;
  overflow: hidden;
  box-sizing: border-box;
}
#app {
  font-family: "microsoft yahei";
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}
</style>
