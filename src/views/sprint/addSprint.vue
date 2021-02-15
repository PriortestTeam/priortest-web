<template>
  <div class="app-container add-form add-project">
    <el-form
      ref="projectFrom"
      :model="projectFrom"
      :rules="Projectrules"
      label-width="120px"
      class="demo-ruleForm"
    >
      <div>
        <el-button
          v-if="!projectFrom.id"
          type="primary"
          round
          @click="submitForm('projectFrom', false)"
          >保存并新建</el-button
        >
        <el-button
          v-if="!projectFrom.id"
          type="primary"
          round
          @click="submitForm('projectFrom', true)"
          >保存并返回</el-button
        >
        <el-button
          v-if="projectFrom.id"
          type="primary"
          round
          @click="submitForm('projectFrom')"
          >确认修改</el-button
        >
        <el-button type="primary" round @click="giveupBack('projectFrom')"
          >放弃</el-button
        >
        <router-link v-if="!projectFrom.id" to="/admincenter/admincenter">
          <el-button type="text">{{
            $t("lang.PublicBtn.CreateCustomField")
          }}</el-button>
        </router-link>
      </div>
      <div class="form-box">
        <el-form-item :label="$t('lang.Project.ProjectTitle')" prop="title">
          <el-input v-model="projectFrom.title" size="small" maxlength="15" />
        </el-form-item>
        <el-row>
          <el-col :span="8">
            <el-form-item
              size="small"
              :label="$t('lang.Project.Status')"
              prop="status"
            >
              <el-select
                v-model="projectFrom.status"
                placeholder="请选择项目状态"
                clearable
              >
                <el-option :label="$t('lang.Project.Progress')" value="1" />
                <el-option :label="$t('lang.Project.Closed')" value="0" />
                <el-option :label="$t('lang.Project.Plan')" value="2" />
              </el-select> </el-form-item
          ></el-col>
          <el-col :span="8">
            <el-form-item
              :label="$t('lang.Project.ReportTo')"
              size="small"
              prop="reportToName"
            >
              <el-input
                v-model="projectFrom.reportToName"
                maxlength="15"
              /> </el-form-item
          ></el-col>
          <el-col :span="8">
            <el-form-item
              size="small"
              :label="$t('lang.Project.Customer')"
              prop="customer"
            >
              <el-select
                v-model="projectFrom.customer"
                placeholder="请选择"
                clearable
              >
                <el-option label="暂无" value="" />
              </el-select> </el-form-item
          ></el-col>
        </el-row>
        <el-form-item
          :label="$t('lang.Project.Description')"
          prop="description"
          size="small"
        >
          <el-input
            v-model="projectFrom.description"
            type="textarea"
            maxlength="100"
            show-word-limit
            :autosize="{ minRows: 3, maxRows: 5 }"
          />
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
          :file-list="projectFrom.fileList"
        >
          <el-button size="small" type="primary">{{
            $t("lang.Project.Attachment")
          }}</el-button>
          <!-- <div slot="tip" class="el-upload__tip">
            只能上传jpg/png文件，且不超过500kb
          </div> -->
        </el-upload>
      </div>
    </el-form>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import { addProjects, editProjects } from '@/api/project'
import { message, returntomenu } from '@/utils/common'
export default {
  name: 'Addsprint',
  data() {
    return {
      projectFrom: {},
      Projectrules: {
        title: [
          { required: true, message: '请输入项目标题', trigger: 'blur' }
        ],
        reportToName: [
          { required: true, message: '请输入负责人', trigger: 'blur' }
        ],
        status: [
          { required: true, message: '请选择状态', trigger: 'change' }
        ]
      },

    }
  },
  computed: {
    ...mapGetters(
      {
        lang: state => state.header.lang
      }
    )
  },
  created() {
  },
  mounted() {
    this.projectFrom = JSON.parse(this.$route.query.info)
  },
  methods: {
    // 重置表单
    resetFields() {
      this.projectFrom = {
        id: undefined,
        title: undefined,
        description: undefined,
        report: undefined,
        customer: undefined,
        status: '3',
        fileList: []
      }
      this.$refs['projectFrom'].resetFields();
    },
    // 提交
    submitForm(formName, type) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.projectFrom.id) {
            editProjects(this.projectFrom).then(res => {
              if (res.code === '200') {
                message('success', res.msg)
                returntomenu(this, 1000)
              }
            }).catch(error => {
              console.log(error)
            })
          } else {
            addProjects(this.projectFrom).then(res => {
              if (res.code === '200') {
                message('success', res.msg)
                this.resetFields()
                if (type) {
                  returntomenu(this, 1000)
                }
              }
            }).catch(error => {
              console.log(error)
            })
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    // 放弃并且返回
    giveupBack() {
      if (!this.projectFrom.id) {
        this.resetFields()
      }
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
