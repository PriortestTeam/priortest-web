<template>
  <div class="project-container app-container">
    <div v-if="treeCol == 0" class="showBtn" @click="hadleTreeshow">
      <i class="el-icon-d-arrow-right" />
    </div>
    <el-button class="all-btn" type="text" @click="hadleToViewAll">全部</el-button>
    <el-row>
      <el-col :span="treeCol">
        <view-tree :child-scope="currentScope" @hadleTree="hadleTreeshow" @childByValue="childByValue" />
      </el-col>
      <el-col :span="24 - treeCol">
        <el-card>
          <div class="project_table">
            <div class="new_project">
              <el-button type="primary" @click="newproject">
                新建测试用例
              </el-button>
            </div>

            <div class="oprate_btn">
              <el-button type="text" @click="projectRefresh">刷新</el-button>
              <!-- <el-button type="text" :disabled="multiple" @click="addToTestCycle">添加到周期 </el-button> -->

              <el-button type="text" :disabled="multiple" @click="addToTestCycle">添加到周期 </el-button>
              <!-- <div class="addToCycleDialog"> -->
              <el-dialog title="添加用例到测试周期" :visible.sync="dialogVisible" width="30%" :show-close="false"
                class="addToCycleDialog">

                <div>
                  <el-button class="add" type="primary" :disabled="addDisabled" @click="addCaseToCycle">添加</el-button>
                  <el-button class="close" type="primary" @click="closeDialog">关闭</el-button>
                </div>
                <el-input class="QInput" placeholder="允许用户输入 查询条件《测试周期标题》" prefix-icon="el-icon-search"
                  v-model="queryInput">
                </el-input>
                <pagination v-show="testCycleTotal > 0" :total="testCycleTotal" :page.sync="testCycleQuery.pageNum"
                  :limit.sync="testCycleQuery.pageSize" @pagination="getTestCycleTitles" />

                <el-table ref="testCycletableData" :data="testCycletableData" highlight-current-row
                  @row-click="handleRowClick">
                  <el-table-column type="index" label="序号" width="60">
                    <template slot-scope="scope">
                      {{ scope.$index + 1 }}
                    </template>
                  </el-table-column>
                  <el-table-column prop="title" :show-overflow-tooltip="true" label="测试周期标题" width="300">
                    <template slot-scope="scope">
                      <span class="title">
                        {{ scope.row.title }}
                      </span>
                    </template>
                  </el-table-column>
                </el-table>

                <pagination v-show="testCycleTotal > 0" :total="testCycleTotal" :page.sync="testCycleQuery.pageNum"
                  :limit.sync="testCycleQuery.pageSize" @pagination="getTestCycleTitles" />

              </el-dialog>
              <!-- </div> -->

              <el-button type="text" :disabled="multiple" @click="projectClone">克隆
              </el-button>
              <el-button type="text" :disabled="multiple" @click="delproject('all')">批量删除
              </el-button>
              <el-button type="text" @click="importTestCases">导入测试用例</el-button>
              <el-button type="text" @click="selectMoreCol">更多列</el-button>
              <!-- <el-button type="text" :disabled="multiple">批量编辑</el-button> -->
            </div>
            <div v-loading="isLoading" class="table protable">
              <el-table ref="testCasetableData" :data="testCasetableData" :header-cell-style="tableHeader" stripe
                style="width: 100%" @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="45" />
                <el-table-column type="index" label="序号">
                  <template slot-scope="scope">
                    {{ scope.$index + 1 }}
                  </template>
                </el-table-column>
                <el-table-column prop="testStatus" :show-overflow-tooltip="true" label="状态" />
                <el-table-column prop="title" :show-overflow-tooltip="true" width="120"
                  :label="$t('lang.CommonFiled.Title')">
                  <template slot-scope="scope">
                    <span class="title" @click="openEdit(scope.row, 1)">
                      {{ scope.row.title }}
                    </span>
                  </template>
                </el-table-column>

                <el-table-column prop="testMethod" :show-overflow-tooltip="true" label="测试方法" />
                <el-table-column prop="priority" label="优先级" />
                <!--<el-table-column prop="feature" :show-overflow-tooltip="true" label="需求" /> -->
                <el-table-column prop="module" :show-overflow-tooltip="true" label="模块" />
                <el-table-column prop="version" :show-overflow-tooltip="true" label="版本" />
                <el-table-column prop="caseCategory"  :show-overflow-tooltip="true" label="分类" />
                <el-table-column prop="testType" :show-overflow-tooltip="true" label="测试类型" />
                <el-table-column prop="lastRunStatus" label="L-运行状态" />
                <!-- <el-table-column
                  prop="stepStatus"

                  :show-overflow-tooltip="true"
                  label="步骤运行状态"
                /> -->
                <el-table-column prop="executeTime" label="执行日期" min-width="120" :show-overflow-tooltip="true" />

                <el-table-column prop="env" label="环境" min-width="120" :show-overflow-tooltip="true" />
                <el-table-column prop="id" :show-overflow-tooltip="true" min-width="160" label="UUID" />

                <el-table-column label="操作" min-width="148" fixed="right">
                  <template slot-scope="scope">
                    <!-- <el-button type="text" class="table-btn">克隆</el-button>
                  <span class="line">|</span> -->
                    <el-button type="text" class="table-btn" @click.stop="openEdit(scope.row)">详情</el-button>
                    <el-button type="text" class="table-btn"
                      @click.stop="projectClone(scope.row.id, 'single')">克隆</el-button>
                    <el-button type="text" class="table-btn" @click.stop="delproject(scope.row.id)">删除 </el-button>
                  </template>
                </el-table-column>
              </el-table>

              <pagination v-show="testCaseTotal > 0" :total="testCaseTotal" :page.sync="testCaseQuery.pageNum"
                :limit.sync="testCaseQuery.pageSize" @pagination="getqueryForTestCase" />
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import viewTree from '../project/viewTree.vue'
import { message } from '@/utils/common'
import { testCaseList, delTestCase, cloneTestCase, testCaseListByClick } from '@/api/testcase'
import { getqueryFortestCycle } from '../testcycle/index.vue'
import { testCycleList, saveInstance } from '@/api/testcycle'
// import { queryViews } from '@/api/project'

export default {
  name: 'Testcase',
  components: { viewTree },
  data() {
    return {
      treeCol: 3,
      currentScope: '3000001', // If need to scope name - change to 'testCase'
      tableHeader: {
        color: '#d4dce3',
        background: '#4286CD'
      }, // 表头颜色加粗设置
      isLoading: false, // 是否加载
      activeNames: ['1'],

      testCaseQuery: {
        pageNum: 1,
        pageSize: 20
      },
      testCaseTotal: 0,
      testCasetableData: [],
      multipleSelection: [], // 多选
      single: true, // 非单个禁用
      multiple: true, // 非多个禁用
      projectIds: '',

      setTree: [], // tree数据
      testCaseBody: {
        scope: '',
        projectId: ''
      }, // tree的body数据
      viewSearchQueryId: '',

      dialogVisible: false,  //若点击 添加到周期 ， 此值变为 true
      testCycletableData: [],
      queryInput: '',
      isLoadingCycle: false, // 是否加载
      testCycleQuery: {
        pageNum: 1,
        pageSize: 20
      },
      testCycleBody: {
        scope: '',
        projectId: ''
      }, // tree的body数据
      testCycleTotal: 0,
      addDisabled: true,
      testCycleId: '',
      el_Key: 0,
    }
  },
  computed: {
    projectInfo() {
      return this.$store.state.user.userinfo
    }
  },
  created() {
    // 初始值
    if (this.$route.query.projectId && this.$route.query.viewTreeDtoId) {
      const query = {
        projectId: this.$route.query.projectId,
        viewTreeDto: {
          id: this.$route.query.viewTreeDtoId
        }
      }
      this.childByValue(query)
    } else {
      // 初始值
      this.getqueryForTestCase()// 获取管理项目列表
    }
  },

  methods: {
    // 选择更多列
    selectMoreCol() {

    },
    // 新建项目
    newproject() {
      this.$router.push({ name: 'Addtestcase', query: { isEdit: 1 } })
    },
    // 导入
    importTestCase() {

    },
    importTestCases() {
      this.$router.push({ name: 'ImportTestCases' })
    },

    /** 项目列表表格开始 */
    getqueryForTestCase() {
      this.isLoading = true
      if (this.viewSearchQueryId === '') {
        const query = {
          projectId: this.projectInfo.userUseOpenProject.projectId,
          viewTreeDto: {
            id: this.viewSearchQueryId
          }
        }
        return new Promise((resolve, reject) => {
          testCaseList(this.testCaseQuery, query).then(async res => {
            if (res.code === '200') {
              console.log('返回的测试用例集： ', res);
              if (res.data.total > 0) {
                // 默认取第一条
                this.testCaseBody.scope = res.data.list[0].scope
                this.testCaseBody.projectId = this.projectInfo.userUseOpenProject.projectId
              }
              this.isLoading = false
              this.testCasetableData = res.data.list
              this.testCaseTotal = res.data.total
              resolve(res)
            }
          })
        })
      } else {
        const p = {
          scope: 'testCase',
          viewId: this.viewSearchQueryId
        }
        // console.log('query.viewTreeDto.id: ', query.viewTreeDto.id);this.testCaseQuery
        testCaseListByClick(p, this.testCaseQuery).then(res => {
          console.log('viewClick: ', 1, res, p, this.testCaseQuery)
          this.testCasetableData = res.data.list
          this.testCaseTotal = res.data.total
          this.isLoading = false
        }).catch(() => {
          this.testCasetableData = []
          this.testCaseTotal = 0
          this.isLoading = false
        })
      }
    },
    // 刷新
    async projectRefresh() {
      const res = await this.getqueryForTestCase()
      if (res.code === '200') {
        message('success', '刷新成功')
        this.viewSearchQueryId = ''
      }
    },
    //点击 添加到测试周期
    addToTestCycle() {
      //   console.log("This is addtotestcycle!");
      this.dialogVisible = true
      // getqueryFortestCycle()
      this.getTestCycleTitles()
    },
    //对话框中获取测试周期数据，用于页面展示
    getTestCycleTitles() {
      this.isLoadingCycle = true
      const query = {
        projectId: this.projectInfo.userUseOpenProject.projectId,
        viewTreeDto: {
          id: this.viewSearchQueryId
        }
      }
      return new Promise((resolve, reject) => {
        testCycleList(this.testCycleQuery, query).then(async res => {
          if (res.code === '200') {
            // console.log("res.data: ", res.data);
            if (res.data.total > 0) {
              // console.log("res.data.list[0].scope:", res.data.list[0].scope);//undefined
              // 默认取第一条
              this.testCycleBody.scope = res.data.list[0].scope
              this.testCycleBody.projectId = this.projectInfo.userUseOpenProject.projectId
            }
            this.isLoadingCycle = false
            this.testCycletableData = res.data.list
            this.testCycleTotal = res.data.total
            resolve(res)
          }
        })
      })
    },
    //对话框中的行被点击
    handleRowClick(row, column, event) {
      // console.log('handleRowClick:',event.target);
      // console.log('row.id: ', row.id);
      if (event.target) {
        // console.log('row: ', row);
        this.addDisabled = false
        this.testCycleId = row.id
      }
    },
    //点击对话框的添加按钮，向后端发请求
    addCaseToCycle() {
      const parms = {
        projectId: this.projectInfo.userUseOpenProject.projectId,
        testCycleId: this.testCycleId,
        testCaseIds: this.projectIds.split(",")
      }
      return new Promise((resolve, reject) => {
        saveInstance(parms).then(async res => {
          if (res.code === '200') {
            message('success', res.msg)
            this.$refs.testCycletableData.setCurrentRow();
            this.addDisabled = true
            resolve(res)
          }
        })
      })
    },
    //点击对话框的关闭按钮
    closeDialog() {
      this.dialogVisible = false
      this.addDisabled = true
    },

    // 克隆
    projectClone(id, operation) {
      let parms = []
      if (operation === 'single') {
        parms = [id]
      } else {
        parms = this.projectIds.split(',')
      }
      cloneTestCase(parms).then(res => {
        if (res.code === '200') {
          message('success', res.msg)
          this.getqueryForTestCase()
        }
      })
    },


    // 删除项目
    delproject(id) {
      if (id === 'all') {
        message('error', '暂未开发')
        return
      }
      delTestCase(id).then(res => {
        if (res.code === '200') {
          message('success', res.msg)
          this.getqueryForTestCase()
        }
      })
    },
    // 表格多选
    handleSelectionChange(val) {
      // console.log('val: ', val);
      this.multipleSelection = val
      // 暂时不实现批量删除
      this.projectIds = ''
      for (let i = 0; i < val.length; i++) {
        this.projectIds += val[i].id + ','
      }
      this.projectIds = this.projectIds.slice(0, this.projectIds.length - 1)

      this.multiple = !val.length
      this.single = val.length !== 1
    },
    // 表格行点击去编辑
    openEdit(row, isEdit) {
      this.$router.push({ name: 'Addtestcase', query: { id: row.id, isEdit } })
    },
    // childByValue: function (query) {
    //   this.isLoading = true
    //   this.viewSearchQueryId = query.viewTreeDto.id
    //   testCaseList(this.testCaseQuery, query).then(res => {
    //     this.testCasetableData = res.data
    //     this.testCaseTotal = res.total
    //     this.isLoading = false
    //   }).catch(() => {
    //     this.testCasetableData = []
    //     this.testCaseTotal = 0
    //     this.isLoading = false
    //   })
    // },
    childByValue: function (query) {
      console.log("childByValue被调用了！");
      console.log('query: ', query);
      this.isLoading = true
      this.viewSearchQueryId = query.viewTreeDto.id
      this.testCaseQuery.pageNum = 1
      this.testCaseQuery.pageSize = 20

      this.getqueryForTestCase()
    },
    hadleTreeshow() {
      this.treeCol = this.treeCol === 3 ? 0 : 3
    },
    async hadleToViewAll() {
      this.viewSearchQueryId = ''
      await this.getqueryForTestCase()
    }
  }
}
</script>
<style lang="scss" scoped>
@import "index.scss";

.app-container {

  position: relative;

  .all-btn {
    z-index: 999999999999;
    position: absolute;
    top: 68px;
    left: 1.75%;
    color: rgb(96, 98, 102);
    font-size: 14px;
  }
}

.addToCycleDialog ::v-deep .el-dialog__body {
  // height: 500px;
  padding-top: 10px;

  .add,
  .close {
    width: 60px;
    height: 25px;
    line-height: 25px;
    margin-bottom: 15px;
  }

  .QInput {
    font-size: 12px;
    height: 25px;
    line-height: 25px;

    .el-input__inner {
      height: 100%;
      // line-height: 25px;
      // padding: 5px;
    }

    .el-input__icon {
      line-height: 25px;
    }
  }

  .el-table__body-wrapper {
    cursor: pointer;
  }
}
</style>
