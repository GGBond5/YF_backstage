<template>
  <div class="monthlyIncomeNewPlan flex-column">
    <YfDetailsHeader title="月度付款计划" path="/expendManagement/monthlyPayment"></YfDetailsHeader>
    <div class="monInNewContent flex-1 flex-column">
      <YfSearch tActive="month" @plantSelect="monPlantSelect" @selectMonth="monSelectMonth" timeTypeName="计划付款月份：" @confirm="submit" layout="plant,dateTypeRange"></YfSearch>
      <el-table
        :data="MIncomeData"
        border
        @cell-click="cellClick"
        :span-method="arraySpanMethod"
        height="100%"
        style="width: 100%">
        <el-table-column
          label="序号"
          width="60">
          <template slot-scope="scope">
            <div :class="setBlue(scope.row)" @click="newProject(scope.row)"><i class="el-icon-plus" v-if="scope.row.serialNum === '新增月度付款项目'" style="marginRight: 5px"></i>{{scope.row.serialNum}}</div>
          </template>
        </el-table-column>
        <el-table-column
          prop="tenderName"
          label="标的名称"
          width="300">
          <template slot-scope="scope">
            <span class="headline">{{scope.row.tenderName}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="projectTypeName"
          label="项目类型"
          width="80">
        </el-table-column>
        <el-table-column
          prop="budgetCodeName"
          label="预算科目">
        </el-table-column>
        <el-table-column
          prop="planAmount"
          :label="`${this.monthTime?$moment(this.monthTime).format('yyyy'):'-'}年付款计划金额`">
          <template slot-scope="scope">
            <div v-format="'#,##0.####'">{{scope.row.planAmount}}</div>
          </template>
        </el-table-column>
        <el-table-column
          prop="monthAmountSum"
          label="已审核月度计划累计">
          <template slot-scope="scope">
            <div v-format="'#,##0.####'">{{scope.row.monthAmountSum}}</div>
          </template>
        </el-table-column>
        <el-table-column
          label="本月计划付款金额">
          <template slot-scope="scope">
            <div>
              <span v-format="'#,##0.####'" :style="{color:scope.row.thisMonthMoney?'#606266':'#cccccc'}">{{scope.row.thisMonthMoney?scope.row.thisMonthMoney:'点击输入'}}</span>
              <span v-show="false">
                <el-input v-model="scope.row.thisMonthMoney" @blur="finish(scope.row)" oninput="value=value.replace(/^\D*(\d*(?:\.\d{0,4})?).*$/g,'$1')" clearable></el-input>
              </span>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          prop="remark"
          label="备注">
          <template slot-scope="scope">
            <div>
              <span :style="{color:scope.row.remark?'#606266':'#cccccc'}">{{scope.row.remark?scope.row.remark:'点击输入'}}</span>
              <span v-show="false">
                <el-input v-model="scope.row.remark" @blur="finish(scope.row)" clearable></el-input>
              </span>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          label="入账材料"
          width="280">
          <template slot-scope="scope">
            <div class="flex-row" style="textAlign: left;">
              <el-upload
                class="upload-demo"
                ref="upload"
                action="https://jsonplaceholder.typicode.com/posts/"
                :on-change="(file, fileList) => {return handleChange(file, fileList, scope.row)}" 
                :file-list="scope.row.materials"
                :auto-upload="false"
                :show-file-list="false">
                <el-button slot="trigger" class="uploadBtn" v-for="(item, index) in supportBtns" :key="index" @click="selectFile(item)"><i class="el-icon-plus"></i>{{item.value}}</el-button>
              </el-upload>
              <div class="uploadNumStyle" @mouseenter="MEnter($event, scope.row.materials)" @mouseleave="MLeave()">{{scope.row.materials.length}}</div>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          width="80">
          <template slot-scope="scope">
            <div class="blueTextBtn" @click="outFunctionality(scope.row)">移除</div>
          </template>
        </el-table-column>
      </el-table>
      <div class="monInNewfooter flex-center">
        <el-button type="primary" @click="cencel()" plain>取消</el-button>
        <el-button type="primary" @click="temporaryStorage()" plain>保存草稿</el-button>
        <el-popconfirm
          confirm-button-text='确认'
          cancel-button-text='取消'
          icon="el-icon-info"
          icon-color="red"
          title="确认提交审核吗？"
          @confirm="submitAudit()"
        >
          <el-button type="primary" slot="reference">提交审核</el-button>
        </el-popconfirm>
      </div>
      <!-- 鼠标悬浮 -->
      <div class="hoverShow" ref="uploadList" v-show="isShow" @mouseenter="hoverEnter" @mouseleave="hoverLeave">
        <h4>入账材料</h4>
        <div class="SContent">
          <ul>
            <li v-for="(item, index) in bookedMaterial" :key="index">
              <span>
                <span class="color1 bgColor1">{{item.tag}}</span>
              </span>
              <span>{{item.name}}</span>
              <span><label v-format="'0.#0'">{{item.size/1024/1024}}</label>MB</span>
              <span>
                <el-popconfirm
                  title="确定删除吗？"
                  @confirm="fileDel(item)"
                >
                  <i slot="reference" class="el-icon-close"></i>
                </el-popconfirm>
              </span>
            </li>
          </ul>
          <el-empty :image-size="50"  description="暂无材料" v-if="bookedMaterial && bookedMaterial.length > 0?false:true"></el-empty>
        </div>
      </div>
      <!-- 新增月度付款项目 -->
      <el-dialog
        title="计划付款项目"
        :visible.sync="dialogVisible"
        width="70%">
        <el-table
          ref="multipleTable"
          :data="incomeSchedule"
          border
          style="width: 100%"
          @selection-change="handleSelectionChange"> 
          <el-table-column
            type="selection"
            width="40">
          </el-table-column>
          <el-table-column
            prop="serialNum"
            label="序号"
            width="60">
          </el-table-column>
          <el-table-column
            prop="tenderName"
            label="标的名称"
            width="300">
            <template slot-scope="scope">
              <span class="headline">{{scope.row.tenderName}}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="projectTypeName"
            label="项目类型"
            width="80">
          </el-table-column>
          <el-table-column
            prop="budgetCodeName"
            label="预算科目">
          </el-table-column>
          <el-table-column
            prop="planAmount"
            label="年入账计划金额（元）">
            <template slot-scope="scope">
              <div v-format="'#,##0.####'">{{scope.row.planAmount}}</div>
            </template>
          </el-table-column>
          <el-table-column
            prop="monthAmountSum"
            label="月度计划入账累计金额（元）">
            <template slot-scope="scope">
              <div v-format="'#,##0.####'">{{scope.row.monthAmountSum}}</div>
            </template>
          </el-table-column>
        </el-table>
        <span slot="footer" class="dialog-footer flex-center">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="pitchOn()">确 定</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      plant: '',
      monthTime: '',
      dialogVisible: false,
      tableSelectRow: [],
      bookedMaterial: [],
      MIncomeData: [{
        serialNum: '新增月度付款项目'
      }],
      incomeSchedule: [],
      isShow: false,
      currentCell: null,
      timerLeave: null,
      supportBtns: [],
      tag: '',
      code: ''
    }
  },
  computed: {
  },
  created () {
    this.init()
  },
  methods: {
    init () {
      this.$http.fetchGet(`/project/getFileTypeList`).then(res => {
        if (res.code === 0) {
          this.supportBtns = res.data[7].children
        }
      }) 
    },
    submit () {

    },
    selectFile (item) { //选择文件完毕等待上传
      this.tag = item.value
      this.code = item.id  
    },
    arraySpanMethod({ rowIndex, columnIndex }) { //表格合并
      if (rowIndex  === 0) {
        if (columnIndex === 0) {
          return [1, 10];
        } else {
          return [0, 0];
        }
      }
    },
    setBlue (row) {
      if (['新增月度付款项目'].includes(row.serialNum)) { //新增入账计划的样式
        return {
          blueTextBtn: true
        }
      }
    },
    newProject () {
      if (!this.plant) {
        this.$message.error('需选择场站')
        return
      }else if (!this.monthTime) {
        this.$message.error('需选择月份')
        return
      }
      this.dialogVisible = true
      this.$http.fetchGet(`/project/getPayProjectList?date=${this.monthTime}&plantId=${this.plant}`).then(res => {
        this.incomeSchedule = res.data
        this.incomeSchedule.map((val, index) => {
          val.serialNum = index + 1
          this.$set(val, 'materials', []) 
          this.$set(val, 'thisMonthMoney', '') 
          this.$set(val, 'remark', '') 
        })
      })
    },
    handleSelectionChange (val) { //被多选框选中的数据行
      this.tableSelectRow = val
      this.tableSelectRow.sort((a, b) => {
        if (a.serialNum < b.serialNum) {
          return -1
        }
        if (a.serialNum > b.serialNum) {
          return 1
        }
        return 0
      })
    },
    pitchOn () {
      this.MIncomeData = [{serialNum: '新增月度付款项目'}]
      this.MIncomeData.push(...this.tableSelectRow)
      console.log(this.MIncomeData);
      this.dialogVisible = false
    },
    MEnter (e, materials) {
      clearTimeout(this.timerLeave)
      this.bookedMaterial = materials //悬浮展示的数据源
      this.isShow = true  //此时变量为true，但页面还没重新渲染
      this.$nextTick(() => {
        let DOMRect = e.srcElement.getBoundingClientRect()
        this.$refs.uploadList.style.left = `${DOMRect.left - this.$refs.uploadList.clientWidth}px`
        this.$refs.uploadList.style.top = `${DOMRect.top - DOMRect.height}px`
      })
    },
    MLeave () { //移出后1s消失,如果进入展示区域或其他材料区域，将取消1s消失得动作
      this.timerLeave = setTimeout(() => {
        this.isShow = false
      }, 960);
    },
    hoverEnter () {
      clearTimeout(this.timerLeave)
    },
    hoverLeave () {
      this.timerLeave = setTimeout(() => {
        this.isShow = false
      }, 960);
    },
    handleChange (file, fileList, row) {
      row.materials = fileList
      file.tag = this.tag
      file.code = this.code
    },
    cellClick (row, column, cell) {
      if (['本月计划付款金额', '备注'].includes(column.label)) {
        console.log(cell.children[0].children[0].children[1].children[0]);
        cell.children[0].children[0].children[0].style.display = 'none'
        cell.children[0].children[0].children[1].style.display = 'block'
        cell.children[0].children[0].children[1].children[0].children[0].focus()
        this.currentCell = cell
      }
    },
    finish () {   //失去焦点时，还原被修改的单元格
        this.currentCell.children[0].children[0].children[0].style.display = 'block'
        this.currentCell.children[0].children[0].children[1].style.display = 'none'
    },
    monPlantSelect (e) {
      this.plant = e
    },
    monSelectMonth (e) {
      this.monthTime = e
    },
    outFunctionality (row) {
      console.log(row);
      const index = this.MIncomeData.findIndex(val => {
        return val.id === row.id
      })
      this.MIncomeData.splice(index, 1)
    },
    submitAudit () {
      const postArr = this.MIncomeData.slice(1)
      let embellish = []
      postArr.map(val => {
        embellish.push({
          amount: val.thisMonthMoney,
          comment: val.remark,
          parentId: val.id,
        })
      })
      this.$http.fetch(`/plan/payPlanEdit`, {
        "dataDate": this.monthTime,
        "isAudit": true,
        "monthVos": embellish,
        "plantId": this.plant,
      }).then(async res => {
        if (res.code === 0) {
          await Promise.all(postArr.map(async val => {
            let list = []
            const formDatas = new FormData()
            val.materials.map(row => {
              formDatas.append("file", row.raw);
              list.push({
                dataDate: this.monthTime,
                fileCode: row.code,
                fileName: row.name,
                fileSize: row.size,
              })
            })
            this.$http.upload(`/file/uploadFileList?date=${this.$moment().format('yyyy-MM-DD')}&type=3`, formDatas).then(result => {
              if (result.code === 0) {
                list.map((item, index) => {
                  item.fileUrl = result.data[index]
                  item.projectId = val.projectId
                })
                this.$http.fetch(`/file/saveFileList`, list)
              }
            })
          }))
          this.$router.push('/expendManagement/monthlyPayment')
        }
      })
    },
    temporaryStorage () {
      const postArr = this.MIncomeData.slice(1)
      let embellish = []
      postArr.map(val => {
        embellish.push({
          amount: val.thisMonthMoney,
          comment: val.remark,
          parentId: val.id,
        })
      })
      this.$http.fetch(`/plan/payPlanEdit`, {
        "dataDate": this.monthTime,
        "isAudit": false,
        "monthVos": embellish,
        "plantId": this.plant,
      }).then(async res => {
        if (res.code === 0) {
          await Promise.all(postArr.map(async val => {
            let list = []
            const formDatas = new FormData()
            val.materials.map(row => {
              formDatas.append("file", row.raw);
              list.push({
                dataDate: this.monthTime,
                fileCode: row.code,
                fileName: row.name,
                fileSize: row.size,
              })
            })
            this.$http.upload(`/file/uploadFileList?date=${this.$moment().format('yyyy-MM-DD')}&type=3`, formDatas).then(result => {
              if (result.code === 0) {
                list.map((item, index) => {
                  item.fileUrl = result.data[index]
                  item.projectId = val.projectId
                })
                this.$http.fetch(`/file/saveFileList`, list)
              }
            })
          }))
          this.$router.push('/expendManagement/monthlyPayment')
        }
      })
    },
    cencel () {
      this.$router.push('/expendManagement/monthlyPayment')
    },
    fileDel (item) {
      const index = this.bookedMaterial.findIndex(val => {
        return val.uid === item.uid
      })
      this.bookedMaterial.splice(index, 1)
    }
  }
}
</script>

<style lang="less" scoped>
.monthlyIncomeNewPlan {
  height: 100%;
  .monInNewContent {
    flex: 1;
    overflow: auto;
    margin-top: 10px;
    background-color: #fff;
    .uploadBtn {
      height: 30px;
      padding: 0 10px;
    }
    .uploadNumStyle {
      margin-left: 10px;
      padding: 0px 20px;
      line-height: 30px;
      color: #409EFF;
      background-color: #EBF7FE;
      border-radius: 30px;
      &:hover {
        cursor: pointer;
      }
    }
    .monInNewfooter {
      >button:nth-of-type(2) {
        margin: 0 10px;
      }
    }
    .edit {
      /deep/ .el-table .cell {
        padding: 0;
      }
    }
    .hoverShow {
      position: absolute;
      top: 0;
      left: 0;
      z-index: 100;
      width: 600px;
      background-color: #fff;
      box-shadow: 0 5px 5px rgba(0, 0, 0, 0.1);
      h4 {
        padding: 0 10px;
        line-height: 46px;
        border-bottom: 1px solid rgba(0, 0, 0, 0.1);
      }
      .SContent {
        padding: 10px;
        li {
          height: 40px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0 10px;
          margin-bottom: 10px;
          list-style: none;
          background-color: rgba(0, 0, 0, 0.03);
          >span:nth-of-type(1) {
            >span:nth-of-type(1) {
              display: inline-block;
              width: 100px;
              height: 24px;
              line-height: 24px;
              font-size: 10px;
              padding: 0 14px;
              text-align: center;
              border-radius: 4px;
            }
          }
          >span:nth-of-type(2) {
            width: 200px;
            margin: 0 20px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }
          >span:nth-of-type(3) {
            flex: 1;
            text-align: right;
          }
          >span:nth-of-type(4) {
            margin: 0 10px;
            font-size: 20px;
            line-height: 40px;
            cursor: pointer;
          }
        }
        li:nth-last-of-type(1) {
          margin-bottom: 0px;
        }
      }
    }
    .headline { //标的名称
      overflow:hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      -o-text-overflow:ellipsis;
    }
    .blueTextBtn {
      color: #409EFF;
      cursor: pointer;
      -moz-user-select: none;
      -webkit-user-select: none;
      -ms-user-select: none;
      user-select: none;
    }
    /deep/ .el-dialog__body {
      padding: 0;
    }
    /deep/ .el-dialog__footer {
      padding: 20px;
    }
    /deep/ .el-table .cell {
      padding: 0;
     .el-input__inner {
        height: 47px;
        border-radius: 0px;
      }
    }
    /deep/ .el-table .el-table__cell {
      padding: 0;
      height: 48px;
      line-height: 48px;
    }
  }
}
</style>