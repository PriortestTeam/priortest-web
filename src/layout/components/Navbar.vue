<template>
  <div class="navbar">
    <!-- 头部选择栏 -->
    <div class="one_logo" @click="gohome">
      <img src="../../icons/img/one-logo.png" alt="" srcset="">
    </div>
    <div class="one_title">
      <div @click="goProject">Project A</div>
      <div @click="goFeature">Feature</div>
      <div @click="goSprint">Sprint</div>
      <div @click="goTestCase">TestCase</div>
      <div @click="goTestCycle">TestCycle</div>
      <div @click="goIssue">Issue</div>
      <div @click="goSignOff">SignOff</div>
      <div>
        <el-input
          v-model="Idsearch"
          placeholder="id/text"
        >
          <i slot="prefix" class="el-input__icon el-icon-search" />
        </el-input>
      </div>
    </div>
    <div class="right-menu">
      <el-dropdown class="avatar-container" trigger="click">
        <div class="avatar-wrapper">
          <img :src="avatar+'?imageView2/1/w/80/h/80'" class="user-avatar">
          <i class="el-icon-caret-bottom" />
        </div>
        <el-dropdown-menu slot="dropdown" class="user-dropdown">
          <router-link to="/">
            <el-dropdown-item>
              Home
            </el-dropdown-item>
          </router-link>
          <el-dropdown-item divided @click.native="logout">
            <span style="display:block;">退出</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  components: {
    // Breadcrumb,
    // Hamburger
  },
  data() {
    return {
      Idsearch: ''
    }
  },
  computed: {
    ...mapGetters([
      'sidebar',
      'avatar'
    ])
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch('app/toggleSideBar')
    },
    async logout() {
      await this.$store.dispatch('user/logout')
      this.$router.push(`/login?redirect=${this.$route.fullPath}`)
    },
    // goAll
    goFeature() {
      this.$router.push({ name: 'Feature' })
    },
    goSprint() {
      this.$router.push({ name: 'Sprint' })
    },
    goTestCase() {
      this.$router.push({ name: 'TestCase' })
    },
    goTestCycle() {
      this.$router.push({ name: 'TestCycle' })
    },
    goIssue() {
      this.$router.push({ name: 'Issue' })
    },
    goSignOff() {
      this.$router.push({ name: 'SignOff' })
    },
    goProject() {
      this.$router.push({ name: 'Project' })
    },
    gohome() {
      this.$router.push({ name: 'Dashboard' })
    }

  }
}
</script>

<style lang="scss" scoped>
@import "@/styles/color.scss";
.navbar {
  height: 80px;
  overflow: hidden;
  position: relative;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0,21,41,.08);
  display: flex;
  justify-content: space-between;
  align-items: center;
  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background .3s;
    -webkit-tap-highlight-color:transparent;

    &:hover {
      background: rgba(0, 0, 0, .025)
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .right-menu {
    width: 5%;
    // float: right;
    // height: 100%;
    // line-height: 50px;

    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background .3s;

        &:hover {
          background: rgba(0, 0, 0, .025)
        }
      }
    }

    .avatar-container {
      margin-right: 30px;

      .avatar-wrapper {
        margin-top: 5px;
        position: relative;

        .user-avatar {
          cursor: pointer;
          width: 40px;
          height: 40px;
          border-radius: 10px;
        }

        .el-icon-caret-bottom {
          cursor: pointer;
          position: absolute;
          right: -20px;
          top: 25px;
          font-size: 12px;
        }
      }
    }
  }
  .one_title{
    width: 80%;
    display: flex;
    border: 1px solid $tabcolorBG;
    border-radius: 25px;
    background: $tabcolorBG;
    justify-content: flex-start;
    align-items: center;
    color: #d4dce3;
    div{
      box-sizing: border-box;
      padding: 5px 15px;
      cursor: pointer;
    }
    ::v-deep .el-input{
      .el-input__inner{
      height: 25px;
      border-radius: 15px;
    }
    .el-input__prefix{
      left: 22px;
    }
    }
  }
  .one_logo{
    width: 10%;
    cursor: pointer;
    margin: 0 -20px 0 15px;
  }
}
</style>
