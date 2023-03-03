<template>
  <div class="app-container add-form add-project">
    <el-form
      ref="testCycleFrom"
      :model="testCycleFrom"
      :rules="testCyclerules"
      class="demo-ruleForm"
    >
      <div>
        <el-button
          v-if="!testCycleFrom.id"
          type="primary"
          @click="submitForm('testCycleFrom', false)"
          >保存并新建</el-button
        >
        <el-button
          v-if="!testCycleFrom.id"
          type="primary"
          @click="submitForm('testCycleFrom', true)"
          >保存并返回</el-button
        >
        <el-button
          v-if="testCycleFrom.id"
          type="primary"
          @click="submitForm('testCycleFrom')"
          >确认修改</el-button
        >
        <el-button type="primary" @click="giveupBack('testCycleFrom')">放弃</el-button>
        <router-link v-if="!testCycleFrom.id" to="/admincenter/admincenter">
          <el-button type="text">
            {{ $t('lang.PublicBtn.CreateCustomField') }}
          </el-button>
        </router-link>
      </div>
      <div class="form-box">
        <!-- <el-form-item label="测试周期标题" prop="title">
          <el-input v-model="testCycleFrom.title" maxlength="30" size="small" />
        </el-form-item>-->
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
              <el-input v-model="testCycleFrom[field.fieldName]" type="text" />
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
                v-model="testCycleFrom[field.fieldName]"
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
              <el-checkbox v-model="testCycleFrom[field.fieldName]" />
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
                v-model="testCycleFrom[field.fieldName]"
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
                v-model="testCycleFrom[field.fieldName]"
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
                v-model="testCycleFrom[field.fieldName]"
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
    <div class="table">
      <el-button type="text" @click="newStep">添加用例</el-button>
      <el-button type="text" @click="useCase">执行用例</el-button>
      <el-table
        ref="testCaseData"
        :data="testCaseData"
        :header-cell-style="tableHeader"
        stripe
        style="width: 100%"
      >
        <el-table-column type="index" align="center" label="序号">
          <template slot-scope="scope">{{ scope.$index + 1 }}</template>
        </el-table-column>
        <el-table-column
          prop="title"
          label="标题"
          :show-overflow-tooltip="true"
          align="center"
        />
        <el-table-column
          prop="linkedIssue"
          label="关联缺陷"
          :show-overflow-tooltip="true"
          align="center"
        />
        <el-table-column
          prop="Module"
          label="模块"
          :show-overflow-tooltip="true"
          align="center"
        />

        <el-table-column
          prop="AutoStatus"
          label="自动化"
          :show-overflow-tooltip="true"
          align="center"
        />

        <el-table-column
          prop="RunTimes"
          label="运行次数"
          :show-overflow-tooltip="true"
          align="center"
        />
        <el-table-column
          prop="lastRun"
          label="运行日期"
          :show-overflow-tooltip="true"
          align="center"
        />
        <el-table-column
          prop="lastRunStatus"
          label="运行状态"
          :show-overflow-tooltip="true"
        >
          <el-table-column
            prop="stepStatus"
            :show-overflow-tooltip="true"
            label="步骤运行状态"
          />
        </el-table-column>

        <el-table-column
          prop="lastRunDuration"
          label="运行时长"
          :show-overflow-tooltip="true"
        />

        <el-table-column
          prop="lastRunner"
          label="运行人"
          :show-overflow-tooltip="true"
        />
        <el-table-column labe
        l="操作" align="center">
          <template slot-scope="scope">
            <el-button type="text" class="table-btn" @click.stop="delview(scope.row)"
              >删除</el-button
            >
            <el-button type="text" class="table-btn" @click.stop="runview(scope.row)"
              >运行</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog
      title="添加测试用例"
      :visible.sync="openDia"
      width="500px"
      append-to-body
    >
      <el-form ref="testCaseFrom" :model="testCaseFrom" :rules="testCaseFromRules">
        <el-form-item label="选择测试用例" prop="testCaseId" size="small">
          <el-select v-model="testCaseFrom.testCaseId" placeholder="请选择测试用例">
            <el-option
              v-for="item in testCaseDataSelect"
              :key="item.id"
              :label="item.title"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submittestCaseFrom">确 定</el-button>
        <el-button @click="canceltestCaseFrom">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import {
  detailTestCycle,
  addTestCycle,
  editTestCycle,
  testCycleCase,
  addtestCycle,
  bindCaseDelete
} from '@/api/testcycle'
import { getAllCustomField, getAllSysCustomFields } from '@/api/getFields'
import { testCaseListAll } from '@/api/testcase'
import { queryByNameSubUsers } from '@/api/project'
import { message, returntomenu, formatChangedPara } from '@/utils/common'
export default {
  name: 'Addtestcycle',
  data() {
    return {
      optionsArr: [],
      versionsArr: [],
      statusArr: [],
      testEnvArr: [],
      frenquencyArr: [],
      testPlatformArr: [],
      loading: false,
      testCycleFrom: {
        currentVersion: 0,
      },
      testCycleFromTemp: {},
      testCyclerules: {
        title: [{ required: true, message: '请输入故事标题', trigger: 'blur' }],
      },

      tableHeader: {
        color: '#d4dce3',
        background: '#003d79',
      },

      openDia: false,
      testCaseFrom: {
        testCycleId: undefined,
        testCaseId: undefined,
      },
      testCaseData: [],
      testCaseDataSelect: [],
      testCaseFromRules: {
        testCaseId: [{ required: true, message: '请选择测试用例', trigger: 'change' }],
      },
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
    if (this.$route.query.id) {
      this.testCaseFrom.testCycleId = this.$route.query.id
      detailTestCycle(this.$route.query.id).then((res) => {
        this.testCycleFrom = res.data
        this.testCycleFromTemp = Object.assign({}, this.testCycleFrom)
      })
      this.gettestCycleCase()
      testCaseListAll({
        projectId: this.projectInfo.userUseOpenProject.projectId,
        title: '',
      }).then((res) => {
        this.testCaseDataSelect = res.data
      })
    } else {
      this.testCycleFrom.projectId = this.projectInfo.userUseOpenProject.projectId
    }
    // 获取系统字段
    getAllSysCustomFields({
      scope: 'testCycle',
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
      scopeId: '5000001',
    }).then((res) => {
      if (res.code === '200') {
        this.customFields = res.data
      }
    })
  },
  mounted() {},
  methods: {
    // 跳转到执行用例
    useCase() {
      this.$router.push('/testcycle/useCase')
    },
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
    // 重置表单
    resetFields() {
      this.testCycleFrom = {
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
      this.$refs['testCycleFrom'].resetFields()
    },

    // 提交
    submitForm(formName, type) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.testCycleFrom.id) {
            const param = formatChangedPara(this.testCycleFromTemp, this.testCycleFrom)
            param.projectId = this.testCycleFromTemp.projectId
            editTestCycle(param)
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
            addTestCycle(this.testCycleFrom)
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
      if (!this.testCycleFrom.id) {
        this.resetFields()
      }
      this.returntomenu(this)
    },

    /** *编辑的表格 */
    resettestCaseFrom() {
      this.testCaseFrom = {
        testCycleId: this.testCycleFrom.id,
        testCaseId: undefined,
      }
      this.$refs['testCaseFrom'].resetFields()
    },
    gettestCycleCase() {
      testCycleCase(
        {
          pageNum: 1,
          pageSize: 10,
          testCycleId: this.testCaseFrom.testCycleId,
        },
        {}
      ).then((res) => {
        this.testCaseData = res.data
      })
    },
    newStep() {
      this.openDia = true
    },
    submittestCaseFrom() {
      this.$refs['testCaseFrom'].validate((valid) => {
        if (valid) {
          addtestCycle(this.testCaseFrom).then((res) => {
            if (res.code === '200') {
              this.gettestCycleCase()
              message('success', res.msg)
              this.openDia = false
              this.resettestCaseFrom()
            }
          })
        }
      })
    },
    canceltestCaseFrom() {
      this.resettestCaseFrom()
      this.openDia = false
    },
    runview(row) {
      this.$router.push({
        name: 'Execute',
        query: { id: row.id, testCycleId: this.testCycleFrom.id },
      })
    },
    delview(row) {
      bindCaseDelete(row.id).then((res) => {
        if (res.code === '200') {
          message('success', res.msg)
          this.gettestCycleCase()
        }
      })
    },
  },
}
</script>
<style lang="scss" scoped>
@import 'index.scss';
</style>
