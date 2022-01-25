<template>
  <el-dialog
    :title="title"
    :close-on-click-modal="false"
    :visible.sync="dialogVisible"
    width="800px"
    :before-close="handleClose"
  >
    <el-form ref="form" :model="form" label-width="80px" :rules="rules" size="small">
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="form.email" placeholder="请输入邮箱" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="用户名" prop="userName">
            <el-input v-model="form.userName" placeholder="请输入用户名" />
          </el-form-item>
        </el-col>
        <el-col v-if="!form.id" :span="12">
          <el-form-item label="密码" prop="password">
            <el-input v-model="form.password" placeholder="请输入密码" show-password />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="状态" prop="status">
            <el-select v-model="form.status" placeholder="请选择用户状态" style="width: 100%;">
              <el-option label="启用" :value="1" />
              <el-option label="禁用" :value="3" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="联系方式" prop="contactNo">
            <el-input v-model="form.contactNo" placeholder="请输入联系方式" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="企业" prop="company">
            <el-input v-model="form.company" placeholder="请输入用户所在企业" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="职业" prop="profession">
            <el-input v-model="form.profession" placeholder="请输入用户职业" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="行业" prop="industry">
            <el-input v-model="form.industry" placeholder="请输入用户行业" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="激活状态" prop="activeState">
            <el-select v-model="form.activeState" placeholder="请选择激活状态" style="width: 100%;">
              <el-option label="试用中" :value="1" />
              <el-option label="激活成功" :value="2" />
              <el-option label="试用过期" :value="3" />
              <el-option label="激活失败" :value="4" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="国家" prop="locale">
            <el-select v-model="form.locale" placeholder="请选择用户注册国家" style="width: 100%;">
              <el-option label="中国" value="中国" />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button :loading="btnLoading" @click="handleClose">取 消</el-button>
      <el-button type="primary" :loading="btnLoading" @click="submitForm">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { createPlatformUser, updatePlatformUser } from '@/api/manageUser'
import { formatChangedPara } from '@/utils/common'

export default {
  name: 'UserForm',
  data () {
    var verifyPassword = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'))
      } else {
        console.log(value)
        if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[^]{8,20}$/.test(value)) {
          callback(new Error('密码必须包含数字、小写、大写字母，最小8位，最大20位字符组成'))
        } else {
          callback()
        }
      }
    }
    return {
      dialogVisible: false,
      title: '',
      btnLoading: false,
      formerForm: {},
      form: {
        email: '',
        userName: '',
        password: '',
        status: 1,
        contactNo: '',
        company: '',
        profession: '',
        industry: '',
        activeState: '',
        locale: '中国',
        timeZone: '"UTC/GMT: +8:00"'
      },
      rules: {
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }
        ],
        userName: [
          { required: true, message: '请输入用户名', trigger: 'blur' }
        ],
        password: [
          { validator: verifyPassword, trigger: 'blur' }
        ],
        status: [
          { required: true, message: '请选择用户状态', trigger: 'change' }
        ],
        activeState: [
          { required: true, message: '请选择用户激活状态', trigger: 'change' }
        ],
        enable: [
          { required: true, message: '请选择用户是否启用', trigger: 'change' }
        ]
      }
    }
  },
  methods: {
    showModal () {
      this.title = '新增用户'
      this.dialogVisible = true
    },
    editUser (user) {
      this.form = { ...user }
      this.formerForm = { ...user }
      this.title = '编辑用户'
      this.dialogVisible = true
    },
    handleClose (done) {
      this.resetData()
    },
    submitForm () {
      this.$refs.form.validate((valid) => {
        if (valid) {
          console.log(this.form)
          if (!this.form.id) {
            this.createPlatformUser()
          } else {
            this.updatePlatformUser()
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    // 编辑用户
    updatePlatformUser () {
      this.btnLoading = true
      const param = formatChangedPara(this.formerForm, this.form)
      updatePlatformUser(param).then(res => {
        if (res.code === '200') {
          this.$emit('ok')
          this.$message.success('用户修改成功')
          this.resetData()
        } else {
          this.$message.error(res.data)
        }
      }).finally(_ => {
        this.btnLoading = false
      })
    },
    // 新增用户
    createPlatformUser () {
      this.btnLoading = true
      createPlatformUser(this.form).then(res => {
        if (res.code === '200') {
          this.$emit('ok')
          this.$message.success('用户创建成功')
          this.resetData()
        } else {
          this.$message.error(res.data)
        }
      }).finally(_ => {
        this.btnLoading = false
      })
    },
    resetData () {
      this.dialogVisible = false
      this.title = ''
      this.btnLoading = false
      this.form = {
        email: '',
        userName: '',
        password: '',
        status: 1,
        contactNo: '',
        company: '',
        profession: '',
        industry: '',
        activeState: '',
        locale: '中国',
        timeZone: '"UTC/GMT: +8:00"'
      }
    }
  }
}
</script>

<style scoped>

</style>
