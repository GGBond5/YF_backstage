<template>
  <div class="customReports">
    <YfSearch tActive="date" @confirm="submit" layout="date,submit"></YfSearch>
    <div class="content">
      <YfNavTree :data="setData" class="tree"></YfNavTree>
      <TabularData title="风场生产运营指标">
        <el-table
          :data="tableData"
          border
          :header-cell-style="{textAlign: 'center',backgroundColor:'rgba(228, 228, 228, 0.5)'}"
          :cell-style="{ textAlign: 'center' }"
          style="width: 100%;">
          <el-table-column
            prop="serialNumber"
            label="序号"
            width="120">
          </el-table-column>
          <el-table-column
            prop="type"
            label="统计对象"
            width="200">
          </el-table-column>
          <el-table-column
            prop="type"
            label="报表类型"
            width="200">
          </el-table-column>
          <el-table-column
            prop="belongSite"
            label="报表模板名称">
          </el-table-column>
          <el-table-column
            prop="status"
            label="时间类型"
            width="200">
          </el-table-column>
          <el-table-column
            label="操作"
            width="200">
            <template slot-scope="scope">
              <el-button @click="showRow(scope.row)" type="text" size="small">显示报表</el-button>
              <el-button type="text" size="small">|</el-button>
              <el-button @click="saveRow(scope.row)" type="text" size="small">保存报表</el-button>
            </template>
          </el-table-column>
        </el-table>
      </TabularData>
    </div>
  </div>
</template>

<script>
import TabularData from '../../views/operatingIndex/tabularData/TabularData.vue'
export default {
  data () {
    return {
      tableData: [{
        serialNumber:'01',
        type:'A41',
        belongSite:'大爬山',
        frequency:16,
        time:15.28,
        damage:187.23,
        more:'详细记录',
        status:'未处理',
        operation:'发起检查督办',
      }, {
        serialNumber:'02',
        type:'A02',
        belongSite:'大爬山',
        frequency:11,
        time:4.56,
        damage:199.93,
        more:'详细记录',
        status:'已处理',
        operation:'查看详情',
      }, {
        serialNumber:'03',
        type:'A41',
        belongSite:'大爬山',
        frequency:5,
        time:8.73,
        damage:25.83,
        more:'详细记录',
        status:'已处理',
        operation:'查看详情',
      }, {
        serialNumber:'04',
        type:'A02',
        belongSite:'大爬山',
        frequency:8,
        time:11.35,
        damage:47.28,
        more:'详细记录',
        status:'未处理',
        operation:'查看详情',
      }],
    }
  },
  computed: {
    setData () {
        let result = [{
          label: '贵州分公司',
        }, {
          label: '大爬山风场',
        }, {
          label: '观风海风电场',
        }, {
          label: '轿子顶风场',
        }, {
          label: '大山坪风场',
        }, {
          label: '南山风场',
        }, {
          label: '雪山风场',
        }, {
          label: '观风海风场',
        }]
        return result
    }
  },
  methods:{
    showRow () {

    },
    saveRow () {

    },
    submit () {
      
    }
  },
  components: {
    TabularData
  }
}
</script>

<style lang="less" scoped>
.customReports {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  .content {
    flex: 1;
    display: flex;
    .tree {
      margin-right: 10px;
      border-radius: 6px;
    }
  }
}
</style>