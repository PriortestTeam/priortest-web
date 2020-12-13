<template>
  <div class="app-container add-project add-form">
    <el-form
      :model="from"
      :rules="rules"
      ref="from"
      label-width="100px"
      class="demo-ruleForm"
    >
      <div>
        <div class="set_btn" @click="submitForm('from')">Save and New</div>
        <div class="set_btn" @click="saveBack">Save And Back</div>
        <div class="set_btn">Save</div>
        <div class="set_btn" @click="giveupBack('from')">Give Up</div>
        <el-button type="text" @click="addFiled">Create Custom Filed</el-button>
      </div>
      <div class="form-box">
        <el-form-item label="Project title" prop="title">
          <el-input size="small" v-model="from.title"></el-input>
        </el-form-item>
        <el-row>
          <el-col :span="8">
            <el-form-item label="status" prop="status">
              <el-select
                v-model="from.status"
                placeholder="请选择项目状态"
                clearable
                size="small"
              >
                <el-option label="Progerss" value="Progerss" />
                <el-option label="Closed" value="Closed" />
                <el-option label="Plan" value="Plan" />
              </el-select> </el-form-item
          ></el-col>
          <el-col :span="8">
            <el-form-item label="Report To" prop="report">
              <el-input
                size="small"
                v-model="from.report"
              ></el-input> </el-form-item
          ></el-col>
          <el-col :span="8">
            <el-form-item label="Customer" prop="customer">
              <el-select
                v-model="from.customer"
                placeholder="请选择"
                clearable
                size="small"
              >
                <el-option label="暂无" value="" />
              </el-select> </el-form-item
          ></el-col>
        </el-row>
        <el-form-item label="Description" prop="description">
          <el-input
            size="small"
            type="textarea"
            maxlength="100"
            show-word-limit
            :autosize="{ minRows: 3, maxRows: 5 }"
            v-model="from.description"
          ></el-input>
        </el-form-item>
        <el-form-item
          class="dele-input"
          v-for="domain in from.domains"
          :label="domain.lable"
          :key="domain.key"
          :prop="domain.lable"
          :rules="{
            required: true,
            message: domain.lable + '不能为空',
            trigger: 'blur',
          }"
        >
          <el-input width="70%" size="small" v-model="domain.value"></el-input
          ><el-button type="text" @click.prevent="removeFiled(domain)"
            >删除</el-button
          >
        </el-form-item>
      </div>
    </el-form>
    <!-- 新增域名时输入的弹框 -->
    <el-dialog
      title="新增字段"
      :visible.sync="addFiledVisiale"
      width="45%"
      class="project-dialog"
    >
      <el-form
        ref="addFiledform"
        :model="addFiledform"
        :rules="addFiledformRules"
        label-width="80px"
        class="demo-ruleForm"
      >
        <el-form-item label="字段名" prop="name">
          <el-input
            v-model="addFiledform.name"
            placeholder="请输入字段名,如:address"
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addFiledVisiale = false">取 消</el-button>
        <el-button type="primary" @click="addFiledSure('addFiledform')"
          >确 定</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>
<script>
export default {
  name: 'Projectadd',
  data() {
    return {
      from: {
        status: 'Progerss',
        domains: [],
      },
      rules: {
        title: [
          { required: true, message: '请输入活动名称', trigger: 'blur' },
          { max: 15, message: '应小于15字符', trigger: 'blur' }
        ],
      },
      addFiledVisiale: false,
      addFiledform: {
        name: undefined
      },//新增字段的表单
      addFiledformRules: {
        name: [
          { required: true, message: '请输入新增字段名称', trigger: 'blur' },
          { max: 15, message: '应小于15字符', trigger: 'blur' }
        ],
      }
    }
  },
  methods: {
    //重置表单
    resetFields(formName) {
      this.from = {
        title: undefined,
        description: undefined,
        report: undefined,
        customer: undefined,
        status: 'Progerss'
      }
    },
    //提交
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          alert('submit!');
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    //放弃并且返回
    giveupBack(formName) {
      this.$route.meta.noCache = false
      this.resetForm(formName)
      this.returntomenu(this)
    },
    //保存并且返回
    saveBack() {
      this.$route.meta.noCache = true
      this.returntomenu(this)
    },
    //新增域名弹框出现
    addFiled() {
      this.addFiledVisiale = true
      this.$nextTick(() => {
        this.resetForm('addFiledform')
      })
    },
    //删除新增
    removeFiled(item) {
      var index = this.from.domains.indexOf(item)
      if (index !== -1) {
        this.from.domains.splice(index, 1)
      }
    },
    //确定新增
    addFiledSure(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.from.domains.push({
            lable: this.addFiledform.name,
            value: '',
            key: Date.now()
          });
          this.addFiledVisiale = false
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    }

  },

}
</script>
<style lang="scss" scoped>
@import "index.scss";
</style>