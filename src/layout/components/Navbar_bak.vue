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
      <el-col :span="19">
        <div class="one_title">
          <div>
            <div
              v-for="(item, index) in clickItem"
              :key="index"
              :class="['item', index == activeIndex ? 'active' : '']"
              @click="goOther(item, index)"
            >
              {{
                index === 0
                  ? item
                  : index === 1
                  ? $t("lang.menuTitle.Feature")
                  : index === 2
                  ? $t("lang.menuTitle.Sprint")
                  : index === 3
                  ? $t("lang.menuTitle.TestCase")
                  : index === 4
                  ? $t("lang.menuTitle.TestCycle")
                  : index === 5
                  ? $t("lang.menuTitle.Issue")
                  : index === 6
                  ? $t("lang.menuTitle.SignOff")
                  : ""
              }}
            </div>
          </div>

          <div>
            <el-input v-model="Idsearch" size="mini" placeholder="id/text">
              <i slot="prefix" class="el-input__icon el-icon-search" />
            </el-input>
          </div>
        </div>
      </el-col>
      <el-col :span="2">
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
import { mapGetters } from "vuex";
import { message } from "@/utils/common";
export default {
  data() {
    return {
      Idsearch: "",
      projectName: "",
      activeIndex: 99,
      userinfo: {},
      clickItem: [
        "项目",
        "Feature",
        "Sprint",
        "Testcase",
        "Testcycle",
        "Issue",
        "Signoff",
      ],
    };
  },
  computed: {
    ...mapGetters([
      "sidebar",
      {
        isCollapse: (state) => state.tab.isCollapse,
        lang: (state) => state.header.lang,
        //navName: state => state.common.nvaName
      },
    ]),
    userInfo() {
      return this.$store.state.user.userinfo;
    },
  },
  watch: {
    userInfo: function (newVal, oldVal) {
      if (newVal.userUseOpenProject) {
        this.clickItem[0] = newVal.userUseOpenProject.title;
      }
    },
  },
  created() {
    if (this.userInfo.userUseOpenProject.title) {
      this.clickItem[0] = this.userInfo.userUseOpenProject.title;
    }
    if (this.get("activeIndex")) {
      this.activeIndex = this.get("activeIndex");
    } else {
      this.activeIndex == 99;
    }
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch("app/toggleSideBar");
    },
    async logout() {
      this.remove("activeIndex");
      await this.$store.dispatch("user/logout");
      this.$router.push(`/login?redirect=${this.$route.fullPath}`);
    },
    goOther(item, index) {
      this.$store.commit('common/setNavName', item)
      this.activeIndex = index;
      this.set("activeIndex", index);
      if (index === 0) {
        this.$router.push({ name: "Project" });
      } else if (!this.userInfo.userUseOpenProject.title) {
        message("error", "请选择项目");
      } else {
        this.$router.push({ name: item });
      }
    },
    gohome() {
      this.$router.push({ name: "Dashboard" });
    },

    // 切换语言
    changeLang(command) {
      if (command === "zh-CN") {
        this.$i18n.locale = "zh-CN";
      }
      if (command === "en-US") {
        this.$i18n.locale = "en-US";
      }
      this.$store.dispatch("changeLang", command);
    },
  },
};
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
    // border: 1px solid $tabcolorBG;
    border-radius: 23px;
    height: 46px;
    // background: $tabcolorBG;
    align-items: center;
    box-sizing: border-box;
    color: #2a344b;
    justify-content: space-between;
    >div {
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
      &:hover{
          position: relative;
      &::after{
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
      &::after{
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
    width: 90%;
    height: auto;
    height: 46px;
  }
}
</style>
