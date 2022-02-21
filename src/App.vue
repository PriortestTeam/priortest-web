<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
/* eslint-disable */
import _ from 'lodash'
export default {
  name: 'App'
}
</script>
<style lang="scss">
@import "@/styles/color.scss";
html, body {
  width: 100%;
  height: 100%;
}
body{
  background: $bodybg;
}

.el-form-item .el-select, .el-form-item .el-date-editor {
  width: auto;
}

</style>
