<template>
  <div class="app-container add-project add-form">
    <el-form
      :model="from"
      :rules="rules"
      ref="from"
      label-width="100px"
      class="demo-ruleForm"
    >
      <div>
        <div class="set_btn" @click="submitForm('from')">Save and New</div>
        <div class="set_btn">Save And Back</div>
        <div class="set_btn">Save</div>
        <div class="set_btn" @click="giveupBack('from')">Give Up</div>
        <el-button type="text">Create Custom Filed</el-button>
      </div>
      <div class="form-box">
        <el-form-item label="Project title" prop="title">
          <el-input size="small" v-model="from.title"></el-input>
        </el-form-item>
        <el-form-item label="status" prop="status">
          <el-select
            v-model="from.status"
            placeholder="请选择项目状态"
            clearable
            size="small"
          >
            <el-option label="Progerss" value="Progerss" />
            <el-option label="Closed" value="Closed" />
            <el-option label="Plan" value="Plan" />
          </el-select>
        </el-form-item>
        <el-form-item label="Project title" prop="title">
          <el-input size="small" v-model="from.title"></el-input>
        </el-form-item>
        <el-form-item label="Description" prop="description">
          <el-input
            size="small"
            type="textarea"
            maxlength="100"
            show-word-limit
            :autosize="{ minRows: 3, maxRows: 5 }"
            v-model="from.description"
          ></el-input>
        </el-form-item>
      </div>
    </el-form>
  </div>
</template>
<script>
export default {
  name: 'Projectadd',
  data() {
    return {
      from: {
        status: 'Progerss'
      },
      rules: {
        title: [
          { required: true, message: '请输入活动名称', trigger: 'blur' },
          { max: 15, message: '应小于15字符', trigger: 'blur' }
        ],
      }
    }
  },
  methods: {
    //重置表单
    resetFields(formName) {
      this.from = {
        title: undefined,
        description: undefined,
        status: 'Progerss'
      }
    },
    //提交
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
    //放弃并且返回
    giveupBack(formName) {
      this.resetForm(formName)
      this.returntomenu(this)
    },
  }
}
</script>
<style lang="scss" scoped>
@import "index.scss";
</style>