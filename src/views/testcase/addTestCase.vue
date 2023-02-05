<template>
 <div class="app-container add-form add-project">
     <el-form
       ref="testCaseFrom"
            :model="testCaseFrom"
            :rules="testCaseRules"
            label-width="120px"
       class="demo-ruleForm"
     >
      <div>
             <el-button
               v-if="!testCaseFrom.id"
               type="primary"
               @click="submitForm('testCaseFrom', false)"
               >保存并新建</el-button
             >
             <el-button
               v-if="!testCaseFrom.id"
               type="primary"
               @click="submitForm('testCaseFrom', true)"
               >保存并返回</el-button
             >
             <el-button
               v-if="testCaseFrom.id"
               type="primary"
               @click="submitForm('testCaseFrom')"
               >确认修改</el-button
             >
             <el-button type="primary" @click="giveupBack('testCaseFrom')">放弃</el-button>
             <router-link v-if="!testCaseFrom.id" to="/admincenter/admincenter">
               <el-button type="text">
                 {{ $t('lang.PublicBtn.CreateCustomField') }}
               </el-button>
             </router-link>
           </div>
      <div class="form-box">

        <el-row>
          <el-col
            v-for="field in sysCustomFields"
            :key="field.id"
            :xs="
              field.fieldName === 'title' || field.fieldName === 'description' ? 24 : 12
            "
            :sm="
              field.fieldName === 'title' || field.fieldName === 'description' ? 24 : 12
            "
            :md="
              field.fieldName === 'title' || field.fieldName === 'description' ? 24 : 12
            "
            :lg="
              field.fieldName === 'title' || field.fieldName === 'description' ? 24 : 8
            "
            :xl="
              field.fieldName === 'title' || field.fieldName === 'description' ? 24 : 8
            "
          >
            <!-- 输入框 -->
            <el-form-item
              v-if="field.fieldType === 'text'"
              :label="field.fieldNameCn"
              size="small"
              :prop="field.fieldName"
              label-width="140px"
            >
              <el-input v-model="testCaseFrom[field.fieldName]" type="text" />
            </el-form-item>
            <!-- textarea -->
            <el-form-item
              v-if="field.fieldType === 'memo'"
              :label="field.fieldNameCn"
              size="small"
              :prop="field.fieldName"
              label-width="140px"
            >
              <el-input
                v-model="testCaseFrom[field.fieldName]"
                type="textarea"
                :rows="2"
                placeholder="请输入内容"
              />
            </el-form-item>
            <!-- 单选框 -->
            <el-form-item
              v-if="field.fieldType === 'checkbox'"
              :label="field.fieldNameCn"
              size="small"
              :prop="field.fieldName"
              label-width="140px"
            >
              <el-checkbox v-model="testCaseFrom[field.fieldName]" />
            </el-form-item>
            <!-- 日期 -->
            <el-form-item
              v-if="field.fieldType === 'Date'"
              :label="field.fieldNameCn"
              size="small"
              :prop="field.fieldName"
              label-width="140px"
            >
              <el-date-picker
                v-model="testCaseFrom[field.fieldName]"
                clearable
                type="datetime"
                :placeholder="`请选择${field.fieldNameCn}`"
              />
            </el-form-item>
            <!-- 单选 -->
            <el-form-item
              v-if="field.fieldType === 'radio'"
              :label="field.fieldNameCn"
              size="small"
              :prop="field.fieldName"
              label-width="140px"
            >
              <el-select
                v-model="testCaseFrom[field.fieldName]"
                filterable
                clearable
                :placeholder="`请选择${field.fieldNameCn}`"
              >
                <el-option
                  v-for="(item, index) in field.defaultValues.split(',')"
                  :key="index"
                  :label="field.defaultValues.split(',')[index]"
                  :value="field.defaultValues.split(',')[index]"
                />
                <router-link :to="`/admincenter/admincenter?par=${field.fieldName}`">
                  <el-option label="添加新值" value />
                </router-link>
              </el-select>
            </el-form-item>
            <!-- 下拉选择 -->
            <el-form-item
              v-if="field.fieldType === 'dropDown'"
              :label="field.fieldNameCn"
              size="small"
              :prop="field.fieldName"
              label-width="140px"
            >
              <el-select
                v-model="testCaseFrom[field.fieldName]"
                filterable
                clearable
                :placeholder="`请选择${field.fieldNameCn}`"
              >
                <el-option
                  v-for="(item, index) in field.defaultValues.split(',')"
                  :key="index"
                  :label="field.defaultValues.split(',')[index]"
                  :value="field.defaultValues.split(',')[index]"
                />
                <router-link
                  v-if="field.fieldName !== 'schedule_run_frequency'"
                  :to="`/admincenter/admincenter?par=${field.fieldName}`"
                >
                  <el-option label="添加新值" value />
                </router-link>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col
            v-for="field in customFields"
            :key="field.id"
            :xs="8"
            :sm="6"
            :md="6"
            :lg="6"
            :xl="6"
          >
            <el-form-item
              v-if="field.fieldType === 'text'"
              :label="field.fieldName"
              size="small"
              :prop="field.fieldName"
            >
              <el-input v-model="field.fieldName" type="text" />
            </el-form-item>
            <el-form-item
              v-if="field.fieldType === 'memo'"
              :label="field.fieldName"
              size="small"
              :prop="field.fieldName"
            >
              <el-input
                v-model="field.fieldName"
                type="textarea"
                :rows="2"
                placeholder="请输入内容"
              />
            </el-form-item>
            <el-form-item
              v-if="field.fieldType === 'radio'"
              :label="field.fieldName"
              size="small"
              :prop="field.fieldName"
            >
              <el-select
                v-model="field.fieldName"
                :placeholder="`请选择${field.fieldName}`"
              >
                <el-option
                  v-for="(item, index) in field.defaultValues"
                  :key="index"
                  :label="field.mergeValues[index]"
                  :value="field.mergeValues[index]"
                />
                <router-link :to="`/admincenter/admincenter?par=${field.fieldName}`">
                  <el-option label="添加新值" value />
                </router-link>
              </el-select>
            </el-form-item>
            <el-form-item
              v-if="field.fieldType === 'DropDown'"
              :label="field.fieldName"
              size="small"
              filterable
              :prop="field.fieldName"
            >
              <el-select
                v-model="field.fieldName"
                :placeholder="`请选择${field.fieldName}`"
              >
                <el-option
                  v-for="(item, index) in field.defaultValues"
                  :key="index"
                  :label="field.mergeValues[index]"
                  :value="field.mergeValues[index]"
                />
                <router-link
                  v-if="field.fieldName !== 'schedule_run_frequency'"
                  :to="`/admincenter/admincenter?par=${field.fieldName}`"
                >
                  <el-option label="添加新值" value />
                </router-link>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </div>
    </el-form>

    </el-dialog>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import {getAllCustomField,  getAllSysCustomFields,} from '@/api/getFields'
import {featureListAll } from '@/api/feature'
import {
  addTestCase,
  editTestCase,
  detailTestCase,
  addTestCaseStep,
  testCaseStep,
  delTestCaseStep,
  editTestCaseStep,
  getFeatureLikeArgs
} from '@/api/testcase'

import { queryNameUsersByRoomId } from '@/api/project'
import { message, returntomenu, formatChangedPara } from '@/utils/common'
export default {
  name: 'addTestCase',
  data() {
    return {
      disabled: false,
      optionsArr: [],
      versionsArr: [],
      statusArr: [],
      testEnvArr: [],
      loading: false,
      testCaseFrom: {},
      testCaseFromTemp: {},
      testCaseRules: {
        title: [{ required: true, message: '请输入标题', trigger: 'blur' }],
        feature: [{ required: true, message: '请选择故事', trigger: 'change' }]
      },
      openDia: false,
      sysCustomFields: [],
      customFields: [],
    }
  },
  computed: {
    ...mapGetters({
      lang: (state) => state.header.lang,
    }),
    projectInfo() {
      return this.$store.state.user.userinfo
    },
  },
  created() {
      this.testCaseFrom.projectId = this.projectInfo.userUseOpenProject.projectId
    // 获取系统字段
    getAllSysCustomFields({
      scope: 'TestCase',
    }).then((res) => {
      if (res.code === '200') {
        this.$nextTick(() => {
          if (res.data) {
            var arr1 = []
            var arr2 = res.data.filter((item, index) => {
              if (
                item.fieldName === 'scheduleStartDate' ||
                item.fieldName === 'scheduleEndDate' ||
                item.fieldName === 'jenkinsJob'
              ) {
                arr1.push(item)
                return false
              } else {
                return true
              }
            })
            arr1.unshift(12, 0)
            Array.prototype.splice.apply(arr2, arr1)
            this.sysCustomFields = arr2
          }
        })
      }
    })
    // 获取自定义字段
    getAllCustomField({
      projectId: this.projectInfo.userUseOpenProject.projectId,
      scopeId: '340643333946740754',
    }).then((res) => {
      if (res.code === '200') {
        this.customFields = res.data
      }
    })
  },
  mounted() {},

  methods: {
    remoteReport(query) {
      if (query !== '') {
        this.loading = true
        setTimeout(() => {
          this.loading = false
          queryByNameSubUsers({ subUserName: query }).then((res) => {
            this.optionsArr = res.data
          })
        }, 200)
      } else {
        this.optionsArr = []
      }
    },

     // 编辑获取步骤
        getTestStep () {
          testCaseStep(
            { pageNum: 1, pageSize: 10 },
            {
              testCaseId: this.stepFrom.testCaseId
            }
          ).then((res) => {
            this.stepData = res.data
          })
        },

    // 重置表单
    resetFields() {
      this.testCaseFrom = {
        id: undefined,
        projectId: this.projectInfo.userUseOpenProject.projectId,
        title: undefined,
        status: undefined,
        runStatus: undefined,
        currentVersion: 0,
        version: undefined,
        assignTo: undefined,
        notifiyList: undefined,
        description: undefined,
      }
      this.$refs['testCaseFrom'].resetFields()
    },

    // 提交
    submitForm(formName, type) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.testCaseFrom.id) {
            const param = formatChangedPara(this.testCaseFromTemp, this.testCaseFrom)
            param.featureId = this.testCaseFromTemp.featureId
            editTestCase(param)
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
            addTestCase(this.testCaseFrom)
              .then((res) => {
                if (res.code === '200') {
                  message('success', res.msg)
                  this.resetFields()
                  if (type) {
                    returntomenu(this, 1000)
                  }
                } else {
                  message('error', res.msg)
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
    giveupBack() {
      if (!this.testCaseFrom.id) {
        this.resetFields()
      }
      this.returntomenu(this)
    },
     // 新建步骤
        resetStepFrom () {
          this.stepFrom = {
            testCaseId: undefined,
            step: undefined,
            stepData: undefined,
            expectedResult: undefined
          }
          this.$refs['stepFrom'].resetFields()
        },
        newStep () {
          this.openDia = true
        },
        submitStepFrom () {
          this.$refs['stepFrom'].validate((valid) => {
            if (valid) {
              if (this.stepFrom.id) {
                const param = formatChangedPara(this.stepFromTemp, this.stepFrom)
                param.testCaseId = this.stepFrom.testCaseId
                editTestCaseStep(param).then((res) => {
                  if (res.code === '200') {
                    this.getTestStep()
                    message('success', res.msg)
                    this.openDia = false
                    this.stepFromTemp = {}
                    this.stepFrom = {}
                  }
                })
              } else {
                addTestCaseStep(this.stepFrom).then((res) => {
                  if (res.code === '200') {
                    this.getTestStep()
                    message('success', res.msg)
                    this.openDia = false
                    this.resetStepFrom()
                  }
                })
              }
            }
          })
        },
        cancelStepFrom () {
          this.resetStepFrom()
          this.openDia = false
        },
        toEdit (row) {
          this.stepFrom = Object.assign({}, row)
          this.openDia = true
          this.stepFromTemp = Object.assign({}, row)
        },
        delview (row) {
          delTestCaseStep(row.id).then((res) => {
            if (res.code === '200') {
              message('success', res.msg)
              this.getTestStep()
            }
          })
        },
         getFeatureLikeArgs (row) {
              if ((this.testCaseFrom.module !== undefined && this.testCaseFrom.module !== '') ||
                (this.testCaseFrom.version !== undefined && this.testCaseFrom.version !== '')) {
                this.$confirm('重新选择可能会丢失内容请确认？', {
                  title: '提示',
                  showCancelButton: true,
                  confirmButtonText: '确定',
                  cancelButtonText: '取消',
                  type: 'warning'
                }).then(s => {
                  this.testCaseFrom.module = ''
                  this.testCaseFrom.version = ''
                }).catch(e => {
                  return
                })
              }

              getFeatureLikeArgs(row).then((res) => {
                const data = res.data
                this.$set(this.testCaseFrom, 'version', data.version)
                this.$set(this.testCaseFrom, 'module', data.moudle)
              })
            }
}
}
</script>
<style lang="scss" scoped>
@import 'index.scss';
</style>
