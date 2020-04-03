<template>
  <div>
    <div id="nav-bar" class="nav">
      <span class="title">位置：</span>
      <span class="name-parent">通信管理</span>
      <i class="el-icon-arrow-right"></i>
      <span class="name-parent">短信管理</span>
    </div>
    <div class="msgManagement-content">
      <div class="msgManagement-content-top" style="height: 50px; ">
        <div class="clear">
          <el-row class="row-toolBox">
            <el-button
              type="primary"
              plain
              icon="el-icon-refresh"
              size="medium"
              @click="refresh_msg()"
            >刷新</el-button>
          </el-row>
        </div>
        <div class="clear">
          <el-row class="row-toolBox">
            <el-button
              type="danger"
              plain
              icon="el-icon-delete"
              size="medium"
              @click="delete_msg()"
            >删除</el-button>
          </el-row>
        </div>
        <div class="clear">
          <el-row class="row-toolBox">
            <el-button
              type="danger"
              plain
              icon="el-icon-delete-solid"
              size="medium"
              @click="clear_msg()"
            >清空</el-button>
          </el-row>
        </div>
        <div class="search-box-right" style="float: right;">
          <el-form :inline="true" ref="ruleForm" :model="sendMsg" :rules="rules">
            <el-form-item prop="value1">
              <el-input
                placeholder="请输入发送者"
                style="margin-right:5px"
                v-model="sendMsg.value1"
                clearable
              ></el-input>
            </el-form-item>
            <el-form-item prop="value2">
              <el-input
                placeholder="请输入接收者"
                style="margin-right:5px"
                v-model="sendMsg.value2"
                clearable
                @keydown.enter.native="getMsgcontent"
              ></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" icon="el-icon-search" circle @click="valiDate()"></el-button>
            </el-form-item>
          </el-form>
        </div>

        <!-- 弹框 -->
        <el-dialog title="短信操作" :visible.sync="clearmsgVisible" style="width: 1000px; margin: auto;">
          <el-form label-width="110px">
            <el-form-item label="确定要清空吗？"></el-form-item>
          </el-form>
          <el-button type="primary" style="margin-left:10px;" @click="confirm_clearmsg()">确定</el-button>
        </el-dialog>
      </div>

      <div class="gridBox-table" style="width: 100%; margin: 15px auto;  ">
        <el-table
          ref="multipleTable"
          :data="tableData"
          stripe
          style="width: 100%; font-size: 16px;"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" width="100"></el-table-column>
          <el-table-column prop="mesCreateTime" label="时间" fit></el-table-column>
          <el-table-column prop="mesSender" label="发送方" fit></el-table-column>
          <el-table-column prop="mesReceiver" label="接收方" fit></el-table-column>
          <el-table-column prop="mesContent" label="内容" width="400"></el-table-column>
          <el-table-column prop="mesType" label="类型" fit></el-table-column>
        </el-table>
      </div>

      <div class="block" style="margin-top: 5px; margin-bottom: 5px;">
        <el-pagination
          layout="total, sizes, prev, pager, next, jumper"
          :current-page.sync="currPage"
          :page-sizes="[5, 8, 10, 20]"
          :page-size="pageSize"
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
import getAxios from "network/api";
import { getMessageList } from "network/mainRuequest1";
import { deleteMessage } from "network/mainRuequest1";
import { clearMessage } from "network/mainRuequest1";

export default {
  inject: ["reload"],
  name: "nav-bar",
  data() {
    return {
      currPage: 1,
      pageSize: 8,
      // 校验规则
      rules: {
        value1: [{ required: true, message: "请输入活动名称", trigger: "blur" }],
        value2: [{ required: true, message: "请输入活动名称", trigger: "blur" }]
      },
      sendMsg: {
        value1: "", //发送者
        value2: "" //接收者
      },

      clearmsgVisible: false,
      total: 0,
      refresh: true,
      mesId: "",

      tableData: [],
      multipleSelection: [],
      selectedID: ""
    };
  },
  mounted: function() {
    this.getMsgcontent();
  },
  methods: {
    handleSizeChange(val) {
      this.pageSize = val;
      this.getMsgcontent();
    },
    handleCurrentChange(val) {
      this.currPage = val;
      this.getMsgcontent();
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
      this.selectedID = "";
      this.multipleSelection.filter(item => {
        this.selectedID += item.mesId + ",";
      });
      this.selectedID = this.selectedID.slice(0, -1);
    },
    refresh_msg() {
      this.refresh = true ? this.reload() : "";
    },
    valiDate() {
      let _this = this;
      this.$refs["ruleForm"].validate(valid => {
        if (valid) {
         _this.getMsgcontent();
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    getMsgcontent() {
      let params = {
        rows: this.pageSize,
        page: this.currPage,
        sender: this.sendMsg.value1,
        reciver: this.sendMsg.value2
      };
      getMessageList(params)
        .then(res => {
          this.total = res.data.records;
          this.tableData = res.data.rows;
          // this.sendMsg.value1 = "";
          // this.sendMsg.value2 = "";
        })
        .catch(err => console.log(err));
    },
    delete_msg() {
      if (this.$refs.multipleTable.selection.length == 0) {
        this.$message.error("请选择要删除的短信");
      }
      if (this.$refs.multipleTable.selection.length != 0) {
        let params = {
          id: this.selectedID
        };
        deleteMessage(params).then(res => {
          if (res.data.success == false) {
            this.$message.error(res.data.message);
          } else {
            this.$message.success(res.data.message);
            this.getMsgcontent();
          }
        });
      }
    },
    clear_msg() {
      this.clearmsgVisible = true;
    },
    confirm_clearmsg() {
      let params = {};
      clearMessage(params).then(res => {
        if(res.data.success == false){
           this.$message.error(res.data.message);
        }
        else{
          this.$message.success(res.data.message);
          this.getMsgcontent();
        }
        
      });
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
  margin-left: 10px;
}
.search-box-right {
  width: 520px;
  margin-left: 10px;
  padding-top: 10px;
}
.search-box-right .el-input__inner {
  margin-top: 8px;
}
.search-box-right .el-input {
  width: 90%;
}
.msgManagement-content .msgManagement-content-top .clear {
  float: left;
}
@media screen and (max-width: 990px) and (min-width: 0px) {
  .msgManagement-content .msgManagement-content-top .clear {
    width: 75px;
  }
}
</style>