<template>
  <div id="map-box" class="map">
    <div id="mymap" class="my-map"></div>
  </div>
</template>

<script>
import { getTerminalHistoryTrack, getBdLocateList } from "network/mainRuequest";

export default {
  name: "map-box",
  data() {
    return {
      map: null,
      mapUrl: "http://www.google.cn/maps/vt?lyrs=m@189&gl=cn&x={x}&y={y}&z={z}",
      _navbar: null,
      _searchbar: null,
      _postionbar: null,

      _vectorBaseMapLayer: null,
      _satBaseMapLayerGroup: null,
      _streetMapLayerGroup: null,
      _gpsLayerGroup: null,
      _trackLayerGroup: null,
      _fenceLayerGroup: null,

      _miniMapBaseVectorMapLayer: null,
      _miniMapCtrl: null,
      _miniMapLayerGroup: null,
      index: 0,
      //tool
      _measureArea: null,
      _measureRuler: null,
      //
      _btnCentre: null,
      //level ctrl
      _levelCtrl: null,
      //zoom ctrl
      _zoomCtrl: null,
      //fence ctrl bar
      _fenceBar: null,
      //route ctrl bar
      _routeBar: null,
      dataSavedInServer: null,
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
      }
    };
  },
  mounted() {
    this.init();
    this.getTerminaltraces();
  },
  methods: {
    _createDetail2(obj) {
      let div = L.DomUtil.create("div", "", "");
      let p = L.DomUtil.create("p", "text-left font-weight-bold", div);
      let content = "";

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
    init() {
      let _this = this;
      var winWidth = 0;
      var winHeight = 0;

      if (
        document.documentElement &&
        document.documentElement.clientHeight &&
        document.documentElement.clientWidth
      ) {
        winHeight = document.documentElement.clientHeight;
        winWidth = document.documentElement.clientWidth;
      }

      if (this.dataSavedInServer != null) {
        this.options.lng = this.dataSavedInServer.lng;
      }

      $("#mymap").height(winHeight);
      $(window).resize(function() {
        if (
          document.documentElement &&
          document.documentElement.clientHeight &&
          document.documentElement.clientWidth
        ) {
          winHeight = document.documentElement.clientHeight;
          winWidth = document.documentElement.clientWidth;
        }
        $("#mymap").height(winHeight);
      });

      this.map = L.map("mymap", {
        attributionControl: false,
        zoomControl: false
      }).setView([34.3468421, 108.9365887], this.options.mapDefaultLevel);

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
      L.control
        .scale({
          maxWidth: 200,
          imperial: false
        })
        .addTo(_this.map);

      this._vectorBaseMapLayer = L.tileLayer(_this.mapUrl, {
        minZoom: 3,
        maxZoom: 17,
        Subdomains: []
      })
        .addTo(_this.map)
        .setZIndex(0);

      this._satBaseMapLayerGroup = L.layerGroup();
      L.tileLayer(_this.mapUrl, {
        minZoom: 0,
        maxZoom: 8
      }).addTo(this._satBaseMapLayerGroup);
      L.tileLayer(_this.mapUrl, {
        minZoom: 3,
        maxZoom: 17,
        Subdomains: []
      }).addTo(this._satBaseMapLayerGroup);

      this._streetMapLayerGroup = L.layerGroup();
      L.tileLayer(_this.mapUrl, {
        minZoom: 0,
        maxZoom: 8,
        Subdomains: []
      }).addTo(this._streetMapLayerGroup);

      this._miniMapBaseVectorMapLayer = L.tileLayer(_this.mapUrl, {
        minZoom: 0,
        maxZoom: 13,
        Subdomains: []
      });

      this._miniMapLayerGroup = L.layerGroup([this._miniMapBaseVectorMapLayer]);
      this._miniMapCtrl = new L.Control.MiniMap(this._miniMapLayerGroup, {
        toggleDisplay: true
      }).addTo(_this.map);
      //zoom ctrl
      this._zoomCtrl = L.control
        .zoom({
          position: "bottomright",
          zoomInTitle: this.local[this.options.lng].zoom_in,
          zoomOutTitle: this.local[this.options.lng].zoom_out
        })
        .addTo(_this.map);

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

      this._fenceBar = new L.Control.FenceBar(_this.map, {
        lng: this.options.lng
      });
      this._fenceBar.setEventHanlder(this._fenceEventHandler, this);
      if (
        this.dataSavedInServer != null &&
        this.dataSavedInServer.fence != null
      ) {
        this._fenceBar.deserializeFenceFromArray(this.dataSavedInServer.fence);
      }

      this._routeBar = new L.Control.RouteBar({
        lng: this.options.lng
      });
      this._routeBar.setEventHanlder(this._routeEventHandler, this);
      if (
        this.dataSavedInServer != null &&
        this.dataSavedInServer.route != null
      ) {
        this._routeBar.deserializeRouteFromArray(this.dataSavedInServer.route);
      }
    },

    //得到终端的历史轨迹
    getTerminaltraces(msg) {
      let _this = this;
      var query = location.hash.split("?");
      query[1] = query[1].replace(/%20/g, " ");
      query[1] = query[1].replace(/%3A/g, ":");
      var values = query[1].split("&");
      var pos = values[0].indexOf("=");
      var paramname = values[0].substring(0, pos);
      var value = values[0].substring(pos + 1);
      pos = values[1].indexOf("=");
      paramname = values[1].substring(0, pos);

      let startTime = values[1].substring(pos + 1);
      pos = values[2].indexOf("=");
      paramname = values[2].substring(0, pos);
      let endTime = values[2].substring(pos + 1);

      getTerminalHistoryTrack({
        card: value,
        startTime,
        endTime
      })
        .then(res => {
    
          let { data } = res;
          if (data.data !== "") {
            _this.map.setView(
              L.latLng([data.data[0].latitude, data.data[0].longitude]),
              _this.options.mapDefaultLevel
            );
          } else {
            _this.$alert(`${data.message}`, "系统提示", {
              confirmButtonText: "确定"
            });
            return;
          }
          _this.terminalLayer = L.featureGroup();
          _this.lineLayer = L.layerGroup();
          let pts = [];

          if (data.data.length > 0) {
            let mk = L.marker(
              L.latLng([data.data[0].latitude, data.data[0].longitude]),
              {
                icon: _this._routeBar._createIcon("qidian")
              }
            ).bindPopup(_this._createDetail1(data.data[0]));
            mk.dataModel = data.data[0];
            mk.shape = "marker";
            mk.application = "routebar";
            mk.addTo(_this.terminalLayer);
          }
          for (let i = 2; i < data.data.length - 2; i += 5) {
            let mk = L.marker(
              L.latLng([data.data[i].latitude, data.data[i].longitude]),
              {
                icon: _this._routeBar._createIcon("tujing")
              }
            ).bindPopup(_this._createDetail1(data.data[i]));
            mk.dataModel = data.data[i];
            mk.shape = "marker";
            mk.application = "routebar";
            mk.addTo(_this.terminalLayer);
          }
          if (data.data.length > 0) {
            let mk = L.marker(
              L.latLng([
                data.data[data.data.length - 1].latitude,
                data.data[data.data.length - 1].longitude
              ]),
              {
                icon: _this._routeBar._createIcon("zhongdian")
              }
            ).bindPopup(_this._createDetail1(data.data[data.data.length - 1]));
            mk.dataModel = data.data[data.data.length - 1];
            mk.shape = "marker";
            mk.application = "routebar";
            mk.addTo(_this.terminalLayer);
          }

          for (let i = 0; i < data.data.length; i++) {
            pts.push(L.latLng([data.data[i].latitude, data.data[i].longitude]));
            let pl = L.polyline(pts, {
              color: "red"
            }).addTo(_this.lineLayer);
          }
          _this.terminalLayer.addTo(_this.map);
          _this.lineLayer.addTo(_this.map);
          L.polylineDecorator(pts, {
            patterns: [
              {
                offset: 25,
                repeat: 50,
                symbol: L.Symbol.arrowHead({
                  pixelSize: 15,
                  pathOptions: {
                    fillOpacity: 1,
                    weight: 0
                  }
                })
              }
            ]
          }).addTo(_this.map);
          if (data.data.length > 0) {
            _this.map.setView(
              L.latLng([data.data[0].latitude, data.data[0].longitude]),
              _this.options.mapDefaultLevel
            );
          } else {
            this.$alert(`该终端没有历史位置信息！`, "系统提示", {
              confirmButtonText: "确定"
            });
          }
        })
        .catch(err => console.log(err));
    },

    _fenceEventHandler(msg) {
      this._saveDataToServer();
    },
    updateDevice(extObj) {
      let _this = this;
      var obj = extObj;
      var pt = {
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
      //var processed_pt = this._postionbar._nearest(pt);
      /*if(!this._fenceBar.isInFences(pt)){
					this._notify(pt.title + '(' + pt.id + ')' + this.local[this.options.lng].outFence);
				}*/

      var f_ret = this._fenceBar.checkFences(pt);
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
      _this.map.setView(L.latLng(pt.lat, pt.lng), this.options.mapDefaultLevel);
      this._postionbar.updatePoint(pt, true);
      this._postionbar.updateTrack(pt.id, [pt], true, true, true);
    },

    updateCenter(extObj) {
      let _this = this;
      var obj = extObj;
      var pt = {
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
      // ============================ STOP ======================================
      //var processed_pt = this._postionbar._nearest(pt);
      _this.map.setView(
        L.latLng([pt.lat, pt.lng]),
        this.options.mapDefaultLevel
      );
      /*if(!this._fenceBar.isInFences(pt)){
					this._notify(pt.title + '(' + pt.id + ')' + this.local[this.options.lng].outFence);
				}*/
      var f_ret = this._fenceBar.checkFences(pt);
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

    _onNavbarRoadnet(state) {
      if (state == 1) {
        this._streetMapLayerGroup.addTo(this.map).setZIndex(1);
      } else {
        this._streetMapLayerGroup.remove();
      }
    },

    _onNavbarSatmap(state) {
      if (state == 1) {
        this._vectorBaseMapLayer.remove();
        this._satBaseMapLayerGroup.addTo(this.map).setZIndex(0);
      } else {
        this._satBaseMapLayerGroup.remove();
        this._vectorBaseMapLayer.addTo(this.map).setZIndex(0);
        if (this.map.hasLayer(this._streetMapLayerGroup)) {
          this._streetMapLayerGroup.remove();
        }
      }
    },

    _onNavbarDevMan(state) {
      if (state == 1) {
        this._loadAllDevices();
        this._postionbar.addTo(this.map);
      } else {
        this._postionbar.remove();
      }
    },

    _onNavbarFence(state) {
      if (state == 1) {
        this._fenceBar.addTo(this.map);
      } else {
        this._fenceBar.remove();
      }
    },

    _onNavbarTool(state) {
      if (state == 1) {
        this._measureRuler.addTo(this.map);
        this._measureArea.addTo(this.map);
      } else {
        this._measureArea.remove();
        this._measureRuler.remove();
      }
    },

    _onNavbarSetting() {
      this.showSettingDialog();
    },

    _onNavbarTest() {
      var lat = 34.3468421,
        lon = 108.9365887;

      var devs_json =
        '{"data":[{"altitude":"0.0","cardNum":"142342","gpstime":"2019-04-02 16:19:55","latitude":"34.1595","latitudefloat":34.1595,"longitude":"108.97702","longitudefloat":108.97702,"name":"142342","numInZone":"---","remark":"","sjState":0,"sjStatedesc":"未安装，未引导","status":0,"terminalAeraId":null,"terminalAeraName":"朝鲜","txLevel":null,"type":1,"typeDesc":"区内终端","tzState":0,"tzStatedesc":"出厂状态，未安装任何数据","uuid":"91623a81-5d61-44bd-a69b-86c496989556","zone":"---"},{"altitude":"0.0","cardNum":"142339","gpstime":"2019-05-29 11:23:09","latitude":"34.1595","latitudefloat":34.1595,"longitude":"108.97707","longitudefloat":108.97707,"name":"142339","numInZone":"---","remark":"","sjState":0,"sjStatedesc":"未安装，未引导","status":0,"terminalAeraId":null,"terminalAeraName":"实时","txLevel":null,"type":1,"typeDesc":"区内终端","tzState":0,"tzStatedesc":"出厂状态，未安装任何数据","uuid":"94b9dd71-09b8-4be2-940d-a346ddc3ce0e","zone":"---"},{"altitude":"0.0","cardNum":"142338","gpstime":"2019-05-29 16:54:54","latitude":"34.159527","latitudefloat":34.159527,"longitude":"108.97713","longitudefloat":108.97713,"name":"142338","numInZone":"---","remark":"","sjState":0,"sjStatedesc":"未安装，未引导","status":0,"terminalAeraId":null,"terminalAeraName":"陕西省","txLevel":null,"type":1,"typeDesc":"区内终端","tzState":0,"tzStatedesc":"出厂状态，未安装任何数据","uuid":"d5321496-85a9-486e-9070-a459ee4f3c4d","zone":"---"},{"altitude":"0.0","cardNum":"142346","gpstime":"2019-04-01 14:22:43","latitude":"34.1595","latitudefloat":34.1595,"longitude":"108.97702","longitudefloat":108.97702,"name":"142346","numInZone":"---","remark":"","sjState":0,"sjStatedesc":"未安装，未引导","status":0,"terminalAeraId":null,"terminalAeraName":"平壤大使馆","txLevel":null,"type":1,"typeDesc":"区内终端","tzState":0,"tzStatedesc":"出厂状态，未安装任何数据","uuid":"f3639dbd-36a0-4959-8b99-dff890d3d87f","zone":"---"}],"message":null,"status":0}';
      var centre_json =
        '{"data":{"altitude":"0","gpstime":"2019-05-29 17:28:57.0","latitude":"34.1595","longitude":"108.977104","name":null,"number":null,"uuid":"b2d72703-c4e6-4457-ad65-e4c4c7b66142"},"message":"定位成功","status":1}';

      var devs = JSON.parse(devs_json).data;
      var center = JSON.parse(centre_json).data;
      for (var i = 0, len = devs.length; i < len; i++) {
        var dev = devs[i];
        this.updateDevice(dev);
      }
      this.updateCenter(center);

      var devs_json =
        '{"data":[{"altitude":"0.0","cardNum":"142342","gpstime":"2019-04-02 16:19:55","latitude":"34.1605","latitudefloat":34.1595,"longitude":"108.97702","longitudefloat":108.97702,"name":"142342","numInZone":"---","remark":"","sjState":0,"sjStatedesc":"未安装，未引导","status":0,"terminalAeraId":null,"terminalAeraName":"朝鲜","txLevel":null,"type":1,"typeDesc":"区内终端","tzState":0,"tzStatedesc":"出厂状态，未安装任何数据","uuid":"91623a81-5d61-44bd-a69b-86c496989556","zone":"---"},{"altitude":"0.0","cardNum":"142339","gpstime":"2019-05-29 11:23:09","latitude":"34.1605","latitudefloat":34.1595,"longitude":"108.97707","longitudefloat":108.97707,"name":"142339","numInZone":"---","remark":"","sjState":0,"sjStatedesc":"未安装，未引导","status":0,"terminalAeraId":null,"terminalAeraName":"实时","txLevel":null,"type":1,"typeDesc":"区内终端","tzState":0,"tzStatedesc":"出厂状态，未安装任何数据","uuid":"94b9dd71-09b8-4be2-940d-a346ddc3ce0e","zone":"---"},{"altitude":"0.0","cardNum":"142338","gpstime":"2019-05-29 16:54:54","latitude":"34.160527","latitudefloat":34.159527,"longitude":"108.97713","longitudefloat":108.97713,"name":"142338","numInZone":"---","remark":"","sjState":0,"sjStatedesc":"未安装，未引导","status":0,"terminalAeraId":null,"terminalAeraName":"陕西省","txLevel":null,"type":1,"typeDesc":"区内终端","tzState":0,"tzStatedesc":"出厂状态，未安装任何数据","uuid":"d5321496-85a9-486e-9070-a459ee4f3c4d","zone":"---"},{"altitude":"0.0","cardNum":"142346","gpstime":"2019-04-01 14:22:43","latitude":"34.1605","latitudefloat":34.1595,"longitude":"108.97702","longitudefloat":108.97702,"name":"142346","numInZone":"---","remark":"","sjState":0,"sjStatedesc":"未安装，未引导","status":0,"terminalAeraId":null,"terminalAeraName":"平壤大使馆","txLevel":null,"type":1,"typeDesc":"区内终端","tzState":0,"tzStatedesc":"出厂状态，未安装任何数据","uuid":"f3639dbd-36a0-4959-8b99-dff890d3d87f","zone":"---"}],"message":null,"status":0}';
      var centre_json =
        '{"data":{"altitude":"0","gpstime":"2019-05-29 17:28:57.0","latitude":"34.1605","longitude":"108.977104","name":null,"number":null,"uuid":"b2d72703-c4e6-4457-ad65-e4c4c7b66142"},"message":"定位成功","status":1}';

      var devs = JSON.parse(devs_json).data;
      var center = JSON.parse(centre_json).data;
      for (var i = 0, len = devs.length; i < len; i++) {
        var dev = devs[i];
        this.updateDevice(dev);
      }
    },
    _notify(msg) {
      $.notify(
        {
          //title: 'hahha',
          icon: "fa fa-exclamation-triangle",
          message: msg
        },
        {
          type: "danger",
          offset: {
            x: 70,
            y: 60
          },
          //delay:1000,
          newest_on_top: true
        }
      );
    },
    _tranPosition(objs) {
      for (var i in objs) {
        var segs = objs[i].position.split(",");
        objs[i].lat = segs[0];
        objs[i].lng = segs[1];
      }
      return objs;
    },
    showSettingDialog() {
      var content = L.DomUtil.create("div", "");
      $(content).css("z-index", "100");

      var div = L.DomUtil.create("div", "input-group", content);
      var span = L.DomUtil.create("span", "input-group-addon", div);
      span.innerHTML = this.local[this.options.lng].language_sel_lab;
      var input = L.DomUtil.create("select", "form-control", div);
      $(input).attr({
        id: "map_setting_dialog_lng_input"
      });
      $(input).append(
        "<option>" +
          this.local[this.options.lng].language_sel_item_cn +
          "</option>"
      );
      $(input).append(
        "<option>" +
          this.local[this.options.lng].language_sel_item_en +
          "</option>"
      );
      //$(input).val();

      $(content).dialog({
        autoOpen: true,
        title: this.local[this.options.lng].setting_dlg_title,
        modal: true,
        resizable: false,
        buttons: [
          {
            text: this.local[this.options.lng].setting_dlg_btn_save,
            click: function() {
              var lng = $("#map_setting_dialog_lng_input").val();
              if (
                lng == g_Main.local[g_Main.options.lng].language_sel_item_cn
              ) {
                g_Main.options.lng = "cn";
              } else if (
                lng == g_Main.local[g_Main.options.lng].language_sel_item_en
              ) {
                g_Main.options.lng = "en";
              }

              g_Main._saveDataToServer();
              $(this).dialog("destroy");
            }
          },
          {
            text: this.local[this.options.lng].setting_dlg_btn_cancel,
            click: function() {
              $(this).dialog("destroy");
            }
          }
        ]
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.map {
  display: flex;
  height: 100vh;

  .my-map {
    width: 100%;
  }
}
</style>

