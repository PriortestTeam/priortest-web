<template>
  <div class="navbar">
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
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
  display: flex;
  justify-content: space-between;
  align-items: center;
  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background 0.3s;
    -webkit-tap-highlight-color: transparent;

    &:hover {
      background: rgba(0, 0, 0, 0.025);
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
        transition: background 0.3s;

        &:hover {
          background: rgba(0, 0, 0, 0.025);
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
  .one_title {
    width: 85%;
    display: flex;
    border: 1px solid $tabcolorBG;
    border-radius: 25px;
    background: $tabcolorBG;
    justify-content: flex-start;
    align-items: center;
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
  }
}
</style>
