<template>
  <div class="control-center">
    <el-form :inline="true"  class="demo-form-inline">
      <el-form-item v-for="(item, index) in formControlList" :key="index"  :label="item.labelName" v-if="item.type == 'input'">
        <el-input :placeholder="item.placeholder" :id="item.name"></el-input>
      </el-form-item> 

      <el-form-item v-else-if="item.type == 'date'" :label="item.labelName">
         <el-col>
          <el-date-picker type="date" placeholder="选择日期" v-model="date" style="width: 100%;"></el-date-picker>
        </el-col>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="onSubmit" class="find">查询</el-button>
      </el-form-item> 
    </el-form>
  </div>
</template>

<script>

export default {
  name: "control-center",
  data() {
    return {
      formControlList: [],
      date: ''
    };
  },
  methods: {
    onSubmit() {
      console.log("submit!");
    }
  },
  mounted() {
    this.formControlList = this.$route.meta.formControlList 
  }
};
</script>

<style scoped lang="scss">
// center
.el-form {
  line-height: 52px;
}
.el-form--inline .el-form-item {
  margin-bottom: 0;
  margin-right: 20px;
}
/deep/.el-form--inline .el-form-item__content {
  vertical-align: middle;
}
/deep/ .el-input__inner {
  height: 30px;
}
.find {
  padding: 9px 20px;
}
</style>