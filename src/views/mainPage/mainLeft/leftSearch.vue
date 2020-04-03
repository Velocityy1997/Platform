<template>
  <div id="search-box">
    <div class="search-input" :class="{fadeOut: isFadeOut}">
      <el-input placeholder="请输入内容" v-model="input"  @change="search()">
        <i slot="suffix" class="el-input__icon el-icon-search" ></i>
      </el-input>
    </div>
    <div
      class="openTag"
      @click="sliderClose()"
      :class="isClose ? 'el-icon-s-unfold' : 'el-icon-s-fold'"
    ></div>
  </div>
</template>

<script>
import { getTreeList } from "network/mainRuequest";

export default {
  name: "search-box",
  data() {
    return {
      input: "",
      isClose: false,
      isFadeOut: false
    };
  },
  methods: {
    sliderClose(){
      this.isClose = !this.isClose;
      this.isClose ? this.isFadeOut = true :  this.isFadeOut = false;
      this.$emit('changeClose', this.isClose);
    },
    search(){
      let data = {
        cardnum: this.input
      };
      getTreeList(data)
        .then(res => {
          let data = res.data;
          let list = [];
          data = data.map(res => {
            return {
              icon: "el-icon-s-platform",
              iconClose: res.iconClose,
              iconOpen: res.iconOpen,
              id: res.id,
              label: res.name,
              pId: res.pId,
              parent: res.parent,
              sonNodesSum: res.sonNodesSum,
              type: res.type,
              card: res.card,
              terminalId: res.terminalId
            };
          });

          for (var i = 0; i < data.length; i++) {
            for (var j = 0; j < data.length; j++) {
              if (data[i].pId === data[j].id) {
                if (!data[j].children) {
                  data[j].children = [];
                }
                data[j].icon = "el-icon-s-home";
                data[j].children.push(data[i]);
              }
            }
          }

          for (var i = 0; i < data.length; i++) {
            if (data[i].pId === "0") {
              list.push(data[i]);
            }
          }

          this.data = list;
        })
        .catch(err => console.log("err"));
    }
  }
};
</script>

<style scoped lang="scss">
.search-input {
  width: 180px;
  margin-left: 10px;
  padding-top: 10px;

  /deep/ .el-input__inner {
    height: 26px;
    line-height: 26px;
    border-radius: 25px;
  }
  /deep/ .el-input__icon {
    line-height: 26px;
  }
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