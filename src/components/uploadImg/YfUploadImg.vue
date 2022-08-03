<template>
  <div class="uploadWrap flex-row">
    <el-upload
      :action="`${baseUrl}supvFile/uploadSupvFile`" :auto-upload="false" multiple :http-request="uploadFile"
      list-type="picture-card" :limit="9" :file-list="imgList" :show-file-list="false" :disabled="!idEdit"
      :on-remove="handleRemove"
      :on-change="handlePictureChange"
      ref="upload">
      <i class="el-icon-plus"></i>
    </el-upload>
    <div class="imgWrap flex-1">
      <div class="imgScroll">
        <div class="imgList" v-for="(item,index) in imgList" :key="index" @click="handlePictureCardPreview(item)">
          <el-image style="width: 100%; height: 100%;" :src="item.fileId?baseUrl+item.url:item.url" fit="cover" title="点击大图预览"></el-image>
          <a class="el-icon-close" @click.stop="handleRemove(index)" title="点击删除" v-if="idEdit"></a>
        </div>
      </div>
    </div>
    <YfImagesPreview :imgUrl="dialogImageUrl" :imgList="dialogImageList" v-if="dialogVisible"
    @close="close"></YfImagesPreview>
  </div>
</template>

<script>
import conf from "@/plugins/conf.js";
export default {
  data(){
    return {
      baseUrl: conf.baseUrl(),
      imgList: JSON.parse(JSON.stringify(this.imgListOld)),
      dialogImageUrl: {}, // 当前查看图片的url
      dialogVisible: false, // 是否显示图片预览
      dialogImageList: [], // 当前预览列表
    }
  },
  props: {
    imgListOld: {type: Array, default(){return []}},
    keys: String,
    type: Number,
    tabindex: Number,
    idEdit: {type: Boolean, default: false}
  },
  watch: {
    imgListOld: {
      deep: true,
      handler: function(){
        this.imgList = this.imgListOld
      }
    }
  },
  created(){
  },
  methods: {
    handleRemove: function(index) {
      // 判断删除项是否是数据流，数据流本地删除
      console.log(index, this.imgList);
      if(this.imgList[index].fileId){
        this.$emit('delImg',{keys: this.keys, type: this.type, index: index, tabindex: this.tabindex})
      }else{
        this.imgList.splice(index,1)
        this.$emit('changeImg',{keys: this.keys,type: this.type, tabindex: this.tabindex, files: this.imgList})
      }
    },
    handlePictureCardPreview: function(file) {
      console.log(file)
      // if(!this.idEdit){return}
      this.dialogImageUrl = file;
      let _imgList = []
      this.imgList.forEach(item=>{
        _imgList.push(item)
      })
      this.dialogImageList = _imgList
      this.dialogVisible = true;
      // this.$refs.upload.submit();
    },
    uploadFile: function(file){
      console.log(file)
      // let pendingUploadUrls = new FormData()
      // pendingUploadUrls.append("file", file.file)
      // this.$http.upload(`file/uploadFileList?fileNameType=1&id=1&type=1`,pendingUploadUrls).then(res=>{
      //   if(res.code==0&&!this._isDestroyed){
      //     this.$message.success('图片上传成功！')
      //   }else{
      //     this.$message.success('处理失败，请稍后重试！')
      //   }
      // })
    },
    handlePictureChange: function(file, fileList){
      console.log('文件改变',file, fileList);
      this.imgList = fileList
      this.$emit('changeImg',{keys: this.keys,type: this.type, tabindex: this.tabindex, files: this.imgList})
    },
    close: function(){
      this.dialogVisible = false;
    },
  }
}
</script>

<style scoped lang="less">
.uploadWrap{
  width: 100%; height: 100%; overflow: hidden;
  /deep/.el-upload--picture-card{
    width: 80px;height: 80px; line-height: 84px;
  }
  .imgWrap{
    height: 100%; margin-left: 6px;
  }
  .imgScroll{
    height: 100%; overflow: auto; width: auto; white-space: nowrap; font-size: 0; line-height: 0;
    .imgList{
      width: 80px;height: 80px; border: 1px solid #d8e4f3; margin-right: 3px; border-radius: 5px; display: inline-block; vertical-align: middle; cursor: pointer; position: relative;
      &:last-child{margin-right: 0;}
      .el-icon-close{font-size: 16px;position: absolute; top: 3px;right: 3px; z-index: 10;background: #e5e5e5; color: #999;}
    }
  }
}
</style>