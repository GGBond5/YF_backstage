<template>
  <div class="overview flex-column">
    <YfSearch tActive="year" :time="yearTime" @timeChange="submit" layout="date,rightButton"></YfSearch>
    <div class="content">
      <div class="navTree">
        <el-tree
          :data="setData"
          :props="defaultProps"
          accordion
          @node-click="handleNodeClick"
          :expand-on-click-node="false"
          :default-expanded-keys="['全公司']"
          :default-checked-keys="['全公司']"
          highlight-current
          ref="myTree"
          node-key="value">
        </el-tree>
      </div>
      <div class="budgetContent flex-column">
        <div class="budgetSynopsis">
          <div class="synopsis" style="min-width:584px">
            <p>
              <span class="yfFont icon-niandutouziyusuan"></span>
              <label>投资预算</label>
            </p>
            <p>
              <label><span class="el-icon-bank-card"></span>年度投资预算：</label>
              <span>{{moneyStyle(synopsisData.investmentBudget)}}</span>
            </p>
            <p>
              <label><span class="el-icon-bank-card"></span>投资预算已使用：</label>
              <span>{{moneyStyle(synopsisData.investmentUsed)}}</span> 
            </p>
            <p>
              <label><span class="el-icon-bank-card"></span>投资预算可用：</label>
              <span>{{moneyStyle(synopsisData.investmentAvailable)}}</span>
            </p>
          </div>
          <div class="synopsis" style="min-width:584px">
            <p>
              <span class="yfFont icon-nianduzijinyusuan"></span>
              <label>资金预算</label>
            </p>
            <p>
              <label><span class="el-icon-bank-card"></span>年度资金预算：</label>
              <span>{{moneyStyle(synopsisData.capitalBudget)}}</span>
            </p>
            <p>
              <label><span class="el-icon-bank-card"></span>资金预算已使用：</label>
              <span>{{moneyStyle(synopsisData.capitalUsed)}}</span>
            </p>
            <p>
              <label><span class="el-icon-bank-card"></span>资金预算可用：</label>
              <span>{{moneyStyle(synopsisData.capitalAvailable)}}</span>
            </p>
          </div>
        </div>
        <div class="subject">
          <el-table
            :data="synopsisData.budgetList"
            style="width: 100%"
            row-key="title"
            border
            height="100%"
            @cell-click="cellClick"
            default-expand-all
            :tree-props="{children: 'budgetList'}"> 
            <el-table-column
              prop="title"
              label="预算科目"
              width="180"
              show-overflow-tooltip>
            </el-table-column>
            <el-table-column
              prop="investmentBudget"
              label="年度投资预算（元）">
              <template slot-scope="scope">
                <span>{{moneyStyle(scope.row.investmentBudget)}}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="investmentUsed"
              label="投资预算已使用（元）">
              <template slot-scope="scope">
                <span>{{moneyStyle(scope.row.investmentUsed)}}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="investmentAvailable"
              label="投资预算可用（元）">
              <template slot-scope="scope">
                <span>{{moneyStyle(scope.row.investmentAvailable)}}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="capitalBudget"
              label="年度资金预算（元）">
              <template slot-scope="scope">
                <span>{{moneyStyle(scope.row.capitalBudget)}}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="capitalUsed"
              label="资金预算已使用（元）">
              <template slot-scope="scope">
                <span>{{moneyStyle(scope.row.capitalUsed)}}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="capitalAvailable"
              label="资金预算可用（元）">
              <template slot-scope="scope">
                <span>{{moneyStyle(scope.row.capitalAvailable)}}</span>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      yearTime: this.$moment().startOf('year').format('YYYY-MM-DD'),
      defaultProps: {
        children: 'children',
        label: 'value'
      }, 
      synopsisData: {},
      setData: [],
      date: this.$moment().format('YYYY-01-01'),
      nodeId: 1,
      currentNode: {}
    }
  },
  computed: {
    moneyStyle () { 
      return function (row) {
        if (row) {
          return this.textFormat(parseFloat(row), '#,##0.00');
        }else {
          return '-'
        }
      }
    }
  },
  created () {
    this.init()
  },
  mounted () {
  },
  methods: {
    init () {
      this.$http.fetchGet(`/plant/tree`).then(res => {
        this.setData = res.data
        this.currentNode =res.data[0]
        //默认选中全公司
        this.setDefaultSelected()
      })
      this.allCompany()
    },
    allCompany () {
      this.$http.fetchGet(`/budget/overview`, {  //预算总览
        date: this.date,
        id: 1,
        statScope: 'COMPANY'
      }).then(res => {
        this.synopsisData = res.data 
      })
    },
    submit (row) {
      this.date = this.$moment(row).format('YYYY-01-01')
      this.nodeId += 1
      this.handleNodeClick(this.currentNode)
    },
    async handleNodeClick(data) { //节点发生改变时，渲染不同的数据
      if (this.nodeId == data.$treeNodeId) {
        return
      }
      this.nodeId = data.$treeNodeId  
      if (data.children?.length > 0) {
        // 获取所有节点对象
        const nodes = this.$refs.myTree.store.nodesMap
        // 根据对象key查找符合条件的属性（展开的节点）
        const key = Object.keys(nodes).find(key => {
          return nodes[key].level == 2 && nodes[key].expanded == true
        }) 
        // 如果有展开的节点，则将节点进行收缩
        if (key) {
          nodes[key].expanded = false
        }
        if (data.value === '全公司') {
          this.allCompany()
        }else {
          // 将刚点击的节点进行展开
          nodes[data.value].expanded = true
          await this.$http.fetchGet(`/budget/overview`, {
            date: this.date,
            id: data.id,
            statScope: 'BRANCH'
          }).then(res => {
            this.synopsisData = res.data
          })
        }
      }else {
        await this.$http.fetchGet(`/budget/overview`, {
          date: this.date,
          id: data.id,
          statScope: 'PLANT'
        }).then(res => {
          this.synopsisData = res.data
        })
      }
      this.currentNode = data
    },
    setDefaultSelected () {
      this.$nextTick(() => {
        //默认选中第一个节点
        this.$refs.myTree.setCurrentKey(this.setData[0].value);
      });
    },
    cellClick (row, column, cell, event) {  //点击单元格，使文本隐藏，input展示
      if (event.currentTarget.querySelector(".el-table__expand-icon")) {
        event.currentTarget.querySelector(".el-table__expand-icon").click();
      }
    },
  }
}
</script>

<style lang="less" scoped>
.overview {
  width: 100%;
  height: 100%;
  overflow: hidden;
  .content {
    flex: 1;
    display: flex;
    margin-top: 10px;
    .navTree {
      min-width: 200px;
      height: 100%;
      padding-top: 10px;
      background-color: #fff;
      /deep/ .el-tree-node__content {
        min-height: 36px;
      }
      /deep/ .el-tree-node__expand-icon {
        font-size: 20px;
        pointer-events: none;
      }
      /deep/ .el-tree--highlight-current .el-tree-node.is-current>.el-tree-node__content {
        background-color: rgba(64, 158, 255, 0.2);
      }
    }
    .budgetContent {
      flex: 1;
      overflow: auto;
      background-color: #fff;
      border-left: 1px solid #f2f2f2;
      .budgetSynopsis {
        display: flex;
        .synopsis {
          flex: 1;
          display: flex;
          justify-content: space-between;
          margin: 20px;
          height: 90px;
          border: 1px solid #f2f2f2;
          span {
            font-size: 20px;
          }
          > p:nth-of-type(1) {
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            width: 110px;
            box-shadow: 2px 0px 1px rgba(0, 0, 0, 0.2);
            img {
              width: 35%;
            }
          }
          > p:nth-of-type(2), > p:nth-of-type(3), > p:nth-of-type(4) {
            flex: 1;
            text-align: center;
            background-color: rgba(0, 0, 0, 0.01);
            label {
              display: flex;
              justify-content: center;
              align-items: center;
              line-height: 50px;
              color: rgba(0, 0, 0, 0.5);
              > span {
                margin-right: 10px;
              }
            }
          }
          > p:nth-of-type(2) {
            span {
              color: #CC66FF;
            }
          }
          > p:nth-of-type(3) {
            span {
              color: #FF9900;
            }
          }
          > p:nth-of-type(4) {
            span {
              color: #26D2A1;
            }
          }
          .icon-niandutouziyusuan, .icon-nianduzijinyusuan {
            font-size: 36px;
          }
        }
        > div:nth-of-type(1) {
          margin-right: 0;
        }
      }
      .subject {
        flex: 1;
        min-width: 1228px;
      }
    }
  }
}
</style>