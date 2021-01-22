<template>
  <div class="navbar">
    <el-row>
      <el-col :span="3">
        <!-- 头部选择栏 -->
        <img
          class="one_logo"
          src="@/icons/img/one-logo.png"
          alt=""
          srcset=""
          @click="gohome"
        />
      </el-col>
      <el-col :span="17">
        <div class="one_title">
          <div class="item" @click="goProject">{{ projectName }}</div>
          <div
            v-for="(item, index) in clickItem"
            :key="index"
            class="item"
            @click="goOther(item)"
          >
            {{
              index === 0
                ? $t("lang.menuTitle.Feature")
                : index === 1
                ? $t("lang.menuTitle.Sprint")
                : index === 2
                ? $t("lang.menuTitle.TestCase")
                : index === 3
                ? $t("lang.menuTitle.TestCycle")
                : index === 4
                ? $t("lang.menuTitle.Issue")
                : index === 5
                ? $t("lang.menuTitle.SignOff")
                : ""
            }}
          </div>
          <el-input v-model="Idsearch" size="mini" placeholder="id/text">
            <i slot="prefix" class="el-input__icon el-icon-search" />
          </el-input></div
      ></el-col>
      <el-col :span="4">
        <div class="right-menu">
          <div v-if="false" class="lang">
            <el-dropdown :hide-on-click="false" @command="changeLang">
              <span class="el-dropdown-link"
                >{{ $t("lang.custom.name")
                }}<i class="el-icon-arrow-down el-icon--right"
              /></span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="zh-CN">{{
                  $t("lang.chinese")
                }}</el-dropdown-item>
                <el-dropdown-item command="en-US">{{
                  $t("lang.engLish")
                }}</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
          <router-link to="/admincenter/admincenter">
            <img class="user-avatar" :src="userInfo.photo" />
          </router-link>

          <svg-icon icon-class="tuichu" class="tuichu" @click.native="logout" />
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { queryForProjects } from '@/api/project'

export default {

  data() {
    return {
      Idsearch: '',
      projectName: '项目',
      userinfo: {},
      clickItem: ['Feature', 'Sprint', 'TestCase', 'TestCycle', 'Issue', 'SignOff']
    }
  },
  computed: {
    ...mapGetters(
      ['sidebar',
        {
          isCollapse: state => state.tab.isCollapse,
          lang: state => state.header.lang
        }]
    ),
    userInfo() {
      return this.$store.state.user.userinfo
    }
  },
  created() {
  },
  watch: {
    'userInfo': function (newVal, oldVal) {
      this.projectName = newVal.userUseOpenProject.title
    }
  },
  mounted() {
    console.log(this.userInfo)
    if (this.userInfo.userUseOpenProject.title) {
      this.projectName = this.userInfo.userUseOpenProject.title
    }
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch('app/toggleSideBar')
    },
    async logout() {
      await this.$store.dispatch('user/logout')
      this.$router.push(`/login?redirect=${this.$route.fullPath}`)
    },
    goProject() {
      this.$router.push({ name: 'Project' })
    },
    goOther(item) {
      console.log(item)
      this.$router.push({ name: item })
    },
    gohome() {
      this.$router.push({ name: 'Dashboard' })
    },

    // 切换语言
    changeLang(command) {
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
  height: 46px;
  box-sizing: border-box;
  overflow: hidden;
  position: relative;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
  display: flex;
  align-items: center;
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
    border: 1px solid $tabcolorBG;
    border-radius: 23px;
    height: 46px;
    background: $tabcolorBG;
    align-items: center;
    box-sizing: border-box;
    color: $btnFontbgcolor;
    .item {
      height: 100%;
      padding: 0 15px;
      line-height: 44px;
      cursor: pointer;
      font-size: 14px;
    }

    ::v-deep .el-input {
      width: 25%;
      margin-left: 30px;
      .el-input__inner {
        border-radius: 15px;
      }
    }
  }
  .one_logo {
    cursor: pointer;
    width: 90%;
    height: auto;
    height: 46px;
  }
}
</style>
