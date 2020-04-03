<template>
<div id="user" class="user">
    <div class="navBox">
      <navBar></navBar>
    </div>
    <div class="toolBox1">
      <el-row class="row-toolBox">
        <el-button type="success">导入</el-button>
        <el-button plain>注册</el-button>
        <el-button plain>套餐</el-button>
        <el-button plain>充值</el-button>
        <el-button plain>销卡</el-button>
        <el-button plain>黑名单</el-button>
      </el-row>
       <el-row class="row-toolBox">
        <el-button type="success">增加</el-button>
        <el-button plain>修改</el-button>
        <el-button plain>删除</el-button>
        <el-button plain>修改密码</el-button>
        <el-button plain>重置密码</el-button>
      </el-row>
        <el-row class="row-toolBox">
        <el-button type="success">清空</el-button>
        
      </el-row>
    </div>
   
  </div>


</template>



<script>
import { getAxios } from "network/api";
import navBar from "views/mainPage/mainBody/nav";
export default{
    data(){
        return{

        }
    },
     
     components: {
    navBar
  },
  methods:{

  }
}


</script>


<style scoped>
.user {
  width: 100%;
  height: 100%;
  position: relative;
  border: 1px solid #eee;
}

.navBox {
  width: 100%;
  height: 50px;
  border: 1px solid #eee;
}

.toolBox1 {
  width: 100%;
  height: 90%;
  border: 1px solid #eee;
  /* padding: 10px; */
}
.user .toolBox1 .row-toolBox {
  margin-top: 10px;
  margin-left: 10px;
}
</style>