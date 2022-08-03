<template>
  <div class="imgWrap">
    <span class="el-image-viewer__btn el-image-viewer__close" @click="close"><i class="el-icon-close"></i></span>
    <span class="el-image-viewer__btn el-image-viewer__prev" @click="next(-1)"><i class="el-icon-arrow-left"></i></span>
    <span class="el-image-viewer__btn el-image-viewer__next" @click="next(1)"><i class="el-icon-arrow-right"></i></span>
    <div class="el-image-viewer__btn el-image-viewer__actions">
      <div class="el-image-viewer__actions__inner">
        <i class="el-icon-zoom-out" @click="scaleImg(-0.05)"></i>
        <i class="el-icon-zoom-in" @click="scaleImg(0.05)"></i>
        <i class="el-icon-refresh-left" @click="rotateImg(90)"></i>
        <i class="el-icon-refresh-right" @click="rotateImg(-90)"></i>
      </div>
    </div>
    <div class="el-image-viewer__canvas">
      <img :src="currentImg.fileId?baseUrl+currentImg.url:currentImg.url" :style="style">
    </div>
  </div>
</template>

<script>
import conf from "@/plugins/conf.js";
export default {
  data(){
    return {
      baseUrl: conf.baseUrl(),
      currentImg: this.imgUrl,
      scale: 1,
      rotate: 0,
      currentIndex: 0,
      style: {
        transform: 'scale(1) rotate(0deg)',
        transition: 'transform 0.3s ease 0s'
      }
    }
  },
  props: {
    imgUrl: Object,
    imgList: Array
  },
  watch: {},
  created(){
    // this.currentIndex = this.imgList.indexOf(this.imgUrl)
    this.imgList.forEach((item,index) => {
      if(this.imgUrl.url == item.url){
        this.currentIndex = index
      }
    })
    console.log(this.currentIndex)
  },
  methods: {
    scaleImg: function(n){
      if(this.scale + n<0.2 || this.scale + n>3){
        return
      }
      this.scale = this.scale + n
      this.style.transform = `scale(${this.scale}) rotate(${this.rotate}deg)`
    },
    rotateImg: function(n){
      this.rotate = this.rotate + n 
      this.style.transform = `scale(${this.scale}) rotate(${this.rotate}deg)`
    },
    next: function(n){
      this.scale = 1
      this.rotate = 0
      this.style.transform = `scale(${this.scale}) rotate(${this.rotate}deg)`
      this.currentIndex = this.currentIndex+n<0?this.imgList.length-1:(this.currentIndex+n==this.imgList.length?0:this.currentIndex+n)
      this.currentImg = this.imgList[this.currentIndex]
    },
    close: function(){
      this.$emit('close')
    },
    onSubmit: function(){
      
    }
  }
}
</script>

<style scoped lang="less">
.imgWrap{
  width: 100%;height: 100%;position: fixed;top: 0;left: 0;z-index: 9999;background: rgba(0,0,0,0.5);
  .el-image-viewer__btn {
    position: absolute; z-index: 1; display: flex; align-items: center; justify-content: center; border-radius: 50%;
    opacity: .8; cursor: pointer; box-sizing: border-box; user-select: none;
  }
  .el-image-viewer__close {
    top: 40px; right: 40px; width: 40px; height: 40px; font-size: 24px; color: #fff; background-color: #606266;
    &:hover{ background-color: #67696d; }
  }
  .el-image-viewer__next, .el-image-viewer__prev {
    top: 50%; transform: translateY(-50%); width: 44px; height: 44px; font-size: 24px; color: #fff; background-color: #606266; border-color: #fff;
    &:hover{ background-color: #67696d; }
  }
  .el-image-viewer__prev{ left: 40px; }
  .el-image-viewer__next { right: 40px; text-indent: 2px; }
  .el-image-viewer__canvas {
    width: 100%; height: 100%; display: flex; justify-content: center; align-items: center;
    img{width: 100vh;height: 100vh;object-fit: scale-down;}
  }
  .el-image-viewer__actions {
    left: 50%; bottom: 30px; transform: translateX(-50%); width: 282px; height: 44px; padding: 0 23px; background-color: #606266; border-color: #fff; border-radius: 22px;
  }
  .el-image-viewer__actions__inner {
    width: 100%; height: 100%; text-align: justify; cursor: default; font-size: 23px; color: #fff; display: flex; align-items: center; justify-content: space-around;
    i{
      cursor: pointer; color: #ccc;
      &:hover{ color: #fff; }
    }
  }
}
</style>