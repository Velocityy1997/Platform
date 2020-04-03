<template>
<div>
 <div id="Content">
   <div class="content-top">
       <div class="content-top-right">电量：100% 信号：1,4,2,1,2,1</div>
   </div>
   <div id="map-container" class="map-container">

   </div>

 </div>


</div>

</template>


<script>
export default {
  name: 'Content',
  name: "mapView",
  data(){
     return{
         map: null,
          OSMUrl: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
     }

  },
  methods:{

  },
  components: {},
   mounted() {
    this.map = this.$utils.map.createMap("map-container");

    // 设施地图视图 中心位置
    this.map.setView([34.03, -118.15], 13);

     // 加载 open street map和mapbox 图层服务
   this.$utils.map.createTileLayer(this.map, this.OSMUrl, {maxZoom: 19})
       
   }
}


</script>


<style scoped>
#Content{
    width: 100%;
    height: 520px;
    margin-top: 6px;
    margin-left: 6px;
    background-color: red;
    box-shadow: 1px 1px 5px #888
}
.content-top{
    width: 100%;
    height: 36px;
    background-color: #E5F4FA;
}
.content-top-right{
    height: 36px;
    margin-right: 15px;
    background-color: #E5F4FA;
    float: right;
    line-height: 36px;
}
.map-container{
    width: 100%;
    height: 484px;
    background-color: yellow;
}
</style>