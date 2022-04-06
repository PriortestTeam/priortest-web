<template>
  <div class="tab-box tab-box1">
    <div class="left">
      <div>
        <el-radio-group v-model="roleName" size="mini" @change="roleChange">
          <el-radio-button v-for="item in role" :key="item.roleName" :label="item.roleName" border :name="item.roleName">{{ item.roleName }}账户</el-radio-button>
        </el-radio-group>
      </div>
      <div class="userTbale">
        <el-table :data="userList" height="100%" highlight-current-row @row-click="currentChange">
          <el-table-column prop="userName" label="Name" />
          <el-table-column prop="email" label="Email" />
          <el-table-column prop="id" label="ID" />
          <el-table-column prop="roleDesc" label="Group" />
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
        >
          <el-option
            v-for="(item, index) in jurisdictionOptions"
            :key="index"
            :value="item"
            :label="item"
          />
        </el-select>
        <el-button type="text" @click="sureUpdate">确定修改</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import { message } from '@/utils/common'
import { getPermissions, updatePermissions, getUsers, getProjectList, rolelist } from '@/api/admincenter'
export default {
  name: 'Jurisdiction',
  props: {
    userInfos: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      keys: 0,
      jurisdictionOptions: [],
      projectId: '',
      jurisdictionItem: [],
      jurisdictioninfo: {},
      isIndeterminate: true,
      checkAll: [],
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
      roleName: ''
    }
  },
  created () {
    this.rolelists()
    this.chageName()
  },
  mounted () {
    this.getUserList(this.roleName)
    // console.log(this.userList)
    // console.log(this.userInfos)
  },
  methods: {
    chageName () {
      this.roleName = this.userInfos.roleName
    },
    // 当前用户选择改变
    currentChange (val) {
      console.log(val.id)
      this.getUserList(val.roleName, val.id)
      this.$emit('userChange', val)
    },
    roleChange (val) {
      // console.log(val)
      this.roleName = val
      this.getUserList(val)
    },
    async getUserList (type, id = '') {
      try {
        const res = await getUsers({ roleName: type })
        if (res.code === '200') {
          console.log(type)
          res.data.forEach((item, index) => {
            console.log(item.id === this.userInfos.id)
            if (item.id === this.userInfos.id) {
              this.userInfos.roleDesc = item.roleDesc
              res.data.splice(index, 1)
              res.data.unshift(this.userInfos)
            }
          })
          this.userList = res.data
          console.log(this.userList)
          this.getProjectList(id || this.userList[0].id)
        }
      } catch (err) {
        console.log(err)
      }
    },
    async getProjectList (userid) {
      try {
        const res = await getProjectList(userid)
        if (res.code === '200') {
          // console.log(res)
          this.ids = res.data.projectId.split(',')
          // console.log(this.ids)
          this.jurisdictionOptions = []
          this.ids.forEach(item => {
            this.getPermissions(item)
          })
        }
      } catch (err) {
        console.log(err)
      }
    },
    getPermissions (id) {
      getPermissions(id).then(res => {
        this.jurisdictionOptions.push(res.data.title)
      })
    },
    changeProject () {
      this.getPermissions(this.ids)
    },
    // formObj (item) {
    //   const temObj = {}
    //   temObj.projectId = this.projectId
    //   temObj.subUserId = this.id
    //   temObj.operationAuthId = item.id
    //   return temObj
    // },
    sureUpdate () {
      this.jurisdictionUpdate.projectPermissions = []
      this.jurisdictionItem.filter(item => {
        if (item.isSelect === '1') {
          const obj = this.formObj(item)
          this.jurisdictionUpdate.projectPermissions.push(obj)
          if (item.childList.length > 0) {
            item.childList.filter(item1 => {
              if (item1.isSelect === '1') {
                const obj1 = this.formObj(item1)
                this.jurisdictionUpdate.projectPermissions.push(obj1)
              }
            })
          }
        }
      })
      updatePermissions(this.jurisdictionUpdate).then(res => {
        if (res.code === '200') {
          message('success', '修改成功')
          this.getPermissions()
        }
      })
    },
    rolelists () {
      rolelist().then(res => {
        if (res.code === '200') {
          // console.log(res.data)
          this.role = res.data
        }
      })
    }
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
  }
}

</script>

<style lang="scss" scoped>
@import "index.scss";
@import "@/views/project/index.scss";
</style>
