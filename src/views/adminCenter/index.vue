<template>
  <div class="admin-center app-container">
    <el-tabs v-model="activeName" @tab-click="handleClick">
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
              <el-form-item
                v-if="accountSingle"
                label="密码"
                prop="password"
                size="small"
              >
                <el-input
                  v-model="accountForm.password"
                  placeholder="请设置初始密码"
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
              <!-- <el-button type="text" :disabled="accountMultiple"
                >批量删除</el-button
              > -->
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
                <el-table-column align="center" label="序号" type="index" />

                <el-table-column prop="email" align="center" label="邮箱" />
                <el-table-column
                  prop="userName"
                  align="center"
                  label="用户名"
                />
                <el-table-column
                  prop="projectsSts"
                  align="center"
                  label="项目"
                  :show-overflow-tooltip="true"
                />
                <el-table-column
                  prop="registerDate"
                  align="center"
                  label="注册日期"
                />
                <el-table-column prop="roleName" align="center" label="角色" />
                <el-table-column label="操作" align="center">
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
        <!-- 自定义字段 -->
        <div class="manage-view">
          <el-row class="fd-row" :gutter="20">
            <el-col
              :span="8"
            ><div class="grid-content bg-purple" />
              <el-form
                ref="fieldsfrom"
                :model="fieldsfrom"
                :rules="fieldsrules"
                label-width="100px"
                class="demo-ruleForm"
              >
                <div class="fieldbtn">
                  <el-button
                    type="primary"
                    round
                    :disabled="fielddisabled"
                    @click="submitfdForm('fieldsfrom')"
                  >保存</el-button>
                  <el-button
                    type="primary"
                    round
                  >放弃</el-button>
                </div>
                <el-form-item label="字段名称" prop="fieldName" class="form-small">
                  <el-input v-model="fieldsfrom.fieldName" size="small" />
                </el-form-item>
                <el-form-item label="类型" prop="type" class="form-small">
                  <el-select
                    v-model="fieldsfrom.type"
                    size="small"
                    placeholder="请选择适用范围"
                  >
                    <el-option label="下拉框" disabled value="dropDown" />
                    <el-option label="文本" disabled value="text" />
                    <el-option label="备注" disabled value="memo" />
                    <el-option label="多选框" disabled value="chackbox" />
                    <el-option label="单选框" value="radio" />
                  </el-select>
                </el-form-item>
                <el-form-item
                  v-if="showLength"
                  label="长度"
                  prop="length"
                  class="form-small"
                >
                  <el-input v-model="fieldsfrom.length" size="small" />
                </el-form-item>
                <el-form-item
                  v-if="dropValue"
                  label="值"
                  prop="length"
                  class="form-small"
                >
                  <el-row>
                    <el-col
                      :span="16"
                    ><el-input
                      v-model="fieldsfrom.Value"
                      size="small"
                    /></el-col>
                    <el-col :span="8">
                      <div style="marginleft: 5px">
                        <el-button
                          type="primary"
                          round
                          :disabled="!fieldsfrom.Value"
                          @click="addDrop"
                        >添加</el-button>
                      </div>
                    </el-col>
                  </el-row>
                </el-form-item>
              </el-form>
            </el-col>
            <el-col v-if="dropValue" :span="4">
              <el-row>
                <el-col :span="16">
                  <el-table
                    border
                    max-height="205"
                    :data="dropData"
                    @row-click="dropselect"
                  >
                    <el-table-column prop="name" align="center" label="value" />
                  </el-table>
                </el-col>
                <el-col :span="8">
                  <div style="marginleft: 5px">
                    <el-button
                      type="primary"
                      round
                      :disabled="!droprow"
                      @click="delDrop"
                    >删除</el-button>
                  </div>
                </el-col>
              </el-row>
            </el-col>
            <el-col
              v-if="true"
              :span="6"
            ><div class="grid-content bg-purple" />
              <el-row class="sen-row" :gutter="20">
                <el-col :span="4">
                  <el-checkbox v-model="checked1" />
                </el-col>
                <el-col :span="4">范围</el-col>
                <el-col :span="4">是否必填</el-col>
                <el-col :span="4">初始值</el-col>
              </el-row>
              <el-row class="sen-row" :gutter="20">
                <el-col :span="4">
                  <el-checkbox v-model="fieldsfrom.scope[0]" />
                </el-col>
                <el-col :span="4">项目</el-col>
                <el-col :span="4">
                  <div class="ng-red">
                    <el-checkbox v-model="fieldsfrom.mandatory[0]" />
                  </div>
                </el-col>
                <el-col v-if="!singleorType" :span="4">
                  <div class="ng-input">
                    <el-input v-model="inputvalue" />
                  </div>
                </el-col>
                <!-- 单选 or 复选-->
                <el-col v-if="singleorType" :span="4">
                  <div class="ng-red">
                    <el-checkbox v-model="fieldsfrom.defaultValue[0]" />
                  </div>
                </el-col>
              </el-row>
              <el-row class="sen-row" :gutter="20">
                <el-col :span="4">
                  <el-checkbox v-model="fieldsfrom.scope[1]" />
                </el-col>
                <el-col :span="4">故事</el-col>
                <el-col :span="4">
                  <div class="ng-red">
                    <el-checkbox v-model="fieldsfrom.mandatory[1]" />
                  </div>
                </el-col>
                <el-col v-if="!singleorType" :span="4">
                  <div class="ng-input">
                    <el-input v-model="inputvalue" />
                  </div>
                </el-col>
                <!-- 单选 or 复选-->
                <el-col v-if="singleorType" :span="4">
                  <div class="ng-red">
                    <el-checkbox v-model="fieldsfrom.defaultValue[1]" />
                  </div>
                </el-col>
              </el-row>
              <el-row class="sen-row" :gutter="20">
                <el-col :span="4">
                  <el-checkbox v-model="fieldsfrom.scope[2]" />
                </el-col>
                <el-col :span="4">测试用例</el-col>
                <el-col :span="4">
                  <div class="ng-red">
                    <el-checkbox v-model="fieldsfrom.mandatory[2]" />
                  </div>
                </el-col>
                <el-col v-if="!singleorType" :span="4">
                  <div class="ng-input">
                    <el-input v-model="inputvalue" />
                  </div>
                </el-col>
                <!-- 单选 or 复选-->
                <el-col v-if="singleorType" :span="4">
                  <div class="ng-red">
                    <el-checkbox v-model="fieldsfrom.defaultValue[2]" />
                  </div>
                </el-col>
              </el-row>
              <el-row class="sen-row" :gutter="20">
                <el-col :span="4">
                  <el-checkbox v-model="fieldsfrom.scope[3]" />
                </el-col>
                <el-col :span="4">测试周期</el-col>
                <el-col :span="4">
                  <div class="ng-red">
                    <el-checkbox v-model="fieldsfrom.mandatory[3]" />
                  </div>
                </el-col>
                <el-col v-if="!singleorType" :span="4">
                  <div class="ng-input">
                    <el-input v-model="inputvalue" />
                  </div>
                </el-col>
                <!-- 单选 or 复选-->
                <el-col v-if="singleorType" :span="4">
                  <div class="ng-red">
                    <el-checkbox v-model="fieldsfrom.defaultValue[3]" />
                  </div>
                </el-col>
              </el-row>
              <el-row class="sen-row" :gutter="20">
                <el-col :span="4">
                  <el-checkbox v-model="fieldsfrom.scope[4]" />
                </el-col>
                <el-col :span="4">验收</el-col>
                <el-col :span="4">
                  <div class="ng-red">
                    <el-checkbox v-model="fieldsfrom.mandatory[4]" />
                  </div>
                </el-col>
                <el-col v-if="!singleorType" :span="4">
                  <div class="ng-input">
                    <el-input v-model="inputvalue" />
                  </div>
                </el-col>
                <!-- 单选 or 复选-->
                <el-col v-if="singleorType" :span="4">
                  <div class="ng-red">
                    <el-checkbox v-model="fieldsfrom.defaultValue[4]" />
                  </div>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
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
                <template>
                  <span class="table-btn">删除</span>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
        <!-- 自定义字段 -->
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import { message, formatChangedPara } from '@/utils/common'
import Jurisdiction from '@/views/adminCenter/jurisdiction'
import { queryRoles, queryForProjectTitles, querySubUsers, createSubUser, deleteSubUser, updateSubUser } from '@/api/admincenter'
import { queryCustomList, queryFieldRadioById, addCustomRadio, updateCustomRadio } from '@/api/customField'
export default {
  name: 'Admincenter',
  components: {
    Jurisdiction
  },
  data() {
    return {
      activeName: '0',
      tableHeader: {
        color: '#d4dce3',
        background: '#003d79'
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

      // 自定义字段
      fieldsfrom: {
        scope: [false, false, false, false, false],
        defaultValue: [false, false, false, false, false],
        mandatory: [false, false, false, false, false],
        projectId: '361971315692802048'
      },
      fieldsrules: {
        fieldName: [{ required: true, message: '请输入字段名称', trigger: 'blur' }],
        type: [{ required: true, message: '请选择类型', trigger: 'change' }]
      },
      // 表格数据
      fieldsData: [],
      fieldsSelection: [], // 选择的表格
      dbfields: true, // 非多个禁用
      checked1: true,
      fielddisabled: true,
      inputvalue: '',
      // 类型选择（单选 or 复选）
      singleorType: false,
      // 字符长度 （文本 or 备注）
      showLength: false,
      dropValue: false,
      dropData: [
        { name: '01' },
        { name: '02' }
      ],
      droprow: ''
      // 自定义字段 结束

    }
  },
  watch: {
    'fieldsfrom.type': function(val) {
      this.PleaseType(val)
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
    queryRoles().then(res => {
      this.accountRoleOption = res.data
    })
    this.getquerySubUsers()
    this.getProject()
    this.getqueryCustomList()
  },
  mounted() {

  },
  methods: {
    handleClick(val) {
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
    // 获取自定义字段列表
    getqueryCustomList() {
      const obj = {
        projectId: '361971315692802048'
      }
      const page = {
        pageNum: 1,
        pageSize: 10
      }
      queryCustomList(obj, page).then(res => {
        if (res.code === '200') {
          console.log(res, '获取自定义字段列表')
          this.fieldsData = res.data
        }
      })
    },
    submitfdForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.fielddisabled = true
          const radio = this.fieldsfrom
          for (const key in radio) {
            if (key === 'scope' || key === 'defaultValue' || key === 'mandatory') {
              for (let i = 0; i < radio[key].length; i++) {
                if (radio[key][i] === false) {
                  radio[key][i] = '0'
                } else {
                  radio[key][i] = '1'
                }
              }
            }
          }

          for (const i in radio) {
            if (i === 'scope' || i === 'defaultValue' || i === 'mandatory') {
              radio[i] = radio[i].join(',')
            }
          }
          if (!this.fieldsfrom.id) {
            addCustomRadio(radio).then(res => {
              if (res.code === '200') {
                message('success', res.msg)
                this.getqueryCustomList()
              }
            })
          } else {
            updateCustomRadio(radio).then(res => {
              if (res.code === '200') {
                message('success', res.msg)
                this.getqueryCustomList()
              }
            })
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    // 查看字段详情
    showfield(row) {
      queryFieldRadioById(row.id).then(res => {
        const radio = res.data
        for (const key in radio) {
          if (key === 'scope' || key === 'defaultValue' || key === 'mandatory') {
            radio[key] = radio[key].split(',')
            for (let i = 0; i < radio[key].length; i++) {
              if (radio[key][i] === '0') {
                radio[key][i] = false
              } else {
                radio[key][i] = true
              }
            }
          }
        }
        // console.log(radio)
        this.fieldsfrom = res.data
      })
    },
    fieldsSelectionChange(val) {
      this.fieldsSelection = val
      this.dbfields = !val.length
    },
    PleaseType(val) {
      const type = val
      if (type === 'radio' || type === 'chackbox') {
        this.singleorType = true
      } else {
        this.singleorType = false
      }
      if (type === 'text' || type === 'memo') {
        this.showLength = true
      } else {
        this.showLength = false
      }
      if (type === 'dropDown') {
        this.dropValue = true
      } else {
        this.dropValue = false
      }
    },
    // drop表格选中
    dropselect(val) {
      this.droprow = val
    },
    // 添加drop值
    addDrop() {
      const obj = {
        name: this.fieldsfrom.Value
      }
      this.dropData.push(obj)
    },
    // 删除drop值
    delDrop() {
      const val = this.droprow
      this.dropData.filter((item, index) => {
        if (item === val) {
          this.dropData.splice(index, 1)
          this.droprow = ''
        }
      })
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
