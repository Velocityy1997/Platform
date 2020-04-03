<template>
  <div>
    <div id="nav-bar" class="nav">
      <span class="title">位置：</span>
      <span class="name-parent">通信管理</span>
      <i class="el-icon-arrow-right"></i>
      <span class="name-parent">黑名单管理</span>
    </div>
    <div class="msgManagement-content">
      <div class="msgManagement-content-top" style="height: 50px; ">
        <div class="clear" style="float: left;">
          <el-row class="row-toolBox">
            <el-button
              type="primary"
              plain
              icon="el-icon-refresh"
              size="medium"
              @click="refresh_blackList()"
            >刷新</el-button>
            <el-button
              type="primary"
              plain
              icon="el-icon-circle-plus-outline"
              size="medium"
              @click="add_blackList()"
            >新增</el-button>
            <el-button
              type="primary"
              plain
              icon="el-icon-edit"
              size="medium"
              @click="edit_blackList()"
            >修改</el-button>
            <el-button
              type="danger"
              plain
              icon="el-icon-delete"
              size="medium"
              @click="delete_blackList()"
            >删除</el-button>
          </el-row>
        </div>
        <div class="search-box-right" style="float: right;">
          <el-input placeholder="请输入北斗卡卡号" v-model="input" @keydown.enter.native="getblackList">
            <!-- <i slot="suffix" class="el-input__icon el-icon-search" @click="getblackList()"></i> -->
          </el-input>
          <el-button type="primary" icon="el-icon-search" circle @click="getblackList()"></el-button>
        </div>
      </div>
      <!-- 弹框 -->

      <el-dialog title="新增黑名单操作" :visible.sync="addblackListVisible" :width="width">
        <el-form label-width="80px">
          <el-form-item label="卡号">
            <el-input v-model="addblackListNum" style="width: 80%; "></el-input>
          </el-form-item>
          <el-form-item label="备注">
            <el-input v-model="addblackListRemark" style="width: 80%; "></el-input>
          </el-form-item>
        </el-form>
        <el-button type="primary" style="margin-left:130px;" @click="confirm_addblackList()">确定</el-button>
      </el-dialog>
      <el-dialog title="修改黑名单操作" :visible.sync="editblackListVisible" :width="width">
        <el-form label-width="80px">
          <el-form-item label="卡号">
            <el-input v-model="editblackListNum" style="width: 80%; "></el-input>
          </el-form-item>
          <el-form-item label="备注">
            <el-input v-model="editblackListRemark" style="width: 80%; "></el-input>
          </el-form-item>
        </el-form>
        <el-button type="primary" style="margin-left:130px;" @click="confirm_editblackList()">确定</el-button>
      </el-dialog>

      <div class="gridBox-table" style="width: 100%; margin: 15px auto;  ">
        <el-table
          ref="multipleTable"
          :data="tableData"
          stripe
          style="width: 100%; font-size: 16px;"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" width="50"></el-table-column>
          <el-table-column prop="blackSimId" label="北斗卡号" fit></el-table-column>
          <el-table-column prop="creatTime" label="时间" fit></el-table-column>
          <el-table-column prop="remark" label="备注" fit></el-table-column>
        </el-table>
      </div>

      <div class="block" style="margin-top: 5px; margin-bottom: 5px;">
        <el-pagination
          layout="total, sizes, prev, pager, next, jumper"
          :current-page.sync="currPage"
          :page-size="pageSize"
          :page-sizes="[5, 8, 10, 20]"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :total="total"
          style="text-align: center;"
        ></el-pagination>
      </div>
    </div>
  </div>
</template>

<script >
import icon from "element-ui";
import getAxios from "network/api";
import { getblackListTable } from "network/mainRuequest1";
import { addblackList } from "network/mainRuequest1";
import { editblackList } from "network/mainRuequest1";
import { delblackList } from "network/mainRuequest1";

export default {
  inject: ["reload"],
  name: "nav-bar",
  props:{
    width:{
            type: String,
            default: '38%'
          }
  },
  data() {
    return {
      currPage: 1,
      pageSize: 8,
      input: "",
      total: 0,
      addblackListVisible: false,
      editblackListVisible: false,
      addblackListNum: "",
      editblackListNum: "",
      addblackListRemark: "",
      editblackListRemark: "",

      tableData: [],
      multipleSelection: [],
      selectedID: "",
      selectedCardNum: "",
      selectedRemark: ""
    };
  },
  created: function() {
    this.getblackList();
  },
  methods: {
    handleSizeChange(val) {
      this.pageSize = val;
      this.getblackList();
    },
    handleCurrentChange(val) {
      this.currPage = val;
      this.getblackList();
    },
    handleSelectionChange(val) {
      //被选中项的艾滴
      this.multipleSelection = val;
      this.selectedID = "";
      this.multipleSelection.filter(item => {
        this.selectedID += item.blackId + ",";
      });
      this.selectedID = this.selectedID.slice(0, -1);
      //被选中项的卡号
      this.selectedCardNum = "";
      this.multipleSelection.filter(item => {
        this.selectedCardNum += item.blackSimId;
      });
      //被选中项的备注
      this.selectedRemark = "";
      this.multipleSelection.filter(item => {
        this.selectedRemark += item.remark;
      });
    },
    getblackList() {
      let params = {
        rows: this.pageSize,
        page: this.currPage,
        queryCardNum: this.input
      };
      getblackListTable(params).then(res => {
        this.total = res.data.records;
        this.tableData = res.data.rows;
        this.input = "";
      });
    },

    refresh_blackList() {
      this.refresh = true ? this.reload() : "";
    },
    add_blackList() {
      this.addblackListVisible = true;
      this.addblackListNum = "";
      this.addblackListRemark = "";
    },
    edit_blackList() {
      if (this.$refs.multipleTable.selection.length == 0) {
        this.$message.error("请选择修改的记录");
      }
      if (this.$refs.multipleTable.selection.length > 1) {
        this.$message.error("只可修改一次记录");
      }
      if (this.$refs.multipleTable.selection.length == 1) {
        this.editblackListVisible = true;
        this.editblackListNum = this.selectedCardNum;
        this.editblackListRemark = this.selectedRemark;
      }
    },
    delete_blackList() {
      if (this.$refs.multipleTable.selection.length == 0) {
        this.$message.error("请选择要删除的记录");
      }
      if (this.$refs.multipleTable.selection.length != 0) {
        let params = {
          id: this.selectedID
        };
        delblackList(params).then(res => {
          if (res.data.success == false) {
            this.$message.error(res.data.message);
          } else {
            this.$message.success(res.data.message);
            this.getblackList();
          }
        });
      }
    },
    confirm_editblackList() {
       var numReg = /^[0-9]+$/
      var numRe = new RegExp(numReg)
      if (!numRe.test(this.editblackListNum)) {
      this.$message({
         type: 'error',
         message: '请输入数字 ',
         duration: 10000,
         showClose: true,
  })
  return false
}
  else{
  let params = {
        id: this.selectedID,
        simId: this.editblackListNum,
        remark: this.editblackListRemark
      };
      editblackList(params).then(res => {
        if (res.data.success == false) {
          this.$message.error(res.data.message);
        } else {
          this.$message.success(res.data.message);
          this.getblackList();
        }
      });
      this.editblackListVisible = false;
}
      
    },
    confirm_addblackList() {
      var numReg = /^[0-9]+$/
      var numRe = new RegExp(numReg)
      if (!numRe.test(this.addblackListNum)) {
      this.$message({
         type: 'error',
         message: '请输入数字 ',
         duration: 10000,
         showClose: true,
  })
  return false
}
  else{
      let params = {
        id: "",
        simId: this.addblackListNum,
        remark: this.addblackListRemark
      };
      addblackList(params).then(res => {
        if (res.data.success == false) {
          this.$message.error(res.data.message);
        } else {
          this.$message.success(res.data.message);
          this.getblackList();
        }
      });
      this.addblackListVisible = false;
}

      
    }
  }
};
</script>


<style lang='scss' scoped>
.nav {
  width: 100%;
  height: 100%;
  background: #e1eef3;
  font-size: 17px;
  color: #001b24;
  line-height: 50px;
  padding-left: 15px;
}
.title {
  font-weight: bold;
}
.msgManagement-content {
  height: 80%;
  padding: 10px;
}
.el-table__header tr,
.el-table__header th {
  padding: 0;
  height: 36px;
}
.el-table__body tr,
.el-table__body td {
  padding: 0;
  height: 36px;
}
.el-tabs__header {
  margin: 0px 0px 0px;
}
.row-toolBox {
  margin-top: 15px;
  margin-left: 20px;
}
.search-box-right {
  margin-right: 20px;
  padding-top: 10px;

  //  深度
  .el-input__inner {
    height: 26px;
    line-height: 26px;
    border-radius: 25px;
  }
  .el-button{
      float: right;

    }
  .el-input{
      width: 80%;
    }
}
.search-box-right .el-input__inner {
  margin-top: 8px;
}
.el-input {
  width: 180px;
  margin-right: 5px;
}
</style>