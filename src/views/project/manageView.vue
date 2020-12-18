<template>
  <div class="app-container manage-view">
    <el-form
      :model="from"
      :rules="rules"
      ref="from"
      label-width="100px"
      class="demo-ruleForm"
    >
      <div>
        <div class="set_btn" @click="submitForm('from')">Save</div>
        <div class="set_btn">Give Up</div>
      </div>
      <el-form-item label="New View" prop="name" class="form-small">
        <el-input size="small" v-model="from.name"></el-input>
      </el-form-item>
      <el-form-item label="Scope" prop="scope" class="form-small">
        <el-select
          v-model="from.scope"
          size="small"
          placeholder="请选择适用范围"
        >
          <el-option label="Project" value="project"></el-option>
          <el-option label="Sprint" value="sprint"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="Filter" prop="scope">
        <div class="filter-item">
          <el-row>
            <el-col :span="4">
              <el-select v-model="from.scope" size="small" placeholder="status">
                <el-option label="Project" value="project"></el-option>
                <el-option
                  label="Sprint"
                  value="sprint"
                ></el-option> </el-select
            ></el-col>
            <el-col :span="4">
              <el-select v-model="from.scope" size="small" placeholder="Is">
                <el-option label="Project" value="project"></el-option>
                <el-option
                  label="Sprint"
                  value="sprint"
                ></el-option> </el-select
            ></el-col>
            <el-col :span="4">
              <el-select v-model="from.scope" size="small" placeholder="Open">
                <el-option label="Project" value="project"></el-option>
                <el-option
                  label="Sprint"
                  value="sprint"
                ></el-option> </el-select
            ></el-col>
            <el-col :span="2" class="add-del">
              <i class="el-icon-circle-plus"></i>
              <i class="el-icon-error"></i>
            </el-col>
          </el-row>
          <el-row>
            <el-radio v-model="radio2" label="1">And</el-radio>
            <el-radio v-model="radio2" label="2">Or</el-radio>
          </el-row>
        </div>
        <div class="filter-item">
          <el-row>
            <el-col :span="4">
              <el-select
                v-model="from.scope"
                size="small"
                placeholder="Create Date"
              >
                <el-option label="Project" value="project"></el-option>
                <el-option
                  label="Sprint"
                  value="sprint"
                ></el-option> </el-select
            ></el-col>
            <el-col :span="4">
              <el-select v-model="from.scope" size="small" placeholder="Range">
                <el-option label="Project" value="project"></el-option>
                <el-option
                  label="Sprint"
                  value="sprint"
                ></el-option> </el-select
            ></el-col>
            <el-col :span="7">
              <el-date-picker
                size="small"
                v-model="value1"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
              >
              </el-date-picker
            ></el-col>
            <el-col :span="2" class="add-del">
              <i class="el-icon-circle-plus"></i>
              <i class="el-icon-error"></i>
            </el-col>
          </el-row>
          <el-row>
            <el-radio v-model="radio1" label="1">And</el-radio>
            <el-radio v-model="radio1" label="2">Or</el-radio>
          </el-row>
        </div>
      </el-form-item>
      <el-form-item label="Project" prop="project" class="form-small">
        <el-select
          v-model="from.project"
          size="small"
          placeholder="请选择适用项目"
        >
          <el-option label="Project A" value="project"></el-option>
          <el-option label="Project B" value="sprint"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="Status" prop="status" class="form-small">
        <el-radio v-model="radio3" label="1">Private</el-radio>
        <el-radio v-model="radio3" label="2">Public</el-radio>
      </el-form-item>
      <div class="table">
        <el-button type="text" :disabled="multiple">Batch Delete</el-button>
        <el-table
          :data="viewData"
          :header-cell-style="tableHeader"
          stripe
          style="width: 100%"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" width="55"> </el-table-column>
          <el-table-column prop="title" label="View Title" />
          <el-table-column prop="scope" label="Scope" />
          <el-table-column prop="parent" label="Parent" />
          <el-table-column prop="owner" label="Owner" />
          <el-table-column prop="craeted" label="Created" />
          <el-table-column prop="modified" label="Modified" />
          <el-table-column label="Action">
            <template>
              <span class="table-btn">Edit</span>
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
      from: {
      },
      radio1: '1',
      radio2: '1',
      radio3: '1',
      value1: '',
      rules: {
        name: [
          { required: true, message: '请输入视图名称', trigger: 'blur' }
        ],
      },
      tableHeader: {
        color: '#d4dce3',
        background: '#003d79'
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
      ],//表格数据
      multipleSelection: [],//选择的表格
      multiple: true,//非多个禁用
    }
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          alert('submit!');
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },

    handleSelectionChange(val) {
      this.multipleSelection = val;
      this.multiple = !val.length
    }
  }
}
</script>
<style lang="scss" scoped>
@import "index.scss";
</style>