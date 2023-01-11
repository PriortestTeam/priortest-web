<template>
  <div class="navbar">
    <div class="one_logo">
      <img src="@/icons/img/one-logo.png" alt="" srcset="" @click="gohome">
    </div>
    <div class="nav-menu">
      <el-menu
        :default-active="activeIndex"
        active-text-color="#409EFF"
        mode="horizontal"
        @select="menuSelect"
      >
        <el-menu-item
          v-for="(item, i) in menuList"
          :key="i"
          :index="item.index"
        >{{
          item.index === "Project"
            ? item.name
            : $t(`lang.menuTitle.${item.name}`)
        }}</el-menu-item>
      </el-menu>
    </div>
    <div class="user-menu">
      <div class="search-menu">
        <el-input
          v-model="Idsearch"
          size="mini"
          placeholder="id/text"
          style="width: 240px"
        >
          <i slot="prefix" class="el-input__icon el-icon-search" />
        </el-input>
      </div>
      <div class="lan-menu">
        <el-dropdown>
          <el-button type="text">语言切换</el-button>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item> 中文 </el-dropdown-item>
            <el-dropdown-item> English </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
      <div class="info-menu">
        <el-dropdown>
          <el-avatar icon="el-icon-user-solid" :size="40" />
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item>
              <div @click="menuSelect('Admincenter')">
                <img class="user-avatar" :src="userInfo.photo">
                个人中心
              </div>
            </el-dropdown-item>
            <el-dropdown-item style="color: #f56c6c">
              <div @click="logout">
                <svg-icon icon-class="tuichu" class="tuichu" />
                退出
              </div>
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { message } from '@/utils/common'
export default {
  data () {
    return {
      menuList: [
       {
              index: 'Welcome',
              name: 'Welcome'
            },
            {
        index: 'Project',
        name: ''
      }, {
        index: 'Feature',
        name: 'Feature'
      }, {
        index: 'Sprint',
        name: 'Sprint'
      }, {
        index: 'Testcase',
        name: 'TestCase'
      }, {
        index: 'Testcycle',
        name: 'TestCycle'
      }, {
        index: 'Issue',
        name: 'Issue'
      }, {
        index: 'Signoff',
        name: 'SignOff'
      }],
      Idsearch: '',
      projectName: '',
      activeIndex: '',
      userinfo: {},
      clickItem: [
        '项目',
        'Feature',
        'Sprint',
        'Testcase',
        'Testcycle',
        'Issue',
        'Signoff'
      ]
    }
  },
  computed: {
    ...mapGetters([
      'sidebar',
      {
        isCollapse: (state) => state.tab.isCollapse,
        lang: (state) => state.header.lang
        // navName: state => state.common.nvaName
      }
    ]),
    userInfo () {
      return this.$store.state.user.userinfo
    }
  },
  watch: {
    userInfo: function (newVal, oldVal) {
      if (newVal.userUseOpenProject) {
        this.menuList[1].name = newVal.userUseOpenProject.title
      }
    }
  },
  mounted () {
    this.menuList[1].name = this.userInfo.userUseOpenProject.title
    if (window.localStorage.currentMenu) {
      this.activeIndex = window.localStorage.currentMenu
      if (this.activeIndex === 'Project') {
        this.$router.push({ name: 'Project' })
      } else {
        this.$router.push({ name: this.activeIndex })
      }
    } else {
      this.activeIndex = 'Project'
      this.$router.push({ name: 'Project' })
    }
  },
  methods: {
    // 菜单切换事件
    menuSelect (name) {
      const index = this.menuList.findIndex(v => v.index === name)
      window.localStorage.setItem('currentMenu', name)
      if (name === 'Project') {
        this.$router.push({ name: 'Project' })
      } else if (index < 0) {
        window.localStorage.removeItem('currentMenu')
        this.activeIndex = ''
        this.$router.push({ name })
      } else {
        this.$router.push({ name })
      }
    },
    toggleSideBar () {
      this.$store.dispatch('app/toggleSideBar')
    },
    async logout () {
      this.remove('activeIndex')
      await this.$store.dispatch('user/logout')
      sessionStorage.removeItem("projectId");
      this.$router.push(`/login?redirect=${this.$route.fullPath}`)
    },
    goOther (item, index) {
      this.$store.commit('common/setNavName', item)
      this.activeIndex = index
      this.set('activeIndex', index)
      if (index === 0) {
        this.$router.push({ name: 'Project' })
      } else if (!this.userInfo.userUseOpenProject.title) {
        message('error', '请选择项目')
      } else {
        this.$router.push({ name: item })
      }
    },
    gohome () {
      this.$router.push({ name: 'Dashboard' })
    },

    // 切换语言
    changeLang (command) {
      if (command === 'zh-CN') {
        this.$i18n.locale = 'zh-CN'
      }
      if (command === 'en-US') {
        this.$i18n.locale = 'en-US'
      }
      this.$store.dispatch('changeLang', command)
    }
  }
}
</script>

<style lang="scss" scoped>
@import "@/styles/color.scss";

.navbar {
  padding: 0 $spacing;
  box-sizing: border-box;
  overflow: hidden;
  position: relative;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
  display: flex;
  align-items: center;

  .nav-menu {
    flex: 1;
    height: 100%;
    margin: 0 30px;
  }

  .user-menu {
    width: 400px;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .right-menu {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    height: 46px;
    .user-avatar {
      cursor: pointer;
      width: 38px;
      height: 38px;
      border-radius: 25px;
    }
    .tuichu {
      font-size: 28px;
      color: #333;
      margin-left: 10px;
      cursor: pointer;
      margin-left: 20px;
    }
    .lang {
      margin-right: 20px;
    }
  }
  .one_title {
    display: flex;
    // border: 1px solid $tabcolorBG;
    border-radius: 23px;
    height: 46px;
    // background: $tabcolorBG;
    align-items: center;
    box-sizing: border-box;
    color: #2a344b;
    justify-content: space-between;
    > div {
      &:first-child {
        flex: 1;
        display: flex;
        justify-content: center;
        align-items: center;
      }
    }
    .item {
      height: 100%;
      padding: 0 15px;
      line-height: 44px;
      cursor: pointer;
      font-size: 14px;
      margin: 0 20px;
      &:hover {
        position: relative;
        &::after {
          position: absolute;
          bottom: -1px;
          left: 0;
          width: 100%;
          height: 2px;
          background: $tabcolorBG;
          content: "";
        }
      }
    }
    .active {
      background: #fff;
      color: $tabcolorBG;
      border-radius: 23px;
      // margin: 5px 0;
      position: relative;
      &::after {
        position: absolute;
        bottom: -1px;
        left: 0;
        width: 100%;
        height: 2px;
        background: $tabcolorBG;
        content: "";
      }
    }
    ::v-deep .el-input {
      width: 300px;
      margin-left: 30px;
      .el-input__inner {
        border-radius: 15px;
      }
    }
  }
  .one_logo {
    cursor: pointer;
    height: auto;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    & > img {
      height: 40px;
    }
  }
}
</style>
