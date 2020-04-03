<template>
  <div id="main-left-box" class="main-left-box">
    <div class="main-left-search" :class="{fadeOut: isFadeOut}">
      <slot name="main-left-search"></slot>
    </div>

    <div class="main-left-tree" :class="{fadeOut: isFadeOut}">
      <slot name="main-left-tree"></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: "main-left-box",
  data() {
    return {
      isClose: false,
      isFadeOut: false
    };
  },
  methods: {
    sliderClose() {
      this.isClose = !this.isClose;
      this.isClose ? (this.isFadeOut = true) : (this.isFadeOut = false);
      this.$emit("changeClose", this.isClose);
    },

    handleOpen(key, keyPath) {},
    handleClose(key, keyPath) {}
  }
};
</script>

<style scoped lang="scss">
.main-left-search {
  width: 100%;
  height: 50px;
  background-color: #e5f4fa;
}
.main-left-tree {
  overflow: auto;
  position: absolute;
  top: 50px;
  left: 0;
  right: 0;
  bottom: 0;
  background: #fff;
}
// .main-left-tree::-webkit-scrollbar {
//   width: 4px;
//   height: 10px;
// }

// .main-left-tree::-webkit-scrollbar-thumb {
//   background: transparent;
//   border-radius: 4px;
// }

// .main-left-tree:hover::-webkit-scrollbar-thumb {
//   background: hsla(0, 0%, 53%, 0.4);
// }

// .main-left-tree:hover::-webkit-scrollbar-track {
//   background: hsla(0, 0%, 53%, 0.1);
// }
.el-col-12 {
  width: 100%;
}

.el-menu-item.is-active {
  color: #303133;
}
.el-menu-item {
  font-size: 16px;
}
.el-menu .nav-menu-title {
  font-size: 16px;
  font-weight: bold;
}
.el-submenu span {
  font-size: 16px;
}
.el-submenu__title {
  font-size: 16px;
}
.openTag {
  color: #6acdc9;
  position: absolute;
  right: 15px;
  top: 10px;
  font-size: 28px;
  cursor: pointer;
}
@keyframes fadeOut {
  from {
    opacity: 1;
  }

  to {
    opacity: 0;
  }
}
.fadeOut {
  animation: fadeOut 0.5s ease;
  animation-fill-mode: forwards;
}
</style>