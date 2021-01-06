<template>
  <div class="project-container app-container">
    <router-link to="/project/addproject">
      <div class="set_btn">新建项目</div>
    </router-link>
    <el-row>
      <el-col
        :span="5"
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
        </el-tree></div></el-col>
      <el-col
        :span="19"
      ><div class="project_table">
        <div class="oprate_btn">
          <router-link to="/project/manageproject">
            <el-button
              style="margin-right: 10px"
              type="text"
            >管理项目</el-button>
          </router-link>
          <el-button type="text" :disabled="single">克隆</el-button>
          <el-button type="text" :disabled="multiple">删除</el-button>
          <el-button type="text" :disabled="multiple">批量编辑</el-button>
        </div>
        <div class="protable table">
          <el-table
            :data="projecttableData"
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
            <el-table-column prop="title" align="center" label="标题" />
            <el-table-column prop="report" align="center" label="负责人" />
            <el-table-column prop="status" align="center" label="状态" />
            <el-table-column
              prop="createDate"
              align="center"
              label="创建日期"
            />
            <el-table-column
              prop="createDate"
              align="center"
              label="计划上线日期"
            />
            <el-table-column
              prop="createDate"
              align="center"
              label="关闭日期"
            />
            <el-table-column label="操作" align="center">
              <template>
                <span class="table-btn">克隆</span>
                <span class="line">|</span>
                <span class="table-btn">删除</span>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div></el-col>
    </el-row>
  </div>
</template>

<script>
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
      projecttableData: [{
        title: 'Project A',
        report: 'Jon',
        status: 'Progress',
        createDate: '2020-10-23',
        customer: 'tencent',
        closeData: '-'
      }, {
        title: 'Project A',
        report: 'Jon',
        status: 'Progress',
        createDate: '2020-10-23',
        customer: 'tencent',
        closeData: '-'
      }, {
        title: 'Project A',
        report: 'Jon',
        status: 'Progress',
        createDate: '2020-10-23',
        customer: 'tencent',
        closeData: '-'
      }],
      multipleSelection: [],
      single: true, // 非单个禁用
      multiple: true // 非多个禁用
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
  },
  methods: {
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
      // if (!node.isEdit) {
      //   this.$set(node, 'isEdit', true)
      // }
      // this.$nextTick(() => {
      //   if (this.$refs['slotTreeInput' + data[this.node_key]]) {
      //     this.$refs['slotTreeInput' + data[this.node_key]].$refs.input.focus()
      //   }
      // })
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
      // this.multipleSelection = val;
      this.single = val.length !== 1
      this.multiple = !val.length
    },
    // 表格行点击去编辑
    openEdit(row) {
      this.$router.push({ path: '/project/addproject' })
    }

  }
}
</script>
<style lang="scss" scoped>
@import "index.scss";
</style>
