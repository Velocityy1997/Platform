<template>
  <div id="header-right">
    <div class="time">
      <div class="time-main" @click="getCurrTime()">
        {{year}}
        <br />
        {{time}}
      </div>
    </div>
    <div class="rightTool">
      <div class="editPass">
        <div class="userName el-icon-user"> {{userName}}</div>
        <div class="el-icon-lock" @click="editPass()">修改密码</div>
      </div>
      <div class="return el-icon-switch-button" @click="goBack()"> 退出</div>
    </div>
  </div>
</template>

<script>
import { getTime } from "network/mainRuequest1";

export default {
  name: "header-right",
  data() {
    return {
      year: "",
      time: ""
    };
  },
  computed: {
    userName() {
      return this.$store.state.userName;
    }
  },
  created: function() {
    // window.setInterval(() => {
    //   setTimeout(this.getCurrTime(), 0);
    // }, 1000);
  },
  methods: {
    goBack() {
      this.$router.replace({ path: "/login" });
    },
    getCurrTime() {
      getTime()
        .then(res => {
          this.year = res.data.date;
          this.time = res.data.time;
          this.$Bus.$emit("systemState", res.data);
        })
        .catch(err => console.log(err));
    },
    editPass() {
      // this.$store.commit('changeFlag');
      this.$Bus.$emit("flag", true); //很像父子之间传值的方法
    }
  }
};
</script>

<style scoped lang="scss">
@font-face {
  font-family: clock;
  src: url("~assets/font/Digital-7Mono.TTF");
}
.time {
  width: 215px;
  height: 75px;
  background: url(~assets/img/main/time-box.png) 0 0 no-repeat;
  background-size: 100% 100%;
  margin-top: 7px;
  font-size: 30px;
  color: #00fff6;
  line-height: 33px;
  text-align: center;
  font-family: clock;
  // margin-left: 64px;

  .time-main {
    padding-top: 5px;
  }
}
.rightTool {
  width: 160px;
  height: 100%;
  line-height: 100%;
  position: absolute;
  right: 50px;
  top: 0;
}
.editPass {
  width: 95px;
  color: #7a8588;
  font-size: 16px;
  cursor: pointer;
  display: inline-block;
  margin-top: 20px;
  vertical-align: middle;

  .userName {
    line-height: 24px;
  }
}
.return {
  display: inline-block;
  cursor: pointer;
  color: #7a8588;
  font-size: 16px;
  padding-left: 10px;
  border-left: 1px solid #7a8588;
  margin-top: 20px;
  vertical-align: middle;
}
.editPass:hover,
.return:hover {
  color: #00fff6;
}
.el-icon-lock:before {
  margin-right: 5px;
}
@media screen and (max-width: 1600px) {
  .rightTool {
    right: 15px;
  }
}
</style>