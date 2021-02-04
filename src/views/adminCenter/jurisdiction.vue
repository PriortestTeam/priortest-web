<template>
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
      <div class="top-info">
        <el-select
          v-model="projectId"
          size="mini"
          placeholder="请选择项目"
          @change="changeProject"
        >
          <el-option
            v-for="item in jurisdictionOptions"
            :key="item.id"
            :value="item.id"
            :label="item.title"
          />
        </el-select>
        <el-button type="text" @click="sureUpdate">确定修改</el-button>
      </div>
      <div class="juris-item">
        <div
          v-for="(item1, index1) in jurisdictionItem"
          :key="index1"
          class="project-item"
        >
          <div class="top">
            <el-checkbox
              v-model="item1.isSelect"
              true-label="1"
              false-label="0"
              @change="(checked) => allChange(checked, index1)"
            >{{ item1.markNameDesc }}</el-checkbox>
            <el-checkbox
              v-for="(item2, index2) in item1.childList"
              :key="index2"
              v-model="item2.isSelect"
              true-label="1"
              false-label="0"
              @change="(checked) => itemChange(checked, index1)"
            >
              {{ item2.markNameDesc }}</el-checkbox>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { message } from '@/utils/common'
import { getProjects, getPermissions, updatePermissions } from '@/api/admincenter'
export default {
  name: 'Jurisdiction',
  props: {
    id: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      jurisdictionOptions: [],
      projectId: '',
      jurisdictionItem: [],
      jurisdictioninfo: {},

      isIndeterminate: true,
      checkAll: [],
      checkedCities: [],
      jurisdictionUpdate: {
        subUserDto: {
          id: ''
        },
        projectPermissions: []
      }
    }
  },
  created() {
    if (this.id) {
      this.jurisdictionUpdate.subUserDto.id = this.id
      getProjects({ subUserId: this.id }).then(res => {
        this.jurisdictionOptions = res.data
        this.projectId = this.jurisdictionOptions[0].id
        this.getPermissions()
      })
    }
  },
  mounted() {

  },
  methods: {
    getPermissions() {
      getPermissions({ subUserId: this.id, projectId: this.projectId }).then(res => {
        this.jurisdictionItem = res.data.project.sysOperationAuthorities
        this.jurisdictioninfo = res.data.subUserDto
      })
    },
    changeProject() {
      this.getPermissions()
    },
    formObj(item) {
      const temObj = {}
      temObj.projectId = this.projectId
      temObj.subUserId = this.id
      temObj.operationAuthId = item.id
      return temObj
    },
    sureUpdate() {
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
    isAll(item) {
      var len = 0
      item.childList.filter(element => {
        if (element.isSelect === '1') {
          len = len + 1
        }
      })
      return len
    },
    allChange(checked, index) {
      if (checked === '1') {
        this.jurisdictionItem[index].childList.filter(item => {
          item.isSelect = '1'
        })
      } else if (checked === '0') {
        this.jurisdictionItem[index].childList.filter(item => {
          item.isSelect = '0'
        })
      }
    },
    itemChange(checked, index) {
      if (checked === '1') {
        this.jurisdictionItem[index].isSelect = '1'
      }
      const len1 = this.isAll(this.jurisdictionItem[index])
      if (len1 === 0) {
        this.jurisdictionItem[index].isSelect = '0'
      }
    }

  }
}

</script>

<style lang="scss" scoped>
@import "index.scss";
@import "@/views/project/index.scss";
</style>
