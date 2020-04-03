<template>
  <div class="table-title">
    <slot name="name"></slot>
  </div>
</template>

<script>
export default {
  name: "table-title"
};
</script>

<style scoped lang="scss">
.table-title {
  height: 40px;
  line-height: 40px;
  color: #fff;
  background: -webkit-linear-gradient(left, #a9ccda, #43aad2);
  padding-left: 10px;
  font-size: 15px;
}
</style>