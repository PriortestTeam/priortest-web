<template>
  <div class="app-container my-account">
    <el-form
      ref="form"
      :model="form"
      :rules="rules"
      label-width="120px"
    >
      <div class="scopeView add-account">
        <el-form-item label="账户邮箱" prop="email" class="form-small">
          <!-- <el-input v-model="form.title" size="small" /> -->
          {{ form.email }}
        </el-form-item>
        <el-form-item label="账户名称" prop="userName" class="form-small">
          <el-input v-model="form.userName" size="small" />
        </el-form-item>
        <el-form-item label="账户类型" prop="userType" class="form-small radio-blue">
          {{ userTypeList[form.userType] }}
        </el-form-item>
        <el-form-item label="注册日期" prop="registerDate" class="form-small">
          {{ form.registerDate }}
        </el-form-item>
        <el-form-item label="管理项目" prop="project" class="form-small">
          {{ form.project }}
        </el-form-item>
        <el-form-item label="失效日期" prop="expireDate" class="form-small">
          {{ form.expireDate }}
        </el-form-item>
        <el-form-item label="账户状态" prop="health" class="form-small radio-blue">
          {{ userStatus }}
        </el-form-item>
        <el-form-item v-if="projectUserInfo.identifier === ''" label="密钥" class="form-small">
          <el-button type="primary">
            <router-link :to="tokenUrl">查看编辑</router-link>
          </el-button>
        </el-form-item>
        <el-form-item v-if="form.userType !== 'Trialer'" label="支付截止日期" class="form-small">
          <el-button type="primary"><router-link to="/project/paymentDetails">续费</router-link></el-button>
        </el-form-item>
        <el-form-item v-else label="延期申请" class="form-small">
          <el-button
            type="primary"
            :disabled="projectUserInfo.activitiNumber === 3"
            @click.stop="submitForm('form')"
          >延期试用</el-button>
        </el-form-item>
        <el-form-item label="延期试用剩余次数" class="form-small">
          {{ projectUserInfo.activitiNumber }}/3
        </el-form-item>
        <el-button
          type="primary"
          :disabled="!serviceCheck"
          @click.stop="stopService"
        >终止服务</el-button>
        <div>
          <el-checkbox v-model="serviceCheck" style="margin-top: 10px;margin-right: 5px;" />
          我已知悉，如果点击此按钮 <终止服务>，我的数据会立即从OneClick 服务器中永久册除。
        </div>
      </div>
    </el-form>
    <!-- <GenerateToken v-if="dialogVisible" :visible.sync="dialogVisible" :email="email" /> -->
  </div>
</template>
<script>
import { message } from '@/utils/common'
import { getUserActivNumber } from '@/api/user'
// import GenerateToken from '@/views/project/generateToken'
import { mapState } from 'vuex'
export default {
  name: 'MyAccount',
  // components: { GenerateToken },
  data() {
    return {
      form: {
        email: '',
        userName: '',
        userType: '',
        registerDate: '',
        project: '',
        expireDate: '',
        health: ''
      },
      dialogVisible: false,
      formTemp: {},
      rules: {
        title: [
          { required: true, message: '请输入视图名称', trigger: 'blur' }
        ]
      },
      filter: false,
      userTypeList: {
        'Trialer': '试用',
        'user': '订单用户'
      },
      tokenUrl: '',
      userStatus: '',
      // activNumber: 1,
      serviceCheck: false
    }
  },
  computed: {
    ...mapState({
      nvaName: state => state.common.nvaName
    }),
    projectUserInfo() {
      return this.$store.state.user.userinfo
    }
  },
  watch: {
    'form.title': function(val) {
      if (val) {
        this.savedisabled = false
      } else {
        this.savedisabled = true
      }
    }
  },
  async created() {
    this.tokenUrl = '/project/generateToken?email=' + this.projectUserInfo.email
    this.init()
    // this.getActivNumber()
  },
  methods: {
    init() {
      const that = this
      that.activitiNumber = that.projectUserInfo.activitiNumber
      const newDate = new Date()
      const today = newDate.getFullYear() + '-' + newDate.getMonth() + '-' + newDate.getDate()
      let expireDate = that.projectUserInfo.expireDate
      if (expireDate !== '') {
        expireDate = new Date(expireDate.substring(0, expireDate.indexOf(' '))).getTime()
        if (expireDate >= today) {
          that.userStatus = '已禁止'
        } else {
          that.userStatus = '正常'
        }
      } else {
        that.userStatus = '已禁止'
      }
      for (const key in that.projectUserInfo) {
        if (that.form[key] !== undefined) {
          that.form[key] = that.projectUserInfo[key]
        }
      }
    },
    // 返回用户的激活次数
    async getActivNumber() {
      const that = this
      const params = {
        'email': that.projectUserInfo.email
      }
      const res = await getUserActivNumber(params)
      if (res.code === '200') {
        console.log('getActivNumber---', res)
      }
    },
    // 生成token
    generateToken() {
      this.dialogVisible = true
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
    handleFilterChange(val) {
      if (val) {
        this.form.oneFilters = []
      }
    },
    // 初始化scope
    initScope() {
      const that = this
      that.viewBody.scope = that.nvaName
      if (that.nvaName !== 'Feature' && that.nvaName !== 'Sprint' && that.nvaName !== 'TestCase' && that.nvaName !== 'TestCycle' && that.nvaName !== 'Issue') {
        that.viewBody.scope = 'Project'
      }
    },
    // 新增和修改确定表单
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (!this.form.id) {
            addViewRE(this.form).then(res => {
              if (res.code === '200') {
                this.resetForm()
                message('success', res.msg)
                this.getqueryViews()
              }
            })
          } else {
            const param = formatChangedPara(this.formTemp, this.form)
            param.oneFilters = this.form.oneFilters
            param.scope = this.form.scope
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
      this.form = {
        id: undefined,
        isPrivate: '0',
        oneFilters: [],
        title: ''
      }
      this.scopeDis = false
      this.$refs['form'].resetFields()
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

      if (row.parentTitle !== undefined && row.parentTitle !== '') {
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
          this.form = res.data
          this.scopeDis = true
          this.formTemp = Object.assign({}, this.form)
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
    // 刷新view
    async viewjectRefresh() {
      const res = await this.getqueryViews()
      if (res.code === '200') {
        message('success', '刷新成功')
      }
    },
    // 新增字段
    addFliter() {
      if (this.form.scope === undefined || this.form.scope.trim() === '') {
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

      this.form.oneFilters.push(obj)
    },
    // 移除字段
    delRemove(index) {
      this.form.oneFilters.splice(index, 1)
    },
    getType: function(fieldName, index) {
      for (let i = 0; i < this.scopeDownChildParams.length; i++) {
        const entity = this.scopeDownChildParams[i]
        if (entity.filedName === fieldName) {
          // 如果是下拉框，赋值
          if (entity.selectChild !== undefined && entity.selectChild.length > 0) {
            console.log('statusDownChildParams', this.statusDownChildParams)
            this.statusDownChildParams = entity.selectChild
          }
          this.form.oneFilters[index].type = entity.type
          return
        }
      }
    },
    viewScopeChildParams() {
      if (this.form.oneFilters.length > 0) {
        this.$confirm('重新选择可能会丢失页面内容请确认？', {
          title: '提示',
          showCancelButton: true,
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(s => {
          this.form.oneFilters = []
        }).catch(e => {
          this.$router.go(0)
        })
      }
      const scope = {
        scope: this.form.scope
      }
      getViewScopeChildParams(scope).then(res => {
        this.scopeDownChildParams = res.data
      })
    },
    dataFilter(val) {
      this.viewParentQuery = val
    },
    queryViewParent() {
      if (this.form.scope === undefined || this.form.scope === '') {
        message('success', '请选择作用域')
        this.viewParentQuery = '0'
        return
      }
      const params = {
        viewTitle: this.viewParentQuery,
        scope: this.form.scope
      }
      queryViewParents(params).then(res => {
        this.viewParents = res.data
      })
    },
    fuzhiFrom(val) {
      this.form.parentId = val
    }
  }
}
</script>
<style lang="scss">
@import "@/styles/index.scss";

.my-account {
  .add-account{
    width: 30%;
    margin-top:20px;
    .el-select{
      width:100%;
    }
  }
}
</style>
