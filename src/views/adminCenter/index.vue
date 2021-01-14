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
      <el-tab-pane label="权限管理" name="1">
        <div class="tab-box tab-box1">
          <div class="left">
            <div>
              <el-button type="primary" round>QA 账户</el-button>
              <el-button type="primary" round>Developer 账户</el-button>
              <el-button type="primary" round>Admin 账户</el-button>
            </div>
            <div class="role-item">
              <div class="item-left">
                <div class="item">
                  <b> {{ jurisdictioninfo.roleName }}</b>
                  <span
                    v-if="jurisdictioninfo.roleName === 'Administrator'"
                  >默认 Administrator</span>
                  <span
                    v-if="jurisdictioninfo.roleName === 'QA'"
                  >QA Default Group</span>
                  <span v-if="jurisdictioninfo.roleName === 'QA'">Group B</span>
                  <span
                    v-if="jurisdictioninfo.roleName === 'Developer'"
                  >Developer Default Group</span>
                  <span
                    v-if="jurisdictioninfo.roleName === 'Developer'"
                  >Group C</span>
                </div>
              </div>
              <div class="info-right">
                <b> {{ jurisdictioninfo.userName }}</b>
                <span>
                  {{ jurisdictioninfo.email }}
                </span>
              </div>
            </div>
          </div>
          <div class="right">
            <el-collapse v-model="jurisdiction">
              <el-collapse-item
                v-for="(item, index) in jurisdictionData"
                :key="index"
                :name="index + 1"
                :title="item.title"
              >
                <div
                  v-for="(item1, index1) in item.sysOperationAuthorities"
                  :key="index1"
                  class="project-item"
                >
                  <div class="top">
                    <el-checkbox
                      v-model="checked"
                      true-label="1"
                      false-label="0"
                    >{{ item1.markNameDesc }}</el-checkbox>
                    <el-checkbox
                      v-for="(item2, index2) in item1.childList"
                      :key="index2"
                      v-model="item2.isSelect"
                      true-label="1"
                      false-label="0"
                    >
                      {{ item2.markNameDesc }}</el-checkbox>
                  </div>
                </div>
              </el-collapse-item>
            </el-collapse>
          </div>
        </div>
      </el-tab-pane>
      <el-tab-pane label="项目管理" name="2">项目管理</el-tab-pane>
      <el-tab-pane label="自定义字段" name="3">
        <!-- 自定义字段 -->
        <div class="manage-view">
          <el-row class="fd-row" :gutter="20">
            <el-col :span="12"><div class="grid-content bg-purple" />
              <el-form
                ref="fieldsfrom"
                :model="fieldsfrom"
                :rules="fieldsrules"
                label-width="100px"
                class="demo-ruleForm"
              >
                <div>
                  <div class="set_btn" @click="submitfdForm('fieldsfrom')">保存</div>
                  <div class="set_btn">放弃</div>
                </div>
                <el-form-item label="字段名称" prop="name" class="form-small">
                  <el-input v-model="fieldsfrom.name" size="small" />
                </el-form-item>
                <el-form-item label="类型" prop="type" class="form-small">
                  <el-select
                    v-model="fieldsfrom.scope"
                    size="small"
                    placeholder="请选择适用范围"
                  >
                    <el-option label="DropDown" value="DropDown" />
                    <el-option label="Text" value="Text" />
                    <el-option label="Memo" value="Memo" />
                    <el-option label="Chackbox" value="Chackbox" />
                    <el-option label="Radio" value="Radio" />
                  </el-select>
                </el-form-item>
              </el-form>
            </el-col>
            <el-col :span="6"><div class="grid-content bg-purple" />
              <el-row class="sen-row" :gutter="20">
                <el-col :span="4"><div class="grid-content bg-purple" />
                  <el-checkbox v-model="checked1" />
                </el-col>
                <el-col :span="4"><div class="grid-content bg-purple" />范围</el-col>
                <el-col :span="4"><div class="grid-content bg-purple" />是否必填</el-col>
                <el-col :span="4"><div class="grid-content bg-purple" />初始值</el-col>
              </el-row>
              <el-row class="sen-row" :gutter="20">
                <el-col :span="4"><div class="grid-content bg-purple" />
                  <el-checkbox v-model="checked1" />
                </el-col>
                <el-col :span="4"><div class="grid-content bg-purple" />项目</el-col>
                <el-col :span="4"><div class="grid-content bg-purple" />是否必填</el-col>
                <el-col :span="4"><div class="grid-content bg-purple" />初始值</el-col>
              </el-row>
              <el-row class="sen-row" :gutter="20">
                <el-col :span="4"><div class="grid-content bg-purple" />
                  <el-checkbox v-model="checked1" />
                </el-col>

                <el-col :span="4"><div class="grid-content bg-purple" />故事</el-col>
                <el-col :span="4"><div class="grid-content bg-purple" />是否必填</el-col>
                <el-col :span="4"><div class="grid-content bg-purple" />初始值</el-col>
              </el-row>
              <el-row class="sen-row" :gutter="20">
                <el-col :span="4"><div class="grid-content bg-purple" />
                  <el-checkbox v-model="checked1" />
                </el-col>

                <el-col :span="4"><div class="grid-content bg-purple" />测试用例</el-col>
                <el-col :span="4"><div class="grid-content bg-purple" />是否必填</el-col>
                <el-col :span="4"><div class="grid-content bg-purple" />初始值</el-col>
              </el-row>
              <el-row class="sen-row" :gutter="20">
                <el-col :span="4"><div class="grid-content bg-purple" />
                  <el-checkbox v-model="checked1" />
                </el-col>

                <el-col :span="4"><div class="grid-content bg-purple" />测试周期</el-col>
                <el-col :span="4"><div class="grid-content bg-purple" />是否必填</el-col>
                <el-col :span="4"><div class="grid-content bg-purple" />初始值</el-col>
              </el-row>
              <el-row class="sen-row" :gutter="20">
                <el-col :span="4"><div class="grid-content bg-purple" />
                  <el-checkbox v-model="checked1" />
                </el-col>
                <el-col :span="4"><div class="grid-content bg-purple" />验收</el-col>
                <el-col :span="4"><div class="grid-content bg-purple" />是否必填</el-col>
                <el-col :span="4"><div class="grid-content bg-purple" />初始值</el-col>
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
              @selection-change="fieldsSelectionChange"
            >
              <el-table-column type="selection" width="55" />
              <el-table-column prop="title" label="字段名称" />
              <el-table-column prop="scope" label="类型" />
              <el-table-column prop="parent" label="范围" />
              <el-table-column prop="owner" label="是否必填" />
              <el-table-column prop="craeted" label="初始值" />
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
<<<<<<< HEAD
import { queryRoles, queryForProjectTitles, querySubUsers, createSubUser, deleteSubUser, updateSubUser, getSysOperationAuthority, getPermissions } from "@/api/admincenter";
=======

import { queryRoles, queryForProjectTitles, querySubUsers, createSubUser, deleteSubUser, updateSubUser, getPermissions } from '@/api/admincenter'
>>>>>>> 6355c37ad31a1332d6ad7100558f852741c4ee45
export default {
  name: 'Admincenter',
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

      jurisdiction: ['1'], // 权限折叠
      jurisdictionData: [],
      jurisdictionItem: [],
      jurisdictioninfo: {},
      checked: true,
      // 自定义字段
      fieldsfrom: {},
      fieldsrules: {},
      // 表格数据
      fieldsData: [],
      fieldsSelection: [], // 选择的表格
      dbfields: true, // 非多个禁用
      checked1: true
      // 自定义字段



    }
  },
  created() {
    queryRoles().then(res => {
      this.accountRoleOption = res.data
    })
    this.getquerySubUsers()
    this.getProject()
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
        this.$refs.accountData.clearSelection()
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
      this.activeName = '1'
      getPermissions(this.accountSelection[0].id).then(res => {
        this.jurisdictionData = res.data.projects
        this.jurisdictioninfo = res.data.subUserDto
        console.log(this.jurisdictionData, res)
      })
    },
    /** ˙账户结束 */
    // 自定义字段开始
    submitfdForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          alert('submit!')
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },

    fieldsSelectionChange(val) {
      this.fieldsSelection = val
      this.dbfields = !val.length
    }

    // 自定义字段结束

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
.fd-row{
  display: flex;
  align-items: center;
  .sen-row{
    margin-bottom: 5px;
  }
}
</style>
<style lang="scss" scoped>
@import "index.scss";
@import "@/views/project/index.scss"
</style>
