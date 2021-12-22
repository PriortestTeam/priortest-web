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
        <el-form-item label="值来源" prop="valueFrom" class="form-small">
          <el-radio v-model="fieldsfrom.valueFrom" label="1">新值</el-radio>
          <el-radio v-model="fieldsfrom.valueFrom" label="2">系统列表</el-radio>
        </el-form-item>
        <el-form-item
          label="值"
          prop="length"
          class="form-small"
        >
          <el-row>
            <el-col
              :span="16"
            >
              <el-input
                v-model="fieldsfrom.Value"
                size="small"
              />
              <el-select
                v-model="fieldsfrom.sysList"
                size="small"
              >
                <el-option
                  label="value"
                  value="value"
                />
              </el-select>
            </el-col>
            <el-col :span="8">
              <div style="margin-left: 5px">
                <el-button
                  type="primary"
                  round
                  :disabled="!fieldsfrom.Value"
                  @click="addDrop"
                >添加</el-button>
              </div>
            </el-col>
          </el-row>
        </el-form-item>
      </el-form>
    </el-col>
    <el-col :span="4">
      <el-row>
        <el-col :span="16">
          <el-table
            border
            max-height="205"
            :data="fieldsfrom.dropDowns"
            @row-click="dropselect"
          >
            <el-table-column align="center" label="value">
              <template slot-scope="scope">
                {{ scope.row }}
              </template>
            </el-table-column>
          </el-table>
        </el-col>
        <el-col :span="8">
          <div style="marginleft: 5px">
            <el-button
              type="primary"
              round
              :disabled="!droprow"
              @click="delDrop"
            >删除</el-button>
          </div>
        </el-col>
      </el-row>
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
          <div class="ng-input">
            <el-select
              v-model="fieldsfrom.defaultValues[index]"
              size="small"
            >
              <el-option
                v-for="item in sysList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
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
import { addCustomDropDown, updateCustomDropDown } from '@/api/customField'
export default {
  name: 'Radio',
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
  data() {
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
        mandatory: [],
        defaultValues: [],
        dropDowns: [],
        projectId: '',
        fieldName: this.fieldName,
        valueFrom: '1'
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
      droprow: '',
      sysList: [
        {
          label: '1',
          value: '1'
        }
      ]
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
    this.initScopeValue()
  },
  methods: {
    // 初始化范围值、是否必填、初始值
    initScopeValue() {
      const that = this
      that.scopeList.forEach((item, index) => {
        that.fieldsfrom.scope[index] = false
        that.fieldsfrom.defaultValues[index] = ''
        that.fieldsfrom.mandatory[index] = false
      })
    },
    // 字段表单提交
    submitfdForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const radio = this.fieldsfrom
          for (const key in radio) {
            if (key === 'scope' || key === 'mandatory') {
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
            if (i === 'scope' || i === 'mandatory') {
              radio[i] = radio[i].join(',')
            }
          }
          if (!this.fieldsfrom.id) {
            addCustomDropDown(radio).then(res => {
              if (res.code === '200') {
                message('success', res.msg)
                this.fieldsfrom = _.cloneDeep(this.cloneFieldsForm)
                this.$emit('executeQueryCustomList')
              }
            })
          } else {
            updateCustomDropDown(radio).then(res => {
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
      // const obj = {
      //   name: this.fieldsfrom.Value
      // }
      this.fieldsfrom.dropDowns.push(this.fieldsfrom.Value)
      console.log(this.fieldsfrom.dropDowns)
    },
    // 删除drop值
    delDrop() {
      const val = this.droprow
      this.fieldsfrom.dropDowns.filter((item, index) => {
        if (item === val) {
          this.fieldsfrom.dropDowns.splice(index, 1)
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
