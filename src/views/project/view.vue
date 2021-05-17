<template>
  <div class="app-container manage-view">
    <el-form
      ref="from"
      :model="from"
      :rules="rules"
      label-width="100px"
      class="demo-ruleForm"
    >
      <div class="new_project">
        <el-button
          v-if="!from.id"
          type="primary"
          :disabled="savedisabled"
          round
          @click.stop="submitForm('from')"
        >新增</el-button>
        <el-button
          v-if="!from.id"
          type="primary"
          round
          @click.stop="waiveForm('from')"
        >取消</el-button>
        <el-button
          v-if="from.id"
          type="primary"
          round
          @click.stop="submitForm('from')"
        >确定修改</el-button>
        <el-button
          v-if="from.id"
          type="primary"
          round
          @click.stop="cancelUpdate('from')"
        >取消修改</el-button>
      </div>
      <el-form-item label="新视图" prop="title" class="form-small">
        <el-input v-model="from.title" size="small" />
      </el-form-item>
      <div class="scopeView">
        <el-form-item label="scope" prop="scope" class="form-small">
          <el-select
            v-model="from.scope"
            size="small"
            :disabled="scopeDis"
            placeholder="请选择适用范围"
            @change="viewScopeChildParams"
          >
            <el-option
              v-for= "item in scopeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"/>
          </el-select>
        </el-form-item>

        <el-form-item label="父级视图" prop="parent" class="form-small">
          <el-select
            v-model="viewParentQuery"
            size="small"
            filterable
            :filter-method="dataFilter"
            placeholder="请选择适用范围"
            @keyup.enter.native="queryViewParent"
            @change="fuzhiFrom"
          >
            <el-option
              v-for="i in viewParents"
              :label="i.title"
              :value="i.id"
            ></el-option>
            <el-option
              label="无"
              value="0"/>
            </el-select>
        </el-form-item>
      </div>

      <el-form-item label="Filter" prop="oneFilters">
        <div class="filter-item">
          <el-col v-if="from.oneFilters.length === 0" :span="1">
            <span @click="addFliter">
              <i class="el-icon-circle-plus circle" />
            </span>
          </el-col>
          <el-row v-for="(item, index) in from.oneFilters" :key="index">
            <el-row>
              <el-col :span="2">
                <span @click="addFliter">
                  <i class="el-icon-circle-plus  circle" />
                </span>
                <span @click="delRemove(index)">
                  <i class="el-icon-remove circle remove" />
                </span>
              </el-col>
              <el-col :span="6">
                <el-select
                  ref="selectFiled"
                  v-model="item.fieldName"
                  size="small"
                  placeholder="请选择字段"
                  @change="getType(item.fieldName,index)"
                >
                  <el-option
                    v-for="i in scopeDownChildParams"
                    :label="i.filedNameCn"
                    :value="i.filedName"/>
                </el-select>
              </el-col>
              <!-- input -->
              <el-col v-if="item.type === 'fString'" :span="6">
                <el-input v-model="item.textVal" size="small" />
              </el-col>
              <!-- select -->
              <el-col v-else-if="item.type === 'fInteger'" :span="6">
                <el-select
                  v-model="item.textVal"
                  size="small"
                  placeholder="请选择状态"
                >
                  <el-option
                    v-for="i in statusDownChildParams"
                    :label="i.optionValueCn"
                    :value="i.optionValue"/>
                </el-select>
              </el-col>
              <!-- date -->
              <el-col v-else :span="12">
                <el-date-picker
                  v-model="item.beginDate"
                  type="datetime"
                  size="small"
                  placeholder="开始日期"
                />
                <el-date-picker
                  v-model="item.endDate"
                  type="datetime"
                  size="small"
                  placeholder="结束日期"
                />
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="2">~ </el-col>
              <el-col :span="3">
                <el-radio v-model="item.andOr" label="and">And</el-radio>
                <el-radio v-model="item.andOr" label="or">Or</el-radio>
              </el-col>
            </el-row>
          </el-row>
        </div>
      </el-form-item>

      <el-form-item label="Status" prop="isPrivate" class="form-small">
        <el-radio v-model="from.isPrivate" label="0">Private</el-radio>
        <el-radio v-model="from.isPrivate" label="1">Public</el-radio>
      </el-form-item>
    </el-form>
    <div class="table">
      <el-button type="text" @click="viewjectRefresh">刷新</el-button>
      <el-button
        type="text"
        :disabled="multiple"
        @click="delview('all')"
      >批量删除</el-button>

      <el-table
        ref="viewData"
        :data="viewData"
        :header-cell-style="tableHeader"
        stripe
        style="width: 100%"
        @row-click="toEdit"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" />
        <el-table-column prop="title" label="View Title" align="center" />
        <el-table-column prop="scope" label="Scope" align="center" />
        <el-table-column prop="parentTitle" label="Parent" align="center" />
        <el-table-column prop="owner" label="Owner" align="center" />
        <el-table-column prop="createTime" label="Created" align="center" />
        <el-table-column prop="updateTime" label="Modified" align="center" />
        <el-table-column label="Action" align="center">
          <template slot-scope="scope">
            <el-button
              type="text"
              class="table-btn"
              @click.stop="toEdit(scope.row)"
            >编辑</el-button>
            <el-button
              type="text"
              class="table-btn"
              @click.stop="delview(scope.row.id)"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination
        v-show="viewTotal > 0"
        :total="viewTotal"
        :page.sync="viewQuery.pageNum"
        :limit.sync="viewQuery.pageSize"
        @pagination="getqueryViews"
      />
    </div>
  </div>
</template>
<script>
import { message, returntomenu, formatChangedPara } from '@/utils/common'
import { queryViews, lookView, addView, updateView, deleteView, getViewScopeChildParams, queryViewParents} from '@/api/project'
import text from '../adminCenter/text'
export default {
  name: 'Projectview',
  data() {
    return {
      scopeOptions: [
        {
          value: 'Project',
          label: '项目'
        },
        {
          value: 'Feature',
          label: '故事'
        },
        {
          value: 'Sprint',
          label: '迭代'
        },
        {
          value: 'TestCase',
          label: '测试用例'
        },
        {
          value: 'TestCycle',
          label: '测试周期'
        },
        {
          value: 'Issue',
          label: '缺陷'
        }
      ],
      scopeDownChildParams: [],
      statusDownChildParams: [],
      savedisabled: true,
      from: {
        isPrivate: '0',
        oneFilters: []
      },
      fromTemp: {},
      scopeDis: false,
      rules: {
        title: [
          { required: true, message: '请输入视图名称', trigger: 'blur' }
        ]
      },
      tableHeader: {
        color: '#d4dce3',
        background: '#003d79'
      },

      viewQuery: {
        pageNum: 1,
        pageSize: 10
      },
      viewBody: {
        scope: '',
        projectId: ''
      },
      viewParentQuery: '0',
      viewParents: [],
      viewTotal: 0,
      viewData: [], // 表格数据
      multipleSelection: [], // 选择的表格
      multiple: true, // 非多个禁用
      viewId: ''
    }
  },
  computed: {
    projectInfo() {
      return this.$store.state.user.userinfo
    }
  },
  watch: {
    'from.title': function(val) {
      if (val) {
        this.savedisabled = false
      } else {
        this.savedisabled = true
      }
    }
  },
  created() {
    this.viewBody.scope = this.$route.query.scope
    this.viewBody.projectId = this.projectInfo.userUseOpenProject.projectId
    this.getqueryViews() // 获取视图
  },
  methods: {

    // 新增和修改确定表单
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (!this.from.id) {
            addView(this.from).then(res => {
              if (res.code === '200') {
                this.resetForm()
                message('success', res.msg)
                this.getqueryViews()
              }
            })
          } else {
            const param = formatChangedPara(this.fromTemp, this.from)
            param.oneFilters = this.from.oneFilters
            param.scope = this.from.scope
            updateView(param).then(res => {
              if (res.code === '200') {
                message('success', res.msg)
                this.cancelUpdate()
                this.getqueryViews()
              }
            })
          }
        } else {
          return false
        }
      })
    },
    // 取消返回
    waiveForm() {
      returntomenu(this, 1000)
    },
    // 取消修改
    cancelUpdate() {
      this.$refs.viewData.clearSelection()
      this.resetForm()
      this.viewId = ''
    },
    // 重置表单
    resetForm() {
      this.from = {
        id: undefined,
        isPrivate: '0',
        oneFilters: [],
        title: ''
      }
      this.scopeDis = false
      this.$refs['from'].resetFields()
    },
    // 表格多选
    handleSelectionChange(val) {
      this.multipleSelection = val
      this.multiple = !val.length
    },
    toEdit(row) {
      this.$refs.viewData.clearSelection()
      this.viewId = row.id

      this.viewParentQuery = '0'

      this.$refs.viewData.toggleRowSelection(row)
      this.searchViewInfo()

      if (row.parentTitle !== undefined && row.parentTitle !== ''){
        this.viewParentQuery = row.parentTitle
      }

      const scope = {
        scope: row.scope
      }
      getViewScopeChildParams(scope).then(res => {
        this.scopeDownChildParams = res.data
      })
    },
    // 查询view信息
    searchViewInfo() {
      lookView(this.viewId).then(res => {
        if (res.code === '200') {
          if (res.data.isPrivate === 0) {
            res.data.isPrivate = '0'
          } else {
            res.data.isPrivate = '1'
          }
          this.from = res.data
          this.scopeDis = true
          this.fromTemp = Object.assign({}, this.from)
        }
      })
    },
    // 删除view
    delview(id) {
      if (id === 'all') {
        message('error', '暂未开发')
        return
      }
      deleteView(id).then(res => {
        message('success', res.msg)
        this.getqueryViews()
        this.cancelUpdate()
      })
    },
    // view视图列表
    getqueryViews() {
      return new Promise((resolve, reject) => {
        queryViews(this.viewBody, this.viewQuery).then(res => {
          if (res.code === '200') {
            this.viewData = res.data
            this.viewTotal = res.total
            resolve(res)
          }
        })
      })
    },
    // 刷新view
    async viewjectRefresh() {
      const res = await this.getqueryViews()
      if (res.code === '200') {
        message('success', '刷新成功')
      }
    },
    // 新增字段
    addFliter() {
      if (this.from.scope === undefined || this.from.scope.trim() === '') {
        message('success', '请选择作用域')
        return
      }

      const obj = {
        andOr: 'and',
        beginDate: '',
        endDate: '',
        fieldName: '',
        intVal: '',
        sourceVal: '',
        textVal: '',
        type: 'fString'
      }

      this.from.oneFilters.push(obj)
    },
    // 移除字段
    delRemove(index) {
      this.from.oneFilters.splice(index, 1)
    },
    getType: function(fieldName, index) {
      for (let i = 0; i < this.scopeDownChildParams.length; i++) {
        const entity = this.scopeDownChildParams[i]
        if (entity.filedName === fieldName) {
          //如果是下拉框，赋值
          if (entity.selectChild !== undefined && entity.selectChild.length > 0) {
            this.statusDownChildParams = entity.selectChild
          }
          this.from.oneFilters[index].type = entity.type
          return
        }
      }
    },
    viewScopeChildParams() {
      if (this.from.oneFilters.length > 0) {
        this.$confirm('重新选择可能会丢失页面内容请确认？', {
          title: '提示',
          showCancelButton: true,
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(s => {
          this.from.oneFilters = []
        }).catch(e => {
          this.$router.go(0)
        })
      }
      const scope = {
        scope: this.from.scope
      }
      getViewScopeChildParams(scope).then(res => {
        this.scopeDownChildParams = res.data
      })
    },
    dataFilter(val) {
      this.viewParentQuery = val
    },
    queryViewParent() {
      if (this.from.scope === undefined || this.from.scope === '') {
        message('success', '请选择作用域')
        this.viewParentQuery = '0'
        return
      }
      const params = {
        viewTitle: this.viewParentQuery,
        scope: this.from.scope
      }
      queryViewParents(params).then(res => {
        this.viewParents = res.data
      })
    },
    fuzhiFrom(val) {
      this.from.parentId = val
    }
  }
}
</script>
<style lang="scss" scoped>
@import "index.scss";
</style>
