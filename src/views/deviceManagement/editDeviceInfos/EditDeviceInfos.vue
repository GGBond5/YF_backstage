<template>
  <div class="editDeviceInfos">
    <div class="amend">
      <span v-for="(item, index) in operateType" :key="index"><el-button type="primary" :icon="item.icon">{{item.value}}</el-button></span>
    </div>
    <div class="deviceInfos">
      <el-table
        ref="multipleTable"
        :data="tableData"
        border
        style="width: 100%"
        :header-cell-style="{textAlign: 'center',backgroundColor:'rgba(228, 228, 228, 0.5)'}"
        :cell-style="{ textAlign: 'center' }"
        @selection-change="handleSelectionChange">
        <el-table-column
          type="selection"
          width="50">
        </el-table-column>
        <el-table-column
          prop="serialNumber"
          label="序号"
          width="100">
        </el-table-column>
        <el-table-column
          prop="name"
          label="设备类型名称"
          width="250">
        </el-table-column>
        <el-table-column
          prop="date"
          label="类型编码"
          width="250">
        </el-table-column>
        <el-table-column
          prop="name"
          label="上级设备类型"
          width="250">
        </el-table-column>
        <el-table-column
          prop="name"
          label="备注">
        </el-table-column>
        <el-table-column
          prop="address"
          label="操作"
          width="200">
          <template slot-scope="scope">
            <el-button @click="changeRow(scope.row)" type="text" size="small">修改</el-button>
            <el-button type="text" size="small">|</el-button>
            <el-button @click="deleteRow(scope.row)" type="text" size="small">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- dialog插槽 -->
    <slot></slot>
  </div>
</template>

<script>
export default {
  data () {
    return {
      operateType: [
        {
          value: '新增',
          icon: 'el-icon-folder-add'
        },
        {
          value: '修改',
          icon: 'el-icon-edit-outline'
        },
        {
          value: '删除',
          icon: 'el-icon-document-delete'
        },
      ],
      tableData: [{
        serialNumber: '01', 
        date: '2016-05-02',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄'
      }, {
        serialNumber: '02', 
        date: '2016-05-04',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1517 弄'
      }, {
        serialNumber: '03', 
        date: '2016-05-01',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1519 弄'
      }, {
        serialNumber: '04', 
        date: '2016-05-03',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1516 弄'
      }],
      multipleSelection: []    //被选中的数据
    };
  },
  methods: {
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    changeRow () {
      this.$emit("update:show", true);
    },
    deleteRow () {

    }
  }
}
</script>

<style lang="less" scoped>
.editDeviceInfos {
  flex: 1;
  margin-left: 10px;
  background-color: #fff;
  border-radius: 6px;
  overflow: hidden;
  .amend {
    span {
      margin-right: 10px;
    }
    /deep/ .el-button {
      padding: 10px;
    }
    /deep/ .el-button--primary {
      color: #aaa;
      background-color: #fff;
      border-color: #fff;
    }
    /deep/ .el-button--primary:hover {
      color: #409EFF;
    }
  }
  /deep/ .el-dialog__body {
    padding: 20px;
    border-top: 1px solid rgba(0, 0, 0, 0.2);
    p {
      display: flex;
      align-items: center;
      line-height: 50px;
      span:nth-of-type(1) {
        width: 100px;
      }
      span:nth-of-type(2) {
        flex: 1;
      }
      .el-select {
        width: 100%;
      }
      .el-input__suffix {
        right: -30px;
      }
    }
  }
  /deep/ .el-dialog__footer {
    text-align: center;
    .el-button {
      padding: 10px 30px;
    }
  }
}
</style>