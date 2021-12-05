<template>
  <div class="project-container app-container">
    <div class="new_project">
      <el-button type="primary" round @click="newproject">
        新建测试周期
      </el-button>
    </div>
    <el-row >
  <el-col :span="5">
      <view-tree :childScope="currentScope" v-on:childByValue="childByValue"></view-tree>

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
            <el-button type="text" :disabled="multiple">批量编辑</el-button>
             <el-button type="text" :disabled="multiple">计划运行</el-button>
             <el-button type="text" :disabled="multiple">添加用例</el-button>
          </div>
          <div class="protable table" v-loading="isLoading">
            <el-table
              ref="featureData"
              :data="featureData"
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
                prop="title"
                :show-overflow-tooltip="true"
                align="center"
                label="标题"
              />

                <el-table-column
                              prop="version"
                              :show-overflow-tooltip="true"
                              align="center"
                              label="版本"
                            />
                    <el-table-column
                                prop="currentRelease"
                                :show-overflow-tooltip="true"
                                align="center"
                                label="当前发布版本"
                              />
                   <el-table-column
                                              prop="Release"
                                              :show-overflow-tooltip="true"
                                              align="center"
                                              label="发布版本"
                                            />

              <el-table-column
                prop="status"
                min-width="100"
                align="center"
                label="状态"
              >



                <template slot-scope="scope">
                  <span>{{
                    scope.row.status === 1
                      ? "completed"
                      : scope.row.status === 2
                      ? "uncompleted"
                      : ""
                  }}</span>
                </template>
              </el-table-column>

              <el-table-column
                prop="runStatus"
                min-width="100"
                align="center"
                label="运行状态"
              >

                <template slot-scope="scope">
                  <span>{{
                    scope.row.runStatus === 1
                      ? "passed"
                      : scope.row.runStatus === 2
                      ? "failed"
                      : ""
                  }}</span>
                </template>
<el-table-column
               prop="stepStatus"
               align="center"
               :show-overflow-tooltip="true"
               label="测试步骤执行状态"
               />
              </el-table-column>

 <el-table-column
                prop="lastRunTime"
                align="center"
                label="最后运行日期"
                min-width="120"
                :show-overflow-tooltip="true"
              />

               <el-table-column
                              prop="closeTime"
                              align="center"
                              label="关闭期"
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
              <el-table-column label="操作" min-width="160" align="center">
                <template slot-scope="scope">
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
              v-show="featureTotal > 0"
              :total="featureTotal"
              :page.sync="testCycleQuery.pageNum"
              :limit.sync="testCycleQuery.pageSize"
              @pagination="getfeatureList"
            />
          </div></div
      ></el-col>
    </el-row>
  </div>
</template>

<script>
  import viewTree from '../project/viewTree.vue'
import { message } from '@/utils/common'
import { testCycleList, delTestCycle } from '@/api/testcycle'
import { queryViews } from '@/api/project'

export default {
  name: 'Testcycle',
  data() {
    return {
      currentScope: 'TestCycle',
      tableHeader: {
        color: '#d4dce3',
        background: '#4286CD'
      }, // 表头颜色加粗设置
      isLoading: false, // 是否加载
      activeNames: ['1'],



      testCycleQuery: {
        pageNum: 1,
        pageSize: 10,
      },
      featureTotal: 0,
      featureData: [],
      multipleSelection: [],//多选
      single: true, // 非单个禁用
      multiple: true, // 非多个禁用
      featureIds: '',

      setTree: [], // tree数据
      testCycleBody: {
        scope: '',
        projectId: ''
      },//tree的参数
      viewSearchQueryId: ''
    }
  },
  components: {viewTree},
  computed: {
    projectInfo() {
      return this.$store.state.user.userinfo
    }
  },

  created() {
    this.getfeatureList()// 获取管理项目列表
  },
  methods: {
    // 新建项目
    newproject() {
      this.$router.push({ name: 'Addtestcycle' })
    },

    /**项目列表表格开始 */
    getfeatureList() {
      this.isLoading = true
      const query = {
        projectId: this.projectInfo.userUseOpenProject.projectId,
        viewTreeDto : {
          id: this.viewSearchQueryId
        }
      }
      return new Promise((resolve, reject) => {
        testCycleList(this.testCycleQuery, query).then(async res => {
          if (res.code === '200') {
            // 默认取第一条
            if (res.total > 0) {
              this.testCycleBody.scope = res.data[0].scope
              this.testCycleBody.projectId = this.projectInfo.userUseOpenProject.projectId
            }
            this.isLoading = false
            this.featureData = res.data
            this.featureTotal = res.total
            resolve(res)
          }
        })
      })
    },
    // 刷新
    async projectRefresh() {
      const res = await this.getfeatureList()
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
      delTestCycle(id).then(res => {
        if (res.code === '200') {
          message('success', res.msg)
          this.getfeatureList()
        }
      })
    },
    // 表格多选
    handleSelectionChange(val) {
      this.multipleSelection = val
      // 暂时不实现批量删除
      this.featureIds = ''
      for (let i = 0; i < val.length; i++) {
        this.featureIds += val[i].id + ','
      }
      this.featureIds = this.featureIds.slice(0, this.featureIds.length - 1)
      this.multiple = !val.length
      this.single = val.length !== 1
    },
    // 表格行点击去编辑
    openEdit(row) {

      this.$router.push({ name: 'Addtestcycle', query: { id: row.id } })
    },
    childByValue: function (query) {
      this.isLoading = true
      this.viewSearchQueryId = query.viewTreeDto.id
      testCycleList(this.featureQuery, query).then(res => {
        this.featureData = res.data
        this.featureTotal = res.total
        this.isLoading = false
      })
    }

    /**项目列表表格结束 */

  }
}
</script>
<style lang="scss" scoped>
@import "index.scss";
</style>
