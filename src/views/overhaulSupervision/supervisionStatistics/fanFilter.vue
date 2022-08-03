<template>
  <div class="search">
    <!-- 风机筛选 -->
    <div class="formWrap" v-show="isOpen">
      <div class="item flex-vTop">
        <label>已选</label>
        <div class="box flex-1 flex-vCenter">
          <div class="isSelected flex-vCenter" v-show="!(plantText || factoryText || capacityText || typeFanText)">
            <span class="plant blue flex-1">全部</span>
          </div>
          <div class="isSelected flex-vCenter" v-show="plantText">
            <span class="name">风场：</span>
            <span class="plant blue flex-1">{{plantText}}</span>
            <a class="el-icon-close" @click="delSelected(1)"></a>
          </div>
          <div class="isSelected flex-vCenter" v-show="factoryText">
            <span class="name">厂家：</span>
            <span class="plant blue flex-1">{{factoryText}}</span>
            <a class="el-icon-close" @click="delSelected(2)"></a>
          </div>
          <div class="isSelected flex-vCenter" v-show="capacityText">
            <span class="name">容量：</span>
            <span class="plant blue flex-1">{{capacityText}}</span>
            <a class="el-icon-close" @click="delSelected(3)"></a>
          </div>
          <div class="isSelected flex-vCenter" v-show="typeFanText">
            <span class="name">类型：</span>
            <span class="plant blue flex-1">{{typeFanText}}</span>
            <a class="el-icon-close" @click="delSelected(4)"></a>
          </div>
        </div>
      </div>
      <div class="item flex-vTop" v-show="!plantText">
        <label>风场</label>
        <div class="box flex-1 flex-top" :style="{'height':plantShowAll?'auto':'30px'}" v-show="!plantMultiple">
          <span class="radioText" v-for="(item,index) in plant" :key="index" @click="selectThis(1,item)">{{item}}</span>
        </div>
        <div class="box flex-1 flex-column" :style="{'height':plantShowAll?'auto':'30px'}" v-show="plantMultiple">
          <div class="checkedBox flex-top">
            <el-checkbox-group v-model="plantSelectTemp">
              <el-checkbox :label="item" v-for="(item,index) in plant" :key="index">{{item}}</el-checkbox>
            </el-checkbox-group>
          </div>
          <div class="checkedBtn">
            <a @click="MultipleSelect(1)">取消</a>
            <a :class="{default: plantSelectTemp.length<1}" @click="MultipleSelect(1,true)">确定</a>
          </div>
        </div>
        <a class="more" v-show="!plantMultiple" @click="plantShowAll = !plantShowAll"><em>{{plantShowAll?'收起':'更多'}}</em><i :class="plantShowAll?'el-icon-arrow-up':'el-icon-arrow-down'"></i></a>
        <a class="select" v-show="!plantMultiple" @click="changeMultiple(1)"><i class="el-icon-plus"></i><em>多选</em></a>
      </div>
      <div class="item flex-vTop" v-show="!factoryText">
        <label>厂家</label>
        <div class="box flex-1 flex-top" v-show="!factoryMultiple">
          <span class="radioText" v-for="(item,index) in factory" :key="index" @click="selectThis(2,item)">{{item}}</span>
        </div>
        <div class="box flex-1 flex-column" v-show="factoryMultiple">
          <div class="checkedBox flex-top">
            <el-checkbox-group v-model="factorySelectTemp">
              <el-checkbox :label="item" v-for="(item,index) in factory" :key="index">{{item}}</el-checkbox>
            </el-checkbox-group>
          </div>
          <div class="checkedBtn">
            <a @click="MultipleSelect(2)">取消</a>
            <a :class="{default: factorySelectTemp.length<1}" @click="MultipleSelect(2,true)">确定</a>
          </div>
        </div>
        <a class="select" v-show="!factoryMultiple" @click="changeMultiple(2)"><i class="el-icon-plus"></i><em>多选</em></a>
      </div>
      <div class="item flex-vTop" v-show="!capacityText">
        <label>容量</label>
        <div class="box flex-1 flex-top" v-show="!capacityMultiple">
          <span class="radioText" v-for="(item,index) in capacity" :key="index" @click="selectThis(3,item)">{{item}}</span>
        </div>
        <div class="box flex-1 flex-column" v-show="capacityMultiple">
          <div class="checkedBox flex-top">
            <el-checkbox-group v-model="capacitySelectTemp">
              <el-checkbox :label="item" v-for="(item,index) in capacity" :key="index">{{item}}</el-checkbox>
            </el-checkbox-group>
          </div>
          <div class="checkedBtn">
            <a @click="MultipleSelect(3)">取消</a>
            <a :class="{default: capacitySelectTemp.length<1}" @click="MultipleSelect(3,true)">确定</a>
          </div>
        </div>
        <a class="select" v-show="!capacityMultiple" @click="changeMultiple(3)"><i class="el-icon-plus"></i><em>多选</em></a>
      </div>
      <div class="item flex-vTop" v-show="!typeFanText">
        <label>类型</label>
        <div class="box flex-1 flex-top" v-show="!typeFanMultiple">
          <span class="radioText" v-for="(item,index) in typeFan" :key="index" @click="selectThis(4,item)">{{item}}</span>
        </div>
        <div class="box flex-1 flex-column" v-show="typeFanMultiple">
          <div class="checkedBox flex-top">
            <el-checkbox-group v-model="typeFanSelectTemp">
              <el-checkbox :label="item" v-for="(item,index) in typeFan" :key="index">{{item}}</el-checkbox>
            </el-checkbox-group>
          </div>
          <div class="checkedBtn">
            <a @click="MultipleSelect(4)">取消</a>
            <a :class="{default: typeFanSelectTemp.length<1}" @click="MultipleSelect(4,true)">确定</a>
          </div>
        </div>
        <a class="select" v-show="!typeFanMultiple" @click="changeMultiple(4)"><i class="el-icon-plus"></i><em>多选</em></a>
      </div>
    </div>
    <!-- end -->
  </div>
</template>
<script>
export default {
  data(){
    return {
      isOpen: true, // 是否展开搜索栏
      plant: [], // 风场
      plantShowAll: false, // 是否显示所以风场
      plantMultiple: false, // 风场是否多选
      plantSelectTemp: [], // 多选临时选中的风场
      plantSelected: [], // 当前选中的风场
      plantText: '', // 风场合并文本
      factory: [], // 厂家
      factoryMultiple: false, // 厂家是否多选
      factorySelectTemp: [], // 多选临时选中的厂家
      factorySelected: [], // 当前选中的厂家
      factoryText: '', // 厂家合并文本
      capacity: [], // 容量
      capacityMultiple: false, // 容量是否多选
      capacitySelectTemp: [], // 多选临时选中的容量
      capacitySelected: [], // 当前选中的容量
      capacityText: '', // 容量合并文本
      typeFan: [], // 类型
      typeFanMultiple: false, // 类型是否多选
      typeFanSelectTemp: [], // 多选临时选中的类型
      typeFanSelected: [], // 当前选中的风机类型
      typeFanText: '', // 类型合并文本
    }
  },
  props: {},
  created(){
    this.filterApi()
  },
  mounted(){
    this.submit()
  },
  computed: {},
  methods: {
    // 风场多选按钮切换 type: 1=风场 2=>厂家 3=>容量 4=>类型
    changeMultiple: function(type){
      switch (type){
        case 1:
          this.plantMultiple = true
          this.plantShowAll = true
          break
        case 2:
          this.factoryMultiple = true
          break
        case 3:
          this.capacityMultiple = true
          break
        case 4:
          this.typeFanMultiple = true
          break
        default:
          break
      }
    },
    // 选择当前风场，单选 type: 1=风场 2=>厂家 3=>容量 4=>类型
    selectThis: function(type,value){
      switch (type){
        case 1:
          this.plantSelected = [value]
          this.plantText = value
          break
        case 2:
          this.factorySelected = [value]
          this.factoryText = value
          break
        case 3:
          this.capacitySelected = [value]
          this.capacityText = value
          break
        case 4:
          this.typeFanSelected = [value]
          this.typeFanText = value
          break
        default:
          break
      }
      this.submit()
      this.filterApi()
    },
    // 多选选项发生变化 type: 1=风场 2=>厂家 3=>容量 4=>类型
    MultipleSelect: function(type,isSure){
      if(isSure){
        switch (type){
          case 1:
            this.plantSelected = this.plantSelectTemp
            this.plantText = this.plantSelected.join("、")
            break
          case 2:
            this.factorySelected = this.factorySelectTemp
            this.factoryText = this.factorySelected.join("、")
            break
          case 3:
            this.capacitySelected = this.capacitySelectTemp
            this.capacityText = this.capacitySelected.join("、")
            break
          case 4:
            this.typeFanSelected = this.typeFanSelectTemp
            this.typeFanText = this.typeFanSelected.join("、")
            break
          default:
            break
        }
        this.submit()
        this.filterApi()
      }
      switch (type){
        case 1:
          this.plantSelectTemp = []
          this.plantMultiple = false
          this.plantShowAll = false
          break
        case 2:
          this.factorySelectTemp = []
          this.factoryMultiple = false
          break
        case 3:
          this.capacitySelectTemp = []
          this.capacityMultiple = false
          break
        case 4:
          this.typeFanSelectTemp = []
          this.typeFanMultiple = false
          break
        default:
          break
      }
    },
    // 删除选项 type: 1=风场 2=>厂家 3=>容量 4=>类型
    delSelected: function(type){
      switch (type){
        case 1:
          this.plantSelected = []
          this.plantText = ''
          break
        case 2:
          this.factorySelected = []
          this.factoryText = ''
          break
        case 3:
          this.capacitySelected = []
          this.capacityText = ''
          break
        case 4:
          this.typeFanSelected = []
          this.typeFanText = ''
          break
        default:
          break
      }
      this.submit()
      this.filterApi()
    },
    // 请求筛选之后的检索项
    filterApi: function(){
      let data = {
        subPlantSet: this.plantSelected,
        manufacturerSet: this.factorySelected,
        modelPowerSet: this.capacitySelected,
        modelTypeSet: this.typeFanSelected
      }
      this.$http.fetch(`fan/filter`, data).then(res => {
				if(res.code===0){
          this.plant = res.data.subPlantSet
          this.factory = res.data.manufacturerSet
          this.capacity = res.data.modelPowerSet
          this.typeFan = res.data.modelTypeSet
        }
			})
    },
    submit: function(){
      let data = {}
      data.subPlantSet = this.plantSelected
      data.manufacturerSet = this.factorySelected
      data.modelPowerSet = this.capacitySelected
      data.modelTypeSet = this.typeFanSelected
      this.$emit("confirm",data)
    }
  }
};
</script>
 
<style scoped>
.search{width: 100%;padding: 0 15px 15px;font-size: 13px;}
.timeType{width: 80px;margin-right: 10px;}
.timeBtn{width: 72px;height: 36px;line-height: 34px;border: 1px solid #DCDFE6;color: #999999;border-radius: 4px;margin-right: 10px;text-align: center;cursor: pointer;}
.timeBtn.active{color: #2ea3e1;border-color: #2ea3e1;}
.timeWrap .open{width: 24px;height: 24px;background: url('../../../assets/img/search_icon.png') no-repeat center; background-size: 100%;}
.formWrap{border: 1px solid #f0f0f0; border-radius: 5px;}
.formWrap .item{border-bottom: 1px dashed #f0f0f0;padding: 8px 15px;}
.formWrap .item:last-child{border-bottom: none;}
.formWrap a{line-height: 30px;border-radius: 4px;}
.formWrap a em{font-size: 12px;color: #999;}
.formWrap a.more{margin-right: 10px;}
.formWrap a.more em{margin-right: 5px;}
.formWrap a.select{padding: 0 10px;border: 1px solid #DCDFE6;}
.formWrap a.select em{margin-left: 5px;}
.formWrap .item label{line-height: 30px;}
.formWrap .item>label{width: 50px;}
.isSelected{border: 1px solid #DCDFE6;line-height: 30px;height: 30px;padding: 0 10px;max-width: 240px;margin-right: 10px;border-radius: 4px;}
.isSelected span{font-size: 12px;}
.isSelected .plant{overflow: hidden;text-overflow: ellipsis;white-space: nowrap;}
.isSelected a{margin-left: 10px;}
.radioText{color: #999;margin-right: 30px;line-height: 30px;cursor: pointer;}
.radioText.active{color: #2ea3e1;}
.checkedBtn{padding: 5px 0;text-align: center;font-size: 12px;}
.checkedBtn a{display: inline-block; line-height: 22px; height: 24px;width: 48px; border-radius: 3px; background: #F7F7F7; text-decoration: none; 
cursor: pointer; border: 1px solid #DDD; color: #666; background-color: #f7f7f7;margin: 0 3px;}
.checkedBtn a:last-child{color: #fff;border-color: #2ea3e1;background-color: #2ea3e1;}
.checkedBtn a.default{color: #eee;background-color: #fff;border-color: #eee;}
</style>