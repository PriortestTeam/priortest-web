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
          <el-input v-model="projectFrom.title" size="small" maxlength="20" />
        </el-form-item>
        <el-row>
          <el-col :span="8">
            <el-form-item size="small" label="状态" prop="status">
              <el-select
                v-model="projectFrom.status"
                placeholder="请选择项目状态"
                clearable
              >
                <el-option label="Progress" :value="3" />
                <el-option label="Closed" :value="1" />
                <el-option label="Plan" :value="2" />
              </el-select> </el-form-item
          ></el-col>
          <el-col :span="8">
            <el-form-item label="负责人" size="small" prop="reportToName">
              <el-select
                v-model="projectFrom.reportToName"
                placeholder="请选择"
              >
                <el-option
                  v-for="item in optionsArr"
                  :key="item.id"
                  :label="item.userName"
                  :value="item.userName"
                >
                </el-option>
              </el-select> </el-form-item
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
        <el-row>
          <el-col :span="8">
            <el-form-item size="small" label="测试框架" prop="testFrame">
              <el-select
                v-model="projectFrom.testFrame"
                placeholder="请选择测试框架"
                clearable
              >
                <el-option label="Java+TestNg" value="1" />
                <el-option label="Add New Value" value="0" />
              </el-select> </el-form-item
          ></el-col>

          <el-col :span="8">
            <el-form-item size="small" label="项目类别" prop="projectCategory">
              <el-select
                v-model="projectFrom.projectCategory"
                placeholder="请选择项目类别"
                clearable
              >
                <el-option label="网页" value="1" />
                <el-option label="手机应用" value="2" />
                <el-option label="桌面软件" value="3" />
                <el-option label="自由" value="4" />
                <el-option label="Add New Value" :value="0" />
              </el-select> </el-form-item
          ></el-col>
          <el-col :span="8">
            <el-form-item size="small" label="上线日期" prop="planReleaseDate">
              <el-date-picker
                v-model="projectFrom.planReleaseDate"
                value-format="yyyy-MM-dd HH:mm:ss"
                type="date"
                placeholder="选择上线日期"
                size="small"
              >
              </el-date-picker> </el-form-item
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
            maxlength="1000"
            show-word-limit
            :autosize="{ minRows: 3, maxRows: 8 }"
          />
        </el-form-item>
      </div>
    </el-form>
    <div class="table" v-if="projectFrom.id">
      <Upload :linkId="projectFrom.id" :type="projectFrom.scope" />
    </div>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import { addProjects, editProjects, queryByNameSubUsers, getFeature } from '@/api/project'
import { message, returntomenu, formatChangedPara } from '@/utils/common'
import Upload from '@/components/Upload'

export default {
  name: 'Addproject',
  components: {
    Upload
  },
  data() {
    return {
      disabled: false,
      optionsArr: [],
      projectFrom: {},
      projectFromTem: {},
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
      }

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
      getFeature(this.$route.query.id).then(res => {
        this.projectFrom = res.data
      })
      this.projectFromTem = Object.assign({}, this.projectFrom)
    }
    queryByNameSubUsers({ subUserName: '' }).then(res => {
      this.optionsArr = res.data
    })
  },
  mounted() {
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
        status: undefined,
        testFrame: undefined,
        projectCategory: undefined,
        fileList: []
      }
      this.$refs['projectFrom'].resetFields()
    },
    // 提交
    submitForm(formName, type) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.projectFrom.id) {
            const param = formatChangedPara(this.projectFromTem, this.projectFrom)
            editProjects(param).then(res => {
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

  }

}
</script>
<style lang="scss" scoped>
@import "index.scss";
</style>
