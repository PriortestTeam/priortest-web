<template>
  <div>
    <div class="navbar">
      <img class="one_logo" src="@/icons/img/one-logo.png" alt="" srcset="">
      <div class="navbar-right">
        <img class="user-avatar" :src="userInfo.photo">
        <svg-icon icon-class="tuichu" class="tuichu" @click.native="logout" />
      </div>
    </div>
    <div class="table">
      <el-button type="text" @click="refresh">刷新</el-button>
      <el-button type="text" @click="addUser">新增</el-button>
      <!--      <el-button type="text" :disabled="dbfields" @click="deleteUser">批量删除</el-button>-->
      <el-table
        ref="accountData"
        v-loading="loading"
        :data="tableData"
        :header-cell-style="tableHeader"
        stripe
        style="width: 100%"
        @row-dblclick="userEdit"
        @selection-change="userSelectionChange"
      >
        <el-table-column type="selection" width="55" />
        <el-table-column prop="id" align="center" label="ID" width="170" />
        <el-table-column prop="email" align="center" label="邮箱" width="200" />
        <el-table-column prop="userName" align="center" label="用户名" />
        <el-table-column prop="status" align="center" label="状态">
          <template slot-scope="scope">
            <span v-if="scope.row.status==1">启用</span>
            <span v-if="scope.row.status==3">禁用</span>
          </template>
        </el-table-column>
        <el-table-column prop="registerDate" align="center" label="注册日期" width="180" />
        <el-table-column prop="contactNo" align="center" label="联系方式" />
        <el-table-column prop="company" align="center" label="企业" />
        <el-table-column prop="profession" align="center" label="职业" />
        <el-table-column prop="industry" align="center" label="行业" />
        <el-table-column prop="activeState" align="center" label="激活状态">
          <template slot-scope="scope">
            <span v-if="scope.row.activeState==1">试用中</span>
            <span v-if="scope.row.activeState==2"> 激活成功</span>
            <span v-if="scope.row.activeState==3">试用过期</span>
            <span v-if="scope.row.activeState==4">激活失败</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" fixed="right" width="120">
          <template slot-scope="scope">
            <span class="table-btn" @click.stop="userDel(scope.row)">删除</span>
            <el-divider direction="vertical" />
            <span class="table-btn" @click.stop="userEdit(scope.row)">编辑</span>
          </template>
        </el-table-column>
      </el-table>
      <!--      v-show="fieldsTotal > 0"-->
      <pagination
        v-show="fieldsTotal>=fieldsQuery.pageSize"
        :total="fieldsTotal"
        :page.sync="fieldsQuery.pageNum"
        :limit.sync="fieldsQuery.pageSize"
        @pagination="getQueryPlatformUser"
      />
      <!--      @pagination="getqueryCustomList"-->
    </div>
    <user-form ref="userForm" @ok="refresh" />
  </div>
</template>

<script>
import userForm from '@/views/manageUser/userForm'
import { getQueryPlatformUser, deletePlatformUser } from '@/api/manageUser'

export default {
  name: 'RegisterUser',
  components: { userForm },
  data() {
    return {
      loading: false,
      tableData: [],
      dbfields: true,
      selectData: [],
      tableHeader: {
        color: '#d4dce3',
        background: '#003d79'
      },
      fieldsTotal: 0,
      fieldsQuery: {
        pageNum: 1,
        pageSize: 10
      }
    }
  },
  computed: {
    userInfo() {
      return this.$store.state.user.userinfo
    }
  },
  created() {
    this.getQueryPlatformUser()
  },
  methods: {
    // 刷新
    refresh() {
      this.fieldsQuery.pageNum = 1
      this.getQueryPlatformUser()
    },
    // 新增用户
    addUser() {
      this.$refs.userForm.showModal()
      this.getQueryPlatformUser()
    },
    // 批量删除
    deleteUser() {
    },
    // 单个删除
    userDel(row) {
      this.$confirm('是否确认删除用户?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deletePlatformUser(row.id).then(res => {
          if (res.code === '200') {
            this.$message.success('用户删除成功')
            this.refresh()
          }
        })
      })
    },
    // 双击编辑用户
    userEdit(row) {
      console.log(row)
      this.$refs.userForm.editUser(row)
    },
    userSelectionChange(val) {
      this.selectData = val
      this.dbfields = !val.length
    },
    // 退出
    async logout() {
      this.remove('activeIndex')
      await this.$store.dispatch('user/logout')
      this.$router.push(`/login?redirect=${this.$route.fullPath}`)
    },
    getQueryPlatformUser() {
      this.loading = true
      getQueryPlatformUser(this.fieldsQuery).then(res => {
        if (res.code === '200') {
          this.tableData = res.data
          this.fieldsTotal = res.total
        }
      }).finally(_ => {
        this.loading = false
      })
    }
  }
}
</script>

<style scoped lang="scss">
@import "@/styles/color.scss";
@import "@/styles/mixin.scss"; //颜色

.navbar {
  padding: 0 $spacing;
  height: 46px;
  box-sizing: border-box;
  overflow: hidden;
  position: relative;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
  display: flex;
  align-items: center;
  justify-content: space-between;

  .one_logo {
    height: 42px;
  }

  .navbar-right {
    height: 46px;
    display: flex;
    align-items: center;
    justify-content: space-between;

    .user-avatar {
      width: 42px;
      height: 42px;
      border-radius: 50%;
    }

    .tuichu {
      font-size: 28px;
      color: #333;
      margin-left: 10px;
      cursor: pointer;
      margin-left: 20px;
    }
  }
}

.table {
  width: 100%;
  padding: 10px 20px;

  ::v-deep .el-table__row {
    cursor: pointer;
  }

  .table-btn {
    color: $btnbgcolor;
    padding: 0 3px;;
  }
}
</style>
