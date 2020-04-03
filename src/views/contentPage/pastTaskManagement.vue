<template>
  <div>
    <div id="nav-bar" class="nav">
      <span class="title">位置：</span>
      <span class="name-parent">通信管理</span>
      <i class="el-icon-arrow-right"></i>
      <span class="name-parent">历史任务管理</span>
    </div>
    <div class="msgManagement-content">
      <div class="msgManagement-content-top" style="height: 50px; ">
        <div class="clear">
          <el-row class="row-toolBox">
            <el-button type="primary" plain size="medium" icon="el-icon-refresh" @click="refresh_HistoryTask()">刷新</el-button>
          </el-row>
        </div>
        <div class="clear">
          <el-row class="row-toolBox">
            <el-button type="danger" plain size="medium" icon="el-icon-delete" @click="delete_HistoryTask()">删除</el-button>
          </el-row>
        </div>
        <div class="clear">
          <el-row class="row-toolBox">
            <el-button type="danger" plain icon="el-icon-delete-solid" size="medium" @click="clear_HistoryTask()">清空</el-button>
          </el-row>
        </div>
        <div class="search-box-right" style="float: right;">
          <el-input placeholder="请输入用户名" style="margin-right:10px" v-model="value1" clearable></el-input>
          <el-select v-model="value2" clearable placeholder="请选择任务类型" style="margin-right:10px">
            <el-option
              v-for="item in chooseTaskType"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
          <div class="clock">
            <el-date-picker v-model="value3" type="datetime" placeholder="选择开始时间"></el-date-picker>
          </div>
          <div class="clock">
            <el-date-picker v-model="value4" type="datetime" placeholder="选择结束时间"></el-date-picker>
          </div>
          <el-button type="primary" icon="el-icon-search" circle @click="getHistoryTask()"></el-button>
        </div>

        <!-- 弹框 -->
        <el-dialog title="历史任务操作" :visible.sync="clearpasttaskVisible">
          <el-form label-width="110px">
            <el-form-item label="确定要清空吗？"></el-form-item>
          </el-form>
          <el-button type="primary" style="margin-left:10px;" @click="confirm_clearHistoryTask()">确定</el-button>
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
          <el-table-column type="selection" width="50"></el-table-column>
          <el-table-column prop="taskType" label="任务类型" fit></el-table-column>
          <el-table-column prop="startTime" label="开始时间" fit></el-table-column>
          <el-table-column prop="endTime" label="结束时间" fit></el-table-column>
          <el-table-column prop="taskName" label="用户名" fit></el-table-column>
          <el-table-column prop="taskContent" label="任务内容" width="240"></el-table-column>
          <el-table-column prop="taskDescription" label="任务描述" fit></el-table-column>
          <el-table-column prop="taskSender" label="发送方" fit></el-table-column>
          <el-table-column prop="taskReceiver" label="接收方" fit></el-table-column>
          <el-table-column prop="taskSendType" label="发送类型" fit></el-table-column>
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
import getAxios from "network/api";
import { getHistoryList } from "network/mainRuequest1";
import { delHistory } from "network/mainRuequest1";
import { clearHistory } from "network/mainRuequest1";

export default {
  inject: ["reload"],
  name: "nav-bar",
  data() {
    return {
      currPage: 1,
      pageSize: 8,
      value1: "", //发送者
      value2: "", //任务类型
      value3: "", // 开始时间
      value4: "", // 结束时间
      input: "",
      clearpasttaskVisible: false,
      refresh: true,
      total: 0,
      chooseTaskType: [
        {
          value: "101",
          label: "发送消息"
        },
        {
          value: "102",
          label: "接收消息"
        },
        {
          value: "103",
          label: "指挥机本机定位"
        },
        {
          value: "104",
          label: "通播"
        },
        {
          value: "105",
          label: "友邻位置"
        },
        {
          value: "106",
          label: "指令导航"
        },
        {
          value: "107",
          label: "路径规划"
        },
        {
          value: "108",
          label: "融合通信"
        },
        {
          value: "109",
          label: "监控短信"
        }
      ],
      tableData: [],
      multipleSelection: [], //选中行
      selectedID: "" //选中行艾滴
    };
  },
  created: function() {
    this.getHistoryTask();
  },
  methods: {
    handleSizeChange(val) {
      this.pageSize = val;
      this.getHistoryTask();
    },
    handleCurrentChange(val) {
      this.currPage = val;
      this.getHistoryTask();
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
      this.selectedID = "";
      this.multipleSelection.filter(item => {
        this.selectedID += item.taskId + ",";
      });
      this.selectedID = this.selectedID.slice(0, -1);
    },

    getHistoryTask() {
      let params = {
        rows: this.pageSize,
        page: this.currPage,
        queryName: this.value1,
        hisType: this.value2,
        statrTime: this.value3,
        endTime: this.value4
      };
      getHistoryList(params)
        .then(res => {
          this.total = res.data.records;
          this.tableData = res.data.rows;
          // this.value1 = "";
          // this.value2 = "";
          // this.value3 = "";
          // this.value4 = "";
        })
        .catch(err => console.log(err));
    },
    refresh_HistoryTask() {
      this.refresh = true ? this.reload() : "";
    },
    delete_HistoryTask() {
      if (this.$refs.multipleTable.selection.length == 0) {
        this.$message.error("请选择要删除的任务");
      }
      if (this.$refs.multipleTable.selection.length != 0) {
        // this.$message.success('删除成功')
        let params = {
          id: this.selectedID
        };
        delHistory(params).then(res => {
          if (res.data.success == false) {
            this.$message.error(res.data.message);
          } else {
            this.$message(res.data.message);
            this.getHistoryTask();
          }
        });
      }
    },
    clear_HistoryTask() {
      this.clearpasttaskVisible = true;
    },
    confirm_clearHistoryTask() {
      let params = {};
      clearHistory(params).then(res => {
        if(res.data.success == false){
           this.$message.error(res.data.message);          
        }
        else{
          this.$message.success(res.data.message);
          this.getHistoryTask();
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
  margin-left: 10px;
  padding-top: 10px;
}
.search-box-right .el-input__inner {
  margin-top: 8px;
}
.search-box-right .el-input {
  width: 150px;
  margin-right: 15px;
}
.search-box-right .el-select {
  width: 23%;
}
.search-box-right .clock {
  display: inline;
}
.msgManagement-content .msgManagement-content-top .clear {
  float: left;
}
.el-input--suffix .el-input__inner{
  padding-right: 0px !important ; 
}

@media screen and (max-width: 1290px) and (min-width: 0px) {
  .msgManagement-content .msgManagement-content-top .clear {
    width: 75px;
  }
}
</style>