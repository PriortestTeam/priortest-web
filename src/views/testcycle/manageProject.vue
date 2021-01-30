<template>
  <div class="app-container manage-project">
    <div class="project-item">
      <b>Project A</b>
      <div class="action">
        <el-button type="text">Delete</el-button>
        <el-button type="text">Edit</el-button>
        <el-button type="text">Obsolete</el-button>
      </div>
    </div>
    <div class="project-item">
      <b>Project B</b>
      <div class="action">
        <el-button type="text">Delete</el-button>
        <el-button type="text">Edit</el-button>
        <el-button type="text">Obsolete</el-button>
      </div>
    </div>
    <div class="project-item">
      <b>Project C</b>
      <div class="action">
        <el-button type="text">Delete</el-button>
        <el-button type="text">Edit</el-button>
        <el-button type="text">Obsolete</el-button>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'Manageproject',
  data() {
    return {

    }
  },
  mounted() {

  },
  methods: {

  }
}
</script>
<style lang="scss" scoped>
@import "index.scss";
</style>
