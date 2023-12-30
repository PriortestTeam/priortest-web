<template>
  <div class="project-container app-container">
    <!-- <el-button class="all-btn" type="text" @click="hadleTreeshow">全部</el-button> -->
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
                新建测试周期
              </el-button>
            </div>

            <div class="oprate_btn">
              <el-button type="text" @click="projectRefresh">刷新</el-button>
              <el-button type="text" @click="addTestCase">添加用例到周期</el-button>
              <el-button type="text" :disabled="multiple" @click="projectClone">克隆
              </el-button>
              <el-button type="text" :disabled="multiple" @click="delproject('all')">批量删除
              </el-button>
              <el-button type="text" @click="exportTestCycle">导出测试周期</el-button>
              <el-button type="text" @click="selectMoreCol">更多列</el-button>
              <!-- <el-button type="text" :disabled="multiple">批量编辑</el-button> -->
            </div>
            <div v-loading="isLoading" class="table protable">
              <el-table ref="testCycletableData" :data="testCycletableData" :header-cell-style="tableHeader" stripe
                style="width: 100%" @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="45" />
                <el-table-column type="index" label="序号">
                  <template slot-scope="scope">
                    {{ scope.$index + 1 }}
                  </template>
                </el-table-column>
                <el-table-column prop="testCycleStatus" :show-overflow-tooltip="true" label="状态" />
                <el-table-column prop="title" :show-overflow-tooltip="true" width="180"
                  :label="$t('lang.CommonFiled.Title')">
                  <template slot-scope="scope">
                    <span class="title" @click="openEdit(scope.row, 1)">
                      {{ scope.row.title }}
                    </span>
                  </template>
                </el-table-column>
                <el-table-column prop="testMethod" :show-overflow-tooltip="true" label="测试方法" />
                <el-table-column prop="version" label="版本" />
                <el-table-column prop="currentRelease" label="当前版本">
                  <template slot-scope="scope">
                    {{ scope.row.currentRelease === 1 ? '是' : '否' }}
                  </template>
                </el-table-column>
                <el-table-column prop="released" label="发布版本">
                  <template slot-scope="scope">
                    {{ scope.row.released === 1 ? '是' : '否' }}
                  </template>
                </el-table-column>
                <el-table-column prop="runStatus" label="运行状态" />
                <el-table-column prop="env" label="环境" width="120" />
                <el-table-column prop="testPlatform" :show-overflow-tooltip="true" label="平台" />
                <el-table-column prop="instanceCount" label="用例数" />
                <el-table-column prop="planExecuteDate" label="计划执行时间" min-width="120" :show-overflow-tooltip="true" />
                <el-table-column prop="id" :show-overflow-tooltip="true" min-width="160" label="UUID" />

                <deletionDialog @confirm="confirmDelete" ref="deleteDialog" />

                <el-table-column label="操作" min-width="148" fixed="right">
                  <template slot-scope="scope">
                    <el-button type="text" class="table-btn" @click.stop="openEdit(scope.row)"
                      style="margin-right: 1px;">详情</el-button>
                    <el-button type="text" class="table-btn" @click.stop="projectClone(scope.row.id, 'single')"
                      style="margin-right: 1px;">克隆</el-button>
                    <el-button type="text" class="table-btn" @click.stop="delproject(scope.row)">删除</el-button>
                    <!-- <el-button type="text" class="table-btn" @click.stop="delproject(scope.row.id)" >删除</el-button>
                    <el-button type="text" class="table-btn" @click.stop="openDeleteConfirmation(scope.row)">删除确认</el-button> -->

                  </template>
                </el-table-column>
              </el-table>
              <pagination v-show="testCycleTotal > 0" :total="testCycleTotal" :page.sync="testCycleQuery.pageNum"
                :limit.sync="testCycleQuery.pageSize" @pagination="getqueryFortestCycle" />
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
import { testCycleList, deltestCycle, clonetestCycle, testCycleListByClick, saveInstance } from '@/api/testcycle'
import { handle } from 'express/lib/application'
import deletionDialog from './components/deletionDialog.vue';

// import { queryViews } from '@/api/project'

export default {
  name: 'testCycle',
  components: {
    viewTree,
    deletionDialog,

  },
  data() {
    return {
      treeCol: 3,
      currentScope: '5000001', //If need to scope name - change to 'testCycle'
      tableHeader: {
        color: '#d4dce3',
        background: '#4286CD'
      }, // 表头颜色加粗设置
      isLoading: false, // 是否加载
      activeNames: ['1'],

      testCycleQuery: {
        pageNum: 1,
        pageSize: 20
      },
      testCycleTotal: 0,
      testCycletableData: [],
      multipleSelection: [], // 多选
      single: true, // 非单个禁用
      multiple: true, // 非多个禁用
      projectIds: '',
      dialogVisible: false,  //若点击 添加到周期 ， 此值变为 true
      setTree: [], // tree数据
      testCycleBody: {
        scope: '',
        projectId: ''
      }, // tree的body数据
      viewSearchQueryId: ''
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
      // console.log('testCycle的created被调用');//没执行
      const query = {
        projectId: this.$route.query.projectId,
        viewTreeDto: {
          id: this.$route.query.viewTreeDtoId
        }
      }
      this.childByValue(query)
    } else {
      // 初始值
      this.getqueryFortestCycle()// 获取管理项目列表
    }
  },
  methods: {

    // 选择更多列
    selectMoreCol() {

    },

    // 新建项目
    newproject() {
      this.$router.push({ name: 'Addtestcycle', query: { isEdit: 1 } })
    },
    // 导入
    importtestCycle() {

    },
    exportTestCycle() {
      this.$router.push({ name: 'ExporttestCycle' })
    },

    /** 项目列表表格开始 */
    getqueryFortestCycle() {
      console.log("getqueryFortestCycle被调用了");
      console.log("this.viewSearchQueryId: ", this.viewSearchQueryId);
      if (this.viewSearchQueryId === '') {
        this.isLoading = true
        const query = {
          projectId: this.projectInfo.userUseOpenProject.projectId,
          viewTreeDto: {
            id: this.viewSearchQueryId
          }
        }
        console.log('query: ', query);
        return new Promise((resolve, reject) => {
          testCycleList(this.testCycleQuery, query).then(async res => {
            if (res.code === '200') {
              if (res.data.total > 0) {
                // 默认取第一条
                this.testCycleBody.scope = res.data.list[0].scope
                this.testCycleBody.projectId = this.projectInfo.userUseOpenProject.projectId
              }
              this.isLoading = false
              this.testCycletableData = res.data.list
              this.testCycleTotal = res.data.total
              resolve(res)
            }
          })
        })
      }
      else {
        const p = {
          scope: 'testCycle',
          viewId: this.viewSearchQueryId
        }
        testCycleListByClick(p, this.testCycleQuery).then(res => {
          console.log('viewClick: ', res, p, this.testCycleQuery)
          this.testCycletableData = res.data.list
          this.testCycleTotal = res.data.total
          this.isLoading = false
        }).catch(() => {
          this.ttestCycletableData = []
          this.testCycleTotal = 0
          this.isLoading = false
        })
      }
    },
    // 刷新
    async projectRefresh() {
      this.viewSearchQueryId = ''
      const res = await this.getqueryFortestCycle()
      if (res.code === '200') {
        message('success', '刷新成功')
        this.viewSearchQueryId = ''
      }

    },

    //点击 添加到用例周期
    addTestCase() {
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


    // 克隆
    projectClone(id, operation) {
      let parms = []
      if (operation === 'single') {
        parms = [id]
      } else {
        parms = this.projectIds.split(',')
      }
      clonetestCycle(parms).then(res => {
        if (res.code === '200') {
          message('success', res.msg)
          this.getqueryFortestCycle()
        }
      })
    },

    // Display the confirmation dialog
    openDeleteConfirmation(row) {
      console.log('openDeleteConfirmation method is invoked!');
      this.$refs.deleteDialog.showDialog(row);
    },

    confirmDelete(enteredTitle, selectedTestCycle) {
      console.log('confirmDelete method is invoked!');
      if (enteredTitle === selectedTestCycle.title) {
        // 删作
        this.delproject(selectedTestCycle.id);
      } else {
        // Display an error message for title mismatch
        this.$message.error('输入的测试周期标题与删除除的不一致.');
      }
    },

    // 删除项目
    delproject(row) {
      // if (id === 'all') {
      //   message('error', '暂未开发')
      //   return
      // }
      let inputValue = '';
      console.log(row);
      this.$prompt('请输入要删除的测试周期标题', ' ', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        // inputPattern: /[\w!#$%&'*+/=?^_`{|}~-]+(?:\.[\w!#$%&'*+/=?^_`{|}~-]+)*@(?:[\w](?:[\w-]*[\w])?\.)+[\w](?:[\w-]*[\w])?/,
        inputErrorMessage: '测试周期标题不匹配'
      }).then(({ value }) => {
        let meg;
        inputValue = value;
        value == row.title ? meg = '删除成功' : meg = '删除失败'
        this.$message({

          type: 'success',
          message: meg
        });
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '取消输入'
        });
      }).then(() => {
        if (inputValue !== row.title) {
          return
        } else {
          deltestCycle(row.id).then(res => {
            if (res.code === '200') {
              message('success', res.msg)
              this.getqueryFortestCycle()
            }
          })
        }
      });
    },
    // 表格多选
    handleSelectionChange(val) {
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
      this.$router.push({ name: 'Addtestcycle', query: { id: row.id, isEdit } })
    },

    childByValue: function (query) {
      this.isLoading = true
      this.viewSearchQueryId = query.viewTreeDto.id
      console.log('query: ', query);
      const params = {
        scope: 'testCycle',
        viewId: this.viewSearchQueryId
      }
      this.getqueryFortestCycle()
    },
    hadleTreeshow() {
      this.treeCol = this.treeCol === 3 ? 0 : 3
    },
    async hadleToViewAll() {
      this.viewSearchQueryId = ''
      await this.getqueryFortestCycle()
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
</style>
