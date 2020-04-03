<template>
  <div id="login">
    <div class="main">
      <div class="bg"></div>
      <div class="fly"></div>
      <div class="right-login">
        <div class="logo"></div>
        <div class="title"></div>
        <div class="text">
          用户登录
          <span class="small-text">Login</span>
        </div>
        <div class="input-box">
          <input type="text" placeholder="用户名" class="user input" v-model="v1" />
          <input
            type="password"
            placeholder="密码"
            class="password input"
            v-model="v2"
            @keydown.enter.stop="login"
          />
          <span class="icon icon-user"></span>
          <span class="icon icon-password"></span>
        </div>
        <button type="button" class="btn input" @click="login">登录</button>
        <div class="bottom-text">版权所有 2019 西安航光卫星测控技术有限公司</div>
      </div>
    </div>
  </div>
</template>

<script>
import getAxios from "network/api";
import MessageBox from "element-ui";

export default {
  name: "login",
  data() {
    return {
      v1: "",
      v2: ""
    };
  },
  methods: {
    login() {
      let _this = this;
      getAxios({
        url: "/user/checkUser",
        params: { userName: this.v1, password: this.v2 },
        method: "post"
      })
        .then(res => {
          if (res.data.success) {
            this.$store.dispatch("getUserType").then(res => {
              _this.$router.push({ path: "main" });
            });
          } else {
            this.$alert("错误的用户名或密码", "提示", {
              confirmButtonText: "确定"
            });
          }
        })
        .catch(err => console.log(err));
    }
  }
};
</script>

<style scoped lang="scss">
.main {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow: hidden;

  .bg {
    width: 100%;
    height: 100%;
    background: url(~assets/img/login/bg.png) no-repeat;
    background-size: 100% 100%;
    position: absolute;
    animation: big 15s ease infinite alternate;
  }
  .fly {
    width: 669px;
    height: 378px;
    background: url(~assets/img/login/feichuan.png) no-repeat;
    background-size: 100% 100%;
    position: absolute;
    top: 0;
    left: 0;
    animation: fly 8s ease infinite alternate;
  }
  .right-login {
    width: 737px;
    height: 100%;
    background: rgba(0, 27, 36, 0.5);
    position: absolute;
    top: 0;
    right: 0;

    .logo {
      width: 130px;
      height: 130px;
      margin: 0 auto;
      background: url(~assets/img/login/logo.png) no-repeat;
      background-size: 100% 100%;
    }
    .title {
      width: 629px;
      height: 61px;
      background: url(~assets/img/login/title.png) no-repeat;
      background-size: 100% 100%;
      margin: 80px auto;
    }
    .text {
      font-size: 45px;
      color: #d2d2d1;
      margin-left: 70px;
      margin-bottom: 40px;

      .small-text {
        font-size: 36px;
      }
    }
    .input-box {
      width: 100%;
      height: 220px;
      position: relative;
    }
    .input {
      width: 562px;
      height: 82px;
      background: #fff;
      display: block;
      margin: 0 auto;
      padding-left: 100px;
      font-size: 28px;
      border-radius: 5px;
      margin-bottom: 25px;
      border: none;
      outline: 0;
      transform: scale(0.9);
    }
    .icon {
      width: 45px;
      height: 45px;
      background: url(~assets/img/login/icon-people.png) no-repeat;
      background-size: 100% 100%;
      position: absolute;
      transform: scale(0.8);
    }
    .icon-user {
      top: 19px;
      left: 130px;
    }
    .icon-password {
      width: 33px;
      height: 45px;
      background: url(~assets/img/login/icon-pas.png) no-repeat;
      background-size: 100% 100%;
      top: 127px;
      left: 135px;
    }
    .btn {
      background: #00fff6;
      color: #fff;
      text-align: center;
      line-height: 82px;
      width: 664px;
      margin-bottom: 25px;
      padding: 0;
      border: 1px solid #fff;

      cursor: pointer;
    }
    .btn:hover {
      box-shadow: 0px 1px 6px #fff;
    }
    .bottom-text {
      width: 100%;
      height: 30px;
      position: absolute;
      bottom: 50px;
      font-size: 20px;
      color: #b5b6b5;
      text-align: center;
    }
  }
}
@keyframes big {
  from {
    transform: scale(1);
  }
  to {
    transform: scale(1.1);
  }
}
@keyframes fly {
  from {
    transform: translateX(0) translateY(0);
  }
  to {
    transform: translateX(-20px) translateY(-20px);
  }
}
</style>
