<template>
  <div class="app-container manage-view">
    <el-form
      ref="from"
      :model="from"
      :rules="rules"
      label-width="100px"
      class="demo-ruleForm"
    >
      <div class="set_btn">
        <el-button type="primary" round @click="submitForm('from')"
          >保存</el-button
        >
        <el-button type="primary" round>放弃</el-button>
        <!-- <div class="set_btn" @click="submitForm('from')">保存</div> -->
      </div>
      <el-form-item
        label="New View"
        prop="name"
        class="form-small"
        size="small"
      >
        <el-input v-model="from.name" />
      </el-form-item>
      <el-form-item label="Scope" prop="scope" size="small" class="form-small">
        <el-select v-model="from.scope" placeholder="请选择适用范围">
          <el-option label="Project" value="project" />
          <el-option label="Sprint" value="sprint" />
        </el-select>
      </el-form-item>
      <el-form-item label="Status" prop="status" class="form-small">
        <el-radio v-model="radio3" label="1">Private</el-radio>
        <el-radio v-model="radio3" label="2">Public</el-radio>
      </el-form-item>
      <el-form-item label="Filter" prop="scope">
        <div class="filter-item">
          <el-row>
            <el-col :span="4">
              <el-select v-model="from.scope" size="small" placeholder="status">
                <el-option label="Project" value="project" />
                <el-option label="Sprint" value="sprint" /> </el-select
            ></el-col>
          </el-row>
        </div>
      </el-form-item>

      <div class="table">
        <el-button type="text" :disabled="multiple">批量删除</el-button>
        <el-table
          :data="viewData"
          :header-cell-style="tableHeader"
          stripe
          style="width: 100%"
          @row-click="toEdit"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" width="55" />
          <el-table-column prop="title" label="View Title" />
          <el-table-column prop="scope" label="Scope" />
          <el-table-column prop="parent" label="Parent" />
          <el-table-column prop="owner" label="Owner" />
          <el-table-column prop="craeted" label="Created" />
          <el-table-column prop="modified" label="Modified" />
          <el-table-column label="Action">
            <template>
              <span class="table-btn">删除</span>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-form>
  </div>
</template>
<script>
export default {
  name: 'Manageview',
  data() {
    return {
      tableHeader: {
        color: '#d4dce3',
        background: '#003d79'
      },
      from: {
      },
      radio1: '1',
      radio2: '1',
      radio3: '1',
      value1: '',
      rules: {
        name: [
          { required: true, message: '请输入视图名称', trigger: 'blur' }
        ]
      },

      viewData: [
        {
          title: 'view2',
          scope: 'sprint',
          parent: 'view1',
          owner: 'Jun',
          craeted: '2020-12-23',
          modified: '2020-12-23'
        },
        {
          title: 'view2',
          scope: 'sprint',
          parent: 'view1',
          owner: 'Jun',
          craeted: '2020-12-23',
          modified: '2020-12-23'
        }
      ], // 表格数据
      multipleSelection: [], // 选择的表格
      multiple: true // 非多个禁用
    }
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          alert('submit!')
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },

    handleSelectionChange(val) {
      this.multipleSelection = val
      this.multiple = !val.length
    },
    toEdit() {

    }
  }
}
</script>
<style lang="scss" scoped>
@import "index.scss";
</style>
