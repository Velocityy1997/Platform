<template>
  <div class="control-left">
    <el-tooltip  v-for="(item, index) in messageControlList" :key = "index"  effect="dark" :content="item.content" placement="top-start">
      <el-button class="refresh-btn">
        <i :class="item.icon"></i>
        <span class="refresh-span">{{item.name}}</span>
      </el-button>
    </el-tooltip>
  </div>
</template>

<script>
export default {
  name: "message-control",
  data() {
    return {
      messageControlList: []
    };
  },
  methods: {
  },
  mounted() {
    this.messageControlList = this.$route.meta.messageControlList
  }
};
</script>

<style scoped lang="scss">
.el-button {
  border: none;
  padding: 5px;
}
.el-button + .el-button i {
  color: #f56c6c;
}
.refresh-btn i {
  color: #67c23a;
}
</style>