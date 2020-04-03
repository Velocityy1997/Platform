<template>
  <div id="left-tree-box" class="left-tree-box">
    <el-tree
      :data="data"
      show-checkbox
      check-strictly= true 
      node-key="id"
      ref="tree"
      default-expand-all
      :props="defaultProps"
      empty-text
      @node-contextmenu="rightClick"
      @node-click="foo()"
    >
      <span slot-scope="{ node, data }">
        <i :class="data.icon"></i>
        <span style="padding-left: 4px; color: red;" v-if="node.level === 2">{{node.label}}</span>
        <span style="padding-left: 4px;" v-else>{{node.label}}</span>
      </span>
    </el-tree>
    <div class="message-content" id="message-content" v-show="normalShow">
      <ul class="message-content-ul">
        <li class="message-content-li" @click="noteMess()">
          <span class="text">发送短信</span>
        </li>
        <li class="message-content-li" @click="navigation()">
          <span class="text">指令导航</span>
        </li>
        <li class="message-content-li" @click="getLocation()">
          <span class="text">位置查询</span>
        </li>
        <li class="message-content-li" @click="showTrack()">
          <span class="text">显示轨迹</span>
        </li>
      </ul>
    </div>
    <div class="message-content" id="message-content2" v-show="rootShow">
      <ul class="message-content-ul">
        <li class="message-content-li" @click="showDxtbModal()">
          <span class="text">短信通播</span>
        </li>
        <li class="message-content-li" @click="getLocalInfo()">
          <span class="text">本机信息</span>
        </li>
        <li class="message-content-li" @click="getLocalPos()">
          <span class="text">本机定位</span>
        </li>
        <li class="message-content-li" @click="getYlwz()">
          <span class="text">友邻位置</span>
        </li>
        <li class="message-content-li" @click="resetTask()">
          <span class="text">任务重置</span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { getTreeList } from "network/mainRuequest";
import { Loading } from "element-ui";

export default {
  name: "left-tree-box",
  data() {
    return {
      data: [],
      defaultProps: {
        children: "children",
        label: "label"
      },
      isLoading: true,
      //右键菜单显示与位置
      rootShow: false,
      normalShow: false,
      menuY: 0,
      menuX: 0,
      //每行树信息
      rowName: [],
      rowCard: []
    };
  },
  mounted() {
    this.treeListData();
  },
  methods: {
    treeListData() {
      let data = {
        cardnum: ""
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
    },
    //右键菜单显示隐藏
    rightClick(row, event, value) {
      let checkNode = this.$refs.tree.getCheckedNodes();
      this.rootShow = false;
      this.normalShow = false;
      this.checkNodeNum = checkNode.length;
      if (value.level === 1) {
        this.rootShow = true;
      } else {
        this.normalShow = true;
      }
      //获取左侧树选中信息
      this.rowName = "";
      this.rowCard = "";
      this.terminalId = "";

      checkNode.forEach(element => {
        this.rowName += element.label + ",";
        this.rowCard += element.card + ",";
        this.terminalId += element.terminalId + ",";
      });
      this.rowName = this.rowName.substring(0, this.rowName.length - 1);
      this.rowCard = this.rowCard.substring(0, this.rowCard.length - 1);
      this.terminalId = this.terminalId.substring(
        0,
        this.terminalId.length - 1
      );
      let menu = document.querySelector("#message-content");
      let menu2 = document.querySelector("#message-content2");
      this.styleMenu(menu);
      this.styleMenu(menu2);
    },
    foo() {
      let tree = document.querySelector("#left-tree-box");
      // 取消鼠标监听事件 菜单栏
      this.rootShow = false;
      this.normalShow = false;
      window.removeEventListener("click", this.foo); // 关掉监听
      tree.removeEventListener("click", this.foo); // 关掉监听
    },
    styleMenu(menu) {
      let tree = document.querySelector("#main-left-box");
      let _this = this;
      menu.style.left = event.pageX + 20 + "px";
      menu.style.top = event.pageY + 10 + "px";
      document.addEventListener("click", _this.foo); // 给整个document新增监听鼠标事件，点击任何位置执行foo方法
    },
    //指令导航信息
    navigation() {
      this.$Bus.$emit("navigationFlag", true, this.rowName, this.rowCard);
    },
    //发送短信信息
    noteMess() {
      this.$Bus.$emit("noteFlag", true, this.rowName, this.rowCard);
    },

    // 选择历史轨迹
    showTrack() {
      this.$Bus.$emit("historyTrack", this.rowCard, this.checkNodeNum);
    },

    /**
     * @description: 短信通播
     * @method: showDxtbModal
     * @param: {}
     * @return: void
     */
    showDxtbModal() {
      this.$Bus.$emit("dxtb");
    },

    /**
     * @description: 查询本机信息
     * @method: getLocalInfo
     * @param: {}
     * @return: void
     */
    getLocalInfo() {
      this.$Bus.$emit("localInfo");
    },

    /**
     * @description: 本机定位
     * @method: getLocalPos
     * @param: {}
     * @return: void
     */
    getLocalPos() {
      this.$Bus.$emit("localPos");
    },

    /**
     * @description: 友邻位置
     * @method: getYlwz
     * @param: {}
     * @return: void
     */
    getYlwz() {
      this.$Bus.$emit("ylwz", this.terminalId);
    },

    /**
     * @description: 任务重置
     * @method: resetTask
     * @param: {}
     * @return: void
     */
    resetTask() {
      this.$Bus.$emit("resetTask");
    },

    /**
     * @description: 位置查询
     * @method: getLocation
     * @param: {}
     * @return: void
     */
    getLocation() {
      this.$Bus.$emit("getLocation", this.rowCard);
    }
  }
};
</script>

<style scoped lang="scss">
.left-tree-box {
  position: absolute;
  font-size: 14px;
}
.el-tree {
  padding-right: 20px;
  min-width: 260px;
}
/deep/ .el-tree-node__content:hover {
  background-color: #e5f4fa;
}
.message-content {
  position: fixed;
  left: 40px;
  top: 100px;
  box-shadow: 0 0 3px rgba(0, 0, 0, 0.3);
  background-color: #fff;
  z-index: 99999999;
  cursor: pointer;

  .message-content-ul {
    padding: 10px 0;
    margin: 0;
  }

  .message-content-li {
    font-size: 14px;
    line-height: 28px;
    padding: 0 20px;
    color: #8d9a97;
  }
  .message-content-li:hover {
    background-color: #6acdc9;
    color: #fff;
  }
}
</style>