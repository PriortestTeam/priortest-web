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
      Idsearch: '',
      itemIndex: '',
      clickItem: ['Project A', 'Feature', 'Sprint', 'TestCase', 'TestCycle', 'Issue', 'SignOff']
    }
  },
  computed: {
    ...mapGetters([
      'sidebar',
      'avatar'
    ])
  },
  mounted() {
    this.itemIndex = ''
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch('app/toggleSideBar')
    },
    async logout() {
      await this.$store.dispatch('user/logout')
      this.$router.push(`/login?redirect=${this.$route.fullPath}`)
    },
    goProject(index, item) {
      this.itemIndex = index
      if (item === 'Project A') {
        this.$router.push({ name: 'Project' })
        return
      }
      this.$router.push({ name: item })
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
    }
    // .item.active {
    //   background: #fff;
    //   color: $tabcolorBG;
    //   border-radius: 25px;
    // }
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
