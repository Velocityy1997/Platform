<template>
  <div class="main-box" :class="{active: isActive}">
    <div class="header-box">
      <headerBox>
        <div slot="left-box" class="logo"></div>
        <header-center slot="center-box"></header-center>
        <header-right slot="right-box"></header-right>
      </headerBox>
    </div>
    <div class="left">
      <left-box>
        <left-search slot="main-left-search" @changeClose="close"></left-search>
        <left-tree slot="main-left-tree" @getLocation="location"></left-tree>
      </left-box>
    </div>
    <div class="right">
      <router-view v-if="isRouterAlive"></router-view>
    </div>
    <div class="bottom"></div>
    <message-content ref="changeLocation"></message-content>
    <!-- 修改密码弹框 -->
    <el-dialog title="修改密码" :visible.sync="trueFlag" style="width:1000px;margin:0 auto;">
      <el-form :model="form" :rules="rules" ref="form">
        <el-form-item label="请输入原密码" :label-width="formLabelWidth" prop="oldPass">
          <el-input v-model="form.oldPass" autocomplete="off" style="width:300px;" clearable></el-input>
        </el-form-item>
        <el-form-item label="请输入新密码" :label-width="formLabelWidth" prop="newPass">
          <el-input v-model="form.newPass" autocomplete="off" style="width:300px;" clearable></el-input>
        </el-form-item>
        <el-form-item label="请再次输入密码" :label-width="formLabelWidth" prop="surePass">
          <el-input v-model="form.surePass" autocomplete="off" style="width:300px;"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="resetForm('form')">重置</el-button>
        <el-button type="primary" @click="handleOk('form')">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 指令导航弹框 -->
    <el-dialog title="指令导航" :visible.sync="navigationVisible" style="width:1000px;margin:0 auto;">
      <el-form :model="navigationForm" :rules="navigationRules" ref="navigationForm">
        <el-form-item label="路线选择" label-width="110px" prop="route">
          <el-select v-model="navigationForm.route" placeholder="请选择">
            <el-option
              v-for="item in selectNavigation"
              :label="item.routeName"
              :value="item.routeName"
              :key="item.routeId"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="接收终端" label-width="110px" prop="receive">
          <!-- <el-input v-model="navigationForm.receive" autocomplete="off" style="width:300px;"></el-input> -->
          <el-input
            type="textarea"
            :autosize="{ minRows: 2}"
            v-model="navigationForm.receive"
            autocomplete="off"
            style="width:300px;"
            :disabled="true"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel('navigationForm')">取消</el-button>
        <el-button type="primary" @click="handleOk('navigationForm')">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 发送短信弹框 -->
    <el-dialog title="发送短信" :visible.sync="noteVisibleMsg" style="width:1000px;margin:0 auto;">
      <el-form :model="noteForm" :rules="noteRules" ref="noteForm">
        <el-form-item label="接收终端" label-width="110px" prop="receive">
          <el-input
            type="textarea"
            :autosize="{ minRows: 2}"
            v-model="noteForm.receive"
            autocomplete="off"
            style="width:300px;"
            :disabled="true"
          ></el-input>
        </el-form-item>
        <el-form-item label="发送次数" label-width="110px" prop="setNum">
          <el-input type="number" v-model="noteForm.setNum" autocomplete="off" style="width:300px;"></el-input>
        </el-form-item>
        <el-form-item label="发送类型" label-width="110px" prop="type">
          <el-select v-model="noteForm.type" placeholder="请选择">
            <el-option label="普通" value="0"></el-option>
            <el-option label="特快" value="1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="预置电文" label-width="110px" prop="text">
          <el-select
            v-model="noteForm.text"
            placeholder="请选择"
            @change="noteForm.setContent=noteForm.text"
          >
            <el-option
              v-for="(item , i) in textList"
              :label="item.content"
              :value="item.content"
              :key="i"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="发送内容" label-width="110px" prop="setContent">
          <el-input
            type="textarea"
            :autosize="{ minRows: 3}"
            v-model="noteForm.setContent"
            autocomplete="off"
            style="width:300px;"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="noteVisibleMsg = false">取消</el-button>
        <el-button type="primary" @click="handleOk('noteForm')">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog
      title="选择显示轨迹的时间段"
      :visible.sync="noteVisibleTime"
      style="width:1000px;margin:0 auto;"
    >
      <el-form :model="timeForm" :rules="timeRules" ref="timeForm">
        <el-form-item label="开始时间" label-width="110px" prop="beginTime">
          <el-date-picker
            v-model="timeForm.beginTime"
            type="datetime"
            placeholder="请选择开始日期时间"
            format="yyyy-MM-dd HH:mm:ss"
            value-format="yyyy-MM-dd HH:mm:ss"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="结束时间" label-width="110px" prop="endTime">
          <el-date-picker
            v-model="timeForm.endTime"
            type="datetime"
            placeholder="选择结束日期时间"
            format="yyyy-MM-dd HH:mm:ss"
            value-format="yyyy-MM-dd HH:mm:ss"
          ></el-date-picker>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="noteVisibleTime = false">取 消</el-button>
        <el-button type="primary" @click="historyClick()">确 定</el-button>
      </span>
    </el-dialog>

    <!---------------------------------------- 树节点根目录 start ------------------------------>
    <!-- 树节点的根目录短信通播 -->
    <el-dialog title="短信通播" :visible.sync="dxtbObj.dxtbVisible" style="width:1000px;margin:0 auto;">
      <el-form
        :model="dxtbObj"
        :rules="rules"
        ref="dxtbObj"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="发送次数" prop="num">
          <el-input v-model="dxtbObj.num" type="number"></el-input>
        </el-form-item>
        <el-form-item label="发送类型">
          <el-select v-model="dxtbObj.type" style="display: block;">
            <el-option label="普通" value="0"></el-option>
            <el-option label="特快" value="1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="预置电文" prop="presetMsg">
          <el-select
            v-model="dxtbObj.presetMsg"
            style="display: block;"
            placeholder="请选择"
            @change="dxtbObj.desc=dxtbObj.presetMsg"
          >
            <el-option
              :label="item.content"
              :value="item.content"
              v-for="(item, index) in dxtbObj.dxtbObjMsg"
              :key="index"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="发送内容" prop="desc">
          <el-input type="textarea" v-model="dxtbObj.desc" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item class="footer">
          <el-button @click=" dxtbObj.dxtbVisible = false ">取 消</el-button>
          <el-button type="primary" @click="submitForm('dxtbObj')">确 定</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <el-dialog
      title="本机信息"
      :visible.sync="localInfo.visible"
      style="width:1000px;margin:0 auto;"
      class="local-msg"
    >
      <ul v-if="localInfo.localInfoObj">
        <li class="li-item">
          <div class="item">指挥机名:</div>
          <div class="item">{{localInfo.localInfoObj.name}}</div>
        </li>
        <li class="li-item">
          <div class="item">卡号:</div>
          <div class="item">{{localInfo.localInfoObj.cardNum}}</div>
        </li>
        <li class="li-item">
          <div class="item">类型:</div>
          <div class="item">{{localInfo.localInfoObj.type}}</div>
        </li>
        <li class="li-item">
          <div class="item">广播地址:</div>
          <div class="item">{{localInfo.localInfoObj.brocastAdd}}</div>
        </li>
        <li class="li-item">
          <div class="item">服务频度:</div>
          <div class="item">{{localInfo.localInfoObj.frequency}}</div>
        </li>
        <li class="li-item">
          <div class="item">服务状态:</div>
          <div class="item">{{localInfo.localInfoObj.status}}</div>
        </li>
        <li class="li-item">
          <div class="item">通信等级:</div>
          <div class="item">{{localInfo.localInfoObj.txlevel}}</div>
        </li>
        <li class="li-item">
          <div class="item">通信长度:</div>
          <div class="item">{{localInfo.localInfoObj.txlength}}</div>
        </li>
        <li class="li-item">
          <div class="item">经度:</div>
          <div class="item">{{localInfo.localInfoObj.longitude}}</div>
        </li>
        <li class="li-item">
          <div class="item">纬度:</div>
          <div class="item">{{localInfo.localInfoObj.latitude}}</div>
        </li>
        <li class="li-item">
          <div class="item">定位时间:</div>
          <div class="item">{{localInfo.localInfoObj.locateTime}}</div>
        </li>
      </ul>
    </el-dialog>
    <!---------------------------------------- 树节点根目录 end ------------------------------->
  </div>
</template>

<script>
import headerBox from "./mainHeader/headerBox";
import headerCenter from "./mainHeader/headerCenter";
import headerRight from "./mainHeader/headerRight";

import leftBox from "./mainLeft/leftBox";
import leftTree from "./mainLeft/leftTree";
import leftSearch from "./mainLeft/leftSearch";

import messageContent from "views/msgContent";
import getAxios from "network/api";

import {
  sendNote,
  noteTextSelect,
  navigation,
  navigationSelect,
  editPass,
  yzdwData,
  basePost,
  getLocalInfo,
  getNewLocalPos,
  getNeiLoc,
  resetTask
} from "network/mainRuequest";

export default {
  provide() {
    return {
      reload: this.reload
    };
  },
  created() {
    this.selectRoute();
    this.getText();
    this.getYzdwData(); // 获取预置电文数据
    this.localInfoData(); // 获取本机信息
  },

  data() {
    return {
      trueFlag: false,
      // flag: false,
      formLabelWidth: "140px",
      // editPassVisible:false,
      //修改密码表单
      form: {
        newPass: "",
        surePass: "",
        oldPass: ""
      },
      //表单验证
      rules: {
        oldPass: [
          { required: true, message: "请填写原密码", trigger: "blur" }
        ],
        newPass: [
          { required: true, message: "请填写正确的密码", trigger: "blur" }
        ],
        surePass: [
          { required: true, message: "请填写确认密码", trigger: "blur" }
        ],
        num: [
          { required: true, message: "发送次数不能为空" },
          {
            validator: (rule, value, callback) => {
              if (value != "") {
                if (
                  /^[+]{0,1}(\d+)$|^[+]{0,1}(\d+\.\d+)$/.test(value) == false
                ) {
                  this.dxtbObj.num = 0;
                } else {
                  callback();
                }
              } else {
                callback();
              }
            },
            trigger: "change"
          }
        ],
        must: [{ required: true, message: "必填项", trigger: "blur" }],
        presetMsg: [{ required: true, message: "必选项", trigger: "change" }]
      },
      isActive: false,
      isRouterAlive: true,
      //指令导航表单
      navigationVisible: false,
      navigationForm: {
        route: "",
        receive: ""
      },
      card: "", //卡号
      navigationRules: {
        route: [{ required: true, message: "请选择路线", trigger: "blur" }],
        receive: [{ required: true }]
      },
      selectNavigation: [],
      //发送短信表单
      noteVisibleMsg: false,
      noteForm: {
        receive: "",
        setNum: 0,
        type: "",
        text: "",
        setContent: ""
      },
      noteRules: {
        receive: [{ required: true }],
        type: [{ required: true, message: "请选择发送类型", trigger: "blur" }],
        setContent: [
          { required: true, message: "请输入发送内容", trigger: "blur" }
        ],
        setNum: [
          { required: true, message: "发送次数不能为空" },
          {
            validator: (rule, value, callback) => {
              if (value <= 0) {
                this.noteForm.setNum = 0;
              } else {
                callback();
              }
            },
            trigger: "change"
          }
        ]
      },
      textList: [],

      // 选择显示轨迹的时间段
      noteVisibleTime: false,
      timeForm: {
        beginTime: "",
        endTime: ""
      },
      timeRules: {
        beginTime: [
          { required: true, message: "请选择开始时间", trigger: "blur" }
        ],
        endTime: [
          { required: true, message: "请选择结束时间", trigger: "blur" }
        ]
      },

      // 短信通播
      dxtbObj: {
        dxtbVisible: false,
        num: 1,
        type: "0",
        presetMsg: "",
        dxtbObjMsg: null,
        desc: ""
      },
      // 本机信息
      localInfo: {
        visible: false,
        localInfoObj: null
      }
    };
  },
  computed: {
    getDxtbText() {
      return (this.dxtbObj.desc += this.dxtbObj.presetMsg);
    }
  },
  components: {
    headerBox,
    headerCenter,
    headerRight,
    leftBox,
    leftSearch,
    leftTree,
    messageContent
  },
  mounted() {
    //修改密码显示
    this.$Bus.$on("flag", params => {
      // this.passEdit();
      this.trueFlag = params;
    });
    //指令导航显示及信息
    this.$Bus.$on("navigationFlag", (params, name, card) => {
      if (name === "" && card === "") {
        // this.$alert("请选择终端", "系统提示", {
        //   confirmButtonText: "确定"
        // });
        this.$message({
          showClose: true,
          message: "请选择终端",
          duration: 1500,
          type: "error"
        });
        return;
      }
      this.navigationVisible = params;
      this.navigationForm.receive = name;
      this.card = card;
    });
    //发送短信显示及信息
    this.$Bus.$on("noteFlag", (params, name, card) => {
      if (name === "" && card === "") {
        // this.$alert("请选择终端", "系统提示", {
        //   confirmButtonText: "确定"
        // });
        this.$message({
          showClose: true,
          message: "请选择终端",
          duration: 1500,
          type: "error"
        });
        return;
      }
      this.noteVisibleMsg = params;
      this.noteForm.receive = name;
      console.log(name);
      this.card = card;
    });

    // 选择历史轨迹
    this.$Bus.$on("historyTrack", (card, num) => {
      this.card = card;
      if (card === "") {
        // this.$alert("请选择终端", "系统提示", {
        //   confirmButtonText: "确定"
        // });
        this.$message({
          showClose: true,
          message: "请选择终端",
          duration: 1500,
          type: "error"
        });
        return;
      }

      if (num > 1) {
        // this.$alert("只能选择一个终端", "系统提示", {
        //   confirmButtonText: "确定"
        // });
        this.$message({
          showClose: true,
          message: "只能选择一个终端",
          duration: 1500,
          type: "error"
        });
        return;
      }
      this.noteVisibleTime = true;
    });

    // 短信通播
    this.$Bus.$on("dxtb", () => {
      this.dxtbObj.dxtbVisible = true;
    });

    // 本机信息
    this.$Bus.$on("localInfo", () => {
      this.localInfo.visible = true;
    });

    // 本机定位
    this.$Bus.$on("localPos", () => {

      getNewLocalPos()
        .then(res => {
          console.log(111)
          let { data } = res;

          this.$message({
            showClose: true,
            message: `${data.message}`,
            duration: 1500,
            type: "success"
          });
        })
        .catch(err => console.log(err));
    });

    // 友邻位置
    this.$Bus.$on("ylwz", terminalId => {
      if (terminalId === "") {
        // this.$alert("请选择终端", "系统提示", {
        //   confirmButtonText: "确定"
        // });
        this.$message({
          showClose: true,
          message: "请选择终端",
          duration: 1500,
          type: "error"
        });
        return;
      }
      getNeiLoc({ terminalId })
        .then(res => {
          // this.$alert(`${res.data.message}`, "系统提示", {
          //   confirmButtonText: "确定"
          // });
          this.$message({
            showClose: true,
            message: `${res.data.message}`,
            duration: 1500,
            type: "success"
          });
        })
        .catch(err => console.log(err));
    });

    // 任务重置
    this.$Bus.$on("resetTask", () => {
      resetTask()
        .then(res => {
          let { data } = res;

          // this.$alert(`${data.message}`, "系统提示", {
          //   confirmButtonText: "确定"
          // });
          this.$message({
            showClose: true,
            message: `${data.message}`,
            duration: 1500,
            type: "success"
          });
        })
        .catch(err => console.log(err));
    });
  },
  methods: {
    close(tag) {
      // 左侧按钮收缩和展开
      tag ? (this.isActive = true) : (this.isActive = false);
    },
    location(location) {
      this.$refs.changeLocation.isShow = true;
    },
    reload() {
      this.isRouterAlive = false;
      this.$nextTick(function() {
        this.isRouterAlive = true;
      });
    },
    //修改密码
    passEdit() {
      let params = {
        oldPassword: this.form.oldPass,
        password: this.form.newPass,
        password1: this.form.surePass
      };
      editPass(params).then(res => {
        if (res.data.success == false) {
          // this.$store.commit('open', res.data.message);
          this.$message.error(res.data.message);
        } else {
          this.$message.success(res.data.message);
        }
      });
    },
    //指令导航路线获取
    selectRoute() {
      let params = {};
      navigationSelect(params).then(res => {
        if (res.data.success == false) {
          this.$message.error(res.data.message);
        } else {
          this.selectNavigation = res.data.data;
        }
      });
    },
    //执行指令导航
    navigationGo() {
      let params = {
        route: this.navigationForm.route,
        cardNums1: this.navigationForm.receive,
        card: this.card
      };
      navigation(params).then(res => {
        // if (res.data.success == false) {
        //   this.$message.error(res.data.message);
        // } else {
        //   this.$message.success(res.data.message);
        // }
        let { data } = res;

        // this.$alert(`${data.message}`, "系统提示", {
        //   confirmButtonText: "确定"
        // });
        this.$message({
          showClose: true,
          message: `${data.message}`,
          type: "success"
        });
      });
    },
    //预置电文获取
    getText() {
      let params = {};
      noteTextSelect(params).then(res => {
        if (res.data.success == false) {
          this.$message.error(res.data.message);
        } else {
          this.textList = res.data.data;
        }
      });
    },
    //发送短信
    sendMess() {
      let _this = this;
      let params = {
        cardNums1: this.noteForm.receive,
        cardNums: this.card,
        sendTime: this.noteForm.setNum,
        sendType: this.noteForm.type,
        preMessage: this.noteForm.text,
        content: this.noteForm.setContent
      };
      sendNote(params).then(res => {
        let { data } = res;

        // this.$alert(`${data.message}`, "系统提示", {
        //   confirmButtonText: "确定"
        // });

        this.$message({
          type: "success",
          duration: 1500,
          showClose: true,
          message: `${data.message}`
        });

        this.noteVisibleMsg = false;
      });
    },
    //表单提交验证
    handleOk(formName) {
      var that = this;
      this.$refs[formName].validate((valid, object) => {
        if (valid) {
          if (formName == "form") {
            that.trueFlag = false;
            that.passEdit();
          } else if (formName == "navigationForm") {
            that.navigationVisible = false;
            that.navigationGo();
          } else if (formName == "noteForm") {
            that.NOTEVisible = false;
            that.sendMess();
          }
        } else {
          that.$message.error("请完善信息");
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
    },
    //表单取消
    cancel() {
      this.navigationVisible = false;
    },

    /**
     * @description: 获取预置电文数据
     * @method: getYzdwData
     * @param: {}
     * @return: void
     */
    getYzdwData() {
      let _this = this;
      yzdwData("/preMessage/getAll")
        .then(res => {
     
          let { data } = res.data;
          _this.dxtbObj.dxtbObjMsg = data;
        })
        .catch(err => {
          console.log(err);
        });
    },
    submitForm(dxtbObj) {
      let _this = this;
      this.$refs[dxtbObj].validate(valid => {
        if (valid) {
          let data = {
            sentTimes: _this.dxtbObj.num,
            sendType: _this.dxtbObj.type,
            preMessage: _this.dxtbObj.presetMsg,
            content: _this.dxtbObj.desc
          };

          basePost("/zhjTask/broadcast", data)
            .then(res => {
              this.$message({
                type: "success",
                duration: 1500,
                showClose: true,
                message: `${res.data.message}`
              });
              // this.$alert(`${res.data.message}`, "系统提示", {
              //   confirmButtonText: "确定"
              // });
              _this.dxtbObj.dxtbVisible = false;
            })
            .catch(err => console.log(err));
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },

    /**
     * @description: 获取本机信息
     * @method: localInfoData
     * @param: {}
     * @return: void
     */
    localInfoData() {
      let _this = this;
      getLocalInfo()
        .then(res => {
          let { data } = res.data;
          _this.localInfo.localInfoObj = data;
        })
        .catch(err => console.log(err));
    },

    /**
     * @description: 新打开地图页面
     * @method: historyClick
     * @param: {}
     * @return: void
     */
    historyClick() {
      let _this = this;
      this.$refs["timeForm"].validate(valid => {
        if (valid) {
          let startTime = _this.timeForm.beginTime;
          let endTime = _this.timeForm.endTime;
          startTime = startTime.toString();
          endTime = endTime.toString();

          let routeData = this.$router.resolve({
            name: "terminalHistoryTrack",
            query: { id: _this.card, startTime, endTime }
          });

          window.open(routeData.href, "_blank");
          this.noteVisibleTime = false;
        }
      });
    }
  }
};
</script>

<style scoped lang="scss">
.footer {
  display: flex;
  justify-content: flex-end;
  margin-right: 30px;
  margin-top: 30px;

  .el-form-item__content {
    margin-left: 0;

    .el-button + .el-button {
      margin-left: 22px;
    }
  }
}
.main-box {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;

  // 顶部导航
  .header-box {
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    height: 90px;
    background-color: #001b24;
    z-index: 999;

    .logo {
      width: 629px;
      height: 61px;
      background: url(~assets/img/login/title.png) 0 0 no-repeat;
      background-size: 100% 100%;
      -webkit-transform: scale(0.8);
      margin-top: 14px;
      margin-left: -20px;
      transform: scale(0.8);
    }
  }

  // 左侧树
  .left {
    position: absolute;
    left: 0;
    width: 260px;
    top: 90px;
    bottom: 0;
    background-color: #f0f8fc;
    box-shadow: 0 0 3px rgba(51, 51, 51, 0.3);
    overflow: hidden;
    transition: width ease 0.5s;
  }

  // 右侧表格或者地图
  .right {
    position: absolute;
    left: 260px;
    top: 90px;
    bottom: 0;
    right: 0;
    transition: left ease 0.5s;
    padding: 0 10px;
  }
}
.active {
  .left {
    width: 54px;
  }
  .right {
    left: 54px;
  }
  .left-tree-box {
    animation: fadeOut 0.5s ease;
    animation-fill-mode: forwards;
  }
  @keyframes fadeOut {
    from {
      opacity: 1;
    }

    to {
      opacity: 0;
    }
  }
}

// ----------------------- 本机信息弹框 start ----------------------------
.local-msg {
  /deep/ .el-dialog__header {
    background-color: #e5f4fa;
  }
  /deep/ .el-dialog__body {
    padding: 15px 20px 30px 20px;
    .li-item {
      .item {
        display: inline-flex;
        width: 100px;
        padding-left: 20px;
        font-size: 16px;
        line-height: 35px;
      }
      .item:first-child {
        justify-content: flex-end;
      }
    }
  }
}
// ----------------------- 本机信息弹框 end   ----------------------------

@media screen and (max-width: 1460px) {
  .main-box .header-box .logo {
    margin-left: -50px;
    background-size: 85% 90%;
  }
}
</style>