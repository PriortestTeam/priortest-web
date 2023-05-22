<template>
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
          :disabled="!accountUpdate"
          @click="submitForm('accountForm')"
        >新建账户</el-button>
        <el-button
          type="primary"
          :disabled="accountUpdate"
          @click="submitForm('accountForm')"
        >确认修改</el-button>
        <el-button
          type="primary"
          :disabled="accountUpdate"
          @click="cancelUpdate('accountForm')"
        >取消修改</el-button>
      </div>
      <div class="add-account">
        <el-form-item label="邮箱" prop="email" size="small">
          <el-input
            v-model="accountForm.email"
            :disabled="emailDisabled"
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
        <el-form-item
          label="默认登录项目"
          prop="openProjectByDefaultId"
          size="small"
        >
          <el-select
            v-model="accountForm.openProjectByDefaultId"
            placeholder="请选择"
          >
            <el-option
              v-for="item in openProjectByDefaultIdList"
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
          <el-table-column prop="userName" label="用户名" />
          <el-table-column
            prop="projectsSts"
            label="项目"
            :show-overflow-tooltip="true"
          />
          <el-table-column prop="registerDate" label="注册日期" />
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
</template>

<script>
  import {
    getUserRoles,
    querySubUsers,
  } from '@/api/admincenter'
  export default {
    name: 'UserPage',
    props: {
      accountProject: Array,
      tableHeader: Object,
    },
    data(){
      return {
        accountData: [],
        accountTotal: 0,
        accountQuery: {
          pageNum: 1,
          pageSize: 10
        },
        accountRoleOption: [],
        openProjectByDefaultIdList: [],
        accountForm: {
          id: undefined,
          email: undefined,
          userName: undefined,
          password: undefined,
          sysRoleId: undefined,
          projectIdStr: [],
          openProjectByDefaultId: ''
        },
        accountRules: {
          email: [
            { required: true, message: '请输入用户名', trigger: 'blur' },
            {
              type: 'email',
              message: '请输入正确的邮箱地址',
              trigger: ['blur', 'blur']
            }
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
          ],
          openProjectByDefaultId: [
            { required: true, message: '请选择默认登录项目', trigger: 'change' }
          ]
        },
        accountUpdate: true,
        emailDisabled: false,
        accountSelection: [], // 选择的表格
        accountSingle: true, // 非单个禁用
        accountMultiple: true, // 非多个禁用

      }
    },
    mounted() {
      //this.init();
    },
    methods: {
      init(){
        getUserRoles().then((res) => {
          this.accountRoleOption = res.data
        })
        this.getquerySubUsers()
      },
      // 得到账户列表
      getquerySubUsers() {
        return new Promise((resolve, reject) => {
          querySubUsers(this.accountQuery).then((res) => {
            if (res.code === "200") {
              this.accountData = res.data;
              this.accountTotal = res.total;
              // console.log(res.data)
              this.accountData.forEach((item) => {
                item.isSelect = false;
              });
              console.log(this.accountData);
              resolve(res);
            }
          });
        });
      },
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            if (this.accountForm.id) {
              //
              // const param = formatChangedPara(
              //   this.accountTempForm,
              //   this.accountForm
              // )
              const param = this.accountForm;
              if (param.projectIdStr && param.projectIdStr != 0) {
                param.projectIdStr = param.projectIdStr.join(",");
              } else {
                const projectIdArr = [];
                Object.values(this.accountProject).forEach((val) => {
                  if (val.id != 0) {
                    projectIdArr.push(val.id);
                  }
                });
                param.projectIdStr = projectIdArr.join(",");
              }
              updateSubUser(param).then((res) => {
                message("success", res.msg);
                this.resetAccountForm();
                this.$refs.accountData.clearSelection();
                this.accountUpdate = true;
                this.getquerySubUsers();
              });
            } else {
              var form = JSON.parse(JSON.stringify(this.accountForm));
              if (form.projectIdStr && form.projectIdStr != 0) {
                form.projectIdStr = form.projectIdStr.join(",");
              } else {
                const projectIdArr = [];
                Object.values(this.accountProject).forEach((val) => {
                  if (val.id != 0) {
                    projectIdArr.push(val.id);
                  }
                });
                form.projectIdStr = projectIdArr.join(",");
              }
              // form.projectIdStr = form.projectIdStr.join(',')
              createSubUser(form).then((res) => {
                if (res.code !== "200") {
                  return;
                }
                message("success", res.msg);
                this.resetAccountForm();
                this.getquerySubUsers();
              });
            }
          } else {
            console.log("error submit!!");
            return false;
          }
        });
      },
      // 重置
      resetAccountForm() {
        this.emailDisabled = false;
        this.accountForm = {
          id: undefined,
          email: undefined,
          userName: undefined,
          password: undefined,
          sysRoleId: undefined,
          openProjectByDefaultId: "",
          projectIdStr: [],
        };
        this.openProjectByDefaultIdList = [];
        this.$refs["accountForm"].resetFields();
      },
      async accountRefresh() {
        const res = await this.getquerySubUsers();
        if (res.code === "200") {
          this.accountUpdate = true;
          this.resetAccountForm();
          message("success", "刷新成功");
        }
      },
      // 项目互斥
      accountChangePro(val) {
        const that = this
        const index = val.indexOf('0')
        if (index !== -1) {
          that.accountForm.projectIdStr = ['0']
        }
        if (that.accountForm.projectIdStr[0] === '0') {
          /* eslint-disable */
          that.openProjectByDefaultIdList = _.cloneDeep(that.accountProject);
          that.openProjectByDefaultIdList.splice(0, 1);
          return;
        }
        that.openProjectByDefaultIdList = that.accountProject.filter((item) => {
          return that.accountForm.projectIdStr.indexOf(item.id) !== -1;
        });
        const arr = that.openProjectByDefaultIdList.filter((item) => {
          return item.id === that.accountForm.openProjectByDefaultId;
        });
        if (arr.length === 0) {
          that.accountForm.openProjectByDefaultId = "";
        }
      },
      // 行点击编辑
      accountEdit(row) {
        // debugger
        console.log(row, "rowrow");
        row.isSelect = !row.isSelect;
        this.emailDisabled = true;
        this.userinfo = row;
        this.openProjectByDefaultIdList = [];
        this.$refs.accountData.clearSelection();
        this.$refs.accountData.toggleRowSelection(row);
        const form = JSON.parse(JSON.stringify(row));
        form.projectIdStr = form.projectIdStr.split(",");
        form.sysRoleId = String(form.sysRoleId);
        for (var x in this.accountForm) {
          this.accountForm[x] = form[x];
        }
        this.accountTempForm = Object.assign({}, this.accountForm);
        this.accountUpdate = false;
        if (form.projectIdStr[0] === "0") {
          this.openProjectByDefaultIdList = _.cloneDeep(this.accountProject);
          this.openProjectByDefaultIdList.splice(0, 1);
          return;
        }
        this.openProjectByDefaultIdList = this.accountProject.filter((item) => {
          return form.projectIdStr.indexOf(item.id) !== -1;
        });
      },
      accountSelectionChange(val) {
        console.log(val, "===1");
        this.accountSelection = val;
        this.accountMultiple = !val.length;
        this.accountSingle = val.length !== 1;
        //if (this.accountSingle) {
        //  this.resetAccountForm()
        //  this.accountUpdate = true
        // }
      },
      // 删除
      accountDel(val) {
        this.$confirm("是否确认删除数据项?", "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        })
          .then(() => {
            deleteSubUser(val.id).then((res) => {
              if (res.code === "200") {
                this.getquerySubUsers();
                message("success", "删除成功");
                this.resetAccountForm();
              }
            });
          })
          .catch(function () {});
      },
      // 取消修改
      cancelUpdate() {
        this.$refs.accountData.clearSelection();
        this.accountUpdate = true;
        this.resetAccountForm();
      },

      // 权限
      accountJurisdiction() {
        // this.jurisdictionAccountId = ''
        this.activeName = "1";
        this.jurisdictionAccount = this.accountSelection[0];
        console.log(this.jurisdictionAccount, this.userinfo, "=======111");
      },
    }
  }
</script>

<style lang="scss">
@import "@/styles/mixin.scss"; //颜色
@import "@/styles/color.scss"; //按钮
//标签页切换样式
.el-tabs {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
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
  .el-tabs__content {
    flex: 1;
    width: 100%;
    overflow: hidden;
    .el-tab-pane {
      width: 100%;
      height: 100%;
      overflow: hidden;
    }
  }
}
</style>
<style lang="scss" scoped>
@import "@/views/adminCenter/index.scss";
// @import "field.scss";
</style>
<style lang="scss">
.admin-center {
  width: 100%;
  height: calc(100vh - 61px);
  box-sizing: border-box;
  padding: 20px;
  overflow: hidden;
  .el-form-item .el-form-item__label {
    padding-right: 8px;
  }
  .demo-ruleForm {
    .el-form-item__label {
      //width: 110px!important;
    }
    .el-form-item__content {
      //margin-left: 110px!important;
    }
  }
}
</style>
