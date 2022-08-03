<template>
  <div class="screeningPlan10">
    <ScreeningCondition class="screening">
      <div class="statisticalTime" slot="left">
        <span>场站：</span>
        <span>
          <el-select v-model="value" placeholder="请选择" size="small">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </span>
        <span>项目类型：</span>
        <span>
          <el-select v-model="value" placeholder="请选择" size="small">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </span>
        <span>预算科目：</span>
        <span>
          <el-select v-model="value" placeholder="请选择" size="small">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </span>   
        <span>项目进度：</span>
        <span>
          <el-select v-model="value" placeholder="请选择" size="small">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </span>  
        <span>统计时间：</span>
        <div>
          <el-date-picker
            v-model="value1"
            type="daterange"
            size="small"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期">
          </el-date-picker>
        </div>
        <div>
          <el-input v-model="input" placeholder="关键字搜索" size="small"></el-input>
        </div>
      </div>
    </ScreeningCondition>
  </div>
</template>

<script>
import ScreeningCondition from '@/views/operatingIndex/screeningCondition/ScreeningCondition.vue'
export default {
  data () {
    return {
      input:'',
      value1: '',
      value2: this.$moment().subtract(1, 'months').format('YYYY-MM'),     //当月日期减一个月
      options: [{
        value: '选项1',
        label: '黄金糕'
      }, {
        value: '选项2',
        label: '双皮奶'
      }, {
        value: '选项3',
        label: '蚵仔煎'
      }, {
        value: '选项4',
        label: '龙须面'
      }, {
        value: '选项5',
        label: '北京烤鸭'
      }],
      value: '全部',
      selectTime:[{
        value:'近一月'
      },
      {
        value:'当月'
      }],
      currentSelectTime:0
    }
  },
  created() {

  },
  methods: {

  },
  components: {
    ScreeningCondition
  }
}
</script>

<style lang="less" scoped>
.screening {
  .statisticalTime {
    display: flex;
    min-width: 1000px;
    margin-right: 15px;
    div {
      margin-right: 10px;
    }
    /deep/ .el-date-editor--daterange.el-input__inner {
      width: 260px;
    }
    /deep/ .el-date-editor .el-range-separator {
      width: 10%;
      line-height: 28px;
    }
    /deep/ .el-input__inner {
      width: 120px;
    }
  }
}
.Action {
  color: #409EFF !important;
  border-color: #409EFF !important;
}
</style>