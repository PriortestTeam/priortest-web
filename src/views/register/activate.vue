<template>
  <div class="login-container">
    <el-form ref="loginForm" class="login-form" label-position="left" label-width="80px" :rules="loginRules" :model="loginForm">
      <div class="one-logo">
        <img src="@/icons/img/one-logo.png" alt="" srcset="">
      </div>
      <div class="one-tip">
        激活您的 OneClick 账号
      </div>
      <el-form-item prop="email" label="邮箱地址">
        <el-input v-model="loginForm.email" disabled />
      </el-form-item>
      <el-form-item prop="password" label="密码">
        <el-input v-model="loginForm.password" type="password" />
      </el-form-item>
      <el-form-item prop="rePassword" label="确认密码">
        <el-input v-model="loginForm.rePassword" type="password" />
      </el-form-item>
      <div class="pass-allowed">
        <div>
          <el-checkbox v-model="checked" />
          <el-link type="success" class="service-clause" @click="dialogVisible = true">您阅读已同意服务条款</el-link>
        </div>
        <el-link type="primary" style="margin-right: 10px;" @click="backLogin">返回登录</el-link>
      </div>
      <el-button
        class="acBtn"
        :disabled="!checked"
        round
        @click="goActivate"
      >激活账户</el-button>
    </el-form>
    <!-- 服务条款 -->
    <service-clause v-if="dialogVisible" :visible.sync="dialogVisible" @getServiceClause="getServiceClause" />
  </div>
</template>

<script>
import { addProjects } from '@/api/project'
import { message } from '@/utils/common'
import { activateAccount, verifyLinkString } from '@/api/user'
import serviceClause from '../login/serviceClause.vue'
export default {
  name: 'Active',
  components: { serviceClause },
  data() {
    var validatePassword = (rule, value, callback) => {
      if (!/\S/.test(value)) {
        return callback(new Error('必填项不能为空'))
      }
      if (!/^(?=.*[0-9])(?=.*[A-Z])(?=.*[a-z])(?=.*[!@+#$%^&*,\.])[0-9a-zA-Z!@+#$%^&*,\\.]{8,12}$/.test(value)) {
        return callback(new Error('密码为8~12位且包含大写、小写、数字、特殊字符'))
      }
      callback()
    }
    var validateConfirmPassword = (rule, value, callback) => {
      console.log(value)
      if (!/\S/.test(value)) {
        return callback(new Error('必填项不能为空'))
      }
      if (this.loginForm.password && this.loginForm.password !== value) {
        return callback(new Error('确认密码与密码输入不一致'))
      }
      callback()
    }
    return {
      loginForm: {
        email: '',
        password: '',
        rePassword: ''
      },
      checked: false,
      loginRules: {
        username: [
          { required: true, message: '请输入邮箱地址', trigger: 'blur' }
          // { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'blur'] }
        ],
        password: [
          { validator: validatePassword, trigger: 'blur' }
        ],
        rePassword: [
          { validator: validateConfirmPassword, trigger: 'blur' }
        ]
      },
      dialogVisible: false,
      isViewServiceClause: false
    }
  },
  watch: {
  },
  mounted() {
    this.loginForm.email = this.$route.query.email
    this.loginForm.params = this.$route.query.params
    if (!this.loginForm.email || !this.loginForm.params) {
      this.$router.push({ path: '/' })
      return
    }
    verifyLinkString({ params: this.loginForm.params }).then(res => {
      if (res.code !== '200') {
        this.$router.push({ path: '/' })
      }
    })
  },
  methods: {
    getServiceClause(data) {
      this.isViewServiceClause = data
    },
    backLogin() {
      this.$router.push({ path: '/' })
    },
    // 激活账户
    async goActivate() {
      const that = this
      try {
        const bool = await that.$refs.loginForm.validate()
        if (bool) {
          if (!that.isViewServiceClause) {
            return that.$message.error('请勾选同意服务条款按钮')
          }
          const res = await activateAccount(that.loginForm)
          if (res.code === '200') {
            message('success', res.msg)
            that.backLogin()
          }
        }
      } catch (error) {
        console.log(error)
      }
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
      // margin-left: -70px;
      margin-bottom: 20px;
    }
    .one-tip{
      font-size: 35px;
      margin-bottom: 20px;
    }
    .pass-allowed{
      width: 100%;
      display: flex;
      justify-content: space-between;
      margin-bottom: 20px;
    }
    .acBtn{
      width: 100%;
       background: $btnbgcolor;
       height: 28px;
       color:#fff
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
  .service-clause {
    vertical-align: top;
    margin-left: 8px;
  }
}
</style>
