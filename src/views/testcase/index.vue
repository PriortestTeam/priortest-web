<template>
  <div class="project-container app-container">
    <el-row>
      <el-col :span="5">
        <view-tree :child-scope="currentScope" @childByValue="childByValue" />
      </el-col>
      <el-col
        :span="19"
      >
        <div class="project_table">
<div class="new_project">
          <el-button type="primary" round @click="newproject">
            新建测试用例
          </el-button>          
      </div>

          <div class="oprate_btn">
            <el-button type="text" @click="projectRefresh">刷新</el-button>
            <el-button
              type="text"
              :disabled="single"
              @click="projectClone"
            >克隆
            </el-button>
            <el-button
              type="text"
              :disabled="multiple"
              @click="delproject('all')"
            >批量删除
            </el-button>
            <el-button type="text" @click="importTestCases">导入测试用例</el-button>
            <!-- <el-button type="text" :disabled="multiple">批量编辑</el-button> -->
          </div>
          <div v-loading="isLoading" class="protable table">
            <el-table
              ref="testCasetableData"
              :data="testCasetableData"
              :header-cell-style="tableHeader"
              stripe
              style="width: 100%"
              @selection-change="handleSelectionChange"
            >
              <el-table-column type="selection" width="55" />
              <el-table-column type="index" align="center" label="序号">
                <template slot-scope="scope">
                  {{ scope.$index + 1 }}
                </template>
              </el-table-column>
              <el-table-column
                              prop="UUID"
                              :show-overflow-tooltip="true"
                              align="center"
                              label="UUID"
                            />

              <el-table-column
                            prop="status"
                            :show-overflow-tooltip="true"
                            align="center"
                            label="状态"
                          />             


 <el-table-column
              prop="title"
              :show-overflow-tooltip="true"
              align="left"
              width="155"
              :label="$t('lang.CommonFiled.Title')"
            >
              <template slot-scope="scope">
                <span class="title" @click="openEdit(scope.row)">
                  {{ scope.row.title }}
                </span>
              </template>
            </el-table-column>


                 <el-table-column
                              prop="test_method"
                              :show-overflow-tooltip="true"
                              align="center"
                              label="测试方法"
                            />
              <el-table-column prop="priority" align="center" label="优先级" />
              <el-table-column
                prop="feature"
                align="center"
                :show-overflow-tooltip="true"
                label="需求"
              />
                 <el-table-column
                              prop="module"
                              align="center"
                              :show-overflow-tooltip="true"
                              label="模块"
                            />

                 <el-table-column
                  prop="version"
                  align="center"
                  :show-overflow-tooltip="true"
                  label="版本"
                  />

                  <el-table-column
                    prop="testCategory"
                   align="center"
                   :show-overflow-tooltip="true"
                   label="测试分类"
                  />
           <el-table-column
             prop="testType"
             align="center"
             :show-overflow-tooltip="true"
             label="测试类型"
             />
              <el-table-column
                prop="lastRunStatus"
                align="center"
                label="末次运行状态"
              >

              <el-table-column
               prop="stepStatus"
               align="center"
               :show-overflow-tooltip="true"
               label="步骤运行状态"
               />
              </el-table-column>


              <el-table-column
                prop="executedDate"
                align="center"
                label="执行时间"
                min-width="120"
                :show-overflow-tooltip="true"
              />

              <el-table-column
                prop="createTime"
                align="center"
                label="创建日期"
                min-width="120"
                :show-overflow-tooltip="true"
              />

              <el-table-column label="操作" min-width="120" align="center">
                <template slot-scope="scope">
                  <!-- <el-button type="text" class="table-btn">克隆</el-button>
                  <span class="line">|</span> -->
                  <el-button
                    type="text"
                    class="table-btn"
                    @click.stop="openEdit(scope.row)"
                  >克隆
                  </el-button>
                  <el-button
                    type="text"
                    class="table-btn"
                    @click.stop="delproject(scope.row.id)"
                  >删除
                  </el-button>
                </template>
              </el-table-column>
            </el-table>

            <pagination
              v-show="testCaseTotal > 0"
              :total="testCaseTotal"
              :page.sync="testCaseQuery.pageNum"
              :limit.sync="testCaseQuery.pageSize"
              @pagination="getqueryForTestCase"
            />
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import viewTree from '../project/viewTree.vue'
import { message } from '@/utils/common'
import { testCaseList, delTestCase } from '@/api/testcase'
import { queryViews } from '@/api/project'

export default {
  name: 'Testcase',
  components: { viewTree },
  data() {
    return {
      currentScope: 'TestCase',
      tableHeader: {
        color: '#d4dce3',
        background: '#4286CD'
      }, // 表头颜色加粗设置
      isLoading: false, // 是否加载
      activeNames: ['1'],

      testCaseQuery: {
        pageNum: 1,
        pageSize: 10
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
    this.getqueryForTestCase()// 获取管理项目列表
  },
  methods: {
    // 新建项目
    newproject() {
      this.$router.push({ name: 'Addtestcase' })
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
      const query = {
        projectId: this.projectInfo.userUseOpenProject.projectId,
        viewTreeDto: {
          id: this.viewSearchQueryId
        }
      }
      return new Promise((resolve, reject) => {
        testCaseList(this.testCaseQuery, query).then(async res => {
          if (res.code === '200') {
            if (res.total > 0) {
              // 默认取第一条
              this.testCaseBody.scope = res.data[0].scope
              this.testCaseBody.projectId = this.projectInfo.userUseOpenProject.projectId
            }
            this.isLoading = false
            this.testCasetableData = res.data
            this.testCaseTotal = res.total
            resolve(res)
          }
        })
      })
    },
    // 刷新
    async projectRefresh() {
      const res = await this.getqueryForTestCase()
      if (res.code === '200') {
        message('success', '刷新成功')
        this.viewSearchQueryId = ''
      }
    },

    // 克隆
    projectClone() {
      message('error', '暂未开发')
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
    openEdit(row) {
      this.$router.push({ name: 'Addtestcase', query: { id: row.id }})
    },
    childByValue: function(query) {
      this.isLoading = true
      this.viewSearchQueryId = query.viewTreeDto.id
      console.log(query)
      testCaseList(this.testCaseQuery, query).then(res => {
        this.testCasetableData = res.data
        this.testCaseTotal = res.total
        this.isLoading = false
      }).catch(() => {
        this.testCasetableData = []
        this.testCaseTotal = 0
        this.isLoading = false
      })
    }
    /** 项目列表表格结束 */

  }
}
</script>
<style lang="scss" scoped>
@import "index.scss";
</style>
