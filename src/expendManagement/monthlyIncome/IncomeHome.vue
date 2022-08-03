<template>
  <div class="monthly">
    <MonthlyPlan @functionality="incomeFunctionality" @newPlanClick="incomeNewPlanClick" @searchSubmit="submit" :tableData="tableData" :allData="allData" :newPlan="[true, '新建入账计划']">
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
      this.$http.fetchGet(`/plan/getBillList?type=1`).then(res => {
        this.tableData = res.data
        this.tableData && this.tableData.map((val, index) => {
          val.serialNumber = index + 1
          // 计划入账操作
          let incomeObj = this.actionMapping.find(row => {
            return row.progress === '年度入账计划'
          }) 
          let incomeInfo = incomeObj.auditStatus.find(par => {
            return par.state === val.statusName
          })
          val.operation = incomeInfo?.operation
        })
      })
      this.$http.fetchGet(`/plan/getBillList?type=2`).then(res => {
        this.allData = res.data
        this.allData && this.allData.map((val, index) => {
          val.serialNumber = index + 1
          // 计划入账操作
          let incomeObj = this.actionMapping.find(row => {
            return row.progress === '年度入账计划'
          }) 
          let incomeInfo = incomeObj.auditStatus.find(par => {
            return par.state === val.statusName
          })
          val.operation = incomeInfo?.operation
        })
      })
    },
    incomeNewPlanClick () {
      this.$router.push('/expendManagement/monthlyIncome/monthlyIncomeNewPlan')
    },
    incomeFunctionality (row, hash) {
      row.hash = hash
      this.saveStorage({key: 'monthlyPlan_details', val: row})
      if (row.operation[0] === '编辑') {
        this.$router.push('/expendManagement/monthlyIncome/monthlyIncomeNewPlan') 
      }else {
        this.$router.push('/expendManagement/monthlyIncome/monthlyIncomeNewRecord') 
      }
    },
    submit ({plantCode, projectStatus}) {
      this.$http.fetchGet(`/plan/getBillList?plantId=${plantCode}&status=${projectStatus}&type=2`).then(res => {
        this.allData = res.data
        this.allData && this.allData.map((val, index) => { 
          val.serialNumber = index + 1
          // 计划入账操作
          let incomeObj = this.actionMapping.find(row => {
            return row.progress === '年度入账计划'
          }) 
          let incomeInfo = incomeObj.auditStatus.find(par => {
            return par.state === val.statusName
          })
          val.operation = incomeInfo?.operation
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