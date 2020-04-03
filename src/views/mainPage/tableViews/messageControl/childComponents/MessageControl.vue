<template>
  <div class="message-control">
    <table-control>
      <div slot="left">
        <control-left></control-left>
      </div>
      <div slot="center">
        <control-center></control-center>
      </div>
    </table-control>
  </div>
</template>

<script>
import TableControl from "components/content/table/tableContent/TableControl";
import ControlLeft from "./ControlLeft";
import ControlCenter from "./ControlCenter";

export default {
  name: "message-control",
  data() {
    return {};
  },
  components: {
    TableControl,
    ControlLeft,
    ControlCenter
  }
};
</script>


<style scoped lang="scss">

</style>