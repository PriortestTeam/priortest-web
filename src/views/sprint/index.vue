<template>
  <div class="project-container app-container">
    <div class="new_project">
      <el-button type="primary" round @click="newproject"> 新建迭代 </el-button>
    </div>
    <el-row>
      <el-col :span="5">
        <div class="comp-tree">
          <div class="new_project">
            <el-button type="primary" round>
              <router-link to="/project/projectview"> 新建视图 </router-link>
            </el-button>
            <el-button type="primary" round>
              <router-link to="/project/projectview"> 管理视图 </router-link>
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
              ref="sprinttableData"
              :data="sprinttableData"
              :header-cell-style="tableHeader"
              stripe
              style="width: 100%"
              @row-click="switcproject"
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
              <el-table-column
                prop="reportToName"
                align="center"
                label="负责人"
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
                prop="planReleaseDate"
                align="center"
                label="计划上线日期"
                min-width="120"
                :show-overflow-tooltip="true"
              >
                <template slot-scope="scope">
                  <span>{{ scope.row.planReleaseDate || "-" }}</span>
                </template>
              </el-table-column>
              <el-table-column
                prop="closeDate"
                align="center"
                label="关闭日期"
                min-width="120"
                :show-overflow-tooltip="true"
              >
                <template slot-scope="scope">
                  <span>{{ scope.row.closeDate || "-" }}</span>
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
              v-show="sprintTotal > 0"
              :total="sprintTotal"
              :page.sync="sprintQuery.pageNum"
              :limit.sync="sprintQuery.pageSize"
              @pagination="getqueryForSprint"
            />
          </div></div
      ></el-col>
    </el-row>
  </div>
</template>

<script>
import { message } from '@/utils/common'
import store from '@/store'
import { sprintList, delProjects, queryViews } from '@/api/sprint'
import { mapGetters } from 'vuex'
export default {
  name: 'Sprint',
  data() {
    return {
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
      multipleSelection: [],//多选
      single: true, // 非单个禁用
      multiple: true, // 非多个禁用
      projectIds: '',

      setTree: [], // tree数据
      sprintBody: {
        scope: '',
        projectId: ''
      },//tree的body数据
    }
  },
  computed: {
    ...mapGetters([
      'name'
    ])
  },
  created() {
    // 初始值
    this.getqueryForSprint()// 获取管理项目列表
  },
  methods: {
    // 新建项目
    newproject() {
      const data = JSON.stringify({ status: '3' })
      this.$router.push({ name: 'Addsprint', query: { info: data } })
    },
    /** 左侧视图*/
    // view视图列表
    getqueryViews() {
      return new Promise((resolve, reject) => {
        queryViews(this.sprintBody, this.sprintQuery).then(res => {
          if (res.code === '200') {
            this.setTree = res.data
            resolve(res)
          }
        })
      })
    },

    /**项目列表表格开始 */
    getqueryForSprint() {
      this.isLoading = true
      return new Promise((resolve, reject) => {
        sprintList(this.sprintQuery).then(res => {
          if (res.code === '200') {
            this.isLoading = false
            this.sprinttableData = res.data
            this.sprintTotal = res.total
            // 默认取第一条
            this.sprintBody.scope = res.data[0].scope
            this.sprintBody.projectId = res.data[0].id

            this.getqueryViews()
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
      delProjects(id).then(res => {
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
      const data = JSON.stringify(row)
      this.$router.push({ name: 'Addsprint', query: { info: data } })
    },
    // 表格行点击
    switcproject(row) {
      this.sprintBody.scope = row.scope
      this.sprintBody.projectId = row.id
      this.getqueryViews()
    },
    /**项目列表表格结束 */

  }
}
</script>
<style lang="scss" scoped>
@import "index.scss";
</style>
