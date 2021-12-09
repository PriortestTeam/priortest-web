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
        >保存并新建</el-button>
        <el-button
          v-if="!testCycleFrom.id"
          type="primary"
          round
          @click="submitForm('testCycleFrom', true)"
        >保存并返回</el-button>
        <el-button
          v-if="testCycleFrom.id"
          type="primary"
          round
          @click="submitForm('testCycleFrom')"
        >确认修改</el-button>
        <el-button
          type="primary"
          round
          @click="giveupBack('testCycleFrom')"
        >放弃</el-button>
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
          <el-checkbox label="当前发布版本" size="small" prop="currentVersion" />
                      <el-checkbox label="发布版本" size="small" prop="releaseVersion" />
          </el-col>
          <el-col :span="8">
            <el-form-item label="版本" size="small" prop="version">
              <el-select
                v-model="testCycleFrom.version"
                placeholder="请选择版本"
              >
                <el-option
                  v-for="item in versionsArr"
                  :key="item"
                  :label="item"
                  :value="item"
                />
                <router-link
                  to="/admincenter/admincenter?par=versions"
                >
                  <el-option label="Add New Value" value="" />
                </router-link>
              </el-select>
              </el-select> </el-form-item></el-col>
          <el-col :span="8">
            <el-form-item size="small" label="状态" prop="status">
              <el-select
                v-model="testCycleFrom.status"
                placeholder="状态"
              >
                <el-option
                                  v-for="item in statusArr"
                                  :key="item"
                                  :label="item"
                                  :value="item"
                                />
                                <router-link
                                  to="/admincenter/admincenter?par=status"
                                >
                                  <el-option label="Add New Value" value="" />
                                </router-link>

                 </el-select></el-form-item></el-col>
        </el-row>
        <el-row>

          <el-col :span="8">
            <el-form-item label="用例执行人" size="small" prop="assignTo">
              <el-select
                v-model="testCycleFrom.assignTo"
                filterable
                remote
                reserve-keyword
                placeholder="请选择用例执行人"
                clearable
                :remote-method="remoteReport"
                :loading="loading"
              >
                <el-option
                  v-for="item in optionsArr"
                  :key="item.id"
                  :label="item.userName"
                  :value="item.userName"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="关注者" size="small" prop="notifiyList ">
              <el-select
                v-model="testCycleFrom.notifiyList"
                filterable
                remote
                reserve-keyword
                placeholder="请选择关注者"
                clearable
                :remote-method="remoteReport"
                :loading="loading"
              >
                <el-option
                  v-for="item in optionsArr"
                  :key="item.id"
                  :label="item.userName"
                  :value="item.userName"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
                              <el-form-item size="small" label="测试平台" prop="platform">
                                <el-select v-model="testCycleFrom.platform" placeholder="请选择测试平台">
                                  <el-option
                                                                                   v-for="item in testPlatformArr"
                                                                                   :key="item"
                                                                                   :label="item"
                                                                                   :value="item"
                                                                                 />
                                                                                 <router-link to="/admincenter/admincenter?par=test_platform">
                                                                                                   <el-option label="Add New Value" value="" />
                                                                                                 </router-link>
                                </el-select>
                              </el-form-item>
                            </el-col>
       <el-col :span="8">
                            <el-form-item size="small" label="测试环境" prop="testEnv">
                              <el-select v-model="testCycleFrom.env" placeholder="请选择测试环境">
                                 <el-option
                                                  v-for="item in testEnvArr"
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
        </el-row>
        <el-form-item label="自动化编译">
          <el-input v-model="testCycleFrom.title" maxlength="30" size="small" />
        </el-form-item>
        <el-form-item label="Allure报表">
          <el-input v-model="testCycleFrom.title" maxlength="30" size="small" />
        </el-form-item>
        <el-form-item label="远程自动化编译">
                  <el-input v-model="testCycleFrom.title" maxlength="30" size="small" />
                </el-form-item>
        <el-form-item
          :label="$t('lang.Project.Description')"
          prop="description"
          size="small"
        >
          <el-input
            v-model="testCycleFrom.description"
            type="textarea"
            maxlength="1000"
            show-word-limit
            :autosize="{ minRows: 3, maxRows: 8 }"
          />
        </el-form-item>
      </div>
    </el-form>
    <div class="table">
      <el-button type="text" @click="newStep">添加用例</el-button>
      <el-table
        ref="testCaseData"
        :data="testCaseData"
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
          align="center"
        >
        <el-table-column
                       prop="stepStatus"
                       align="center"
                       :show-overflow-tooltip="true"
                       label="步骤运行状态"
                       />
         </el-table-column>

         <el-table-column
                  prop="lastRunDuration"
                  label="运行时长"
                  :show-overflow-tooltip="true"
                  align="center"
                >
                </el-table-column>

             <el-table-column
                  prop="lastRunner"
                  label="运行人"
                  :show-overflow-tooltip="true"
                  align="center"
                >
                </el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button
              type="text"
              class="table-btn"
              @click.stop="delview(scope.row)"
            >删除</el-button>
            <el-button
              type="text"
              class="table-btn"
              @click.stop="runview(scope.row)"
            >运行</el-button>
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
      <el-form
        ref="testCaseFrom"
        :model="testCaseFrom"
        :rules="testCaseFromRules"
        label-width="120px"
      >
        <el-form-item label="选择测试用例" prop="testCaseId" size="small">
          <el-select
            v-model="testCaseFrom.testCaseId"
            placeholder="请选择测试用例"
          >
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

import { testCaseListAll } from '@/api/testcase'

import { queryByNameSubUsers } from '@/api/project'
import { sysCustomField } from '@/api/systemArr'

import { message, returntomenu, formatChangedPara } from '@/utils/common'
export default {
  name: 'Addtestcycle',
  data() {
    return {
      optionsArr: [],
      versionsArr: [],
      statusArr: [],
      testEnvArr: [],
      testPlatformArr: [],
      loading: false,
      testCycleFrom: {
        currentVersion: 0
      },
      testCycleFromTemp: {},
      testCyclerules: {
        title: [{ required: true, message: '请输入故事标题', trigger: 'blur' }]
      },

      tableHeader: {
        color: '#d4dce3',
        background: '#003d79'
      },

      openDia: false,
      testCaseFrom: {
        testCycleId: undefined,
        testCaseId: undefined
      },
      testCaseData: [],
      testCaseDataSelect: [],
      testCaseFromRules: {
        testCaseId: [
          { required: true, message: '请选择测试用例', trigger: 'change' }
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
      this.testCaseFrom.testCycleId = this.$route.query.id
      detailTestCycle(this.$route.query.id).then((res) => {
        this.testCycleFrom = res.data
        this.testCycleFromTemp = Object.assign({}, this.testCycleFrom)
      })
      this.gettestCycleCase()
      testCaseListAll({
        projectId: this.projectInfo.userUseOpenProject.projectId,
        title: ''
      }).then((res) => {
        this.testCaseDataSelect = res.data
      })
    } else {
      this.testCycleFrom.projectId = this.projectInfo.userUseOpenProject.projectId
    }

    sysCustomField({ fieldName: 'versions' }).then((res) => {
      const data = res.data.mergeValues ? res.data.mergeValues : []
      this.versionsArr = data
    })
    sysCustomField({ fieldName: 'status' }).then((res) => {
          const data = res.data.mergeValues ? res.data.mergeValues : []
          this.statusArr = data
        })



     sysCustomField({ fieldName: 'test_env' }).then((res) => {
          const data = res.data.mergeValues ? res.data.mergeValues : []
          this.testEnvArr = data
        })
         sysCustomField({ fieldName: 'test_platform' }).then((res) => {
                  const data = res.data.mergeValues ? res.data.mergeValues : []
                  this.testPlatformArr = data
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
        description: undefined
      }
      this.$refs['testCycleFrom'].resetFields()
    },

    // 提交
    submitForm(formName, type) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.testCycleFrom.id) {
            const param = formatChangedPara(
              this.testCycleFromTemp,
              this.testCycleFrom
            )
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
        testCaseId: undefined
      }
      this.$refs['testCaseFrom'].resetFields()
    },
    gettestCycleCase() {
      testCycleCase(
        {
          pageNum: 1,
          pageSize: 10,
          testCycleId: this.testCaseFrom.testCycleId
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
        query: { id: row.id, testCycleId: this.testCycleFrom.id }
      })
    },
    delview(row) {
      bindCaseDelete(row.id).then((res) => {
        if (res.code === '200') {
          message('success', res.msg)
          this.gettestCycleCase()
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
@import "index.scss";
</style>
