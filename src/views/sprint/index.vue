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
                新建迭代
              </el-button>
            </div>

            <div class="oprate_btn">
              <el-button type="text" @click="projectRefresh">刷新</el-button>
              <el-button type="text" :disabled="multiple" @click="projectClone">克隆
              </el-button>
              <el-button type="text" :disabled="multiple" @click="delproject('all')">批量删除
              </el-button>
              <el-button type="text" @click="selectMoreCol">更多列</el-button>
            </div>
            <div v-loading="isLoading" class="table protable">
              <el-table ref="sprinttableData" :data="sprinttableData" :header-cell-style="tableHeader" stripe
                style="width: 100%" @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="45" />
                <el-table-column type="index" label="序号">
                  <template slot-scope="scope">
                    {{ scope.$index + 1 }}
                  </template>
                </el-table-column>
                <el-table-column prop="title" :show-overflow-tooltip="true" width="120"
                  :label="$t('lang.CommonFiled.Title')">
                  <template slot-scope="scope">
                    <span class="title" @click="openEdit(scope.row, 1)">
                      {{ scope.row.title }}
                    </span>
                  </template>
                </el-table-column>

                <el-table-column prop="sprintStatus" :show-overflow-tooltip="true" label="迭代状态" />
                <el-table-column prop="epic" :show-overflow-tooltip="true" label="epic主题" />
                <el-table-column prop="startDate" :show-overflow-tooltip="true" label="开始日期" />
                <el-table-column prop="endDate" :show-overflow-tooltip="true" label="结束日期" />
                <el-table-column prop="sprintGoal" :show-overflow-tooltip="true" label="迭代目标" />
                <el-table-column label="操作" min-width="148" fixed="right">
                  <template slot-scope="scope">
                    <!-- <el-button type="text" class="table-btn">克隆</el-button>
                  <span class="line">|</span> -->
                    <el-button type="text" class="table-btn" @click.stop="openEdit(scope.row)">详情
                    </el-button>

                    <el-button type="text" class="table-btn"
                      @click.stop="projectClone(scope.row.id, 'single')">克隆</el-button>
                    <el-button type="text" class="table-btn" @click.stop="delproject(scope.row.id)">删除
                    </el-button>
                  </template>
                </el-table-column>
              </el-table>
              <pagination v-show="sprintTotal > 0" :total="sprintTotal" :page.sync="sprintQuery.pageNum"
                :limit.sync="sprintQuery.pageSize" @pagination="getqueryForSprint" />
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import viewTree from '../viewManage/viewTree.vue'
import { message } from '@/utils/common'
import { sprintList, delSprint, cloneSprint } from '@/api/sprint'
// import { queryViews } from '@/api/project'

export default {
  name: 'sprint',
  components: { viewTree },
  data() {
    return {
      treeCol: 3,
      currentScope: '8000001',  //If need to scope name - change to 'sprint'
      tableHeader: {
        color: '#d4dce3',
        background: '#4286CD'
      }, // 表头颜色加粗设置
      isLoading: false, // 是否加载
      activeNames: ['1'],

      sprintQuery: {
        pageNum: 1,
        pageSize: 10
      },
      sprintTotal: 0,
      sprinttableData: [],
      multipleSelection: [], // 多选
      single: true, // 非单个禁用
      multiple: true, // 非多个禁用
      projectIds: '',

      setTree: [], // tree数据
      sprintBody: {
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
      this.getqueryForSprint()// 获取管理项目列表
    }
  },
  methods: {
    // 选择更多列
    selectMoreCol() {

    },
    // 新建项目
    newproject() {
      this.$router.push({ name: 'Addsprint', query: { isEdit: 1 } })
    },

    /** 项目列表表格开始 */
    getqueryForSprint() {
      this.isLoading = true
      const query = {
        projectId: this.projectInfo.userUseOpenProject.projectId,
        viewTreeDto: {
          id: this.viewSearchQueryId
        }
      }
      return new Promise((resolve, reject) => {
        sprintList(this.sprintQuery, query).then(async res => {
          if (res.code === '200') {
            if (res.data.total > 0) {
              // 默认取第一条
              this.sprintBody.scope = res.data.list[0].scope
              this.sprintBody.projectId = this.projectInfo.userUseOpenProject.projectId
            }
            this.isLoading = false
            this.sprinttableData = res.data.list
            this.sprintTotal = res.data.total
            resolve(res)
          }
        })
      })
    },
    // 刷新
    async projectRefresh() {
      const res = await this.getqueryForSprint()
      if (res.code === '200') {
        message('success', '刷新成功')
        this.viewSearchQueryId = ''
      }
    },




    // 克隆
    projectClone(id, operation) {
      let parms = []
      if (operation === 'single') {
        parms = [id]
      } else {
        parms = this.projectIds.split(',')
      }
      cloneSprint(parms).then(res => {
        if (res.code === '200') {
          message('success', res.msg)
          this.getqueryForSprint()
        }
      })
    },


    // 删除项目
    delproject(id) {
      if (id === 'all') {
        message('error', '暂未开发')
        return
      }
      delSprint(id).then(res => {
        if (res.code === '200') {
          message('success', res.msg)
          this.getqueryForSprint()
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
      this.$router.push({ name: 'Addsprint', query: { id: row.id, isEdit } })
    },
    childByValue: function (query) {
      this.isLoading = true
      this.viewSearchQueryId = query.viewTreeDto.id
      sprintList(this.sprintQuery, query).then(res => {
        this.sprinttableData = res.data
        this.sprintTotal = res.total
        this.isLoading = false
      }).catch(() => {
        this.sprinttableData = []
        this.sprintTotal = 0
        this.isLoading = false
      })
    },
    hadleTreeshow() {
      this.treeCol = this.treeCol === 3 ? 0 : 3
    },
    async hadleToViewAll() {
      this.viewSearchQueryId = ''
      await this.getqueryForSprint()
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
