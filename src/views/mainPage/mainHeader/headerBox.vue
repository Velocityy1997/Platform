<template>
  <div id="header-box" class="header">
    <div class="left-box">
      <slot name="left-box"></slot>
    </div>
    <div class="center-box" id="scrollDiv">
      <slot name="center-box"></slot>
    </div>
    <div class="right-box">
      <slot name="right-box"></slot>
    </div>

    <div class="autoLogout">
       <el-dialog
           title="提示"
           :visible.sync="autoLogOut"
           width="30%"
           >
       <span>{{alertMsg}}</span>
         <span slot="footer" class="dialog-footer">
           <el-button type="primary" @click="sureToLogOut()">确 定</el-button>
         </span>
       </el-dialog>
    </div>
  </div>
</template>

<script>
import icon from "element-ui";
import getAxios from "network/api";
import { ifRelogin } from "network/mainRuequest1";


export default {
  name: "header-box",
  created() {
    // this.scroll();
    this.judgeLogOut();
    // window.setInterval(() => {
    //   setTimeout(this.judgeLogOut(), 0);
    // }, 5000);
  },
  data(){
     return {
       autoLogOut: false,
       alertMsg:''
     }
  },
  methods: {
    judgeLogOut(){
      let params = {};
       ifRelogin(params).then(res => {
         if(res.data.status == '0'){
           this.autoLogOut = true;
           this.alertMsg = res.data.message;
         }
       })
    },
    sureToLogOut(){
      this.autoLogOut = false;
      this.$router.replace({ path: "/login" });
    }
  }
};
</script>

<style scoped lang="scss">
.header {
  width: 100%;
  height: 100%;
  position: relative;
}
.left-box {
  width: 550px;
  height: 100%;
  display: inline-block;
  vertical-align: top;
  text-align: center;
}
.center-box {
  position: absolute;
  top: 0;
  left: 580px;
  right: 500px;
  height: 100%;
  display: inline-block;
  vertical-align: top;
  overflow-x: auto;
  overflow-y: hidden;
  white-space: nowrap;
}
.right-box {
  width: 500px;
  height: 100%;
  position: absolute;
  right: 0;
  top: 0;
}
@media screen and (max-width: 1600px) {
  .right-box {
    width: 400px;
  }
  .header .center-box {
    position: absolute;
    right: 400px;
  }
}
@media screen and (max-width: 1460px) {
  .left-box {
    width: 450px;
  }
  .header .center-box {
    position: absolute;
    left: 450px;
  }
}
::-webkit-scrollbar {
  width: 8px;
  height: 4px;
  background-color: #f1f1f1;
}

::-webkit-scrollbar-thumb {
  -webkit-border-radius: 2px;
  border-radius: 2px;
  background-color: #61aef7;
  height: 2px;
}

::-webkit-scrollbar-track {
  -webkit-border-radius: 2px;
  border-radius: 2px;
  background-color: #4b78ab;
}
</style>