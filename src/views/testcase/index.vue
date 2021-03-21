<template>
  <div class="project-container app-container">
    <div class="new_project">
      <el-button type="primary" round @click="newproject">
        新建测试用例
      </el-button>
      <!-- <el-button type="primary" round  @click="importTestCase"> 导入 </el-button> -->
    </div>
    <el-row>
      <el-col :span="5">
        <div class="comp-tree">
          <div class="new_project">
            <el-button type="primary" round>
              <router-link to="/project/projectview?scope=TestCase">
                新建视图
              </router-link>
            </el-button>
            <el-button type="primary" round>
              <router-link to="/project/projectview?scope=TestCase">
                管理视图
              </router-link>
            </el-button>
          </div>
          <!-- 折叠面板 -->
          <el-collapse v-model="activeNames">
            <el-collapse-item
              v-for="(item, index) in setTree"
              :key="index"
              :title="item.scope"
              :name="index"
            >
              <div
                v-for="(item1, index1) in item.oneFilters"
                :key="index1"
                class="viewtext"
              >
                {{ item1.fieldName }}
              </div>
            </el-collapse-item>
          </el-collapse>
          <div v-if="setTree.length === 0" class="nodata">暂无数据</div>
        </div>
      </el-col>
      <el-col :span="19"
        ><div class="project_table">
          <div class="oprate_btn">
            <el-button type="text" @click="projectRefresh">刷新</el-button>
            <el-button type="text" :disabled="single" @click="projectClone"
              >克隆</el-button
            >
            <el-button
              type="text"
              :disabled="multiple"
              @click="delproject('all')"
              >批量删除</el-button
            >
            <!-- <el-button type="text" :disabled="multiple">批量编辑</el-button> -->
          </div>
          <div class="protable table" v-loading="isLoading">
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
                prop="title"
                :show-overflow-tooltip="true"
                align="center"
                label="标题"
              />
              <el-table-column prop="priority" align="center" label="优先级" />
              <el-table-column
                prop="featureTitle"
                align="center"
                :show-overflow-tooltip="true"
                label="需求"
              />
              <el-table-column
                prop="lastRunStatus"
                align="center"
                label="末次运行状态"
              >
              <template slot-scope="scope">
                  {{ scope.row.lastRunStatus===1?'失败':"成功"}}
                </template>
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
                    >编辑</el-button
                  >
                  <el-button
                    type="text"
                    class="table-btn"
                    @click.stop="delproject(scope.row.id)"
                    >删除</el-button
                  >
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
          </div></div
      ></el-col>
    </el-row>
  </div>
</template>

<script>
import { message } from '@/utils/common'
import { testCaseList, delTestCase } from '@/api/testcase'
import { queryViews } from '@/api/project'

export default {
  name: 'Testcase',
  data() {
    return {
      tableHeader: {
        color: '#d4dce3',
        background: '#003d79'
      }, // 表头颜色加粗设置
      isLoading: false, // 是否加载
      activeNames: ['1'],


      testCaseQuery: {
        pageNum: 1,
        pageSize: 10
      },
      testCaseTotal: 0,
      testCasetableData: [],
      multipleSelection: [],//多选
      single: true, // 非单个禁用
      multiple: true, // 非多个禁用
      projectIds: '',

      setTree: [], // tree数据
      testCaseBody: {
        scope: '',
        projectId: ''
      },//tree的body数据
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
    //导入
    importTestCase() {

    },
    /** 左侧视图*/
    // view视图列表
    getqueryViews() {
      return new Promise((resolve, reject) => {
        queryViews(this.testCaseBody, this.testCaseQuery).then(res => {
          if (res.code === '200') {
            this.setTree = res.data
            resolve(res)
          }
        })
      })
    },

    /**项目列表表格开始 */
    getqueryForTestCase() {
      this.isLoading = true
      return new Promise((resolve, reject) => {
        testCaseList(this.testCaseQuery, { projectId: this.projectInfo.userUseOpenProject.projectId }).then(async res => {
          if (res.code === '200') {
            if (res.total > 0) {
              // 默认取第一条
              this.testCaseBody.scope = res.data[0].scope
              this.testCaseBody.projectId = this.projectInfo.userUseOpenProject.projectId
              await this.getqueryViews()
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
      this.$router.push({ name: 'Addtestcase', query: { id: row.id } })
    },

    /**项目列表表格结束 */

  }
}
</script>
<style lang="scss" scoped>
@import "index.scss";
</style>
