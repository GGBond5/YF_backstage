<template>
<div class="authorizedStrength flex-column" >
  <el-tabs v-model="activeName" class="orderTabs" @tab-click="handleClick">
    <el-tab-pane label="投资预算" name="#step_1">
    </el-tab-pane>
    <el-tab-pane label="资金预算" name="#step_2">
    </el-tab-pane>
  </el-tabs>
    <div class="authHeader flex-between">
      <YfSearch tActive="year" :time="yearTime" @timeChange="submit" layout="date"></YfSearch>
      <el-button type="text" @click="subjectManagement()" style="marginRight:20px">
        <span class="flex-vCenter-noWrap">
          <i class="yfFont icon-yusuankemuguanli"></i>
          <span>预算科目管理</span>
        </span>
      </el-button>
    </div>
    <!-- 投资预算 -->
    <div class="content" v-if="activeName === '#step_1'">
      <el-table
        :data="tableData1"
        @cell-click="cellClick"
        :cell-style="setRowStyle"
        row-key="name"
        border
        height="100%"
        :expand-row-keys = "['全公司']"
        :tree-props="{children: 'children'}">
        <el-table-column
          prop="name"
          label="项目公司/场站"
          width="210"
          align="left">
        </el-table-column>
        <el-table-column
          prop="amountList[0].value"
          label="年度投资预算（元）"
          width="180">
          <template slot-scope="scope">
            <span v-format="'#,##0.####'">{{scope.row.amountList[0].value?scope.row.amountList[0].value:'-'}}</span>
          </template>
        </el-table-column>
        <el-table-column v-for="(item, index) in info.titles" :key="'m'+index" min-width="120" :label="item" show-overflow-tooltip>
          <template slot="header" slot-scope="scope">
            <el-popover
              placement="top"
              trigger="hover"
              :disabled="scope.column.popover">
              <span>{{item}}</span>
              <span class="headline" slot="reference" @mouseenter="Menter(scope.column, $event)">{{item}}</span>
            </el-popover>
          </template>
          <template slot-scope="scope"> 
            <span :style="unfinishedStyle(scope.row.amountList[index + 1].value)" class="flex-center">
              <span  v-format="'#,##0.####'" class="flex-1">{{scope.row.amountList[index + 1].value?scope.row.amountList[index + 1].value:'待输入'}}</span>
              <i v-if="scope.row.type === 3" class="yfFont icon-bianji blue" style="marginRight:4px" :key="'m'+index"></i>  
            </span>
            <span v-show="false">
              <el-input v-model="scope.row.amountList[index + 1].value" @blur="finish(scope.row, scope.row.amountList[index + 1])" oninput="value=value.replace(/^\D*(\d*(?:\.\d{0,4})?).*$/g,'$1')"></el-input>
            </span>
          </template>
        </el-table-column>
      </el-table>
      <div class="footer">
        <el-button type="primary" @click="savaData()">保存修改</el-button>
      </div>
    </div>
    <!-- 资金预算 -->
    <div class="content" v-if="activeName === '#step_2'">
      <el-table
        :data="tableData2"
        @cell-click="cellClick2"
        :cell-style="setRowStyle"
        row-key="name"
        border
        height="100%"
        default-expand-all
        :tree-props="{children: 'children'}">
        <el-table-column
          prop="name"
          label="项目公司/场站"
          width="210"
          align="left">
        </el-table-column>
        <el-table-column
          prop="amountList[0].value"
          label="年度投资预算（元）"
          width="180">
          <template slot-scope="scope">
            <span v-format="'#,##0.####'">{{scope.row.amountList[0].value?scope.row.amountList[0].value:'-'}}</span>
          </template>
        </el-table-column>
        <el-table-column v-for="(item, index) in info2.titles" :key="'o'+index" min-width="120">
          <template slot="header" slot-scope="scope">
            <el-popover
              placement="top"
              trigger="hover"
              :disabled="scope.column.popover">
              <span>{{item}}</span>
              <span class="headline" slot="reference" @mouseenter="Menter(scope.column, $event)">{{item}}</span>
            </el-popover>
          </template>
          <template slot-scope="scope">
            <span :style="unfinishedStyle(scope.row.amountList[index + 1].value)" class="flex-center">
              <span  v-format="'#,##0.####'"  class="flex-1">{{scope.row.amountList[index + 1].value?scope.row.amountList[index + 1].value:'待输入'}}</span>
               <i v-if="scope.row.type === 2" class="yfFont icon-bianji blue" style="marginRight:4px" :key="'o'+index"></i>  
            </span>
            <span v-show="false">
              <el-input v-model="scope.row.amountList[index + 1].value" @blur="finish(scope.row, scope.row.amountList[index + 1])" oninput="value=value.replace(/^\D*(\d*(?:\.\d{0,4})?).*$/g,'$1')"></el-input>
            </span>
          </template>
        </el-table-column>
      </el-table>
      <div class="footer">
        <el-button type="primary" @click="savaData2()">保存修改</el-button>
      </div>
    </div>
    <!-- 预算科目管理 -->
    <el-dialog
      title="预算科目管理"
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
      width="30%">
      <div class="diaContent flex-row">
        <div>
          <ul ref="typeList" @scroll="reactiveScroll">
            <li class="flex-vCenter">
              <el-button type="text" style="marginLeft:40px" @click="increaseType()">
                <i class="yfFont icon-xinzeng"></i>
                <span>新增类型</span>
              </el-button>
            </li>
            <li v-for="(v, index) in subTpyesOrCosts" :key="index + v" @click="changesubtype(index)" @mouseenter="typeEnter(index)" @mouseleave="typeLeave()" :style="{backgroundColor:index === currentSubtype?'#fff':'transparent'}">
              <el-input v-model="v.value" :class="{editStyle: editTypeStatus && currentTypeEdit === index}" size="mini" :clearable="editTypeStatus && currentTypeEdit === index" :readonly="!(editTypeStatus && currentTypeEdit === index)" @blur="inputTypeBlur(v.value, index)" maxlength="50">
                <div slot="suffix" v-show="index === hoverSubType && !(editTypeStatus && currentTypeEdit === index)">
                  <i class="yfFont icon-bianji" @click="inputTypeEdit(index, $event)"></i>
                  <el-popconfirm
                    title="这是一段内容确定删除吗？"
                    @confirm="inputTypeDel(v, index)"
                  >
                    <i slot="reference" class="yfFont icon-a-shanchukaobei"></i>
                  </el-popconfirm>
                </div>
              </el-input>
            </li>
          </ul>
        </div>
        <div>
          <ul ref="subjectList">
            <li class="flex-vCenter">
              <el-button type="text" @click="increaseSub()">
                <i class="yfFont icon-tianjiazuoyeneirong"></i>
                <span>新增科目</span>
              </el-button>
            </li>
            <li v-for="(v, index) in subCost" :key="index + v" @mouseenter="costEnter(index)" @mouseleave="costLeave()" :class="{activeCostStyle:index === hoverSubCost}">
              <el-input v-model="v.value" :class="{editStyle: editCostStatus && currentCostEdit === index}" size="mini" :clearable="editCostStatus && currentCostEdit === index" :readonly="!(editCostStatus && currentCostEdit === index)" @blur="inputCostBlur(v.value, index)" maxlength="50">
                <div slot="suffix" v-show="index === hoverSubCost && !(editCostStatus && currentCostEdit === index)">
                  <i class="yfFont icon-bianji" @click="inputCostEdit(index, $event)"></i>
                  <el-popconfirm
                    title="这是一段内容确定删除吗？"
                    @confirm="inputCostDel(v, index)"
                  >
                    <i slot="reference" class="yfFont icon-a-shanchukaobei"></i>
                  </el-popconfirm>
                </div>
              </el-input>
            </li>
          </ul>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitSubjectManag()">保 存</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    return {
      activeName: '',
      currentCell: null,
      budgetType: 1,  //invest / capital
      yearTime: this.$moment().format('YYYY'),
      date: this.$moment().format('YYYY-01-01'),
      info: {},
      info2: {},
      tableData1: [],
      tableData2: [],
      changeData: [],
      dialogVisible: false,
      subTpyesOrCosts: [],
      record: [],
      currentSubtype: 0 ,
      hoverSubCost: -1,  //鼠标悬浮索引
      hoverSubType: -1,
      editCostStatus: false,
      editTypeStatus: false,
      currentCostEdit: -1,
      currentTypeEdit: -1,
    }
  },
  computed: {
    unfinishedStyle () {
      return function (cost) {
        return `color: ${cost?'#606266':'rgba(0, 0, 0, 0.3)'};backgroundColor:${cost?'transparent':'rgba(0, 0, 0, 0.02)'}`
      }
    },
    subCost () {
      if (this.subTpyesOrCosts[this.currentSubtype]?.children) {
        return this.subTpyesOrCosts[this.currentSubtype].children
      }
      return []
    }
  },
  created () {
    this.activeName = window.location.hash || '#step_1' 
    if(!location.hash){
      window.location.hash = this.activeName
    }
    window.addEventListener('hashchange', this.hashchange)
    this.init()
  },
  methods: {
    init () {
      this.getInvestment(this.getCapital)
    },
    getData () {
      if (this.activeName == '#step_1') {
        this.getInvestment()
      }else if (this.activeName == '#step_2') {
        this.getCapital()
      }
    },
    getInvestment (func) {
      this.$http.fetchGet('/budget/plan', {
        date: this.date,
        type: 1
      }).then(res => {
        if (res.code === -1) {
          this.info = {}
          this.tableData1 = []
          return
        }
        this.info = res.data
        this.tableData1 = res.data.budgetVos
        // 一级菜单为空的值转成 --
        this.tableData1[0].amountList.map(val => {
          if ((val.value??'') === '') {
            val.value = '-'
          }
        })
        // 二级菜单为空的值转成 --
        this.tableData1[0].children.map(val => {
          val.amountList.map(row => {
            if ((row.value??'') === '') { 
              row.value = '-'
            }
          })
        })
        func?.()
      })
    },
    getCapital() {
      this.$http.fetchGet('/budget/plan', {
        date: this.date,
        type: 2
      }).then(res => {
        if (res.code === -1) {
          this.info2 = {}
          this.tableData2 = []
          return
        }
        this.info2 = res.data
        this.tableData2 = res.data.budgetVos
        this.tableData2[0].amountList.map(val => {
          if ((val.value??'') === '') {
            val.value = '-'
          }
        })
      })
    },
    getBudgetTree () {
      this.$http.fetchGet('/budget/budgetTree').then(res => {
        if (res.code === 0) {
          this.subTpyesOrCosts = res.data
          this.record = JSON.parse(JSON.stringify(res.data))
          this.dialogVisible = true
        }
      })
    },
    cellClick (row, column, cell, event) {  //点击单元格，使文本隐藏，input展示
      console.log(event.currentTarget);
      if (cell.children[0]?.children[1]?.children[0]?.children[0] && row.type === 3) { //过滤掉项目名称和年度投资预算
        cell.children[0].children[0].style.display = 'none'
        cell.children[0].children[1].style.display = 'block'
        cell.children[0].children[1].children[0].children[0].focus()
        //记录当前被选的单元格
        this.currentCell = cell
      }
      if (event.currentTarget.querySelector(".el-table__expand-icon")) {
        event.currentTarget.querySelector(".el-table__expand-icon").click();
      }
    },
    cellClick2 (row, column, cell) {  //点击单元格，使文本隐藏，input展示
      if (cell.children[0]?.children[1]?.children[0]?.children[0] && row.type === 2) { //过滤掉项目名称和年度投资预算
        cell.children[0].children[0].style.display = 'none'
        cell.children[0].children[1].style.display = 'block'
        cell.children[0].children[1].children[0].children[0].focus()
        //记录当前被选的单元格
        this.currentCell = cell
      }
    },
    finish (row, obj) {   //失去焦点时，还原被修改的单元格
      let item = this.changeData.find(val => {
        return val.id == row.id && val.budgetCode == obj.key
      })
      if (item) {
        item.budget = obj.value
      }else {
        this.changeData.push({
          budget: obj.value,
          budgetCode: obj.key,
          id: row.id
        })
      }
      console.log(this.changeData);
      this.currentCell.children[0].children[0].style.display = 'flex'
      this.currentCell.children[0].children[1].style.display = 'none'
    },
    setRowStyle (val) {
      if(val.columnIndex == 0){
          return 'textAlign: left;' 
      }else{
          return 'textAlign: center;' 
      }
    },
    budgetChange (arg) {  //切换预算类别
      this.budgetType = arg
    },
    submit (row) {
      this.date = this.$moment(row).format('YYYY-01-01')
      this.getData()
    },
    // 投资预算和资金预算数据保存
    savaData () {
      this.$http.fetch(`/budget/plan?budgetType=1&date=${this.date}`, this.changeData).then(res => {
        if (res.code === 0) {
          this.$message({
            message: '修改成功',
            type: 'success'
          });
          this.changeData = []
          this.getData()
        }
      })
    },
    savaData2 () {
      this.$http.fetch(`/budget/plan?budgetType=2&date=${this.date}`, this.changeData).then(res => {
        if (res.code === 0) {
          this.$message({
            message: '修改成功',
            type: 'success'
          });
          this.changeData = []
          this.getData()
        }
      })
    },
    subjectManagement () {
      this.getBudgetTree() 
    },
    changesubtype (index) {
      this.currentSubtype = index
    },
    costEnter (index) {
      this.hoverSubCost = index
    },
    typeEnter (index) {
      this.hoverSubType = index
    },
    costLeave () {
      this.hoverSubCost = -1
    },
    typeLeave () {
      this.hoverSubType = -1
    },
    inputCostBlur (value, index) {
      // input输入框失去焦点时，即为非编辑状态
      this.editCostStatus = false
      if((value??'') === '' && index === this.$refs.subjectList.children.length - 2) {
        this.subTpyesOrCosts[this.currentSubtype].children.pop()
      }
    },
    inputTypeBlur (value, index) {
      this.editTypeStatus = false
      if((value??'') === '' && index === this.$refs.typeList.children.length - 2) {
        this.subTpyesOrCosts.pop()
      }
    },
    inputCostEdit (index, e) {
      // 选中编辑的输入框获取焦点
      e.srcElement.parentNode.parentNode.parentNode.parentNode.children[0].focus()
      // 编辑状态，显示input边框和clearable
      // 非编辑状态，显示input中suffix的图标和readonly
      this.editCostStatus = true
      // 记录当前编辑的input输入框
      this.currentCostEdit = index
    },
    inputTypeEdit (index, e) {
      e.srcElement.parentNode.parentNode.parentNode.parentNode.children[0].focus()
      this.editTypeStatus = true
      this.currentTypeEdit = index
    },
    inputCostDel (val, index) {
      console.log(val.id);
      this.subTpyesOrCosts[this.currentSubtype].children.splice(index, 1)
      val.id && this.$http.fetch(`/budget/budgetDelete?id=${val.id}&type=2`).then(res => {
        if (res.code === 0) {
          this.getData()
        }
      })
    },
    inputTypeDel (val, index) {
      this.subTpyesOrCosts.splice(index, 1)
      val.id && this.$http.fetch(`/budget/budgetDelete?id=${val.id}&type=1`).then(res => {
        if (res.code === 0) {
          this.getData()
        }
      })
      this.currentSubtype = 0
    },
    increaseSub () {
      this.subTpyesOrCosts[this.currentSubtype].children.push({
        value: '',
      })
      this.$nextTick(() => {
        let lastLiIndex = this.$refs.subjectList.children.length - 1
        this.$refs.subjectList.children[lastLiIndex].children[0].children[0].focus()
        this.editCostStatus = true
        this.currentCostEdit = this.$refs.subjectList.children.length - 2
        this.$refs.subjectList.scrollTo(0, this.$refs.subjectList.children.length*30+2 - this.$refs.subjectList.getBoundingClientRect().height)
      })
    },
    reactiveScroll(e) {
      console.log(e.target.scrollTop);
    },
    increaseType () {
      this.subTpyesOrCosts.push({
        value: '',
        children: []
        })
      console.log(this.$refs.typeList);
      this.$nextTick(() => {
        let lastLiIndex = this.$refs.typeList.children.length - 1
        this.$refs.typeList.children[lastLiIndex].children[0].children[0].focus()
        this.editTypeStatus = true
        this.currentTypeEdit = this.$refs.typeList.children.length - 2
        this.$refs.typeList.scrollTo(0, this.$refs.typeList.children.length*40+2 - this.$refs.typeList.getBoundingClientRect().height)
      })
    },
    submitSubjectManag () {
      console.log(this.subTpyesOrCosts);
      if (JSON.stringify(this.subTpyesOrCosts) === JSON.stringify(this.record)) {
        this.$message({
          message: '预算科目暂未改动',
          type: 'warning'
        });
        return
      }
      this.$http.fetch(`/budget/budgetEdit`, this.subTpyesOrCosts).then(res => {
        if (res.code === 0) {
          this.$message({
            message: '修改成功',
            type: 'success'
          });
          this.getData()
          this.dialogVisible = false
          }
       })
    },
    handleClick (tab) {
      window.location.hash = tab.name 
      this.getData()
    },
    Menter (row, e) {
      if (e.currentTarget.getBoundingClientRect().width <= 120) {
        this.$set(row, 'popover', true)
      }
    },
  },
}
</script>

<style lang="less" scoped>
.authorizedStrength {
  width: 100%;
  height: 100%;
  position: relative;
  padding-bottom: 60px;
  background-color: #fff;
  .authHeader {
    background-color: #fff;
  }
  .content {
    flex: 1;
    overflow: auto;
    background-color: #fff;
    .headline { //标题的名称
      overflow:hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      -o-text-overflow:ellipsis;
    }
    /deep/ .el-input__inner {
      height: 48px;
      border-radius: 0px;
    }
    /deep/ .el-table .el-table__cell {
      padding: 0;
    }
    /deep/ .el-table .cell {
      padding: 0;
      height: 48px;
      line-height: 48px;
    }
  }
  .footer {
    position: absolute;
    left: 0;
    bottom: 0;
    width: 100%;
    display: flex;
    justify-content: center;
    padding: 10px 0;
    background-color: #fff;
  }
  .diaContent {
    border-top: 1px solid rgba(0, 0, 0, 0.1);
    > div ul{
      height: 182px;
      padding-bottom: 10px;
      overflow: auto;
    }
    div li {
      /deep/ .el-button {
        padding: 0px;
        margin: 0px !important;
      }
      /deep/ .el-input__inner {
        border: 0;
        background-color: transparent;
      }
      /deep/ .el-input--suffix .el-input__inner {
        padding-right: 60px;
      }
      /deep/ .el-input__suffix-inner {
        i:nth-of-type(1) {
          margin-right: 10px;
        }
        i {
          color: black;
        }
        i:hover {
          cursor: pointer;
        }
      }
    }
    /deep/ .el-button--text span{
      display: flex;
      align-items: center;
    }
    >div:nth-of-type(1) {
      width: 40%;
      background-color: #F2F2F2;
      li {
        height: 40px;
        line-height: 40px;
        padding-left: 40px;
      }
      li:nth-of-type(1) {
        position: sticky;
        top: 0;
        left: 0;
        z-index: 2;
        background-color: #F2F2F2;
      }
    }
    >div:nth-of-type(2) {
      flex: 1;
      li {
        height: 30px;
        line-height: 30px;
        padding: 0 20px;
      }
      li:nth-of-type(1) {
        position: sticky;
        top: 0;
        left: 0;
        z-index: 2;
        background-color: #fff;
      }
    }
  }
 /deep/ input::-webkit-outer-spin-button, /deep/ input::-webkit-inner-spin-button {
    -webkit-appearance: none !important;
  }
  /deep/ input[type='number'] {
    -moz-appearance: textfield !important;
  }
  /deep/ .el-dialog {
    min-width: 500px;
  }
  /deep/ .el-dialog__body {
    padding: 0;
  }
  /deep/ .el-dialog__footer {
    padding: 10px 20px;
  }
  .activeCostStyle {
    background-color: #DCF0FC !important;
  }
  .editStyle {
    border:1px solid #409EFF;
  }
}
</style>