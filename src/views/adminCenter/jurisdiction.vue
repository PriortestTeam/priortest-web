<template>
  <div class="tab-box tab-box1">
    <div class="left">
      <div>
        <el-radio-group v-model="roleName" size="mini" @change="roleChange">
          <el-radio-button
            v-for="item in role"
            :key="item.roleName"
            :label="item.roleName"
            border
            :name="item.roleName"
            >{{ item.roleName }}</el-radio-button
          >
        </el-radio-group>
      </div>
      <div class="userTbale">
        <el-table
          :data="userList"
          height="100%"
          :row-style="showRow"
          highlight-current-row
          @row-click="currentChange"
          tooltip-effect="light"
        >
          <el-table-column prop="userName" label="账号" show-overflow-tooltip />
          <el-table-column prop="email" label="邮箱" show-overflow-tooltip />
          <el-table-column prop="id" label="账号ID" show-overflow-tooltip />
          <el-table-column prop="roleDesc" label="角色" show-overflow-tooltip />
        </el-table>
      </div>
    </div>
    <div class="right">
      <div class="top-info">
        <el-select
          v-model="projectName"
          size="mini"
          placeholder="请选择项目"
          @change="changeProject"
          clearable
        >
          <el-option
            v-for="(item, index) in jurisdictionOptions"
            :key="index"
            :value="item"
            :label="item.label"
          />
        </el-select>
        <el-checkbox
          style="margin-left: 10px"
          :indeterminate="isIndeterminate"
          v-model="checkAll"
          @change="handleCheckAllChange"
          >全选</el-checkbox
        >
      </div>
      <div class="function" v-loading="loading">
        <div class="model" v-for="(item, index) in modelList" :key="index">
          <el-checkbox-group v-model="functionList" @change="updateChecked">
            <el-checkbox :label="item.id">{{ item.title }}</el-checkbox>
            <template v-if="item.children">
              <el-checkbox
                v-for="(subItem, subIndex) in item.children"
                v-model="subItem.checked"
                :label="subItem.id"
                :key="subIndex"
                >{{ subItem.title }}</el-checkbox
              >
            </template>
          </el-checkbox-group>
        </div>
      </div>
      <div style="text-align: center">
        <el-button type="text" @click="sureUpdate">确定修改</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import { message } from "@/utils/common";
import {
  getPermissions,
  updatePermissions,
  getUsers,
  getProjectList,
  rolelist,
} from "@/api/admincenter";
import * as Api from "@/api/function";
export default {
  name: "Jurisdiction",
  props: {
    userInfos: {
      type: Object,
      required: true,
    },
    jurisdictionAccount: {
      type: Object,
      default: null,
    },
  },
  data() {
    return {
      keys: 0,
      jurisdictionOptions: [],
      selectProject: {},
      projectName: "",
      jurisdictionItem: [],
      jurisdictioninfo: {},
      isIndeterminate: true,
      checkAll: false,
      checkedCities: [],
      role: [],
      jurisdictionUpdate: {
        subUserDto: {
          id: "",
        },
        projectPermissions: [],
      },
      userList: [],
      ids: [],
      roleName: "",
      roleId: "",
      userId: "",
      userName: "",
      modelList: [],
      functionList: [],
      loading: false,
      value: "",
      allFunList: [], //所有的功能
    };
  },
  created() {
    this.rolelists();
    this.chageName();
  },
  mounted() {
    this.roleName = this.jurisdictionAccount.roleName;
    if (this.jurisdictionAccount) {
      let projectId = this.jurisdictionAccount.openProjectByDefaultId;
      let projectName = this.jurisdictionAccount.openProjectByDefaultName;
      this.userId = this.jurisdictionAccount.id;
      console.log(this.userId, this.jurisdictionAccount, "====child");

      this.selectProject = {
        label: projectName,
        value: projectId,
      };
      this.projectName = projectName;
    }
    this.getUserList(this.roleName);
  },
  methods: {
    chageName() {
      this.roleName = this.userInfos.roleName;
    },
    // 当前用户选择改变
    async currentChange(val) {
      this.jurisdictionOptions = [];
      this.modelList = [];
      this.functionList = [];
      this.selectProject = {};
      this.roleId = val.roleId || val.sysRoleId;
      this.roleName = val.roleName;
      this.userId = val.id;
      this.projectName = "";
      await this.getUserList(val.roleName, val.id);
      // this.getRoleTree()
      // this.getUserList(val.roleName, val.id)
      this.$emit("userChange", val);
      this.userName = val.userName;
    },
    roleChange(val) {
      this.roleName = val;
      this.getUserList(val);
      this.projectName = "";
      this.selectProject = {};
      this.modelList = [];
      this.jurisdictionOptions = [];
    },
    async getUserList(type, id = "") {
      try {
        const res = await getUsers({ roleName: type });
        if (res.code === "200") {
          res.data.forEach((item, index) => {
            if (item.id === this.userInfos.id) {
              this.userInfos.roleDesc = item.roleDesc;
              res.data.splice(index, 1);
              res.data.unshift(this.userInfos);
            }
          });
          this.userList = res.data;
          if (this.userList.length > 0) {
            console.log(this.userList, "======userList");
            this.getProjectList(id || this.userList[0].id);
            this.roleId = this.userList[0].sysRoleId || this.userList[0].roleId;
            // this.userId = id || this.userList[0].id
            this.userName = this.userList[0].userName;
            console.log("user", this.userList[0]);
          }
        }
      } catch (err) {
        console.log(err);
      }
    },
    showRow({ row, rowIndwx }) {
      let styleJson = {};
      if (row.id == this.jurisdictionAccount.id) {
        styleJson = {
          color: "#4286CD",
        };
      }
      return styleJson;
    },
    async getProjectList(userid) {
      try {
        const res = await getProjectList(userid);
        if (res.code === "200") {
          // console.log(res)
          this.ids = res.data.projectId.split(",");
          // console.log(this.ids)
          // this.jurisdictionOptions = []
          this.ids.forEach((item) => {
            this.getPermissions(item);
          });
        }
      } catch (err) {
        console.log(err);
      }
    },
    getPermissions(id) {
      getPermissions(id).then((res) => {
        let option = {
          label: "",
          value: "",
        };
        option.label = res.data.title;
        option.value = id;
        this.jurisdictionOptions.push(option);
        if (!this.projectName && this.jurisdictionOptions.length) {
          this.projectName = this.jurisdictionOptions[0].label;
          this.selectProject = this.jurisdictionOptions[0];
        }
        if (this.projectName) this.getRoleTree();
      });
    },
    changeProject(item) {
      this.selectProject = item;
      this.projectName = item.label;
      this.functionList = [];
      this.modelList = [];
      if (
        this.roleId == null ||
        this.roleId == undefined ||
        this.roleId == ""
      ) {
        this.$message.warning("无法获取用户角色，请先点击左侧用户");
        return;
      }
      if (
        this.projectName === null ||
        this.projectName == undefined ||
        this.projectName == ""
      ) {
        this.$message.warning("项目id不能为空");
        return;
      }
      if (
        this.userId == null ||
        this.userId == undefined ||
        this.userId == ""
      ) {
        this.$message.warning("无法获取用户id，请先点击左侧用户");
        return;
      }
      this.getRoleTree();

      // this.getPermissions(this.ids)
    },
    getRoleTree() {
      console.log(this.userId, "========this.userId");
      this.loading = true;
      Api.findRoleFunction({
        roleId: this.roleId,
        projectId: this.selectProject.value,
        userId: this.userId,
      }).then((res) => {
        if (res.code === "200") {
          this.modelList = res.data[0].model;
          if (this.modelList.length > 0) {
            this.modelList.forEach((item, index) => {
              this.allFunList.push(item.id);
              if (item.checked) {
                this.functionList.push(item.id);
              }
              if (item.children && item.children.length > 0) {
                item.children.forEach((subItem, index) => {
                  this.allFunList.push(subItem.id);
                  if (subItem.checked) {
                    this.functionList.push(subItem.id);
                  }
                });
              }
            });
          }
          this.loading = false;
        } else {
          // this.$message.error(res.msg)
          this.loading = false;
        }
      });
    },
    sureUpdate() {
      let params = {
        roleId: this.roleId,
        roleName: this.roleName,
        projectId: this.selectProject.value,
        projectName: this.selectProject.label,
        userId: this.userId,
        userName: this.userName,
        value: this.value,
        functionList: [],
      };
      Api.saveRoleFunction(params).then((res) => {
        if (res.code === "200") {
          this.$message.success("权限修改成功");
        } else {
          this.$message.error(res.msg);
        }
      });
    },
    rolelists() {
      rolelist().then((res) => {
        if (res.code === "200") {
          // console.log(res.data)
          this.role = res.data;
        }
      });
    },
    // isAll (item) {
    //   var len = 0
    //   item.childList.filter(element => {
    //     if (element.isSelect === '1') {
    //       len = len + 1
    //     }
    //   })
    //   return len
    // },
    // allChange (checked, index) {
    //   if (checked === '1') {
    //     this.jurisdictionItem[index].childList.filter(item => {
    //       item.isSelect = '1'
    //     })
    //   } else if (checked === '0') {
    //     this.jurisdictionItem[index].childList.filter(item => {
    //       item.isSelect = '0'
    //     })
    //   }
    // },
    // itemChange (checked, index) {
    //   if (checked === '1') {
    //     this.jurisdictionItem[index].isSelect = '1'
    //   }
    //   const len1 = this.isAll(this.jurisdictionItem[index])
    //   if (len1 === 0) {
    //     this.jurisdictionItem[index].isSelect = '0'
    //   }
    // }
    updateChecked(value) {
      console.log("va", value);
      let modelLength = value.length;
      this.checkAll = modelLength === this.allFunList.length;
      this.isIndeterminate =
        modelLength > 0 && modelLength < this.allFunList.length;
      let checkList = [];
      if (value.length > 0) {
        value.forEach((item, index) => {
          checkList.push("[" + item + "]");
        });
        this.value = checkList.join("");
      }
    },
    handleCheckAllChange(val) {
      this.isIndeterminate = false;
      this.functionList = val ? this.allFunList : [];
      //全选中
      if (val == true) {
        this.functionList = this.allFunList;
        let checkList = [];
        if (this.functionList.length > 0) {
          this.functionList.forEach((item, index) => {
            checkList.push("[" + item + "]");
          });
          this.value = checkList.join("");
        }
      } else {
        this.value = [];
      }

      console.log("value", this.value);
    },
  },
};
</script>

<style lang="scss" scoped>
@import "index.scss";
@import "@/views/project/index.scss";
</style>
