<template>
  <div class="message-table">
    <el-table
      ref="multipleTable"
      :data="tableData"
      tooltip-effect="dark"
      style="width: 100%"
      border
      stripe
      @selection-change="handleSelectionChange"
    >
      <el-table-column
        v-for="(item, index) in tableHeadList"
        :key="index"
        :type="item.type"
        :width="item.width"
        :label="item.label"
        :prop="item.prop"
        align="center"
      ></el-table-column>
    </el-table>
  </div>
</template>

<script>
import { getMessageList } from "network/mainRuequest.js"

export default {
  data() {
    return {
      tableData: [],
      tableHeadList: [],
      multipleSelection: "",
      params: {
        rows: 10,
        page: 1
      }
    };
  },

  methods: {
    handleSelectionChange(val) {
      this.multipleSelection = val;
    }
  },
  created() {
    getMessageList(this.params)
      .then(res => {
        this.tableData = res.data.rows;
      })
      .catch(err => console.log(err));
  },
  mounted() {
    this.tableHeadList = this.$route.meta.tableHeadList;
  }
};
</script>

<style scoped lang="scss">
/deep/ .el-table__header tr,
/deep/ .el-table__header th {
  padding: 0;
  height: 35px;
  line-height: 35px;
}
/deep/ .el-table__body tr,
/deep/ .el-table__body td {
  padding: 0;
  height: 35px;
  line-height: 35px;
}
</style>