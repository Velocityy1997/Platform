<template>
  <div>
    <div id="nav-bar" class="nav">
      <span class="title">位置：</span>
      <span class="name-parent">系统管理</span>
      <i class="el-icon-arrow-right"></i>
      <span class="name-parent">用户管理</span>
    </div>
    <div class="msgManagement-content">
      <div class="msgManagement-content-top" style="height: 50px; ">
        <div class="clear" style="float: left;">
          <el-row class="row-toolBox">
            <el-button
              type="primary"
              plain
              size="medium"
              icon="el-icon-refresh"
              @click="getList()"
            >刷新</el-button>
            <el-button
              type="primary"
              plain
              size="medium"
              icon="el-icon-circle-plus-outline"
              @click="judgeAdd()"
            >新增</el-button>
            <el-button
              type="primary"
              plain
              size="medium"
              icon="el-icon-edit"
              @click="judgeEdit()"
            >修改</el-button>
            <el-button
              type="primary"
              plain
              size="medium"
              icon="el-icon-setting"
              @click="rePassword()"
              v-show="admin==1"
            >重置密码</el-button>
            <el-button type="danger" plain size="medium" icon="el-icon-delete" @click="delList()">删除</el-button>
          </el-row>
        </div>
        <div class="search-box-right" style="float: right;">
          <el-input placeholder="请输入用户名" v-model="input1" clearable @keydown.enter.native="getList"></el-input>
          <el-input placeholder="请输入所属区域" v-model="input2" clearable @keydown.enter.native="getList"></el-input>
          <el-button type="primary" icon="el-icon-search" circle @click="getList()"></el-button>
        </div>
      </div>
      <!-- 弹框 -->
      <el-dialog title="用户管理操作" :visible.sync="edituserVisible" style="width:1000px;margin:0 auto;">
        <el-form :model="form" :rules="rules" ref="form">
          <el-form-item label="用户名称" :label-width="formLabelWidth" prop="userName">
            <el-input v-model="form.userName" autocomplete="off" style="width:300px;" clearable></el-input>
          </el-form-item>
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
          <el-form-item label="区/县" :label-width="formLabelWidth" prop="county">
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
          <el-form-item label="联系电话" :label-width="formLabelWidth" prop="phone">
            <el-input v-model="form.phone" autocomplete="off" style="width:300px;"></el-input>
          </el-form-item>
          <el-form-item label="备注(车牌号)" :label-width="formLabelWidth" prop="remarks">
            <el-input v-model="form.remarks" autocomplete="off" style="width:300px;"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="resetForm('form')">重置</el-button>
          <el-button type="primary" @click="handleOk('form')">确 定</el-button>
        </div>
      </el-dialog>
      <!-- <el-dialog title="修改密码" :visible.sync="editpasswordVisible">
        <el-form label-width="100px">
          <el-form-item label="请输入密码">
            <el-input show-password v-model="editpassword" style="width: 80%; "></el-input>
          </el-form-item>
          <el-form-item label="再次输入密码">
            <el-input show-password v-model="editpasswordAgain" style="width: 80%; "></el-input>
          </el-form-item>
        </el-form>
        <el-button type="primary" style="margin-left:130px;" @click="confirm_editpassword()">确定</el-button>
      </el-dialog>-->

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
          <el-table-column prop="userName" label="用户名" fit></el-table-column>
          <el-table-column prop="userType" label="用户角色" fit></el-table-column>
          <el-table-column prop="areaName" label="所属区域" fit></el-table-column>
          <el-table-column prop="industryName" label="所属行业" fit></el-table-column>
          <el-table-column prop="userPhone" label="电话" fit></el-table-column>
          <el-table-column prop="userRemark" label="备注" fit></el-table-column>
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
  </div>
</template>

<script>
import icon from "element-ui";
import { userList } from "network/mainRuequest";
import { userAdd } from "network/mainRuequest";
import { userEdit } from "network/mainRuequest";
import { userDel } from "network/mainRuequest";
import { userRePass } from "network/mainRuequest";
import { aircraftselect1 } from "network/mainRuequest";
import { aircraftselect2 } from "network/mainRuequest";
import { aircraftselect3 } from "network/mainRuequest";
import { aircraftselect4 } from "network/mainRuequest";
export default {
  name: "nav-bar",
  data() {
    return {
      //登录人状态
      admin:"",
      //表格数据
      tableData: [],

      //分页
      currPage: 1,
      pageSize: 10,
      total: 0,

      //查询框数据
      input1: "",
      input2: "",

      //被选中行
      selectList: [],
      selectId: "",

      //弹框显示标识
      edituserVisible: false,
      editpasswordVisible: false,

      //新增修改表单
      form: {
        userName: "",
        province: "",
        city: "",
        remarks: "",
        county: "",
        industry: "",
        phone: ""
      },
      formLabelWidth: "120px",
      //下拉列表
      selectProvince: [],
      selectCity: [],
      selectCounty: [],
      selectIndustry: [],

      multipleSelection: [],

      //新增标识
      isAdd: false,
      //修改标识
      isEdit: false,
      //表单验证
      rules: {
        userName: [
          { pattern:  /^[\u4E00-\u9FA5]{1,5}$/, required: true, message: "请填写正确用户名称", trigger: "blur" }
        ],
        province: [{ required: true, message: "请选择省", trigger: "blur" }],
        phone: [
          {
            pattern: /^1[34578]\d{9}$/,
            required: true,
            message: "请输入正确的手机号",
            trigger: "change,blur"
          }
        ],
        industry: [
          { required: true, message: "请选择所属行业", trigger: "change,blur" }
        ]
      }
    };
  },
  created: function() {
    this.getList();
  },
  mounted() {
    //获取登录人身份
   this.admin=this.$store.state.userType;
    // console.log('-----------------$bus', this.$Bus.type);
  },
  methods: {
    //分页方法
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
        this.selectId += item.userID + ",";
      });

      this.selectId = this.selectId.slice(0, -1);
    },
    edit_user() {
      if (this.$refs.multipleTable.selection.length == 0) {
        this.$message.success("请选择要修改的记录");
      }
      if (this.$refs.multipleTable.selection.length > 1) {
        this.$message.success("只能选择修改一个用户");
      }
      if (this.$refs.multipleTable.selection.length == 1) {
        this.edituserVisible = true;
      }
    },
    edit_password() {
      if (this.$refs.multipleTable.selection.length == 0) {
        this.$message.success("请选择要修改的记录");
      }
      if (this.$refs.multipleTable.selection.length > 1) {
        this.$message.success("只能选择修改一个用户");
      }
      if (this.$refs.multipleTable.selection.length == 1) {
        this.editpasswordVisible = true;
      }
    },
    confirm_edituser() {},
    confirm_editpassword() {},

    //获取表格
    getList() {
      let params = {
        queryName: this.input1,
        queryAera: this.input2,
        rows: this.pageSize,
        page: this.currPage
      };

      userList(params)
        .then(res => {
          this.tableData = res.data.rows;
          this.total = res.data.records;
          this.input1 = "";
          this.input2 = "";
        })
        .catch(err => console.log(err));
    },
    //添加表格
    addList() {
      let params = {
        name: this.form.userName,
        province: this.form.province,
        city: this.form.city,
        county: this.form.county,
        industName: this.form.industry,
        phone: this.form.phone,
        remark: this.form.remarks
      };

      userAdd(params)
        .then(res => {
          if (res.data.success == false) {
            this.$message.error(res.data.message);
          } else {
            this.$message.success(res.data.message);
            this.getList();
          }
        })
        .catch(err => console.log(err));
    },
    //修改表格
    editList() {
      let params = {
        id: this.selectId,
        name: this.form.userName,
        province: this.form.province,
        city: this.form.city,
        county: this.form.county,
        industName: this.form.industry,
        phone: this.form.phone,
        remark: this.form.remarks
      };

      userEdit(params)
        .then(res => {
          if (res.data.success == false) {
            this.$message.error(res.data.message);
          } else {
            this.$message.success(res.data.message);
            this.getList();
          }
        })
        .catch(err => console.log(err));
    },
    //删除列表
    delList() {
      let params = {
        id: this.selectId
      };
      userDel(params).then(res => {
        if (res.data.success == false) {
          // this.$store.commit('open', res.data.message);
          this.$message.error(res.data.message);
        } else {
          this.$message(res.data.message);
          this.getList();
        }
      });
    },
    //重置密码
    rePassword() {
      let params = {
        userId: this.selectId
      };
      userRePass(params).then(res => {
        if (res.data.success == false) {
          // this.$store.commit('open', res.data.message);
          this.$message.error(res.data.message);
        } else {
          this.$message(res.data.message);
          this.getList();
        }
      });
    },
    //判断是否为新增
    judgeAdd() {
      this.isAdd = true;
      this.isEdit = false;
      this.edituserVisible = true;
      this.resetForm("form");
      this.select1();
      this.select4();
    },
    //判断是否为修改
    judgeEdit() {
      this.isAdd = false;
      this.isEdit = true;
      if (this.selectList.length != 1) {
        this.$message.error("请选择一项进行修改");
      } else {
        this.form.userName = this.selectList[0].userName;
        this.form.province = this.selectList[0].provinceId;
        this.form.city = this.selectList[0].cityId;
        this.form.county = this.selectList[0].zoneId;
        this.form.phone = this.selectList[0].userPhone;
        this.form.industry = this.selectList[0].industryId;
        this.form.remarks = this.selectList[0].userRemark;
        this.edituserVisible = true;
        this.select1();
        this.select4();
        this.getCitySelect();
        this.getCountySelect();
      }
    },
    //表单下拉框获取
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
          this.$message.error(res.data.message);
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
          that.edituserVisible = false;
          if (that.isAdd) {
            that.addList();
          } else if (that.isEdit) {
            that.editList();
          }
        } else {
          that.$message.error("请完善添加信息");
          // that.registerFormVisible = true;
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
  margin-right: 15px;
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