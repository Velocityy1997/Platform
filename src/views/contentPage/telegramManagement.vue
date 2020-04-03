<template>
  <div>
    <div id="nav-bar" class="nav">
      <span class="title">位置：</span>
      <span class="name-parent">通信管理</span>
      <i class="el-icon-arrow-right"></i>
      <span class="name-parent">预置电文管理</span>
    </div>
    <div class="msgManagement-content">
      <div class="msgManagement-content-top" style="height: 50px; ">
        <div class="clear" style="float: left;">
          <el-row class="row-toolBox">
            <el-button type="primary" plain icon="el-icon-refresh" size="medium" @click="refresh_telegram()">刷新</el-button>
            <el-button type="primary" plain icon="el-icon-circle-plus-outline" size="medium" @click="add_telegram()">新增</el-button>
            <el-button type="primary" plain icon="el-icon-edit" size="medium" @click="edit_telegram()">修改</el-button>
            <el-button type="danger"  plain icon="el-icon-delete" size="medium" @click="delete_telegram()">删除</el-button>
          </el-row>
        </div>
        <div class="search-box-right" style="float: right;">
          <el-input placeholder="请输入预置电文内容" v-model="input" @keydown.enter.native="getpreMessage"></el-input>
            <!-- <i slot="suffix" class="el-input__icon el-icon-search" @click="getpreMessage()"></i> -->
          <el-button type="primary" icon="el-icon-search" circle @click="getpreMessage()"></el-button>        
        </div>
      </div>
      <!-- 弹框 -->
      <el-dialog title="新增电文操作" :visible.sync="addtelegramVisible">
        <el-form label-width="80px">
          <el-form-item label="内容">
            <el-input v-model="addtelegramContent" style="width: 80%; "></el-input>
          </el-form-item>
        </el-form>
        <el-button type="primary" style="margin-left:130px;" @click="confirm_addtelegram()">确定</el-button>
      </el-dialog>
      <el-dialog title="修改电文操作" :visible.sync="edittelegramVisible">
        <el-form label-width="80px">
          <el-form-item label="内容">
            <el-input v-model="edittelegramContent" style="width: 80%; "></el-input>
          </el-form-item>
        </el-form>
        <el-button type="primary" style="margin-left:130px;" @click="confirm_edittelegram()">确定</el-button>
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
          <el-table-column prop="preContent" label="内容" fit></el-table-column>
          <el-table-column prop="preTime" label="时间" fit></el-table-column>
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

<script>
import icon from "element-ui";
import { log } from "util";
import getAxios from "network/api";
import { getpreMessageList } from "network/mainRuequest1";
import { addpreMessage } from "network/mainRuequest1";
import { editpreMessage } from "network/mainRuequest1";
import { delpreMessage } from "network/mainRuequest1";

export default {
  inject: ["reload"],
  name: "nav-bar",
  data() {
    return {
      currPage: 1,
      pageSize: 8,
      total: 0,
      input: "",
      addtelegramVisible: false,
      edittelegramVisible: false,
      addtelegramContent: "",
      edittelegramContent: "",
      refresh: true,

      tableData: [],
      multipleSelection: [],
      selectedID: "",
      selectedText: ""
    };
  },
  created: function() {
    this.getpreMessage();
  },
  methods: {
    handleSizeChange(val) {
      this.pageSize = val;
      this.getpreMessage();
    },
    handleCurrentChange(val) {
      this.currPage = val;
      this.getpreMessage();
    },
    handleSelectionChange(val) {
      //获取被选中项的艾滴
      this.multipleSelection = val;
      this.selectedID = "";
      this.multipleSelection.filter(item => {
        this.selectedID += item.preId + ",";
      });
      this.selectedID = this.selectedID.slice(0, -1);
      //获取被选中项的文本
      this.selectedText = "";
      this.multipleSelection.filter(item => {
        this.selectedText = item.preContent;
      });
    },
    getpreMessage() {
      let params = {
        rows: this.pageSize,
        page: this.currPage,
        queryContent: this.input
      };
      getpreMessageList(params).then(res => {
        this.total = res.data.records;
        this.tableData = res.data.rows;
        this.input = "";
      });
    },
    refresh_telegram() {
      this.refresh = true ? this.reload() : "";
    },
    add_telegram() {
      this.addtelegramVisible = true;
      this.addtelegramContent = "";
    },
    edit_telegram() {
      if (this.$refs.multipleTable.selection.length == 0) {
        this.$message.error("请选择修改的记录");
      }
      if (this.$refs.multipleTable.selection.length > 1) {
        this.$message.error("只可修改一次记录");
      }
      if (this.$refs.multipleTable.selection.length == 1) {
        this.edittelegramVisible = true;
        this.edittelegramContent = this.selectedText;
      }
    },
    delete_telegram() {
      if (this.$refs.multipleTable.selection.length == 0) {
        this.$message.error("请选择要删除的记录");
      }
      if (this.$refs.multipleTable.selection.length != 0) {
        let params = {
          id: this.selectedID
        };
        delpreMessage(params).then(res => {
          if (res.data.success == false) {
            this.$message.error(res.data.message);
          } else {
            this.$message(res.data.message);
            this.getpreMessage();
          }
        });
      }
    },
    confirm_edittelegram() {
      let params = {
        id: this.selectedID,
        content: this.edittelegramContent
      };
      editpreMessage(params).then(res => {
        if (res.data.success == false) {
          this.$message.error(res.data.message);
        } else {
          this.$message.success(res.data.message);
          this.getpreMessage();
        }
      });
      this.edittelegramVisible = false;
    },
    confirm_addtelegram() {
      let params = {
        content: this.addtelegramContent,
        id: ""
      };
      addpreMessage(params).then(res => {
        if (res.data.success == false) {
          this.$message.error(res.data.message);
        } else {
          this.$message.success(res.data.message);
          this.getpreMessage();
        }
      });
      this.addtelegramVisible = false;
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
  // 深度
  .el-input__icon {
    margin-top: 5px;
    line-height: 26px;
  }
}
.search-box-right .el-input__inner {
  margin-top: 8px;
}
.el-input{
  width: 180px;
}
</style>