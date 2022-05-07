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
            >{{ item.roleName }}账户</el-radio-button
          >
        </el-radio-group>
      </div>
      <div class="userTbale">
        <el-table
          :data="userList"
          height="100%"
          highlight-current-row
          @row-click="currentChange"
          tooltip-effect="light"
        >
          <el-table-column prop="userName" label="Name" show-overflow-tooltip />
          <el-table-column prop="email" label="Email" show-overflow-tooltip />
          <el-table-column prop="id" label="ID" show-overflow-tooltip />
          <el-table-column
            prop="roleDesc"
            label="Group"
            show-overflow-tooltip
          />
        </el-table>
      </div>
    </div>
    <div class="right">
      <div class="top-info">
        <el-select
          v-model="projectId"
          size="mini"
          placeholder="请选择项目"
          @change="changeProject"
          clearable
        >
          <el-option
            v-for="(item, index) in jurisdictionOptions"
            :key="index"
            :value="item.value + '-' + item.label"
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
import { message } from '@/utils/common'
import {
  getPermissions,
  updatePermissions,
  getUsers,
  getProjectList,
  rolelist
} from '@/api/admincenter'
import * as Api from '@/api/function'
export default {
  name: 'Jurisdiction',
  props: {
    userInfos: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      keys: 0,
      jurisdictionOptions: [],
      projectId: '',
      projectName: '',
      jurisdictionItem: [],
      jurisdictioninfo: {},
      isIndeterminate: true,
      checkAll: false,
      checkedCities: [],
      role: [],
      jurisdictionUpdate: {
        subUserDto: {
          id: ''
        },
        projectPermissions: []
      },
      userList: [],
      ids: [],
      roleName: '',
      roleId: '',
      userId: '',
      userName: '',
      modelList: [],
      functionList: [],
      loading: false,
      value: '',
      allFunList: [] //所有的功能
    }
  },
  created() {
    this.rolelists()
    this.chageName()
  },
  mounted() {
    this.getUserList(this.roleName)
    // console.log(this.userList)
    // console.log(this.userInfos)
  },
  methods: {
    chageName() {
      this.roleName = this.userInfos.roleName
    },
    // 当前用户选择改变
    currentChange(val) {
      this.jurisdictionOptions = []
      this.getUserList(val.roleName, val.id)
      this.$emit('userChange', val)
      this.roleId = val.roleId || val.sysRoleId
      this.roleName = val.roleName
      this.userName = val.userName
      this.userId = val.id
      this.projectId = ''
      this.modelList = []
    },
    roleChange(val) {
      // console.log(val)
      this.roleName = val
      this.getUserList(val)
    },
    async getUserList(type, id = '') {
      try {
        const res = await getUsers({ roleName: type })
        if (res.code === '200') {
          res.data.forEach((item, index) => {
            if (item.id === this.userInfos.id) {
              this.userInfos.roleDesc = item.roleDesc
              res.data.splice(index, 1)
              res.data.unshift(this.userInfos)
            }
          })
          this.userList = res.data
          this.getProjectList(id || this.userList[0].id)
          this.roleId = this.userList[0].sysRoleId
          this.userId = id || this.userList[0].id
          this.userName = this.userList[0].userName
        }
      } catch (err) {
        console.log(err)
      }
    },
    async getProjectList(userid) {
      try {
        const res = await getProjectList(userid)
        if (res.code === '200') {
          // console.log(res)
          this.ids = res.data.projectId.split(',')
          // console.log(this.ids)
          // this.jurisdictionOptions = []
          this.ids.forEach((item) => {
            this.getPermissions(item)
          })
        }
      } catch (err) {
        console.log(err)
      }
    },
    getPermissions(id) {
      getPermissions(id).then((res) => {
        let option = {
          label: '',
          value: ''
        }
        option.label = res.data.title
        option.value = id
        this.jurisdictionOptions.push(option)
      })
    },
    changeProject() {
      this.functionList = []
      this.modelList = []
      if (
        this.roleId == null ||
        this.roleId == undefined ||
        this.roleId == ''
      ) {
        this.$message.warning('无法获取用户角色，请先点击左侧用户')
        return
      }
      if (
        this.projectId === null ||
        this.projectId == undefined ||
        this.projectId == ''
      ) {
        this.$message.warning('项目id不能为空')
        return
      }
      if (
        this.userId == null ||
        this.userId == undefined ||
        this.userId == ''
      ) {
        this.$message.warning('无法获取用户id，请先点击左侧用户')
        return
      }
      this.loading = true
      Api.findRoleFunction({
        roleId: this.roleId,
        projectId: this.projectId.split('-')[0],
        userId: this.userId
      }).then((res) => {
        if (res.code === '200') {
          this.modelList = res.data[0].model
          if (this.modelList.length > 0) {
            this.modelList.forEach((item, index) => {
              this.allFunList.push(item.id)
              if (item.checked) {
                this.functionList.push(item.id)
              }
              if (item.children && item.children.length > 0) {
                item.children.forEach((subItem, index) => {
                  this.allFunList.push(subItem.id)
                  if (subItem.checked) {
                    this.functionList.push(subItem.id)
                  }
                })
              }
            })
          }
          this.loading = false
        } else {
          // this.$message.error(res.msg)
          this.loading = false
        }
      })

      // this.getPermissions(this.ids)
    },
    // formObj (item) {
    //   const temObj = {}
    //   temObj.projectId = this.projectId
    //   temObj.subUserId = this.id
    //   temObj.operationAuthId = item.id
    //   return temObj
    // },
    sureUpdate() {
      // this.jurisdictionUpdate.projectPermissions = []
      // this.jurisdictionItem.filter((item) => {
      //   if (item.isSelect === '1') {
      //     const obj = this.formObj(item)
      //     this.jurisdictionUpdate.projectPermissions.push(obj)
      //     if (item.childList.length > 0) {
      //       item.childList.filter((item1) => {
      //         if (item1.isSelect === '1') {
      //           const obj1 = this.formObj(item1)
      //           this.jurisdictionUpdate.projectPermissions.push(obj1)
      //         }
      //       })
      //     }
      //   }
      // })
      // updatePermissions(this.jurisdictionUpdate).then((res) => {
      //   if (res.code === '200') {
      //     message('success', '修改成功')
      //     this.getPermissions()
      //   }
      // })
      let params = {
        roleId: this.roleId,
        roleName: this.roleName,
        projectId: this.projectId.split('-')[0],
        projectName: this.projectId.split('-')[1],
        userId: this.userId,
        userName: this.userName,
        value: this.value,
        functionList: []
      }
      Api.saveRoleFunction(params).then((res) => {
        if (res.code === '200') {
          this.$message.success('权限修改成功')
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    rolelists() {
      rolelist().then((res) => {
        if (res.code === '200') {
          // console.log(res.data)
          this.role = res.data
        }
      })
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
      console.log('va', value)
      let modelLength = value.length
      this.checkAll = modelLength === this.allFunList.length
      this.isIndeterminate =
        modelLength > 0 && modelLength < this.allFunList.length
      let checkList = []
      if (value.length > 0) {
        value.forEach((item, index) => {
          checkList.push('[' + item + ']')
        })
        this.value = checkList.join('')
      }
    },
    handleCheckAllChange(val) {
      this.isIndeterminate = false
      this.functionList = val ? this.allFunList : []
      //全选中
      if (val == true) {
        this.functionList = this.allFunList
        let checkList = []
        if (this.functionList.length > 0) {
          this.functionList.forEach((item, index) => {
            checkList.push('[' + item + ']')
          })
          this.value = checkList.join('')
        }
      } else {
        this.value = []
      }

      console.log('value', this.value)
    }
  }
}
</script>

<style lang="scss" scoped>
@import 'index.scss';
@import '@/views/project/index.scss';
</style>
