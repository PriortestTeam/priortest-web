<template>
  <div class="app-container add-form add-project">
    <el-form
      ref="projectFrom"
      :model="projectFrom"
      :rules="ProjectRules"
      label-width="120px"
      label-position="top"
      class="demo-ruleForm"
    >
      <div>
        <el-button
          v-if="!projectFrom.id"
          type="primary"
          round
          @click="submitForm('projectFrom', false)"
        >保存并新建</el-button>
        <el-button
          v-if="!projectFrom.id"
          type="primary"
          round
          @click="submitForm('projectFrom', true)"
        >保存并返回</el-button>
        <el-button
          v-if="projectFrom.id"
          type="primary"
          round
          @click="submitForm('projectFrom')"
        >确认修改</el-button>
        <el-button
          type="primary"
          round
          @click="giveupBack('projectFrom')"
        >放弃</el-button>
        <router-link v-if="projectFrom.id" to="/admincenter/admincenter">
          <el-button type="text">{{
            $t("lang.PublicBtn.CreateCustomField")
          }}</el-button>
        </router-link>
      </div>
      <div class="form-box">
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item :label="$t('lang.Project.ProjectTitle')" prop="title">
              <el-input v-model="projectFrom.title" maxlength="20" />
            </el-form-item>
          </el-col>

        </el-row>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item :label="$t('lang.Project.Status')" prop="status">
              <el-select
                v-model="projectFrom.status"
                placeholder="请选择项目状态"
                clearable
              >
                <el-option v-for="item in statusListArr" :key="item" :label="item" :value="item" />
                <router-link to="/admincenter/admincenter?par=customer_list">
                  <el-option label="添加新值" value="0" />
                </router-link>
              </el-select> </el-form-item></el-col>
          <el-col :span="12">
            <el-form-item :label="$t('lang.Project.ReportTo')" prop="reportToName">
              <el-select
                v-model="projectFrom.reportToName"
                filterable
                clearable
                remote
                reserve-keyword
                placeholder="请选择负责人"
              >
                <el-option
                  v-for="(item, index) in reportToNameArr"
                  :key="index"
                  :label="item"
                  :value="item"
                />
                <router-link to="/admincenter/admincenter?par=report_name">
                  <el-option label="添加新值" value="0" />
                </router-link>
              </el-select> </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item :label="$t('lang.Project.Customer')" prop="customer">
              <el-select v-model="projectFrom.customer" placeholder="请选择客户" clearable>
                <el-option v-for="item in customerListArr" :key="item" :label="item" :value="item" />
                <!-- <el-option label="测试客户" value="0" /> -->
                <router-link to="/admincenter/admincenter?par=customer_list">
                  <el-option label="添加新值" value="0" />
                </router-link>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('lang.Project.TestFrame')" prop="testFrame">
              <el-select v-model="projectFrom.testFrame" placeholder="请选择测试框架" clearable>
                <el-option v-for="item in testFrameArr" :key="item" :label="item" :value="item" />
                <router-link to="/admincenter/admincenter?par=test_frame">
                  <el-option label="添加新值" value="0" />
                </router-link>
              </el-select> </el-form-item></el-col>

        </el-row>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item :label="$t('lang.Project.ProjectCategory')" prop="projectCategory">
              <el-select
                v-model="projectFrom.projectCategory"
                placeholder="请选择项目类别"
                clearable
              >
                <el-option v-for="item in projectCategory" :key="item" :label="item" :value="item" />
                <router-link to="/admincenter/admincenter?par=project_category">
                  <el-option label="添加新值" value="0" />
                </router-link>
              </el-select> </el-form-item></el-col>
          <el-col :span="12">
            <el-form-item :label="$t('lang.Project.planReleaseDate')" prop="planReleaseDate">
              <el-date-picker
                v-model="projectFrom.planReleaseDate"
                value-format="yyyy-MM-dd HH:mm:ss"
                :picker-options="pickerOptions"
                type="date"
                placeholder="选择上线日期"
              /> </el-form-item></el-col>
        </el-row>
        <el-row v-if="projectFrom.id">
          <el-col :span="8">
            <el-form-item label="key" prop="key">
              <el-input
                v-model="projectFrom.foreignId"
                :disabled="true"

                maxlength="20"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item
              :label="$t('lang.Project.Description')"
              prop="description"
            >
              <el-input
                v-model="projectFrom.description"
                type="textarea"
                maxlength="1000"
                show-word-limit
                :autosize="{ minRows: 3, maxRows: 8 }"
              />
            </el-form-item>
          </el-col>

        </el-row>

      </div>
    </el-form>
    <div v-if="projectFrom.id" class="table">
      <Upload :link-id="projectFrom.id" :type="projectFrom.scope" />
    </div>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import {
  addProjects,
  editProjects,
  queryByNameSubUsers,
  getFeature,
  getAllSysCustomField,
  getAllCustomField
} from '@/api/project'
// import { sysCustomField } from '@/api/systemArr'
import { message, returntomenu, formatChangedPara } from '@/utils/common'
import Upload from '@/components/Upload'

export default {
  name: 'Addproject',
  components: {
    Upload
  },
  data () {
    return {
      disabled: false,
      optionsArr: [],
      testFrameArr: [],
      reportToNameArr: [],
      customerListArr: [],
      projectCategory: [],
      statusListArr: [],
      loading: false,
      projectFrom: {},
      projectFromTem: {},
      ProjectRules: {
        title: [{ required: true, message: '请输入项目标题', trigger: 'blur' }],
        reportToName: [
          { required: true, message: '请选择负责人', trigger: 'blur' }
        ],
        status: [{ required: true, message: '请选择状态', trigger: 'change' }]
      },
      pickerOptions: {
        disabledDate (time) {
          return time.getTime() < Date.now() - 8.64e7// 设置选择今天以及今天之后的日
          // return time.getTime() > Date.now(); //设置选择今天以及今天以前的日期
          // return time.getTime() < Date.now();//设置选择今天之后的日期（不能选择当天时间）
          // return time.getTime() > Date.now() - 8.64e7 //设置选择今天之前的日期（不能选择当天）
          // 设置当天23：59：59可选
          // let currentTime = this.getNowMonthDay() + ` 23:59:59`
          // return time.getTime() > new Date(currentTime).getTime()
        }
      }
    }
  },
  computed: {
    ...mapGetters({
      lang: (state) => state.header.lang
    }),
    userUseOpenProject () {
      return this.$store.state.user.userinfo.userUseOpenProject
    }
  },
  async created () {
    await this.edit()
    await this.setAllSysCustomField()
    await this.queryAllCustomField()
  },
  methods: {
    // 获取字段
    async queryAllCustomField () {
      const that = this
      const params = {
        'projectId': that.userUseOpenProject.projectId,
        'scope': 'project'
      }
      const res = await getAllCustomField(params)
      if (res.code === '200') {
        console.log('res---', res)
      }
    },
    // 编辑
    async edit () {
      const that = this
      if (that.$route.query.id) {
        console.log('edit---', that.$route.query.id)
        const res = await getFeature(that.$route.query.id)
        // res.data.status = res.data.status === 1 ? '关闭' : res.data.status === 2 ? '计划' : '开发中'
        that.projectFrom = res.data
        that.projectFromTem = Object.assign({}, that.projectFrom)
      }
    },
    // 系统字段赋值
    async setAllSysCustomField () {
      const that = this
      const res = await getAllSysCustomField()
      res.data.forEach((v, k) => {
        switch (v.sysCustomField.fieldName) {
          case 'project_status':
            that.statusListArr = v.mergeValues
            break
          case 'customer_list':
            that.customerListArr = v.mergeValues
            break
          case 'report_name':
            that.reportToNameArr = v.mergeValues
            break
          case 'test_frame':
            that.testFrameArr = v.mergeValues
            break
          case 'project_category':
            that.projectCategory = v.mergeValues
            break
        }
      })
    },
    remoteReport (query) {
      if (query !== '') {
        this.loading = true
        setTimeout(() => {
          this.loading = false
          queryByNameSubUsers({ subUserName: query }).then((res) => {
            this.reportToNameArr = res.data
          })
        }, 200)
      } else {
        this.reportToNameArr = []
      }
    },
    // 重置表单
    resetFields () {
      this.projectFrom = {
        id: undefined,
        title: undefined,
        description: undefined,
        reportToName: undefined,
        customer: undefined,
        status: undefined,
        testFrame: undefined,
        projectCategory: undefined,
        fileList: []
      }
      this.$refs['projectFrom'].resetFields()
    },
    // 提交
    submitForm (formName, type) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.projectFrom.id) {
            const param = formatChangedPara(
              this.projectFromTem,
              this.projectFrom
            )
            editProjects(param)
              .then((res) => {
                if (res.code === '200') {
                  message('success', res.msg)
                  returntomenu(this, 1000)
                }
              })
              .catch((error) => {
                console.log(error)
              })
          } else {
            addProjects(this.projectFrom)
              .then((res) => {
                if (res.code === '200') {
                  message('success', res.msg)
                  this.resetFields()
                  if (type) {
                    returntomenu(this, 1000)
                  }
                }
              })
              .catch((error) => {
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
    giveupBack () {
      if (!this.projectFrom.id) {
        this.resetFields()
      }
      this.returntomenu(this)
    }
  }
}
</script>
<style lang="scss" scoped>
@import "index.scss";
</style>
