<template>
  <div class="project-container app-container">
    <div class="new_project">
      <el-button type="primary" round @click="newproject"> 新建缺陷 </el-button>
    </div>
    <el-row>
  <el-col :span="5">
      <view-tree :childScope="currentScope"  v-on:childByValue="childByValue"></view-tree>
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
              ref="issueData"
              :data="issueData"
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
              <el-table-column prop="status" align="center" label="状态">
                <template slot-scope="scope">
                  <span>{{
                    scope.row.status === 1
                      ? "open"
                      : scope.row.status === 2
                      ? "assigned"
                      : scope.row.status === 3
                      ? "fixed"
                      : scope.row.status === 4
                      ? "closed"
                      : ""
                  }}</span>
                </template>
              </el-table-column>

              <el-table-column prop="version" align="center" label="版本" />

              <el-table-column
                prop="createTime"
                align="center"
                label="创建日期"
                min-width="120"
                :show-overflow-tooltip="true"
              />
              <el-table-column
                prop="plannedReleaseDate"
                align="center"
                label="计划发型日期"
                min-width="120"
                :show-overflow-tooltip="true"
              >
              </el-table-column>

              <el-table-column label="操作" min-width="160" align="center">
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
              v-show="issueTotal > 0"
              :total="issueTotal"
              :page.sync="issueQuery.pageNum"
              :limit.sync="issueQuery.pageSize"
              @pagination="getIssueList"
            />
          </div></div
      ></el-col>
    </el-row>
  </div>
</template>

<script>
  import viewTree from '../project/viewTree.vue'
import { message } from '@/utils/common'
import { issueList, delIssue } from '@/api/issue'
import { queryViews } from '@/api/project'

export default {
  name: 'Issue',
  data() {
    return {
      currentScope: 'Issue',
      tableHeader: {
        color: '#d4dce3',
        background: '#003d79'
      }, // 表头颜色加粗设置
      isLoading: false, // 是否加载
      activeNames: ['1'],



      issueQuery: {
        pageNum: 1,
        pageSize: 10,
      },
      issueTotal: 0,
      issueData: [],
      multipleSelection: [],//多选
      single: true, // 非单个禁用
      multiple: true, // 非多个禁用
      issueIds: '',

      setTree: [], // tree数据
      issueBody: {
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
    this.getIssueList()// 获取管理项目列表
  },
  methods: {
    // 新建项目
    newproject() {
      this.$router.push({ name: 'Addissue' })
    },

    /**项目列表表格开始 */
    getIssueList() {
      this.isLoading = true
      const query = {
        projectId: this.projectInfo.userUseOpenProject.projectId,
        viewTreeDto : {
          id: this.viewSearchQueryId
        }
      }
      return new Promise((resolve, reject) => {
        issueList(this.issueQuery, query).then(async res => {
          if (res.code === '200') {
            // 默认取第一条
            if (res.total > 0) {
              this.issueBody.scope = res.data[0].scope
              this.issueBody.projectId = this.projectInfo.userUseOpenProject.projectId
            }
            this.isLoading = false
            this.issueData = res.data
            this.issueTotal = res.total
            resolve(res)
          }
        })
      })
    },
    // 刷新
    async projectRefresh() {
      const res = await this.getIssueList()
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
      delIssue(id).then(res => {
        if (res.code === '200') {
          message('success', res.msg)
          this.getIssueList()
        }
      })
    },
    // 表格多选
    handleSelectionChange(val) {
      this.multipleSelection = val
      // 暂时不实现批量删除
      this.issueIds = ''
      for (let i = 0; i < val.length; i++) {
        this.issueIds += val[i].id + ','
      }
      this.issueIds = this.issueIds.slice(0, this.issueIds.length - 1)
      this.multiple = !val.length
      this.single = val.length !== 1
    },
    // 表格行点击去编辑
    openEdit(row) {

      this.$router.push({ name: 'Addissue', query: { id: row.id } })
    },
    childByValue: function (query) {
      this.isLoading = true
      this.viewSearchQueryId = query.viewTreeDto.id
      issueList(this.featureQuery, query).then(res => {
        this.issueData = res.data
        this.issueTotal = res.total
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
