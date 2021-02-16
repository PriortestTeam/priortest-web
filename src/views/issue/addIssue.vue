<template>
  <div class="app-container add-form add-project">
    <el-form
      ref="featureFrom"
      :model="featureFrom"
      :rules="Projectrules"
      label-width="120px"
      class="demo-ruleForm"
    >
      <div>
        <el-button
          v-if="!featureFrom.id"
          type="primary"
          round
          @click="submitForm('featureFrom', false)"
          >保存并新建</el-button
        >
        <el-button
          v-if="!featureFrom.id"
          type="primary"
          round
          @click="submitForm('featureFrom', true)"
          >保存并返回</el-button
        >
        <el-button
          v-if="featureFrom.id"
          type="primary"
          round
          @click="submitForm('featureFrom')"
          >确认修改</el-button
        >
        <el-button type="primary" round @click="giveupBack('featureFrom')"
          >放弃</el-button
        >
        <router-link v-if="!featureFrom.id" to="/admincenter/admincenter">
          <el-button type="text">{{
            $t("lang.PublicBtn.CreateCustomField")
          }}</el-button>
        </router-link>
      </div>
      <div class="form-box">
        <el-form-item label="故事标题" prop="title">
          <el-input v-model="featureFrom.title" maxlength="30" size="small" />
        </el-form-item>
        <el-row>
          <el-col :span="8">
            <el-form-item
              size="small"
              :label="$t('lang.Project.Status')"
              prop="status"
            >
              <el-select
                v-model="featureFrom.status"
                placeholder="请选择状态"
                clearable
              >
                <el-option :label="$t('lang.Project.Progress')" :value="1" />
                <el-option
                  :label="$t('lang.Project.Closed')"
                  :disabled="true"
                  :value="0"
                />
                <el-option :label="$t('lang.Project.Plan')" :value="2" />
              </el-select> </el-form-item
          ></el-col>
          <el-col :span="8">
            <el-form-item size="small" label="开发周期" prop="sprintId">
              <el-input
                placeholder="纯数字"
                oninput="value=value.replace(/[^\d]/g,'')"
                v-model="featureFrom.sprintId"
                maxlength="30"
                size="small" /></el-form-item
          ></el-col>
          <el-col :span="8">
            <el-form-item label="负责人" size="small" prop="reportTo">
              <el-input
                v-model="featureFrom.reportTo"
                maxlength="15"
              /> </el-form-item
          ></el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item size="small" label="EPIC" prop="epic">
              <el-input
                v-model="featureFrom.epic"
                maxlength="15"
              /> </el-form-item
          ></el-col>
          <el-col :span="8">
            <el-form-item size="small" label="版本" prop="version">
              <el-input
                v-model="featureFrom.version"
                maxlength="15"
              /> </el-form-item
          ></el-col>
        </el-row>
        <el-form-item
          :label="$t('lang.Project.Description')"
          prop="description"
          size="small"
        >
          <el-input
            v-model="featureFrom.description"
            type="textarea"
            maxlength="300"
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
          :file-list="featureFrom.fileList"
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
import { addFeature, detailFeature, editFeature } from '@/api/feature'
import { message, returntomenu, formatChangedPara } from '@/utils/common'
export default {
  name: 'Addissue',
  data() {
    return {
      featureFrom: {
        status: 1
      },
      featureFromTemp: {},
      Projectrules: {
        title: [
          { required: true, message: '请输入故事标题', trigger: 'blur' }
        ],
        reportTo: [
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
    ),
    projectInfo() {
      return this.$store.state.user.userinfo
    }
  },
  created() {
    if (this.$route.query.id) {
      detailFeature(this.$route.query.id).then(res => {
        this.featureFrom = res.data
        this.featureFromTemp = Object.assign({}, this.featureFrom)

      })

    } else {
      this.featureFrom.projectId = this.projectInfo.userUseOpenProject.projectId
    }

  },
  mounted() {
  },
  methods: {
    // 重置表单
    resetFields() {
      this.featureFrom = {
        id: undefined,

        projectId: this.projectInfo.userUseOpenProject.projectId,
        title: undefined,
        description: undefined,
        status: 1,
        sprintId: undefined,
        reportTo: undefined,
        epic: undefined,
        version: undefined,
        // fileList: []
      }
      this.$refs['featureFrom'].resetFields();
    },

    // 提交
    submitForm(formName, type) {

      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.featureFrom.id) {
            const param = formatChangedPara(this.featureFromTemp, this.featureFrom)
            param.projectId = this.featureFromTemp.projectId
            editFeature(param).then(res => {
              if (res.code === '200') {
                message('success', res.msg)
                returntomenu(this, 1000)
              }
            }).catch(error => {
              console.log(error)
            })
          } else {
            addFeature(this.featureFrom).then(res => {
              if (res.code === '200') {
                message('success', res.msg)
                this.resetFields()
                if (type) {
                  returntomenu(this, 1000)
                }
              } else {
                message('error', res.msg)
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
      if (!this.featureFrom.id) {
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
