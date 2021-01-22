<template>
  <div class="project-container app-container">
    <div class="set_btn" @click="newproject">新建项目</div>
    <el-row>
      <el-col :span="5"
        ><div v-loading="isLoading" class="comp-tree">
          <div class="new_project">
            <router-link to="/project/manageview">
              <div class="set_btn">新建视图</div>
            </router-link>
            <router-link to="/project/manageview">
              <div class="set_btn">管理视图</div>
            </router-link>
          </div>
          <!-- tree -->
          <el-tree
            ref="SlotTree"
            :data="setTree"
            :props="defaultProps"
            :expand-on-click-node="false"
            highlight-current
            :node-key="node_key"
            default-expand-all
          >
            <div slot-scope="{ node, data }" class="comp-tr-node">
              <!-- 编辑状态 -->
              <template v-if="node.isEdit">
                <el-input
                  :ref="'slotTreeInput' + data[node_key]"
                  v-model="data.name"
                  autofocus
                  size="mini"
                  class="editinput"
                  @blur.stop="handleInput(node, data)"
                  @keyup.enter.native="handleInput(node, data)"
                />
              </template>
              <!-- 非编辑状态 -->
              <template v-else>
                <!-- 名称： 新增节点增加class（is-new） -->
                <span
                  :class="[
                    data[node_key] < node_id_start ? 'is-new' : '',
                    'comp-tr-node--name',
                  ]"
                >
                  {{ node.label }}
                </span>
                <!-- 按钮 -->
                <!-- <span class="comp-tr-node--btns" v-if="node.id !== 1"> -->
                <span class="comp-tr-node--btns">
                  <!-- 编辑 -->
                  <el-button
                    icon="el-icon-edit"
                    size="mini"
                    circle
                    type="info"
                    @click="handleEdit(node, data)"
                  />
                  <!-- 删除 -->
                  <el-button
                    icon="el-icon-delete"
                    size="mini"
                    circle
                    type="info"
                    @click="handleDelete(node, data)"
                  />
                  <!-- 新增 -->
                  <el-button
                    icon="el-icon-plus"
                    size="mini"
                    circle
                    type="info"
                    @click="handleAdd(node, data)"
                  />
                </span>
              </template>
            </div>
          </el-tree></div
      ></el-col>
      <el-col :span="19"
        ><div class="project_table">
          <div class="oprate_btn">
            <!-- <router-link to="/project/manageproject">
            <el-button
              style="margin-right: 10px"
              type="text"
            >管理项目</el-button>
          </router-link> -->
            <el-button type="text" @click="projectRefresh">刷新</el-button>
            <el-button type="text" :disabled="single" @click="projectChange"
              >切换项目</el-button
            >
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
          <div class="protable table">
            <el-table
              :data="projecttableData"
              ref="projecttableData"
              :header-cell-style="tableHeader"
              stripe
              style="width: 100%"
              @row-click="openEdit"
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
                      ? "Progress"
                      : scope.row.status === 2
                      ? "Plan"
                      : "Closed"
                  }}</span>
                </template>
              </el-table-column>

              <el-table-column
                prop="createTime"
                align="center"
                label="创建日期"
                min-width="170"
                :show-overflow-tooltip="true"
              />
              <el-table-column
                prop="planReleaseDate"
                align="center"
                label="计划上线日期"
                min-width="170"
                :show-overflow-tooltip="true"
              >
                <template slot-scope="scope">
                  <span>{{ scope.row.planReleaseDate || "待定" }}</span>
                </template>
              </el-table-column>
              <el-table-column
                prop="closeDate"
                align="center"
                label="关闭日期"
                min-width="170"
                :show-overflow-tooltip="true"
              >
                <template slot-scope="scope">
                  <span>{{ scope.row.closeDate || "待定" }}</span>
                </template>
              </el-table-column>
              <el-table-column label="操作" align="center">
                <template slot-scope="scope">
                  <!-- <el-button type="text" class="table-btn">克隆</el-button>
                <span class="line">|</span> -->
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
              v-show="projectTotal > 0"
              :total="projectTotal"
              :page.sync="projectQuery.pageNum"
              :limit.sync="projectQuery.projectpageSize"
              @pagination="getqueryForProjects"
            />
          </div></div
      ></el-col>
    </el-row>
  </div>
</template>

<script>
import { message } from '@/utils/common'
import store from '@/store'
import { queryForProjects, delProjects, queryViews, checkProject } from '@/api/project'
import { mapGetters } from 'vuex'
export default {
  name: 'Dashboard',
  data() {
    return {
      text: 'niaho',
      tableHeader: {
        color: '#d4dce3',
        background: '#003d79'
      }, // 表头颜色加粗设置
      Setbtn: ['New lestCase', 'Import'],
      isLoading: false, // 是否加载
      setTree: [{
        id: 1,
        name: 'All Item',
        children: [{
          id: 2,
          name: 'Status',
          children: [{
            id: 3,
            name: 'Closed'
          }, {
            id: 4,
            name: 'Plan'
          }]
        }]
      }
      ], // tree数据
      node_key: 'id', // id对应字段
      max_level: 4, // 设定最大层级
      node_id_start: 0, // 新增节点id，逐次递减
      startId: null,
      defaultProps: { // 默认设置
        children: 'children',
        label: 'name'
      },
      initParam: { // 新增参数
        name: '新增节点',
        pid: 0,
        children: []
      },
      projectQuery: {
        pageNum: 1,
        pageSize: 10
      },
      projectTotal: 0,
      projecttableData: [],
      multipleSelection: [],
      single: true, // 非单个禁用
      multiple: true, // 非多个禁用
      projectIds: ''
    }
  },
  computed: {
    ...mapGetters([
      'name'
    ])
  },
  created() {
    // 初始值
    this.startId = this.node_id_start
    this.getqueryForProjects()// 获取管理项目列表
    // this.queryViews() // 获取视图
  },
  methods: {
    // 项目列表
    getqueryForProjects() {
      return new Promise((resolve, reject) => {
        queryForProjects(this.projectQuery).then(res => {
          if (res.code === '200') {
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
      }
    },
    //切换项目
    projectChange() {
      checkProject(this.multipleSelection[0].id).then(res => {
        if (res.code === '200') {
          this.$refs.projecttableData.clearSelection();
          store.dispatch('user/getInfo')
          message('success', '切换项目成功')
        }
      })
    },
    //克隆
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
          message('success', res.data)
          this.getqueryForProjects()
        }
      })
    },
    // view视图列表
    queryViews() {
      queryViews().then(res => {
        if (res.code === '200') {
          console.log(res)
        }
      })
    },
    //  左侧数的增删改
    handleDelete(node, data) { // 删除节点
      if (data.children && data.children.length !== 0) {
        this.$message.error('此节点有子级，不可删除！')
        return false
      } else {
        // 删除操作
        const DeletOprate = () => {
          this.$nextTick(() => {
            if (this.$refs.SlotTree) {
              this.$refs.SlotTree.remove(data)
              this.$message.success('删除成功！')
            }
          })
        }
        // 二次确认
        const ConfirmFun = () => {
          this.$confirm('是否删除此节点？', '提示', {
            confirmButtonText: '确认',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            DeletOprate()
          }).catch(() => { })
        }
        // 判断是否新增： 新增节点直接删除，已存在的节点要二次确认
        data[this.node_key] < this.node_id_start ? DeletOprate() : ConfirmFun()
      }
    },
    handleInput(node, data) { // 修改节点
      // 退出编辑状态
      if (node.isEdit) {
        this.$set(node, 'isEdit', false)
      }
    },
    handleEdit(node, data) { // 编辑节点
      this.$router.push({ path: '/project/manageview' })
    },
    handleAdd(node, data) { // 新增节点
      // 判断层级
      if (node.level >= this.max_level) {
        this.$message.warning('当前已达到' + this.max_level + '级，无法新增！')
        return false
      }
      // 参数修改
      const obj = JSON.parse(JSON.stringify(this.initParam))// copy参数
      obj.pid = data[this.node_key]// 父id
      obj[this.node_key] = --this.startId// 节点id：逐次递减id
      // 判断字段是否存在
      if (!data.children) {
        this.$set(data, 'children', [])
      }
      // 新增数据
      data.children.push(obj)
      // 展开节点
      if (!node.expanded) {
        node.expanded = true
      }
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
<<<<<<< HEAD
      let data = JSON.stringify(row)
      this.$router.push({ name: 'Addproject', query: { info: data } })
    },
    // 新建项目
    newproject() {
      let data = JSON.stringify({ status: '3' })
      this.$router.push({ name: 'Addproject', query: { info: data } })
=======
      const data = JSON.stringify(row)
      this.$router.push({ name: 'Addproject', query: { info: data, type: 'edit' }})
    },
    // 新建项目
    newproject() {
      this.$router.push({ name: 'Addproject', query: { id: { status: '3' }, type: 'add' }})
>>>>>>> 656665e689f4dd69ad86c6b8a85de1c513bfbcfb
    }

  }
}
</script>
<style lang="scss" scoped>
@import "index.scss";
</style>
