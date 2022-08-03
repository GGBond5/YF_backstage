<template>
  <div class="monthly">
    <MonthlyPlan @functionality="AincomeFunctionality" @searchSubmit="submit"  :tableData="tableData" :allData="allData" :newPlan="[false]">
    </MonthlyPlan>
  </div>
</template>

<script>
import MonthlyPlan from '../MonthlyPlan.vue'
import {mapGetters, mapActions} from 'vuex'
export default {
  data() {
    return {
      tableData: [],
      allData: []
    }
  }, 
  computed: {
    ...mapGetters(['actionMapping'])
  },
  created () {
    this.init()
  },
  methods: {
    init () {
      this.$http.fetchGet(`/plan/getPayListByAudit?type=1`).then(res => {
        this.tableData = res.data
        this.tableData && this.tableData.map((val, index) => {
          val.serialNumber = index + 1
          // 计划付款操作
          let incomeObj = this.actionMapping.find(row => {
            return row.progress === '年度付款计划'
          }) 
          let incomeInfo = incomeObj.auditStatus.find(par => {
            return par.state === val.statusName
          })
          val.operation = incomeInfo?.checkOperation
        })
      })
      this.$http.fetchGet(`/plan/getPayListByAudit?type=2`).then(res => {
        this.allData = res.data 
        this.allData && this.allData.map((val, index) => {
          val.serialNumber = index + 1
          // 计划付款操作
          let incomeObj = this.actionMapping.find(row => {
            return row.progress === '年度付款计划'
          }) 
          let incomeInfo = incomeObj.auditStatus.find(par => {
            return par.state === val.statusName
          })
          val.operation = incomeInfo?.checkOperation
        })
      })
    },
    AincomeFunctionality (row, hash) {
      row.readonly = true
      if (row.operation[0] === '立即审核') row.readonly = false
      row.hash = hash
      this.saveStorage({key: 'monthlyPlan_details', val: row})
      this.$router.push('/expendManagement/adminMonthlyPayment/adminMonthlyPaymentNewPlan')
    },
    submit ({plantCode, projectStatus}) {
      this.$http.fetchGet(`/plan/getPayListByAudit?plantId=${plantCode}&status=${projectStatus}&type=2`).then(res => {
        this.allData = res.data
        this.allData && this.allData.map((val, index) => {
          val.serialNumber = index + 1
          // 计划付款操作
          let incomeObj = this.actionMapping.find(row => {
            return row.progress === '年度付款计划'
          }) 
          let incomeInfo = incomeObj.auditStatus.find(par => {
            return par.state === val.statusName 
          })
          val.operation = incomeInfo?.checkOperation
        })
      })
    },
    ...mapActions(['saveStorage'])
  },
  components: {MonthlyPlan}
};
</script>

<style lang="less" scoped>
.monthly {
  height: 100%;
}
</style>