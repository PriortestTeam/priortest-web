<template>
  <div class="app-container add-form add-project">
    <el-form
      ref="sprintFrom"
      :model="sprintFrom"
      :rules="sprintrules"
      label-width="120px"
      class="demo-ruleForm"
    >
      <div>
        <el-button
          v-if="!sprintFrom.id"
          type="primary"
          round
          @click="submitForm('sprintFrom', false)"
          >保存并新建</el-button
        >
        <el-button
          v-if="!sprintFrom.id"
          type="primary"
          round
          @click="submitForm('sprintFrom', true)"
          >保存并返回</el-button
        >
        <el-button
          v-if="sprintFrom.id"
          type="primary"
          round
          @click="submitForm('sprintFrom')"
          >确认修改</el-button
        >
        <el-button type="primary" round @click="giveupBack('sprintFrom')"
          >放弃</el-button
        >
        <router-link v-if="!sprintFrom.id" to="/admincenter/admincenter">
          <el-button type="text">{{
            $t("lang.PublicBtn.CreateCustomField")
          }}</el-button>
        </router-link>
      </div>
      <div class="form-box">
        <el-form-item label="迭代标题" prop="title">
          <el-input v-model="sprintFrom.title" size="small" maxlength="15" />
        </el-form-item>
        <el-row>
          <el-col :span="8">
            <el-form-item
              size="small"
              :label="$t('lang.Project.Status')"
              prop="status"
            >
              <el-select
                v-model="sprintFrom.status"
                placeholder="请选择迭代状态"
              >
                <el-option :label="$t('lang.Project.Progress')" :value="1" />
                <el-option :label="$t('lang.Project.Closed')" :value="0" />
                <el-option :label="$t('lang.Project.Plan')" :value="2" />
              </el-select> </el-form-item
          ></el-col>
          <el-col :span="8">
            <el-form-item label="起止日期" size="small" prop="timeArr">
              <el-date-picker
                v-model="sprintFrom.timeArr"
                format="yyyy-MM-dd HH:mm:ss"
                value-format="yyyy-MM-dd HH:mm:ss"
                type="datetimerange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                unlink-panels
              >
              </el-date-picker></el-form-item
          ></el-col>
        </el-row>
        <el-form-item
          :label="$t('lang.Project.Description')"
          prop="description"
          size="small"
        >
          <el-input
            v-model="sprintFrom.description"
            type="textarea"
            maxlength="100"
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
import { addSprint, editSprint, detailSprint } from '@/api/sprint'
import { message, returntomenu, formatChangedPara } from '@/utils/common'
export default {
  name: 'Addsprint',
  data() {
    return {

      sprintFrom: {
        status: 1
      },
      sprintFromTem: {},
      sprintrules: {
        title: [
          { required: true, message: '请输入迭代标题', trigger: 'blur' }
        ],
        status: [
          { required: true, message: '请选择状态', trigger: 'change' }
        ],
        timeArr: [
          { required: true, message: '请选择日期', trigger: 'change' }
        ],
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
      detailSprint(this.$route.query.id).then(res => {
        this.sprintFrom = res.data
        this.$set(this.sprintFrom, 'timeArr', [this.sprintFrom.startDate, this.sprintFrom.endDate])
        this.sprintFromTem = Object.assign({}, this.sprintFrom)
      })
    } else {
      this.sprintFrom.projectId = this.projectInfo.userUseOpenProject.projectId
    }
  },

  methods: {
    // 重置表单
    resetFields() {
      this.sprintFrom = {
        id: undefined,
        projectId: this.projectInfo.userUseOpenProject.projectId,
        title: undefined,
        status: 1,
        description: undefined,
        startDate: undefined,
        endDate: undefined,

        timeArr: '',
        fileList: []
      }
      this.$refs['sprintFrom'].resetFields();
    },
    // 提交
    submitForm(formName, type) {
      this.$refs[formName].validate((valid) => {
        if (valid) {

          if (this.sprintFrom.id) {
            const param = formatChangedPara(this.sprintFromTem, this.sprintFrom)
            param.projectId = this.sprintFrom.projectId
            param.startDate = this.sprintFrom.timeArr[0]
            param.endDate = this.sprintFrom.timeArr[1]

            editSprint(param).then(res => {
              if (res.code === '200') {
                message('success', res.msg)
                returntomenu(this, 1000)
              }
            }).catch(error => {
              console.log(error)
            })
          } else {
            this.sprintFrom.startDate = this.sprintFrom.timeArr[0]
            this.sprintFrom.endDate = this.sprintFrom.timeArr[1]
            delete this.sprintFrom.timeArr
            addSprint(this.sprintFrom).then(res => {
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
      if (!this.sprintFrom.id) {
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
