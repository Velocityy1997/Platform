<template>
  <div id="map-box" class="map">
    <div
      style="background: rgb(215, 225, 255) ; height: 31px;line-height:31px; width:100%;"
      align="right"
    >
      <a id="top_status" style="padding-right:20px;">
        <img
          style="padding-right:10px;margin-bottom:6px;vertical-align: middle;"
          :src="imgSrc"
          title="系统提示"
          @click="initServiceState()"
        />
        <span style="text-align:left;font-weight:bold;" type="text" title="电量">{{batteryStatus}}</span>
        <span style="text-align:left;font-weight:bold;padding-left: 15px;" title="信号" type="text">{{baudsInfo}}</span>
      </a>
    </div>
    <!-- 电量点击对话框 -->
    <el-dialog title="系统状态" :visible.sync="dialogVisible" width="30%">
      <div class="itemStatus">IC状态：&nbsp;&nbsp;{{ICStatus}}</div>
      <div class="itemStatus">硬件状态：&nbsp;&nbsp;{{hardwareStatus}}</div>
      <div class="itemStatus">入站状态：&nbsp;&nbsp;{{stationStatus}}</div>
      <div class="itemStatus">通信服务：&nbsp;&nbsp;{{commuStatus}}</div>
      <div class="itemStatus">云服务：&nbsp;&nbsp;{{cloudService}}</div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>

    <div id="map" class="map"></div>
    <div id="tip_dlg" style="padding:5px;"></div>
    <div class="gridBox-msgtable" style="width: 100%; margin-top: 0px;">
      <el-tabs v-model="activeName" type="card" @tab-click="handleClick" style="font-size: 16px; ">
        <el-tab-pane label="最新信息" name="first" style="padding: 5px 15px 5px;">
          <el-table :data="newInfo" style="width: 100%;">
            <el-table-column prop="startTime" label="时间" width="200"></el-table-column>
            <el-table-column prop="taskSender" label="发送方" width="100"></el-table-column>
            <el-table-column prop="taskReceiver" label="接受方" width="100"></el-table-column>
            <el-table-column prop="taskType" label="类型" width="100"></el-table-column>
            <el-table-column prop="taskDescription" label="状态" width="250"></el-table-column>
            <el-table-column prop="taskContent" label="内容"></el-table-column>
          </el-table>
          <div class="block" style="margin-top: 5px; margin-bottom: 5px;">
            <el-pagination
              layout="total, sizes, prev, pager, next, jumper"
              :current-page.sync="currPage"
              :page-size="pageSize"
              :page-sizes="[3]"
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :total="total"
              style="text-align: center;"
            ></el-pagination>
          </div>
        </el-tab-pane>
        <el-tab-pane label="待执行任务" name="second">
          <el-table :data="ExecuteTask" style="width: 100%;">
            <el-table-column prop="startTime" label="时间" width="200"></el-table-column>
            <el-table-column prop="sender" label="发送方" width="150"></el-table-column>
            <el-table-column prop="receiver" label="接受方" width="150"></el-table-column>
            <el-table-column prop="type" label="类型" width="150"></el-table-column>
            <el-table-column prop="content" label="内容"></el-table-column>
          </el-table>
          <div class="block" style="margin-top: 5px; margin-bottom: 5px;">
            <el-pagination
              layout="total, sizes, prev, pager, next, jumper"
              :current-page.sync="ExecurrPage"
              :page-size="ExepageSize"
              :page-sizes="[3]"
              @size-change="handSizeChange"
              @current-change="handCurrentChange"
              :total="total2"
              style="text-align: center;"
            ></el-pagination>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
import {
  getPosition,
  getAllPosion,
  getRoute,
  getTipData,
  getTerminalHisPositions,
  getLocation,
  getFinishTask
} from "network/mainRuequest";

import {
  getNewMsgList,
  getTime,
  getExecuteTaskList
} from "network/mainRuequest1";

export default {
  name: "map-box",
  mounted() {
    this.init();

    this._getDataToServer(); // 获取路线
    this.getZhjLocation(); // 指挥机位置定位到中心
    this.getTerminalLocations(); // 获取所有终端位置

    this.stateBarRefresh(); // 获取电量信息
    this.getOnceLocation(); // 获取某个终端的信息
  },
  data() {
    return {
      baudsInfo: "", // 信号
      batteryStatus: "", // 电量
      imgSrc: "", // 状态
      currPage: 1,
      pageSize: 3,
      ExecurrPage: 1,
      ExepageSize: 3,
      activeName: "first",
      newInfo: [],
      ExecuteTask: [],
      total: 0,
      total2: 0,
      dialogVisible: false, //电源绿点对话框
      ICStatus: "", //IC状态
      hardwareStatus: "", //硬件状态
      stationStatus: "", //入站状态
      commuStatus: "", //通信服务
      cloudService: "", //云服务
      map: null,
      mapUrl: "http://www.google.cn/maps/vt?lyrs=m@189&gl=cn&x={x}&y={y}&z={z}",
      options: {
        lng: "cn",
        //serverIP:'127.0.0.1',
        serverIP: "192.168.0.177",
        mapDefaultLevel: 14,
        //domain: 'http://192.168.0.88'
        domain: ""
      },
      local: {
        cn: {
          position: "坐标：",
          my_position: "本机位置",
          zoom_in: "放大",
          zoom_out: "缩小",
          distance: "距离:",
          bearing: "角度:",
          language_sel_lab: "语言",
          language_sel_item_cn: "中文",
          language_sel_item_en: "英文",
          setting_dlg_btn_save: "保存",
          setting_dlg_btn_cancel: "取消",
          setting_dlg_title: "系统设置",
          outFence: "跃出电子围栏"
        },
        en: {
          position: "coordinate：",
          my_position: "The native place",
          zoom_in: "zoom in",
          zoom_out: "zoom out",
          distance: "distance:",
          bearing: "bearing:",
          language_sel_lab: "language",
          language_sel_item_cn: "chinese",
          language_sel_item_en: "english",
          setting_dlg_btn_save: "save",
          setting_dlg_btn_cancel: "cancel",
          setting_dlg_title: "system setting",
          outFence: "out of fence"
        }
      },

      // + 和 - 按钮
      _zoomCtrl: null,
      _btnCentre: null,
      _levelCtrl: null, // 地图级别
      _satBaseMapLayerGroup: null, //
      _streetMapLayerGroup: null,

      // 小地图控件
      _miniMapBaseVectorMapLayer: null,
      _miniMapLayerGroup: null,
      _miniMapCtrl: null,
      zhiMarker: null,

      terminalLayer: null,
      _fenceBar: null,

      _routeBar: null,
      dataSavedInServer: null
    };
  },
  created: function() {
    this.getNewMsg();
    this.getExecuteTask();
    // // 最新消息
    // window.setInterval(() => {
    //   setTimeout(this.getNewMsg(), 0);
    // }, 5000);
    // // 待执行任务
    // window.setInterval(() => {
    //   setTimeout(this.getExecuteTask(), 0);
    // }, 5000);

    // -----------------------
    // window.setInterval(() => {
    //   this.getFinishTask(); // 本机定位轮询
    // }, 1000);
  },
  methods: {
    handleClick(tab, event) {},
    handleSizeChange(val) {
      this.pageSize = val;
    },
    handleCurrentChange(val) {
      this.currPage = val;
    },
    handSizeChange(val) {
      this.ExepageSize = val;
    },
    handCurrentChange(val) {
      this.ExecurrPage = val;
    },
    getNewMsg() {
      let params = {
        rows: this.pageSize,
        page: this.currPage
      };
      getNewMsgList(params).then(res => {
        this.newInfo = res.data.rows;
        this.total = res.data.records;
      });
    },
    getExecuteTask() {
      let params = {
        rows: this.ExepageSize,
        page: this.ExecurrPage
      };
      getExecuteTaskList(params).then(res => {
        this.ExecuteTask = res.data.rows;
        this.total2 = res.data.records;
      });
    },
    init() {
      let _this = this;
      _this.map = L.map("map", {
        attributionControl: false,
        zoomControl: false
      }).setView([34.3468421, 108.9365887], 14);

      L.tileLayer(this.mapUrl, {
        minZoom: 3,
        maxZoom: 17,
        Subdomains: []
      }).addTo(_this.map);

      //鼠标位置控件
      L.control
        .mousePosition({
          separator: ",",
          lngFirst: true,
          numDigits: 6,
          prefix: this.local[this.options.lng].position
        })
        .addTo(_this.map);

      //地图级数控件
      this._levelCtrl = new L.Control.LevelControl({
        lng: this.options.lng
      }).addTo(_this.map);

      //比例尺控件
      L.control.scale({ maxWidth: 200, imperial: false }).addTo(_this.map);
      // 鹰眼控件
      let vectorMapUri = this.mapUrl
        .replace("{server}", this.options.lng == "en" ? "eng" : "hot")
        .replace("{serverIP}", this.options.serverIP);
      //eng 英文
      this._vectorBaseMapLayer = L.tileLayer(vectorMapUri, {
        minZoom: 8,
        maxZoom: 17
      })
        .addTo(_this.map)
        .setZIndex(0);

      this._vectorBaseMapLayer = L.tileLayer(this.mapUrl, {
        minZoom: 3,
        maxZoom: 17,
        Subdomains: []
      })
        .addTo(_this.map)
        .setZIndex(0);

      this._satBaseMapLayerGroup = L.layerGroup();

      L.tileLayer(this.mapUrl, {
        minZoom: 0,
        maxZoom: 8
      }).addTo(this._satBaseMapLayerGroup);

      L.tileLayer(this.mapUrl, {
        minZoom: 3,
        maxZoom: 17,
        Subdomains: []
      }).addTo(this._satBaseMapLayerGroup);

      // ---------- _streetMapLayerGroup --------------
      this._streetMapLayerGroup = L.layerGroup();

      L.tileLayer(this.mapUrl, {
        minZoom: 0,
        maxZoom: 8,
        Subdomains: []
      }).addTo(this._streetMapLayerGroup);

      // ------------ 右下角小地图 ---------------------
      this._miniMapBaseVectorMapLayer = L.tileLayer(vectorMapUri, {
        minZoom: 0,
        maxZoom: 13,
        Subdomains: []
      });
      this._miniMapLayerGroup = L.layerGroup([this._miniMapBaseVectorMapLayer]);
      this._miniMapCtrl = new L.Control.MiniMap(this._miniMapLayerGroup, {
        toggleDisplay: true
      }).addTo(_this.map);

      //+, - 按钮
      this._zoomCtrl = L.control
        .zoom({
          position: "bottomright",
          zoomInTitle: this.local[this.options.lng].zoom_in,
          zoomOutTitle: this.local[this.options.lng].zoom_out
        })
        .addTo(_this.map);

      // ------------------ NavBar控件右上角两个按钮 ----------------------
      this._narbar = new L.Control.NavBar(
        {
          route: _this._onNavbarRoute,
          tool: _this._onNavbarTool,
          test: _this._onNavbarTest,
          serverIP: _this.options.serverIP
        },
        _this,
        { lng: this.options.lng }
      ).addTo(_this.map);

      this._postionbar = new L.Control.PostionBar(_this.map, {
        lng: this.options.lng,
        serverIP: this.options.serverIP
      });
      this._postionbar.setMiniMap(this._miniMapCtrl, this._miniMapLayerGroup);

      this._measureArea = new L.Control.Measure({
        primaryLengthUnit: "meters",
        secondaryLengthUnit: "kilometers",
        primaryAreaUnit: "sqmeters",
        secondaryLengthUnit: "hectares",
        activeColor: "#ff0000",
        completedColor: "#0000ff",
        localization: this.options.lng
      });

      this._measureRuler = new L.Control.Ruler({
        position: "topright", // Leaflet control position option
        circleMarker: {
          // Leaflet circle marker options for points used in this plugin
          color: "red",
          radius: 2
        },
        lineStyle: {
          // Leaflet polyline options for lines used in this plugin
          color: "red",
          dashArray: "1,6"
        },
        lengthUnit: {
          // You can use custom length units. Default unit is kilometers.
          display: "km", // This is the display value will be shown on the screen. Example: 'meters'
          decimal: 2, // Distance result will be fixed to this value.
          factor: null, // This value will be used to convert from kilometers. Example: 1000 (from kilometers to meters)
          label: this.local[this.options.lng].distance
        },
        angleUnit: {
          display: "&deg;", // This is the display value will be shown on the screen. Example: 'Gradian'
          decimal: 2, // Bearing result will be fixed to this value.
          factor: null, // This option is required to customize angle unit. Specify solid angle value for angle unit. Example: 400 (for gradian).
          label: this.local[this.options.lng].bearing
        }
      });

      this._btnCentre = L.easyButton(
        "fa fa-location-arrow",
        this.getZhjLocation,
        this.local[this.options.lng].my_position,
        null
      ).addTo(_this.map);
      this._btnCentre.setPosition("bottomright");

      this._fenceBar = new L.Control.FenceBar(_this.map, {
        lng: this.options.lng
      });

      this._fenceBar.setEventHanlder(_this._fenceEventHandler, _this);
      if (
        this.dataSavedInServer != null &&
        this.dataSavedInServer.fence != null
      ) {
        this._fenceBar.deserializeFenceFromArray(this.dataSavedInServer.fence);
      }

      this._routeBar = new L.Control.RouteBar(
        { lng: this.options.lng },
        _this.map
      );
      this._routeBar.setEventHanlder(this._routeEventHandler, this);
      if (
        this.dataSavedInServer != null &&
        this.dataSavedInServer.route != null
      ) {
        this._routeBar.deserializeRouteFromArray(this.dataSavedInServer.route);
      }
    },
    _routeEventHandler(msg) {
      this._saveDataToServer();
    },

    // 定位标五角星
    getZhjLocation() {
      let _this = this;
      getPosition()
        .then(res => {
          let { data } = res;
    
          let icon = L.icon({
            iconUrl: require("assets/img/map/wujiaoxing.jpg"),
            iconSize: [48, 48],
            iconAnchor: [12, 43],
            popupAnchor: [0, -52],
            shadowUrl: require("assets/img/map/marker-shadow.png"),
            shadowSize: [41, 41],
            shadowAnchor: [0, 51]
          });

          if (data.data != null) {
            if (_this.zhiMarker != null) {
              _this.map.removeLayer(_this.zhiMarker);
            }

            _this.zhiMarker = L.marker(
              L.latLng([data.data.latitude, data.data.longitude]),
              { icon: icon }
            ).bindPopup(_this._createDetail2(data.data));

            _this.zhiMarker.dataModel = data.data;
            _this.zhiMarker.shape = "marker";
            _this.zhiMarker.application = "routebar";
            _this.map.addLayer(_this.zhiMarker);

            _this.map.setView(
              L.latLng([data.data.latitude, data.data.longitude]),
              _this.options.mapDefaultLevel
            );
          }
        })
        .catch(err => console.log("err"));
    },
    // 挂载提示框  leaflet-marker-icon leaflet-zoom-animated leaflet-interactive
    _createDetail2(obj) {
      var div = L.DomUtil.create("div", "", "");
      var p = L.DomUtil.create("p", "text-left font-weight-bold", div);
      var content = "";

      if (obj.hasOwnProperty("lat"))
        content += "经纬度:" + obj.lng + "° , " + obj.lat + "°" + "<br/>";
      if (obj.hasOwnProperty("name"))
        content += "指挥机名称：" + obj.name + "<br/>";
      if (obj.hasOwnProperty("cardNum"))
        content += "指挥机卡号：" + obj.cardNum + "<br/>";
      if (obj.hasOwnProperty("longitude"))
        content +=
          "经纬度:" + obj.longitude + "° , " + obj.latitude + "°" + "<br/>";

      p.innerHTML = content;

      return div;
    },
    _createDetail1(obj) {
      let div = L.DomUtil.create("div", "", "");
      let p = L.DomUtil.create("p", "text-left font-weight-bold", div);
      let content = "";

      if (obj.hasOwnProperty("name"))
        content += "终端名称：" + obj.name + "<br/>";
      if (obj.hasOwnProperty("cardNum"))
        content += "终端卡号：" + obj.cardNum + "<br/>";
      if (obj.hasOwnProperty("longitude"))
        content +=
          "经纬度：" + obj.longitude + "° , " + obj.latitude + "°" + "<br/>";
      if (obj.hasOwnProperty("locateTime"))
        content += "定位时间：" + obj.locateTime + "<br/>";
      p.innerHTML = content;
      return div;
    },

    // 获取所有终端位置
    getTerminalLocations() {
      let icon = L.icon({
        iconUrl: require("assets/img/map/marker-green.png"),
        iconSize: [21, 25],
        iconAnchor: [9, 25],
        popupAnchor: [0, -25],
        shadowUrl: require("assets/img/map/marker-shadow.png"),
        shadowSize: [41, 41],
        shadowAnchor: [14, 41]
      });

      getAllPosion()
        .then(res => {
          let { data } = res.data;
          let _this = this;
          _this.terminalLayer = L.featureGroup();
          for (let i = 0; i < data.length; i++) {
            let mk = L.marker(L.latLng([data[i].latitude, data[i].longitude]), {
              icon: icon /* this._routeBar._createIcon('devIco') */
            }).bindPopup(_this._createDetail1(data[i]));
            mk.dataModel = data[i];
            mk.shape = "marker";
            mk.application = "routebar";
            mk.addTo(_this.terminalLayer);
          }

          _this.terminalLayer.addTo(_this.map);
        })
        .catch(err => console.log(err));
    },
    _saveRouteDataToServer() {
      let dat = {
        route: this._routeBar.serializeRouteToArray()
      };
      let json = JSON.stringify(dat);
    },

    //
    _fenceEventHandler(msg) {
      this._saveDataToServer();
    },
    _saveDataToServer() {
      let dat = {
        lng: this.options.lng,
        fence: this._fenceBar.serializeFenceToArray(),
        route: this._routeBar.serializeRouteToArrayAddOrUpdate()
      };
      let json = JSON.stringify(dat);

      getTipData("/route/handleRoute", {
        mapData: json
      })
        .then(res => {
          let { data } = res;
          showTipDialog("#tip_dlg", "提示", data.message, 2000);
        })
        .catch(err => console.log("提示信息获取错误"));
    },

    // 右上角两个按钮
    _onNavbarTool(state) {
      if (state == 1) {
        this._measureRuler.addTo(this.map);
        this._measureArea.addTo(this.map);
      } else {
        this._measureArea.remove();
        this._measureRuler.remove();
      }
    },
    _onNavbarRoute(state) {
      if (state == 1) {
        this._routeBar.addTo(this.map);
      } else {
        this._routeBar.remove();
      }
    },
    _onNavbarTest() {
      let lat = 34.3468421;
      let lon = 108.9365887;

      let devs_json =
        '{"data":[{"altitude":"0.0","cardNum":"142342","gpstime":"2019-04-02 16:19:55","latitude":"34.1605","latitudefloat":34.1595,"longitude":"108.97702","longitudefloat":108.97702,"name":"142342","numInZone":"---","remark":"","sjState":0,"sjStatedesc":"未安装，未引导","status":0,"terminalAeraId":null,"terminalAeraName":"朝鲜","txLevel":null,"type":1,"typeDesc":"区内终端","tzState":0,"tzStatedesc":"出厂状态，未安装任何数据","uuid":"91623a81-5d61-44bd-a69b-86c496989556","zone":"---"},{"altitude":"0.0","cardNum":"142339","gpstime":"2019-05-29 11:23:09","latitude":"34.1605","latitudefloat":34.1595,"longitude":"108.97707","longitudefloat":108.97707,"name":"142339","numInZone":"---","remark":"","sjState":0,"sjStatedesc":"未安装，未引导","status":0,"terminalAeraId":null,"terminalAeraName":"实时","txLevel":null,"type":1,"typeDesc":"区内终端","tzState":0,"tzStatedesc":"出厂状态，未安装任何数据","uuid":"94b9dd71-09b8-4be2-940d-a346ddc3ce0e","zone":"---"},{"altitude":"0.0","cardNum":"142338","gpstime":"2019-05-29 16:54:54","latitude":"34.160527","latitudefloat":34.159527,"longitude":"108.97713","longitudefloat":108.97713,"name":"142338","numInZone":"---","remark":"","sjState":0,"sjStatedesc":"未安装，未引导","status":0,"terminalAeraId":null,"terminalAeraName":"陕西省","txLevel":null,"type":1,"typeDesc":"区内终端","tzState":0,"tzStatedesc":"出厂状态，未安装任何数据","uuid":"d5321496-85a9-486e-9070-a459ee4f3c4d","zone":"---"},{"altitude":"0.0","cardNum":"142346","gpstime":"2019-04-01 14:22:43","latitude":"34.1605","latitudefloat":34.1595,"longitude":"108.97702","longitudefloat":108.97702,"name":"142346","numInZone":"---","remark":"","sjState":0,"sjStatedesc":"未安装，未引导","status":0,"terminalAeraId":null,"terminalAeraName":"平壤大使馆","txLevel":null,"type":1,"typeDesc":"区内终端","tzState":0,"tzStatedesc":"出厂状态，未安装任何数据","uuid":"f3639dbd-36a0-4959-8b99-dff890d3d87f","zone":"---"}],"message":null,"status":0}';
      let centre_json =
        '{"data":{"altitude":"0","gpstime":"2019-05-29 17:28:57.0","latitude":"34.1605","longitude":"108.977104","name":null,"number":null,"uuid":"b2d72703-c4e6-4457-ad65-e4c4c7b66142"},"message":"定位成功","status":1}';

      let devs = JSON.parse(devs_json).data;
      let center = JSON.parse(centre_json).data;
      for (let i = 0, len = devs.length; i < len; i++) {
        let dev = devs[i];
        this.updateDevice(dev);
      }
    },
    updateCenter(extObj) {
      let obj = extObj;
      let pt = {
        uuid: obj.uuid,
        title: obj.name == null ? "指挥机" : obj.name,
        id: obj.number == null ? "000000" : obj.number,
        position: obj.latitude.toString() + "," + obj.longitude.toString(),
        lat: obj.latitude,
        lng: obj.longitude,
        time: obj.gpstime,
        type: "center",
        detail: ""
      };

      this.map.setView(
        L.latLng([pt.lat, pt.lng]),
        this.options.mapDefaultLevel
      );

      let f_ret = this._fenceBar.checkFences(pt);
      if (f_ret.outFences.length > 0) {
        this._notify(
          pt.title + "(" + pt.id + ")" + this.local[this.options.lng].outFence
        ) +
          ": " +
          f_ret.outFences.join();
      }
      this._postionbar.updatePoint(pt, false);
      this._postionbar.updateTrack(pt.id, [pt], true, true, true);
    },

    // 获取路线
    _getDataToServer() {
      let _this = this;
      getRoute("/route/getAll")
        .then(res => {
          
          let mapData = res.data.data;
          for (let i = 0; i < mapData.length; i++) {
            this._routeBar.createRoute({ title: mapData[i].routeName }); //添加路线
            let json = JSON.parse(mapData[i].content);

            for (let j = 0; j < json.wayPoints.length; j++) {
              this._routeBar.createPoint2({
                lng: json.wayPoints[j].lng,
                lat: json.wayPoints[j].lat,
                title: json.rote,
                type: json.wayPoints[j].type,
                pos: json.wayPoints[j].index
              });
            }
            for (let j = 0; j < json.awayPoints.length; j++) {
              this._routeBar.createPoint2({
                lng: json.awayPoints[j].lng,
                lat: json.awayPoints[j].lat,
                title: json.rote,
                type: json.awayPoints[j].type,
                pos: json.awayPoints[j].index
              });
            }
            for (let j = 0; j < json.purpose.length; j++) {
              this._routeBar.createPoint2({
                lng: json.purpose[j].lng,
                lat: json.purpose[j].lat,
                title: json.rote,
                type: json.purpose[j].type,
                pos: json.purpose[j].index
              });
            }
          }
        })
        .catch(err => console.log("获取路线数据err"));
    },
    getHistoryTrack(startTime, endTime, item) {
      let _this = this;
      let data = {
        starttime: startTime,
        endtime: endTime,
        uuid: item.uuid
      };
      let url = "/terminalTask/getHistoryLocation";
      getTerminalHisPositions(url, data)
        .then(res => {
          let { data } = res;
          for (let i in data.data) {
            let pt = data.data[i];
            pt.lat = pt.latitude;
            pt.lng = pt.longitude;
          }
          _this._postionbar.updateHistory(item.id, data.data, true, true);
        })
        .catch(err => console.log("err"));
    },

    //
    updateDevice(extObj) {
      let obj = extObj;
      let pt = {
        uuid: obj.uuid,
        title: obj.name,
        id: obj.cardNum,
        position: obj.latitude.toString() + "," + obj.longitude.toString(),
        lat: obj.latitude,
        lng: obj.longitude,
        time: obj.gpstime,
        type: "device",
        detail: "",
        terminalAeraName: obj.terminalAeraName,
        zone: obj.zone,
        numInZone: obj.numInZone,
        typeDesc: obj.typeDesc
      };

      let f_ret = this._fenceBar.checkFences(pt);
      if (f_ret.outFences.length > 0) {
        this._notify(
          pt.title +
            "(" +
            pt.id +
            ")" +
            this.local[this.options.lng].outFence +
            ": " +
            f_ret.outFences.join()
        );
      }
      this.map.setView(L.latLng(pt.lat, pt.lng), this.options.mapDefaultLevel);
      this._postionbar.updatePoint(pt, true);
      this._postionbar.updateTrack(pt.id, [pt], true, true, true);
    },
    _onNavbarDevMan(state) {
      let _this = this;
      if (state == 1) {
        this._loadAllDevices();
        this._postionbar.addTo(_this.map);
      } else {
        this._postionbar.remove();
      }
    },
    _loadAllDevices() {
      let url = this.options.domain + "/BAISTMonitor/getBdLocateList.action";
      getBdLocateList(url)
        .then(res => {
          for (var i = 0; i < data.data.length; i++) {
            var obj = data.data[i];
            if (obj.gpstime != "") {
              this.updateDevice(obj);
            }
          }
        })
        .catch(err => console.log("err"));
    },

    // -----------------------
    _onNavbarRoadnet(state) {
      let _this = this;

      if (state == 1) {
        this._streetMapLayerGroup.addTo(_this.map).setZIndex(1);
      } else {
        this._streetMapLayerGroup.remove();
      }
    },
    _onNavbarSatmap(state) {
      let _this = this;
      if (state == 1) {
        this._vectorBaseMapLayer.remove();
        this._satBaseMapLayerGroup.addTo(_this.map).setZIndex(0);
      } else {
        this._satBaseMapLayerGroup.remove();
        this._vectorBaseMapLayer.addTo(_this.map).setZIndex(0);
        if (_this.map.hasLayer(this._streetMapLayerGroup)) {
          this._streetMapLayerGroup.remove();
        }
      }
    },
    _onNavbarFence(state) {
      let _this = this;
      if (state == 1) {
        this._fenceBar.addTo(_this.map);
      } else {
        this._fenceBar.remove();
      }
    },
    _onNavbarTool(state) {
      let _this = this;
      if (state == 1) {
        this._measureRuler.addTo(_this.map);
        this._measureArea.addTo(_this.map);
      } else {
        this._measureArea.remove();
        this._measureRuler.remove();
      }
    },
    _onNavbarSetting() {
      this.showSettingDialog();
    },

    showSettingDialog() {
      let _this = this;
      let content = L.DomUtil.create("div", "");
      $(content).css("z-index", "100");

      let div = L.DomUtil.create("div", "input-group", content);
      let span = L.DomUtil.create("span", "input-group-addon", div);
      span.innerHTML = this.local[this.options.lng].language_sel_lab;
      let input = L.DomUtil.create("select", "form-control", div);
      $(input).attr({ id: "map_setting_dialog_lng_input" });
      $(input).append(
        "<option>" +
          _this.local[_this.options.lng].language_sel_item_cn +
          "</option>"
      );
      $(input).append(
        "<option>" +
          _this.local[_this.options.lng].language_sel_item_en +
          "</option>"
      );
      $(content).dialog({
        autoOpen: true,
        title: _this.local[_this.options.lng].setting_dlg_title,
        modal: true,
        resizable: false,
        buttons: [
          {
            text: _this.local[_this.options.lng].setting_dlg_btn_save,
            click: function() {
              let lng = $("#map_setting_dialog_lng_input").val();
              if (lng == _this.local[_this.options.lng].language_sel_item_cn) {
                _this.options.lng = "cn";
              } else if (
                lng == _this.local[_this.options.lng].language_sel_item_en
              ) {
                _this.options.lng = "en";
              }

              _this._saveDataToServer();
              $(this).dialog("destroy");
            }
          },
          {
            text: _this.local[_this.options.lng].setting_dlg_btn_cancel,
            click: function() {
              $(this).dialog("destroy");
            }
          }
        ]
      });
    },
    _notify(msg) {
      $.notify(
        {
          icon: "fa fa-exclamation-triangle",
          message: msg
        },
        {
          type: "danger",
          offset: {
            x: 70,
            y: 60
          },
          newest_on_top: true
        }
      );
    },
    _tranPosition(objs) {
      for (let i in objs) {
        let segs = objs[i].position.split(",");
        objs[i].lat = segs[0];
        objs[i].lng = segs[1];
      }
      return objs;
    },

    // 电量信息
    stateBarRefresh() {
      this.$Bus.$on("systemState", result => {
        this.batteryStatus = result.batteryStatus;
        this.baudsInfo = result.baudsInfo;
        result.status == "1"
          ? (this.imgSrc = "./img/stateStop.png")
          : (this.imgSrc = "./img/stateRun.png");
      });
    },
    initServiceState() {
      this.dialogVisible = true;
      let params = {};
      getTime(params).then(res => {
        this.ICStatus = res.data.icStatus;
        this.hardwareStatus = res.data.hardwardStatus;
        this.stationStatus = res.data.instationStatus;
        if (res.data.serviceState == 0) {
          this.commuStatus = "正常";
        } else if (res.data.serviceState == 1) {
          this.commuStatus = "异常";
        }
        if (res.data.rhptState == 0) {
          this.cloudService = "正常";
        } else if (res.data.rhptState == 1) {
          this.cloudService = "异常";
        }
      });
    },

    /**
     * @description: 位置查询
     * @method: getOnceLocation
     * @param: {}
     * @return: void
     */
    getOnceLocation() {
      let _this = this;
      this.$Bus.$on("getLocation", card => {
        getLocation({ card })
          .then(res => {
            let { data } = res;
            if (data.status == 2) {
              this.$alert(`该终端没有位置信息！`, "系统提示", {
                confirmButtonText: "确定"
              });
            } else {
              _this.map.setView(
                L.latLng([data.data.latitude, data.data.longitude])
              );
            }
          })
          .catch(err => console.log(err));
      });
    },

    /**
     * @description: 本机定位轮询
     * @method: getFinishTask
     * @param: {}
     * @return: void
     */
    getFinishTask() {
      getFinishTask()
        .then(res => {
          let { data } = res;
          if (data.status === "1") {
            this.getZhjLocation();
          }
        })
        .catch(err => console.log(err));
    }
  }
};
</script>

<style>
.map {
  width: 100%;
  height: 80%;
}

/*  */
.leaflet-control-minimap-toggle-display {
  background-image: url("~assets/img/map/toggle.svg");
  background-size: cover;
}

/* 测量工具图标 */
.leaflet-ruler {
  background-image: url("~assets/img/map/ruler_icon.png");
}
.leaflet-ruler:hover {
  background-image: url("~assets/img/map/ruler_icon-colored.png"); /* <div>Icons made by <a href="http://www.freepik.com" title="Freepik">Freepik</a> from <a href="http://www.flaticon.com" title="Flaticon">www.flaticon.com</a> is licensed by <a href="http://creativecommons.org/licenses/by/3.0/" title="Creative Commons BY 3.0" target="_blank">CC 3.0 BY</a></div> */
}
.leaflet-ruler-clicked {
  background-image: url("~assets/img/map/ruler_icon-colored.png");
}
.leaflet-control-measure .leaflet-control-measure-toggle,
.leaflet-control-measure .leaflet-control-measure-toggle:hover {
  background-image: url("~assets/img/map/rulers.png");
}
.leaflet-retina .leaflet-control-measure .leaflet-control-measure-toggle,
.leaflet-retina .leaflet-control-measure .leaflet-control-measure-toggle:hover {
  background-image: url("~assets/img/map/rulers.png");
}

/* 标记小图标 */
.leaflet-draw-toolbar a {
  background-image: url("~assets/img/map/spritesheet.png");
  background-image: linear-gradient(transparent, transparent),
    url("~assets/img/map/spritesheet.svg");
}
.leaflet-retina .leaflet-draw-toolbar a {
  background-image: url("~assets/img/map/spritesheet-2x.png");
  background-image: linear-gradient(transparent, transparent),
    url("~assets/img/map/spritesheet.svg");
}

.ui-dialog {
  z-index: 9999 !important;
}
#tip_dlg {
  z-index: 99999;
}
.el-table td,
.el-table th {
  padding: 8px 0px;
}
.el-tabs__header {
  margin: 0 0 0px;
}
#pane-first {
  padding: 0px 15px !important;
}
.el-dialog__body {
  font-size: 16px;
}
.itemStatus {
  text-indent: 80px;
  line-height: 45px;
}
</style>

