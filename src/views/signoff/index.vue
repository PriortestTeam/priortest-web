<template>
  <div class="signoff-container app-container">
    <el-form
      ref="from"
      :model="from"
      :rules="rules"
      label-width="100px"
      class="demo-ruleForm"
      label-position="left"
    >
      <div>
        <div class="set_btn">Generate</div>
      </div>

      <el-form-item label="Project" prop="scope" class="form-small">
        <el-select
          v-model="from.scope"
          size="small"
          placeholder="请选择Project"
        >
          <el-option label="ProjectA" value="project" />
          <el-option label="ProjectB" value="sprint" />
        </el-select>
      </el-form-item>

      <el-form-item label="Version" prop="scope" class="form-small">
        <el-row class="radiu">
          <el-checkbox-group v-model="versionList">
            <el-checkbox label="Current Version" />
            <el-checkbox label="Latest Version" />
            <el-checkbox label="复选框 C">
              <el-select
                v-model="from.version"
                size="mini"
                placeholder="1.0"
              >
                <el-option label="1.0" value="1.0" />
                <el-option label="2.0" value="2.0" />
              </el-select>
            </el-checkbox>
          </el-checkbox-group>
        </el-row>
      </el-form-item>
      <el-form-item label="TestCycle" prop="scope" class="form-small">
        <el-row class="radiu">
          <el-checkbox-group v-model="TestleList">
            <el-checkbox label="Current Version" />
            <el-checkbox label="Latest Version" />
            <el-checkbox label="复选框 C">
              <el-select
                v-model="from.testCycle"
                size="mini"
                placeholder="Version 1.0 - Regression"
              >
                <el-option label="Version 1.0 - Regression" value="1.0" />
                <el-option label="Version 2.0 - Regression" value="2.0" />
              </el-select>
            </el-checkbox>
          </el-checkbox-group>
        </el-row>
      </el-form-item>
      <el-form-item label="lssue Scope" prop="scope" class="form-small">
        <el-row>
          <el-checkbox-group v-model="lssueList">
            <el-row :span="4">
              <el-checkbox label="" />
            </el-row>
            <el-row :span="4">
              <el-checkbox label="Fixed" />
            </el-row>
            <el-row :span="4">
              <el-checkbox label="Closed" />
            </el-row>
            <el-row :span="4">
              <el-checkbox label="Opend" />
            </el-row>
            <el-row :span="4">
              <el-checkbox label="Assigned" />
            </el-row>
            <el-row :span="4">
              <el-checkbox label="Rejected" />
            </el-row>
          </el-checkbox-group>
        </el-row>
      </el-form-item>

      <el-form-item label="Signiature" prop="scope" class="form-small">
        <span class="Signi-Upload">Upload E signiature</span>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'Dashboard',
  data() {
    return {
      from: {},
      rules: {},
      versionList: ['Current Version'],
      TestleList: ['Current Version'],
      lssueList: ['', 'Fixed', 'Closed', 'Opend', 'Assigned', 'Rejected']
    }
  },
  computed: {
    ...mapGetters([
      'name'
    ])
  },
  mounted: {
  }
}
</script>

<style lang="scss" scoped>
@import "index.scss";

</style>
