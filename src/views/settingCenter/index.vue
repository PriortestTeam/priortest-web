<template>
  <div class="setting-center">
    <el-tabs v-model="activeName">
      <el-tab-pane label="下拉框字段设置" name="dropdown">
        <dropDwonSetting v-if="activeName == 'dropdown'" />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import dropDwonSetting from "./dropDownSetting/index.vue";
export default {
  components: {
    dropDwonSetting,
  },
  data() {
    return {
      activeName: "dropdown",
    };
  },
};
</script>
<style lang="scss">
.setting-center {
  width: 100%;
  // height: calc(100vh - 61px);
  box-sizing: border-box;
  padding: 20px;
  // overflow: hidden;
}
</style>
