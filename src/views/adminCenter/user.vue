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
           @click="submitfdForm('fieldsfrom')">保 存</el-button>
            <el-button type="primary" >放 弃</el-button>
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
      <el-row v-for="(item, index) in scopeList" :key="index" class="sen-row" :gutter="20">
        <el-col :span="4">
          <el-checkbox v-model="fieldsfrom.scope[index]" />
        </el-col>
        <el-col :span="4">{{ item }}</el-col>
        <el-col :span="4">
          <div class="ng-red">
            <el-checkbox v-model="fieldsfrom.mandatory[index]" />
          </div>
        </el-col>
        <el-col :span="4">
          <div class="ng-input ng-red flex">
            <el-checkbox v-model="fieldsfrom.defaultRadio[index]" class="mr10" @change="checked=>handleCheck(checked, index)" />
            <el-select
              v-model="fieldsfrom.defaultValues[0]"
              :disabled="disabledList[index]"
              size="small"
            >
              <el-option
                v-for="obj in sysList"
                :key="obj.value"
                :label="obj.label"
                :value="obj.value"
              />
            </el-select>
          </div>
        </el-col>
      </el-row>
    </el-col>
  </el-row>
</template>

<script>
import { message } from '@/utils/common'
import { addCustomText, updateCustomText } from '@/api/customField'
export default {
  name: 'User',
  props: {
    customType: {
      type: String,
      required: true
    },
    customname: {
      type: Object,
      required: true
    },
    fieldName: {
      type: String,
      required: true
    },
    fieldsOptions: {
      type: Array,
      required: true
    },
    scopeList: {
      type: Array,
      required: true
    }
  },
  data () {
    return {
      tableHeader: {
        color: '#d4dce3',
        background: '#4286CD'
      },
      cloneFieldsForm: {},
      // 自定义字段
      fieldsfrom: {
        type: this.customType,
        concat: '',
        scope: [],
        defaultValues: [],
        defaultRadio: [],
        mandatory: [],
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
      droprow: '',
      sysList: [
        {
          label: '1',
          value: '1'
        }
      ],
      disabledList: []
    }
  },
  computed: {
    projectInfo () {
      return this.$store.state.user.userinfo
    }
  },
  watch: {
    'customname': function (val) {
      this.setForm()
    }
  },
  created () {
    /* eslint-disable */
    this.cloneFieldsForm = _.cloneDeep(this.fieldsfrom)
    this.fieldsfrom.projectId = this.projectInfo.userUseOpenProject.projectId
    this.initScopeValue()
    this.setForm()
  },
  methods: {
    setForm() {
      const that = this
      for (const key in that.fieldsfrom) {
        if (that.customname[key]) {
          this.fieldsfrom[key] = that.customname[key]
        }
      }
    },
    // 初始化单选按钮
    handleCheck(checked, index) {
      this.disabledList[index] = !checked
    },
    // 初始化范围值、是否必填、初始值
    initScopeValue() {
      const that = this
      that.scopeList.forEach((item, index) => {
        that.fieldsfrom.scope[index] = false
        that.fieldsfrom.defaultValues[index] = ''
        that.fieldsfrom.mandatory[index] = false
        that.fieldsfrom.defaultRadio[index] = false
        that.disabledList[index] = true
      })
    },
    // 长度文本框失焦
    setLimitLen() {
      if(Number(this.fieldsfrom.length) > 50) {
        message('warning', '长度最大值为50')
        return true
      }
    },
    // 字段表单提交
    submitfdForm(formName) {
      if (this.setLimitLen()) {
        return
      }
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
            addCustomText(radio).then(res => {
              if (res.code === '200') {
                message('success', res.msg)
                this.fieldsfrom = _.cloneDeep(this.cloneFieldsForm)
                this.$emit('executeQueryCustomList')
              }
            })
          } else {
            updateCustomText(radio).then(res => {
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
