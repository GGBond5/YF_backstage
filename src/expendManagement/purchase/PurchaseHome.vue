<template>
  <div class="purchase">
    <PurchaseTemplate @searchSubmit="submit" @reInit="init" :tableData="tableData" :allData="allData">
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
      this.$http.fetchGet(`/project/getYearProjectList?type=1`).then(res => {
        if (res.code === 0) {
          this.tableData = res.data
          this.tableData && this.tableData.map((val, index) => {
            val.serialNumber = index + 1
            if (['待审核', '审核不通过'].includes(val.auditStatusName)) {
              val.operate = ['编辑', '删除']
            }else {
              val.operate = ['查看详情']
            }
          })
        }
      })
      this.$http.fetchGet(`/project/getYearProjectList?type=2`).then(res => {
        if (res.code === 0) {
          this.allData = res.data
          this.allData && this.allData.map((val, index) => {
            val.serialNumber = index + 1
            if (['待审核', '审核不通过'].includes(val.auditStatusName)) {
              val.operate = ['编辑', '删除']
            }else {
              val.operate = ['查看详情']
            }
          })
        }
      })
    },
    submit ({budgetCategory, etime, keywords, plantCode, projectStatus, projectType, stime}) {
      this.$http.fetchGet(`/project/getYearProjectList?budgetCode=${budgetCategory}&endDate=${etime}&name=${keywords}&plantId=${plantCode}&status=${projectStatus}&projectType=${projectType}&startDate=${stime}&type=2`).then(res => {
        this.allData = res.data
        this.allData && this.allData.map((val, index) => {
          val.serialNumber = index + 1
          if (['待审核', '审核不通过'].includes(val.auditStatusName)) {
            val.operate = ['编辑', '删除']
          }else {
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