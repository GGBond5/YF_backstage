<template>
  <div class="monthlyIncomeNewRecord flex-column">
    <YfDetailsHeader title="月度入账计划" :path="'/expendManagement/monthlyIncome'+this.monDetails.hash"></YfDetailsHeader>
    <div class="monInNewContent">
      <YfSearch tActive="month" @confirm="submit" :plantId="monDetails.plantId" :time="monDetails.dataDate" timeTypeName="计划入账月份：" :checkDis="true" layout="plant,dateTypeRange"></YfSearch>
      <el-table
        :data="MIncomeData"
        border
        style="width: 100%">
        <el-table-column
          prop="serialNumber"
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
          prop="yearAmount"
          :label="`${monDetails.dataDate?$moment(monDetails.dataDate).format('yyyy'):'-'}年入账计划金额`">
          <template slot-scope="scope">
            <div v-format="'#,##0.####'">{{scope.row.yearAmount}}</div>
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
          prop="monthAmount"
          label="本月计划入账金额">
          <template slot-scope="scope">
            <div v-format="'#,##0.####'">{{scope.row.monthAmount}}</div>
          </template>
        </el-table-column>
        <el-table-column
          prop="comment"
          label="备注">
        </el-table-column>
        <el-table-column
          label="入账材料"
          width="100">
          <template slot-scope="scope">
            <div class="flex-row" style="textAlign: left;">
              <div class="uploadNumStyle" @mouseenter="MEnter($event, scope.row.files)" @mouseleave="MLeave()">{{scope.row.files?scope.row.files.length:0}}</div>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          prop="actualAmount"
          label="实际入账金额（元）">
          <template slot-scope="scope">
            <div v-format="'#,##0.####'">{{scope.row.actualAmount}}</div>
          </template>
        </el-table-column>
        <el-table-column
          prop="operations"
          label="入账次数">
          <template slot-scope="scope">
            <div class="blueTextBtn underline">
              <span @click="examineRecord(scope.row)">{{scope.row.operations?scope.row.operations.length:'0'}}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          width="120">
          <template slot-scope="scope">
            <div class="blueTextBtn" @click="functionality(scope.row)">{{scope.row.operation}}</div>
          </template>
        </el-table-column>
      </el-table>
      <!-- 鼠标悬浮 -->
      <div class="hoverShow" ref="uploadList" v-show="isShow" @mouseenter="hoverEnter" @mouseleave="hoverLeave">
        <h4>入账材料</h4>
        <div class="SContent">
          <ul>
            <li v-for="(item, index) in bookedMaterial" :key="index">
              <span>
                <span class="color1 bgColor1">发票</span>
              </span>
              <span>{{item.fileName}}</span>
              <span><label v-format="'0.#0'">{{item.fileSize/1024/1024}}</label>MB</span>
              <span class="yfFont icon-xiazai" @click="download(item)"></span> 
            </li>
          </ul>
          <el-empty :image-size="50"  description="暂无材料" v-if="bookedMaterial && bookedMaterial.length > 0?false:true"></el-empty>
        </div>
      </div>
      <!-- 添加入账记录 -->
        <el-dialog
          title="添加入账计划"
          :visible.sync="increaseRecord"
          width="30%">
          <div class="increaseContent">
            <el-form ref="recoedform" label-width="120px">
              <el-form-item label="实际入账月份：">
                <el-col :span="22">
                  <el-date-picker
                    v-model="recoedform.month"
                    type="month"
                    placeholder="选择月份"
                    style="width: 100%;"
                    format="yyyy年MM月">
                  </el-date-picker>
                </el-col>
              </el-form-item>
              <el-form-item label="实际入账金额：">
                <el-col :span="22">
                  <el-input v-model="recoedform.money"></el-input>
                </el-col>
              </el-form-item>
              <el-form-item label="备注：">
                <el-col :span="22">
                  <el-input v-model="recoedform.remark"></el-input>
                </el-col>
              </el-form-item>
            </el-form>
          </div>
          <span slot="footer" class="dialog-footer">
            <el-button @click="increaseRecord = false">取 消</el-button>
            <el-button type="primary" @click="addMonthRecord()">确 定</el-button>
          </span>
        </el-dialog>
      <!-- 入账详情记录 -->
      <el-dialog
        title="入账详情记录"
        :visible.sync="DeRecodeDialog"
        width="30%">
        <div class="detailsRecord">
          <el-timeline>
            <el-timeline-item  v-for="(item, index) in recordOperation" :key="'Bill'+index">
              <div class="TLHeader">
                <span>第{{item.no}}次入账</span>
                <span>操作时间：{{item.updateTime}}</span>
              </div>
              <el-card>
                <p>实际入账月份：{{$moment(item.dataDate).format('yyyy年MM月')}}</p>
                <p>实际入账金额：<span>{{item.amount}}</span>元</p>
                <p>备注：{{item.comment}}</p>
              </el-card>
            </el-timeline-item>
          </el-timeline>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="DeRecodeDialog = false">取 消</el-button>
          <el-button type="primary" @click="DeRecodeDialog = false">关闭</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import {mapGetters} from 'vuex'
export default {
  data () {
    return {
      increaseRecord: false,
      DeRecodeDialog: false,
      bookedMaterial: [],
      isShow: false,
      timerLeave: null,
      MIncomeData: [],
      recordOperation: [],
      recoedform: {
        month: '',
        money: '',
        remark: ''
      },
      monDetails: {},
      paymentRecord: {},
    }
  },
  computed: {
    randomColor () {
      let r = Math.floor(Math.random() * 256);
      let g = Math.floor(Math.random() * 256);
      let b = Math.floor(Math.random() * 256);
      return {
        color: `rgb(${r}, ${g}, ${b})`,
        backgroundColor: `rgba(${r}, ${g}, ${b}, 0.2)`
      }
    },
    ...mapGetters(['storage'])
  },
  created () {
    this.init()
  },
  methods: {
    init () {
      this.monDetails = this.storage.monthlyPlan_details
      this.$http.fetchGet(`/plan/getBillInfo?planId=${this.monDetails.id}`).then(res => {
        this.MIncomeData = res.data.months
        this.MIncomeData.map((val, index) => {
          val.serialNumber = index + 1
          val.operation = parseInt(val.monthAmount) > parseInt(val.actualAmount?val.actualAmount:'0')? '添加入账记录': '查看'
        })
      })
    },
    addMonthRecord () {
      this.$http.fetch(`/project/billOperationEdit`, {
        "amount": this.recoedform.money,
        "comment": this.recoedform.remark,
        "dataDate": this.recoedform.month,
        "parentId": this.paymentRecord.id
      }).then(res => {
        if (res.code === 0) {
          this.increaseRecord = false
          this.$message({
            message: '入账计划添加成功',
            type: 'success'
          });
          this.init()
        }
      })
    },
    moneyFormat(money) {  //千分位带两位小数
      if ((money ?? '') === '') {return ''}
      return Number(money).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,')
    },
    newProject () {
      this.dialogVisible = true
    },
    MEnter (e, materials) {
      clearTimeout(this.timerLeave)
      this.bookedMaterial = materials //悬浮展示的数据源
      this.isShow = true  //此时变量为true，但页面还没重新渲染
      this.$nextTick(() => {
        let DOMRect = e.srcElement.getBoundingClientRect()
        this.$refs.uploadList.style.left = `${DOMRect.left - 220 - this.$refs.uploadList.clientWidth}px`
        this.$refs.uploadList.style.top = `${DOMRect.top - DOMRect.height}px`
      })
    },
    MLeave () { //移出后1s消失,如果进入展示区域或其他材料区域，将取消1s消失得动作
      this.timerLeave = setTimeout(() => {
        this.isShow = false
      }, 320);
    },
    hoverEnter () {
      clearTimeout(this.timerLeave)
    },
    hoverLeave () {
      this.isShow = false
    },
    functionality (row) {
      if (row.operation === '添加入账记录') {
        this.increaseRecord = true
        this.paymentRecord = row
        this.recoedform = []
      }
    },
    examineRecord (row) {
      this.recordOperation = row.operations
      this.recordOperation && this.recordOperation.map((val, index) => {
        val.no = index + 1
      })
      this.DeRecodeDialog = true
    },
    submit () {

    },
    download (row) {
      this.$http.download(`/file/downloadFile?id=${row.id}`).then(res => {
        this.$fileDownload(res.data, row.fileName)
      })
    },
  }
}
</script>

<style lang="less" scoped>
.monthlyIncomeNewRecord {
  position: relative;
  height: 100%;
  .monInNewContent {
    flex: 1;
    overflow: auto;
    margin-top: 10px;
    background-color: #fff;
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
              width: 60px;
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
    .detailsRecord { //入账次数弹框
      .TLHeader {
        margin-bottom: 16px;
        >span:nth-of-type(2) {
          color: #999;
        }
      }
    }
    .blueTextBtn {
      color: #409EFF;
      cursor: pointer;
      -moz-user-select: none;
      -webkit-user-select: none;
      -ms-user-select: none;
      user-select: none;
    }
    .underline {
      text-decoration:underline;
    }
    .TLHeader {
      display: flex;
      justify-content: space-between;
      margin-bottom: 10px;
    }
    .headline { //标的名称
      overflow:hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      -o-text-overflow:ellipsis;
    }
    /deep/ .el-dialog__body {
      padding: 30px 20px 0 20px;
      border-top: 1px solid rgba(0, 0, 0, 0.1);
    }
  }
}
</style>