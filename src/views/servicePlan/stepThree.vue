<template>
  <div class="step-three">
    <el-form
      ref="form"
      :model="form"
      :rules="rules"
      label-width="120px"
    >
      <el-row>
        <el-col :span="12">
          <el-form-item label="邮箱:" prop="email" size="small">
            <el-input v-model="form.email" disabled />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="电话:" prop="contactNo" size="small">
            <el-input v-model="form.contactNo" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="用户名:" prop="userName" size="small">
            <el-input v-model="form.userName" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="公司:" prop="company" size="small">
            <el-input v-model="form.company" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="职业:" prop="profession" size="small">
            <el-input v-model="form.profession" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="地址:" prop="address" size="small">
            <el-input v-model="form.address" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="行业:" prop="industry" size="small">
            <el-input v-model="form.industry" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="城市:" prop="city" size="small">
            <el-input v-model="form.city" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="邮编:" prop="postCode" size="small">
            <el-input v-model="form.postCode" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="您是如何知道:" size="small">
            <el-select
              v-model="form.how"
              :disabled="projectUserInfo.userType !== 'Trialer'"
              placeholder=""
            >
              <el-option
                value="3"
                label="3"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="国家:" prop="country" size="small">
            <el-input v-model="form.country" />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div>
      <el-button type="primary" class="wd100" @click="pre">上一步</el-button>
      <el-button type="primary" class="wd100" @click="next">确认</el-button>
    </div>
  </div>
</template>

<script>
import { message } from '@/utils/common'
import { systemConfigAPI } from '@/api/systemConfig'
import { mapState } from 'vuex'
export default {
  name: 'stepThree',
  data() {
    return {
      form: {
        email: '',
        contactNo: '',
        userName: '',
        company: '',
        profession: '',
        address: '',
        industry: '',
        city: '',
        postCode: '',
        country: ''
      },
      rules: {
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' }
        ],
        contactNo: [
          { required: true, message: '请输入电话', trigger: 'blur' }
        ],
        userName: [
          { required: true, message: '请输入用户名', trigger: 'blur' }
        ],
        company: [
          { required: true, message: '请输入公司', trigger: 'blur' }
        ],
        profession: [
          { required: true, message: '请输入职业', trigger: 'blur' }
        ],
        address: [
          { required: true, message: '请输入地址', trigger: 'blur' }
        ],
        industry: [
          { required: true, message: '请输入行业', trigger: 'blur' }
        ],
        city: [
          { required: true, message: '请输入城市', trigger: 'blur' }
        ],
        postCode: [
          { required: true, message: '请输入邮编', trigger: 'blur' }
        ],
        country: [
          { required: true, message: '请输入国家', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    projectUserInfo() {
      return this.$store.state.user.userinfo
    }
  },
  created() {
    console.log('stepTwo--', this.projectUserInfo)
    this.init()
  },
  methods: {
    // 服务计划
    init() {
      const that = this
      // const projectUserInfo = that.projectUserInfo
      for (const key in that.form) {
        if (that.projectUserInfo[key]) {
          that.form[key] = that.projectUserInfo[key]
        }
      }
    },
    pre() {
      this.$emit('activeNum', 0)
    },
    next() {
      this.$emit('activeNum', 1)
    }
  }
}
</script>

<style lang="scss">
@import "@/styles/index.scss";
  .step-three {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-flow: column;
    .el-form {
      width: 70%;
    }
  }
</style>
