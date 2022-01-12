<template>
  <div class="project-container app-container">
    <div v-if="treeCol == 0" class="showBtn" @click="hadleTreeshow">
      <i class="el-icon-d-arrow-right" />
    </div>
    <el-row>
      <el-col :span="treeCol">
        <view-tree
          :key="timer"
          :child-scope="currentScope"
          @hadleTree="hadleTreeshow"
          @childByValue="childByValue"
        />
      </el-col>
      <el-col :span="24 - treeCol">
        <el-card>
          <div class="project_table">
            <div class="new_project">
              <el-button type="primary" round @click="newproject">
                新建项目
              </el-button>
            </div>

            <div class="oprate_btn">
              <el-button type="text" @click="projectRefresh">刷新</el-button>
              <el-button
                type="text"
                :disabled="isAllowChangePro"
                @click="projectChange"
              >切换项目</el-button>
              <el-button
                type="text"
                :disabled="single"
                @click="projectClone"
              >克隆</el-button>
              <el-button
                type="text"
                :disabled="multiple"
                @click="delproject('all')"
              >批量删除</el-button>
              <!-- <el-button type="text" :disabled="multiple">批量编辑</el-button> -->
            </div>
            <div v-loading="isLoading" class="protable table">
              <el-table
                ref="projecttableData"
                :data="projecttableData"
                :header-cell-style="tableHeader"
                stripe
                style="width: 100%"
                @row-click="switcproject"
                @selection-change="handleSelectionChange"
              >
                <el-table-column type="selection" width="40" />
                <el-table-column
                  type="index"
                  align="left"
                  :label="$t('lang.CommonFiled.ID')"
                >
                  <template slot-scope="scope">
                    {{ scope.$index + 1 }}
                  </template>
                </el-table-column>
                <el-table-column
                  prop="title"
                  :show-overflow-tooltip="true"
                  align="left"
                  width="155"
                  :label="$t('lang.CommonFiled.Title')"
                >
                  <template slot-scope="scope">
                    <span
                      v-if="scope.row.id === userUseOpenProject.projectId"
                      class="title"
                      @click="openEdit(scope.row)"
                    >
                      {{ scope.row.title }}
                    </span>
                    <span v-else>
                      {{ scope.row.title }}
                    </span>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="reportToName"
                  align="left"
                  :label="$t('lang.CommonFiled.ReportTo')"
                />
                <el-table-column
                  prop="customer"
                  align="left"
                  :label="$t('lang.Project.Customer')"
                />

                <el-table-column
                  prop="testFrame"
                  align="left"
                  :label="$t('lang.Project.TestFrame')"
                  width="200"
                />
                <el-table-column
                  prop="projectCategory"
                  align="left"
                  :label="$t('lang.Project.ProjectCategory')"
                />

                <el-table-column
                  prop="status"
                  align="left"
                  :label="$t('lang.Project.Status')"
                />

                <el-table-column
                  prop="planReleaseDate"
                  align="left"
                  :label="$t('lang.Project.planReleaseDate')"
                  min-width="120"
                  :show-overflow-tooltip="true"
                >
                  <template slot-scope="scope">
                    <span>{{ scope.row.planReleaseDate || "-" }}</span>
                  </template>
                </el-table-column>

                <el-table-column
                  prop="closeDate"
                  align="left"
                  :label="$t('lang.CommonFiled.ClosedDate')"
                  min-width="120"
                  :show-overflow-tooltip="true"
                >
                  <template slot-scope="scope">
                    <span>{{ scope.row.closeDate || "-" }}</span>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="createTime"
                  align="left"
                  :label="$t('lang.CommonFiled.CreatedDate')"
                  min-width="120"
                  :show-overflow-tooltip="true"
                />
                <el-table-column label="操作" min-width="120" align="center">
                  <template slot-scope="scope">
                    <!-- <el-button type="text" class="table-btn">克隆</el-button>
                <span class="line">|</span> -->
                    <el-button
                      v-if="
                        scope.row.status !== '关闭' &&
                          scope.row.id === userUseOpenProject.projectId
                      "
                      type="text"
                      class="table-btn"
                      @click.stop="closeAction(scope.row)"
                    >关闭</el-button>
                    <el-button
                      v-if="scope.row.id !== userUseOpenProject.projectId"
                      type="text"
                      class="table-btn"
                      @click.stop="delproject(scope.row.id)"
                    >删除</el-button>
                  </template>
                </el-table-column>
              </el-table>
              <pagination
                v-show="projectTotal > 0"
                :total="projectTotal"
                :page.sync="projectQuery.pageNum"
                :limit.sync="projectQuery.pageSize"
                @pagination="getqueryForProjects"
              />
            </div>
          </div> </el-card></el-col>
    </el-row>
  </div>
</template>

<script>
import viewTree from './viewTree.vue'
import { message } from '@/utils/common'
import store from '@/store'
import {
  queryForProjects,
  delProjects,
  checkProject,
  getCloseProject
} from '@/api/project'
import { mapGetters } from 'vuex'
export default {
  name: 'Project',
  components: { viewTree },

  data() {
    return {
      treeCol: 5,
      currentScope: 'Project',
      tableHeader: {
        color: '#d4dce3',
        background: '#4286CD'
      }, // 表头颜色加粗设置
      isLoading: false, // 是否加载
      activeNames: ['1'],

      projectQuery: {
        pageNum: 1,
        pageSize: 10
      },
      projectTotal: 0,
      projecttableData: [],
      multipleSelection: [], // 多选
      isAllowChangePro: true,
      single: true, // 非单个禁用
      multiple: true, // 非多个禁用
      projectIds: '',

      setTree: [], // tree数据
      projectBody: {
        scope: '',
        projectId: ''
      },
      viewSearchQueryId: '',
      timer: ''
    }
  },
  computed: {
    ...mapGetters(['name']),
    userUseOpenProject() {
      return this.$store.state.user.userinfo.userUseOpenProject
    }
  },
  created() {
    // 初始值
    this.getqueryForProjects() // 获取管理项目列表
  },
  methods: {
    hadleTreeshow() {
      this.treeCol = this.treeCol === 5 ? 0 : 5
    },
    // 新建项目
    newproject() {
      const data = JSON.stringify({})
      this.$router.push({ name: 'Addproject', query: { info: data }})
    },

    /** 项目列表表格开始 */
    getqueryForProjects() {
      this.isLoading = true
      const query = {
        viewTreeDto: {
          id: this.viewSearchQueryId
        }
      }
      return new Promise((resolve, reject) => {
        queryForProjects(this.projectQuery, query).then(async(res) => {
          if (res.code === '200') {
            // 默认取第一条
            if (res.total > 0) {
              this.projectBody.scope = res.data[0].scope
              this.projectBody.projectId = res.data[0].id
            }

            this.isLoading = false
            this.projecttableData = res.data
            this.projectTotal = res.total

            resolve(res)
          }
        })
      })
    },
    // 刷新
    async projectRefresh() {
      const res = await this.getqueryForProjects()
      if (res.code === '200') {
        message('success', '刷新成功')
        this.viewSearchQueryId = ''
      }
    },
    // 切换项目
    projectChange() {
      checkProject(this.multipleSelection[0].id).then((res) => {
        if (res.code === '200') {
          this.$refs.projecttableData.clearSelection()
          store.dispatch('user/getInfo')
          this.timer = new Date().getTime()
          message('success', '切换项目成功')
        }
      })
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
      delProjects(id).then((res) => {
        if (res.code === '200') {
          message('success', res.msg)
          this.getqueryForProjects()
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
      const newSelection = this.multipleSelection.filter(item => item.id === this.userUseOpenProject.projectId)
      if (val.length !== 1 || newSelection.length > 0) {
        this.isAllowChangePro = true
      } else {
        this.isAllowChangePro = false
      }
    },
    // 表格行点击去编辑
    openEdit(row) {
      this.$router.push({ name: 'Addproject', query: { id: row.id }})
    },
    // 表格行点击
    switcproject(row) {
      this.projectBody.scope = row.scope
      this.projectBody.projectId = row.id
      // this.getqueryViews()
    },
    closeAction(row) {
      this.$prompt('请输入关闭理由：', '提示', {
        confirmButtonText: '确定',
        showCancelButton: false
      })
        .then(({ value }) => {
          if (value) {
            getCloseProject({ id: row.id, closeDesc: value }).then((res) => {
              this.getqueryForProjects()
            })
          }
          // TO DO DO ...
        })
        .catch({})
    },
    childByValue: function(query) {
      console.log('query--', query)
      this.isLoading = true
      this.viewSearchQueryId = query.viewTreeDto.id
      queryForProjects(this.projectQuery, query).then((res) => {
        this.projecttableData = res.data
        this.projectTotal = res.total
        this.isLoading = false
      })
    }
  }
}
</script>
<style lang="scss" scoped>
@import "index.scss";
</style>
