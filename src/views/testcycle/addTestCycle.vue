<template>
  <div class="app-container add-form add-project">
    <el-form
      ref="testCycleFrom"
      :model="testCycleFrom"
      :rules="testCyclerules"
      label-width="120px"
      class="demo-ruleForm"
    >
      <div>
        <el-button
          v-if="!testCycleFrom.id"
          type="primary"
          round
          @click="submitForm('testCycleFrom', false)"
          >保存并新建</el-button
        >
        <el-button
          v-if="!testCycleFrom.id"
          type="primary"
          round
          @click="submitForm('testCycleFrom', true)"
          >保存并返回</el-button
        >
        <el-button
          v-if="testCycleFrom.id"
          type="primary"
          round
          @click="submitForm('testCycleFrom')"
          >确认修改</el-button
        >
        <el-button type="primary" round @click="giveupBack('testCycleFrom')"
          >放弃</el-button
        >
        <router-link v-if="!testCycleFrom.id" to="/admincenter/admincenter">
          <el-button type="text">{{
            $t("lang.PublicBtn.CreateCustomField")
          }}</el-button>
        </router-link>
      </div>
      <div class="form-box">
        <el-form-item label="测试周期标题" prop="title">
          <el-input v-model="testCycleFrom.title" maxlength="30" size="small" />
        </el-form-item>
        <el-row>
          <el-col :span="8">
            <el-form-item size="small" label="关联故事" prop="feature">
              <el-select
                v-model="testCycleFrom.status"
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
            <el-form-item size="small" label="关联迭代" prop="sprint">
              <el-input
                placeholder="纯数字"
                oninput="value=value.replace(/[^\d]/g,'')"
                v-model="testCycleFrom.sprintId"
                maxlength="30"
                size="small" /></el-form-item
          ></el-col>
          <el-col :span="8">
            <el-form-item label="版本" size="small" prop="version">
              <el-input
                v-model="testCycleFrom.version"
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
            v-model="testCycleFrom.description"
            type="textarea"
            maxlength="300"
            show-word-limit
            :autosize="{ minRows: 3, maxRows: 5 }"
          />
        </el-form-item>
      </div>
    </el-form>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import { detailTestCycle, addTestCycle, editTestCycle } from '@/api/testcycle'

import { message, returntomenu, formatChangedPara } from '@/utils/common'
export default {
  name: 'Addtestcycle',
  data() {
    return {
      testCycleFrom: {
      },
      testCycleFromTemp: {},
      testCyclerules: {
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
      detailTestCycle(this.$route.query.id).then(res => {
        this.testCycleFrom = res.data
        this.testCycleFromTemp = Object.assign({}, this.testCycleFrom)
      })

    } else {
      this.testCycleFrom.projectId = this.projectInfo.userUseOpenProject.projectId
    }

  },
  mounted() {
  },
  methods: {
    // 重置表单
    resetFields() {
      this.testCycleFrom = {
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
      this.$refs['testCycleFrom'].resetFields();
    },

    // 提交
    submitForm(formName, type) {

      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.testCycleFrom.id) {
            const param = formatChangedPara(this.testCycleFromTemp, this.testCycleFrom)
            param.projectId = this.testCycleFromTemp.projectId
            editTestCycle(param).then(res => {
              if (res.code === '200') {
                message('success', res.msg)
                returntomenu(this, 1000)
              }
            }).catch(error => {
              console.log(error)
            })
          } else {
            addTestCycle(this.testCycleFrom).then(res => {
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
      if (!this.testCycleFrom.id) {
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
