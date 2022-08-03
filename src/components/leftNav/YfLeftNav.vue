<template>
  <div class="leftNav">
    <div v-for="(item, index) in showList" :key="index" @click="skip(item)">
      <p class="leftNavName" :class="{isActive: leftNavIndex == item.id}" @click="clearParameter()">
        <span>{{item.name}}</span>
        <span v-if="item.parameters" class="storageIcon el-icon-arrow-down" :class="{isRotate: leftNavIndex == item.id}"></span>
      </p>
      <ul ref="ulHeight" v-if="item.parameters">
        <li v-for="(v, i) in item.parameters" :key="i" @click="clickParameter(v)" :style="{color:currentParameter == i?'#199ED8':''}">{{v.name}}</li>
      </ul>
    </div>
  </div>
</template>

<script>
import {mapGetters} from 'vuex'
export default {
  data () {
    return {
      currentParameter: 0
    }
  },
  props:{
    showList: {
      type: Array,
      default () {
        return []
      }
    },
    currentIndex: {
      default () {
        return 0
      }
    }
  },
  computed: {
    ...mapGetters(['leftNavIndex'])
  },
  mounted () {
    this.init()
  },
  watch: {
    // $route(to,form){
    //   let currentLeftNav = this.showList.find((val) => {
    //     return to.path.indexOf(val.path) >= 0
    //   })
    //   //根据当前的路由路径匹配到leftNav路由, 将其index初始化
    //   currentLeftNav && this.$store.commit('set_leftNavIndex', currentLeftNav.id)
    // }
  },
  methods: {
    init () {
      // let currentLeftNav = this.showList.find((val) => {
      //   return this.$route.path.indexOf(val.path) >= 0
      // })
      //根据当前的路由路径匹配到leftNav路由, 将其index初始化
      // currentLeftNav && this.$store.commit('set_leftNavIndex', currentLeftNav.id)
      //默认展示将第一个ul下的所有li
      // if (this.$refs.ulHeight) {
      //   let h = this.$refs.ulHeight[currentLeftNav.index].children.length
      //   this.$refs.ulHeight[currentLeftNav.index].style.height = h * 60 + 'px'
      // }
      let currentLeftNav, currentIndex
      this.showList.forEach((item,index)=>{
        if(this.$route.path.indexOf(item.path) >= 0){
          currentLeftNav = item
          currentIndex = index
        }
      })
      currentLeftNav && this.$store.commit('set_leftNavIndex', currentLeftNav.id)
      if (this.$refs.ulHeight) {
        let h = this.$refs.ulHeight[currentIndex].children.length
        this.$refs.ulHeight[currentIndex].style.height = h * 60 + 'px'
      }

    },
    skip ({id, index, path}) {
      if (this.$route.path === path || this.$route.redirectedFrom === path) {
        return
      }
      this.$store.commit('set_leftNavIndex', id)
      this.$router.push(path)
      if (this.$refs.ulHeight) {
      //手风琴效果，先把所有ul设置高度设置成0
      let uls = [...this.$refs.ulHeight]
      uls.map((val) => {
        val.style.height = '0px'
      })
      //再让指定的ul有高度
      let h = this.$refs.ulHeight[index].children.length
      this.$refs.ulHeight[index].style.height = h * 60 + 'px'
      }
    },
    clickParameter (row) {
      this.currentParameter = row.index
    },
    clearParameter () {
      this.currentParameter = 0
    },
  }
}
</script>

<style lang="less" scoped>
.leftNav {
  min-width: 220px;
  width: 10%;
  background-color: #fff;
  .leftNavName, li {
    position: relative;
    width: 100%;
    height: 60px;
    font-size: 16px;
    text-align: left;
    text-indent: 40px;
    line-height: 60px;
    -webkit-touch-callout: none;
    -webkit-user-select: none;
    -khtml-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    &:hover {
      color: #199ED8;
      cursor: pointer;
    }
    .storageIcon {
      text-indent: 0;
      position: absolute;
      right: 20px;
      top: calc(50% - 8px);
      transition: all 0.2s linear 0s;
    }
  }
  li{
    text-indent: 20px;
  }
  ul {
    height: 0px;
    overflow: hidden;
    transition: all .5s;
  }
}
.isActive {
  color: #199ED8;
  background-color: rgba(179, 216, 255, 0.3);
  &::after {
    content: '';
    position: absolute;
    left: 20px;
    top: calc(50% - 10px);
    width: 4px;
    height: 20px;
    border-radius: 3px;
    background-color: #199ED8;
  }
}
.isRotate {
  transform: rotate(180deg);
}
</style>