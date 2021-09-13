<template>
  <div class="app-container add-form add-project">
    <el-form
      ref="testCaseFrom"
      :model="testCaseFrom"
      :rules="sprintrules"
      label-width="120px"
      class="demo-ruleForm"
    >
      <div>
        <el-button
          v-if="!testCaseFrom.id"
          type="primary"
          round
          @click="submitForm('testCaseFrom', false)"
        >保存并新建
        </el-button>
        <el-button
          v-if="!testCaseFrom.id"
          type="primary"
          round
          @click="submitForm('testCaseFrom', true)"
        >保存并返回
        </el-button>
        <el-button
          v-if="testCaseFrom.id"
          type="primary"
          round
          @click="submitForm('testCaseFrom')"
        >确认修改
        </el-button>
        <el-button
          type="primary"
          round
          @click="giveupBack('testCaseFrom')"
        >放弃
        </el-button>
        <router-link v-if="!testCaseFrom.id" to="/admincenter/admincenter">
          <el-button type="text">{{
            $t('lang.PublicBtn.CreateCustomField')
          }}
          </el-button>
        </router-link>
      </div>
      <div class="form-box">
        <el-form-item label="测试用例标题" prop="title">
          <el-input v-model="testCaseFrom.title" size="small" maxlength="15" />
        </el-form-item>
        <el-form-item label="描述" prop="description" size="small">
          <el-input
            v-model="testCaseFrom.description"
            type="textarea"
            maxlength="1000"
            show-word-limit
            :autosize="{ minRows: 3, maxRows: 8 }"
          />
        </el-form-item>
        <el-row>
          <el-col :span="8">
            <el-form-item size="small" label="feature" prop="feature">
              <el-select v-model="testCaseFrom.feature" placeholder="关联故事" @change="getFeatureLikeArgs">
                <el-option
                  v-for="item in featueData"
                  :key="item.id"
                  :label="item.title"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item size="small" label="优先级" prop="priority">
              <el-select
                v-model="testCaseFrom.priority"
                placeholder="请选择优先级"
              >
                <el-option label="高" value="高" />
                <el-option label="中" value="中" />
                <el-option label="低" value="低" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item size="small" label="浏览器" prop="browser">
              <el-select
                v-model="testCaseFrom.browser"
                placeholder="请选择浏览器"
              >
                <el-option label="Google Chrome" value="Google Chrome" />
                <el-option label="Fire Fox" value="Fire Fox" />
                <el-option label="IE" value="IE" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item size="small" label="平台" prop="platform">
              <el-select v-model="testCaseFrom.platform" placeholder="请选择测试平台">
                <el-option label="window" value="window" />
                <el-option label="mac" value="mac" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item size="small" label="状态" prop="status">
              <el-select v-model="testCaseFrom.status" placeholder="请选择测试用例状态">
                <el-option label="待执行" value="Ready" />
                <el-option label="草稿" value="Draft" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item size="small" label="版本" prop="version">
              <el-select
                v-model="testCaseFrom.version"
                placeholder="请选择版本"
                clearable
              >

                <el-option
                  v-for="item in getOptionsArrData.versions"
                  :key="item"
                  :label="item"
                  :value="item"
                />
                <router-link to="/admincenter/admincenter?par=versions">
                  <el-option label="Add New Value" value="" />
                </router-link>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item size="small" label="测试分类" prop="caseCategory">
              <el-select
                v-model="testCaseFrom.caseCategory"
                placeholder="请选择测试分类"
                clearable
              >
                <el-option
                  v-for="item in getOptionsArrData.testCategory"
                  :key="item"
                  :label="item"
                  :value="item"
                />
                <router-link to="/admincenter/admincenter?par=test_category">
                  <el-option label="Add New Value" value="" />
                </router-link>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item size="small" label="测试类型" prop="caseType">
              <el-select
                v-model="testCaseFrom.testType"
                placeholder="请选择测试类型"
                clearable
              >
                <el-option
                  v-for="item in getOptionsArrData.testType"
                  :key="item"
                  :label="item"
                  :value="item"
                />
                <router-link to="/admincenter/admincenter?par=test_type">
                  <el-option label="Add New Value" value="" />
                </router-link>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item size="small" label="ExternaID" prop="externaId">
              <el-input v-model="testCaseFrom.externaId" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item size="small" label="测试环境" prop="env">
              <el-select
                v-model="testCaseFrom.env"
                placeholder="请选择测试环境"
                clearable
              >
                <el-option
                  v-for="item in getOptionsArrData.testEnv"
                  :key="item"
                  :label="item"
                  :value="item"
                />
                <router-link to="/admincenter/admincenter?par=test_env">
                  <el-option label="Add New Value" value="" />
                </router-link>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item size="small" label="模块" prop="module">
              <el-select
                v-model="testCaseFrom.module"
                placeholder="请选择模块"
                clearable
              >
                <el-option
                  v-for="item in getOptionsArrData.moudle"
                  :key="item"
                  :label="item"
                  :value="item"
                />
                <router-link to="/admincenter/admincenter?par=moudle">
                  <el-option label="Add New Value" value="" />
                </router-link>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item size="small" label="测试设备" prop="testDevice">
              <el-select
                v-model="testCaseFrom.testDevice"
                placeholder="请选择测试设备"
                clearable
              >
                <el-option
                  v-for="item in getOptionsArrData.testDevice"
                  :key="item"
                  :label="item"
                  :value="item"
                />
                <router-link to="/admincenter/admincenter?par=test_device">
                  <el-option label="Add New Value" value="" />
                </router-link>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item size="small" label="测试方法" prop="testMethod">
              <el-select
                v-model="testCaseFrom.testMethod"
                placeholder="请选择测试方法"
                clearable
              >
                <el-option
                  v-for="item in getOptionsArrData.testMethod"
                  :key="item"
                  :label="item"
                  :value="item"
                />
                <router-link to="/admincenter/admincenter?par=test_method">
                  <el-option label="Add New Value" value="" />
                </router-link>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="测试数据" prop="testData" size="small">
          <el-input
            v-model="testCaseFrom.testData"
            type="textarea"
            maxlength="1000"
            show-word-limit
            :autosize="{ minRows: 3, maxRows: 5 }"
          />
        </el-form-item>
        <el-form-item label="测试条件" prop="preCondition" size="small">
          <el-input
            v-model="testCaseFrom.preCondition"
            type="textarea"
            maxlength="1000"
            show-word-limit
            :autosize="{ minRows: 3, maxRows: 5 }"
          />
        </el-form-item>
        <el-form-item label="备注" prop="comments" size="small">
          <el-input
            v-model="testCaseFrom.comments"
            type="textarea"
            maxlength="1000"
            show-word-limit
            :autosize="{ minRows: 3, maxRows: 8 }"
          />
        </el-form-item>
      </div>
    </el-form>
    <div v-if="this.testCaseFrom.id" class="table">
      <el-button type="text" @click="newStep">新建步骤</el-button>
      <el-table
        ref="stepData"
        :data="stepData"
        :header-cell-style="tableHeader"
        stripe
        style="width: 100%"
      >
        <el-table-column type="index" align="center" label="序号">
          <template slot-scope="scope">
            {{ scope.$index + 1 }}
          </template>
        </el-table-column>
        <el-table-column
          prop="step"
          label="步骤"
          :show-overflow-tooltip="true"
          align="center"
        />
        <el-table-column prop="testDate" label="测试时间" align="center" />
        <el-table-column
          prop="expectedResult"
          label="预计结果"
          :show-overflow-tooltip="true"
          align="center"
        />
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button
              type="text"
              class="table-btn"
              @click.stop="toEdit(scope.row)"
            >编辑
            </el-button>
            <el-button
              type="text"
              class="table-btn"
              @click.stop="delview(scope.row)"
            >删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog
      title="新建步骤"
      :visible.sync="openDia"
      width="500px"
      append-to-body
    >
      <el-form
        ref="stepFrom"
        :model="stepFrom"
        :rules="stepFromRules"
        label-width="80px"
      >
        <el-form-item label="步骤名称" prop="step" size="small">
          <el-input
            v-model="stepFrom.step"
            maxlength="20"
            placeholder="请输入步骤名称"
          />
        </el-form-item>
        <el-form-item label="测试日期" prop="testDate" size="small">
          <el-date-picker
            v-model="stepFrom.testDate"
            value-format="yyyy-MM-dd HH:mm:ss"
            type="date"
            placeholder="选择测试日期"
          />
        </el-form-item>
        <el-form-item label="状态" prop="status" size="small">
          <el-select v-model="stepFrom.status" placeholder="请选择状态">
            <el-option label="未执行" :value="0" />
            <el-option label="执行失败" :value="1" />
            <el-option label="执行成功" :value="2" />
          </el-select>
        </el-form-item>
        <el-form-item label="预期结果" prop="expectedResult" size="small">
          <el-input
            v-model="stepFrom.expectedResult"
            type="textarea"
            maxlength="100"
            show-word-limit
            :autosize="{ minRows: 2, maxRows: 3 }"
            placeholder="请输入预期结果"
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitStepFrom">确 定</el-button>
        <el-button @click="cancelStepFrom">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import { featureListAll } from '@/api/feature'

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
import { sysCustomField } from '@/api/systemArr'

import { message, returntomenu, formatChangedPara } from '@/utils/common'

export default {
  name: 'Addtestcase',
  data() {
    return {
      getOptionsArr: [
        'versions',
        'testCategory',
        'testType',
        'testEnv',
        'moudle',
        'testDevice',
        'testMethod'
      ],
      getOptionsArrData: {
        versions: [],
        testCategory: [],
        testType: [],
        testEnv: [],
        moudle: [],
        testDevice: [],
        testMethod: []
      },
      featueData: [],
      testCaseFrom: {
        status: 1
      },
      testCaseFromTem: {},
      sprintrules: {
        title: [{ required: true, message: '请输入迭代标题', trigger: 'blur' }],
        feature: [{ required: true, message: '请选择需求', trigger: 'change' }],
        priority: [
          { required: true, message: '请选择优先级', trigger: 'change' }
        ],
        browser: [
          { required: true, message: '请选择浏览器', trigger: 'change' }
        ],
        platform: [
          { required: true, message: '请选择平台', trigger: 'change' }
        ],
        status: [
          { required: true, message: '请选择测试用例状态', trigger: 'change' }
        ]
      },

      tableHeader: {
        color: '#d4dce3',
        background: '#003d79'
      },
      stepData: [],

      openDia: false,
      stepFrom: {},
      stepFromTemp: {},
      stepFromRules: {
        step: [{ required: true, message: '请输入步骤名称', trigger: 'blur' }],
        testDate: [
          { required: true, message: '请选择测试日期', trigger: 'change' }
        ],
        status: [{ required: true, message: '请选择状态', trigger: 'change' }],
        expectedResult: [
          { required: true, message: '请输入预期结果', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    ...mapGetters({
      lang: (state) => state.header.lang
    }),
    projectInfo() {
      return this.$store.state.user.userinfo
    }
  },
  created() {
    if (this.$route.query.id) {
      this.stepFrom.testCaseId = this.$route.query.id
      detailTestCase(this.$route.query.id).then((res) => {
        console.log(res)
        this.stepFrom.testCaseId = res.data.id
        this.testCaseFrom = res.data
        this.testCaseFromTem = Object.assign({}, this.testCaseFrom)
      })
      this.getTestStep()
    } else {
      this.testCaseFrom.projectId = this.projectInfo.userUseOpenProject.projectId
    }
    featureListAll({
      projectId: this.projectInfo.userUseOpenProject.projectId,
      title: ''
    }).then((res) => {
      this.featueData = res.data
    })
    this.getOptionsArr.forEach((element) => {
      sysCustomField({ fieldName: element }).then((res) => {
        this.getOptionsArrData[element] = res.data.mergeValues ? res.data.mergeValues : []
      })
    })
  },

  methods: {
    // 编辑获取步骤
    getTestStep() {
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
        description: undefined,
        priority: undefined,
        feature: undefined,
        browser: undefined,
        platform: undefined,
        status: undefined,
        version: undefined,
        caseCategory: undefined,
        caseType: undefined,
        externaId: undefined,
        env: undefined,
        module: undefined,
        testDevice: undefined,
        testMethod: undefined,
        testData: undefined,
        preCondition: undefined,
        comments: undefined
      }
      this.$refs['testCaseFrom'].resetFields()
    },
    // 提交
    submitForm(formName, type) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.testCaseFrom.id) {
            const param = formatChangedPara(
              this.testCaseFromTem,
              this.testCaseFrom
            )
            param.projectId = this.testCaseFrom.projectId
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
    resetStepFrom() {
      this.stepFrom = {
        testCaseId: undefined,
        step: undefined,
        testDate: undefined,
        expectedResult: undefined,
        status: undefined
      }
      this.$refs['stepFrom'].resetFields()
    },
    newStep() {
      this.openDia = true
    },
    submitStepFrom() {
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
    cancelStepFrom() {
      this.resetStepFrom()
      this.openDia = false
    },
    toEdit(row) {
      this.stepFrom = Object.assign({}, row)
      this.openDia = true
      this.stepFromTemp = Object.assign({}, row)
    },
    delview(row) {
      delTestCaseStep(row.id).then((res) => {
        if (res.code === '200') {
          message('success', res.msg)
          this.getTestStep()
        }
      })
    },
    getFeatureLikeArgs(row) {
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
@import "index.scss";
</style>
