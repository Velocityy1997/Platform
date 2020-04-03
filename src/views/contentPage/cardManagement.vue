<template>
  <div>
    <div id="nav-bar" class="nav">
      <span class="title">位置：</span>
      <span class="name-parent">系统管理</span>
      <i class="el-icon-arrow-right"></i>
      <span class="name-parent">北斗卡管理</span>
    </div>
    <div class="msgManagement-content">
      <div class="msgManagement-content-top" style="height: 50px; ">
        <div class="clear" style="float: left;">
          <el-row class="row-toolBox">
            <el-button type="primary" plain icon="el-icon-refresh" size="medium" @click="getList()">刷新</el-button>
            <el-button type="primary" plain icon="el-icon-upload" size="medium" @click="loadFormVisible=true">导入</el-button>
            <el-button type="primary" plain icon="el-icon-circle-plus-outline" size="medium" @click="judgeRegister()">注册</el-button>
            <el-button type="primary" plain icon="el-icon-goods" size="medium" @click="judgeRecharge()">充值</el-button>
            <el-button type="danger" plain icon="el-icon-delete" size="medium" @click="ifdelList()">销卡</el-button>
          </el-row>
        </div>
        <div class="search-box-right" style="float: right;">
          <el-input placeholder="请输入北斗卡卡号" v-model="input" clearable @keydown.enter.native="getList"></el-input>
          <el-button type="primary"  icon="el-icon-search" circle @click="getList()"></el-button>
        </div>
      </div>

      <div class="gridBox-table" style="width: 100%; margin: 15px auto;  ">
        <el-table
          ref="multipleTable"
          :data="tableData"
          stripe
          style="width: 100%; font-size: 16px;"
          :row-style = "rowStyle"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="index" width="50"></el-table-column>
          <el-table-column type="selection" width="50"></el-table-column>
          <el-table-column prop="cardNum" label="北斗卡号" fit></el-table-column>
          <el-table-column prop="broadcastNum" label="通波地址" fit></el-table-column>
          <el-table-column prop="commFre" label="服务频度" fit></el-table-column>
          <el-table-column prop="commGrade" label="通讯等级" fit></el-table-column>
          <el-table-column prop="status" label="状态" fit></el-table-column>
          <el-table-column prop="isExceed" label="是否超期" fit></el-table-column>
          <el-table-column prop="remainTime" label="到期时间" fit></el-table-column>
          <el-table-column prop="cardRemark" label="备注" fit></el-table-column>
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
      title="北斗卡注册"
      :visible.sync="registerFormVisible"
      style="width:1000px;margin:0 auto;"
    >
      <el-form :model="form" :rules="rules" ref="form">
        <el-form-item label="卡号" :label-width="formLabelWidth" prop="cardNum">
          <el-input v-model="form.cardNum" autocomplete="off" style="width:300px;"></el-input>
        </el-form-item>
        <el-form-item label="通播地址" :label-width="formLabelWidth">
          <el-input v-model="form.broadcastNum" autocomplete="off" style="width:300px;" clearable></el-input>
        </el-form-item>
        <el-form-item label="服务频度" :label-width="formLabelWidth">
          <el-input v-model="form.commFre" autocomplete="off" style="width:300px;" clearable></el-input>
        </el-form-item>
        <el-form-item label="通讯等级" :label-width="formLabelWidth">
          <el-input v-model="form.commGrade" autocomplete="off" style="width:300px;" clearable></el-input>
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
    <el-dialog
      title="北斗卡充值"
      :visible.sync="rechargeFormVisible"
      style="width:1000px;margin:0 auto;"
    >
      <el-form :model="rechargeform" :rules="rules2" ref="rechargeform">
        <el-form-item label="卡号" :label-width="formLabelWidth" prop="cardNum1">
          <el-input
            v-model="rechargeform.cardNum1"
            autocomplete="off"
            style="width:300px;"
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item label="开通时长" :label-width="formLabelWidth" prop="year">
          <el-select v-model="rechargeform.year" placeholder="请选择" @change="getMoney()">
            <el-option label="1年" value="1"></el-option>
            <el-option label="2年" value="2"></el-option>
            <el-option label="3年" value="3"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="金额" :label-width="formLabelWidth" prop="money">
          <el-input
            v-model="rechargeform.money"
            autocomplete="off"
            style="width:300px;"
            :disabled="true"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="resetForm('rechargeform')">重置</el-button>
        <el-button type="primary" @click="handleOk('rechargeform')">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="导入文件" :visible.sync="loadFormVisible" style="width:1000px;margin:0 auto;">
      <el-upload
        class="upload-demo"
        ref="upload"
        :action="uploadUrl()"
        
        :on-preview="handlePreview"
        :on-remove="handleRemove"
        :before-remove="beforeRemove"
        multiple
        :on-error="uploadFalse"
        :on-success="uploadSuccess"
        :auto-upload="false"
        :limit="1"
        :on-exceed="handleExceed"
        :file-list="fileList"
        :before-upload="beforeAvatarUpload"
      >
        <el-button size="medium" type="primary">点击上传</el-button>
        <div slot="tip" class="el-upload__tip">只能上传excel文件,文件大小不能超过10MB</div>
      </el-upload>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitUpload()">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 是否销卡弹窗 -->
    <el-dialog title="北斗卡管理" :visible.sync="clearcardVisible" style="width: 1000px; margin: auto;">
          <el-form label-width="110px">
            <el-form-item label="确定要销卡吗？"></el-form-item>
          </el-form>
          <el-button type="primary" style="margin-left:10px;" @click="delList()">确定</el-button>
        </el-dialog>
  </div>
</template>

<script>
import icon from "element-ui";
import { cardList } from "network/mainRuequest";
import { cardDel } from "network/mainRuequest";
import { cardAdd } from "network/mainRuequest";
import { cardRecharge } from "network/mainRuequest";
import { cardLoad } from "network/mainRuequest";

export default {
  name: "nav-bar",
  data() {
    return {
      currPage: 1,
      pageSize: 10,
      input: "",
      total:0,
      //表单弹出标识
      registerFormVisible: false,
      rechargeFormVisible: false,
      loadFormVisible: false,
      clearcardVisible: false,

      formLabelWidth: "120px",

      tableData: [],
      multipleSelection: [],
      //被选中行
      selectList: [],
      selectId: "",
      selectedText:'',
      //表单
      form: {
        cardNum: "",
        broadcastNum: "",
        commFre: "",
        commGrade: "",
        remarks: ""
      },
      rechargeform: {
        cardNum1: "",
        year: "",
        money: "1000"
      },
      //表单验证
      rules: {
        cardNum: [
          { pattern: /^[0-9]*$/, required: true, message: "请输入正确的北斗卡号", trigger: "blur" }
        ]
      },
      rules2: {
        cardNum1: [
          { pattern: /^[0-9]*$/, required: true, message: "请输入北斗卡号", trigger: "blur" }
        ],
        year: [
          { required: true, message: "请选择开通时长", trigger: "change,blur" }
        ],
        money: [{ required: true }]
      },
      //表单标识
      isRegister: false,
      isRecharge: false,
      //上传列表
      fileList: []
    };
  },
  created: function() {
    this.getList();
  },
  methods: {
    rowStyle({row, rowIndex}) {
      if(row.isExceed === '超期') {
        return 'color: red';
      }
    },
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
        this.selectId += item.cardId + ",";
      });

      this.selectId = this.selectId.slice(0, -1);

      //获取被选中项的文本
      this.selectedText = "";
      this.selectList.filter(item => {
        this.selectedText = item.cardNum;
      });
    },
    //上传方法
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    handleExceed(files, fileList) {
      this.$message.warning(
        `当前限制选择 1 个文件，本次选择了 ${
          files.length
        } 个文件，共选择了 ${files.length + fileList.length} 个文件`
      );
    },
    beforeRemove(file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`);
    },
    //上传提交
    uploadUrl: function() {
      return "http://localhost:8089/ZHRJSystem/bdCard/upload";
    },
    uploadSuccess(response, file, fileList) {
      if (response.success) {
        alert("文件导入成功");
        this.getList();
      } else {
        alert("文件导入失败");
      }
    },
    uploadFalse(response, file, fileList) {
      alert("文件上传失败！");
    },

    // 上传前对文件的大小的判断
    beforeAvatarUpload(file) {

      const extension = file.name.split(".")[1] === "xls";
      const extension2 = file.name.split(".")[1] === "xlsx";
      const isLt2M = file.size / 1024 / 1024 < 10;
      if (!extension && !extension2) {
        alert("上传模板只能是 xls、xlsx格式!");
      }
      if (!isLt2M) {
        console.log("上传模板大小不能超过 10MB!");
      }
      return extension || (extension2 && isLt2M);
    },
    submitUpload() { 
      let that = this;
      that.$refs.upload.submit();
      this.loadFormVisible = false;
  
      // if (that.businessType != null) {
      //触发组件的action
      
      // }
      // if (that.businessType == null) {
      //   that.businessType = "businessType不能为空";
      // }
    },
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    handlePreview(file) {

      if (file.status == "ready") {
        alert("此文件导入成功");
      } else {
        alert("此文件导入失败");
      }
    },
    //获取表格
    getList() {
      let params = {
        queryCardNum: this.input,
        rows: this.pageSize,
        page: this.currPage
      };

      cardList(params)
        .then(res => {
          this.tableData = res.data.rows;
          this.total = res.data.records;
          this.input = "";
        })
        .catch(err => console.log(err));
    },
    //列表销卡
    ifdelList(){
        if (this.$refs.multipleTable.selection.length == 0) {
        this.$message.error("请选择要销的卡");
      }
        if (this.$refs.multipleTable.selection.length != 0) {
        this.clearcardVisible = true; 
        }
       
    },
    delList() {
      let params = {
        cardId: this.selectId
      };
      cardDel(params).then(res => {
         
        if (res.data.success == false) {
          // this.$store.commit('open', res.data.message);
          this.$message.error(res.data.message);
        } else {
          this.$message.success(res.data.message);
          this.clearcardVisible = false; 
          this.getList();
        }
      });
    },
    //注册卡
    addList() {
      let params = {
        cardNum: this.form.cardNum,
        broadcastNum: this.form.broadcastNum,
        commFre: this.form.commFre,
        commGrade: this.form.commGrade,
        cardRemark: this.form.remark
      };
      cardAdd(params).then(res => {
        if (res.data.success == false) {
          // this.$store.commit('open', res.data.message);
          this.$message.error(res.data.message);
        } else {
          this.$message.success(res.data.message);
          this.getList();
        }
      });
    },
    //充值卡
    rechargeList() {
      let params = {
        cardNum: this.rechargeform.cardNum1,
        year: this.rechargeform.year,
        money: this.rechargeform.money
      };
      cardRecharge(params).then(res => {
        if (res.data.success == false) {
          // this.$store.commit('open', res.data.message);
          this.$message.error(res.data.message);
        } else {
          this.$message.success(res.data.message);
          this.registerFormVisible = false;
          this.getList();
        }
      });
    },
    //充值时间与金额联动
    getMoney() {
      let $year = this.rechargeform.year;
      if ($year == "1") {
        this.rechargeform.money = "1000";
      } else if ($year == "2") {
        this.rechargeform.money = "2000";
      } else if ($year == "3") {
        this.rechargeform.money = "3000";
      }
    },
    //判断是否为注册
    judgeRegister() {
      this.isRegister = true;
      this.isRecharge = false;
      this.registerFormVisible = true;
    },
    //判断是否为充值
    judgeRecharge() {
      if(this.$refs.multipleTable.selection.length == 0){
       this.$message.error('请选择要充值的北斗卡')
      }
      if(this.$refs.multipleTable.selection.length > 1){
       this.$message.error('一次只可选择一项')
      }
      if(this.$refs.multipleTable.selection.length == 1){
       this.isRegister = false;
       this.isRecharge = true;
       this.rechargeFormVisible = true;
       this.rechargeform.cardNum1 = this.selectedText;
      }
      
    },
    //表单提交验证
    handleOk(formName) {
      var that = this;
      this.$refs[formName].validate((valid, object) => {
        // console.log('-----------', this.form);
        if (valid) {
          that.registerFormVisible = false;
          that.rechargeFormVisible = false;
          if (that.isRegister) {
            that.addList();
          } else if (that.isRecharge) {
            that.rechargeList();
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
.el-upload {
  input[type="file"]{
    display: none  !important;
  }
}
.el-upload__input {
  display: none;
}

</style>