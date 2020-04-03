<template>
  <div id="user" class="user">
    <div id="nav-bar" class="nav">
      <span class="title">位置：</span>
      <span class="name-parent">系统设置</span>
    </div>
    <div class="corresSet">
      <div class="corresSet-title">通信设置</div>
      <div class="corresSet-content">
        通信频度：
        <el-input-number size="small" v-model="corresNum" :step="5"></el-input-number>（秒）
        <el-button size="mini" style="margin-left: 30px;" @click="setFrequency()">设置</el-button>
      </div>
    </div>
    <div class="corresSet">
      <div class="corresSet-title">串口设置</div>
      <div class="corresSet-content">
        端口：
        <el-select v-model="port_value" placeholder="请选择" size="small">
          <el-option v-for="item in 100" :key="item" :label="'COM'+item" :value="'COM'+item"></el-option>
        </el-select>
      </div>

      <div class="corresSet-content baud-content">
        波特率：
        <el-select v-model="baud_value" placeholder="请选择" size="small">
          <el-option
            v-for="(item,i) in baud_options"
            :key="i"
            :label="item.value"
            :value="item.value"
          ></el-option>
        </el-select>
        <el-button size="mini" style="margin-left: 30px;" @click="setPorts()">设置</el-button>
      </div>
    </div>
  </div>
</template>


<script>
import { getAxios } from "network/api";
import navBar from "views/mainPage/mainBody/nav";
import { frequency } from "network/mainRuequest";
import { setPort } from "network/mainRuequest";
import { settingMes } from "network/mainRuequest";

export default {
  name: "user",
  data() {
    return {
      currPage: 1,
      pageSize: 2,
      activeName: "first",
      corresNum: 60,
      baud_options: [
        {
          value: "1200"
        },
        {
          value: "2400"
        },
        {
          value: "4800"
        },
        {
          value: "7200"
        },
        {
          value: "9600"
        },
        {
          value: "19200"
        },
        {
          value: "38400"
        },
        {
          value: "57600"
        },
        {
          value: "115200"
        }
      ],
      port_value: "",
      baud_value: ""
    };
  },
  components: {
    navBar
  },
  created() {
    this.getMes();
  },
  methods: {
    getMes() {
      settingMes().then(res => {
        if (res.data.success == false) {
          // this.$store.commit('open', res.data.message);
          this.$message.error(res.data.message);
        } else {
          this.corresNum = res.data.bdtimeFrequence;
          this.baud_value=res.data.baudRate;
          this.port_value=res.data.port;
        }
      });
    },
    handleClick(tab, event) {},
    handleSizeChange(val) {
      this.pageSize = val;
      this.currPage = 1;
    },
    handleCurrentChange(val) {
      this.currPage = val;
    },
    onSubmit() {
      let formaddress = new FormData();
      formaddress.append("address", this.getstaffdetaill);
    },
    setFrequency() {
      let params = {
        rate: this.corresNum
      };
      frequency(params).then(res => {
        if (res.data.success == false) {
          // this.$store.commit('open', res.data.message);
          this.$message.error(res.data.message);
        } else {
          this.$message.success(res.data.message);
        }
      });
    },
    setPorts() {
      let params = {
        rate: this.baud_value,
        port: this.port_value
      };
      setPort(params).then(res => {
        if (res.data.success == false) {
          // this.$store.commit('open', res.data.message);
          this.$message.error(res.data.message);
        } else {
          this.$message.success(res.data.message);
        }
      });
    }
  }
};
</script>

<style lang="scss">
.user {
  width: 100%;
  height: 100%;
  padding: 5px 10px;
  position: relative;
  border: 1px solid #eee;
}

.nav {
  width: 100%;
  background: #e1eef3;
  font-size: 17px;
  color: #001b24;
  line-height: 50px;
  padding-left: 15px;
}
.corresSet {
  width: 100%;
  height: 45%;
  margin-top: 10px;
  box-shadow: 1px 1px 5px #888;
}
.corresSet .corresSet-title {
  width: 100%;
  height: 44px;
  font-size: 16px;
  font-weight: 600;
  line-height: 44px;
  text-indent: 18px;
  background-color: #e1eef3;
}
.corresSet-content {
  height: 38px;
  margin-top: 20px;
  margin-left: 48px;
  // background-color: red;
  font-size: 16px;
  line-height: 38px;
  float: left;
}
.el-input-number--small {
  width: 180px;
  margin-left: 24px;
}
.el-select {
  width: 150px;
  height: 30px;
}
.baud-content {
  float: left;
}
.el-table__header tr,
.el-table__header th {
  padding: 0;
  height: 36px;
}
.el-table__body tr,
.el-table__body td {
  padding: 0;
  height: 36px;
}
.el-tabs__header {
  margin: 0px 0px 0px;
}
.gridBox-msgtable {
  width: 40%;
}
</style>
