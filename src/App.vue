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
body{
  background: $bodybg;
}

</style>
