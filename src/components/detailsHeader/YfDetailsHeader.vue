<template>
  <div class="dHeader">
    <div class="headerLeft">
      <el-button type="text" @click="goBack()">
        <i class="el-icon-arrow-left"></i>
        <span>返回上级</span>
      </el-button>
      <h4>{{title}}</h4>
    </div>
    <div class="flex-1"></div>
    <a class="printBtn flex-vCenter" v-if="print" @click="printFun">
      <i class="yfFont icon-dayin"></i>
      <span>打印</span>
    </a>
    <div class="headerRight">
      <i class="el-icon-close" @click="goBack()"></i>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {

    }
  },
  props: {
    title: {
      type: String,
      default () {
        return 'no title'
      }
    },
    path: {
      type: String,
      default () {
        return ''
      }
    },
    print: Boolean,
    isQuery: { type: Boolean, default: false}
  },
  methods: {
    goBack () {
      if(this.isQuery){
        let routeList = JSON.parse(this.path)
        let toRoute = routeList[routeList.length-1]
        routeList.splice(routeList.length-1,1)
        window.sessionStorage.setItem('formRoute', JSON.stringify(routeList));
        this.$router.push(toRoute)
      }else{
        this.$router.push(this.path)
      }
    },
    printFun: function(){
      this.$emit('handlePrint')
    }
  }
}
</script>

<style lang="less" scoped>
.dHeader {
  display: flex;
  justify-content: space-between;
  align-items: center;
  min-height: 64px;
  background-color: #fff;
  border-radius: 6px;
  .headerLeft {
    display: flex;
    align-items: center;
    /deep/ .el-button--text {
      margin-left: 20px;
      > span {
        display: flex;
        align-items: center;
        i {
          font-size: 26px;
        }
      }
    }
    h4 {
      line-height: 30px;
      margin-left: 20px;
      padding-left: 20px;
      border-left: 1px solid rgba(0, 0, 0, 0.5);
    }
  }
  .printBtn{
    width: 100px;
    height: 40px;
    border: 1px solid #38AEF3;
    color: #38AEF3;
    font-size: 14px;
    justify-content: center;
    border-radius: 3px;
    margin-right: 10px;
    transition: all 0.3s ease-in-out;
    i{
      margin-right: 8px;
      font-size: 20px;
    }
    &:hover{
      color: #1b8cfd;
      border: 1px solid #1b8cfd;
    }
  }
  .headerRight {
    margin-right: 14px;
    cursor: pointer;
    i {
      font-size: 30px;
    }
  }
}
</style>