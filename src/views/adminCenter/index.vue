<template>
  <div class="admin-center app-container">
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="用户管理" name="first">
        <div class="tab-box">
          <el-form
            :model="accountForm"
            :rules="accountRules"
            ref="accountForm"
            label-width="100px"
            class="demo-ruleForm"
          >
            <div>
              <el-button type="primary" round @click="submitForm('accountForm')"
                >新建账户</el-button
              >
              <el-button type="primary" round>确认修改</el-button>
            </div>
            <div class="add-account">
              <el-form-item label="邮箱" prop="email" size="small">
                <el-input
                  v-model="accountForm.email"
                  placeholder="请输入邮箱地址"
                ></el-input>
              </el-form-item>
              <el-form-item label="用户名" prop="userName" size="small">
                <el-input
                  v-model="accountForm.userName"
                  placeholder="请输入用户名"
                ></el-input>
              </el-form-item>
              <el-form-item
                label="密码"
                v-if="accountSingle"
                prop="password"
                size="small"
              >
                <el-input
                  v-model="accountForm.password"
                  placeholder="请设置初始密码"
                ></el-input>
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
              <el-form-item label="项目" prop="projectsSts" size="small">
                <!-- <el-input
                  v-model="accountForm.projectsSts"
                  placeholder="请选择项目"
                ></el-input> -->

                <el-autocomplete
                  class="inline-input"
                  v-model="accountForm.projectsSts"
                  :fetch-suggestions="querySearch"
                  placeholder="请输入内容"
                  @select="handleSelect"
                ></el-autocomplete>
              </el-form-item>
            </div>
            <div class="table">
              <el-button type="text" :disabled="accountMultiple"
                >批量删除</el-button
              >
              <el-button type="text" :disabled="accountSingle">权限</el-button>
              <el-table
                :data="accountData"
                :header-cell-style="tableHeader"
                stripe
                style="width: 100%"
                @row-click="accountEdit"
                @selection-change="accountSelectionChange"
              >
                <el-table-column type="selection" width="55" />
                <el-table-column align="center" label="序号" type="index">
                </el-table-column>

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
                  <template>
                    <span class="table-btn">删除</span>
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
      <el-tab-pane label="权限管理" name="second">权限管理</el-tab-pane>
      <el-tab-pane label="项目管理" name="third">项目管理</el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import { queryRoles, queryForProjectTitles, querySubUsers } from "@/api/admincenter";
export default {
  name: 'Admincenter',
  data() {
    return {
      activeName: 'first',
      tableHeader: {
        color: '#d4dce3',
        background: '#003d79'
      },
      accountRoleOption: [],
      accountForm: {},
      accountProject: [],
      accountRules: {
        email: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'blur'] }
        ],
        password: [
          { required: true, message: '请设置初始密码', trigger: 'blur' }
        ],
        role: [
          { required: true, message: '请选择角色', trigger: 'change' }
        ],
        project: [
          { required: true, message: '请选择项目', trigger: 'change' }
        ],
      },
      accountData: [],
      accountTotal: 0,
      accountQuery: {
        pageNum: 1,
        pageSize: 10
      },
      accountSelection: [], // 选择的表格
      accountSingle: true, // 非单个禁用
      accountMultiple: true,// 非多个禁用
    }
  },
  created() {
    queryRoles().then(res => {
      this.accountRoleOption = res.data
    })
    this.getquerySubUsers()
  },
  mounted() {
    this.getProject()

  },
  methods: {
    handleClick() {

    },
    /**˙账户开始 */
    //得到项目
    getProject() {
      queryForProjectTitles().then(res => {
        this.accountProject = res.data
      })
    },
    //得到账户列表
    getquerySubUsers() {
      querySubUsers(this.accountQuery).then(res => {
        this.accountData = res.data
        this.accountTotal = res.total
      })
    },
    querySearch(queryString, cb) {
      var restaurants = this.accountProject;
      var results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants;
      // 调用 callback 返回建议列表的数据
      cb(results);
    },
    createFilter(queryString) {
      return (restaurant) => {
        return (restaurant.title.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
      };
    },
    handleSelect(item) {
      console.log(item);
    },
    //重置
    resetAccountForm() {
      this.accountForm = {
        email: undefined,
        userName: undefined,
        password: undefined,
        sysRoleId: undefined,
        projectsSts: undefined,
      }
      this.$refs['accountForm'].resetFields();
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          alert('submit!');
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    accountEdit(row) {
      this.accountForm = row
    },
    accountSelectionChange(val) {
      this.accountSelection = val
      this.accountMultiple = !val.length
      this.accountSingle = val.length !== 1
    },
    /**˙账户结束 */

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
</style>