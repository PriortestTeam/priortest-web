<template>
  <el-row class="fd-row" :gutter="20">
    <el-col
      :span="8"
    ><div class="grid-content bg-purple" />
      <el-form
        ref="fieldsfrom"
        :model="fieldsfrom"
        :rules="fieldsrules"
        label-width="100px"
        class="demo-ruleForm"
      >
        <div class="fieldbtn">
          <el-button
            type="primary"
            round
            @click="submitfdForm('fieldsfrom')"
          >保存</el-button>
          <el-button
            type="primary"
            round
          >放弃</el-button>
        </div>
        <el-form-item label="字段名称" prop="fieldName" class="form-small">
          <el-input v-model="fieldsfrom.fieldName" size="small" />
        </el-form-item>
        <el-form-item label="类型" prop="type" class="form-small">
          <el-select
            v-model="fieldsfrom.type"
            size="small"
            placeholder="请选择适用范围"
            @change="PleaseType"
          >
            <el-option
              v-for="item in fieldsOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          label="长度"
          prop="length"
          class="form-small"
        >
          <el-input v-model="fieldsfrom.length" size="small" />
        </el-form-item>
      </el-form>
    </el-col>
    <el-col
      v-if="true"
      :span="6"
    ><div class="grid-content bg-purple" />
      <el-row class="sen-row" :gutter="20">
        <el-col :span="4">
          <el-checkbox v-model="checked1" />
        </el-col>
        <el-col :span="4">范围</el-col>
        <el-col :span="4">是否必填</el-col>
        <el-col :span="4">初始值</el-col>
      </el-row>
      <el-row class="sen-row" :gutter="20">
        <el-col :span="4">
          <el-checkbox v-model="fieldsfrom.scope[0]" />
        </el-col>
        <el-col :span="4">项目</el-col>
        <el-col :span="4">
          <div class="ng-red">
            <el-checkbox v-model="fieldsfrom.mandatory[0]" />
          </div>
        </el-col>
        <el-col :span="4">
          <div class="ng-input">
            <el-input v-model="fieldsfrom.defaultValues[0]" />
          </div>
        </el-col>
      </el-row>
      <el-row class="sen-row" :gutter="20">
        <el-col :span="4">
          <el-checkbox v-model="fieldsfrom.scope[1]" />
        </el-col>
        <el-col :span="4">故事</el-col>
        <el-col :span="4">
          <div class="ng-red">
            <el-checkbox v-model="fieldsfrom.mandatory[1]" />
          </div>
        </el-col>
        <el-col :span="4">
          <div class="ng-input">
            <el-input v-model="fieldsfrom.defaultValues[1]" />
          </div>
        </el-col>
      </el-row>
      <el-row class="sen-row" :gutter="20">
        <el-col :span="4">
          <el-checkbox v-model="fieldsfrom.scope[2]" />
        </el-col>
        <el-col :span="4">测试用例</el-col>
        <el-col :span="4">
          <div class="ng-red">
            <el-checkbox v-model="fieldsfrom.mandatory[2]" />
          </div>
        </el-col>
        <el-col :span="4">
          <div class="ng-input">
            <el-input v-model="fieldsfrom.defaultValues[2]" />
          </div>
        </el-col>
      </el-row>
      <el-row class="sen-row" :gutter="20">
        <el-col :span="4">
          <el-checkbox v-model="fieldsfrom.scope[3]" />
        </el-col>
        <el-col :span="4">测试周期</el-col>
        <el-col :span="4">
          <div class="ng-red">
            <el-checkbox v-model="fieldsfrom.mandatory[3]" />
          </div>
        </el-col>
        <el-col :span="4">
          <div class="ng-input">
            <el-input v-model="fieldsfrom.defaultValues[3]" />
          </div>
        </el-col>
      </el-row>
      <el-row class="sen-row" :gutter="20">
        <el-col :span="4">
          <el-checkbox v-model="fieldsfrom.scope[4]" />
        </el-col>
        <el-col :span="4">验收</el-col>
        <el-col :span="4">
          <div class="ng-red">
            <el-checkbox v-model="fieldsfrom.mandatory[4]" />
          </div>
        </el-col>
        <el-col :span="4">
          <div class="ng-input">
            <el-input v-model="fieldsfrom.defaultValues[4]" />
          </div>
        </el-col>
      </el-row>
    </el-col>
  </el-row>
</template>

<script>
import { message } from '@/utils/common'
import { addCustomRichText, updateCustomRichText } from '@/api/customField'
export default {
  name: 'Radio',
  props: {
    customname: {
      type: Object,
      required: true
    },
    fieldName: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      fieldsOptions: [{
        value: 'dropDown',
        label: '下拉框'
      }, {
        value: 'text',
        label: '文本'
      }, {
        value: 'memo',
        label: '备注'
      }, {
        value: 'chackbox',
        label: '多选框'
      }, {
        value: 'radio',
        label: '单选框'
      }],
      tableHeader: {
        color: '#d4dce3',
        background: '#4286CD'
      },
      cloneFieldsForm: {},
      // 自定义字段
      fieldsfrom: {
        type: 'memo',
        concat: '',
        scope: [false, false, false, false, false],
        defaultValues: ['', '', '', '', ''],
        mandatory: [false, false, false, false, false],
        projectId: '',
        fieldName: this.fieldName
      },
      fieldsrules: {
        fieldName: [{ required: true, message: '请输入字段名称', trigger: 'blur' }],
        type: [{ required: true, message: '请选择类型', trigger: 'change' }]
      },
      checked1: true,
      inputvalue: '',
      // 类型选择（单选 or 复选）
      singleorType: false,
      // 字符长度 （文本 or 备注）
      showLength: false,
      dropValue: false,
      dropData: [
        { name: '01' },
        { name: '02' }
      ],
      droprow: ''
      // 自定义字段 结束
    }
  },
  computed: {
    projectInfo() {
      return this.$store.state.user.userinfo
    }
  },
  watch: {
    'customname': function(val) {
      this.fieldsfrom = val
    }
  },
  created() {
    /* eslint-disable */
    this.cloneFieldsForm = _.cloneDeep(this.fieldsfrom)
    this.fieldsfrom.projectId = this.projectInfo.userUseOpenProject.projectId
  },
  methods: {
    // 字段表单提交
    submitfdForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const radio = this.fieldsfrom
          for (const key in radio) {
            if (key === 'scope' || key === 'defaultValue' || key === 'mandatory') {
              for (let i = 0; i < radio[key].length; i++) {
                if (radio[key][i] === false) {
                  radio[key][i] = '0'
                } else {
                  radio[key][i] = '1'
                }
              }
            }
          }

          for (const i in radio) {
            if (i === 'scope' || i === 'defaultValue' || i === 'mandatory') {
              radio[i] = radio[i].join(',')
            }
          }
          if (!this.fieldsfrom.id) {
            addCustomRichText(radio).then(res => {
              if (res.code === '200') {
                message('success', res.msg)
                this.fieldsfrom = _.cloneDeep(this.cloneFieldsForm)
                this.$emit('executeQueryCustomList')
              }
            })
          } else {
            updateCustomRichText(radio).then(res => {
              if (res.code === '200') {
                message('success', res.msg)
                this.fieldsfrom = _.cloneDeep(this.cloneFieldsForm)
                this.$emit('executeQueryCustomList')
              }
            })
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    PleaseType(val) {
      this.$emit('setFieldName', this.fieldsfrom.fieldName)
      this.$emit('PleaseType', val)
      const type = val
      if (type === 'radio' || type === 'chackbox') {
        this.singleorType = true
      } else {
        this.singleorType = false
      }
      if (type === 'text' || type === 'memo') {
        this.showLength = true
      } else {
        this.showLength = false
      }
      if (type === 'dropDown') {
        this.dropValue = true
      } else {
        this.dropValue = false
      }
    },
    // drop表格选中
    dropselect(val) {
      this.droprow = val
    },
    // 添加drop值
    addDrop() {
      const obj = {
        name: this.fieldsfrom.Value
      }
      this.dropData.push(obj)
    },
    // 删除drop值
    delDrop() {
      const val = this.droprow
      this.dropData.filter((item, index) => {
        if (item === val) {
          this.dropData.splice(index, 1)
          this.droprow = ''
        }
      })
    }

  }
}

</script>

<style lang="scss" scoped>
@import "index.scss";
@import "@/views/project/index.scss";
</style>
