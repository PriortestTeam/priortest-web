<template>
  <div class="project-container app-container">
    <div class="new_project">
      <el-button type="primary" round @click="newproject"> 新建迭代 </el-button>
    </div>
    <el-row>
  <el-col :span="5">
      <view-tree :childScope="currentScope"></view-tree>
  </el-col>

      <el-col
        :span="19"
      ><div class="project_table">
        <div class="oprate_btn">
          <el-button type="text" @click="projectRefresh">刷新</el-button>
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
            ref="sprinttableData"
            :data="sprinttableData"
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
                    ? "开发中"
                    : scope.row.status === 2
                      ? "计划中"
                      : "关闭"
                }}</span>
              </template>
            </el-table-column>

            <el-table-column
              prop="createTime"
              align="center"
              label="创建日期"
              min-width="120"
              :show-overflow-tooltip="true"
            />
            <el-table-column
              prop="startDate"
              align="center"
              label="开始日期"
              min-width="120"
              :show-overflow-tooltip="true"
            >
              <template slot-scope="scope">
                <span>{{ scope.row.startDate || "-" }}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="endDate"
              align="center"
              label="结束日期"
              min-width="120"
              :show-overflow-tooltip="true"
            >
              <template slot-scope="scope">
                <span>{{ scope.row.endDate || "-" }}</span>
              </template>
            </el-table-column>
            <el-table-column label="操作" min-width="120" align="center">
              <template slot-scope="scope">
                <!-- <el-button type="text" class="table-btn">克隆</el-button>
                <span class="line">|</span> -->
                <el-button
                  type="text"
                  class="table-btn"
                  @click.stop="openEdit(scope.row)"
                >编辑</el-button>
                <el-button
                  type="text"
                  class="table-btn"
                  @click.stop="delproject(scope.row.id)"
                >删除</el-button>
              </template>
            </el-table-column>
          </el-table>

          <pagination
            v-show="sprintTotal > 0"
            :total="sprintTotal"
            :page.sync="sprintQuery.pageNum"
            :limit.sync="sprintQuery.pageSize"
            @pagination="getqueryForSprint"
          />
        </div></div></el-col>
    </el-row>
  </div>
</template>

<script>
import viewTree from '../project/viewTree.vue'
import { message } from '@/utils/common'
import { sprintList, delSprint } from '@/api/sprint'
import { queryViews } from '@/api/project'

export default {
  name: 'Sprint',
  data() {
    return {
      currentScope: 'Sprint',
      tableHeader: {
        color: '#d4dce3',
        background: '#003d79'
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
      } // tree的body数据
    }
  },
  components: {viewTree},
  computed: {
    projectInfo() {
      return this.$store.state.user.userinfo
    }
  },
  created() {
    // 初始值
    this.getqueryForSprint()// 获取管理项目列表
  },
  methods: {
    // 新建项目
    newproject() {
      this.$router.push({ name: 'Addsprint' })
    },


    /** 项目列表表格开始 */
    getqueryForSprint() {
      this.isLoading = true
      return new Promise((resolve, reject) => {
        sprintList(this.sprintQuery, { projectId: this.projectInfo.userUseOpenProject.projectId }).then(async res => {
          if (res.code === '200') {
            if (res.total > 0) {
              // 默认取第一条
              this.sprintBody.scope = res.data[0].scope
              this.sprintBody.projectId = this.projectInfo.userUseOpenProject.projectId
            }
            this.isLoading = false
            this.sprinttableData = res.data
            this.sprintTotal = res.total
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
    openEdit(row) {
      this.$router.push({ name: 'Addsprint', query: { id: row.id }})
    }

    /** 项目列表表格结束 */

  }
}
</script>
<style lang="scss" scoped>
@import "index.scss";
</style>
