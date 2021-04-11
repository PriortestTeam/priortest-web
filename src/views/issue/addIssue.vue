<template>
  <div class="app-container add-form add-project">
    <el-form
      ref="issueFrom"
      :model="issueFrom"
      :rules="issuerules"
      label-width="120px"
      class="demo-ruleForm"
    >
      <div>
        <el-button
          v-if="!issueFrom.id"
          type="primary"
          round
          @click="submitForm('issueFrom', false)"
          >保存并新建</el-button
        >
        <el-button
          v-if="!issueFrom.id"
          type="primary"
          round
          @click="submitForm('issueFrom', true)"
          >保存并返回</el-button
        >
        <el-button
          v-if="issueFrom.id"
          type="primary"
          round
          @click="submitForm('issueFrom')"
          >确认修改</el-button
        >
        <el-button type="primary" round @click="giveupBack('issueFrom')"
          >放弃</el-button
        >
        <router-link v-if="!issueFrom.id" to="/admincenter/admincenter">
          <el-button type="text">{{
            $t("lang.PublicBtn.CreateCustomField")
          }}</el-button>
        </router-link>
      </div>
      <div class="form-box">
        <el-form-item label="缺陷标题" prop="title">
          <el-input v-model="issueFrom.title" maxlength="30" size="small" />
        </el-form-item>
        <el-row>
          <el-col :span="8">
            <el-form-item size="small" label="测试用例" prop="testCase">
              <el-select
                v-model="issueFrom.testCase"
                placeholder="关联测试用例"
              >
                <el-option
                  v-for="item in testCaseData"
                  :key="item.id"
                  :label="item.title"
                  :value="item.id"
                >
                </el-option> </el-select></el-form-item
          ></el-col>
          <el-col :span="8">
            <el-form-item size="small" label="开发人员" prop="developer">
              <el-select
                v-model="issueFrom.developer"
                placeholder="请选择开发人员"
                clearable
              >
                <el-option label="Add New Value" value="" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item size="small" label="测试分类" prop="caseCategory">
              <el-input v-model="issueFrom.caseCategory" /> </el-form-item
          ></el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item size="small" label="优先级" prop="priority">
              <el-select
                v-model="issueFrom.priority"
                placeholder="请选择优先级"
              >
                <el-option label="高" value="高" />
                <el-option label="中" value="中" />
                <el-option label="低" value="低" />
              </el-select> </el-form-item
          ></el-col>
          <el-col :span="8">
            <el-form-item size="small" label="状态" prop="status">
              <el-select
                v-model="issueFrom.status"
                placeholder="请选择"
                clearable
              >
                <el-option label="open" :value="1" />
                <el-option label="assigned" :value="2" />
                <el-option label="closed" :value="4" />
                <el-option label="fixed" :value="3" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item size="small" label="环境" prop="env">
              <el-input v-model="issueFrom.env" /> </el-form-item
          ></el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item size="small" label="浏览器" prop="browser">
              <el-select v-model="issueFrom.browser" placeholder="请选择浏览器">
                <el-option label="Google Chrome" value="Google Chrome" />
                <el-option label="Fire Fox" value="Fire Fox" />
                <el-option label="IE" value="IE" />
              </el-select> </el-form-item
          ></el-col>
          <el-col :span="8">
            <el-form-item size="small" label="平台" prop="platform">
              <el-select v-model="issueFrom.platform" placeholder="请选择需求">
                <el-option label="window" value="window" />
                <el-option label="mac" value="mac" />
              </el-select> </el-form-item
          ></el-col>
          <el-col :span="8">
            <el-form-item size="small" label="版本" prop="version">
              <el-input v-model="issueFrom.version" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row> </el-row>
        <el-form-item
          :label="$t('lang.Project.Description')"
          prop="description"
          size="small"
        >
          <el-input
            v-model="issueFrom.description"
            type="textarea"
            maxlength="2000"
            show-word-limit
            :autosize="{ minRows: 4, maxRows: 8 }"
          />
        </el-form-item>
      </div>
    </el-form>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import { addIssue, detailIssue, editIssue } from '@/api/issue'
import { testCaseListAll } from '@/api/testcase'



import { message, returntomenu, formatChangedPara } from '@/utils/common'
export default {
  name: 'Addissue',
  data() {
    return {
      issueFrom: {
      },
      issueFromTemp: {},
      issuerules: {
        title: [
          { required: true, message: '请输入故事标题', trigger: 'blur' }
        ],
        status: [
          { required: true, message: '请选择状态', trigger: 'change' }
        ],


        testCase: [
          { required: true, message: '请选择关联测试案例', trigger: 'change' }
        ],

        priority: [
          { required: true, message: '请选择优先级', trigger: 'change' }
        ],

      },
      testCaseData: [],


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
      detailIssue(this.$route.query.id).then(res => {
        this.issueFrom = res.data


        this.issueFrom.testCase = Number(this.issueFrom.testCase)
        this.issueFromTemp = Object.assign({}, this.issueFrom)
      })
    } else {
      this.issueFrom.projectId = this.projectInfo.userUseOpenProject.projectId
    }
    this.gettestCaseListAll()


  },
  mounted() {
  },
  methods: {
    // 重置表单
    resetFields() {
      this.issueFrom = {
        id: undefined,
        projectId: this.projectInfo.userUseOpenProject.projectId,
        title: undefined,
        status: undefined,
        testCase: undefined,
        developer: undefined,
        priority: undefined,
        env: undefined,
        browser: undefined,
        platform: undefined,
        version: undefined,
        caseCategory: undefined,
      }
      this.$refs['issueFrom'].resetFields();
    },
    //得到所有测试案例
    gettestCaseListAll() {
      testCaseListAll({ projectId: this.projectInfo.userUseOpenProject.projectId, title: '' }).then(res => {
        this.testCaseData = res.data
      })
    },



    // 提交
    submitForm(formName, type) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.issueFrom.id) {
            const param = formatChangedPara(this.issueFromTemp, this.issueFrom)
            param.projectId = this.issueFromTemp.projectId
            editIssue(param).then(res => {
              if (res.code === '200') {
                message('success', res.msg)
                returntomenu(this, 1000)
              }
            }).catch(error => {
              console.log(error)
            })
          } else {
            addIssue(this.issueFrom).then(res => {
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
      if (!this.issueFrom.id) {
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
