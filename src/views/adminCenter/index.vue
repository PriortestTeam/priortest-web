<template>
  <div class="admin-center app-container">
    <el-tabs v-model="activeName" :before-leave="handleClick">
      <el-tab-pane label="用户管理" name="0">
        <div class="tab-box">
          <el-form
            ref="accountForm"
            :model="accountForm"
            :rules="accountRules"
            label-width="100px"
            class="demo-ruleForm"
          >
            <div>
              <el-button
                type="primary"
                round
                :disabled="!accountUpdate"
                @click="submitForm('accountForm')"
              >新建账户</el-button>
              <el-button
                type="primary"
                :disabled="accountUpdate"
                round
                @click="submitForm('accountForm')"
              >确认修改</el-button>
              <el-button
                type="primary"
                :disabled="accountUpdate"
                round
                @click="cancelUpdate('accountForm')"
              >取消修改</el-button>
            </div>
            <div class="add-account">
              <el-form-item label="邮箱" prop="email" size="small">
                <el-input
                  v-model="accountForm.email"
                  placeholder="请输入邮箱地址"
                />
              </el-form-item>
              <el-form-item label="用户名" prop="userName" size="small">
                <el-input
                  v-model="accountForm.userName"
                  placeholder="请输入用户名"
                />
              </el-form-item>

              <el-form-item label="角色" prop="sysRoleId" size="small">
                <el-select
                  v-model="accountForm.sysRoleId"
                  placeholder="请选择角色"
                >
                  <el-option
                    v-for="item in accountRoleOption"
                    :key="item.id"
                    :value="item.id"
                    :label="item.roleName"
                  />
                </el-select>
              </el-form-item>
              <el-form-item label="项目" prop="projectIdStr" size="small">
                <el-select
                  v-model="accountForm.projectIdStr"
                  filterable
                  multiple
                  placeholder="请选择"
                  @change="accountChangePro"
                >
                  <el-option
                    v-for="item in accountProject"
                    :key="item.id"
                    :value="item.id"
                    :label="item.title"
                  />
                </el-select>
              </el-form-item>
            </div>
            <div class="table">
              <el-button type="text" @click="accountRefresh">刷新</el-button>
              <el-button
                type="text"
                :disabled="accountMultiple"
              >批量删除</el-button>
              <el-button
                type="text"
                :disabled="accountSingle"
                @click="accountJurisdiction"
              >权限</el-button>
              <el-table
                ref="accountData"
                :data="accountData"
                :header-cell-style="tableHeader"
                stripe
                style="width: 100%"
                @row-click="accountEdit"
                @selection-change="accountSelectionChange"
              >
                <el-table-column type="selection" width="55" />
                <el-table-column label="序号" type="index" />

                <el-table-column prop="email" label="邮箱" />
                <el-table-column
                  prop="userName"

                  label="用户名"
                />
                <el-table-column
                  prop="projectsSts"

                  label="项目"
                  :show-overflow-tooltip="true"
                />
                <el-table-column
                  prop="registerDate"

                  label="注册日期"
                />
                <el-table-column prop="roleName" label="角色" />
                <el-table-column label="操作">
                  <template slot-scope="scope">
                    <span
                      class="table-btn"
                      @click.stop="accountDel(scope.row)"
                    >删除</span>
                  </template>
                </el-table-column>
              </el-table>
              <pagination
                v-show="accountTotal > 0"
                :total="accountTotal"
                :page.sync="accountQuery.pageNum"
                :limit.sync="accountQuery.pageSize"
                @pagination="getquerySubUsers"
              />
            </div>
          </el-form>
        </div>
      </el-tab-pane>
      <el-tab-pane v-if="activeName === '1'" label="权限管理" name="1">
        <Jurisdiction
          v-if="jurisdictionAccountId"
          :id="jurisdictionAccountId"
        />
      </el-tab-pane>
      <el-tab-pane label="项目管理" name="2">项目管理</el-tab-pane>
      <el-tab-pane label="自定义字段" name="3">
        <div class="manage-view">
          <!-- 自定义字段 -->
          <Userindex
            v-if="customType === '用户'"
            :scope-list="scopeList"
            :custom-type="customType"
            :customname="fieldsfrom"
            :fields-options="fieldsOptions"
            :field-name="fieldName"
            @PleaseType="chType"
            @executeQueryCustomList="getqueryCustomList"
            @setFieldName="setFieldName"
          />
          <Dateindex
            v-if="customType === '日期'"
            :scope-list="scopeList"
            :custom-type="customType"
            :customname="fieldsfrom"
            :fields-options="fieldsOptions"
            :field-name="fieldName"
            @PleaseType="chType"
            @executeQueryCustomList="getqueryCustomList"
            @setFieldName="setFieldName"
          />
          <Radioindex
            v-if="customType === 'radio'"
            :scope-list="scopeList"
            :custom-type="customType"
            :customname="fieldsfrom"
            :fields-options="fieldsOptions"
            :field-name="fieldName"
            @PleaseType="chType"
            @executeQueryCustomList="getqueryCustomList"
            @setFieldName="setFieldName"
          />

          <Textindex
            v-else-if="customType === 'text'"
            :scope-list="scopeList"
            :custom-type="customType"
            :customname="fieldsfrom"
            :fields-options="fieldsOptions"
            :field-name="fieldName"
            @PleaseType="chType"
            @executeQueryCustomList="getqueryCustomList"
            @setFieldName="setFieldName"
          />

          <Memoindex
            v-else-if="customType === 'RichText'"
            :scope-list="scopeList"
            :custom-type="customType"
            :customname="fieldsfrom"
            :fields-options="fieldsOptions"
            :field-name="fieldName"
            @PleaseType="chType"
            @executeQueryCustomList="getqueryCustomList"
            @setFieldName="setFieldName"
          />

          <Link
            v-else-if="customType === '链接'"
            :scope-list="scopeList"
            :custom-type="customType"
            :customname="fieldsfrom"
            :fields-options="fieldsOptions"
            :field-name="fieldName"
            @PleaseType="chType"
            @executeQueryCustomList="getqueryCustomList"
            @setFieldName="setFieldName"
          />

          <Checkbox
            v-else-if="customType==='Checkbox'"
            :scope-list="scopeList"
            :custom-type="customType"
            :customname="fieldsfrom"
            :fields-options="fieldsOptions"
            :field-name="fieldName"
            @PleaseType="chType"
            @executeQueryCustomList="getqueryCustomList"
            @setFieldName="setFieldName"
          />

          <Dropdown
            v-else-if="customType === 'DropDown' || customType === '多选项'"
            :scope-list="scopeList"
            :custom-type="customType"
            :customname="fieldsfrom"
            :fields-options="fieldsOptions"
            :field-name="fieldName"
            @PleaseType="chType"
            @executeQueryCustomList="getqueryCustomList"
            @setFieldName="setFieldName"
          />
          <div class="table">
            <el-button type="text" :disabled="dbfields">删除</el-button>
            <el-table
              :data="fieldsData"
              :header-cell-style="tableHeader"
              stripe
              style="width: 100%"
              @row-click="showfield"
              @selection-change="fieldsSelectionChange"
            >
              <el-table-column type="selection" width="55" />
              <el-table-column prop="fieldName" label="字段名称" />
              <el-table-column prop="type" label="类型" />
              <el-table-column prop="scope" label="范围" />
              <el-table-column prop="mandatory" label="是否必填" />
              <el-table-column label="Action">
                <template slot-scope="scope">
                  <el-button
                    type="text"
                    class="table-btn"
                    @click.stop="delfield(scope.row)"
                  >删除</el-button>
                </template>
              </el-table-column>
            </el-table>
            <pagination
              v-show="fieldsTotal > 0"
              :total="fieldsTotal"
              :page.sync="fieldsQuery.pageNum"
              :limit.sync="fieldsQuery.pageSize"
              @pagination="getqueryCustomList"
            />
          </div>
        </div>
        <!-- 自定义字段 -->
      </el-tab-pane>
      <el-tab-pane label="系统字段" name="4">
        <System :param-value="propSystem" />
      </el-tab-pane>
      <el-tab-pane label="视图管理" name="5">
        <ViewPage v-if="activeName === '5'"></ViewPage>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import { message, formatChangedPara, customradioData, customtextData } from '@/utils/common'
import Jurisdiction from '@/views/adminCenter/jurisdiction'
import System from '@/views/adminCenter/system'
import ViewPage from '@/views/project/view'
import Dateindex from '@/views/adminCenter/date'
import Radioindex from '@/views/adminCenter/radio'
import Textindex from '@/views/adminCenter/text'
import Memoindex from '@/views/adminCenter/memo'
import Dropdown from '@/views/adminCenter/dropDown'
import Checkbox from '@/views/adminCenter/checkbox'
import Userindex from '@/views/adminCenter/user'
import Link from '@/views/adminCenter/link'
import { getUserRoles, queryRoles, queryForProjectTitles, querySubUsers, createSubUser, deleteSubUser, updateSubUser, getSysCustomField } from '@/api/admincenter'
import { queryCustomList, queryFieldRadioById, deleteCustomRadio, queryFieldTextById, deleteCustomText, queryFieldDropDownById, deleteCustomDropDown } from '@/api/customField'
export default {
  name: 'Admincenter',
  components: {
    Jurisdiction, Dateindex, Radioindex, Textindex, Memoindex, Dropdown, System, Checkbox, Userindex, Link, ViewPage
  },
  data() {
    return {
      activeName: '0',
      propSystem: '',
      tableHeader: {
        color: '#d4dce3',
        background: '#4286CD'
      },
      accountRoleOption: [],
      accountTempForm: {},
      accountForm: {
        id: undefined,
        email: undefined,
        userName: undefined,
        password: undefined,
        sysRoleId: undefined,
        projectIdStr: []
      },
      accountProject: [],
      accountRules: {
        email: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'blur'] }
        ],
        password: [
          { required: true, message: '请设置初始密码', trigger: 'blur' }
        ],
        userName: [
          { required: true, message: '请输入用户名', trigger: 'blur' }
        ],
        sysRoleId: [
          { required: true, message: '请选择角色', trigger: 'change' }
        ],
        projectIdStr: [
          { required: true, message: '请选择项目', trigger: 'change' }
        ]
      },
      accountData: [],
      accountTotal: 0,
      accountQuery: {
        pageNum: 1,
        pageSize: 10
      },
      accountSelection: [], // 选择的表格
      accountSingle: true, // 非单个禁用
      accountMultiple: true, // 非多个禁用
      accountUpdate: true,

      jurisdictionAccountId: '',
      // 父传子数据
      fieldsfrom: {
        type: 'radio'
      },
      textfrom: {},
      // 子传父数据
      customType: 'radio',

      // 自定义字段表格数据
      fieldsData: [],
      fieldsTotal: 0,
      fieldsSelection: [], // 选择的表格
      dbfields: true, // 非多个禁用
      fieldsQuery: {
        pageNum: 1,
        pageSize: 10
      },
      fieldsId: {
        projectId: ''
      },
      fieldName: '',
      scopeList: [],
      fieldsOptions: [{
        value: 'DropDown',
        label: '下拉框'
      }, {
        value: 'text',
        label: '文本'
      }, {
        value: 'RichText',
        label: '备注'
      }, {
        value: 'Checkbox',
        label: '复选框'
      }, {
        value: 'radio',
        label: '单选框'
      }, {
        value: '链接',
        label: '链接'
      }, {
        value: '多选项',
        label: '多选项'
      }, {
        value: '用户',
        label: '用户'
      }, {
        value: '日期',
        label: '日期'
      }]
    }
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      // 新增项目到自定义字段
      if (to.query.par) {
        if ((from.name === 'Addproject') || from.name === 'Addfeature' || from.name === 'Addsprint' ||
          from.name === 'Addtestcycle' || from.name === 'Addissue' || from.name === 'Addtestcase') {
          vm.activeName = '4'
          vm.propSystem = to.query.par
        }
      } else {
        if ((from.name === 'Addproject') || from.name === 'Addfeature' || from.name === 'Addsprint' ||
          from.name === 'Addtestcycle' || from.name === 'Addissue' || from.name === 'Addtestcase') {
          vm.activeName = '3'
        }
      }
    })
  },
  computed: {
    projectInfo() {
      return this.$store.state.user.userinfo
    }
  },
  watch: {
    'fieldsfrom.type': function(val) {
      this.chType(val)
      // this.PleaseType(val)
    },
    'fieldsfrom.fieldName': function(val) {
      if (val) {
        this.fielddisabled = false
      } else {
        this.fielddisabled = true
      }
    }
  },
  created() {
    this.fieldsId.projectId = this.projectInfo.userUseOpenProject.projectId
    getUserRoles().then(res => {
      this.accountRoleOption = res.data
    })
    this.getquerySubUsers()
    this.getProject()
    this.getqueryCustomList()
    this.getSysCustomFieldByScope()
    // this.getSysCustomFieldByType()
  },
  methods: {
    async getSysCustomFieldByType() {
      const params = {
        'fieldName': 'type'
      }
      const res = await getSysCustomField(params)
      if (res.code === '200') {
        res.data.mergeValues.forEach(item => {
          const obj = {
            value: item,
            label: item
          }
          this.fieldsOptions.push(obj)
        })
      }
    },
    async getSysCustomFieldByScope() {
      const params = {
        'fieldName': 'scope'
      }
      const res = await getSysCustomField(params)
      if (res.code === '200') {
        console.log('getSysCustomFieldByScope---', res)
        this.scopeList = res.data.mergeValues
        /* res.data.mergeValues.forEach(item => {
          const obj = {
            value: item,
            label: item
          }
          this.fieldsOptions.push(obj)
        }) */
      }
    },
    setFieldName(data) {
      this.fieldName = data
    },
    handleClick(val) {
      if (val === '4') {
        if (!this.projectInfo.userUseOpenProject.projectId) {
          message('error', '请先选择项目')
          throw new Error('')
        }
      }
    },
    /** ˙账户开始 */
    // 得到项目
    getProject() {
      queryForProjectTitles().then(res => {
        this.accountProject = res.data
        this.accountProject.unshift({ title: 'ALL', id: '0' })
      })
    },
    // 项目互斥
    accountChangePro(val) {
      const index = val.indexOf('0')
      if (index !== -1) {
        this.accountForm.projectIdStr = ['0']
      }
    },
    // 得到账户列表
    getquerySubUsers() {
      return new Promise((resolve, reject) => {
        querySubUsers(this.accountQuery).then(res => {
          if (res.code === '200') {
            this.accountData = res.data
            this.accountTotal = res.total
            resolve(res)
          }
        })
      })
    },
    // 重置
    resetAccountForm() {
      this.accountForm = {
        id: undefined,
        email: undefined,
        userName: undefined,
        password: undefined,
        sysRoleId: undefined,
        projectIdStr: []
      }
      this.$refs['accountForm'].resetFields()
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.accountForm.id) {
            const param = formatChangedPara(this.accountTempForm, this.accountForm)
            if (param.projectIdStr) {
              param.projectIdStr = param.projectIdStr.join(',')
            }
            updateSubUser(param).then(res => {
              message('success', res.msg)
              this.resetAccountForm()
              this.$refs.accountData.clearSelection()
              this.accountUpdate = true
              this.getquerySubUsers()
            })
          } else {
            var form = JSON.parse(JSON.stringify(this.accountForm))
            form.projectIdStr = form.projectIdStr.join(',')
            createSubUser(form).then(res => {
              if (res.code !== '200') {
                return
              }
              message('success', res.msg)
              this.resetAccountForm()
              this.getquerySubUsers()
            })
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    async accountRefresh() {
      const res = await this.getquerySubUsers()
      if (res.code === '200') {
        this.accountUpdate = true
        this.resetAccountForm()
        message('success', '刷新成功')
      }
    },
    // 行点击编辑
    accountEdit(row) {
      this.$refs.accountData.clearSelection()
      this.$refs.accountData.toggleRowSelection(row)
      const form = JSON.parse(JSON.stringify(row))
      form.projectIdStr = form.projectIdStr.split(',')
      for (var x in this.accountForm) {
        this.accountForm[x] = form[x]
      }
      this.accountTempForm = Object.assign({}, this.accountForm)
      this.accountUpdate = false
    },
    // 取消修改
    cancelUpdate() {
      this.$refs.accountData.clearSelection()
      this.accountUpdate = true
      this.resetAccountForm()
    },
    accountSelectionChange(val) {
      this.accountSelection = val
      this.accountMultiple = !val.length
      this.accountSingle = val.length !== 1
      if (this.accountSingle) {
        this.resetAccountForm()
        this.accountUpdate = true
      }
    },
    // 删除
    accountDel(val) {
      this.$confirm('是否确认删除数据项?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteSubUser(val.id).then(res => {
          if (res.code === '200') {
            this.getquerySubUsers()
            message('success', '删除成功')
          }
        })
      }).catch(function() { })
    },
    // 权限
    accountJurisdiction() {
      this.jurisdictionAccountId = ''
      this.activeName = '1'
      this.jurisdictionAccountId = this.accountSelection[0].id
    },
    /** ˙账户结束 */

    /** 自定义字段 开始 */
    // 获取子类的传值
    chType(type) {
      this.fieldsfrom.type = type
      this.customType = type
    },

    // 获取自定义字段列表
    getqueryCustomList() {
      queryCustomList(this.fieldsId, this.fieldsQuery).then(res => {
        if (res.code === '200') {
          this.fieldsData = res.data
          this.fieldsTotal = res.total
        }
      })
    },
    // 删除自定义字段
    delfield(row) {
      if (row.type === 'text' || row.type === 'memo') {
        this.deltext(row.id)
      } else if (row.type === 'radio') {
        this.delradio(row.id)
      } else if (row.type === 'DropDown') {
        this.deldropDown(row.id)
      }
    },
    // 删除radio类型
    delradio(id) {
      deleteCustomRadio(id).then(res => {
        if (res.code === '200') {
          message('success', res.msg)
          this.getqueryCustomList()
        }
      })
    },
    // 删除text，Remarks备注类型
    deltext(id) {
      deleteCustomText(id).then(res => {
        if (res.code === '200') {
          message('success', res.msg)
          this.getqueryCustomList()
        }
      })
    },
    // 删除dropDown备注类型
    deldropDown(id) {
      deleteCustomDropDown(id).then(res => {
        if (res.code === '200') {
          message('success', res.msg)
          this.getqueryCustomList()
          console.log('删除dropDown备注类型')
        }
      })
    },
    // 查看字段详情
    showfield(row) {
      // 类型不同，查询接口不同
      if (row.type === 'text' || row.type === 'memo') {
        this.gettextInfo(row.id)
      } else if (row.type === 'radio') {
        this.getradioInfo(row.id)
      } else if (row.type === 'DropDown') {
        this.getdropdownInfo(row.id)
      }
    },
    // 获取radio详情
    getradioInfo(id) {
      queryFieldRadioById(id).then(res => {
        if (res.code === '200') {
          const data = customradioData(res.data)
          this.fieldsfrom = data
        }
      })
    },
    // 获取text，Remarks详情
    gettextInfo(id) {
      queryFieldTextById(id).then(res => {
        const data = customtextData(res.data)
        this.fieldsfrom = data
      })
    },

    // 获取dropdown详情
    getdropdownInfo(id) {
      queryFieldDropDownById(id).then(res => {
        const data = customtextData(res.data)
        this.fieldsfrom = data
        console.log('获取dropdown详情')
      })
    },
    // 批量删除字段
    fieldsSelectionChange(val) {
      this.fieldsSelection = val
      this.dbfields = !val.length
    },
    PleaseType(val) {
      this.customType = val
    }
    // 自定义字段 结束
  }
}
</script>
<style lang="scss">
@import "@/styles/mixin.scss"; //颜色
@import "@/styles/color.scss"; //按钮
//标签页切换样式
.el-tabs {
  .el-tabs__item.is-active,
  .el-tabs__item:hover {
    color: $btnbgcolor;
  }
  .el-tabs__active-bar {
    background-color: $btnbgcolor;
  }
  .el-tabs__item {
    height: 25px;
    line-height: 14px;
  }
}
</style>
<style lang="scss" scoped>
@import "index.scss";
// @import "field.scss";
</style>
<style lang="scss">
.admin-center {
  .el-form-item .el-form-item__label {
    padding-right: 8px;
  }
}
</style>
