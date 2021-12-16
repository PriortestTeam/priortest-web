<template>
  <div class="login-container">
    <el-form
      v-if="loginView"
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
      <el-form-item prop="username" label="邮箱">
        <el-input v-model="loginForm.username" />
      </el-form-item>
      <el-form-item prop="password" label="密码">
        <el-input v-model="loginForm.password" />
      </el-form-item>
      <div class="ForgetView">
        <div class="forget" @click="routeForget">{{ $t('lang.login.forget') }}</div>
        <div class="deferred" @click="routedeferred">{{ $t('lang.login.deferred') }}</div>
      </div>
      <div class="btnLogin">
        <el-button
          type="primary"
          size="medium"
          round
          style="width:48%"
          @click="handleLogin('loginForm')"
        >登录</el-button>
        <el-button
          type="primary"
          round
          class="registerBtn"
          style="width:48%"
          @click="handleregister('loginForm')"
        >注册</el-button>
      </div>

    </el-form>
    <div v-if="isShowregister">
      <el-form
        ref="registerForm"
        class="login-form"
        label-position="left"
        :rules="registerRules"
        :model="registerForm"
      >
        <div class="one-logo-1">
          <!-- <img src="@/icons/img/one-logo.png" alt="" srcset=""> -->
          欢迎注册试用 OneClick 免费30天
        </div>
        <el-row :gutter="10">
          <el-col :lg="12" :md="12" :sm="12">
            <el-form-item prop="email">
              <el-input
                id="mazey"
                v-model="registerForm.email"
                size="mini"
                placeholder="请输入您的邮箱"
              />
            </el-form-item>
          </el-col>
          <el-col :lg="12" :md="12" :sm="12">
            <el-form-item prop="contactNo">
              <el-input
                v-model="registerForm.contactNo"
                size="mini"
                placeholder="请输入您的电话"
              />
            </el-form-item>
          </el-col>
          <el-col :lg="12" :md="12" :sm="12">
            <el-form-item prop="userName">
              <el-input
                v-model="registerForm.userName"
                size="mini"
                placeholder="请输入您的姓名"
              />
            </el-form-item>
          </el-col>
          <el-col :lg="12" :md="12" :sm="12">
            <el-form-item prop="company">
              <el-input
                v-model="registerForm.company"
                size="mini"
                placeholder="请输入您的公司名称"
              />
            </el-form-item>
          </el-col>
          <el-col :lg="12" :md="12" :sm="12">
            <el-form-item prop="industry">
              <el-input
                v-model="registerForm.industry"
                size="mini"
                placeholder="请输入您所在行业"
              />
            </el-form-item>
          </el-col>
          <el-col :lg="12" :md="12" :sm="12">
            <el-form-item prop="profession">
              <el-input
                v-model="registerForm.profession"
                size="mini"
                placeholder="请输入您所在职位"
              />
            </el-form-item>
          </el-col>
        </el-row>

        <div class="pass-allowed">
          <!-- <el-checkbox v-model="checked">
            <el-link v-if="checked" type="success" @click="dialogVisible = true">您阅读已同意服务条款</el-link>
            <el-link v-else type="warning" @click="dialogVisible = true">您阅读已同意服务条款</el-link>
          </el-checkbox> -->
          <div>
            <el-checkbox v-model="checked" />
            <el-link type="success" class="service-clause" @click="dialogVisible = true">您阅读已同意服务条款</el-link>
          </div>
          <el-link type="primary" style="margin-right: 10px;" @click="backLoginIndex">返回登录</el-link>
        </div>
        <div style="padding-right: 10px;box-sizing: border-box;margin-top: 20px;">
          <el-button :disabled="passRigister" size="small" type="danger" style="width: 100%;" @click="goRegister">注册</el-button>
        </div>
      </el-form>

    </div>
    <div v-if="isShowregisterAfter">
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
        <el-link type="primary" style="margin-right: 10px;" @click="backLoginIndex">返回登录</el-link>
        <div class="one-tip">感谢您试用OneClick, 请通过您的<span class="email" @click="routerEmail">注册邮箱{{ registerForm.email }}</span>激活注册帐号开启您的体验之旅</div>
      </el-form>

    </div>
    <forget v-if="forgetView" @backLoginIndex="backLoginIndex" />
    <!-- 申请延期 -->
    <deferred v-if="deferredView" @backLoginIndex="backLoginIndex" />
    <!-- 服务条款 -->
    <service-clause v-if="dialogVisible" :visible.sync="dialogVisible" @getServiceClause="getServiceClause" />
  </div>
  <!-- 注册 -->

</template>

<script>

import { message } from '@/utils/common'
import { sendEmailRegisterCode, userRegiste } from '@/api/user'
import forget from './forget.vue'
import deferred from './login-deferred.vue'
import serviceClause from './serviceClause.vue'
export default {
  name: 'Login',
  components: { forget, deferred, serviceClause },
  data() {
    return {
      loginForm: {
        username: '1220186101@qq.com',
        password: '12345678A'
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
      isShowregisterAfter: false,
      forgetView: false, // 忘记密码view
      loginView: true, // 登录view
      deferredView: false, // 申请延期view
      registerUser: '',
      checked: false,
      registerForm: {
        email: '',
        contactNo: '',
        userName: '',
        company: '',
        industry: '',
        profession: ''
      },
      registerRules: {
        email: [
          { required: true, message: '请输入邮箱地址', trigger: 'blur' },
          { max: 50, message: '长度最多50个字符', trigger: 'blur' },
          // { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'blur'] },
          { pattern: /[\w!#$%&'*+/=?^_`{|}~-]+(?:\.[\w!#$%&'*+/=?^_`{|}~-]+)*@(?:[\w](?:[\w-]*[\w])?\.)+[\w](?:[\w-]*[\w])?/, message: '请输入正确的邮箱地址', trigger: ['blur', 'blur'] }
        ],
        // password: [{ required: true, message: '请输入密码名称', trigger: 'blur' }],
        contactNo: [{ max: 20, message: '长度最多20个字符', trigger: 'blur' }],
        userName: [{ max: 20, message: '长度最多20个字符', trigger: 'blur' }],
        company: [{ max: 50, message: '长度最多50个字符', trigger: 'blur' }],
        industry: [{ max: 20, message: '长度最多20个字符', trigger: 'blur' }],
        profession: [{ max: 20, message: '长度最多20个字符', trigger: 'blur' }]
        // emailCode: [{ required: true, message: '请输入验证码', trigger: 'blur' }]
      },
      email: '',
      dialogVisible: false,
      isViewServiceClause: false
    }
  },
  computed: {
    passRigister() {
      if (this.registerForm.email && this.checked) {
        const reg = /[\w!#$%&'*+/=?^_`{|}~-]+(?:\.[\w!#$%&'*+/=?^_`{|}~-]+)*@(?:[\w](?:[\w-]*[\w])?\.)+[\w](?:[\w-]*[\w])?/
        return !reg.test(this.registerForm.email)
      } else {
        return true
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
    getServiceClause(data) {
      this.isViewServiceClause = data
    },
    routerEmail() {
      window.open(this.gotoEmail())
    },
    gotoEmail() {
      const that = this
      const email = that.registerForm.email.split('@')[1]
      that.email = email.toLowerCase()
      if (that.email === '163.com') {
        return 'http://mail.163.com'
      } else if (that.email === 'vip.163.com') {
        return 'http://vip.163.com'
      } else if (that.email === '126.com') {
        return 'http://mail.126.com'
      } else if (that.email === 'qq.com' || that.email === 'vip.qq.com' || that.email === 'foxmail.com') {
        return 'http://www.mail.qq.com'
      } else if (that.email === 'gmail.com') {
        return 'http://mail.google.com'
      } else if (that.email === 'sohu.com') {
        return 'http://mail.sohu.com'
      } else if (that.email === 'tom.com') {
        return 'http://mail.tom.com'
      } else if (that.email === 'vip.sina.com') {
        return 'http://vip.sina.com'
      } else if (that.email === 'sina.com.cn' || that.email === 'sina.com') {
        return 'http://mail.sina.com.cn'
      } else if (that.email === 'tom.com') {
        return 'http://mail.tom.com'
      } else if (that.email === 'yahoo.com.cn' || that.email === 'yahoo.cn') {
        return 'http://www.mail.cn.yahoo.com'
      } else if (that.email === 'tom.com') {
        return 'http://www.mail.tom.com'
      } else if (that.email === 'yeah.net') {
        return 'http://www.yeah.net'
      } else if (that.email === '21cn.com') {
        return 'http://mail.21cn.com'
      } else if (that.email === 'hotmail.com') {
        return 'http://www.hotmail.com'
      } else if (that.email === 'sogou.com') {
        return 'http://mail.sogou.com'
      } else if (that.email === '188.com') {
        return 'http://www.188.com'
      } else if (that.email === '139.com') {
        return 'http://mail.10086.cn'
      } else if (that.email === '189.cn') {
        return 'http://webmail15.189.cn/webmail'
      } else if (that.email === 'wo.com.cn') {
        return 'http://mail.wo.com.cn/smsmail'
      } else if (that.email === '139.com') {
        return 'http://mail.10086.cn'
      } else {
        return ''
      }
    },
    backLogin() {
      this.isShowregister = false
      this.isShowregisterAfter = true// 显示提示激活
      this.checked = false
      this.forgetView = false
      this.loginView = false
      this.deferredView = false
    },
    routeForget() {
      this.isShowregister = false
      this.isShowregisterAfter = false // 显示提示激活
      this.checked = false
      this.loginView = false
      this.forgetView = true
      this.deferredView = false
    },
    routedeferred() {
      this.isShowregister = false
      this.isShowregisterAfter = false // 显示提示激活
      this.checked = false
      this.loginView = false
      this.forgetView = false
      this.deferredView = true
    },
    backLoginIndex() {
      this.registerForm = {}
      this.isShowregister = false
      this.isShowregisterAfter = false// 显示提示激活
      this.checked = false
      this.forgetView = false
      this.loginView = true
      this.deferredView = false
      this.isViewServiceClause = false
    },
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
      this.isShowregisterAfter = false // 显示提示激活
      this.checked = false
      this.loginView = false
      this.forgetView = false
      this.deferredView = false
    },
    // 验证邮箱
    check() {
      var reg = new RegExp('^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$') // 正则表达式
      var obj = document.getElementById('mazey') // 要验证的对象
      if (!reg.test(obj.value)) { // 正则验证不通过，格式不对
        return false
      } else {
        sendEmailRegisterCode(this.email).then(res => {
          if (res.code === '200') {
            message('success', '验证码已发送，请注意查收邮箱')
            this.email = this.registerForm.email
          }
        })
        return true
      }
    },
    // 注册接口
    goRegister() {
      const that = this
      if (!that.isViewServiceClause) {
        message('warning', '请您浏览服务条款，点击同意并继续！')
        return
      }
      that.$refs.registerForm.validate(valid => {
        if (valid) {
          const registerForm = that.registerForm
          registerForm.locale = '中国'
          if (that.registerForm.userName === '') {
            that.registerForm.userName = that.registerForm.email.substring(0, that.registerForm.email.indexOf('@'))
          }
          userRegiste(registerForm).then((res) => {
            if (res.code !== '200') {
              return
            }
            message('success', res.msg)
            that.backLogin()
            // that.registerForm = {}
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

.el-form-item{
  margin-bottom: 20px;
}
.pass-allowed {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.login-container {
  min-height: 100%;
  width: 100%;
  overflow: hidden;

  .login-form {
    .one-logo {
      margin-left: -70px;
      margin-bottom: 20px;
    }
    .one-logo-1 {
      margin-left: 0px;
      font-size: 20px;
      letter-spacing: 1px;
      margin-bottom: 10px;
    }
    position: relative;
    width: 620px;
    max-width: 100%;
    padding: 160px 90px 0;
    margin: 0 auto;
    overflow: hidden;
  .btnLogin{
       display: flex;
       justify-content: space-between;
       .registerBtn{
         background: $secondbgcolor;
         border: 1px solid $secondbgcolor;
       }
  }
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
    .ForgetView{
      display: flex;
      justify-content: space-between;
      margin-bottom: 10px;
      div{
        color: #8590a6;
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
.el-form-item__content {
  line-height: 38px !important;
}
.email{
  cursor: pointer;
  color:$btnbgcolor;
}
.service-clause {
  vertical-align: top;
  margin-left: 8px;
}
</style>
