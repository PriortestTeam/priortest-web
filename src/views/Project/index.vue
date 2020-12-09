<template>
<<<<<<< HEAD
  <div class="project-container app-container">
    <router-link to="/project/addproject">
      <div class="set_btn">New Project</div>
    </router-link>
    <el-row>
      <el-col :span="5"
        ><div v-loading="isLoading" class="comp-tree">
          <div class="new_project">
            <div class="set_btn">New View</div>
            <div class="set_btn">MangageView</div>
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
=======
  <div class="dashboard-container">
    <div class="new_project">
      <div class="set_btn">New lestCase</div>
      <div class="set_btn">Import</div>
    </div>
    <div class="project_data">
      <div v-loading="isLoading" class="comp-tree">

        <div class="new_project">
          <div class="set_btn">New View</div>
          <div class="set_btn">MangageView</div>
        </div>
        <el-button
          v-if="false"
          class="comp-tr-top"
          type="primary"
          size="small"
          @click="handleAddTop"
        >添加顶级节点</el-button>
        <!-- tree -->
        <el-tree
          ref="SlotTree"
          :data="setTree"
          :props="defaultProps"
          :expand-on-click-node="false"
          highlight-current
          :node-key="NODE_KEY"
          default-expand-all
        >
          <div slot-scope="{ node, data }" class="comp-tr-node">
            <!-- 编辑状态 -->
            <template v-if="node.isEdit">
              <el-input
                :ref="'slotTreeInput'+data[NODE_KEY]"
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
              <span :class="[data[NODE_KEY] < NODE_ID_START ? 'is-new' : '', 'comp-tr-node--name']">
                {{ node.label }}
              </span>

              <!-- 按钮 -->
              <span class="comp-tr-node--btns">
                <!-- 新增 -->
                <el-button
                  icon="el-icon-plus"
                  size="mini"
                  circle
                  type="info"
                  @click="handleAdd(node, data)"
                />
                <!-- type="primary" -->
                <!-- 编辑 -->
                <el-button
                  icon="el-icon-edit"
>>>>>>> parent of f8a04f0... 修改
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
                <!-- type="danger" -->
              </span>
            </template>
          </div>
        </el-tree>
      </div>
      <div class="project_table">
        <div>
          btn
        </div>
        <div class="protable">
          <el-table
            :data="projecttableData"
            :header-cell-style="tableHeader"
            stripe
            style="width: 100%"
          >
            <el-table-column
              prop="date"
              label="日期"
              width="180"
            />
            <el-table-column
              prop="name"
              label="姓名"
              width="180"
            />
            <el-table-column
              prop="address"
              label="地址"
            />
          </el-table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'Dashboard',
  data() {
    return {
      tableHeader: {
        color: '#d4dce3',
        background: '#003d79'
      }, // 表头颜色加粗设置
      Setbtn: ['New lestCase', 'Import'],
      isLoading: false, // 是否加载
      setTree: [{
        pid: 1,
        name: '一级 1',
        children: [{
          pid: 4,
          name: '二级 1-1',
          children: [{
            pid: 9,
            name: '三级 1-1-1'
          }, {
            pid: 10,
            name: '三级 1-1-2'
          }]
        }]
      }
      ], // tree数据
      NODE_KEY: 'id', // id对应字段
      MAX_LEVEL: 3, // 设定最大层级
      NODE_ID_START: 0, // 新增节点id，逐次递减
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
        date: '2016-05-02',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄'
      }, {
        date: '2016-05-04',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1517 弄'
      }, {
        date: '2016-05-01',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1519 弄'
      }, {
        date: '2016-05-03',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1516 弄'
      }]
    }
  },
  computed: {
    ...mapGetters([
      'name'
    ])
  },
  created() {
    // 初始值
    this.startId = this.NODE_ID_START
  },
  methods: {
    handleDelete(_node, _data) { // 删除节点
      console.log(_node, _data)
      // 判断是否存在子节点
      if (_data.children && _data.children.length !== 0) {
        this.$message.error('此节点有子级，不可删除！')
        return false
      } else {
        // 删除操作
        const DeletOprate = () => {
          this.$nextTick(() => {
            if (this.$refs.SlotTree) {
              this.$refs.SlotTree.remove(_data)
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
          }).catch(() => {})
        }
        // 判断是否新增： 新增节点直接删除，已存在的节点要二次确认
        _data[this.NODE_KEY] < this.NODE_ID_START ? DeletOprate() : ConfirmFun()
      }
    },
    handleInput(_node, _data) { // 修改节点
      console.log(_node, _data)
      // 退出编辑状态
      if (_node.isEdit) {
        this.$set(_node, 'isEdit', false)
      }
    },
    handleEdit(_node, _data) { // 编辑节点
      console.log(_node, _data)
      // 设置编辑状态
      if (!_node.isEdit) {
        this.$set(_node, 'isEdit', true)
      }
      // 输入框聚焦
      this.$nextTick(() => {
        if (this.$refs['slotTreeInput' + _data[this.NODE_KEY]]) {
          this.$refs['slotTreeInput' + _data[this.NODE_KEY]].$refs.input.focus()
        }
      })
    },
    handleAdd(_node, _data) { // 新增节点
      console.log(_node, _data)
      // 判断层级
      if (_node.level >= this.MAX_LEVEL) {
        this.$message.warning('当前已达到' + this.MAX_LEVEL + '级，无法新增！')
        return false
      }
      // 参数修改
      const obj = JSON.parse(JSON.stringify(this.initParam))// copy参数
      obj.pid = _data[this.NODE_KEY]// 父id
      obj[this.NODE_KEY] = --this.startId// 节点id：逐次递减id
      // 判断字段是否存在
      if (!_data.children) {
        this.$set(_data, 'children', [])
      }
      // 新增数据
      _data.children.push(obj)
      // 展开节点
      if (!_node.expanded) {
        _node.expanded = true
      }
    },
    handleAddTop() { // 添加顶部节点
      const obj = JSON.parse(JSON.stringify(this.initParam))// copy参数
      obj[this.NODE_KEY] = --this.startId// 节点id：逐次递减id
      this.setTree.push(obj)
    }
  }
}
</script>

<style lang="scss" scoped>
@import "@/styles/color.scss";
.dashboard {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
.dashboard-container{
  display: flex;
  flex-direction: column;
  .new_project{
    display: flex;
    justify-content: flex-start;
    .set_btn{
      display: flex;
      align-items: center;
      padding: 6px 15px;
      background: $btnbgcolor;
      color: $btnFontbgcolor;
      border-radius: 20px;
      margin: 0 15px 15px 0;
      cursor: pointer;
    }
  }
  .project_data{
    display: flex;
    justify-content: space-between;
    font-size: 14px;
     /* common */
    // 显示按钮
    .show-btns{
        opacity: 1;
    }
    /* common end */
    .comp-tree{
        width: 100%;
        max-width: 18%;
        max-height: 80vh;
        padding: 2em;
        overflow: auto;
        background: #fff;
        // 顶部按钮
        .comp-tr-top{
            width: 100px;
            margin-bottom: 2em;
        }
        // 自定义节点
        .comp-tr-node{
          ::v-deep .el-input--mini .el-input__inner{
                height: 18px;
                line-height: 18px;
          }
            // label
            .comp-tr-node--name{
                display: inline-block;
                line-height: 40px;
                min-height: 40px;
                // 新增
                &.is-new{
                    // font-weight: bold;
                }
            }
            // button
            .comp-tr-node--btns{
                margin-left: 10px;
                opacity: 1;
                transition: opacity .1s;
                .el-button{
                    transform: scale(0.8);// 缩小按钮
                    & + .el-button{
                        margin-left: -1px;
                    }
                }
            }
        }
        // 高亮显示按钮
        .is-current{
            &>.el-tree-node__content{
                .comp-tr-node--btns{
                    @extend .show-btns;
                }
            }
        }
        // 悬浮显示按钮
        .el-tree-node__content{
            &:hover{
                .comp-tr-node--btns{
                    @extend .show-btns;
                }
            }
        }
    }
    .project_table{
      display: flex;
      flex-direction: column;
      min-width: 80%;
      .protable{
        width: 100%;
          ::v-deep .el-table--fit{
        padding: 20px;
}
  ::v-deep  .el-table, .el-table__expanded-cell {
    background-color: transparent;
}

  ::v-deep .el-table tr {
    background-color: transparent !important;
}
  ::v-deep  .el-table--enable-row-transition .el-table__body td, .el-table .cell{
    // background-color: transparent;
}
      }
    }
  }
}
</style>
