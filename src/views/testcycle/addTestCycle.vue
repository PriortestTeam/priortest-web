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
              <el-select v-model="testCycleFrom.feature" placeholder="关联故事">
                <el-option
                  v-for="item in featueData"
                  :key="item.id"
                  :label="item.title"
                  :value="item.id"
                >
                </el-option> </el-select></el-form-item
          ></el-col>
          <el-col :span="8">
            <el-form-item size="small" label="关联迭代" prop="sprint">
              <el-select v-model="testCycleFrom.sprint" placeholder="关联迭代">
                <el-option
                  v-for="item in sprintData"
                  :key="item.id"
                  :label="item.title"
                  :value="item.id"
                >
                </el-option> </el-select></el-form-item
          ></el-col>
          <el-col :span="8">
            <el-form-item label="版本" size="small" prop="version">
              <el-input
                v-model="testCycleFrom.version"
                maxlength="15"
              /> </el-form-item
          ></el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item size="small" label="状态" prop="status">
              <el-select v-model="testCycleFrom.status" placeholder="状态">
                <el-option label="completed" :value="1" />
                <el-option
                  label="uncompleted"
                  :value="2"
                /> </el-select></el-form-item
          ></el-col>
          <el-col :span="8">
            <el-form-item size="small" label="运行状态" prop="runStatus">
              <el-select v-model="testCycleFrom.runStatus" placeholder="状态">
                <el-option label="passed" :value="1" />
                <el-option
                  label="failed"
                  :value="2"
                /> </el-select></el-form-item
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
    <div class="table" v-if="this.testCycleFrom.id">
      <el-button type="text" @click="newStep">添加测试用例</el-button>
      <el-table
        ref="caseData"
        :data="caseData"
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
              @click.stop="delview(scope.row)"
              >删除</el-button
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
      <el-form
        ref="testCaseFrom"
        :model="testCaseFrom"
        :rules="testCaseFromRules"
        label-width="120px"
      >
        <el-form-item label="选择测试用例" prop="testCaseId" size="small">
          <el-select v-model="testCaseFrom.testCaseId" placeholder="请选择状态">
            <el-option
              v-for="item in testCaseDataSelect"
              :key="item.id"
              :label="item.title"
              :value="item.id"
            >
            </el-option>
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
import { detailTestCycle, addTestCycle, editTestCycle, testCycleCase, addtestCycle, bindCaseDelete } from '@/api/testcycle'
import { featureListAll } from '@/api/feature'
import { testCaseListAll } from '@/api/testcase'
import { sprintListAll } from '@/api/sprint'
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
      featueData: [],
      sprintData: [],

      tableHeader: {
        color: '#d4dce3',
        background: '#003d79'
      },
      caseData: [],

      openDia: false,
      testCaseFrom: {
        testCycleId: undefined,
        testCaseId: undefined,
      },
      testCaseData: [],
      testCaseDataSelect: [],
      testCaseFromRules: {
        testCaseId: [
          { required: true, message: '请选择测试用例', trigger: 'change' }
        ],

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
      this.testCaseFrom.testCycleId = this.$route.query.id
      detailTestCycle(this.$route.query.id).then(res => {
        this.testCycleFrom = res.data
        this.testCycleFromTemp = Object.assign({}, this.testCycleFrom)
      })
      this.gettestCycleCase()
      testCaseListAll({ projectId: this.projectInfo.userUseOpenProject.projectId, title: '' }).then(res => {
        this.testCaseDataSelect = res.data
      })
    } else {
      this.testCycleFrom.projectId = this.projectInfo.userUseOpenProject.projectId
    }
    this.getfeatureListAll()
    this.getsprintListAll()
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
        status: undefined,
        runStatus: undefined,
        feature: undefined,
        sprint: undefined,
        version: undefined,
        description: undefined,
      }
      this.$refs['testCycleFrom'].resetFields();
    },
    //得到所有故事
    getfeatureListAll() {
      featureListAll({ projectId: this.projectInfo.userUseOpenProject.projectId, title: '' }).then(res => {
        this.featueData = res.data
      })
    },
    getsprintListAll() {
      sprintListAll({ projectId: this.projectInfo.userUseOpenProject.projectId, title: '' }).then(res => {
        this.sprintData = res.data
      })
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

    /***编辑的表格 */
    resettestCaseFrom() {
      this.testCaseFrom = {
        testCycleId: this.testCycleFrom.id,
        testCaseId: undefined,
      }
      this.$refs['testCaseFrom'].resetFields();
    },
    gettestCycleCase() {
      testCycleCase({ pageNum: 1, pageSize: 10, testCycleId: this.testCaseFrom.testCycleId }, {
      }).then(res => {
        this.testCaseData = res.data
        console.log(res, 123)
      })
    },
    newStep() {
      this.openDia = true
    },
    submittestCaseFrom() {
      this.$refs['testCaseFrom'].validate((valid) => {
        if (valid) {
          addtestCycle(this.testCaseFrom).then(res => {
            if (res.code === "200") {
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
    delview(row) {
      bindCaseDelete(row.id).then(res => {
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
