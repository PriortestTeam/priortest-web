<template>
  <div class="login-container">
    <el-form ref="loginForm" class="login-form" label-position="left" label-width="80px" :rules="loginRules" :model="loginForm">
      <div class="one-logo">
        <img src="@/icons/img/one-logo.png" alt="" srcset="">
      </div>
      <el-form-item prop="username" label="邮箱">
        <el-input v-model="loginForm.username" />
      </el-form-item>
      <el-form-item prop="password" label="密码">
        <el-input v-model="loginForm.password" />
      </el-form-item>
      <el-form-item>
        <div class="btnForget">
          <el-button type="primary"  @click="handleLogin('loginForm')">Register</el-button>
        </div>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>

export default {
  name: 'Register',
  data () {
    return {
      loginForm: {
        username: 'admin',
        password: '111111'
      },
      loginRules: {
        username: [
          { required: true, message: '请输入邮箱地址', trigger: 'blur' }
          // { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'blur'] }
        ],
        password: [{ required: true, message: '请输入活动名称', trigger: 'blur' }]
      },
      loading: false,
      passwordType: 'password',
      redirect: undefined
    }
  },
  watch: {
    $route: {
      handler: function (route) {
        this.redirect = route.query && route.query.redirect
      },
      immediate: true
    }
  },
  methods: {
    showPwd () {
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
      this.$nextTick(() => {
        this.$refs.password.focus()
      })
    },
    handleLogin () {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true
          this.$store.dispatch('user/login', this.loginForm).then(() => {
            this.$router.push({ path: '/' || '/' })
            this.loading = false
          }).catch(() => {
            this.loading = false
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    // 忘记密码
    forgetPwd () {
      this.$router.push({ name: 'Project' })
    }
  }
}
</script>

<style lang="scss">
/* 修复input 背景不协调 和光标变色 */
/* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */
</style>

<style lang="scss" scoped>
@import "@/styles/color.scss";
.login-container {
  min-height: 100%;
  width: 100%;
  overflow: hidden;

  .login-form {
    position: relative;
    width: 620px;
    max-width: 100%;
    padding: 160px 90px 0;
    margin: 0 auto;
    overflow: hidden;
    .one-logo{
      margin-left: -70px;
      margin-bottom: 20px;
    }
    .btnForget{
      display: flex;
      justify-content: space-evenly;
      align-items: center;
    .el-button--primary{
      background: $btnbgcolor;
      border: none;
      font-size: 12px;
    }
    .el-button.is-round{
      padding: 9px 15px;
    }
      .Forget-frist{
        color: #386795;
        font-size: 18px;
        cursor: pointer;
      }
    }

    ::v-deep .el-form-item__content{
      .el-input{
      font-size: 12px;
      }
      .el-input__inner{
        height: 26px !important;
      }
    }
    ::v-deep .el-form-item__label{
      font-size: 12px;
    }
  }

  .title-container {
    position: relative;

    .title {
      font-size: 26px;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: bold;
    }
  }

  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    cursor: pointer;
    user-select: none;
  }
}
</style>
