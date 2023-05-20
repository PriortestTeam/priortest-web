<template>
  <div class="project-container app-container">
    <div v-if="treeCol == 0" class="showBtn" @click="hadleTreeshow">
      <i class="el-icon-d-arrow-right" />
    </div>
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
              <el-button type="text" :disabled="multiple" @click="projectClone">克隆
              </el-button>
              <el-button type="text" :disabled="multiple" @click="delproject('all')">批量删除
              </el-button>
              <el-button type="text" @click="exportTestCycle">导出测试周期</el-button>
              <el-button type="text" @click="selectMoreCol">更多列</el-button>
              <!-- <el-button type="text" :disabled="multiple">批量编辑</el-button> -->
            </div>
            <div v-loading="isLoading" class="protable table">
              <el-table ref=" testCycletableData" :data=" testCycletableData" :header-cell-style="tableHeader" stripe
                style="width: 100%" @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="45" />
                <el-table-column type="index"  label="序号">
                  <template slot-scope="scope">
                    {{ scope.$index + 1 }}
                  </template>
                </el-table-column>
                <el-table-column prop="testCycleStatus" :show-overflow-tooltip="true"  label="状态" />
                <el-table-column prop="title" :show-overflow-tooltip="true"  width="120"
                  :label="$t('lang.CommonFiled.Title')">
                  <template slot-scope="scope">
                    <span class="title" @click="openEdit(scope.row, 1)">
                      {{ scope.row.title }}
                    </span>
                  </template>
                </el-table-column>
                <el-table-column prop="testMethod" :show-overflow-tooltip="true"  label="测试方法" />
                <el-table-column prop="version"  label="版本" />
                <el-table-column prop="currentRelease"  :show-overflow-tooltip="true" label="当前版本" />
                <el-table-column prop="runStatus"  :show-overflow-tooltip="true" label="运行状态" />
                <el-table-column prop="env"  :show-overflow-tooltip="true" label="环境" />
                <!--<el-table-column prop="instanceCount"  :show-overflow-tooltip="true" label="运行用例数" />-->
                <el-table-column prop="planExecuteDate"  label="执行时间" min-width="120"
                  :show-overflow-tooltip="true" />
                <el-table-column prop="createTime"  label="创建日期" min-width="120"
                  :show-overflow-tooltip="true" />
                    <el-table-column prop="id" :show-overflow-tooltip="true"  min-width="160" label="UUID" />
                <el-table-column label="操作" min-width="145"  fixed="right">
                  <template slot-scope="scope">
                    <!-- <el-button type="text" class="table-btn">克隆</el-button>
                  <span class="line">|</span> -->
                    <el-button type="text" class="table-btn" @click.stop="openEdit(scope.row)">详情
                    </el-button>
                    <el-button type="text" class="table-btn" @click.stop="projectClone(scope.row.id,'single')">克隆</el-button>
                    <el-button type="text" class="table-btn" @click.stop="delproject(scope.row.id)">删除
                    </el-button>
                  </template>
                </el-table-column>
              </el-table>

              <pagination v-show="testCycleTotal > 0" :total=" testCycleTotal" :page.sync="testCycleQuery.pageNum"
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
import {testCycleList, deltestCycle,clonetestCycle } from '@/api/testcycle'
// import { queryViews } from '@/api/project'

export default {
  name: 'testCycle',
  components: { viewTree },
  data() {
    return {
      treeCol: 5,
      currentScope: 'testCycle',
      tableHeader: {
        color: '#d4dce3',
        background: '#4286CD'
      }, // 表头颜色加粗设置
      isLoading: false, // 是否加载
      activeNames: ['1'],

      testCycleQuery: {
        pageNum: 1,
        pageSize: 10
      },
      testCycleTotal: 0,
      testCycletableData: [],
      multipleSelection: [], // 多选
      single: true, // 非单个禁用
      multiple: true, // 非多个禁用
      projectIds: '',

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
    exporttestCycle() {
      this.$router.push({ name: 'ExporttestCycle' })
    },

    /** 项目列表表格开始 */
    getqueryFortestCycle() {
      this.isLoading = true
      const query = {
        projectId: this.projectInfo.userUseOpenProject.projectId,
        viewTreeDto: {
          id: this.viewSearchQueryId
        }
      }
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
    },
    // 刷新
    async projectRefresh() {
      const res = await this.getqueryFortestCycle()
      if (res.code === '200') {
        message('success', '刷新成功')
        this.viewSearchQueryId = ''
      }
    },




    // 克隆
    projectClone(id, operation) {
      let parms = []
      if (operation === 'single'){
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


    // 删除项目
    delproject(id) {
      if (id === 'all') {
        message('error', '暂未开发')
        return
      }
      deltestCycle(id).then(res => {
        if (res.code === '200') {
          message('success', res.msg)
          this.getqueryFortestCycle()
        }
      })
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
      testCycleList(this.testCycleQuery, query).then(res => {
        this.testCycletableData = res.data
        this.testCycleTotal = res.total
        this.isLoading = false
      }).catch(() => {
        this.testCycletableData = []
        this.testCycleTotal = 0
        this.isLoading = false
      })
    },
    hadleTreeshow() {
      this.treeCol = this.treeCol === 5 ? 0 : 5
    }
  }
}
</script>
<style lang="scss" scoped>
@import "index.scss";
</style>
