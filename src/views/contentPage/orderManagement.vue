<template>
  <div>
    <div id="nav-bar" class="nav">
      <span class="title">位置：</span>
      <span class="name-parent">系统管理</span>
      <i class="el-icon-arrow-right"></i>
      <span class="name-parent">订单管理</span>
    </div>
    <div class="msgManagement-content">
      <div class="msgManagement-content-top" style="height: 50px; ">
        <div class="clear" style="width: 120px; float: left;">
          <el-row class="row-toolBox">
            <el-button type="primary" plain icon="el-icon-refresh" size="medium" @click="refreshFlag">刷新</el-button>
          </el-row>
        </div>
        <div class="search-box-right" style="float: right;">
          <el-input placeholder="请输入北斗卡号" v-model="value1" clearable @keydown.enter.native="getList"></el-input>
          <el-input placeholder="请输入订单号" v-model="value2" clearable @keydown.enter.native="getList"></el-input>
          <el-button type="primary" icon="el-icon-search" circle @click="getList()"></el-button>
        </div>
        <!-- <el-row>

        </el-row>-->
        <!-- <div class="clear" style="width: 100px; float: right;">
      <el-row class="row-toolBox">
        <el-button plain size="medium">清空</el-button>   
      </el-row>
        </div>-->
      </div>
      <div class="gridBox-table" style="width: 100%; margin: 15px auto;  ">
        <el-table :data="oderList" stripe style="width: 100%; font-size: 16px;">
          <el-table-column type="index" width="50"></el-table-column>
          <el-table-column prop="orderNum" label="订单号" fit></el-table-column>
          <el-table-column prop="cardNum" label="北斗卡号" fit></el-table-column>
          <el-table-column prop="balance" label="充值金额" fit></el-table-column>
          <el-table-column prop="investDate" label="充值时间" fit></el-table-column>
          <el-table-column prop="investTime" label="充值时长(年)" fit></el-table-column>
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
import getAxios from "network/api";
import { OrderList } from "network/mainRuequest";

export default {
  name: "nav-bar",
  data() {
    return {
      currPage: 1, //当前页数
      pageSize: 8, //一页几行
      input: "",
      total: 0, //总行数
      tableData: [
        {
          orderNum: "sd",
          cardNum: "er",
          Amount: "erqe",
          Time: "errq",
          lastTime: "rerer"
        },
        {
          orderNum: "sd",
          cardNum: "er",
          Amount: "erqe",
          Time: "errq",
          lastTime: "rerer"
        }
      ],
      oderList: [], //表格数据
      value1: "", //北斗卡号
      value2: "", //订单号
      refresh: true //刷新标识
    };
  },
  created: function() {
    this.getList();
  },
  methods: {
    handleSizeChange(val) {
      this.pageSize = val;
      this.getList();
    },
    handleCurrentChange(val) {
      this.currPage = val;
      this.getList();
    },
    refreshFlag() {
      this.refresh = true ? this.getList() : "";
    },
    getList() {
      let params = {
        queryCardNum: this.value1,
        queryOrderNum: this.value2,
        rows: this.pageSize,
        page: this.currPage
      };

      OrderList(params)
        .then(res => {
          this.oderList = res.data.rows;
          this.total = res.data.records;
          this.value1 = "";
          this.value2 = "";
        })
        .catch(err => console.log(err));
    }
  },
  computed: {}
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
  width: auto;
  margin-right: 20px;
  padding-top: 13px;

  //  深度
  // 深度
}
.search-box-right .el-input__inner {
  margin-top: 8px;
}
.el-input {
  width: 200px;
  margin-right: 15px;
}
</style>