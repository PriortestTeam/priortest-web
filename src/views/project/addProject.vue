<template>
  <div class="app-container add-form add-project">
    <el-form
      ref="from"
      :model="from"
      :rules="rules"
      label-width="100px"
      class="demo-ruleForm"
    >
      <div>
        <div class="set_btn" @click="submitForm('from')">保存并新建</div>
        <div class="set_btn" @click="saveBack">保存并返回</div>
        <div class="set_btn">保存</div>
        <div class="set_btn" @click="giveupBack('from')">放弃</div>
        <router-link to="/publicview/customfiled">
          <el-button type="text">新增字段</el-button>
        </router-link>
      </div>
      <div class="form-box">
        <el-form-item label="Project title" prop="title">
          <el-input v-model="from.title" size="small" />
        </el-form-item>
        <el-row>
          <el-col :span="8">
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
              </el-select> </el-form-item
          ></el-col>
          <el-col :span="8">
            <el-form-item label="Report To" prop="report">
              <el-input v-model="from.report" size="small" /> </el-form-item
          ></el-col>
          <el-col :span="8">
            <el-form-item label="Customer" prop="customer">
              <el-select
                v-model="from.customer"
                placeholder="请选择"
                clearable
                size="small"
              >
                <el-option label="暂无" value="" />
              </el-select> </el-form-item
          ></el-col>
        </el-row>
        <el-form-item label="Description" prop="description">
          <el-input
            v-model="from.description"
            size="small"
            type="textarea"
            maxlength="100"
            show-word-limit
            :autosize="{ minRows: 3, maxRows: 5 }"
          />
        </el-form-item>
        <el-form-item
          v-for="domain in from.domains"
          :key="domain.key"
          class="dele-input"
          :label="domain.lable"
          :prop="domain.lable"
          :rules="{
            required: true,
            message: domain.lable + '不能为空',
            trigger: 'blur',
          }"
        >
          <el-input v-model="domain.value" width="70%" size="small" /><el-button
            type="text"
            @click.prevent="removeFiled(domain)"
            >删除</el-button
          >
        </el-form-item>
        <el-upload
          class="upload-demo"
          action="https://jsonplaceholder.typicode.com/posts/"
          :on-preview="handlePreview"
          :on-remove="handleRemove"
          :before-remove="beforeRemove"
          multiple
          :limit="3"
          :on-exceed="handleExceed"
          :file-list="from.fileList"
        >
          <el-button size="small" type="primary">Attachment</el-button>
          <!-- <div slot="tip" class="el-upload__tip">
            只能上传jpg/png文件，且不超过500kb
          </div> -->
        </el-upload>
      </div>
    </el-form>
  </div>
</template>
<script>
export default {
  name: 'Addproject',
  data() {
    return {
      from: {
        status: 'Progerss',
        domains: [],
        fileList: []
      },
      rules: {
        title: [
          { required: true, message: '请输入活动名称', trigger: 'blur' },
          { max: 15, message: '应小于15字符', trigger: 'blur' }
        ]
      }

    }
  },
  methods: {
    // 重置表单
    resetFields(formName) {
      this.from = {
        title: undefined,
        description: undefined,
        report: undefined,
        customer: undefined,
        status: 'Progerss',
        fileList: []
      }
    },
    // 提交
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
    // 放弃并且返回
    giveupBack(formName) {
      this.$route.meta.noCache = false
      this.resetForm(formName)
      this.returntomenu(this)
    },
    // 保存并且返回
    saveBack() {
      this.$route.meta.noCache = true
      this.returntomenu(this)
    },
    // 上传
    handleRemove(file, fileList) {
      console.log(file, fileList)
    },
    handlePreview(file) {
      console.log(file)
    },
    handleExceed(files, fileList) {
      this.$message.warning(`当前限制选择 3 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`)
    },
    beforeRemove(file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`)
    }

  }

}
</script>
<style lang="scss" scoped>
@import "index.scss";
</style>
