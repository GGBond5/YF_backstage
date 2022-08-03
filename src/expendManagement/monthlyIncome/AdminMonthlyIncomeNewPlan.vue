<template>
  <div class="adminMonthlyIncomeNewPlan flex-column">
    <YfDetailsHeader title="月度入账计划" :path="'/expendManagement/adminMonthlyIncome'+this.detailsInfo.hash"></YfDetailsHeader>
    <div class="monInNewContent">
      <YfSearch tActive="month" @confirm="submit" :plantId="detailsInfo.plantId" :time="detailsInfo.dataDate" timeTypeName="计划入账月份：" :checkDis="true" layout="plant,dateTypeRange"></YfSearch>
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
          :label="`${detailsInfo.dataDate?$moment(detailsInfo.dataDate).format('yyyy'):'-'}年入账计划金额`">
          <template slot-scope="scope"> 
            <span v-format="'#,##0.####'">{{scope.row.yearAmount}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="monthAmountSum"
          label="已审核月度计划累计">
          <template slot-scope="scope">
            <span v-format="'#,##0.####'">{{scope.row.monthAmountSum}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="monthAmount"
          label="本月计划入账金额">
          <template slot-scope="scope">
            <span v-format="'#,##0.####'">{{scope.row.monthAmount}}</span>
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
              <div class="uploadNumStyle" @mouseenter="MEnter($event, scope.row)" @mouseleave="MLeave()">{{scope.row.fileCount?scope.row.fileCount:'0'}}</div>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <!-- 审核结果 -->
      <div class="auditOpinion" v-if="!detailsInfo.readonly">
        <el-form ref="auditForm" :model="auditForm" label-width="120px" > 
          <el-form-item label="审核结果：">
            <el-radio-group v-model="auditForm.pass">
              <el-radio :label="true">通过</el-radio>
              <el-radio :label="false">不通过</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="意见及建议：">
          <el-input
            type="textarea"
            :rows="2"
            resize='none'
            placeholder="请输入内容"
            v-model="auditForm.suggest">
          </el-input>
          </el-form-item>
        </el-form>
        <!-- 提交按钮 -->
        <div class="btns">
          <el-button @click="cencel()" plain>取消</el-button>
          <el-button type="primary" @click="submitAudit()">提交</el-button>
        </div>
      </div>
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
    </div>
  </div>
</template>

<script>
import {mapGetters} from 'vuex'
export default {
  data () {
    return {
      detailsInfo: {},
      bookedMaterial: [],
      MIncomeData: [],
      isShow: false,
      timerLeave: null,
      auditForm: {  //评论意见
        suggest: '',
        pass: true,
      },
    }
  },
  computed: {
    ...mapGetters(['storage'])
  },
  created () {
    this.init()
  },
  methods: {
    init () {
      this.detailsInfo = this.storage.monthlyPlan_details
      this.$http.fetchGet(`/plan/getBillInfo?planId=${this.detailsInfo.id}`).then(res => {
        this.MIncomeData = res.data.months
        this.MIncomeData.map((val, index) => {
          val.serialNumber = index + 1
        })
      })
    },
    submit () {

    },
    moneyFormat(money) {  //千分位带两位小数
      if ((money ?? '') === '') {return ''}
      return Number(money).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,')
    },
    newProject () {
      this.dialogVisible = true
    },
    MEnter (e, row) {
      clearTimeout(this.timerLeave)
      this.bookedMaterial = row.files //悬浮展示的数据源
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
      }, 1480);
    },
    hoverEnter () {
      clearTimeout(this.timerLeave)
    },
    hoverLeave () {
      this.isShow = false
    },
    submitAudit () {
      this.$http.fetch(`/plan/plantPlanAudit`, {
        "auditFlag": this.auditForm.pass,
        "comment": this.auditForm.suggest,
        "id": this.detailsInfo.id,
        "type": 1
      }).then(res => {
        this.$router.push('/expendManagement/adminMonthlyIncome')
      })
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
.adminMonthlyIncomeNewPlan {
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
    .auditOpinion {
      margin-top: 10px;
    }
    .btns {
      display: flex;
      justify-content: center;
      /deep/ .el-button {
        padding: 10px 40px;
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
  }
}
</style>