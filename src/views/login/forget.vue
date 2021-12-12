<template>
  <div>
    <el-form
      ref="forgetForm"
      class="login-form"
      label-position="left"
      label-width="80px"
      :rules="forgetRules"
      :model="forgetForm"
      v-if="forgetViable"
    >
      <div class="one-logo">
        <img src="@/icons/img/one-logo.png" alt="" srcset="" />
        <span>获取密码</span>
      </div>
      <el-form-item prop="email" label="邮箱">
        <el-input v-model="forgetForm.email" placeholder="请输入您的邮箱地址" />
      </el-form-item>
      <div class="btnLogin">
        <el-button
          type="primary"
          size="medium"
          round
          @click="sendEmail()"
          style="width: 100%"
          >{{ $t("lang.login.send") }}</el-button
        >
      </div>
      <el-link type="primary" style="margin-right: 10px" @click="backLoginIndex"
        >返回登录</el-link
      >
    </el-form>
     <el-form
      ref="forgetForm"
      class="login-form login-form2 "
      label-position="left"
      label-width="80px"
      :rules="forgetRules"
      :model="forgetForm"
      v-else
    >
         <div class="one-logo">
        <img src="@/icons/img/one-logo.png" alt="" srcset="" />
      </div>
      <el-link type="primary" style="margin-right: 10px" @click="backLoginIndex"
        >返回登录</el-link
      >
     <div class="one-tip">你的密码重置请求已发送到您的<span class="email" @click="routerEmail">邮箱</span>，请使用邮箱链接重置您的密码</div>
    </el-form>
  </div>
</template>

<script>
import { message } from '@/utils/common'
import { sendForgetEmail } from "@/api/user";
export default {
  data() {
    return {
      forgetForm: {
        email: "",

      },
       forgetViable:true,
      forgetRules: {
        email: [
          { required: true, message: "请输入邮箱地址", trigger: "blur" },
          // { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'blur'] },
          {
            pattern:
              /[\w!#$%&'*+/=?^_`{|}~-]+(?:\.[\w!#$%&'*+/=?^_`{|}~-]+)*@(?:[\w](?:[\w-]*[\w])?\.)+[\w](?:[\w-]*[\w])?/,
            message: "请输入正确的邮箱地址",
            trigger: ["blur", "blur"],
          },
        ],
      },
    };
  },
  methods:{
      routerEmail(){
 window.open(this.gotoEmail())
    },
    gotoEmail() {

            var email = this.forgetForm.email.split('@')[1];
            email = email.toLowerCase();
            if (email == '163.com') {
                return 'http://mail.163.com';
            } else if (email == 'vip.163.com') {
                return 'http://vip.163.com';
            } else if (email == '126.com') {
                return 'http://mail.126.com';
            } else if (email == 'qq.com' || email == 'vip.qq.com' || email == 'foxmail.com') {
                return 'http://www.mail.qq.com';
            } else if (email == 'gmail.com') {
                return 'http://mail.google.com';
            } else if (email == 'sohu.com') {
                return 'http://mail.sohu.com';
            } else if (email == 'tom.com') {
                return 'http://mail.tom.com';
            } else if (email == 'vip.sina.com') {
                return 'http://vip.sina.com';
            } else if (email == 'sina.com.cn' || email == 'sina.com') {
                return 'http://mail.sina.com.cn';
            } else if (email == 'tom.com') {
                return 'http://mail.tom.com';
            } else if (email == 'yahoo.com.cn' || email == 'yahoo.cn') {
                return 'http://www.mail.cn.yahoo.com';
            } else if (email == 'tom.com') {
                return 'http://www.mail.tom.com';
            } else if (email == 'yeah.net') {
                return 'http://www.yeah.net';
            } else if (email == '21cn.com') {
                return 'http://mail.21cn.com';
            } else if (email == 'hotmail.com') {
                return 'http://www.hotmail.com';
            } else if (email == 'sogou.com') {
                return 'http://mail.sogou.com';
            } else if (email == '188.com') {
                return 'http://www.188.com';
            } else if (email == '139.com') {
                return 'http://mail.10086.cn';
            } else if (email == '189.cn') {
                return 'http://webmail15.189.cn/webmail';
            } else if (email == 'wo.com.cn') {
                return 'http://mail.wo.com.cn/smsmail';
            } else if (email == '139.com') {
                return 'http://mail.10086.cn';
            } else {
                return '';
            }
        },
      // 发送邮箱接口
    sendEmail() {
      this.$refs.forgetForm.validate(valid => {
        if (valid) {
          sendForgetEmail(this.forgetForm).then((res) => {
            message('success', res.msg)
            // this.backLogin()
            // this.forgetForm={}
  this.forgetViable=false
          }).catch(error => {
            console.log(error)
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    backLoginIndex(){
       this.forgetViable=true
      this.$emit('backLoginIndex')
    }
  }
};
</script>

<style lang="scss" scoped>
@import "@/styles/color.scss";
.login-form {
  .one-logo {
    margin-left: -70px;
    margin-bottom: 50px;
    color: $btnbgcolor;
    font-size: 20px;
    display: flex;
    align-items: flex-end;
    span {
      margin-left: 30px;
    }
  }
  .one-logo-1 {
    margin-left: 0px;
    font-size: 20px;
    letter-spacing: 1px;
    margin-bottom: 10px;
  }
  .btnLogin {
    margin-bottom: 10px;
  }
  position: relative;
  width: 620px;
  max-width: 100%;
  padding: 160px 90px 0;
  margin: 0 auto;
  overflow: hidden;
}
.login-form2{
    padding: 160px 0 0;
     .one-logo {
    margin-left: 0px;}
}
.one-tip{
  font-size: 16px;
  margin-top: 10px;
}
.email{
  cursor: pointer;
  color:$btnbgcolor;
}
</style>
