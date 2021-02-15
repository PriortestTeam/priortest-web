<template>
  <div class="project-container app-container">
    <div class="new_project">
      <el-button type="primary" round @click="newproject"> 新建故事 </el-button>
    </div>
    <el-row>
      <el-col :span="5">
        <div class="comp-tree">
          <div class="new_project">
            <el-button type="primary" round>
              <router-link to="/project/projectview?scope=Feature">
                新建视图
              </router-link>
            </el-button>
            <el-button type="primary" round>
              <router-link to="/project/projectview?scope=Feature">
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
                prop="title"
                :show-overflow-tooltip="true"
                align="center"
                label="标题"
              />
              <el-table-column
                prop="epic"
                :show-overflow-tooltip="true"
                align="center"
                label="epic"
              />
              <el-table-column prop="reportTo" align="center" label="负责人" />
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
                prop="version"
                align="center"
                label="发行版本"
                min-width="120"
                :show-overflow-tooltip="true"
              >
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
                  <el-button
                    v-if="scope.row.status !== 0"
                    type="text"
                    class="table-btn"
                    @click.stop="closeEdit(scope.row)"
                    >关闭</el-button
                  >
                </template>
              </el-table-column>
            </el-table>

            <pagination
              v-show="featureTotal > 0"
              :total="featureTotal"
              :page.sync="featureQuery.pageNum"
              :limit.sync="featureQuery.pageSize"
              @pagination="getfeatureList"
            />
          </div></div
      ></el-col>
    </el-row>
  </div>
</template>

<script>
import { message } from '@/utils/common'
import { featureList, delFeature, closeUpdate } from '@/api/feature'
import { queryViews } from '@/api/project'

export default {
  name: 'Feature',
  data() {
    return {
      tableHeader: {
        color: '#d4dce3',
        background: '#003d79'
      }, // 表头颜色加粗设置
      isLoading: false, // 是否加载
      activeNames: ['1'],



      featureQuery: {
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
      featureBody: {
        scope: '',
        projectId: ''
      },//tree的参数
    }
  },
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
      this.$router.push({ name: 'Addfeature' })
    },
    /** 左侧视图*/
    // view视图列表 
    getqueryViews() {
      return new Promise((resolve, reject) => {
        queryViews(this.featureBody, this.featureQuery).then(res => {
          if (res.code === '200') {
            this.setTree = res.data
            resolve(res)
          }
        })
      })
    },

    /**项目列表表格开始 */
    getfeatureList() {
      // this.isLoading = true
      return new Promise((resolve, reject) => {
        featureList(this.featureQuery, { projectId: this.projectInfo.userUseOpenProject.projectId }).then(async res => {
          if (res.code === '200') {

            // 默认取第一条
            if (res.total > 0) {
              this.featureBody.scope = res.data[0].scope
              this.featureBody.projectId = this.projectInfo.userUseOpenProject.projectId
              await this.getqueryViews()
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
      delFeature(id).then(res => {
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

      this.$router.push({ name: 'Addfeature', query: { id: row.id } })
    },

    //关闭
    closeEdit(row) {
      let param = {
        id: row.id,
      }
      closeUpdate(param).then(res => {
        if (res.code === '200') {
          message('success', res.msg)
          this.getfeatureList()
        }
      }).catch(error => {
        console.log(error)
      })
    }
    /**项目列表表格结束 */

  }
}
</script>
<style lang="scss" scoped>
@import "index.scss";
</style>
