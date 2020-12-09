<template>
  <div class="navbar">
<<<<<<< HEAD
    <el-row>
      <el-col :span="3">
        <!-- 头部选择栏 -->
        <img
          class="one_logo"
          @click="gohome"
          src="../../icons/img/one-logo.png"
          alt=""
          srcset=""
        />
      </el-col>
      <el-col :span="19">
        <div class="one_title">
          <div
            :class="['item', itemIndex === index ? 'active' : '']"
            v-for="(item, index) in clickItem"
            :key="index"
            @click="goProject(index, item)"
          >
            {{ item }}
          </div>
          <el-input v-model="Idsearch" size="mini" placeholder="id/text">
            <i slot="prefix" class="el-input__icon el-icon-search" />
          </el-input></div
      ></el-col>
      <el-col :span="2">
        <div class="right-menu">
          <img class="user-avatar" :src="avatar + '?imageView2/1/w/80/h/80'" />
          <svg-icon
            icon-class="tuichu"
            @click.native="logout"
            class="tuichu"
          /></div
      ></el-col>
    </el-row>
=======
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
      <div class="avatar-wrapper">
        <img :src="avatar+'?imageView2/1/w/80/h/80'" class="user-avatar">
        <!-- <i class="el-icon-caret-bottom" /> -->
      </div>
      <div @click.native="logout"> <svg-icon icon-class="tuichu" class="tuichu" /></div>
      <!-- <el-dropdown class="avatar-container" trigger="click">
        <el-dropdown-item divided @click.native="logout" />
        <el-dropdown-menu slot="dropdown" class="user-dropdown">
          <router-link to="/">
            <el-dropdown-item>
              Home
            </el-dropdown-item>
          </router-link>
        </el-dropdown-menu>
      </el-dropdown> -->
    </div>
>>>>>>> parent of f8a04f0... 修改
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
<<<<<<< HEAD
=======
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
>>>>>>> parent of f8a04f0... 修改
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
<<<<<<< HEAD
  justify-content: space-between;
=======
  justify-content: space-evenly;
>>>>>>> parent of f8a04f0... 修改
  align-items: center;
  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
<<<<<<< HEAD
    transition: background 0.3s;
    -webkit-tap-highlight-color: transparent;

    &:hover {
      background: rgba(0, 0, 0, 0.025);
=======
    transition: background .3s;
    -webkit-tap-highlight-color:transparent;

    &:hover {
      background: rgba(0, 0, 0, .025)
>>>>>>> parent of f8a04f0... 修改
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .right-menu {
<<<<<<< HEAD
    width: 5%;
    // float: right;
    // height: 100%;
    // line-height: 50px;

    &:focus {
      outline: none;
    }

=======
    // width: 5%;
    // float: right;
    // height: 100%;
    // line-height: 50px;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    .avatar-wrapper{
        margin-top: 5px;
        position: relative;

        .user-avatar {
          cursor: pointer;
          width: 45px;
          height: 45px;
          border-radius: 25px;
        }
    }
    &:focus {
      outline: none;
    }
.tuichu{
  font-size: 28px;
  color: #333;
  margin-left: 10px;
  cursor: pointer;
}
>>>>>>> parent of f8a04f0... 修改
    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
<<<<<<< HEAD
        transition: background 0.3s;

        &:hover {
          background: rgba(0, 0, 0, 0.025);
=======
        transition: background .3s;

        &:hover {
          background: rgba(0, 0, 0, .025)
>>>>>>> parent of f8a04f0... 修改
        }
      }
    }

    .avatar-container {
      margin-right: 30px;

<<<<<<< HEAD
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
  .one_title {
    width: 85%;
=======
      // .avatar-wrapper {
      //   margin-top: 5px;
      //   position: relative;

      //   .user-avatar {
      //     cursor: pointer;
      //     width: 40px;
      //     height: 40px;
      //     border-radius: 10px;
      //   }

      //   .el-icon-caret-bottom {
      //     cursor: pointer;
      //     position: absolute;
      //     right: -20px;
      //     top: 25px;
      //     font-size: 12px;
      //   }
      // }
    }
  }
  .one_title{
    width: 80%;
>>>>>>> parent of f8a04f0... 修改
    display: flex;
    border: 1px solid $tabcolorBG;
    border-radius: 25px;
    background: $tabcolorBG;
    justify-content: flex-start;
    align-items: center;
<<<<<<< HEAD
    color: #d4dce3;
    div {
      box-sizing: border-box;
      padding: 5px 20px;
      cursor: pointer;
    }
    ::v-deep .el-input {
      .el-input__inner {
        height: 25px;
        border-radius: 15px;
      }
      .el-input__prefix {
        left: 22px;
      }
    }
  }
  .one_logo {
    width: 10%;
=======
    color: $btnFontbgcolor;
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
>>>>>>> parent of f8a04f0... 修改
  }
}
</style>
