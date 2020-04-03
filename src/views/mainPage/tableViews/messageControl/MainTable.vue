<template>
  <div class="main-table">
    <table-title>
      <div slot="name" class="text">{{name}}</div>
    </table-title>
    <message-control></message-control>
    <message-table></message-table> 
    <pagenation></pagenation>    
  </div>
</template>

<script>
import TableTitle from "components/content/table/tableContent/TableTitle"
import MessageTable from "components/content/table/tableContent/MessageTable"
import Pagenation from "components/content/table/tableContent/Pagenation"

import MessageControl from "tableViews/messageControl/childComponents/MessageControl"

export default {
  name: "main-table",
  data() {
    return {
      name: ""
    };
  },
  components: {
    TableTitle,
    MessageControl,
    MessageTable,
    Pagenation
  },
  created() {
    this.name = "111";
  }
};
</script>

<style scoped lang="scss">
.main-table {
  background: #fff;
  margin: 0;
  padding: 8px 20px;
}
</style>