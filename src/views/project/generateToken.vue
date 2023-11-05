<template>
  <div class="app-container manage-view generate-token">
    <el-form ref="form" :model="form" :rules="rules" label-width="100px" class="demo-ruleForm">
      <div class="new_project">
        <el-button type="primary" round @click.stop="generateToken">新增</el-button>
        <el-button type="primary" round @click.stop="waiveForm('form')">取消</el-button>
      </div>
      <div class="scopeView">
        <el-form-item label="密钥名称" prop="tokenName" class="form-small">
          <el-input v-model="form.tokenName" size="small" :disabled="disable" />
        </el-form-item>
        <el-form-item label="失效日期" prop="expirationTime" class="form-small">
          <el-date-picker v-model="form.expirationTime" type="datetime" value-format="yyyy-MM-dd HH:mm:ss"
            :picker-options="pickerOptions" size="small" placeholder="失效日期" />
        </el-form-item>

      </div>
    </el-form>
    <div class="table">
      <el-button type="text" @click="queryListTokens">刷新</el-button>
      <!-- <el-button
        type="text"
        :disabled="multiple"
        @click="delview('all')"
      >批量删除</el-button> -->

      <el-table ref="viewData" :data="viewData" :header-cell-style="tableHeader" stripe style="width: 100%"
        @row-click="toEdit" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" />

        <el-table-column prop="tokenName" :show-overflow-tooltip="true" align="left" width="155" label="密钥名称">
          <template slot-scope="scope">
            <span class="title" @click="toEdit(scope.row)">
              {{ scope.row.tokenName }}
            </span>
          </template>
        </el-table-column>

        <el-table-column prop="tokenValue" label="密钥值" />
        <el-table-column prop="expirationTime" label="失效日期" />
        <el-table-column prop="apiTimes" label="API次数" />
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button type="text" class="table-btn" @click.stop="delToken(scope.row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination v-show="viewTotal > 0" :total="viewTotal" :page.sync="viewQuery.pageNum"
        :limit.sync="viewQuery.pageSize" @pagination="getqueryViews" />
    </div>
  </div>
</template>
<script>
import { message, returntomenu, formatChangedPara } from '@/utils/common'
import { makeToken, listTokens, deleteToken } from '@/api/user'
// import { getSysCustomField } from '@/api/admincenter'
import { queryViewParents, queryViews, addViewRE, updateView, getViewScopeChildParams, lookView } from '@/api/project.js'
import { mapState } from 'vuex'
export default {
  name: 'GenerateToken',
  data() {
    return {
      pickerOptions: {
        // 限制预约时间
        disabledDate(time) {
          return time.getTime() < Date.now() - 24 * 60 * 60 * 1000
        }
      },
      disable: false,
      scopeDownChildParams: [],
      statusDownChildParams: [],
      savedisabled: true,
      form: {
        tokenName: '',
        expirationTime: ''
      },
      fromTemp: {},
      scopeDis: false,
      rules: {
        tokenName: [
          { required: true, message: '请输入密钥名称', trigger: 'blur' }
        ],
        expirationTime: [
          { required: true, message: '请选择失效日期', trigger: 'change' }
        ]
      },
      tableHeader: {
        color: '#d4dce3',
        background: '#4286CD'
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
      viewId: '',
      conditionList: [],
      filter: false,
      email: ''
    }
  },
  computed: {
    ...mapState({
      nvaName: state => state.common.nvaName
    }),
    projectInfo() {
      return this.$store.state.user.userinfo
    }
  },
  watch: {
    'email': function (val) {
      console.log('val---', val)
    }
  },
  async created() {
    this.email = this.$route.query.email
    console.log('email--', this.email)
    this.queryListTokens()
  },
  methods: {
    // 生成token
    async generateToken() {
      const that = this
      const form = that.form
      console.log('form---', form)
      try {
        await that.$refs.form.validate()
        const res = await makeToken(form)
        if (res.code === '200') {
          message('success', res.msg)
          that.$refs.form.resetFields()
          that.queryListTokens()
        }
      } catch (error) {
        console.log(error)
      }
    },
    // 查询token列表
    async queryListTokens() {
      const params = {
        // emailId: this.email
      }
      const res = await listTokens(params)
      if (res.code === '200') {
        this.viewData = res.data
        console.log(this.viewData)
        // 分页器暂不显示
        // this.viewTotal = Number(res.total)
      }
    },
    // 删除token
    delToken(id) {
      const that = this
      if (id === 'all') {
        message('error', '暂未开发')
        return
      }
      const params = {
        // emailId: this.email,
        tokenId: id
      }
      that.$confirm('确定要删除吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteToken(params).then(res => {
          if (res.code === '200') {
            message('success', res.msg)
            that.currentPage = 1
            that.pageSize = 20
            that.queryListTokens()
            that.cancelUpdate()
          }
        })
      }).catch(() => { })
    },
    // 回显token
    toEdit(row) {
      console.log(row)
      const that = this
      that.$refs.viewData.clearSelection()
      row.id ? that.disable = true : that.disable = false
      that.form.tokenName = row.tokenName
      /* this.viewId = row.id
      this.viewParentQuery = '0'
      this.$refs.viewData.toggleRowSelection(row)
      this.searchViewInfo()
      if (row.parentTitle !== undefined && row.parentTitle !== '') {
        this.viewParentQuery = row.parentTitle
      }
      const scope = {
        scope: row.scope
      }
      getViewScopeChildParams(scope).then(res => {
        this.scopeDownChildParams = res.data
      }) */
    },
    // 取消返回
    waiveForm() {
      returntomenu(this, 1000)
    },
    // 取消修改
    cancelUpdate() {
      this.$refs.viewData.clearSelection()
      this.resetForm()
    },
    // 重置表单
    resetForm() {
      this.form = {
        tokenName: '',
        expirationTime: ''
      }
      this.$refs['form'].resetFields()
    },
    // 新增和修改确定表单
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (!this.from.id) {
            addViewRE(this.from).then(res => {
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
    // 表格多选
    handleSelectionChange(val) {
      this.multipleSelection = val
      this.multiple = !val.length
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
    // token列表
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
        message('warning', '请选择作用域')
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
        condition: '',
        type: 'fString'
      }

      this.from.oneFilters.push(obj)
    },
    // 移除字段
    delRemove(index) {
      this.from.oneFilters.splice(index, 1)
    },
    getType: function (fieldName, index) {
      for (let i = 0; i < this.scopeDownChildParams.length; i++) {
        const entity = this.scopeDownChildParams[i]
        if (entity.filedName === fieldName) {
          // 如果是下拉框，赋值
          if (entity.selectChild !== undefined && entity.selectChild.length > 0) {
            console.log('statusDownChildParams', this.statusDownChildParams)
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
@import "@/styles/index.scss";

.table {
  width: 100%
}
</style>
<style lang="scss">
/* .view {
  .wd200 {
    .el-form-item__label {
      width: 200px!important;
    }
  }
  .el-checkbox__input {
    .el-checkbox__inner {
      border-radius: 100%;
      &:after {
        width: 4px;
        height: 4px;
        border-radius: 100%;
        background-color: #fff;
        content: "";
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%,-50%) scale(1);
        transform: translate(-50%,-50%) scale(1);
      }
    }
  }
  .el-checkbox__input.is-checked {
    .el-checkbox__inner {
      border-color: #4286CD;
      background: #4286CD;
    }
  }
  .el-form-item {
    .el-form-item__label {
      padding-right: 8px;
    }
  }
} */
</style>
