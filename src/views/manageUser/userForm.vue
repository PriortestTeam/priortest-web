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
        <el-col :span="12">
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
          <el-form-item label="是否启用" prop="enable">
            <el-select v-model="form.enable" placeholder="请选择是否启用" style="width: 100%;">
              <el-option label="启用" :value="1" />
              <el-option label="禁用" :value="3" />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  name: 'UserForm',
  data() {
    return {
      dialogVisible: false,
      title: '',
      form: {
        email: '',
        userName: '',
        password: '',
        status: 1,
        contactNo: '',
        company: '',
        profession: '',
        industry: '',
        activeState: ''
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
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 12, message: '长度在 6 到 12 个字符', trigger: 'blur' }
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
    showModal() {
      this.title = '新增用户'
      this.dialogVisible = true
    },
    handleClose(done) {
      this.$confirm('确认关闭？').then(_ => {
        done()
      }).catch(_ => {
      })
    }
  }
}
</script>

<style scoped>

</style>
