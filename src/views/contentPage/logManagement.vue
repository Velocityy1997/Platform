<template>
  <div>
    <div id="nav-bar" class="nav">
      <span class="title">位置：</span>
      <span class="name-parent">系统管理</span>
      <i class="el-icon-arrow-right"></i>
      <span class="name-parent">日志管理</span>
    </div>
    <div class="msgManagement-content">
      <div class="msgManagement-content-top" style="height: 50px; ">
        <div class="clear" style="float: left;">
          <el-row class="row-toolBox">
            <el-button type="primary" plain icon="el-icon-refresh" size="medium" @click="getlogMess()">刷新</el-button>
            <el-button type="danger" plain icon="el-icon-delete" size="medium" @click="delList()" v-show="admin==1">删除</el-button>
            <el-button type="danger" plain icon="el-icon-delete-solid" size="medium" @click="clearList()" v-show="admin==1">清空</el-button>
          </el-row>
        </div>
        <!-- <div class="search-box-right" style="float: left;">
          <el-input placeholder="请输入内容" v-model="input">
            <i slot="suffix" class="el-input__icon el-icon-search"></i>
          </el-input>
        </div>-->
        <!-- <div class="clear" style="width: 100px; float: right;">
          <el-row class="row-toolBox">
            <el-button plain size="medium">清空</el-button>
          </el-row>
        </div> -->
      </div>

      <div class="gridBox-table" style="width: 100%; margin: 15px auto;  ">
        <el-table
          ref="multipleTable"
          :data="tableData"
          stripe
          style="width: 100%; font-size: 16px;"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="index" width="50"></el-table-column>
          <el-table-column type="selection" width="50"></el-table-column>
          <el-table-column prop="userName" label="操作人" fit></el-table-column>
          <el-table-column prop="logType" label="操作类型" fit></el-table-column>
          <el-table-column prop="content" label="操作内容" fit></el-table-column>
          <el-table-column prop="result" label="操作结果" fit></el-table-column>
          <el-table-column prop="logTime" label="操作时间" fit></el-table-column>
          <el-table-column prop="logId" label="用户IP" fit></el-table-column>
        </el-table>
      </div>

      <div class="block" style="margin-top: 5px; margin-bottom: 5px;">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page.sync="currPage"
          :page-sizes="[5, 8, 10, 20]"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
          style="text-align: center;">
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import icon from "element-ui";
import { logMessList } from "network/mainRuequest";
import { logMessDel } from "network/mainRuequest";
import { logMessClear } from "network/mainRuequest";

export default {
  name: "nav-bar",
  data() {
    return {
      //获取登录人
      admin:"",
      //分页
      currPage: 1,
      pageSize: 5,
      input: "",
      total:0,
       //被选中行
      selectList: [],
      selectId: "",
      tableData: [
        {
          Name: "333",
          Type: "fdf",
          Content: "dfew",
          Result: "dfwe",
          Time: "efsdfd",
          userIP: "dffe"
        },
        {
          Name: "333",
          Type: "fdf",
          Content: "dfew",
          Result: "dfwe",
          Time: "efsdfd",
          userIP: "dffe"
        }
      ],
      multipleSelection: []
    };
  },
  created: function() {
    this.getlogMess();
  },
  mounted:function(){
    this.admin=this.$store.state.userType;
  },
  methods: {
    handleSizeChange(val) {
      this.pageSize = val;
      this.getlogMess();
    },
    handleCurrentChange(val) {
      this.currPage = val;
      this.getlogMess();
    },
    //选中行
    handleSelectionChange(val) {
      this.selectList = val;
      this.selectId = "";
      this.selectList.filter(item => {
        this.selectId += item.logId + ",";
      });

      this.selectId = this.selectId.slice(0, -1);
    },
    //获取列表
    getlogMess() {
      let params = {
        rows: this.pageSize,
        page: this.currPage
      };

      logMessList(params)
        .then(res => {
          this.tableData = res.data.rows;
          this.total = res.data.records;
        })
        .catch(err => console.log(err));
    },
    //列表删除
    delList() {
      let params = {
       id: this.selectId
      };
      logMessDel(params).then(res => {
        if (res.data.success == false) {
          // this.$store.commit('open', res.data.message);
          this.$message.error(res.data.message);
        } else {
          this.$message.success(res.data.message);
          this.getlogMess();
        }
      });
    },
    //列表清除
    clearList() {
      let params = {};
      logMessClear(params).then(res => {
        if (res.data.success == false) {
          // this.$store.commit('open', res.data.message);
          this.$message.error(res.data.message);
        } else {
          this.$message.success(res.data.message);
          this.getlogMess();
        }
      });
    },
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
  width: 180px;
  margin-left: 20px;
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
</style>