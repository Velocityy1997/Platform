<template>
  <div id="header-center" v-cloak v-clickoutside="outsideClose">
    <ul class="header-center-ul">
      <li
        v-for="(item, index) in list"
        :key="index"
        class="header-center-li"
        :class="{active: isActive===index}"
        @click="changeRouter(index, $event)"
        ref="list"
      >
        <div class="img"></div>
        <div class="text">{{item.name}}</div>
        <el-collapse-transition v-model="activeName" accordion @change="handleChange">
          <ul
            class="header-center-ul2"
            v-if="item.children!=null || item.children!=undefined"
            v-show="isShow===index"  
            ref="item"
          >
            <li
              class="header-li"
              v-for="(listItem, index) in item.children"
              :key="index"
              @click.stop="changeRoutes(index)"
            >{{listItem.name}}</li>
          </ul>
        </el-collapse-transition>
      </li>
    </ul>
  </div>
</template>

<script>
import CollapseTransition from "element-ui/lib/transitions/collapse-transition";

export default {
  inject: ["reload"],
  name: "header-left",
  data() {
    return {
      list1: [
        {
          name: "实时监控"
        },
        {
          name: "通信管理",
          children: [
            {
              name: "短信管理"
            },
            {
              name: "历史任务管理"
            },
            {
              name: "预置电文管理"
            },
            {
              name: "黑名单管理"
            }
          ]
        },
        {
          name: "系统管理",
          children: [
            {
              name: "用户管理"
            },
            {
              name: "北斗卡管理"
            },
            {
              name: "终端管理"
            },
            {
              name: "指挥机管理"
            },
            {
              name: "区域管理"
            },
            {
              name: "日志管理"
            },
            {
              name: "订单管理"
            }
          ]
        },
        {
          name: "系统设置"
        }
      ],
      list: [],
      isActive: 0,
      isShow: 0,
      screenRole: false,
      activeName: '1',

    };
  },
  directives: {
    clickoutside: {
      bind(el, binding, vnode) {
        function documentHandler(e) {
          if (el.contains(e.target)) {
            return false;
          }
          if (binding.expression) {
            binding.value(e);
          }
        }

        function KeyUp(e) {
          if (e.keyCode == 27) {
            if (binding.expression) {
              binding.value(e);
            }
          }
        }
        el.__vueClickOutSize__ = documentHandler;
        el.__vueKeyup__ = KeyUp;

        document.addEventListener("keyup", KeyUp);
        document.addEventListener("click", documentHandler);
      },
      unbind(el, binding) {
        document.removeEventListener("click", el.__vueClickOutSize__);
        delete el.__vueClickOutSize__;

        document.removeEventListener("keyup", el.__vueKeyup__);
        delete el.__vueKeyup__;
      }
    }
  },
  mounted() {
    this.judgeAdmin();
  },
  methods: {
    handleChange(val){
      console.log(val)
    },
    outsideClose() {
      this.isShow = false;
    },
    judgeAdmin() {
      if (this.$store.state.userType == 0) {
        this.list = [
          {
            name: "实时监控"
          },
          {
            name: "通信管理",
            children: [
              {
                name: "短信管理"
              },
              {
                name: "历史任务管理"
              },
              {
                name: "预置电文管理"
              },
              {
                name: "黑名单管理"
              }
            ]
          },
          {
            name: "系统管理",
            children: [
              {
              name: "用户管理"
            },
            {
              name: "北斗卡管理"
            },
            {
              name: "终端管理"
            },
            {
              name: "指挥机管理"
            },
            {
              name: "区域管理"
            },
            {
              name: "日志管理"
            },
            {
              name: "订单管理"
            }
            ]
          },
          {
            name: "系统设置"
          }
        ];
      } else {
        this.list = this.list1;
      }
    },
    changeRouter(index) {
      this.isActive = index;
      this.isShow = index;

      if (index === 3) {
        this.$router.push({ path: "../../main/setting" });
      } else if (index === 0) {
        this.$router.push({ path: "../../main" });
      }
    },
    // 刷新当前页路由
    refreshCurrentRoute(pathObj, isActive) {
      if (this.$route.path == pathObj.path) {
        this.reload();
      } else {
        this.$router.push(pathObj);
      }
    },

    changeRoutes(index) {
      this.isShow = 0;

      if (this.isActive == 1 && index == 0) {
        this.refreshCurrentRoute({ path: "/main/msgManagement" });   
      }
      if (this.isActive == 1 && index == 1) {
        this.refreshCurrentRoute({ path: "/main/pastTaskManagement" });
      }
      if (this.isActive == 1 && index == 2) {
        this.refreshCurrentRoute({ path: "/main/telegramManagement" });
      }
      if (this.isActive == 1 && index == 3) {
        this.refreshCurrentRoute({ path: "/main/blackList" });
      }
      if (this.isActive == 2 && index == 0) {
        this.refreshCurrentRoute({ path: "/main/userManagement" });
      }
      if (this.isActive == 2 && index == 1) {
        this.refreshCurrentRoute({ path: "/main/cardManagement" });
      }
      if (this.isActive == 2 && index == 2) {
        this.refreshCurrentRoute({ path: "/main/terminal" });
      }
      if (this.isActive == 2 && index == 3) {
        this.refreshCurrentRoute({ path: "/main/aircraft" });
      }
      if (this.isActive == 2 && index == 4) {
        this.refreshCurrentRoute({ path: "/main/District" });
      }
      if (this.isActive == 2 && index == 5) {
        this.refreshCurrentRoute({ path: "/main/logManagement" });
      }
      if (this.isActive == 2 && index == 6) {
        this.refreshCurrentRoute({ path: "/main/orderManagement" });
      }
    }
  }
};
</script>

<style scoped lang="scss">
.header-center-ul {
  width: 480px;
  padding: 0;
  margin: 0 auto;
  display: flex;
  // padding-left: 20%;

  .header-center-li {
    flex: 1;
    list-style: none;
    display: inline-block;
    vertical-align: top;
    color: #95d2e3;
    text-align: center;
    cursor: pointer;
    border-bottom: 2px solid transparent;
    border-left: 1px solid transparent;
    border-right: 1px solid transparent;
    padding-top: 8px;
    overflow: hidden;

    .img {
      width: 58px;
      height: 49px;
      background: url(~assets/img/main/real-time.png) 0 0 no-repeat;
      background-size: 100% 100%;
      margin: 0 auto;
    }
    .text {
      line-height: 30px;
      font-size: 16px;
    }

    .header-center-ul2 {
      position: fixed;
      top: 90px;
      text-align: center;
      width: 120px;
      background-color: #001b24;
      -webkit-box-shadow: 0 0 4px rgba(51, 51, 51, 0.6);
      box-shadow: 0 0 4px rgba(51, 51, 51, 0.6);
      border-radius: 0 0 5px 5px;
      .header-li {
        line-height: 30px;
      }
      .header-li:hover {
        background-color: #95d2e3;
        color: #001b24;
      }
    }
  }
  .header-center-li:hover,
  .active {
    background-color: #0b242c;
    border-bottom: 2px solid #00fff6;
    border-left: 1px solid #535353;
    border-right: 1px solid #535353;
  }
  .header-center-li:nth-child(2) .img {
    background: url(~assets/img/main/message.png) 0 0 no-repeat;
  }
  .header-center-li:nth-child(3) .img {
    background: url(~assets/img/main/system.png) 0 0 no-repeat;
  }
  .header-center-li:nth-child(4) .img {
    background: url(~assets/img/main/system-set.png) 0 0 no-repeat;
  }
}
</style>