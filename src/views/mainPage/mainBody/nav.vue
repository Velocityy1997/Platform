<template>
  <div id="nav-bar" class="nav">
    <span class="title">位置：</span>
    <span class="name-parent">系统管理</span>
    <i class="el-icon-arrow-right"></i>
    <span class="name-parent">用户管理</span>
  </div>
</template>

<script>

import icon from "element-ui"
export default {
  name: "nav-bar",
};

</script>

<style scoped lang="scss">
    .nav{
        width:100%;
        height:100%;
        background:#e1eef3;
        font-size:17px;
        color:#001b24;
        line-height: 50px;
        padding-left:15px;

        .title{
            font-weight: bold;
        }
    }

</style>
