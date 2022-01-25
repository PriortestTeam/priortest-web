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
        >保存并新建</el-button>
        <el-button
          v-if="!sprintFrom.id"
          type="primary"
          round
          @click="submitForm('sprintFrom', true)"
        >保存并返回</el-button>
        <el-button
          v-if="sprintFrom.id"
          type="primary"
          round
          @click="submitForm('sprintFrom')"
        >确认修改</el-button>
        <el-button
          type="primary"
          round
          @click="giveupBack('sprintFrom')"
        >放弃</el-button>
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
            <el-form-item size="small" label="EPIC" prop="epic">
              <el-select
                v-model="sprintFrom.epic"
                placeholder="请选择epic"
                clearable
              >
                <el-option
                  v-for="item in epicArr"
                  :key="item"
                  :label="item"
                  :value="item"
                />
                <router-link to="/admincenter/admincenter?par=epic">
                  <el-option label="Add New Value" :value="0" />
                </router-link>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="起止日期" size="small" prop="timeArr">
              <el-date-picker
                v-model="sprintFrom.timeArr"
                format="yyyy-MM-dd HH:mm:ss"
                value-format="yyyy-MM-dd HH:mm:ss"
                type="datetimerange"
                :picker-options="pickerOptions"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                unlink-panels
                :default-time="['00:00:00', '23:59:00']"
              /> </el-form-item></el-col>
        </el-row>

        <el-form-item
          :label="$t('lang.Project.Description')"
          prop="description"
          size="small"
        >
          <el-input
            v-model="sprintFrom.description"
            type="textarea"
            maxlength="1000"
            show-word-limit
            :autosize="{ minRows: 3, maxRows: 8 }"
          />
        </el-form-item>
      </div>
    </el-form>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import { sysCustomField } from '@/api/systemArr'

import { addSprint, editSprint, detailSprint } from '@/api/sprint'
import { message, returntomenu, formatChangedPara } from '@/utils/common'
export default {
  name: 'Addsprint',
  data () {
    return {
      pickerOptions: {
        disabledDate (time) {
          return time.getTime() < Date.now() - 8.64e7 // 如果没有后面的-8.64e7就是不可以选择今天的
        },
        shortcuts: [
          {
            text: '15个工作日',
            onClick (picker) {
              const end = new Date()
              const start = new Date()
              end.setTime(end.getTime() + 3600 * 1000 * 24 * 14)
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '28个工作日',
            onClick (picker) {
              const end = new Date()
              const start = new Date()
              end.setTime(end.getTime() + 3600 * 1000 * 24 * 30)
              picker.$emit('pick', [start, end])
            }
          }
        ]
      },
      epicArr: [],
      sprintFrom: {},
      sprintFromTem: {},
      sprintrules: {
        title: [{ required: true, message: '请输入迭代标题', trigger: 'blur' }],
        timeArr: [{ required: true, message: '请选择日期', trigger: 'change' }]
      }
    }
  },
  computed: {
    ...mapGetters({
      lang: (state) => state.header.lang
    }),
    projectInfo () {
      return this.$store.state.user.userinfo
    }
  },
  created () {
    if (this.$route.query.id) {
      detailSprint(this.$route.query.id).then((res) => {
        this.sprintFrom = res.data
        this.$set(this.sprintFrom, 'timeArr', [
          this.sprintFrom.startDate,
          this.sprintFrom.endDate
        ])
        this.sprintFromTem = Object.assign({}, this.sprintFrom)
      })
    } else {
      this.sprintFrom.projectId = this.projectInfo.userUseOpenProject.projectId
    }
    sysCustomField({ fieldName: 'epic' }).then((res) => {
      const data = res.data.mergeValues ? res.data.mergeValues : []
      this.epicArr = data
    })
  },

  methods: {
    // 重置表单
    resetFields () {
      this.sprintFrom = {
        id: undefined,
        projectId: this.projectInfo.userUseOpenProject.projectId,
        title: undefined,
        description: undefined,
        startDate: undefined,
        endDate: undefined,
        epic: undefined,
        timeArr: '',
        fileList: []
      }
      this.$refs['sprintFrom'].resetFields()
    },
    // 提交
    submitForm (formName, type) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.sprintFrom.id) {
            const param = formatChangedPara(
              this.sprintFromTem,
              this.sprintFrom
            )
            param.projectId = this.sprintFrom.projectId
            param.startDate = this.sprintFrom.timeArr[0]
            param.endDate = this.sprintFrom.timeArr[1]

            editSprint(param)
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
            this.sprintFrom.startDate = this.sprintFrom.timeArr[0]
            this.sprintFrom.endDate = this.sprintFrom.timeArr[1]
            delete this.sprintFrom.timeArr
            addSprint(this.sprintFrom)
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
      if (!this.sprintFrom.id) {
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
