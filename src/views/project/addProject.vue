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
        <div class="set_btn" @click="submitForm('projectFrom',true)">
          {{ $t("lang.PublicBtn.SaveAndNew") }}
        </div>
        <div class="set_btn" @click="submitForm('projectFrom',false)">
          {{ $t("lang.PublicBtn.SaveAndBack") }}
        </div>
        <!-- <div class="set_btn">{{ $t("lang.PublicBtn.Save") }}</div> -->
        <div class="set_btn" @click="giveupBack('projectFrom')">
          {{ $t("lang.PublicBtn.GiveUp") }}
        </div>
        <router-link to="/publicview/customfiled">
          <el-button type="text">{{
            $t("lang.PublicBtn.CreateCustomField")
          }}</el-button>
        </router-link>
      </div>
      <div class="form-box">
        <el-form-item :label="$t('lang.Project.ProjectTitle')" prop="title">
          <el-input v-model="projectFrom.title" size="small" />
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
                <el-option :label="$t('lang.Project.Progress')" value="3" />
                <el-option :label="$t('lang.Project.Closed')" value="1" />
                <el-option :label="$t('lang.Project.Plan')" value="2" />
              </el-select> </el-form-item></el-col>
          <el-col :span="8">
            <el-form-item
              :label="$t('lang.Project.ReportTo')"
              size="small"
              prop="report"
            >
              <el-input v-model="projectFrom.reportToName" /> </el-form-item></el-col>
          <el-col :span="8">
            <el-form-item
              size="small"
              :label="$t('lang.Project.Customer')"
              prop="customer"
            >
              <el-select v-model="projectFrom.customer" placeholder="请选择" clearable>
                <el-option label="暂无" value="" />
              </el-select> </el-form-item></el-col>
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
        <el-form-item
          v-for="domain in projectFrom.domains"
          :key="domain.key"
          class="dele-input"
          size="small"
          :label="domain.lable"
          :prop="domain.lable"
          :rules="{
            required: true,
            message: domain.lable + '不能为空',
            trigger: 'blur',
          }"
        >
          <el-input v-model="domain.value" width="70%" /><el-button
            type="text"
            @click.prevent="removeFiled(domain)"
          >删除</el-button>
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
  name: 'Addproject',
  data() {
    return {
      projectFrom: {
        status: '3'
      },
      Projectrules: {
        title: []
      },
      prijectId: '',
      requstsType: ''

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
    this.projectFrom = this.$route.query.id
    this.requstsType = this.$route.query.type
  },
  methods: {
    // 重置表单
    resetFields(formName) {
      this.projectFrom = {
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
          var obj = {
            title: this.projectFrom.title,
            reportToName: this.projectFrom.reportToName,
            description: this.projectFrom.description,
            status: this.projectFrom.status,
            planReleaseDate: '',
            attachmentId: '' // 附件地址
          }
          if (this.requstsType === 'edit') {
            editProjects(this.projectFrom).then(res => {
              if (res.code === '200') {
                message('success', res.data)
                returntomenu(this, 1000)
              }
            }).catch(error => {
              console.log(error)
            })
          } else if (this.requstsType === 'add') {
            addProjects(obj).then(res => {
              if (res.code === '200') {
                message('success', res.data)
                this.projectFrom = {
                  status: '3'
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
