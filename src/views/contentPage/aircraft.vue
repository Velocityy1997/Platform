<template>
  <div>
    <div id="nav-bar" class="nav">
      <span class="title">位置：</span>
      <span class="name-parent">系统管理</span>
      <i class="el-icon-arrow-right"></i>
      <span class="name-parent">指挥机管理</span>
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
              @click="getList();"
            >刷新</el-button>
            <el-button
              type="primary"
              plain
              icon="el-icon-circle-plus-outline"
              size="medium"
              @click="judgeAdd()"
            >新增</el-button>
            <el-button
              type="primary"
              plain
              icon="el-icon-edit"
              size="medium"
              @click="judgeedit()"
            >修改</el-button>
            <el-button
              type="danger"
              plain
              icon="el-icon-delete"
              size="medium"
              @click="delList();"
            >删除</el-button>
          </el-row>
        </div>
        <div class="search-box-right" style="float: right;">
          <el-input placeholder="请输入指挥机名称" v-model="input" clearable @keydown.enter.native="getList"></el-input>
          <el-button type="primary" icon="el-icon-search" circle @click="getList()"></el-button>
        </div>
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
          <el-table-column prop="name" label="指挥机名称" fit></el-table-column>
          <el-table-column prop="type" label="指挥机类型" fit></el-table-column>
          <el-table-column prop="cardNum" label="卡号" fit></el-table-column>
          <el-table-column prop="frequency" label="服务频度" fit></el-table-column>
          <el-table-column prop="txlevel" label="通信等级" fit></el-table-column>
          <el-table-column prop="status" label="服务状态" fit></el-table-column>
          <el-table-column prop="txlength" label="通信长度" fit></el-table-column>
          <el-table-column prop="brocastAdd" label="广播地址" fit></el-table-column>
          <el-table-column prop="areaName" label="所属区域" fit></el-table-column>
          <el-table-column prop="industryName" label="所属行业" fit></el-table-column>
          <el-table-column prop="remark" label="备注" fit></el-table-column>
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
          style="text-align: center;"
        ></el-pagination>
      </div>
    </div>
    <el-dialog
      title="指挥机管理操作"
      :visible.sync="dialogFormVisible"
      style="width:1000px;margin:0 auto;"
    >
      <el-form :model="form" :rules="rules" ref="form">
        <el-form-item label="用户名称" :label-width="formLabelWidth" prop="userName">
          <el-input v-model="form.userName" autocomplete="off" style="width:300px;" clearable></el-input>
        </el-form-item>
        <!-- <el-form-item label="指挥机类型" :label-width="formLabelWidth" prop="zhjType">
          <el-select v-model="form.zhjType">
            <el-option label="请选择" value></el-option>
            <el-option label="普通指挥机" value="0"></el-option>
            <el-option label="中心指挥机" value="1"></el-option>
          </el-select>
        </el-form-item>-->
        <el-form-item label="所属区域" :label-width="formLabelWidth"></el-form-item>
        <el-form-item label="省" :label-width="formLabelWidth" prop="province">
          <el-select v-model="form.province" @change="select2()">
            <el-option label="请选择" value></el-option>
            <el-option
              v-for="item in selectProvince"
              :label="item.areaName"
              :value="item.areaId"
              :key="item.areaId"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="市" :label-width="formLabelWidth" prop="city">
          <el-select v-model="form.city" @change="select3()">
            <el-option label="请选择" value></el-option>
            <el-option
              v-for="item in selectCity"
              :label="item.areaName"
              :value="item.areaId"
              :key="item.areaId"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="县" :label-width="formLabelWidth" prop="county">
          <el-select v-model="form.county">
            <el-option label="请选择" value></el-option>
            <el-option
              v-for="item in selectCounty"
              :label="item.areaName"
              :value="item.areaId"
              :key="item.areaId"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="卡号" :label-width="formLabelWidth" prop="cardNum">
          <el-input v-model="form.cardNum" autocomplete="off" style="width:300px;"></el-input>
        </el-form-item>
        <el-form-item label="所属行业" :label-width="formLabelWidth" prop="industry">
          <el-select v-model="form.industry" placeholder="请选择">
            <el-option
              v-for="item in selectIndustry"
              :label="item.industName"
              :value="item.industId"
              :key="item.industId"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="备注" :label-width="formLabelWidth">
          <el-input v-model="form.remarks" autocomplete="off" style="width:300px;"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="resetForm('form')">重置</el-button>
        <el-button type="primary" @click="handleOk('form')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import icon from "element-ui";
import { aircraftList } from "network/mainRuequest";
import { aircraftDel } from "network/mainRuequest";
import { aircraftAdd } from "network/mainRuequest";
import { aircraftEdit } from "network/mainRuequest";
import { aircraftselect1 } from "network/mainRuequest";
import { aircraftselect2 } from "network/mainRuequest";
import { aircraftselect3 } from "network/mainRuequest";
import { aircraftselect4 } from "network/mainRuequest";

export default {
  name: "nav-bar",
  data() {
    return {
      formLabelWidth: "120px",
      //操作弹框
      dialogTableVisible: false,
      dialogFormVisible: false,
      //分页
      currPage: 1,
      pageSize: 10,
      input: "",
      total: 0,

      tableData: [],
      //被选中行
      selectList: [],
      selectId: "",
      //表单
      form: {
        userName: "",
        zhjType: "",
        province: "",
        city: "",
        remarks: "",
        county: "",
        cardNum: "",
        industry: "",
        remarks: ""
      },
      //表单验证
      rules: {
        userName: [
          {
            pattern: /^([\u4e00-\u9fa5]{1,20}|[a-zA-Z\\.\\s]{1,20})$/,
            required: true,
            message: "请填写正确的用户名称",
            trigger: "blur"
          }
        ],
        zhjType: [
          { required: true, message: "请选择指挥机类型", trigger: "blur" }
        ],
        province: [{ required: true, message: "请选择省", trigger: "blur" }],
        cardNum: [
          {
            pattern: /^[0-9]*$/,
            required: true,
            message: "请输入正确的卡号",
            trigger: "blur"
          }
        ],
        industry: [
          { required: true, message: "请选择所属行业", trigger: "change,blur" }
        ]
      },
      //下拉列表
      selectProvince: [],
      selectCity: [],
      selectCounty: [],
      selectIndustry: [],
      //修改标识
      isEdit: false,
      //修改列表字段
      editName: "",
      editType: "",
      editProvince: "",
      editCity: "",
      editCounty: "",
      editIndustry: "",
      editRemarks: ""
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
    //选中行
    handleSelectionChange(val) {
      this.selectList = val;
      this.selectId = "";
      this.selectList.filter(item => {
        this.selectId += item.id + ",";
      });

      this.selectId = this.selectId.slice(0, -1);
    },
    //获取表格
    getList() {
      let params = {
        zhjName: this.input,
        rows: this.pageSize,
        page: this.currPage
      };

      aircraftList(params)
        .then(res => {
          this.tableData = res.data.rows;
          this.total = res.data.records;
          this.input = "";
        })
        .catch(err => console.log(err));
    },
    //列表删除
    delList() {
      let params = {
        id: this.selectId
      };
      aircraftDel(params).then(res => {
        if (res.data.success == false) {
          // this.$store.commit('open', res.data.message);
          this.$message.error(res.data.message);
        } else {
          this.$message.success(res.data.message);
          this.getList();
        }
      });
    },
    //列表添加
    addList() {
      let params = {
        name: this.form.userName,
        // zhjType: this.form.zhjType,
        province: this.form.province,
        city: this.form.city,
        county: this.form.county,
        cardNum: this.form.cardNum,
        industName: this.form.industry,
        remark: this.form.remarks
      };
      aircraftAdd(params).then(res => {
        if (res.data.success == false) {
          this.$message.error(res.data.message);
        } else {
          this.$message.success(res.data.message);
          this.getList();
        }
      });
    },
    //列表修改
    editList() {
      let params = {
        id: this.selectId,
        name: this.form.userName,
        // zhjType: this.form.zhjType,
        province: this.form.province,
        city: this.form.city,
        county: this.form.county,
        cardNum: this.form.cardNum,
        industName: this.form.industry,
        remark: this.form.remarks
      };
      aircraftEdit(params).then(res => {
        if (res.data.success == false) {
          this.$message.error(res.data.message);
        } else {
          this.$message.success(res.data.message);
          this.getList();
        }
      });
    },
    //判断是否为增加
    judgeAdd() {
      this.isEdit = false;
      this.dialogFormVisible = true;
      this.resetForm("form");
      this.select1();
      this.select4();
    },
    //判断是否为修改
    judgeedit() {
      this.isEdit = true;
      if (this.isEdit == true) {
        if (this.selectList.length != 1) {
          this.$message.error("请选择一项进行修改");
        } else {
          this.form.userName = this.selectList[0].name;
          this.form.zhjType = this.selectList[0].type;
          this.form.province = this.selectList[0].provinceId;
          this.form.city = this.selectList[0].cityId;
          this.form.county = this.selectList[0].zoneId;
          this.form.cardNum = this.selectList[0].cardNum;
          this.form.industry = this.selectList[0].industryName;
          this.form.remarks = this.selectList[0].remark;
          this.dialogFormVisible = true;
          this.select1();
          this.getCitySelect();
          this.getCountySelect();
          this.select4();
        }
      }
    },
    //下拉列表获取
    select1() {
      let params = {};
      aircraftselect1(params).then(res => {
        this.selectProvince = res.data.data;
      });
    },
    select2() {
      this.form.city = "";
      this.getCitySelect();
    },
    getCitySelect() {
      let params = {
        provinceId: this.form.province
      };
      aircraftselect2(params).then(res => {
        this.selectCity = res.data.data;
      });
    },
    select3() {
      this.form.county = "";
      this.getCountySelect();
    },
    getCountySelect() {
      let params = {
        cityId: this.form.city
      };
      aircraftselect3(params).then(res => {
        this.selectCounty = res.data.data;
      });
    },
    select4() {
      let params = {};
      aircraftselect4(params).then(res => {
        if (res.data.success == false) {
          this.$message.error("数据获取失败");
        } else {
          this.selectIndustry = res.data;
        }
      });
    },
    //表单提交验证
    handleOk(formName) {
      var that = this;
      this.$refs[formName].validate((valid, object) => {
        // console.log('-----------', this.form);
        if (valid) {
          that.dialogFormVisible = false;
          if (that.isEdit) {
            that.editList();
          } else {
            that.addList();
          }

          that.isEdit = false;
        } else {
          that.$message.error("请完善添加信息");
          that.dialogFormVisible = true;
          return false;
        }
      });
    },
    //表单重置
    resetForm(formName) {
      let form = this.form;
      Object.keys(form).forEach(function(key) {
        form[key] = "";
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
  margin-left: 20px;
}
.search-box-right {
  width: 255px;
  margin-left: 20px;
  padding-top: 10px;
}
.search-box-right .el-input__inner {
  margin-top: 8px;
}
.el-input {
  width: 180px;
  margin-right: 15px;
}
</style>