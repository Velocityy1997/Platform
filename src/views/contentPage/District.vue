<template>
  <div>
    <div id="nav-bar" class="nav">
      <span class="title">位置：</span>
      <span class="name-parent">系统管理</span>
      <i class="el-icon-arrow-right"></i>
      <span class="name-parent">区域管理</span>
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
            <el-button type="danger" plain icon="el-icon-delete" size="medium" @click="delList()">删除</el-button>
          </el-row>
        </div>
        <div class="search-box-right" style="float: right;">
          <el-input placeholder="请输入所属区域" v-model="input" clearable @keydown.enter.native="getList"></el-input>
          <el-button type="primary" icon="el-icon-search" circle @click="getList()"></el-button>
        </div>
        <!-- <div class="clear" style="width: 100px; float: right;">
          <el-row class="row-toolBox">
            <el-button plain size="medium">清空</el-button>
          </el-row>
        </div>-->
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
          <el-table-column prop="areaName" label="区域名称" fit></el-table-column>
          <el-table-column prop="parentName" label="上级区域" fit></el-table-column>
          <el-table-column prop="remark" label="备注" fit></el-table-column>
        </el-table>
      </div>

      <div class="block" style="margin-top: 5px; margin-bottom: 5px;">
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
    </div>
    <el-dialog title="区域管理操作" :visible.sync="dialogFormVisible" style="width:1000px;margin:0 auto;">
      <el-form :model="form" :rules="rules" ref="form">
        <el-form-item label="区域名称" :label-width="formLabelWidth" prop="areaName">
          <el-input v-model="form.areaName" autocomplete="off" style="width:300px;" clearable></el-input>
        </el-form-item>
        <el-form-item label="上级区域" :label-width="formLabelWidth"></el-form-item>
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
          <el-select v-model="form.city">
            <el-option label="请选择" value></el-option>
            <el-option
              v-for="item in selectCity"
              :label="item.areaName"
              :value="item.areaId"
              :key="item.areaId"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="备注" :label-width="formLabelWidth" prop="remarks">
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
import { districtList } from "network/mainRuequest";
import { districtdel } from "network/mainRuequest";
import { districtadd } from "network/mainRuequest";
import { districtedit } from "network/mainRuequest";
import { districtselect3 } from "network/mainRuequest";
import { districtselect1 } from "network/mainRuequest";
import { districtselect2 } from "network/mainRuequest";
import { districtselect4 } from "network/mainRuequest";

// import {open} from "common/util";
export default {
  name: "nav-bar",
  data() {
    return {
      currPage: 1,
      pageSize: 10,
      input: "",
      total: 0,
      //表格数据
      tableData: [
        {
          Name: "鄠邑县",
          Superior: "西安市",
          Remarks: "石油大学新校区"
        },
        {
          Name: "长安县",
          Superior: "西安市",
          Remarks: "电子科大新校区"
        }
      ],
      //被选中行
      selectList: [],
      selectId: "",
      //操作弹框
      dialogTableVisible: false,
      dialogFormVisible: false,
      //表单
      form: {
        areaName: "",
        province: "",
        city: "",
        remarks: ""
      },
      formLabelWidth: "120px",
      //表单验证
      rules: {
        areaName: [
          { required: false, message: "请填写所属区域", trigger: "blur" }
        ],
        province: [{ required: false, message: "请选择省", trigger: "blur" }],
        remarks: [{}]
      },
      //修改标识
      isEdit: false,
      //下拉列表
      selectProvince: [],
      selectCity: []
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
    // handleSelectionChange(val) {
    //   this.multipleSelection = val;
    // },
    //获取表格
    getList() {
      let params = {
        queryArea: this.input,
        rows: this.pageSize,
        page: this.currPage
      };

      districtList(params)
        .then(res => {
          this.tableData = res.data.rows;
          this.total = res.data.records;
          this.input = "";
        })
        .catch(err => console.log(err));
    },
    //保存选中结果
    handleSelectionChange(val) {
      this.selectList = val;
      this.selectId = "";
      this.selectList.filter(item => {
        this.selectId += item.areaId + ",";
      });

      this.selectId = this.selectId.slice(0, -1);
    },
    //列表删除
    delList() {
      let params = {
        id: this.selectId
      };
      districtdel(params).then(res => {
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
      if (this.form.province == "") {
        let params = {
          areaName: this.form.areaName,
          provinceId: "0",
          cityId: this.form.city,
          remark: this.form.remarks
        };
        districtadd(params).then(res => {
          if (res.data.success == false) {
            this.$message.error(res.data.message);
          } else {
            this.$message.success(res.data.message);
            this.getList();
          }
        });
      } else {
        let params = {
          areaName: this.form.areaName,
          provinceId: this.form.province,
          cityId: this.form.city,
          remark: this.form.remarks
        };
        districtadd(params).then(res => {
          if (res.data.success == false) {
            this.$message.error(res.data.message);
          } else {
            this.$message.success(res.data.message);
            this.getList();
          }
        });
      }
    },
    //列表修改
    editList() {
      let params = {
        areaId: this.selectId,
        areaName: this.form.areaName,
        provinceId: this.form.province,
        cityId: this.form.city,
        remark: this.form.remarks
      };
      districtedit(params).then(res => {
        if (res.data.success == false) {
          this.$message.error(res.data.message);
        } else {
          this.$message.success(res.data.message);
          this.getList();
        }
      });
    },
    //判断是否为修改
    judgeAdd() {
      this.isEdit = false;
      this.dialogFormVisible = true;
      this.resetForm("form");
      this.select1();
    },
    //判断是否为修改
    judgeedit() {
      this.isEdit = true;
      if (this.isEdit == true) {
        if (this.selectList.length != 1) {
          this.$message.error("请选择一项进行修改");
        } else {
          this.form.areaName = this.selectList[0].areaName;
          this.form.province = this.selectList[0].provinceId;
          this.form.city = this.selectList[0].cityId;
          this.form.remarks = this.selectList[0].remark;
          this.dialogFormVisible = true;
          this.select1();
          this.getCitySelect();
        }
      }
    },
    //下拉列表获取
    select1() {
      let params = {};
      districtselect1(params).then(res => {
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
      districtselect2(params).then(res => {
        this.selectCity = res.data.data;
      });
    },

    //表单提交验证
    handleOk(formName) {
      var that = this;
      this.$refs[formName].validate((valid, object) => {
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

  .el-input {
    width: 180px;
    margin-right: 15px;
  }
}
.search-box-right .el-input__inner {
  margin-top: 8px;
}
</style>