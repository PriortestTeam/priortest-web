<template>
  <section class="app-main">
    <transition name="fade-transform" mode="out-in">
      <router-view />
    </transition>
    <!-- <keep-alive>
      <router-view v-if="$route.meta.noCache" :key="key"></router-view>
    </keep-alive>
    <router-view v-if="!$route.meta.noCache" :key="key"></router-view> -->
  </section>
</template>

<script>
export default {
  name: 'AppMain',
  computed: {
    key () {
      return this.$route.path
    }
  }
}
</script>

<style scoped>
.app-main {
  /*50 = navbar  */
  /* min-height: calc(100vh - 50px); */
  width: 100%;
  position: relative;
  flex: 1;
  overflow-x: hidden;
  overflow-y: auto;
}
</style>

<style lang="scss">
// fix css style bug in open el-dialog
.el-popup-parent--hidden {
  .fixed-header {
    padding-right: 15px;
  }
}
</style>
