<template>
  <div class="table-control">
    <div class="left">
      <slot name="left"></slot>
    </div>
    <div class="center">
      <slot name="center"></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: "table-control"
};
</script>

<style scoped lang="scss">
.table-control {
  display: flex;

  line-height: 55px;
  height: 55px;
  padding: 3px 0 5px 5px;
  background-color: #eff3f8;
}
.left {
  flex: 0 0 250px;
}
.center {
  flex: auto;
}
</style>