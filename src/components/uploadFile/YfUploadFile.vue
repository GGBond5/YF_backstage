<template>
  <div class="uploadWrap flex-column">
    <el-upload
      :action="`${baseUrl}supvFile/uploadSupvFile`" :auto-upload="false" multiple :http-request="uploadFile"
      :limit="9" :file-list="fileList" :show-file-list="false" :disabled="!idEdit"
      :on-change="handleFileChange"
      ref="upload">
      <el-button size="small" type="text" icon="yfFont icon-fujian">添加附件</el-button>
    </el-upload>
    <div class="fileWrap">
      <div class="fileList flex-vCenter" v-for="(item,index) in fileList" :key="index" @click="handleFilePreview(item)">
        <i class="el-icon-document"></i>
        <span class="name">{{item.name}}</span>
        <div class="flex-1"></div>
        <span class="size">{{fomatSize(item.size)}}</span>
        <i class="yfFont icon-xiazai color2" title="点击下载" v-if="!idEdit"></i>
        <a class="el-icon-close" @click.stop="handleRemove(index)" title="点击删除" v-if="idEdit"></a>
      </div>
    </div>
  </div>
</template>

<script>
import conf from "@/plugins/conf.js";
export default {
  data(){
    return {
      baseUrl: conf.baseUrl(),
      fileList: JSON.parse(JSON.stringify(this.imgListOld))
    }
  },
  props: {
    imgListOld: {type: Array, default(){return []}},
    idEdit: {type: Boolean, default: false}
  },
  watch: {
    imgListOld: {
      deep: true,
      handler: function(){
        this.fileList = this.imgListOld
      }
    }
  },
  created(){
  },
  methods: {
    handleRemove: function(index) {
      // 判断删除项是否是数据流，数据流本地删除
      // console.log(index, this.fileList);
      if(this.fileList[index].fileId){
        this.$emit('delFile',{index: index})
      }else{
        this.fileList.splice(index,1)
        this.$emit('changeFile',{files: this.fileList})
      }
    },
    handleFilePreview: function(file) {
      // console.log(file)
      if(!this.idEdit){return}
    },
    uploadFile: function(file){
      console.log(file)
    },
    handleFileChange: function(file, fileList){
      // console.log('文件改变',file, fileList);
      this.fileList = fileList
      this.$emit('changeFile',{files: this.fileList})
    },
    fomatSize: function(data){
      let str = ''
      if(data<100){
        str = data+'B'
      }else if(data>=100 && data<1024*100){
        str = parseFloat((data/1024).toFixed(2)) + 'KB'
      }else if(data>=1024*100 && data<1024*1024*100){
        str = parseFloat((data/1024/1024).toFixed(2)) + 'MB'
      }else{
        str = parseFloat((data/1024/1024/1024).toFixed(2)) + 'GB'
      }
      return str
    },
    close: function(){
      this.dialogVisible = false;
    },
  }
}
</script>

<style scoped lang="less">
.uploadWrap{
  width: 100%; height: auto;
  .fileWrap{
    height: auto;
    .fileList{
      width: 900px;height: 32px; cursor: pointer; position: relative; background: #f3f5f7; padding: 0 10px; line-height: 32px; margin-bottom: 4px;
      .name{font-size: 12px; margin-left: 5px;}
      .size{font-size: 12px; color: #666;margin-right: 20px;margin-top: 2px;}
      .icon-xiazai{font-size: 18px;}
      .el-icon-close{font-size: 18px;color: #999;}
    }
  }
}
</style>