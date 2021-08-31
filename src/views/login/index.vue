<template>
  <div class="login-container">
    <el-form
      v-if="!isShowregister"
      ref="loginForm"
      class="login-form"
      label-position="left"
      label-width="80px"
      :rules="loginRules"
      :model="loginForm"
    >
      <div class="one-logo">
        <img src="@/icons/img/one-logo.png" alt="" srcset="">
      </div>
      <el-form-item prop="username" label="Email">
        <el-input v-model="loginForm.username" />
      </el-form-item>
      <el-form-item prop="password" label="Password">
        <el-input v-model="loginForm.password" />
      </el-form-item>
      <el-form-item>
        <div class="btnForget">
          <el-button
            type="primary"
            round
            @click="handleLogin('loginForm')"
          >Login</el-button>
          <!-- @click="forgetPwd()" -->
          <!-- <div class="Forget-frist">Forget & Set Password</div> -->
          <el-button
            type="primary"
            round
            @click="handleregister('loginForm')"
          >to Register</el-button>
        </div>
      </el-form-item>
    </el-form>
    <div v-if="isShowregister">
      <el-form
        ref="registerForm"
        class="login-form"
        label-position="left"
        label-width="100px"
        :rules="registerRules"
        :model="registerForm"
      >
        <div class="one-logo">
          <img src="@/icons/img/one-logo.png" alt="" srcset="">
        </div>
        <el-form-item prop="email" label="邮箱">
          <el-input id="mazey" v-model="registerForm.email" @blur="check" />
        </el-form-item>
        <el-form-item prop="userName" label="名称">
          <el-input v-model="registerForm.userName" />
        </el-form-item>
        <el-form-item prop="password" label="密码">
          <el-input v-model="registerForm.password" />
        </el-form-item>
        <el-form-item prop="emailCode" label="邮箱验证码">
          <el-input v-model="registerForm.emailCode" />
        </el-form-item>
        <el-form-item>
          <div class="btnForget">
            <el-button
              type="primary"
              round
              @click="goRegister('registerForm')"
            >register</el-button>
            <el-button
              type="primary"
              round
              @click="goLogin('registerForm')"
            >to Login</el-button>
          </div>
        </el-form-item>
      </el-form>
    </div>
  </div>
  <!-- 注册 -->
</template>

<script>

import { message } from '@/utils/common'
import { sendEmailRegisterCode, userRegiste } from '@/api/user'

export default {
  name: 'Login',
  data() {
    return {
      loginForm: {
        username: '2211910447@qq.com',
        password: '12345678Aa'
      },
      loginRules: {
        username: [
          { required: true, message: '请输入邮箱地址', trigger: 'blur' },
          { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'blur'] }
        ],
        password: [{ required: true, message: '请输入活动名称', trigger: 'blur' }]
      },
      loading: false,
      passwordType: 'password',
      redirect: undefined,
      // 注册用户
      isShowregister: false,
      registerUser: '',

      registerForm: {},
      registerRules: {
        email: [
          { required: true, message: '请输入邮箱地址', trigger: 'blur' },
          { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'blur'] }
        ],
        password: [{ required: true, message: '请输入密码名称', trigger: 'blur' }],
        userName: [{ required: true, message: '请输入名称', trigger: 'blur' }],
        emailCode: [{ required: true, message: '请输入验证码', trigger: 'blur' }]
      }
    }
  },
  watch: {
    $route: {
      handler: function(route) {
        this.redirect = route.query && route.query.redirect
      },
      immediate: true
    }
  },
  methods: {
    showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
      this.$nextTick(() => {
        this.$refs.password.focus()
      })
    },
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true
          // this.loginForm = {
          //   username: '1220186100@qq.com',
          //   password: '12345678A'
          // }
          this.$store.dispatch('user/login', this.loginForm).then((res) => {
            message('success', res.msg)
            this.$router.push({ path: '/' })
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    // 注册
    handleregister() {
      this.isShowregister = true
    },
    // 验证邮箱
    check() {
      var reg = new RegExp('^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$') // 正则表达式
      var obj = document.getElementById('mazey') // 要验证的对象
      if (!reg.test(obj.value)) { // 正则验证不通过，格式不对
        return false
      } else {
        message('success', '验证码已发送，请注意查收邮箱')
        const email = this.registerForm.email
        sendEmailRegisterCode(email).then(res => {
          if (res.code === '200') {
            console.log(res)
          }
        })
        return true
      }
    },
    // 注册接口
    goRegister() {
      this.$refs.registerForm.validate(valid => {
        if (valid) {
          userRegiste(this.registerForm).then((res) => {
            message('success', res.msg)
            this.$router.push({ path: '/' })
          }).catch(error => {
            console.log(error)
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    // 去登陆
    goLogin() {
      this.isShowregister = false
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
    .one-logo {
      margin-left: -70px;
      margin-bottom: 20px;
    }
    position: relative;
    width: 620px;
    max-width: 100%;
    padding: 160px 90px 0;
    margin: 0 auto;
    overflow: hidden;

    .btnForget {
      display: flex;
      justify-content: space-evenly;
      align-items: center;
      .el-button--primary {
        background: $btnbgcolor;
        border: none;
        font-size: 12px;
      }
      .el-button.is-round {
        padding: 9px 15px;
      }
      .Forget-frist {
        color: #386795;
        font-size: 18px;
        cursor: pointer;
      }
    }

    ::v-deep .el-form-item__content {
      .el-input {
        font-size: 12px;
      }
      .el-input__inner {
        height: 26px !important;
      }
    }
    ::v-deep .el-form-item__label {
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
