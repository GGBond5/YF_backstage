<template>
  <div class="purchase">
    <PurchaseTemplate @searchSubmit="submit" :adminRole="true" :tableData="tableData" :allData="allData">
    </PurchaseTemplate>
  </div>
</template>

<script>
import PurchaseTemplate from '../PurchaseTemplate.vue'
export default {
  data () {
    return {
      tableData: [],
      allData: []
    } 
  },
  created () {
    this.init()
  },
  methods: {
    init () {
      this.$http.fetchGet(`/project/getYearProjectListByAudit?type=1`).then(res => {
        this.tableData = res.data
        this.tableData.map && this.tableData.map((val, index) => {
          val.serialNumber = index + 1
          if (val.auditStatusName === '审核中') {
            val.operate = ['立即审核']
          } else if (val.auditStatusName === '审核通过'){
            val.operate = ['统一采购']
          } else {
            val.operate = ['查看详情']
          }
        })
      })
      this.$http.fetchGet(`/project/getYearProjectListByAudit?type=2`).then(res => {
        this.allData = res.data
        this.allData.map && this.allData.map((val, index) => {
          val.serialNumber = index + 1
          if (val.auditStatusName === '审核中') {
            val.operate = ['立即审核']
          } else if (val.auditStatusName === '审核通过'){
            val.operate = ['统一采购']
          } else {
            val.operate = ['查看详情']
          }
        })
      })
    },
    submit ({budgetCategory, etime, keywords, plantCode, projectStatus, projectType, stime}) {
      this.$http.fetchGet(`/project/getYearProjectListByAudit?budgetCode=${budgetCategory}&endDate=${etime}&name=${keywords}&plantId=${plantCode}&status=${projectStatus}&projectType=${projectType}&startDate=${stime}&type=2`).then(res => {
        this.allData = res.data
        this.allData && this.allData.map((val, index) => {
          val.serialNumber = index + 1
          if (val.auditStatusName === '审核中') {
            val.operate = ['立即审核']
          } else if (val.auditStatusName === '审核通过'){
            val.operate = ['统一采购']
          } else {
            val.operate = ['查看详情']
          }
        })
      })
    },
  },
  components: {PurchaseTemplate}
}
</script>

<style lang="less" scoped>
.purchase {
  height: 100%;
}
</style>