<template>
  <div class="message-content" id="message-content">
    <!-- <ul class="message-content-ul">
      <li class="message-content-li" v-for="(item, index) in list" :key="index">
        <span class="text">{{item.text}}</span>
      </li>
    </ul> -->
  </div>
</template>

// <script>
// export default {
//   name: "message-content",
//   data() {
//     return {
//       list: [
//         { icon: "", text: "通信" },
//         { icon: "", text: "指令导航" },
//         { icon: "", text: "位置查询"},
//         { icon: "", text: "显示轨迹" }
//       ],
//       isShow: false
//     };
//   }
// };
// </script>

// <style scoped lang="scss">
// .message-content {
//   position: fixed;
//   left: 40px;
//   top: 100px;
//   box-shadow: 0 0 3px rgba(0, 0, 0, 0.3);
//   background-color: #fff;
//   z-index: 999;
//   cursor: pointer;

//   .message-content-li{
//     font-size: 14px;
//     line-height: 28px;
//     padding:0 20px;
//     color: #8d9a97;
//   }
//   .message-content-li:hover{
//     background-color: #6acdc9;
//     color: #fff;
//   }
// }

// </style>